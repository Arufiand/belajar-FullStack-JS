'use strict';
const express = require('express');
const Persons = require('../models/phonebook');
const phonebookRouter = express.Router();

phonebookRouter.get('/', (request, response) => {
  Persons.find({}).then((persons) => response.json(persons));
});

phonebookRouter.get('/:id', async (request, response, next) => {
  try {
    const person = await Persons.findById(request.params.id);
    if (!person) {
      response.statusMessage = 'person not found';
      return response.status(404).json({ error: 'person not found' });
    }
    response.json(person);
  } catch (error) {
    next(error);
  }
});

phonebookRouter.delete('/:id', async (request, response, next) => {
  try {
    const deleted = await Persons.findByIdAndDelete(request.params.id);
    if (!deleted) {
      response.statusMessage = 'person not found';
      return response.status(404).json({ error: 'person not found' });
    }
    response.status(204).end();
  } catch (error) {
    next(error);
  }
});

phonebookRouter.post('/', async (request, response, next) => {
  const { name, number } = request.body;
  if (!name || !number) {
    return response.status(400).json({ error: 'name and number required' });
  }

  try {
    const existing = await Persons.findOne({
      $or: [{ name }, { number }],
    });

    if (existing) {
      return response
        .status(400)
        .json({ error: 'name and / or number must be unique' });
    }

    const person = new Persons({
      name,
      number,
    });

    const savedPerson = await person.save();
    return response.status(201).json(savedPerson);
  } catch (error) {
    next(error);
  }
});

phonebookRouter.put('/:id', async (request, response, next) => {
  const body = request.body;
  const update = {
    name: body.name,
    number: body.number,
  };

  try {
    const updated = await Persons.findByIdAndUpdate(request.params.id, update, {
      new: true,
      runValidators: true,
      context: 'query',
    });

    if (!updated) {
      response.statusMessage = 'person not found';
      return response.status(404).json({ error: 'person not found' });
    }

    response.json(updated);
  } catch (error) {
    next(error);
  }
});

module.exports = phonebookRouter;
