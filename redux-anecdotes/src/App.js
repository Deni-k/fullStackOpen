import React from 'react'
import { useEffect } from 'react'
import { connect } from 'react-redux'
import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import Notification from './components/Notification'
import Filter from './components/Filter';
import { initializeAnecdotes } from './reducers/anecdoteReducer'
const App = (props) => {
  useEffect(() => {
      props.initializeAnecdotes()
  })
  return (
    <div>
      <Notification></Notification>
      <h2>Anecdotes</h2>
      <Filter></Filter>
      <AnecdoteList></AnecdoteList>
      <AnecdoteForm></AnecdoteForm>
    </div>
  )
}

export default connect(null, { initializeAnecdotes })(App)