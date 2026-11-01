import * as cheerio from 'cheerio';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const horaParam = req.query.hora || 'laudi';
  const mapHoras = {
    'ufficio': 'oficio',
    'laudi': 'laudes',
    'media': 'sexta', // Sexta como representación de la Hora Intermedia
    'vespri': 'visperas',
    'compieta': 'completas'
  };
  const horaWeb = mapHoras[horaParam];

  // 1. Forzar huso horario de América Latina para que Vercel no se adelante al día siguiente
  const formatter = new Intl.DateTimeFormat('es-CO', {
    timeZone: 'America/Bogota',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  
  const parts = formatter.formatToParts(new Date());
  const year = parts.find(p => p.type === 'year').value;
  
  // Limpieza del mes (le quita el punto si lo trae y toma 3 letras: "nov.", "oct.")
  let mes = parts.find(p => p.type === 'month').value.replace(/\./g, '').toLowerCase().substring(0, 3);
  if (mes === 'set') mes = 'sep'; // GitHub Pages usa "sep"
  
  // 2. Extraer el día exacto sin ceros iniciales (ej. "1" en lugar de "01")
  const dia = parts.find(p => p.type === 'day').value;

  // Ruta dinámica sin bloqueos de servidor
  const targetUrl = `https://liturgiadelashoras.github.io/sync/${year}/${mes}/${dia}/${horaWeb}.htm`;

  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });

    if (!response.ok) {
        throw new Error(`Liturgia no disponible en la fuente para la fecha de hoy (${dia}/${mes}/${year}). URL: ${targetUrl}`);
    }

    const htmlCrudo = await response.text();
    const $ = cheerio.load(htmlCrudo);

    // 3. Limpieza de toda la interfaz y tablas del repositorio original
    $('script, style, link, title, meta, img, table').remove();
    
    // Destruir hipervínculos internos para evitar clics accidentales
    $('a').each(function() {
      $(this).replaceWith($(this).html());
    });

    let contenido = $('body').html();

    // 4. Limpieza de colores negros forzados e inyección de rúbricas rojas
    let textoFiltrado = contenido
        .replace(/Tamaño:\s*A\s*A\s*A/gi, '') // Elimina el texto muerto de tamaño original
        .replace(/color\s*=\s*["']?(black|#000000)["']?/gi, '') // Elimina el atributo black
        .replace(/color:\s*(black|#000000);?/gi, '') // Elimina estilos CSS black
        .replace(/color\s*=\s*["']?red["']?/gi, 'style="color: #ff4d4d; font-weight: 600;"')
        .replace(/color:\s*red;?/gi, 'color: #ff4d4d; font-weight: 600;')
        .trim();

    res.status(200).json({ html: textoFiltrado });

  } catch (error) {
    console.error("Error en breviario.js:", error.message);
    res.status(500).json({ error: error.message });
  }
}