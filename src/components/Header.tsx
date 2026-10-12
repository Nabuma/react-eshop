import { useEffect, useRef } from 'react';
import { Link, NavLink, useLocation, useParams, useSearchParams } from 'react-router';
import { ShoppingBasket } from 'lucide-react';
import { CATALOG, capitalize, isGender } from '../lib/catalog';
import { AccountPopover } from './AccountPopover';
import { SearchBar } from './SearchBar';
import { WishlistPopover } from './WishlistPopover';
import { useBasket } from '../lib/basket';
import './Header.css';

export function Header() {
  const { gender, category } = useParams();
  const { pathname } = useLocation();
  const [params] = useSearchParams();
  const query = pathname === '/search' ? (params.get('q') ?? '') : '';
  const categoriesRef = useRef<HTMLDivElement>(null);
  const basket = useBasket();

  useEffect(() => {
    const list = categoriesRef.current;
    const active = list?.querySelector<HTMLElement>('.category-link.active');
    if (!list || !active) return;
    list.scrollTo({ left: active.offsetLeft - 32, behavior: 'smooth' });
  }, [gender, category]);

  return (
    <header className="header">
      <div className="wrapper">
        <nav>
          <ul className="nav-list">
            <li><NavLink className="nav-link" to="/" end>DAILY VESTE</NavLink></li>
            <li><NavLink className="nav-link" to="/women">Women</NavLink></li>
            <li><NavLink className="nav-link" to="/men">Men</NavLink></li>
          </ul>
        </nav>
        <SearchBar key={query} initialQuery={query} />
        <div className="actions">
          <AccountPopover />
          <WishlistPopover />
          <Link
            className="action-button basket-button"
            to="/basket"
            aria-label={`Basket, ${basket.itemCount} items`}
          >
            <ShoppingBasket />
            {basket.itemCount > 0 && <span className="action-count">{basket.itemCount}</span>}
          </Link>
        </div>
      </div>
      {isGender(gender) ? (
        <div className="categories" ref={categoriesRef}>
          <ul className="categories-list">
            {CATALOG[gender].map((category) => (
              <li key={category}>
                <NavLink className="category-link" to={`/${gender}/${category}`}>
                  {capitalize(category)}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="banner">Free shipping on orders over $50</div>
      )}
    </header>
  );
}
