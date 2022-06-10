import 'ant-design-vue/dist/antd.css';
import "assets/css";
import "assets/iconfont/iconfont.css";

import Antd from 'ant-design-vue';
import Vue from 'vue';
import Vuex from "vuex";
import App from './App.vue';
import StatusApp from './StatusApp.vue'
import CoverApp from './CoverApp.vue'
import store from "./store";
import Loading from "components/Loading"
import bus from "utils/bus";
import { listernersInit } from 'listerners/'


Vue.config.productionTip = false;
Vue.use(Vuex);
Vue.use(Antd);
Vue.prototype.$loading = Loading;

const storeInst = new Vuex.Store(store)
listernersInit(storeInst, Vue)

new Vue({
  store: storeInst,
  render (h) {
    return h(App)
  }
}).$mount('.rto_header');

new Vue({
  store: storeInst,
  render: h => h(StatusApp),
}).$mount('.rto_status');

new Vue({
  store: storeInst,
  render: h => h(CoverApp),
}).$mount('.rto_cover');

window.addEventListener('load', () => {
  // 监听rto组件打开操作面板
  window.SuanpanAPI.eventService.on('rto:setting:params', (event, data) => {
    if (data && data.length > 0 && data[0].hasOwnProperty('url')) {
      const { url } = data[0];
      if (url && url !== '') {
        window.open(`${appConfig.redirectRequest}${url.match(/\/proxr[\S]*/)}`);
      }
    }
  });

  window.SuanpanAPI.eventService.on('sp:node:select', (event, data) => {
    storeInst.commit('edit/selectedNode', data[1])
    if (storeInst.state.drawer.menuInfo.visible) {
      storeInst.commit('drawer/changeMenuVisible', { visible: false });
    }
  })
  window.SuanpanAPI.eventService.on('sp:node:deselect', (event, data) => {
    storeInst.commit('edit/selectedNode', null)
  })
})

let firtTime = true;
window.addEventListener('load', ()=> {
  let id = window.SuanpanAPI.eventService.on('sp:transition:success', (...data) => {
    if(data.length < 2) {
      return
    }
    let location = data[1].router.urlRouter.location;
    console.log('++++', data[1].promise.$$state.value.name)
    if(location.endsWith('/edit')) {
      bus.emit('transition-component')
    }else if(location.startsWith('/web/service/predict/')) {
      storeInst.commit('status/appRuning', data[1].promise.$$state.value.name)
      let locs = location.split('/');
      let lastItem = locs[locs.length - 1];
      if(!isNaN(Number(lastItem))) {
        bus.emit('transition-predict', [lastItem])
        if(firtTime) {
          firtTime = false;
          // 日志
          storeInst.commit('log/cleanLogs')
          storeInst.dispatch('log/register', lastItem)
          storeInst.dispatch('log/query', lastItem)
        }
      }
    }
  })

  // check permission
  window.SuanpanAPI.common.registerState('app.predict.read', function(...data) {
    storeInst.commit("appReadonly", true);
  })

  // listen appRight panel visible
  window.SuanpanAPI.eventService.on('appRight.closed', function() {
    storeInst.commit('view/paramVisible', false);
  })
  window.SuanpanAPI.eventService.on('appRight.show', function() {
    storeInst.commit('view/paramVisible', true);
  })
  window.SuanpanAPI.eventService.on('sp:app:changename', function(eventName, params) {
    storeInst.dispatch('file/changeCurrentName', params[2])
  })
})

storeInst.watch(
  function (state) {
      return state.file.currentApp;
  },
  function () {
    if(storeInst.state.file.currentApp && storeInst.state.file.currentApp.id) {
      storeInst.commit('edit/selectedNode', null)
      storeInst.commit('log/cleanLogs')
      storeInst.dispatch('log/register', storeInst.state.file.currentApp.id)
      storeInst.dispatch('log/query', storeInst.state.file.currentApp.id)
    }
  }
);
