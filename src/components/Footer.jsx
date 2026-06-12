import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Footer() {
  const navigate = useNavigate();
  const { isAuthenticated, isBuyer, isSeller, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div>
          <h3>GreenThumb Garden</h3>
          <p>Quality pots, tools, and plants for every gardener.</p>
        </div>
        <div>
          <h4>Shop</h4>
          <p><Link to="/home">Home</Link></p>
          <p><Link to="/products">All products</Link></p>
          <p><Link to="/cart">Cart</Link></p>
        </div>
        <div>
          <h4>Account</h4>
          {!isAuthenticated ? (
            <>
              <p><Link to="/login">Sign in</Link></p>
              <p><Link to="/register">Sign up</Link></p>
            </>
          ) : (
            <>
              {isBuyer && <p><Link to="/account">My account</Link></p>}
              {isSeller && <p><Link to="/seller/dashboard">Seller hub</Link></p>}
              <p>
                <button type="button" className="footer-link-btn" onClick={handleLogout}>
                  Sign out
                </button>
              </p>
            </>
          )}
        </div>
        <div>
          <h4>Contact</h4>
          <p>hello@greenthumbgarden.com</p>
          <p>(555) 123-4567</p>
          <p>Mon–Sat: 9am – 6pm</p>
        </div>
      </div>
      <p className="footer-copy">&copy; {new Date().getFullYear()} GreenThumb Garden. All rights reserved.</p>
    </footer>
  );
}
