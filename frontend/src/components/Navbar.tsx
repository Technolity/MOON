import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

interface NavbarProps {
  cartCount: number;
  onCartClick: () => void;
  onSearchClick: () => void;
  onAccountClick: () => void;
}

export function Navbar({ cartCount, onCartClick, onSearchClick, onAccountClick }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems = [
    { href: '/#shop', label: 'Shop' },
    { href: '/#rituals', label: 'Rituals' },
    { href: '/#archives', label: 'The Archive' },
    { href: '/#journal', label: 'Journal' },
    { href: '/#contact', label: 'Contact' },
  ];

  return (
    <nav
      id="navbar"
      aria-label="Primary"
      className={`moon-nav ${scrolled ? 'moon-nav--scrolled' : ''}`}
    >
      <div className="moon-nav-inner">
        {/* Wordmark */}
        <Link to="/" aria-label="Moon home" className="moon-wordmark">
          <span className="moon-wordmark-text">moon.</span>
          <span className="moon-wordmark-tagline">Naturally yours</span>
        </Link>

        {/* Desktop nav links */}
        <ul className="moon-nav-links hidden md:flex">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link to={item.href} className="moon-nav-link">
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              to="/admin/login"
              className={`moon-nav-link ${scrolled ? 'moon-nav-link--admin' : 'moon-nav-link--admin-transparent'}`}
            >
              Admin
            </Link>
          </li>
        </ul>

        {/* Right actions */}
        <div className="moon-nav-actions">
          <button
            type="button"
            aria-label="Search"
            onClick={onSearchClick}
            className="moon-nav-action-btn"
          >
            <span className="material-symbols-outlined moon-nav-icon">search</span>
          </button>
          <button
            type="button"
            aria-label="Account"
            onClick={onAccountClick}
            className="moon-nav-action-btn hidden md:flex"
          >
            <span className="material-symbols-outlined moon-nav-icon">person</span>
          </button>
          <button
            type="button"
            aria-label={`Open cart, ${cartCount} items`}
            onClick={onCartClick}
            className="moon-nav-action-btn moon-nav-cart-btn"
          >
            <span className="material-symbols-outlined moon-nav-icon">shopping_bag</span>
            {cartCount > 0 && (
              <span className="moon-cart-badge">{cartCount}</span>
            )}
          </button>
          <button
            type="button"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMobileOpen(o => !o)}
            className="moon-nav-action-btn md:hidden"
          >
            <span className="material-symbols-outlined moon-nav-icon">
              {mobileOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="moon-mobile-menu">
          <ul className="moon-mobile-menu-list">
            {navItems.map(item => (
              <li key={`m-${item.href}`}>
                <Link
                  to={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="moon-mobile-link"
                >{item.label}</Link>
              </li>
            ))}
            <li>
              <Link
                to="/admin/login"
                onClick={() => setMobileOpen(false)}
                className="moon-mobile-link moon-mobile-link--admin"
              >Admin</Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
