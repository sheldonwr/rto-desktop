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
      return state.appStatus == '1' || state.appStatus == '3' || state.appStatus == '5'
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
    },
    deployUnopenedApp({state}, appId) {
      return new Promise((resolve) => {
        window.SuanpanAPI.appService.get(appId).then(res => {
          // console.log('+++', JSON.parse(res.appInfo.data))
          // return;
          if(!res.success) {
            resolve({
              error: new Error("请求失败")
            })
            return;
          }
          let graph = {};
          if(res.appInfo.data) {
            graph = JSON.parse(res.appInfo.data)
          }
          if(!graph.processes) {
            resolve({
              error: new Error("项目中没有节点")
            })
            return;
          }
          let nodeIds = Object.keys(graph.processes);
          if(nodeIds.length < 1) {
            resolve({
              error: new Error("项目中没有节点")
            })
            return;
          }
          for(let i = 0; i < nodeIds.length; i++) {
            let node = graph.processes[nodeIds[i]];
            if(node && node.metadata && node.metadata.def && node.metadata.def.params) {
              let paramNames = Object.keys(node.metadata.def.params);
              for(let j = 0; j < paramNames.length; j++) {
                let param = node.metadata.def.params[paramNames[j]];
                if((param.required || param.isRequired) && (!param.value)) {
                  resolve({
                    error: new Error(`${node.metadata.label}中的必填参数不能为空！`)
                  })
                  return;
                }
              }
            }
          }
          if(graph.connections) {
            let edges = graph.connections;
            for(let i = 0; i < edges.length; i++) {
              let edge = edges[i];
              if(edge.metadata && edge.metadata.error) {
                resolve({
                  error: new Error(`请检查项目中的连线！`)
                })
                return;
              }
            }
          }
          window.SuanpanAPI.predictService.deploy(appId).then( () => {
            resolve({
              data: null
            })
          })
        }).catch(err => {
          resolve({
            error: err
          })
        })
      });
    }
  },
};
