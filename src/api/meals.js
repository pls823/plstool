import {request} from "@/common/js/request";
/**--获取点餐teb--**/
export function getFoodCategoryList(data){
    return request({
        url:'/api/diancanFoodProduct/getFoodCategoryList.do',
        data: data,
        method:'POST',
    })
}
/**--获取商品列表--**/
export function getFoodProductInfo(data){
    return request({
        url:'/api/diancanFoodProduct/getFoodProductInfo.do',
        data: data,
        method:'POST',
    })
}
/**--获取商品sku列表--**/
export function getFoodProductSkuInfo(data){
    return request({
        url:'/api/diancanFoodProduct/getFoodProductSkuInfo.do',
        data: data,
        method:'POST',
    })
}
/**--下单--**/
export function postFoodCart(data){
    return request({
        url:'/api/activityWeb/foodCart/insert.do',
        data: data,
        method:'POST',
        loading: true,
        successToast: true
    })
}

/**--找未结账订单--**/
export function getWaitPayOrder(data){
    return request({
        url:'/api/activityWeb/foodCart/queryOrder.do',
        data: data,
        method:'POST'
    })
}

/**--获取未结账订单--**/
export function getOrderCoreInfo(data){
    return request({
        url:'/api/activityWeb/foodCart/getOrderCoreInfo',
        data: data,
        method:'POST',
        loading: false
    })
}

/**--更新订单状态--**/
export function updateOrderStatus(data){
    return request({
        url:'/api/activityWeb/foodCart/updateOrderStatus.do',
        data: data,
        method:'POST',
        loading: true,
        resAll: true
    })
}

/**--获取优惠券信息--**/
export function getUserCouponQrCodeByApp(data){
    return request({
        url:'/app/userCoupon/getUserCouponQrCodeByApp',
        data: data,
        method:'POST',
        loading: true
    })
}

/**--获取计算金额--**/
export function countPrice(data){
    return request({
        url:'/api/diancanMallMerchant/countPrice',
        data: data,
        method:'POST',
        loading: true
    })
}

/**--创建支付--**/
export function createPay(data){
    return request({
        url:'/api/activityWeb/foodCart/createPay.do',
        data: data,
        method:'POST',
        loading: true,
        successToast: true,
        resAll: true
    })
}
/**--重打小票--**/
export function repeatPrint(data){
    return request({
        // url:'/XihuDcj/index',
        // url:'http://192.168.50.222:8899/XihuDcj/index',
        url:'http://127.0.0.1:8899/XihuDcj/index',
        params: data,
        method:'GET',
        loading: true,
        successToast: true
    })
}
