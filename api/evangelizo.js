export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  let dateParam = req.query.date || new Date().toISOString().split('T')[0];
  
  // Protección: Evangelizo rechaza años futuros como 2026. Forzamos 2024 temporalmente para extraer datos reales.
  if (dateParam.startsWith('2025') || dateParam.startsWith('2026')) {
    dateParam = dateParam.replace(/^202[56]/, '2024');
  }
  
  // Conexión a Evangelizo (Canal AM: América Latina/CELAM) sin IA y sin claves.
  const targetUrl = 'https://api.evangelizo.org/v2/days/' + dateParam + '?lang=AM';

  try {
    const response = await fetch(targetUrl);
    if (!response.ok) {
        throw new Error('Error de conexión con Evangelizo: ' + response.status);
    }

    const data = await response.json();
    const dayData = data.data;

    let colorTexto = "VERDE";
    if (dayData.liturgic_color && dayData.liturgic_color.name) {
        const c = dayData.liturgic_color.name.toUpperCase();
        if (c.includes('WHITE') || c.includes('BLANCO')) colorTexto = 'BLANCO';
        else if (c.includes('RED') || c.includes('ROJO')) colorTexto = 'ROJO';
        else if (c.includes('PURPLE') || c.includes('MORADO') || c.includes('VIOLET')) colorTexto = 'MORADO';
        else if (c.includes('ROSE') || c.includes('ROSADO')) colorTexto = 'ROSADO';
    }

    let santo = "Feria";
    if (dayData.saints && dayData.saints.length > 0) {
        santo = dayData.saints[0].name;
    } else if (dayData.feast_title) {
        santo = dayData.feast_title;
    }

    let readings = [];
    let readingCount = 0;

    if (dayData.readings) {
        dayData.readings.forEach(r => {
            let tipo = 'RE';
            if (r.type === 'reading') {
                readingCount++;
                tipo = readingCount === 1 ? 'FR' : 'SR';
            } else if (r.type === 'psalm') {
                tipo = 'PS';
            } else if (r.type === 'gospel') {
                tipo = 'GSP';
            }

            readings.push({
                type: tipo,
                title: r.title || '',
                text: r.text || 'Texto no disponible.'
            });
        });
    }

    const datosEstructurados = {
      fiestas: [
        { 
          semana: dayData.liturgic_title || "Tiempo Ordinario", 
          santo: santo, 
          color: colorTexto, 
          ciclo: "CICLO " + (dayData.liturgic_cycle || "A"), 
          anio: "AÑO " + (dayData.liturgic_year || "II")
        }
      ],
      readings: readings
    };

    res.status(200).json(datosEstructurados);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}