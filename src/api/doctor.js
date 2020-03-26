import request from '@/utils/request'
import { env } from '@/utils'

export function fetchDoctorList(query) {
  return request({
    url: `${env.api_url}/doctors/`,
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

export function patientInfo(id) {
  return request({
    url: `${env.api_url}/patients/${id}/`,
    method: 'get'
  })
}

export function createPatient(data) {
  return request({
    url: `${env.api_url}/patients/`,
    method: 'post',
    data
  })
}

