import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import Components from "unplugin-vue-components/vite";
import { VantResolver } from "@vant/auto-import-resolver";
import { fileURLToPath, URL } from "node:url";
//引入
import { resolve } from "path";

//重要！修复:import Tx from "ethereumjs-tx" 后 process undefined  Buffer undefined
//npm add node-stdlib-browser
// npm add -D vite-plugin-node-stdlib-browser

import nodePolyfills from "vite-plugin-node-stdlib-browser";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),

    Components({
      resolvers: [VantResolver()],
    }),

    nodePolyfills(),
    // new NodePolyfillPlugin()
  ],
  define: {},

  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  // build: {
  //   commonjsOptions: {
  //     transformMixedEsModules: true,
  //   },
  // },
});
