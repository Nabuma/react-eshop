import { createContext, useContext } from 'react';
import type { Product } from './api';
import { isOnSale, salePrice } from './catalog';

export type BasketItem = {
  product: Product;
  quantity: number;
};

export type BasketContextValue = {
  items: BasketItem[];
  itemCount: number;
  add: (product: Product) => void;
  setQuantity: (productId: number, quantity: number) => void;
  remove: (productId: number) => void;
  clear: () => void;
};

export const BASKET_KEY = 'basket';

// Price actually charged per unit; matches what product listings display.
export const unitPrice = (p: Product): number => (isOnSale(p) ? salePrice(p) : p.price);

export type BasketTotals = { subtotal: number; savings: number; total: number };

export function basketTotals(items: BasketItem[]): BasketTotals {
  const subtotal = items.reduce((sum, { product, quantity }) => sum + product.price * quantity, 0);
  const total = items.reduce((sum, { product, quantity }) => sum + unitPrice(product) * quantity, 0);
  return { subtotal, savings: subtotal - total, total };
}

export const BasketContext = createContext<BasketContextValue | null>(null);

export function useBasket(): BasketContextValue {
  const context = useContext(BasketContext);
  if (!context) throw new Error('useBasket must be used within a BasketProvider');
  return context;
}

export function loadBasket(): BasketItem[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(BASKET_KEY) ?? '[]');
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is BasketItem =>
        typeof item === 'object' &&
        item !== null &&
        typeof item.quantity === 'number' &&
        item.quantity > 0 &&
        typeof item.product === 'object' &&
        item.product !== null &&
        typeof item.product.id === 'number' &&
        typeof item.product.title === 'string',
    );
  } catch {
    return [];
  }
}
