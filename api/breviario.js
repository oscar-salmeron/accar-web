export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const hora = req.query.hora || 'laudi';
  
  // 1. Enlace principal activo de iBreviary (breviario_testo.php está muerto)
  const targetUrl = 'https://www.ibreviary.com/m2/breviario.php?s=' + hora + '&lang=es';
  
  // 2. Proxy estable que devuelve HTML puro y evade bloqueos de Vercel
  const proxyUrl = 'https://api.codetabs.com/v1/proxy?quest=' + encodeURIComponent(targetUrl);

  try {
    const response = await fetch(proxyUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    });

    if (!response.ok) throw new Error('Error al conectar con el servidor.');

    const htmlCrudo = await response.text();
    
    // Verificación de seguridad por si la página no existe
    if (htmlCrudo.includes('404 Page Not Found') || htmlCrudo.length < 100) {
        throw new Error('La liturgia de esta hora no está disponible en la fuente.');
    }

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

    // 4. Limpieza respetando estrictamente las rúbricas rojas
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