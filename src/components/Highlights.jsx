import { useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(useGSAP);

function Highlights() {
  const [dataYTPL, setDataYTPL] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/yt-playlist.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error en la respuesta");
        }
        return response.json();
      })
      .then((data) => {
        setDataYTPL(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#intro",
        start: "bottom bottom",
        end: "bottom top",
        scrub: 1,
        markers: true,
      },
    });

    gsap.utils.toArray(".video").forEach((el) => {
      tl.to(
        el,
        {
          rotate: Math.floor(Math.random() * 360) + 90,
        },
        0
      );
    });
  });

  const positions = [
    "8vw 10vh",
    "70vw 25vh",
    "40vw 44vh",
    "4vw 70vh",
    "50vw 90vh",
  ];

  return (
    <section id="yt-highlights" className="max-w-dvw h-[150vh]">
      <h2 className="hidden">Highlights</h2>
      <div className="absolute w-full h-full overflow-hidden max-w-dvw">
        {dataYTPL?.items.slice(0, 5).map((video, i) => (
          <a
            className="block absolute cursor-pointer w-[clamp(11.72rem,_24.14vi_+_5.68rem,_24.99rem)] video"
            key={video.id}
            id={video.id}
            style={{
              translate: positions[i],
            }}
            href={`https://www.youtube.com/watch?v=${video.snippet?.resourceId?.videoId}`}
          >
            <img
              className="w-full"
              src={video.snippet?.thumbnails?.medium?.url}
              alt=""
            />
            <img
              className="absolute left-1/2 top-1/2 -translate-1/5 w-30-60"
              src="/logo-youtube.svg"
              alt="Logo Youtube"
            />
          </a>
        ))}
      </div>
    </section>
  );
}

export default Highlights;
