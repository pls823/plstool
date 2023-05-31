import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import util from './common/js/common.js';

import vant from 'vant';
import '@vant/touch-emulator';
import 'vant/lib/index.css';
Vue.use(vant)

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

Vue.config.productionTip = false
Vue.prototype.$util = util

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
