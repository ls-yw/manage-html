import request from '@/utils/request'

export function uploadApi(data) {
  return request({
    url: '/upload',
    method: 'post',
    data
  })
}
