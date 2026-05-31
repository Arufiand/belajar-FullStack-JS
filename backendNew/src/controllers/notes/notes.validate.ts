import { getOneDataByFilter } from '../../core/mongoQueryHelper';
import Notes from '../../models/notes';

const validateNote = async ({ content }) => {
  let valid = true;
  let message = '';

  if (!content) {
    valid = false;
    message = "Content can't be empty";
  }
  return { valid, message };
};
const validateNoteMustExist = async ({ notesId, userId }) => {
  let valid = true;
  let message = '';

  const note = await getOneDataByFilter({
    model: Notes,
    filter: { _id: notesId, users: userId },
    single: true
  });
  if (!note) {
    valid = false;
    message = 'Note not found or not owned by user';
  }

  return { valid, message };
};

exports = { validateNote, validateNoteMustExist };
