import { ipcMain, BrowserWindow, app } from "electron";
import { appConfig } from "./config"
import path from 'path'
import fs from "fs";
import { spawn } from "child_process";

ipcMain.on("window-minimize", minimize); 
ipcMain.on("window-maximize", maximize);
ipcMain.on("window-close", closeWindow);
ipcMain.handle('window-getMaximize', async (event, opt) => {
  return BrowserWindow.fromWebContents(event.sender).isMaximized();
})
ipcMain.on("window-modal", createModalWindow);
ipcMain.on("window-algorithm", createAlgorithmWindow);
ipcMain.handle("window-model-manager", openModelManager);

function getMainWindow() {
  let wins = BrowserWindow.getAllWindows();
  let mianWin = null;
  if(wins && wins.length > 0) {
    try {
      mianWin = wins.reduce(function (p, v) {
        return ( p.id < v.id ? p : v );
      });
    } catch (error) {
      console.log(error);
    }
  }
  return mianWin;
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

function createToolWindow(event, tab) {
  let parentWindow = BrowserWindow.fromWebContents(event.sender);
  const child = new BrowserWindow({ 
    parent: parentWindow, 
    modal: true, 
    title: '工具'
  });
  child.setMenuBarVisibility(false);
  const search = `?tab=${tab}&RtoOrigin=${appConfig.RtoOrigin}`;
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    child.loadURL(process.env.WEBPACK_DEV_SERVER_URL + `manage.html${search}`);
  } else {
    child.loadURL(`app://./manage.html${search}`);
  }
}

function createModalWindow(event) {
  createToolWindow(event, 'model')
}

function createAlgorithmWindow(event) {
  createToolWindow(event, 'algo')
}


const AppHome = path.join(app.getAppPath(), '../../');
const SP_DESKTOP_HOME = path.join(AppHome, '../');
const ModelManagerExeName = 'rto-model-manager.exe'
const ModelManagerExeDirName = 'model-manager'
const ModelManagerExePath = path.join(SP_DESKTOP_HOME, `${ModelManagerExeDirName}/${ModelManagerExeName}`);
const ModelManagerExeDir = path.join(SP_DESKTOP_HOME, ModelManagerExeDirName);
function openModelManager() {
  return new Promise(resolve => {
    if (!fs.existsSync(ModelManagerExePath)) {
      resolve({
        success: false,
        msg: '找不到模型管理应用'
      })
    }else {
      try {
        let managerProcess = spawn(ModelManagerExeName, ['--workdir='], {
          detached: true,
          stdio: "ignore",
          cwd: ModelManagerExeDir,
        });
        managerProcess.unref();
        resolve({
          success: true
        })
      } catch (error) {
        resolve({
          success: false,
          msg: '启动模型管理应用失败'
        })
      }
    }
  })
}