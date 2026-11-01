import * as cheerio from 'cheerio';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Mapeo de horas litúrgicas a las rutas de Ciudad Redonda
  const horaParam = req.query.hora || 'laudi';
  const rutasCiudadRedonda = {
      'ufficio': 'oficio-de-lectura',
      'laudi': 'laudes',
      'media': 'hora-intermedia',
      'vespri': 'visperas',
      'compieta': 'completas'
  };
  
  const rutaHora = rutasCiudadRedonda[horaParam] || 'laudes';
  const targetUrl = `https://www.ciudadredonda.org/calendario-lecturas/${rutaHora}`;

  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html'
      }
    });

    if (!response.ok) {
        throw new Error(`Error al conectar con la fuente (Status: ${response.status})`);
    }

    const htmlCrudo = await response.text();
    const $ = cheerio.load(htmlCrudo);

    // Ciudad Redonda guarda el texto litúrgico dentro de la etiqueta <article>
    let contenido = $('article').html();

    if (!contenido || contenido.length < 50) {
        throw new Error('No se encontró el texto litúrgico para esta hora.');
    }

    // Limpieza y formateo: mantenemos los párrafos, negritas y aplicamos el estilo rojo a las rúbricas
    let textoFormateado = contenido
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Elimina scripts
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')    // Elimina estilos
        .replace(/<a[^>]*>(.*?)<\/a>/gi, '$1')                              // Quita hipervínculos
        // Colorear rúbricas comunes en rojo
        .replace(/\b(V\.)/g, '<span style="color: #ff4d4d; font-weight: 600;">V.</span>')
        .replace(/\b(R\.)/g, '<span style="color: #ff4d4d; font-weight: 600;">R.</span>')
        .replace(/\b(Ant\.)/g, '<span style="color: #ff4d4d; font-weight: 600;">Ant.</span>')
        .replace(/\b(Oremos\.)/g, '<span style="color: #ff4d4d; font-weight: 600;">Oremos.</span>');

    res.status(200).json({ html: textoFormateado });

  } catch (error) {
    console.error("Error en breviario.js:", error.message);
    res.status(500).json({ error: error.message });
  }
}