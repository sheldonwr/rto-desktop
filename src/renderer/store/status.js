export default {
  namespaced: true,
  state: {
    // "AppRunning": "1", "AppStopped": "2", "AppSuccess": "3", "AppFailed" : "4", 
    // "AppStarting": "5", "AppStopping": "6", "AppDead": "7", "AppCron": "8", 
    // "AppWaiting": "9", "AppUnknown": "0"
    appStatus: '0',
  },
  getters: {
    deploySuccess(state) {
      return state.appStatus == '1' || state.appStatus == '3'
    },
    statusDone(state) {
      return state.appStatus != '1' && state.appStatus != '5' && state.appStatus != '6' && state.appStatus != '9'
    }
  },
  mutations: {
    appStatus(state, val) {
      state.appStatus = val;
    }
  },
  actions: {
    getStatus({ state, commit, rootState }) {
      if(rootState.file.currentAppId) {
        return window.SuanpanAPI.predictService.getNetworkStatus(rootState.file.currentAppId).then( res => {
          if(res.map && (res.map.status != null)) {
            commit('appStatus', res.map.status)
          }else {
            commit('appStatus', '0')
          }
          return state.appStatus;
        })
      }
    },
    deploy({ state, commit, dispatch, rootState }) {
      return window.SuanpanAPI.predictService.deploy(rootState.file.currentAppId).then( res => {
        this.dispatch('showNotify', {type: 'info', message: '部署中...'});
      })
    },
    release({ state, commit, dispatch, rootState }) {
      return window.SuanpanAPI.predictService.release(rootState.file.currentAppId).then( res => {
        this.dispatch('showNotify', {type: 'info', message: '释放中...'});
      })
    }
  },
};
