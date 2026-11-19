const filter = document.querySelector('[data-journal-filter]');
if (filter) {
  const params = new URLSearchParams(location.search);
  const audiences = Array.from(filter.options, option => option.value);
  const groups = [...document.querySelectorAll('[data-journal-group]')];
  const empty = document.querySelector('[data-journal-empty]');
  const count = document.querySelector('[data-journal-count]');
  const update = () => {
    const industry = filter.value;
    let total = 0;
    for (const group of groups) {
      let visible = 0;
      for (const card of group.querySelectorAll('[data-audience]')) {
        card.hidden = Boolean(industry && !card.dataset.audience.split('|').includes(industry));
        if (!card.hidden) visible++;
      }
      group.hidden = visible === 0;
      total += visible;
    }
    for (const link of document.querySelectorAll('.jg-tabs a,.jg-section-head a')) {
      const dest = new URL(link.href);
      if (industry) dest.searchParams.set('industry', industry);
      else dest.searchParams.delete('industry');
      link.href = dest.href;
    }
    empty.hidden = total !== 0;
    count.textContent = total + ' บทความ' + (industry ? 'สำหรับ' + industry : '');
  };
  function select(value) {
    filter.value = audiences.includes(value) ? value : '';
    update();
  }
  filter.closest('label').hidden = false;
  select(params.get('industry'));
  filter.addEventListener('change', () => {
    const current = new URL(location.href);
    if (filter.value) current.searchParams.set('industry',filter.value);
    else current.searchParams.delete('industry');
    history.replaceState(null,'',current);
    update();
  });
  empty.querySelector('button').addEventListener('click', () => {
    filter.value = '';
    filter.dispatchEvent(new Event('change'));
    filter.focus();
  });
  window.addEventListener('pageshow', () => select(new URL(location.href).searchParams.get('industry')));
}

const gallery = document.querySelector('#character-ideas');
if (gallery) {
  const dialog = gallery.querySelector('[data-cr-dialog]');
  const cards = [...gallery.querySelectorAll('[data-cr-card]')];
  let selected = 0;

  function showPhoto(index) {
    selected = (index + cards.length) % cards.length;
    const card = cards[selected];
    const thumb = card.querySelector('img');
    const source = card.querySelector('[data-cr-source]');
    const image = new Image();
    image.dataset.referencePhoto = '';
    image.src = thumb.src;
    image.alt = thumb.alt;
    dialog.querySelector('[data-cr-image]').replaceChildren(image);
    dialog.querySelector('#cr-dialog-title').textContent = card.querySelector('[data-cr-title]').textContent;
    dialog.querySelector('[data-cr-desc]').textContent = card.querySelector('[data-cr-design]').textContent;
    const credit = dialog.querySelector('[data-cr-credit]');
    credit.textContent = source.textContent;
    credit.href = source.href;
    dialog.querySelector('[data-cr-count]').textContent = (selected + 1) + ' / ' + cards.length;
  }

  if (typeof dialog.showModal === 'function') {
    cards.forEach((card, index) => card.querySelector('[data-cr-open]').addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      showPhoto(index);
      dialog.showModal();
    }));
    dialog.querySelector('[data-cr-next]').addEventListener('click', () => showPhoto(selected + 1));
    dialog.querySelector('[data-cr-prev]').addEventListener('click', () => showPhoto(selected - 1));
    dialog.querySelector('[data-cr-close]').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
    dialog.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        showPhoto(selected + (event.key === 'ArrowLeft' ? -1 : 1));
      }
    });
  }
}
