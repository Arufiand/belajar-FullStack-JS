import User from '../../models/users';
import { getOneDataByFilter } from '../../core/mongoQueryHelper';
import {
  ValidateUserUpdateParams,
  ValidationResult
} from '../../constants/general.interfaces';

async function validateUserUpdate({
  data,
  id
}: ValidateUserUpdateParams): Promise<ValidationResult> {
  let valid = true;
  let message = '';

  if (!data || Object.keys(data).length === 0) {
    valid = false;
    message = 'No fields provided to update';
  } else if (data.username) {
    const existing = await getOneDataByFilter({
      model: User,
      filter: { username: data.username },
      single: true
    });
    if (existing && (existing as any)._id.toString() !== id) {
      valid = false;
      message = 'Username already taken';
    }
  }
  return { valid, message };
}

export { validateUserUpdate };
