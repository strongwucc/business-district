/**
 * 配置编译环境和线上环境之间的切换
 *
 * baseUrl: 域名地址
 * routerMode: 路由模式
 * imgBaseUrl: 图片所在域名地址
 *
 */
let rootUrl = ''
let baseUrl = ''
let oauthUrl = ''
let baseRedirectUrl = 'http://' + window.location.host + '/#'

if (process.env.NODE_ENV === 'development') {
  rootUrl = 'http://district.test'
  baseUrl = rootUrl + '/api/'
  baseRedirectUrl = 'http://' + window.location.host + '/#'
} else if (process.env.NODE_ENV === 'production') {
  rootUrl = 'http://' + window.location.host
  baseUrl = rootUrl + '/business-district/'
  baseRedirectUrl = 'http://' + window.location.host + '/coupon/#'
}

export {
  rootUrl,
  baseUrl,
  oauthUrl,
  baseRedirectUrl
}
