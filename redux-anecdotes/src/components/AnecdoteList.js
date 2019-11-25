import React from 'react'
import { connect } from 'react-redux'
import {voteForAnecdote} from '../reducers/anecdoteReducer'
import {createNotification} from '../reducers/notificationReducer'
const AnecdoteList = (props) => {
  const vote = (id) => {
    const anecdote = props.visibleAnecdotes.find((anecdote) => anecdote.id === id)
    const changed = {...anecdote, votes: anecdote.votes+1} 
    props.voteForAnecdote(id, changed)
    props.createNotification(`you voted ${anecdote.content}`, 5)
  }
  return(
    <div>
      {props.visibleAnecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}
const mapDispatchToProps = {
  voteForAnecdote,
  createNotification,
}
const anecdotesToShow = ({anecdote, filter}) => {
  if(filter === ''){
    return anecdote.sort((a,b)=>{return b.votes-a.votes})
  }
  else{
    return anecdote.sort((a,b)=>{return b.votes-a.votes}).filter((anecdote) => anecdote.content.trim().toLowerCase().includes(filter.trim().toLowerCase()))
  }
}
const mapStateToProps = (state) => {
  return {
    visibleAnecdotes: anecdotesToShow(state),
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AnecdoteList)
