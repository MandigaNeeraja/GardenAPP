import { Link, Outlet } from 'react-router-dom';

export default function GuestLayout() {
  return (
    <div className="guest-shell">
      <header className="guest-header">
        <div className="container guest-header-inner">
          <Link to="/" className="logo">
            <span className="logo-icon" aria-hidden="true">🌿</span>
            GreenThumb Garden
          </Link>
        </div>
      </header>
      <main className="guest-main">
        <Outlet />
      </main>
    </div>
  );
}
