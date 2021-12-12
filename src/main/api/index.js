import { ipcMain } from "electron";
import fs from 'fs';
import requireFromString from 'require-from-string';

import './window'
import './file'
import './config'
import './wizard'
import { currentVersion } from '../suanpan'


ipcMain.handle("verion-get", getVerion);

function getVerion(event) {
  return new Promise( (resolve, reject) => {
    resolve(currentVersion)
  });
}