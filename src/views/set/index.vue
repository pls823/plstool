<template>
  <div class="container">
    <Navigation title="配置" :isBack="false"></Navigation>
    <div class="page_body">
        <div class="plate" @click="topPage('/main/foodSet')">
          <img src="https://xihu-oss.oss-cn-hangzhou.aliyuncs.com/xihu-meals/commoditySet.png" alt="food" class="food">
          菜品设置
        </div>
        <div class="plate" @click="topPage('/main/shopSet')">
          <img src="https://xihu-oss.oss-cn-hangzhou.aliyuncs.com/xihu-meals/shopSet.png" alt="shop" class="shop">
          店铺设置
        </div>
        <div class="plate" @click="quit()">
          <img src="https://xihu-oss.oss-cn-hangzhou.aliyuncs.com/xihu-meals/quit.png" alt="quit" class="quit">
          退出登录
        </div>

    </div>
  </div>
</template>
<script>
import Navigation from "@/components/navigation";
export default {
  components:{
    Navigation
  },
  name: 'Set',
  data() {
    return {

    }
  },
  methods:{
    /**--跳转页面--**/
    topPage(url){
      // this.$router.push(url)
    },
    /**--退出登录--**/
    quit(){
      this.$util.cookie_loginout()
      window.localStorage.setItem('merchantCode','')
      window.localStorage.setItem('accountInfo','')
      this.$router.push('/login')
    }
  },
  mounted() {
  }
}
</script>
<style lang="less" scoped>
.container{
  margin-left: 10px;
  .page_body{
    margin-top: 10px;
    display: flex;
    .plate{
      width: 200px;
      height: 200px;
      background: #FFFFFF;
      border-radius: 5px;
      margin-right: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      cursor: pointer;
      img{
        width: 49px;
        height: 48px;
        display: block;
        margin-bottom: 36px;
        &.shop{
          width: 46px;
          height: 42px;
        }
        &.quit{
          width: 42px;
          height: 42px;
        }
      }
    }
  }
}
</style>
