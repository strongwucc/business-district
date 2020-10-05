<template>
  <div class="orders-page">
    <div class="status">
      <div class="item" :class="{active: status === 'all'}" @click.stop="setStatus('all')">全部</div>
      <div class="item" :class="{active: status === 'unpayed'}" @click.stop="setStatus('unpayed')">待付款</div>
      <div class="item" :class="{active: status === 'payed'}" @click.stop="setStatus('payed')">已付款</div>
      <div class="item" :class="{active: status === 'dead'}" @click.stop="setStatus('dead')">已取消</div>
    </div>
    <div ref="ordersWrapper" class="orders-wrapper" v-if="orders.length > 0">
      <ul class="wrapper-content">
        <li class="item" v-for="(order, orderIndex) in orders" :key="orderIndex">
          <div class="up-info">
            <div class="left">
              <div class="title">
                <template v-if="order.platform === 'o2o' && order.source === '01'">
                  停车缴费
                </template>
                <template v-else-if="order.platform === 'o2o' && order.source === '02'">
                  优惠券
                </template>
                <template v-else>
                  {{order.source}}
                </template>
              </div>
              <div class="amount">
                <span class="label">订单金额：</span>
                <span class="content">￥ {{order.pay_amount}}</span>
              </div>
            </div>
            <div class="right">
              <span v-if="order.status === 'dead'" class="dead">已取消</span>
              <span v-else-if="['0','1111','8888'].indexOf(order.pay_result) >= 0" class="unpayed">待付款</span>
              <span v-else-if="['1','0000'].indexOf(order.pay_result) >= 0" class="payed">已付款</span>
            </div>
          </div>
          <div class="down-info">
            <div class="left">
              <div class="order-no">
                <span class="label">订单编号：</span>
                <span class="content">{{order.order_no|longStrFormat(24)}}</span>
              </div>
              <div class="order-time">
                <span class="label">订单时间：</span>
                <span class="content">{{order.tran_time}}</span>
              </div>
            </div>
            <div class="right">
              查看详情
            </div>
          </div>
        </li>
        <div class="padding" ref="padding">
          <div class="pull-notice" v-show="showLoading === false">
            —— {{pullTxt}} ——
          </div>
          <load-more v-show="showLoading" tip="正在加载"></load-more>
        </div>
      </ul>
    </div>
    <div class="no-order" v-if="orders.length === 0 && !showLoading">
      <img src="../assets/img/orders/states_order_kong@2x.png"/>
      <span class="notice">暂时没有订单哦</span>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import { getRect } from '../../src/assets/js/dom'
