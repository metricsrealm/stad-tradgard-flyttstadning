// Ensure window.fetch has both getter and setter to prevent extension errors
try {
  if (typeof window !== 'undefined') {
    let currentFetch = window.fetch;
    const desc = {
      get() {
        return currentFetch;
      },
      set(val: typeof window.fetch) {
        currentFetch = val;
      },
      configurable: true,
      enumerable: true
    };
    try {
      Object.defineProperty(window, 'fetch', desc);
    } catch (_) {}
    if (typeof Window !== 'undefined' && Window.prototype) {
      try {
        Object.defineProperty(Window.prototype, 'fetch', desc);
      } catch (_) {}
    }
  }
} catch (_) {}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
