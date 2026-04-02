import { createRouter, createWebHashHistory } from 'vue-router';
import { useAuth } from '../features/user/composables/useAuth';
import AuthView from '../views/AuthView.vue';
import DashboardView from '../views/DashboardView.vue';
import { ROUTES } from './config';

const { user, authReady } = useAuth();

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      redirect: () => user.value ? ROUTES.dashboard : ROUTES.auth
    },
    {
      path: ROUTES.dashboard,
      component: DashboardView,
      meta: { requiresAuth: true }
    },
    {
      path: ROUTES.auth,
      component: AuthView
    }
  ]
});

router.beforeEach(async (to, _from) => {
  await authReady;
  if (to.meta.requiresAuth && !user.value) {
    return "/auth";
  } else if (to.path === "/auth" && user.value) {
    return "/dashboard";
  }
});

export default router