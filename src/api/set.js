import {request} from "@/common/js/request";

/**--获取店铺设置--**/
export function getMallMerchantConfig(data){
    return request({
        url:'/api/diancanMallMerchant/getMallMerchantConfig.do',
        data: data,
        method:'POST',
        loading: false,
    })
}
/**--修改店铺设置--**/
export function editMallMerchantConfig(data){
    return request({
        url:'/api/diancanMallMerchant/editMallMerchantConfig.do',
        data: data,
        method:'POST',
        loading: true,
        successToast: true
    })
}
/**--产品上下架--**/
export function updateSaleStatus(data){
    return request({
        url:'/api/diancanFoodProduct/updateSaleStatus.do',
        data: data,
        method:'POST',
        loading: true,
        successToast: true
    })
}
/**--sku上下架--**/
export function updateSkuStatus(data){
    return request({
        url:'/api/diancanFoodProduct/updateSkuStatus.do',
        data: data,
        method:'POST',
        loading: true,
        successToast: true
    })
}
/**--附加上下架--**/
export function updateFeedStatus(data){
    return request({
        url:'/api/diancanFoodProduct/updateFeedStatus.do',
        data: data,
        method:'POST',
        loading: true,
        successToast: true
    })
}
