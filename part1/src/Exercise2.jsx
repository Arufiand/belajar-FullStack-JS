import { useState } from 'react'

const App = () => {
    const [persons, setPersons] = useState([
        { name: 'Arto Hellas', number: '040-123456', id: 1 },
        { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
        { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
        { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
    ])
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
        // return persons.some(person => person.name === name);
        return persons.some(person => person.name === name && person.number === person.number);
    }
    const personsToShow = filter.trim() === ''
        ? persons
        : persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))


    return (
        <div>
            <h2>Phonebook</h2>
            <div>
                filter shown with: <input value={filter} onChange={handleFilterChange} />
            </div>
            <form onSubmit={addName}>
                <div>
                    name: <input value={newName} onChange={handleNameChange}  />
                </div>
                <div>number: <input value={newNumber} onChange={handleNumberChange}/></div>
                <div>
                    <button type="submit">add</button>
                </div>
            </form>
            <h2>Numbers</h2>
            {personsToShow.map(person =>
                <div key={person.id}>{person.name} Phone Number {person.number}</div>
            )}

            <div>debug: {newName}</div>
        </div>
    )
}

export default App
