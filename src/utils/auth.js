import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export const env = {
  production: false,
  api_url: 'http://127.0.0.1:8000/api/',
  protocal: 'http://',
  storeHoshName: 'localhost:8080',
  patnerHoshName: 'localhost:8080',
  partner: 'localhost'
}
