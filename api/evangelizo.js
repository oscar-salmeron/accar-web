export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // 1. Captura estricta de la fecha que manda el frontend
  const rawDate = req.query?.date || req.url.split('date=')[1]?.split('&')[0];
  const formatter = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Bogota' });
  const dateParam = rawDate || formatter.format(new Date()); 

  // 2. ¡NUEVA CONEXIÓN A TU BASE DE DATOS EN GITHUB!
  const targetUrl = `https://raw.githubusercontent.com/oscar-salmeron/accar-leccionario-script/refs/heads/main/datos/${dateParam}.json`;

  // Funciones auxiliares para el Breviario (Liturgia de las Horas)
  const toRoman = (num) => {
    const lookup = {X:10, IX:9, V:5, IV:4, I:1};
    let roman = '';
    for (let i in lookup) {
      while (num >= lookup[i]) { roman += i; num -= lookup[i]; }
    }
    return roman;
  };

  const calcularSemanaLiturgica = (fecha) => {
      const d = new Date(`${fecha}T12:00:00Z`);
      const domingoActual = new Date(d);
      domingoActual.setDate(domingoActual.getDate() - domingoActual.getDay());
      const year = domingoActual.getFullYear();
      let cristoRey = new Date(`${year}-11-26T12:00:00Z`);
      while (cristoRey.getDay() !== 0) cristoRey.setDate(cristoRey.getDate() - 1);
      const diffTime = cristoRey.getTime() - domingoActual.getTime();
      const diffWeeks = Math.round(diffTime / (1000 * 60 * 60 * 24 * 7));
      let weekNumber = 34 - diffWeeks;
      if (weekNumber < 1) weekNumber = 1;
      if (weekNumber > 34) weekNumber = 34;
      return weekNumber;
  };

  try {
    // 3. Obtener el archivo JSON del día directamente
    const response = await fetch(targetUrl);
    if (!response.ok) throw new Error('Lecturas no encontradas en la base de datos.');

    const dataEWTN = await response.json();

    // 4. Extraer el color y fiesta exactos de EWTN
    const colorLiturgico = dataEWTN.color || "VERDE";
    const fiestaTexto = dataEWTN.fiesta || "Feria";
    
    // Cálculos de Liturgia de las horas
    const numSemana = calcularSemanaLiturgica(dateParam);
    const romanoSemana = toRoman(numSemana);
    let numSalterio = numSemana % 4;
    if (numSalterio === 0) numSalterio = 4;
    let romanoSalterio = toRoman(numSalterio);
    if(numSemana === 34) romanoSalterio = 'II';
    const romanoTomo = numSemana > 17 ? 'IV' : 'III';
    
    const semanaFinal = `${romanoSemana} Semana del Tiempo Ordinario`;

    // 5. Transformar las lecturas al formato que usa tu frontend ACCAR
    let readings = [];
    if (dataEWTN.lecturas.primera) readings.push({ type: 'FR', title: dataEWTN.lecturas.primera.titulo, text: dataEWTN.lecturas.primera.texto });
    if (dataEWTN.lecturas.salmo) readings.push({ type: 'PS', title: dataEWTN.lecturas.salmo.titulo, text: dataEWTN.lecturas.salmo.texto });
    if (dataEWTN.lecturas.segunda) readings.push({ type: 'SR', title: dataEWTN.lecturas.segunda.titulo, text: dataEWTN.lecturas.segunda.texto });
    if (dataEWTN.lecturas.evangelio) readings.push({ type: 'GSP', title: dataEWTN.lecturas.evangelio.titulo, text: dataEWTN.lecturas.evangelio.texto });

    // 6. Respuesta limpia y rapidísima al frontend
    res.status(200).json({
      fiestas: [{ 
          semana: fiestaTexto !== "" ? fiestaTexto : semanaFinal, 
          santo: fiestaTexto, 
          color: colorLiturgico, // ¡El color dinámico!
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