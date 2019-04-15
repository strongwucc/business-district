<template>
  <div class="point-page">
    <div class="info">
      <div class="description" @click.stop="showDes">积分说明</div>
      <div class="point">{{point}}</div>
      <div class="label">
        — 我的积分 —
      </div>
    </div>
    <div class="title">
      <img src="../assets/img/point/icon_jifen@2x.png"/>
      <span>积分交易明细</span>
    </div>
    <div class="points">
      <div ref="pointWrapper" class="point-wrapper" v-if="records.length > 0">
        <ul class="point-content">
          <li class="item" v-for="(record, recordIndex) in records" :key="recordIndex">
            <div class="reason">
              <span class="txt">{{record.reason}}</span>
              <span class="score">{{record.change_point}}</span>
            </div>
            <div class="order">
              订单号：{{record.related_id}}
            </div>
            <div class="time">
              订单时间：{{record.addtime}}
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
      <div class="no-records" v-if="records.length === 0 && !showLoading">
        <img src="../assets/img/point/states_jf_kong@2x.png"/>
        <span>还没有积分纪录哦~</span>
      </div>
    </div>
    <div class="mask" v-show="showDescription"></div>
    <div class="rule" v-show="showDescription">
      <div class="rule-title">积分说明</div>
      <div class="rule-content">
        <div class="rule-item">
          <span class="label">积分规则：</span>
          <span class="content">消费1元获得1积分</span>
        </div>
        <div class="rule-item">
          <span class="label">积分抵扣：</span>
          <span class="content">100积分抵扣1元消</span>
        </div>
      </div>
      <div class="close" @click.stop="hideDes">x</div>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import { getRect } from '../../src/assets/js/dom'
import { LoadMore } from 'vux'
import { mapState } from 'vuex'
export default {
  name: 'point',
  components: { LoadMore },
  inject: ['reload'], // 引入方法
  data () {
    return {
      records: [],
      pageLimit: 4,
      currentPage: 0,
      totalPage: 1,
      scroll: '',
      typeScroll: '',
      pullUp: true,
      showLoading: false,
      scrolling: false,
      showDescription: false,
    }
  },
  computed: {
    ...mapState({
      point: state => state.user.user_info.point
    }),
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
    this.getRecords()
  },
  destroyed () {
  },
  methods: {
    getRecords () {
      if (this.pullUp === false) {
        return false
      }
      let page = this.currentPage + 1
      let postData = {
        page_limit: this.pageLimit
      }
      this.showLoading = true
      this.$vux.loading.show({})
      this.$http.post(this.API.points + '?page=' + page, postData).then(res => {
        this.showLoading = false
        this.$vux.loading.hide()
        this.records = this.records.concat(res.data)
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
      if (!this.$refs.pointWrapper) {
        return
      }
      this.$refs.pointWrapper.style.minHeight = `${getRect(this.$refs.pointWrapper).height + 1}px`
      let options = {
        probeType: 1,
        click: true,
        pullUpLoad: true
      }
      this.scroll = new BScroll(this.$refs.pointWrapper, options)

      if (this.pullUp) {
        this.scroll.on('scrollEnd', () => {
          // 滚动到底部
          if (this.scroll.y <= (this.scroll.maxScrollY + 10)) {
            this.getRecords()
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
    showDes () {
      this.showDescription = true
    },
    hideDes () {
      this.showDescription = false
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
  .point-page {
    height: 100%;
    background:rgba(255,255,255,1);
    .info {
      position: fixed;
      background: url("../assets/img/point/img_jifen@2x.png");
      background-size: 100% 100%;
      z-index: 99;
      top: 0;
      left: 0;
      width: 100%;
      height: 180px;
      img {
        height: 180px;
      }
      .description {
        margin-top: 10.5px;
        margin-right: 13px;
        text-align: right;
        height:18.5px;
        font-size:13px;
        font-weight:400;
        line-height:12px;
        color:rgba(51,51,51,1);
      }
      .point {
        margin-top: 51.5px;
        height:42.5px;
        font-size:38px;
        font-family:Arial;
        font-weight:400;
        line-height:42.5px;
        color:rgba(249,83,73,1);
      }
      .label {
        height:20px;
        font-size:14px;
        font-weight:400;
        line-height:20px;
      }
    }
    .title {
      position: fixed;
      z-index: 99;
      width: 100%;
      top: 180px;
      height:40px;
      background:rgba(242,242,245,1);
      padding: 12px;
      display: flex;
      justify-content: flex-start;
      img {
        width: 16px;
        height: 16px;
        margin-right: 4px;
      }
      span {
        height:20px;
        font-size:14px;
        font-weight:400;
        line-height:20px;
      }
    }
    .points {
      margin-top: 220px;
      .no-records {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        img {
          margin-top: 65px;
          width: 82.5px;
          height: 86px;
        }
        span {
          margin-top: 30.5px;
          height:20px;
          font-size:14px;
          font-weight:400;
          line-height:20px;
          color:rgba(187,187,187,1);
        }
      }
      .point-wrapper {
        .point-content {
          .item {
            height: 89.5px;
            border-bottom: 1px solid rgba(229,229,229,1);
            padding: 10px 15px 10.5px 15.5px;
            .reason {
              display: flex;
              justify-content: space-between;
              .txt {
                height:21px;
                font-size:15px;
                font-weight:bold;
                line-height:21px;
              }
              .score {
                height:24px;
                font-size:17px;
                font-weight:400;
                line-height:24px;
                color:rgba(249,83,73,1);
              }
            }
            .order, .time {
              height:16.5px;
              font-size:12px;
              font-weight:400;
              line-height:16.5px;
              color:rgba(153,153,153,1);
              text-align: left;
            }
            .order {
              margin-top: 10px;
            }
            .time {
              margin-top: 5px;
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
    }
    .mask {
      position: absolute;
      z-index:99;
      width: 100%;
      top: 0;
      bottom: 0;
      background:rgba(51,51,51,1);
      opacity:0.5;
    }
    .rule {
      position: absolute;
      top: 151.5px;
      left: 48.5px;
      z-index: 99;
      width:279.5px;
      height:175px;
      background:rgba(255,255,255,1);
      border-radius:8px;
      .rule-title {
        height:39px;
        background:rgba(56,161,255,1);
        font-size:16px;
        font-weight:400;
        line-height:39px;
        color:rgba(255,255,255,1);
        border-radius:8px 8px 0 0;
      }
      .rule-content {
        padding-top: 35px;
        padding-bottom: 51px;
        .rule-item {
          height:20px;
          font-size:14px;
          font-weight:400;
          line-height:20px;
          .label {
            color:rgba(56,161,255,1);
          }
        }
        .rule-item:first-child {
          margin-bottom: 10px;
        }
      }
      .close {
        position: relative;
        top: 28.5px;
        left: 122.5px;
        width:34px;
        height:34px;
        background:rgba(102,102,102,1);
        border-radius:50%;
        line-height: 34px;
        color: #DDDDDD;
      }
    }
  }
</style>
