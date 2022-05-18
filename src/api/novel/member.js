import request from '@/utils/request'

export function getNovelMemberListApi(params) {
  return request({
    url: '/novel/member/list',
    method: 'get',
    params
  })
}

export function getNovelMemberBookListApi(params) {
  return request({
    url: '/novel/member/book',
    method: 'get',
    params
  })
}
