import "assets/css/app.scss";
import "assets/iconfont/iconfont.css";
import 'ant-design-vue/dist/antd.css';
import Antd from 'ant-design-vue';
import Vuex from "vuex";
import Vue from 'vue';
import App from './App.vue';
import LogApp from './LogApp.vue';
import store from "./store";
import Loading from "components/Loading"
import CallbackChain from './plugins/callbackChain'

Vue.config.productionTip = false;
Vue.use(Vuex);
Vue.use(Antd);
Vue.prototype.$loading = Loading;

const storeInst = new Vuex.Store(store)

Vue.use(CallbackChain, {store: storeInst});

new Vue({
  store: storeInst,
  render: h => h(App),
}).$mount('.rto_header');

new Vue({
  store: storeInst,
  render: h => h(LogApp),
}).$mount('.rto_log');

window.addEventListener('load', () => {
  // 监听组件选中
  window.SuanpanAPI.eventService.on('sp:node:select', (event, data) => {
    if (data && data.length > 1) {
      const nodeInfo = data[1];
      //  判断当前选中组件是否为rto组件
      if (nodeInfo.metadata.def.type ===  601) {

      }
    }
  });
  
  // 监听rto组件打开操作面板
  window.SuanpanAPI.eventService.on('rto:setting:params', (event, data) => {
    console.log(event, data)
    if (data && data.length > 0 && data[0].hasOwnProperty('url')) {
      const { url } = data[0];
      if (url && url !== '') {
        storeInst.commit('drawer/changeDrawerVisible', true);
        storeInst.commit('drawer/changeIsModelAlgoManage', false);
        storeInst.commit('drawer/changeIframURL', `${appConfig.redirectRequest}${url.match(/\/proxr[\S]*/)}`);
      }
    }
  });
});

// 加载app
storeInst.dispatch('file/startApp', () => {
  storeInst.dispatch('status/getStatus')
})
