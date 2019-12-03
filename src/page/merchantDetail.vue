<template>
  <div class="merchant-detail-page">
    <div ref="wrapper" class="wrapper">
      <div class="wrapper-content">
        <div class="pics">
          <swiper auto  dots-position="center" height="227.5px">
            <swiper-item>
              <img :src="merchant.pic|upload"/>
            </swiper-item>
          </swiper>
        </div>
        <div class="info">
          <div class="name">
            <div class="txt">{{merchant.name}}</div>
            <div class="fav" @click.stop="doFav(merchant.mer_id)">
              <template v-if="merchant.is_fav === 0">
                <img src="../assets/img/base/icon_collection_gray@2x.png"/>
                <span>收藏</span>
              </template>
              <template v-if="merchant.is_fav >= 1">
                <img src="../assets/img/base/icon_collection_high@2x.png"/>
                <span>已收藏</span>
              </template>
            </div>
          </div>
          <div class="price">人均 ￥{{merchant.cost}}/人</div>
          <div class="params">
            <div class="item" v-for="title in merchant.titles" :key="title.type_code">
              <img src="../assets/img/merchant_detail/icon_tick@2x.png"/><span>{{title.type_name}}</span>
            </div>
            <!--<div class="item">-->
              <!--<img src="../assets/img/merchant_detail/icon_tick@2x.png"/><span>WI-FI</span>-->
            <!--</div>-->
            <!--<div class="item">-->
              <!--<img src="../assets/img/merchant_detail/icon_tick@2x.png"/><span>停车</span>-->
            <!--</div>-->
            <!--<div class="item">-->
              <!--<img src="../assets/img/merchant_detail/icon_tick@2x.png"/><span>排队</span>-->
            <!--</div>-->
            <!--<div class="item">-->
              <!--<img src="../assets/img/merchant_detail/icon_tick@2x.png"/><span>预约</span>-->
            <!--</div>-->
          </div>
          <div class="time-addr">
            <div class="item time">
              <img class="icon" src="../assets/img/base/icon_house@2x.png"/>
              <span class="txt">营业时间：{{merchant.open_time}}</span>
              <img class="tel" src="../assets/img/merchant_detail/icon_phone@2x.png" @click.stop="callMobile(merchant.mobile)"/>
            </div>
            <div class="item addr">
              <img class="icon" src="../assets/img/base/icon_add@2x.png"/>
              <span class="txt">{{merchant.addr}}</span>
            </div>
          </div>
          <div class="intro-detail" v-show="showIntro">
            {{merchant.detail}}
          </div>
          <div class="intro" v-show="!showIntro" @click.stop="showIntro = true">
            <span>查看商户简介</span>
            <img src="../assets/img/base/icon_arrow_down@2x.png"/>
          </div>
          <div class="intro" v-show="showIntro" @click.stop="showIntro = false">
            <span>收起</span>
            <img src="../assets/img/base/icon_arrow_up@2x.png"/>
          </div>
        </div>
        <div class="coupons" v-if="merchant.coupons && merchant.coupons.data.length > 0">
          <div class="coupon-title">优惠券</div>
          <ul class="content">
            <li class="item" v-for="(coupon, couponIndex) in merchant.coupons.data" :key="couponIndex">
              <div class="li_left">
                <div class="coupon_icon">
                  <template v-if="coupon.card_type === 'CASH'">代金券</template>
                  <template v-else-if="coupon.card_type === 'DISCOUNT'">折扣券</template>
                  <template v-else-if="coupon.card_type === 'GIFT'">礼品券</template>
                  <template v-else-if="coupon.card_type === 'FULL_REDUCTION'">满减券</template>
                </div>
                <div class="coupon_text">
                  <p class="coupon-name">{{coupon.title}}</p>
                  <p class="use_conditions">{{coupon.description|longStrFormat(13)}}</p>
                  <p class="use_conditions">{{coupon.notice|longStrFormat(13)}}</p>
                  <p class="limit">每人限领{{coupon.get_limit}}张</p>
                </div>
              </div>
              <div class="l_right">
                <div class="got" v-if="coupon.user_count > 0">
                  <img v-if="coupon.card_type === 'CASH'" src="../assets/img/merchant_detail/tab_yigou@2x.png"/>
                  <img src="../assets/img/merchant_detail/tab_yilin@2x.png" v-else/>
                </div>
                <div class="money" v-if="coupon.is_buy === '2'">售价：<span>{{coupon.sale_price|formatMoney(2)}}</span>元</div>
                <div v-if="coupon.user_count > 0 && coupon.user_count >= coupon.get_limit" class="action" :class="{'need-buy': coupon.is_buy === '2'}" @click.stop="showCoupon()">立即使用</div>
                <div v-else-if="coupon.is_buy === '2' && coupon.quantity > 0" class="action" :class="{'need-buy': coupon.is_buy === '2', 'no-left': coupon.quantity <= 0}" @click.stop="receive(coupon.id, couponIndex)">购买</div>
                <div v-else-if="coupon.is_buy === '1' && coupon.quantity > 0" class="action" :class="{'need-buy': coupon.is_buy === '2', 'no-left': coupon.quantity <= 0}" @click.stop="receive(coupon.id, couponIndex)">领取</div>
                <div v-else-if="coupon.quantity <= 0" class="action" :class="{'need-buy': coupon.is_buy === '2', 'no-left': coupon.quantity <= 0}">已领完</div>
                <div class="notice" v-if="coupon.quantity > 999">剩余<span>999</span>张</div>
                <div class="notice" v-else-if="coupon.quantity > 0 && coupon.quantity <= 999">剩余<span>{{coupon.quantity}}</span>张</div>
              </div>
              <div class="border-up"></div>
              <div class="border-down"></div>
            </li>
          </ul>
        </div>
        <div class="merchants" v-if="hotMerchants.length > 0">
          <div class="title">
            热门商户
          </div>
          <div class="content">
            <div class="item" v-for="(merchant, merchantIndex) in hotMerchants" :key="merchantIndex" @click.stop="viewMerchantDetail(merchant.mer_id)">
              <div class="logo">
                <img v-if="merchant.pic" class="normal" :src="merchant.pic|upload"/>
                <img class="default" src="../assets/img/base/icon_goods_default@2x.png" v-else />
              </div>
              <div class="name">{{merchant.name}}</div>
              <div class="price">￥{{merchant.per_cost}}/人</div>
            </div>
          </div>
        </div>
        <div class="padding">
          <div class="pull-notice" v-show="showLoading === false">
            —— {{pullTxt}} ——
          </div>
          <load-more v-show="showLoading" tip="正在加载"></load-more>
        </div>
      </div>
    </div>
    <div v-if="merchant.sdm" class="view-merchant" @click.stop="viewMerchant">去商户看看</div>
  </div>
