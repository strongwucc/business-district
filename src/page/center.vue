<template>
  <div class="center-page">
    <div class="background"></div>
    <div class="user-info">
      <div class="left">
        <img v-if="user.avatar" :src="user.avatar"/>
        <img src="../assets/img/center/member_head_gril@2x.png" v-else/>
      </div>
      <div class="middle">
        <div class="name">{{user.nickname}}</div>
        <div class="no">NO.{{user.mobile}}</div>
      </div>
      <div class="right">
        <div class="time">
          <template v-if="hours < 12">
            <img src="../assets/img/center/member_icon_morning@2x.png"/>
            <span>早上好</span>
          </template>
          <template v-if="hours === 12">
            <img src="../assets/img/center/member_icon_noon@2x.png"/>
            <span>中午好</span>
          </template>
          <template v-if="hours > 12 && hours < 18">
            <img src="../assets/img/center/member_icon_afternoon@2x.png"/>
            <span>下午好</span>
          </template>
          <template v-if="hours >= 18">
            <img src="../assets/img/center/member_icon_night@2x.png"/>
            <span>晚上好</span>
          </template>
        </div>
        <div class="code" @click.stop="showCode = true">
          <img class="icon" src="../assets/img/center/member_icon_erweima@2x.png"/>
          <span>会员码</span>
        </div>
      </div>
    </div>
    <div class="score-coupon">
      <div class="item" @click.stop="showPoint">
        <span class="content">{{user.point}}</span>
        <span class="title">我的积分</span>
      </div>
      <div class="item" @click.stop="$router.push({path: '/my_coupons'})">
        <span class="content">3</span>
        <span class="title">优惠券</span>
      </div>
    </div>
    <div class="list">
      <div class="list-item" @click.stop="$router.push({path: '/user_info'})">
        <div class="left"><img src="../assets/img/center/member_icon_huiyuan@2x.png"/></div>
        <div class="right">
          <span>会员信息</span>
          <img src="../assets/img/base/icon_arrow_right@2x.png"/>
        </div>
      </div>
      <div class="list-item" @click.stop="$router.push({path: '/orders'})">
        <div class="left"><img src="../assets/img/center/member_icon_order@2x.png"/></div>
        <div class="right">
          <span>我的订单</span>
          <img src="../assets/img/base/icon_arrow_right@2x.png"/>
        </div>
      </div>
      <div class="list-item" @click.stop="$router.push({path: '/collection'})">
        <div class="left"><img src="../assets/img/center/member_icon_collect@2x.png"/></div>
        <div class="right">
          <span>我的收藏</span>
          <img src="../assets/img/base/icon_arrow_right@2x.png"/>
        </div>
      </div>
    </div>
    <div class="mask" v-show="showCode"></div>
    <transition name="fade">
      <div class="member-code" v-show="showCode">
        <div class="padding"></div>
        <div class="code-title">动态会员码</div>
        <div class="code-sub-title">会员余额支付,请向店员展示</div>
        <div class="barcode" v-if="user.mobile"><barcode :value="user.mobile" :options="{ displayValue: true, height: 64.5, width: 2, fontSize: 14, textMargin: 2.5}"></barcode></div>
        <div class="qrcode"><qrcode :value="user.mobile" :options="{ width: 121, margin: 0 }"></qrcode></div>
        <div class="notice notice-1">每60s自动刷新</div>
        <div class="notice">如遇扫码失败</div>
        <div class="notice">请将屏幕调至最亮重新扫码</div>
        <div class="refresh">手动刷新动态码</div>
      </div>
    </transition>
    <transition name="fade">
      <div v-show="showCode" class="close" @click.stop="showCode = false">x</div>
    </transition>
  </div>
</template>

