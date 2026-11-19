function initSetQuote(panel) {
  if (panel.dataset.setQuoteReady === 'true') return;
  panel.dataset.setQuoteReady = 'true';
  const select = panel.querySelector('[name="qty"]');
  const chat = panel.querySelector('[data-set-chat]');
  const draft = panel.querySelector('[data-set-draft]');
  const copy = panel.querySelector('[data-copy-draft]');
  const status = panel.querySelector('[data-copy-status]');
  const initial = select.options[0].value;
  const requested = new URL(location.href).searchParams.get('qty');
  select.value = [...select.options].some(option => option.value === requested) ? requested : initial;

  function withQuantity(url) {
    if (select.value === initial) url.searchParams.delete('qty');
    else url.searchParams.set('qty', select.value);
    return url;
  }
  function update() {
    if (!panel.isConnected) return;
    const choice = select.selectedOptions[0];
    chat.href = choice.dataset.chat;
    draft.textContent = choice.dataset.draft;
    status.textContent = '';
    history.replaceState(history.state, '', withQuantity(new URL(location.href)));
    for (const link of document.querySelectorAll('[data-set-detail-link]')) link.href = withQuantity(new URL(link.href)).href;
  }
  select.addEventListener('change', update);
  update();
  select.disabled = false;
  if (navigator.clipboard?.writeText) {
    copy.hidden = false;
    copy.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(draft.textContent);
        status.textContent = 'คัดลอกแล้ว';
      } catch {
        status.textContent = 'เลือกข้อความด้านบนเพื่อคัดลอก';
      }
    });
  }
}

