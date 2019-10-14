import React from 'react'
import Service from './services/Service'
const Persons = ({newFilteredPersons, persons, setPersons, setFilteredPersons, setError, setMessage}) => {
    const deletePerson = (id) => {
        const ask = persons.filter((person) => person.id === id);
        const result = window.confirm(`Delete ${ask[0].name}?`)
        if(result===true){
            const person = persons.filter((person) => person.id !== id);
            const changedPersons = [...person];
            Service.del(id).then(returnedPersons => {
                setPersons(changedPersons);
                setFilteredPersons(changedPersons);
            }).catch(error => {
                setError(true);
                setMessage(`Information of ${ask.name} has alread been removed from the server`);
            })
        }        
    }
    return(
        <div>
            {newFilteredPersons.map((person)=><div key={person.id}>{person.name}  {person.number}<button onClick={()=> deletePerson(person.id)}>delete</button></div>)}
        </div>
    )
}
export default Persons