import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getOrder } from '../services/api';

export default function OrderConfirmation() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadOrder() {
      try {
        const data = await getOrder(id);
        setOrder(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadOrder();
  }, [id]);

  if (loading) {
    return <p className="status-message container">Loading order...</p>;
  }

  if (error || !order) {
    return (
      <div className="container section">
        <p className="status-message error">{error || 'Order not found.'}</p>
        <Link to="/products" className="btn btn-primary">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container section confirmation-page">
      <div className="confirmation-card">
        <p className="eyebrow">Order confirmed</p>
        <h1>Thank you, {order.guestName}!</h1>
        <p>
          Your order #{order.id} has been placed. Payment was simulated — no real charge was made.
        </p>

        <div className="confirmation-details">
          <div>
            <h3>Shipping to</h3>
            <p>{order.shippingAddress}</p>
            <p>{order.guestEmail}</p>
            {order.guestPhone && <p>{order.guestPhone}</p>}
          </div>
          <div>
            <h3>Order status</h3>
            <p>{order.status}</p>
            <p>{new Date(order.createdAt).toLocaleString()}</p>
          </div>
        </div>

        <ul className="checkout-items">
          {order.items.map((item) => (
            <li key={item.orderItemId ?? `${item.productId}-${item.quantity}`}>
              <span>
                {item.productName} x {item.quantity}
              </span>
              <span>${item.lineTotal.toFixed(2)}</span>
            </li>
          ))}
        </ul>

        <div className="summary-row total">
          <span>Total</span>
          <span>${order.totalAmount.toFixed(2)}</span>
        </div>

        <Link to="/products" className="btn btn-primary">
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
