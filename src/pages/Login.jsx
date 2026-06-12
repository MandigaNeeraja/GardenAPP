import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const user = await login(form.email, form.password);
      const defaultHome = user.role === 'Seller' ? '/seller/dashboard' : '/home';
      const redirect = location.state?.from || defaultHome;
      navigate(redirect, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container section auth-page">
      <div className="auth-card">
        <h1>Sign in</h1>
        <p className="auth-subtitle">Welcome back to GreenThumb Garden</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </label>

          <label>
            Password
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
            />
          </label>

          {error && <p className="status-message error">{error}</p>}

          <button type="submit" className="btn btn-primary full-width" disabled={submitting}>
            {submitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="auth-footer">
          New here? <Link to="/register" className="text-link">Create an account</Link>
          {' · '}
          <Link to="/" className="text-link">Back to welcome</Link>
        </p>

        <div className="demo-credentials">
          <p><strong>Demo accounts</strong></p>
          <p>Buyer: buyer@greenthumb.com / Buyer123!</p>
          <p>Seller: seller@greenthumb.com / Seller123!</p>
        </div>
      </div>
    </div>
  );
}
