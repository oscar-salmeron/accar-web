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

    if (!response.ok) throw new Error('Error al conectar.');

    const htmlCrudo = await response.text();

    // 1. Limpieza estricta de menús y scripts ANTES de tocar el texto
    let bodyHtml = htmlCrudo
        .replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '')
        .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
        .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
        .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<form[^>]*>[\s\S]*?<\/form>/gi, '');

    // 2. Convertimos TODO a un texto plano continuo
    let textoPlano = bodyHtml
        .replace(/<\/(div|p|h[1-6]|li|article|section)>/gi, '\n')
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/gi, ' ')
        .replace(/&[a-z]+;/gi, ''); // Borra entidades raras

    // Colapsamos los múltiples saltos de línea en uno solo para que sea fácil de leer
    textoPlano = textoPlano.replace(/\r/g, '').replace(/[ \t]+/g, ' ').replace(/\n\s*\n/g, '\n').trim();

    // 3. LIMPIEZA DE "CELEBRAMOS"
    let semanaInfo = "Tiempo Ordinario";
    let semanaMatch = textoPlano.match(/(?:Semana|Tiempo Ordinario|Pascua|Cuaresma|Adviento)[^\n]*/i);
    if (semanaMatch) {
        semanaInfo = semanaMatch[0].trim();
        // Borramos el texto duplicado "Ciclo A Año II Color Verde" si la página web origen lo incrusta aquí
        semanaInfo = semanaInfo.replace(/Ciclo[\s\S]*?Color:\s*[A-Za-z]+/i, '').trim();
    }

    let santoInfo = "Santo del Día";
    let santoMatch = textoPlano.match(/Santo del día:[^\n]*/i);
    if (santoMatch) santoInfo = santoMatch[0].replace(/Santo del día:/i, '').trim();

    // 4. EXTRACTOR DE BLOQUE GIGANTE (Infalible)
    const extraerBloque = (regexInicio, regexFin) => {
        let matchInicio = textoPlano.match(regexInicio);
        if (!matchInicio) return null;

        let inicioStr = matchInicio.index + matchInicio[0].length;
        let restoDelTexto = textoPlano.substring(inicioStr).trim();

        let matchFin = restoDelTexto.match(regexFin);
        let seccionCruda = matchFin ? restoDelTexto.substring(0, matchFin.index) : restoDelTexto;

        // Cortamos el texto justo antes de que empiece la publicidad de suscripciones
        seccionCruda = seccionCruda.split(/(Recibir por email|Suscríbete|Lleva este contenido|Compartir este evento)/i)[0].trim();

        if (!seccionCruda) return null;

        // La primera línea será la cita, el resto es el texto separado por párrafos
        let lineas = seccionCruda.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        return {
            title: lineas[0],
            text: lineas.slice(1).join('<br><br>')
        };
    };

    // Cortamos los bloques exactamente entre sus títulos
    const primeraLectura = extraerBloque(/\bPrimera Lectura\b/i, /\bSalmo(?: Responsorial)?\b/i);
    const salmo = extraerBloque(/\bSalmo(?: Responsorial)?\b/i, /\b(?:Evangelio|Segunda Lectura)\b/i);
    const evangelio = extraerBloque(/\bEvangelio\b/i, /\b(?:Reflexión|Credo|Oración|Palabra del Señor)\b/i);

    let readings = [];
    if (primeraLectura) readings.push({ type: 'FR', title: primeraLectura.title, text: primeraLectura.text });
    if (salmo) readings.push({ type: 'PS', title: salmo.title, text: salmo.text });
    if (evangelio) readings.push({ type: 'GSP', title: evangelio.title, text: evangelio.text });

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