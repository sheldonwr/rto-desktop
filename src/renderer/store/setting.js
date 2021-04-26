export default {
  namespaced: true,
  state: {
    settingVisible: false,
    form: {
      rightPanelCenter: false
    }
  },
  mutations: {
    settingVisible(state, val) {
      state.settingVisible = val;
    },
    form(state, val) {
      state.form = val;
    },
  },
  actions: {
  }
};