</template>

<script>
import axios from 'axios'
import BScroll from 'better-scroll'
import { getRect } from '../../src/assets/js/dom'
import { Swiper, SwiperItem, LoadMore, md5 } from 'vux'
import { appId, baseRedirectUrl } from '../config/env'
import { mapState } from 'vuex'
export default {
  name: 'merchant_detail',
  components: { Swiper, SwiperItem, LoadMore },
  inject: ['reload'], // 引入方法
  data () {
    return {
      merId: '',
      merchant: {},
      hotMerchants: [],
      pageLimit: 4,
      currentPage: 1,
      totalPage: 1,
      scroll: {},
      pullUp: true,
      showLoading: false,
      scrolling: false,
      posting: false,
      showIntro: false
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.user_info
    }),
    pullTxt: function () {
      let txt = ''
      if (this.pullUp === true && this.showLoading === false) {
        txt = '滑动加载更多'
      }
      if (this.pullUp === false) {
        txt = '已经到底啦'
      }
      return txt
    }
  },
  watch: {
  },
  created () {
    if (this.$route.params.merId) {
      this.merId = this.$route.params.merId
    }
  },
  mounted () {
    this.getInitData()
  },
  destroyed () {
  },
  methods: {
    getInitData () {
      this.$vux.loading.show({})
      this.$http.all([this.getMerchantDetail(), this.getHotMerchants()]).then(axios.spread((merchant, hotMerchantsRes) => {
        this.$vux.loading.hide()
        this.merchant = merchant
        this.hotMerchants = hotMerchantsRes.data
        this.currentPage = hotMerchantsRes.meta.pagination.current_page
        this.totalPage = hotMerchantsRes.meta.pagination.total_pages
        if (this.totalPage <= this.currentPage) {
          this.pullUp = false
        }
        this.$nextTick(() => {
          this.initScroll()
        })
      }))
    },
    getMerchantDetail () {
      return this.$http.post(this.API.merchantDetail + '?include=coupons', {mer_id: this.merId})
    },
    getHotMerchants () {
      return this.$http.post(this.API.hotMerchants, {page: this.currentPage, page_limit: this.pageLimit})
    },
    loadHotMerchants () {
      if (this.pullUp === false) {
        return false
      }
      this.showLoading = true
      this.$http.post(this.API.hotMerchants, {page: this.currentPage + 1, page_limit: this.pageLimit}).then(res => {
        this.showLoading = false
        this.hotMerchants = this.hotMerchants.concat(res.data)
        this.currentPage = res.meta.pagination.current_page
        this.totalPage = res.meta.pagination.total_pages
        if (this.totalPage <= this.currentPage) {
          this.pullUp = false
        }
        this.$nextTick(() => {
          this.refresh()
        })
      })
    },
    // 初始化滚动
    initScroll () {
      if (!this.$refs.wrapper) {
        return
      }
      this.$refs.wrapper.style.minHeight = `${getRect(this.$refs.wrapper).height + 1}px`
      let options = {
        probeType: 1,
        click: true,
        pullUpLoad: true
      }
      this.scroll = new BScroll(this.$refs.wrapper, options)

      if (this.pullUp) {
        this.scroll.on('scrollEnd', () => {
          // 滚动到底部
          if (this.scroll.y <= (this.scroll.maxScrollY + 10)) {
            this.loadHotMerchants()
          }
        })
      }

      this.scroll.on('scroll', (pos) => {
        if (pos.y < 0) {
          this.scrolling = true
        } else {
          this.scrolling = false
        }
      })
    },
    refresh () {
      // 代理better-scroll的refresh方法
      this.scroll && this.scroll.refresh()
    },
    doFav (merId) {
      if (this.posting) {
        return false
      }
      this.$vux.loading.show({})
      this.posting = true
      this.$http.post(this.API.fav, {mer_id: merId}).then(res => {
        console.log(res)
        this.$vux.loading.hide()
        this.posting = false
        if (res.status_code) {
          if (res.status_code === 401) {
            this.$vux.toast.show({
              type: 'text',
              text: '<span style="font-size: 14px">未登录</span>',
              position: 'middle'
            })
            setTimeout(() => {
              let redirect = this.$router.currentRoute.fullPath
              let redirectUri = baseRedirectUrl + '/wechat.html'
              let oauthUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appId + '&redirect_uri=' + encodeURIComponent(redirectUri) + '&response_type=code&scope=snsapi_userinfo&state=' + encodeURIComponent(redirect) + '#wechat_redirect'
              window.location.href = oauthUrl
            }, 2000)
            return false
          } else {
            this.$vux.toast.show({
              type: 'text',
              text: '<span style="font-size: 14px">收藏失败</span>',
              position: 'middle'
            })
            return false
          }
        }
        this.merchant.is_fav = this.merchant.is_fav === 0 ? 1 : 0
      })
    },
    callMobile (mobile) {
      window.location.href = 'tel://' + mobile
    },
    receive (pcid, couponIndex) {
      if (this.posting) {
        return false
      }
      this.$vux.loading.show({})
      this.posting = true
      this.$http.post(this.API.receiveCoupon, {pcid: pcid, frontUrl: baseRedirectUrl + '/coupon.html'}).then(res => {
        this.$vux.loading.hide()
        this.posting = false
        if (typeof res.payUrl === 'undefined') {
          if (res.status_code === 401) {
            this.$vux.toast.show({
              type: 'text',
              text: '<span style="font-size: 14px">未登录</span>',
              position: 'middle'
            })
            setTimeout(() => {
              let redirect = this.$router.currentRoute.fullPath
              let redirectUri = baseRedirectUrl + '/wechat.html'
              let oauthUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appId + '&redirect_uri=' + encodeURIComponent(redirectUri) + '&response_type=code&scope=snsapi_userinfo&state=' + encodeURIComponent(redirect) + '#wechat_redirect'
              window.location.href = oauthUrl
            }, 2000)
            return false
          } else {
            let message = res.message ? res.message : '未知错误'
            this.$vux.toast.show({
              type: 'text',
              text: '<span style="font-size: 14px">' + message + '</span>',
              position: 'middle'
            })
            return false
          }
        } else if (res.payUrl === '') {
          this.$vux.toast.show({
            type: 'text',
            text: '<span style="font-size: 14px">领取成功</span>',
            position: 'middle'
          })
          this.merchant.coupons[couponIndex].quantity = this.merchant.coupons[couponIndex].quantity - 1
          this.merchant.coupons[couponIndex].user_count = this.merchant.coupons[couponIndex].user_count + 1
          return true
        } else {
          window.location.href = res.payUrl
          return true
        }
      })
    },
    viewMerchantDetail (merId) {
      this.$router.push({name: 'merchant_detail', params: {merId: merId}})
      this.reload()
    },
    viewMerchant () {
      if (this.merchant.sdm === '') {
        this.$vux.toast.show({
          type: 'text',
          text: '<span style="font-size: 14px">商户不存在</span>',
          position: 'middle'
        })
        return false
      }

      console.log(this.userInfo)
      if (!this.userInfo.member_id) {
        this.$vux.toast.show({
          type: 'text',
          text: '<span style="font-size: 14px">未登录</span>',
          position: 'middle'
        })
        setTimeout(() => {
          let redirect = this.$router.currentRoute.fullPath
          let redirectUri = baseRedirectUrl + '/wechat.html'
          let oauthUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appId + '&redirect_uri=' + encodeURIComponent(redirectUri) + '&response_type=code&scope=snsapi_userinfo&state=' + encodeURIComponent(redirect) + '#wechat_redirect'
          window.location.href = oauthUrl
        }, 2000)
        return false
      }

      if (!this.userInfo.mobile) {
        this.$vux.toast.show({
          type: 'text',
          text: '<span style="font-size: 14px">未绑定手机号</span>',
          position: 'middle'
        })
        setTimeout(() => {
          let redirect = this.$router.currentRoute.fullPath
          this.$router.push({path: 'bind_mobile', query: {redirect: redirect}})
        }, 2000)
        return false
      }

      let prefix = /^http(.*)$/.test(this.merchant.sdm) ? '' : 'http://'

      let postUrl = prefix + this.merchant.sdm + '/index.php/openapi/catering_route/platform_oauth'
      let mobile = this.userInfo.mobile
      let platformId = this.userInfo.member_id

      let signStr = 'mobile=' + mobile + '&platform_id=' + platformId + '&' + md5(this.merId)
      // let signStr = 'mobile=' + mobile + '&platform_id=' + platformId + '&' + md5('99904081602435')
      let _this = this
      let sign = md5(signStr)

      axios.post(postUrl, {
        mobile: mobile,
        platform_id: platformId,
        sign_type: 'MD5',
        sign: sign
      }).then(function (response) {
        if (response.status === 200 && response.data.return_code === '0000' && response.data.redirect_url) {
          window.location.href = response.data.redirect_url
        } else {
          _this.$vux.toast.show({
            type: 'text',
            text: '<span style="font-size: 14px">查看失败</span>',
            position: 'middle'
          })
        }
        console.log(response)
      }).catch(function (error) {
        console.log(error)
        _this.$vux.toast.show({
          type: 'text',
          text: '<span style="font-size: 14px">查看失败</span>',
          position: 'middle'
        })
      })
    },
    showCoupon () {
      this.$router.push('/coupon_show')
    }
  }
}
</script>

