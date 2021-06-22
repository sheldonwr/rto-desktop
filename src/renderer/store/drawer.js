export default {
  namespaced: true,
  state: {
    menuInfo: {
      visible: false,
      location: { x:0, y: 0},
      detail: []
    }
  },
  mutations: {
    changeMenuVisible(state, { visible, location = {x: 0, y: 0}, detail = [] }) {
      state.menuInfo.visible = visible;
      state.menuInfo.location = location;
      state.menuInfo.detail = detail;
    }
  },
  actions: {
  }
};
