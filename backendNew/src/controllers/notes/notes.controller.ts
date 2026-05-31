import { Request, Response } from 'express';
import {
  getOneDataByFilter,
  postData,
  updateData,
  deleteData
} from '../../core/mongoQueryHelper';
import Notes from '../../models/notes';
import { validateNote, validateNoteMustExist } from './notes.validate';

const getNotesFromCurrentUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = req.user!.id;
  const notes = await getOneDataByFilter({
    model: Notes,
    filter: { users: id }
  });
  res.status(200).json(notes);
};

const createNote = async (req: Request, res: Response): Promise<void> => {
  const id = req.user!.id;
  const { content, importance } = req.body;
  const validate = await validateNote({ content });
  if (!validate.valid) {
    res.status(400).json({ error: validate.message });
    return;
  }
  const note = await postData({
    model: Notes,
    data: {
      content,
      importance: importance ?? false,
      date: new Date(),
      users: id
    }
  });
  res.status(201).json(note);
};

const updateNote = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.id;
  const notesId = req.params.id as string;
  const { content, importance } = req.body;
  const validate = await validateNoteMustExist({ notesId, userId });
  if (!validate.valid) {
    res.status(400).json({ error: validate.message });
    return;
  }
  const note = await updateData({
    model: Notes,
    id: notesId,
    data: { content, importance, updatedAt: new Date() }
  });
  res.status(200).json(note);
};

const deleteNote = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.id;
  const noteId = req.params.id as string;
  const validate = await validateNoteMustExist({ notesId: noteId, userId });
  if (!validate.valid) {
    res.status(400).json({ error: validate.message });
    return;
  }
  const note = await deleteData({ model: Notes, id: noteId });
  res.status(200).json(note);
};

export { getNotesFromCurrentUser, createNote, updateNote, deleteNote };
