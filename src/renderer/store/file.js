import { invoke, gotoPredict } from "../services";
import { createApp, deleteApp, applist, getMetricsList, openFile, saveFile, getApp } from "services/file"
import { uniqueArray, getFileNameAndExt } from "utils/"

export default {
  namespaced: true,
  state: {
    currentApp: {
      id: null,
      name: ''
    },
    recentOpenedApps: [],
  },
  getters: {
    title(state) {
      return state.currentApp.name
    }
  },
  mutations: {
    currentApp(state, val) {
      state.currentApp = val;
      if(val && val.id && val.name) {
        let apps = state.recentOpenedApps;
        if(apps.length >= 10) {
          apps.pop();
        }
        apps.unshift(val);
        this.commit('file/recentOpenedApps', apps);
      }
    },
    recentOpenedApps(state, val) {
      state.recentOpenedApps = uniqueArray(val, item => item.id);
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
      let { name: fileName } = getFileNameAndExt(filePath);
      this.dispatch('showLoading', { opacity: false, msg: '打开中...'});
        openFile(fileName).then( res => {
          gotoPredict(res.appId).then( () => {
            commit("currentApp", {
              id: res.appId,
              name: fileName
            })
            this.dispatch('closeLoading');
          })
        }).catch(err => {
          console.error(err);
          this.dispatch('closeLoading');
          this.dispatch('showMessage', { type: "error", msg: "打开失败" });
        })
    },
    enterApp({ state, commit, dispatch }, app) {
      return gotoPredict(app.id).then( () => {
        commit("currentApp", {
          id: app.id,
          name: app.name
        })
      }); 
    },
    enterRecentApp({ state, commit, dispatch }, app) {
      return getApp(app.id).then(res => {
        return gotoPredict(app.id).then( () => {
          commit("currentApp", {
            id: app.id,
            name: app.name
          })
        }); 
      })
    },
    save({ state, commit, dispatch }) {
      return dispatch('saveDialog', '保存')
    },
    saveAs({ state, dispatch }) {
      return dispatch('saveDialog', '另存为')
    },
    saveDialog({ state, commit, dispatch }, dialogTitle) {
      return invoke("file-save-dialog", dialogTitle).then(filePath => {
        if(!filePath) {
          throw new Error('file not selected')
        }
        return dispatch('exportApp', { id:state.currentApp.id,  filePath})
      }) 
    },
    exportApp({ state, commit, dispatch }, {id, filePath}) {
      this.dispatch('showLoading', { opacity: false, msg: '保存中...'});
      return saveFile(id, filePath).then(res => {
          this.dispatch('closeLoading');
          this.dispatch('showMessage', { type: 'success', msg: '保存成功'})
      }).catch(err => {
        console.error(err);
        this.dispatch('closeLoading');
        this.dispatch('showMessage', { type: 'error', msg: '保存失败'})
        throw err;
      });
    },
    create({ state, commit, dispatch }, name) {
      return createApp(name).then( res => {
        return gotoPredict(res.id).then( () => {
          commit("currentApp", {
            id: res.id,
            name: name
          })
        });
      })
    },
    delete({state, commit, dispatch}, app) {
      return deleteApp(app.id).then( () => {
        commit("currentApp", {
          id: null,
          name: ''
        })
      }).catch( err => {
        console.error(err)
      });
    },
    list({state, commit, dispatch}) {
      return Promise.all([applist(), getMetricsList()]).then(res => {
        let apps = res[0].list || [];
        let runningApps = res[1].items || [];
        let runningAppsMap = {};
        for(let i = 0; i < runningApps.length; i++) {
          runningAppsMap[runningApps[i].appId] = runningApps[i]
        }
        for(let i = 0; i < apps.length; i++) {
          let app = apps[i];
          app.id = '' + app.id;
          app.c_htime = new Date(app.gmt_create);
          if(runningAppsMap[app.id]) {
            app.status = runningAppsMap[app.id].status;
          }
        }
        // sort by create time
        apps.sort((a, b) => b.c_htime - a.c_htime);
        return apps;
      })
    },
  },
};
