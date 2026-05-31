import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import {
  getAllData,
  getDataFromId,
  deleteData,
  updateData
} from '../../core/mongoQueryHelper';
import User from '../../models/users';
import { validateUserUpdate } from './users.validate';

const getAllUsers = async (_req: Request, res: Response): Promise<void> => {
  const users = await getAllData({
    model: User,
    populate: { path: 'notes', select: { content: 1, important: 1 } }
  });
  res.status(200).json(users);
};

const getUserById = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id as string;
  const user = await getDataFromId({ model: User, id });
  if (!user) {
    res.status(404).json({ error: 'Not Found' });
  } else {
    res.status(200).json(user);
  }
};

const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const id = req.user!.id;
  const user = await deleteData({ model: User, id });
  if (!user) {
    res.status(404).json({ error: 'Not Found' });
  } else {
    res.status(200).json(user);
  }
};

const updateUser = async (req: Request, res: Response): Promise<void> => {
  const id = req.user!.id;
  const { body } = req;
  const validationUser = await validateUserUpdate({ data: body, id });
  if (!validationUser.valid) {
    res.status(400).json({ error: validationUser.message });
    return;
  }
  const updateFields: Record<string, unknown> = { ...body };
  if (updateFields.password) {
    const salt = bcrypt.genSaltSync(parseInt(process.env.SALT as string));
    updateFields.passwordHash = await bcrypt.hash(
      updateFields.password as string,
      salt
    );
    delete updateFields.password;
  }
  const user = await updateData({ model: User, id, data: updateFields });
  if (!user) {
    res.status(404).json({ error: 'Not Found' });
  } else {
    res.status(200).json(user);
  }
};

export { getAllUsers, getUserById, deleteUser, updateUser };
