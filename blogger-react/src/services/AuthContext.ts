import { createContext, useContext } from "react";
import { Tokens } from "./BloggerService";

export type AuthState = {
  tokens: Tokens | undefined;
};

export type AuthorizeHeadersFunction = (headers: HeadersInit) => HeadersInit;

export type AuthFunctions = {
  hasAuth: () => boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  authorizeHeaders: AuthorizeHeadersFunction;
};

export const AuthContext = createContext<AuthFunctions>(
  makeDummyAuthFunctions(),
);

export function useAuth() {
  return useContext(AuthContext);
}

function makeDummyAuthFunctions(): AuthFunctions {
  return {
    hasAuth: () => {
      throw new Error("*** Placeholder hasAuth used");
    },
    login: async () => {
      throw new Error("*** Placeholder login used");
    },
    logout: async () => {
      throw new Error("*** Placeholder logout used");
    },
    authorizeHeaders: (headers: HeadersInit): HeadersInit => {
      return headers; // test support, the auth context doesn't update
      throw new Error("*** Placeholder authorizeHeaders used");
    },
  };
}
