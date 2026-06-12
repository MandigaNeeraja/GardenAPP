import { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function getInitials(fullName) {
  if (!fullName) return '?';
  return fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

export default function AuthNav({ variant = 'header' }) {
  const navigate = useNavigate();
  const { user, isAuthenticated, isBuyer, isSeller, logout, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const handleLogout = () => {
    setOpen(false);
    logout();
    navigate('/', { replace: true });
  };

  useEffect(() => {
    if (!open) return undefined;

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  if (loading) {
    return (
      <div className={`auth-nav auth-nav-${variant}`}>
        <span className="auth-nav-loading">Account</span>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className={`auth-nav auth-nav-${variant} profile-menu`} ref={menuRef}>
        <button
          type="button"
          className="profile-menu-trigger"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          aria-haspopup="true"
          aria-label="Account menu"
        >
          <span className="profile-menu-avatar" aria-hidden="true">
            {getInitials(user.fullName)}
          </span>
          <span className="profile-menu-name">{user.fullName}</span>
          <span className="profile-menu-chevron" aria-hidden="true">
            {open ? '▴' : '▾'}
          </span>
        </button>

        {open && (
          <div className="profile-menu-dropdown" role="menu">
            <div className="profile-menu-info">
              <p className="profile-menu-info-name">{user.fullName}</p>
              <p className="profile-menu-info-email">{user.email}</p>
              <span className="profile-menu-info-role">{user.role}</span>
              {isSeller && user.storeName && (
                <p className="profile-menu-info-store">{user.storeName}</p>
              )}
            </div>

            <div className="profile-menu-actions">
              {isBuyer && (
                <NavLink
                  to="/account"
                  className="profile-menu-link"
                  role="menuitem"
                  onClick={() => setOpen(false)}
                >
                  My account
                </NavLink>
              )}
              {isSeller && (
                <NavLink
                  to="/seller/dashboard"
                  className="profile-menu-link"
                  role="menuitem"
                  onClick={() => setOpen(false)}
                >
                  Seller hub
                </NavLink>
              )}
              <button
                type="button"
                className="profile-menu-signout"
                role="menuitem"
                onClick={handleLogout}
              >
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}
