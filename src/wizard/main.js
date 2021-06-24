import "assets/iconfont/iconfont.css";
import 'ant-design-vue/dist/antd.css';

import Vue from 'vue';
import Antd from 'ant-design-vue';
// import Wizard from './Wizard';
import AppList from './AppList';
import Vuex from "vuex";
import store from "store/";
import MyPlugin from "./myPlugin"

Vue.config.productionTip = false
Vue.use(Vuex);
Vue.use(Antd);
Vue.use(MyPlugin);

const storeInst = new Vuex.Store(store);

new Vue({
  store: storeInst,
  render: h => h(AppList),
}).$mount('#app');