<script>
import Barcode from '@xkeshi/vue-barcode'
import Qrcode from '@chenfengyuan/vue-qrcode'
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'center',
  components: { Barcode, Qrcode },
  inject: ['reload'], // 引入方法
  data () {
    return {
      user: {},
      showCode: false
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.user_info
    }),
    hours: function () {
      let nowDate = new Date()
      return nowDate.getHours() + 1
    }
  },
  watch: {
  },
  created () {
  },
  mounted () {
    this.getUserInfo()
  },
  destroyed () {
  },
  methods: {
    ...mapMutations([
      'set_user_info',
      'set_user_bind_status',
      'set_user_login_status'
    ]),
    showPoint () {
      this.$router.push('/point')
    },
    getUserInfo () {
      this.$vux.loading.show({})
      this.$http.post(this.API.userInfo).then(res => {
        this.$vux.loading.hide()
        if (res.member_id) {
          let bindStatus = res.bound_phone ? 1 : 0
          this.user = res
          this.set_user_info(res)
          this.set_user_bind_status(bindStatus)
          this.set_user_login_status(1)
        }
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

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s
  }
  .fade-enter, .fade-leave-active {
    opacity: 0
  }

  .center-page {
    height: 100%;
    background:rgba(242,244,247,1);
    .background {
      width: 100%;
      height:130px;
      background:linear-gradient(150deg,rgba(56,161,255,1) 0%,rgba(164,215,255,1) 100%);
      opacity:0.6;
      z-index: 99;
    }
    .user-info {
      position: absolute;
      top: 30.5px;
      left: 15px;
      width:345px;
      height:120px;
      background:rgba(255,255,255,1);
      box-shadow:0px 1.5px 10px rgba(56,161,255,0.15);
      border-radius: 5px;
      padding-top: 15px;
      padding-left: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left {
        margin-right: 10px;
        img {
          width: 70px;
          height: 70px;
          border-radius: 35px;
        }
      }
      .middle {
        .name {
          text-align: left;
          height:28px;
          font-size:20px;
          font-weight:500;
          line-height:28px;
          color:rgba(51,51,51,1);
        }
        .no {
          margin-top: 16px;
          height:20px;
          font-size:14px;
          font-weight:500;
          line-height:20px;
          color:rgba(153,153,153,1);
        }
      }
      .right {
        .time {
          display: flex;
          justify-content: center;
          align-items: center;
          img {
            width: 20px;
            height: 20px;
            margin-right: 2.5px;
          }
          span {
            height:20px;
            font-size:14px;
            font-weight:500;
            line-height:20px;
            color:rgba(51,51,51,1);
          }
        }
        .code {
          position: relative;
          right: -15px;
          width: 120.5px;
          height: 53.5px;
          display: flex;
          justify-content: center;
          align-items: center;
          background: url("../assets/img/center/member_icon_saoma@2x.png");
          background-size: 120.5px 53.5px;
          .icon {
            width: 13.5px;
            height: 13.5px;
            margin-right: 5px;
          }
          span {
            height:18.5px;
            font-size:13px;
            font-weight:400;
            line-height:18.5px;
            color:rgba(255,255,255,1);
          }
        }
      }
    }
    .score-coupon {
      background:rgba(255,255,255,1);
      height: 108px;
      display: flex;
      justify-content: center;
      align-items: flex-end;
      padding-bottom: 20px;
      .item {
        display: flex;
        flex-direction: column;
        .content {
          height:24px;
          font-size:17px;
          font-weight:bold;
          line-height:24px;
          color:rgba(249,83,73,1);
        }
        .title {
          margin-top: 4px;
          height:20px;
          font-size:14px;
          font-weight:500;
          line-height:20px;
          color:rgba(51,51,51,1);
        }
      }
      .item:first-child {
        margin-right: 108.5px;
      }
    }
    .list {
      background:rgba(255,255,255,1);
      margin-top: 10px;
      .list-item {
        height: 73px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .left {
          width: 50px;
          height: 100%;
          padding-left: 15px;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          img {
            width: 20px;
            height: 20px;
          }
        }
        .right {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-right: 14px;
          border-bottom:1px solid rgba(229,229,229,1);
          span {
            font-size:14px;
            font-weight:400;
            color:rgba(51,51,51,1);
          }
          img {
            width: 14px;
            height: 14px;
          }
        }
      }
      .list-item:last-child {
        .right {
          border-bottom: 0;
        }
      }
    }
    .mask {
      position: absolute;
      z-index:99;
      width: 100%;
      top: 0;
      bottom: 0;
      background:rgba(51,51,51,1);
      opacity:0.5;
    }
    .member-code {
      position: absolute;
      z-index: 99;
      top:30px;
      left: 20.5px;
      width:334px;
      height:460px;
      border-radius:4px;
      background:rgba(255,255,255,1);
      .padding {
        width: 100%;
        height: 9.5px;
        background:rgba(56,161,255,1);
        border-radius: 4px 4px 0 0;
      }
      .code-title {
        margin-top: 13.5px;
        height:24px;
        font-size:17px;
        font-weight:400;
        line-height:24px;
      }
      .code-sub-title {
        height:16.5px;
        font-size:12px;
        font-weight:400;
        line-height:16.5px;
        color:rgba(153,153,153,1);
      }
      .notice {
        height: 17px;
        font-size:12px;
        font-weight:400;
        line-height:17px;
        color:rgba(153,153,153,1);
      }
      .notice-1 {
        height:20px;
        font-size:14px;
        line-height:20px;
        color:rgba(102,102,102,1);
        margin-bottom: 7px;
      }
      .refresh {
        position: absolute;
        width: 100%;
        bottom: 0;
        height:44px;
        background:rgba(238,238,238,1);
        opacity:0.8;
        font-size:14px;
        font-weight:400;
        line-height:44px;
        color:rgba(56,161,255,1);
        border-radius: 0 0 4px 4px;
      }
    }
    .close {
      z-index: 99;
      position: relative;
      top:30px;
      left: 171px;
      width:34px;
      height:34px;
      background:rgba(102,102,102,1);
      border-radius:50%;
      line-height: 34px;
      color: rgba(221,221,221,1);
    }
  }
</style>
