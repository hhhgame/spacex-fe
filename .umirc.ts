import { defineConfig } from "umi";

export default defineConfig({
  routes: [
    { path: "/", component: "index" },
    { path: "/detail", component: "detail" },
  ],
  npmClient: 'npm',
  conventionLayout: false
});
