import axios from 'axios'
const baseUrl = '/api/blogs/'
let token = null
const setToken = newToken =>{
  token = `bearer ${newToken}`
}
const deleteAll = async () => {
  const response = await axios.delete(baseUrl)
  return response
}
const comment = (id, comment)=> {
  const config = {
    headers: {Authorization: token}
  }
  const response = axios.post(`${baseUrl}/${id}/comments`, { comment }, config)
  return response.data
}
const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}
const get = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}`)
  return response.data
}
const create = async newObject => {
  const config = {
    headers: {Authorization: token}
  }
  const response = await axios.post(baseUrl,newObject,config)
  return response.data
}
const update = async (id, newObject) => {
  const config = {
    headers: {Authorization: token}
  }
  const response = await axios.put(`${baseUrl}/${id}`,newObject, config);
  return response.data
}
const del = async (id) => {
  const config = {
    headers: {Authorization: token}
  }
  const response = await axios.delete(`${baseUrl}/${id}`,config)
  return response
}

export default { getAll, create, setToken, update , del, get, comment, deleteAll}