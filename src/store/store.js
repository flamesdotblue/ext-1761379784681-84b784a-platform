import React, { createContext, useContext, useMemo, useReducer, useEffect } from 'react';

const initialState = {
  user: null, // { email, role }
  cart: [], // [{ id, name, price, image, qty }]
  products: [
    {
      id: 'strawberry-delight',
      name: 'Strawberry Delight',
      price: 29.99,
      image:
        'https://images.unsplash.com/photo-1523986371872-9d3ba2e2a389?q=80&w=1200&auto=format&fit=crop',
      description: 'Vanilla sponge, fresh strawberries, and whipped cream.',
    },
    {
      id: 'chocolate-ganache',
      name: 'Chocolate Ganache',
      price: 34.99,
      image:
        'https://images.unsplash.com/photo-1685521488661-34aebd9abdb2?ixid=M3w3OTkxMTl8MHwxfHNlYXJjaHwxfHxDaG9jb2xhdGUlMjBHYW5hY2hlfGVufDB8MHx8fDE3NjEzODAwNTZ8MA&ixlib=rb-4.1.0&w=1600&auto=format&fit=crop&q=80',
      description: 'Rich cocoa layers and silky dark chocolate ganache.',
    },
    {
      id: 'blueberry-cloud',
      name: 'Blueberry Cloud',
      price: 31.5,
      image:
        'https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=1200&auto=format&fit=crop',
      description: 'Lemon zest sponge with blueberry compote and buttercream.',
    },
    {
      id: 'lavender-honey',
      name: 'Lavender Honey',
      price: 36.0,
      image:
        'https://images.unsplash.com/photo-1572898970577-e01cd30b002e?ixid=M3w3OTkxMTl8MHwxfHNlYXJjaHwxfHxMYXZlbmRlciUyMEhvbmV5fGVufDB8MHx8fDE3NjEzODA0MjB8MA&ixlib=rb-4.1.0&w=1600&auto=format&fit=crop&q=80',
      description: 'Floral lavender notes balanced with wildflower honey.',
    },
  ],
};

function reducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload };
    case 'LOGOUT':
      return { ...state, user: null };
    case 'ADD_TO_CART': {
      const existing = state.cart.find((c) => c.id === action.payload.id);
      let cart;
      if (existing) {
        cart = state.cart.map((c) =>
          c.id === action.payload.id ? { ...c, qty: Math.min(99, c.qty + action.payload.qty) } : c
        );
      } else {
        cart = [...state.cart, { ...action.payload }];
      }
      return { ...state, cart };
    }
    case 'REMOVE_FROM_CART':
      return { ...state, cart: state.cart.filter((c) => c.id !== action.payload) };
    case 'UPDATE_QTY': {
      const { id, qty } = action.payload;
      return {
        ...state,
        cart: state.cart.map((c) => (c.id === id ? { ...c, qty: Math.max(1, Math.min(99, qty)) } : c)),
      };
    }
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    default:
      return state;
  }
}

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState, (init) => {
    try {
      const persisted = JSON.parse(localStorage.getItem('cakeshop_state'));
      return persisted ? { ...init, ...persisted, products: init.products } : init;
    } catch {
      return init;
    }
  });

  useEffect(() => {
    localStorage.setItem(
      'cakeshop_state',
      JSON.stringify({ user: state.user, cart: state.cart })
    );
  }, [state.user, state.cart]);

  const actions = useMemo(
    () => ({
      login: (user) => dispatch({ type: 'LOGIN', payload: user }),
      logout: () => dispatch({ type: 'LOGOUT' }),
      addToCart: (item) => dispatch({ type: 'ADD_TO_CART', payload: item }),
      removeFromCart: (id) => dispatch({ type: 'REMOVE_FROM_CART', payload: id }),
      updateQty: (id, qty) => dispatch({ type: 'UPDATE_QTY', payload: { id, qty } }),
      clearCart: () => dispatch({ type: 'CLEAR_CART' }),
    }),
    []
  );

  const value = useMemo(() => ({ state, actions }), [state, actions]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export function selectSubtotal(cart) {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}
