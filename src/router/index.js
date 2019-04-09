import Vue from 'vue'
import Router from 'vue-router'

const Home = r => require.ensure([], () => r(require('@/page/home')), 'home') // 首页
const Merchant = r => require.ensure([], () => r(require('@/page/merchant')), 'merchant') // 商户列表
const MerchantSearch = r => require.ensure([], () => r(require('@/page/merchantSearch')), 'merchant_search') // 商户搜索
const MerchantDetail = r => require.ensure([], () => r(require('@/page/merchantDetail')), 'merchant_detail') // 商户详情
const Coupons = r => require.ensure([], () => r(require('@/page/coupons')), 'coupons') // 领券中心
const CouponDetail = r => require.ensure([], () => r(require('@/page/couponDetail')), 'coupon_detail') // 优惠券详情
const CouponShow = r => require.ensure([], () => r(require('@/page/couponShow')), 'coupon_show') // 优惠券使用
const BindWechat = r => require.ensure([], () => r(require('@/page/bindWechat')), 'bind_wechat') // 微信授权
const BindMobile = r => require.ensure([], () => r(require('@/page/bindMobile')), 'bind_mobile') // 绑定手机号
const Center = r => require.ensure([], () => r(require('@/page/center')), 'center') // 个人中心
const Point = r => require.ensure([], () => r(require('@/page/point')), 'point') // 我的积分
const Collection = r => require.ensure([], () => r(require('@/page/collection')), 'collection') // 我的收藏
const MyCoupons = r => require.ensure([], () => r(require('@/page/myCoupons')), 'my_coupons') // 我的优惠券
const UserInfo = r => require.ensure([], () => r(require('@/page/userInfo')), 'user_info') // 会员信息

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
      path: '/coupons',
      name: 'coupons',
      component: Coupons,
      meta: {
        auth: 0,
        title: '领券中心'
      }
    },

    {
      path: '/coupon_detail/:pcId',
      name: 'coupon_detail',
      component: CouponDetail,
      meta: {
        auth: 0,
        title: '优惠券详情'
      }
    },

    {
      path: '/coupon_show/:code?',
      name: 'coupon_show',
      component: CouponShow,
      meta: {
        auth: 1,
        title: '使用优惠券'
      }
    },

    {
      path: '/bind_wechat/:code',
      name: 'bind_wechat',
      component: BindWechat,
      meta: {
        auth: 0,
        title: '微信授权'
      }
    },

    {
      path: '/bind_mobile',
      name: 'bind_mobile',
      component: BindMobile,
      meta: {
        auth: 1,
        title: '绑定手机号'
      }
    },

    {
      path: '/center',
      name: 'center',
      component: Center,
      meta: {
        auth: 1,
        title: '个人中心'
      }
    },

    {
      path: '/point',
      name: 'point',
      component: Point,
      meta: {
        auth: 1,
        title: '我的积分'
      }
    },

    {
      path: '/collection',
      name: 'collection',
      component: Collection,
      meta: {
        auth: 1,
        title: '我的收藏'
      }
    },

    {
      path: '/my_coupons',
      name: 'my_coupons',
      component: MyCoupons,
      meta: {
        auth: 1,
        title: '我的优惠券'
      }
    },

    {
      path: '/user_info',
      name: 'user_info',
      component: UserInfo,
      meta: {
        auth: 1,
        title: '会员信息'
      }
    }
  ]
})
