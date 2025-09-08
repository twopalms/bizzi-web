import { createRouter, createWebHistory } from 'vue-router'
import SignupView from '../views/SignupView.vue'
import LoginView from '../views/LoginView.vue'
import { useAuth } from '../composables/useAuth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/cards',
      components: {
        default: () => import('@/views/MyCardView.vue'),
        LeftSidebar: () => import('@/components/LeftNav.vue'),
      },
      name: 'cards',
      meta: { requiresAuth: true },
      children: [
        {
          path: ':id',
          name: 'card-detail',
          components: {
            default: () => import('@/views/MyCardView.vue'),
            LeftSidebar: () => import('@/components/LeftNav.vue'),
          },
        },
      ],
    },
    {
      path: '/contacts',
      name: 'contacts',
      // TODO: update to contacts
      components: {
        default: () => import('@/views/MyCardView.vue'),
        LeftSidebar: () => import('@/components/LeftNav.vue'),
      },
      meta: { requiresAuth: true },
    },
    {
      path: '/account',
      name: 'account',
      // TODO: update to account
      components: {
        default: () => import('@/views/MyCardView.vue'),
        LeftSidebar: () => import('@/components/LeftNav.vue'),
      },
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresAuth: false },
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignupView,
      meta: { requiresAuth: false },
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const { isAuthenticated, checkAuth } = useAuth()
  await checkAuth()

  if (to.meta.requiresAuth && !isAuthenticated.value) {
    next('/login')
  } else if ((to.path === '/signup' || to.path === '/login') && isAuthenticated.value) {
    next('/cards')
  } else {
    next()
  }
})

export default router
