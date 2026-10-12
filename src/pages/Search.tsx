import { useLoaderData, useSearchParams } from 'react-router';
import type { Product } from '../lib/api';
import { searchProducts } from '../lib/catalog';
import { ProductGrid } from '../components/ProductGrid';
import './ProductList.css';

export function Component() {
  const products = useLoaderData<Product[]>();
  const [params] = useSearchParams();
  const query = params.get('q')?.trim() ?? '';
  const results = searchProducts(products, query);

  return (
    <>
      <h1 className="breadcrumb">
        {query ? `Results for “${query}”` : 'Search'}
        <span className="breadcrumb-count">
          {results.length} {results.length === 1 ? 'product' : 'products'}
        </span>
      </h1>
      <ProductGrid products={results} />
    </>
  );
}
