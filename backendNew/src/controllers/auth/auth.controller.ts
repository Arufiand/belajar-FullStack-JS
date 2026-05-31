import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { postData } from '../../core/mongoQueryHelper';
import User from '../../models/users';
import { validateAuthRegister, validateAuthLogin } from './auth.validate';

const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { body } = req;
  const validationUser = await validateAuthRegister(body);
  if (!validationUser.valid) {
    res.status(400).json({ error: validationUser.message });
    return;
  }
  const salt = bcrypt.genSaltSync(parseInt(process.env.SALT as string));
  const passwordHash = await bcrypt.hash(body.password, salt);
  const user = await postData({
    model: User,
    data: { username: body.username, name: body.name, passwordHash }
  });
  res.status(201).json(user);
};

const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;
  const validation = await validateAuthLogin({ username, password });
  if (!validation.valid) {
    res.status(400).json({ error: validation.message });
    return;
  }
  const { user } = validation;
  const passwordCorrect = await bcrypt.compare(password, user.passwordHash);
  if (!passwordCorrect) {
    res.status(401).json({ error: 'Invalid username or password' });
    return;
  }
  const token = jwt.sign(
    { username: user.username, id: user._id },
    process.env.SECRET as string,
    { expiresIn: 60 * 60 }
  );
  res.status(200).json({ token, username: user.username, name: user.name });
};

export { registerUser, loginUser };
