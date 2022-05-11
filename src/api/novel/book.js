import request from '@/utils/request'

export function getNovelBookListApi(params) {
  return request({
    url: '/novel/book/list',
    method: 'get',
    params
  })
}

export function saveNovelBookApi(data) {
  return request({
    url: '/novel/book/save',
    method: 'post',
    data
  })
}

export function deleteNovelBookApi(data) {
  return request({
    url: '/novel/book/delete',
    method: 'post',
    data
  })
}
