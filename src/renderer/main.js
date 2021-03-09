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
import './listeners'
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

// 加载app
storeInst.dispatch('file/startApp')