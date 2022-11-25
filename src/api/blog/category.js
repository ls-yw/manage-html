import request from '@/utils/request'

export function getBlogCategoryListApi(params) {
  return request({
    url: '/blog/category/list',
    method: 'get',
    params
  })
}

export function saveBlogCategoryApi(data) {
  return request({
    url: '/blog/category/save',
    method: 'post',
    data
  })
}

export function deleteBlogCategoryApi(data) {
  return request({
    url: '/blog/category/delete',
    method: 'post',
    data
  })
}

export function recoveryBlogCategoryApi(data) {
  return request({
    url: '/blog/category/recovery',
    method: 'post',
    data
  })
}

export function getBlogCategoryPairsApi(params) {
  return request({
    url: '/blog/category/pairs',
    method: 'get',
    params
  })
}
