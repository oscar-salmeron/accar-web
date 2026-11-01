import * as cheerio from 'cheerio';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const hora = req.query.hora || 'laudi';
  // FUENTE ESTRICTA: iBreviary (versión móvil que es más fácil de limpiar)
  const targetUrl = `https://www.ibreviary.com/m2/breviario.php?s=${hora}&lang=es`;

  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15',
        'Accept': 'text/html'
      }
    });

    if (!response.ok) throw new Error(`iBreviary bloqueó la conexión: ${response.status}`);

    const html = await response.text();
    const $ = cheerio.load(html);

    // iBreviary móvil encierra el texto principal en este div
    let contenido = $('div[data-role="content"]').html();
    
    // Si por alguna razón falla, agarramos el body entero
    if (!contenido) {
        contenido = $('body').html();
    }

    if (!contenido || contenido.length < 50) {
        throw new Error('No se pudo extraer el texto del breviario.');
    }

    // Limpieza de interfaz de la app, pero conservamos todo el HTML que da el color rojo a las rúbricas
    let textoFiltrado = contenido
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
        .replace(/<div data-role="header"[^>]*>([\s\S]*?)<\/div>/gi, '')
        .replace(/<div data-role="footer"[^>]*>([\s\S]*?)<\/div>/gi, '')
        .replace(/<a [^>]*>([\s\S]*?)<\/a>/gi, '$1') // Quita enlaces pero deja el texto
        .replace(/<img[^>]*>/gi, '')
        .replace(/<link[^>]*>/gi, '')
        .trim();

    res.status(200).json({ html: textoFiltrado });

  } catch (error) {
    console.error("Error en breviario.js:", error.message);
    res.status(500).json({ error: error.message });
  }
}