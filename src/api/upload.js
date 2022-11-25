import request from '@/utils/request'

export function uploadApi(type, data) {
  return request({
    url: '/upload',
    method: 'post',
    params: {
      type
    },
    data
  })
}
