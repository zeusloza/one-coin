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
    // resolve: {
    //   alias: {
    //     "react-dom/server": "react-dom/server.edge",
    //   },
    // },
  },
  // adapter: cloudflare(),
});