(() => {
  let current;
  let catalogueRequest;
  function getCatalogue() {
    if (!catalogueRequest) {
      catalogueRequest = Promise.all([
        import('/owned-catalogue-view.js'),
        fetch('/data/owned-giftsets.json').then(response => {
          if (!response.ok) throw new Error('Gift set catalogue unavailable');
          return response.json();
        }).then(data => data.items)
      ]).catch(error => {
        catalogueRequest = undefined;
        throw error;
      });
    }
    return catalogueRequest;
  }

  function attach(catalogue, pane, controller) {
    const options = {signal:controller.signal};
    const form = pane.querySelector('[data-owned-search]');
    const search = form.querySelector('#owned-search');
    const budget = pane.querySelector('[name="budget"]');
    const quantities = [...pane.querySelectorAll('[name="qty"]')];
    const sort = pane.querySelector('[data-owned-sort]');
    const count = pane.querySelector('[data-owned-count]');
    const grid = pane.querySelector('[data-owned-results]');
    const pagination = pane.querySelector('[data-owned-pagination]');
    const categoryLinks = [...pane.querySelectorAll('a[data-owned-subcategory]')];
    const selected = categoryLinks.find(link => link.hasAttribute('aria-current'));
    const category = selected.dataset.ownedSubcategory;
    const normalise = path => path.replace(/\/index\.html$/, '').replace(/\/+$/, '');
    const viewPath = normalise(new URL(selected.href).pathname);
    const size = 24;
    let page, items, view;

    function isCurrent() {
      return !controller.signal.aborted && pane.isConnected &&
        catalogue.dataset.catalogView === 'owned-giftsets' &&
        pane === catalogue.querySelector(':scope > [data-catalog-pane]') &&
        normalise(location.pathname) === viewPath;
    }

    function restore() {
      if (!isCurrent()) return;
      const params = new URLSearchParams(location.search);
      page = Number(params.get('page'));
      if (!Number.isSafeInteger(page) || page < 1) page = 1;
      search.value = params.get('q') || '';
      const chosenQty = quantities.find(radio => radio.value === params.get('qty')) || quantities[0];
      chosenQty.checked = true;
      budget.value = [...budget.options].some(option => option.value === params.get('budget')) ? params.get('budget') : '';
      sort.value = params.get('sort') === 'sku' ? 'sku' : 'original';
      render();
    }

    function render() {
      if (!items || !isCurrent()) return;
      const quantity = Number(quantities.find(radio => radio.checked).value);
      const band = view.budgetBands.find(option => option.key === budget.value);
      const query = search.value.trim();
      const term = query.toLowerCase();
      const found = items.filter(item => {
        if (category && item.category !== category) return false;
        const price = view.priceAt(item, quantity);
        if (band && !(price >= band.min && price <= band.max)) return false;
        return !term || [item.sku, item.name, item.contents, item.categoryName].join(' ').toLowerCase().includes(term);
      });
      if (sort.value === 'sku') found.sort((a,b) => a.sku.localeCompare(b.sku));
      const pages = Math.max(1, Math.ceil(found.length / size));
      page = Math.min(page, pages);
      count.textContent = found.length ? found.length.toLocaleString('th-TH') + ' แบบ · หน้า ' + page + ' / ' + pages : 'พบ 0 แบบ';
      grid.innerHTML = found.slice((page - 1) * size, page * size).map(item => view.renderSetCard(item, quantity)).join('')
        || '<div class="empty-state"><p>ไม่พบชุดของขวัญที่ตรงกับเงื่อนไขนี้</p><button type="button" class="button outline" data-clear-set-filters>ล้างคำค้นและช่วงราคา</button></div>';
      pagination.innerHTML = pages > 1 ? `<button data-page="${page-1}" ${page===1?'disabled':''}>← ก่อนหน้า</button><span>${page} / ${pages}</span><button data-page="${page+1}" ${page===pages?'disabled':''}>ถัดไป →</button>` : '';
      const filters = {q:query, qty:quantity === 50 ? '' : String(quantity), budget:budget.value, sort:sort.value === 'sku' ? 'sku' : ''};
      function updateUrl(url, currentPage) {
        for (const [key, value] of Object.entries({...filters, page:currentPage > 1 ? String(currentPage) : ''})) {
          if (value) url.searchParams.set(key,value);
          else url.searchParams.delete(key);
        }
        return url;
      }
      history.replaceState(history.state, '', updateUrl(new URL(location.href), page));
      for (const link of categoryLinks) link.href = updateUrl(new URL(link.href), 1).href;
    }
    function startOver() {page = 1; render();}
    form.addEventListener('submit', event => {event.preventDefault(); startOver();}, options);
    for (const control of [...quantities, budget, sort]) control.addEventListener('change', startOver, options);
    grid.addEventListener('click', event => {
      if (event.target.closest('[data-clear-set-filters]')) {
        budget.value = ''; search.value = ''; startOver(); search.focus();
      }
    }, options);
    pagination.addEventListener('click', event => {
      const button = event.target.closest('[data-page]');
      if (!button || button.disabled) return;
      page = Number(button.dataset.page); render();
      count.scrollIntoView({block:'center',behavior:'smooth'});
    }, options);
    catalogue.addEventListener('smartgift:catalog-restore', restore, options);
    pane.setAttribute('aria-busy','true');
    restore();
    getCatalogue().then(result => {
      if (!isCurrent()) return;
      [view, items] = result;
      render();
    }).catch(() => {
      if (isCurrent()) count.textContent = 'โหลดตัวกรองไม่สำเร็จ กรุณารีเฟรชหน้าเพื่อลองอีกครั้ง';
    }).finally(() => {
      if (isCurrent()) pane.removeAttribute('aria-busy');
    });
    return restore;
  }

  function mount(event) {
    const detailQuote = document.querySelector('[data-set-quote]');
    if (detailQuote) initSetQuote(detailQuote);
    const view = event?.detail?.view;
    const catalogue = typeof view === 'string' && view !== 'owned-giftsets' ? null :
      document.querySelector('[data-owned-catalogue][data-catalog-view="owned-giftsets"]');
    const pane = catalogue?.querySelector(':scope > [data-catalog-pane]');
    if (pane && current?.pane === pane) {
      current.restore();
      return;
    }
    current?.controller.abort();
    current = undefined;
    if (!pane?.querySelector('[data-owned-search]')) return;
    const controller = new AbortController();
    current = {pane, controller, restore:attach(catalogue,pane,controller)};
  }
  document.addEventListener('smartgift:catalog-view', mount);
  mount();
})();
