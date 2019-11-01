<template>
  <div class="bind-mobile-page">
    <div class="background"><img src="../assets/img/bind/register_bg@2x.png"/></div>
    <div class="form-table">
      <div class="circle-name">{{districtInfo.name}}</div>
      <div class="logo">
        <img v-if="userInfo.avatar" :src="userInfo.avatar|upload"/>
        <img src="../assets/img/center/member_head_gril@2x.png" v-else/>
      </div>
      <div class="item nick-name">
        <span class="label">昵称</span>
        <input v-model="nickName" placeholder="请输入昵称"/>
      </div>
      <div class="item mobile">
        <span class="label">手机号</span>
        <input v-model="mobile" placeholder="请输入手机号"/>
      </div>
      <div class="item sms-code">
        <span class="label">验证码</span>
        <input v-model="smsCode" maxlength="4" placeholder="请输入验证码"/>
        <span class="action" v-show="canSendMsg" @click.stop="sendMsg">发送验证码</span>
        <span class="seconds" v-show="!canSendMsg">{{seconds}}秒重发</span>
      </div>
      <div class="btn" @click.stop="bindMobile">绑定</div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import Valid from '../utils/valid'
export default {
  name: 'center',
  components: {},
  inject: ['reload'], // 引入方法
  data () {
    return {
      districtInfo: {},
      nickName: '',
      mobile: '',
      smsCode: '',
      key: '',
      seconds: 60,
      canSendMsg: true,
      posting: false,
      timer: '',
      redirect: '/home'
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.user_info
    })
  },
  watch: {
  },
  created () {
    if (this.$route.query.redirect) {
      this.redirect = this.$route.query.redirect
    }
  },
  mounted () {
    if (this.userInfo.nickname) {
      this.nickName = this.userInfo.nickname
    }
    this.getDistrictInfo()
  },
  destroyed () {
  },
  methods: {
    ...mapMutations([
      'set_user_bind_status',
      'set_user_info'
    ]),
    getDistrictInfo () {
      this.$vux.loading.show({})
      this.$http.post(this.API.info).then(res => {
        this.$vux.loading.hide()
        if (res.name) {
          this.districtInfo = res
        }
      })
    },
    sendMsg () {
      if (this.posting) {
        return false
      }

      if (Valid.check_mobile(this.mobile) === false) {
        this.$vux.toast.show({
          type: 'text',
          text: '<span style="font-size: 14px">请输入正确的手机号</span>',
          position: 'middle'
        })
        return false
      }

      this.$vux.loading.show({})
      this.posting = true
      this.$http.post(this.API.smsCode, {mobile: this.mobile}).then(res => {
        this.$vux.loading.hide()
        this.posting = false
        if (res.key) {
          this.key = res.key
          this.canSendMsg = false
          this.timer = setInterval(() => {
            if (this.seconds <= 1) {
              this.canSendMsg = true
              this.seconds = 60
              clearInterval(this.timer)
            } else {
              this.seconds = this.seconds - 1
            }
          }, 1000)
        } else {
          let message = '短信发送失败'
          if (res.errors.mobile[0]) {
            message = res.errors.mobile[0]
          }
          this.$vux.toast.show({
            type: 'text',
            text: '<span style="font-size: 14px">' + message + '</span>',
            position: 'middle'
          })
        }
      })
    },
    bindMobile () {
      if (this.posting) {
        return false
      }

      if (Valid.check_mobile(this.mobile) === false) {
        this.$vux.toast.show({
          type: 'text',
          text: '<span style="font-size: 14px">请输入正确的手机号</span>',
          position: 'middle'
        })
        return false
      }

      this.$vux.loading.show({})
      this.posting = true

      this.$http.post(this.API.bindMobile, {mobile: this.mobile, verification_key: this.key, verification_code: this.smsCode}).then(res => {
        this.$vux.loading.hide()
        this.posting = false
        if (res.status_code) {
          this.$vux.toast.show({
            type: 'text',
            text: res.message ? '<span style="font-size: 14px">' + res.message + '</span>' : '<span style="font-size: 14px">绑定失败</span>',
            position: 'middle'
          })
        } else {
          this.set_user_bind_status(1)
          localStorage.setItem('user_is_bind', 1)
          let userInfo = this.userInfo
          userInfo.mobile = this.mobile
          this.set_user_info(userInfo)
          this.$vux.toast.show({
            type: 'text',
            text: '<span style="font-size: 14px">绑定成功</span>',
            position: 'middle'
          })
          setTimeout(() => {
            this.$router.push({path: this.redirect})
          }, 2000)
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
  .bind-mobile-page {
    height: 100%;
    background:rgba(255,255,255,1);
    .background {
      overflow: hidden;
      img {
        position: relative;
        left: -85px;
        width: 562.5px;
        height: auto;
      }
    }
    .form-table {
      background: rgba(255,255,255,1);
      width: 345px;
      box-shadow:0px 1px 30px rgba(0,0,0,0.05);
      border-radius: 4px;
      position: absolute;
      top: 62px;
      left: 14px;
      padding: 0 25px;
      .circle-name {
        margin-top: 30px;
        height:25px;
        font-size:18px;
        font-weight:bold;
        line-height:25px;
      }
      .logo {
        margin-top: 35px;
        img {
          width: 70px;
          height: 70px;
          border-radius: 35px;
        }
      }
      .item {
        height: 49px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        border-bottom:1px solid rgba(229,229,229,1);
        .label {
          height:22.5px;
          width: 73px;
          font-size:16px;
          font-weight:400;
          line-height:22.5px;
          color:rgba(153,153,153,1);
          text-align: left;
        }
        input {
          height: 22.5px;
          font-size:16px;
          font-weight:400;
          line-height:22.5px;
          color:rgba(51,51,51,1);
        }
      }
      .sms-code {
        input {
          width: 150px;
        }
        .action {
          height:20px;
          font-size:14px;
          font-weight:400;
          line-height:20px;
          color:rgba(56,161,255,1);
        }
        .seconds {
          color:rgba(158,209,255,1);
          height:20px;
          font-size:14px;
          font-weight:400;
          line-height:20px;
        }
      }
      .btn {
        margin-top: 35px;
        margin-bottom: 70.5px;
        width:294px;
        height:44px;
        background:linear-gradient(90deg,rgba(27,128,255,1) 0%,rgba(55,160,255,1) 100%);
        box-shadow:0px 5px 10px rgba(56,161,255,0.4);
        border-radius:24.5px;
        font-size:16px;
        font-weight:400;
        line-height:44px;
        color:rgba(255,255,255,1);
      }
    }
  }
</style>
