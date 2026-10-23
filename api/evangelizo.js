export default async function handler(req, res) {
  const { date } = req.query;
  const url = `https://dailygospel.org/v2/api/feed?date=${date}&lang=AM`;

  try {
    // Le ponemos un "disfraz" de navegador Chrome en Windows
    const respuesta = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'es-ES,es;q=0.9'
      }
    });
    
    // Si el servidor de Evangelizo nos rechaza, capturamos su código de rechazo exacto
    if (!respuesta.ok) {
      throw new Error(`Evangelizo rechazó la conexión (Status HTTP: ${respuesta.status})`);
    }
    
    const datos = await respuesta.json();
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(datos);
  } catch (error) {
    // Ahora enviamos a tu consola el error real exacto en lugar del genérico
    res.status(500).json({ error: error.message });
  }
}