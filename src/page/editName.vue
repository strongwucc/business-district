<template>
  <div class="edit-name-page">
    <div class="edit-area">
      <input v-model="nickName" placeholder="请输入昵称"/>
      <img v-show="nickName" @click.stop="emptyNickName" src="../assets/img/base/icon_del@2x.png"/>
    </div>
    <div class="btn" @click.stop="saveName">保存</div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'edit-name',
  components: {},
  inject: ['reload'], // 引入方法
  data () {
    return {
      nickName: '',
      posting: false
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.user_info
    })
  },
  watch: {
  },
  created () {
  },
  mounted () {
    this.nickName = this.userInfo.nickname
  },
  destroyed () {
  },
  methods: {
    ...mapMutations([
      'set_user_info'
    ]),
    saveName () {
      if (this.posting) {
        return false
      }
      if (this.nickName === '') {
        this.$vux.toast.show({
          type: 'text',
          text: '<span style="font-size: 14px">请输入昵称</span>',
          position: 'middle'
        })
        return false
      }
      this.$vux.loading.show({})
      this.posting = true
      this.$http.post(this.API.editUserInfo, {nickname: this.nickName}).then(res => {
        this.$vux.loading.hide()
        this.posting = false
        if (res.id) {
          let vm = this
          this.$vux.toast.show({
            type: 'text',
            text: '<span style="font-size: 14px">修改成功</span>',
            position: 'middle',
            onHide () {
              vm.$router.go(-1)
            }
          })
          this.set_user_info(res)
          return false
        }
        this.$vux.toast.show({
          type: 'text',
          text: '<span style="font-size: 14px">修改失败</span>',
          position: 'middle'
        })
        return false
      })
    },
    emptyNickName () {
      this.nickName = ''
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
  .edit-name-page {
    height: 100%;
    background:rgba(242,244,247,1);
    .edit-area {
      height: 50px;
      width: 100%;
      background:rgba(255,255,255,1);
      padding: 14px 14px 13.5px 19px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      input {
        height:22.5px;
        font-size:16px;
        font-weight:400;
        line-height:22.5px;
        color:rgba(51,51,51,1);
      }
      img {
        width: 16px;
        height: 16px;
      }
    }
    .btn {
      margin-top: 65px;
      margin-left: 40.5px;
      width:294px;
      height:44px;
      background:linear-gradient(90deg,rgba(44,133,246,1) 0%,rgba(76,169,255,1) 100%);
      border-radius:22px;
      font-size:16px;
      font-weight:400;
      line-height:44px;
      color:rgba(255,255,255,1);
    }
  }
</style>
