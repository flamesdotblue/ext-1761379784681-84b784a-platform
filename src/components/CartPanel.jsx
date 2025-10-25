import { formatCurrency } from '../utils/validation';
import { useApp, selectSubtotal } from '../store/store';
import { X, Trash2, Plus, Minus } from 'lucide-react';

export default function CartPanel({ open, onClose, onCheckout }) {
  const {
    state: { cart },
    actions,
  } = useApp();

  const subtotal = selectSubtotal(cart);

  return (
    <div
      className={`fixed inset-0 z-50 ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}
      aria-hidden={!open}
      role="dialog"
      aria-label="Shopping cart"
    >
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />
      <aside
        className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transition-transform ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="text-lg font-semibold" style={{ color: '#6A1B9A' }}>
            Your cart
          </h2>
          <button onClick={onClose} aria-label="Close cart" className="rounded p-2 hover:bg-slate-100">
            <X />
          </button>
        </div>
        <div className="h-[calc(100%-160px)] overflow-auto p-4">
          {cart.length === 0 ? (
            <p className="text-slate-600">Your cart is empty.</p>
          ) : (
            <ul className="space-y-4">
              {cart.map((item) => (
                <li key={item.id} className="flex gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 rounded object-cover"
                    loading="lazy"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-medium text-slate-900">{item.name}</h3>
                        <p className="text-sm text-slate-600">{formatCurrency(item.price)}</p>
                      </div>
                      <button
                        onClick={() => actions.removeFromCart(item.id)}
                        className="text-rose-600 hover:text-rose-700"
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() => actions.updateQty(item.id, item.qty - 1)}
                        className="rounded border p-1 hover:bg-slate-50"
                        aria-label={`Decrease quantity of ${item.name}`}
                      >
                        <Minus size={16} />
                      </button>
                      <input
                        type="number"
                        inputMode="numeric"
                        min={1}
                        max={99}
                        value={item.qty}
                        onChange={(e) => actions.updateQty(item.id, Number(e.target.value))}
                        className="w-14 rounded border px-2 py-1 text-center"
                        aria-label={`Quantity for ${item.name}`}
                      />
                      <button
                        onClick={() => actions.updateQty(item.id, item.qty + 1)}
                        className="rounded border p-1 hover:bg-slate-50"
                        aria-label={`Increase quantity of ${item.name}`}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="border-t p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-slate-700">Subtotal</span>
            <span className="font-semibold" style={{ color: '#1A237E' }}>
              {formatCurrency(subtotal)}
            </span>
          </div>
          <button
            disabled={cart.length === 0}
            onClick={() => onCheckout()}
            className="w-full rounded-md px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            style={{ backgroundColor: '#F8BBD0', color: '#880E4F' }}
            aria-disabled={cart.length === 0}
          >
            Checkout
          </button>
        </div>
      </aside>
    </div>
  );
}
