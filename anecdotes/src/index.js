import React, { useState } from 'react'
import ReactDOM from 'react-dom'
let firstRun = true;
function indexOfMax(arr) {
    if (Object.keys(arr).length === 0) {
        return -1;
    }

    let max = arr[0];
    let maxIndex = 0;

    for (let i = 1; i < Object.keys(arr).length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }
    return maxIndex;
}
const App = (props) => {
  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState(Array.apply(null, new Array(6)).map(Number.prototype.valueOf,0));
  const [maxVote, setMaxVote] = useState(0);
  const nextAnecdote= () =>{
    setSelected(Math.ceil(Math.random()*6));
  }
  const vote = () =>{
      const copy = {...votes};
      copy[selected] +=1;
      setMaxVote(indexOfMax(copy));
      setVotes(copy);
  }
  if(firstRun === true){
    setSelected(Math.ceil(Math.random()*6));
    firstRun = false; 
  }
//   setSelected(Math.ceil(Math.random()*6));
  return (
    <div>
      <h1>Anecdote of the day</h1>
      {props.anecdotes[selected]}
      <p></p>
      has {votes[selected]} votes
      <p></p>
      <button onClick={vote}>vote</button>
      <button onClick={nextAnecdote}>next anecdote</button>
      <h1>Anecdote with most votes</h1>
      {props.anecdotes[maxVote]}
    </div>
  )
}
const anecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

ReactDOM.render(
  <App anecdotes={anecdotes} />,
  document.getElementById('root')
)