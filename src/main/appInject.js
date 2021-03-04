import { protocol, session } from "electron";
import http from "http";
import { parse } from "node-html-parser";
import fs from "fs";
import path from "path";
import * as configs from "../configs";
import log from "./log";

export async function appInjectDev(ac) {
  protocol.interceptStringProtocol("http", async (request, callback) => {
    protocol.uninterceptProtocol("http");
    let url = new URL(request.url);
    let htmlStr = await getHtmlString(url.href);
    callback({ mimeType: "text/html", data: injectAppConfig(htmlStr, ac) });
  });
}

function getHtmlString(url) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      let indexHtml = "";
      res.on("data", (chunk) => {
        indexHtml += chunk;
      });
      res.on("end", () => {
        resolve(indexHtml);
      });
    });
  });
}

let appConfig = {};

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
  const ac = Object.assign({
    ...obj,
    oss: {
      bucket: obj.osBucket,
      endpoint: obj.ossEndpoint,
      ossAccessKey: obj.ossAccessKey,
      ossAccessSecret: obj.ossAccessSecret
    }
  }, {
    redirectRequest: configs.RtoOrigin
  });
  ac.defaultDirs = JSON.parse(ac.defaultDirs);
  ac.appMenu = JSON.parse(ac.appMenu);
  ac.services = JSON.parse(ac.services);
  return ac;
}

export function setAppConfig(ac) {
  appConfig = ac;
}

function injectAppConfig(htmlStr, ac) {
  const root = parse(htmlStr);
  let acNode = parse(
    `<script>window.appConfig = ${JSON.stringify(ac)}</script>`
  );
  root.querySelector("head").appendChild(acNode);
  return root.toString();
}

export function appInjectProd() {
  protocol.registerBufferProtocol(
    "app",
    (request, respond) => {
      let pathName = new URL(request.url).pathname;
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
            data = Buffer.from(injectAppConfig(data.toString(), appConfig));
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
    },
    (error) => {
      if (error) {
        console.error(`Failed to register app protocol`, error);
      }
    }
  );
}
