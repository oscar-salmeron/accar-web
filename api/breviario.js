export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const hora = req.query.hora || 'laudi';
  const targetUrl = 'https://www.ibreviary.com/m2/breviario_testo.php?s=' + hora + '&lang=es';

  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'es-ES,es;q=0.9',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    });

    if (!response.ok) {
        console.error(`iBreviary respondió con estado: ${response.status}`);
        throw new Error('Error al conectar con la fuente oficial.');
    }

    const htmlCrudo = await response.text();

    if (!htmlCrudo || htmlCrudo.length < 100) {
        throw new Error('Respuesta vacía del servidor.');
    }

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