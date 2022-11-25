import request from '@/utils/request'

export function getBlogArticleListApi(params) {
  return request({
    url: '/blog/article/list',
    method: 'get',
    params
  })
}
export function getBlogArticleInfoApi(params) {
  return request({
    url: '/blog/article/info',
    method: 'get',
    params
  })
}
export function saveBlogArticleApi(data) {
  return request({
    url: '/blog/article/save',
    method: 'post',
    data
  })
}

export function deleteBlogArticleApi(data) {
  return request({
    url: '/blog/article/delete',
    method: 'post',
    data
  })
}

export function recoveryBlogArticleApi(data) {
  return request({
    url: '/blog/article/recovery',
    method: 'post',
    data
  })
}

