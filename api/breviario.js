export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const hora = req.query.hora || 'laudi';
  // Usamos el endpoint oficial de texto de su app móvil, que suele tener menos bloqueos
  const targetUrl = 'https://www.ibreviary.com/m2/breviario_testo.php?s=' + hora + '&lang=es';

  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        // Simulamos ser un navegador Safari en iPhone para que nos entregue la versión móvil limpia
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

    // Si la página está vacía o nos mandaron a un login/error
    if (!htmlCrudo || htmlCrudo.length < 100) {
        throw new Error('Respuesta vacía del servidor.');
    }

    // 1. Aislar contenedor de texto (búsqueda más flexible por si cambiaron el HTML)
    let main = htmlCrudo;
    if (main.includes('data-role="content"')) {
        main = main.split('data-role="content"')[1];
        main = main.substring(main.indexOf('>') + 1);
        if (main.includes('data-role="footer"')) {
            main = main.split('data-role="footer"')[0];
        }
    } else if (main.includes('<body')) {
        // Respaldo por si no usan data-role
        main = main.split('<body')[1];
        main = main.substring(main.indexOf('>') + 1);
        main = main.split('</body>')[0];
    }

    // 2. Limpieza Quirúrgica (preservando estilos en línea)
    let textoFiltado = main
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Elimina scripts
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')    // Elimina estilos globales para no pisar los tuyos
        .replace(/<div data-role="header"[^>]*>([\s\S]*?)<\/div>/gi, '')    // Elimina cabecera móvil
        .replace(/<a [^>]*>([\s\S]*?)<\/a>/gi, '$1')                        // Elimina enlaces
        .replace(/<img[^>]*>/gi, '')                                        // Elimina imágenes
        .replace(/<link[^>]*>/gi, '')                                       // Elimina hojas de estilo externas
        .trim();

    // Eliminar posibles divs de cierre sobrantes
    textoFiltado = textoFiltado.replace(/(<\/div>\s*)+$/i, '');

    res.status(200).json({ html: textoFiltado });

  } catch (error) {
    console.error("Error en breviario.js:", error.message);
    res.status(500).json({ error: error.message });
  }
}