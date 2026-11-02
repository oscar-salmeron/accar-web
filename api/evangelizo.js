export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const dateParam = req.query.date || new Date().toISOString().split('T')[0];
  const targetUrl = `https://www.ciudadredonda.org/calendario-lecturas/evangelio-del-dia/?f=${dateParam}`;

  // Helper para convertir número a romano
  const toRoman = (num) => {
    const lookup = {X:10, IX:9, V:5, IV:4, I:1};
    let roman = '';
    for (let i in lookup) {
      while (num >= lookup[i]) {
        roman += i;
        num -= lookup[i];
      }
    }
    return roman;
  };

  // Algoritmo simplificado de calendario litúrgico para el Tiempo Ordinario
  // Calcula la semana asumiendo un ciclo estándar donde la semana 34 termina antes de Adviento
  const calcularSemanaLiturgica = (fecha) => {
      const d = new Date(`${fecha}T12:00:00Z`);
      const year = d.getFullYear();
      
      // Fecha aproximada del domingo de Cristo Rey (Semana 34)
      // Suele caer entre el 20 y el 26 de noviembre
      let cristoRey = new Date(`${year}-11-26T12:00:00Z`);
      while (cristoRey.getDay() !== 0) {
          cristoRey.setDate(cristoRey.getDate() - 1);
      }
      
      const diffTime = cristoRey.getTime() - d.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      // Si estamos después de Cristo Rey o en las primeras semanas del año (hasta cuaresma)
      // este cálculo básico no aplicaría, pero para el tramo actual (hasta nov) funciona:
      let weekNumber = 34 - Math.floor(diffDays / 7);
      
      if (weekNumber < 1) weekNumber = 1;
      if (weekNumber > 34) weekNumber = 34;

      return weekNumber;
  };

  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    });

    if (!response.ok) throw new Error('Error al conectar.');

    const htmlCrudo = await response.text();

    let main = htmlCrudo.split('<main')[1] || htmlCrudo;
    main = main.split('</main>')[0] || main;

    let texto = main
        .replace(/<\/(p|div|h[1-6]|li|article|section)>/gi, '\n\n')
        .replace(/<br\s*\/?>/gi, '\n\n')
        .replace(/<[^>]+>/g, '') 
        .replace(/&nbsp;/gi, ' ')
        .replace(/&aacute;/gi, 'á').replace(/&eacute;/gi, 'é').replace(/&iacute;/gi, 'í')
        .replace(/&oacute;/gi, 'ó').replace(/&uacute;/gi, 'ú').replace(/&ntilde;/gi, 'ñ')
        .replace(/&[a-zA-Z]+;/gi, '');

    let lineas = texto.split('\n').map(l => l.trim()).filter(l => l.length > 0);

    let semanaFinal = "Tiempo Ordinario";
    let santoFinal = "Feria";
    let colorLiturgico = "VERDE";
    
    // Calcular datos litúrgicos precisos para Tiempo Ordinario
    const numSemana = calcularSemanaLiturgica(dateParam);
    const romanoSemana = toRoman(numSemana);
    
    // Determinación del Salterio (1, 2, 3 o 4)
    const numSalterio = ((numSemana - 1) % 4) + 1;
    const romanoSalterio = toRoman(numSalterio);
    
    // Determinación del Tomo (III de semana 1 a 17, IV de 18 a 34)
    const romanoTomo = numSemana > 17 ? 'IV' : 'III';

    // Extracción básica del Santo si existe en la fuente
    let infoIdx = lineas.findIndex(l => (l.includes("Semana") || l.includes("Domingo")) && l.includes("."));
    if (infoIdx !== -1) {
        let partes = lineas[infoIdx].split('.');
        santoFinal = partes.slice(1).join('.').trim() || "Feria";
    }

    // Sobrescribimos el texto de la fuente con nuestro cálculo matemático seguro
    semanaFinal = `${romanoSemana} Semana del Tiempo Ordinario`;

    const extraerLectura = (tituloExacto, paradas) => {
        let idx = lineas.findIndex(l => l.toUpperCase() === tituloExacto.toUpperCase());
        if (idx === -1) return null;

        let cita = lineas[idx + 1];
        let parrafos = [];

        for (let i = idx + 2; i < lineas.length; i++) {
            let lUpper = lineas[i].toUpperCase();
            if (paradas.some(p => lUpper === p.toUpperCase() || lUpper.includes(p.toUpperCase()))) break;
            if (lUpper.includes("PALABRA DE DIOS") || lUpper.includes("PALABRA DEL SEÑOR")) {
                parrafos.push(lineas[i]);
                break;
            }
            parrafos.push(lineas[i]);
        }
        return { title: cita, text: parrafos.join('<br><br>') };
    };

    const primeraLectura = extraerLectura("Primera Lectura", ["Salmo"]);
    const salmo = extraerLectura("Salmo", ["Evangelio", "Segunda Lectura"]);
    const evangelio = extraerLectura("Evangelio", ["Comentario al Evangelio", "Liturgia", "Calendario"]);
    const reflexion = extraerLectura("Comentario al Evangelio", ["Liturgia", "Calendario", "Síguenos"]);

    if (salmo && salmo.title) salmo.title = salmo.title.replace(/^Sal\s+/i, 'Salmo responsorial ');

    let readings = [];
    if (primeraLectura) readings.push({ type: 'FR', title: primeraLectura.title, text: primeraLectura.text });
    if (salmo) readings.push({ type: 'PS', title: salmo.title, text: salmo.text });
    if (evangelio) readings.push({ type: 'GSP', title: evangelio.title, text: evangelio.text });

    if (reflexion && reflexion.text.length > 20) {
        let textoReflexionCompleto = reflexion.title + "<br><br>" + reflexion.text;
        readings.push({ type: 'RE', title: "Comentario al Evangelio", text: textoReflexionCompleto });
    }

    // Enviamos todos los datos estructurados al frontend
    res.status(200).json({
      fiestas: [{ 
          semana: semanaFinal, 
          santo: santoFinal, 
          color: colorLiturgico, 
          ciclo: "CICLO A", 
          anio: "AÑO II",
          tomo: `TOMO ${romanoTomo}`,
          salterio: `SALTERIO ${romanoSalterio}`
      }],
      readings: readings
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}