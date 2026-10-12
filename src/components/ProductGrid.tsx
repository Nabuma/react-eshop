import { Link } from 'react-router';
import type { Product } from '../lib/api';
import { isOnSale, salePrice } from '../lib/catalog';
import { WishlistButton } from './WishlistButton';
import '../pages/ProductList.css';

type ProductGridProps = {
  products: Product[];
};

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) return <p className="product-empty">No products found.</p>;

  return (
    <ul className="product-list">
      {products.map((p) => {
        const onSale = isOnSale(p);
        return (
          <li key={p.id} className="product-item">
            <Link className="product-card-link" to={`/product/${p.id}`}>
              <div className="product-image-wrapper">
                <img className="product-image" src={p.image} alt={p.title} loading="lazy" />
                {onSale && <span className="product-badge">-{Math.round(p.discountPercentage)}%</span>}
              </div>
              <h2 className="product-title">{p.title}</h2>
              <p className="product-price">
                {onSale ? (
                  <>
                    <span className="product-price-sale">${salePrice(p).toFixed(2)}</span>
                    <s className="product-price-old">${p.price.toFixed(2)}</s>
                  </>
                ) : (
                  `$${p.price.toFixed(2)}`
                )}
              </p>
            </Link>
            <WishlistButton product={p} />
          </li>
        );
      })}
    </ul>
  );
}
