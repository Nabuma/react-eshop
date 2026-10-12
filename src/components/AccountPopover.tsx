import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link } from 'react-router';
import { LogOut, ShoppingBasket, User } from 'lucide-react';
import { useAuth } from '../lib/auth';
import './AccountPopover.css';

export function AccountPopover() {
  const { user, signIn, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    signIn({ name: String(form.get('name')).trim(), email: String(form.get('email')).trim() });
    setOpen(false);
  };

  return (
    <div className="account" ref={rootRef}>
      <button
        className="action-button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={user ? `Account of ${user.name}` : 'Sign in'}
      >
        <User />
        {user && <span className="account-dot" aria-hidden="true" />}
      </button>
      {open && (
        <div className="account-popover">
          {user ? (
            <>
              <p className="account-name">{user.name}</p>
              <p className="account-email">{user.email}</p>
              <Link className="account-link" to="/basket" onClick={() => setOpen(false)}>
                <ShoppingBasket aria-hidden="true" />
                My basket
              </Link>
              <button
                className="account-link"
                onClick={() => {
                  signOut();
                  setOpen(false);
                }}
              >
                <LogOut aria-hidden="true" />
                Sign out
              </button>
            </>
          ) : (
            <form className="account-form" onSubmit={onSubmit}>
              <h2 className="account-title">Sign in</h2>
              <label>
                Name
                <input name="name" type="text" autoComplete="name" required autoFocus />
              </label>
              <label>
                Email
                <input name="email" type="email" autoComplete="email" required />
              </label>
              <button className="account-submit" type="submit">
                Sign in
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
