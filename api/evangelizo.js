export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Recibimos la fecha (ej. 2026-10-30)
  const rawDate = req.query.date || new Date().toISOString().split('T')[0];
  // Formateamos para Universalis (ej. 20261030)
  const formattedDate = rawDate.replace(/-/g, '');
  
  // Endpoint público de Universalis en español (Europa/América Latina estándar)
  const targetUrl = `https://www.universalis.com/es-es/${formattedDate}/jsonpmass.js`;

  try {
    const response = await fetch(targetUrl);
    if (!response.ok) {
        throw new Error('Error de conexión con la fuente litúrgica: ' + response.status);
    }

    // Universalis devuelve un JSONP (envuelto en una función), lo limpiamos para convertirlo en JSON puro
    let rawText = await response.text();
    rawText = rawText.replace(/^universalisCallback\(/, '').replace(/\);$/, '');
    
    const dayData = JSON.parse(rawText);

    // Mapeo dinámico del color
    let colorTexto = "VERDE";
    if (dayData.color) {
        const c = dayData.color.toUpperCase();
        if (c === 'WHITE') colorTexto = 'BLANCO';
        else if (c === 'RED') colorTexto = 'ROJO';
        else if (c === 'PURPLE') colorTexto = 'MORADO';
        else if (c === 'ROSE') colorTexto = 'ROSADO';
        else if (c === 'GREEN') colorTexto = 'VERDE';
    }

    // Mapeo del día y celebración
    const santo = dayData.day || "Feria";
    const semana = dayData.date || "Tiempo Ordinario";

    // Reconstruimos el array de lecturas según lo exige tu diseño HTML
    let readings = [];

    // Primera Lectura
    if (dayData.Mass_R1) {
        readings.push({
            type: 'FR',
            title: dayData.Mass_R1.source || "Primera Lectura",
            text: dayData.Mass_R1.text || "Texto no disponible."
        });
    }
    // Salmo
    if (dayData.Mass_Ps) {
        readings.push({
            type: 'PS',
            title: dayData.Mass_Ps.source || "Salmo Responsorial",
            text: dayData.Mass_Ps.text || "Texto no disponible."
        });
    }
    // Segunda Lectura (solo si aplica el día)
    if (dayData.Mass_R2) {
        readings.push({
            type: 'SR',
            title: dayData.Mass_R2.source || "Segunda Lectura",
            text: dayData.Mass_R2.text || "Texto no disponible."
        });
    }
    // Evangelio
    if (dayData.Mass_G) {
        readings.push({
            type: 'GSP',
            title: dayData.Mass_G.source || "Evangelio",
            text: dayData.Mass_G.text || "Texto no disponible."
        });
    }

    // Reflexión simulada o genérica, ya que Universalis entrega solo los textos sagrados
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
          ciclo: "CICLO A", // Estos datos se pueden estandarizar desde el frontend o dejarlos fijos temporalmente
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