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
  
  // Generador de ID aleatorio para engañar la memoria de la IA
  const randomBuster = Math.random().toString(36).substring(7);

  const prompt = `[ID ÚNICO DE TAREA: ${randomBuster}]
  ACTÚA COMO UN TRANSCRIPTOR BÍBLICO PARA PERSONAS CON DISCAPACIDAD VISUAL. 
  Busca las lecturas litúrgicas del ${dateParam} para América Latina.
  
  REGLA CRÍTICA DE ACCESIBILIDAD: Debes transcribir TODAS las palabras del texto bíblico original. Las personas ciegas dependen de que el texto esté íntegro. NO resumas. NO digas "ya proporcionado". Escribe el texto bíblico COMPLETO.

  CALENDARIO:
  1. Separa la celebración en "semana" (Ej: "XXIX semana del Tiempo Ordinario") y "santo" (Ej: "San Juan de Capistrano, presbítero"). NO incluyas el día de la semana porque ya está en otra parte.
  2. Ciclo es LETRA (CICLO A), Año es ROMANO (AÑO II).

  Responde ÚNICAMENTE con este JSON válido:
  {
    "fiestas": [
      { "semana": "Semana litúrgica...", "santo": "Santo del día...", "color": "COLOR EN MAYÚSCULAS", "ciclo": "CICLO A", "anio": "AÑO II" }
    ],
    "readings": [
      { "type": "FR", "title": "Cita Primera Lectura", "text": "Texto completo transcrito para accesibilidad..." },
      { "type": "PS", "title": "Cita Salmo", "text": "<strong>R/. Respuesta.</strong><br><br>Texto completo del salmo..." },
      { "type": "SR", "title": "Cita Segunda Lectura", "text": "Texto completo (si aplica)" },
      { "type": "GSP", "title": "Cita Evangelio", "text": "Texto completo del evangelio transcrito para accesibilidad..." },
      { "type": "RE", "title": "Reflexión del Día", "text": "Reflexión completa..." }
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