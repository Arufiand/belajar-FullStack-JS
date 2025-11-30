import NotesComponent from "../components/notes.jsx";
import {useState} from "react";

const App = (props) => {
    const [notes, setNotes] = useState(props.notes)

    const [newNote, setNewNote] = useState(
        'a new note...'
    )
    const [showAll, setShowAll] = useState(true)

    const notesToShow = showAll ? notes : notes.filter(note => note.important)

    const addNote = (event) => {
        event.preventDefault()
        const noteObject = {
            content: newNote,
            important: Math.random() < 0.5,
            id: notes.length + 1,
        }

        setNotes(notes.concat(noteObject))
        setNewNote('')
        console.log('button clicked', event.target)
    }

    const handleNoteChange = (event) => {
        console.log('button clicked', event.target.value)
        setNewNote(event.target.value)
    }

    return (
        <div>
            <h1>Notes</h1>
            <div>
                <button onClick={() => setShowAll(!showAll)}>
                    show {showAll ? 'important' : 'all'}
                </button>
            </div>
            <ul>
                {notesToShow.map(note =>
                    <NotesComponent key={note.id} note={note} />
                )}
            </ul>
            <form onSubmit={addNote}>

                <input value={newNote} onChange={handleNoteChange} />
                <button type="submit">save</button>
            </form>
        </div>
    )
}

export default App;
