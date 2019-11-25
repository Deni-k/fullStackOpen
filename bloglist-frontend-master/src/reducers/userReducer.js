import loginService from '../services/login'
import userService from '../services/user'
import blogService from '../services/blogs'
import {createErrorNotification} from './notificationReducer'
const userReducer = (state = {}, action) => {
  switch (action.type)  {
  case "LOGIN":
    return {users: state.users, loggedInUser: action.data, selectedUser: state.selectedUser}
  case "LOGOUT":
    return {users: state.users, loggedInUser: action.data, selectedUser: state.selectedUser}
  case "INIT_USERS":
    return {users: action.data, loggedInUser: state.loggedInUser, selectedUser: state.selectedUser}
  case "SELECT":
    return{users: state.users, loggedInUser: state.loggedInUser, selectedUser: action.data} 
  default:
    return state
  }

}
export const login = (loginCredentials) => {
  return async dispatch => {
    try{
      const user = await loginService.login({
        username: loginCredentials.username, password: loginCredentials.password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      ) 
      blogService.setToken(user.token)
      dispatch({
        type: 'LOGIN',
        data:{ 
          name: loginCredentials.username,
          id: user.id
        }
      })
    } catch(error){
      dispatch(createErrorNotification('wrong username or password', 5))
    }   
  }
}
export const initializeUsers = () => {
  return async dispatch => {
    const users = await userService.getAll()
    dispatch({
      type: 'INIT_USERS',
      data: users
    })
  }
  
}
export const relog = (loginCredentials) => {
  blogService.setToken(loginCredentials.token)
  return {
    type: 'LOGIN',
    data: loginCredentials
  }
}
export const logout = () => {
  window.localStorage.removeItem('loggedBlogappUser')
  return {
    type: "LOGOUT",
    data: null
  }
}
export const setSelectedUser = (id) => {
  return async dispatch => {
    const selectedUser = await userService.get(id)
    dispatch({
      type: 'SELECT',
      data: selectedUser
    })
  }
}

export default userReducer