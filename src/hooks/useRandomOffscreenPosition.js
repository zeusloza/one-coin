import { useMemo } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

export const useRandomOffscreenPosition = (margin = 1) => {
  const vw = window.innerWidth / 75;
  const vh = window.innerHeight / 75;

  const position = useMemo(() => {
    // Elegí un lado aleatorio: top, bottom, left, right
    const side = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
    let x = 0,
      y = 0;

    switch (side) {
      case 0: // Top
        x = THREE.MathUtils.randFloatSpread(vw);
        y = vh + Math.random(); // un poco más arriba
        break;
      case 1: // Right
        x = vw + Math.random();
        y = THREE.MathUtils.randFloatSpread(vh);
        break;
      case 2: // Bottom
        x = THREE.MathUtils.randFloatSpread(vw);
        y = -vh - Math.random();
        break;
      case 3: // Left
        x = -vw - Math.random();
        y = THREE.MathUtils.randFloatSpread(vh);
        break;
    }

    return [x, y, 0];
  }, []);

  return position;
};
