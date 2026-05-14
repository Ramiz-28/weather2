export default async function handler(req, res) {
  const { city, lat, lon } = req.query;
  const API_KEY = process.env.WEATHER_KEY;

  let weatherURL = "";
  let forecastURL = "";

  if (city) {
    weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
    forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;
  } else if (lat && lon) {
    weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  } else {
    return res.status(400).json({ error: "Missing parameters" });
  }

  try {
    const weatherRes = await fetch(weatherURL);
    const forecastRes = await fetch(forecastURL);

    const weather = await weatherRes.json();
    const forecast = await forecastRes.json();

    res.status(200).json({ weather, forecast });
  } catch (err) {
    res.status(500).json({ error: "API failed" });
  }
}