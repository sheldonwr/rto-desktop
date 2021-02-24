
export function send(type) {
  window.ipcRenderer.send(type);
}

export function invoke(type) {
  return window.ipcRenderer.invoke('window-getMaximize');
}