import { LoadMore } from 'vux'
import Valid from '../utils/valid'
export default {
  name: 'orders',
  components: { LoadMore },
  inject: ['reload'], // 引入方法
  data () {
    return {
      status: 'all',
      orders: [],
      pageLimit: 4,
      currentPage: 0,
      totalPage: 1,
      scroll: '',
      pullUp: true,
      showLoading: false,
      scrolling: false,
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
    this.getOrders()
  },
  destroyed () {
  },
  methods: {
    getOrders () {
      if (this.pullUp === false) {
        return false
      }
      let page = this.currentPage + 1
      let postData = {
        status: this.status,
        page_limit: this.pageLimit
      }
      this.showLoading = true
      this.$vux.loading.show({})
      this.$http.post(this.API.orders + '?page=' + page, postData).then(res => {
        this.showLoading = false
        this.$vux.loading.hide()
        this.orders = this.orders.concat(res.data)
        this.currentPage = res.meta.pagination.current_page
        this.totalPage = res.meta.pagination.total_pages
        if (this.totalPage <= this.currentPage) {
          this.pullUp = false
        }
        if (this.scroll) {
          this.$nextTick(() => {
            this.refresh()
          })
        } else {
          this.$nextTick(() => {
            this.initScroll()
          })
        }
      })
    },
    // 初始化滚动
    initScroll () {
      if (!this.$refs.ordersWrapper) {
        return
      }
      this.$refs.ordersWrapper.style.minHeight = `${getRect(this.$refs.ordersWrapper).height + 1}px`
      let options = {
        probeType: 1,
        click: true,
        pullUpLoad: true,
        useTransition: !this.ios
      }
      this.scroll = new BScroll(this.$refs.ordersWrapper, options)

      if (this.pullUp) {
        this.scroll.on('scrollEnd', () => {
          // 滚动到底部
          if (this.scroll.y <= (this.scroll.maxScrollY + 10)) {
            this.getOrders()
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
    setStatus (status) {
      this.status = status
      this.pullUp = true
      this.currentPage = 0
      this.totalPage = 1
      this.orders = []
      this.getOrders()
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
  .orders-page {
    height: 100%;
    background:rgba(242,244,247,1);
    /*padding-top: 14.5px;*/
    .status {
      position: fixed;
      left: 0;
      top: 0;
      height: 44px;
      width: 100%;
      z-index: 99;
      background:rgba(255,255,255,1);
      display: flex;
      justify-content: space-between;
      padding: 0 40px;
      .item {
        position: relative;
        height:44px;
        font-size:15px;
        font-weight:400;
        line-height:44px;
        color:rgba(153,153,153,1);
        /*border-bottom: 3px solid #38A1FF;*/
      }
      .item:first-child {
        min-width:30px;
      }
      .active {
        color:rgba(56,161,255,1);
      }
      .active:after {
        content: '';
        width: 100%;
        height:3px;
        background:rgba(56,161,255,1);
        border-radius:1.5px;
        position: absolute;
        left: 0;
        top:41px;
      }
    }
    .orders-wrapper{
      background:rgba(242,244,247,1);
      /*margin-top: 64.5px;*/
      height: 100%;
      overflow: hidden;
      .wrapper-content {
        padding-top: 44px;
        .item{
          margin-top: 10.5px;
          background:rgba(255,255,255,1);
          border:1px solid rgba(0,0,0,0);
          box-shadow:0px 0px 6.5px rgba(0,0,0,0.1);
          padding: 11px 13.5px 0 14px;
          display: flex;
          flex-direction: column;
          .up-info, .down-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .up-info {
            height: 66.5px;
            /*margin-bottom: 17px;*/
            .left {
              height: 100%;
              .title {
                text-align: left;
                height:22.5px;
                font-size:16px;
                font-weight:400;
                line-height:22.5px;
              }
              .amount {
                margin-top: 7px;
                text-align: left;
                height:20px;
                font-size:14px;
                font-weight:400;
                line-height:20px;
                color: #666666;
                .content {
                  color:rgba(255,106,89,1);
                }
              }
            }
            .right {
              height: 100%;
              display: flex;
              justify-content: flex-end;
              align-items: flex-start;
              span {
                height:20px;
                font-size:14px;
                font-weight:400;
                line-height:20px;
              }
              .dead {
                color:rgba(153,153,153,1);
              }
              .unpayed {
                color:rgba(56,161,255,1);
              }
            }
          }
          .down-info {
            height: 62.5px;
            border-top: 1px solid rgba(221,221,221,1);
            display: flex;
            justify-content: space-between;
            align-items: center;
            .left {
              div {
                height:16.5px;
                font-size:12px;
                font-weight:400;
                line-height:12px;
                color:rgba(102,102,102,1);
                text-align: left;
              }
              div:first-child {
                margin-bottom: 4px;
              }
              .order-no {
                overflow: hidden;
                .content {
                  height: 100%;
                  overflow: hidden;
                }
              }
            }
            .right {
              width:70px;
              height:30px;
              border:1px solid rgba(56,161,255,1);
              border-radius:3px;
              font-size:13px;
              font-weight:400;
              line-height:30px;
              color:rgba(56,161,255,1);
            }
          }
        }
        .padding {
          height: 69px;
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
    .no-order {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      img {
        margin-top: 149.5px;
        width: 104.5px;
        height: 122.5px;
      }
      .notice {
        margin-top: 40.5px;
        height:18.5px;
        font-size:13px;
        font-weight:400;
        line-height:18.5px;
        color:rgba(153,153,153,1);
      }
    }
  }
</style>
