import { invoke, gotoPredict } from "../services";
import { createApp, deleteApp, applist, getMetricsList, openFile, saveFile, getApp, getUserConfig, saveUserConfig, changeAppName } from "services/file"
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
    recentOpenedAppsDelete(state, id) {
      let idx = state.recentOpenedApps.findIndex( item => item.id == id);
      if(idx > -1) {
        state.recentOpenedApps.splice(idx, 1);
      }
    }
  },
  actions: {
    gotoCurrentPredict({state}) {
      return gotoPredict(state.currentApp.id);
    },
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
        openFile(filePath, fileName).then( res => {
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
      return invoke("file-save-dialog", dialogTitle, state.currentApp.name).then(filePath => {
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
    create({ state, commit, dispatch }, {name, dir}) {
      return createApp(name, dir).then( res => {
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
        if(state.currentApp.id == app.id) {
          commit("currentApp", {
            id: null,
            name: ''
          })
          this.commit("view/wizardClosable", false);
        }
        commit('recentOpenedAppsDelete', app.id);
      }).catch( err => {
        console.error(err)
        throw err
      });
    },
    runningList() {
      return getMetricsList().then( res => {
        return res.items || []
      })
    },
    list({state, commit, dispatch}) {
      return Promise.all([applist(), getMetricsList(), getUserConfig()]).then(res => {
        let apps = res[0].list || [];
        // traverse status
        let runningApps = res[1].items || [];
        let runningAppsMap = {};
        for(let i = 0; i < runningApps.length; i++) {
          runningAppsMap[runningApps[i].appId] = runningApps[i]
        }
        // traverse predict dir
        let predictDirs = res[2].predictDirs;
        let predictQueue = [];
        let predictDirsMap = {};
        for(let i = 0; i < predictDirs.length; i++) {
          predictQueue.push(predictDirs[i])
          while(true) {
            let dir = predictQueue.shift();
            dir.key = `dir-${dir.id}`;
            dir.title = dir.label;
            dir.scopedSlots = {
              icon: 'dir'
            }
            predictDirsMap[dir.id] = dir;
            if(dir.children && dir.children.length > 0) {
              for(let j = 0; j < dir.children.length; j++) {
                predictQueue.push(dir.children[j]);
              }
            }
            if(predictQueue.length === 0) {
              break;
            }
          }
        }
        // put apps into dir
        for(let i = 0; i < apps.length; i++) {
          let app = apps[i];
          app.id = '' + app.id;
          app.key = `app-${app.id}`;
          app.title = app.name;
          app.isLeaf = true;
          app.scopedSlots = {
            icon: 'app',
            title: 'appTitle'
          }
          if(runningAppsMap[app.id]) {
            app.status = runningAppsMap[app.id].status;
          }
          let dir = predictDirsMap[app.dir];
          if(!dir) {
            continue;
          }
          if(!dir.children) {
            dir.children = []
          }
          dir.children.push(app);
        }
        return predictDirs;
      })
    },
    dirList() {
      return getUserConfig().then( res => {
        let predictDirs = res.predictDirs;
        return predictDirs[1]
      })
    },
    createDir({}, {name, dir: dirId}) {
      return getUserConfig().then( res => {
        // traverse predict dir
        let predictDirs = res.predictDirs || [];
        let predictQueue = [];
        let maxId = 0;
        let parentDir = null;
        for(let i = 0; i < predictDirs.length; i++) {
          predictQueue.push(predictDirs[i])
          while(true) {
            let dir = predictQueue.shift();
            if(parseInt(dir.id) > maxId) {
              maxId = parseInt(dir.id)
            }
            if(dirId == dir.id) {
              parentDir = dir;
            }
            if(dir.children && dir.children.length > 0) {
              for(let j = 0; j < dir.children.length; j++) {
                predictQueue.push(dir.children[j]);
              }
            }
            if(predictQueue.length === 0) {
              break;
            }
          }
        }
        if(parentDir == null) {
          if(res.predictDirs == null) {
            res.predictDirs = [{
              children: [],
              folder: true,
              id: maxId + 1,
              label: name
            }]
          }
        }else {
          if(!parentDir.children) {
            parentDir.children = []
          }
          parentDir.children.push({
            children: [],
            folder: true,
            id: maxId + 1,
            label: name
          })
        }
        return saveUserConfig(res);
      })
    },
    appChangeName({}, {id, name}) {
      return changeAppName(id, name)
    },
    dirChangName({}, {id, name}) {
      return getUserConfig().then( res => {
        // traverse predict dir
        let predictDirs = res.predictDirs;
        let predictQueue = [];
        let maxId = 0;
        let parentDir = null;
        for(let i = 0; i < predictDirs.length; i++) {
          predictQueue.push(predictDirs[i])
          while(true) {
            let dir = predictQueue.shift();
            if(parseInt(dir.id) > maxId) {
              maxId = parseInt(dir.id)
            }
            if(id == dir.id) {
              parentDir = dir;
              break;
            }
            if(dir.children && dir.children.length > 0) {
              for(let j = 0; j < dir.children.length; j++) {
                predictQueue.push(dir.children[j]);
              }
            }
            if(predictQueue.length === 0) {
              break;
            }
          }
        }
        if(parentDir == null) {
          return;
        }
        parentDir.label = name;
        return saveUserConfig(res);
      })
    },
    deleteDirs({}, dirIds=[]) {
      return getUserConfig().then( res => {
        // traverse predict dir
        let predictDirs = res.predictDirs;
        let predictQueue = [];
        let dirIdsSet = new Set(dirIds);
        let predictDirLen = predictDirs.length
        for(let i = 0; i < predictDirLen; i++) {
          let predictDir = predictDirs[i];
          if(predictDir == null) {
            continue;
          }
          if(dirIdsSet.has(''+predictDir.id)) {
            predictDirs.splice(i, 1);
            continue;
          }
          predictQueue.push(predictDir)
          while(true) {
            let dir = predictQueue.shift();
            if(dir.children && dir.children.length > 0) {
              let len = dir.children.length;
              for(let j = 0; j < len; j++) {
                let child = dir.children[j];
                if(child == null) {
                  continue;
                }
                if(dirIdsSet.has(''+child.id)) {
                  dir.children.splice(j, 1);
                  continue;
                }
                predictQueue.push(child);
              }
            }
            if(predictQueue.length === 0) {
              break;
            }
          }
        }
        return saveUserConfig(res);
      })
    }
  },
};
