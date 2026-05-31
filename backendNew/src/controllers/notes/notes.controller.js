'use strict';

const { getOneDataByFilter } = require('../../core/mongoQueryHelper');
const Notes = require('../../models/notes');

const getNotesFromCurrentUser = async (req, res) => {
  const id = req.user.id;
  const notes = await getOneDataByFilter({
    model: Notes,
    filter: { users: id }
  });
  return res.status(200).json(notes);
};

const createNote = async (req, res) => {
  const id = req.user.id;
  const body = req.body;

  return res.status(201).json({});
};

module.exports = { getNotesFromCurrentUser, createNote };
