import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { useApp } from '../store/store';
import { validateEmail, validatePassword } from '../utils/validation';

async function sha256(message) {
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export default function AuthModal({ open, onClose }) {
  const { actions } = useApp();
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const firstField = useRef(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => firstField.current?.focus(), 50);
    }
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validateEmail(email)) return setError('Please enter a valid email address.');
    if (!validatePassword(password))
      return setError('Password must be 8+ characters and include a number.');

    // Simulated credential handling with hashed password (demo only)
    const pwdHash = await sha256(password);
    const user = { email, role: email.includes('@sweetslice.admin') ? 'admin' : 'customer', pwdHash };
    actions.login(user);
    onClose();
  };

  return (
    <div className={`fixed inset-0 z-50 ${open ? 'pointer-events-auto' : 'pointer-events-none'}`} role="dialog" aria-modal={open}>
      <div className={`absolute inset-0 bg-black/40 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`} onClick={onClose} />
      <div className={`absolute left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white shadow-lg transition-transform ${open ? 'scale-100' : 'scale-95'}`}>
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="text-lg font-semibold" style={{ color: '#6A1B9A' }}>{mode === 'login' ? 'Login' : 'Create account'}</h2>
          <button onClick={onClose} aria-label="Close" className="rounded p-2 hover:bg-slate-100">
            <X />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4" noValidate>
          <div className="space-y-1">
            <label htmlFor="email" className="text-sm font-medium text-slate-700">Email</label>
            <input
              ref={firstField}
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border px-3 py-2"
              placeholder="you@example.com"
              aria-invalid={!!error && !validateEmail(email)}
              required
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="password" className="text-sm font-medium text-slate-700">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border px-3 py-2"
              placeholder="At least 8 characters"
              aria-invalid={!!error && !validatePassword(password)}
              required
            />
          </div>
          {error && (
            <div role="alert" className="rounded-md bg-rose-50 text-rose-700 px-3 py-2 text-sm">
              {error}
            </div>
          )}
          <button
            type="submit"
            className="w-full rounded-md px-4 py-2 text-sm font-semibold text-white"
            style={{ backgroundColor: '#E1BEE7', color: '#4A148C' }}
          >
            {mode === 'login' ? 'Login' : 'Sign up'}
          </button>
          <div className="text-sm text-slate-600">
            {mode === 'login' ? (
              <button type="button" onClick={() => setMode('signup')} className="underline">
                Need an account? Sign up
              </button>
            ) : (
              <button type="button" onClick={() => setMode('login')} className="underline">
                Already have an account? Login
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
