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
