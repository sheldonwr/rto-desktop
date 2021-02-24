import "assets/css/app.scss";
import "assets/iconfont/iconfont.css";
import Vuex from "vuex";
import Vue from 'vue'
import App from './App.vue'
import store from "./store";

Vue.config.productionTip = false
Vue.use(Vuex);

new Vue({
  store: new Vuex.Store(store),
  render: h => h(App),
}).$mount('#app')
