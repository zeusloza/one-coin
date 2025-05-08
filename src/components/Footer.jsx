import { Player } from "@lottiefiles/react-lottie-player";
import animationRainbowFooter from "@/lotties/rainbow-footer.json";

function Footer() {
  return (
    <footer id="footer" className="relative w-full text-black">
      <div className="w-full">
        <Player
          autoplay
          loop
          src={animationRainbowFooter}
          className="w-full h-full"
        />
      </div>
      <div className="absolute left-0 bottom-0 z-10 flex flex-col justify-center items-center gap-4 w-full p-6">
        <img src="logo-one-coin.svg" alt="logo one coin" className="w-80-200" />
        <div className="flex justify-center items-center gap-6">
          <a
            href="https://www.youtube.com/@OneCoinOficial"
            className="cursor-pointer"
            aria-label="youtube"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="logo-youtube.svg"
              alt="logo one coin"
              className="w-30-60"
            />
          </a>
          <a
            href="https://www.instagram.com/onecoinexclusive"
            className="cursor-pointer"
            aria-label="instagram"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="logo-instagram.svg"
              alt="logo one coin"
              className="w-30-60"
            />
          </a>
          <a
            href="https://www.tiktok.com/@onecoinexclusive"
            className="cursor-pointer"
            aria-label="tiktok"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="logo-tiktok.svg"
              alt="logo one coin"
              className="w-30-60"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
