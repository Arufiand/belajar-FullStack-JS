import { useEffect, useState } from "react";
import FilterComponent from "../components/filter.component.jsx";
import PersonForm from "../components/personform.component.jsx";
import Persons from "../components/persons.component.jsx";

import personServices from "./services/axios.js";
import Notification from "../components/notification.jsx";

const PersonApp = () => {
  const [persons, setPersons] = useState([]);
  const [filter, setFilter] = useState("");
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

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
      const existingPerson = persons.find((p) => p.name === newName);
      if (!existingPerson) return; // defensive

      if (
        window.confirm(
          `${newName} is already added to phonebook. Replace the old number with the new one?`,
        )
      ) {
        const changedPerson = { ...existingPerson, number: newNumber };

        personServices
          .update("persons", existingPerson.id, changedPerson)
          .then((response) => {
            // update local state with server response
            setPersons(
              persons.map((p) =>
                p.id !== existingPerson.id ? p : response.data,
              ),
            );
            setNewName("");
            setNewNumber("");
          })
          .catch((error) => {
            console.error("Failed to update person:", error);
            alert(
              `The information of ${newName} has already been removed from server`,
            );
            setPersons(persons.filter((p) => p.id !== existingPerson.id));
          });
      }
      return;
    }

    const nameObject = {
      name: newName,
      number: newNumber,
      id: persons.length + 1,
    };
    personServices
      .create("persons", nameObject)
      .then((returnedObject) => {
        // Use the server's returned object to keep IDs consistent
        setPersons(persons.concat(returnedObject.data));
        setNewName("");
        setNewNumber("");
      })
      .catch((error) => {
        console.error("Failed to create person:", error);
        setErrorMessage(error.response.data.error);
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
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
      <Notification message={errorMessage} />
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

export default PersonApp;
