import http from '../utils/axios/http';

let request = '/api/v1/ci';

// 获取列表
export function getCiList(data) {
  return http.post(`${request}/list`, data);
}

// 详细信息
export function getCiDetail(data) {
  return http.post(`${request}/fetch`, data);
}

// 创建
export function createCi(data) {
  return http.post(`${request}/create`, data);
}

// 编辑
export function updateCi(data) {
  return http.post(`${request}/update`, data);
}

// 删除
export function deleteCi(data) {
  return http.post(`${request}/del`, data);
}
