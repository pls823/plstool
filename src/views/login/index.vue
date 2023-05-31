<!-- 账号密码登录页 -->
<template>
  <div class="container">
    <div class="page_header">
      <div class="logo"><img src="https://xihu-oss.oss-cn-hangzhou.aliyuncs.com/xihu-meals/logo.png" alt="logo"></div>
      <div class="name-box">
        <div class="name">志驿 <span>•</span> 西湖驿站</div>
        <div class="pingxing">ZHIYI<span></span>XIHUYIZHAN</div>
      </div>
    </div>
    <div class="page_body">
      <div class="box">
        <div class="title">请输入店铺账号密码</div>
        <div class="list-item">
          <i class="iconfont icon-zhanghu"></i>
          <input :focus="focusUsername" @blur="focusUsername = false" class="input-box"
                 v-model="username" placeholder="请输入账号" />
        </div>
        <div class="list-item">
          <i class="iconfont icon-suo"></i>
          <input :focus="focusPassword" @blur="focusPassword = false" class="input-box" clearable
                 type="password" v-model="password" placeholder="请输入密码" />
        </div>
        <div class="action">
          <div class="label" @click="checkRemenber">
            <i class="iconfont" :class="isRemenber ? 'icon-xuanzhong1' : 'icon-weixuan'"></i><span>记住密码</span>
          </div>
          <div class="label" @click="checkAuto">
            <i class="iconfont" :class="isAuto ? 'icon-xuanzhong1' : 'icon-weixuan'"></i><span>自动登录</span>
          </div>
        </div>
        <button class="btn primary"  @click="pwdLogin">登 录</button>
      </div>
    </div>
    <div class="page_bottom">
      <div class="date-box">
        <div class="time">{{time}}</div>
        <div class="date">{{date}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import {getMallMerchantCode, login, permissionList} from "@/api/login";
import {cookie_login} from "@/common/js/common";

export default {
  data() {
    return {
      username: "",
      password: "",
      focusUsername: false,
      focusPassword: false,
      isRemenber: false,
      isAuto: false,
      time: '',
      date: '',
    }
  },
  methods: {
    initSystem(){
      this.listenEnter()
      this.renderDate()
      this.getLocalStorage()
    },
    listenEnter() {
      document.onkeydown = event => {
        var e = event || window.event;
        if (e && e.keyCode == 13) { //回车键的键值为13
          this.pwdLogin()
        }
      };
    },
    renderDate(){
      let week = ['天','一','二','三','四','五','六']
      this.date = this.$util.dayjs().format('YYYY年MM月DD日 星期') + week[this.$util.dayjs().day()]
      this.time = this.$util.dayjs().format('HH:mm')
      setInterval(()=>{
        this.time = this.$util.dayjs().format('HH:mm')
      },1000)
    },
    getLocalStorage(){
      let username = window.localStorage.getItem('username')
      let password = window.localStorage.getItem('password')
      let isRemenber = window.localStorage.getItem('isRemenber')
      let isAuto = window.localStorage.getItem('isAuto')
      if(isRemenber||isAuto){
        this.username = username;
        this.password = password;
      }
      if(isRemenber){
        this.isRemenber = true;
      }
      if(isAuto){
        this.isAuto = true;
      }

      if(isAuto){
        this.pwdLogin()
      }
    },
    /**
     * 密码登录
     */
   async pwdLogin() {
      if (!this.password.length) {
        this.focusPassword = true
        return this.$toast({
          message: '请输入密码',
          icon: 'none',
          duration: 3000
        });
      }
      if (!this.username.length) {
        this.focusUsername = true
        return this.$toast({
          message: '请输入用户名',
          icon: 'none',
          duration: 3000
        });
      }
      let local = window.localStorage.getItem('password')
      let password = local == this.password ? this.password  : this.$util.md5(this.password).substr(8,16)
      let res = await login({
        username: this.username,
        password: password,
        loginUsername: this.username,
        phoneType: 'pc',
        phoneCode: 'pc',
        loginLang: 'zh'
      })
      if(!res.content) {
        this.$util.showToast(res.msg)
        return
      }
      let apikey = res.content.apikey
      this.$util.cookie_login(apikey)
      let permission = await permissionList()
      if(!permission) return
      window.top.buttonList = permission.content.buttonList
      let merchant = await getMallMerchantCode()
      if(merchant.status != 1) return
      if(merchant.code != 200) return
      window.localStorage.setItem('merchantCode',merchant.content.merchantCode)
      window.localStorage.setItem('accountInfo',JSON.stringify(merchant.content))
      this.$router.push('/main/order')
    },
    checkRemenber(){
      this.isRemenber = !this.isRemenber
      if(this.isRemenber){
        window.localStorage.setItem('isRemenber',true)
        this.setAccount(true)
        return
      }
      window.localStorage.removeItem('isRemenber')
      if(!this.isAuto){
        this.setAccount(false)
      }
    },
    checkAuto(){
      this.isAuto = !this.isAuto
      if(this.isAuto){
        window.localStorage.setItem('isAuto',true)
        this.setAccount(true)
        return
      }
      window.localStorage.removeItem('isAuto')
      if(!this.isRemenber){
        this.setAccount(false)
      }
    },
    setAccount(set){
      let local = window.localStorage.getItem('password')
     if(set){
       window.localStorage.setItem('username',this.username)
       let password = local  == this.password ? this.password :  this.$util.md5(this.password).substr(8,16)
       console.log("local",local,'password',this.password)
       window.localStorage.setItem('password',password)
     }else{
       window.localStorage.removeItem('username')
       window.localStorage.removeItem('password')
       if(local  == this.password){
         this.password = ''
       }
     }
    }
  },
  mounted(){
    this.initSystem()
  }
}
</script>

<style lang="less" scoped>
.container{
  background: linear-gradient(45deg, #443A9C, #80749A, #C7DB3B);
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
}
.page_header{
  margin: 26px 0 0 26px;
  display: flex;
  align-items: center;
  justify-content: start;
  .logo{
    width: 49px;
    height: 49px;
    margin-right: 13px;
    img{
      width: 49px;
      height: 49px;
      border-radius: 50%;
    }
  }
  .name-box{
    text-align: left;
  }
  .name{
    margin-bottom: 6px;
    font-size: 23px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #FFFFFF;
    span{
      margin: 0 2px;
    }
  }
  .pingxing{
    font-size: 12px;
    font-family: PingFang SC;
    font-weight: 400;
    color: #EBEBF7;
    opacity: 0.3;
    letter-spacing: 10px;
    span{
      margin: 0 10px;
    }
  }
}
.page_body {
  flex: 1;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .box{
    padding: 30px 40px 80px 40px;
    width: 460px;
    height: 420px;
    background: #FFFFFF;
    border-radius: 10px;
    box-sizing: border-box;
    .title {
      text-align: center;
      font-size: 24px;
      font-family: PingFang SC;
      font-weight: bold;
      color: #333333;
      line-height: 13px;
      padding-bottom: 30px;
    }

    .input-box {
      height: 52px;
      background-color: #ffffff;
      border-radius: 0;
      font-size: 14px;
      display: flex;
      flex: 1;
      border: none;
      width: 100%;
      padding: 0 10px;
      box-sizing: border-box;
    }

    .list-item{
      margin-bottom: 10px;
      height: 54px;
      background: #FFFFFF;
      border: 1px solid #CCCCCC;
      box-shadow: 0px 0px 2px 0px rgba(0,0,0,0.1);
      border-radius: 10px;
      box-sizing: border-box;
      overflow: hidden;
      display: flex;
      align-items: center;
      padding: 0 20px 0 12px;
      i{
        font-size: 24px;
        color: #CCCCCC;
      }
    }
    .action{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 30px 0 70px;
      .label{
        display: flex;
        align-items: center;
        cursor: pointer;
        i{
          margin-right: 8px;
          color: #cccccc;
          &.icon-xuanzhong1{
            color: #4D4398;
          }
        }
        span{
          font-size: 14px;
          font-family: PingFang SC;
          font-weight: 500;
          color: #000000;
          line-height: 13px;
        }
      }
    }

    .btn{
      width: 100%;
    }
  }
}
.page_bottom{
  width: 100%;
  .date-box{
    margin-bottom: 30px;
    margin-right: 30px;
    float: right;
    text-align: right;
    .time{
      font-size: 46px;
      font-family: PingFang SC;
      font-weight: 400;
      color: #FFFFFF;
    }
    .date{
      font-size: 16px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #FFFFFF;
      opacity: 0.5;
    }
  }

}


</style>
