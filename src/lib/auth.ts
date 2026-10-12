import { createContext, useContext } from 'react';

export type User = {
  name: string;
  email: string;
};

export type AuthContextValue = {
  user: User | null;
  signIn: (user: User) => void;
  signOut: () => void;
};

export const USER_KEY = 'user';

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}

export function loadUser(): User | null {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(USER_KEY) ?? 'null');
    if (typeof parsed !== 'object' || parsed === null) return null;
    const { name, email } = parsed as Record<string, unknown>;
    return typeof name === 'string' && typeof email === 'string' ? { name, email } : null;
  } catch {
    return null;
  }
}
