import { createApp } from "vue";
import App from "./App.vue";
import "./assets/css/reset.css";

// global is not defined
if (typeof window.global === "undefined") {
  window.global = window;
}

// buffer is not defined
import { Buffer } from "buffer";
if (typeof window !== "undefined") {
  window.Buffer = Buffer;
}

// process is not defined
import process from "process";
if (typeof window !== "undefined") {
  window.process = process;
}

createApp(App).mount("#app");
