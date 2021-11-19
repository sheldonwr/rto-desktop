import { ipcMain } from "electron";
import fs from 'fs';
import requireFromString from 'require-from-string';

import './window'
import './file'
import './config'
import './wizard'
import { LocalFilePath } from '../suanpan'
import logger from '../log'

let clientVersion = 'unknown'
getVersion();

function getVersion() {
  if(fs.existsSync(LocalFilePath)) {
    try {
      let obj = requireFromString(fs.readFileSync(LocalFilePath, 'utf-8'));
      if(obj.clientVersion) {
        clientVersion = obj.clientVersion;
      }
    } catch (error) {
      logger.error('cannot get local.js', error);
    }
  }
  return clientVersion;
}

ipcMain.handle("verion-get", getVerion);

function getVerion(event) {
  return new Promise( (resolve, reject) => {
    resolve(clientVersion)
  });
}