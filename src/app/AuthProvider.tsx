import { useMemo, useState, type ReactNode } from 'react';
import { AuthContext, USER_KEY, loadUser, type User } from '../lib/auth';

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(loadUser);

  const value = useMemo(
    () => ({
      user,
      signIn: (next: User) => {
        localStorage.setItem(USER_KEY, JSON.stringify(next));
        setUser(next);
      },
      signOut: () => {
        localStorage.removeItem(USER_KEY);
        setUser(null);
      },
    }),
    [user],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}
