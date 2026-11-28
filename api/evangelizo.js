import http from 'node:http';
import https from 'node:https';
import zlib from 'node:zlib';
import * as cheerio from 'cheerio';

const CACHE_ANTIFONAS = new Map();

function descargarTextoRemoto(urlStr, timeoutMs = 4200, redirectCount = 0) {
  return new Promise((resolve) => {
    if (!urlStr || redirectCount > 3) return resolve('');
    let settled = false;
    const finalizar = (val) => {
      if (!settled) {
        settled = true;
        resolve(val || '');
      }
    };

    try {
      const u = new URL(urlStr);
      const mod = u.protocol === 'https:' ? https : http;
      const req = mod.get(
        urlStr,
        {
          rejectUnauthorized: false,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8',
            'Accept-Language': 'es-ES,es;q=0.9',
            'Accept-Encoding': 'gzip, deflate'
          }
        },
        (res) => {
          const code = res.statusCode || 0;
          if ([301, 302, 303, 307, 308].includes(code) && res.headers.location) {
            res.resume();
            const nextUrl = new URL(res.headers.location, urlStr).toString();
            descargarTextoRemoto(nextUrl, timeoutMs, redirectCount + 1).then(finalizar);
            return;
          }
          if (code < 200 || code >= 300) {
            res.resume();
            return finalizar('');
          }

          const encoding = String(res.headers['content-encoding'] || '').toLowerCase();
          let stream = res;
          if (encoding.includes('gzip')) {
            stream = res.pipe(zlib.createGunzip());
          } else if (encoding.includes('deflate')) {
            stream = res.pipe(zlib.createInflate());
          }

          const chunks = [];
          stream.on('data', (chunk) => chunks.push(chunk));
          stream.on('end', () => {
            try {
              const buf = Buffer.concat(chunks);
              const ctype = String(res.headers['content-type'] || '').toLowerCase();
              let texto = ctype.includes('iso-8859-1') || ctype.includes('latin1')
                ? buf.toString('latin1')
                : buf.toString('utf8');
              if (texto.includes('\uFFFD')) {
                texto = buf.toString('latin1');
              }
              finalizar(texto);
            } catch (_) {
              finalizar('');
            }
          });
          stream.on('error', () => finalizar(''));
        }
      );

      req.setTimeout(timeoutMs, () => {
        req.destroy();
        finalizar('');
      });
      req.on('error', () => finalizar(''));
    } catch (_) {
      finalizar('');
    }
  });
}

function limpiarCandidatoAntifona(raw) {
  if (!raw) return '';
  let s = String(raw)
    .replace(/\s+/g, ' ')
    .replace(/^(?:R\s*\/\.?|R\.|R:|℟\.?|Respuesta:?)\s*/i, '')
    .replace(/^\((?:cf\.?\s*)?[0-9A-Za-zÁÉÍÓÚÜÑáéíóúüñ.,:\-\s]{1,48}\)\s*/, '')
    .replace(/\s*(?:R\s*\/\.?|R\.|℟\.?)\s*$/i, '')
    .trim();

  if (s.length < 5 || s.length > 210) return '';
  if (/^(?:te alabamos|gloria a ti|demos gracias|alabanza a ti|palabra de|lectura de|salmo\s*\d|salmo\s+responsorial|sal\.?\s*\d|\d)/i.test(s)) {
    return '';
  }
  if (/extra[íi]do de|copyright|derechos reservados|evangelizo|conferencia episcopal|libro del pueblo de dios/i.test(s)) {
    return '';
  }
  if (!/[.!?»”]$/.test(s)) {
    s += '.';
  }
  return s;
}

