import { createApp } from "vue";
import App from "./App.vue";
import "./assets/css/reset.css";
import "vant/es/dialog/style";
import "vant/es/notify/style";

import router from "@/router/index";

createApp(App).use(router).mount("#app");
