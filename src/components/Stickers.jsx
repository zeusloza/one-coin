import ImageCollider from "@/components/ImageCollider";
import { useResponsiveValue } from "@/hooks/useResponsiveValue";

function Stickers() {
  const stickersUrl = [
    "/stickers/sticker-coin.webp",
    "/stickers/sticker-heart.webp",
  ];

  const scale = useResponsiveValue(1, 1.3);

  return (
    <>
      {stickersUrl.map((url, i) => (
        <ImageCollider
          key={i}
          imgUrl={url}
          scale={scale}
          mass={1}
          linearDamping={0.2}
          angularDamping={0.2}
          enabledRotations={[false, false, true]}
          enabledTranslations={[true, true, false]}
        />
      ))}
    </>
  );
}

export default Stickers;
