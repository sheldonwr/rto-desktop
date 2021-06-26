import { send } from "services/"
import { rightClickMenuInit } from './rightClickMenu'

export function listernersInit(store, Vue) {
  rightClickMenuInit(store, Vue)

  window.addEventListener('load', () => {
    store.dispatch('window/createWizardWindow');
  })

  window.ipcRenderer.on('wizard-app-list', function (evt, channel) {
    store
    .dispatch("file/list")
    .then((list) => {
      send(channel, {
        error: null,
        data: list
      })
    })
    .catch((err) => {
      send(channel, {
        error: err,
        data: []
      })
    });
  });

  window.ipcRenderer.on('wizard-running-list', function(evt, channel) {
    store
    .dispatch("file/runningList")
    .then((list) => {
      send(channel, {
        error: null,
        data: list
      })
    })
    .catch((err) => {
      send(channel, {
        error: err,
        data: []
      })
    });
  });

  window.ipcRenderer.on('wizard-app-enter', function(evt, app) {
    store.dispatch("file/enterApp", app);
    store.commit('view/coverVisible', false);
  });

  window.ipcRenderer.on('wizard-app-create', function(evt, channel, app) {
    store.dispatch("file/create", app).then( res => {
      send(channel, {
        error: null,
        data: res
      })
    }).catch((err) => {
      send(channel, {
        error: err,
        data: null
      })
    });
  })
  
  window.ipcRenderer.on('wizard-app-rename', function(evt, channel, app) {
    store.dispatch("file/appChangeName", app).then( res => {
      send(channel, {
        error: null,
        data: res
      })
    }).catch((err) => {
      send(channel, {
        error: err,
        data: null
      })
    });
  })

  window.ipcRenderer.on('wizard-app-release', function(evt, appId) {
    store.dispatch("status/release", appId);
  });

  window.ipcRenderer.on('wizard-app-deploy', function(evt, appId) {
    store.dispatch("status/deploy", appId);
  });

  window.ipcRenderer.on('wizard-app-delete', function(evt, channel, app) {
    store.dispatch("file/delete", app).then( res => {
      send(channel, {
        error: null,
        data: res
      })
    }).catch((err) => {
      send(channel, {
        error: err,
        data: null
      })
    });
  })

  window.ipcRenderer.on('wizard-dir-rename', function(evt, channel, dir) {
    store.dispatch("file/dirChangName", dir).then( res => {
      send(channel, {
        error: null,
        data: res.data
      })
    }).catch((err) => {
      send(channel, {
        error: err,
        data: null
      })
    });
  })

  window.ipcRenderer.on('wizard-dir-create', function(evt, channel, dir) {
    store.dispatch("file/createDir", dir).then( res => {
      send(channel, {
        error: null,
        data: res.data
      })
    }).catch((err) => {
      send(channel, {
        error: err,
        data: null
      })
    });
  })

  window.ipcRenderer.on('wizard-dir-delete', function(evt, channel, dirIds=[], appIds=[]) {
    if(appIds.length === 0) {
      store.dispatch('file/deleteDirs', dirIds).then( () => {
        send(channel, {
          error: null,
          data: null
        })
      }).catch((err) => {
        send(channel, {
          error: err,
          data: null
        })
      });
    }else {
      let appCount = 0;
      for(let i = 0; i < appIds.length; i++) {
        store.dispatch("file/delete", {id:appIds[i]}).then( res => {
          appCount++;
          if(appCount === appIds.length) {
            store.dispatch('file/deleteDirs', dirIds).then( () => {
              send(channel, {
                error: null,
                data: null
              })
            })
          }
        }).catch((err) => {
          send(channel, {
            error: err,
            data: null
          })
        });
      }
    }
  })
}