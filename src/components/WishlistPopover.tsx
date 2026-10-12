import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { Heart, Trash2 } from 'lucide-react';
import { useWishlist } from '../lib/wishlist';
import './WishlistPopover.css';

export function WishlistPopover() {
  const wishlist = useWishlist();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const total = wishlist.items.reduce((sum, item) => sum + item.price, 0);

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

  return (
    <div className="wishlist" ref={rootRef}>
      <button
        className="action-button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={`Wishlist (${wishlist.items.length})`}
      >
        <Heart />
        {wishlist.items.length > 0 && <span className="action-count">{wishlist.items.length}</span>}
      </button>
      {open && (
        <div className="wishlist-popover">
          {wishlist.items.length === 0 ? (
            <p className="wishlist-empty">Your wishlist is empty.</p>
          ) : (
            <>
              <ul className="wishlist-list">
                {wishlist.items.map((p) => (
                  <li key={p.id} className="wishlist-item">
                    <Link
                      className="wishlist-link"
                      to={`/product/${p.id}`}
                      onClick={() => setOpen(false)}
                    >
                      <img className="wishlist-thumb" src={p.image} alt={p.title} />
                      <div className="wishlist-info">
                        <span className="wishlist-title">{p.title}</span>
                        <span className="wishlist-price">${p.price.toFixed(2)}</span>
                      </div>
                    </Link>
                    <button
                      className="wishlist-remove"
                      onClick={() => wishlist.remove(p.id)}
                      aria-label={`Remove ${p.title} from wishlist`}
                    >
                      <Trash2 />
                    </button>
                  </li>
                ))}
              </ul>
              <div className="wishlist-actions">
                <p className="wishlist-total">Total: ${total.toFixed(2)}</p>
                <button className="wishlist-clear" onClick={wishlist.clear}>
                  Remove all
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
