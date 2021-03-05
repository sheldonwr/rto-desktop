import { ipcMain, dialog, BrowserWindow } from "electron";

ipcMain.on("file-open", openFile);

function openFile() {
  dialog.showOpenDialog( BrowserWindow.getFocusedWindow(), {
  });
}