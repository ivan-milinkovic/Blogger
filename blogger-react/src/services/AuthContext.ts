import { createContext, useContext } from "react";
import { Tokens } from "./BloggerService";

export const AuthContext = createContext<AuthFunctions>(
  makeDummyAuthFunctions(),
);

export type AuthState = {
  tokens: Tokens | undefined;
};

export type AuthFunctions = {
  hasAuth: () => boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  getAuthState: () => AuthState;
  refresh: () => Promise<Tokens | undefined>;
};

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
    getAuthState: () => {
      return { tokens: undefined };
    },
    refresh: async (): Promise<Tokens | undefined> => {
      return;
    },
  };
}
