import { protocol, session } from "electron";
import http from "http";
import { parse } from "node-html-parser";
import fs from "fs";
import path from "path";
import * as configs from "../configs";
import log from './log' 

let appConfig = {};

export async function appInjectDev(ac) {
  protocol.interceptStringProtocol("http", async (request, callback) => {
    protocol.uninterceptProtocol("http");
    let url = new URL(request.url);
    let htmlStr = await getUrlContent(url.href);
    callback({ mimeType: "text/html", data: injectAppConfig(htmlStr, ac) });
  });
  session.defaultSession.webRequest.onBeforeRequest((details, callback) => {
    let url = new URL(details.url);
    if(url.origin.startsWith('http://localhost') && 
      (url.pathname.startsWith('/common_public') ||
      url.pathname.startsWith('/app/dashboard/plugin') ||
      url.pathname.startsWith('/common_static'))){
      callback({
        redirectURL: `${configs.RtoOrigin}${url.pathname}${url.search}`
      })
    }else {
      callback({})
    }
  })
}

function getUrlContent(url) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      if(res.headers.location) {
        http.get(res.headers.location, (res) => {
          let data = "";
          res.on("data", (chunk) => {
            data += chunk;
          });
          res.on("end", () => {
            resolve(data);
          });
        })
      }else {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          resolve(data);
        });
      }
    });
  });
}

export function getAppConfig() {
  return new Promise((resolve) => {
    const req = http.request(
      `${configs.RtoOrigin}/app/config`,
      {
        method: "POST",
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          resolve(convert2Appconfig((JSON.parse(data)).data))
        });
      }
    );
    req.end();
  });
}

function convert2Appconfig(obj) {
  const ac = Object.assign(
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
      redirectRequest: configs.RtoOrigin,
      suanpanWebHost: configs.RtoOrigin
    }
  );
  ac.defaultDirs = JSON.parse(ac.defaultDirs);
  ac.appMenu = JSON.parse(ac.appMenu);
  ac.services = JSON.parse(ac.services);
  return ac;
}

export function setAppConfig(ac) {
  appConfig = ac;
}

function injectAppConfig(htmlStr, ac, isProd=false) {
  const root = parse(htmlStr);
  let acNode = parse(
    `<script>window.appConfig = ${JSON.stringify(ac)}</script>`
  );
  let origin = isProd ? 'app://.' : configs.RtoOrigin;
  let sdkCssNode = parse(
    `<link rel="stylesheet" href="${origin + ac.suanpanSdkCSSPath}">`
  );
  let sdkNode = parse(
    `<script type="text/javascript" src="${origin + ac.suanpanSdkPath}"></script>`
  );
  root.querySelector("head").appendChild(acNode);
  root.querySelector("head").appendChild(sdkCssNode);
  root.querySelector("body").appendChild(sdkNode);
  return root.toString();
}

export function appInjectProd() {
  protocol.registerBufferProtocol(
    "app",
    async (request, respond) => {
      let url = new URL(request.url);
      
      let pathName = url.pathname;
      if(url.pathname.startsWith('/common_public') ||
      url.pathname.startsWith('/app/dashboard/plugin') ||
      url.pathname.startsWith('/common_static')) {
        // inject suanpan sdk
        log.debug('++++++', `${configs.RtoOrigin}${url.pathname}${url.search}`)
        let urlContent = await getUrlContent(`${configs.RtoOrigin}${url.pathname}${url.search}`);
        const extension = path.extname(pathName).toLowerCase();
        if (extension === ".js") {
          mimeType = "text/javascript";
        } else if (extension === ".html") {
          mimeType = "text/html";
        } else if (extension === ".css") {
          mimeType = "text/css";
        }
        respond({ mimeType, data: Buffer.from(urlContent) });
      }else {
        pathName = decodeURI(pathName); // Needed in case URL contains spaces

        fs.readFile(path.join(__dirname, pathName), (error, data) => {
            if (error) {
              console.error(`Failed to read ${pathName} on app protocol`, error);
            }
            const extension = path.extname(pathName).toLowerCase();
            let mimeType = "";
            if (extension === ".js") {
              mimeType = "text/javascript";
            } else if (extension === ".html") {
              mimeType = "text/html";
              if (pathName === "/index.html") {
                data = Buffer.from(injectAppConfig(data.toString(), appConfig, true));
              }
            } else if (extension === ".css") {
              mimeType = "text/css";
            } else if (extension === ".svg" || extension === ".svgz") {
              mimeType = "image/svg+xml";
            } else if (extension === ".json") {
              mimeType = "application/json";
            } else if (extension === ".wasm") {
              mimeType = "application/wasm";
            }
            respond({ mimeType, data });
        });
      }
    },
    (error) => {
      if (error) {
        log.error(`Failed to register app protocol`, error);
      }
    }
  );
}

export function interceptUrl(url) {
  let startIdx = url.indexOf('proxr')
  if(startIdx === -1) {
    startIdx = url.indexOf('proxy')
  }
  if(startIdx === -1) {
    return url;
  }
  return path.join(configs.RtoOrigin, url.slice(startIdx));
}