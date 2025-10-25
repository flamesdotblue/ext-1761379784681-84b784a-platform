import { ShoppingCart, User, LogOut, Cake } from 'lucide-react';
import { useApp } from '../store/store';

export default function Header({ onOpenCart, onOpenAuth }) {
  const {
    state: { user, cart },
    actions,
  } = useApp();
  const cartCount = cart.reduce((a, c) => a + c.qty, 0);

  return (
    <header
      className="sticky top-0 z-40 w-full backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/90 border-b"
      role="banner"
    >
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-white text-sm px-2 py-1 rounded"
        >
          Skip to content
        </a>
        <div className="flex items-center gap-2">
          <div
            aria-hidden
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ backgroundColor: '#F8BBD0' }}
          >
            <Cake className="text-rose-700" />
          </div>
          <span className="text-xl font-semibold tracking-tight" style={{ color: '#6A1B9A' }}>
            Sweet Slice
          </span>
        </div>
        <nav aria-label="Primary" className="hidden md:flex items-center gap-6">
          <a href="#catalog" className="text-sm font-medium text-slate-700 hover:text-slate-900">
            Catalog
          </a>
          <a href="#about" className="text-sm font-medium text-slate-700 hover:text-slate-900">
            About
          </a>
          <a href="#contact" className="text-sm font-medium text-slate-700 hover:text-slate-900">
            Contact
          </a>
        </nav>
        <div className="flex items-center gap-3">
          {user ? (
            <button
              onClick={actions.logout}
              className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-rose-50"
              aria-label="Log out"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-indigo-50"
              aria-label="Log in"
            >
              <User size={18} />
              <span className="hidden sm:inline">Login</span>
            </button>
          )}
          <button
            onClick={onOpenCart}
            className="relative inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-blue-50"
            aria-label={`Open cart with ${cartCount} items`}
          >
            <ShoppingCart size={18} />
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-xs rounded-full w-5 h-5 grid place-items-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
