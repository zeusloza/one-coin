import { useEffect, useRef, useState } from "react";
import { useThree } from "@react-three/fiber";
import ImageCollider from "./ImageCollider";
import { useResponsiveValue } from "@/hooks/useResponsiveValue";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

function AnimatedHighlights({ pausedPhysics, setPausedPhysics }) {
  const [dataYTPL, setDataYTPL] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const imagesRef = useRef([]);
  const { camera } = useThree();

  const scale = useResponsiveValue(1, 1.3);

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

  useGSAP(
    (context) => {
      if (!camera || !imagesRef) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "#yt-highlights",
          start: "5% top",
          end: "bottom top",
          scrub: 1,
          markers: false,
          onEnter: () => setPausedPhysics(true),
          onLeaveBack: () => setPausedPhysics(false),
        },
      });

      imagesRef.current.slice(0, 4).forEach((image, i) => {
        tl.to(
          camera,
          {
            zoom: 250,
            onUpdate: () => {
              camera.updateProjectionMatrix();
            },
            ease: "power1.inOut",
          },
          ">"
        );
        if (image) {
          const position = imagesRef.current[i].translation();
          const rotation = imagesRef.current[i].rotation();

          tl.to(
            camera.position,
            {
              x: position.x,
              y: position.y,
              z: 100,
              ease: "power1.inOut",
              onUpdate: () => {
                camera.updateProjectionMatrix();
              },
            },
            "<"
          );
          tl.to(
            camera.rotation,
            {
              x: rotation.x,
              y: rotation.y,
              z: rotation.z,
              ease: "power1.inOut",
              onUpdate: () => {
                camera.updateProjectionMatrix();
              },
            },
            "<"
          );
        }
      });

      tl.to(
        camera.position,
        {
          x: 0,
          y: -window.innerHeight / 25,
          z: 100,
          ease: "power1.inOut",
        },
        ">"
      );

      tl.to(
        camera,
        {
          zoom: 50,
          onUpdate: () => {
            camera.updateProjectionMatrix();
          },
          ease: "power1.inOut",
        },
        "<"
      );
    },
    [camera, pausedPhysics, imagesRef]
  );

  return (
    <group>
      {dataYTPL?.items.slice(0, 25).map((video, i) => (
        <ImageCollider
          key={video.snippet?.resourceId?.videoId} // Añadido key único
          ref={(el) => (imagesRef.current[i] = el)} // Referencia individual
          imgUrl={video.snippet?.thumbnails?.medium?.url}
          scale={scale}
          mass={1}
          linearDamping={0.2}
          angularDamping={0.2}
          enabledRotations={[false, false, true]}
          enabledTranslations={[true, true, false]}
          onClick={() => {
            if (pausedPhysics) {
              window.open(
                `https://www.youtube.com/watch?v=${video.snippet?.resourceId?.videoId}`,
                "_blank",
                "noopener,noreferrer"
              );
            }
          }}
        />
      ))}
    </group>
  );
}

export default AnimatedHighlights;
