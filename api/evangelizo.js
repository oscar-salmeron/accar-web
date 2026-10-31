export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const dateParam = req.query.date || new Date().toISOString().split('T')[0];
  // Regresamos a tu fuente preferida, ahora con el extractor calibrado al milímetro
  const targetUrl = `https://evangelizacion.org.mx/evangelio-de-hoy/?date=${dateParam}`;

  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml'
      }
    });

    if (!response.ok) {
        throw new Error('Error de red al conectar con la fuente.');
    }

    const htmlCrudo = await response.text();

    // 1. EXTRAER LA SEMANA: Capturamos el título principal (Ej: "Evangelio y Lecturas del Sábado...")
    let tituloEventoMatch = htmlCrudo.match(/<h1[^>]*>([^<]+)<\/h1>/i);
    let semanaInfo = tituloEventoMatch ? tituloEventoMatch[1].trim() : "Tiempo Ordinario";

    // 2. DESTRUIR BASURA Y APLANAR TEXTO
    let bodyHtml = htmlCrudo
        .replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '')
        .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
        .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
        .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

    let textoPlano = bodyHtml
        .replace(/<\/(div|p|h[1-6]|li|article|section)>/gi, '\n\n')
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/gi, ' ')
        .replace(/&aacute;/gi, 'á').replace(/&eacute;/gi, 'é').replace(/&iacute;/gi, 'í')
        .replace(/&oacute;/gi, 'ó').replace(/&uacute;/gi, 'ú').replace(/&ntilde;/gi, 'ñ')
        .replace(/&[#a-z0-9]+;/gi, '');

    // Convertimos el texto en una lista de líneas individuales
    let paragraphs = textoPlano.split('\n')
        .map(p => p.trim())
        .filter(p => p.length > 0);

    // 3. EXTRAER EL SANTO: Buscamos desde abajo hacia arriba la línea descriptiva del día
    let santoInfo = "Santo del Día";
    for (let i = paragraphs.length - 1; i >= 0; i--) {
        let p = paragraphs[i];
        if ((p.includes("Semana") || p.includes("Memoria") || p.includes("Fiesta") || p.includes("Solemnidad")) && p.includes(".")) {
            if (p.length < 150 && !p.includes("Evangelio")) {
                santoInfo = p;
                break;
            }
        }
    }

    // 4. MOTOR QUIRÚRGICO DE LECTURAS
    const extractReading = (headerName) => {
        let idx = -1;
        // Buscamos dónde está exactamente la cabecera (Primera Lectura, Salmo, etc.)
        for (let i = 0; i < paragraphs.length; i++) {
            let p = paragraphs[i].toUpperCase();
            if (p === headerName.toUpperCase() || (headerName === "SALMO" && p.includes("SALMO"))) {
                idx = i;
                break;
            }
        }
        if (idx === -1) return null;

        // ¡EL TRUCO!: La línea inmediatamente después de la cabecera es la CITA, la mandamos al Header (title)
        let title = paragraphs[idx + 1];
        let textArr = [];

        // Palabras de freno para dejar de copiar el cuerpo del texto
        let stops = ["PALABRA DE DIOS", "PALABRA DEL SEÑOR", "PRIMERA LECTURA", "SEGUNDA LECTURA", "SALMO", "EVANGELIO", "COMPARTIR ESTE EVENTO", "CALENDARIO"];

        // Copiamos el texto párrafo por párrafo hasta toparnos con una palabra de freno
        for (let i = idx + 2; i < paragraphs.length; i++) {
            let p = paragraphs[i];
            if (stops.some(s => p.toUpperCase().includes(s))) {
                break;
            }
            textArr.push(p);
        }

        return {
            title: title,
            // Unimos todos los párrafos con el doble salto de línea que solicitaste
            text: textArr.join('<br><br>')
        };
    };

    // Ejecutamos la cirugía
    const primeraLectura = extractReading("Primera Lectura");
    const segundaLectura = extractReading("Segunda Lectura");
    const salmo = extractReading("Salmo");
    const evangelio = extractReading("Evangelio");

    let readings = [];

    // Empaquetamos las lecturas listas para el frontend
    if (primeraLectura) readings.push({ type: 'FR', title: primeraLectura.title, text: primeraLectura.text });
    if (salmo) readings.push({ type: 'PS', title: salmo.title, text: salmo.text });
    if (segundaLectura) readings.push({ type: 'SR', title: segundaLectura.title, text: segundaLectura.text });
    
    if (evangelio) {
        readings.push({ type: 'GSP', title: evangelio.title, text: evangelio.text });
    } else {
        readings.push({ type: 'GSP', title: "Evangelio no encontrado", text: "No se pudo aislar el texto de la base de datos." });
    }

    readings.push({
        type: 'RE',
        title: "Reflexión del Día",
        text: "La liturgia de hoy nos invita a meditar sobre la Palabra proclamada y a llevarla a la práctica en nuestra vida diaria."
    });

    const datosEstructurados = {
      fiestas: [
        { 
          semana: semanaInfo, 
          santo: santoInfo, 
          color: "VERDE", 
          ciclo: "CICLO A", 
          anio: "AÑO II"
        }
      ],
      readings: readings
    };

    res.status(200).json(datosEstructurados);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}