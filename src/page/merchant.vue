<template>
  <div class="merchant-page">
    <div class="scroll-search" v-show="scrolling">
      <div class="search-box" @click.stop="goSearch">
        <img class="icon" src="../assets/img/base/icon_search@2x.png"/>
        <span class="notice">输入商户名称</span>
      </div>
    </div>
    <div class="search" v-show="!scrolling">
      <img class="icon" src="../assets/img/base/icon_search@2x.png"/>
      <span class="notice">输入商户名称</span>
    </div>
    <div class="navs-stopping" :class="{'navs-active': navStop}">
      <div class="nav type">
        <span class="name">全部</span>
        <img src="../assets/img/base/icon_arrow_down@2x.png"/>
      </div>
      <div class="nav filter">
        <span class="name">筛选</span>
        <img src="../assets/img/base/icon_arrow_down@2x.png"/>
      </div>
    </div>
    <div ref="wrapper" class="list-wrapper">
      <div class="scroll-content">
        <div class="banner">
          <img src="../assets/img/merchant/list_shanghu_bg@2x.png"/>
        </div>
        <div class="navs">
          <div class="nav type">
            <span class="name">全部</span>
            <img src="../assets/img/base/icon_arrow_down@2x.png"/>
          </div>
          <div class="nav filter">
            <span class="name">筛选</span>
            <img src="../assets/img/base/icon_arrow_down@2x.png"/>
          </div>
        </div>
        <div class="merchants" v-if="merchants.length > 0">
          <div class="merchant" v-for="(merchant, merchantIndex) in merchants" :key="merchantIndex">
            <div class="logo">
              <img class="default" src="../assets/img/base/icon_goods_default@2x.png"/>
            </div>
            <div class="info">
              <div class="name">{{merchant.name}}</div>
              <div class="price">￥{{merchant.cost}}/人</div>
              <div class="mobile">
                <img class="icon" src="../assets/img/base/icon_phone@2x.png"/>
                <span class="txt">{{merchant.mobile}}</span>
              </div>
              <div class="addr">
                <img class="icon" src="../assets/img/base/icon_add@2x.png"/>
                <span class="txt">{{merchant.addr}}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="padding">
          <div class="pull-notice" v-show="showLoading === false">
            —— {{pullTxt}} ——
          </div>
          <load-more v-show="showLoading" tip="正在加载"></load-more>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import { getRect } from '../../src/assets/js/dom'
