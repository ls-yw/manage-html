import request from '@/utils/request'

export function getNovelAppCollectSearchApi(params) {
  return request({
    url: '/novel/appCollect/search',
    method: 'get',
    params
  })
}

export function getNovelAppCollectApi(data) {
  return request({
    url: '/novel/appCollect/collect',
    method: 'post',
    data
  })
}

export function getNovelAppCollectCheckApi(data) {
  return request({
    url: '/novel/appCollect/check',
    method: 'post',
    data
  })
}

export function getNovelAppCollectLookApi(params) {
  return request({
    url: '/novel/appCollect/look',
    method: 'get',
    params
  })
}

export function getNovelAppCollectLookContentApi(params) {
  return request({
    url: '/novel/appCollect/lookContent',
    method: 'get',
    params
  })
}
