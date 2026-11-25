export default async function handler(req, res) {
  const BASE_URL = 'https://www.apologeticaccar.com';
  const PROJECT_ID = 'accar-web';

  const rawId = req.query.id || '';
  const id = String(rawId).replace(/[^a-zA-Z0-9_-]/g, '');

  if (!id) {
    res.writeHead(302, { Location: `${BASE_URL}/` });
    res.end();
    return;
  }

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

  let title = 'Santoral Católico | ACCAR';
  let description = 'Conoce la vida, lecciones apologéticas, meditación y oración del santo del día en ACCAR.';
  let imageUrl = `${BASE_URL}/assets/img/portada-accar.jpg`;
  let imageType = 'image/jpeg';
  let imageWidth = '1200';
  let imageHeight = '630';

  try {
    const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/santos/${encodeURIComponent(id)}`;
    const response = await fetch(firestoreUrl);

    if (response.ok) {
      const docData = await response.json();
      const fields = docData.fields || {};

      const nombre = fields.nombre_completo?.stringValue || '';
      const patronazgo = fields.patronazgo?.stringValue || '';
      const biografia = fields.biografia?.stringValue || '';
      const imagen = fields.imagen?.stringValue || '';

      if (nombre) {
        title = `${nombre} | ACCAR`;
      }

      const bioLimpia = limpiarTexto(biografia);
      const patronazgoLimpio = limpiarTexto(patronazgo);

      if (bioLimpia) {
        description = bioLimpia.length > 180
          ? `${bioLimpia.slice(0, 177).replace(/\s+\S*$/, '')}...`
          : bioLimpia;
      } else if (patronazgoLimpio) {
        description = patronazgoLimpio;
      }

      if (imagen) {
        const cleanImg = imagen.replace(/^(\.\.\/|\.\/|\/)+/, '');
        const originalUrl = /^https?:\/\//i.test(cleanImg)
          ? cleanImg
          : `${BASE_URL}/${encodeURI(cleanImg)}`;

        // Convierte cualquier PNG pesado a JPG ligero (~60 KB) encuadrado desde arriba para WhatsApp
        imageUrl = `https://wsrv.nl/?url=${encodeURIComponent(originalUrl)}&w=600&h=600&fit=cover&a=top&output=jpg&q=80`;
        imageType = 'image/jpeg';
        imageWidth = '600';
        imageHeight = '600';
      }
    }
  } catch (error) {
    console.error('Error obteniendo santo para Open Graph:', error.message);
  }

  const shareUrl = `${BASE_URL}/santo/${encodeURIComponent(id)}`;
  const redirectUrl = `${BASE_URL}/?santo=${encodeURIComponent(id)}`;

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
  <meta property="og:image" content="${escapeHtml(imageUrl)}">
  <meta property="og:image:secure_url" content="${escapeHtml(imageUrl)}">
  <meta property="og:image:type" content="${escapeHtml(imageType)}">
  <meta property="og:image:width" content="${escapeHtml(imageWidth)}">
  <meta property="og:image:height" content="${escapeHtml(imageHeight)}">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="${escapeHtml(imageUrl)}">
</head>
<body style="margin:0;background:#09172d;color:#f8efd3;font-family:Georgia,serif;display:flex;align-items:center;justify-content:center;min-height:100vh;text-align:center;padding:24px;">
  <div>
    <p style="color:#d4af37;font-size:18px;margin-bottom:12px;">Abriendo el Martirologio de ACCAR...</p>
    <p><a href="${escapeHtml(redirectUrl)}" style="color:#f8efd3;">Haz clic aquí si no eres redirigido automáticamente</a></p>
  </div>
  <script>window.location.replace(${JSON.stringify(redirectUrl)});</script>
</body>
</html>`);
}