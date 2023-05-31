import md5 from 'md5'
import dayjs from 'dayjs'
import { Toast } from 'vant';
function cookie_login(apikey){
    let exdate = new Date();
    exdate.setDate(exdate.getDate() + 7);
    let setCookie = "xyzxyzxyzxyzxyzxyzxyzxyzxyzxyz=" + apikey + ";expires=" + exdate.toGMTString() + ";path=/";
    document.cookie = setCookie;

}
function cookie_loginout(){
    document.cookie = "xyzxyzxyzxyzxyzxyzxyzxyzxyzxyz=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
}

function cookie_get(name){
    let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    return arr = document.cookie.match(reg) ? arr[2] : null;
}

function showToast(text){
    Toast({message: text})
}

function copy(text){
    let result
    let textarea = document.createElement("textarea")
    textarea.value = text
    textarea.readOnly = "readOnly"
    document.body.appendChild(textarea)
    textarea.select()
    textarea.setSelectionRange(0, text.length)
    showToast('复制成功')
    result = document.execCommand("copy")
    textarea.remove()
}
export default {
    md5,
    dayjs,
    cookie_login,
    cookie_loginout,
    cookie_get,
    showToast,
    copy
}
