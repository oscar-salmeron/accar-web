export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const dateParam = req.query.date || new Date().toISOString().split('T')[0];
  
  // Apuntamos al portal tradicional que expone el texto crudo en su código fuente
  const targetUrl = `https://www.ciudadredonda.org/calendario-lecturas/evangelio-del-dia/?f=${dateParam}`;

  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml'
      }
    });

    if (!response.ok) {
        throw new Error('Error al conectar con la fuente litúrgica.');
    }

    const htmlCrudo = await response.text();

    // 1. DESTRUCCIÓN DEL ENTORNO: Borramos encabezados, scripts y menús para evitar palabras basura
    let bodyHtml = htmlCrudo
        .replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '')
        .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
        .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
        .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

    // 2. CONVERSIÓN A TEXTO PLANO
    let textoPlano = bodyHtml
        .replace(/<\/(div|p|h[1-6]|li|article|section)>/gi, '\n\n')
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<[^>]+>/g, '') // Elimina etiquetas restantes
        .replace(/&nbsp;/gi, ' ')
        .replace(/&aacute;/gi, 'á').replace(/&eacute;/gi, 'é').replace(/&iacute;/gi, 'í').replace(/&oacute;/gi, 'ó').replace(/&uacute;/gi, 'ú').replace(/&ntilde;/gi, 'ñ')
        .replace(/&[#a-z0-9]+;/gi, ''); // Borra entidades HTML extrañas

    textoPlano = textoPlano.replace(/[ \t]+/g, ' ').replace(/\n\s*\n/g, '\n\n').trim();

    // 3. EXTRACCIÓN QUIRÚRGICA: Calibrada para la estructura de Ciudad Redonda
    const extraerSeccion = (texto, regexInicioStr, limitesFinStr) => {
        const regexInicio = new RegExp(`(^|\\n)\\s*${regexInicioStr}.*?\\n`, 'i');
        const match = texto.match(regexInicio);
        if (!match) return null;

        const inicio = match.index + match[0].length;
        let fin = texto.length;

        for (const limite of limitesFinStr) {
            const regexLimite = new RegExp(`(^|\\n)\\s*${limite}`, 'i');
            const matchLimite = texto.substring(inicio).match(regexLimite);
            if (matchLimite) {
                const posibleFin = inicio + matchLimite.index;
                if (posibleFin < fin) fin = posibleFin;
            }
        }

        let contenido = texto.substring(inicio, fin).trim();
        return contenido.replace(/\n\n/g, '<br><br>').replace(/\n/g, '<br>');
    };

    // Palabras clave de búsqueda adaptadas a la nueva fuente
    const primeraLectura = extraerSeccion(textoPlano, '(?:Primera lectura|Lectura del libro)', ['Salmo', 'Evangelio', 'Segunda lectura']);
    const salmo = extraerSeccion(textoPlano, '(?:Salmo responsorial|Salmo)', ['Evangelio', 'Segunda lectura']);
    const evangelio = extraerSeccion(textoPlano, '(?:Evangelio)', ['Comentario', 'Homilía', 'Reflexión', 'Copyright']);

    let readings = [];

    if (primeraLectura) readings.push({ type: 'FR', title: "Primera Lectura", text: primeraLectura });
    if (salmo) readings.push({ type: 'PS', title: "Salmo Responsorial", text: salmo });
    
    if (evangelio) {
        readings.push({ type: 'GSP', title: "Evangelio", text: evangelio });
    } else {
        readings.push({ type: 'GSP', title: "Evangelio", text: "No se pudo extraer el texto de la nueva fuente estática. Es posible que no haya lecturas disponibles para esta fecha." });
    }

    readings.push({
        type: 'RE',
        title: "Reflexión del Día",
        text: "La liturgia de hoy nos invita a meditar sobre la Palabra proclamada y a llevarla a la práctica en nuestra vida diaria."
    });

    const datosEstructurados = {
      fiestas: [
        { 
          semana: "Tiempo Ordinario", 
          santo: "Santo del Día", 
          color: "VERDE", 
          ciclo: "CICLO A", 
          anio: "AÑO II"
        }
      ],
      readings: readings
    };

    res.status(200).json(datosEstructurados);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}