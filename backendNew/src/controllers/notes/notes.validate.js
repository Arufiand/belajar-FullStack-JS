const { getOneDataByFilter } = require('../../core/mongoQueryHelper');
const Notes = require('../../models/notes');

const validateNote = async ({ content }) => {
  let valid = true;
  let message = '';

  if (!content) {
    valid = false;
    message = "Content can't be empty";
  }
  return { valid, message };
};
/** * @param {{ notesId: string, userId: string, content?: string }} params */
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

module.exports = { validateNote, validateNoteMustExist };
