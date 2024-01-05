import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    component: () => import("@/views/Web3Api.vue") ,
  },
  {
    path: "/account",
    component: () => import("@/views/AccountSystem.vue") 
  },
  {
    path: "/wallet",
    component: () => import("@/views/Wallet.vue") 
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;
