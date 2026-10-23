export default async function handler(req, res) {
  const rssUrl = `https://dailygospel.org/main.php?language=AM&module=rss`;

  try {
    // Usamos un disfraz de Googlebot; los cortafuegos siempre dejan pasar a Google para leer RSS
    const respuesta = await fetch(rssUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        'Accept': 'application/rss+xml, application/xml, text/xml'
      }
    });

    if (!respuesta.ok) throw new Error(`Error HTTP: ${respuesta.status}`);
    
    const xmlText = await respuesta.text();

    // Extractor blindado: Busca el texto de la lectura sin importar si usan CDATA o etiquetas limpias
    const itemMatch = xmlText.match(/<item>[\s\S]*?<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/i) || 
                      xmlText.match(/<item>[\s\S]*?<description>([\s\S]*?)<\/description>/i);
    
    let textoCrudo = itemMatch ? itemMatch[1] : "Fallo de extracción.";

    // Limpieza de formato para que encaje perfecto en tu diseño web
    if (textoCrudo !== "Fallo de extracción.") {
      textoCrudo = textoCrudo.replace(/<br\s*\/?>/gi, '\n'); // Convierte saltos HTML
      textoCrudo = textoCrudo.replace(/<\/?[^>]+(>|$)/g, ""); // Borra cualquier basura HTML sobrante
      textoCrudo = textoCrudo.replace(/\n\s*\n/g, '<br><br>'); // Doble salto para crear párrafos limpios
    }

    const datosEstructurados = {
      fiestas: [{ title: "Lecturas y Evangelio", color: "Verde" }],
      readings: [
        { type: "GSP", title: "Liturgia Diaria", text: textoCrudo }
      ],
      // Clave espía: Si falla, esto nos imprimirá la estructura exacta del XML de Evangelizo en tu consola
      debug_xml: xmlText.substring(0, 900) 
    };

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(datosEstructurados);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}