import request from '@/utils/request'
import { env } from '@/utils'

export function fetchDoctorList(query) {
  return request({
    url: `${env.api_url}/doctors/`,
    method: 'get',
    params: query
  })
}

export function updateDoctor(data) {
  return request({
    url: `${env.api_url}/doctors/${data.id}/`,
    method: 'put',
    data
  })
}

export function doctorInfo(id) {
  return request({
    url: `${env.api_url}/doctors/${id}/`,
    method: 'get'
  })
}

export function createDoctor(data) {
  return request({
    url: `${env.api_url}/doctors/`,
    method: 'post',
    data
  })
}

