export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // --- ¡ATENCIÓN! PEGA TU CLAVE API AQUÍ ADENTRO ---
  const apiKey = process.env.MAGISTERIUM_API_KEY || 'sk_accar_9c7e095020d5d25a4508c147ecbc7d0b2ab9f086835beb3d35aa40b20b46af6d';

  const targetUrl = 'https://www.magisterium.com/api/v1/chat/completions';
  const dateParam = req.query.date || new Date().toISOString().split('T')[0];

  // Orden mucho más estricta para la IA
  const prompt = `Eres una API de datos. Devuelve ÚNICAMENTE un objeto JSON válido con las lecturas de la Misa católica del ${dateParam} para América Latina (CELAM). 
  PROHIBIDO usar Markdown. PROHIBIDO usar símbolos como "##". PROHIBIDO agregar texto antes o después del JSON. 
  Estructura obligatoria:
  {
    "fiestas": [
      { "title": "Nombre semana en romanos", "color": "VERDE", "ciclo": "CICLO A", "anio": "AÑO II" }
    ],
    "readings": [
      { "type": "FR", "title": "Cita Primera Lectura", "text": "Texto primera lectura..." },
      { "type": "PS", "title": "Cita Salmo", "text": "<strong>R/. Respuesta.</strong><br><br>Texto salmo..." },
      { "type": "SR", "title": "Cita Segunda Lectura", "text": "Texto segunda lectura..." },
      { "type": "GSP", "title": "Cita Evangelio", "text": "Texto evangelio..." },
      { "type": "RE", "title": "Reflexión del Día", "text": "Reflexión..." }
    ]
  }`;

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
        throw new Error(`Error de conexión: ${response.status}`);
    }

    const data = await response.json();
    const respuestaIA = data.choices[0].message.content;

    // EL FILTRO INTELIGENTE: Busca solo el bloque de datos y descarta el texto conversacional de la IA
    const jsonMatch = respuestaIA.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        throw new Error("La IA no devolvió un formato válido.");
    }

    const datosEstructurados = JSON.parse(jsonMatch[0]);

    res.status(200).json(datosEstructurados);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}