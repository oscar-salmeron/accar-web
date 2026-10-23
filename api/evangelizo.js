export default async function handler(req, res) {
  const targetUrl = 'https://evangeli.net/evangelio';

  try {
    const respuesta = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml'
      }
    });

    if (!respuesta.ok) throw new Error(`Error de red (Status: ${respuesta.status})`);
    
    const html = await respuesta.text();

    // Extractor amplio: busca las clases habituales donde Evangeli.net envuelve su texto
    const matchTexto = html.match(/<div[^>]*class=["'][^"']*?text_evangelio[^"']*?["'][^>]*>([\s\S]*?)<\/div>/i) 
                    || html.match(/<div class="code[^>]*>([\s\S]*?)<\/div>/i)
                    || html.match(/<span class="evangelio[^>]*>([\s\S]*?)<\/span>/i);
    
    let textoCrudo = "No se pudo extraer la lectura. La estructura de Evangeli.net cambió.";

    if (matchTexto) {
      textoCrudo = matchTexto[1];
    } else {
      // Fallback de emergencia: si no encuentra la clase exacta, extrae los párrafos principales
      const parrafos = html.match(/<p>([\s\S]{10,})<\/p>/gi);
      if (parrafos) {
        textoCrudo = parrafos.slice(0, 3).join('\n\n'); 
      }
    }

    // Limpiamos el texto para que se vea impecable en tus tarjetas
    textoCrudo = textoCrudo.replace(/<br\s*\/?>/gi, '\n');
    textoCrudo = textoCrudo.replace(/<\/?[^>]+(>|$)/g, "").trim(); 
    textoCrudo = textoCrudo.replace(/\n\s*\n/g, '<br><br>');

    // Empaquetamos los datos
    const datosEstructurados = {
      fiestas: [{ title: "Evangeli.net", color: "Verde" }],
      readings: [
        { type: "GSP", title: "Evangelio de Hoy", text: textoCrudo }
      ],
      // Clave espía: nos dirá cómo se llama la clase si falla la extracción
      debug_html: html.substring(0, 300)
    };

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(datosEstructurados);

  } catch (error) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(500).json({ error: error.message });
  }
}