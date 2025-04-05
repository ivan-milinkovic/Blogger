import { useEffect } from "react";
import { useAuth } from "./AuthContext";
import { authApiAxios } from "./axios";
import { AxiosError, InternalAxiosRequestConfig } from "axios";

type FlaggedRequestType = InternalAxiosRequestConfig<any> & {
  refreshAttempted: boolean;
};

export const useAuthApiAxios = () => {
  const { getAuthState, refresh } = useAuth();

  useEffect(() => {
    const reqIcp = authApiAxios.interceptors.request.use(
      (config) => {
        const tokens = getAuthState().tokens;
        if (!tokens) return config;
        const flaggedRequest = config as FlaggedRequestType;
        // when re-trying, this closure still has old data
        if (flaggedRequest.refreshAttempted) {
          return config;
        }
        config.headers["Authorization"] =
          `${tokens.tokenType} ${tokens.accessToken}`;
        // console.log("req icp", tokens.accessToken.substring(0, 10));
        return config;
      },
      (error) => Promise.reject(error),
    );

    const resIcp = authApiAxios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const refreshToken = getAuthState().tokens?.refreshToken;
        const err = error as AxiosError;
        const request = err.config;
        if (!err || !request || !refreshToken) return Promise.reject(error);

        const flaggedRequest = request as FlaggedRequestType;
        // console.error("interceptor:", err.status, error.config.url);

        if (err.status === 401 && !flaggedRequest.refreshAttempted) {
          flaggedRequest.refreshAttempted = true;

          console.log("interceptor: refreshing token");
          const newTokens = await refresh();

          //   const newTokens = getAuthState().tokens;
          flaggedRequest.headers["Authorization"] =
            `${newTokens!.tokenType} ${newTokens!.accessToken}`;

          console.log(
            "interceptor: retrying",
            newTokens?.accessToken.substring(0, 10),
          );
          return authApiAxios(flaggedRequest);
        }
        console.log("interceptor: failing");
        return Promise.reject(error);
      },
    );

    return () => {
      authApiAxios.interceptors.request.eject(reqIcp);
      authApiAxios.interceptors.response.eject(resIcp);
    };
  }, [getAuthState, refresh]);

  return authApiAxios;
};
