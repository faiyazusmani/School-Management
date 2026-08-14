// Simple event emitter based Toast System
let listeners = [];

export const toast = {
  success: (message) => notify(message, 'success'),
  error: (message) => notify(message, 'error'),
  info: (message) => notify(message, 'info'),
  warning: (message) => notify(message, 'warning'),
};

function notify(message, type = 'info') {
  const id = Date.now() + Math.random();
  const toastItem = { id, message, type };
  listeners.forEach((listener) => listener(toastItem));
}

export const subscribeToast = (listener) => {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
};
