export default async function handler(req, res) {
  const BASE_URL = 'https://www.apologeticaccar.com';
  const PROJECT_ID = 'accar-web';
  const DEFAULT_IMG = `${BASE_URL}/assets/img/portada-accar.jpg`;

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

  const optimizarImagen = (rutaRelativa, modo = 'cover') => {
    if (!rutaRelativa) return { url: DEFAULT_IMG, width: '1200', height: '630' };
    const cleanImg = rutaRelativa.replace(/^(\.\.\/|\.\/|\/)+/, '');
    const originalUrl = /^https?:\/\//i.test(cleanImg)
      ? cleanImg
      : `${BASE_URL}/${encodeURI(cleanImg)}`;

    if (modo === 'libro') {
      return {
        url: `https://wsrv.nl/?url=${encodeURIComponent(originalUrl)}&w=600&h=600&fit=contain&bg=09172d&cbg=09172d&output=jpg&q=85&default=${encodeURIComponent(DEFAULT_IMG)}`,
        width: '600',
        height: '600'
      };
    }

    if (modo === 'cuadrado') {
      return {
        url: `https://wsrv.nl/?url=${encodeURIComponent(originalUrl)}&w=600&h=600&fit=cover&a=top&output=jpg&q=82&default=${encodeURIComponent(DEFAULT_IMG)}`,
        width: '600',
        height: '600'
      };
    }

    return {
      url: `https://wsrv.nl/?url=${encodeURIComponent(originalUrl)}&w=1200&h=630&fit=cover&output=jpg&q=82&default=${encodeURIComponent(DEFAULT_IMG)}`,
      width: '1200',
      height: '630'
    };
  };

  // Catálogo completo de secciones de ACCAR (puedes poner tu imagen propia en el campo "imagen")
  const SECCIONES = {
    'apologetica': {
      titulo: 'Apologética Católica | ACCAR',
      descripcion: 'Defensa razonada y fiel de la fe católica desde la Sagrada Escritura, la Tradición y el Magisterio.',
      imagen: ''
    },
    'preguntas-frecuentes': {
      titulo: 'Preguntas Frecuentes | ACCAR',
      descripcion: 'Respuestas claras y fundamentadas a las objeciones más comunes contra la fe católica.',
      imagen: ''
    },
    'formacion': {
      titulo: 'Formación Católica | ACCAR',
      descripcion: 'Doctrina, Sagrada Escritura, Sacramentos, Biblioteca, Apologética Litúrgica y Santoral.',
      imagen: ''
    },
    'doctrina': {
      titulo: 'Doctrina Católica | ACCAR',
      descripcion: 'Exposición clara y rigurosa del depósito de la fe custodiado por la Santa Madre Iglesia.',
      imagen: ''
    },
    'sagrada-escritura': {
      titulo: 'Sagrada Escritura | ACCAR',
      descripcion: 'Estudio bíblico católico, Canon Bíblico, exégesis y directorio de personajes de la Salvación.',
      imagen: ''
    },
    'canon-biblico': {
      titulo: 'Canon Bíblico Católico | ACCAR',
      descripcion: 'Explora los 73 libros de la Sagrada Escritura con ficha técnica, exégesis católica, sentido tipológico y test.',
      imagen: ''
    },
    'directorio-personajes': {
      titulo: 'Directorio de Personajes Bíblicos | ACCAR',
      descripcion: 'Conoce a los patriarcas, profetas, apóstoles y figuras clave de la Historia de la Salvación.',
      imagen: ''
    },
    'sacramentos': {
      titulo: 'Los Siete Sacramentos | ACCAR',
      descripcion: 'Signos eficaces de la gracia instituidos por Nuestro Señor Jesucristo y confiados a su Iglesia.',
      imagen: ''
    },
    'biblioteca': {
      titulo: 'Biblioteca Católica | ACCAR',
      descripcion: 'Documentos del Magisterio, textos clásicos y recursos doctrinales para el estudio de la fe.',
      imagen: ''
    },
    'apologetica-liturgica': {
      titulo: 'Apologética Litúrgica | ACCAR',
      descripcion: 'Custodia litúrgica, norma, sentido sagrado y corrección fiel al rito y al Magisterio de la Iglesia.',
      imagen: ''
    },
    'santoral': {
      titulo: 'Santoral Católico | ACCAR',
      descripcion: 'Martirologio diario, biografías espirituales, lecciones apologéticas y oraciones de los santos.',
      imagen: ''
    },
    'lecturas': {
      titulo: 'Evangelio y Lecturas del Día | ACCAR',
      descripcion: 'Lee el Evangelio, las lecturas y el Salmo responsorial de la Santa Misa de hoy.',
      imagen: ''
    },
    'breviario': {
      titulo: 'Liturgia de las Horas | ACCAR',
      descripcion: 'Únete al rezo oficial de la Iglesia: Oficio de Lectura, Laudes, Tercia, Sexta, Nona, Vísperas y Completas.',
      imagen: ''
    },
    'historia': {
      titulo: 'Historia de la Iglesia | ACCAR',
      descripcion: 'Recorrido histórico por los Papas, Concilios Ecuménicos y Padres de la Iglesia.',
      imagen: ''
    },
    'papas': {
      titulo: 'Lista de los Papas | ACCAR',
      descripcion: 'Sucesión apostólica ininterrumpida desde San Pedro hasta nuestros días.',
      imagen: ''
    },
    'concilios': {
      titulo: 'Concilios Ecuménicos | ACCAR',
      descripcion: 'Los grandes concilios donde el Magisterio definió y custodió los dogmas de la fe católica.',
      imagen: ''
    },
    'padres-iglesia': {
      titulo: 'Padres de la Iglesia | ACCAR',
      descripcion: 'Testigos privilegiados de la Tradición Apostólica y pilares de la teología católica.',
      imagen: ''
    },
    'adoracion': {
      titulo: 'Adoración al Santísimo Sacramento | ACCAR',
      descripcion: 'Permanece en presencia de Nuestro Señor Jesucristo y une tu oración a la adoración perpetua de la Iglesia.',
      imagen: ''
    },
    'peliculas': {
      titulo: 'Películas Católicas | ACCAR',
      descripcion: 'Selección multimedia de cine católico, vidas de santos y formación audiovisual.',
      imagen: ''
    },
    'actualidad': {
      titulo: 'Actualidad de la Iglesia | ACCAR',
      descripcion: 'Noticias eclesiales, actividad del Santo Padre y cobertura oficial de la Santa Sede.',
      imagen: ''
    },
    'contacto': {
      titulo: 'Contacto | ACCAR',
      descripcion: 'Comunícate con el equipo de Apologética Católica Cristiana Apostólica Romana.',
      imagen: ''
    }
  };

  const tipo = String(req.query.tipo || 'seccion').toLowerCase();
  const rawId =
    req.query.id ||
    req.query.ver ||
    req.query.libro ||
    req.query.personaje ||
    req.query.santo ||
    req.query.vista ||
    '';

  let title = 'ACCAR - Apologética Católica';
  let description = 'Defensa de la fe católica, Santoral diario, Evangelio y Liturgia de las Horas.';
  let imgInfo = { url: DEFAULT_IMG, width: '1200', height: '630' };
  let shareUrl = `${BASE_URL}/`;
  let redirectUrl = `${BASE_URL}/`;

  try {
    if (tipo === 'libro') {
      const id = String(rawId).replace(/[^a-zA-Z0-9_-]/g, '');
      if (id) {
        shareUrl = `${BASE_URL}/libro/${encodeURIComponent(id)}`;
        redirectUrl = `${BASE_URL}/?libro=${encodeURIComponent(id)}`;
        imgInfo = optimizarImagen(`assets/img/libro_${id}.png`, 'libro');

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
      const id = String(rawId).replace(/[^a-zA-Z0-9_-]/g, '');
      if (id) {
        shareUrl = `${BASE_URL}/personaje/${encodeURIComponent(id)}`;
        redirectUrl = `${BASE_URL}/?personaje=${encodeURIComponent(id)}`;
        imgInfo = optimizarImagen(`assets/img/${id}.png`, 'cuadrado');

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
      const id = String(rawId).replace(/[^a-zA-Z0-9_-]/g, '');
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
          if (imagen) imgInfo = optimizarImagen(imagen, 'cuadrado');
        }
      }
    } else if (tipo === 'vista') {
      const vistaLimpia = String(rawId).replace(/^\/+/, '');
      if (/^views\/[a-zA-Z0-9/_-]+\.html$/.test(vistaLimpia)) {
        const nombreArchivo = vistaLimpia.split('/').pop().replace('.html', '');
        const tituloAuto = nombreArchivo.replace(/[-_]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        title = `${tituloAuto} | ACCAR`;
        shareUrl = `${BASE_URL}/?vista=${encodeURIComponent(vistaLimpia)}`;
        redirectUrl = shareUrl;
      }
    } else {
      const slug = String(rawId).replace(/[^a-zA-Z0-9_-]/g, '').toLowerCase();
      const sec = SECCIONES[slug];
      if (sec) {
        title = sec.titulo;
        description = sec.descripcion;
        imgInfo = optimizarImagen(sec.imagen, 'cover');
        shareUrl = `${BASE_URL}/ver/${encodeURIComponent(slug)}`;
        redirectUrl = `${BASE_URL}/?ver=${encodeURIComponent(slug)}`;
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

  <meta property="og:type" content="article">
  <meta property="og:site_name" content="ACCAR - Apologética Católica">
  <meta property="og:url" content="${escapeHtml(shareUrl)}">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:image" content="${escapeHtml(imgInfo.url)}">
  <meta property="og:image:secure_url" content="${escapeHtml(imgInfo.url)}">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:width" content="${escapeHtml(imgInfo.width)}">
  <meta property="og:image:height" content="${escapeHtml(imgInfo.height)}">

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
  <script>window.location.replace(${JSON.stringify(redirectUrl)});</script>
</body>
</html>`);
}