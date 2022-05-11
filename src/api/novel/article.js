import request from '@/utils/request'

export function getNovelArticleListApi(params) {
  return request({
    url: '/novel/article/list',
    method: 'get',
    params
  })
}
