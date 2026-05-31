export interface ValidationResult {
  valid: boolean;
  message: string;
}

//Notes Area Validation
export interface ValidateNoteParams {
  content: string;
}

export interface ValidateNoteMustExistParams {
  notesId: string;
  userId: string;
  content?: string;
}

// End

// Validate Auth Area
export interface AuthParams {
  username: String;
  password: String;
  name?: String;
}

export interface UserParams {
  username: String;
  id: string;
}
