import { useState } from "react";
import { AuthContext, AuthFunctions, AuthState } from "./AuthContext";
import { loginApi, refreshApi } from "./apiFunctions";

import {
  removeStoredTokens,
  tryLoadStoredTokens,
  updateTokens,
} from "./tokenStorage";
import { Tokens } from "../model/Tokens";

// https://dev.to/miracool/how-to-manage-user-authentication-with-react-js-3ic5

// https://github.com/gitdagray/react_jwt_auth/blob/main/src/hooks/useAxiosPrivate.js

type AuthProviderProps = { children: React.ReactNode };

export default function AuthProvider(props: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>({
    tokens: tryLoadStoredTokens(),
  });

  function handleNewTokens(newTokens: Tokens | undefined) {
    updateTokens(newTokens);
    setAuthState({ tokens: newTokens });
  }

  async function refresh(): Promise<Tokens | undefined> {
    var newTokens = await refreshApi(authState.tokens!.refreshToken);
    handleNewTokens(newTokens);
    return newTokens;
  }

  function hasAuth(): boolean {
    const missing = typeof authState.tokens === "undefined";
    return !missing;
  }

  async function login(email: string, password: string) {
    const tokens = await loginApi(email, password);
    handleNewTokens(tokens);
  }

  async function logout() {
    removeStoredTokens();
    handleNewTokens(undefined);
  }

  const authFunctions: AuthFunctions = {
    hasAuth: hasAuth,
    login: login,
    logout: logout,
    getAuthState: () => {
      return authState;
    },
    refresh: refresh,
  };

  return (
    <AuthContext.Provider value={authFunctions}>
      {props.children}
    </AuthContext.Provider>
  );
}
