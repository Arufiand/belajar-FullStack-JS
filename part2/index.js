"use strict";
const express = require("express");
const app = express();

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

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
