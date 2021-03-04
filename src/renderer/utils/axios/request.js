import axios from 'axios';
import { notification } from 'ant-design-vue';
const service = axios.create({
  baseURL: 'http://10.88.36.102:30000',
  timeout: 3 * 1000
});

// 请求拦截器
service.interceptors.request.use(config => {
  //请求前的一些共有的处理

  return config;
}, error => {
  Promise.reject(error);
});

// 响应拦截器
service.interceptors.response.use(response => {
  //接收到响应数据并成功后的一些共有的处理，关闭loading等'
  const { data } = response;
  if (data.success) {
    return data;
  } else {
    notification['error']({
      message: data.msg,
    });
  }
}, error => {
  /***** 接收到异常响应的处理开始 *****/
  if (error && error.response) {
    switch (error.response.status) {
      case 400:
        error.message = '错误请求'
        break;
      case 401:
        error.message = '未授权，请重新登录'
        break;
      case 403:
        error.message = '拒绝访问'
        break;
      case 404:
        error.message = '请求错误,未找到该资源'
        window.location.href = "/NotFound"
        break;
      case 405:
        error.message = '请求方法未允许'
        break;
      case 408:
        error.message = '请求超时'
        break;
      case 500:
        error.message = '服务器端出错'
        break;
      case 501:
        error.message = '网络未实现'
        break;
      case 502:
        error.message = '网络错误'
        break;
      case 503:
        error.message = '服务不可用'
        break;
      case 504:
        error.message = '网络超时'
        break;
      case 505:
        error.message = 'http版本不支持该请求'
        break;
      default:
        error.message = `连接错误${error.response.status}`
    }
    notification['error']({
      message: error.message,
    });
  } else {
    // 超时处理
    if (JSON.stringify(error).includes('timeout')) {
      notification['error']({
        message: '服务器响应超时，请刷新当前页',
      });
    }
  }

  /***** 处理结束 *****/
  //如果不需要错误处理，以上的处理过程都可省略
  // return Promise.resolve(error.response)
});

export default service;