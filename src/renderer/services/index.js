
export function send(type) {
  window.ipcRenderer.send(type);
}

export function invoke(type, ...args) {
  return window.ipcRenderer.invoke(type, ...args);
}