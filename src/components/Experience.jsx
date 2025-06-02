import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stats } from "@react-three/drei";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Stars from "@/components/Stars";
import { useState } from "react";
import { Physics } from "@react-three/rapier";
import Walls from "@/components/Walls";
import Pointer from "@/components/Pointer";
import AnimatedText from "./AnimatedText";
import { Attractor } from "@react-three/rapier-addons";
import AnimatedHighlights from "@/components/AnimatedHighlights";
import Stickers from "@/components/Stickers";

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(useGSAP);

function Scene() {
  const [pausedPhysics, setPausedPhysics] = useState(true);

  useGSAP(() => {
    gsap.utils.toArray(".animate-fade-up").forEach((el) => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
        duration: 0.4,
        y: 100,
        scale: 0.7,
        opacity: 0,
      });
    });
  });
  return (
    <>
      <ambientLight intensity={1} />
      <Physics paused={pausedPhysics} gravity={[0, 0, 0]}>
        <AnimatedText
          pausedPhysics={pausedPhysics}
          setPausedPhysics={setPausedPhysics}
          text="ONE COIN"
        />
        <AnimatedHighlights
          pausedPhysics={pausedPhysics}
          setPausedPhysics={setPausedPhysics}
        />
        <Stickers />
        <Walls />
        <Pointer />
        <Attractor
          type="static"
          range={window.innerWidth / 25}
          strength={0.05}
          position={[0, 0, -1]}
        />
      </Physics>
      <Stars />
      {/* <OrbitControls /> */}
    </>
  );
}

function Experience() {
  return (
    <Canvas
      orthographic
      camera={{
        zoom: 50,
        position: [0, 0, 100],
      }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
    >
      {/* <Stats /> */}
      <Scene />
    </Canvas>
  );
}

export default Experience;
