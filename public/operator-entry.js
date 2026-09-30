/* Keep Desk on a real document URL so Safari sees its manifest before React. */
(() => {
  const routeDesk = () => {
    const { pathname, search, hash } = window.location;
    const operatorHash = /^#\/operator(?:[/?]|$)/.test(hash);
    const operatorDocument = /^\/operator(?:\/|\/index\.html)?$/.test(pathname);
    if (operatorDocument) {
      if (hash && !operatorHash) {
        // Portfolio navigation must leave the Desk document and its manifest.
        window.location.replace(`/${search}${hash}`);
      } else {
        // Preserve notification conversation queries when opening a bare URL.
        const route = hash || `#/operator${search}`;
        window.history.replaceState(window.history.state, '', `/operator/${hash ? search : ''}${route}`);
      }
    } else if (operatorHash) {
      window.location.replace(`/operator/${search}${hash}`);
    }
  };
  routeDesk();
  window.addEventListener('hashchange', routeDesk);
})();
