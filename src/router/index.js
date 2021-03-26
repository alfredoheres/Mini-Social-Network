import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

const routes = [

  {
    path: '/',
    name: 'news',
    component: () => import(/* webpackChunkName: "home" */ '../views/News.vue')
  },
  {
    path: '/my-posts',
    name: 'my-posts',
    component: () => import(/* webpackChunkName: "about" */ '../views/MyPosts.vue')
  },
  {
    path: '/users',
    name: 'users',
    component: () => import(/* webpackChunkName: "caracteristicas" */ '../views/Users.vue')
  }
  
]

const router = new VueRouter({
  routes
})

export default router
