import request from '@/utils/request'

export function getNovelCollectListApi(params) {
  return request({
    url: '/novel/collect/list',
    method: 'get',
    params
  })
}

export function getNovelCollectArticleListApi(params) {
  return request({
    url: '/novel/collect/article',
    method: 'get',
    params
  })
}

export function confirmNovelCollectArticleApi(data) {
  return request({
    url: '/novel/collect/confirmArticle',
    method: 'post',
    data
  })
}

export function getNovelCollectTestApi(data) {
  return request({
    url: '/novel/collect/test',
    method: 'post',
    data
  })
}

export function getNovelCollectInfoApi(params) {
  return request({
    url: '/novel/collect/info',
    method: 'get',
    params
  })
}

export function saveNovelCollectApi(data) {
  return request({
    url: '/novel/collect/save',
    method: 'post',
    data
  })
}

export function deleteNovelCollectApi(data) {
  return request({
    url: '/novel/collect/delete',
    method: 'post',
    data
  })
}

export function getNovelStartCollectInfoApi(data) {
  return request({
    url: '/novel/collect/collectBookInfo',
    method: 'post',
    data
  })
}

export function saveNovelStartCollectInfoApi(data) {
  return request({
    url: '/novel/collect/collectSaveBookInfo',
    method: 'post',
    data
  })
}

