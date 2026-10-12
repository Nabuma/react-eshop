export type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  tags: string[];
  image: string;
  rating: number;
  discountPercentage: number;
};

type DummyJsonProduct = Omit<Product, 'image'> & {
  thumbnail: string;
};

type DummyJsonProductsResponse = {
  products: DummyJsonProduct[];
};

function toProduct({ thumbnail, ...product }: DummyJsonProduct): Product {
  return { ...product, image: thumbnail };
}

let tagsPromise: Promise<string[]> | undefined;

// Tags of the given product categories sorted by popularity; cached so the search bar only fetches once.
export function fetchTags(categories: readonly string[]): Promise<string[]> {
  tagsPromise ??= fetch('https://dummyjson.com/products?limit=0&select=tags,category')
    .then((res) => {
      if (!res.ok) throw new Error('Failed to load tags');
      return res.json() as Promise<{ products: { tags?: string[]; category: string }[] }>;
    })
    .then(({ products }) => {
      const counts = new Map<string, number>();
      for (const { tags = [], category } of products) {
        if (!categories.includes(category)) continue;
        for (const tag of tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
      }
      return [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([tag]) => tag);
    })
    .catch(() => {
      tagsPromise = undefined;
      return [];
    });
  return tagsPromise;
}

export async function fetchProducts(signal?: AbortSignal): Promise<Product[]> {
  const res = await fetch('https://dummyjson.com/products?limit=0', { signal });
  if (!res.ok) throw new Response('Failed to load products', { status: res.status });
  const data: DummyJsonProductsResponse = await res.json();
  return data.products.map(toProduct);
}

export async function fetchProduct(productId: string | undefined, signal?: AbortSignal): Promise<Product> {
  if (!productId || !/^\d+$/.test(productId)) {
    throw new Response('Product not found', { status: 404 });
  }
  const res = await fetch(`https://dummyjson.com/products/${productId}`, { signal });
  if (!res.ok) throw new Response('Product not found', { status: res.status });
  const product: DummyJsonProduct = await res.json();
  return toProduct(product);
}
