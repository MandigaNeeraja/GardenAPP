import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { createOrder } from '../services/api';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCart();
  const { user, isBuyer, isAuthenticated } = useAuth();
  const [form, setForm] = useState({
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    shippingAddress: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isBuyer && user) {
      setForm({
        guestName: user.fullName,
        guestEmail: user.email,
        guestPhone: user.phone || '',
        shippingAddress: user.shippingAddress || '',
      });
    }
  }, [isBuyer, user]);

  if (items.length === 0) {
    return (
      <div className="container section">
        <h1>Checkout</h1>
        <p className="status-message">Your cart is empty.</p>
        <Link to="/products" className="btn btn-primary">
          Browse products
        </Link>
      </div>
    );
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const order = await createOrder({
        ...form,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      });

      clearCart();
      navigate(`/order-confirmation/${order.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container section checkout-page">
      <h1>{isBuyer ? 'Checkout' : 'Guest checkout'}</h1>
      <p className="checkout-note">
        Payment is simulated for this demo. Your order will be saved without a real payment gateway.
        {!isAuthenticated && (
          <>
            {' '}
            <Link to="/login" className="text-link">Sign in</Link> to save orders to your account.
          </>
        )}
      </p>

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <label>
            Full name
            <input
              name="guestName"
              value={form.guestName}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Email
            <input
              type="email"
              name="guestEmail"
              value={form.guestEmail}
              onChange={handleChange}
              required
              disabled={isBuyer}
            />
          </label>

          <label>
            Phone
            <input
              type="tel"
              name="guestPhone"
              value={form.guestPhone}
              onChange={handleChange}
            />
          </label>

          <label>
            Shipping address
            <textarea
              name="shippingAddress"
              rows="4"
              value={form.shippingAddress}
              onChange={handleChange}
              required
            />
          </label>

          {error && <p className="status-message error">{error}</p>}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
          >
            {submitting ? 'Placing order...' : 'Place order (placeholder payment)'}
          </button>
        </form>

        <aside className="cart-summary">
          <h2>Order summary</h2>
          <ul className="checkout-items">
            {items.map((item) => (
              <li key={item.productId}>
                <span>
                  {item.name} x {item.quantity}
                </span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="summary-row total">
            <span>Total</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
