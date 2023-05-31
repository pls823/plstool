<template>
  <div class="dialog-box cancelOrder" v-if="show">
    <div class="dialog">
      <div class="page_header">
        <div class="title">取消订单</div>
        <div class="close" @click="close">
          <i class="iconfont icon-guanbi"></i>
        </div>
      </div>
      <div class="page_body">
         <div class="list-box">
           <div class="list-item">
             <div class="title"><div>退款金额</div> <div class="red" v-if="moneyError"><span>最多可退</span><span>{{payMoney}}</span></div></div>
             <div class="item-box">
               <el-input
                   placeholder="请输入金额"
                   v-model="money"
                   class="money-input"
                   clearable
                   @focus="listenEnter"
               >
               </el-input>
             </div>
           </div>
           <div class="list-item">
             <div class="title"><div>退款原因</div></div>
             <div class="item-box">
               <el-select v-model="reason" clearable placeholder="请选择取消原因">
                 <el-option
                     v-for="item in options"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
                 </el-option>
               </el-select>
             </div>
           </div>
           <div class="list-item">
             <div class="title"><div>补充说明</div></div>
             <div class="item-box">
               <el-input
                   type="textarea"
                   :rows="4"
                   placeholder="请输入补充说明"
                   v-model="remark"
                   resize="none"
                   @focus="listenEnter"
               >
               </el-input>
             </div>
           </div>
         </div>
      </div>
      <div class="page_bottom">
        <div class="action">
          <div class="btn"  @click="cancel">确 定</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Dialog } from 'vant';
import {updateOrderStatus} from "@/api/meals";
export default {
  components:{
  },
  name: "CancelOrder",
  props:{
    orderMainnum:{
      type: String,
      default: ''
    },
    payMoney:{
      type: Number,
      default: 0
    },
  },
  data() {
    return {
      /**--组件显示/隐藏--**/
      show: false,
      /**--退款金额--**/
      money: 0,
      /**--退款金额--**/
      moneyError: false,
      /**--退款原因列表--**/
      options:[
         {
          label: '菜品库存不足',
          value: '菜品库存不足',
         },
         {
          label: '菜品质量问题',
          value: '菜品质量问题',
         },
         {
          label: '顾客要求取消',
          value: '顾客要求取消',
         },
         {
          label: '其他',
          value: '其他',
         },
      ],
      /**--退款原因--**/
      reason: '',
      /**--补充说明--**/
      remark: ''
    }
  },
  watch:{
    /**--点开组件--**/
    async show(v,oldV){
      if(v){
        this.initSystem()
      }
    }
  },
  methods:{
    /**--init--**/
    initSystem(){
      this.money = this.payMoney
      this.moneyError = false
      this.reason = ''
      this.remark = ''
    },
    /**--取消订单--**/
    cancel(){
      if(!Number(this.money)){
        this.$util.showToast('请输入数字金额')
        return;
      }
      if(Number(this.money) > this.payMoney){
        this.moneyError = true;
        return
      }  else {
        this.moneyError = false
      }
      if(this.reason.trim() == ''){
        this.$util.showToast('请选择取消原因')
        return;
      }
      Dialog.confirm({
        title: '操作提示',
        message: '您选择取消订单？',
      }).then(() => {
        console.log("金额",this.money)
        console.log("退款原因",this.reason)
        console.log("补充说明",this.remark)
          // this.postOrderStatus('CANCEL');
      }).catch(() => {
      });
    },
    /**--更新订单状态--**/
    async postOrderStatus(status){
      let res = await updateOrderStatus({
        orderMainnum: this.currentOrder,
        orderStatus: status
      })
      if(!res) return
      this.$util.showToast('操作成功')
      this.initSystem()
    },
    /**--监听键盘enter--**/
    listenEnter() {
      document.onkeydown = event => {
        var e = event || window.event;
        if (e && e.keyCode == 13) { //回车键的键值为13
        }
      };
    },
    /**--关闭组件--**/
    close(){
      this.show = false
    },
  },
  mounted() {
  }

}
</script>

<style lang="less" scoped>
.dialog-box{
  position: absolute !important;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  .dialog{
    width: 448px;
    height: 530px;
    background: #FFFFFF;
    border-radius: 5px;
    padding: 0 22px;
    display: flex;
    flex-direction: column;
  }
  .page_header{
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #F1EFED;
    text-align: left;
    position: relative;
    margin-bottom: 30px;
    .title{
      font-size: 20px;
      font-family: PingFang SC;
      font-weight: bold;
      color: #333333;
    }
    .close{
      position: absolute;
      right:0px;
      top: 0px;
      cursor: pointer;
      font-size: 36px;
      line-height: 36px;
    }
  }
  .page_body{
    flex: 1;
    text-align: left;
  }
  .page_bottom{
  }
}
.cancelOrder{
  .dialog{
    padding: 0;
    .page_header{
      margin:0 22px;
      margin-bottom: 0;
      .close{
        //right: 22px;
      }
    }
    .page_body{
      width: 100%;
      overflow: hidden;
      .list-box{
        margin: 0 22px 0;
        .list-item{
          width: 100%;
          margin-bottom: 10px;
          .title{
            display: flex;
            justify-content: space-between;
            align-items: center;
            >div:first-child{
              font-size: 16px;
              font-family: PingFang SC;
              font-weight: 500;
              color: #333333;
              line-height: 46px;
            }
            .red{
              font-size: 16px;
              font-family: PingFang SC;
              font-weight: 500;
              color: #F96347;
            }
          }
          .item-box{
            min-height: 50px;
            background: #EDECF4;
            border-radius: 10px;
            display: flex;
            align-items: center;
            .money-input{
              ::v-deep {
                .el-input__inner {
                  font-size: 24px;
                  font-family: PingFang SC;
                  font-weight: bold;
                  color: #4D4398;
                  line-height: 46px;
                }
              }
            }
            ::v-deep {
              .el-input__inner{
                border: none;
                background: #EDECF4;
                font-size: 16px;
                font-family: PingFang SC;
                font-weight: 500;
              }
              .el-select{
                width: 100%;
                font-size: 16px;
                font-family: PingFang SC;
                font-weight: 500;
              }
              .el-textarea__inner{
                padding-top: 14px;
                background: #EDECF4;
                border-radius: 10px;
                border: none;
                font-size: 16px;
                font-family: PingFang SC;
                font-weight: 500;
              }
              ::-webkit-input-placeholder {
                font-size: 16px;
                font-family: PingFang SC;
                font-weight: 500;
                color: #787068;
              }
              :-moz-placeholder {
                font-size: 16px;
                font-family: PingFang SC;
                font-weight: 500;
                color: #787068;
              }
              ::-moz-placeholder {
                font-size: 16px;
                font-family: PingFang SC;
                font-weight: 500;
                color: #787068;
              }
              :-ms-input-placeholder {
                font-size: 16px;
                font-family: PingFang SC;
                font-weight: 500;
                color: #787068;
              }
            }

          }
        }
      }
    }
    .page_bottom{
      .action{
        padding: 0  22px 12px;
      }
    }
  }
}
</style>
