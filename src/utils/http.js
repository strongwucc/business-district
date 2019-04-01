import axios from 'axios'
import qs from 'qs'
import { baseUrl } from '../config/env'
axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.headers['Accept'] = 'application/prs.district.v1+json'
axios.defaults.withCredentials = false
axios.interceptors.request.use(function (config) {
  // Do something before request is sent
  config.headers['Authorization'] = 'Bearer ' + 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9kaXN0cmljdC50ZXN0IiwiaWF0IjoxNTUzMTUxMDc4LCJleHAiOjE1ODQ2ODcwNzgsIm5iZiI6MTU1MzE1MTA3OCwianRpIjoiWkVmRW1sbUM0SFkzTkx1NCIsInN1YiI6MTgsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.hp7QIb8EnhMQm99FszQaOM2HmEeNt-zLrwC8b7MinJc'
  return config
}, function (error) {
  // Do something with request error
  // console.log(error)
  return Promise.reject(error)
})

export default class http {
  constructor (store, api) {
    var baseApi = baseUrl
    this.baseApi = baseApi
    this.api = api // 全部接口
    if (store) {
      this.store = store
      this.userAuth()
    }
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
          console.log(error.config)
        })
    })
    return promise
  }
  userAuth () { // 会员登录认证
    axios.interceptors.response.use(response => {
      return response
    })
  }
}
