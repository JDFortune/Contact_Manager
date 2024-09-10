export function debounce(callback, ms) {
  let timeout;

  return function(...args) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => callback.apply(null, args), ms);
  }
}