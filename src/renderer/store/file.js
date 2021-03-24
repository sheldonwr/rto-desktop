import { invoke, gotoPredict } from "../services";
import { createApp, deleteApp, saveSpFile, readSpFile, applist, copyApp, getMetricsList, getApp } from "services/file"
import { uniqueArray, getFileNameAndExt } from "utils/"

let cachedAppIds = []

export default {
  namespaced: true,
  state: {
    currentOpenedPath: '',
    currentAppId: null,
    recentOpenedPaths: [],
  },
  getters: {
    title(state) {
      return state.currentOpenedPath
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
        let idx = cachedAppIds.findIndex(item => item.id == appId)
        if(idx > -1) {
          return dispatch('openApp', {id:appId, path: filePath});
        }else {
          let { name } = getFileNameAndExt(filePath);
          return copyApp(appId, name).then(res => {
            return invoke('file-save-ids', {id:res.id, path: filePath}).then(ids => {
              cachedAppIds = ids;
              commit("currentOpenedPath", filePath);
              return dispatch('openApp', {id:res.id, path: filePath});
            })
          })
        }
      })
    },
    openApp({ state, commit, dispatch }, {id:appId, path}) {
      return gotoPredict(appId).then( () => {
        commit("currentAppId", appId);
        commit("currentOpenedPath", path);
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
        let { name } = getFileNameAndExt(filePath);
        return copyApp(state.currentAppId, name).then(res => {
          return invoke('file-save-ids', {id:res.id, path: filePath}).then(ids => {
            cachedAppIds = ids;
            return saveSpFile(state.currentAppId, filePath).then( () => {
              this.dispatch('showMessage', { type: 'success', msg: '另存为成功'})
            });
          })
        })
        
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
            return invoke('file-save-ids', {id:res.id, path:filePath}).then(ids => {
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
        let path = state.currentOpenedPath;
        commit("currentAppId", null);
        commit("currentOpenedPath", '');
        return invoke('file-delete-ids', {id, path});
      }).catch( err => {
        console.error(err)
      });
    },
    get({}, id) {
      return getApp(id);
    },
    list({state, commit, dispatch}) {
      // applist()
      return Promise.all([applist(), getMetricsList(), invoke('file-read-ids')]).then(res => {
        let apps = res[0].list || [];
        let runningApps = res[1].items || [];
        let runningAppsMap = {};
        for(let i = 0; i < runningApps.length; i++) {
          runningAppsMap[runningApps[i].appId] = runningApps[i]
        }
        cachedAppIds = res[2];
        let saveIdsSet = {};
        for(let i = 0; i < cachedAppIds.length; i++) {
          saveIdsSet[cachedAppIds[i].id] = cachedAppIds[i]
        }
        let filteredApps = [];
        for(let i = 0; i < apps.length; i++) {
          if(saveIdsSet[apps[i].id]) {
            let app = apps[i];
            app.id = '' + app.id;
            app.c_htime = new Date(app.gmt_create);
            app.path = saveIdsSet[apps[i].id].path;
            if(runningAppsMap[app.id]) {
              app.status = runningAppsMap[app.id].status;
            }
            filteredApps.push(app)
          }
        }
        // sort by create time
        filteredApps.sort((a, b) => b.c_htime - a.c_htime);
        return filteredApps;
      })
    },
  },
};
