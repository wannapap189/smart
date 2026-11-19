import {smartNotebookName} from './notebook-selection.mjs';
import {readFileSync} from 'node:fs';
import {productUrl, skuFor} from './product-content.mjs';

export const editionRoute = '/premium-gifts-2027';
export const editionName = 'ของพรีเมี่ยมปี 2570';
export const editionDescription = 'เลือกของพรีเมี่ยมปี 2570 (2027) สำหรับงานองค์กร จากชุดของขวัญ กระเป๋า แก้วน้ำ ร่มพับ และสินค้าสั่งทำ พร้อมดูรหัสรุ่นและขอราคา';
const selection = JSON.parse(readFileSync(new URL('./premium-gifts-2027.json', import.meta.url), 'utf8'));
const escape = s => String(s).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[ch]);

export function editionGroups(categories, products, ownedSets) {
  const names = new Map(categories.map(c => [c.slug,c.name]));
  const categoryKeys = new Set(names.keys());
  const special = {'owned-giftsets':'ชุดของขวัญ SmartGift', notebooks:'สมุดโน้ต', 'power-bank-notebooks':smartNotebookName, 'silicone-bags':'กระเป๋าซิลิโคนและชาร์มมาสคอต', 'fan-events':'สินค้าแฟนคลับและอีเวนต์'};
  for (const [id,name] of Object.entries(special)) names.set(id,name);
  const order = ['owned-giftsets','bag','drinkware','folding-umbrella','power-bank-notebooks','fan-events','notebooks','silicone-bags','technology','office','eco','lifestyle','campaign','gift-set','seasonal','custom','packaging','apparel'];
  const byGroup = new Map(order.map(key => [key,{key,name:names.get(key),items:[]}]));
  const giftsets = new Map(ownedSets.items.map(p => [p.sku,p]));
  const used = new Set();
  for (const entry of selection) {
    const group = byGroup.get(entry.group);
    const isSet = entry.group === 'owned-giftsets';
    const p = isSet ? giftsets.get(entry.id) : products.get(entry.id);
    if (!group || !p?.image || (categoryKeys.has(entry.group) && !p.categories.includes(entry.group)))
      throw new Error('Invalid 2027 selection: '+entry.group+' / '+entry.id);
    const sku = isSet ? p.sku : skuFor(p);
    if (used.has(sku)) throw new Error('Repeated 2027 SKU: '+sku);
    used.add(sku);
    group.items.push({sku, title:entry.title || p.titleTh || p.name, reason:entry.reason,
      image:p.image, url:isSet?p.url:productUrl(p.id)});
  }
  for (const [id] of names) if (!byGroup.get(id)?.items.length) throw new Error('Missing 2027 picks for '+id);
  return [...byGroup.values()];
}

// Show a variety of categories before showing a second model from any category.
export function editionItems(groups) {
  return Array.from({length:Math.max(...groups.map(g=>g.items.length))}, (_,index)=>
    groups.filter(g=>g.items[index]).map(group=>({item:group.items[index],group}))).flat();
}

function card(item, group) {
  return `<article class="product-card edition-card" data-edition-group="${escape(group.key)}">
    <a class="product-photo" href="${escape(item.url)}" aria-label="${escape(item.title)}"><img src="${escape(item.image)}" width="600" height="450" loading="lazy" alt="${escape(item.title)}"></a>
    <div class="product-body"><span class="edition-category">${escape(group.name)}</span><h3><a href="${escape(item.url)}">${escape(item.title)}</a></h3>
    <p>${escape(item.reason)}</p><div class="edition-card-foot"><span class="sku">${escape(item.sku)}</span><a href="${escape(item.url)}" aria-label="ดูรุ่น ${escape(item.sku)}">ดูรุ่นนี้ →</a></div></div></article>`;
}

export function editionPage(groups, menu) {
  const ordered = editionItems(groups);
  const cards = ordered.map(({item,group})=>card(item,group)).join('');
  const count = ordered.length;
  return `<section class="page-hero edition-hero"><div class="container">
    <div class="breadcrumbs"><a href="/">หน้าแรก</a><span>/</span><a href="/smartgift/products">สินค้าพรีเมียม</a><span>/</span>ของพรีเมี่ยมปี 2570</div>
    <h1>${editionName}</h1><p>เลือกของสำหรับแคมเปญองค์กรปี 2027 ตั้งแต่ถุงช้อปปิ้งที่พับเก็บในซองคาแรกเตอร์ ไปจนถึงสมุดที่จดประชุมและชาร์จโทรศัพท์ได้ในเล่มเดียว</p>
    </div></section>
    <section class="section container catalogue edition-layout" data-catalog-view="edition-2027">${menu}
    <div class="edition-content" data-catalog-pane><div class="edition-toolbar"><div><h2>รุ่นที่เราคัดมาให้</h2><p data-edition-count role="status">${count} รุ่น จาก ${groups.length} หมวด</p></div>
      <label class="edition-filter" hidden>เลือกหมวดสินค้า<select data-edition-filter><option value="">ทุกหมวด</option>${groups.map(g=>`<option value="${escape(g.key)}">${escape(g.name)} (${g.items.length})</option>`).join('')}</select></label></div>
      <div class="products-grid edition-grid">${cards}</div>
      <div class="edition-guide"><a class="text-link" href="/smartgift/blog/promotional-gifts-2027">อ่านวิธีเลือกของแจก ของแลกซื้อ และชุดของขวัญสำหรับปี 2570 →</a></div>
    </div></section>`;
}
