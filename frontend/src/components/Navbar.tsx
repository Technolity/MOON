import { useState } from 'react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  cartCount: number;
  onCartClick: () => void;
  onSearchClick: () => void;
  onAccountClick: () => void;
}

export function Navbar({ cartCount, onCartClick, onSearchClick, onAccountClick }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { href: '/#rituals', label: 'Shop' },
    { href: '/#archives', label: 'Our Story' },
    { href: '/#rituals', label: 'Shilajit' },
    { href: '/#rituals', label: 'Saffron' },
    { href: '/#about', label: 'Journal' },
  ];

  return (
    <nav
      className="fixed top-0 z-50 w-full border-b border-zinc-200/60 bg-white/85 px-4 py-4 backdrop-blur-xl md:px-10"
      id="navbar"
      aria-label="Primary"
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4">
        <Link
          to="/#sanctuary"
          className="font-headline text-xl font-bold tracking-tight text-zinc-900"
          aria-label="Moon home"
        >
          MOON
        </Link>

        <ul className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                to={item.href}
                className="font-headline text-xs font-semibold uppercase tracking-[0.1em] text-zinc-500 transition-colors duration-300 hover:text-zinc-900"
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              to="/admin/login"
              className="font-headline text-xs font-semibold uppercase tracking-[0.1em] text-zinc-500 transition-colors duration-300 hover:text-zinc-900"
            >
              Admin
            </Link>
          </li>
        </ul>

        <div className="flex items-center gap-2 md:gap-4">
          <form
            className="relative hidden md:block"
            onSubmit={(event) => {
              event.preventDefault();
              onSearchClick();
            }}
          >
            <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-zinc-400">
              search
            </span>
            <input
              className="w-44 border border-transparent bg-zinc-100 py-2 pl-10 pr-3 font-label text-[10px] uppercase tracking-[0.2em] text-zinc-700 outline-none transition-colors focus:border-zinc-400/50"
              placeholder="Explore"
              type="search"
              aria-label="Search products"
            />
          </form>

          <button
            className="relative rounded-full p-2 text-zinc-800 transition-opacity hover:opacity-80"
            type="button"
            aria-label={`Open cart with ${cartCount} items`}
            onClick={onCartClick}
          >
            <span className="material-symbols-outlined">shopping_bag</span>
            <span className="absolute -right-1 -top-1 min-w-[18px] rounded-full bg-secondary px-1 text-center text-[10px] font-semibold leading-[18px] text-on-secondary-fixed">
              {cartCount}
            </span>
          </button>

          <button
            className="hidden rounded-full p-2 text-zinc-800 transition-opacity hover:opacity-80 md:inline-flex"
            type="button"
            aria-label="Owner dashboard login"
            onClick={onAccountClick}
          >
            <span className="material-symbols-outlined">person</span>
          </button>

          <button
            className="rounded-full p-2 text-zinc-800 md:hidden"
            type="button"
            aria-expanded={isMobileMenuOpen ? 'true' : 'false'}
            aria-controls="mobile-menu"
            aria-label="Toggle mobile menu"
            onClick={() => setIsMobileMenuOpen((current) => !current)}
          >
            <span className="material-symbols-outlined">{isMobileMenuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      {isMobileMenuOpen ? (
        <div id="mobile-menu" className="mx-auto mt-4 w-full max-w-7xl border border-zinc-200/60 bg-white p-4 md:hidden">
          <ul className="space-y-3">
            {navItems.map((item) => (
              <li key={`mobile-${item.href}`}>
                <Link
                  to={item.href}
                  className="block font-headline text-xs font-semibold uppercase tracking-[0.12em] text-zinc-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/admin/login"
                className="block font-headline text-xs font-semibold uppercase tracking-[0.12em] text-zinc-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Admin
              </Link>
            </li>
            <li>
              <Link
                to="/checkout"
                className="block font-headline text-xs font-semibold uppercase tracking-[0.12em] text-zinc-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Checkout
              </Link>
            </li>
          </ul>
        </div>
      ) : null}
    </nav>
  );
}
