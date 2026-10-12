import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Product } from '../lib/api';
import { Toast } from '../components/Toast';
import { WISHLIST_KEY, WishlistContext, loadWishlist } from '../lib/wishlist';

type Toast = { id: number; kind: 'added' | 'removed'; message: string; previous: Product[] };

const TOAST_DURATION_MS = 5000;

export default function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Product[]>(loadWishlist);
  const [toast, setToast] = useState<Toast | null>(null);

  const save = useCallback((next: Product[]) => {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(next));
    setItems(next);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), TOAST_DURATION_MS);
    return () => clearTimeout(timer);
  }, [toast]);

  const value = useMemo(() => {
    const commit = (next: Product[], kind: Toast['kind'], message: string) => {
      save(next);
      setToast({ id: Date.now(), kind, message, previous: items });
    };
    return {
      items,
      has: (productId: number) => items.some((p) => p.id === productId),
      toggle: (product: Product) =>
        items.some((p) => p.id === product.id)
          ? commit(items.filter((p) => p.id !== product.id), 'removed', `Removed "${product.title}" from wishlist`)
          : commit([...items, product], 'added', `Added "${product.title}" to wishlist`),
      remove: (productId: number) => {
        const product = items.find((p) => p.id === productId);
        if (product) commit(items.filter((p) => p.id !== productId), 'removed', `Removed "${product.title}" from wishlist`);
      },
      clear: () => {
        if (items.length > 0) commit([], 'removed', 'Wishlist cleared');
      },
    };
  }, [items, save]);

  return (
    <WishlistContext value={value}>
      {children}
      {toast && (
        <Toast
          key={toast.id}
          kind={toast.kind}
          message={toast.message}
          durationMs={TOAST_DURATION_MS}
          onCancel={() => {
            save(toast.previous);
            setToast(null);
          }}
        />
      )}
    </WishlistContext>
  );
}
