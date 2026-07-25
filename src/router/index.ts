import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      name: 'todo',
      path: '/',
      component: () => import('../views/TodoView.vue')
    },
    {
      name: 'recipes',
      path: '/recipes',
      component: () => import('../views/RecipesView.vue')
    },
    {
      name: 'shopping',
      path: '/shopping',
      component: () => import('../views/ShoppingView.vue')
    },
    {
      name: 'workouts',
      path: '/workouts',
      component: () => import('../views/WorkoutsView.vue')
    },
    {
      name: 'expenses',
      path: '/expenses',
      component: () => import('../views/ExpensesView.vue')
    }
  ]
})

export default router
