import api from '../api'

export function login({username, password}) {
  return api.post('/auth/login/', {username, password})
}

export function signup({email, username, password}) {
  return api.post('/auth/signup/', {email, username, password})
}

export function getUser() {
  return api.get('/auth/user/')
}

export function logout() {
  return api.post('/auth/logout/')
}

export function deleteAccount() {
  return api.delete('/auth/delete/')
}