import {request} from "@/common/js/request";

/**--获取订单列表--**/
export function getOrderList(data){
    return request({
        url:'/api/activityWeb/foodCart/queryOrderDcj',
        data: data,
        method:'POST',
        loading: false,
        // successToast: true,
        // resAll: true
    })
}

/**--通知取餐--**/
export function sendOrderMessage(data){
    return request({
        url:'/api/activityWeb/foodCart/sendOrderMessage.do',
        data: data,
        method:'POST',
        loading: true,
        successToast: true,
        successMsg: '通知成功',
        resAll: true
    })
}

