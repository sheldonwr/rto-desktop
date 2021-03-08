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

Vue.config.productionTip = false;
Vue.use(Vuex);
Vue.use(Antd);
Vue.prototype.$loading = Loading;

const storeInst = new Vuex.Store(store)

new Vue({
  store: storeInst,
  render: h => h(App),
}).$mount('.rto_header');

new Vue({
  store: storeInst,
  render: h => h(LogApp),
}).$mount('.rto_log');

window.addEventListener('load', () => {
  let topicId = window.SuanpanAPI.eventService.on('sp:transition:success', (event, data) => {
    window.SuanpanAPI.eventService.off(topicId)
    storeInst.dispatch('file/startApp')
  });
})
