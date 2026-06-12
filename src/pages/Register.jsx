import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'Buyer',
    storeName: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);

    try {
      const user = await register({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        phone: form.phone,
        role: form.role,
        storeName: form.role === 'Seller' ? form.storeName : null,
      });

      navigate(user.role === 'Seller' ? '/seller/dashboard' : '/home', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container section auth-page">
      <div className="auth-card auth-card-wide">
        <h1>Create account</h1>
        <p className="auth-subtitle">Join as a buyer or seller on GreenThumb Garden</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="role-selector">
            <label className={`role-option ${form.role === 'Buyer' ? 'active' : ''}`}>
              <input
                type="radio"
                name="role"
                value="Buyer"
                checked={form.role === 'Buyer'}
                onChange={handleChange}
              />
              <span>Buyer</span>
              <small>Shop products, track orders, save wishlist</small>
            </label>
            <label className={`role-option ${form.role === 'Seller' ? 'active' : ''}`}>
              <input
                type="radio"
                name="role"
                value="Seller"
                checked={form.role === 'Seller'}
                onChange={handleChange}
              />
              <span>Seller</span>
              <small>List products and manage orders</small>
            </label>
          </div>

          <label>
            Full name
            <input name="fullName" value={form.fullName} onChange={handleChange} required />
          </label>

          <label>
            Email
            <input type="email" name="email" value={form.email} onChange={handleChange} required />
          </label>

          <label>
            Phone
            <input type="tel" name="phone" value={form.phone} onChange={handleChange} />
          </label>

          {form.role === 'Seller' && (
            <label>
              Store name
              <input name="storeName" value={form.storeName} onChange={handleChange} required />
            </label>
          )}

          <label>
            Password
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </label>

          <label>
            Confirm password
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
          </label>

          {error && <p className="status-message error">{error}</p>}

          <button type="submit" className="btn btn-primary full-width" disabled={submitting}>
            {submitting ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login" className="text-link">Sign in</Link>
          {' · '}
          <Link to="/" className="text-link">Back to welcome</Link>
        </p>
      </div>
    </div>
  );
}
