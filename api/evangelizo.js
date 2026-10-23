export default async function handler(req, res) {
  // Configuración para que tu página web pueda recibir los datos sin bloqueos
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // --- ¡ATENCIÓN! PEGA TU CLAVE API AQUÍ ---
  // Reemplaza "SK_ACC_..." con la clave real que generaste en Magisterium.
  const apiKey = process.env.MAGISTERIUM_API_KEY || 'SK_ACC_PEGATUCLAVEAQUI';

  const targetUrl = 'https://www.magisterium.com/api/v1/chat/completions';
  
  // Tomamos la fecha que tu página web pide, o usamos la fecha de hoy por defecto
  const dateParam = req.query.date || new Date().toISOString().split('T')[0];

  // Le damos la orden exacta a la IA de Magisterium
  const prompt = `Actúa como un experto litúrgico católico. 
  Extrae las lecturas de la Misa Diaria para la fecha ${dateParam} según el leccionario de América Latina (CELAM / México / Argentina).
  Debes responder ÚNICAMENTE con un objeto JSON válido con esta estructura exacta, sin texto adicional, sin saludos, y sin markdown:
  {
    "fiestas": [
      { "title": "Nombre de la semana en romanos (ej: XXIX SEMANA DEL TIEMPO ORDINARIO)", "color": "Color litúrgico (VERDE, MORADO, BLANCO, ROJO)", "ciclo": "Ciclo actual (ej: CICLO A)", "anio": "Año actual (ej: AÑO II)" }
    ],
    "readings": [
      { "type": "FR", "title": "Cita Primera Lectura (ej: Efesios 4:1-6)", "text": "Texto completo de la primera lectura separado en párrafos." },
      { "type": "PS", "title": "Cita del Salmo", "text": "<strong>R/. Respuesta del salmo.</strong><br><br>Párrafos del salmo..." },
      { "type": "SR", "title": "Cita Segunda Lectura", "text": "Texto de la segunda lectura..." },
      { "type": "GSP", "title": "Cita Evangelio", "text": "Texto del evangelio..." },
      { "type": "RE", "title": "Reflexión del Día", "text": "Reflexión u homilía basada en las lecturas de hoy..." }
    ]
  }
  Nota: Si no hay Segunda Lectura, omite ese objeto. Mantén las citas bíblicas solo en el campo 'title'.`;

  try {
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'magisterium-1',
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Error de Magisterium: ${response.status} - ${errText}`);
    }

    const data = await response.json();
    const respuestaIA = data.choices[0].message.content;

    // Limpiamos la respuesta en caso de que la IA agregue comillas de bloque de código
    let jsonClean = respuestaIA.replace(/```json/gi, '').replace(/```/g, '').trim();
    const datosEstructurados = JSON.parse(jsonClean);

    res.status(200).json(datosEstructurados);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}