import { LoadMore } from 'vux'
export default {
  name: 'merchant',
  components: { LoadMore },
  inject: ['reload'], // 引入方法
  data () {
    return {
      merchants: [],
      searchKey: '',
      typeCode: '',
      perCostMin: '',
      perCostMax: '',
      pageLimit: 4,
      currentPage: 0,
      totalPage: 1,
      scroll: '',
      pullUp: true,
      showLoading: false,
      scrolling: false,
      scrollY: 0
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
    },
    navStop: function () {
      return this.scrollY >= 50
    }
  },
  watch: {
  },
  created () {
  },
  mounted () {
    this.getMerchants()
  },
  destroyed () {
  },
  methods: {
    getMerchants () {
      if (this.pullUp === false) {
        return false
      }
      let page = this.currentPage + 1
      let postData = {
        search_key: this.searchKey,
        type_code: this.typeCode,
        per_cost_min: this.perCostMin,
        per_cost_max: this.perCostMax,
        page_limit: this.pageLimit
      }
      this.$http.post(this.API.merchants + '?page=' + page, postData).then(res => {
        this.merchants = this.merchants.concat(res.data)
        this.currentPage = res.meta.pagination.current_page
        this.totalPage = res.meta.pagination.total_pages
        if (this.totalPage <= this.currentPage) {
          this.pullUp = false
        }
        if (this.scroll) {
          this.refresh()
        } else {
          this.$nextTick(() => {
            this.initScroll()
          })
        }
      })
    },
    // 初始化滚动
    initScroll () {
      if (!this.$refs.wrapper) {
        return
      }
      this.$refs.wrapper.style.minHeight = `${getRect(this.$refs.wrapper).height + 1}px`
      let options = {
        probeType: 1,
        click: true,
        pullUpLoad: true
      }
      this.scroll = new BScroll(this.$refs.wrapper, options)

      if (this.pullUp) {
        this.scroll.on('scrollEnd', () => {
          // 滚动到底部
          if (this.scroll.y <= (this.scroll.maxScrollY + 10)) {
            this.getMerchants()
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
  .merchant-page {
    height: 100%;
    background: #F2F4F7;
    .scroll-search {
      height:60px;
      width: 100%;
      background:rgba(255,255,255,1);
      /*box-shadow:1px 4px 5px rgba(0,0,0,0.05);*/
      position: fixed;
      top: 0;
      left: 0;
      z-index: 99;
      display: flex;
      justify-content: center;
      align-items: center;
      .search-box {
        display: flex;
        justify-content: center;
        align-items: center;
        width:320px;
        height:35px;
        background:rgba(249,249,249,1);
        border-radius:17px;
        .icon {
          width: 14px;
          height: 14px;
        }
        .notice {
          margin-left: 4px;
          font-size:14px;
          font-weight:400;
          line-height:17px;
          color:rgba(153,153,153,1);
        }
      }
    }
    .search {
      position: fixed;
      top: 15.5px;
      left: 27.5px;
      display: flex;
      justify-content: center;
      align-items: center;
      width:320px;
      height:35px;
      background:rgba(255,255,255,1);
      box-shadow:0px 1px 5px rgba(0,0,0,0.14);
      opacity:0.9;
      border-radius:17.5px;
      z-index: 99;
      .icon {
        width: 11px;
        height: 11px;
      }
      .notice {
        margin-left: 6.5px;
        font-size:14px;
        font-weight:400;
        line-height:17px;
        color:rgba(153,153,153,1);
      }
    }
    .navs-stopping, .navs {
      width: 100%;
      height:44px;
      background:rgba(255,255,255,1);
      display: flex;
      .nav {
        width: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        img {
          margin-left: 3px;
          width: 14px;
          width: 14px;
        }
        span {
          font-size:14px;
          font-weight:400;
          color:rgba(45,45,45,1);
        }
      }
    }
    .navs-stopping {
      position: fixed;
      top: 60px;
    }
    .navs-active {
      z-index: 99;
    }
    .list-wrapper {
      position: relative;
      height: 100%;
      .scroll-content {
        .banner {
          width: 100%;
          height: 110px;
          img {
            width: 100%;
            height: 110px;
          }
        }
        .navs {
        }
        .stopping {
          position: fixed;
          top: 60px;
        }
        .merchants {
          .merchant {
            display: flex;
            justify-content: flex-start;
            margin-top: 5px;
            height:135.5px;
            background:rgba(255,255,255,1);
            padding: 15px 37.5px 12px 15px;
            .logo {
              width: 100px;
              height: 100%;
              .default {
                width: 50px;
                height: 50px;
              }
            }
            .info {
              padding-left: 15px;
              div {
                display: flex;
                justify-content: flex-start;
              }
              .name {
                height:22.5px;
                font-size:16px;
                font-weight:bold;
                line-height:18px;
              }
              .price {
                margin-top: 5px;
                height:18.5px;
                font-size:12px;
                font-weight:400;
                line-height:15.5px;
              }
              .mobile {
                margin-top: 8.5px;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                .icon {
                  width: 14px;
                  height: 14px;
                }
                .txt {
                  margin-left: 5px;
                  font-size:13px;
                  font-weight:400;
                  line-height:15.5px;
                  color:rgba(102,102,102,1);
                }
              }
              .addr {
                margin-top: 3.5px;
                display: flex;
                justify-content: flex-start;
                align-items: flex-start;
                .icon {
                  width: 14px;
                  height: 14px;
                }
                .txt {
                  margin-left: 5px;
                  text-align: left;
                  font-size:12px;
                  font-weight:400;
                  line-height:15.5px;
                  color:rgba(102,102,102,1);
                }
              }
            }
          }
        }
        .padding {
          height: 118px;
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
