'use strict';

import express from 'express';
import { registerUser, loginUser } from '../controllers/auth/auth.controller';

const authRouter = express.Router();

authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);

exports = authRouter;
