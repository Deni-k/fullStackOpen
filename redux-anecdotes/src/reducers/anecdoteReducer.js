//  const getId = () => (100000 * Math.random()).toFixed(0)
import anecdoteService from '../services/anecdotes'
const reducer = (state = [], action) => {
  switch (action.type){
    case 'NEW_ANECDOTE':
      return [...state, action.data]
    case 'VOTE':
      const id = action.data.id
      const changed = action.data.content
      return state.map(s => s.id !== id ? s : changed)
    case 'INIT_ANECDOTES':
      return action.data
    default:
  }  
  return state
}
export const createAnecdote = (content) => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch({
      type: 'NEW_ANECDOTE',
      data: newAnecdote
    })
  }
}
export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch({
      type: 'INIT_ANECDOTES',
      data: anecdotes,
    })
}}
export const voteForAnecdote = (id, content) => {
  return async dispatch => {
    console.log(id,content)
    await anecdoteService.update(content, id)
    dispatch({
      type: 'VOTE',
      data: { id,
              content}
    })
  }
}

export default reducer