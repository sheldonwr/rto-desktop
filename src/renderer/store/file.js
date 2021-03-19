import { invoke, gotoPredict } from "../services";
import { createApp, deleteApp, saveSpFile, readSpFile} from "services/file"
import { uniqueArray, getFileNameAndExt } from "utils/"

export default {
  namespaced: true,
  state: {
    currentOpenedPath: null,
    currentAppId: null,
    recentOpenedPaths: [],
  },
  getters: {
    title(state) {
      return state.currentOpenedPath ? state.currentOpenedPath : '';
    }
  },
  mutations: {
    currentOpenedPath(state, val) {
      state.currentOpenedPath = val;
      if(val != null) {
        let paths = state.recentOpenedPaths;
        if(state.recentOpenedPaths.length >= 10) {
          paths.pop();
        }
        paths.unshift(val);
        this.commit('file/recentOpenedPaths', paths);
      }
    },
    currentAppId(state, val) {
      state.currentAppId = val;
    },
    recentOpenedPaths(state, val) {
      state.recentOpenedPaths = uniqueArray(val);
    }
  },
  actions: {
    open({ state, commit, dispatch }) {
      return invoke("file-open").then( filePath => {
        if(!filePath) {
          throw new Error('file not selected')
        }
        return dispatch('openFile', filePath)
      });
    },
    openFile({ state, commit, dispatch }, filePath) {
      if(filePath === state.currentOpenedPath) {
        return
      }
      return readSpFile(filePath).then( appId => {
        return gotoPredict(appId).then( () => {
          commit("currentAppId", appId);
          commit("currentOpenedPath", filePath);
        });
      })
    },
    save({ state, commit, dispatch }) {
      this.dispatch('showMessage', { type: 'success', msg: '保存成功'})
    },
    saveAs({ state, dispatch }) {
      return invoke("file-save-dialog", '另存为').then(filePath => {
        if(!filePath) {
          throw new Error('file not selected')
        }
        return saveSpFile(state.currentAppId, filePath).then( () => {
          this.dispatch('showMessage', { type: 'success', msg: '另存为成功'})
        });
      })
    },
    create({ state, commit, dispatch }) {
      return invoke("file-save-dialog", '新建').then( filePath => {
        if(!filePath) {
          throw new Error('not select saved path')
        }
        let { name } = getFileNameAndExt(filePath);
        return createApp(name).then( res => {
          return saveSpFile(res.id, filePath).then( () => {
            return gotoPredict(res.id).then( () => {
              commit("currentAppId", res.id);
              commit("currentOpenedPath", filePath);
            });
          });
        }).catch( err => {
          console.error(err);
        });
      })
    },
    delete({state, commit, dispatch}, showLoading=false) {
      if(showLoading) {
        this.dispatch('showLoading',{ opacity: false, msg: '关闭中...'});
      }
      return deleteApp(state.currentAppId).then( () => {
        commit("currentAppId", null);
        if(showLoading) {
          this.dispatch('closeLoading');
        }
      }).catch( err => {
        console.error(err)
        if(showLoading) {
          this.dispatch('closeLoading');
        }
      });
    }
  },
};
