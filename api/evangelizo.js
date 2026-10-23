export default async function handler(req, res) {
  // Utilizamos la fuente católica oficial y abierta de Ciudad Redonda
  const rssUrl = 'https://www.ciudadredonda.org/rss/evangelio.xml';

  try {
    const respuesta = await fetch(rssUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept': 'application/rss+xml, application/xml, text/xml'
      }
    });

    if (!respuesta.ok) throw new Error(`Error de red con la nueva fuente (Status: ${respuesta.status})`);
    
    const xmlText = await respuesta.text();

    // Extraemos el bloque principal del Evangelio de hoy
    const itemMatch = xmlText.match(/<item>([\s\S]*?)<\/item>/i);
    let textoCrudo = "No se pudo extraer la lectura.";
    let titulo = "Evangelio del Día";

    if (itemMatch) {
      const itemXml = itemMatch[1];
      
      // Extraemos el título limpiando etiquetas CDATA si existen
      const titleMatch = itemXml.match(/<title>([\s\S]*?)<\/title>/i);
      if (titleMatch) {
        titulo = titleMatch[1].replace(/<!\[CDATA\[|\]\]>/gi, '').trim();
      }

      // Extraemos el contenido limpiando etiquetas HTML y CDATA
      const descMatch = itemXml.match(/<description>([\s\S]*?)<\/description>/i);
      if (descMatch) {
        textoCrudo = descMatch[1].replace(/<!\[CDATA\[|\]\]>/gi, '');
        textoCrudo = textoCrudo.replace(/<br\s*\/?>/gi, '\n');
        textoCrudo = textoCrudo.replace(/<\/?[^>]+(>|$)/g, ""); 
        textoCrudo = textoCrudo.replace(/\n\s*\n/g, '<br><br>'); // Doble salto para legibilidad
      }
    }

    // Construimos el paquete de datos en el formato exacto que espera tu diseño web
    const datosEstructurados = {
      fiestas: [{ title: titulo, color: "Verde" }],
      readings: [
        { type: "GSP", title: "Evangelio de Hoy", text: textoCrudo }
      ]
    };

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(datosEstructurados);

  } catch (error) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(500).json({ error: error.message });
  }
}