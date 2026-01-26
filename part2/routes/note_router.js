// javascript
"use strict";
const express = require("express");
const notesRouter = express.Router();

const Note = require("../models/notes");

notesRouter.get("/", (request, response) => {
  Note.find({}).then((notes) => {
    response.json(notes);
  });
});

notesRouter.get("/:id", async (request, response, next) => {
  try {
    const note = await Note.findById(request.params.id);
    if (!note) {
      response.statusMessage = "note not found";
      return response.status(404).json({ error: "note not found" });
    }
    response.json(note);
  } catch (error) {
    next(error);
  }
});

notesRouter.delete("/:id", async (request, response, next) => {
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

notesRouter.post("/", async (request, response, next) => {
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
    response.status(201).json(savedNote);
  } catch (error) {
    next(error);
  }
});

module.exports = notesRouter;
