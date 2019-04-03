/**
 * 获取会员信息
 */

import Http from '../../utils/http'
import API from '../../utils/api'
import { baseRedirectUrl, appId } from '../../../src/config/env'

let http = new Http()

export default {
  get_user_data ({commit, state}, router) {
    // let http = new Http();
    let userData = localStorage.getItem('user_data')
    let isLogin = localStorage.getItem('user_is_login')
    let isBind = localStorage.getItem('user_is_bind')

    // 从本地缓存中先获取
    if (typeof userData !== 'undefined') {
      commit('set_user_info', JSON.parse(userData))
      commit('set_user_bind_status', isBind)
      commit('set_user_login_status', isLogin)
    }

    // 从接口获取
    http.post(API.userInfo).then(result => {
      if (result.status_code === 401) {
        commit('set_user_bind_status', 0)
        commit('set_user_login_status', 0)
        commit('set_user_info', {})
        isLogin = isBind = 0
      }
      if (result.member_id) {
        let bindStatus = result.bound_phone ? 1 : 0
        commit('set_user_bind_status', bindStatus)
        commit('set_user_login_status', 1)
        commit('set_user_info', result)
        isLogin = 1
        isBind = bindStatus
      }
    })

    // 路由守卫
    router.beforeEach((to, from, next) => {
      if (to.meta.title) {
        document.title = to.meta.title
      }

      if (to.meta.auth === 1) {
        let redirect = to.fullPath
        if (isLogin === '0') {
          let redirectUri = baseRedirectUrl + '/wechat.html'
          let oauthUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appId + '&redirect_uri=' + encodeURIComponent(redirectUri) + '&response_type=code&scope=snsapi_userinfo&state=' + encodeURIComponent(redirect) + '#wechat_redirect'
          window.location.href = oauthUrl
        } else if (isBind === '0' && to.name !== 'bind_mobile') {
          next({
            path: '/bind_mobile',
            query: {redirect: redirect} // 将跳转的路由path作为参数，登录成功后跳转到该路由
          })
        }
        next()
      } else {
        next()
      }
    })
  }
}
