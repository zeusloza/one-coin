import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { RigidBody, BallCollider } from "@react-three/rapier";
import * as THREE from "three";

function Pointer({ vec = new THREE.Vector3() }) {
  const ref = useRef();
  const { viewport } = useThree();
  useFrame(({ mouse }) => {
    ref.current?.setNextKinematicTranslation(
      vec.set(
        (mouse.x * viewport.width) / 2,
        (mouse.y * viewport.height) / 2,
        0
      )
    );
  }, []);
  return (
    <RigidBody
      ref={ref}
      type="kinematicPosition"
      position={[0, 0, 0]}
      colliders={false}
    >
      <BallCollider args={[0.5]} />
    </RigidBody>
  );
}
export default Pointer;
