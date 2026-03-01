const NotesComponent = ({ note, toggleImportance }) => {
  const label = note.important ? "make not important" : "make important";
  return (
    <li className="note" key={note.id}>
      {note.title}
      <button onClick={toggleImportance}>{label}</button>
    </li>
  );
};
export default NotesComponent;
