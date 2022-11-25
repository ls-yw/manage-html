import request from '@/utils/request'

export function getConfigsApi(params) {
  return request({
    url: '/config/index',
    method: 'get',
    params
  })
}

export function saveConfigsApi(data) {
  return request({
    url: '/config/save',
    method: 'post',
    data
  })
}
