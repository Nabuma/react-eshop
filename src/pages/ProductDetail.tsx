import { Link, useLoaderData, useNavigate } from 'react-router';
import type { MouseEvent } from 'react';
import { ArrowLeft, RotateCcw, ShoppingBasket, Star, Truck } from 'lucide-react';
import type { Product } from '../lib/api';
import { useBasket } from '../lib/basket';
import { isOnSale, salePrice } from '../lib/catalog';
import { WishlistButton } from '../components/WishlistButton';
import './ProductList.css';
import './ProductDetail.css';

const MAX_RATING = 5;

export function Component() {
  const product = useLoaderData<Product>();
  const basket = useBasket();
  const navigate = useNavigate();
  const onSale = isOnSale(product);
  const category = product.category.replaceAll('-', ' ');
  const filledStars = Math.round(product.rating);

  // history idx is 0 on a direct page load, where there is nowhere to go back to.
  const goBack = (e: MouseEvent<HTMLAnchorElement>) => {
    if (window.history.state?.idx > 0) {
      e.preventDefault();
      navigate(-1);
    }
  };

  return (
    <article className="product-detail">
      <Link className="product-detail-back" to="/" onClick={goBack}>
        <ArrowLeft aria-hidden="true" />
        Back
      </Link>
      <div className="product-detail-content">
        <div className="product-detail-image">
          <img src={product.image} alt={product.title} />
          {onSale && <span className="product-badge">-{Math.round(product.discountPercentage)}%</span>}
          <WishlistButton product={product} />
        </div>
        <div className="product-detail-info">
          <p className="product-detail-category">{category}</p>
          <h1>{product.title}</h1>
          <p className="product-detail-rating" aria-label={`Rated ${product.rating.toFixed(1)} out of ${MAX_RATING}`}>
            {Array.from({ length: MAX_RATING }, (_, i) => (
              <Star key={i} aria-hidden="true" className={i < filledStars ? 'filled' : undefined} />
            ))}
            <span>{product.rating.toFixed(1)}</span>
          </p>
          <div className="product-detail-price">
            {onSale ? (
              <>
                <span className="product-price-sale">${salePrice(product).toFixed(2)}</span>
                <s className="product-price-old">${product.price.toFixed(2)}</s>
                <span className="product-detail-savings">
                  You save ${(product.price - salePrice(product)).toFixed(2)}
                </span>
              </>
            ) : (
              <span>${product.price.toFixed(2)}</span>
            )}
          </div>
          <button className="product-detail-add" onClick={() => basket.add(product)}>
            <ShoppingBasket aria-hidden="true" />
            Add to basket
          </button>
          <ul className="product-detail-perks">
            <li>
              <Truck aria-hidden="true" />
              Free shipping on orders over $50
            </li>
            <li>
              <RotateCcw aria-hidden="true" />
              Free returns within 30 days
            </li>
          </ul>
          <section className="product-detail-section">
            <h2>Description</h2>
            <p>{product.description}</p>
          </section>
          {product.tags.length > 0 && (
            <ul className="product-detail-tags" aria-label="Tags">
              {product.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </article>
  );
}
