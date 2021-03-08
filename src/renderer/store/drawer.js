export default {
  namespaced: true,
  state: {
    drawerVisible: false,
    activeTab: '',
    isModelAlgoManage: false,
    iframURL: ''
  },
  mutations: {
    changeDrawerVisible(state, visible) {
      state.drawerVisible = visible;
    },
    changeActiveTab(state, type) {
      state.activeTab = type;
    },
    changeIsModelAlgoManage(state, isShow) {
      state.isModelAlgoManage = isShow;
    },
    changeIframURL(state, url) {
      state.iframURL = url;
    }
  },
  actions: {
  }
};
