import { useMemo, useRef } from "react";
import { useTexture } from "@react-three/drei";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import * as THREE from "three";

import { useRandomOffscreenPosition } from "@/hooks/useRandomOffscreenPosition";

function ImageCollider(props, ref) {
  const {
    imgUrl,
    colliders = false,
    position = useRandomOffscreenPosition(2),
    meshRef = useRef(),
    ...rest
  } = props;
  const map = useTexture(imgUrl);

  // Se obtienen las dimensiones reales de la imagen y se escalan.
  const [width, height] = useMemo(() => {
    if (map && map.image) {
      const targetWidth = 1.2; // ancho deseado
      const aspectRatio = map.image.width / map.image.height;
      const targetHeight = targetWidth / aspectRatio;
      return [targetWidth, targetHeight];
    }
    return [1, 1];
  }, []);

  return (
    <RigidBody ref={ref} colliders={colliders} position={position} {...rest}>
      <mesh>
        <boxGeometry args={[width, height, 1]} />
        <meshBasicMaterial map={map} toneMapped={false} transparent />
      </mesh>
      <CuboidCollider args={[width / 2, height / 2, 1]} />
    </RigidBody>
  );
}

export default ImageCollider;
