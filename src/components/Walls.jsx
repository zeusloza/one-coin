import { CuboidCollider, RigidBody } from "@react-three/rapier";

function Walls() {
  const vw = window.innerWidth / 70;
  const vh = window.innerHeight / 70;
  const wallThickness = 10;
  const wallWidth = vw;
  const wallHeight = vh + wallThickness * 2;

  return (
    <RigidBody type="fixed">
      {/* FRONT */}
      <CuboidCollider
        args={[wallWidth, wallHeight, wallThickness]}
        position={[0, 0, vw + wallThickness]}
      />
      {/* BACK */}
      <CuboidCollider
        args={[wallWidth, wallHeight, wallThickness]}
        position={[0, 0, -vw - wallThickness]}
      />
      {/* RIGHT */}
      <CuboidCollider
        args={[wallThickness, wallHeight, vw + wallThickness * 2]}
        position={[vw + wallThickness, 0, 0]}
      />
      {/* LEFT */}
      <CuboidCollider
        args={[wallThickness, wallHeight, vw + wallThickness * 2]}
        position={[-vw - wallThickness, 0, 0]}
      />
      {/* BOTTOM */}
      <CuboidCollider
        args={[wallWidth, wallThickness, vw]}
        position={[0, -vh - wallThickness, 0]}
      />
      {/* TOP */}
      <CuboidCollider
        args={[wallWidth, wallThickness, vw]}
        position={[0, vh + wallThickness, 0]}
      />
    </RigidBody>
  );
}

export default Walls;
