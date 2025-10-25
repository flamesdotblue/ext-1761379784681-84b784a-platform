import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react';

const AppStateContext = createContext(null);

const initialState = {
  user: null, // {name, role}
  cartOpen: false,
  authOpen: false,
  checkoutOpen: false,
  cart: [], // [{id, name, price, image, qty}]
  products: [
    {
      id: 'cake-1',
      name: 'Strawberry Shortcake',
      description: 'Layers of sponge cake, fresh strawberries, and whipped cream.',
      price: 29.99,
      image:
        'https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?q=80&w=1200&auto=format&fit=crop',
    },
    {
      id: 'cake-2',
      name: 'Lavender Blueberry',
      description: 'Blueberry compote with a hint of lavender in a buttercream finish.',
      price: 34.5,
      image:
        'https://images.unsplash.com/photo-1578775887804-699de7086ff9?q=80&w=1200&auto=format&fit=crop',
    },
    {
      id: 'cake-3',
      name: 'Vanilla Blossom',
      description: 'Classic vanilla cake with silky Swiss meringue buttercream.',
      price: 24.0,
      image:
        'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=1200&auto=format&fit=crop',
    },
    {
      id: 'cake-4',
      name: 'Chocolate Truffle',
      description: 'Rich chocolate layers with dark ganache and cocoa dust.',
      price: 39.0,
      image:
        'https://images.unsplash.com/photo-1582493255270-b3844e2a63c8?ixid=M3w3OTkxMTl8MHwxfHNlYXJjaHwxfHxDaG9jb2xhdGUlMjBUcnVmZmxlfGVufDB8MHx8fDE3NjEzNzgyNjR8MA&ixlib=rb-4.1.0&w=1600&auto=format&fit=crop&q=80',
    },
  ],
};

function reducer(state, action) {
  switch (action.type) {
    case 'INIT':
      return { ...state, ...action.payload };
    case 'OPEN_CART':
      return { ...state, cartOpen: true };
    case 'CLOSE_CART':
      return { ...state, cartOpen: false };
    case 'OPEN_AUTH':
      return { ...state, authOpen: true };
    case 'CLOSE_AUTH':
      return { ...state, authOpen: false };
    case 'OPEN_CHECKOUT':
      return { ...state, checkoutOpen: true };
    case 'CLOSE_CHECKOUT':
      return { ...state, checkoutOpen: false };
    case 'LOGIN':
      return { ...state, user: action.payload, authOpen: false };
    case 'LOGOUT':
      return { ...state, user: null };
    case 'ADD_TO_CART': {
      const existing = state.cart.find((i) => i.id === action.payload.id);
      let newCart;
      if (existing) {
        newCart = state.cart.map((i) =>
          i.id === action.payload.id ? { ...i, qty: Math.min(99, i.qty + (action.payload.qty || 1)) } : i
        );
      } else {
        newCart = [...state.cart, { ...action.payload, qty: action.payload.qty || 1 }];
      }
      return { ...state, cart: newCart };
    }
    case 'REMOVE_FROM_CART': {
      return { ...state, cart: state.cart.filter((i) => i.id !== action.payload) };
    }
    case 'UPDATE_QTY': {
      const { id, qty } = action.payload;
      const newCart = state.cart.map((i) => (i.id === id ? { ...i, qty: Math.max(1, Math.min(99, qty)) } : i));
      return { ...state, cart: newCart };
    }
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const saved = localStorage.getItem('cake_shop_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        dispatch({ type: 'INIT', payload: { ...state, ...parsed, authOpen: false, cartOpen: false, checkoutOpen: false } });
      } catch (_) {
        // ignore
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const persist = { user: state.user, cart: state.cart };
    localStorage.setItem('cake_shop_state', JSON.stringify(persist));
  }, [state.user, state.cart]);

  const subtotal = useMemo(() => state.cart.reduce((sum, i) => sum + i.price * i.qty, 0), [state.cart]);

  const value = useMemo(
    () => ({ state, dispatch, subtotal }),
    [state, subtotal]
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
