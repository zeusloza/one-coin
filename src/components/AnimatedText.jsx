import { Text } from "@react-three/drei";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { useRef, useState, useMemo } from "react";
import { useThree } from "@react-three/fiber";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useResponsiveValue } from "@/hooks/useResponsiveValue";

function AnimatedText({ pausedPhysics, setPausedPhysics }) {
  const textContent = "ONE COIN";
  const FONT_URL = "/fonts/icebox_regular.woff";
  const FONT_SIZE = useResponsiveValue(1.5, 3.5);
  const SPACE_WIDTH = useResponsiveValue(0.2, 0.5);
  const LETTER_SPACING = useResponsiveValue(0.05, 0.1);

  const { viewport } = useThree();

  const letters = useMemo(
    () =>
      textContent.split("").map((char) => ({
        char,
        isSpace: char === " ",
      })),
    [textContent]
  );

  const charRefs = useRef([]);

  const [letterDimensions, setLetterDimensions] = useState(() =>
    Array(letters.length).fill({ width: 0, height: 0 })
  );

  const measureLetter = (mesh, index) => {
    if (mesh.textRenderInfo) {
      const { visibleBounds } = mesh.textRenderInfo;
      const width = visibleBounds[2] - visibleBounds[0];
      const height = visibleBounds[3] - visibleBounds[1];

      setLetterDimensions((prevDimensions) => {
        if (
          prevDimensions[index]?.width !== width ||
          prevDimensions[index]?.height !== height
        ) {
          const newDimensions = [...prevDimensions];
          newDimensions[index] = { width, height };
          return newDimensions;
        }
        return prevDimensions;
      });
    }
  };

  const totalWidth = useMemo(() => {
    // Calcula el ancho total incluyendo el espaciado entre letras
    const totalWidth = letters.reduce((sum, letter, index) => {
      const width = letter.isSpace
        ? SPACE_WIDTH
        : letterDimensions[index]?.width || 0;
      // Añade espaciado después de cada letra excepto la última
      const spacing = index < letters.length - 1 ? LETTER_SPACING : 0;
      return sum + width + spacing;
    }, 0);

    return totalWidth;
  }, [letterDimensions, letters, SPACE_WIDTH, LETTER_SPACING]);

  const letterPositions = useMemo(() => {
    // Calcula el ancho total incluyendo el espaciado entre letras
    const totalWidth = letters.reduce((sum, letter, index) => {
      const width = letter.isSpace
        ? SPACE_WIDTH
        : letterDimensions[index]?.width || 0;
      // Añade espaciado después de cada letra excepto la última
      const spacing = index < letters.length - 1 ? LETTER_SPACING : 0;
      return sum + width + spacing;
    }, 0);

    const centerOffset = -totalWidth / 2;
    let accumulatedWidth = 0; // Rastrea la posición inicial de la letra actual
    const positions = Array(letters.length).fill(0);

    for (let i = 0; i < letters.length; i++) {
      const currentLetterWidth = letters[i].isSpace
        ? SPACE_WIDTH
        : letterDimensions[i]?.width || 0;

      // La posición es centerOffset + accumulatedWidth (inicio) + la mitad del ancho de la letra actual
      positions[i] = centerOffset + accumulatedWidth + currentLetterWidth / 2;

      // Actualiza accumulatedWidth para la posición inicial de la siguiente letra
      // Añade el ancho de la letra actual + el espaciado para el hueco *después* de esta letra
      const spacing = i < letters.length - 1 ? LETTER_SPACING : 0;
      accumulatedWidth += currentLetterWidth + spacing;
    }

    return positions;
    // Añade LETTER_SPACING a las dependencias
  }, [letterDimensions, letters, SPACE_WIDTH, LETTER_SPACING]);

  useGSAP(() => {
    if (letterPositions.some((p) => p === undefined || p === null)) {
      return;
    }

    letters.forEach((letter, i) => {
      if (letter.isSpace) return;

      const char = charRefs.current[i];

      // Guardamos la posición final deseada
      const finalX = letterPositions[i];

      // Establecemos la posición inicial
      char.position.x = finalX;
      char.position.y = -viewport.height;

      gsap.to(char.position, {
        x: finalX, // Animamos hacia la posición final
        y: -FONT_SIZE / 10,
        duration: 1.5 + i * 0.2,
        immediateRender: true,
        ease: "elastic.out(1, 0.4)",
        onStart: () => {
          document.body.classList.add("overflow-hidden");
        },
        onComplete: () => {
          setPausedPhysics(false);
          document.body.classList.remove("overflow-hidden");
        },
      });
    });
  }, [letters, letterPositions, charRefs]);

  return (
    <group>
      {letters.map((letter, i) =>
        letter.isSpace ? null : (
          <Text
            key={i}
            ref={(el) => (charRefs.current[i] = el)}
            font={FONT_URL}
            fontSize={FONT_SIZE}
            anchorX="center"
            anchorY="middle"
            onSync={(mesh) => measureLetter(mesh, i)}
            position={[letterPositions[i] || 0, -FONT_SIZE / 10, 0]}
          >
            {letter.char}
            <meshBasicMaterial color="white" toneMapped={false} transparent />
          </Text>
        )
      )}
      <RigidBody type="fixed">
        <CuboidCollider args={[totalWidth / 2, FONT_SIZE / 2.3, 1]} />
      </RigidBody>
    </group>
  );
}

export default AnimatedText;
