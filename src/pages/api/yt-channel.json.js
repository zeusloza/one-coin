import { YOUTUBE_API_KEY, YOUTUBE_CHANNEL_ID } from "astro:env/server";

// Variables para almacenar la caché y el timestamp de la última actualización
let cachedData = null;
let lastUpdate = 0;

async function updateCache() {
  console.log("Intentando actualizar la caché de estadísticas del canal...");
  const apiUrl = `https://www.googleapis.com/youtube/v3/channels?key=${YOUTUBE_API_KEY}&id=${YOUTUBE_CHANNEL_ID}&part=statistics`;
  console.log("URL de la API de YouTube:", apiUrl); // Ten cuidado si estos logs son accesibles públicamente

  try {
    const response = await fetch(apiUrl);
    console.log(
      `Respuesta de la API de YouTube: status=${response.status}, statusText=${response.statusText}`
    );

    if (!response.ok) {
      const errorBody = await response.text(); // Obtener el cuerpo del error como texto
      console.error(
        `Error de la API de YouTube (${response.status}): ${errorBody}`
      );
      return; // Salir si la respuesta no es ok
    }

    const data = await response.json();
    // Verifica la estructura de los datos esperados antes de asignarlos
    if (
      data &&
      data.items &&
      data.items.length > 0 &&
      data.items[0].statistics
    ) {
      cachedData = data; // Almacena toda la respuesta o la parte relevante
      lastUpdate = Date.now();
      console.log("Caché de estadísticas del canal actualizada exitosamente.");
    } else {
      console.error(
        "Estructura de datos inesperada recibida de la API de YouTube:",
        data
      );
    }
  } catch (error) {
    console.error(
      "Error crítico al actualizar la caché de estadísticas del canal:",
      error.message,
      error.stack
    );
  }
}

// Actualización inmediata y luego cada hora (3600000 ms)
updateCache();
setInterval(updateCache, 60 * 60 * 1000);

export async function GET() {
  if (
    !cachedData ||
    !cachedData.items ||
    cachedData.items.length === 0 ||
    !cachedData.items[0].statistics
  ) {
    console.warn(
      "Devolviendo error 503: No hay datos de estadísticas del canal disponibles en la caché."
    );
    return new Response(
      JSON.stringify({
        error:
          "No se pudieron obtener las estadísticas del canal en este momento.",
        details:
          "La información no está disponible en la caché del servidor o la actualización falló.",
      }),
      {
        status: 503, // Service Unavailable
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  return new Response(JSON.stringify(cachedData), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=300",
    },
  });
}
