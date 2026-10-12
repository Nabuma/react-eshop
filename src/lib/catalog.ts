import type { Product } from './api';

export const CATALOG = {
  women: ['new', 'sale', 'clothing', 'dresses', 'tops', 'shoes', 'accessories', 'bags', 'jewellery', 'watches', 'sunglasses', 'sport', 'beauty'],
  men: ['new', 'sale', 'clothing', 'shirts', 'shoes', 'accessories', 'watches', 'sunglasses', 'sport', 'beauty'],
} as const;

export type Gender = keyof typeof CATALOG;

const PRODUCT_CATEGORIES: Record<Gender, Record<string, string[]>> = {
  women: {
    clothing: ['tops', 'womens-dresses', 'womens-shoes'],
    dresses: ['womens-dresses'],
    tops: ['tops'],
    shoes: ['womens-shoes'],
    accessories: ['womens-bags', 'womens-jewellery', 'womens-watches', 'sunglasses'],
    bags: ['womens-bags'],
    jewellery: ['womens-jewellery'],
    watches: ['womens-watches'],
    sunglasses: ['sunglasses'],
    sport: ['sports-accessories'],
    beauty: ['beauty', 'skin-care', 'fragrances'],
  },
  men: {
    clothing: ['mens-shirts', 'mens-shoes'],
    shirts: ['mens-shirts'],
    shoes: ['mens-shoes'],
    accessories: ['mens-watches', 'sunglasses'],
    watches: ['mens-watches'],
    sunglasses: ['sunglasses'],
    sport: ['sports-accessories'],
    beauty: ['fragrances', 'skin-care'],
  },
};

// Product categories searchable from the search bar (clothing, accessories and sport).
export const FASHION_CATEGORIES: string[] = [
  ...new Set(Object.values(PRODUCT_CATEGORIES).flatMap((c) => [...c.clothing, ...c.accessories, ...c.sport])),
];

export function isGender(value: string | undefined): value is Gender {
  return value !== undefined && Object.hasOwn(CATALOG, value);
}

export function hasCategory(gender: Gender, category: string): boolean {
  return (CATALOG[gender] as readonly string[]).includes(category);
}

export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const SALE_THRESHOLD_PERCENT = 10;

export const isOnSale = (p: Product) => p.discountPercentage >= SALE_THRESHOLD_PERCENT;

// dummyjson's `price` is the price before discount.
export const salePrice = (p: Product) => p.price * (1 - p.discountPercentage / 100);

export function searchProducts(products: Product[], query: string): Product[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];
  return products.filter((p) => {
    if (!FASHION_CATEGORIES.includes(p.category)) return false;
    const haystack = [p.title, p.category.replaceAll('-', ' '), ...(p.tags ?? [])].join(' ').toLowerCase();
    return terms.every((term) => haystack.includes(term));
  });
}

export function filterProducts(products: Product[], gender: Gender, category?: string): Product[] {
  const categories = PRODUCT_CATEGORIES[gender];
  const baseCategories = Object.values(categories).flat();
  const base = products.filter((p) => baseCategories.includes(p.category));

  switch (category) {
    case undefined:
      return base;
    case 'new':
      return [...base].sort((a, b) => b.id - a.id).slice(0, 4);
    case 'sale':
      return base.filter(isOnSale);
    default: {
      const allowed = categories[category] ?? [];
      return products.filter((p) => allowed.includes(p.category));
    }
  }
}
