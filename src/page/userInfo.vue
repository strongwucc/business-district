<template>
  <div class="user-info-page">
    <div class="container">
      <div class="item avatar">
        <span class="label">头像</span>
        <img v-if="userInfo.avatar" :src="userInfo.avatar"/>
        <img src="../assets/img/center/member_head_gril@2x.png" v-else/>
      </div>
      <div class="item nick-name" @click.stop="$router.push({path: '/edit_name'})">
        <span class="label">昵称</span>
        <span class="content">
          <span>{{userInfo.nickname}}</span>
          <img src="../assets/img/base/icon_arrow_right@2x.png"/>
        </span>
      </div>
      <div class="item mobile">
        <span class="label">手机号</span>
        <span class="content">{{userInfo.mobile}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'user_info',
  components: {},
  inject: ['reload'], // 引入方法
  data () {
    return {
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
  .user-info-page {
    height: 100%;
    background:rgba(242,244,247,1);
    .container {
      background: rgba(255,255,255,1);
      padding-left: 15.5px;
      .item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid rgba(229,229,229,1);
        .label, .content {
          height:20px;
          font-size:14px;
          font-weight:400;
          line-height:20px;
          color:rgba(102,102,102,1);
        }
        .content {
          color:rgba(51,51,51,1);
        }
      }
      .item:last-child {
        border: 0;
      }
      .avatar {
        height: 70px;
        padding-right: 15px;
        img {
          width: 50px;
          height: 50px;
          border-radius: 25px;
        }
      }
      .nick-name, .mobile {
        height: 44px;
        img {
          width: 14px;
          height: 14px;
        }
      }
      .nick-name {
        padding-right: 14px;
        .content {
          display: flex;
          justify-content: center;
          align-items: center;
          img {
            margin-left: 6.5px;
          }
        }
      }
      .mobile {
        padding-right: 15px;
      }
    }
  }
</style>
