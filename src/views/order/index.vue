<template>
  <div class="container">
    <Navigation title="订单列表" :is-back="false"></Navigation>
    <div class="page_header">
      <div class="quik">
        <div class="list-item"
             :class="currentTime == index ? 'active' : ''"
             v-for="(item,index) in timeTab"
             @click="changeTime(index)"
             v-if="index != 3"
        >{{item.text}}</div>
      </div>
      <div class="time-box">
        <el-date-picker
            v-model="customTime"
            @change="timePicker"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
        >
        </el-date-picker>
      </div>
      <div class="search-box">
        <div class="query">
          <el-select v-model="textKey" class="querySelect">
            <el-option
                key="orderMainnum"
                label="订单号"
                value="orderMainnum">
            </el-option>
            <el-option
                key="buyerTelephone"
                label="手机号"
                value="buyerTelephone">
            </el-option>
          </el-select>
        </div>
        <div class="textInput">
          <el-input
              :placeholder="'请输入'+(textKey == 'orderMainnum' ? '订单号' : '手机号')"
              v-model="searchText"
              clearable
              @focus="listenEnter"
          >
          </el-input>
        </div>
      </div>
      <div class="btn" @click="$refs.orderScroll.run()">查询</div>
    </div>
    <div class="page_body">
      <div class="section-l">
        <div class="tab-box">
          <div class="tab" :class="currentType == index ? 'active' : ''"
               v-for="(item,index) in typeList"
               @click="changeType(index)"
          >{{item.text}}</div>
        </div>
        <div class="status-box">
          <div class="status" :class="item.check ? 'check' : ''"
               v-for="(item,index) in typeList[currentType].list"
               @click="selectStatus(item)"
          >{{item.text}}</div>
        </div>
        <div class="orderList">
          <ScrollView :get-data="getOrderList" ref="orderScroll" :enableRefresh="true">
            <template slot="container" slot-scope="{list}">
              <div class="list-box">
                <div class="list-item" :class="currentOrder == item.orderMainnum ? 'active' : ''"
                     v-for="(item,index) in list"
                     @click="getOrderInfo(item)"
                >
                  <div class="order">订单编号：{{item.orderMainnum}}</div>
                  <div class="time">{{item.createDate}}</div>
                  <div class="info">
                    <div class="money">订单总价：￥{{item.totalPrice}}</div>
                    <div class="status">
                      <span>{{item.orderStatusName}}</span>
                      <i></i>
                      <span>{{item.orderSource == 'DCJ' ? '点餐机' : '小程序'}}下单</span>
                      <i></i>
                      <span>{{item.isPickup == 0 ? '堂食' : '自提'}}</span>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </ScrollView>
        </div>
      </div>
      <div class="section-r">
        <div class="title">
          <div class="status" v-show="!orderInfo.orderStatusName == ''">[{{orderInfo.orderStatusName}}]</div>
          <div class="pickNo">取餐码：{{orderInfo.pickupCode}}</div>
        </div>
        <div class="table-box">
          <div class="table-body">
            <div class="table-header">
              <div>菜品名称</div>
              <div>单价</div>
              <div>数量</div>
              <div>总价</div>
            </div>
            <div class="table-row"
                 v-for="(item,index) in orderInfo.orderSubcoreList">
              <div class="cell">{{ item.productName }}{{item.skuName}}</div>
              <div class="cell">{{item.price}}</div>
              <div class="cell">{{item.num}}</div>
              <div class="cell">{{item.price*item.num}}</div>
            </div>
          </div>
        </div>
        <div class="orderInfo">
          <div class="list-item">菜品总价：{{orderInfo.payMoney}}</div>
          <div class="list-item">打包费：{{orderInfo.bagPrice}}</div>
          <div class="list-item">订单总价：{{orderInfo.payMoney}}</div>
        </div>
        <div class="action">
          <div class="cancel" @click="cancel" v-if="typeList[currentType].value.includes('ASSORTED_FOOD')||typeList[currentType].value.includes('ASSORTED_FINISH')">取消订单</div>
          <div class="finish" @click="changeStatus('ASSORTED_FINISH','您确认配餐完成？')" v-if="typeList[currentType].value.includes('ASSORTED_FOOD')">配餐完成</div>
          <div class="finish" @click="broadcast('REFUSAL_ORDER','您确认通知？')" v-if="typeList[currentType].value.includes('ASSORTED_FINISH')">通知取餐</div>
          <div class="cancel" @click="changeStatus('RECEIV_ORDER','您确认接单？')" v-if="typeList[currentType].value.includes('PAY')">接单</div>
          <div class="finish" @click="changeStatus('REFUSAL_ORDER','您确认拒单？')" v-if="typeList[currentType].value.includes('PAY')">拒单</div>
        </div>
      </div>
    </div>
    <CancelOrder ref="cancleOrder" :orderMainnum="currentOrder" :payMoney="orderInfo.payMoney"></CancelOrder>
  </div>
