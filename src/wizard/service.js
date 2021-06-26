export function send(type, ...args) {
  window.ipcRenderer.send(type, ...args);
}

export function invoke(type, ...args) {
  return window.ipcRenderer.invoke(type, ...args);
}
export function getApplist() {
  return invoke('wizard-app-list')
}

export function getRunningList() {
  return invoke('wizard-running-list')
}

export function createApp(app) {
  return invoke('wizard-app-create', app)
}

export function enterApp(app) {
  return send('wizard-app-enter', app)
}

export function renameApp(app) {
  return invoke('wizard-app-rename', app)
}

export function releaseApp(appId) {
  return send('wizard-app-release', appId)
}

export function deployApp(appId) {
  return send('wizard-app-deploy', appId)
}

export function deleteApp(app) {
  return invoke('wizard-app-delete', app)
}

export function renameDir(dir) {
  return invoke('wizard-dir-rename', dir)
}

export function createDir(dir) {
  return invoke('wizard-dir-create', dir)
}

export function deleteDir(dirIds, appIds) {
  return invoke('wizard-dir-delete', dirIds, appIds)
}

export function close() {
  return send('wizard-close')
}