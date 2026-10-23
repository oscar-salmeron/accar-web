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

  const prompt = `[ID DE TAREA: ${randomBuster}]
  Eres una imprenta bíblica automatizada. Tu única función es extraer e imprimir los versículos completos de la Misa del ${dateParam}.
  
  REGLAS DE IMPRENTA INQUEBRANTABLES:
  1. TEXTOS COMPLETOS OBLIGATORIOS: ESTÁ ESTRICTAMENTE PROHIBIDO que el campo "text" contenga solo la cita (ej. "Lucas 12, 54-59"). Debes imprimir el texto bíblico COMPLETO de los versículos, palabra por palabra, en español. No puedes resumir ni evadir el trabajo.
  2. PROHIBICIÓN DE EXCUSAS: Si tu fuente primaria está en inglés, redacta los versículos íntegros en español usando tu conocimiento interno de la Biblia Católica.
  3. LISTA NEGRA PARA EL CALENDARIO: El campo "semana" TIENE PROHIBIDO incluir la palabra Lunes, Martes, Miércoles, Jueves, Viernes, Sábado o Domingo. Debe comenzar directamente con la semana (Ej: "XXIX semana del Tiempo Ordinario").
  4. CICLO Y AÑO: "ciclo" siempre es una LETRA (Ej: "CICLO A"), "anio" siempre es un NÚMERO ROMANO (Ej: "AÑO II").

  Responde ÚNICAMENTE con este JSON válido:
  {
    "fiestas": [
      { "semana": "Semana litúrgica sin el día...", "santo": "Santo del día...", "color": "COLOR EN MAYÚSCULAS", "ciclo": "CICLO A", "anio": "AÑO II" }
    ],
    "readings": [
      { "type": "FR", "title": "Cita Primera Lectura", "text": "Texto completo desarrollado palabra por palabra en español..." },
      { "type": "PS", "title": "Cita Salmo", "text": "<strong>R/. Respuesta.</strong><br><br>Texto completo del salmo en español..." },
      { "type": "SR", "title": "Cita Segunda Lectura", "text": "Texto completo en español (si aplica)" },
      { "type": "GSP", "title": "Cita Evangelio", "text": "Texto completo desarrollado palabra por palabra en español..." },
      { "type": "RE", "title": "Reflexión del Día", "text": "Reflexión completa en español..." }
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