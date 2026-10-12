import { Link } from 'react-router';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { basketTotals, unitPrice, useBasket } from '../lib/basket';
import { isOnSale } from '../lib/catalog';
import './ProductList.css';
import './Basket.css';

export function Component() {
  const basket = useBasket();
  const { subtotal, savings, total } = basketTotals(basket.items);

  if (basket.items.length === 0) {
    return (
      <section className="basket">
        <h1 className="basket-title">Your basket</h1>
        <p className="product-empty">Your basket is empty.</p>
        <p className="basket-empty-link">
          <Link to="/">Continue shopping</Link>
        </p>
      </section>
    );
  }

  return (
    <section className="basket">
      <h1 className="basket-title">
        Your basket <span className="basket-count-label">{basket.itemCount} {basket.itemCount === 1 ? 'item' : 'items'}</span>
      </h1>
      <div className="basket-content">
        <div className="basket-items">
        <ul className="basket-list">
          {basket.items.map(({ product, quantity }) => {
            const onSale = isOnSale(product);
            return (
              <li key={product.id} className="basket-item">
                <Link className="basket-item-image" to={`/product/${product.id}`}>
                  <img src={product.image} alt={product.title} />
                </Link>
                <div className="basket-item-info">
                  <Link className="basket-item-title" to={`/product/${product.id}`}>{product.title}</Link>
                  <p className="basket-item-price">
                    {onSale ? (
                      <>
                        <span className="product-price-sale">${unitPrice(product).toFixed(2)}</span>
                        <s className="product-price-old">${product.price.toFixed(2)}</s>
                        <span className="basket-item-discount">-{Math.round(product.discountPercentage)}%</span>
                      </>
                    ) : (
                      `$${product.price.toFixed(2)}`
                    )}
                  </p>
                  <div className="basket-quantity">
                    <button
                      onClick={() => basket.setQuantity(product.id, quantity - 1)}
                      disabled={quantity <= 1}
                      aria-label={`Decrease quantity of ${product.title}`}
                    >
                      <Minus aria-hidden="true" />
                    </button>
                    <span aria-live="polite">{quantity}</span>
                    <button
                      onClick={() => basket.setQuantity(product.id, quantity + 1)}
                      aria-label={`Increase quantity of ${product.title}`}
                    >
                      <Plus aria-hidden="true" />
                    </button>
                  </div>
                </div>
                <div className="basket-item-total">
                  <strong>${(unitPrice(product) * quantity).toFixed(2)}</strong>
                  {onSale && <s className="product-price-old">${(product.price * quantity).toFixed(2)}</s>}
                  <button
                    className="basket-remove"
                    onClick={() => basket.remove(product.id)}
                    aria-label={`Remove ${product.title} from basket`}
                  >
                    <Trash2 aria-hidden="true" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
        <button className="basket-clear" onClick={basket.clear}>
          <Trash2 aria-hidden="true" />
          Empty basket
        </button>
        </div>
        <aside className="basket-summary">
          <h2>Summary</h2>
          <dl>
            <div>
              <dt>Subtotal</dt>
              <dd>${subtotal.toFixed(2)}</dd>
            </div>
            {savings > 0 && (
              <div className="basket-savings">
                <dt>Reductions</dt>
                <dd>-${savings.toFixed(2)}</dd>
              </div>
            )}
            <div className="basket-total">
              <dt>Total</dt>
              <dd>${total.toFixed(2)}</dd>
            </div>
          </dl>
          <Link className="basket-continue" to="/">Continue shopping</Link>
        </aside>
      </div>
    </section>
  );
}
