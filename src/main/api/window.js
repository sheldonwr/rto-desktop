import { ipcMain, BrowserWindow, app } from "electron";

ipcMain.on("window-minimize", minimize); 
ipcMain.on("window-maximize", maximize);
ipcMain.on("window-close", closeWindow);
ipcMain.handle('window-getMaximize', async (event, opt) => {
  return BrowserWindow.getFocusedWindow().isMaximized();
})

function minimize() {
  BrowserWindow.getFocusedWindow().minimize();
}

function maximize() {
  let win = BrowserWindow.getFocusedWindow();
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
  let win = BrowserWindow.getFocusedWindow();
  win.destroy();
  app.quit();
}