import { numberFormatCompact } from "@/utils/numberFormatCompact";
import { useEffect, useState } from "react";
import AnimatedRainbowText from "@/components/AnimatedRainbowText";
import RainbowLink from "@/components/RainbowLink";

function YoutubeStats() {
  const [stats, setStats] = useState({
    subscriberCount: 0,
    videoCount: 0,
    viewCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/yt-channel.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error en la respuesta");
        }
        return response.json();
      })
      .then((data) => {
        setStats(data.items[0].statistics);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  return (
    <section
      id="youtube-stats"
      className="relative flex flex-col justify-center items-center min-h-dvh px-4 py-8"
    >
      <h2 className="hidden">Estadísticas del canal</h2>
      <div className="flex flex-col max-md:flex-wrap gap-20 w-full h-full font-icebox uppercase">
        <div className="flex flex-col justify-center items-center w-full h-full animate-fade-up ">
          <AnimatedRainbowText>
            {numberFormatCompact(parseFloat(stats.videoCount))}
          </AnimatedRainbowText>
          <span className="text-lg">Videos</span>
        </div>
        <div className="flex flex-col justify-center items-center w-full h-full animate-fade-up ">
          <AnimatedRainbowText>
            {numberFormatCompact(parseFloat(stats.subscriberCount))}
          </AnimatedRainbowText>
          <span className="text-lg">Suscriptores</span>
        </div>
        <div className="flex flex-col justify-center items-center w-full h-full animate-fade-up">
          <AnimatedRainbowText>
            {numberFormatCompact(parseFloat(stats.viewCount))}
          </AnimatedRainbowText>
          <span className="text-lg">Vistas</span>
        </div>
      </div>
      <img
        className="absolute size-36 max-md:size-24 max-md:top-1/5 right-4 top-1/3 animate-fade-up"
        src="/stickers/sticker-coin.webp"
        alt="sticker coin"
      />
      <img
        className="absolute size-36 max-md:size-24 max-md:top-2/6 left-4 top-1/2 animate-fade-up"
        src="/stickers/sticker-heart.webp"
        alt="sticker coin"
      />
      <RainbowLink
        href="mailto:negocios@onecoincrew.com"
        rel="noopener noreferrer"
      >
        Contacto comercial
      </RainbowLink>
    </section>
  );
}

export default YoutubeStats;
