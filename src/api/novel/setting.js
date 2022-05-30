import request from '@/utils/request'

export function getNovelSettingApi(params) {
  return request({
    url: '/novel/setting/index',
    method: 'get',
    params
  })
}

export function saveNovelSettingApi(data) {
  return request({
    url: '/novel/setting/save',
    method: 'post',
    data
  })
}
