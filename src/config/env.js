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
let uploadUrl = 'http://yanshi.yklsq.etonepay.com'
let appId = 'wx583be2083a929fb0'
let baseRedirectUrl = 'http://' + window.location.host

if (process.env.NODE_ENV === 'development') {
  // rootUrl = 'http://district.test'
  // rootUrl = 'http://ceshi7.sdykt.com.cn:1280'
  rootUrl = 'http://ycsq.yklsh.etonepay.com'
  baseUrl = rootUrl + '/api/'
  baseRedirectUrl = 'http://ceshi6.sdykt.com.cn:1280/business-district'
  appId = 'wx583be2083a929fb0'
} else if (process.env.NODE_ENV === 'production') {
  rootUrl = 'http://' + window.location.host
  baseUrl = rootUrl + '/api/'
  baseRedirectUrl = 'http://' + window.location.host + '/business-district/'
  // rootUrl = 'http://district.yklsh.etonepay.com'
  // baseUrl = rootUrl + '/api/'
  // baseRedirectUrl = 'http://district.yklsh.etonepay.com/business-district'
  appId = 'wx583be2083a929fb0'
}

export {
  rootUrl,
  baseUrl,
  uploadUrl,
  appId,
  baseRedirectUrl
}
