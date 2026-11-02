export default async function handler(req, res) {
  // Destrucción total del caché para garantizar la lectura de hoy
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Forzar estrictamente la zona horaria de Bogotá (UTC-5)
  const formatter = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Bogota' });
  const dateParam = formatter.format(new Date()); 

  const targetUrl = `https://www.ciudadredonda.org/calendario-lecturas/evangelio-del-dia/?f=${dateParam}&_t=${Date.now()}`;

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

  const calcularSemanaLiturgica = (fecha) => {
      const d = new Date(`${fecha}T12:00:00Z`);
      const year = d.getFullYear();
      let cristoRey = new Date(`${year}-11-26T12:00:00Z`);
      while (cristoRey.getDay() !== 0) cristoRey.setDate(cristoRey.getDate() - 1);
      
      const diffTime = cristoRey.getTime() - d.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      let weekNumber = 34 - Math.floor(diffDays / 7);
      if (weekNumber < 1) weekNumber = 1;
      if (weekNumber > 34) weekNumber = 34;
      return weekNumber;
  };

  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
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

    let santoFinal = "Feria";
    let colorLiturgico = "VERDE";
    
    const numSemana = calcularSemanaLiturgica(dateParam);
    const romanoSemana = toRoman(numSemana);
    const numSalterio = ((numSemana - 1) % 4) + 1;
    let romanoSalterio = toRoman(numSalterio);
    if(numSemana === 34) romanoSalterio = 'II';
    const romanoTomo = numSemana > 17 ? 'IV' : 'III';
    
    const semanaFinal = `${romanoSemana} Semana del Tiempo Ordinario`;

    let infoIdx = lineas.findIndex(l => (l.includes("Semana") || l.includes("Domingo") || l.includes("Solemnidad") || l.includes("Fiesta")) && l.includes("."));
    if (infoIdx !== -1) {
        let partes = lineas[infoIdx].split('.');
        santoFinal = partes.slice(1).join('.').trim() || "Feria";
    }

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

    const primeraLectura = extraerLectura("Primera Lectura", ["Salmo", "Salmo responsorial"]);
    const salmo = extraerLectura("Salmo", ["Segunda Lectura", "Evangelio", "Aleluya", "Aclamación"]);
    const segundaLectura = extraerLectura("Segunda Lectura", ["Evangelio", "Aleluya", "Aclamación"]);
    const evangelio = extraerLectura("Evangelio", ["Comentario al Evangelio", "Liturgia", "Calendario", "Síguenos"]);
    const reflexion = extraerLectura("Comentario al Evangelio", ["Liturgia", "Calendario", "Síguenos"]);

    const limpiarTitulo = (titulo) => {
        if (!titulo) return "";
        let t = titulo;
        t = t.replace(/Lectura del santo evangelio según san\s+/i, 'San ');
        t = t.replace(/Lectura del santo evangelio según\s+/i, '');
        t = t.replace(/Lectura de la primera carta del apóstol san\s+/i, '1ra San ');
        t = t.replace(/Lectura de la segunda carta del apóstol san\s+/i, '2da San ');
        t = t.replace(/Lectura de la tercera carta del apóstol san\s+/i, '3ra San ');
        t = t.replace(/Lectura de la primera carta del apóstol\s+/i, '1ra ');
        t = t.replace(/Lectura de la segunda carta del apóstol\s+/i, '2da ');
        t = t.replace(/Lectura de la primera carta de san\s+/i, '1ra San ');
        t = t.replace(/Lectura de la segunda carta de san\s+/i, '2da San ');
        t = t.replace(/Lectura de la carta del apóstol san Pablo a los\s+/i, '');
        t = t.replace(/Lectura de la carta del apóstol san Pablo a\s+/i, '');
        t = t.replace(/Lectura de la carta a los\s+/i, '');
        t = t.replace(/Lectura del libro de los\s+/i, '');
        t = t.replace(/Lectura del libro del\s+/i, '');
        t = t.replace(/Lectura del libro de\s+/i, '');
        t = t.replace(/Lectura de los\s+/i, '');
        t = t.replace(/Lectura de la\s+/i, '');
        if (t.endsWith(':')) t = t.slice(0, -1).trim();
        return t;
    };

    if (salmo && salmo.title) {
        salmo.title = salmo.title.replace(/^(Salmo responsorial|Salmo|Sal)\s+/i, 'responsorial ');
    }

    let readings = [];
    if (primeraLectura && primeraLectura.title) readings.push({ type: 'FR', title: limpiarTitulo(primeraLectura.title), text: primeraLectura.text });
    if (salmo && salmo.title) readings.push({ type: 'PS', title: salmo.title, text: salmo.text });
    if (segundaLectura && segundaLectura.title) readings.push({ type: 'SR', title: limpiarTitulo(segundaLectura.title), text: segundaLectura.text });
    if (evangelio && evangelio.title) readings.push({ type: 'GSP', title: limpiarTitulo(evangelio.title), text: evangelio.text });

    if (reflexion && reflexion.text.length > 20) {
        let textoReflexionCompleto = reflexion.title + "<br><br>" + reflexion.text;
        readings.push({ type: 'RE', title: "Comentario al Evangelio", text: textoReflexionCompleto });
    }

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