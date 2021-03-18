import { ipcMain, BrowserWindow, app } from "electron";

ipcMain.on("window-minimize", minimize); 
ipcMain.on("window-maximize", maximize);
ipcMain.on("window-close", closeWindow);
ipcMain.handle('window-getMaximize', async (event, opt) => {
  return BrowserWindow.getFocusedWindow().isMaximized();
})

function minimize(event) {
  BrowserWindow.fromId(event.sender.id).minimize();
}

function maximize(event) {
  let win = BrowserWindow.fromId(event.sender.id);
  if (win.isMaximized()) {
    win.restore();
  } else {
    win.maximize();
  }
}

function closeWindow(event) {
  // let win = BrowserWindow.getFocusedWindow();
  // event.preventDefault();
  // win.hide();
  let win = BrowserWindow.fromId(event.sender.id);
  win.destroy();
  app.quit();
}