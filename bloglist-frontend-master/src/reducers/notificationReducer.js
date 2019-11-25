const notificationReducer = (state = {message: '', error: false}, action) => {
  switch(action.type){
    case 'NEW_SUCESS_NOTIFICATION':
      return {message: action.message, error: false}
    case 'NEW_ERROR_NOTIFICATION':
      return {message: action.message, error: true}
    default:
      return state
  }
}
export const createNotification = (message, seconds) => {
  return async dispatch => {
    dispatch({
      type: 'NEW_SUCESS_NOTIFICATION',
      message
    })
    setTimeout(() => {
      dispatch({
        type: 'NEW_SUCESS_NOTIFICATION',
        message: ''
      })
    }, seconds*1000)
  
  }
}
export const createErrorNotification = (message, seconds) => {
  return async dispatch => {
    dispatch({
      type: 'NEW_ERROR_NOTIFICATION',
      message
    })
    setTimeout(() => {
      dispatch({
        type: 'NEW_EROOR_NOTIFICATION',
        message: ''
      })
    }, seconds*1000)
  
  }
}
export default notificationReducer