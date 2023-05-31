<template>
  <div class="money-box">
    <div class="money" :style="`color: ${color};`" v-if="type == 1">
      <div class="unit" :style="`font-size: ${unitSize}px;`" v-if="showUnit">￥</div>
      <div class="numInt" :style="`font-size: ${intSize}px;`">{{getInt}}</div>
      <div class="numFloat" :style="`font-size: ${floatSize}px;`">{{getFloat}}</div>
    </div>
    <div class="money" :style="`color: ${color}`" v-if="type == 2">
      <div class="unit" :style="`font-size: ${floatSize}px;`" v-if="showUnit">￥</div>
      <div class="numInt" :style="`font-size: ${floatSize}px;`">{{getInt}}</div>
      <div class="numFloat" :style="`font-size: ${floatSize}px;`">{{getFloat}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Money",
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    color:{
      type: String,
      default: '#4D4398'
    },
    showUnit:{
      type: Boolean,
      default: true
    },
    unitSize:{
      type: Number,
      default: 12
    },
    intSize:{
      type: Number,
      default: 24
    },
    floatSize:{
      type: Number,
      default: 24
    },
    type:{
      type: Number,
      default: 1
    }
  },
  watch: {
    value:{
      handler(v){
        if(v == '0' || v == '' || !v){
          this.getInt = "0"
          this.getFloat = ".00"
        } else if(!(v.toString().indexOf('.')>-1)){
          this.getInt = v
          this.getFloat = ".00"
        } else {
          let t = v.toString().split('.')
          this.getInt = t[0]
          this.getFloat = "."+t[1]
        }
      },
      immediate: true
    }
  },
  data() {
    return {
      getInt: "",
      getFloat: "",
    }
  }
}
</script>

<style lang="less" scoped>
.money-box{
  .money{
    display: flex;
    flex-direction: row;
    align-items: baseline;

  }
  .unit{
    font-size: 24px;
    font-weight: bold;
    margin-right: 4px;
  }
  .numInt{
    font-size: 36px;
    font-weight: bold;
  }
  .numFloat{
    font-size: 24px;
    font-weight: bold;
  }
}
</style>
