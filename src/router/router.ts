import { createRouter, createWebHashHistory } from 'vue-router';
import { useAuth } from '../features/user/composables/useAuth';
import AuthView from '../views/AuthView.vue';
import CalendarView from '../views/CalendarView.vue';
import DashboardView from '../views/DashboardView.vue';
import HistoryView from '../views/HistoryView.vue';
import VetView from '../views/VetView.vue';
import { ROUTES } from './config';

const { user, authReady } = useAuth();

const router = createRouter({
  history: createWebHashHistory(),
  scrollBehavior() {
    return { top: 0, behavior: 'smooth' }
  },
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
      path: ROUTES.calendar,
      component: CalendarView,
      meta: { requiresAuth: true }
    },
    {
      path: ROUTES.vet,
      component: VetView,
      meta: { requiresAuth: true }
    },
    {
      path: ROUTES.history,
      component: HistoryView,
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