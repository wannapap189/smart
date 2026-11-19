(() => {
  let controller;
  function mountEdition() {
    controller?.abort();
    const pane = document.querySelector('[data-catalog-view="edition-2027"] [data-catalog-pane]');
    if (!pane) return;
    const picker = pane.querySelector('[data-edition-filter]');
    const status = pane.querySelector('[data-edition-count]');
    const cards = [...pane.querySelectorAll('[data-edition-group]')];
    const allCount = status.textContent;
    const pathname = location.pathname.replace(/\/$/, '');
    controller = new AbortController();
    const {signal} = controller;
    picker.parentElement.hidden = false;

    function displayGroup() {
      if (!pane.isConnected || location.pathname.replace(/\/$/, '') !== pathname) return;
      const key = new URL(location.href).searchParams.get('group') || '';
      picker.value = [...picker.options].some(o => o.value === key) ? key : '';
      const visible = cards.filter(card => {
        card.hidden = !!picker.value && card.dataset.editionGroup !== picker.value;
        return !card.hidden;
      });
      status.textContent = picker.value && visible.length
        ? visible.length + ' รุ่นในหมวด' + visible[0].querySelector('.edition-category').textContent
        : allCount;
    }
    picker.addEventListener('change', () => {
      const url = new URL(location.href);
      if (picker.value) url.searchParams.set('group', picker.value);
      else url.searchParams.delete('group');
      history.pushState(history.state, '', url);
      displayGroup();
    }, {signal});
    window.addEventListener('popstate', displayGroup, {signal});
    displayGroup();
  }
  document.addEventListener('smartgift:catalog-view', mountEdition);
  mountEdition();
})();
