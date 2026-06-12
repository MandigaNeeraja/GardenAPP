import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  createSellerProduct,
  deleteSellerProduct,
  getCategories,
  getSellerOrders,
  getSellerProducts,
  updateSellerOrderItemStatus,
  updateSellerProduct,
} from '../services/api';

const EMPTY_PRODUCT = {
  categoryId: '',
  name: '',
  description: '',
  price: '',
  imageUrl: '',
  stockQuantity: '',
};

const STATUSES = ['Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function SellerDashboard() {
  const { user, updateProfile: updateAuthProfile } = useAuth();
  const [tab, setTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(EMPTY_PRODUCT);
  const [editingId, setEditingId] = useState(null);
  const [profile, setProfile] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    storeName: user?.storeName || '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [productsData, ordersData, categoriesData] = await Promise.all([
        getSellerProducts(),
        getSellerOrders(),
        getCategories(),
      ]);
      setProducts(productsData);
      setOrders(ordersData);
      setCategories(categoriesData);
      if (!form.categoryId && categoriesData.length > 0) {
        setForm((current) => ({ ...current, categoryId: String(categoriesData[0].id) }));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setForm({
      ...EMPTY_PRODUCT,
      categoryId: categories.length > 0 ? String(categories[0].id) : '',
    });
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleProductSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    const payload = {
      categoryId: Number(form.categoryId),
      name: form.name,
      description: form.description,
      price: Number(form.price),
      imageUrl: form.imageUrl,
      stockQuantity: Number(form.stockQuantity),
    };

    try {
      if (editingId) {
        await updateSellerProduct(editingId, {
          ...payload,
          isActive: true,
        });
        setSuccess('Product updated.');
      } else {
        await createSellerProduct(payload);
        setSuccess('Product created.');
      }

      resetForm();
      await loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setForm({
      categoryId: String(product.categoryId || categories[0]?.id || ''),
      name: product.name,
      description: product.description || '',
      price: String(product.price),
      imageUrl: product.imageUrl,
      stockQuantity: String(product.stockQuantity),
    });
    setTab('products');
  };

  const handleDeactivate = async (productId) => {
    if (!window.confirm('Deactivate this product?')) return;

    try {
      await deleteSellerProduct(productId);
      setSuccess('Product deactivated.');
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleStatusUpdate = async (orderId, itemId, status) => {
    try {
      await updateSellerOrderItemStatus(orderId, itemId, status);
      const ordersData = await getSellerOrders();
      setOrders(ordersData);
      setSuccess('Order item status updated.');
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
      await updateAuthProfile({
        fullName: profile.fullName,
        phone: profile.phone,
        shippingAddress: '',
        storeName: profile.storeName,
      });
      setSuccess('Store profile updated.');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container section dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>Seller dashboard</h1>
          <p className="dashboard-greeting">{user?.storeName}</p>
        </div>
      </div>

      <div className="dashboard-tabs">
        {['products', 'orders', 'store'].map((key) => (
          <button
            key={key}
            type="button"
            className={`dashboard-tab ${tab === key ? 'active' : ''}`}
            onClick={() => setTab(key)}
          >
            {key === 'products' ? 'My products' : key === 'orders' ? 'Orders' : 'Store profile'}
          </button>
        ))}
      </div>

      {error && <p className="status-message error">{error}</p>}
      {success && <p className="status-message success-message">{success}</p>}

      {loading ? (
        <p className="status-message">Loading seller dashboard...</p>
      ) : (
        <>
          {tab === 'products' && (
            <div className="dashboard-panel seller-products-panel">
              <form className="auth-form product-form" onSubmit={handleProductSubmit}>
                <h2>{editingId ? 'Edit product' : 'Add new product'}</h2>

                <label>
                  Category
                  <select name="categoryId" value={form.categoryId} onChange={handleFormChange} required>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Product name
                  <input name="name" value={form.name} onChange={handleFormChange} required />
                </label>

                <label>
                  Description
                  <textarea name="description" rows="3" value={form.description} onChange={handleFormChange} required />
                </label>

                <div className="form-row">
                  <label>
                    Price ($)
                    <input type="number" step="0.01" min="0.01" name="price" value={form.price} onChange={handleFormChange} required />
                  </label>
                  <label>
                    Stock
                    <input type="number" min="0" name="stockQuantity" value={form.stockQuantity} onChange={handleFormChange} required />
                  </label>
                </div>

                <label>
                  Image URL
                  <input name="imageUrl" value={form.imageUrl} onChange={handleFormChange} required />
                </label>

                <div className="dashboard-actions">
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? 'Saving...' : editingId ? 'Update product' : 'Add product'}
                  </button>
                  {editingId && (
                    <button type="button" className="btn btn-secondary" onClick={resetForm}>
                      Cancel edit
                    </button>
                  )}
                </div>
              </form>

              <div className="seller-product-list">
                <h2>Your listings ({products.length})</h2>
                {products.length === 0 ? (
                  <p className="status-message">No products yet. Add your first listing above.</p>
                ) : (
                  <div className="table-wrap">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Price</th>
                          <th>Stock</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((product) => (
                          <tr key={product.id}>
                            <td>
                              <div className="table-product">
                                <img src={product.imageUrl} alt="" />
                                <span>{product.name}</span>
                              </div>
                            </td>
                            <td>${product.price.toFixed(2)}</td>
                            <td>{product.stockQuantity}</td>
                            <td>{product.isActive ? 'Active' : 'Inactive'}</td>
                            <td>
                              <button type="button" className="text-link" onClick={() => handleEdit(product)}>
                                Edit
                              </button>
                              {product.isActive && (
                                <button
                                  type="button"
                                  className="text-link danger"
                                  onClick={() => handleDeactivate(product.id)}
                                >
                                  Deactivate
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {tab === 'orders' && (
            <div className="dashboard-panel">
              {orders.length === 0 ? (
                <p className="status-message">No orders for your products yet.</p>
              ) : (
                <div className="order-list">
                  {orders.map((order) => (
                    <article key={order.orderId} className="dashboard-card">
                      <div className="dashboard-card-header">
                        <div>
                          <h3>Order #{order.orderId}</h3>
                          <p>{order.buyerName} — {order.buyerEmail}</p>
                          <p>{new Date(order.createdAt).toLocaleString()}</p>
                          <p>{order.shippingAddress}</p>
                        </div>
                        <span
                          className={`status-pill status-${order.orderStatus.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          {order.orderStatus}
                        </span>
                      </div>

                      <ul className="checkout-items">
                        {order.items.map((item) => (
                          <li key={item.orderItemId}>
                            <span>
                              {item.productName} x {item.quantity} — {item.status}
                            </span>
                            <span>${item.lineTotal.toFixed(2)}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="dashboard-card-footer">
                        <strong>Your items total: ${order.orderTotal.toFixed(2)}</strong>
                        <div className="status-update-row">
                          {order.items.map((item) => (
                            <div key={item.orderItemId} className="status-update-item">
                              <span>{item.productName}</span>
                              <select
                                value={item.status}
                                onChange={(e) =>
                                  handleStatusUpdate(order.orderId, item.orderItemId, e.target.value)
                                }
                              >
                                {STATUSES.map((status) => (
                                  <option key={status} value={status}>
                                    {status}
                                  </option>
                                ))}
                              </select>
                            </div>
                          ))}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === 'store' && (
            <div className="dashboard-panel">
              <form className="auth-form profile-form" onSubmit={handleProfileSave}>
                <label>
                  Store name
                  <input
                    value={profile.storeName}
                    onChange={(e) => setProfile((c) => ({ ...c, storeName: e.target.value }))}
                    required
                  />
                </label>
                <label>
                  Contact name
                  <input
                    value={profile.fullName}
                    onChange={(e) => setProfile((c) => ({ ...c, fullName: e.target.value }))}
                    required
                  />
                </label>
                <label>
                  Phone
                  <input
                    value={profile.phone}
                    onChange={(e) => setProfile((c) => ({ ...c, phone: e.target.value }))}
                  />
                </label>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Save store profile'}
                </button>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  );
}
