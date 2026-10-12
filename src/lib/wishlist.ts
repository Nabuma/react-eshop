import { createContext, useContext } from 'react';
import type { Product } from './api';

export type WishlistContextValue = {
  items: Product[];
  has: (productId: number) => boolean;
  toggle: (product: Product) => void;
  remove: (productId: number) => void;
  clear: () => void;
};

export const WISHLIST_KEY = 'wishlist';

export const WishlistContext = createContext<WishlistContextValue | null>(null);

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within a WishlistProvider');
  return ctx;
}

export function loadWishlist(): Product[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(WISHLIST_KEY) ?? '[]');
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (p): p is Product =>
        typeof p === 'object' && p !== null && typeof p.id === 'number' && typeof p.title === 'string',
    );
  } catch {
    return [];
  }
}
