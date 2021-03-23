import { invoke, gotoPredict } from "../services";
import { createApp, deleteApp, saveSpFile, readSpFile, applist, copyApp, getMetricsList, getApp } from "services/file"
import { uniqueArray, getFileNameAndExt } from "utils/"

let cachedAppIds = []

export default {
  namespaced: true,
  state: {
    currentOpenedPath: null,
    currentAppId: null,
    currentAppName: '',
    recentOpenedPaths: [],
  },
  getters: {
    title(state) {
      if(state.currentOpenedPath) {
        let { name } = getFileNameAndExt(state.currentOpenedPath);
        return name
      }else {
        return state.currentAppName;
      }
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
    },
    currentAppName(state, val) {
      state.currentAppName = val;
    },
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
        if(cachedAppIds.includes(appId)) {
          commit("currentOpenedPath", filePath);
          return dispatch('openApp', appId);
        }else {
          let { name } = getFileNameAndExt(filePath);
          return dispatch('get', appId).then( () => {
            return copyApp(appId, name).then(res => {
              return invoke('file-save-ids', res.id).then(ids => {
                cachedAppIds = ids;
                commit("currentOpenedPath", filePath);
                return dispatch('openApp', res.id);
              })
            })
          })
        }
      })
    },
    openApp({ state, commit, dispatch }, appId) {
      return gotoPredict(appId).then( () => {
        commit("currentAppId", appId);
      }); 
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
          return saveSpFile(res.id, filePath).then( ids => {
            return invoke('file-save-ids', res.id).then(ids => {
              cachedAppIds = ids;
              return gotoPredict(res.id).then( () => {
                commit("currentAppId", res.id);
                commit("currentOpenedPath", filePath);
              });
            })
          });
        }).catch( err => {
          console.error(err);
        });
      })
    },
    delete({state, commit, dispatch}, id) {
      return deleteApp(id).then( () => {
        commit("currentAppId", null);
        commit("currentOpenedPath", '');
        commit("currentAppName", '');
        return invoke('file-delete-ids', id);
      }).catch( err => {
        console.error(err)
      });
    },
    get({}, id) {
      return getApp(id);
    },
    list({state, commit, dispatch}) {
      // applist()
      return Promise.all([applist(), getMetricsList(),invoke('file-read-ids')]).then(res => {
        let apps = res[0].list || [];
        let runningApps = res[1].items || [];
        let runningAppsMap = {};
        for(let i = 0; i < runningApps.length; i++) {
          runningAppsMap[runningApps[i].appId] = runningApps[i]
        }
        let savedIds = res[2];
        cachedAppIds = savedIds;
        let saveIdsSet = new Set(savedIds);
        let filteredApps = [];
        for(let i = 0; i < apps.length; i++) {
          if(saveIdsSet.has(''+apps[i].id)) {
            let app = apps[i];
            app.id = '' + app.id;
            if(runningAppsMap[app.id]) {
              app.status = runningAppsMap[app.id].status;
            }
            filteredApps.push(app)
          }
        }
        return filteredApps;
      })
    },
  },
};
