import { useState } from 'react'

const App = () => {
    const [persons, setPersons] = useState([
        { name: 'Arto Hellas', number : '123-14141' }
    ])
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')

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
        return persons.find(person => person.name === name && person.number === person.number);
    }

    return (
        <div>
            <h2>Phonebook</h2>
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
            {persons.map(person =>
            <div key={person.name}>{person.name} Phone Number {person.number}</div>
            )}

            <div>debug: {newName}</div>
        </div>
    )
}

export default App
