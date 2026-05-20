export function navigateTo(path: string) {
  if (typeof window === 'undefined') {
    return;
  }

  window.history.pushState(null, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export function replaceWith(path: string) {
  if (typeof window === 'undefined') {
    return;
  }

  window.history.replaceState(null, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}
