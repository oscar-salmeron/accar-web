export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Recibimos la fecha de tu web
  const dateParam = req.query.date || new Date().toISOString().split('T')[0];
  
  // Apuntamos directamente a la fuente sugerida (América Latina)
  // Pasamos la fecha como parámetro por si el sitio lo soporta nativamente en la URL
  const targetUrl = `https://evangelizacion.org.mx/evangelio-de-hoy/?date=${dateParam}`;

  try {
    // Entramos disfrazados de navegador para evitar bloqueos
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

    // LIMPIEZA INTELIGENTE: Transformamos el HTML en texto puro, respetando los párrafos
    let textoLimpio = htmlCrudo
        .replace(/<\/(p|div|h[1-6])>/gi, '\n\n') // Convierte cierres de bloque en saltos de línea doble (para los párrafos)
        .replace(/<br\s*\/?>/gi, '\n') // Convierte etiquetas br en saltos simples
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Borra código Javascript interno
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '') // Borra estilos
        .replace(/<[^>]+>/g, '') // Elimina cualquier otra etiqueta HTML restante
        .replace(/&nbsp;/gi, ' ') // Limpia espacios en blanco HTML
        .replace(/&aacute;/gi, 'á').replace(/&eacute;/gi, 'é').replace(/&iacute;/gi, 'í').replace(/&oacute;/gi, 'ó').replace(/&uacute;/gi, 'ú').replace(/&ntilde;/gi, 'ñ');

    // EXTRACCIÓN DE SECCIONES (Buscamos las palabras clave en el texto)
    const extraerSeccion = (textoCompleto, inicioPalabra, finPalabras) => {
        const regexInicio = new RegExp(inicioPalabra, 'i');
        const matchInicio = textoCompleto.match(regexInicio);
        if (!matchInicio) return null;

        const inicioIndex = matchInicio.index + matchInicio[0].length;
        let finIndex = textoCompleto.length;

        for (const finPalabra of finPalabras) {
            const matchFin = textoCompleto.substring(inicioIndex).match(new RegExp(finPalabra, 'i'));
            if (matchFin) {
                const tempFin = inicioIndex + matchFin.index;
                if (tempFin < finIndex) finIndex = tempFin;
            }
        }

        let bloque = textoCompleto.substring(inicioIndex, finIndex).trim();
        // Convertimos los saltos de línea de texto a HTML para tu frontend
        return bloque.replace(/(?:\r\n|\r|\n){2,}/g, '<br><br>');
    };

    // Buscamos los bloques exactos en el documento
    const primeraLectura = extraerSeccion(textoLimpio, 'Primera Lectura', ['Salmo', 'Evangelio', 'Segunda Lectura', 'Reflexión']);
    const salmo = extraerSeccion(textoLimpio, 'Salmo Responsorial|Salmo', ['Evangelio', 'Segunda Lectura', 'Reflexión', 'Comentario']);
    const evangelio = extraerSeccion(textoLimpio, 'Evangelio', ['Reflexión', 'Comentario', 'Oración', 'Propósito']);

    let readings = [];

    if (primeraLectura) {
        readings.push({ type: 'FR', title: "Primera Lectura", text: primeraLectura });
    }
    if (salmo) {
        readings.push({ type: 'PS', title: "Salmo Responsorial", text: salmo });
    }
    if (evangelio) {
        readings.push({ type: 'GSP', title: "Evangelio", text: evangelio });
    } else {
        readings.push({ type: 'GSP', title: "Evangelio", text: "No se pudo extraer el texto. El sitio podría estar protegido." });
    }

    readings.push({
        type: 'RE',
        title: "Reflexión del Día",
        text: "La liturgia de hoy nos invita a meditar sobre la Palabra proclamada y a llevarla a la práctica en nuestra vida diaria."
    });

    // Formato de la tarjeta "Celebramos" (Se pueden afinar más tarde si la web origen los entrega limpios)
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