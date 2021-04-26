let appRight = {
  closed: false
}
if(window.localStorage && window.localStorage.appRight) {
  Object.assign(appRight, window.localStorage.appRight);
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
    // 设置
    settingVisible: appRight.closed
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
    settingVisible(state, val) {
      state.settingVisible = val;
    }
  },
  actions: {
    closeSettingPannel({commit}) {
      commit("settingVisible", false)
      SuanpanAPI.global.appRightEvents.onClose(new Event('setting'))
    },
    showSettingPannel({commit}) {
      commit("settingVisible", true)
      SuanpanAPI.global.appRightEvents.onShow(new Event('setting'))
    },
  }
};
