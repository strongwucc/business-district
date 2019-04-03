<template>
  <div class="bind-mobile-page">
    <div class="background"><img src="../assets/img/bind/register_bg@2x.png"/></div>
    <div class="form-table">
      <div class="circle-name">虹桥国际中心广场</div>
      <div class="logo"><img src="../assets/img/center/member_head_gril@2x.png"/></div>
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
        <input v-model="smsCode" placeholder="请输入验证码"/>
        <span class="action">发送验证码</span>
      </div>
      <div class="btn">绑定</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'center',
  components: {},
  inject: ['reload'], // 引入方法
  data () {
    return {
      nickName: '',
      mobile: '',
      smsCode: ''
    }
  },
  computed: {
  },
  watch: {
  },
  created () {
  },
  mounted () {
  },
  destroyed () {
  },
  methods: {
  }
}
</script>

<style lang="less">
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
