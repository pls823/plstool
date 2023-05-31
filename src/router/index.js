import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/login/index'
import Main from '../views/Main.vue'
import pages from './page'

// 防止连续点击多次路由报错
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function (location) {
  return originalPush.call(this, location).catch(err => err)
}
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/main',
    name: 'main',
    component: Main,
    meta: { keepAlive: true },
    children: pages
  }
]

const router = new VueRouter({
  routes
})

export default router
