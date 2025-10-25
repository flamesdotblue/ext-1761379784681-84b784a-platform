import { useApp } from '../store/store';
import { formatCurrency } from '../utils/validation';

export default function ProductGrid() {
  const {
    state: { products },
    actions,
  } = useApp();

  return (
    <section id="catalog" aria-labelledby="catalog-heading" className="py-10">
      <div className="mx-auto max-w-6xl px-4">
        <h2 id="catalog-heading" className="text-2xl font-bold mb-6" style={{ color: '#4A148C' }}>
          Pick your cake
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <li key={p.id} className="group rounded-xl border overflow-hidden bg-white">
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={p.image}
                  alt={`${p.name} cake`}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="p-4 flex flex-col gap-3">
                <div>
                  <h3 className="text-lg font-semibold" style={{ color: '#6A1B9A' }}>
                    {p.name}
                  </h3>
                  <p className="text-sm text-slate-600">{p.description}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold" style={{ color: '#1A237E' }}>
                    {formatCurrency(p.price)}
                  </span>
                  <div className="flex items-center gap-2">
                    <label htmlFor={`qty-${p.id}`} className="sr-only">
                      Quantity for {p.name}
                    </label>
                    <select
                      id={`qty-${p.id}`}
                      className="border rounded-md px-2 py-1 text-sm"
                      defaultValue={1}
                      aria-label={`Quantity for ${p.name}`}
                      onChange={(e) => (p._selectedQty = Number(e.target.value))}
                    >
                      {Array.from({ length: 10 }).map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() =>
                        actions.addToCart({ id: p.id, name: p.name, image: p.image, price: p.price, qty: p._selectedQty || 1 })
                      }
                      className="rounded-md px-3 py-2 text-sm text-white"
                      style={{ backgroundColor: '#BBDEFB', color: '#0D47A1' }}
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
