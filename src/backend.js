import api from '@/api'
import config from '@/config'

export async function getAllCompanies(params){
  return await api.get(`${config.backend}/companies`, params)
}

export async function getCompany(id){
  return await api.get(`${config.backend}/companies/${id}`)
}

export async function addCompany(params){
  return await api.post(`${config.backend}/companies`, params)
}

export async function updateCompany(params, id){
  return await api.put(`${config.backend}/companies/${id}`, params)
}

export async function deleteCompany(id){
  return await api.delete(`${config.backend}/companies/${id}`)
}


export async function getAllDepartments(params){
  return await api.get(`${config.backend}/departments`, params)
}

export async function addDepartment(params){
  return await api.post(`${config.backend}/departments`, params)
}

export async function updateDepartment(params, id){
  return await api.put(`${config.backend}/departments/${id}`, params)
}

export async function deleteDepartment(id){
  return await api.delete(`${config.backend}/departments/${id}`)
}

export async function LoginUser(params){
  return await api.post(`${config.backend}/me`, params)
}

export async function CreateUser(params){
  return await api.post(`${config.backend}/users`, params)
}
