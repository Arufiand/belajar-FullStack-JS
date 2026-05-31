import { getOneDataByFilter } from '../../core/mongoQueryHelper';
import Notes from '../../models/notes';
import {
  ValidateNoteMustExistParams,
  ValidateNoteParams,
  ValidationResult
} from '../../constants/general.interfaces';

const validateNote = async ({
  content
}: ValidateNoteParams): Promise<ValidationResult> => {
  let valid = true;
  let message = '';

  if (!content) {
    valid = false;
    message = "Content can't be empty";
  }
  return { valid, message };
};
const validateNoteMustExist = async ({
  notesId,
  userId
}: ValidateNoteMustExistParams): Promis<ValidationResult> => {
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

export = { validateNote, validateNoteMustExist };
