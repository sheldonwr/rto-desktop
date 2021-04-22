import { ipcMain, BrowserWindow, app } from "electron";

ipcMain.on("window-minimize", minimize); 
ipcMain.on("window-maximize", maximize);
ipcMain.on("window-close", closeWindow);
ipcMain.handle('window-getMaximize', async (event, opt) => {
  return BrowserWindow.getFocusedWindow().isMaximized();
})

function getMainWindow() {
  let wins = BrowserWindow.getAllWindows()
  if(wins && wins.length > 0) {
    return wins.reduce(function (p, v) {
      return ( p.id < v.id ? p : v );
    });
  }
  return null;
}

function minimize(event) {
  let win = null
  if(win = getMainWindow()) {
    win.minimize();
  }
  // BrowserWindow.fromId(event.sender.id).minimize();
}

function maximize(event) {
  let win = null
  if(win = getMainWindow()) {
    if (win.isMaximized()) {
      win.restore();
    } else {
      win.maximize();
    }
  }
}

function closeWindow(event) {
  // let win = BrowserWindow.getFocusedWindow();
  // event.preventDefault();
  // win.hide();
  // let win = null
  // if(win = getMainWindow()) {
  //   win.destroy();
  //   app.quit();
  // }
  let win = getMainWindow();
  if(win) {
    win.destroy();
  }
  app.quit();
}