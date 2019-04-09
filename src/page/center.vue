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
        <div class="code">
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
      <div class="list-item">
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
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'center',
  components: {},
  inject: ['reload'], // 引入方法
  data () {
    return {
      user: {}
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
    showPoint () {
      this.$router.push('/point')
    },
    getUserInfo () {
      this.$http.post(this.API.userInfo).then(res => {
        if (res.member_id) {
          this.user = res
        }
      })
    }
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
  .center-page {
    height: 100%;
    background:rgba(242,244,247,1);
    .background {
      width: 100%;
      height:130px;
      background:linear-gradient(150deg,rgba(56,161,255,1) 0%,rgba(164,215,255,1) 100%);
      opacity:0.6;
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
  }
</style>
