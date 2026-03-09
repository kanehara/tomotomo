import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import vinext from "vinext";
import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  plugins: [
    tailwindcss(),
    vinext(),
    cloudflare({
      // Required for App Router (RSC) + Cloudflare Workers:
      // tells the Cloudflare Vite plugin which Vite environment hosts RSC
      viteEnvironment: {
        name: "rsc",
        childEnvironments: ["ssr"],
      },
    }),
  ],
});
