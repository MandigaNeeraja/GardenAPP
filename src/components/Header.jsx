import { Link, NavLink } from 'react-router-dom';
import AuthNav from './AuthNav';
import { useCart } from '../context/CartContext';

export default function Header() {
  const { cartCount } = useCart();

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/home" className="logo">
          <span className="logo-icon" aria-hidden="true">🌿</span>
          GreenThumb Garden
        </Link>

        <nav className="main-nav" aria-label="Main navigation">
          <NavLink to="/home" end>Home</NavLink>
          <NavLink to="/products">Products</NavLink>
          <NavLink to="/cart" className="cart-link" aria-label="Cart">
            <span className="cart-icon" aria-hidden="true">🛒</span>
            {cartCount > 0 && (
              <span className="cart-badge">{cartCount}</span>
            )}
          </NavLink>
          <AuthNav variant="header" />
        </nav>
      </div>
    </header>
  );
}
