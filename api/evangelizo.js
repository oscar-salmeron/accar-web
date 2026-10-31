export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const dateParam = req.query.date || new Date().toISOString().split('T')[0];
  const targetUrl = `https://evangelizacion.org.mx/evangelio-de-hoy/?date=${dateParam}`;

  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!response.ok) {
        throw new Error('Error de red al conectar con la fuente.');
    }

    const htmlCrudo = await response.text();

    // 1. LIMPIEZA DRÁSTICA: Eliminamos navegación y pie de página para aislar el contenido central
    let bodyHtml = htmlCrudo
        .replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '')
        .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
        .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
        .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

    let textoPlano = bodyHtml
        .replace(/<\/(div|p|h[1-6]|li|article|section)>/gi, '\n')
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<[^>]+>/g, '') // Quita todas las etiquetas HTML restantes
        .replace(/&nbsp;/gi, ' ')
        .replace(/&aacute;/gi, 'á').replace(/&eacute;/gi, 'é').replace(/&iacute;/gi, 'í')
        .replace(/&oacute;/gi, 'ó').replace(/&uacute;/gi, 'ú').replace(/&ntilde;/gi, 'ñ')
        .replace(/&[#a-z0-9]+;/gi, '');

    // 2. CONVERSIÓN A LÍNEAS: Limpiamos espacios y separamos cada línea individualmente
    let lineas = textoPlano.split('\n')
        .map(l => l.trim())
        .filter(l => l.length > 0);

    // 3. EXTRACCIÓN DE SEMANA
    let semanaInfo = "Tiempo Ordinario";
    let santoInfo = "Santo del Día";
    // Busca una línea larga descriptiva
    let idxSemana = lineas.findIndex(l => (l.includes("Semana") || l.includes("Lecturas del")) && l.length > 15 && l.length < 150);
    if (idxSemana !== -1) {
        semanaInfo = lineas[idxSemana];
        // Intentar atrapar el santo en la línea siguiente
        if (lineas[idxSemana + 1] && lineas[idxSemana + 1].length < 100 && !lineas[idxSemana + 1].includes("Lectura")) {
            santoInfo = lineas[idxSemana + 1];
        }
    }

    // 4. MOTOR INTELIGENTE DE LECTURAS (Resistente a fallos de formato)
    const extraerBloqueSeguro = (palabrasClave, paradas) => {
        // Encuentra la cabecera (una línea corta que contiene la palabra clave)
        let idx = lineas.findIndex(l => palabrasClave.some(pc => l.toUpperCase().includes(pc.toUpperCase())) && l.length <= 40);
        if (idx === -1) return null;

        // La línea siguiente siempre es la cita bíblica
        let title = lineas[idx + 1] || palabrasClave[0];
        let textLines = [];

        // Extraemos los párrafos hasta toparnos con una frase de parada
        for (let i = idx + 2; i < lineas.length; i++) {
            let current = lineas[i].toUpperCase();
            
            let esParada = paradas.some(p => current.includes(p.toUpperCase())) && lineas[i].length <= 40;
            let esPalabraDios = current.includes("PALABRA DE DIOS") || current.includes("PALABRA DEL SEÑOR");
            
            if (esParada || esPalabraDios) {
                break;
            }
            textLines.push(lineas[i]);
        }

        return {
            title: title,
            text: textLines.join('<br><br>')
        };
    };

    const primeraLectura = extraerBloqueSeguro(["Primera Lectura"], ["Salmo", "Evangelio", "Segunda Lectura"]);
    const salmo = extraerBloqueSeguro(["Salmo"], ["Evangelio", "Segunda Lectura"]);
    const evangelio = extraerBloqueSeguro(["Evangelio"], ["Credo", "Oración", "Propósito", "Compartir", "Calendario"]);

    let readings = [];
    if (primeraLectura) readings.push({ type: 'FR', title: primeraLectura.title, text: primeraLectura.text });
    if (salmo) readings.push({ type: 'PS', title: salmo.title, text: salmo.text });
    
    if (evangelio) {
        readings.push({ type: 'GSP', title: evangelio.title, text: evangelio.text });
    } else {
        // FALLBACK DE EMERGENCIA: Si no halla el título, inyecta un bloque crudo en lugar de dejar la tarjeta vacía
        readings.push({ type: 'GSP', title: "Evangelio del Día", text: lineas.slice(0, 30).join('<br><br>') });
    }

    readings.push({
        type: 'RE',
        title: "Reflexión del Día",
        text: "La liturgia de hoy nos invita a meditar sobre la Palabra proclamada y a llevarla a la práctica en nuestra vida diaria."
    });

    res.status(200).json({
      fiestas: [{ semana: semanaInfo, santo: santoInfo, color: "VERDE", ciclo: "CICLO A", anio: "AÑO II" }],
      readings: readings
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}