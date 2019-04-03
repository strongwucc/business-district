<template>
  <div class="point-page">
    <div class="background"></div>
    <div class="description"></div>
    <div class="point"></div>
    <div class="label">
      — 我的积分 —
    </div>
    <div class="title">
      <img src=""/>
      <span>积分交易明细</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'point',
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
  },
  mounted () {
  },
  destroyed () {
  },
  methods: {
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
  .point-page {
    height: 100%;
    background:rgba(246,246,246,1);
  }
</style>
