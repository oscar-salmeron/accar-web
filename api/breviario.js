export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const horaParams = {
      'ufficio': 'readings',
      'laudi': 'lauds',
      'media': 'terce', // Usaremos Tercia como predeterminada para hora intermedia
      'vespri': 'vespers',
      'compieta': 'compline'
  };

  const horaReq = req.query.hora || 'laudi';
  const apiHora = horaParams[horaReq] || 'lauds';
  
  // Utilizamos una fuente alternativa estable (Liturgy API) o similar que permita CORS/Server requests
  const targetUrl = `https://universalis.com/es-ES/${apiHora}.json`;

  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
        throw new Error('Error al conectar con el servicio litúrgico.');
    }

    const data = await response.json();
    
    if (!data.text) {
        throw new Error('Respuesta vacía del servidor.');
    }

    // Convertimos la respuesta JSON en HTML preservando saltos de línea y rúbricas (texto entre asteriscos suele ser rúbrica)
    let textoFormateado = data.text
        .replace(/\n/g, '<br><br>')
        .replace(/\*(.*?)\*/g, '<span style="color: #ff4d4d; font-weight: 600;">$1</span>') // Rúbricas en rojo
        .replace(/V\./g, '<span style="color: #ff4d4d; font-weight: 600;">V.</span>')
        .replace(/R\./g, '<span style="color: #ff4d4d; font-weight: 600;">R.</span>')
        .replace(/Ant\./g, '<span style="color: #ff4d4d; font-weight: 600;">Ant.</span>');

    res.status(200).json({ html: `<p>${textoFormateado}</p>` });

  } catch (error) {
    console.error("Error en breviario.js:", error.message);
    res.status(500).json({ error: error.message });
  }
}