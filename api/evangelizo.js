export default async function handler(req, res) {
  // Ignoramos la API bloqueada y atacamos el Feed RSS público de Evangelizo (Español América)
  const rssUrl = `https://dailygospel.org/main.php?language=AM&module=rss`;

  try {
    const respuesta = await fetch(rssUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/rss+xml, application/xml, text/xml'
      }
    });

    if (!respuesta.ok) throw new Error(`Bloqueo de red (Status: ${respuesta.status})`);
    
    // Obtenemos el texto de la página web/XML
    const xmlText = await respuesta.text();

    // Extraemos a la fuerza el contenido usando expresiones regulares (Web Scraping)
    // Buscamos el bloque de texto que contiene las lecturas del día
    const contenidoMatch = xmlText.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/i);
    let textoCrudo = contenidoMatch ? contenidoMatch[1] : "No se pudo extraer el texto de las lecturas.";

    // Limpiamos el HTML para que se vea impecable en tu app
    textoCrudo = textoCrudo.replace(/<br\s*\/?>/gi, '\n');
    textoCrudo = textoCrudo.replace(/<\/?[^>]+(>|$)/g, ""); // Quita etiquetas HTML residuales
    textoCrudo = textoCrudo.replace(/\n\s*\n/g, '<br><br>'); // Doble salto para párrafos

    // Construimos el paquete de datos exacto que tu página lecturas.html ya está esperando
    // Nota: El RSS de Evangelizo entrega todo en un solo bloque, así que lo inyectamos en el Evangelio por ahora para asegurar que tengas el contenido.
    const datosEstructurados = {
      fiestas: [{ title: "Liturgia de Hoy", color: "Verde" }],
      readings: [
        { type: "GSP", title: "Lecturas y Evangelio", text: textoCrudo }
      ]
    };

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(datosEstructurados);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}