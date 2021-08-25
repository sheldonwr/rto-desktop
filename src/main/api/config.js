import { getUrlContent } from "../utils";


export let appConfig = {};

export function getAppConfig(orgin) {
  return new Promise((resolve, reject) => {
    getUrlContent(`${orgin}/app/config`, "POST").then(
      (rawData) => {
        let obj = JSON.parse(rawData).data;
        let RtoOrigin = orgin;
        Object.assign(appConfig,
          {
            ...obj,
            oss: {
              bucket: obj.osBucket,
              endpoint: obj.ossEndpoint,
              ossAccessKey: obj.ossAccessKey,
              ossAccessSecret: obj.ossAccessSecret,
            },
          },
          {
            redirectRequest: RtoOrigin,
            suanpanWebHost: RtoOrigin,
          }
        );
        appConfig.defaultDirs = JSON.parse(appConfig.defaultDirs);
        appConfig.appMenu = JSON.parse(appConfig.appMenu);
        appConfig.services = JSON.parse(appConfig.services);
        appConfig.RtoOrigin = RtoOrigin;
        if(appConfig.nodeCopyDir) {
          appConfig.nodeCopyDir = JSON.parse(appConfig.nodeCopyDir);
        }
        appConfig.socketProtocol = 'http:';

        resolve(appConfig);
      }
    ).catch(err => {
      reject(err);
    });
  });
}
