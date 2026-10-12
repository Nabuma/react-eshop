import { Outlet, useNavigation } from 'react-router';
import { isGender } from '../lib/catalog';
import { Header } from '../components/Header';
import { ProductListSkeleton } from '../components/ProductListSkeleton';
import './Layout.css';

export default function Layout() {
  const navigation = useNavigation();
  const pendingPath = navigation.location?.pathname.split('/').filter(Boolean) ?? [];
  const [pendingGender, pendingCategory] = pendingPath;
  const isLoadingProducts = navigation.state === 'loading' && isGender(pendingGender);

  return (
    <>
      <Header />
      <main className="main">
        {isLoadingProducts ? (
          <ProductListSkeleton
            title={pendingCategory ? `${pendingGender} › ${pendingCategory}` : pendingGender}
          />
        ) : (
          <Outlet />
        )}
      </main>
    </>
  );
}
