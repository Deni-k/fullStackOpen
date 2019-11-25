const notificationReducer = (state = '', action) => {
  switch(action.type){
    case 'NEW_NOTIFICATION':
      return action.notification
    default:
      return state
  }
}
export const createNotification = (notification, seconds) => {
  return async dispatch => {
    dispatch({
      type: 'NEW_NOTIFICATION',
      notification
    })
    setTimeout(() => {
      dispatch({
        type: 'NEW_NOTIFICATION',
        notification: ''
      })
    }, seconds*1000)
  
  }
}
export default notificationReducer