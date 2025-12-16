const Persons = ({ personsToShow = [], onDelete }) => {
  return (
    <>
      {personsToShow.map((person) => (
        <div key={person.id}>
          {person.name} Phone Number {person.number}{" "}
          <button
            onClick={() => (onDelete ? onDelete(person.id, person.name) : null)}
          >
            delete
          </button>
        </div>
      ))}
    </>
  );
};

export default Persons;
