import AuthNav from './AuthNav';

export default function SiteTopBar() {
  return (
    <div className="site-top-bar">
      <div className="container site-top-bar-inner">
        <p className="site-top-bar-text">Welcome to GreenThumb Garden</p>
        <AuthNav variant="topbar" />
      </div>
    </div>
  );
}
