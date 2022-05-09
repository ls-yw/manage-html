import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login.json',
    method: 'post',
    data
  })
}

export function logout(data) {
  return request({
    url: '/logout.json',
    method: 'post',
    data
  })
}

export function getInfo(data) {
  return request({
    url: '/getLoginInfo.json',
    method: 'post',
    data
  })
}
