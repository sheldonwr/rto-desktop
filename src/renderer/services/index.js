
export function send(type, ...args) {
  window.ipcRenderer.send(type, ...args);
}

export function invoke(type, ...args) {
  return window.ipcRenderer.invoke(type, ...args);
}

export function gotoPredict(appId) {
  return new Promise((resolve, reject) => {
    let id = window.SuanpanAPI.eventService.on('sp:transition:success', () => {
      window.SuanpanAPI.eventService.off(id)
      resolve();
    })
    window.SuanpanAPI.common.goto("predict", appId);
  })
}