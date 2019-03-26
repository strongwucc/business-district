<template>
  <div class="home-page">
    <div class="search">
      <img class="icon" src=""/>
      <span class="notice">输入商户名称</span>
    </div>
    <div class="main">
      <div class="banners"></div>
      <div class="navs"></div>
      <div class="coupons"></div>
      <div class="activities"></div>
      <div class="merchants"></div>
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
    }
  },
  computed: {
  },
  watch: {
  },
  created () {
    this.getActivities()
  },
  mounted () {
  },
  destroyed () {
  },
  methods: {
    getActivities () {
      this.$http.post(this.API.activities).then(res => {
        console.log(res)
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
    background:rgba(246,246,246,1);
  }
</style>
