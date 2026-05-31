export interface ValidationResult {
  valid: boolean;
  message: string;
}

export interface AuthLoginResult extends ValidationResult {
  user: any | null;
}

// Notes Area Validation
export interface ValidateNoteParams {
  content?: string;
}

export interface ValidateNoteMustExistParams {
  notesId: string;
  userId: string;
  content?: string;
}

// Auth Area Validation
export interface AuthParams {
  username?: string;
  password?: string;
  name?: string;
}

// Users Area Validation
export interface ValidateUserUpdateParams {
  data: Record<string, unknown>;
  id: string;
}
