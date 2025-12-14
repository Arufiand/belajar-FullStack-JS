import {useEffect, useState} from 'react'
import FilterComponent from '../components/filter.component.jsx'
import PersonForm from '../components/personform.component.jsx'
import Persons from '../components/persons.component.jsx'
import axios from "axios";

const App = () => {
    const [persons, setPersons] = useState([

    ]);

    useEffect(() => {
        async function fetchPersons () {
            const personData = await axios.get('http://localhost:3001/persons');
            setPersons(personData.data);
        }
        fetchPersons();
    }, []);

    const [filter, setFilter] = useState('')
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')

    const handleFilterChange = (event) => {
        setFilter(event.target.value)
    }

    const handleNameChange = (event) => {
        console.log(event.target.value)
        setNewName(event.target.value)
    }
    const addName = (event) => {
        event.preventDefault()
        console.log('button clicked', event.target)
        if(checkDuplicate(newName)) {
            alert(`${newName} is already added to phonebook`)
            return
        }

        const nameObject = {
            name: newName,
            number: newNumber,
            id : persons.length + 1,
        }
        setPersons(persons.concat(nameObject))
        setNewName('')
        setNewNumber('')
        // Add the new name to the persons array
    }

    const handleNumberChange = (event) => {
        console.log(event.target.value)
        setNewNumber(event.target.value)
        // Implement number change handling if needed
    }

    const checkDuplicate = (name) => {
        // fixed: compare names only
        return persons.some(person => person.name === name);
    }
    const personsToShow = filter.trim() === ''
        ? persons
        : persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

    return (
        <div>
            <h2>Phonebook</h2>

            <FilterComponent filter={filter} handleFilterChange={handleFilterChange} />

            <h3>Add a new</h3>

            <PersonForm
                newName={newName}
                newNumber={newNumber}
                handleNameChange={handleNameChange}
                handleNumberChange={handleNumberChange}
                addName={addName}
            />

            <h3>Numbers</h3>

            <Persons personsToShow={personsToShow} />

            <div>debug: {newName}</div>
        </div>
    )
}

export default App
