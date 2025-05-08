function RainbowText(props) {
  const colors = [
    "text-purple-700",
    "text-turquoise-400",
    "text-yellow-300",
    "text-fuchsia-600",
    "text-white",
  ];

  const colorsLength = colors.length - 1;

  return (
    <div
      className="relative w-fit text-2xl font-icebox uppercase"
      aria-hidden="true"
    >
      {colors.map((_, i) => {
        return (
          <div
            key={i}
            className={`${colors[i]} ${
              colorsLength === i ? "relative z-10" : "absolute"
            } rounded-2xl top-0 left-0 
            text-shadow-[-1px_-1px_0_#000,1px_-1px_0_#000,-1px_1px_0_#000,1px_1px_0_#000]
            `}
            style={{
              padding: `${colors.length - i * 2}px`,
              transform: `translate(${-i + 2}px, ${-i * 2}px)`,
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
