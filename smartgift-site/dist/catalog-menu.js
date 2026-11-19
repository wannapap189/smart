for (const menu of document.querySelectorAll('[data-catalog-menu]')) {
  const root = menu.closest('.catalogue[data-catalog-view]');
  const panel = menu.querySelector('.catalog-menu-panel');
  const summary = menu.querySelector('.catalog-menu-toggle');
  const label = menu.querySelector('[data-menu-current]');
  const compact = window.matchMedia('(max-width: 900px)');
  const links = [...menu.querySelectorAll('a[data-menu-key]')];
  const keyLinks = new Map(links.map(link => [link.dataset.menuKey, link]));
  const pathOf = url => url.pathname.replace(/\/index\.html$/, '').replace(/\/+$/, '');
  const pathForKey = key => pathOf(new URL(keyLinks.get(key).href));
  function showSelection(link) {
    if (!link) return;
    label.textContent = link.querySelector('.catalog-menu-name').textContent;
    const group = link.closest('.catalog-menu-group');
    if (group) group.open = true;
  }
  function setLayout() { panel.open = !compact.matches; }
  setLayout();
  compact.addEventListener('change', setLayout);
  showSelection(menu.querySelector('[aria-current]'));
  new MutationObserver(() => showSelection(menu.querySelector('[aria-current]')))
    .observe(menu, {subtree:true, attributes:true, attributeFilter:['aria-current']});
  if (!root) continue;

  const cataloguePath = pathForKey('');
  const ownedPath = pathForKey('owned-giftsets');
  const cataloguePaths = new Set([cataloguePath, pathForKey('notebooks'), pathForKey('power-bank-notebooks'),
    cataloguePath.replace(/\/products$/, '/catalog'), cataloguePath.replace(/\/products$/, '/ideas')]);
  const specialPaths = new Map(['edition-2027','silicone-bags','fan-events'].map(key => [pathForKey(key), key]));
  let mountedPath = pathOf(new URL(location.href));
  let pending;

  function viewFor(url) {
    const path = pathOf(url);
    if (cataloguePaths.has(path)) return 'catalogue';
    if (path === ownedPath || path.startsWith(ownedPath+'/')) return 'owned-giftsets';
    return specialPaths.get(path);
  }
  function cancelPending() {
    pending?.abort();
    pending = undefined;
    root.removeAttribute('aria-busy');
  }
  function closeMobileMenu() {
    if (!compact.matches) return;
    panel.open = false;
    summary.focus({preventScroll:true});
  }
  function copyMetadata(next) {
    document.title = next.title;
    const selector = 'link[rel="canonical"],meta[name="description"],meta[name="robots"],meta[property^="og:"],meta[name^="twitter:"],script[type="application/ld+json"]';
    document.head.querySelectorAll(selector).forEach(node => node.remove());
    for (const tag of next.head.querySelectorAll(selector)) document.head.append(document.importNode(tag, true));
    const nextNav = next.querySelector('#main-navigation');
    if (nextNav) {
      const active = new Map([...nextNav.querySelectorAll('a[aria-current]')].map(link => [link.getAttribute('href'), link.getAttribute('aria-current')]));
      for (const link of document.querySelectorAll('#main-navigation a')) {
        const current = active.get(link.getAttribute('href'));
        if (current) link.setAttribute('aria-current', current);
        else link.removeAttribute('aria-current');
      }
    }
  }
  function applyMenu(nextMenu) {
    const selected = nextMenu.querySelector('[data-menu-key][aria-current]')?.dataset.menuKey;
    for (const link of links) {
      const current = link.dataset.menuKey === selected;
      link.classList.toggle('active', current);
      if (current) link.setAttribute('aria-current','page');
      else link.removeAttribute('aria-current');
    }
    showSelection(keyLinks.get(selected));
  }
  async function navigate(url, fromHistory) {
    cancelPending();
    const request = new AbortController();
    pending = request;
    root.setAttribute('aria-busy','true');
    root.dispatchEvent(new CustomEvent('smartgift:catalog-leaving'));
    try {
      const response = await fetch(url.href, {signal:request.signal, credentials:'same-origin'});
      if (!response.ok || !response.headers.get('content-type')?.includes('text/html')) throw Error('Unexpected catalogue response');
      const html = await response.text();
      if (request.signal.aborted) return;
      const next = new DOMParser().parseFromString(html, 'text/html');
      const nextRoot = next.querySelector('.catalogue[data-catalog-view]');
      const nextPane = nextRoot?.querySelector(':scope > [data-catalog-pane]');
      const nextMenu = nextRoot?.querySelector(':scope > [data-catalog-menu]');
      const nextHero = next.querySelector('.page-hero'), oldHero = document.querySelector('.page-hero');
      const pane = root.querySelector(':scope > [data-catalog-pane]');
      if (!nextPane || !nextMenu || !nextHero || !oldHero || !pane || nextRoot.dataset.catalogView !== viewFor(url)) throw Error('Standalone page required');

      const x = window.scrollX, y = window.scrollY;
      // Shared scripts are loaded by the original page and initialize the incoming pane on the view event.
      const paneCopy = document.importNode(nextPane,true);
      for (const script of paneCopy.querySelectorAll('script')) {
        if (!['application/json','application/ld+json'].includes(script.type)) script.remove();
      }
      if (!fromHistory && url.href !== location.href) history.pushState(null,'',url.href);
      // Only the catalogue shell changes. The menu, focus targets and its expanded groups stay in place.
      for (const attribute of [...root.attributes]) root.removeAttribute(attribute.name);
      for (const attribute of nextRoot.attributes) root.setAttribute(attribute.name, attribute.value);
      oldHero.replaceWith(document.importNode(nextHero,true));
      pane.replaceWith(paneCopy);
      applyMenu(nextMenu);
      copyMetadata(next);
      mountedPath = pathOf(url);
      document.dispatchEvent(new CustomEvent('smartgift:catalog-view', {bubbles:true, detail:{view:nextRoot.dataset.catalogView}}));
      if (window.scrollX !== x || window.scrollY !== y) window.scrollTo({left:x,top:y,behavior:'instant'});
    } catch {
      if (!request.signal.aborted) {
        if (fromHistory) location.reload();
        else location.assign(url.href);
      }
    } finally {
      if (pending === request) {
        pending = undefined;
        root.removeAttribute('aria-busy');
      }
    }
  }
  root.addEventListener('click', event => {
    const link = event.target.closest('a[data-menu-key],a[data-owned-subcategory],.giftset-sidebar nav a');
    if (!link || event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey ||
        link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
    const url = new URL(link.href);
    if (url.origin !== location.origin || !viewFor(url)) return;
    cancelPending();
    if (link.closest('[data-catalog-menu]')) closeMobileMenu();
    if (root.dataset.catalogView === 'catalogue' && link.hasAttribute('data-category')) return;
    event.preventDefault();
    if (url.href !== location.href) navigate(url, false);
  }, {capture:true});
  window.addEventListener('popstate', () => {
    cancelPending();
    const url = new URL(location.href), nextView = viewFor(url);
    if (root.dataset.catalogView === nextView) {
      if (nextView === 'catalogue') {
        root.dispatchEvent(new CustomEvent('smartgift:catalog-restore'));
        return;
      }
      if (pathOf(url) === mountedPath) {
        if (nextView === 'owned-giftsets') root.dispatchEvent(new CustomEvent('smartgift:catalog-restore'));
        return;
      }
    }
    if (nextView) navigate(url, true);
    else location.reload();
  });
}
