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
    // 项目列表
    wizardVisible: true,
    wizardClosable: false,
    createAppDialog: false,
    createDirDialog: false,
    // 状态栏
    statusVisible: false,
    // 关于
    aboutVisible: false,
    // 参数配置
    paramVisible: !appRight.closed,
    // 设置
    settingVisible: false
  },
  mutations: {
    toolbarVisible(state, val) {
      state.toolbarVisible = val;
    },
    logPanelVisible(state, val) {
      state.logPanelVisible = val;
    },
    wizardVisible(state, val) {
      state.wizardVisible = val;
    },
    wizardClosable(state, val) {
      state.wizardClosable = val;
    },
    createAppDialog(state, val) {
      state.createAppDialog = val;
    },
    createDirDialog(state, val) {
      state.createDirDialog = val;
    },
    statusVisible(state, val) {
      state.statusVisible = val;
    },
    aboutVisible(state, val) {
      state.aboutVisible = val;
    },
    paramVisible(state, val) {
      state.paramVisible = val;
    },
    settingVisible(state, val) {
      state.settingVisible = val;
    }
  },
  actions: {
    closeSettingPannel({commit}) {
      SuanpanAPI.global.appRightEvents.onClose(new Event('setting'))
    },
    showSettingPannel({commit, rootState, rootGetters}, nodeId) {
      window.SuanpanAPI.global.appRightEvents.onShow(new Event('setting'));
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