function extraerAntifonaDeSalmoPuro(htmlCrudo) {
  if (!htmlCrudo) return '';
  const normalizado = String(htmlCrudo)
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|li|h\d|tr)>/gi, '\n');

  const $ = cheerio.load(normalizado);
  const lineas = $.root().text()
    .split('\n')
    .map(l => l.replace(/\s+/g, ' ').trim())
    .filter(l => l && !/extra[íi]do de|copyright|evangelizo|libro del pueblo de dios|todos los derechos/i.test(l));

  // 1. Línea explícita iniciada con R. / R/. / ℟
  for (const linea of lineas) {
    const m = linea.match(/^(?:R\s*\/\.?|R\.|R:|℟\.?)\s*(.+)$/i);
    if (m && m[1]) {
      const cand = limpiarCandidatoAntifona(m[1]);
      if (cand) return cand;
    }
  }

  // 2. Estribillo repetido entre estrofas (formato de Evangelizo en español sin "R.")
  const conteo = new Map();
  const originalPorClave = new Map();
  for (const linea of lineas) {
    const clave = linea
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '');
    if (clave.length < 6) continue;
    conteo.set(clave, (conteo.get(clave) || 0) + 1);
    if (!originalPorClave.has(clave)) originalPorClave.set(clave, linea);
  }
  for (const [clave, num] of conteo.entries()) {
    if (num >= 2) {
      const cand = limpiarCandidatoAntifona(originalPorClave.get(clave));
      if (cand) return cand;
    }
  }

  // 3. Primera línea destacada en negrita o cursiva al encabezar el Salmo
  const $raw = cheerio.load(String(htmlCrudo));
  const primerDestacado = $raw('b, strong, i, em').first().text().trim();
  if (primerDestacado) {
    const cand = limpiarCandidatoAntifona(primerDestacado);
    if (cand) return cand;
  }

  return '';
}

function extraerAntifonaDePaginaCompleta(htmlPagina) {
  if (!htmlPagina) return '';
  const $limpio = cheerio.load(String(htmlPagina));
  $limpio('script, style, noscript, nav, header, footer, aside').remove();

  const htmlSinRuido = $limpio.html() || '';
  const normalizado = htmlSinRuido
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|li|h\d|tr|blockquote|section|article)>/gi, '\n');

  const $ = cheerio.load(normalizado);
  const lineas = $.root().text()
    .split('\n')
    .map(l => l.replace(/\s+/g, ' ').trim())
    .filter(Boolean);

  for (let i = 0; i < lineas.length; i++) {
    const lin = lineas[i];
    if (lin.length < 95 && /^(?:salmo(?:\s+responsorial)?\b|sal\.?\s*\d+)/i.test(lin)) {
      const bloqueSalmo = [];
      for (let j = i; j < Math.min(lineas.length, i + 45); j++) {
        if (j > i && /^(?:segunda\s+lectura|2[ªa]\s+lectura|evangelio\b|lectura\s+del\s+santo\s+evangelio|aclamaci[óo]n\s+antes)/i.test(lineas[j])) {
          break;
        }
        bloqueSalmo.push(lineas[j]);
      }

      for (const bLin of bloqueSalmo) {
        const m = bLin.match(/^(?:R\s*\/\.?|R\.|R:|℟\.?)\s*(.+)$/i) || bLin.match(/(?:^|\s)(?:R\s*\/\.?|℟\.?)\s*(.+)$/i);
        if (m && m[1]) {
          const cand = limpiarCandidatoAntifona(m[1]);
          if (cand) return cand;
        }
      }

      const candRep = extraerAntifonaDeSalmoPuro(bloqueSalmo.join('\n'));
      if (candRep) return candRep;
    }
  }
  return '';
}

