import { YOUTUBE_API_KEY, YOUTUBE_PLAYLIST_ID } from "astro:env/server";

let cachedData = null;
let lastUpdate = 0;
const CACHE_DURATION = 60 * 60 * 1000;

async function updateCache() {
  try {
    let allPlaylistItems = [];
    let nextPageToken = null;
    const MAX_RESULTS_PER_PAGE = 50; // Máximo permitido por la API
    let pagesFetched = 0; // Contador de páginas obtenidas
    const MAX_PAGES_TO_FETCH = 2; // Límite de páginas a obtener

    do {
      let apiPlaylistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?key=${YOUTUBE_API_KEY}&playlistId=${YOUTUBE_PLAYLIST_ID}&part=snippet,contentDetails&maxResults=${MAX_RESULTS_PER_PAGE}`;
      if (nextPageToken) {
        apiPlaylistUrl += `&pageToken=${nextPageToken}`;
      }

      const responsePlaylist = await fetch(apiPlaylistUrl);
      if (!responsePlaylist.ok) {
        const errorData = await responsePlaylist.text(); // Leer el cuerpo para más detalles
        throw new Error(
          `Error al obtener items de la playlist (${responsePlaylist.status}): ${responsePlaylist.statusText} - ${errorData}`
        );
      }
      const playlistData = await responsePlaylist.json();

      if (playlistData.items) {
        allPlaylistItems = allPlaylistItems.concat(playlistData.items);
      }
      nextPageToken = playlistData.nextPageToken;
      pagesFetched++; // Incrementar el contador de páginas
      console.log(
        `Obtenidos ${
          playlistData.items?.length || 0
        } videos (Página ${pagesFetched}). Siguiente página: ${!!nextPageToken}`
      );
    } while (nextPageToken && pagesFetched < MAX_PAGES_TO_FETCH); // Condición para limitar las páginas

    console.log(
      `Total de videos obtenidos antes de filtrar: ${allPlaylistItems.length}`
    );

    const videoIds = allPlaylistItems.map(
      (item) => item.contentDetails.videoId
    );
    const durationMap = {};
    const chunkSize = 50;

    console.log("Obteniendo duraciones de videos...");

    for (let i = 0; i < videoIds.length; i += chunkSize) {
      const videoIdsChunk = videoIds.slice(i, i + chunkSize);
      const apiVideoUrl = `https://www.googleapis.com/youtube/v3/videos?key=${YOUTUBE_API_KEY}&id=${videoIdsChunk.join(
        ","
      )}&part=contentDetails`;
      const responseVideos = await fetch(apiVideoUrl);
      if (!responseVideos.ok) {
        const errorData = await responseVideos.text();
        console.warn(
          `Advertencia: Error al obtener detalles de videos (${
            responseVideos.status
          }): ${
            responseVideos.statusText
          } - ${errorData}. IDs: ${videoIdsChunk.join(",")}`
        );
        videoIdsChunk.forEach((id) => (durationMap[id] = 0));
        continue;
      }
      const videosData = await responseVideos.json();

      videosData.items?.forEach((video) => {
        if (video.contentDetails?.duration) {
          durationMap[video.id] = convertYTDurationToMinutes(
            video.contentDetails.duration
          );
        } else {
          console.warn(`Video ${video.id} no tiene duración en la respuesta.`);
          durationMap[video.id] = 0;
        }
      });
      console.log(
        `Procesadas duraciones para ${
          videosData.items?.length || 0
        } videos (lote ${i / chunkSize + 1})`
      );
    }

    const filteredItems = allPlaylistItems.filter((item) => {
      const duration = durationMap[item.contentDetails.videoId];

      return duration !== undefined && duration >= 4;
    });

    console.log(
      `Total de videos después de filtrar (>= 4 min): ${filteredItems.length}`
    );

    cachedData = { items: filteredItems };
    lastUpdate = Date.now();
    console.log("Actualización de caché completada.");
  } catch (error) {
    console.error("Error fatal durante la actualización de la caché:", error);
  }
}

// Función auxiliar para convertir duración de YouTube (PT1H2M10S) a minutos
function convertYTDurationToMinutes(duration) {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0; // Retorna 0 si el formato no coincide
  const hours = parseInt(match[1] || 0);
  const minutes = parseInt(match[2] || 0);
  const seconds = parseInt(match[3] || 0);

  return hours * 60 + minutes + seconds / 60;
}

function startCacheUpdateInterval() {
  // Actualización inmediata al inicio
  updateCache()
    .then(() => {
      console.log("Actualización inicial completada.");
      // Configurar actualizaciones periódicas después de la primera
      setInterval(updateCache, CACHE_DURATION);
      console.log(
        `Actualizaciones periódicas configuradas cada ${
          CACHE_DURATION / (60 * 1000)
        } minutos.`
      );
    })
    .catch((error) => {
      console.error("Error en la actualización inicial:", error);
      // Reintentar después de un tiempo o configurar el intervalo de todos modos
      console.log(
        `Reintentando la configuración del intervalo después de un error inicial.`
      );
      setInterval(updateCache, CACHE_DURATION);
    });
}

// Iniciar el proceso de actualización
startCacheUpdateInterval();

export async function GET() {
  const now = Date.now();

  // Si la caché está vacía o expiró (aunque setInterval debería mantenerla fresca), actualiza.
  // Principalmente útil para la primera carga o si el intervalo falla.
  if (!cachedData || now - lastUpdate > CACHE_DURATION) {
    console.log("Caché vacía o expirada, forzando actualización...");
    await updateCache();
  }

  // Si después de intentar actualizar, sigue sin haber datos (por error), devuelve error.
  if (!cachedData) {
    return new Response(
      JSON.stringify({
        error: "No se pudieron obtener los datos de la playlist.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // Devuelve los datos cacheados
  return new Response(JSON.stringify(cachedData), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": `public, max-age=${Math.round(
        (CACHE_DURATION - (now - lastUpdate)) / 1000
      )}`, // Informa al cliente cuánto tiempo es válida la caché
    },
  });
}
