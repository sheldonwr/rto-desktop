export default {
  namespaced: true,
  state: {
    drawerVisible: false,
    activeTab: '',
    isModelAlgoManage: false,
    iframURL: '',
    menuInfo: {
      visible: false,
      location: { x:0, y: 0},
      detail: []
    }
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
    },
    changeMenuVisible(state, { visible, location = {x: 0, y: 0}, detail = [] }) {
      state.menuInfo.visible = visible;
      state.menuInfo.location = location;
      state.menuInfo.detail = detail;
    }
  },
  actions: {
  }
};
