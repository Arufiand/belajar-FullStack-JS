'use strict';

import User from '../../models/users';
import { getOneDataByFilter } from '../../core/mongoQueryHelper';
import {
  UserParams,
  ValidationResult
} from '../../constants/general.interfaces';

async function validateUserUpdate({
  username,
  id
}: UserParams): Promise<ValidationResult> {
  let valid = true;
  let message = '';
  if (!username) {
    valid = false;
    message = 'Username is required';
  } else if (username) {
    const existing = await getOneDataByFilter({
      model: User,
      filter: { username: username },
      single: true
    });
    if (existing && existing._id.toString() !== id) {
      valid = false;
      message = 'Username already taken';
    }
  }

  return { valid, message };
}

export = { validateUserUpdate };
