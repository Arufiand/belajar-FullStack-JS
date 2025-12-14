const Persons = ({ personsToShow = [] }) => {
  return (
    <>
      {personsToShow.map((person) => (
        <div key={person.id}>
          {person.name} Phone Number {person.number}
        </div>
      ))}
    </>
  );
};

export default Persons;
