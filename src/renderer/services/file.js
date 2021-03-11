import { invoke } from "./index";
import { getFileNameAndExt } from "utils/index";

/**
 * 新建一个空项目
 */
export function createEmpty() {
  return window.appService.create(
    "tmp",
    window.appConfig.defaultAppFolder,
    "predict"
  );
}

/**
 * 打开项目
 */
export function openFile(fullpath) {
  return invoke('file-load', fullpath).then((fileBuffer) => {
    return new Promise( (resolve, reject) => {
      let { name: fileName } = getFileNameAndExt(fullpath);
      const importAppDataPath = window.SuanpanAPI.commonService.getImportPath(
        window.appConfig.userId
      );
      let fileBlob = new Blob([
        new Uint8Array(
          fileBuffer.buffer,
          fileBuffer.byteOffset,
          fileBuffer.length
        ),
      ]);
      const ext = ".zip";
      // fileBlob.lastModifiedDate = new Date();
      // fileBlob.name = `${fileName}`;
      // 上传文件至 oss
      const Key = `${importAppDataPath}${fileName}-${window.SuanpanAPI.commonService.uuid()}${ext}`;
      window.SuanpanAPI.appDataStoreService
        .upload( Key, fileBlob, null, null, () => {
            // 导入项目文件
            window.SuanpanAPI.appService
              .import({
                name: fileName,
                dataPath: Key,
                dir: window.appConfig.defaultAppFolder,
              })
              .then(
                (res) => {
                  // 查询导入状态
                  window.SuanpanAPI.loopService
                    .fetchJob(
                      { asyncable: true },
                      res.job.id,
                      window.SuanpanAPI.appService.getJob
                    )
                    .then(
                      (res) => {
                        window.SuanpanAPI.appService.switch(res.appId, res.importFolderName).then( () => {
                          resolve(res);
                        }).catch (err => {
                          console.error(err);
                          reject(err);
                        })
                      },
                      (err) => {
                        console.error(err);
                        reject(err);
                      }
                    );
                },
                (err) => {
                  console.error(err);
                  reject(err);
                }
              );
          }).catch( err => {
            console.error(err);
            reject(err);
          });
    })
  });
}

function getDownloadUrl(appId) {
  return window.appService.export(appId, {
    exportAppNext: true,
    packAppNext: true,
    type: "appDashboardExport"
  }).then( res => {
    return window.SuanpanAPI.loopService.fetchJob({type: "export", asyncable: true}, res.job.id, window.appService.getJob).then(
      (res) => {
        return SuanpanAPI.appDataStoreService.url(res) 
      })
  })
}

/**
 * 保存文件
 */
export function saveFile(appId, fullpath) {
  return getDownloadUrl(appId).then( downloadUrl => {
    return invoke("file-save", fullpath, downloadUrl.data)
  })
}


/**
 * 删除项目
 */

export function deleteApp(appId) {
  return window.SuanpanAPI.appService.del(appId)
}
