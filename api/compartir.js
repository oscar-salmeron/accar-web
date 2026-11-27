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

  const construirOgImagen = (rutaRelativa, modo = 'cover') => {
    if (!rutaRelativa) {
      return { url: PORTADA_OFICIAL, width: '1200', height: '630' };
    }

    const limpia = normalizarRutaRecurso(rutaRelativa);
    if (!limpia || limpia === 'assets/img/portada-accar.jpg') {
      return { url: PORTADA_OFICIAL, width: '1200', height: '630' };
    }

    const originalUrl = /^https?:\/\//i.test(limpia)
      ? limpia
      : `${BASE_URL}/${encodeURI(limpia)}`;

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

  const inspeccionarVistaHTML = async (vistaRelativa) => {
    try {
      const limpia = vistaRelativa.replace(/^\/+/, '');
      const r = await fetch(`${BASE_URL}/${encodeURI(limpia)}`);
      if (!r.ok) return { titulo: '', descripcion: '', imagen: '', modo: '' };

      const html = await r.text();
      if (!html || html.includes('id="spa-content"')) {
        return { titulo: '', descripcion: '', imagen: '', modo: '' };
      }

      const sinScript = html
        .replace(/<script[\s\S]*?<\/script>/gi, ' ')
        .replace(/<style[\s\S]*?<\/style>/gi, ' ');

      let titulo = '';
      const hMatch = sinScript.match(/<h[12][^>]*>([\s\S]*?)<\/h[12]>/i);
      if (hMatch && hMatch[1]) {
        const t = limpiarTexto(hMatch[1]);
        if (t && t.length > 2 && !/cargando|abriendo/i.test(t)) {
          titulo = t;
        }
      }

      let descripcion = '';
      const pMatches = [...sinScript.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)];
      for (const m of pMatches) {
        const p = limpiarTexto(m[1]);
        if (p && p.length >= 28 && !/cargando|conectando|abriendo/i.test(p)) {
          descripcion = p;
          break;
        }
      }

      let imagenHallada = '';
      const imgMatches = [...sinScript.matchAll(/<img[^>]*\ssrc=["']([^"']+)["'][^>]*>/gi)];
      for (const m of imgMatches) {
        const s = (m[1] || '').trim();
        if (!s || /logo-accar|escudo_santa_sede|watermark|placeholder|placehold\.co/i.test(s)) continue;
        imagenHallada = normalizarRutaRecurso(s, limpia);
        if (imagenHallada) break;
      }

      if (!imagenHallada) {
        const ytMatch = html.match(/(?:youtube\.com\/embed\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
        if (ytMatch && ytMatch[1]) {
          imagenHallada = `https://i.ytimg.com/vi/${ytMatch[1]}/hqdefault.jpg`;
        }
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
      fija: true
    },
    'preguntas-frecuentes': {
      titulo: 'Preguntas Frecuentes | ACCAR',
      descripcion: 'Respuestas claras y fundamentadas a las objeciones más comunes contra la fe católica.',
      vista: 'views/preguntas-frecuentes.html',
      imagen: 'assets/img/bg_apologetica.webp',
      modo: 'cover',
      fija: true
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
      fija: true
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
      fija: true
    },
    'biblioteca': {
      titulo: 'Biblioteca Católica | ACCAR',
      descripcion: 'Documentos del Magisterio, textos clásicos y recursos doctrinales para el estudio de la fe.',
      vista: 'views/biblioteca.html',
      imagen: 'assets/img/icono_biblioteca.png',
      modo: 'medallon',
      fija: true
    },
    'apologetica-liturgica': {
      titulo: 'Apologética Litúrgica | ACCAR',
      descripcion: 'Custodia litúrgica, norma, sentido sagrado y corrección fiel al rito y al Magisterio de la Iglesia.',
      vista: 'views/formacion-apologetica-liturgica.html',
      imagen: 'assets/img/icono_apologetica_liturgica.png',
      modo: 'medallon',
      fija: true
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
      fija: true
    },
    'papas': {
      titulo: 'Lista de los Papas | ACCAR',
      descripcion: 'Sucesión apostólica ininterrumpida desde San Pedro hasta nuestros días.',
      vista: 'views/historia-lista-de-papas.html',
      imagen: 'assets/img/01_s_pietro.png',
      modo: 'medallon',
      fija: true
    },
    'concilios': {
      titulo: 'Concilios Ecuménicos | ACCAR',
      descripcion: 'Los grandes concilios donde el Magisterio definió y custodió los dogmas de la fe católica.',
      vista: 'views/historia-lista-de-concilios.html',
      imagen: 'assets/img/portada-accar.jpg',
      modo: 'cover',
      fija: true
    },
    'padres-iglesia': {
      titulo: 'Padres de la Iglesia | ACCAR',
      descripcion: 'Testigos privilegiados de la Tradición Apostólica y pilares de la teología católica.',
      vista: 'views/historia-lista-de-padres.html',
      imagen: 'assets/img/portada-accar.jpg',
      modo: 'cover',
      fija: true
    },
    'adoracion': {
      titulo: 'Adoración al Santísimo Sacramento | ACCAR',
      descripcion: 'Permanece en presencia de Nuestro Señor Jesucristo y une tu oración a la adoración perpetua de la Iglesia.',
      vista: 'views/adoracion.html',
      imagen: 'https://i.ytimg.com/vi/Orc7lHFSqNY/hqdefault.jpg',
      modo: 'cover',
      fija: true
    },
    'peliculas': {
      titulo: 'Películas Católicas | ACCAR',
      descripcion: 'Selección multimedia de cine católico, vidas de santos y formación audiovisual.',
      vista: 'views/multimedia/peliculas.html',
      imagen: 'assets/img/portada-accar.jpg',
      modo: 'cover',
      fija: true
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
        imgInfo = construirOgImagen(`assets/img/libro_${id}.png`, 'libro');

        const docRes = await fetch(`https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/canon_biblico/libros/registros/${encodeURIComponent(id)}`);
        if (docRes.ok) {
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
        imgInfo = construirOgImagen(`assets/img/${id}.png`, 'cuadrado');

        const docRes = await fetch(`https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/directorio_biblico/personajes/registros/${encodeURIComponent(id)}`);
        if (docRes.ok) {
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

        const docRes = await fetch(`https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/santos/${encodeURIComponent(id)}`);
        if (docRes.ok) {
          const f = (await docRes.json()).fields || {};
          const nombre = f.nombre_completo?.stringValue || '';
          const bio = f.biografia?.stringValue || '';
          const patronazgo = f.patronazgo?.stringValue || '';
          const imagen = f.imagen?.stringValue || '';
          if (nombre) title = `${nombre} | ACCAR`;
          const descTexto = limpiarTexto(bio || patronazgo);
          if (descTexto) description = recortar(descTexto);
          if (imagen) imgInfo = construirOgImagen(normalizarRutaRecurso(imagen), 'cuadrado');
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
          imgInfo = construirOgImagen(infoVista.imagen, infoVista.modo || 'cuadrado');
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
        imgInfo = construirOgImagen(sec.imagen, sec.modo || 'cover');
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
</head>
<body style="margin:0;background:#09172d;color:#f8efd3;font-family:Georgia,serif;display:flex;align-items:center;justify-content:center;min-height:100vh;text-align:center;padding:24px;">
  <div>
    <p style="color:#d4af37;font-size:18px;margin-bottom:12px;">Cargando contenido de ACCAR...</p>
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