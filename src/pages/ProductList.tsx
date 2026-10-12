import { Link, useLoaderData, useParams } from 'react-router';
import { Component as NotFound } from './NotFound';
import type { Product } from '../lib/api';
import { filterProducts, hasCategory, isGender } from '../lib/catalog';
import { ChevronRight } from 'lucide-react';
import { ProductGrid } from '../components/ProductGrid';
import './ProductList.css';

export function Component() {
  const { gender, category } = useParams();
  const products = useLoaderData<Product[]>();

  if (!isGender(gender) || (category !== undefined && !hasCategory(gender, category))) {
    return <NotFound />;
  }

  const filtered = filterProducts(products, gender, category);

  return (
    <>
      <h1 className="breadcrumb">
        <Link className="breadcrumb-link" to={`/${gender}`}>
          {gender}
        </Link>{' '}
        <ChevronRight className="breadcrumb-icon" aria-hidden="true" /> {category ?? 'all'}
        <span className="breadcrumb-count">
          {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
        </span>
      </h1>
      <ProductGrid products={filtered} />
    </>
  );
}
