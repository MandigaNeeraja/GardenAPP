import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { items, subtotal, updateQuantity, removeItem } = useCart();

  if (items.length === 0) {
    return (
      <div className="container section">
        <h1>Your cart</h1>
        <p className="status-message">Your cart is empty.</p>
        <Link to="/products" className="btn btn-primary">
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container section">
      <h1>Your cart</h1>

      <div className="cart-layout">
        <div className="cart-items">
          {items.map((item) => (
            <article key={item.productId} className="cart-item">
              <img src={item.imageUrl} alt={item.name} />
              <div className="cart-item-info">
                <h3>{item.name}</h3>
                <p>${item.price.toFixed(2)} each</p>
                <div className="cart-item-actions">
                  <label htmlFor={`qty-${item.productId}`}>Qty</label>
                  <input
                    id={`qty-${item.productId}`}
                    type="number"
                    min="1"
                    max={item.stockQuantity}
                    value={item.quantity}
                    onChange={(event) =>
                      updateQuantity(item.productId, Number(event.target.value))
                    }
                  />
                  <button
                    type="button"
                    className="text-link danger"
                    onClick={() => removeItem(item.productId)}
                  >
                    Remove
                  </button>
                </div>
              </div>
              <p className="cart-item-total">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </article>
          ))}
        </div>

        <aside className="cart-summary">
          <h2>Order summary</h2>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <p className="summary-note">Shipping calculated at checkout.</p>
          <Link to="/checkout" className="btn btn-primary full-width">
            Proceed to checkout
          </Link>
        </aside>
      </div>
    </div>
  );
}
