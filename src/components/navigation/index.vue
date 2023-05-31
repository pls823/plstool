<template>
  <div class="nav">
    <div class="nav-c">
      <span>{{title}}</span>
    </div>
    <div class="nav-r" @click="back" v-if="isBack">
      <div class="iconfont icon-left"></div>
      <span>返回</span>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Navigation',
  props:{
    title:{
      type: String,
      default: ''
    },
    isBack:{
      type: Boolean,
      default: true
    }
  },
  data() {
    return {

    }
  },
  watch:{
    title(){}
  },
  methods:{
    back(){
      this.$router.back()
    }
  }
}
</script>
<style lang="less" scoped>
.nav{
  height: 50px;
  display: flex;
  justify-items: start;
  align-items: center;
  background: #ffffff;
  padding: 0 20px;
  box-sizing: border-box;
}
.icon-left{
  font-size: 30px;
}
.nav-c{
  flex: 1;
  line-height: 48px;
  text-align: left;
  font-size: 20px;
  font-family: PingFang SC;
  font-weight: bold;
  color: #333333;
  line-height: 46px;
}
.iconfont{
  cursor: pointer;
}
.nav-r{
  padding-left: 30px;
  padding-right: 10px;
  display: flex;
  align-items: center;
  font-size: 16px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #787068;
  cursor: pointer;
  .iconfont{
    font-size: 18px;
    margin-top: 2px;
    margin-right: 2px;
  }
}
</style>