</template>
<script>
import Navigation from "@/components/navigation";
import CancelOrder from "@/components/cancelOrder";
import ScrollView from "@/components/scroll-view";
import {getOrderList, sendOrderMessage} from "@/api/order";
import {getOrderCoreInfo, updateOrderStatus} from "@/api/meals";
import {Dialog} from "vant";
export default {
  components:{
    Navigation,
    ScrollView,
    CancelOrder
  },
  name: 'Order',
  data() {
    return {
      /**--查询时间类型--**/
      timeTab:[
        {text: '今天',value:''},
        {text: '昨天',value:''},
        {text: '一周',value:''},
        {text: 'custom',value:''},
      ],
      /**--当前时间类型--**/
      currentTime: 0,
      customTime: '',
      /**--查寻文本类型 orderMainnum buyerTelephone--**/
      textKey: 'orderMainnum',
      /**--查寻文本类型--**/
      searchText:'',
      /**--订单类型列表--**/
      typeList:[
        {
          text: '点餐机订单',
          key: 'DCJ',
          value: 'ASSORTED_FOOD',
          list:[
            {
              text:'配餐中',
              key: 'ASSORTED_FOOD',
              check: true
            },
            {
              text:'配餐完成',
              key: 'ASSORTED_FINISH',
              check: false
            },
            {
              text:'交易完成',
              key: 'FINISH',
              check: false
            },
          ]
        },
        {
          text: '小程序订单',
          key: 'app',
          value: 'PAY',
          list:[
            {
              text:'已支付',
              key: 'PAY',
              check: true
            },
            {
              text:'配餐中',
              key: 'ASSORTED_FOOD',
              check: false
            },
            {
              text:'配餐完成',
              key: 'ASSORTED_FINISH',
              check: false
            },
            {
              text:'交易完成',
              key: 'FINISH',
              check: false
            },
          ]

        },
      ],
      /**--订单类型--**/
      currentType: 0,
      /**--订单状态--**/
      orderStatus: '',
      /**--订单列表--**/
      orderList:[],
      /**--当前订单编号--**/
      currentOrder: '',
      /**--订单信息--**/
      orderInfo:{
        /**--订单状态--**/
        orderStatusName: '',
        /**--取餐码--**/
        pickupCode: '',
        /**--订单编号--**/
        orderMainnum: '',
        /**--菜品信息--**/
        orderSubcoreList:[],
        /**--打包费--**/
        bagPrice: 0,
        /**--订单数量--**/
        num: 0,
        /**--订单金额--**/
        payMoney: 0
      },
    }
  },
  methods:{
    /**--启动程序--**/
    initSystem(){
      this.currentOrder = ''
      this.orderInfo = {}
      this.initTime()
      this.$refs.orderScroll.run()
    },
    /**--初始化日期--**/
    initTime(){
      let today = this.$util.dayjs().format('YYYY-MM-DD')
      let yesterday = this.$util.dayjs().subtract(1, 'day').format('YYYY-MM-DD')
      let weekM = this.$util.dayjs().subtract(7, 'day').format('YYYY-MM-DD')
      this.timeTab[0].value = today + '^doubleDate^' + today
      this.timeTab[1].value = yesterday + '^doubleDate^' + yesterday
      this.timeTab[2].value = weekM + '^doubleDate^' + yesterday
    },
    /**--获取订单列表--**/
    async getOrderList(page){
      let res = await getOrderList({
        page: page,
        rows: 10,
        orderSource: this.typeList[this.currentType].key,
        orderStatus: this.typeList[this.currentType].value,
        createDate: this.timeTab[this.currentTime].value,
        orderMainnum: this.textKey == 'orderMainnum' ? this.searchText : '',
        buyerTelephone: this.textKey == 'buyerTelephone' ? this.searchText : '',
      })
      if(!res) return
      this.orderList = res.rows
      return res.rows
    },
    /**--改变查询时间--**/
    changeTime(index){
      this.currentTime = index
      this.$refs.orderScroll.run()
    },
    /**--获取自定义时间--**/
    timePicker(v){
      this.timeTab[3].value = !v ? '' : v[0] + '^doubleDate^' + v[1]
      this.changeTime(3)
    },
    /**--改变查询订单类型--**/
    changeType(index){
      this.currentType = index
      this.currentOrder = ''
      this.orderInfo = {}
      this.$refs.orderScroll.run()
    },
    /**--选择订单状态--**/
    selectStatus(item){
      this.typeList[this.currentType].value = ''
      this.typeList[this.currentType].list.forEach((i)=>{
        i.check = i.key == item.key ? !item.check : false
        if(i.check){
          this.typeList[this.currentType].value = i.key
        }
      })
      this.currentOrder = ''
      this.orderInfo = {}
      this.$refs.orderScroll.run()
    },
    /**--获取订单信息--**/
    async getOrderInfo(item){
      this.currentOrder = item.orderMainnum
      let res = await getOrderCoreInfo({
        orderMainnum: item.orderMainnum
      })
      if(!res) return
      this.orderInfo = res
    },
    /**--取消订单--**/
    cancel(){
      if(this.currentOrder == ''){
        this.$util.showToast('您还没有选择订单')
        return
      }
      this.$refs.cancleOrder.show = true
    },
    /**--改变订单状态--**/
    changeStatus(status,msg){
      if(this.currentOrder == ''){
        this.$util.showToast('您还没有选择订单')
        return
      }
      Dialog.confirm({
        title: '操作提示',
        message: msg,
      }).then(() => {
        this.postOrderStatus(status);
      }).catch(() => {
      });
    },
    /**--更新订单状态--**/
    async postOrderStatus(status){
      let res = await updateOrderStatus({
        orderMainnum: this.currentOrder,
        orderStatus: status
      })
      if(!res.content) return
      if(res.content.code ==  200){
        this.$util.showToast('操作成功')
        this.initSystem()
      } else {
        this.$util.showToast(res.content.msg)
      }

    },
    /**--广播取餐--**/
    broadcast(status,msg){
      if(this.currentOrder == ''){
        this.$util.showToast('您还没有选择订单')
        return
      }
      Dialog.confirm({
        title: '操作提示',
        message: msg,
      }).then(() => {
          this.postMessage()
      }).catch(() => {
      });
    },
    async postMessage(){
      let res = await sendOrderMessage({
        orderMainnum: this.currentOrder,
      })
    },
    /**--监听查询商品enter--**/
    listenEnter() {
      document.onkeydown = event => {
        var e = event || window.event;
        if (e && e.keyCode == 13) { //回车键的键值为13
          this.$refs.orderScroll.run()
        }
      };
    },
    /**--取消监听--**/
    cancelListenEnter(){
      document.onkeydown = ()=>{}
    },
  },
  mounted() {
    this.initSystem()
  },
  beforeRouteLeave(to, from, next){
    this.cancelListenEnter()
    next()
  }
}
</script>
<style lang="less" scoped>
.container{
  display: flex;
  flex-direction: column;
  padding-left: 10px;
  overflow: hidden;
  box-sizing: border-box;
  .page_header{
    margin: 0 10px;
  }
  .page_body{
    flex: 1;
    overflow: hidden;
  }
  .page_header{
    display: flex;
    margin: 10px 0;
    align-items: center;
    .quik{
      width: 182px;
      height: 48px;
      background: #FFFFFF;
      border-radius: 5px;
      display: flex;
      overflow: hidden;
      .list-item{
        flex: 1;
        text-align: center;
        line-height: 48px;
        font-size: 16px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #787068;
        border-right: 1px solid rgba(77, 67, 152, .1);
        cursor: pointer;
        &.active{
          background: #C6DA3A;
          font-weight: bold;
          color: #4D4398;
        }
        &:last-child{
          border: none;
        }
      }
    }
    .time-box{
      margin: 0 10px;
      width: 282px;
      height: 48px;
      background: #FFFFFF;
      border-radius: 5px;
      overflow: hidden;
      display: flex;
      align-items: center;
      ::v-deep {
        .el-date-editor--daterange{
          width: 292px !important;
        }
        .el-input__inner{
          border: none;
        }
        .el-range__icon{
          //position: absolute;
          //right: 4px;
        }
        .el-range__close-icon{
          //margin-right: 16px;
        }
        .el-range-separator{
          padding: 0 18px;
        }
        input{
          font-size: 16px !important;
        }
      }
    }
    .search-box{
      flex: 1;
      height: 48px;
      background: #FFFFFF;
      border-radius: 5px;
      overflow: hidden;
      display: flex;
      align-items: center;
      box-sizing: border-box;
      padding-left: 10px;
      ::v-deep input{
        border: none;
      }
      .query{
        width: 90px;
        display: flex;
        align-items: center;
        .querySelect{
          ::v-deep .el-input__inner{
            padding: 0;
          }
        }
      }
      .textInput{
        flex: 1;
        height: 100%;
        border-left: 1px solid rgba(77, 67, 152, .1);
        display: flex;
        align-items: center;
      }

    }
    .btn{
      width: 88px;
      height: 48px;
      border-radius: 5px;
      font-size: 18px;
      font-family: PingFang SC;
      font-weight: bold;
      color: #FFFFFF;
      line-height: 46px;
      margin: 0 10px;
    }
  }
  .page_body{
    display: flex;
    .section-l{
      height: 100%;
      flex: 1;
      background: #FFFFFF;
      border-radius: 5px 5px 0px 0px;
      display: flex;
      flex-direction: column;
      .tab-box{
        padding: 0 10px;
        display: flex;
        .tab{
          font-size: 16px;
          font-family: PingFang SC;
          font-weight: 500;
          color: #787068;
          line-height: 46px;
          margin-right: 40px;
          position: relative;
          cursor: pointer;
          &:after{
            content: '';
            display: block;
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            width: 36px;
            height: 4px;
            border-radius: 2px;
            margin: 0 auto;
          }
          &.active{
            font-size: 18px;
            font-weight: bold;
            color: #333333;
          }
          &.active:after{
            background: linear-gradient(86deg, #4D4398, #A28FA2);
          }
        }
      }
      .status-box{
        padding: 12px 10px 16px;
        display: flex;
        .status{
          min-width: 98px;
          height: 42px;
          background: #EDECF4;
          border-radius: 5px;
          padding: 0 10px;
          font-size: 16px;
          font-family: PingFang SC;
          font-weight: 500;
          color: #787068;
          line-height: 42px;
          margin-right: 10px;
          box-sizing: border-box;
          cursor: pointer;
          &.check{
            background: #C6DA3A;
            font-weight: bold;
            color: #4D4398;
          }
        }
      }
      .orderList{
        flex: 1;
        overflow: hidden;
      }
      .list-box{
        .list-item{
          height: 100px;
          background: rgba(237, 236, 244, .6);
          padding: 10px;
          box-sizing: border-box;
          text-align: left;
          margin-bottom: 12px;
          cursor: pointer;
          &.active{
            background: rgba(238, 244, 196, 0.6)
          }
          .order{
            font-size: 16px;
            font-family: PingFang SC;
            font-weight: bold;
            color: #333333;
          }
          .time{
            font-size: 14px;
            font-family: PingFang SC;
            font-weight: 500;
            color: #787068;
          }
          .info{
            display: flex;
            margin-top: 10px;
            .money{
              font-size: 14px;
              font-family: PingFang SC;
              font-weight: 500;
              color: #333333;
              flex: 1;
            }
            .status{
              width: 230px;
              height: 16px;
              line-height: 16px;
              font-size: 14px;
              font-family: PingFang SC;
              font-weight: 500;
              color: rgba(120, 112, 104, 1);
              text-align: center;
              alignment: center;
              display: flex;
              align-items: center;
              span:first-child{
                color: #F16F20;
              }
              i{
                display: inline-block;
                height: 14px;
                border-right: 1px solid rgba(120, 112, 104, .6);
                margin: 0 18px;
              }
            }
          }
        }
      }
    }
    .section-r{
      width: 458px;
      height: 100%;
      background: #FFFFFF;
      border-radius: 5px 0px 0px 0px;
      margin-left: 10px;
      position: relative;
      overflow: hidden;
      .title{
        height: 52px;
        padding: 0 14px;
        line-height: 52px;
        .status{
          float: left;
          font-size: 18px;
          font-family: PingFang SC;
          font-weight: bold;
          color: #F16F20;
        }
        .pickNo{
          float: right;
          font-size: 16px;
          font-family: PingFang SC;
          font-weight: bold;
          color: #333333;
          line-height: 46px;
        }
      }
      .table-box{
        max-height: calc(100% - 220px);
        height: initial;
      }
      .orderInfo{
        height: 100px;
        text-align: right;
        padding: 10px 0;
        box-sizing: border-box;
        .list-item{
          font-size: 14px;
          font-family: PingFang SC;
          font-weight: 500;
          color: #787068;
          margin-bottom: 10px;
        }
      }
      .action{
        position: absolute;
        bottom: 0;
        width: 100%;
        display: flex;
        height: 58px;
        line-height: 58px;
        font-size: 18px;
        font-family: PingFang SC;
        font-weight: bold;
        color: #FFFFFF;
        line-height: 58px;
        >div{
          flex: 1;
          cursor: pointer;
        }
        .cancel{
          background: #A07DB1;
        }
        .finish{
          background: #4D4398;
        }
      }
    }

  }
  .table-box{
    width: 100%;
    //height: 100%;
    overflow: hidden;
    overflow: auto;
    overflow-x: hidden;
    .table-header>div,.table-body .table-row>div{
      font-size: 14px;
      font-family: PingFang SC;
      font-weight: 500;
      text-align: center;
    }
    .table-header>div:not(:first-child),.table-body .table-row>div:not(:first-child){
      width: 50px;
      text-align: center;
    }
    .table-header>div:first-child,.table-body .table-row>div:first-child{
      flex: 1;
      text-align: left;
      padding-left: 14px;
    }
    .table-header{
      position: -webkit-sticky;
      position:sticky;
      top: 0;
      height: 36px;
      background: rgba(244, 244, 248, 1);
      display: flex;
      align-items: center;
      padding: 0 10px;
      box-sizing: border-box;
      z-index: 2;
      >div{
        color: #787068;
      }
    }
    .table-body{
      width: 100%;
      max-height: calc(100vh);
      .table-row{
        min-height: 60px;
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: bold;
        color: #333333;
        display: flex;
        align-items: center;
        padding: 0 10px;
        box-sizing: border-box;
        border-bottom: 1px solid #F1EFED;
        box-sizing: border-box;
        &:hover .cell{
          color: #4D4398 ;
        }
        >div{
          color: #333333;
        }
      }
    }
  }
}
</style>
