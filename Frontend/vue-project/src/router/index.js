import { createRouter, createWebHistory } from 'vue-router'
import store from '../store'


// 1. Import route components
import HomeView from '../views/HomeView.vue'
import NotFoundView from '../views/NotFoundView.vue'
import SignupView from '../views/SignupView.vue'
import LoginView from '../views/LoginView.vue'
import AccountView from '../views/AccountView.vue'
import PostDetails from '../views/PostDetails.vue'
import NewPostView from '../views/NewPostView.vue'

// 2. Define routes: each route maps to a component
const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/signup',
    name: 'signup',
    component: SignupView,
    meta: { guest: true }
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { guest: true }
  },
  {
    path: '/account',
    name: 'account',
    component: AccountView,
    meta: { requiresAuth: true }
  },
  {
    path: '/newpost',
    name: 'newpost',
    component: NewPostView,
    meta: { requiresAuth: true }
  },
  {
    // :id: is a route parameter that can be accepted as a props
    path: '/posts/:id',
    name: 'postDetails',
    component: PostDetails,
    props: true,
    meta: { requiresAuth: true }
  },
  {
    // catchall 404
    path: '/:catchAll(.*)',
    name: 'notFound',
    component: NotFoundView
  }
]

// 3. Create router instance and pass the `routes` option
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

// Navigation guard to handle unauthorized users
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters.isAuthenticated) {
      next()
      return
    }
    next('/login')
  } else {
    next()
  }
})

// Navigation guard to handle authorized users
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.guest)) {
    if (store.getters.isAuthenticated) {
      next('/')
      return
    }
    next()
  } else {
    next()
  }
})

export default router
