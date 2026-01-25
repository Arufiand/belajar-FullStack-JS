"use strict";
const express = require("express");
const { RequestLogger, unknownEndpoint } = require("./request_logger");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(RequestLogger);

const Note = require("./models/notes");
const { generateId } = require("./helper/general_helper");

let phonebook = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/notes", (request, response) => {
  Note.find({}).then((notes) => {
    response.json(notes);
  });
});

// javascript
app.get("/api/notes/:id", async (request, response, next) => {
  try {
    const note = await Note.findById(request.params.id);
    if (!note) {
      response.statusMessage = "note not found";
      return response.status(404).json({ error: "note not found" });
    }
    console.log("found note:", JSON.stringify(note));
    response.json(note);
  } catch (error) {
    next(error);
  }
});

app.delete("/api/notes/:id", async (request, response, next) => {
  try {
    const deleted = await Note.findByIdAndDelete(request.params.id);
    if (!deleted) {
      response.statusMessage = "note not found";
      return response.status(404).json({ error: "note not found" });
    }
    response.status(204).end();
  } catch (error) {
    next(error);
  }
});

app.post("/api/notes", async (request, response) => {
  const body = request.body;
  if (!body || !body.content) {
    return response.status(400).json({ error: "content missing" });
  }

  const note = new Note({
    content: body.content,
    importance: body.importance === undefined ? false : body.importance,
  });

  try {
    const savedNote = await note.save();
    response.status(201).json(savedNote); // set status before json
  } catch (error) {
    response.status(400).json({ error: "error creating new note" });
  }
});

app.get("/api/persons", (request, response) => {
  response.json(phonebook);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = phonebook.find((person) => person.id === id);
  if (!person) {
    return response.status(404).json({ error: "person not found" });
  }
  response.json(person);
});

app.post("/api/persons", (request, response) => {
  const body = request.body;
  if (!body.name || !body.number) {
    return response.status(400).json({ error: "name and number required" });
  }
  if (phonebook.find((p) => p.name === body.name || p.number === body.number))
    return response
      .status(400)
      .json({ error: "name and / or number must be unique" });

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };
  phonebook = phonebook.concat(person);
  response.status(201).json(person);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  phonebook = phonebook.filter((person) => person.id !== id);
  response.status(204).end();
});

app.put("/api/persons/:id", (request, response) => {
  const body = request.body;
  const id = Number(request.params.id);
  const person = phonebook.find((person) => person.id === id);
  if (!person) {
    return response.status(404).json({ error: "person not found" });
  }
  person.name = body.name || person.name;
  person.number = body.number || person.number;
  response.json(person);
});

app.get("/api/info", (request, response) => {
  // number of people in phonebook
  const names = phonebook.length;
  console.log("names:", names);
  const messages = "Phonebook has info for " + names + " people";
  const date = new Date();
  response.send(messages + "<br>" + date);
});

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
