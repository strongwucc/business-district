<template>
  <div class="merchant-page">
    <!--<transition name="fade">-->
      <div class="scroll-search" v-show="scrolling">
        <div class="search-box" @click.stop="goSearch">
          <img class="icon" src="../assets/img/base/icon_search@2x.png"/>
          <span class="notice">输入商户名称</span>
        </div>
      </div>
    <!--</transition>-->
    <!--<transition name="fade">-->
      <div class="search" v-show="!scrolling" @click.stop="goSearch">
        <img class="icon" src="../assets/img/base/icon_search@2x.png"/>
        <span class="notice">输入商户名称</span>
      </div>
    <!--</transition>-->
    <div class="navs-stopping" :class="{'navs-active': navStop}">
      <div class="nav type" @click.stop="showMerchantTypes">
        <span class="name">{{typeName}}</span>
        <img src="../assets/img/base/icon_arrow_down@2x.png"/>
      </div>
      <div class="nav filter" @click.stop="showScreen">
        <span class="name">筛选</span>
        <img src="../assets/img/base/icon_arrow_down@2x.png"/>
      </div>
    </div>
    <transition name="slide">
      <div class="merchant-types" v-show="merchantTypesVisible">
        <div ref="parentTypeWrapper" class="parent-type">
          <div class="parent-type-content">
            <div class="parent-type-item" :class="{active: pCode === 0}" @click.stop="setAllType">全部</div>
            <div class="parent-type-item" v-for="(parentType, parentTypeIndex) in parentTypes" :key="parentTypeIndex" :class="{active: parentType.code === pCode}" @click.stop="getChildTypes(parentType.code)">{{parentType.name}}</div>
          </div>
        </div>
        <div ref="childTypeWrapper" class="child-type">
          <div class="child-type-content">
            <div class="child-type-item" v-for="(childType, childTypeIndex) in childTypes" :key="childTypeIndex" :class="{active: childType.code === cCode}" @click.stop="setChildType(childType.code, childType.name)">{{childType.name}}</div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="slide">
      <div class="screen" v-show="screenVisible">
        <div class="screen-options">
          <div class="option-item avg">
            <div class="title">人均(元)</div>
            <div class="content">
              <div class="item" :class="{active: avgIndex === 1}" @click.stop="setSearchPrice('', 50, 1)">50以下</div>
              <div class="item" :class="{active: avgIndex === 2}" @click.stop="setSearchPrice(50, 150, 2)">50-150</div>
              <div class="item" :class="{active: avgIndex === 3}" @click.stop="setSearchPrice(150, '', 3)">150以上</div>
            </div>
          </div>
          <div class="option-item sec">
            <div class="title">价格区间(元)</div>
            <div class="content">
              <input type="tel" v-model="costMin" placeholder="最低价"/>
              <span>—</span>
              <input type="tel" v-model="costMax" placeholder="最高价"/>
            </div>
          </div>
        </div>
        <div class="screen-action">
          <div class="reset" :class="{active: actionIndex === 1}" @click.stop="resetScreen">重置</div>
          <div class="confirm" :class="{active: actionIndex === 2}" @click.stop="confirmScreen">确定</div>
        </div>
      </div>
    </transition>
    <div class="mask" v-show="merchantTypesVisible || screenVisible" @click.stop="hideAll"></div>
    <div ref="wrapper" class="list-wrapper">
      <div class="scroll-content">
        <div class="banner">
          <img src="../assets/img/merchant/list_shanghu_bg@2x.png"/>
        </div>
        <div class="navs">
          <div class="nav type" @click.stop="showMerchantTypes">
            <span class="name">{{typeName}}</span>
            <img src="../assets/img/base/icon_arrow_down@2x.png"/>
          </div>
          <div class="nav filter" @click.stop="showScreen">
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
        <div class="padding" ref="padding" :class="{append: this.merchants.length < 4}">
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
      parentTypes: [],
      childTypes: [],
      merchants: [],
      searchKey: '',
      typeCode: '',
      typeName: '全部',
      perCostMin: '',
      perCostMax: '',
      costMin: '',
      costMax: '',
      pageLimit: 4,
      currentPage: 0,
      totalPage: 1,
      scroll: '',
      pullUp: true,
      showLoading: false,
      scrolling: false,
      scrollY: 0,
      merchantTypesVisible: false,
      screenVisible: false,
      avgIndex: 0,
      actionIndex: 0,
      parentTypeScroll: '',
      childTypeScroll: '',
      pCode: 0,
      cCode: 0
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
    merchants: {
      handler: function (val, oldVal) {
        this.$nextTick(() => {
          let heightMinus = this.scroll.scrollerHeight - this.scroll.wrapperHeight
          if (heightMinus === 0) {
            console.log(111111)
          }
        })
      },
      deep: true,
      immediate: false
    }
  },
  created () {
  },
  mounted () {
    this.getMerchants()
    this.getParentTypes()
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
        per_cost_min: this.costMin ? this.costMin : this.perCostMin,
        per_cost_max: this.costMax ? this.costMax : this.perCostMax,
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
    getParentTypes () {
      this.$http.post(this.API.merchantTypes).then(res => {
        this.parentTypes = res.data
      })
    },
    getChildTypes (pCode) {
      this.pCode = pCode
      this.$http.post(this.API.merchantTypes, {pcode: pCode}).then(res => {
        this.childTypes = res.data
        this.$nextTick(() => {
          this.initChildTypeScroll()
        })
      })
    },
    setAllType () {
      this.pullUp = true
      this.pCode = 0
      this.typeName = '全部'
      this.cCode = 0
      this.typeCode = ''
      this.currentPage = 0
      this.totalPage = 1
      this.childTypes = []
      this.merchants = []
      this.hideAll()
      this.pullUp = true
      this.getMerchants()
    },
    setChildType (cCode, name) {
      this.pullUp = true
      this.cCode = cCode
      this.typeCode = cCode
      this.typeName = name
      this.currentPage = 0
      this.totalPage = 1
      this.merchants = []
      this.hideAll()
      this.getMerchants()
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
    },
    initParentTypeScroll () {
      if (!this.$refs.parentTypeWrapper) {
        return
      }
      this.$refs.parentTypeWrapper.style.minHeight = `${getRect(this.$refs.parentTypeWrapper).height + 1}px`
      let options = {
        probeType: 1,
        click: true,
        pullUpLoad: true
      }
      this.parentTypeScroll = new BScroll(this.$refs.parentTypeWrapper, options)
    },
    initChildTypeScroll () {
      if (!this.$refs.childTypeWrapper) {
        return
      }
      // this.$refs.childTypeWrapper.style.minHeight = `${getRect(this.$refs.childTypeWrapper).height + 1}px`
      let options = {
        probeType: 1,
        click: true,
        pullUpLoad: true
      }
      this.childTypeScroll = new BScroll(this.$refs.childTypeWrapper, options)
    },
    showMerchantTypes () {
      if (this.scroll) {
        this.scroll.scrollTo(0, -60, 1)
      }
      this.merchantTypesVisible = !this.merchantTypesVisible
      if (this.merchantTypesVisible) {
        this.$nextTick(() => {
          this.initParentTypeScroll()
        })
      }
    },
    showScreen () {
      if (this.scroll) {
        this.scroll.scrollTo(0, -60, 1)
      }
      this.screenVisible = !this.screenVisible
      this.actionIndex = 0
    },
    setSearchPrice (perCostMin, perCostMax, avgIndex) {
      this.perCostMin = perCostMin
      this.perCostMax = perCostMax
      this.avgIndex = avgIndex
    },
    resetScreen () {
      this.perCostMin = ''
      this.perCostMax = ''
      this.costMin = ''
      this.costMax = ''
      this.avgIndex = 0
      this.actionIndex = 1
    },
    confirmScreen () {
      this.pullUp = true
      this.actionIndex = 2
      this.currentPage = 0
      this.totalPage = 1
      this.merchants = []
      this.hideAll()
      this.getMerchants()
    },
    hideAll () {
      this.merchantTypesVisible = false
      this.screenVisible = false
    },
    goSearch () {
      this.$router.push('/merchant_search')
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

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s ease
  }
  .fade-enter, .fade-leave-active {
    opacity: 0
  }

  .slide-enter-active, .slide-leave-active {
    transition: transform .5s ease;
    transform: translateY(0);
  }
  .slide-enter, .slide-leave-active {
    transform: translateY(-100%);
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
    .merchant-types {
      width: 100%;
      position: absolute;
      top: 104px;
      z-index: 66;
      display: flex;
      height:231.5px;
      background:rgba(255,255,255,1);
      box-shadow:1px 2.5px 9px rgba(0,0,0,0.1);
      .parent-type {
        height: 100%;
        width: 116.5px;
        overflow: hidden;
        .parent-type-content {
          /*padding-top: 7.5px;*/
          .parent-type-item {
            padding: 7.5px 21px;
            text-align: left;
            font-size:14px;
            font-weight:400;
            line-height:17px;
            color:rgba(102,102,102,1);
            overflow: hidden;
          }
          .parent-type-item:nth-child(1) {
            padding-top: 15px;
          }
          .active {
            background:rgba(246,246,246,1);
            color:rgba(56,161,255,1);
          }
        }
      }
      .child-type {
        height: 100%;
        width: 100%;
        overflow: hidden;
        background:rgba(246,246,246,1);
        overflow: hidden;
        .child-type-content {
          padding-top: 7.5px;
          .child-type-item {
            padding: 7.5px 15px;
            text-align: left;
            font-size:14px;
            font-weight:400;
            line-height:17px;
            color:rgba(51,51,51,1);
            overflow: hidden;
          }
          .active {
            color:rgba(56,161,255,1);
          }
        }
      }
    }
    .screen {
      width: 100%;
      position: absolute;
      top: 104px;
      z-index: 66;
      height:279px;
      background:rgba(255,255,255,1);
      box-shadow:1px 2.5px 9px rgba(0,0,0,0.1);
      padding: 15px 20px;
      .screen-options {
        .option-item {
          .title {
            height: 20px;
            font-size:14px;
            font-weight:400;
            line-height:17px;
            color:rgba(51,51,51,1);
            text-align: left;
          }
          .content {
            display: flex;
            justify-content: space-between;
            margin-top: 6.5px;
            .item {
              width:100px;
              height:35px;
              background:rgba(246,246,246,1);
              border-radius:2px;
              font-size:13px;
              font-weight:400;
              line-height:35px;
              color:rgba(102,102,102,1);
            }
            .active {
              border:1px solid rgba(56,161,255,1);
              background:rgba(239,247,255,1);
              color:rgba(56,161,255,1);
            }
          }
        }
        .sec {
          margin-top: 25.5px;
          .content {
            justify-content: flex-start;
            margin-top: 12px;
            input {
              width:100px;
              height:35px;
              background:rgba(246,246,246,1);
              border-radius:2px;
              text-align: center;
            }
            span {
              height: 35px;
              line-height: 35px;
              color: rgba(221,221,221,1);
              padding: 0 4px;
            }
          }
        }
      }
      .screen-action {
        margin-top: 40px;
        display: flex;
        justify-content: space-between;
        div {
          width:160px;
          height:35px;
          border:1px solid rgba(63,169,245,1);
          border-radius:17.5px;
          font-size:13px;
          font-weight:400;
          line-height:15.5px;
          color:rgba(63,169,245,1);
          line-height: 35px;
        }
        .active {
          background:rgba(56,161,255,1);
          color:rgba(255,255,255,1);
        }
      }
    }
    .mask {
      position: absolute;
      width: 100%;
      top: 0;
      bottom: 0;
      background:rgba(0,0,0,0.5);
      opacity:1;
      z-index: 33;
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
      overflow: hidden;
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
        .append {
          height: 580px;
        }
      }
    }
  }
</style>
