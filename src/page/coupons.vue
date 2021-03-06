<template>
  <div class="coupons-page">
    <div class="banner"><img src="../assets/img/coupons/bg_lingquan@2x.png"/></div>
    <div ref="typesWrapper" class="types-wrapper">
      <div class="wrapper-content">
        <div class="item" :class="{active: cardType === ''}" @click.stop="setCardType('')">全部</div>
        <div class="item" :class="{active: cardType === 'CASH'}" @click.stop="setCardType('CASH')">代金券</div>
        <div class="item" :class="{active: cardType === 'FULL_REDUCTION'}" @click.stop="setCardType('FULL_REDUCTION')">满减券</div>
        <div class="item" :class="{active: cardType === 'GIFT'}" @click.stop="setCardType('GIFT')">兑换券</div>
        <div class="item" :class="{active: cardType === 'DISCOUNT'}" @click.stop="setCardType('DISCOUNT')">折扣券</div>
      </div>
    </div>
    <div ref="couponsWrapper" class="coupons-wrapper">
      <ul class="wrapper-content">
        <li class="item" v-for="(coupon, couponIndex) in coupons" :key="couponIndex" @click.stop="showCouponDetail(coupon.id)">
          <div class="li_left">
            <div class="coupon_icon">
              <img :src="coupon.logo|upload">
              <span class="label">
                <template v-if="coupon.card_type === 'CASH'">代金券</template>
              <template v-else-if="coupon.card_type === 'DISCOUNT'">折扣券</template>
              <template v-else-if="coupon.card_type === 'GIFT'">礼品券</template>
              <template v-else-if="coupon.card_type === 'FULL_REDUCTION'">满减券</template>
              </span>
            </div>
            <div class="coupon_text">
              <p class="coupon-name">{{coupon.title|longStrFormat(7)}}</p>
              <p class="use_conditions">{{coupon.description|longStrFormat(9)}}</p>
              <p class="use_conditions">{{coupon.notice|longStrFormat(9)}}</p>
              <p class="limit">每人限领{{coupon.get_limit}}张</p>
            </div>
          </div>
          <div class="l_right" @click.stop>
            <div class="got" v-if="coupon.user_count > 0">
              <img v-if="coupon.is_buy === '2'" src="../assets/img/merchant_detail/tab_yigou@2x.png"/>
              <img src="../assets/img/merchant_detail/tab_yilin@2x.png" v-else/>
            </div>
            <div class="money" v-if="coupon.is_buy === '2'">售价：<span>{{coupon.sale_price|formatMoney}}</span>元</div>
            <div v-if="coupon.user_count > 0 && coupon.user_count >= coupon.get_limit" class="action use" :class="{'need-buy': coupon.is_buy === '2'}" @click.stop="showCoupon()">立即使用</div>
            <div v-else-if="coupon.is_buy === '2' && coupon.quantity > 0" class="action" :class="{'need-buy': coupon.is_buy === '2', 'no-left': coupon.quantity <= 0}" @click.stop="receive(coupon.id, couponIndex)">购买</div>
            <div v-else-if="coupon.is_buy === '1' && coupon.quantity > 0" class="action" :class="{'need-buy': coupon.is_buy === '2', 'no-left': coupon.quantity <= 0}" @click.stop="receive(coupon.id, couponIndex)">领取</div>
            <div v-else-if="coupon.quantity <= 0" class="action" :class="{'need-buy': coupon.is_buy === '2', 'no-left': coupon.quantity <= 0}">已领完</div>
            <div class="notice" v-if="coupon.quantity > 999">剩余<span>999</span>张</div>
            <div class="notice" v-else-if="coupon.quantity > 0 && coupon.quantity <= 999">剩余<span>{{coupon.quantity}}</span>张</div>
          </div>
          <div class="border-up"></div>
          <div class="border-down"></div>
        </li>
        <div class="padding" ref="padding">
          <div class="pull-notice" v-show="showLoading === false">
            —— {{pullTxt}} ——
          </div>
          <load-more v-show="showLoading" tip="正在加载"></load-more>
        </div>
      </ul>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import { getRect } from '../../src/assets/js/dom'
