import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function logout(data) {
  return request({
    url: '/logout',
    method: 'post',
    data
  })
}

export function getInfo(data) {
  return request({
    url: '/getLoginInfo',
    method: 'get',
    data
  })
}

/**
 * 修改密码
 * @param data
 * @returns {AxiosPromise}
 */
export function setPasswordApi(data) {
  return request({
    url: '/setPassword',
    method: 'post',
    data
  })
}
