export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const rawDate = req.query.date || new Date().toISOString().split('T')[0];
  const formattedDate = rawDate.replace(/-/g, '');
  
  const targetUrl = `https://www.universalis.com/es-es/${formattedDate}/jsonpmass.js`;

  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/javascript, */*',
        'Accept-Language': 'es-ES,es;q=0.9'
      }
    });

    if (!response.ok) {
        throw new Error('Error de conexión con la fuente litúrgica: ' + response.status);
    }

    const rawText = await response.text();
    
    // EXTRACCIÓN QUIRÚRGICA: Buscamos el inicio y fin exacto del objeto JSON
    const startIndex = rawText.indexOf('{');
    const endIndex = rawText.lastIndexOf('}');
    
    if (startIndex === -1 || endIndex === -1) {
        throw new Error("No se pudo extraer la estructura de datos de Universalis.");
    }

    // Cortamos exclusivamente el JSON puro para evitar tokens inválidos
    const cleanJsonString = rawText.substring(startIndex, endIndex + 1);
    
    // Parseo nativo 100% seguro
    const dayData = JSON.parse(cleanJsonString);

    let colorTexto = "VERDE";
    if (dayData.color) {
        const c = dayData.color.toUpperCase();
        if (c.includes('WHITE') || c.includes('BLANCO')) colorTexto = 'BLANCO';
        else if (c.includes('RED') || c.includes('ROJO')) colorTexto = 'ROJO';
        else if (c.includes('PURPLE') || c.includes('VIOLET') || c.includes('MORADO')) colorTexto = 'MORADO';
        else if (c.includes('ROSE') || c.includes('ROSADO')) colorTexto = 'ROSADO';
        else if (c.includes('GREEN') || c.includes('VERDE')) colorTexto = 'VERDE';
    }

    const santo = dayData.day || "Feria";
    const semana = dayData.date || "Tiempo Ordinario";

    let readings = [];

    if (dayData.Mass_R1) {
        readings.push({
            type: 'FR',
            title: dayData.Mass_R1.source || "Primera Lectura",
            text: dayData.Mass_R1.text || "Texto no disponible."
        });
    }
    if (dayData.Mass_Ps) {
        readings.push({
            type: 'PS',
            title: dayData.Mass_Ps.source || "Salmo Responsorial",
            text: dayData.Mass_Ps.text || "Texto no disponible."
        });
    }
    if (dayData.Mass_R2) {
        readings.push({
            type: 'SR',
            title: dayData.Mass_R2.source || "Segunda Lectura",
            text: dayData.Mass_R2.text || "Texto no disponible."
        });
    }
    if (dayData.Mass_G) {
        readings.push({
            type: 'GSP',
            title: dayData.Mass_G.source || "Evangelio",
            text: dayData.Mass_G.text || "Texto no disponible."
        });
    }

    readings.push({
        type: 'RE',
        title: "Reflexión del Día",
        text: "La liturgia de hoy nos invita a meditar sobre la Palabra proclamada y a llevarla a la práctica en nuestra vida diaria."
    });

    const datosEstructurados = {
      fiestas: [
        { 
          semana: semana, 
          santo: santo, 
          color: colorTexto, 
          ciclo: "CICLO A", // Datos fijos temporales
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