export default {
  namespaced: true,
  state: {
    drawerVisible: false,
    activeTab: ''
  },
  mutations: {
    changeDrawerVisible(state, visible) {
      state.drawerVisible = visible;
    },
    changeActiveTab(state, type) {
      state.activeTab = type;
    }
  },
  actions: {
    showDrawer(context) {
      context.commit('changeDrawerVisible', true);
    },
    closeDrawer(context) {
      context.commit('changeDrawerVisible', false);
    },
    selectActiveTab(context, type) {
      context.commit('changeActiveTab', type);
    }
  }
};