import { LoadMore } from 'vux'
import { baseRedirectUrl, appId, oauthBaseUrl } from '../../src/config/env'
import Valid from '../utils/valid'
export default {
  name: 'coupons',
  components: { LoadMore },
  inject: ['reload'], // 引入方法
  data () {
    return {
      cardType: '',
      coupons: [],
      pageLimit: 4,
      currentPage: 0,
      totalPage: 1,
      scroll: '',
      typeScroll: '',
      pullUp: true,
      showLoading: false,
      scrolling: false,
      posting: false,
      ios: Valid.is_ios
    }
  },
  computed: {
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
  },
  mounted () {
    this.getCoupons()
    this.$nextTick(() => {
      this.initTypesScroll()
    })
  },
  destroyed () {
  },
  methods: {
    getCoupons () {
      if (this.pullUp === false) {
        return false
      }
      let page = this.currentPage + 1
      let postData = {
        card_type: this.cardType,
        page_limit: this.pageLimit
      }
      this.showLoading = true
      this.$http.post(this.API.coupons + '?page=' + page, postData).then(res => {
        this.showLoading = false
        this.coupons = this.coupons.concat(res.data)
        this.currentPage = res.meta.pagination.current_page
        this.totalPage = res.meta.pagination.total_pages
        if (this.totalPage <= this.currentPage) {
          this.pullUp = false
        }
        if (this.scroll) {
          this.$nextTick(() => {
            this.refresh()
          })
        } else {
          this.$nextTick(() => {
            this.initScroll()
          })
        }
      })
    },
    // 初始化滚动
    initTypesScroll () {
      if (!this.$refs.typesWrapper) {
        return
      }
      this.$refs.typesWrapper.style.minWidth = `${getRect(this.$refs.typesWrapper).width + 1}px`
      let options = {
        startX: 0,
        click: true,
        scrollX: true,
        scrollY: false,
        eventPassthrough: 'vertical'
      }
      this.typeScroll = new BScroll(this.$refs.typesWrapper, options)
    },
    // 初始化滚动
    initScroll () {
      if (!this.$refs.couponsWrapper) {
        return
      }
      this.$refs.couponsWrapper.style.minHeight = `${getRect(this.$refs.couponsWrapper).height + 1}px`
      let options = {
        probeType: 1,
        click: true,
        pullUpLoad: true,
        useTransition: !this.ios
      }
      this.scroll = new BScroll(this.$refs.couponsWrapper, options)

      if (this.pullUp) {
        this.scroll.on('scrollEnd', () => {
          // 滚动到底部
          if (this.scroll.y <= (this.scroll.maxScrollY + 10)) {
            this.getCoupons()
          }
        })
      }

      this.scroll.on('scroll', (pos) => {
        this.scrollY = 0 - pos.y
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
    setCardType (cardType) {
      this.cardType = cardType
      this.pullUp = true
      this.currentPage = 0
      this.totalPage = 1
      this.coupons = []
      this.getCoupons()
    },
    receive (pcid, couponIndex) {
      if (this.posting) {
        return false
      }
      this.$vux.loading.show({})
      this.posting = true
      this.$http.post(this.API.receiveCoupon, {pcid: pcid, frontUrl: baseRedirectUrl + '/coupon.html'}).then(res => {
        this.posting = false
        this.$vux.loading.hide()
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
              let oauthUrl =
                    oauthBaseUrl +
                    '/weixin_redirect?redirect_uri=' +
                    encodeURIComponent(redirectUri) +
                    '&redirect=' +
                    encodeURIComponent(redirect)
              // let oauthUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appId + '&redirect_uri=' + encodeURIComponent(redirectUri) + '&response_type=code&scope=snsapi_userinfo&state=' + encodeURIComponent(redirect) + '#wechat_redirect'
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
          this.coupons[couponIndex].quantity = this.coupons[couponIndex].quantity - 1
          this.coupons[couponIndex].user_count = this.coupons[couponIndex].user_count + 1
          return true
        } else {
          window.location.href = res.payUrl
          return true
        }
      })
    },
    showCoupon () {
      this.$router.push('/coupon_show')
    },
    showCouponDetail (pcId) {
      this.$router.push({path: 'coupon_detail/' + pcId})
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
  .coupons-page {
    height: 100%;
    background:rgba(255,255,255,1);
    .banner {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 130px;
      z-index: 99;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .types-wrapper {
      position: fixed;
      left: 0;
      top: 130px;
      height: 49px;
      width: 375px;
      overflow: hidden;
      z-index: 99;
      background:rgba(255,255,255,1);
      .wrapper-content {
        min-width: 410px;
        display: flex;
        justify-content: flex-start;
        height: 100%;
        padding-top: 12px;
        padding-left: 25px;
        .item {
          position: relative;
          height:37px;
          min-width:45px;
          font-size:15px;
          font-weight:400;
          line-height:37px;
          color:rgba(153,153,153,1);
          margin-right: 35px;
          /*border-bottom: 3px solid #38A1FF;*/
        }
        .item:first-child {
          min-width:30px;
        }
        .active {
          color:rgba(56,161,255,1);
        }
        .active:after {
          content: '';
          width: 100%;
          height:3px;
          background:rgba(56,161,255,1);
          border-radius:1.5px;
          position: absolute;
          left: 0;
          top:34px;
        }
      }
    }
    .coupons-wrapper{
      height: 100%;
      padding: 0 10px;
      overflow: hidden;
      .wrapper-content {
        padding-top: 194px;
        .item{
          position: relative;
          display: flex;
          width: 100%;
          height:117px;
          background:rgba(255,255,255,1);
          border:1px solid rgba(0,0,0,0);
          border-radius: 6px;
          box-shadow:0px 0px 7.5px rgba(0,0,0,0.1);
          margin-bottom: 10px;
          .li_left{
            display: flex;
            width: 250.5px;
            padding: 20px 11.5px 22px 15px;
            border-right:1px dashed rgba(221,221,221,1);
            .coupon_icon{
              /*position: relative;*/
              /*width: 50px;*/
              /*height: 44px;*/
              /*margin-right: 20px;*/
              /*margin-top: 20.5px;*/
              /*font-size:12px;*/
              /*font-weight:400;*/
              /*line-height:44px;*/
              /*color:rgba(255,111,96,1);*/
              /*background:linear-gradient(141deg,rgba(255,237,235,1) 0%,rgba(255,215,209,1) 100%);*/
              /*box-shadow:0px 4px 10px rgba(212,105,91,0.1);*/
              /*border-radius:5px;*/
              /*text-align: center;*/
              position: relative;
              width: 100px;
              height: 100%;
              margin-right: 5px;
              img{
                width: 75px;
                height: 75px;
                border-radius: 3px;
              }
              .label{
                position: absolute;
                top: 0;
                left: 0;
                width: 41px;
                height: 17.5px;
                background:rgba(51,51,51,1);
                opacity:0.8;
                border-radius:2px 2px 2px 0px;
                font-size: 10px;
                font-weight:400;
                line-height:17.5px;
                text-align: center;
                color:rgba(255,255,255,1);
              }
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
            .use {
              background: rgba(255,255,255,1);
              border:1px solid rgba(249,83,73,1);
              color:rgba(249,83,73,1);
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
        .padding {
          height: 69px;
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
  }
</style>
