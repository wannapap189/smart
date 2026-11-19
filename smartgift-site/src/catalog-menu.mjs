import {canonicalPath} from './seo-config.mjs';
import {notebookRoute, powerNotebookRoute, smartNotebookName} from './notebook-selection.mjs';

const escape = text => String(text).replace(/[&<>"']/g, c => ({
  '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
})[c]);

export function catalogMenu({cats, booksByCategory, giftCount, selected = ''}) {
  const products = canonicalPath('/products');
  const entries = new Map(cats.map(cat => [cat.slug, {
    key: cat.slug, name: cat.name, count: cat.browseCount ?? cat.count, filter: true,
    href: products + '?category=' + encodeURIComponent(cat.slug)
  }]));
  const pages = [
    ['edition-2027', 'ของพรีเมี่ยมปี 2570', '/premium-gifts-2027'],
    ['owned-giftsets', 'ชุดของขวัญ SmartGift', '/premium-giftset', giftCount],
    ['notebooks', 'สมุดโน้ต', notebookRoute, booksByCategory.get('notebooks').length],
    ['power-bank-notebooks', smartNotebookName, powerNotebookRoute, booksByCategory.get('power-bank-notebooks').length],
    ['silicone-bags', 'กระเป๋าซิลิโคนและชาร์มมาสคอต', '/custom-made/silicone-bags'],
    ['fan-events', 'สินค้าแฟนคลับและอีเวนต์', '/custom-made/fan-events']
  ];
  for (const [key, name, route, count] of pages) {
    entries.set(key, {key, name, count, href:canonicalPath(route), filter:booksByCategory.has(key)});
  }
  entries.set('', {key:'', name:'สินค้าทั้งหมด', href:products, filter:true});
  const current = entries.get(selected) || entries.get('');

  function link(key, extraClass = '') {
    const item = entries.get(key);
    if (!item) return '';
    const count = Number.isFinite(item.count)
      ? '<span class="catalog-menu-count">' + item.count.toLocaleString('th-TH') + '</span>' : '';
    return `<a class="catalog-menu-link ${extraClass}" href="${escape(item.href)}" data-menu-key="${escape(key)}"${item.filter ? ' data-category="'+escape(key)+'"' : ''}${current === item ? ' aria-current="page"' : ''}><span class="catalog-menu-name">${escape(item.name)}</span>${count}</a>`;
  }

  const popular = ['bag', 'drinkware', 'folding-umbrella'];
  const groups = [
    ['สมุดและของใช้สำนักงาน', ['notebooks', 'power-bank-notebooks', 'office', 'technology']],
    ['ของใช้และไลฟ์สไตล์', ['lifestyle', 'eco', 'apparel']],
    ['แคมเปญและเทศกาล', ['campaign', 'seasonal', 'fan-events', 'gift-set']],
    ['งานสั่งทำและบรรจุภัณฑ์', ['custom', 'silicone-bags', 'packaging']]
  ];
  const grouped = new Set([...popular, ...groups.flatMap(([, keys]) => keys)]);
  const extra = cats.filter(cat => !grouped.has(cat.slug)).map(cat => cat.slug);
  if (extra.length) groups.push(['หมวดสินค้าเพิ่มเติม', extra]);

  function section([title, keys]) {
    const links = keys.map(key => link(key)).join('');
    if (!links) return '';
    return `<details class="catalog-menu-group"${keys.includes(current.key) ? ' open' : ''}>
      <summary>${escape(title)}<span class="catalog-menu-chevron" aria-hidden="true"></span></summary>
      <div class="catalog-menu-list">${links}</div></details>`;
  }
  return `<aside class="catalog-menu" aria-label="เลือกชมสินค้า" data-catalog-menu>
    <details class="catalog-menu-panel" open>
      <summary class="catalog-menu-toggle"><span>หมวดสินค้า</span><strong data-menu-current>${escape(current.name)}</strong><span class="catalog-menu-chevron" aria-hidden="true"></span></summary>
      <nav aria-label="เมนูหมวดสินค้า" class="catalog-menu-body"><h2>หมวดสินค้า</h2>
        <div class="catalog-menu-featured">${link('edition-2027', 'catalog-menu-edition')}${link('owned-giftsets', 'catalog-menu-gifts')}</div>
        ${link('', 'catalog-menu-all')}
        <div class="catalog-menu-popular"><h3>สินค้ายอดนิยม</h3>${popular.map(key => link(key)).join('')}</div>
        ${groups.map(section).join('')}
        <a class="catalog-menu-contact" href="${canonicalPath('/contact')}">ปรึกษาทีมออกแบบ <span aria-hidden="true">↗</span></a>
      </nav></details></aside><script defer src="/catalog-menu.js"></script><script defer src="/premium-gifts-2027.js"></script>`;
}
