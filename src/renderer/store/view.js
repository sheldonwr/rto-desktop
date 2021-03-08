
export default {
  namespaced: true,
  state: {
    toolbarVisible: false,
    logPanelVisible: false
  },
  mutations: {
    toolbarVisible(state, val) {
      state.toolbarVisible = val;
    },
    logPanelVisible(state, val) {
      state.logPanelVisible = val;
    }
  },
  actions: {
  }
};
