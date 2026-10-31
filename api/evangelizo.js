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

    let main = htmlCrudo.split('<main')[1] || htmlCrudo;
    main = main.split('</main>')[0] || main;

    let texto = main
        .replace(/<\/(p|div|h[1-6]|li|article|section)>/gi, ' ')
        .replace(/<br\s*\/?>/gi, ' ')
        .replace(/<[^>]+>/g, '') 
        .replace(/&nbsp;/gi, ' ')
        .replace(/&aacute;/gi, 'á').replace(/&eacute;/gi, 'é').replace(/&iacute;/gi, 'í')
        .replace(/&oacute;/gi, 'ó').replace(/&uacute;/gi, 'ú').replace(/&ntilde;/gi, 'ñ')
        .replace(/&[a-zA-Z]+;/gi, '');

    // Limpiamos los espacios dobles para tener texto fluido
    texto = texto.replace(/\s{2,}/g, ' ').trim();

    // ESTILO GRAMATICAL: Rompe el bloque sólido en párrafos elegantes después de los puntos.
    const formatearEstructura = (parrafo) => {
        if (!parrafo) return "";
        // Busca una palabra, seguida de puntuación (., .», ?!, etc.), un espacio y una letra mayúscula
        return parrafo.replace(/([a-záéíóúñ]{2,}[.»”?!]{1,2})\s+(?=[A-ZÁÉÍÓÚÑ¿¡])/gi, (match, p1) => {
            return p1 + '<br><br>';
        });
    };

    let lineas = texto.split(/(?=Primera Lectura|Salmo|Segunda Lectura|Evangelio|Comentario al Evangelio)/i);

    // CELEBRAMOS: Tres filas estrictas con salto de texto nativo (\n) para evitar que salgan códigos raros en pantalla
    let semanaFinal = "Lecturas y Evangelio de la\nTiempo Ordinario";
    let santoFinal = "Santo del Día";

    let textoGlobal = lineas[0] || texto;
    let infoMatch = textoGlobal.match(/([IVXLCDM]+\s+Semana\s+del\s+Tiempo\s+Ordinario|Domingo[^\.]+)\.\s*(.*)/i);
    
    if (infoMatch) {
        semanaFinal = `Lecturas y Evangelio de la\n${infoMatch[1].trim()}`;
        santoFinal = infoMatch[2].trim() || "Feria";
    }

    const extraerSeccion = (tituloExacto) => {
        let bloque = lineas.find(l => l.trim().toUpperCase().startsWith(tituloExacto.toUpperCase()));
        if (!bloque) return null;

        let partes = bloque.split(':');
        let tituloCita = partes[0].trim();
        let contenido = partes.slice(1).join(':').trim();
        
        // Freno oficial
        let textoLimpio = contenido.split(/Palabra de Dios|Palabra del Señor|Liturgia|Calendario|Síguenos/i)[0].trim();

        return {
            title: tituloCita,
            text: formatearEstructura(textoLimpio)
        };
    };

    const primeraLectura = extraerSeccion("Primera Lectura");
    const salmo = extraerSeccion("Salmo");
    const segundaLectura = extraerSeccion("Segunda Lectura");
    const evangelio = extraerSeccion("Evangelio");
    const reflexion = extraerSeccion("Comentario al Evangelio");

    // Corrección estricta del título del Salmo
    if (salmo && salmo.title) {
        salmo.title = salmo.title.replace(/^Sal(?:mo)?\s*/i, 'Salmo responsorial ');
    }

    let readings = [];
    if (primeraLectura) readings.push({ type: 'FR', title: primeraLectura.title, text: primeraLectura.text });
    if (salmo) readings.push({ type: 'PS', title: salmo.title, text: salmo.text });
    if (segundaLectura) readings.push({ type: 'SR', title: segundaLectura.title, text: segundaLectura.text });
    if (evangelio) readings.push({ type: 'GSP', title: evangelio.title, text: evangelio.text });

    if (reflexion && reflexion.text.length > 20) {
        readings.push({ type: 'RE', title: "Comentario al Evangelio", text: reflexion.text });
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