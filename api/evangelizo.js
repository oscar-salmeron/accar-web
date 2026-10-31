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
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml'
      }
    });

    if (!response.ok) {
        throw new Error('Error al conectar con el portal de evangelización.');
    }

    const htmlCrudo = await response.text();

    // 1. DESTRUCCIÓN DEL ENTORNO: Borramos menús, cabeza y pies de página para no extraer basura como "Donar" o "Inicio"
    let bodyHtml = htmlCrudo
        .replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '')
        .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
        .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
        .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

    // 2. CONVERSIÓN A TEXTO PLANO: Mantenemos la estructura de párrafos
    let textoPlano = bodyHtml
        .replace(/<\/(div|p|h[1-6]|li|article|section)>/gi, '\n\n')
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<[^>]+>/g, '') // Elimina todas las etiquetas restantes
        .replace(/&nbsp;/gi, ' ')
        .replace(/&aacute;/gi, 'á').replace(/&eacute;/gi, 'é').replace(/&iacute;/gi, 'í').replace(/&oacute;/gi, 'ó').replace(/&uacute;/gi, 'ú').replace(/&ntilde;/gi, 'ñ')
        .replace(/&[#a-z0-9]+;/gi, ''); // Borra entidades raras

    // Limpiamos los saltos de línea excesivos
    textoPlano = textoPlano.replace(/[ \t]+/g, ' ').replace(/\n\s*\n/g, '\n\n').trim();

    // 3. EXTRACCIÓN QUIRÚRGICA POR PÁRRAFOS
    const extraerSeccion = (texto, titulo, limitesFin) => {
        // Busca el título al principio de una línea para evitar falsos positivos
        const regexTitulo = new RegExp(`(^|\\n)\\s*${titulo}.*?\\n`, 'i');
        const match = texto.match(regexTitulo);
        if (!match) return null;

        const inicio = match.index + match[0].length;
        let fin = texto.length;

        // Marcamos el límite para que deje de copiar cuando encuentre la siguiente lectura o el pie de página
        for (const limite of limitesFin) {
            const regexLimite = new RegExp(`(^|\\n)\\s*${limite}`, 'i');
            const matchLimite = texto.substring(inicio).match(regexLimite);
            if (matchLimite) {
                const posibleFin = inicio + matchLimite.index;
                if (posibleFin < fin) fin = posibleFin;
            }
        }

        let contenido = texto.substring(inicio, fin).trim();
        // Convertimos de vuelta a HTML puro para inyectarlo bonito en tu frontend
        return contenido.replace(/\n\n/g, '<br><br>').replace(/\n/g, '<br>');
    };

    // Aplicamos los límites exactos de esa página web para extraer solo la Escritura
    const primeraLectura = extraerSeccion(textoPlano, 'Primera Lectura', ['Salmo', 'Evangelio', 'Reflexión']);
    const salmo = extraerSeccion(textoPlano, 'Salmo', ['Evangelio', 'Segunda Lectura', 'Reflexión']);
    const evangelio = extraerSeccion(textoPlano, 'Evangelio', ['Reflexión', 'Comentario', 'Lleva este contenido', 'Oración', 'Credo']);

    let readings = [];

    if (primeraLectura) readings.push({ type: 'FR', title: "Primera Lectura", text: primeraLectura });
    if (salmo) readings.push({ type: 'PS', title: "Salmo Responsorial", text: salmo });
    
    if (evangelio) {
        readings.push({ type: 'GSP', title: "Evangelio", text: evangelio });
    } else {
        readings.push({ type: 'GSP', title: "Evangelio", text: "No se pudo encontrar el texto. Es posible que el portal haya cambiado su estructura interna o no tenga lectura para hoy." });
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