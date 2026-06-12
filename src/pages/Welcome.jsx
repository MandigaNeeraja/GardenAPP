import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../services/api';

export default function Welcome() {
  const [previewProducts, setPreviewProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPreview() {
      try {
        const products = await getProducts();
        setPreviewProducts(products.slice(0, 6));
      } catch {
        setPreviewProducts([]);
      } finally {
        setLoading(false);
      }
    }

    loadPreview();
  }, []);

  return (
    <div className="welcome-page">
      <div className="welcome-preview" aria-hidden="true">
        <div className="welcome-preview-grid">
          {!loading &&
            previewProducts.map((product) => (
              <div key={product.id} className="welcome-preview-card">
                <img src={product.imageUrl} alt="" />
                <span>{product.name}</span>
              </div>
            ))}
        </div>
        <div className="welcome-preview-overlay" />
      </div>

      <div className="welcome-gate">
        <div className="welcome-gate-content">
          <p className="eyebrow">GreenThumb Garden</p>
          <h1>Your gardening marketplace</h1>
          <p className="welcome-tagline">
            Browse pots, tools, and flowers from trusted sellers. Sign in or create
            an account to shop, sell, and manage orders.
          </p>

          <div className="welcome-actions">
            <Link to="/login" className="btn btn-primary welcome-btn">
              Sign in
            </Link>
            <Link to="/register" className="btn btn-secondary welcome-btn">
              Create account
            </Link>
          </div>

          <p className="welcome-hint">
            Choose <strong>Buyer</strong> to shop, or <strong>Seller</strong> to list products.
          </p>

          <div className="demo-credentials welcome-demo">
            <p><strong>Try demo accounts</strong></p>
            <p>Buyer: buyer@greenthumb.com / Buyer123!</p>
            <p>Seller: seller@greenthumb.com / Seller123!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
