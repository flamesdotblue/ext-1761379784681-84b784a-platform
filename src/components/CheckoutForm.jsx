import { useState } from 'react';
import { useApp, selectSubtotal } from '../store/store';
import { formatCurrency, validateEmail, validateRequired } from '../utils/validation';

export default function CheckoutForm({ onSuccess }) {
  const {
    state: { cart, user },
    actions,
  } = useApp();

  const subtotal = selectSubtotal(cart);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handlePay = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!validateRequired(name)) return setError('Please enter your full name.');
    if (!validateRequired(address)) return setError('Please enter your shipping address.');
    if (!validateEmail(email)) return setError('Please enter a valid email.');
    if (cart.length === 0) return setError('Your cart is empty.');

    setProcessing(true);
    try {
      // Demo payment flow (no backend). In production, create a PaymentIntent on the server.
      await new Promise((r) => setTimeout(r, 1200));
      setSuccess('Payment successful! Your cakes are on the way.');
      actions.clearCart();
      onSuccess?.();
    } catch (err) {
      setError('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handlePay} className="space-y-4" aria-labelledby="checkout-heading" noValidate>
      <h2 id="checkout-heading" className="text-xl font-semibold" style={{ color: '#6A1B9A' }}>
        Checkout
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label htmlFor="name" className="text-sm font-medium text-slate-700">
            Full name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border px-3 py-2"
            placeholder="Jane Doe"
            required
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="email" className="text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border px-3 py-2"
            placeholder="you@example.com"
            required
          />
        </div>
        <div className="sm:col-span-2 space-y-1">
          <label htmlFor="address" className="text-sm font-medium text-slate-700">
            Shipping address
          </label>
          <input
            id="address"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full rounded-md border px-3 py-2"
            placeholder="123 Cupcake Lane, Sweet City"
            required
          />
        </div>
      </div>

      <div className="rounded-lg border p-4 bg-slate-50" aria-label="Order summary">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-700">Subtotal</span>
          <span className="font-semibold" style={{ color: '#1A237E' }}>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-1">
          <span className="text-slate-700">Shipping</span>
          <span className="text-slate-600">Calculated at next step</span>
        </div>
      </div>

      {error && (
        <div role="alert" className="rounded-md bg-rose-50 text-rose-700 px-3 py-2 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div role="status" className="rounded-md bg-emerald-50 text-emerald-700 px-3 py-2 text-sm">
          {success}
        </div>
      )}

      <button
        type="submit"
        disabled={processing}
        className="w-full rounded-md px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        style={{ backgroundColor: '#BBDEFB', color: '#0D47A1' }}
        aria-busy={processing}
      >
        {processing ? 'Processing…' : 'Pay now'}
      </button>
    </form>
  );
}
