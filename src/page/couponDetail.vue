<template>
  <div class="coupon-detail-page" ref="couponDetailPage">
    <div class="content" ref="content">
      <div class="left-count">剩余<span>{{coupon.quantity}}</span>张</div>
      <div class="title">{{coupon.title}}</div>
      <div class="description">{{coupon.description}}</div>
      <div class="btn" v-if="coupon.user_count > 0 && coupon.user_count >= coupon.get_limit" :class="{'need-buy': coupon.is_buy === '2'}" @click.stop="showCoupon">立即使用</div>
      <div class="btn" v-else-if="coupon.is_buy === '2' && coupon.quantity > 0" :class="{'need-buy': coupon.is_buy === '2', 'no-left': coupon.quantity <= 0}" @click.stop="receive(coupon.id)">立即购买</div>
      <div class="btn" v-else-if="coupon.is_buy === '1' && coupon.quantity > 0" :class="{'need-buy': coupon.is_buy === '2', 'no-left': coupon.quantity <= 0}" @click.stop="receive(coupon.id)">立即领取</div>
      <div class="btn" v-else-if="coupon.quantity <= 0" :class="{'need-buy': coupon.is_buy === '2', 'no-left': coupon.quantity <= 0}">已领完</div>
      <div class="get-limit">每人限购{{coupon.get_limit}}张</div>
      <div class="expire-time">有效期：{{coupon.expire_date}}</div>
      <div class="item notice">
        <div class="notice-title" @click.stop="showNotice = true;resetHeight()">
          <span class="txt">使用须知</span>
          <img v-show="!showNotice" src="../assets/img/base/icon_arrow_down@2x.png"/>
        </div>
        <div v-show="showNotice" class="notice-content">{{coupon.notice}}</div>
        <div v-show="showNotice" class="action-up" @click.stop="showNotice = false;resetHeight()"><img src="../assets/img/base/icon_arrow_up@2x.png"/></div>
      </div>
      <div class="item store">
        <div class="notice-title" @click.stop="showStores = true;resetHeight()">
          <span class="txt">适用门店</span>
          <img v-show="!showStores" src="../assets/img/base/icon_arrow_down@2x.png"/>
        </div>
        <div v-show="showStores" class="notice-content">
          <div class="notice-content-item" v-for="merchant in coupon.merchants" :key="merchant.mer_id">
            <span class="store-name">{{merchant.mer_name}}</span>
            <span class="open-time">（营业时间：{{merchant.open_time}}）</span>
          </div>
        </div>
        <div v-show="showStores" class="action-up" @click.stop="showStores = false;resetHeight()"><img src="../assets/img/base/icon_arrow_up@2x.png"/></div>
      </div>
    </div>
    <div class="circles">
      <div class="circle"></div>
      <div class="circle"></div>
      <div class="circle"></div>
      <div class="circle"></div>
      <div class="circle"></div>
      <div class="circle"></div>
      <div class="circle"></div>
      <div class="circle"></div>
      <div class="circle"></div>
      <div class="circle"></div>
      <div class="circle"></div>
      <div class="circle"></div>
      <div class="circle"></div>
      <div class="circle"></div>
      <div class="circle"></div>
      <div class="circle"></div>
      <div class="circle"></div>
      <div class="circle"></div>
      <div class="circle"></div>
    </div>
  </div>
</template>

