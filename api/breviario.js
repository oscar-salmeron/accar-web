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
    'media': 'sexta',
    'vespri': 'visperas',
    'compieta': 'completas'
  };
  const horaWeb = mapHoras[horaParam];

  // 1. Obtener la fecha solicitada o usar la de hoy
  const fechaParam = req.query.fecha;
  let year, monthNumber, day;

  if (fechaParam) {
    // Si viene del selector (formato YYYY-MM-DD)
    const partesFecha = fechaParam.split('-');
    year = partesFecha[0];
    monthNumber = parseInt(partesFecha[1], 10);
    day = partesFecha[2]; // Conservamos el formato original con cero inicial (ej. "01")
  } else {
    // Si no hay parámetro, calculamos hoy en Bogotá
    const formatter = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Bogota' });
    const partesHoy = formatter.format(new Date()).split('-');
    year = partesHoy[0];
    monthNumber = parseInt(partesHoy[1], 10);
    day = partesHoy[2]; // Conservamos el formato original con cero inicial
  }

  // 2. Mapear el número del mes a las 3 letras exactas que usa GitHub Pages
  const nombresMeses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  const mes = nombresMeses[monthNumber - 1];

  // 3. Construir la URL exacta
  const targetUrl = `https://liturgiadelashoras.github.io/sync/${year}/${mes}/${day}/${horaWeb}.htm`;

  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });

    if (!response.ok) {
        throw new Error(`Liturgia no disponible en la fuente para la fecha (${day}/${mes}/${year}). URL: ${targetUrl}`);
    }

    const htmlCrudo = await response.text();
    const $ = cheerio.load(htmlCrudo);

    // 4. Limpieza
    $('script, style, link, title, meta, img, table').remove();
    $('div[align="right"]').remove();
    
    $('a').each(function() {
      $(this).replaceWith($(this).html());
    });

    let contenido = $('body').html();
    let textoFiltrado = contenido.replace(/Tamaño:\s*A\s*A\s*A/gi, '').trim();

    res.status(200).json({ html: textoFiltrado });

  } catch (error) {
    console.error("Error en breviario.js:", error.message);
    res.status(500).json({ error: error.message });
  }
}