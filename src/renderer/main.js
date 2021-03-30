import 'ant-design-vue/dist/antd.css';
import "assets/css/app.scss";
import "assets/iconfont/iconfont.css";

import Antd from 'ant-design-vue';
import Vue from 'vue';
import Vuex from "vuex";
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

window.addEventListener('mousedown', () => {
  if (storeInst.state.drawer.menuInfo.visible) {
    storeInst.commit('drawer/changeMenuVisible', { visible: false });
  }
});

window.addEventListener('load', () => {
  // 组件右键菜单
  window.SuanpanAPI.eventService.on('sp:node:contextmenu', (event, options = {}) => {
    const { item, itemKey } = options;
    // 判断当前选中组件是否为rto组件
    if (item && item.metadata.def) {
      const { type, actionList } = item.metadata.def;
      if (type === 601 && actionList && actionList.length > 0 && actionList[0].hasOwnProperty('url')) {
        const { x, y, height, width } = document.getElementById(itemKey).getBoundingClientRect();
        const { url } = actionList[0];
        storeInst.commit('drawer/changeMenuVisible', {
          visible: true,
          location: { x: x + width, y: y + height / 2},
          detail: [
            { key: 'openRtoDrawer', name: '操作页面', function: () => {
              storeInst.commit('drawer/changeDrawerVisible', true);
              storeInst.commit('drawer/changeMenuVisible', { visible: false });
              storeInst.commit('drawer/changeIsModelAlgoManage', false);
              storeInst.commit('drawer/changeIframURL', `${appConfig.redirectRequest}${(url || '').match(/\/proxr[\S]*/)}`);
            }}
          ]
        });
      } else if (type !== 601 && storeInst.state.drawer.menuInfo.visible) {
        storeInst.commit('drawer/changeMenuVisible', { visible: false });
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

  window.SuanpanAPI.eventService.on('sp:node:select', (event, data) => {
    storeInst.commit('edit/selectedNode', data[1])
  })
  window.SuanpanAPI.eventService.on('sp:node:deselect', (event, data) => {
    storeInst.commit('edit/selectedNode', null)
  })
});

storeInst.watch(
  function (state) {
      return state.file.currentApp.id;
  },
  function () {
    if(storeInst.state.file.currentApp.id) {
      storeInst.dispatch('status/getStatus')
      storeInst.commit('log/allLogs', [])
      storeInst.dispatch('log/connect').then(res => {
        storeInst.dispatch('log/register')
        storeInst.dispatch('log/query')
      })
    }
  }
);

