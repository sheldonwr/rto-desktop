import { ipcMain, dialog, BrowserWindow, app } from "electron";
import fs from 'fs';
const http = require('http');

ipcMain.handle("file-open", openFile);
ipcMain.handle("file-load", loadFile);
ipcMain.handle("file-save-dialog", saveFileDialog);
ipcMain.handle("file-save", saveFile);
ipcMain.handle("file-message-dialog", fileMessageDialog);

async function openFile() {
  const { filePaths } = await dialog.showOpenDialog( BrowserWindow.getFocusedWindow(), {
    title: '打开',
    defaultPath: app.getPath("documents"),
    filters: [{
      name: "sp", extensions: ['sp'],
      name: 'zip', extensions: ['zip'],
    }]
  });
  return filePaths[0];
}

function loadFile(event, filePath) {
  return new Promise( (resolve, reject) => {
    fs.readFile(filePath, (error, data) => {
      if(error) {
        reject(error)
      }else {
        resolve(data)
      }
    })
  });
}

async function saveFileDialog() {
  const { filePath } = await dialog.showSaveDialog( BrowserWindow.getFocusedWindow(), {
    title: '保存',
    defaultPath: app.getPath("documents"),
    filters: [{
      name: "sp", extensions: ['sp']
    }]
  })
  return filePath
}

function saveFile(event, filePath, url) {
  return new Promise( (resolve, reject) => {
    let file = fs.createWriteStream(filePath);
    let request = http.get(url, function(response) {
      response.pipe(file);
      file.on('finish', function() {
        file.close(resolve);
      });
    }).on('error', function(err) {
      fs.unlink(filePath);
      reject(err);
    });
  })
}

async function fileMessageDialog() {
  let { response } = await dialog.showMessageBox( BrowserWindow.getFocusedWindow(), {
    type: 'warning',
    message: '是否保存当前文件？',
    buttons: ['保存', '不保存', '取消'],
    noLink: true,
    cancelId: 2
  });
  return response;
}