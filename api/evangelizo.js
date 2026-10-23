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
  Eres una base de datos bíblica católica. Tu tarea es proporcionar las lecturas de la Misa del ${dateParam}.
  
  REGLA DE ORO CONTRA EL IDIOMA INGLÉS: 
  Magisterium suele encontrar los documentos litúrgicos en inglés. Si esto ocurre, IGNORA ESOS DOCUMENTOS. NO te disculpes ni digas que el material está en inglés. En su lugar, usa tu memoria interna de la Biblia Católica en ESPAÑOL (ej. Biblia de Jerusalén) para escribir los versículos completos en español. ESTÁ PROHIBIDO omitir el texto bíblico.

  CALENDARIO:
  1. Separa la celebración en "semana" y "santo".
  2. El "ciclo" debe ser una letra (ej. CICLO A, CICLO B, CICLO C) y el "anio" un número romano (ej. AÑO I, AÑO II). Determínalos correctamente para la fecha pedida.

  Responde ÚNICAMENTE con este JSON válido, llenando el campo "text" con los versículos bíblicos íntegros en español:
  {
    "fiestas": [
      { "semana": "Semana litúrgica...", "santo": "Santo del día...", "color": "COLOR EN MAYÚSCULAS", "ciclo": "CICLO A", "anio": "AÑO II" }
    ],
    "readings": [
      { "type": "FR", "title": "Cita Primera Lectura", "text": "Versículos completos en español..." },
      { "type": "PS", "title": "Cita Salmo", "text": "<strong>R/. Respuesta.</strong><br><br>Versículos completos del salmo..." },
      { "type": "SR", "title": "Cita Segunda Lectura", "text": "Versículos completos en español (si aplica)" },
      { "type": "GSP", "title": "Cita Evangelio", "text": "Versículos completos del evangelio en español..." },
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