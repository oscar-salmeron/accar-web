export default async function handler(req, res) {
  const targetUrl = 'https://evangeli.net/evangelio';

  try {
    const respuesta = await fetch(targetUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });

    if (!respuesta.ok) throw new Error(`Error de red (Status: ${respuesta.status})`);
    let html = await respuesta.text();

    // 1. CALCULADORA LITÚRGICA
    const year = new Date().getFullYear();
    const anioLiturgico = year % 2 === 0 ? "AÑO II" : "AÑO I";
    let cicloLiturgico = "CICLO A";
    if (year % 3 === 2) cicloLiturgico = "CICLO B";
    if (year % 3 === 0) cicloLiturgico = "CICLO C";

    const toRoman = (num) => {
      const val = [50, 40, 10, 9, 5, 4, 1];
      const syms = ["L", "XL", "X", "IX", "V", "IV", "I"];
      let roman = "", i = 0;
      while(num > 0) { while(num >= val[i]) { roman += syms[i]; num -= val[i]; } i++; }
      return roman;
    };

    let tituloFinal = "LITURGIA DIARIA";
    let colorLiturgico = "VERDE";
    const titleMatch = html.match(/(Lunes|Martes|Miércoles|Jueves|Viernes|Sábado|Domingo)[^<]*(tiempo ordinario|Cuaresma|Adviento|Pascua|Navidad)/i);
    
    if (titleMatch) {
        let rawTitle = titleMatch[0].replace(/Lunes|Martes|Miércoles|Jueves|Viernes|Sábado|Domingo/gi, '').trim();
        const numMatch = rawTitle.match(/\d+/);
        if (numMatch) rawTitle = rawTitle.replace(/\d+/, `${toRoman(parseInt(numMatch[0]))}`);
        tituloFinal = rawTitle.toUpperCase();
        if (tituloFinal.includes("CUARESMA") || tituloFinal.includes("ADVIENTO")) colorLiturgico = "MORADO";
        else if (tituloFinal.includes("PASCUA") || tituloFinal.includes("NAVIDAD")) colorLiturgico = "BLANCO";
    }

    // 2. EXTRACCIÓN CRUDA
    let textoLimpio = html.replace(/<br\s*\/?>/gi, '\n').replace(/<\/?[^>]+(>|$)/g, "").replace(/&nbsp;/gi, " ");
    const inicioReal = textoLimpio.indexOf("1ª Lectura");
    if (inicioReal !== -1) textoLimpio = textoLimpio.substring(inicioReal);

    const idxL1 = textoLimpio.search(/1ª Lectura/i);
    const idxL2 = textoLimpio.search(/2ª Lectura/i);
    const idxSalmo = textoLimpio.search(/Salmo responsorial:|Salmo:/i);
    const idxEv = textoLimpio.search(/Texto del Evangelio/i);
    const idxReflexion = textoLimpio.search(/Rev\. D\.|Pensamientos para el Evangelio/i);

    const extractRaw = (start, end) => {
        if (start === -1 || start >= end) return null;
        return textoLimpio.substring(start, end).trim();
    };

    let finL1 = idxSalmo;
    if (idxL2 !== -1 && idxL2 < idxSalmo) finL1 = idxL2;

    let rawPrimera = extractRaw(idxL1, finL1);
    let rawSegunda = extractRaw(idxL2, idxSalmo);
    let rawSalmo = extractRaw(idxSalmo, idxEv);
    let rawEvangelio = extractRaw(idxEv, idxReflexion !== -1 ? idxReflexion : textoLimpio.length);
    let rawReflexion = extractRaw(idxReflexion, textoLimpio.indexOf("© evangeli.net", idxReflexion));

    // 3. BISTURÍ DE PRECISIÓN: SEPARA REFERENCIA Y TEXTO PURO
    const parseReading = (raw, type) => {
        if (!raw) return null;
        let ref = type;
        let text = raw.replace(/\n[ \t]*\n/g, '<br><br>').replace(/\n/g, ' ');

        if (type === "Evangelio") {
            const match = raw.match(/Texto del Evangelio \((.*?)\):?\s*([\s\S]*)/i);
            if (match) {
                ref = "Lectura " + match[1].trim();
                text = match[2].trim().replace(/\n[ \t]*\n/g, '<br><br>').replace(/\n/g, ' ');
            }
        } else if (type === "Primera Lectura") {
            let clean = raw.replace(/1ª Lectura y Salmo/gi, '').trim();
            const match = clean.match(/1ª Lectura \((.*?)\):?\s*([\s\S]*)/i);
            if (match) {
                ref = match[1].trim();
                text = match[2].trim().replace(/\n[ \t]*\n/g, '<br><br>').replace(/\n/g, ' ');
            }
        } else if (type === "Segunda Lectura") {
            const match = raw.match(/2ª Lectura \((.*?)\):?\s*([\s\S]*)/i);
            if (match) {
                ref = match[1].trim();
                text = match[2].trim().replace(/\n[ \t]*\n/g, '<br><br>').replace(/\n/g, ' ');
            }
        } else if (type === "Salmo") {
            const match = raw.match(/Salmo responsorial:\s*(.*?)\s*R\/\.\s*(.*?)(?:\.|,)\s*([\s\S]*)/i);
            if (match) {
                ref = "Salmo responsorial " + match[1].trim();
                let responso = "<strong>R/. " + match[2].trim() + ".</strong>";
                let resto = match[3].trim().replace(/\n[ \t]*\n/g, '<br><br>').replace(/\n/g, ' ');
                text = responso + "<br><br>" + resto;
            }
        } else if (type === "Reflexión") {
            ref = "Reflexión del Día";
            text = raw.replace(/\n[ \t]*\n/g, '<br><br>').replace(/\n/g, ' ');
        }
        
        return { ref, text };
    };

    const parsedEvangelio = parseReading(rawEvangelio, "Evangelio");
    const parsedPrimera = parseReading(rawPrimera, "Primera Lectura");
    const parsedSalmo = parseReading(rawSalmo, "Salmo");
    const parsedSegunda = parseReading(rawSegunda, "Segunda Lectura");
    const parsedReflexion = parseReading(rawReflexion, "Reflexión");

    const readings = [];
    if (parsedEvangelio) readings.push({ type: "GSP", title: parsedEvangelio.ref, text: parsedEvangelio.text });
    if (parsedPrimera) readings.push({ type: "FR", title: parsedPrimera.ref, text: parsedPrimera.text });
    if (parsedSalmo) readings.push({ type: "PS", title: parsedSalmo.ref, text: parsedSalmo.text });
    if (parsedSegunda) readings.push({ type: "SR", title: parsedSegunda.ref, text: parsedSegunda.text });
    if (parsedReflexion) readings.push({ type: "RE", title: parsedReflexion.ref, text: parsedReflexion.text });

    const datosEstructurados = {
      fiestas: [{ title: tituloFinal, color: colorLiturgico, ciclo: cicloLiturgico, anio: anioLiturgico }],
      readings: readings
    };

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(datosEstructurados);
  } catch (error) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(500).json({ error: error.message });
  }
}