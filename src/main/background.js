"use strict";

import "./api/";
import { app, protocol, BrowserWindow, Menu, MenuItem, Tray, ipcMain } from "electron";
import path from "path";
import { appInjectDev, appInjectProd, interceptUrl } from "./appInject";
import * as mainconfigs from "./mainconfig";
import { launchSuanpanServer, checkServerSuccess, killSuanpanServer, getWebOrigin, checkRedis, checkMinio, getVersion } from "./suanpan";
import logger from './log'
import { getAppConfig } from './api/config'

const isDevelopment = process.env.NODE_ENV !== "production";

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);

let win, tray, loadingWin;

async function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1400,
    minWidth: 1024,
    height: 900,
    minHeight: 600,
    titleBarStyle: "hidden",
    frame: false,
    show: true,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: false,
      preload: path.join(__dirname, "preload.js"),
      webSecurity: false,
    },
  });
  win.maximize();
  if(loadingWin) {
    loadingWin.destroy();
    loadingWin = null;
  }
  if (process.env.WEBPACK_DEV_SERVER_URL && !process.env.IS_TEST) {
    win.webContents.openDevTools();
  }

  // https://www.electronjs.org/docs/api/window-open
  win.webContents.on(
    "new-window",
    async (event, url, frameName, disposition, options, additionalFeatures) => {
      event.preventDefault();
      let urlObj = new URL(url);
      let urlId = url;
      if(urlObj.pathname.startsWith('/run/log/')) {
        // oss log
        urlId = `${urlObj.origin}/run/log/`;
      }else if(urlObj.pathname.startsWith('/dashboard')) {
        // dashboard
        urlId = `${urlObj.origin}/dashboard`;
      }
      let newWin = getNewWindow(urlId);
      if(newWin) {
        event.newGuest = newWin;
        newWin.focus();
      }else {
        Object.assign(options, {
          titleBarStyle: "default",
          frame: true,
        });
        event.newGuest = new BrowserWindow({ 
          ...options, 
          width: 1024, 
          height:600,
       });
        event.newGuest._id = urlId;
        // Menu.setApplicationMenu(null)
        event.newGuest.setMenuBarVisibility(false);
        // event.newGuest.removeMenu();
        event.newGuest.loadURL(interceptUrl(url));
  
        event.newGuest.webContents.on("new-window", async (event, url, frameName, disposition, options, additionalFeatures) => {
          event.preventDefault();
          event.newGuest = new BrowserWindow({ 
            ...options,
            y: '50%', 
            x: '50%'
          });
          event.newGuest.loadURL(url);
        })
      }
      event.newGuest.loadURL(url);
    }
  );

  function getNewWindow(id) {
    let allWins = BrowserWindow.getAllWindows();
    for(let i = 0; i < allWins.length; i++) {
      if(allWins[i]._id == id) {
        return allWins[i];
      }
    }
    return null;
  }
  

  // win.on('close', function(e){
  //   e.preventDefault();
  //   win.webContents.send('window-close');
  // });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
  } else {
    // createProtocol('app')
    // Load the index.html when not in development
    win.loadURL("app://./index.html");
    //https://github.com/electron/electron/issues/14978
    win.webContents.on("did-fail-load", () => {
      win.loadURL("app://./index.html");
    });
  }
}

function createLoadingWindow() {
  return new Promise(resolve => {
    loadingWin = new BrowserWindow({
      width: 400,
      height: 300,
      frame: false,
      resizable: false,
      show: false,
      // alwaysOnTop: true,
      webPreferences: {
        // Use pluginOptions.nodeIntegration, leave this alone
        // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
        nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
        webSecurity: false,
        contextIsolation: false,
        preload: path.join(__dirname, "preload.js"),
      },
    });
    loadingWin.once("ready-to-show", () => {
      resolve();
      loadingWin.show();
    });
    if (process.env.WEBPACK_DEV_SERVER_URL) {
      loadingWin.loadURL(process.env.WEBPACK_DEV_SERVER_URL + 'loading.html');
    } else {
      loadingWin.loadURL(`app://./loading.html`);
    }
  })
}

function createTray() {
  // https://www.electronjs.org/docs/api/native-image#high-resolution-image
  tray = new Tray(path.join(mainconfigs.assetsPath, "logo.png"));
  tray.on("click", () => {
    if (win === null) {
      createWindow();
    } else {
      win.show();
    }
  });
  if (mainconfigs.platform == "win") {
    const contextMenu = Menu.buildFromTemplate([
      new MenuItem({
        label: "退出",
        click() {
          win.destroy();
          app.quit();
        },
      }),
    ]);
    tray.setToolTip("Suanpan RTO");
    tray.setContextMenu(contextMenu);
  }
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on("will-quit", async (event) => {
  event.preventDefault();
  await killSuanpanServer();
  process.exit(0);
});



/**
 * SingleInstanceLock
 */
 const gotTheLock = app.requestSingleInstanceLock()

 if (!gotTheLock) {
   app.quit()
 } else {
   app.on('second-instance', (event, commandLine, workingDirectory) => {
     // Someone tried to run a second instance, we should focus our window.
     if (win) {
       if (win.isMinimized()) win.restore()
       win.focus()
     }
   })
   app.on("ready", async () => {
     if(!isDevelopment) {
       appInjectProd();
     }
     await createLoadingWindow(getVersion());
    try {
      await Promise.all([checkRedis(), checkMinio()])
      await launchSuanpanServer();
      await checkServerSuccess();
      await getAppConfig(getWebOrigin());
      if (isDevelopment) {
        await appInjectDev();
      }
       createWindow();
    } catch (e) {
     logger.error(`launch failed ${e.message}\n${e.stack}`);
     loadingWin.webContents.send('error-msg', e.message || '');
    }
   });
 }

 ipcMain.on('app-quit', (evt, errorMsg) => {
  process.exit(-1);
});
