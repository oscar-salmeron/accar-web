export default async function handler(req, res) {
  const targetUrl = 'https://evangeli.net/evangelio';

  try {
    const respuesta = await fetch(targetUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });

    if (!respuesta.ok) throw new Error(`Error de red (Status: ${respuesta.status})`);
    let html = await respuesta.text();

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
        let rawTitle = titleMatch[0];
        // Bisturí: Eliminamos explícitamente el día de la semana
        rawTitle = rawTitle.replace(/Lunes|Martes|Miércoles|Jueves|Viernes|Sábado|Domingo/gi, '').trim();
        const numMatch = rawTitle.match(/\d+/);
        if (numMatch) rawTitle = rawTitle.replace(/\d+/, `${toRoman(parseInt(numMatch[0]))}`);
        tituloFinal = rawTitle.toUpperCase();

        if (tituloFinal.includes("CUARESMA") || tituloFinal.includes("ADVIENTO")) colorLiturgico = "MORADO";
        else if (tituloFinal.includes("PASCUA") || tituloFinal.includes("NAVIDAD")) colorLiturgico = "BLANCO";
    }

    let textoLimpio = html.replace(/<br\s*\/?>/gi, '\n').replace(/<\/?[^>]+(>|$)/g, "").replace(/&nbsp;/gi, " ");
    const inicioReal = textoLimpio.indexOf("1ª Lectura");
    if (inicioReal !== -1) textoLimpio = textoLimpio.substring(inicioReal);

    const idxL1 = textoLimpio.search(/1ª Lectura/i);
    const idxL2 = textoLimpio.search(/2ª Lectura/i); // Motor listo para Domingos y Solemnidades
    const idxSalmo = textoLimpio.search(/Salmo responsorial:|Salmo:/i);
    const idxEv = textoLimpio.search(/Texto del Evangelio/i);
    const idxReflexion = textoLimpio.search(/Rev\. D\.|Pensamientos para el Evangelio/i);

    const extractText = (start, end) => {
        if (start === -1 || start >= end) return null;
        return textoLimpio.substring(start, end).trim().replace(/\n[ \t]*\n/g, '<br><br>').replace(/\n/g, ' ');
    };

    let finL1 = idxSalmo;
    if (idxL2 !== -1 && idxL2 < idxSalmo) finL1 = idxL2;

    const tPrimera = extractText(idxL1, finL1);
    const tSegunda = extractText(idxL2, idxSalmo);
    const tSalmo = extractText(idxSalmo, idxEv);
    const tEvangelio = extractText(idxEv, idxReflexion !== -1 ? idxReflexion : textoLimpio.length);
    const tReflexion = extractText(idxReflexion, textoLimpio.indexOf("© evangeli.net", idxReflexion));

    const readings = [];
    if (tEvangelio) readings.push({ type: "GSP", title: "Evangelio", text: tEvangelio });
    if (tPrimera) readings.push({ type: "FR", title: "Primera lectura", text: tPrimera });
    if (tSalmo) readings.push({ type: "PS", title: "Salmo", text: tSalmo });
    if (tSegunda) readings.push({ type: "SR", title: "Segunda lectura", text: tSegunda });
    if (tReflexion) readings.push({ type: "RE", title: "Reflexión", text: tReflexion });

    const datosEstructurados = {
      fiestas: [{ title: tituloFinal, color: colorLiturgico, ciclo: cicloLiturgico, anio: anioLiturgico }],
      readings: readings
    };

    res.status(200).json(datosEstructurados);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}