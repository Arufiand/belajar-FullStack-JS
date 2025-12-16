import { useEffect, useState } from "react";
import FilterComponent from "../components/filter.component.jsx";
import PersonForm from "../components/personform.component.jsx";
import Persons from "../components/persons.component.jsx";

import personServices from "./services/axios.js";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [filter, setFilter] = useState("");
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");

  useEffect(() => {
    personServices.getAll("persons").then((response) => {
      setPersons(response.data);
    });
  }, []);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleNameChange = (event) => {
    console.log(event.target.value);
    setNewName(event.target.value);
  };
  const addName = (event) => {
    event.preventDefault();
    if (checkDuplicate(newName)) {
      alert(`${newName} is already added to phonebook`);
      return;
    }

    const nameObject = {
      name: newName,
      number: newNumber,
      id: persons.length + 1,
    };
    personServices.create("persons", nameObject).then((returnedObject) => {
      setPersons(persons.concat(returnedObject.data));
      setNewName("");
      setNewNumber("");
    });
  };

  const handleNumberChange = (event) => {
    console.log(event.target.value);
    setNewNumber(event.target.value);
    // Implement number change handling if needed
  };

  const checkDuplicate = (name) => {
    // fixed: compare names only
    return persons.some((person) => person.name === name);
  };
  const personsToShow =
    filter.trim() === ""
      ? persons
      : persons.filter((person) =>
          person.name.toLowerCase().includes(filter.toLowerCase()),
        );

  const handleDeletePerson = (id, name) => {
    if (!window.confirm(`Delete ${name}?`)) return;

    personServices
      .remove("persons", id)
      .then(() => {
        setPersons(persons.filter((p) => p.id !== id));
      })
      .catch((error) => {
        console.error("Failed to delete person:", error);
        alert(`Information of ${name} has already been removed from server`);
        setPersons(persons.filter((p) => p.id !== id));
      });
  };

  return (
    <div>
      <h2>Phonebook</h2>

      <FilterComponent
        filter={filter}
        handleFilterChange={handleFilterChange}
      />

      <h3>Add a new</h3>

      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        addName={addName}
      />

      <h3>Numbers</h3>

      <Persons personsToShow={personsToShow} onDelete={handleDeletePerson} />

      <div>debug: {newName}</div>
    </div>
  );
};

export default App;