async function resolverAntifonaSalmo(dateParam, dataEWTN) {
  const salmoObj = dataEWTN?.lecturas?.salmo || {};

  // 1. Revisar si el propio JSON ya incluye la antífona
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

  const directaLimpia = limpiarCandidatoAntifona(directa);
  if (directaLimpia) return directaLimpia;

  // 2. Revisar si viene en la primera línea del texto del JSON
  const primerBloque = Array.isArray(salmoObj.texto) ? salmoObj.texto[0] : String(salmoObj.texto || '').split(/\n|<br/i)[0];
  const mTexto = String(primerBloque || '').trim().match(/^(?:R\s*\/\.?|R\.|℟\.?)\s*(.+)$/i);
  if (mTexto && mTexto[1]) {
    const candLocal = limpiarCandidatoAntifona(mTexto[1]);
    if (candLocal) return candLocal;
  }

  // 3. Consultar caché en memoria
  if (CACHE_ANTIFONAS.has(dateParam)) {
    return CACHE_ANTIFONAS.get(dateParam);
  }

  const exigirNoVacio = async (fn) => {
    const res = await fn();
    if (res && res.trim()) return res.trim();
    throw new Error('vacio');
  };

  const [yyyy, mm, dd] = dateParam.split('-');
  const ymd = `${yyyy}${mm}${dd}`;
  const dNum = parseInt(dd, 10);
  const mNum = parseInt(mm, 10);

  // 4. Consulta paralela ultrarrápida a 5 fuentes litúrgicas oficiales
  try {
    const antifona = await Promise.any([
      exigirNoVacio(async () => {
        const html = await descargarTextoRemoto(`https://www.ciudadredonda.org/calendario-lecturas/evangelio-del-dia/?f=${dateParam}`);
        return extraerAntifonaDePaginaCompleta(html);
      }),
      exigirNoVacio(async () => {
        const rawJson = await descargarTextoRemoto(`https://publication.evangelizo.ws/SP/days/${dateParam}`);
        if (!rawJson) return '';
        const parsed = JSON.parse(rawJson);
        const lecturas = parsed?.data?.readings || parsed?.readings || [];
        const ps = lecturas.find(r =>
          r?.type === 'psalm' ||
          /salmo|c[áa]ntico/i.test(String(r?.title || r?.liturgic_title || ''))
        );
        if (!ps) return '';
        return (
          limpiarCandidatoAntifona(ps.chorus || ps.refrain || ps.antiphon || '') ||
          (/^R\b/i.test(String(ps.liturgic_title || '').trim()) ? limpiarCandidatoAntifona(ps.liturgic_title) : '') ||
          extraerAntifonaDeSalmoPuro(ps.text || '')
        );
      }),
      exigirNoVacio(async () => {
        const html = await descargarTextoRemoto(`http://feed.evangelizo.org/v2/reader.php?date=${ymd}&type=reading&lang=SP&content=PS`);
        return extraerAntifonaDeSalmoPuro(html);
      }),
      exigirNoVacio(async () => {
        const html = await descargarTextoRemoto(`https://www.dominicos.org/predicacion/evangelio-del-dia/${dNum}-${mNum}-${yyyy}/`);
        return extraerAntifonaDePaginaCompleta(html);
      }),
      exigirNoVacio(async () => {
        const html = await descargarTextoRemoto(`https://bible.usccb.org/es/bible/lecturas/${mm}${dd}${yyyy.slice(-2)}.cfm`);
        return extraerAntifonaDePaginaCompleta(html);
      })
    ]);

    if (antifona) {
      CACHE_ANTIFONAS.set(dateParam, antifona);
      return antifona;
    }
  } catch (_) {
    // Ninguna fuente externa devolvió resultado
  }

  return '';
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

    if (d >= advent1 && d < christmas) {
      tiempo = 'Adviento';
      const weekNum = Math.floor(diffDaysUTC(d, advent1) / 7) + 1;
      semana = `${toRoman(weekNum)} Semana de Adviento`;
      tomo = 'TOMO I';
      psalterWeek = ((weekNum - 1) % 4) + 1;
      colorTiempo = (dow === 0 && weekNum === 3) ? 'ROSADO' : 'MORADO';
      if (dow === 0) esDiaSupremo = true;
    } else if (d >= christmas || d <= baptismSunday) {
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
    } else if (d > baptismSunday && d < ashWednesday) {
      tiempo = 'Tiempo Ordinario';
      const weekNum = Math.max(1, Math.round(diffDaysUTC(sundayOfWeek, baptismSunday) / 7) + 1);
      semana = `${toRoman(weekNum)} Semana del Tiempo Ordinario`;
      colorTiempo = 'VERDE';
      tomo = 'TOMO III';
      psalterWeek = ((weekNum - 1) % 4) + 1;
    } else if (d >= ashWednesday && d < easter) {
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
    } else if (d >= easter && d <= pentecost) {
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
    } else {
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