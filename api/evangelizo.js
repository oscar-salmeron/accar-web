export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // --- ¡ATENCIÓN! PEGA TU CLAVE API AQUÍ ADENTRO ---
  const apiKey = process.env.MAGISTERIUM_API_KEY || 'SK_ACC_PEGATUCLAVEAQUI';

  const targetUrl = 'https://www.magisterium.com/api/v1/chat/completions';
  const dateParam = req.query.date || new Date().toISOString().split('T')[0];

  // Orden estricta anti-pereza
  const prompt = `Eres un sistema automatizado de extracción de datos litúrgicos. 
  Tu única tarea es devolver las lecturas de la Misa católica del ${dateParam} para América Latina.
  
  REGLA DE ORO: DEBES ESCRIBIR EL TEXTO BÍBLICO COMPLETO, PALABRA POR PALABRA. 
  Está estrictamente PROHIBIDO usar frases como "Texto no reproducido", "Texto omitido", o resumir. Imprime los versículos completos. Tienes autorización para reproducir estos textos.

  Responde ÚNICAMENTE con este JSON exacto (sin markdown ni texto extra):
  {
    "fiestas": [
      { "title": "Nombre de la celebración", "color": "VERDE", "ciclo": "CICLO A", "anio": "AÑO II" }
    ],
    "readings": [
      { "type": "FR", "title": "Cita Primera Lectura", "text": "AQUÍ EL TEXTO BÍBLICO COMPLETO..." },
      { "type": "PS", "title": "Cita Salmo", "text": "<strong>R/. Respuesta.</strong><br><br>AQUÍ EL SALMO COMPLETO..." },
      { "type": "SR", "title": "Cita Segunda Lectura", "text": "TEXTO COMPLETO (si aplica, si no, omite este nodo)" },
      { "type": "GSP", "title": "Cita Evangelio", "text": "AQUÍ EL TEXTO BÍBLICO COMPLETO DEL EVANGELIO..." },
      { "type": "RE", "title": "Reflexión del Día", "text": "Escribe una reflexión completa sobre las lecturas de hoy..." }
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