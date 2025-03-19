class AuthError extends Error {
  constructor() {
    super("Unauthorized");
  }
}

export type AnyError = AuthError | Error | object | unknown;

export { AuthError };
