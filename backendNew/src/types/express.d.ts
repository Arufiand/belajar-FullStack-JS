declare global {
  namespace Express {
    interface Request {
      token?: string | null;
      user?: { username: string; id: string };
    }
  }
}
export {};
