import request from '@/utils/request'
import { env } from '@/utils'
const model = 'appointment-serials'
const resource = 'appointments'

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

// Appointment
export function fetchAppointments(query) {
  return request({
    url: `${env.api_url}/${resource}/`,
    method: 'get',
    params: query
  })
}

export function updateAppointment(data) {
  return request({
    url: `${env.api_url}/${resource}/${data.id}/`,
    method: 'put',
    data
  })
}

export function getAppointment(id) {
  return request({
    url: `${env.api_url}/${resource}/${id}/`,
    method: 'get'
  })
}

export function createAppointment(data) {
  return request({
    url: `${env.api_url}/${resource}/`,
    method: 'post',
    data
  })
}

