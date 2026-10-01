import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'home', component: () => import('./views/HomeView.vue') },
  { path: '/articles/:slug', name: 'article', component: () => import('./views/ArticleView.vue') },
  // 归档：同一批文章的三种聚合（?mode=time|category|tag）
  { path: '/archives', name: 'archives', component: () => import('./views/AggregateView.vue') },
  { path: '/about', name: 'about', component: () => import('./views/AboutView.vue') },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 }
  },
})

export default router
