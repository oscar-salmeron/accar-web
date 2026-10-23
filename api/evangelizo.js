export default async function handler(req, res) {
  const targetUrl = 'https://evangeli.net/evangelio';

  try {
    const respuesta = await fetch(targetUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });

    if (!respuesta.ok) throw new Error(`Error de red (Status: ${respuesta.status})`);
    
    let html = await respuesta.text();

    // 1. Extraemos el título litúrgico exacto (Ej: "Viernes 29 del tiempo ordinario")
    let tituloLiturgico = "Liturgia Diaria";
    const matchTitulo = html.match(/(Lunes|Martes|Miércoles|Jueves|Viernes|Sábado|Domingo)[^<]*(tiempo ordinario|Cuaresma|Adviento|Pascua|Navidad)/i);
    if (matchTitulo) {
        tituloLiturgico = matchTitulo[0].trim();
    }

    // 2. Inteligencia para el Color Litúrgico
    let colorLiturgico = "Verde";
    const tituloMin = tituloLiturgico.toLowerCase();
    if (tituloMin.includes("cuaresma") || tituloMin.includes("adviento")) {
        colorLiturgico = "Morado";
    } else if (tituloMin.includes("pascua") || tituloMin.includes("navidad")) {
        colorLiturgico = "Blanco";
    }

    // 3. Limpiamos las etiquetas HTML para pasar el bisturí
    let textoLimpio = html.replace(/<br\s*\/?>/gi, '\n')
                          .replace(/<\/?[^>]+(>|$)/g, "")
                          .replace(/&nbsp;/gi, " ");

    // 4. Buscamos las coordenadas exactas de cada lectura
    const idxL1 = textoLimpio.search(/1ª Lectura|Primera Lectura/i);
    const idxL2 = textoLimpio.search(/2ª Lectura|Segunda Lectura/i); // Por si es domingo
    const idxSalmo = textoLimpio.search(/Salmo responsorial|Salmo[:\s]/i);
    const idxEv = textoLimpio.search(/Texto del Evangelio/i);
    
    // Buscamos dónde termina el Evangelio (el comentario del sacerdote)
    const idxFinEv1 = textoLimpio.indexOf("Rev. D.", Math.max(idxEv, 0));
    const idxFinEv2 = textoLimpio.indexOf("Pensamientos para el", Math.max(idxEv, 0));
    let idxFin = idxFinEv1 !== -1 ? idxFinEv1 : (idxFinEv2 !== -1 ? idxFinEv2 : textoLimpio.length);
    if (idxFinEv1 !== -1 && idxFinEv2 !== -1) idxFin = Math.min(idxFinEv1, idxFinEv2);

    // Herramienta de extracción y limpieza de saltos de línea
    const safeExtract = (start, end) => {
        if (start === -1 || end === -1 || start >= end) return "No disponible.";
        return textoLimpio.substring(start, end).trim().replace(/\n\s*\n/g, '<br><br>').replace(/\n/g, '<br>');
    };

    // 5. Cortamos cada sección
    let tPrimera = "No disponible.";
    let tSegunda = null;
    let tSalmo = "No disponible.";
    let tEvangelio = "No disponible.";

    if (idxL1 !== -1) {
        let finL1 = idxSalmo;
        if (idxL2 !== -1 && idxL2 < idxSalmo) finL1 = idxL2; // Si hay 2da lectura, cortamos ahí
        tPrimera = safeExtract(idxL1, finL1);
    }
    if (idxL2 !== -1 && idxSalmo !== -1) tSegunda = safeExtract(idxL2, idxSalmo);
    if (idxSalmo !== -1 && idxEv !== -1) tSalmo = safeExtract(idxSalmo, idxEv);
    if (idxEv !== -1 && idxFin !== -1) tEvangelio = safeExtract(idxEv, idxFin);

    // 6. Empaquetamos todo para que los botones de tu app lo reconozcan
    const readings = [];
    if (tPrimera !== "No disponible.") readings.push({ type: "FR", title: "Primera Lectura", text: tPrimera });
    if (tSegunda) readings.push({ type: "SR", title: "Segunda Lectura", text: tSegunda });
    if (tSalmo !== "No disponible.") readings.push({ type: "PS", title: "Salmo Responsorial", text: tSalmo });
    if (tEvangelio !== "No disponible.") readings.push({ type: "GSP", title: "Evangelio de Hoy", text: tEvangelio });

    const datosEstructurados = {
      fiestas: [{ title: tituloLiturgico, color: colorLiturgico }],
      readings: readings
    };

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(datosEstructurados);

  } catch (error) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(500).json({ error: error.message });
  }
}