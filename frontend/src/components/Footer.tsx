import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="w-full border-t border-zinc-800/20 bg-zinc-950 px-6 py-10 md:px-12">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div className="space-y-3">
          <h4 className="font-headline text-xl font-bold tracking-tight text-zinc-100">MOON</h4>
          <p className="font-headline text-[10px] uppercase tracking-[0.08em] text-zinc-500">
            Cinematic Wellness Commerce
          </p>
          <p className="font-headline text-[10px] uppercase tracking-[0.08em] text-zinc-500">
            © 2026 MOON. All rights reserved.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 text-sm md:flex md:items-end md:gap-12">
          <div className="space-y-2">
            <h5 className="font-label text-[10px] uppercase tracking-[0.15em] text-zinc-500">Discover</h5>
            <ul className="space-y-2">
              <li><Link to="/#rituals" className="text-zinc-300 transition-colors hover:text-zinc-100">Rituals</Link></li>
              <li><Link to="/#archives" className="text-zinc-300 transition-colors hover:text-zinc-100">Archives</Link></li>
              <li><Link to="/checkout" className="text-zinc-300 transition-colors hover:text-zinc-100">Checkout</Link></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h5 className="font-label text-[10px] uppercase tracking-[0.15em] text-zinc-500">Company</h5>
            <ul className="space-y-2">
              <li><Link to="/#about" className="text-zinc-300 transition-colors hover:text-zinc-100">Journal</Link></li>
              <li><Link to="/#about" className="text-zinc-300 transition-colors hover:text-zinc-100">Privacy</Link></li>
              <li><Link to="/admin/login" className="text-zinc-300 transition-colors hover:text-zinc-100">Admin</Link></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h5 className="font-label text-[10px] uppercase tracking-[0.15em] text-zinc-500">Social</h5>
            <ul className="space-y-2">
              <li><a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-zinc-300 transition-colors hover:text-zinc-100">Instagram</a></li>
              <li><a href="https://x.com" target="_blank" rel="noreferrer" className="text-zinc-300 transition-colors hover:text-zinc-100">X</a></li>
              <li><a href="https://youtube.com" target="_blank" rel="noreferrer" className="text-zinc-300 transition-colors hover:text-zinc-100">YouTube</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
