import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  return (
    <article className="product-card">
      <Link to={`/products/${product.id}`} className="product-card-link">
        <div className="product-image-wrap">
          <img src={product.imageUrl} alt={product.name} loading="lazy" />
        </div>
        <div className="product-card-body">
          <p className="product-category">{product.categoryName}</p>
          <h3>{product.name}</h3>
          <p className="product-price">${product.price.toFixed(2)}</p>
          {product.stockQuantity <= 0 ? (
            <span className="stock-badge out">Out of stock</span>
          ) : (
            <span className="stock-badge">In stock</span>
          )}
        </div>
      </Link>
    </article>
  );
}
