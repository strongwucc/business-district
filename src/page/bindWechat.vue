<template>
  <div class="bind-wechat-page">
    <div class="logo">
      <img v-if="districtInfo.picture" :src="districtInfo.picture|upload"/>
      <img src="../assets/img/bind/set_ic_weixin_big@2x.png" v-else/>
    </div>
    <div class="name">{{districtInfo.name}}</div>
    <div class="line"></div>
    <div class="notice">请确认以下授权信息</div>
    <div class="description">获得你的信息(头像，信息等)</div>
    <div class="btn" @click.stop="bindWechat">授权</div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'bind_wechat',
  components: {},
  inject: ['reload'], // 引入方法
  data () {
    return {
      districtInfo: {},
      code: '',
      redirect: '',
      posting: false
    }
  },
  computed: {
  },
  watch: {
  },
  created () {
    if (this.$route.params.code) {
      this.code = this.$route.params.code
    }
    if (this.$route.query.redirect) {
      this.redirect = this.$route.query.redirect
    }
  },
  mounted () {
    this.getDistrictInfo()
  },
  destroyed () {
  },
  methods: {
    ...mapMutations([
      'set_user_info',
      'set_user_bind_status',
      'set_user_login_status'
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
    bindWechat () {
      if (this.posting) {
        return false
      }

      this.$vux.loading.show({})
      this.posting = true
      this.$http.post(this.API.authorizations, {type: 'weixin', code: this.code}).then(res => {
        this.$vux.loading.hide()
        this.posting = false
        if (res.access_token) {
          localStorage.setItem('access_token', res.access_token)
          this.getUserInfo()
          if (this.redirect) {
            this.$router.push(this.redirect)
          } else {
            this.$router.push('/home')
          }
        } else {
          this.$vux.toast.show({
            type: 'text',
            text: res.message ? '<span style="font-size: 14px">' + res.message + '</span>' : '<span style="font-size: 14px">授权失败</span>',
            position: 'middle'
          })
        }
      })
    },
    getUserInfo () {
      this.$http.post(this.API.userInfo).then(res => {
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
  .bind-wechat-page {
    height: 100%;
    background:rgba(255,255,255,1);
    color:rgba(51,51,51,1);
    .logo {
      margin-top: 65px;
      img {
        width: 35px;
        height: 35px;
      }
    }
    .name {
      margin-top: 10px;
      height:22.5px;
      font-size:16px;
      font-weight:400;
      line-height:22.5px;
    }
    .line {
      margin-top: 30.5px;
      margin-left: 38px;
      width:300px;
      height:0px;
      border-bottom:1px solid rgba(229,229,229,1);
    }
    .notice {
      margin-top: 30px;
      height:22.5px;
      font-size:16px;
      font-weight:400;
      line-height:22.5px;
    }
    .description {
      margin-top: 20.5px;
      height:20px;
      font-size:14px;
      font-weight:400;
      line-height:20px;
      color:rgba(153,153,153,1);
    }
    .btn {
      margin-top: 20px;
      margin-left: 32.5px;
      width:310px;
      height:44px;
      background:rgba(0,190,1,1);
      opacity:1;
      border-radius:4px;
      font-size:14px;
      font-weight:400;
      line-height:44px;
      color:rgba(255,255,255,1);
    }
  }
</style>
