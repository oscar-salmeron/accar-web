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

    if (!response.ok) throw new Error('Error al conectar.');

    const htmlCrudo = await response.text();

    // 1. Aislar solo el contenido útil para evitar leer menús
    let main = htmlCrudo.split('<main')[1] || htmlCrudo;
    main = main.split('</main>')[0] || main;

    // 2. Limpieza total de HTML, convirtiendo bloques en saltos de línea
    let texto = main
        .replace(/<\/(p|div|h[1-6]|li|article|section)>/gi, '\n\n')
        .replace(/<br\s*\/?>/gi, '\n\n')
        .replace(/<[^>]+>/g, '') 
        .replace(/&nbsp;/gi, ' ')
        .replace(/&aacute;/gi, 'á').replace(/&eacute;/gi, 'é').replace(/&iacute;/gi, 'í')
        .replace(/&oacute;/gi, 'ó').replace(/&uacute;/gi, 'ú').replace(/&ntilde;/gi, 'ñ')
        .replace(/&[a-zA-Z]+;/gi, '');

    // 3. Crear un arreglo de párrafos limpios
    let lineas = texto.split('\n').map(l => l.trim()).filter(l => l.length > 0);

    // 4. SECCIÓN CELEBRAMOS (Formato estricto de filas sin etiquetas HTML)
    let semanaFinal = "Lecturas y Evangelio de la\nTiempo Ordinario";
    let santoFinal = "Santo del Día";

    let infoIdx = lineas.findIndex(l => (l.includes("Semana") || l.includes("Domingo")) && l.includes("."));
    if (infoIdx !== -1) {
        let partes = lineas[infoIdx].split('.');
        let rawSemana = partes[0].trim();
        santoFinal = partes.slice(1).join('.').trim() || "Feria";

        // Extraer exactamente el número romano y la semana
        let match = rawSemana.match(/[IVXLCDM]+\s+Semana\s+del\s+Tiempo\s+Ordinario/i);
        if (match) {
            semanaFinal = `Lecturas y Evangelio de la\n${match[0]}`;
        } else {
            semanaFinal = `Lecturas y Evangelio de la\n${rawSemana}`;
        }
    }

    // 5. EXTRACTOR QUIRÚRGICO (Búsqueda por línea idéntica para no confundir títulos)
    const extraerLectura = (tituloExacto, paradas) => {
        let idx = lineas.findIndex(l => l.toUpperCase() === tituloExacto.toUpperCase());
        if (idx === -1) return null;

        let cita = lineas[idx + 1];
        let parrafos = [];

        for (let i = idx + 2; i < lineas.length; i++) {
            let lUpper = lineas[i].toUpperCase();

            // Si choca con otra sección, corta.
            if (paradas.some(p => lUpper === p.toUpperCase() || lUpper.includes(p.toUpperCase()))) {
                break;
            }

            // Si encuentra el cierre natural, lo guarda y corta.
            if (lUpper.includes("PALABRA DE DIOS") || lUpper.includes("PALABRA DEL SEÑOR")) {
                parrafos.push(lineas[i]);
                break;
            }

            parrafos.push(lineas[i]);
        }

        return {
            title: cita,
            text: parrafos.join('<br><br>') // Esto garantiza la separación de párrafos en el frontend
        };
    };

    const primeraLectura = extraerLectura("Primera Lectura", ["Salmo"]);
    const salmo = extraerLectura("Salmo", ["Evangelio", "Segunda Lectura"]);
    const evangelio = extraerLectura("Evangelio", ["Comentario al Evangelio", "Liturgia", "Calendario"]);
    const reflexion = extraerLectura("Comentario al Evangelio", ["Liturgia", "Calendario", "Síguenos"]);

    // 6. CORRECCIONES FINALES DE TEXTO
    if (salmo && salmo.title) {
        salmo.title = salmo.title.replace(/^Sal\s+/i, 'Salmo responsorial ');
    }

    let readings = [];
    if (primeraLectura) readings.push({ type: 'FR', title: primeraLectura.title, text: primeraLectura.text });
    if (salmo) readings.push({ type: 'PS', title: salmo.title, text: salmo.text });
    if (evangelio) readings.push({ type: 'GSP', title: evangelio.title, text: evangelio.text });

    // Insertar la Reflexión (Comentario) con los párrafos unidos correctamente
    if (reflexion && reflexion.text.length > 20) {
        let textoReflexionCompleto = reflexion.title + "<br><br>" + reflexion.text;
        readings.push({ type: 'RE', title: "Comentario al Evangelio", text: textoReflexionCompleto });
    } else {
        readings.push({ type: 'RE', title: "Reflexión", text: "La liturgia de hoy nos invita a meditar la Palabra y llevarla a la vida." });
    }

    res.status(200).json({
      fiestas: [{ semana: semanaFinal, santo: santoFinal, color: "VERDE", ciclo: "CICLO A", anio: "AÑO II" }],
      readings: readings
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}