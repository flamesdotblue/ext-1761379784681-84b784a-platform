import { useMemo, useState } from 'react';
import Header from './components/Header';
import ProductGrid from './components/ProductGrid';
import CartPanel from './components/CartPanel';
import AuthModal from './components/AuthModal';
import CheckoutForm from './components/CheckoutForm';
import { AppProvider, useApp } from './store/store';

function HomePage() {
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const { state } = useApp();

  const accentStyles = useMemo(
    () => ({
      background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(248,187,208,0.45) 100%)',
    }),
    []
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-rose-50" style={{ fontFamily: 'Inter, ui-sans-serif' }}>
      <Header onOpenCart={() => setCartOpen(true)} onOpenAuth={() => setAuthOpen(true)} />
      <main id="main" className="mx-auto max-w-6xl px-4">
        <section className="rounded-2xl border overflow-hidden mt-6" style={accentStyles}>
          <div className="grid md:grid-cols-2 gap-6 p-6">
            <div className="flex flex-col justify-center">
              <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight" style={{ color: '#4A148C' }}>
                Cakes that make moments sweeter
              </h1>
              <p className="mt-3 text-slate-700">
                Hand-crafted cakes with premium ingredients. Pastel-perfect designs, ready for any
                celebration.
              </p>
              <div className="mt-4">
                <a href="#catalog" className="inline-flex items-center rounded-md px-4 py-2 text-sm font-semibold text-white" style={{ backgroundColor: '#E1BEE7', color: '#4A148C' }}>
                  Browse catalog
                </a>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=1200&auto=format&fit=crop"
                alt="Assortment of pastel cakes"
                loading="lazy"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
          </div>
        </section>
        {!checkingOut && <ProductGrid />}
        {checkingOut && (
          <section className="py-10" aria-live="polite">
            <div className="mx-auto max-w-2xl rounded-2xl border bg-white p-6">
              <CheckoutForm onSuccess={() => setCheckingOut(false)} />
            </div>
          </section>
        )}
        <section id="about" className="py-14">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-2xl font-bold mb-3" style={{ color: '#6A1B9A' }}>About Sweet Slice</h2>
            <p className="text-slate-700">
              We are a boutique cake shop specializing in modern flavors and playful designs. Our bakers
              craft each cake with care, ensuring a delightful experience from first glance to last bite.
            </p>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 mt-10">
        <div className="mx-auto max-w-6xl px-4 text-sm text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} Sweet Slice Cake Shop</span>
          <a id="contact" href="mailto:hello@sweetslice.cakes" className="underline">
            hello@sweetslice.cakes
          </a>
        </div>
      </footer>

      <CartPanel
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckout={() => {
          setCartOpen(false);
          setCheckingOut(true);
        }}
      />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <HomePage />
    </AppProvider>
  );
}
