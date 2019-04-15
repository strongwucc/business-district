<template>
  <div class="collection-page">
    <div ref="collectionWrapper" class="collection-wrapper" v-if="collection.length > 0">
      <ul class="collection-content">
        <swipeout>
          <swipeout-item transition-mode="follow" v-for="(fav, favIndex) in collection" :key="favIndex">
            <div slot="right-menu">
              <swipeout-button @click.native="cancelFav(favIndex, fav.mer_id)" type="warn" :width="60">
                <div>取消</div>
                <div>收藏</div>
              </swipeout-button>
            </div>
            <div slot="content" class="vux-1px-t" @click.stop="viewMerchantDetail(fav.mer_id)">
              <li class="item">
                <div class="info">
                  <div class="left">
                    <img :src="fav.pic|upload"/>
                  </div>
                  <div class="right">
                    <div class="name">{{fav.name}}</div>
                    <div class="price-icon">
                      <span class="price">￥{{fav.cost}}/人</span>
                      <img v-show="fav.showContact === 0" class="icon" src="../assets/img/base/icon_arrow_down@2x.png" @click.stop="fav.showContact = 1" />
                      <img v-show="fav.showContact === 1" class="icon" src="../assets/img/base/icon_arrow_up@2x.png" @click.stop="fav.showContact = 0" />
                    </div>
                  </div>
                </div>
                <div class="contact"  v-show="fav.showContact === 1">
                  <div class="contact-item">
                    <img src="../assets/img/base/icon_phone@2x.png"/>
                    <span>{{fav.mobile}}</span>
                  </div>
                  <div class="contact-item">
                    <img src="../assets/img/base/icon_add@2x.png"/>
                    <span>{{fav.addr}}</span>
                  </div>
                </div>
              </li>
            </div>
          </swipeout-item>
        </swipeout>
        <div class="padding" ref="padding">
          <div class="pull-notice" v-show="showLoading === false">
            —— {{pullTxt}} ——
          </div>
          <load-more v-show="showLoading" tip="正在加载"></load-more>
        </div>
      </ul>
    </div>
    <div class="no-collection" v-if="collection.length === 0 && !showLoading">
      <img class="icon" src="../assets/img/collection/states_shoucang_kong@2x.png"/>
      <span class="notice">暂时没有收藏哦</span>
      <span class="btn" @click.stop="$router.push({path: 'merchant'})">去逛逛</span>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import { getRect } from '../../src/assets/js/dom'
import { LoadMore, Swipeout, SwipeoutItem, SwipeoutButton } from 'vux'
export default {
  name: 'collection',
  components: { LoadMore, Swipeout, SwipeoutItem, SwipeoutButton },
  inject: ['reload'], // 引入方法
  data () {
    return {
      collection: [],
      pageLimit: 4,
      currentPage: 0,
      totalPage: 1,
      scroll: '',
      typeScroll: '',
      pullUp: true,
      showLoading: false,
      scrolling: false,
      posting: false
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
    this.getFavs()
  },
  destroyed () {
  },
  methods: {
    getFavs () {
      if (this.pullUp === false) {
        return false
      }
      let page = this.currentPage + 1
      let postData = {
        page_limit: this.pageLimit
      }
      this.showLoading = true
      this.$vux.loading.show({})
      this.$http.post(this.API.favs + '?page=' + page, postData).then(res => {
        this.showLoading = false
        this.$vux.loading.hide()
        res.data.forEach(e => {
          e.showContact = 0
        })
        this.collection = this.collection.concat(res.data)
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
      if (!this.$refs.collectionWrapper) {
        return
      }
      this.$refs.collectionWrapper.style.minHeight = `${getRect(this.$refs.collectionWrapper).height + 1}px`
      let options = {
        probeType: 1,
        click: true,
        pullUpLoad: true
      }
      this.scroll = new BScroll(this.$refs.collectionWrapper, options)

      if (this.pullUp) {
        this.scroll.on('scrollEnd', () => {
          // 滚动到底部
          if (this.scroll.y <= (this.scroll.maxScrollY + 10)) {
            this.getFavs()
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
    cancelFav (favIndex, merId) {
      if (this.posting) {
        return false
      }
      this.$vux.loading.show({})
      this.posting = true
      this.$http.post(this.API.fav, {mer_id: merId}).then(res => {
        this.$vux.loading.hide()
        this.posting = false
        if (res.status_code) {
          this.$vux.toast.show({
            type: 'text',
            text: '<span style="font-size: 14px">取消失败</span>',
            position: 'middle'
          })
          return false
        }
        this.collection.splice(favIndex, 1)
      })
    },
    viewMerchantDetail (merId) {
      this.$router.push({name: 'merchant_detail', params: {merId: merId}})
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
  .collection-page {
    height: 100%;
    background:rgba(242,244,247,1);
    .collection-wrapper {
      .collection-content {
        .item {
          background:rgba(255,255,255,1);
          margin-top: 5px;
          .info {
            height: 92px;
            padding: 15px 15px 16px 15px;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            .left {
              width: 100px;
              height: 66px;
              margin-right: 10px;
              img {
                width: 100%;
                height: 100%;
                border-radius:4px;
              }
            }
            .right {
              height: 100%;
              width: 234.5px;
              .name {
                text-align: left;
                height:22.5px;
                font-size:16px;
                font-weight:bold;
                line-height:22.5px;
              }
              .price-icon {
                width: 100%;
                margin-top: 25px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                span {
                  height:18.5px;
                  font-size:13px;
                  font-weight:400;
                  line-height:18.5px;
                }
                img {
                  width: 14px;
                  height: 14px;
                }
              }
            }
          }
          .contact {
            height: 60px;
            border-top:1px solid rgba(229,229,229,1);
            padding: 10.5px 16.5px 9.5px 1px;
            margin-left: 15.5px;
            .contact-item {
              display: flex;
              justify-content: flex-start;
              align-items: center;
              img {
                width: 12px;
                height: 12px;
                margin-right: 9px;
              }
              span {
                height:18.5px;
                font-size:13px;
                font-weight:400;
                line-height:18.5px;
                color:rgba(102,102,102,1);
              }
            }
            .contact-item:last-child {
              margin-top: 5px;
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
    .no-collection {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .icon {
        margin-top: 84px;
        width: 120px;
        height: 201.5px;
      }
      .notice {
        margin-top: 35.5px;
        height:20px;
        font-size:14px;
        font-weight:400;
        line-height:20px;
        color:rgba(153,153,153,1);
      }
      .btn {
        margin-top: 45px;
        width:110px;
        height:44px;
        border:1px solid rgba(56,161,255,1);
        border-radius:22px;
        font-size:14px;
        font-weight:400;
        line-height:44px;
        color:rgba(56,161,255,1);
      }
    }
  }
</style>
