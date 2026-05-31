import { getOneDataByFilter } from '../../core/mongoQueryHelper';
import User from '../../models/users';
import {
  AuthParams,
  AuthLoginResult,
  ValidationResult
} from '../../constants/general.interfaces';

const validateAuthRegister = async ({
  username,
  password,
  name
}: AuthParams): Promise<ValidationResult> => {
  let valid = true;
  let message = '';

  if (!username) {
    valid = false;
    message = 'Username is required';
  } else if (!password) {
    valid = false;
    message = 'Password is required';
  } else if (!name) {
    valid = false;
    message = 'Name is required';
  } else {
    const existing = await getOneDataByFilter({
      model: User,
      filter: { username },
      single: true
    });
    if (existing) {
      valid = false;
      message = 'Username already exists';
    }
  }
  return { valid, message };
};

const validateAuthLogin = async ({
  username,
  password
}: AuthParams): Promise<AuthLoginResult> => {
  let valid = true;
  let message = '';
  let user: any = null;

  if (!username) {
    valid = false;
    message = 'Username is required';
  } else if (!password) {
    valid = false;
    message = 'Password is required';
  } else {
    user = await getOneDataByFilter({
      model: User,
      filter: { username },
      single: true
    });
    if (!user) {
      valid = false;
      message = 'Username not found';
    }
  }
  return { valid, message, user };
};

export { validateAuthRegister, validateAuthLogin };
