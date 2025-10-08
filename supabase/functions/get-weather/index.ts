import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { location } = await req.json();
    
    if (!location) {
      return new Response(
        JSON.stringify({ error: 'Location parameter is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Fetching weather for location:', location);
    
    // Using Open-Meteo free weather API (no API key required)
    // First, get coordinates for the location using geocoding
    const geoResponse = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`
    );
    
    if (!geoResponse.ok) {
      throw new Error('Failed to geocode location');
    }
    
    const geoData = await geoResponse.json();
    
    if (!geoData.results || geoData.results.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Location not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const { latitude, longitude, name, country } = geoData.results[0];
    
    // Get current weather
    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,wind_speed_10m&timezone=auto`
    );
    
    if (!weatherResponse.ok) {
      throw new Error('Failed to fetch weather data');
    }
    
    const weatherData = await weatherResponse.json();
    
    // Map weather codes to descriptions
    const weatherCodeMap: Record<number, { description: string, icon: string }> = {
      0: { description: 'Clear sky', icon: '☀️' },
      1: { description: 'Mainly clear', icon: '🌤️' },
      2: { description: 'Partly cloudy', icon: '⛅' },
      3: { description: 'Overcast', icon: '☁️' },
      45: { description: 'Foggy', icon: '🌫️' },
      48: { description: 'Foggy', icon: '🌫️' },
      51: { description: 'Light drizzle', icon: '🌦️' },
      53: { description: 'Moderate drizzle', icon: '🌧️' },
      55: { description: 'Dense drizzle', icon: '🌧️' },
      61: { description: 'Slight rain', icon: '🌧️' },
      63: { description: 'Moderate rain', icon: '🌧️' },
      65: { description: 'Heavy rain', icon: '⛈️' },
      71: { description: 'Light snow', icon: '🌨️' },
      73: { description: 'Moderate snow', icon: '❄️' },
      75: { description: 'Heavy snow', icon: '❄️' },
      80: { description: 'Rain showers', icon: '🌦️' },
      95: { description: 'Thunderstorm', icon: '⛈️' },
    };
    
    const weatherCode = weatherData.current.weather_code;
    const weatherInfo = weatherCodeMap[weatherCode] || { description: 'Unknown', icon: '🌡️' };
    
    return new Response(
      JSON.stringify({
        location: `${name}, ${country}`,
        temperature: Math.round(weatherData.current.temperature_2m),
        weatherDescription: weatherInfo.description,
        weatherIcon: weatherInfo.icon,
        windSpeed: weatherData.current.wind_speed_10m,
        coordinates: { latitude, longitude }
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error fetching weather:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
