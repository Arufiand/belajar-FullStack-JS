"use strict";
const express = require("express");
const app = express();

app.use(express.json());

let notes = [
  { id: 1, title: "First note", importance: true },
  { id: 2, title: "Second note", importance: false },
  { id: 3, title: "Third note", importance: true },
];

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/notes", (request, response) => {
  response.json(notes);
});

app.get("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  console.log("requested id (as number):", id);

  const note = notes.find((note) => note.id === id);
  if (!note) {
    console.log(`note with id ${id} not found`);
    response.statusMessage = "note not found";
    return response.status(404).json({ error: "note not found" });
  }

  console.log("found note:", JSON.stringify(note));
  response.json(note);
});

app.delete("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  notes = notes.filter((note) => note.id !== id);

  response.status(204).end();
});

app.post("/api/notes", (request, response) => {
  const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
  const note = request.body;
  note.id = maxId + 1;
  notes = notes.concat(note);
  console.log("new note:", JSON.stringify(note));
  response.json(note);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
