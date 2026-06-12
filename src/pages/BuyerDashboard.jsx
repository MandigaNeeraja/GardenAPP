import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import {
  cancelOrder,
  getMyOrders,
  getWishlist,
  removeFromWishlist,
} from '../services/api';

export default function BuyerDashboard() {
  const { user, updateProfile: updateAuthProfile } = useAuth();
  const { addItem } = useCart();
  const [tab, setTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [profile, setProfile] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    shippingAddress: user?.shippingAddress || '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError('');
      try {
        const [ordersData, wishlistData] = await Promise.all([
          getMyOrders(),
          getWishlist(),
        ]);
        setOrders(ordersData);
        setWishlist(wishlistData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const handleCancel = async (orderId) => {
    if (!window.confirm('Cancel this order? Stock will be restored.')) return;

    try {
      const updated = await cancelOrder(orderId);
      setOrders((current) =>
        current.map((order) => (order.id === orderId ? updated : order)),
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const handleProfileSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await updateAuthProfile(profile);
      setSuccess('Profile updated successfully.');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveWishlist = async (productId) => {
    try {
      await removeFromWishlist(productId);
      setWishlist((current) => current.filter((item) => item.productId !== productId));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddWishlistToCart = (item) => {
    if (!item.isActive || item.stockQuantity <= 0) return;
    addItem(
      {
        id: item.productId,
        name: item.name,
        price: item.price,
        imageUrl: item.imageUrl,
        stockQuantity: item.stockQuantity,
      },
      1,
    );
    setSuccess(`${item.name} added to cart.`);
  };

  return (
    <div className="container section dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>My account</h1>
          <p className="dashboard-greeting">Hello, {user?.fullName}</p>
        </div>
        <Link to="/products" className="btn btn-secondary">
          Continue shopping
        </Link>
      </div>

      <div className="dashboard-tabs">
        {['orders', 'wishlist', 'profile'].map((key) => (
          <button
            key={key}
            type="button"
            className={`dashboard-tab ${tab === key ? 'active' : ''}`}
            onClick={() => setTab(key)}
          >
            {key === 'orders' ? 'My orders' : key === 'wishlist' ? 'Wishlist' : 'Profile'}
          </button>
        ))}
      </div>

      {error && <p className="status-message error">{error}</p>}
      {success && <p className="status-message success-message">{success}</p>}

      {loading ? (
        <p className="status-message">Loading your dashboard...</p>
      ) : (
        <>
          {tab === 'orders' && (
            <div className="dashboard-panel">
              {orders.length === 0 ? (
                <p className="status-message">You have not placed any orders yet.</p>
              ) : (
                <div className="order-list">
                  {orders.map((order) => (
                    <article key={order.id} className="dashboard-card">
                      <div className="dashboard-card-header">
                        <div>
                          <h3>Order #{order.id}</h3>
                          <p>{new Date(order.createdAt).toLocaleString()}</p>
                        </div>
                        <span className={`status-pill status-${order.status.toLowerCase().replace(/\s+/g, '-')}`}>
                          {order.status}
                        </span>
                      </div>

                      <ul className="checkout-items">
                        {order.items.map((item) => (
                          <li key={item.orderItemId}>
                            <span>
                              {item.productName} x {item.quantity}
                              <small> ({item.status})</small>
                            </span>
                            <span>${item.lineTotal.toFixed(2)}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="dashboard-card-footer">
                        <strong>Total: ${order.totalAmount.toFixed(2)}</strong>
                        <div className="dashboard-actions">
                          <Link to={`/order-confirmation/${order.id}`} className="text-link">
                            View details
                          </Link>
                          {!['Shipped', 'Delivered', 'Cancelled'].includes(order.status) && (
                            <button
                              type="button"
                              className="text-link danger"
                              onClick={() => handleCancel(order.id)}
                            >
                              Cancel order
                            </button>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === 'wishlist' && (
            <div className="dashboard-panel">
              {wishlist.length === 0 ? (
                <p className="status-message">Your wishlist is empty.</p>
              ) : (
                <div className="wishlist-grid">
                  {wishlist.map((item) => (
                    <article key={item.productId} className="wishlist-card">
                      <img src={item.imageUrl} alt={item.name} />
                      <div>
                        <h3>{item.name}</h3>
                        <p className="product-category">{item.categoryName}</p>
                        <p className="product-price">${item.price.toFixed(2)}</p>
                        {!item.isActive && <p className="stock-badge out">Unavailable</p>}
                        <div className="dashboard-actions">
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => handleAddWishlistToCart(item)}
                            disabled={!item.isActive || item.stockQuantity <= 0}
                          >
                            Add to cart
                          </button>
                          <button
                            type="button"
                            className="text-link danger"
                            onClick={() => handleRemoveWishlist(item.productId)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === 'profile' && (
            <div className="dashboard-panel">
              <form className="auth-form profile-form" onSubmit={handleProfileSave}>
                <label>
                  Full name
                  <input
                    name="fullName"
                    value={profile.fullName}
                    onChange={(e) => setProfile((c) => ({ ...c, fullName: e.target.value }))}
                    required
                  />
                </label>
                <label>
                  Phone
                  <input
                    name="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile((c) => ({ ...c, phone: e.target.value }))}
                  />
                </label>
                <label>
                  Default shipping address
                  <textarea
                    name="shippingAddress"
                    rows="4"
                    value={profile.shippingAddress}
                    onChange={(e) => setProfile((c) => ({ ...c, shippingAddress: e.target.value }))}
                  />
                </label>
                <p className="checkout-note">Email: {user?.email} (cannot be changed)</p>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Save profile'}
                </button>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  );
}