<script>
import { baseRedirectUrl, appId, oauthBaseUrl } from '../../src/config/env'
import { getRect } from '../../src/assets/js/dom'
export default {
  name: 'coupon_detail',
  components: {},
  inject: ['reload'], // 引入方法
  data () {
    return {
      pcId: '',
      coupon: {},
      showNotice: false,
      showStores: false,
      posting: false
    }
  },
  computed: {
  },
  watch: {
  },
  created () {
    if (this.$route.params.pcId) {
      this.pcId = this.$route.params.pcId
    }
  },
  mounted () {
    this.getCouponDetail()
  },
  destroyed () {
  },
  methods: {
    getCouponDetail () {
      this.$vux.loading.show({})
      this.$http.post(this.API.couponDetail, {pcid: this.pcId}).then(res => {
        this.$vux.loading.hide()
        if (res.id) {
          this.coupon = res
        } else {
        }
      })
    },
    receive (pcid) {
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
          this.coupon.quantity = this.coupon.quantity - 1
          this.coupon.user_count = this.coupon.user_count + 1
        } else {
          window.location.href = res.payUrl
        }
      })
    },
    showCoupon () {
      this.$router.push('/coupon_show')
    },
    resetHeight () {
      this.$nextTick(() => {
        let clientHeight = document.body.clientHeight
        let contentHeight = getRect(this.$refs.content).height
        let newPageHeight = contentHeight < clientHeight ? clientHeight : contentHeight
        this.$refs.couponDetailPage.style.height = (newPageHeight + 40) + 'px'
      })
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
  .coupon-detail-page {
    height: 100%;
    background:rgba(82,173,255,1);
    padding: 25px 15px;
    color:rgba(51,51,51,1);
    .content {
      position: relative;
      width:344.5px;
      background:rgba(255,255,255,1);
      padding: 17.5px 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      .left-count {
        width: 100%;
        height:20px;
        font-size:14px;
        font-weight:500;
        line-height:20px;
        text-align: right;
        span {
          color: #F95349;
        }
      }
      .title {
        margin-top: 14.5px;
        height:31px;
        font-size:22px;
        font-weight:bold;
        line-height:31px;
      }
      .description {
        margin-top: 14.5px;
        width:242.5px;
        font-size:13px;
        font-weight:400;
        line-height:39px;
        color:rgba(153,153,153,1);
        text-align: center;
      }
      .btn {
        margin-top: 30px;
        height:44px;
        background:linear-gradient(90deg,rgba(255,77,20,1) 0%,rgba(255,126,22,1) 100%);
        border-radius:22px;
        padding: 0px 56px 0px 60px;
        height:44px;
        font-size:16px;
        font-weight:400;
        line-height:44px;
        color:rgba(255,255,255,1);
      }
      .no-left {
        background:rgba(221,221,221,1);
      }
      .get-limit, .expire-time {
        margin-top: 34.5px;
        height:18.5px;
        font-size:13px;
        font-weight:400;
        line-height:18.5px;
        color:rgba(102,102,102,1);
        width: 100%;
        text-align: left;
      }
      .expire-time {
        margin-top: 10px;
      }
      .item {
        width: 100%;
        border-bottom:1px solid rgba(229,229,229,1);
        .notice-title {
          height: 44px;
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .txt {
            height:20px;
            font-size:14px;
            font-weight:500;
            line-height:20px;
            color:rgba(51,51,51,1);
          }
          img {
            width: 14px;
            height: 14px;
          }
        }
        .notice-content {
          font-size:13px;
          font-weight:400;
          line-height:17px;
          color:rgba(102,102,102,1);
          text-align: left;
          .notice-content-item{
            margin-bottom: 10px;
          }
        }
        .action-up {
          height: 25px;
          width: 100%;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          img {
            width: 14px;
            height: 14px;
          }
        }
      }
      .notice {
        margin-top: 15.5px;
        border-top:1px dashed rgba(229,229,229,1);
      }
      .store {
        margin-bottom: 15px;
      }
    }
    .circles {
      position: relative;
      top: -4px;
      width: 100%;
      display: flex;
      justify-content: space-between;
      padding: 0 20px;
      .circle {
        width: 10px;
        height: 10px;
        border-radius: 5px;
        background:rgba(82,173,255,1);
      }
    }
    .content:before {
      content: '';
      background:rgba(82,173,255,1);
      width: 25px;
      height: 25px;
      border-radius: 12.5px;
      position: absolute;
      top: 135px;
      left: -12.5px;
    }
    .content:after {
      content: '';
      background:rgba(82,173,255,1);
      width: 25px;
      height: 25px;
      border-radius: 12.5px;
      position: absolute;
      top: 135px;
      right: -12.5px;
    }
    /*.content:after {*/
      /*content: '';*/
      /*background:rgba(82,173,255,1);*/
      /*width: 25px;*/
      /*height: 25px;*/
      /*border-radius: 12.5px;*/
      /*position: absolute;*/
      /*top: 150px;*/
      /*left: 347px;*/
    /*}*/
  }
</style>
