<template>
  <div class="merchant-search-page">
    <div class="input-area">
      <div class="input">
        <img class="icon" src="../assets/img/base/icon_search@2x.png"/>
        <input v-model="searchKey" placeholder="输入商户名称"/>
        <img class="del" src="../assets/img/base/icon_del@2x.png"/>
      </div>
      <div class="action">取消</div>
    </div>
    <div class="history">
      <div class="title-area">
        <span class="title">历史搜索</span>
        <img class="del" src="../assets/img/base/icon_trash@2x.png"/>
      </div>
      <div class="content">
        <div class="item">星巴克</div>
        <div class="item">小超市</div>
        <div class="item">网红蛋糕</div>
      </div>
    </div>
    <div class="hot">
      <div class="title-area">
        <span class="title">热门搜索</span>
      </div>
      <div class="content">
        <div class="item">咖啡</div>
        <div class="item">网红蛋糕</div>
        <div class="item">重庆高老九火锅</div>
        <div class="item">特色牛排</div>
        <div class="item">希尔顿大酒店</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'merchant_search',
  components: {},
  inject: ['reload'], // 引入方法
  data () {
    return {
      searchKey: ''
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
  .merchant-search-page {
    height: 100%;
    background:rgba(255,255,255,1);
    .input-area {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12.5px 15px 16px;
      .input {
        width:300px;
        height:35px;
        border-radius: 17.5px;
        background:rgba(249,249,249,1);
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 14.5px 0 15px;
        .icon {
          width: 11px;
          height: 11px;
        }
        input {
          height:20px;
          width: 100%;
          font-size:14px;
          font-weight:400;
          line-height:20px;
          color:rgba(153,153,153,1);
          margin: 0 6px;
          background:rgba(249,249,249,1);
        }
        .del {
          width: 14px;
          height: 14px;
        }
      }
      .action {
        height:20px;
        font-size:14px;
        font-weight:400;
        line-height:20px;
        color:rgba(56,161,255,1);
      }
    }
    .history, .hot {
      padding: 12.5px 15px 11.5px;
      .title-area {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .title {
          text-align: left;
          height:22.5px;
          font-size:16px;
          font-weight:400;
          line-height:18px;
          color:rgba(51,51,51,1);
          text-align: left;
        }
        .del {
          width: 24px;
          height: 24px;
        }
      }
      .content {
        padding-top: 15px;
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        .item {
          padding: 0 10.5px;
          height: 35px;
          line-height: 35px;
          text-align: center;
          background:rgba(246,246,246,1);
          border-radius:2px;
          margin-right: 15px;
          margin-bottom: 15px;
          font-size:16px;
          font-weight:400;
          color:rgba(51,51,51,1);
        }
      }
    }
  }
</style>
