export default async function handler(req, res) {
  const targetUrl = 'https://evangeli.net/evangelio';

  try {
    const respuesta = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    });

    if (!respuesta.ok) throw new Error(`Error de red (Status: ${respuesta.status})`);
    
    let html = await respuesta.text();

    // 1. Limpiamos absolutamente todo el HTML sobrante para que no estorben las etiquetas ni menús
    let textoLimpio = html.replace(/<br\s*\/?>/gi, '\n')
                          .replace(/<\/?[^>]+(>|$)/g, "")
                          .replace(/&nbsp;/gi, " ");

    // 2. Aplicamos el bisturí: cortamos exactamente desde el título de la lectura hasta el autor
    let textoCrudo = "No se pudo extraer la lectura exacta.";
    
    const inicio = textoLimpio.indexOf("Texto del Evangelio");
    const fin1 = textoLimpio.indexOf("Rev. D.", inicio);
    const fin2 = textoLimpio.indexOf("Pensamientos para el Evangelio", inicio);
    
    // Identificamos dónde termina exactamente el Evangelio y empieza el comentario
    let fin = fin1;
    if (fin1 === -1 || (fin2 !== -1 && fin2 < fin1)) {
      fin = fin2;
    }

    if (inicio !== -1 && fin !== -1) {
      // Extraemos solo la porción sagrada y limpiamos los espacios
      textoCrudo = textoLimpio.substring(inicio, fin).trim();
      
      // Restauramos los párrafos con saltos de línea elegantes para tu diseño web
      textoCrudo = textoCrudo.replace(/\n\s*\n/g, '<br><br>');
    }

    const datosEstructurados = {
      fiestas: [{ title: "Liturgia Diaria", color: "Verde" }],
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