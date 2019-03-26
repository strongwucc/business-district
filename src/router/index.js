import Vue from 'vue'
import Router from 'vue-router'

const Home = r => require.ensure([], () => r(require('@/page/home')), 'home') // 首页
const Merchant = r => require.ensure([], () => r(require('@/page/merchant')), 'merchant') // 商户列表
const Center = r => require.ensure([], () => r(require('@/page/center')), 'center') // 个人中心

Vue.use(Router)

export default new Router({
  mode: 'hash',
  routes: [
    {
      path: '/',
      redirect: '/home'
    },

    {
      path: '/home',
      name: 'home',
      component: Home,
      meta: {
        auth: 0,
        title: '首页'
      }
    },

    {
      path: '/merchant',
      name: 'merchant',
      component: Merchant,
      meta: {
        auth: 0,
        title: '商户列表'
      }
    },

    {
      path: '/center',
      name: 'center',
      component: Center,
      meta: {
        auth: 0,
        title: '个人中心'
      }
    }
  ]
})