<style lang="less" scoped>
  @import "../assets/css/common";
  @keyframes myopacity
  {
    from {opacity:1;}
    to {opacity:0;}
  }

  /*Safari 和 Chrome:*/
  @-webkit-keyframes myopacity
  {
    from {opacity:1;}
    to {opacity:0;}
  }
  .merchant-detail-page {
    height: 100%;
    background:rgba(246,246,246,1);
    .wrapper {
      height: 100%;
      overflow: hidden;
      .wrapper-content {
        .pics {
          background:rgba(255,255,255,1);
          height: 257.5px;
          padding: 15px;
          img {
            width: 345px;
            height: 227.5px;
            border-radius: 15px;
          }
        }
        .info {
          background:rgba(255,255,255,1);
          padding: 5.5px 15px;
          .name {
            display: flex;
            justify-content: space-between;
            .txt {
              height:28px;
              font-size:20px;
              font-weight:bold;
              line-height:24px;
              color:rgba(51,51,51,1);
              text-align: left;
            }
            .fav {
              width:80px;
              height:27px;
              border:1px solid rgba(221,221,221,1);
              border-radius:15px;
              display: flex;
              justify-content: center;
              align-items: center;
              img {
                width: 24px;
                height: 24px;
              }
              span {
                height:18.5px;
                font-size:13px;
                font-weight:400;
                line-height:18.5px;
                color:rgba(102,102,102,1);
              }
            }
          }
          .price {
            height:18.5px;
            font-size:12px;
            font-weight:400;
            line-height:15.5px;
            color:rgba(51,51,51,1);
            text-align: left;
          }
          .params {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            height: 39.5px;
            .item {
              display: flex;
              justify-content: flex-start;
              align-items: center;
              margin-right: 12px;
              img {
                width: 11px;
                height: 11px;
                margin-right: 3.5px;
              }
              span {
                height:16.5px;
                font-size:12px;
                font-weight:400;
                line-height:16.5px;
                color:rgba(153,153,153,1);
              }
            }
          }
          .time-addr {
            height: 80px;
            border-top:1px solid #E5E5E5;
            border-bottom:1px solid #E5E5E5;
            padding-top: 14.5px;
            .item {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 10px;
              .icon {
                width: 14px;
                height: 14px;
                margin-right: 5px;
              }
              .txt {
                width: 100%;
                height:20px;
                font-size:14px;
                font-weight:400;
                line-height:20px;
                color:rgba(51,51,51,1);
                text-align: left;
              }
            }
            .time {
              .txt {
                margin-right: 14.5px;
                border-right:1px solid rgba(229,229,229,1);
              }
              .tel {
                width: 24px;
                height: 24px;
              }
            }
          }
          .intro-detail {
            font-size:13px;
            font-weight:400;
            line-height:21px;
            color:rgba(102,102,102,1);
            text-align: left;
            margin-top: 20px;
          }
          .intro {
            height: 44px;
            display: flex;
            justify-content: center;
            align-items: center;
            span {
              height:20px;
              font-size:14px;
              font-weight:400;
              line-height:18px;
              color:rgba(153,153,153,1);
              margin-right: 2.5px;
            }
            img {
              width: 14px;
              height: 14px;
            }
          }
        }
        .coupons{
          margin-top: 10px;
          padding: 10px;
          margin-top: 10px;
          background:rgba(255,255,255,1);
          .coupon-title {
            height:24px;
            font-size:17px;
            font-weight:bold;
            line-height:24px;
            color:rgba(51,51,51,1);
            margin-bottom: 15px;
            text-align: left;
          }
          .content {
            .item{
              position: relative;
              display: flex;
              width: 100%;
              height:117px;
              background:rgba(255,255,255,1);
              border:1px solid rgba(0,0,0,0);
              box-shadow:0px 0px 7.5px rgba(0,0,0,0.1);
              margin-bottom: 10px;
              .li_left{
                display: flex;
                width: 250.5px;
                padding: 20px 11.5px 22px 15px;
                border-right:1px dashed rgba(221,221,221,1);
                .coupon_icon{
                  position: relative;
                  width: 50px;
                  height: 44px;
                  margin-right: 20px;
                  margin-top: 20.5px;
                  font-size:12px;
                  font-weight:400;
                  line-height:44px;
                  color:rgba(255,111,96,1);
                  background:linear-gradient(141deg,rgba(255,237,235,1) 0%,rgba(255,215,209,1) 100%);
                  box-shadow:0px 4px 10px rgba(212,105,91,0.1);
                  border-radius:5px;
                  text-align: center;
                }
                .coupon_text{
                  height: 100%;
                  .coupon-name {
                    height:21px;
                    font-size:15px;
                    font-weight:bold;
                    line-height:21px;
                    color:rgba(51,51,51,1);
                    text-align: left;
                  }
                  .use_conditions{
                    height:16.5px;
                    font-size:12px;
                    font-weight:400;
                    line-height:16.5px;
                    color:rgba(153,153,153,1);
                    margin-top: 5.5px;
                    text-align: left;
                  }
                  .limit {
                    height:16.5px;
                    font-size:12px;
                    font-weight:400;
                    line-height:12px;
                    color:rgba(91,158,219,1);
                    margin-top: 5px;
                    text-align: left;
                  }
                }
              }
              .l_right{
                position: relative;
                width: 104.5px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                .money{
                  position: relative;
                  height:28px;
                  font-size:10px;
                  font-weight:400;
                  line-height:28px;
                  color:rgba(51,51,51,1);
                  span {
                    font-size: 20px;
                    color: #F95349;
                  }
                }
                .action {
                  position: relative;
                  width:65px;
                  height:27px;
                  background:linear-gradient(90deg,rgba(255,164,103,1) 0%,rgba(249,80,72,1) 100%);
                  border-radius:15px;
                  text-align: center;
                  line-height: 27px;
                  font-size:12px;
                  font-weight:400;
                  color:rgba(255,255,255,1);
                }
                .need-buy {
                  background:linear-gradient(90deg,rgba(255,126,126,1) 0%,rgba(223,61,61,1) 100%);
                }
                .no-left {
                  background:rgba(221,221,221,1);
                }
                .notice {
                  position: relative;
                  height:16.5px;
                  font-size:12px;
                  margin-top: 5px;
                  font-weight:500;
                  line-height:16.5px;
                  color:rgba(153,153,153,1);
                  text-align: center;
                  span {
                    font-size: 12px;
                    color: #F95349;
                  }
                }
                .got {
                  position: absolute;
                  top: 0;
                  right: 0;
                  img {
                    width: 57.5px;
                    height: 50px;
                  }
                }
              }
              .border-up {
                position: absolute;
                top: -10px;
                left: 240.5px;
                width: 16px;
                height: 16px;
                border-radius: 8px;
                background:rgba(255,255,255,1);
                box-shadow:0px -2px 0px rgba(0,0,0,0.1) inset;
              }
              .border-down {
                position: absolute;
                bottom: -10px;
                left: 240.5px;
                width: 16px;
                height: 16px;
                border-radius: 8px;
                background:rgba(255,255,255,1);
                box-shadow:0px 2px 0px rgba(0,0,0,0.1) inset;
              }
            }
          }
        }
        .merchants {
          margin-top: 10px;
          padding: 0 15px;
          .title {
            height:24px;
            font-size:17px;
            font-weight:bold;
            line-height:24px;
            color:rgba(51,51,51,1);
            text-align: left;
          }
          .content {
            display: flex;
            justify-content: flex-start;
            flex-wrap: wrap;
            .item {
              margin-top: 10px;
              width:167.5px;
              box-shadow:0px 1px 7.5px rgba(0,0,0,0.1);
              /*opacity:0.75;*/
              border-radius:4px;
              padding-bottom: 15px;
              .logo {
                display: flex;
                align-items: center;
                justify-content: center;
                height: 112.5px;
                .normal {
                  width: 100%;
                  height: 100%;
                }
                .default {
                  width: 50px;
                  height: 50px;
                }
              }
              .name {
                padding: 10px 14.5px;
                font-size:14px;
                font-weight:bold;
                line-height:21px;
                color:rgba(51,51,51,1);
                text-align: left;
              }
              .price {
                height: 18.5px;
                padding: 0 14.5px;
                font-size:12px;
                font-weight:400;
                line-height:15.5px;
                color:rgba(102,102,102,1);
                text-align: left;
              }
            }
            .item:nth-child(2n - 1) {
              margin-right: 10px;
            }
          }
        }
        .padding {
          height: 118px;
          .pull-notice {
            height: 69px;
            line-height: 69px;
            font-size:12px;
            font-weight:400;
            color:rgba(204,204,204,1);
          }
        }
      }
    }
    .view-merchant {
      position: fixed;
      bottom: 25px;
      left: 32.5px;
      width:310px;
      height:44px;
      background:linear-gradient(270deg,rgba(56,161,255,1) 0%,rgba(26,127,255,1) 100%);
      box-shadow:0px 5px 10px rgba(56,161,255,0.6);
      border-radius: 22px;
      font-size:14px;
      font-weight:400;
      line-height:44px;
      color:rgba(255,255,255,1);
    }
  }
</style>
