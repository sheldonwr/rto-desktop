import { send, invoke } from "../services"

export default {
  namespaced: true,
  state: {
    lastOpenedPath: null,
    lastAppId: null,
  },
  mutations: {
    lastOpenedPath(state, val) {
      state.lastOpenedPath = val
    },
    lastAppId(state, val) {
      state.lastAppId = val
    }
  },
  actions: {
    startApp({ state, commit, dispatch, rootState }) {
      if(state.lastOpenedPath) {
        loadFile(state.lastOpenedPath)
      }else {  
          window.appService.create('tmp', 0, 'predict').then( res => {
            commit("lastAppId", res.id)
            window.SuanpanAPI.common.goto('predict', res.id)
          }).catch( err => {})
      }
    },
    loadFile({ state }, filePath) {
      invoke(filePath)
    },
    openFile() {
      send('file-open');
    },
    saveFile({ state }) {
      invoke('file-save-dialog').then( filePath => {
        if(filePath) {

        }
      });
    }
  }
};
