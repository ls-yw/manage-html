import request from '@/utils/request'

export function getNovelDataSearchListApi(params) {
  return request({
    url: '/novel/data/search',
    method: 'get',
    params
  })
}

export function getNovelDataSpiderListApi(params) {
  return request({
    url: '/novel/data/spider',
    method: 'get',
    params
  })
}
