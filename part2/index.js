"use strict";
const express = require("express");
const { RequestLogger, unknownEndpoint } = require("./request_logger");
const app = express();
const cors = require("cors");
const notesRouter = require("./routes/note_router");

app.use(cors());
app.use(express.json());
app.use(RequestLogger);
app.use("/api/notes", notesRouter);

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
