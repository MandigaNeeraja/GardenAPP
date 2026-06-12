import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { addToWishlist, getProduct } from '../services/api';

export default function ProductDetail() {
  const { id } = useParams();
  const { addItem } = useCart();
  const { isBuyer, isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [added, setAdded] = useState(false);
  const [wishlistMsg, setWishlistMsg] = useState('');

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      setError('');
      try {
        const data = await getProduct(id);
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product || product.stockQuantity <= 0) return;
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWishlist = async () => {
    setWishlistMsg('');
    try {
      await addToWishlist(product.id);
      setWishlistMsg('Added to wishlist!');
    } catch (err) {
      setWishlistMsg(err.message);
    }
  };

  if (loading) {
    return <p className="status-message container">Loading product...</p>;
  }

  if (error || !product) {
    return (
      <div className="container section">
        <p className="status-message error">{error || 'Product not found.'}</p>
        <Link to="/products" className="btn btn-secondary">
          Back to shop
        </Link>
      </div>
    );
  }

  return (
    <div className="container section product-detail">
      <Link to="/products" className="text-link back-link">
        &larr; Back to shop
      </Link>

      <div className="product-detail-grid">
        <div className="product-detail-image">
          <img src={product.imageUrl} alt={product.name} />
        </div>

        <div className="product-detail-info">
          <p className="product-category">{product.categoryName}</p>
          {product.storeName && (
            <p className="seller-name">Sold by {product.storeName}</p>
          )}
          <h1>{product.name}</h1>
          <p className="product-price large">${product.price.toFixed(2)}</p>
          <p className="product-description">{product.description}</p>

          {product.stockQuantity > 0 ? (
            <p className="stock-badge">{product.stockQuantity} in stock</p>
          ) : (
            <p className="stock-badge out">Out of stock</p>
          )}

          <div className="add-to-cart-row">
            <label htmlFor="quantity">Quantity</label>
            <input
              id="quantity"
              type="number"
              min="1"
              max={product.stockQuantity}
              value={quantity}
              onChange={(event) => setQuantity(Number(event.target.value))}
              disabled={product.stockQuantity <= 0}
            />
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleAddToCart}
              disabled={product.stockQuantity <= 0}
            >
              Add to cart
            </button>
            {isBuyer && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleWishlist}
                disabled={product.stockQuantity <= 0}
              >
                Add to wishlist
              </button>
            )}
            {!isAuthenticated && (
              <Link to="/login" className="text-link">Sign in to save to wishlist</Link>
            )}
          </div>

          {added && <p className="success-message">Added to cart!</p>}
          {wishlistMsg && <p className="success-message">{wishlistMsg}</p>}
        </div>
      </div>
    </div>
  );
}
