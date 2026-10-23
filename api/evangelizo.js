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

  // Orden estricta de amnesia, calendario exacto y traducción obligatoria
  const prompt = `IGNORA CUALQUIER CONVERSACIÓN PREVIA. Eres un servidor de base de datos automatizado sin memoria. 
  Calcula el calendario litúrgico y extrae las lecturas de la Misa católica del ${dateParam} para América Latina.
  
  REGLAS ESTRICTAS INQUEBRANTABLES:
  1. TRADUCCIÓN OBLIGATORIA: Si tu fuente está en inglés, TRADÚCELA ÍNTEGRAMENTE al español católico. ESTÁ PROHIBIDO dar excusas sobre el idioma original o dejar textos sin reproducir. Imprime los versículos completos.
  2. CALENDARIO EXACTO: El campo "title" de la fiesta debe decir el día exacto de la semana, la semana del tiempo litúrgico y el santo (Ej: "Viernes de la XXIX semana del Tiempo Ordinario; San Juan de Capistrano, presbítero").

  Responde ÚNICAMENTE con este JSON (sin markdown, sin saludos):
  {
    "fiestas": [
      { "title": "Día de la semana de la X semana del Tiempo Ordinario", "color": "COLOR EN MAYÚSCULAS", "ciclo": "CICLO X", "anio": "AÑO X" }
    ],
    "readings": [
      { "type": "FR", "title": "Cita Primera Lectura", "text": "Texto completo en español..." },
      { "type": "PS", "title": "Cita Salmo", "text": "<strong>R/. Respuesta.</strong><br><br>Texto del salmo en español..." },
      { "type": "SR", "title": "Cita Segunda Lectura", "text": "Texto completo en español (si aplica)" },
      { "type": "GSP", "title": "Cita Evangelio", "text": "Texto completo del evangelio en español..." },
      { "type": "RE", "title": "Reflexión del Día", "text": "Reflexión en español..." }
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