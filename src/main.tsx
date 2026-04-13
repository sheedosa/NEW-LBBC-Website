import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App';
import './index.css';

// Suppress ResizeObserver loop errors
const resizeObserverErrors = [
  'ResizeObserver loop completed with undelivered notifications.',
  'ResizeObserver loop limit exceeded',
  'ResizeObserver loop'
];

window.addEventListener('error', (e) => {
  if (resizeObserverErrors.some(err => e.message?.includes(err))) {
    e.stopImmediatePropagation();
    e.preventDefault();
  }
});

// Also suppress from console.error
const originalError = console.error;
console.error = (...args) => {
  if (typeof args[0] === 'string' && resizeObserverErrors.some(err => args[0].includes(err))) {
    return;
  }
  originalError.apply(console, args);
};

// Handle unhandled rejections as well
window.addEventListener('unhandledrejection', (e) => {
  if (typeof e.reason?.message === 'string' && resizeObserverErrors.some(err => e.reason.message.includes(err))) {
    e.stopImmediatePropagation();
    e.preventDefault();
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
