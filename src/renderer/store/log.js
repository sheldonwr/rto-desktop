export default {
  namespaced: true,
  state: {
    allLogs: []
  },
  mutations: {
    allLogs(state, val) {
      state.allLogs = val;
    },
  },
  actions: {
    connect() {
      window.SuanpanAPI.componentLogService.connect()
    },
    query({ rootState }, options) {
      window.SuanpanAPI.componentLogService.query({
        app: rootState.file.currentAppId,
        limit: 500
      })
    }
  }
};
