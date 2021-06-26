let appRight = {
  closed: false
}
if(window.localStorage && window.localStorage.appRight) {
  let appRightLocal = JSON.parse(window.localStorage.appRight);
  if(appRightLocal.closed) {
    appRight.closed = true;
  }
}

export default {
  namespaced: true,
  state: {
    // 工具栏
    toolbarVisible: true,
    // 日志窗口
    logPanelVisible: false,
    createAppDialog: false,
    // 状态栏
    statusVisible: false,
    // 关于
    aboutVisible: false,
    // 帮助文档
    helpVisible: false,
    // 属性配置
    paramVisible: !appRight.closed,
    // 设置
    settingVisible: false,
    // 前端显示
    frontendVisible: false,
    // 项目列表遮罩
    coverVisible: true
  },
  mutations: {
    toolbarVisible(state, val) {
      state.toolbarVisible = val;
    },
    logPanelVisible(state, val) {
      state.logPanelVisible = val;
    },
    createAppDialog(state, val) {
      state.createAppDialog = val;
    },
    statusVisible(state, val) {
      state.statusVisible = val;
    },
    aboutVisible(state, val) {
      state.aboutVisible = val;
    },
    helpVisible(state, val) {
      state.helpVisible = val;
    },
    paramVisible(state, val) {
      state.paramVisible = val;
    },
    settingVisible(state, val) {
      state.settingVisible = val;
    },
    frontendVisible(state, val) {
      state.frontendVisible = val;
    },
    coverVisible(state, val) {
      state.coverVisible = val;
    }
  },
  actions: {
    closeSettingPannel({commit}) {
      SuanpanAPI.global.appRightEvents.onClose(new Event('setting'))
    },
    showSettingPannel({commit, rootState, rootGetters}, nodeId) {
      window.SuanpanAPI.global.appRightEvents.onShow(new Event('setting'));
      window.SuanpanAPI.common.onAsideToggle('right', 'show')
      if(nodeId) {
        let stateChain = 'app.predict.edit.node';
        if(rootState.appReadonly) {
          stateChain = 'app.predict.read.node';
        }else if(rootGetters["status/isRunning"]) {
          stateChain = 'app.predict.run.node';
        }
        window.SuanpanAPI.common.goState(stateChain, String(rootState.file.currentApp.id), nodeId, 'predict')
      }else {
        window.SuanpanAPI.common.goState('app.predict', String(rootState.file.currentApp.id), null, 'predict')
      }
    },
  }
};
