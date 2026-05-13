export default async function handler(req, res) {
  const { lat, lon } = req.query;

  const apiKey = process.env.WEATHER_API_KEY;

  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
  );

  const data = await response.json();

  res.status(200).json(data);
}