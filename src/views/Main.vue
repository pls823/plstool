<template>
  <div class="container page">
    <nav>
      <div class="nav">
        <div class="list-item" :class="$route.meta.activeMenu==item.path?'active':''"
             v-for="(item,index) in navList"
             @click="toPage(item)"
        >
          <img :src="$route.meta.activeMenu==item.path?item.selectImg:item.unSelectImg" alt="">
          <div>{{item.title}}</div>
        </div>
      </div>
      <img :src="accountInfo.merchantImg" class="logo">
    </nav>
    <router-view class="main"/>
  </div>
</template>
<script>
export default {
  name: 'Main',
  data() {
    return {
      /**--导航列表--**/
      navList:[
        {
          title: '订单',
          icon: '',
          path: '/main/order',
          selectImg: 'https://xihu-oss.oss-cn-hangzhou.aliyuncs.com/xihu-meals/order_black.png',
          unSelectImg: 'https://xihu-oss.oss-cn-hangzhou.aliyuncs.com/xihu-meals/order_white.png'
        },
        {
          title: '设置',
          icon: '',
          path: '/main/set',
          selectImg: 'https://xihu-oss.oss-cn-hangzhou.aliyuncs.com/xihu-meals/set_black.png',
          unSelectImg: 'https://xihu-oss.oss-cn-hangzhou.aliyuncs.com/xihu-meals/set_white.png'
        }
      ],
      /**--账户信息--**/
      accountInfo:{
        merchantImg: ''
      }
    }
  },
  methods:{
    /**--启动程序--**/
    initSystem(){
      this.getAccountInfo()
    },
    /**--获取账户信息--**/
    getAccountInfo(){
      let res = JSON.parse(window.localStorage.getItem('accountInfo'))
      res.merchantImg = res.merchantImg == '' ? 'https://xihu-oss.oss-cn-hangzhou.aliyuncs.com/xihu-meals/logo.png' :  res.merchantImg
      this.accountInfo = res
    },
    /**--跳转页面--**/
    toPage(item){
      this.$router.push(item.path)
    }
  },
  beforeMount() {
    this.initSystem()
  }
}
</script>
<style lang="less" scoped>
.page{
  display: flex;
  nav{
    width: 86px;
    height: 100%;
    box-sizing: border-box;
    background: #4D4398;
    display: flex;
    flex-direction: column;
    align-items: center;
    .nav{
      flex: 1;
      overflow: auto;
      width: 100%;
    }
  }
  .main{
    flex: 1;
    height: 100%;
  }
}
nav{
  color: #fff;
  .logo{
    width: 54px;
    height: 54px;
    margin: 20px 0 ;
    background: #FFFFFF;
    border: 1px solid #9892A8;
    border-radius: 50%;
  }
  .list-item{
    height: 100px;
    text-align: center;
    cursor: pointer;
    font-size: 16px;
    font-family: PingFang SC;
    font-weight: 500;
    color: rbga(255,255,255,0.5);
    line-height: 40px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
    &:hover{
      background: #C6DA3A;
      color: #4D4398;
    }
    &.active{
      background: #C6DA3A;
      color: #4D4398;
    }
    img{
      width: 38px;
      height: 40px;
      margin-top: 10px;
    }
  }
}
</style>
