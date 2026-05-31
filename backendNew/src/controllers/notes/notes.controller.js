'use strict';

const {
  getOneDataByFilter,
  postData,
  updateData,
  deleteData
} = require('../../core/mongoQueryHelper');
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
  const { content, importance } = req.body;
  const note = await postData({
    model: Notes,
    data: {
      content, // required, from client
      importance: importance ?? false, // optional, default false
      date: new Date(), // set server-side
      users: id // owner, from JWT — never trust client for this
    }
  });
  return res.status(201).json(note);
};

const updateNote = async (req, res) => {
  const userId = req.user.id;
  const notesId = req.params.id;
  const { content, importance } = req.body;

  // verify the note belongs to the logged-in user
  const existing = await getOneDataByFilter({
    model: Notes,
    filter: { _id: notesId, users: userId },
    single: true
  });
  if (!existing) {
    return res
      .status(404)
      .json({ error: 'Note not found or not owned by user' });
  }

  const note = await updateData({
    model: Notes,
    id: notesId,
    data: { content, importance, updatedAt: new Date() } // updatedAt goes inside data
  });
  return res.status(200).json(note);
};

const deleteNote = async (req, res) => {
  const id = req.user.id;
  const noteId = req.params.id;
  const existing = await getOneDataByFilter({
    model: Notes,
    filter: { _id: noteId, users: id },
    single: true
  });

  if (!existing) {
    return res
      .status(404)
      .json({ error: 'Note not found or not owned by user' });
  }
  const note = await deleteData({ model: Notes, id: noteId });
  return res.status(200).json(note);
};

module.exports = {
  getNotesFromCurrentUser,
  createNote,
  updateNote,
  deleteNote
};
