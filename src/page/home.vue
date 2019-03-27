<template>
  <div class="home-page">
    <div class="search">
      <img class="icon" src="../assets/img/base/icon_search@2x.png"/>
      <span class="notice">输入商户名称</span>
    </div>
    <div ref="wrapper" class="list-wrapper">
      <div class="scroll-content">
        <div class="banners">
          <swiper auto  dots-position="center">
            <swiper-item v-for="(item, index) in banners" :key="index">
              <img :src="item.pic"/>
            </swiper-item>
          </swiper>
        </div>
        <div class="navs">
          <div class="banner-item">
            <img src="../assets/img/home/home_mk_meishi@2x.png"/>
            <span>美食</span>
          </div>
          <div class="banner-item">
            <img src="../assets/img/home/home_mk_gouwu@2x.png"/>
            <span>购物</span>
          </div>
          <div class="banner-item">
            <img src="../assets/img/home/home_mk_yule@2x.png"/>
            <span>娱乐</span>
          </div>
          <div class="banner-item">
            <img src="../assets/img/home/home_mk_tinche@2x.png"/>
            <span>停车</span>
          </div>
        </div>
        <div class="coupons">
          <img src="../assets/img/home/home_rk-lingquan@2x.png"/>
        </div>
        <div class="activities">
          <div class="title">
            <span class="main-title">热门活动</span>
            <span class="sub-title">超值享不停</span>
          </div>
          <div class="content">
            <div class="item"><img src=""/></div>
            <div class="item"><img src=""/></div>
            <div class="item"><img src=""/></div>
            <div class="item"><img src=""/></div>
          </div>
        </div>
        <div class="merchants" v-if="hotMerchants.length > 0">
          <div class="title">
            <span class="main-title">热门商户</span>
            <span class="sub-title">精选优质商户</span>
          </div>
          <div class="content">
            <div class="item" v-for="(merchant, merchantIndex) in hotMerchants" :key="merchantIndex">
              <div class="logo">
                <img class="default" src="../assets/img/base/icon_goods_default@2x.png"/>
              </div>
              <div class="name">星巴克(虹桥国际商务 广场店)</div>
              <div class="price">￥114/人</div>
            </div>
            <!--<div class="item">-->
              <!--<div class="logo">-->
                <!--<img class="default" src="../assets/img/base/icon_goods_default@2x.png"/>-->
              <!--</div>-->
              <!--<div class="name">必胜客(虹桥店)</div>-->
              <!--<div class="price">￥280/人</div>-->
            <!--</div>-->
            <!--<div class="item">-->
              <!--<div class="logo">-->
                <!--<img class="default" src="../assets/img/base/icon_goods_default@2x.png"/>-->
              <!--</div>-->
              <!--<div class="name">威尔顿大酒店</div>-->
              <!--<div class="price">￥114/人</div>-->
            <!--</div>-->
            <!--<div class="item">-->
              <!--<div class="logo">-->
                <!--<img class="default" src="../assets/img/base/icon_goods_default@2x.png"/>-->
              <!--</div>-->
              <!--<div class="name">levis(合川路店)</div>-->
              <!--<div class="price">￥114/人</div>-->
            <!--</div>-->
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
import axios from 'axios'
import BScroll from 'better-scroll'
import { getRect } from '../../src/assets/js/dom'
import { Swiper, SwiperItem, LoadMore } from 'vux'
export default {
  name: 'home',
  components: { Swiper, SwiperItem, LoadMore },
  inject: ['reload'], // 引入方法
  data () {
    return {
      banners: [
        {
          url: 'javascript:',
          pic: 'https://ww1.sinaimg.cn/large/663d3650gy1fq66vvsr72j20p00gogo2.jpg',
          name: '送你一朵fua'
        }, {
          url: 'javascript:',
          pic: 'https://ww1.sinaimg.cn/large/663d3650gy1fq66vw1k2wj20p00goq7n.jpg',
          name: '送你一辆车'
        }, {
          url: 'javascript:',
          pic: 'https://ww1.sinaimg.cn/large/663d3650gy1fq66vw50iwj20ff0aaaci.jpg', // 404
          name: '送你一次旅行'
        }
      ],
      merchantTypes: [],
      activities: [],
      hotMerchants: [],
      pageLimit: 4,
      currentPage: 1,
      totalPage: 1,
      scroll: {},
      pullUp: true,
      showLoading: false
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
    }
  },
  watch: {
  },
  created () {
  },
  mounted () {
    this.getInitData()
  },
  destroyed () {
  },
  methods: {
    getInitData () {
      this.$http.all([this.getBanners(), this.getMerchantTypes(), this.getActivities(), this.getHotMerchants()]).then(axios.spread((bannerRes, merchantTypesRes, activitiesRes, hotMerchantsRes) => {
        // this.banners = bannerRes.data
        this.merchantTypes = merchantTypesRes.data
        this.activities = activitiesRes.data
        this.hotMerchants = hotMerchantsRes.data
        this.currentPage = hotMerchantsRes.meta.pagination.current_page
        this.totalPage = hotMerchantsRes.meta.pagination.total_pages
        if (this.totalPage <= this.currentPage) {
          this.pullUp = false
        }
        this.$nextTick(() => {
          this.initScroll()
        })
      }))
    },
    getBanners () {
      return this.$http.post(this.API.banners)
    },
    getMerchantTypes () {
      return this.$http.post(this.API.merchantTypes)
    },
    getActivities () {
      return this.$http.post(this.API.activities)
    },
    getHotMerchants () {
      return this.$http.post(this.API.hotMerchants, {page: this.currentPage, page_limit: this.pageLimit})
    },
    loadHotMerchants () {
      if (this.pullUp === false) {
        return false
      }
      this.showLoading = true
      this.$http.post(this.API.hotMerchants, {page: this.currentPage + 1, page_limit: this.pageLimit}).then(res => {
        this.showLoading = false
        this.hotMerchants = this.hotMerchants.concat(res.data)
        this.currentPage = res.meta.pagination.current_page
        this.totalPage = res.meta.pagination.total_pages
        if (this.totalPage <= this.currentPage) {
          this.pullUp = false
        }
        this.$nextTick(() => {
          this.refresh()
        })
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
        scrollbar: false,
        pullUpLoad: true,
        startY: 0,
        freeScroll: false,
        mouseWheel: false,
        bounce: true,
        zoom: false
      }
      this.scroll = new BScroll(this.$refs.wrapper, options)

      if (this.pullUp) {
        this.scroll.on('scrollEnd', () => {
          // 滚动到底部
          if (this.scroll.y <= (this.scroll.maxScrollY + 10)) {
            this.loadHotMerchants()
          }
        })
      }
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
  .home-page {
    height: 100%;
    background:rgba(255,255,255,1);
    .search {
      z-index: 99;
      display: flex;
      justify-content: center;
      align-items: center;
      position: fixed;
      top: 15px;
      left: 27.5px;
      width:320px;
      height:35px;
      background:rgba(255,255,255,1);
      box-shadow:0px 1px 5px rgba(0,0,0,0.14);
      opacity:1;
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
    .list-wrapper {
      position: relative;
      height: 100%;
      overflow: hidden;
      .scroll-content {
        .banners {
          width: 100%;
          height: 170px;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .navs {
          padding: 20px 23px 0px 25.5px;
          display: flex;
          justify-content: flex-start;
          flex-wrap: wrap;
          .banner-item {
            display: flex;
            flex-direction: column;
            margin-right: 42px;
            margin-bottom: 10px;
            img {
              width: 50px;
              height: 50px;
            }
            span {
              margin-top: 10px;
              font-size:12px;
              font-weight:400;
              line-height:15.5px;
              color:rgba(51,51,51,1);
            }
          }
          .banner-item:nth-child(4n) {
            margin-right: 0px;
          }
        }
        .coupons {
          margin-top: 10px;
          img {
            width: 345px;
            height: 80px;
          }
        }
        .activities, .merchants {
          margin-top: 25px;
          padding: 0 15px;
          .title{
            display: flex;
            justify-content: flex-start;
            align-items: center;
            .main-title {
              height:24px;
              font-size:17px;
              font-weight:bold;
              line-height:18px;
              color:rgba(51,51,51,1);
            }
            .sub-title {
              margin-left: 10px;
              height:16.5px;
              font-size:12px;
              font-weight:500;
              line-height:15.5px;
              color:rgba(153,153,153,1);
            }
          }
        }
        .activities {
          .content {
            display: flex;
            justify-content: flex-start;
            flex-wrap: wrap;
            .item {
              margin-top: 10px;
              width:167.5px;
              height:100px;
              background:rgba(242,242,242,1);
              border-radius:4px;
            }
            .item:nth-child(2n - 1) {
              margin-right: 10px;
            }
          }
        }
        .merchants {
          .content {
            display: flex;
            justify-content: flex-start;
            flex-wrap: wrap;
            .item {
              margin-top: 10px;
              width:167.5px;
              box-shadow:0px 1px 7.5px rgba(0,0,0,0.1);
              opacity:0.75;
              border-radius:4px;
              padding-bottom: 15px;
              .logo {
                display: flex;
                align-items: center;
                justify-content: center;
                height: 112.5px;
                .default {
                  width: 50px;
                  height: 50px;
                }
              }
              .name {
                padding: 10px 14.5px;
                font-size:14px;
                font-weight:bold;
                line-height:21px;
                color:rgba(51,51,51,1);
                text-align: left;
              }
              .price {
                height: 18.5px;
                padding: 0 14.5px;
                font-size:12px;
                font-weight:400;
                line-height:15.5px;
                color:rgba(102,102,102,1);
                text-align: left;
              }
            }
            .item:nth-child(2n - 1) {
              margin-right: 10px;
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
