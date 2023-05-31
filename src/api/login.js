import {request} from "@/common/js/request";

/**--登录--**/
export function login(data){
    return request({
        url:'/LoginWS/login.xyz',
        data: data,
        method:'POST',
        loading: true,
        // successToast: true,
        resAll: true
    })
}
/**--获取权限--**/
export function permissionList(data){
    return request({
        url:'/LoginWS/decideLogin.do',
        data: data,
        method:'POST',
        loading: true,
        resAll: true
    })
}
/**--获取店铺--**/
export function getMallMerchantCode(data){
    return request({
        url:'/api/diancanMallMerchant/getMallMerchantCode.do',
        data: data,
        method:'POST',
        loading: false,
        resAll: true
    })
}
