
export default {
  namespaced: true,
  state: {
    toolbarVisible: true,
    logPanelVisible: false,
    wizardVisible: true,
    wizardClosable: false,
    createAppDialog: false,
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
    }
  },
  actions: {
  }
};
