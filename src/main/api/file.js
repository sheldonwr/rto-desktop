import { ipcMain, dialog, BrowserWindow, app } from "electron";
import fs from 'fs';

ipcMain.on("file-open", openFile);
ipcMain.handle("file-load", loadFile);
ipcMain.handle("file-save-dialog", saveFileDialog);
ipcMain.handle("file-save", saveFile);

function openFile() {
  dialog.showOpenDialog( BrowserWindow.getFocusedWindow(), {
  });
}

async function loadFile(event, filePath) {
  let result = {
    success: false
  }
  try {
    let fileContent = fs.promises.readFile(filePath)
    result.success = true
    result.data = fileContent
  } catch (error) {
    result.error = error;
  }
  return result
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

async function saveFile(event, filePath) {
  
}