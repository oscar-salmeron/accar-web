export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const hora = req.query.hora || 'laudi';
  
  // 1. URL original de iBreviary con los textos perfectos
  const targetUrl = 'https://www.ibreviary.com/m2/breviario_testo.php?s=' + hora + '&lang=es';
  
  // 2. Puente proxy (AllOrigins) para evitar que iBreviary bloquee a Vercel
  const proxyUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent(targetUrl);

  try {
    const response = await fetch(proxyUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    });

    if (!response.ok) throw new Error('Error al conectar con el puente proxy.');

    // AllOrigins devuelve un JSON seguro con una propiedad "contents"
    const data = await response.json();
    
    if (!data.contents) throw new Error('Respuesta vacía del servidor origen.');

    const htmlCrudo = data.contents;

    // 3. Extracción del texto del breviario
    let main = htmlCrudo;
    if (main.includes('data-role="content"')) {
        main = main.split('data-role="content"')[1];
        main = main.substring(main.indexOf('>') + 1);
        if (main.includes('data-role="footer"')) {
            main = main.split('data-role="footer"')[0];
        }
    } else if (main.includes('<body')) {
        main = main.split('<body')[1];
        main = main.substring(main.indexOf('>') + 1);
        main = main.split('</body>')[0];
    }

    // 4. Limpieza respetando las rúbricas rojas
    let textoFiltado = main
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') 
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')    
        .replace(/<div data-role="header"[^>]*>([\s\S]*?)<\/div>/gi, '')    
        .replace(/<a [^>]*>([\s\S]*?)<\/a>/gi, '$1')                        
        .replace(/<img[^>]*>/gi, '')                                        
        .replace(/<link[^>]*>/gi, '')                                       
        .trim();

    textoFiltado = textoFiltado.replace(/(<\/div>\s*)+$/i, '');

    res.status(200).json({ html: textoFiltado });

  } catch (error) {
    console.error("Error en breviario.js:", error.message);
    res.status(500).json({ error: error.message });
  }
}