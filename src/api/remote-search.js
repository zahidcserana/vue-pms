import request from '@/utils/request'
import { env } from '@/utils'

export function searchUser(name) {
  return request({
    url: '/vue-element-admin/search/user',
    method: 'get',
    params: { name }
  })
}

export function searchPatient(search) {
  return request({
    url: `${env.api_url}/patient-search/`,
    method: 'get',
    params: { search }
  })
}

export function searchDoctor(name) {
  return request({
    url: `${env.api_url}/doctors/`,
    method: 'get',
    params: { name }
  })
}
export function defaultDoctor(id) {
  return request({
    url: `${env.api_url}/doctors/`,
    method: 'get',
    params: { id }
  })
}

export function summary(query) {
  return request({
    url: `${env.api_url}/summary/`,
    method: 'get'
  })
}

// export function transactionList(query) {
//   return request({
//     url: '/vue-element-admin/transaction/list',
//     method: 'get',
//     params: query
//   })
// }
