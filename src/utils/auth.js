// import Cookies from 'js-cookie'

const TokenKey = 'token'

export function getToken() {
  return localStorage.getItem(TokenKey)
  // return Cookies.get(TokenKey)
}

export function setToken(token) {
  return localStorage.setItem(TokenKey, token)
  // return Cookies.set(TokenKey, token)
}

export function removeToken() {
  console.log(removeToken)
  // return localStorage.removeItem(TokenKey)
  // return Cookies.remove(TokenKey)
}

export function getUserInfo() {
  return JSON.parse(localStorage.getItem('user_info'))
}

export const env = {
  production: false,
  api_url: 'https://glacial-temple-72048.herokuapp.com/api/',
  // api_url: 'http://127.0.0.1:8000/api/',
  protocal: 'http://',
  storeHoshName: 'localhost:8080',
  patnerHoshName: 'localhost:8080',
  partner: 'localhost'
}
