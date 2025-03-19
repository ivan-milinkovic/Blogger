import { API_URL, commonHeaders } from "./ServiceCommon";

export type Tokens = { tokenType: string; accessToken: string };

let tokens: Tokens;
const storageTokens = window.localStorage.getItem("tokens");
if (storageTokens) {
  tokens = JSON.parse(window.localStorage.getItem("tokens") ?? "");
}

function storeTokens(tokens: Tokens) {
  window.localStorage.setItem("tokens", JSON.stringify(tokens));
}

function removeTokens() {
  window.localStorage.removeItem("tokens");
}

export function hasAuth(): boolean {
  const missing = typeof tokens === "undefined";
  return !missing;
}

export function authorizeHeaders(headers: HeadersInit): HeadersInit {
  const auth = tokens.tokenType + " " + tokens.accessToken;
  return { ...headers, Authorization: auth };
}

async function loginApi(email: string, password: string): Promise<Tokens> {
  const query = new URLSearchParams({
    useCookies: "false",
    useSessionCookies: "false",
  }).toString();
  const res = await fetch(API_URL + "login?" + query, {
    method: "POST",
    headers: commonHeaders,
    body: JSON.stringify({ email, password }),
  });
  tokens = await res.json();
  return tokens;
}

export async function loginAndStore(email: string, password: string) {
  const tokens = await loginApi(email, password);
  storeTokens(tokens);
}

export async function logout() {
  removeTokens();
}
