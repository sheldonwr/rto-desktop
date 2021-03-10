export default {
  namespaced: true,
  state: {
    // "AppRunning": "1", "AppStopped": "2", "AppSuccess": "3", "AppFailed" : "4", 
    // "AppStarting": "5", "AppStopping": "6", "AppDead": "7", "AppCron": "8", 
    // "AppWaiting": "9", "AppUnknown": "0"
    appStatus: '0',
  },
  mutations: {},
  actions: {
    getStatus({ state, commit, rootState }) {
      if(rootState.file.currentAppId) {
        window.SuanpanAPI.predictService.getNetworkStatus(rootState.file.currentAppId).then( res => {
          
        })
      }
    }
  },
};
