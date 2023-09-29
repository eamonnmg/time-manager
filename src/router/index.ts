import { createRouter, createWebHistory } from "vue-router";
import PlanView from "@/Plan/PlanView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "plan",
      component: PlanView,
    },
    {
      path: "/activities",
      name: "activities",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("@/Activities/ActvitiesView.vue"),
    },
    {
      path: "/budget",
      name: "budget",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("@/Budget/BudgetView.vue"),
    },
  ],
});

export default router;
