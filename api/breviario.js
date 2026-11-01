export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const hora = req.query.hora || 'laudi';
  // 1. Pegamos a la página principal abierta, NO al enlace móvil bloqueado
  const mainUrl = 'https://www.ibreviary.com/m2/breviario.php?lang=es';

  try {
    const response = await fetch(mainUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
        throw new Error('Error al conectar con la portada del Breviario.');
    }

    const htmlCrudo = await response.text();

    // 2. Buscamos el enlace real que iBreviary generó hoy para esa hora específica
    // Ejemplo de cómo lo escriben ellos: <a href="breviario_testo.php?s=laudi">Laudes</a>
    const regex = new RegExp(`href="([^"]+\\.php\\?s=${hora}[^"]*)"`, 'i');
    const match = htmlCrudo.match(regex);

    if (!match) {
        throw new Error('No se encontró la hora litúrgica en la página principal.');
    }

    // 3. Construimos la URL completa para el texto
    let targetUrl = match[1];
    if (!targetUrl.startsWith('http')) {
        targetUrl = 'https://www.ibreviary.com/m2/' + targetUrl;
    }

    // Aseguramos el idioma
    if (!targetUrl.includes('lang=')) {
        targetUrl += '&lang=es';
    }

    // 4. Hacemos la segunda petición al texto con la URL válida obtenida
    const textResponse = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': mainUrl // Esto es vital para engañar a su sistema de seguridad
      }
    });

    if (!textResponse.ok) {
        throw new Error('Error al descargar el texto de la hora litúrgica.');
    }

    const htmlTextoCrudo = await textResponse.text();

    let main = htmlTextoCrudo;
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