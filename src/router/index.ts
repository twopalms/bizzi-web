import { createRouter, createWebHistory } from 'vue-router'
import CardManager from '../views/CardManager.vue'
import ContactsView from '../views/ContactsView.vue'
import SignupView from '../views/SignupView.vue'
import LoginView from '../views/LoginView.vue'
import AccountView from '../views/AccountView.vue'
import PublicCardView from '../views/PublicCardView.vue'
import HomeView from '../views/HomeView.vue'
import { useAuth } from '../composables/useAuth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/cards',
      name: 'cards',
      meta: { requiresAuth: true },
      component: CardManager,
      // children: [
      //   {
      //     path: ':id',
      //     name: 'card-detail',
      //     component: () => import('@/views/CardDetailView.vue'),
      //   },
      // ],
    },
    {
      path: '/contacts',
      name: 'contacts',
      component: ContactsView,
      meta: { requiresAuth: true },
    },
    // {
    //   path: '/directory',
    //   name: 'directory',
    //   component: () => import('@/views/DirectoryView.vue'),
    //   // TODO: determine if this should be public
    //   meta: { requiresAuth: true },
    // },
    {
      path: '/directory/:slug',
      name: 'directory-detail',
      component: PublicCardView,
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true },
    },
    {
      path: '/account',
      name: 'account',
      component: AccountView,
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
