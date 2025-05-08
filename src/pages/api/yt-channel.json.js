import { YOUTUBE_API_KEY, YOUTUBE_CHANNEL_ID } from "astro:env/server";

// Variables para almacenar la caché y el timestamp de la última actualización
let cachedData = null;
let lastUpdate = 0;

// Función para actualizar la caché
async function updateCache() {
  try {
    const apiUrl = `https://www.googleapis.com/youtube/v3/channels?key=${YOUTUBE_API_KEY}&id=${YOUTUBE_CHANNEL_ID}&part=contentDetails&part=statistics`;
    const response = await fetch(apiUrl);
    cachedData = await response.json();
    lastUpdate = Date.now();
  } catch (error) {
    console.error("Error al actualizar la caché:", error);
  }
}

// Actualización inmediata y luego cada hora (3600000 ms)
updateCache();
setInterval(updateCache, 60 * 60 * 1000);

export async function GET() {
  // Si la caché aún no está disponible, se actualiza de forma sincrónica
  if (!cachedData) {
    await updateCache();
  }

  return new Response(JSON.stringify(cachedData), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
