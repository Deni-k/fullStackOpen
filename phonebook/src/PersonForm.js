import React, { useState } from 'react'
import Service from './services/Service';
const PersonForm = ({persons, setPersons, setNewFilter, setFilteredPersons, setMessage, setError}) => {
    const [ newName, setNewName ] = useState('')
    const [ newNumber, setNewNumber] = useState('')
    const handleNameChange = (event) => {
        setNewName(event.target.value);
    }
    const handleNumberChange = (event) => {
        setNewNumber(event.target.value);
    }
    const addName = (event) => {
        event.preventDefault();
        const person = {
            name: newName,
            number: newNumber
        }
        const test = [person,...persons];
        const b = test.filter((a)=> a.name===person.name);
        if(b.length>=2){
            const result = window.confirm(`${newName} is already added to phonebook,replace the old number with a new one?`);
            if(result === true){
                const person = persons.find((p)=> p.id === b[1].id);
                const changedPerson = { ...person, number : newNumber}
                Service.update(b[1].id, changedPerson).then(
                    returnedPerson =>{
                        setPersons(persons.map((p) => p.id !== b[1].id ? p : returnedPerson));
                        setFilteredPersons(persons.map((p) => p.id !== b[1].id ? p : returnedPerson));
                        setMessage(`Number changed ${returnedPerson.name}`);
                        setTimeout(() => {
                            setMessage(null)
                            }, 5000);
                        }
                )
            }
        }
        else{
            Service.create(person).then(returnedPerson => {
                setPersons(persons.concat(returnedPerson));
                setFilteredPersons(persons.concat(returnedPerson));
                setMessage(`Added ${returnedPerson.name}`);
                setTimeout(() => {
                    setMessage(null)
                  }, 5000);
            }).catch( error =>{
                setError(true);
                setMessage(error.response.data.error);
            });
            setNewName('');
            setNewNumber('');
            setNewFilter('');
        }
    }  
    return(
        <form onSubmit={addName}>
            <div>
            name: <input value={newName}
                        onChange={handleNameChange}/>
            </div>
            <div>
            number: <input value={newNumber}
                            onChange={handleNumberChange}/>
            </div>
            <div>
            <button type="submit">add</button>
            </div>
        </form>
    )
}
export default PersonForm