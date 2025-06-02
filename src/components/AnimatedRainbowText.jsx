import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

function RainbowText(props) {
  const colors = [
    "text-purple-700",
    "text-turquoise-400",
    "text-yellow-300",
    "text-fuchsia-600",
    "text-white",
  ];

  const colorsRef = useRef([]);

  const colorsLength = colors.length - 1;

  useGSAP(() => {
    if (!colorsRef.current) return;

    colorsRef.current.forEach((element, i) => {
      gsap.from(element, {
        x: 0,
        y: 0,
        scrollTrigger: {
          trigger: element,
          start: "top 85%",
          toggleActions: "play none none reverse",
          markers: false,
        },
        duration: 1.5,
        ease: "power2.out",
      });
    });
  }, [colorsRef]);

  return (
    <div
      className="relative w-fit text-2xl leading-[0.9em] font-icebox uppercase"
      aria-hidden="true"
    >
      {colors.map((_, i) => {
        return (
          <div
            key={i}
            ref={(el) => (colorsRef.current[i] = el)}
            className={`rainbow-text-layer ${colors[i]} ${
              colorsLength === i ? "relative z-10" : "absolute"
            } rounded-2xl bottom-0 left-0 
            text-shadow-[-1px_-1px_0_#000,1px_-1px_0_#000,-1px_1px_0_#000,1px_1px_0_#000]
            `}
            style={{
              transform: `translate(${i}px, ${-i * 10}px)`,
              opacity: 1,
            }}
          >
            {props.children}
          </div>
        );
      })}
    </div>
  );
}

export default RainbowText;
