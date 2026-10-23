export default async function handler(req, res) {
  const targetUrl = 'https://evangeli.net/evangelio';

  try {
    const respuesta = await fetch(targetUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });

    if (!respuesta.ok) throw new Error(`Error de red (Status: ${respuesta.status})`);
    let html = await respuesta.text();

    // 1. CALCULADORA LITÚRGICA (Ciclo, Año, Números Romanos y Color)
    const year = new Date().getFullYear();
    const anioLiturgico = year % 2 === 0 ? "AÑO II" : "AÑO I";
    
    let cicloLiturgico = "CICLO A";
    if (year % 3 === 2) cicloLiturgico = "CICLO B";
    if (year % 3 === 0) cicloLiturgico = "CICLO C";

    const toRoman = (num) => {
      const val = [50, 40, 10, 9, 5, 4, 1];
      const syms = ["L", "XL", "X", "IX", "V", "IV", "I"];
      let roman = "", i = 0;
      while(num > 0) {
        while(num >= val[i]) { roman += syms[i]; num -= val[i]; }
        i++;
      }
      return roman;
    };

    // Extraemos y formateamos el título (Ej: "Viernes 29 del tiempo ordinario" -> "XXIX SEMANA DEL TIEMPO ORDINARIO")
    let tituloFinal = "LITURGIA DIARIA";
    let colorLiturgico = "VERDE";
    const titleMatch = html.match(/(Lunes|Martes|Miércoles|Jueves|Viernes|Sábado|Domingo)[^<]*(tiempo ordinario|Cuaresma|Adviento|Pascua|Navidad)/i);
    
    if (titleMatch) {
        let rawTitle = titleMatch[0];
        const numMatch = rawTitle.match(/\d+/);
        if (numMatch) {
            rawTitle = rawTitle.replace(/\d+/, `${toRoman(parseInt(numMatch[0]))} SEMANA`);
        }
        tituloFinal = rawTitle.toUpperCase();

        if (tituloFinal.includes("CUARESMA") || tituloFinal.includes("ADVIENTO")) colorLiturgico = "MORADO";
        else if (tituloFinal.includes("PASCUA") || tituloFinal.includes("NAVIDAD")) colorLiturgico = "BLANCO";
    }

    // 2. EXTRACCIÓN Y LIMPIEZA DE LECTURAS (Bisturí de precisión)
    // Limpiamos la basura web pero mantenemos los saltos de línea para el orden visual
    let textoLimpio = html.replace(/<br\s*\/?>/gi, '\n').replace(/<\/?[^>]+(>|$)/g, "").replace(/&nbsp;/gi, " ");
    
    // Eliminamos el menú superior que se colaba a veces
    const inicioReal = textoLimpio.indexOf("1ª Lectura (");
    if (inicioReal !== -1) textoLimpio = textoLimpio.substring(inicioReal);

    // Encontramos los marcadores exactos
    const idxL1 = textoLimpio.search(/1ª Lectura \(/i);
    const idxSalmo = textoLimpio.search(/Salmo responsorial:|Salmo:/i);
    const idxEv = textoLimpio.search(/Texto del Evangelio \(/i);
    const idxReflexion = textoLimpio.search(/Rev\. D\.|Pensamientos para el Evangelio/i);

    // Función para extraer y formatear elegantemente los párrafos
    const extractText = (start, end) => {
        if (start === -1 || start >= end) return null;
        let t = textoLimpio.substring(start, end).trim();
        return t.replace(/\n[ \t]*\n/g, '<br><br>').replace(/\n/g, ' '); // Formato prolijo
    };

    const tPrimera = extractText(idxL1, idxSalmo !== -1 ? idxSalmo : idxEv);
    const tSalmo = extractText(idxSalmo, idxEv);
    const tEvangelio = extractText(idxEv, idxReflexion !== -1 ? idxReflexion : textoLimpio.length);
    const tReflexion = extractText(idxReflexion, textoLimpio.indexOf("© evangeli.net", idxReflexion));

    // 3. EMPAQUETADO FINAL
    const readings = [];
    if (tPrimera) readings.push({ type: "FR", title: "Primera Lectura", text: tPrimera });
    if (tSalmo) readings.push({ type: "PS", title: "Salmo Responsorial", text: tSalmo });
    if (tEvangelio) readings.push({ type: "GSP", title: "Evangelio de Hoy", text: tEvangelio });
    if (tReflexion) readings.push({ type: "RE", title: "Reflexión del Día", text: tReflexion });

    const datosEstructurados = {
      fiestas: [{ 
        title: tituloFinal, 
        color: colorLiturgico,
        ciclo: cicloLiturgico,
        anio: anioLiturgico
      }],
      readings: readings
    };

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(datosEstructurados);

  } catch (error) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(500).json({ error: error.message });
  }
}