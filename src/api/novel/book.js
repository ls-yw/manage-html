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

export function getNovelChapterPairsApi(params) {
  return request({
    url: '/novel/book/chapterPairs',
    method: 'get',
    params
  })
}

export function changeNovelBookCollectApi(data) {
  return request({
    url: '/novel/book/changeCollect',
    method: 'post',
    data
  })
}

export function getNovelBookApplyListApi(params) {
  return request({
    url: '/novel/book/apply',
    method: 'get',
    params
  })
}

export function saveNovelBookApplyReplyApi(data) {
  return request({
    url: '/novel/book/replyApply',
    method: 'post',
    data
  })
}

export function deleteNovelBookApplyApi(data) {
  return request({
    url: '/novel/book/deleteApply',
    method: 'post',
    data
  })
}
