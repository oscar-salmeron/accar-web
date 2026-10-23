export default async function handler(req, res) {
  // Atrapamos la fecha que nos envíe tu página web
  const { date } = req.query;
  const url = `https://dailygospel.org/v2/api/feed?date=${date}&lang=AM`;

  try {
    const respuesta = await fetch(url);
    const datos = await respuesta.json();
    
    // Le indicamos a Vercel que desactive los bloqueos CORS para tu aplicación
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(datos);
  } catch (error) {
    res.status(500).json({ error: 'Error interno conectando con el leccionario.' });
  }
}