export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const rawDate = req.query?.date || req.url.split('date=')[1]?.split('&')[0];
  const formatter = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Bogota' });
  const dateParam = rawDate || formatter.format(new Date()); 

  const targetUrl = `https://raw.githubusercontent.com/oscar-salmeron/accar-leccionario-script/refs/heads/main/datos/${dateParam}.json`;

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

  // Lógica inteligente para inferir el color litúrgico desde el nombre de la fiesta
  const inferirColorLiturgico = (fiestaStr, colorEwtn) => {
      if (!fiestaStr) return colorEwtn || "VERDE";
      
      const f = fiestaStr.toUpperCase();
      
      // Mártires, Apóstoles, Espíritu Santo, Pasión = ROJO
      if (f.includes("MÁRTIR") || f.includes("MARTIR") || f.includes("APÓSTOL") || f.includes("EVANGELISTA") || f.includes("CRUZ") || f.includes("SANGRE") || f.includes("PENTECOSTÉS")) {
          return "ROJO";
      }
      
      // Virgen María, Santos (no mártires), Pastores, Doctores, Ángeles, Fiestas del Señor = BLANCO
      if (f.includes("VIRGEN") || f.includes("OBISPO") || f.includes("PAPA") || f.includes("DOCTOR") || f.includes("CONFESOR") || f.includes("ÁNGEL") || f.includes("ARCÁNGEL") || f.includes("SEÑOR") || f.includes("CRISTO") || f.includes("SANTÍSIMA") || f.includes("SANTISIMA") || f.includes("BAUTISMO") || f.includes("TRANSFIGURACIÓN") || f.includes("ASCENSIÓN") || f.includes("ASUNCIÓN") || f.includes("TODOS LOS SANTOS") || f.includes("DIFUNTOS") || f.includes("DEDICACIÓN") || f.includes("SAGRADO CORAZÓN")) {
          // Nota: Difuntos puede ser Morado o Negro, pero el Blanco también está permitido litúrgicamente y es común.
          return "BLANCO";
      }
      
      // Tiempos de penitencia (Adviento, Cuaresma) o Difuntos = MORADO
      if (f.includes("ADVIENTO") || f.includes("CUARESMA") || f.includes("CENIZA") || f.includes("FIELES DIFUNTOS")) {
          return "MORADO";
      }
      
      // Domingos Gaudete/Laetare = ROSADO
      if (f.includes("GAUDETE") || f.includes("LAETARE")) {
          return "ROSADO";
      }

      return colorEwtn || "VERDE";
  };

  try {
    const response = await fetch(targetUrl);
    if (!response.ok) throw new Error('Lecturas no encontradas en la base de datos.');

    const dataEWTN = await response.json();

    const fiestaRaw = (dataEWTN.fiesta || "").trim(); 
    
    // Calculamos el color dinámicamente usando nuestra nueva función
    const colorLiturgico = inferirColorLiturgico(fiestaRaw, dataEWTN.color);
    
    const numSemana = calcularSemanaLiturgica(dateParam);
    const romanoSemana = toRoman(numSemana);
    let numSalterio = numSemana % 4;
    if (numSalterio === 0) numSalterio = 4;
    let romanoSalterio = toRoman(numSalterio);
    if(numSemana === 34) romanoSalterio = 'II';
    const romanoTomo = numSemana > 17 ? 'IV' : 'III';
    
    const semanaFinal = `${romanoSemana} Semana del Tiempo Ordinario`;

    let readings = [];
    if (dataEWTN.lecturas.primera) readings.push({ type: 'FR', title: dataEWTN.lecturas.primera.titulo, referencia: dataEWTN.lecturas.primera.referencia, text: dataEWTN.lecturas.primera.texto });
    if (dataEWTN.lecturas.salmo) readings.push({ type: 'PS', title: dataEWTN.lecturas.salmo.titulo, referencia: dataEWTN.lecturas.salmo.referencia, text: dataEWTN.lecturas.salmo.texto });
    if (dataEWTN.lecturas.segunda) readings.push({ type: 'SR', title: dataEWTN.lecturas.segunda.titulo, referencia: dataEWTN.lecturas.segunda.referencia, text: dataEWTN.lecturas.segunda.texto });
    if (dataEWTN.lecturas.evangelio) readings.push({ type: 'GSP', title: dataEWTN.lecturas.evangelio.titulo, referencia: dataEWTN.lecturas.evangelio.referencia, text: dataEWTN.lecturas.evangelio.texto });

    res.status(200).json({
      fiestas: [{ 
          semana: semanaFinal, 
          santo: fiestaRaw !== "" ? fiestaRaw : "Feria", 
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