import request from '@/utils/request'
import { env } from '@/utils'
const model = 'patient-payments'

export function fetchPaymentList(query) {
  return request({
    url: `${env.api_url}/${model}/`,
    method: 'get',
    params: query
  })
}

export function updatePayment(data) {
  return request({
    url: `${env.api_url}/${model}/${data.id}/`,
    method: 'put',
    data
  })
}

export function paymentInfo(id) {
  return request({
    url: `${env.api_url}/${model}/${id}/`,
    method: 'get'
  })
}

export function createPayment(data) {
  return request({
    url: `${env.api_url}/${model}/`,
    method: 'post',
    data
  })
}

