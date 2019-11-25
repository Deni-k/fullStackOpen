import axios from 'axios'
const baseUrl = '/api/users'

const deleteAll = async () => {
  const response = await axios.delete(baseUrl)
  return response
}
const createUser = async (user) => {
  const response = await axios.post(baseUrl, user)
  return response.data
}
const getAll = async () => {
  const reponse = await axios.get(baseUrl)
  return reponse.data
}
const get = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}`)
  return response.data
}
export default {getAll, get, deleteAll, createUser}