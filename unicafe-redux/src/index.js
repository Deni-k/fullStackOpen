import React from 'react';
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import reducer from './reducer'

const store = createStore(reducer)

const App = () => {
  const click = (type) => {
    switch (type) {
      case 'good':
        store.dispatch({type: 'GOOD'})
        break
      case 'ok':
        store.dispatch({type: 'OK'})
        break
      case 'bad':
        store.dispatch({type: 'BAD'})
        break
      case 'undefined':
        store.dispatch({type: 'RESET'})
        break
      default:
        console.log('default')
    }
  }

  return (
    <div>
      <button onClick={()=>click('good')}>good</button>
      <button onClick={()=>click('ok')}>neutral</button>
      <button onClick={()=>click('bad')}>bad</button>
      <button onClick={()=>click('undefined')}>reset stats</button>
      <div>good {store.getState().good}</div>
      <div>neutral {store.getState().ok}</div>
      <div>bad {store.getState().bad}</div>
    </div>
  )
}

const renderApp = () => {
  ReactDOM.render(<App />, document.getElementById('root'))
}

renderApp()
store.subscribe(renderApp)