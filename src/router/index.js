import Vue from 'vue'
import Router from 'vue-router'

const Home = r => require.ensure([], () => r(require('@/page/home')), 'home') // 首页
const Merchant = r => require.ensure([], () => r(require('@/page/merchant')), 'merchant') // 商户列表
const MerchantSearch = r => require.ensure([], () => r(require('@/page/merchantSearch')), 'merchant_search') // 商户搜索
const MerchantDetail = r => require.ensure([], () => r(require('@/page/merchantDetail')), 'merchant_detail') // 商户详情
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
      path: '/merchant_search',
      name: 'merchant_search',
      component: MerchantSearch,
      meta: {
        auth: 0,
        title: '商户搜索'
      }
    },

    {
      path: '/merchant_detail/:merId',
      name: 'merchant_detail',
      component: MerchantDetail,
      meta: {
        auth: 0,
        title: '商户详情'
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
