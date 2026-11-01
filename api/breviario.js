import * as cheerio from 'cheerio';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const horaParam = req.query.hora || 'laudi';

  // 1. Mapeo de la nomenclatura exacta de Hispanoamérica en el repositorio
  const mapHoras = {
    'ufficio': 'oficio',
    'laudi': 'laudes',
    'media': 'sexta', // Usaremos Sexta como representante de Hora Intermedia
    'vespri': 'visperas',
    'compieta': 'completas'
  };
  const horaWeb = mapHoras[horaParam];

  // 2. Construcción de la ruta dinámica (Ej: 2026/oct/31/laudes.htm)
  const hoy = new Date();
  const year = hoy.getFullYear();
  const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  const mes = meses[hoy.getMonth()];
  const dia = String(hoy.getDate()).padStart(2, '0');

  const targetUrl = `https://liturgiadelashoras.github.io/sync/${year}/${mes}/${dia}/${horaWeb}.htm`;

  try {
    // Extracción limpia desde GitHub Pages (cero bloqueos de servidor)
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });

    if (!response.ok) {
        throw new Error('La liturgia hispanoamericana no está disponible aún para hoy.');
    }

    const htmlCrudo = await response.text();
    const $ = cheerio.load(htmlCrudo);

    // 3. Limpieza de interfaz original para adaptar el texto a tu diseño oscuro
    $('script').remove();
    $('style').remove();
    $('link').remove();
    $('title').remove();
    $('meta').remove();
    $('img').remove();
    $('table').remove(); // Quita la cabecera gris del repositorio
    
    // Desactivar hipervínculos para evitar que el usuario salga de tu aplicación
    $('a').each(function() {
      $(this).replaceWith($(this).html());
    });

    let contenido = $('body').html();

    // 4. Inyección de estilos de tu sitio (Rúbricas rojas sobre fondo oscuro)
    let textoFiltrado = contenido
        .replace(/color\s*=\s*["']?red["']?/gi, 'style="color: #ff4d4d; font-weight: 600;"')
        .replace(/color:\s*red;?/gi, 'color: #ff4d4d; font-weight: 600;')
        .trim();

    res.status(200).json({ html: textoFiltrado });

  } catch (error) {
    console.error("Error al obtener liturgia hispanoamericana:", error.message);
    res.status(500).json({ error: error.message });
  }
}