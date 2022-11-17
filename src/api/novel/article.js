import request from '@/utils/request'

export function getNovelArticleListApi(params) {
  return request({
    url: '/novel/article/list',
    method: 'get',
    params
  })
}

export function getNovelArticleContentApi(params) {
  return request({
    url: '/novel/article/content',
    method: 'get',
    params
  })
}

export function saveNovelArticleApi(data) {
  return request({
    url: '/novel/article/save',
    method: 'post',
    data
  })
}

export function deleteNovelArticleApi(data) {
  return request({
    url: '/novel/article/delete',
    method: 'post',
    data
  })
}

export function clearNovelArticleApi(data) {
  return request({
    url: '/novel/article/clear',
    method: 'post',
    data
  })
}
