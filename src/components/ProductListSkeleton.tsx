import '../pages/ProductList.css';
import './ProductListSkeleton.css';

type ProductListSkeletonProps = {
  title?: string;
  count?: number;
};

export function ProductListSkeleton({ title, count = 15 }: ProductListSkeletonProps) {
  return (
    <>
      <h1 className="breadcrumb">{title}</h1>
      <div className="product-loading" role="status" aria-label="Loading products">
        <ul className="product-list" aria-hidden="true">
          {Array.from({ length: count }, (_, index) => (
            <li className="product-item product-skeleton" key={index}>
              <div className="product-image-wrapper skeleton-block" />
              <div className="skeleton-line skeleton-title" />
              <div className="skeleton-line skeleton-price" />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
