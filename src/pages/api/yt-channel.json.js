import { YOUTUBE_API_KEY, YOUTUBE_CHANNEL_ID } from "astro:env/server";

let cachedData = null;
let lastUpdate = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hora

async function updateCache() {
  try {
    const apiUrl = `https://www.googleapis.com/youtube/v3/channels?key=${YOUTUBE_API_KEY}&id=${YOUTUBE_CHANNEL_ID}&part=contentDetails,statistics`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`YouTube API respondió con estado: ${response.status}`);
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      throw new Error("No se encontraron datos del canal");
    }

    cachedData = data;
    lastUpdate = Date.now();
    return true;
  } catch (error) {
    console.error("Error al actualizar la caché:", error);
    return false;
  }
}

export async function GET() {
  try {
    const now = Date.now();
    const cacheExpired = !lastUpdate || now - lastUpdate > CACHE_DURATION;

    if (!cachedData || cacheExpired) {
      const updated = await updateCache();
      if (!updated) {
        // Si la actualización falló y no hay datos en caché, retorna error
        if (!cachedData) {
          return new Response(
            JSON.stringify({
              error: "No se pudieron obtener los datos del canal",
            }),
            {
              status: 500,
              headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-cache",
              },
            }
          );
        }
        // Si hay datos en caché, los usamos aunque estén expirados
        console.warn("Usando datos en caché expirados");
      }
    }

    return new Response(JSON.stringify(cachedData), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": `public, max-age=${Math.floor(CACHE_DURATION / 1000)}`,
      },
    });
  } catch (error) {
    console.error("Error en GET:", error);
    return new Response(
      JSON.stringify({ error: "Error interno del servidor" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
      }
    );
  }
}
