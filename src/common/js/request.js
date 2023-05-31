import { Toast } from 'vant';
import axios from 'axios';
import qs from 'qs'
import router from '../../router'

let host_config = {
    // env: 'development',
    env: process.env.NODE_ENV,
    proxy: {
        development: '',
        production: '',
        pre: 'https://zyxh.maytek.cn',
        online: 'https://xhyz.maytek.cn'
    }
}
export function request (obj) {
    //检测传入数据类型
    if (typeof  obj !== "object") {
        console.warn('参数必须是对象');
        return
    }
    let loading = obj.loading ? obj.loading : false
    if(loading){
        Toast.loading({
            message: '加载中...',
            forbidClick: true,
            transition: 'fade',
            duration: 5*60*1000
        });
    }

    //post请求统一带参
    let merchantCode = window.localStorage.getItem('merchantCode')??''
    let filterData = obj.data ? Object.assign({merchantCode: merchantCode},obj.data) : {merchantCode: merchantCode}

    let baseUrl = obj.baseUrl ? obj.baseUrl : host_config.proxy[host_config.env];
    let url = baseUrl + obj.url;
    let method = obj.method;
    let data = filterData ? qs.stringify(filterData) : null;
    let params = obj.params ? qs.stringify(obj.params, {arrayFormat: 'brackets'}) : null;
    let headers = {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
    };
    // headers['Content-Type']= 'application/json';
    Object.assign(headers,obj.headers)
    if(headers['Content-Type'].indexOf('application/json')>-1){
        data = JSON.stringify(obj.data);
    }
    return axios({
        url: url,
        method: method,
        crossDomain: true,
        headers: headers,
        params: params,
        paramsSerializer: function (params) {
            return params
        },
        data: data,
        timeout: 50000,
        responseType: 'json', // 默认的
        maxContentLength: 2000,
        validateStatus: function (status) {
            let message;
            switch (status) {
                case 400:
                    message = '请求错误';
                    break;
                case 401:
                    message = '未授权，请登录';
                    break;
                case 403:
                    message = '拒绝访问';
                    break;
                case 404:
                    message = `请求地址出错: ${obj.url}`;
                    break;
                case 408:
                    message = '请求超时'
                    break;
                case 500:
                    message = '服务器内部错误'
                    break;
                case 501:
                    message = '服务未实现'
                    break;
                case 502:
                    message = '网关错误'
                    break;
                case 503:
                    message = '服务不可用'
                    break;
                case 504:
                    message = '网关超时'
                    break;
                case 505:
                    message = 'HTTP版本不受支持'
                    break;
                default:
                    break;
            }
            if (message) {
                Toast({
                    type: 'warning',
                    message: message,
                    duration: 3000,
                    showClose: true
                })
            }
            return status >= 200 && status < 300; // 默认的
        }
    }).then(e => {
        if(loading){
           Toast.clear()
        }
        return filterRes(e.data,obj)
    }).catch(e => {
        if(loading){
            Toast.clear()
        }
        console.log("请求失败",e)
    })
}
function filterRes(res,obj){
    let {successToast=false,resAll=false} = {...obj}
    let resultSuccess = [200,undefined,1].includes((!res.code?res.status: res.code))
    if(!resultSuccess||successToast){
        Toast({
            type: 'warning',
            message: (successToast && obj.successMsg) ? obj.successMsg : res.msg ,
            duration: !resultSuccess ? 3000 : 1000,
            showClose: true,
            onClose:()=>{
                if(res.msg.includes('重新登录')){
                    router.push('/login')
                }
            }
        })
    }
    return resAll ? res : res.content
}
