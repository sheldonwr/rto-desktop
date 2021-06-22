import "assets/iconfont/iconfont.css";
import 'ant-design-vue/dist/antd.css';

import Vue from 'vue';
import Antd from 'ant-design-vue';
import ModelAlgoManage from './ModelAlgoManage';
import Vuex from "vuex";
import store from "./store";

Vue.config.productionTip = false
Vue.use(Vuex);
Vue.use(Antd);

const storeInst = new Vuex.Store(store)

let queryString = window.location.search;
let params = new URLSearchParams(queryString);
let tab = params.get("tab");
storeInst.commit('changeActiveTab', tab);

new Vue({
  store: storeInst,
  render: h => h(ModelAlgoManage),
}).$mount('#app');