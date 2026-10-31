export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const dateParam = req.query.date || new Date().toISOString().split('T')[0];
  const targetUrl = `https://evangelizacion.org.mx/evangelio-de-hoy/?date=${dateParam}`;

  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!response.ok) throw new Error('Error de red al conectar con la fuente.');

    const htmlCrudo = await response.text();

    // 1. LIMPIEZA DRÁSTICA: Destruimos menús, pies de página y formularios de suscripción desde la raíz
    let bodyHtml = htmlCrudo
        .replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '')
        .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
        .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
        .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<form[^>]*>[\s\S]*?<\/form>/gi, ''); 

    // Convertimos a texto plano respetando la separación de bloques
    let textoPlano = bodyHtml
        .replace(/<\/(div|p|h[1-6]|li|article|section)>/gi, '\n\n')
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<[^>]+>/g, '') 
        .replace(/&nbsp;/gi, ' ')
        .replace(/&aacute;/gi, 'á').replace(/&eacute;/gi, 'é').replace(/&iacute;/gi, 'í')
        .replace(/&oacute;/gi, 'ó').replace(/&uacute;/gi, 'ú').replace(/&ntilde;/gi, 'ñ')
        .replace(/&[#a-z0-9]+;/gi, '');

    // 2. CONVERSIÓN A PÁRRAFOS 
    let lineas = textoPlano.split('\n\n')
        .map(l => l.replace(/\n/g, ' ').replace(/[ \t]+/g, ' ').trim())
        .filter(l => l.length > 0);

    // 3. FILTRO ANTIMANCHAS: Borramos toda la basura de UI, suscripciones y donaciones
    const palabrasBasura = [
        "Recibir por email", "Recibir por WhatsApp", "Recibir por Telegram", 
        "Suscríbete", "Tu nombre", "Tu correo", "Quiero recibir noticias", 
        "Suscribirme ahora", "¡Todo listo!", "Entendido", "Lleva este contenido a más almas", 
        "Únete a la misión", "Selecciona un monto", "MXN", "Donar ahora", "Compartir este evento",
        "No hay eventos", "Evangelio de mañana", "Evangelio del domingo", "Calendario", "Ver detalle"
    ];

    lineas = lineas.filter(l => {
        let lUpper = l.toUpperCase();
        return !palabrasBasura.some(pb => lUpper.includes(pb.toUpperCase()));
    });

    // 4. EXTRACCIÓN DE SEMANA Y SANTO
    let semanaInfo = "Tiempo Ordinario";
    let santoInfo = "Santo del Día";
    
    let idxSemana = lineas.findIndex(l => (l.includes("Semana") || l.includes("Lecturas del")) && l.length > 10 && l.length < 150);
    if (idxSemana !== -1) {
        semanaInfo = lineas[idxSemana];
        // Atrapamos al santo en la línea siguiente, asegurando que no sea un título litúrgico
        let posibleSanto = lineas[idxSemana + 1];
        if (posibleSanto && posibleSanto.length < 100 && !posibleSanto.toUpperCase().includes("LECTURA") && !posibleSanto.toUpperCase().includes("EVANGELIO")) {
            santoInfo = posibleSanto;
        }
    }

    // 5. MOTOR DE EXTRACCIÓN POR BLOQUES
    const extraerBloque = (claves, paradas) => {
        // Encontramos el título (ej. "Primera Lectura")
        let startIdx = lineas.findIndex(l => claves.some(c => l.toUpperCase() === c.toUpperCase() || (l.toUpperCase().includes(c.toUpperCase()) && l.length <= 35)));
        if (startIdx === -1) return null;

        // La cita bíblica siempre queda en la línea siguiente tras limpiar la basura
        let title = lineas[startIdx + 1];
        let textLines = [];

        // Copiamos los párrafos hasta chocar con un límite
        for (let i = startIdx + 2; i < lineas.length; i++) {
            let p = lineas[i];
            let pUpper = p.toUpperCase();
            
            // Freno si empieza la siguiente lectura o la reflexión
            if (paradas.some(parada => pUpper === parada.toUpperCase() || (pUpper.includes(parada.toUpperCase()) && p.length <= 35))) {
                break;
            }

            // Freno final si dice "Palabra de Dios"
            if (pUpper.includes("PALABRA DE DIOS") || pUpper.includes("PALABRA DEL SEÑOR")) {
                textLines.push(p);
                break;
            }

            textLines.push(p);
        }

        return {
            title: title || claves[0],
            text: textLines.join('<br><br>')
        };
    };

    const primeraLectura = extraerBloque(["Primera Lectura"], ["Salmo", "Evangelio", "Segunda Lectura", "Reflexión"]);
    const salmo = extraerBloque(["Salmo", "Salmo Responsorial"], ["Evangelio", "Segunda Lectura", "Reflexión"]);
    const evangelio = extraerBloque(["Evangelio"], ["Reflexión", "Comentario", "Oración"]);

    let readings = [];
    if (primeraLectura) readings.push({ type: 'FR', title: primeraLectura.title, text: primeraLectura.text });
    if (salmo) readings.push({ type: 'PS', title: salmo.title, text: salmo.text });
    
    if (evangelio) {
        readings.push({ type: 'GSP', title: evangelio.title, text: evangelio.text });
    } else {
        readings.push({ type: 'GSP', title: "Evangelio", text: "El texto del Evangelio no pudo ser procesado correctamente." });
    }

    readings.push({
        type: 'RE',
        title: "Reflexión del Día",
        text: "La liturgia de hoy nos invita a meditar sobre la Palabra proclamada y a llevarla a la práctica en nuestra vida diaria."
    });

    res.status(200).json({
      fiestas: [{ semana: semanaInfo, santo: santoInfo, color: "VERDE", ciclo: "CICLO A", anio: "AÑO II" }],
      readings: readings
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}