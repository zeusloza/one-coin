import { useState, useRef, useEffect } from "react";

function RainbowButton(props) {
  const colors = [
    "bg-purple-700",
    "bg-turquoise-400",
    "bg-yellow-300",
    "bg-fuchsia-600",
  ];
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // Effect to add and remove global mouse move listener
  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      // Calculate mouse position relative to the center of the viewport
      const x = e.clientX - window.innerWidth / 2;
      const y = e.clientY - window.innerHeight / 2;
      setMousePos({ x, y });
    };

    // Add listener when component mounts
    window.addEventListener("mousemove", handleGlobalMouseMove);

    // Cleanup listener when component unmounts
    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
    };
  }, []); // Empty dependency array ensures this runs only once on mount and cleanup on unmount

  // Define how much the layers should move (adjust for desired effect)
  const moveMultiplier = 0.03;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-24 max-w-[500px] mt-8 animate-fade-up"
    >
      {colors.map((_, i) => {
        // Calculate opposite movement based on global mouse position
        const movementFactor = moveMultiplier * (colors.length - i);
        const translateX = -mousePos.x * movementFactor;
        const translateY = -mousePos.y * movementFactor;
        return (
          <div
            key={i}
            className={`${colors[i]} rounded-2xl border-2 border-black absolute w-full h-full top-0 left-0 transition-transform duration-100 ease-out`}
            style={{
              padding: `${i * 2}px`,
              transform: `translate(${translateX}px, ${translateY}px)`,
            }}
          ></div>
        );
      })}
      <a
        className="text-black bg-white rounded-2xl font-icebox text-md cursor-pointer uppercase w-full h-24 relative z-10 flex justify-center items-center"
        {...props}
      >
        {props.children}
      </a>
    </div>
  );
}

export default RainbowButton;
