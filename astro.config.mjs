// @ts-check
import { defineConfig, envField } from "astro/config";

import react from "@astrojs/react";

import tailwindcss from "@tailwindcss/vite";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  output: "server",

  env: {
    schema: {
      SCRIPT_URL: envField.string({ context: "server", access: "secret" }),
      YOUTUBE_API_KEY: envField.string({ context: "server", access: "secret" }),
      YOUTUBE_CHANNEL_ID: envField.string({
        context: "server",
        access: "public",
      }),
      YOUTUBE_PLAYLIST_ID: envField.string({
        context: "server",
        access: "public",
      }),
    },
  },

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "react-dom/server.browser": "react-dom/server",
      },
    },
    ssr: {
      external: [
        "@react-three/fiber",
        "@react-three/drei",
        "@react-three/rapier",
        "@react-three/rapier-addons",
        "three",
        "gsap",
        "@gsap/react",
        "@lottiefiles/react-lottie-player",
      ],
    },
  },
  adapter: cloudflare(),
});
