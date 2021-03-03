import { protocol, session } from 'electron'
import http from "http";
import { parse } from "node-html-parser";
import fs from "fs";
import path from "path";
import * as configs from "./configs";
import log from "./log";

export async function appInjectDev() {
  let ac = await getAppConfig();
  protocol.interceptStringProtocol('http', async (request, callback) => {
    protocol.uninterceptProtocol('http');
    let url = new URL(request.url);
    let htmlStr = await getHtmlString(url.href);
    callback({ mimeType:'text/html', data: injectAppConfig(htmlStr, ac)})
  })
}

function getHtmlString(url) {
  return new Promise( resolve => {
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

const appConfig = {
  env: "xuelangyun",
  dev: "false",
  logoImgPath: "images/logo.svg",
  screenshotImgPath: "images/no_image_xly.png",
  userId: "4",
  userName: "user",
  userConfigPath: "studio/4/config",
  publicUserId: "user_public",
  defaultDirs: [
    { id: 1, label: "分享给我的项目", folder: true, children: [] },
    { id: 2, label: "我的项目", folder: true, children: [] },
  ],
  appMenu: {
    "/": { name: "概览", icon: "iconfont iconhome", visible: true },
    predict: {
      name: "应用开发",
      icon: "fa fa-recycle",
      route: "predict",
      description: "数据 + 算法 + 硬件 + 可视化，全混合流计算技术",
      userConfig: "predictDirs",
      componentType: "service, dashboard, model",
      visible: true,
    },
    algo: {
      name: "算法开发",
      icon: "fa fa-sitemap",
      route: "exp",
      description:
        "为机器学习和深度学习提供从数据处理、模型训练到服务部署的一站式服务",
      userConfig: "appDirs",
      componentType: "algo,model",
      visible: true,
    },
    processMining: {
      name: "流程挖掘",
      icon: "iconfont iconliuchengwajue",
      route: "predict",
      description:
        "通过从事件日志中提取出知识，从而去发现、监控和改进实际业务过程",
      componentType: "pm",
      visible: false,
    },
    edge: {
      name: "边缘计算",
      icon: "iconfont iconbianyuanjisuan",
      route: "predict",
      description:
        "基于容易编排，采用网络、计算、存储、应用核心能力为一体的开放平台",
      subMenu: [
        { id: "project", name: "项目" },
        { id: "hardware", name: "接入设备" },
      ],
      componentType: "edge",
      visible: true,
    },
    mechanism: {
      name: "机理开发",
      icon: "iconfont iconjilikaifa",
      route: "predict",
      description: "将专家经验沉淀为决策模型，接入实时数据，构建决策引擎",
      componentType: "mechanism",
      visible: false,
    },
    rpa: {
      name: "RPA开发",
      icon: "fa fa-gamepad",
      route: "exp",
      description: "将重复性劳动进行自动化出来，在业务流程上实现自动化智能升级",
      userConfig: "rpaDirs",
      componentType: "rpa",
      visible: true,
    },
    hardwares: {
      name: "设备管理",
      icon: "fa fa-camera-retro",
      route: "predict",
      visible: false,
    },
    "process-mining": {
      name: "流程挖掘",
      icon: "",
      route: "predict",
      visible: false,
    },
  },
  edgeContext: {},
  ossType: "minio",
  publicOss: "https://suanpan-public.oss-cn-shanghai.aliyuncs.com",
  predictHost: "10.88.36.102",
  edgeVersion: "0",
  version: "3.0.15-export.4",
  releasedRPAPath: "/rpa-release/suanpan-RPA-2.1-latest.exe",
  checkUpdateInterval: "3600",
  statusTimeout: 2000,
  oss: {
    bucket: "suanpan",
    endpoint: "http://10.88.36.102:30002",
    ossAccessKey: "",
    ossAccessSecret: "",
  },
  disableComponent: "0",
  suanpanSdkPath: "/common_public/sdk/0.9.263/suanpan-sdk.dashboard.min.js",
  suanpanSdkAllPath:
    "/common_public/sdk/0.9.263/suanpan-sdk.dashboardPage.min.js",
  suanpanSdkAllCSSPath: "/common_public/sdk/0.9.263/dashboardPage.css",
  dashboardPluginPath:
    "/app/dashboard/plugin?x-sp-user-id=4&amp;x-sp-signature=gNNccG%2B09efnwUz7K0HvmRWENZI%3D&amp;x-sp-sign-version=v1",
  affinity: "",
  loginHost: "http://10.88.36.245",
  getUserIdMethod: "default",
  appDataStoreType: "minio",
  proxyHost: "",
  adSrc: "",
  adSrcMinHeight: "200",
  userGuide:
    "https://www.yuque.com/books/share/411ef73a-02b7-40d3-bdad-164620911dcd",
  services: {
    hufu: {
      enable: true,
      url: "https://hufu.xuelangyun.com",
      path: "/proxy/hufu-web/datatag/suanpan/module/group",
      usePublicUrl: false,
      algoComponentId: 1876,
      predictComponentId: 1874,
    },
  },
  appId: "13707",
  pluginLoaded: true,
  redirectRequest: configs.RtoOrigin
};

function getAppConfig() {
  return new Promise( (resolve, reject) => {
    setTimeout(() => {
      resolve(appConfig)
    }, 1000);
  })
}

function injectAppConfig(htmlStr, ac) {
  const root = parse(htmlStr);
  let acNode = parse(
    `<script>window.appConfig = ${JSON.stringify(ac)}</script>`
  );
  root.querySelector("head").appendChild(acNode);
  return root.toString();
}

export async function appInjectProd() {
  let ac = await getAppConfig();
  protocol.registerBufferProtocol(
    'app',
    (request, respond) => {
      let pathName = new URL(request.url).pathname
      pathName = decodeURI(pathName) // Needed in case URL contains spaces

      fs.readFile(path.join(__dirname, pathName), (error, data) => {
        if (error) {
          console.error(
            `Failed to read ${pathName} on app protocol`,
            error
          )
        }
        const extension = path.extname(pathName).toLowerCase()
        let mimeType = ''

        if (extension === '.js') {
          mimeType = 'text/javascript'
        } else if (extension === '.html') {
          mimeType = 'text/html'
          data = Buffer.from(injectAppConfig(data.toString(), ac));
        } else if (extension === '.css') {
          mimeType = 'text/css'
        } else if (extension === '.svg' || extension === '.svgz') {
          mimeType = 'image/svg+xml'
        } else if (extension === '.json') {
          mimeType = 'application/json'
        } else if (extension === '.wasm') {
          mimeType = 'application/wasm'
        }

        respond({ mimeType, data })
      })
    },
    (error) => {
      if (error) {
        console.error(`Failed to register app protocol`, error)
      }
    }
  )
}