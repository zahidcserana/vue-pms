import request from '@/utils/request'
import { env } from '@/utils'

export function fetchPatientList(query) {
  return request({
    url: `${env.api_url}/patients/`,
    method: 'get',
    params: query
  })
}

export function updatePatient(data) {
  return request({
    url: `${env.api_url}/patients/${data.id}/`,
    method: 'put',
    data
  })
}

export function createPatient(data) {
  return request({
    url: `${env.api_url}/patients/`,
    method: 'post',
    data
  })
}
