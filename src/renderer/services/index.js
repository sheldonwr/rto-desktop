
export function send(type, ...args) {
  window.ipcRenderer.send(type, ...args);
}

export function invoke(type, ...args) {
  return window.ipcRenderer.invoke(type, ...args);
}