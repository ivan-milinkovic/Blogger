/*
import { useEffect, useRef, useState } from "react";
import { AuthContext, AuthFunctions, AuthState } from "./AuthContext";
import { loginApi, Tokens } from "./BloggerService";
import {
  removeStoredTokens,
  storeTokens,
  tryLoadStoredTokens,
} from "./tokenStorage";
import axios, {
  Axios,
  AxiosError,
  AxiosInstance,
  AxiosStatic,
  InternalAxiosRequestConfig,
} from "axios";
import { API_URL, jsonHeaders } from "./ServiceCommon";

// https://dev.to/miracool/how-to-manage-user-authentication-with-react-js-3ic5

// https://github.com/gitdagray/react_jwt_auth/blob/main/src/hooks/useAxiosPrivate.js

type AuthProviderProps = { children: React.ReactNode };

export default function AuthProvider(props: AuthProviderProps) {
  const [isSetup, setIsSetup] = useState(false);
  const [authState, setAuthState] = useState<AuthState>({
    tokens: tryLoadStoredTokens(),
  });
  const requestInterceptor = useRef<number | undefined>(undefined);
  const responseInterceptor = useRef<number | undefined>(undefined);
  const authApiAxiosRef = useRef<AxiosInstance>(
    axios.create({
      baseURL: API_URL,
      headers: jsonHeaders,
    }),
  );

  // authState and axios interceptors must be updated together
  function updateAuthState(newAuthState: AuthState) {
    // if (newAuthState.tokens) storeTokens(newAuthState.tokens);
    // else removeStoredTokens();
    setAuthState(newAuthState);
    updateInterceptors(newAuthState);
  }

  function updateInterceptors(newAuthState: AuthState) {
    clearInterceptors();
    if (!newAuthState.tokens) return;

    requestInterceptor.current =
      authApiAxiosRef.current.interceptors.request.use(
        (config) => {
          if (!newAuthState.tokens) return config;
          config.headers["Authorization"] =
            `${newAuthState.tokens.tokenType} ${newAuthState.tokens.accessToken}`;
          console.log("request interceptor", newAuthState.tokens.accessToken);
          return config;
        },
        (error) => Promise.reject(error),
      );

    responseInterceptor.current =
      authApiAxiosRef.current.interceptors.response.use(
        (response) => response,
        async (error) => {
          const err = error as AxiosError;
          const request = err.config;
          if (!err || !request) return error;
          type FlaggedRequestType = InternalAxiosRequestConfig<any> & {
            sent: boolean;
          };
          const flaggedRequest = request as FlaggedRequestType;
          console.error("interceptor:", err.status, error.config.url);
          if (
            err.status === 401 &&
            newAuthState.tokens &&
            !flaggedRequest.sent
          ) {
            const newTokens = await refresh(newAuthState.tokens.refreshToken);
            const refreshedAuthState: AuthState = { tokens: newTokens };
            updateAuthState(refreshedAuthState);
            flaggedRequest.sent = true;
            flaggedRequest.headers["Authorization"] = "***";
            // `${refreshedAuthState.tokens!.tokenType} ${refreshedAuthState.tokens!.accessToken}`;
            return authApiAxiosRef.current(flaggedRequest);
          }
          return Promise.reject(error);
        },
      );
  }

  async function refresh(refreshToken: string): Promise<Tokens> {
    const url = API_URL + "/refresh";
    const data = JSON.stringify({ refreshToken: refreshToken });
    var res = await axios({
      method: "POST",
      url: url,
      headers: jsonHeaders,
      data: data,
    });
    var newTokens = res.data as Tokens;
    return newTokens;
  }

  function clearInterceptors() {
    if (requestInterceptor.current)
      authApiAxiosRef.current.interceptors.request.eject(
        requestInterceptor.current,
      );
    if (responseInterceptor.current)
      authApiAxiosRef.current.interceptors.response.eject(
        responseInterceptor.current,
      );
  }

  useEffect(() => {
    updateInterceptors(authState);
    setIsSetup(true);
  }, []);

  function hasAuth(): boolean {
    const missing = typeof authState.tokens === "undefined";
    return !missing;
  }

  async function login(email: string, password: string) {
    const tokens = await loginApi(email, password);
    const newAuthState: AuthState = { tokens: tokens };
    updateAuthState(newAuthState);
  }

  async function logout() {
    removeStoredTokens();
    const newAuthState: AuthState = { tokens: undefined };
    updateAuthState(newAuthState);
  }

  const authFunctions: AuthFunctions = {
    hasAuth: hasAuth,
    login: login,
    logout: logout,
    authorizedApiAxios: authApiAxiosRef.current,
    getAuthState: () => {
      return authState;
    },
  };

  return (
    <AuthContext.Provider value={authFunctions}>
      {isSetup && props.children}
    </AuthContext.Provider>
  );
}
*/
