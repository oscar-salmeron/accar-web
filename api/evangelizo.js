export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const dateParam = req.query.date || new Date().toISOString().split('T')[0];
  
  // VOLVEMOS A CIUDAD REDONDA (La fuente que sí te funcionó y no tiene bloqueos)
  const targetUrl = `https://www.ciudadredonda.org/calendario-lecturas/evangelio-del-dia/?f=${dateParam}`;

  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!response.ok) throw new Error('Error al conectar con la fuente.');

    const htmlCrudo = await response.text();

    // 1. Limpieza básica para borrar código oculto
    let bodyHtml = htmlCrudo
        .replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '')
        .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
        .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
        .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

    // Convertimos a texto leyendo los saltos de línea de la página original
    let textoPlano = bodyHtml
        .replace(/<\/(div|p|h[1-6]|li|article|section)>/gi, '\n')
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/gi, ' ')
        .replace(/&aacute;/gi, 'á').replace(/&eacute;/gi, 'é').replace(/&iacute;/gi, 'í')
        .replace(/&oacute;/gi, 'ó').replace(/&uacute;/gi, 'ú').replace(/&ntilde;/gi, 'ñ')
        .replace(/&[#a-z0-9]+;/gi, '');

    // Separamos en un arreglo de líneas limpias
    let lineas = textoPlano.split('\n').map(l => l.trim()).filter(l => l.length > 0);

    // 2. EXTRACCIÓN DE SEMANA Y SANTO EXACTOS
    let semanaInfo = "Tiempo Ordinario";
    let santoInfo = "Santo del Día";

    // Buscamos la línea final descriptiva (Ej: "Sábado de la XXX Semana del Tiempo Ordinario. Santa María en sábado")
    for (let i = lineas.length - 1; i >= 0; i--) {
        let l = lineas[i];
        if ((l.includes("Semana") || l.includes("Domingo") || l.includes("Tiempo")) && l.includes(".")) {
            let partes = l.split('.');
            semanaInfo = partes[0].trim();
            santoInfo = partes.slice(1).join('.').trim();
            break;
        }
    }

    // 3. BISTURÍ DIGITAL PARA SEPARAR LECTURAS
    const extraerLectura = (tituloBuscado, palabrasParada) => {
        // Busca exactamente la palabra "Primera Lectura", "Salmo" o "Evangelio"
        let idx = lineas.findIndex(l => l.toUpperCase() === tituloBuscado.toUpperCase());
        if (idx === -1) return null;

        // La línea que le sigue es la cita (Ej: "Lectura de la carta del apóstol...")
        let cita = lineas[idx + 1];
        let texto = [];

        // Extrae los párrafos hasta topar con la siguiente lectura o el final
        for (let i = idx + 2; i < lineas.length; i++) {
            let l = lineas[i];
            let lUpper = l.toUpperCase();

            if (palabrasParada.some(p => lUpper === p.toUpperCase())) break;
            
            // Freno final oficial
            if (lUpper.includes("PALABRA DE DIOS") || lUpper.includes("PALABRA DEL SEÑOR")) {
                texto.push(l);
                break;
            }
            texto.push(l);
        }

        return {
            title: cita,
            text: texto.join('<br><br>') // Une los párrafos con el doble espacio
        };
    };

    const primeraLectura = extraerLectura("Primera Lectura", ["Salmo"]);
    const salmo = extraerLectura("Salmo", ["Evangelio", "Segunda Lectura"]);
    const segundaLectura = extraerLectura("Segunda Lectura", ["Evangelio", "Salmo"]);
    const evangelio = extraerLectura("Evangelio", ["Compartir este evento", "Calendario", "Evangelio de mañana"]);

    let readings = [];
    if (primeraLectura) readings.push({ type: 'FR', title: primeraLectura.title, text: primeraLectura.text });
    if (salmo) readings.push({ type: 'PS', title: salmo.title, text: salmo.text });
    if (segundaLectura) readings.push({ type: 'SR', title: segundaLectura.title, text: segundaLectura.text });
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