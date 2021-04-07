
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
    statusVisible: false
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
    }
  },
  actions: {
  }
};
