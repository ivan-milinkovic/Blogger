import { useEffect, useState } from "react";
import { AuthContext, AuthFunctions, AuthState } from "./AuthContext";
import { loginApi, Tokens } from "./BloggerService";

// https://dev.to/miracool/how-to-manage-user-authentication-with-react-js-3ic5

function storeTokens(tokens: Tokens) {
  window.localStorage.setItem("tokens", JSON.stringify(tokens));
}

function removeStoredTokens() {
  window.localStorage.removeItem("tokens");
}

function tryLoadStoredTokens(): Tokens | undefined {
  const storedTokensStr = window.localStorage.getItem("tokens");
  let tokens: Tokens | undefined = undefined;
  if (storedTokensStr) {
    try {
      tokens = JSON.parse(storedTokensStr);
    } catch {
      removeStoredTokens();
    }
  }
  return tokens;
}

type AuthProviderProps = {children : React.ReactNode}

export default function AuthProvider(props: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>({
    tokens: tryLoadStoredTokens(),
  });

  function hasAuth(): boolean {
    const missing = typeof authState.tokens === "undefined";
    return !missing;
  }

  async function login(email: string, password: string) {
    const tokens = await loginApi(email, password);
    storeTokens(tokens);
    setAuthState({ tokens: tokens });
  }

  async function logout() {
    removeStoredTokens();
    setAuthState(() => {
      return { tokens: undefined };
    });
  }

  function authorizeHeaders(headers: HeadersInit): HeadersInit {
    const tokens = authState.tokens;
    if (!tokens) {
      return headers;
    }
    const auth = tokens.tokenType + " " + tokens.accessToken;
    return { ...headers, Authorization: auth };
  }

  const [authFunctions, setAuthFunctions] = useState<AuthFunctions>({
    hasAuth: hasAuth,
    login: login,
    logout: logout,
    authorizeHeaders: authorizeHeaders,
  });

  useEffect(() => {
    setAuthFunctions({
      hasAuth: hasAuth,
      login: login,
      logout: logout,
      authorizeHeaders: authorizeHeaders,
    });
  }, [authState]);

  return (
    <AuthContext.Provider value={authFunctions}>
      {props.children}
    </AuthContext.Provider>
  );
}
