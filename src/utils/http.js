import axios from 'axios'
import router from '../router'
import qs from 'qs'
import { baseUrl, baseRedirectUrl, appId } from '../config/env'
axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.headers['Accept'] = 'application/prs.district.v1+json'
axios.defaults.withCredentials = false
axios.interceptors.request.use(function (config) {
  // Do something before request is sent
  let token = localStorage.getItem('access_token')
  if (token) {
    config.headers['Authorization'] = 'Bearer ' + token
  }
  return config
}, function (error) {
  // Do something with request error
  // console.log(error)
  return Promise.reject(error)
})

axios.interceptors.response.use(function (response) {
  // Do something with response data
  // console.log(response)
  return response
}, function (error) {
  // Do something with response error
  // console.log(error.response)
  // if (error.response && error.response.status === 401) {
  // let redirect = router.currentRoute.fullPath
  // let redirectUri = baseRedirectUrl + '/wechat.html'
  // let oauthUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appId + '&redirect_uri=' + encodeURIComponent(redirectUri) + '&response_type=code&scope=snsapi_userinfo&state=' + encodeURIComponent(redirect) + '#wechat_redirect'
  // window.location.href = oauthUrl
  // }
  return Promise.reject(error)
})

export default class http {
  constructor (store, api) {
    var baseApi = baseUrl
    this.baseApi = baseApi
    this.api = api // 全部接口
    // if (store) {
    //   this.store = store
    //   this.userAuth()
    // }
  }
  get (url, data, isNeedBaseUrl) {
    var options = {
      url: !isNeedBaseUrl ? this.baseApi + url : url,
      data: data || {},
      method: 'get'
    }
    return this.request(options)
  }
  post (url, data) {
    var postUrl = this.baseApi
    if (url) {
      postUrl += url
    }
    var options = {
      url: postUrl,
      data: qs.stringify(data),
      method: 'post'
    }
    return this.request(options)
  }
  all (array) {
    var promiseAll = Promise.all(array)
    return promiseAll
  }
  request (options) {
    var promise = new Promise((resolve) => {
      axios(options)
        .then((result) => {
          resolve(result.data)
        })
        .catch((error) => {
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            resolve(error.response.data)
          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            resolve({status: '6000', msg: '网络出错啦:' + error.request})
          } else {
            // Something happened in setting up the request that triggered an Error
            resolve({status: '6000', msg: '网络出错啦:' + error.message})
          }
          // console.log(error.config)
        })
    })
    return promise
  }
  userAuth () { // 会员登录认证
    axios.interceptors.response.use(response => {
      // console.log(response)
      // if (response.status == 200 && response.data.return_code == '1001' && router.currentRoute.meta.auth == 1 && !router.currentRoute.query.auth) {
      //   // 清除登录信息
      //   this.store.commit('set_user_bind_status', 0)
      //   this.store.commit('set_user_login_status', 0)
      //   this.store.commit('set_user_info', {});
      //   router.replace({
      //     path: '/login',
      //     query: {redirect: router.currentRoute.fullPath}
      //   })
      //   return response
      // }
      return response
    })
  }
}
