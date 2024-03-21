import { fileURLToPath, URL } from "node:url"
import browserslist from "browserslist"

import { defineConfig } from "vite"
import legacy from "@vitejs/plugin-legacy"
import vue2 from "@vitejs/plugin-vue2"

// https://vitejs.dev/config/

function getBrowserslistConfig() {
  return browserslist()
}

const browserslistConfig = getBrowserslistConfig()

export default defineConfig({
  plugins: [
    vue2(),
    legacy({
      targets: browserslistConfig,
      additionalLegacyPolyfills: ["regenerator-runtime/runtime"],
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
})
