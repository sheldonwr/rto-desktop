export default {
  namespaced: true,
  state: {
    // "AppRunning": "1", "AppStopped": "2", "AppSuccess": "3", "AppFailed" : "4", 
    // "AppStarting": "5", "AppStopping": "6", "AppDead": "7", "AppCron": "8", 
    // "AppWaiting": "9", "AppUnknown": "0"
    appStatus: '0',
  },
  getters: {
    isRunning(state) {
      return state.appStatus == '1' || state.appStatus == '3'
    },
    isLogging(state) {
      return state.appStatus == '1' || state.appStatus == '3' || state.appStatus == '5' || state.appStatus == '6'
    },
  },
  mutations: {
    appStatus(state, val) {
      state.appStatus = val;
    }
  },
  actions: {
    getStatus({ state, commit, rootState }) {
      if(rootState.file.currentApp.id) {
        return window.SuanpanAPI.predictService.getNetworkStatus(rootState.file.currentApp.id).then( res => {
          if(res.map && (res.map.status != null)) {
            commit('appStatus', res.map.status)
          }else {
            commit('appStatus', '0')
          }
          return state.appStatus;
        })
      }
    },
    deploy({state}, id) {
      return window.SuanpanAPI.predictService.deploy(id)
    },
    release({state}, id) {
      return window.SuanpanAPI.predictService.release(id)
    },
  },
};
