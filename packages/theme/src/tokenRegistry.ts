import { theme as defaultTokens } from "@hansprint/tokens";

export type Tokens = typeof defaultTokens;
export type TokenListener = (tokens: Tokens) => void;

class TokenRegistryClass {
  private current: Tokens = defaultTokens;
  private listeners: Set<TokenListener> = new Set();

  register(tokens: Tokens) {
    this.current = tokens;
    this.listeners.forEach((listener) => listener(tokens));
  }

  get() {
    return this.current;
  }

  subscribe(listener: TokenListener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  reset() {
    this.current = defaultTokens;
    this.listeners.clear();
  }
}

export const TokenRegistry = new TokenRegistryClass();
