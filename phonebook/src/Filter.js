import React from 'react'
const Filter = ({persons, setPersons, newFilter, setNewFilter}) => {
    const filter = (event) => {
        setNewFilter(event.target.value);
        setPersons(persons.filter((person) => person.name.trim().toLowerCase().includes(event.target.value.trim().toLowerCase())));
    }
    return(
        <div>
        filter shown with<input value={newFilter}
                                onChange={filter}/>
        </div>
    )
}
export default Filter