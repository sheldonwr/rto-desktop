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
    },
  },
  actions: {
    getStatus({ state, commit, rootState }, appId) {
      if(!appId && rootState.file.currentApp.id) {
        appId = rootState.file.currentApp.id;
      }
      if(appId) {
        return window.SuanpanAPI.predictService.getNetworkStatus(appId).then( res => {
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
    deployValidation() {
      return new Promise((resolve, reject) => {
        window.SuanpanAPI.rootScope.doSave().then(() => {
          const validation = window.SuanpanAPI.nodeService.onValidated();
          if (validation && validation.status === 'error') {
            reject(new Error(validation.message))
          }else {
            resolve();
          }
        }).catch(e => {
          if(e.msg) {
            e.message = e.msg;
          }
          if(e.message === '网络错误') {
            e.message = '请检查网络，稍后重试';
          }
          reject(e);
        })
      })
    }
  },
};
