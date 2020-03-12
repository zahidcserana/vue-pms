import request from '@/utils/request'
import { env } from '@/utils'
const model = 'appointment-serials'

export function fetchAppointmentSerials(query) {
  return request({
    url: `${env.api_url}/${model}/`,
    method: 'get',
    params: query
  })
}

export function updateAppointmentSerial(data) {
  return request({
    url: `${env.api_url}/${model}/${data.id}/`,
    method: 'put',
    data
  })
}

export function getAppointmentSerial(id) {
  return request({
    url: `${env.api_url}/${model}/${id}/`,
    method: 'get'
  })
}

export function createAppointmentSerial(data) {
  return request({
    url: `${env.api_url}/${model}/`,
    method: 'post',
    data
  })
}

