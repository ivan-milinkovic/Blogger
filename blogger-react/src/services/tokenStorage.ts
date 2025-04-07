import { Tokens } from "../model/Tokens";

const TokensKey = "blogger-tokens";

export function storeTokens(tokens: Tokens) {
  window.localStorage.setItem(TokensKey, JSON.stringify(tokens));
}

export function removeStoredTokens() {
  window.localStorage.removeItem(TokensKey);
}

export function updateTokens(tokens: Tokens | undefined) {
  if (tokens) storeTokens(tokens);
  else removeStoredTokens();
}

export function tryLoadStoredTokens(): Tokens | undefined {
  const storedTokensStr = window.localStorage.getItem(TokensKey);
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
