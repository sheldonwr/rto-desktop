import { ipcMain, BrowserWindow, app } from "electron";
import path from "path";
import { v4 as uuidv4 } from 'uuid';

ipcMain.on("window-wizard", createWizardWindow);

ipcMain.handle("wizard-app-list", wizardAppList);
ipcMain.handle("wizard-running-list", wizardRunningList);
ipcMain.handle("wizard-app-create", wizardAppCreate);
ipcMain.on("wizard-app-enter", wizardAppEnter);
ipcMain.handle("wizard-app-rename", wizardAppRename);
ipcMain.handle("wizard-app-release", wizardAppRelease);
ipcMain.handle("wizard-app-deploy", wizardAppDeploy);
ipcMain.handle("wizard-app-delete", wizardAppDelete);
ipcMain.handle("wizard-dir-rename", wizardDirRename);
ipcMain.handle("wizard-dir-create", wizardDirCreate);
ipcMain.handle("wizard-dir-delete", wizardDirDelete);
ipcMain.on("wizard-close", wizardClose);

function createWizardWindow(event) {
  let parentWindow = BrowserWindow.fromWebContents(event.sender);
  const child = new BrowserWindow({
    minWidth: 960,
    width: 960,
    minHeight: 600,
    height: 600,
    parent: parentWindow, 
    modal: true, 
    title: '项目列表',
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      preload: path.join(__dirname, "preload.js"),
      webSecurity: false,
      contextIsolation: false,
    },
  });
  child.setMenuBarVisibility(false);
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    child.loadURL(process.env.WEBPACK_DEV_SERVER_URL + `wizard.html`);
  } else {
    child.loadURL(`app://./wizard.html`);
  }
}

function wizardAppList(event) {
  return new Promise( (resolve) => {
    let mainWin = BrowserWindow.fromWebContents(event.sender).getParentWindow();
    let uuid = uuidv4();
    mainWin.webContents.send('wizard-app-list', uuid);
    ipcMain.on(uuid, (event, res) => {
      ipcMain.removeAllListeners(uuid);
      resolve(res);
    });
  })
}

function wizardRunningList(event) {
  return new Promise( (resolve) => {
    let mainWin = BrowserWindow.fromWebContents(event.sender).getParentWindow();
    let uuid = uuidv4();
    mainWin.webContents.send('wizard-running-list', uuid);
    ipcMain.on(uuid, (event, res) => {
      ipcMain.removeAllListeners(uuid);
      resolve(res);
    });
  })
}

function wizardAppEnter(event, app) {
  let chidWin = BrowserWindow.fromWebContents(event.sender);
  let mainWin = chidWin.getParentWindow();
  mainWin.webContents.send('wizard-app-enter', app);
  chidWin.destroy();
  chidWin = null;
}

function wizardAppCreate(event, app) {
  return new Promise( (resolve) => {
    let mainWin = BrowserWindow.fromWebContents(event.sender).getParentWindow();
    let uuid = uuidv4();
    mainWin.webContents.send('wizard-app-create', uuid, app);
    ipcMain.on(uuid, (event, res) => {
      ipcMain.removeAllListeners(uuid);
      resolve(res);
    });
  })
}

function wizardAppRename(event, app) {
  return new Promise( (resolve) => {
    let mainWin = BrowserWindow.fromWebContents(event.sender).getParentWindow();
    let uuid = uuidv4();
    mainWin.webContents.send('wizard-app-rename', uuid, app);
    ipcMain.on(uuid, (event, res) => {
      ipcMain.removeAllListeners(uuid);
      resolve(res);
    });
  })
}

function wizardAppRelease(event, appId) {
  return new Promise( (resolve) => {
    let mainWin = BrowserWindow.fromWebContents(event.sender).getParentWindow();
    let uuid = uuidv4();
    mainWin.webContents.send('wizard-app-release', uuid, appId);
    ipcMain.on(uuid, (event, res) => {
      ipcMain.removeAllListeners(uuid);
      resolve(res);
    });
  })
}

function wizardAppDeploy(event, appId) {
  return new Promise( (resolve) => {
    let mainWin = BrowserWindow.fromWebContents(event.sender).getParentWindow();
    let uuid = uuidv4();
    mainWin.webContents.send('wizard-app-deploy', uuid, appId);
    ipcMain.on(uuid, (event, res) => {
      ipcMain.removeAllListeners(uuid);
      resolve(res);
    });
  })
}

function wizardAppDelete(event, app) {
  return new Promise( (resolve) => {
    let mainWin = BrowserWindow.fromWebContents(event.sender).getParentWindow();
    let uuid = uuidv4();
    mainWin.webContents.send('wizard-app-delete', uuid, app);
    ipcMain.on(uuid, (event, res) => {
      ipcMain.removeAllListeners(uuid);
      resolve(res);
    });
  })
}

function wizardDirRename(event, dir) {
  return new Promise( (resolve) => {
    let mainWin = BrowserWindow.fromWebContents(event.sender).getParentWindow();
    let uuid = uuidv4();
    mainWin.webContents.send('wizard-dir-rename', uuid, dir);
    ipcMain.on(uuid, (event, res) => {
      ipcMain.removeAllListeners(uuid);
      resolve(res);
    });
  })
}

function wizardDirCreate(event, dir) {
  return new Promise( (resolve) => {
    let mainWin = BrowserWindow.fromWebContents(event.sender).getParentWindow();
    let uuid = uuidv4();
    mainWin.webContents.send('wizard-dir-create', uuid, dir);
    ipcMain.on(uuid, (event, res) => {
      ipcMain.removeAllListeners(uuid);
      resolve(res);
    });
  })
}

function wizardDirDelete(event, dirIds, appIds) {
  return new Promise( (resolve) => {
    let mainWin = BrowserWindow.fromWebContents(event.sender).getParentWindow();
    let uuid = uuidv4();
    mainWin.webContents.send('wizard-dir-delete', uuid, dirIds, appIds);
    ipcMain.on(uuid, (event, res) => {
      ipcMain.removeAllListeners(uuid);
      resolve(res);
    });
  })
}

function wizardClose(event) {
  let chidWin = BrowserWindow.fromWebContents(event.sender);
  chidWin.destroy();
  chidWin = null;
}