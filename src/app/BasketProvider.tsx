import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Product } from '../lib/api';
import { Toast } from '../components/Toast';
import { BASKET_KEY, BasketContext, loadBasket, type BasketItem } from '../lib/basket';

type BasketToast = { id: number; kind: 'added' | 'removed'; message: string; previous: BasketItem[] };

const TOAST_DURATION_MS = 5000;

export default function BasketProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<BasketItem[]>(loadBasket);
  const [toast, setToast] = useState<BasketToast | null>(null);

  const save = useCallback((next: BasketItem[]) => {
    localStorage.setItem(BASKET_KEY, JSON.stringify(next));
    setItems(next);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), TOAST_DURATION_MS);
    return () => clearTimeout(timer);
  }, [toast]);

  const value = useMemo(() => {
    const commit = (next: BasketItem[], kind: BasketToast['kind'], message: string) => {
      save(next);
      setToast({ id: Date.now(), kind, message, previous: items });
    };
    return {
      items,
      itemCount: items.reduce((total, item) => total + item.quantity, 0),
      add: (product: Product) =>
        commit(
          items.some((item) => item.product.id === product.id)
            ? items.map((item) =>
                item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
              )
            : [...items, { product, quantity: 1 }],
          'added',
          `Added "${product.title}" to basket`,
        ),
      setQuantity: (productId: number, quantity: number) =>
        save(
          items.map((item) =>
            item.product.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item,
          ),
        ),
      remove: (productId: number) => {
        const found = items.find((item) => item.product.id === productId);
        if (found) {
          commit(
            items.filter((item) => item.product.id !== productId),
            'removed',
            `Removed "${found.product.title}" from basket`,
          );
        }
      },
      clear: () => {
        if (items.length > 0) commit([], 'removed', 'Basket emptied');
      },
    };
  }, [items, save]);

  return (
    <BasketContext value={value}>
      {children}
      {toast && (
        <Toast
          key={toast.id}
          icon="basket"
          kind={toast.kind}
          message={toast.message}
          durationMs={TOAST_DURATION_MS}
          onCancel={() => {
            save(toast.previous);
            setToast(null);
          }}
        />
      )}
    </BasketContext>
  );
}
