import { createBrowserRouter } from 'react-router';
import Layout from './Layout';
import WishlistProvider from './WishlistProvider';
import BasketProvider from './BasketProvider';
import AuthProvider from './AuthProvider';
import { fetchProduct, fetchProducts } from '../lib/api';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AuthProvider>
        <WishlistProvider>
          <BasketProvider>
            <Layout />
          </BasketProvider>
        </WishlistProvider>
      </AuthProvider>
    ),
    children: [
      {
        index: true,
        loader: ({ request }) => fetchProducts(request.signal),
        lazy: () => import('../pages/Home'),
      },
      {
        path: 'search',
        loader: ({ request }) => fetchProducts(request.signal),
        lazy: () => import('../pages/Search'),
      },
      {
        path: 'basket',
        lazy: () => import('../pages/Basket'),
      },
      {
        path: 'product/:productId',
        loader: ({ params, request }) => fetchProduct(params.productId, request.signal),
        lazy: () => import('../pages/ProductDetail'),
      },
      {
        path: ':gender/:category?',
        loader: ({ request }) => fetchProducts(request.signal),
        lazy: () => import('../pages/ProductList'),
      },
      { path: '*', lazy: () => import('../pages/NotFound') },
    ],
  },
]);
