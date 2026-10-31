export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Parámetro de la hora litúrgica (ufficio, laudi, media, vespri, compieta)
  const hora = req.query.hora || 'laudi';
  const targetUrl = `https://www.ibreviary.com/m2/breviario_testo.php?s=${hora}&lang=es`;

  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) throw new Error('Error al conectar con el Breviario.');

    const htmlCrudo = await response.text();

    // 1. Aislar exclusivamente el contenedor de texto de la aplicación móvil de iBreviary
    let main = htmlCrudo;
    if (main.includes('data-role="content"')) {
        main = main.split('data-role="content"')[1];
        main = main.substring(main.indexOf('>') + 1);
        
        // Cortar antes del footer o del siguiente div estructural
        if (main.includes('data-role="footer"')) {
            main = main.split('data-role="footer"')[0];
        }
    }

    // 2. Limpieza quirúrgica: quitamos menús, botones y scripts de su app, 
    // PERO conservamos todas las etiquetas <font>, <span> y <p> para mantener el color rojo original.
    let textoFiltado = main
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Elimina scripts
        .replace(/<div data-role="header"[^>]*>([\s\S]*?)<\/div>/gi, '')     // Elimina la barra superior de iBreviary
        .replace(/<a [^>]*>([\s\S]*?)<\/a>/gi, '$1')                         // Quita hipervínculos pero deja el texto intacto
        .replace(/<img[^>]*>/gi, '')                                         // Elimina los iconos internos de su app
        .trim();

    // Eliminar posibles divs de cierre colgantes al final del texto
    textoFiltado = textoFiltado.replace(/(<\/div>\s*)+$/i, '');

    res.status(200).json({
      html: textoFiltado
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}