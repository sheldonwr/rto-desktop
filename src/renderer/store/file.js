import { invoke } from "../services";
import { createEmpty, openFile, saveFile, deleteApp} from "services/file"
import { uniqueArray } from "utils/"

export default {
  namespaced: true,
  state: {
    currentOpenedPath: null,
    currentAppId: null,
    recentOpenedPaths: [],
  },
  getters: {
    title(state) {
      return state.currentOpenedPath ? state.currentOpenedPath : '临时文件';
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
    startApp({ state, commit, dispatch }) {
      this.dispatch('showLoading');
      window.addEventListener('load', () => {
        let firstId = window.SuanpanAPI.eventService.on('sp:transition:success', (event, data) => {
          window.SuanpanAPI.eventService.off(firstId)
          if (state.currentOpenedPath) {
            // open last file
            openFile(state.currentOpenedPath).then( res => {
              commit("currentAppId", res.appId);
              let secondId = window.SuanpanAPI.eventService.on('sp:transition:success', () => {
                window.SuanpanAPI.eventService.off(secondId)
                this.dispatch('closeLoading');
              });
              window.SuanpanAPI.common.goto("predict", res.appId);
            }).catch(err => {
              console.error(err);
              this.dispatch('closeLoading');
              this.dispatch('showNotify', `打开文件${state.currentOpenedPath}失败`);
            })
          } else {
            // create an empty app
            createEmpty().then(res => {
              commit("currentAppId", res.id);
              commit("currentOpenedPath", null);
              let secondId = window.SuanpanAPI.eventService.on('sp:transition:success', () => {
                window.SuanpanAPI.eventService.off(secondId)
                this.dispatch('closeLoading');
              });
              window.SuanpanAPI.common.goto("predict", res.id);
            }).catch((err) => {
              this.dispatch('closeLoading');
              console.error(err);
            });
          }
        });
      })
    },
    openDialog({ state, commit, dispatch }, fullpath) {
      if(fullpath && (fullpath === state.currentOpenedPath)) {
        return;
      }
      dispatch('messageDialog').then( id => {
        if(id === 0) {
          // save
          dispatch('save', true).then(() => {
            dispatch('importDialog', fullpath)
          })
        }else if(id === 1) {
          // do not save
          dispatch('importDialog', fullpath)
        }else if(id === 2) {
          // cancel
        }
      })
    },
    importDialog({ state, commit, dispatch }, fullpath) {
      if(fullpath){
        dispatch('openFile', fullpath)
      }else {
        invoke("file-open").then( filePath => {
          if(filePath) {
            dispatch('openFile', filePath)
          }
        });
      }
    },
    openFile({ state, commit, dispatch }, filePath) {
      this.dispatch('showLoading', { opacity: false, msg: '打开中...'});
        openFile(filePath).then( res => {
          commit("currentAppId", res.appId);
          commit("currentOpenedPath", filePath);
          window.SuanpanAPI.common.goto("predict", res.appId);
          this.dispatch('closeLoading');
        }).catch(err => {
          console.error(err);
          this.dispatch('closeLoading');
          this.dispatch('showNotify', `打开文件${filePath}失败`);
        })
    },
    saveDialog({ state, commit }, {savePath=true, isDelete=false}={}) {
      return invoke("file-save-dialog").then(filePath => {
        if(filePath) {
          this.dispatch('showLoading', { opacity: false, msg: '保存中...'});
          return saveFile(state.currentAppId, filePath).then(res => {
            if(savePath) {
              commit("currentOpenedPath", filePath);
            }
            if(isDelete) {
              return deleteApp(state.currentAppId).then( () => {
                commit("currentAppId", null);
                this.dispatch('closeLoading');
                this.dispatch('showNotify', {type: 'success', message: '保存成功'});
              })
            }else {
              this.dispatch('closeLoading');
              this.dispatch('showNotify', {type: 'success', message: '保存成功'});
            }
          }).catch(err => {
            console.error(err);
            this.dispatch('closeLoading');
            this.dispatch('showNotify', '保存失败');
            throw err;
          });
        }
      });  
    },
    save({ state, commit, dispatch }, isDelete=false) {
      if(state.currentOpenedPath) {
        this.dispatch('showLoading', { opacity: false, msg: '保存中...'});
        return saveFile(state.currentAppId, state.currentOpenedPath).then(res => {
          if(isDelete) {
            return deleteApp(state.currentAppId).then( () => {
              commit("currentAppId", null);
              this.dispatch('closeLoading');
              this.dispatch('showNotify', {type: 'success', message: '保存成功'});
            })
          }else {
            this.dispatch('closeLoading');
            this.dispatch('showNotify', {type: 'success', message: '保存成功'});
          }
        }).catch(err => {
          console.error(err);
          this.dispatch('closeLoading');
          this.dispatch('showNotify', '保存失败');
          throw err;
        });
      }else {
        return dispatch('saveDialog', { savePath:true, isDelete: isDelete });
      }
    },
    saveAs({ dispatch }) {
      dispatch('saveDialog', { savePath:false });
    },
    messageDialog() {
      return invoke("file-message-dialog")
    },
    create({ state, commit, dispatch }) {
      dispatch('messageDialog').then( id => {
        if(id === 0) {
          // save
          dispatch('save', true).then(() => {
            return createEmpty().then(res => {
              commit("currentAppId", res.id);
              commit("currentOpenedPath", null);
              window.SuanpanAPI.common.goto("predict", res.id);
            }).catch((err) => {
              console.error(err);
            });
          })
        }else if(id === 1) {
          // do not save
          this.dispatch('showLoading', { opacity: false});
          return createEmpty().then(res => {
            commit("currentAppId", res.id);
            commit("currentOpenedPath", null);
            window.SuanpanAPI.common.goto("predict", res.id);
            this.dispatch('closeLoading');
          }).catch((err) => {
            console.error(err);
            this.dispatch('closeLoading');
          });
        }else if(id === 2) {
          // cancel
        }
      })
    },
  },
};
