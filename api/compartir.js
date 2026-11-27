import * as cheerio from 'cheerio';

export default async function handler(req, res) {
  const BASE_URL = 'https://www.apologeticaccar.com';
  const PROJECT_ID = 'accar-web';
  const PORTADA_OFICIAL = `${BASE_URL}/assets/img/portada-accar.jpg`;

  const escapeHtml = (str = '') =>
    String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

  const limpiarTexto = (html = '') =>
    String(html)
      .replace(/<br\s*\/?>/gi, ' ')
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim();

  const recortar = (texto = '', max = 180) =>
    texto.length > max ? `${texto.slice(0, max - 3).replace(/\s+\S*$/, '')}...` : texto;

  const fetchConTiempo = async (url, opciones = {}, ms = 1800) => {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), ms);
    try {
      return await fetch(url, { ...opciones, signal: ctrl.signal });
    } finally {
      clearTimeout(timer);
    }
  };

  const normalizarRutaRecurso = (rawSrc = '', vistaRelativa = '') => {
    const src = String(rawSrc || '').trim();
    if (!src || src.startsWith('data:')) return '';
    if (/^https?:\/\//i.test(src)) return src;

    let sinSubidas = src.replace(/^(\.\.\/|\.\/|\/)+/, '');
    try {
      sinSubidas = decodeURI(sinSubidas);
    } catch (_) {}

    if (/^(assets|media|bodega|IMG)\//i.test(sinSubidas)) {
      return sinSubidas;
    }

    const carpetaVista = vistaRelativa.includes('/')
      ? vistaRelativa.slice(0, vistaRelativa.lastIndexOf('/'))
      : '';
    return carpetaVista ? `${carpetaVista}/${sinSubidas}` : sinSubidas;
  };

  const elegirModoPorImagen = (src = '', vistaRelativa = '') => {
    const bajo = `${src} ${vistaRelativa}`.toLowerCase();
    if (/(icono|logo-accar|escudo_santa_sede)/.test(bajo)) return 'medallon';
    if (/(libro_|portada_canon|portada_antiguo|portada_nuevo)/.test(bajo)) return 'libro';
    if (/(santos\/|directorio_padres|papas|_s_|personaje)/.test(bajo)) return 'cuadrado';
    if (/\.(webp|jpg|jpeg)(\?|$)/.test(src.toLowerCase()) || /ytimg\.com/.test(bajo)) return 'cover';
    return 'cuadrado';
  };

  // Verifica que la imagen exista en el servidor y la entrega en formato JPEG ligero (< 100 KB) universal
  const prepararImagenOG = async (rutaRelativa, modo = 'cover') => {
    const respaldo = { url: PORTADA_OFICIAL, width: '1200', height: '630' };
    if (!rutaRelativa) return respaldo;

    const limpia = normalizarRutaRecurso(rutaRelativa);
    if (!limpia || limpia === 'assets/img/portada-accar.jpg') return respaldo;

    const originalUrl = /^https?:\/\//i.test(limpia)
      ? limpia
      : `${BASE_URL}/${encodeURI(limpia)}`;

    try {
      const check = await fetchConTiempo(originalUrl, { method: 'HEAD' }, 1200);
      if (!check.ok) return respaldo;
    } catch (_) {
      return respaldo;
    }

    if (modo === 'libro') {
      return {
        url: `https://wsrv.nl/?url=${encodeURIComponent(originalUrl)}&w=600&h=600&fit=contain&bg=061024&output=jpg&q=80`,
        width: '600',
        height: '600'
      };
    }

    if (modo === 'cuadrado' || modo === 'medallon') {
      return {
        url: `https://wsrv.nl/?url=${encodeURIComponent(originalUrl)}&w=600&h=600&fit=cover&a=top&bg=061024&output=jpg&q=80`,
        width: '600',
        height: '600'
      };
    }

    return {
      url: `https://wsrv.nl/?url=${encodeURIComponent(originalUrl)}&w=900&h=472&fit=cover&bg=061024&output=jpg&q=78`,
      width: '900',
      height: '472'
    };
  };

  // Extrae título, resumen e ilustración real de cualquier archivo de vista HTML del portal
  const inspeccionarVistaHTML = async (vistaRelativa) => {
    try {
      const limpia = vistaRelativa.replace(/^\/+/, '');
      const r = await fetchConTiempo(`${BASE_URL}/${encodeURI(limpia)}`, {}, 1400);
      if (!r.ok) return { titulo: '', descripcion: '', imagen: '', modo: '' };

      const html = await r.text();
      if (!html || html.includes('id="spa-content"')) {
        return { titulo: '', descripcion: '', imagen: '', modo: '' };
      }

      const $ = cheerio.load(html);

      let titulo = '';
      $('h1, h2').each((_, el) => {
        if (titulo) return;
        const t = limpiarTexto($(el).text());
        if (t && t.length > 2 && !/cargando|abriendo/i.test(t)) {
          titulo = t;
        }
      });

      let descripcion = '';
      $('p').each((_, el) => {
        if (descripcion) return;
        const p = limpiarTexto($(el).text());
        if (p && p.length >= 28 && !/cargando|conectando|abriendo/i.test(p)) {
          descripcion = p;
        }
      });

      let imagenHallada = '';

      $('img').each((_, el) => {
        if (imagenHallada) return;
        const s = ($(el).attr('src') || '').trim();
        if (!s || /logo-accar|escudo_santa_sede|watermark|placeholder|placehold\.co/i.test(s)) return;
        imagenHallada = normalizarRutaRecurso(s, limpia);
      });

      if (!imagenHallada) {
        $('video[poster]').each((_, el) => {
          if (imagenHallada) return;
          const p = ($(el).attr('poster') || '').trim();
          if (p) imagenHallada = normalizarRutaRecurso(p, limpia);
        });
      }

      if (!imagenHallada) {
        const cssTotal = [
          $('style').text(),
          ...$('[style]').map((_, el) => $(el).attr('style') || '').get()
        ].join(' ');

        const regexUrl = /url\(\s*['"]?([^'")]+)['"]?\s*\)/gi;
        let match;
        while ((match = regexUrl.exec(cssTotal)) !== null) {
          const candidato = (match[1] || '').trim();
          if (
            candidato &&
            !/watermark|fonts|\.woff|\.ttf|\.svg|data:/i.test(candidato) &&
            /\.(png|jpg|jpeg|webp)/i.test(candidato)
          ) {
            imagenHallada = normalizarRutaRecurso(candidato, limpia);
            break;
          }
        }
      }

      if (!imagenHallada) {
        $('iframe[src]').each((_, el) => {
          if (imagenHallada) return;
          const iframeSrc = $(el).attr('src') || '';
          const ytMatch = iframeSrc.match(/(?:youtube\.com\/embed\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
          if (ytMatch && ytMatch[1]) {
            imagenHallada = `https://i.ytimg.com/vi/${ytMatch[1]}/hqdefault.jpg`;
          }
        });
      }

      const modo = imagenHallada ? elegirModoPorImagen(imagenHallada, limpia) : '';
      return { titulo, descripcion, imagen: imagenHallada, modo };
    } catch (_) {
      return { titulo: '', descripcion: '', imagen: '', modo: '' };
    }
  };

  const SECCIONES = {
    'inicio': {
      titulo: 'ACCAR - Apologética Católica Cristiana Apostólica Romana',
      descripcion: 'Defensa y formación en la fe católica en fidelidad a la Sagrada Escritura, la Tradición y el Magisterio.',
      vista: 'views/inicio.html',
      imagen: 'assets/img/portada-accar.jpg',
      modo: 'cover',
      fija: true
    },
    'apologetica': {
      titulo: 'Apologética Católica | ACCAR',
      descripcion: 'Defensa razonada y fiel de la fe católica desde la Sagrada Escritura, la Tradición y el Magisterio.',
      vista: 'views/apologetica.html',
      imagen: 'assets/img/bg_apologetica.webp',
      modo: 'cover',
      fija: false
    },
    'preguntas-frecuentes': {
      titulo: 'Preguntas Frecuentes | ACCAR',
      descripcion: 'Respuestas claras y fundamentadas a las objeciones más comunes contra la fe católica.',
      vista: 'views/preguntas-frecuentes.html',
      imagen: 'assets/img/bg_apologetica.webp',
      modo: 'cover',
      fija: false
    },
    'formacion': {
      titulo: 'Formación Católica | ACCAR',
      descripcion: 'Doctrina, Sagrada Escritura, Sacramentos, Biblioteca, Apologética Litúrgica y Santoral.',
      vista: 'views/formacion.html',
      imagen: 'assets/img/portada-accar.jpg',
      modo: 'cover',
      fija: true
    },
    'doctrina': {
      titulo: 'Doctrina Católica | ACCAR',
      descripcion: 'Exposición clara y rigurosa del depósito de la fe custodiado por la Santa Madre Iglesia.',
      vista: 'views/doctrina.html',
      imagen: 'assets/img/icono_doctrina.png',
      modo: 'medallon',
      fija: false
    },
    'sagrada-escritura': {
      titulo: 'Sagrada Escritura | ACCAR',
      descripcion: 'Estudio bíblico católico, Canon Bíblico de 73 libros, exégesis y directorio de personajes de la Salvación.',
      vista: 'views/sagrada-escritura.html',
      imagen: 'assets/img/icono_escrituras.png',
      modo: 'medallon',
      fija: true
    },
    'canon-biblico': {
      titulo: 'Canon Bíblico Católico | ACCAR',
      descripcion: 'Explora los 73 libros de la Sagrada Escritura con ficha técnica, exégesis católica, sentido tipológico y test.',
      vista: 'views/canon_biblico/canon.html',
      imagen: 'assets/img/icono-canon.png',
      modo: 'medallon',
      fija: true
    },
    'directorio-personajes': {
      titulo: 'Directorio de Personajes Bíblicos | ACCAR',
      descripcion: 'Conoce a los patriarcas, profetas, apóstoles y figuras clave de la Historia de la Salvación.',
      vista: 'views/directorio_biblico/directorio_personajes.html',
      imagen: 'assets/img/icono-personajes.png',
      modo: 'medallon',
      fija: true
    },
    'sacramentos': {
      titulo: 'Los Siete Sacramentos | ACCAR',
      descripcion: 'Signos eficaces de la gracia instituidos por Nuestro Señor Jesucristo y confiados a su Iglesia.',
      vista: 'views/sacramentos.html',
      imagen: 'assets/img/icono_sacramentos.png',
      modo: 'medallon',
      fija: false
    },
    'biblioteca': {
      titulo: 'Biblioteca Católica | ACCAR',
      descripcion: 'Documentos del Magisterio, textos clásicos y recursos doctrinales para el estudio de la fe.',
      vista: 'views/biblioteca.html',
      imagen: 'assets/img/icono_biblioteca.png',
      modo: 'medallon',
      fija: false
    },
    'apologetica-liturgica': {
      titulo: 'Apologética Litúrgica | ACCAR',
      descripcion: 'Custodia litúrgica, norma, sentido sagrado y corrección fiel al rito y al Magisterio de la Iglesia.',
      vista: 'views/formacion-apologetica-liturgica.html',
      imagen: 'assets/img/icono_apologetica_liturgica.png',
      modo: 'medallon',
      fija: false
    },
    'santoral': {
      titulo: 'Santoral Católico | ACCAR',
      descripcion: 'Martirologio diario, biografías espirituales, lecciones apologéticas y oraciones de los santos.',
      vista: 'views/santos/inicio-santos.html',
      imagen: 'assets/img/icono_santoral.png',
      modo: 'medallon',
      fija: true
    },
    'lecturas': {
      titulo: 'Evangelio y Lecturas del Día | ACCAR',
      descripcion: 'Lee el Evangelio, las lecturas y el Salmo responsorial de la Santa Misa de hoy.',
      vista: 'views/inicio-lecturas.html',
      imagen: 'assets/img/portada-accar.jpg',
      modo: 'cover',
      fija: true
    },
    'breviario': {
      titulo: 'Liturgia de las Horas | ACCAR',
      descripcion: 'Únete al rezo oficial de la Iglesia: Oficio de Lectura, Laudes, Tercia, Sexta, Nona, Vísperas y Completas.',
      vista: 'views/inicio-breviario.html',
      imagen: 'assets/img/portada-accar.jpg',
      modo: 'cover',
      fija: true
    },
    'historia': {
      titulo: 'Historia de la Iglesia | ACCAR',
      descripcion: 'Recorrido histórico por los Papas, Concilios Ecuménicos y Padres de la Iglesia.',
      vista: 'views/historia.html',
      imagen: 'assets/img/icono-historia.png',
      modo: 'medallon',
      fija: false
    },
    'papas': {
      titulo: 'Lista de los Papas | ACCAR',
      descripcion: 'Sucesión apostólica ininterrumpida desde San Pedro hasta nuestros días.',
      vista: 'views/historia-lista-de-papas.html',
      imagen: 'assets/img/01_s_pietro.png',
      modo: 'medallon',
      fija: false
    },
    'concilios': {
      titulo: 'Concilios Ecuménicos | ACCAR',
      descripcion: 'Los grandes concilios donde el Magisterio definió y custodió los dogmas de la fe católica.',
      vista: 'views/historia-lista-de-concilios.html',
      imagen: 'assets/img/portada-accar.jpg',
      modo: 'cover',
      fija: false
    },
    'padres-iglesia': {
      titulo: 'Padres de la Iglesia | ACCAR',
      descripcion: 'Testigos privilegiados de la Tradición Apostólica y pilares de la teología católica.',
      vista: 'views/historia-lista-de-padres.html',
      imagen: 'assets/img/portada-accar.jpg',
      modo: 'cover',
      fija: false
    },
    'adoracion': {
      titulo: 'Adoración al Santísimo Sacramento | ACCAR',
      descripcion: 'Permanece en presencia de Nuestro Señor Jesucristo y une tu oración a la adoración perpetua de la Iglesia.',
      vista: 'views/adoracion.html',
      imagen: 'assets/img/portada-accar.jpg',
      modo: 'cover',
      fija: false
    },
    'peliculas': {
      titulo: 'Películas Católicas | ACCAR',
      descripcion: 'Selección multimedia de cine católico, vidas de santos y formación audiovisual.',
      vista: 'views/multimedia/peliculas.html',
      imagen: 'assets/img/portada-accar.jpg',
      modo: 'cover',
      fija: false
    },
    'actualidad': {
      titulo: 'Actualidad de la Iglesia | ACCAR',
      descripcion: 'Noticias eclesiales, actividad del Santo Padre y cobertura oficial de la Santa Sede.',
      vista: 'views/actualidad.html',
      imagen: 'assets/img/footer_bg_iglesia.webp',
      modo: 'cover',
      fija: true
    },
    'contacto': {
      titulo: 'Contacto | ACCAR',
      descripcion: 'Comunícate con el equipo de Apologética Católica Cristiana Apostólica Romana.',
      vista: 'views/contacto.html',
      imagen: 'assets/img/portada-accar.jpg',
      modo: 'cover',
      fija: true
    },
    'construccion': {
      titulo: 'Sección en Preparación | ACCAR',
      descripcion: 'Defensa y formación en la fe católica en fidelidad a la Escritura, la Tradición y el Magisterio.',
      vista: 'views/construccion.html',
      imagen: 'assets/img/portada-accar.jpg',
      modo: 'cover',
      fija: true
    }
  };

  const tipo = String(req.query.tipo || 'seccion').toLowerCase();
  const paramCrudo =
    req.query.id ||
    req.query.ver ||
    req.query.libro ||
    req.query.personaje ||
    req.query.santo ||
    req.query.vista ||
    '';
  const rawId = Array.isArray(paramCrudo) ? paramCrudo.join('/') : String(paramCrudo);

  let title = 'ACCAR - Apologética Católica';
  let description = 'Defensa de la fe católica, Santoral diario, Evangelio y Liturgia de las Horas.';
  let imgInfo = { url: PORTADA_OFICIAL, width: '1200', height: '630' };
  let shareUrl = `${BASE_URL}/`;
  let redirectUrl = `${BASE_URL}/`;

  try {
    if (tipo === 'libro') {
      const id = rawId.replace(/[^a-zA-Z0-9_-]/g, '');
      if (id) {
        shareUrl = `${BASE_URL}/libro/${encodeURIComponent(id)}`;
        redirectUrl = `${BASE_URL}/?libro=${encodeURIComponent(id)}`;

        const [docRes, imgCalc] = await Promise.all([
          fetchConTiempo(`https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/canon_biblico/libros/registros/${encodeURIComponent(id)}`),
          prepararImagenOG(`assets/img/libro_${id}.png`, 'libro')
        ]);

        imgInfo = imgCalc;
        if (docRes && docRes.ok) {
          const f = (await docRes.json()).fields || {};
          const tituloLibro = f.titulo?.stringValue || '';
          const subtitulo = f.subtitulo_corto?.stringValue || '';
          const contexto = f.contexto_proposito?.stringValue || '';
          if (tituloLibro) title = `${tituloLibro} | Canon Bíblico - ACCAR`;
          const descTexto = limpiarTexto(subtitulo || contexto);
          if (descTexto) description = recortar(descTexto);
        }
      }
    } else if (tipo === 'personaje') {
      const id = rawId.replace(/[^a-zA-Z0-9_-]/g, '');
      if (id) {
        shareUrl = `${BASE_URL}/personaje/${encodeURIComponent(id)}`;
        redirectUrl = `${BASE_URL}/?personaje=${encodeURIComponent(id)}`;

        const [docRes, imgCalc] = await Promise.all([
          fetchConTiempo(`https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/directorio_biblico/personajes/registros/${encodeURIComponent(id)}`),
          prepararImagenOG(`assets/img/${id}.png`, 'cuadrado')
        ]);

        imgInfo = imgCalc;
        if (docRes && docRes.ok) {
          const f = (await docRes.json()).fields || {};
          const nombre = f.titulo?.stringValue || f.nombre?.stringValue || '';
          const subtitulo = f.subtitulo?.stringValue || '';
          const relato = f.relato_biblico?.stringValue || '';
          if (nombre) title = `${nombre} | Directorio Bíblico - ACCAR`;
          const descTexto = limpiarTexto(subtitulo || relato);
          if (descTexto) description = recortar(descTexto);
        }
      }
    } else if (tipo === 'santo') {
      const id = rawId.replace(/[^a-zA-Z0-9_-]/g, '');
      if (id) {
        shareUrl = `${BASE_URL}/santo/${encodeURIComponent(id)}`;
        redirectUrl = `${BASE_URL}/?santo=${encodeURIComponent(id)}`;

        const docRes = await fetchConTiempo(`https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/santos/${encodeURIComponent(id)}`);
        if (docRes && docRes.ok) {
          const f = (await docRes.json()).fields || {};
          const nombre = f.nombre_completo?.stringValue || '';
          const bio = f.biografia?.stringValue || '';
          const patronazgo = f.patronazgo?.stringValue || '';
          const imagen = f.imagen?.stringValue || '';
          if (nombre) title = `${nombre} | ACCAR`;
          const descTexto = limpiarTexto(bio || patronazgo);
          if (descTexto) description = recortar(descTexto);
          imgInfo = await prepararImagenOG(imagen || 'assets/img/icono_santoral.png', 'cuadrado');
        }
      }
    } else if (tipo === 'vista') {
      let rutaExtraida = rawId.replace(/,/g, '/').replace(/^\/+/, '');
      if (!rutaExtraida && req.url) {
        const mUrl = req.url.match(/\/vista\/([^?]+)/);
        if (mUrl && mUrl[1]) rutaExtraida = decodeURIComponent(mUrl[1]);
      }
      rutaExtraida = rutaExtraida.replace(/^vista\//, '');
      if (rutaExtraida && !rutaExtraida.startsWith('views/')) {
        rutaExtraida = `views/${rutaExtraida}`;
      }
      if (rutaExtraida && !rutaExtraida.endsWith('.html')) {
        rutaExtraida = `${rutaExtraida}.html`;
      }

      if (/^views\/[a-zA-Z0-9/_-]+\.html$/.test(rutaExtraida)) {
        const nombreArchivo = rutaExtraida.split('/').pop().replace('.html', '');
        const tituloAuto = nombreArchivo.replace(/[-_]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        const infoVista = await inspeccionarVistaHTML(rutaExtraida);

        title = `${infoVista.titulo || tituloAuto} | ACCAR`;
        if (infoVista.descripcion) description = recortar(infoVista.descripcion);
        if (infoVista.imagen) {
          imgInfo = await prepararImagenOG(infoVista.imagen, infoVista.modo || 'cuadrado');
        }
        shareUrl = `${BASE_URL}/vista/${rutaExtraida}`;
        redirectUrl = `${BASE_URL}/?vista=${encodeURIComponent(rutaExtraida)}`;
      }
    } else {
      const slug = rawId.replace(/[^a-zA-Z0-9_-]/g, '').toLowerCase() || 'inicio';
      const sec = SECCIONES[slug];
      if (sec) {
        title = sec.titulo;
        description = sec.descripcion;

        let imgElegida = sec.imagen;
        let modoElegido = sec.modo || 'cover';

        if (!sec.fija && sec.vista) {
          const infoVista = await inspeccionarVistaHTML(sec.vista);
          if (infoVista.imagen) {
            imgElegida = infoVista.imagen;
            modoElegido = infoVista.modo || modoElegido;
          }
          if (!description && infoVista.descripcion) {
            description = recortar(infoVista.descripcion);
          }
        }

        imgInfo = await prepararImagenOG(imgElegida, modoElegido);
        shareUrl = `${BASE_URL}/ver/${encodeURIComponent(slug)}`;
        redirectUrl = slug === 'inicio' ? `${BASE_URL}/` : `${BASE_URL}/?ver=${encodeURIComponent(slug)}`;
      }
    }
  } catch (error) {
    console.error('Error en api/compartir.js:', error.message);
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');

  res.status(200).send(`<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <link rel="canonical" href="${escapeHtml(shareUrl)}">

  <meta property="og:locale" content="es_ES">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="ACCAR - Apologética Católica">
  <meta property="og:url" content="${escapeHtml(shareUrl)}">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:image" content="${escapeHtml(imgInfo.url)}">
  <meta property="og:image:secure_url" content="${escapeHtml(imgInfo.url)}">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:width" content="${escapeHtml(imgInfo.width)}">
  <meta property="og:image:height" content="${escapeHtml(imgInfo.height)}">
  <meta property="og:image:alt" content="${escapeHtml(title)}">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="${escapeHtml(imgInfo.url)}">

  <link rel="icon" href="${BASE_URL}/assets/img/logo-accar.png">
  <link rel="apple-touch-icon" href="${BASE_URL}/assets/img/logo-accar.png">
</head>
<body style="margin:0;background:#061024;color:#f8efd3;font-family:Georgia,serif;display:flex;align-items:center;justify-content:center;min-height:100vh;text-align:center;padding:24px;">
  <div>
    <p style="color:#d4af37;font-size:18px;margin-bottom:12px;">✠ Abriendo contenido de ACCAR...</p>
    <p><a href="${escapeHtml(redirectUrl)}" style="color:#f8efd3;">Haz clic aquí si no eres redirigido automáticamente</a></p>
  </div>
  <script>
    (function(){
      var destino = ${JSON.stringify(redirectUrl)};
      if (document.visibilityState === 'hidden') {
        document.addEventListener('visibilitychange', function() {
          if (document.visibilityState === 'visible') window.location.replace(destino);
        });
        setTimeout(function() { window.location.replace(destino); }, 2800);
      } else {
        window.location.replace(destino);
      }
    })();
  </script>
</body>
</html>`);
}