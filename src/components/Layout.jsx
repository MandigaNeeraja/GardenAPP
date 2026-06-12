import { Outlet } from 'react-router-dom';
import Footer from './Footer';
import Header from './Header';
import SiteTopBar from './SiteTopBar';

export default function Layout() {
  return (
    <div className="app-shell">
      <SiteTopBar />
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
