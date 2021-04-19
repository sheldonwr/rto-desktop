import 'ant-design-vue/dist/antd.css';
import "assets/css/app.scss";
import "assets/iconfont/iconfont.css";

import Antd from 'ant-design-vue';
import Vue from 'vue';
import Vuex from "vuex";
import App from './App.vue';
import ModelAlgoManage from './components/ModelAlgoManage';
import LogApp from './LogApp.vue';
import StatusApp from './StatusApp.vue'
import store from "./store";
import Loading from "components/Loading"
import { interval } from "utils/";


Vue.config.productionTip = false;
Vue.use(Vuex);
Vue.use(Antd);
Vue.prototype.$loading = Loading;

const storeInst = new Vuex.Store(store)

const routes = {
  '/': App,
  '/index.html': App,
  '/modelAlgoManage': ModelAlgoManage,
  '/modelAlgoManage.html': ModelAlgoManage
};

if(['/modelAlgoManage', '/modelAlgoManage.html'].indexOf(window.location.pathname) > -1) {
  let queryString = window.location.search;
  let params = new URLSearchParams(queryString);
  let tab = params.get("tab");
  storeInst.commit('drawer/changeActiveTab', tab)
}

new Vue({
  store: storeInst,
  data: {
    currentRoute: window.location.pathname,
  },
  computed: {
    ViewComponent () {
      const matchingView = routes[this.currentRoute]
      console.log(matchingView)
      return matchingView;
    }
  },
  render (h) {
    return h(this.ViewComponent)
  }
}).$mount('.rto_header');

new Vue({
  store: storeInst,
  render: h => h(LogApp),
}).$mount('.rto_log');

new Vue({
  store: storeInst,
  render: h => h(StatusApp),
}).$mount('.rto_status');

window.addEventListener('click', () => {
  if (storeInst.state.drawer.menuInfo.visible) {
    storeInst.commit('drawer/changeMenuVisible', { visible: false });
  }
});

window.addEventListener('load', () => {
  // 组件右键菜单
  window.SuanpanAPI.eventService.on('sp:node:contextmenu', (event, options = []) => {
    if (options.length > 0) {
      const commonMenu = [{
        key: 'cut',
        name: '剪切',
        active: true,
        function: () => {
          storeInst.dispatch("edit/cutNode");
        }
      }, {
        key: 'copy',
        name: '复制',
        active: true,
        function: () => {
          storeInst.dispatch("edit/copyNode");
        }
      }, {
        key: 'paste',
        name: '粘贴',
        active: true,
        function: () => {
          storeInst.dispatch("edit/pasteNode");
        }
      }, {
        key: 'delete',
        name: '删除',
        active: true,
        function: () => {
          Vue.prototype.$confirm({
            title: `确定删除这个组件吗？`,
            okText: "确定",
            cancelText: "取消",
            onOk: () => {
              storeInst.dispatch("edit/deleteNode");
            },
            onCancel() {},
          });
        }
      }];
      const { item, itemKey } = options[0];
      storeInst.commit('edit/selectedNode', item);
      let detail = [...commonMenu];
      if (item && item.metadata && item.metadata.def) {
        const { actionList } = item.metadata.def;
        const { x, y, height, width } = document.getElementById(itemKey).getBoundingClientRect();
        if (_.isEmpty(actionList) || actionList.length === 0) return;
        actionList.map((action, index) => {
          if (action.hasOwnProperty('url')) {
            const { url } = actionList[0];
            const { appId, userId } = window.appConfig;
            const iframeUrl = `${appConfig.redirectRequest}${(url || '').match(/\/proxr[\S]*/)}`
                            .replace('{{userId}}', userId)
                            .replace('{{appId}}', appId)
                            .replace('{{nodeId}}', itemKey)    
            detail.push({ 
              key: `action${index}`, 
              name: action.label || '操作页面',
              active: storeInst.getters['status/isRunning'],
              function: () => {
                storeInst.commit('drawer/changeMenuVisible', { visible: false });
                storeInst.commit('drawer/changeIsModelAlgoManage', false);
                window.open(iframeUrl);
              }
            });
          }
        });
        if (storeInst.state.drawer.menuInfo.visible) {
          storeInst.commit('drawer/changeMenuVisible', { visible: false });
        } else {
          storeInst.commit('drawer/changeMenuVisible', {
            visible: true,
            location: { x: x + width, y: y + height / 2},
            detail
          });
        }
      }
    }
  });

  // 监听rto组件打开操作面板
  window.SuanpanAPI.eventService.on('rto:setting:params', (event, data) => {
    console.log(event, data)
    if (data && data.length > 0 && data[0].hasOwnProperty('url')) {
      const { url } = data[0];
      if (url && url !== '') {
        storeInst.commit('drawer/changeIsModelAlgoManage', false);
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

  // interval get status
  interval(() => {
    storeInst.dispatch('status/getStatus')
  }, 1000);
});

window.addEventListener('load', ()=> {
  let id = window.SuanpanAPI.eventService.on('sp:transition:success', (...data) => {
    console.log('+++++++++', data)
    // window.SuanpanAPI.eventService.off(id)
    // resolve();
  })
})

storeInst.watch(
  function (state) {
      return state.file.currentApp;
  },
  function () {
    if(storeInst.state.file.currentApp && storeInst.state.file.currentApp.id) {
      storeInst.dispatch('status/getStatus')
      storeInst.commit('log/allLogs', [])
      storeInst.dispatch('log/connect').then(res => {
        storeInst.dispatch('log/register')
        storeInst.dispatch('log/query')
      })
    }
  }
);

