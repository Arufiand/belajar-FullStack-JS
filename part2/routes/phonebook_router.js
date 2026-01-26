"use strict";
const express = require("express");
const phonebook = require("../models/phonebook");
const phonebookRouter = express.Router();

phonebookRouter.get("/", (request, response) => {
  response.json(phonebook);
});

phonebookRouter.get("/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = phonebook.find((person) => person.id === id);
  if (!person) {
    return response.status(404).json({ error: "person not found" });
  }
  response.json(person);
});

phonebookRouter.post("/", (request, response) => {
  const body = request.body;
  if (!body.name || !body.number) {
    return response.status(400).json({ error: "name and number required" });
  }
  if (phonebook.find((p) => p.name === body.name || p.number === body.number))
    return response
      .status(400)
      .json({ error: "name and / or number must be unique" });

  const person = {
    name: body.name,
    number: body.number,
  };
  phonebook = phonebook.concat(person);
  response.status(201).json(person);
});

phonebookRouter.delete("/:id", (request, response) => {
  const id = Number(request.params.id);
  phonebook = phonebook.filter((person) => person.id !== id);
  response.status(204).end();
});

phonebookRouter.put("/:id", (request, response) => {
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

module.exports = phonebookRouter;
