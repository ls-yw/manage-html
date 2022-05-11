import request from '@/utils/request'

export function getNovelCategoryListApi(params) {
  return request({
    url: '/novel/category/list',
    method: 'get',
    params
  })
}

export function saveNovelCategoryApi(data) {
  return request({
    url: '/novel/category/save',
    method: 'post',
    data
  })
}

export function deleteNovelCategoryApi(data) {
  return request({
    url: '/novel/category/delete',
    method: 'post',
    data
  })
}

export function getNovelCategoryPairsApi(params) {
  return request({
    url: '/novel/category/pairs',
    method: 'get',
    params
  })
}
