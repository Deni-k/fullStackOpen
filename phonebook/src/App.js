import React, { useState, useEffect } from 'react'
import Filter from './Filter'
import PersonForm from './PersonForm'
import Persons from './Persons'
import Service from './services/Service'
import Message from './Message'
const App = () => {
  const [ persons, setPersons] = useState([])
  const [newFilteredPersons, setFilteredPersons] = useState(persons);
  const [newFilter, setNewFilter] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(false);
  useEffect(()=>{
      Service.getAll().then(initialPersons => {
        setPersons(initialPersons);
        setFilteredPersons(initialPersons);
      })
  }, []);
  return (
    <div>
      <Message message={message} error={error}/>
      <h2>Phonebook</h2>
      <Filter persons={persons} setPersons={setFilteredPersons} newFilter={newFilter} setNewFilter={setNewFilter}></Filter>
      <h3>add a new</h3>
      <PersonForm persons={persons} setPersons={setPersons} setNewFilter={setNewFilter} setFilteredPersons={setFilteredPersons} setMessage={setMessage}></PersonForm>
      <h2>Numbers</h2>
      <Persons newFilteredPersons={newFilteredPersons} persons={persons} setPersons={setPersons} setFilteredPersons={setFilteredPersons} setError={setError} setMessage={setMessage}></Persons>
    </div>
  )
}

export default App