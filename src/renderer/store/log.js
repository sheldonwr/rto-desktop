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
      return window.SuanpanAPI.componentLogService.connect()
    },
    register() {
      window.SuanpanAPI.componentLogService.registerLogProcessor((res) => {
        console.log('++register++', res)
      })
    },
    query({ rootState }) {
      window.SuanpanAPI.componentLogService.query().then( res => {
        console.log('++query++', res)
      })
    }
  }
};
