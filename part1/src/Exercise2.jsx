import { useState } from 'react'

const App = () => {
    const [persons, setPersons] = useState([
        { name: 'Arto Hellas' }
    ])
    const [newName, setNewName] = useState('')

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
            name: newName
        }
        setPersons(persons.concat(nameObject))
        setNewName('')
        // Add the new name to the persons array
    }

    const checkDuplicate = (name) => {
        return persons.some(person => person.name === name);
    }

    return (
        <div>
            <h2>Phonebook</h2>
            <form onSubmit={addName}>
                <div>
                    name: <input onChange={handleNameChange}  />
                </div>
                <div>
                    <button type="submit">add</button>
                </div>
            </form>
            <h2>Numbers</h2>
            {persons.map(person =>
            <div key={person.name}>{person.name}</div>
            )}

            <div>debug: {newName}</div>
        </div>
    )
}

export default App
