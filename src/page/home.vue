<template>
  <div class="home-page">
    <transition name="fade">
      <div class="scroll-search" v-show="scrolling">
        <div class="search-box" @click.stop="goSearch">
          <img class="icon" src="../assets/img/base/icon_search@2x.png"/>
          <span class="notice">输入商户名称</span>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div class="search" v-show="!scrolling" @click.stop="goSearch">
        <img class="icon" src="../assets/img/base/icon_search@2x.png"/>
        <span class="notice">输入商户名称</span>
      </div>
    </transition>
    <div ref="wrapper" class="list-wrapper">
      <div class="scroll-content">
        <div class="banners">
          <swiper auto  dots-position="center">
            <swiper-item v-for="(item, index) in banners" :key="index">
              <img :src="item.pic | upload" @click.stop="bannerUrl(item.url)"/>
            </swiper-item>
          </swiper>
        </div>
        <div class="navs">
          <div class="banner-item" v-for="(type, typeIndex) in merchantTypes" :key="typeIndex" @click.stop="viewMerchantList(type.code, type.name)">
            <img :src="type.pic|upload"/>
            <span>{{type.name}}</span>
          </div>
        </div>
        <div class="coupons" @click.stop="goCouponsCenter">
          <img src="../assets/img/home/home_rk-lingquan@2x.png"/>
        </div>
        <div class="activities" v-if="activities && activities.length > 0">
          <div class="title">
            <span class="main-title">热门活动</span>
            <span class="sub-title">超值享不停</span>
          </div>
          <div class="content">
            <div class="item" v-for="(activity, activityIndex) in activities" :key="activityIndex" @click.stop="viewActivity(activity.url)">
              <img :src="activity.pic|upload"/>
            </div>
            <!--<div class="item"><img src=""/></div>-->
            <!--<div class="item"><img src=""/></div>-->
            <!--<div class="item"><img src=""/></div>-->
          </div>
        </div>
        <div class="merchants" v-if="hotMerchants.length > 0">
          <div class="title">
            <span class="main-title">热门商户</span>
            <span class="sub-title">精选优质商户</span>
          </div>
          <div class="content">
            <div class="item" v-for="(merchant, merchantIndex) in hotMerchants" :key="merchantIndex" @click.stop="viewMerchantDetail(merchant.mer_id)">
              <div class="logo">
                <img v-if="merchant.pic" class="normal" :src="merchant.pic|upload"/>
                <img class="default" src="../assets/img/base/icon_goods_default@2x.png" v-else />
              </div>
              <div class="name">{{merchant.name}}</div>
              <div class="price">￥{{merchant.per_cost}}/人</div>
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
import axios from 'axios'
import BScroll from 'better-scroll'
import { getRect } from '../../src/assets/js/dom'
import { Swiper, SwiperItem, LoadMore } from 'vux'
import Valid from '../utils/valid'
export default {
  name: 'home',
  components: { Swiper, SwiperItem, LoadMore },
  inject: ['reload'], // 引入方法
  data () {
    return {
      banners: [],
      merchantTypes: [],
      activities: [],
      hotMerchants: [],
      pageLimit: 4,
      currentPage: 1,
      totalPage: 1,
      scroll: {},
      pullUp: true,
      showLoading: false,
      scrolling: false,
      posting: false,
      ios: Valid.is_ios
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
      this.$vux.loading.show({})
      this.$http.all([this.getBanners(), this.getMerchantTypes(), this.getActivities(), this.getHotMerchants()]).then(axios.spread((bannerRes, merchantTypesRes, activitiesRes, hotMerchantsRes) => {
        this.$vux.loading.hide()
        this.banners = bannerRes.data
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
        pullUpLoad: true,
        useTransition: !this.ios
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

      this.scroll.on('scroll', (pos) => {
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
    },
    bannerUrl (url) {
      window.location.href = url
    },
    goSearch () {
      this.$router.push('/merchant_search')
    },
    viewMerchantList (pCode, typeName) {
      this.$router.push({name: 'merchant', params: {pCode: pCode, typeName: typeName}})
    },
    viewMerchantDetail (merId) {
      this.$router.push({name: 'merchant_detail', params: {merId: merId}})
    },
    goCouponsCenter () {
      // this.$router.push({name: 'coupons'})
      window.location.href = 'http://' + window.location.host + '/district-coupon/#/coupons'
    },
    viewActivity (url) {
      window.location.href = url
    },
    goParking () {
      window.location.href = 'http://yanshi.yklsq.etonepay.com/parking/#/home?phone=&member=114706053265883136&openid=oQtrs58bNzOJQC_-VlOHOZ1hOYjI&point=7881&parkingId=1'
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
    transition: opacity 1s
  }
  .fade-enter, .fade-leave-active {
    opacity: 0
  }

  .home-page {
    height: 100%;
    background:rgba(255,255,255,1);
    .scroll-search {
      height:60px;
      width: 100%;
      background:rgba(255,255,255,1);
      box-shadow:1px 4px 5px rgba(0,0,0,0.05);
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
          padding: 20px 0px 0px 0px;
          display: flex;
          justify-content: flex-start;
          flex-wrap: wrap;
          .banner-item {
            display: flex;
            flex-direction: column;
            padding: 0 21px;
            box-sizing: border-box;
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
              img {
                width: 167.5px;
                height: 100px;
                border-radius:4px;
              }
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
              /*opacity:0.75;*/
              border-radius:4px;
              padding-bottom: 15px;
              .logo {
                display: flex;
                align-items: center;
                justify-content: center;
                height: 112.5px;
                .normal {
                  width: 100%;
                  height: 100%;
                }
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
