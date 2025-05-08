import { useFrame } from "@react-three/fiber";
import { AdditiveBlending } from "three";
import { useRef, useMemo } from "react";
import { useTexture } from "@react-three/drei";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";

function RealStars({
  count = 1500,
  areaWidth = (window.innerWidth / 50) * 2,
  areaHeight = (window.innerHeight / 50) * 10,
  depthRange = [-20, 20],
  baseSize = 10,
  sizeVariance = 5,
}) {
  const pointsMaterialRef = useRef();
  const texture = useTexture("/star.png");

  // Genera posiciones (x, y, z), tamaños y fase de pulso aleatoria
  const { positions, sizes } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[3 * i + 0] = (Math.random() - 0.5) * areaWidth;
      pos[3 * i + 1] = (Math.random() - 0.5) * areaHeight;
      pos[3 * i + 2] =
        Math.random() * (depthRange[1] - depthRange[0]) + depthRange[0];

      sz[i] = baseSize + Math.random() * sizeVariance;
    }
    return {
      positions: pos,
      sizes: sz,
    };
  }, []);

  useGSAP(() => {
    gsap.to(pointsMaterialRef.current, {
      duration: 1.5,
      delay: 0.5,
      opacity: 1,
      ease: "power2.out",
    });
  }, []);

  return (
    <points position={[0, 0, -50]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={sizes.length}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        ref={pointsMaterialRef}
        map={texture}
        size={baseSize}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
        vertexColors={false}
        opacity={0}
      />
    </points>
  );
}

export default RealStars;
