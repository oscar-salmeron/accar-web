import * as cheerio from 'cheerio';

const CACHE_ANTIFONAS = new Map();

function extraerLineaRespuesta(htmlCrudo) {
  if (!htmlCrudo) return '';
  const normalizado = String(htmlCrudo)
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|li|h\d|tr)>/gi, '\n');

  const $ = cheerio.load(normalizado);
  const lineas = $.root().text()
    .split('\n')
    .map(l => l.replace(/\s+/g, ' ').trim())
    .filter(Boolean);

  for (const linea of lineas) {
    const m = linea.match(/^(?:R\/\.?|R\.|℟\.?)\s*(.+)$/i);
    if (m && m[1]) {
      const limpia = m[1]
        .replace(/^\([^)]{1,45}\)\s*/, '')
        .replace(/\s*(?:R\/\.?|R\.)$/, '')
        .trim();
      if (limpia.length > 4) return limpia;
    }
  }
  return '';
}

async function fetchConTimeout(url, ms = 2800) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  try {
    const r = await fetch(url, {
      signal: ctrl.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });
    if (!r.ok) return '';
    return await r.text();
  } catch (_) {
    return '';
  } finally {
    clearTimeout(timer);
  }
}

async function resolverAntifonaSalmo(dateParam, dataEWTN) {
  const salmoObj = dataEWTN?.lecturas?.salmo || {};

  // 1. Revisar si el propio JSON ya incluye la antífona en algún campo
  const directa = (
    salmoObj.antifona ||
    salmoObj.respuesta ||
    salmoObj.estribillo ||
    salmoObj.aclamacion ||
    salmoObj.r ||
    salmoObj.subtitulo ||
    dataEWTN?.antifona_salmo ||
    dataEWTN?.respuesta_salmo ||
    ''
  ).toString().trim();

  if (directa) {
    return directa.replace(/^(?:R\/\.?|R\.|℟\.?)\s*/i, '').trim();
  }

  // 2. Revisar si viene incrustada en la primera línea del texto
  const primerBloque = Array.isArray(salmoObj.texto) ? salmoObj.texto[0] : String(salmoObj.texto || '').split(/\n|<br/i)[0];
  const mTexto = String(primerBloque || '').trim().match(/^(?:R\/\.?|R\.|℟\.?)\s*(.+)$/i);
  if (mTexto && mTexto[1] && mTexto[1].trim().length > 4) {
    return mTexto[1].trim();
  }

  // 3. Consultar caché en memoria de la instancia
  if (CACHE_ANTIFONAS.has(dateParam)) {
    return CACHE_ANTIFONAS.get(dateParam);
  }

  // 4. Obtener antífona litúrgica oficial desde Evangelizo (con respaldo en USCCB Español)
  const ymd = dateParam.replace(/-/g, '');
  const htmlEv = await fetchConTimeout(`https://feed.evangelizo.org/v2/reader.php?date=${ymd}&type=reading&lang=SP&content=PS`);
  let antifona = extraerLineaRespuesta(htmlEv);

  if (!antifona) {
    const [yyyy, mm, dd] = dateParam.split('-');
    const htmlUsccb = await fetchConTimeout(`https://bible.usccb.org/es/bible/lecturas/${mm}${dd}${yyyy.slice(-2)}.cfm`);
    if (htmlUsccb) {
      const idxSalmo = htmlUsccb.search(/Salmo\s+Responsorial/i);
      const recorte = idxSalmo >= 0 ? htmlUsccb.slice(idxSalmo, idxSalmo + 4500) : htmlUsccb;
      antifona = extraerLineaRespuesta(recorte);
    }
  }

  if (antifona) {
    CACHE_ANTIFONAS.set(dateParam, antifona);
  }

  return antifona;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const rawDate = req.query?.date || req.url?.split('date=')[1]?.split('&')[0];
  const formatter = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Bogota' });
  const dateParam = /^\d{4}-\d{2}-\d{2}$/.test(String(rawDate || ''))
    ? rawDate
    : formatter.format(new Date());

  const targetUrl = `https://raw.githubusercontent.com/oscar-salmeron/accar-leccionario-script/refs/heads/main/datos/${dateParam}.json`;

  const DAY_MS = 86400000;

  const toRoman = (num) => {
    const lookup = { XXX: 30, XX: 20, X: 10, IX: 9, V: 5, IV: 4, I: 1 };
    let n = num;
    let roman = '';
    for (const k in lookup) {
      while (n >= lookup[k]) {
        roman += k;
        n -= lookup[k];
      }
    }
    return roman;
  };

  const makeUTC = (y, m, d) => new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  const addDaysUTC = (dt, days) => new Date(dt.getTime() + days * DAY_MS);
  const diffDaysUTC = (a, b) => Math.round((a.getTime() - b.getTime()) / DAY_MS);

  const getEasterUTC = (year) => {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day = ((h + l - 7 * m + 114) % 31) + 1;
    return makeUTC(year, month, day);
  };

  const getFirstSundayOfAdventUTC = (year) => {
    const christmas = makeUTC(year, 12, 25);
    const dow = christmas.getUTCDay();
    const offsetFourthSunday = dow === 0 ? 7 : dow;
    return addDaysUTC(christmas, -(offsetFourthSunday + 21));
  };

  const getBaptismSundayUTC = (year) => {
    const jan6 = makeUTC(year, 1, 6);
    const dow = jan6.getUTCDay();
    const daysToSunday = dow === 0 ? 7 : (7 - dow);
    return addDaysUTC(jan6, daysToSunday);
  };

  // Motor matemático completo del Año Litúrgico Romano
  const calcularCalendarioLiturgico = (fechaISO) => {
    const [yStr, mStr, dStr] = fechaISO.split('-');
    const year = parseInt(yStr, 10);
    const month = parseInt(mStr, 10);
    const day = parseInt(dStr, 10);
    const d = makeUTC(year, month, day);
    const dow = d.getUTCDay();
    const sundayOfWeek = addDaysUTC(d, -dow);

    const advent1 = getFirstSundayOfAdventUTC(year);
    const christmas = makeUTC(year, 12, 25);
    const baptismSunday = getBaptismSundayUTC(year);
    const easter = getEasterUTC(year);
    const ashWednesday = addDaysUTC(easter, -46);
    const lent1 = addDaysUTC(ashWednesday, 4);
    const palmSunday = addDaysUTC(easter, -7);
    const holyThursday = addDaysUTC(easter, -3);
    const goodFriday = addDaysUTC(easter, -2);
    const pentecost = addDaysUTC(easter, 49);
    const cristoRey = addDaysUTC(advent1, -7);

    // Año litúrgico (cambia en el I Domingo de Adviento)
    const litYear = d >= advent1 ? year + 1 : year;
    const modCiclo = litYear % 3;
    const ciclo = modCiclo === 1 ? 'CICLO A' : (modCiclo === 2 ? 'CICLO B' : 'CICLO C');
    const anio = litYear % 2 === 1 ? 'AÑO I' : 'AÑO II';

    let tiempo = 'Tiempo Ordinario';
    let semana = '';
    let colorTiempo = 'VERDE';
    let tomo = 'TOMO III';
    let psalterWeek = 1;
    let esDiaSupremo = false;

    // 1. ADVIENTO
    if (d >= advent1 && d < christmas) {
      tiempo = 'Adviento';
      const weekNum = Math.floor(diffDaysUTC(d, advent1) / 7) + 1;
      semana = `${toRoman(weekNum)} Semana de Adviento`;
      tomo = 'TOMO I';
      psalterWeek = ((weekNum - 1) % 4) + 1;
      colorTiempo = (dow === 0 && weekNum === 3) ? 'ROSADO' : 'MORADO';
      if (dow === 0) esDiaSupremo = true;
    }
    // 2. NAVIDAD (25 dic – Bautismo del Señor)
    else if (d >= christmas || d <= baptismSunday) {
      tiempo = 'Navidad';
      colorTiempo = 'BLANCO';
      tomo = 'TOMO I';
      if (month === 12 || (month === 1 && day === 1)) {
        semana = 'Octava de Navidad';
        psalterWeek = 1;
        if (month === 12 && day === 25) esDiaSupremo = true;
      } else if (month === 1 && day < 6) {
        semana = 'Tiempo de Navidad';
        psalterWeek = 2;
      } else {
        semana = diffDaysUTC(d, baptismSunday) === 0
          ? 'Fiesta del Bautismo del Señor'
          : 'Tiempo de Navidad';
        psalterWeek = 1;
        if (diffDaysUTC(d, baptismSunday) === 0 || (month === 1 && day === 6)) esDiaSupremo = true;
      }
    }
    // 3. TIEMPO ORDINARIO (1ª PARTE: tras Bautismo hasta víspera de Ceniza)
    else if (d > baptismSunday && d < ashWednesday) {
      tiempo = 'Tiempo Ordinario';
      const weekNum = Math.max(1, Math.round(diffDaysUTC(sundayOfWeek, baptismSunday) / 7) + 1);
      semana = `${toRoman(weekNum)} Semana del Tiempo Ordinario`;
      colorTiempo = 'VERDE';
      tomo = 'TOMO III';
      psalterWeek = ((weekNum - 1) % 4) + 1;
    }
    // 4. CUARESMA Y SEMANA SANTA
    else if (d >= ashWednesday && d < easter) {
      tomo = 'TOMO II';
      if (d < lent1) {
        tiempo = 'Cuaresma';
        semana = diffDaysUTC(d, ashWednesday) === 0 ? 'Miércoles de Ceniza' : 'Días después de Ceniza';
        colorTiempo = 'MORADO';
        psalterWeek = 4;
        if (diffDaysUTC(d, ashWednesday) === 0) esDiaSupremo = true;
      } else if (d < palmSunday) {
        tiempo = 'Cuaresma';
        const weekNum = Math.floor(diffDaysUTC(d, lent1) / 7) + 1;
        semana = `${toRoman(weekNum)} Semana de Cuaresma`;
        psalterWeek = ((weekNum - 1) % 4) + 1;
        colorTiempo = (dow === 0 && weekNum === 4) ? 'ROSADO' : 'MORADO';
        if (dow === 0) esDiaSupremo = true;
      } else {
        tiempo = 'Semana Santa';
        semana = 'Semana Santa';
        psalterWeek = 2;
        esDiaSupremo = true;
        if (diffDaysUTC(d, palmSunday) === 0 || diffDaysUTC(d, goodFriday) === 0) {
          colorTiempo = 'ROJO';
        } else if (diffDaysUTC(d, holyThursday) === 0) {
          colorTiempo = 'BLANCO';
        } else {
          colorTiempo = 'MORADO';
        }
      }
    }
    // 5. TIEMPO PASCUAL (Domingo de Pascua – Pentecostés)
    else if (d >= easter && d <= pentecost) {
      tiempo = 'Pascua';
      tomo = 'TOMO II';
      const weekNum = Math.floor(diffDaysUTC(d, easter) / 7) + 1;
      if (diffDaysUTC(d, pentecost) === 0) {
        semana = 'Domingo de Pentecostés';
        colorTiempo = 'ROJO';
        psalterWeek = 2;
        esDiaSupremo = true;
      } else if (weekNum === 1) {
        semana = 'Octava de Pascua';
        colorTiempo = 'BLANCO';
        psalterWeek = 1;
        esDiaSupremo = true;
      } else {
        semana = `${toRoman(weekNum)} Semana de Pascua`;
        colorTiempo = 'BLANCO';
        psalterWeek = ((weekNum - 1) % 4) + 1;
        if (dow === 0) esDiaSupremo = true;
      }
    }
    // 6. TIEMPO ORDINARIO (2ª PARTE: tras Pentecostés hasta víspera de Adviento)
    else {
      tiempo = 'Tiempo Ordinario';
      const diffWeeks = Math.round(diffDaysUTC(cristoRey, sundayOfWeek) / 7);
      let weekNum = 34 - diffWeeks;
      if (weekNum < 1) weekNum = 1;
      if (weekNum > 34) weekNum = 34;
      semana = `${toRoman(weekNum)} Semana del Tiempo Ordinario`;
      colorTiempo = 'VERDE';
      tomo = weekNum > 17 ? 'TOMO IV' : 'TOMO III';
      psalterWeek = ((weekNum - 1) % 4) + 1;
      if (diffDaysUTC(d, cristoRey) === 0) esDiaSupremo = true;
    }

    return {
      tiempo,
      semana,
      colorTiempo,
      ciclo,
      anio,
      tomo,
      salterio: `SALTERIO ${psalterWeek}ª SEMANA`,
      esDiaSupremo
    };
  };

  const inferirColorCelebracion = (fiestaStr, colorEwtn, colorTiempoBase) => {
    const f = String(fiestaStr || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toUpperCase()
      .trim();

    if (!f || f === 'FERIA') {
      return { colorMisa: colorTiempoBase, colorSanto: colorTiempoBase };
    }

    if (/\b(GAUDETE|LAETARE)\b/.test(f)) {
      return { colorMisa: 'ROSADO', colorSanto: 'ROSADO' };
    }

    if (/\b(MARTIR|MARTIRES|APOSTOL|APOSTOLES|EVANGELISTA|EXALTACION DE LA SANTA CRUZ|PRECIOSISIMA SANGRE|PENTECOSTES|DOMINGO DE RAMOS|VIERNES SANTO)\b/.test(f)) {
      return { colorMisa: 'ROJO', colorSanto: 'ROJO' };
    }

    if (/\b(VIRGEN MARIA|SANTISIMA VIRGEN|NUESTRA SENORA|MADRE DE DIOS|INMACULADA CONCEPCION|ASUNCION|GUADALUPE|LOURDES|FATIMA|CARMEN|MEDALLA MILAGROSA|PRESENTACION DE LA VIRGEN|NATIVIDAD DE LA VIRGEN|VISITACION|DULCE NOMBRE DE MARIA|SANTA MARIA)\b/.test(f)) {
      return { colorMisa: 'BLANCO', colorSanto: 'CELESTE' };
    }

    if (/\b(FIELES DIFUNTOS)\b/.test(f)) {
      return { colorMisa: 'MORADO', colorSanto: 'MORADO' };
    }

    if (/\b(ADVIENTO|CUARESMA|CENIZA)\b/.test(f)) {
      return { colorMisa: colorTiempoBase, colorSanto: colorTiempoBase };
    }

    if (/\b(VIRGEN|OBISPO|PAPA|PRESBITERO|SACERDOTE|ABAD|ABADESA|RELIGIOSO|RELIGIOSA|DOCTOR|CONFESOR|ANGEL|ARCANGEL|ARCANGELES|SENOR|JESUCRISTO|CRISTO|SANTISIMA TRINIDAD|CORPUS CHRISTI|BAUTISMO|TRANSFIGURACION|ASCENSION|TODOS LOS SANTOS|DEDICACION|SAGRADO CORAZON|SAGRADA FAMILIA|NATIVIDAD|EPIFANIA|SAN |SANTA |SANTOS |SANTAS )\b/.test(f)) {
      return { colorMisa: 'BLANCO', colorSanto: 'BLANCO' };
    }

    const fallback = String(colorEwtn || colorTiempoBase).toUpperCase();
    return { colorMisa: fallback, colorSanto: fallback };
  };

  const cal = calcularCalendarioLiturgico(dateParam);

  try {
    const response = await fetch(targetUrl);
    if (!response.ok) {
      return res.status(200).json({
        fiestas: [{
          tiempo: cal.tiempo,
          semana: cal.semana,
          santo: 'Feria',
          color: cal.colorTiempo,
          colorTiempo: cal.colorTiempo,
          colorCelebracion: cal.colorTiempo,
          esDiaSupremo: cal.esDiaSupremo,
          ciclo: cal.ciclo,
          anio: cal.anio,
          tomo: cal.tomo,
          salterio: cal.salterio
        }],
        readings: [],
        sinLecturas: true
      });
    }

    const dataEWTN = await response.json();
    const fiestaRaw = String(dataEWTN.fiesta || '').trim();
    const { colorMisa, colorSanto } = inferirColorCelebracion(fiestaRaw, dataEWTN.color, cal.colorTiempo);

    const lec = dataEWTN.lecturas || {};
    const antifonaSalmo = lec.salmo ? await resolverAntifonaSalmo(dateParam, dataEWTN) : '';
    const readings = [];
    if (lec.primera) readings.push({ type: 'FR', title: lec.primera.titulo, referencia: lec.primera.referencia, text: lec.primera.texto });
    if (lec.salmo) readings.push({ type: 'PS', title: lec.salmo.titulo, referencia: lec.salmo.referencia, antifona: antifonaSalmo, text: lec.salmo.texto });
    if (lec.segunda) readings.push({ type: 'SR', title: lec.segunda.titulo, referencia: lec.segunda.referencia, text: lec.segunda.texto });
    if (lec.evangelio) readings.push({ type: 'GSP', title: lec.evangelio.titulo, referencia: lec.evangelio.referencia, text: lec.evangelio.texto });
    if (lec.reflexion) readings.push({ type: 'RE', title: lec.reflexion.titulo, referencia: lec.reflexion.referencia, text: lec.reflexion.texto });

    return res.status(200).json({
      fiestas: [{
        tiempo: cal.tiempo,
        semana: cal.semana,
        santo: fiestaRaw !== '' ? fiestaRaw : 'Feria',
        color: colorMisa,
        colorTiempo: cal.colorTiempo,
        colorCelebracion: colorSanto,
        esDiaSupremo: cal.esDiaSupremo,
        ciclo: cal.ciclo,
        anio: cal.anio,
        tomo: cal.tomo,
        salterio: cal.salterio
      }],
      readings
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}