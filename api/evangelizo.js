export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const dateParam = req.query.date || new Date().toISOString().split('T')[0];
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

    // 1. LIMPIEZA INTELIGENTE: Nos enfocamos solo en el contenido principal para evitar basura
    let bodyHtml = htmlCrudo.split('<main')[1] || htmlCrudo;
    bodyHtml = bodyHtml.split('<footer')[0] || bodyHtml;

    // Protegemos los párrafos: Los cierres de párrafo se vuelven doble salto (\n\n) y los <br> un salto simple (\n)
    let textWithBreaks = bodyHtml
        .replace(/<\/(p|div|section|article|h[1-6])>/gi, '\n\n')
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<[^>]+>/g, '') // Borramos el resto de etiquetas HTML
        .replace(/&nbsp;/gi, ' ')
        .replace(/&[a-z]+;/gi, ''); // Limpiamos entidades raras

    // Dividimos el texto en "bloques" reales de párrafos
    let blocks = textWithBreaks.split('\n\n')
        .map(b => b.trim())
        .filter(b => b.length > 0);

    // 2. FORMATEO EXACTO DE "CELEBRAMOS"
    let semanaInfo = "Lecturas y Evangelio de la<br>Tiempo Ordinario";
    let santoInfo = "Santo del Día";

    // Buscamos la línea descriptiva (Ej: "Sábado de la XXX Semana del Tiempo Ordinario. Santa María...")
    let infoLine = blocks.find(b => (b.includes("Semana") || b.includes("Domingo") || b.includes("Tiempo")) && b.includes("."));
    if (infoLine) {
        let partes = infoLine.split('.');
        let cruda = partes[0].trim(); // Antes del punto
        santoInfo = partes.slice(1).join('.').trim() || "Feria";

        // Extraemos solo el número romano y la semana
        let matchSemana = cruda.match(/(?:[IVXLCDM]+\s+Semana\s+del\s+Tiempo\s+Ordinario|Domingo.*)/i);
        if (matchSemana) {
            semanaInfo = `Lecturas y Evangelio de la<br>${matchSemana[0]}`;
        } else {
            semanaInfo = `Lecturas y Evangelio de la<br>${cruda}`;
        }
    }

    // 3. MOTOR EXTRACTOR CON PÁRRAFOS PERFECTOS
    const extraerLectura = (tituloBuscado, palabrasParada) => {
        // Encontramos el título (ej. "Primera Lectura")
        let idx = blocks.findIndex(b => b.toUpperCase().includes(tituloBuscado.toUpperCase()) && b.length < 50);
        if (idx === -1) return null;

        let cita = blocks[idx + 1];
        let textBlocks = [];

        // Agrupamos los párrafos siguientes
        for (let i = idx + 2; i < blocks.length; i++) {
            let b = blocks[i];
            let bUpper = b.toUpperCase();

            // Freno si empieza otra lectura
            if (palabrasParada.some(p => bUpper.includes(p.toUpperCase()) && b.length < 50)) break;

            // Freno final en la aclamación
            if (bUpper.includes("PALABRA DE DIOS") || bUpper.includes("PALABRA DEL SEÑOR")) {
                textBlocks.push(b);
                break;
            }
            textBlocks.push(b);
        }

        return {
            title: cita,
            // Unimos los bloques con salto doble de párrafo, y respetamos los saltos simples internos (como en los Salmos)
            text: textBlocks.join('<br><br>').replace(/\n/g, '<br>')
        };
    };

    // Extraemos las secciones
    const primeraLectura = extraerLectura("Primera Lectura", ["Salmo"]);
    const salmo = extraerLectura("Salmo", ["Evangelio", "Segunda Lectura"]);
    const segundaLectura = extraerLectura("Segunda Lectura", ["Evangelio", "Salmo"]);
    const evangelio = extraerLectura("Evangelio", ["Comentario", "Compartir", "Calendario"]);
    
    // Extraemos el Comentario de los Padres/Teólogos como Reflexión
    const reflexion = extraerLectura("Comentario", ["Compartir", "Evangelio de", "Síguenos"]);

    // 4. CORRECCIONES DE TEXTO FINALES
    if (salmo && salmo.title) {
        // Cambia "Sal 41" por "Salmo responsorial 41"
        salmo.title = salmo.title.replace(/^Sal\s+/i, 'Salmo responsorial ');
    }

    let readings = [];
    if (primeraLectura) readings.push({ type: 'FR', title: primeraLectura.title, text: primeraLectura.text });
    if (salmo) readings.push({ type: 'PS', title: salmo.title, text: salmo.text });
    if (segundaLectura) readings.push({ type: 'SR', title: segundaLectura.title, text: segundaLectura.text });
    if (evangelio) readings.push({ type: 'GSP', title: evangelio.title, text: evangelio.text });

    // Inyectamos la reflexión dinámica si existe, o dejamos una genérica
    if (reflexion && reflexion.text.length > 20) {
        readings.push({ type: 'RE', title: "Comentario al Evangelio", text: reflexion.text });
    } else {
        readings.push({
            type: 'RE',
            title: "Reflexión del Día",
            text: "La liturgia de hoy nos invita a meditar sobre la Palabra proclamada y a llevarla a la práctica en nuestra vida diaria."
        });
    }

    res.status(200).json({
      fiestas: [{ semana: semanaInfo, santo: santoInfo, color: "VERDE", ciclo: "CICLO A", anio: "AÑO II" }],
      readings: readings
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}