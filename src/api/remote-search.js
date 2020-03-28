import request from '@/utils/request'
import { env } from '@/utils'

export function searchUser(name) {
  return request({
    url: '/vue-element-admin/search/user',
    method: 'get',
    params: { name }
  })
}

export function searchPatient(name) {
  return request({
    url: `${env.api_url}/patients/`,
    method: 'get',
    params: { name }
  })
}

export function searchDoctor(name) {
  return request({
    url: `${env.api_url}/doctors/`,
    method: 'get',
    params: { name }
  })
}

export function transactionList(query) {
  return request({
    url: '/vue-element-admin/transaction/list',
    method: 'get',
    params: query
  })
}
