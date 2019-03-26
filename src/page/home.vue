<template>
  <div class="home-page">
    <div class="search">
      <img class="icon" src="../assets/img/base/icon_search@2x.png"/>
      <span class="notice">输入商户名称</span>
    </div>
    <div class="main">
      <div class="banners">
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
      <div class="merchants">
        <div class="title">
          <span class="main-title">热门商户</span>
          <span class="sub-title">精选优质商户</span>
        </div>
        <div class="content">
          <div class="item">
            <div class="logo">
              <img class="default" src="../assets/img/base/icon_goods_default@2x.png"/>
            </div>
            <div class="name">星巴克(虹桥国际商务 广场店)</div>
            <div class="price">￥114/人</div>
          </div>
          <div class="item">
            <div class="logo">
              <img class="default" src="../assets/img/base/icon_goods_default@2x.png"/>
            </div>
            <div class="name">必胜客(虹桥店)</div>
            <div class="price">￥280/人</div>
          </div>
          <div class="item">
            <div class="logo">
              <img class="default" src="../assets/img/base/icon_goods_default@2x.png"/>
            </div>
            <div class="name">威尔顿大酒店</div>
            <div class="price">￥114/人</div>
          </div>
          <div class="item">
            <div class="logo">
              <img class="default" src="../assets/img/base/icon_goods_default@2x.png"/>
            </div>
            <div class="name">levis(合川路店)</div>
            <div class="price">￥114/人</div>
          </div>
        </div>
      </div>
      <div class="padding"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'home',
  components: {},
  inject: ['reload'], // 引入方法
  data () {
    return {
      banners: [],
      merchantTypes: [],
      activities: [],
      hotMerchants: [],
      currentPage: 1,
      totalPage: 1
    }
  },
  computed: {
  },
  watch: {
  },
  created () {
    this.getBanners()
    this.getMerchantTypes()
    this.getActivities()
    this.getHotMerchants()
  },
  mounted () {
  },
  destroyed () {
  },
  methods: {
    getBanners () {
      this.$http.post(this.API.banners).then(res => {
        this.banners = res.data
      })
    },
    getMerchantTypes () {
      this.$http.post(this.API.merchantTypes).then(res => {
        this.merchantTypes = res.data
      })
    },
    getActivities () {
      this.$http.post(this.API.activities).then(res => {
        this.activities = res.data
      })
    },
    getHotMerchants () {
      this.$http.post(this.API.hotMerchants).then(res => {
        this.hotMerchants = res.data
        this.currentPage = res.meta.pagination.current_page
        this.totalPage = res.meta.pagination.total_pages
      })
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
    .main {
      .banners {
        width: 100%;
        height: 170px;
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
        height: 177px;
      }
    }
  }
</style>
