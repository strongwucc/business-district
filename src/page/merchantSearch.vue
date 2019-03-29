<template>
  <div class="merchant-search-page">
    <div class="input-area">
      <div class="input">
        <img class="icon" src="../assets/img/base/icon_search@2x.png"/>
        <form action="#">
          <input type="search" v-model="searchKey" placeholder="输入商户名称"/>
        </form>
        <img class="del" src="../assets/img/base/icon_del@2x.png" @click.stop="delSearchKey"/>
      </div>
      <div class="action">取消</div>
    </div>
    <div class="history">
      <div class="title-area">
        <span class="title">历史搜索</span>
        <img class="del" v-if="userInfo.keywords && userInfo.keywords.length > 0" src="../assets/img/base/icon_trash@2x.png" @click.stop="clearHistory"/>
      </div>
      <div class="content" v-if="userInfo.keywords && userInfo.keywords.length > 0">
        <div class="item" v-for="(name, index) in userInfo.keywords" :key="index" @click.stop="searchByKeywords(name)">{{name}}</div>
      </div>
      <div class="no-history" v-else>暂无历史记录</div>
    </div>
    <div class="hot">
      <div class="title-area">
        <span class="title">热门搜索</span>
      </div>
      <div class="content">
        <div class="item" v-for="(hot, hotIndex) in hots" :key="hotIndex" @click.stop="searchByKeywords(hot.keyword)">{{hot.keyword}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'merchant_search',
  components: {},
  inject: ['reload'], // 引入方法
  data () {
    return {
      searchKey: '',
      hots: []
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
    this.get_user_info()
    this.getKeywords()
  },
  destroyed () {
  },
  methods: {
    ...mapMutations([
      'get_user_info',
      'set_user_info'
    ]),
    getKeywords () {
      this.$http.post(this.API.keywords).then(res => {
        this.hots = res.data
      })
    },
    searchByKeywords (searchKey) {
      let userInfo = this.userInfo
      console.log(userInfo)
      userInfo = userInfo ? userInfo : {}
      let keywords = []
      if (userInfo.keywords) {
        keywords = userInfo.keywords
      }
      if (keywords.indexOf(searchKey) < 0) {
        keywords.push(searchKey)
      }
      userInfo.keywords = keywords
      this.set_user_info(userInfo)
      this.$router.push({path: 'merchant', query: { key: searchKey }})
    },
    delSearchKey () {
      this.searchKey = ''
    },
    clearHistory () {
      let userInfo = this.get_user_info()
      userInfo = userInfo ? userInfo : {}
      userInfo.keywords = []
      this.set_user_info(userInfo)
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
        form {
          width: 100%;
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
          input::-webkit-search-cancel-button {
            display: none;
          }
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
      .no-history {
        height:75px;
        font-size:13px;
        font-weight:400;
        line-height:50px;
        color:rgba(102,102,102,1);
        text-align: left;
      }
    }
  }
</style>
