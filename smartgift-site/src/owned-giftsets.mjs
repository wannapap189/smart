import fs from 'node:fs/promises';
import {orderQuantities, renderPriceFilters, renderSetCard, renderSetQuote} from './owned-catalogue-view.mjs';
import {ownedGiftsetExtraImages} from './owned-giftset-extra-images.mjs';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const base='/smartgift/premium-giftset';
const definition=[
 ['office','สมุดโน้ตและเครื่องเขียน','ชุดสมุดและเครื่องเขียน'],['technology','ไอทีและอุปกรณ์อิเล็กทรอนิกส์','ชุดแกดเจ็ตและอุปกรณ์ไอที'],['wellness','สุขภาพและการผ่อนคลาย','ชุดสุขภาพและผ่อนคลาย'],['umbrella','ร่มและอุปกรณ์กันแดด','ชุดร่มและอุปกรณ์กันแดด'],['home','เครื่องใช้ไฟฟ้าและของใช้ในบ้าน','ชุดเครื่องใช้ในบ้าน'],['beauty','ดูแลร่างกายและความงาม','ชุดดูแลร่างกายและความงาม'],['drinkware','แก้วน้ำและกระบอกน้ำ','ชุดแก้วและกระบอกน้ำ'],['sports','กีฬาและกิจกรรมกลางแจ้ง','ชุดกีฬาและกิจกรรมกลางแจ้ง'],['car','ของใช้ในรถยนต์','ชุดของใช้ในรถยนต์'],['tea-coffee','ชุดชาและอุปกรณ์ชงกาแฟ','ชุดชาและกาแฟ'],['pen','ปากกาและอุปกรณ์สำนักงาน','ชุดปากกาและอุปกรณ์สำนักงาน'],['travel','กระเป๋าและอุปกรณ์เดินทาง','ชุดกระเป๋าและการเดินทาง'],['smart-office','สมุดโน้ตพร้อมอุปกรณ์ไอที','ชุดสมุดพร้อมอุปกรณ์ไอที'],['lifestyle','ของใช้และของขวัญไลฟ์สไตล์','ชุดของขวัญไลฟ์สไตล์']
];
function giftsetTitle(heading, contents, details, sku) {
 if (heading !== 'ชุดของขวัญ') return heading + ' รุ่น ' + sku;
 const labels = details.map(d => d.label.trim()).filter(label => label && !/^(สี|ประเภท|ขนาด|ข้อมูลบรรจุภัณฑ์|วัสดุ|รูปแบบ|กำลัง|ไฟเข้า|ความจุ|บรรจุภัณฑ์)/.test(label));
 const pieces = contents.split(/\s+\+\s+/).map((text,index) => {
  const short = text.replace(/\s*\(ขั้นต่ำ[^)]*\)/g, '').replace(/\s+(?:ชุดของขวัญ|บรรจุใน|บรรจุภัณฑ์).*$/, '').trim();
  return (short.length > 50 || short === 'ต้นฉบับไม่ระบุชื่อชุด') ? (labels[index] || short.split(' พร้อม')[0]) : short;
 }).filter(Boolean);
 const names = [...new Set(pieces.length === 1 && (contents.length > 50 || contents === 'ต้นฉบับไม่ระบุชื่อชุด') && labels.length ? labels : pieces)].slice(0,3);
 if (!names.length) throw Error('Missing gift-set contents for '+sku);
 const primary = names.pop();
 const title=((names.length ? names.join(' ') + ' และ' : '') + primary).replace(/^ชุด/, '').replace(/: */g,' ');
 return 'ชุด' + title + ' รุ่น ' + sku;
}
export async function loadOwnedSets(){
 const extracted=JSON.parse(await fs.readFile('../catalog-import/owned-giftsets-extracted.json','utf8'));
 const photos=JSON.parse(await fs.readFile(new URL('./localized-giftset-images.json',import.meta.url),'utf8'));
 const salePrices=JSON.parse(await fs.readFile(new URL('./owned-giftset-sale-prices.json',import.meta.url),'utf8'));
 const bySku=new Map();
 for(const item of extracted.items){
  item.images=item.images.map(url=>photos[url]||url);
  if(item.sku==='TJS05-3' && !item.images.length) item.images.push('/assets/owned-giftsets-extra/TJS05-3.webp');
  const previous=bySku.get(item.sku);
  if(previous){
   const listed=item.title.split('\n').slice(1).join(' ').replace(/^ประกอบด้วย\s*/,'').trim();
   if(previous.contents!==listed || previous.categoryName!==definition.find(c=>c[1]===item.sourceCategory)?.[2]) throw Error('Conflicting records share factory SKU '+item.sku);
   previous.sourceRows.push(item.sourceRow);previous.images=[...new Set([...previous.images,...item.images])];continue;}
  const category=definition.find(c=>c[1]===item.sourceCategory);if(!category)throw Error('Unknown category '+item.sourceCategory);
  const lines=item.title.split('\n');
  const heading=lines[0].replace(/\s*Model\s*\S+/i,'').trim()||category[2];
  let contents=lines.slice(1).join(' ').replace(/^ประกอบด้วย\s*/,'').trim();
  const name=giftsetTitle(heading,contents,item.details,item.sku);
  if(contents==='ต้นฉบับไม่ระบุชื่อชุด') contents=item.details.filter(d=>d.label && d.label!=='สี').map(d=>d.label).join(' + ');
  const p={sku:item.sku,slug:item.sku.toLowerCase().replace(/[^a-z0-9-]/g,'-'),name,contents,category:category[0],categoryName:category[2],images:item.images,image:item.images[0]||null,details:item.details.filter(d=>!/(?:ราคา|ต้นทุน|cost|price|email|wechat|whatsapp)/i.test(d.label+' '+d.text)),minimumOrder:10,sourceRows:[item.sourceRow],sourceSheet:item.sourceSheet};
  const prices=salePrices[p.sku];
  if (prices !== undefined) {
   if (!Array.isArray(prices) || prices.length !== orderQuantities.length || !prices.every(v=>Number.isSafeInteger(v) && v>0)) throw Error('Invalid customer sale prices for '+p.sku);
   p.salePrices=prices;
  }
  p.url=base+'/set/'+p.slug;p.description=`${category[2]} ${p.sku} ${contents} สั่งขั้นต่ำ 10 ชุดต่อแบบ ปรับโลโก้และแพ็กเกจสำหรับองค์กร`;
  p.images=[...new Set([...p.images,...(ownedGiftsetExtraImages[p.sku]||[])])];
  bySku.set(p.sku,p);
 }
 // Explicitly reviewed sets whose power-bank component lists Micro USB input only.
 const retiredSkus=new Set(['TNN03-3','TBP11-3','TNR00-3','TNR01-3']);
 const archived=[...bySku.values()].filter(p=>retiredSkus.has(p.sku)).map(p=>({...p,removedAt:'2026-11-18',removalKind:'legacy-powerbank',removalReason:'พาวเวอร์แบงก์ในชุดระบุช่องรับไฟ Micro USB โดยไม่ระบุ USB-C เลือกคัดออกจากแค็ตตาล็อกตามแนวทางปัจจุบัน',statusNote:'ไม่ใช่การยืนยันว่าสินค้าหมดหรือเลิกผลิต'}));
 await fs.writeFile('../catalog-import/retired-owned-giftsets.json',JSON.stringify(archived,null,2));
 const items=[...bySku.values()].filter(p=>!retiredSkus.has(p.sku));
 const categories=definition.map(([slug,,name])=>({slug,name,url:base+'/'+slug,count:items.filter(p=>p.category===slug).length}));
 await fs.writeFile('dist/data/owned-giftsets.json',JSON.stringify({items,categories,minimumOrder:10}));
 return {items,categories,archived};
}
export function ownedCard(p){return renderSetCard(p);}
function subcategoryMenu(data, category) {
  const all = {slug:'', name:'ชุดของขวัญทั้งหมด', url:base, count:data.items.length};
  const choices = [all, ...data.categories];
  const selected = category || all;
  return `<details class="owned-subcategories">
    <summary>เลือกหมวดย่อยชุดของขวัญ <strong>${esc(selected.name)}</strong></summary>
    <nav aria-label="หมวดย่อยชุดของขวัญ">${choices.map(c =>
      `<a data-owned-subcategory="${esc(c.slug)}" href="${esc(c.url)}"${selected.slug === c.slug ? ' aria-current="page"' : ''}>${esc(c.name)} <span>${c.count.toLocaleString('th-TH')}</span></a>`
    ).join('')}</nav></details>`;
}

export function ownedCatalogue(data, slug = '', menu = '') {
  const category = data.categories.find(c => c.slug === slug);
  const items = category ? data.items.filter(p => p.category === category.slug) : data.items;
  return `<section class="page-hero giftset-page-hero"><div class="container"><span class="eyebrow">ชุดของขวัญองค์กร · ความเชี่ยวชาญของ SmartGift</span><h1>${category ? esc(category.name) : 'ชุดของขวัญหลากหลาย เลือกให้ตรงใจผู้รับ'}</h1><p>เลือกจาก ${data.items.length.toLocaleString('th-TH')} แบบในคอลเลกชัน พร้อมรายละเอียดของในชุด เพื่อให้คุณเลือกสินค้า โลโก้ และแพ็กเกจได้อย่างมั่นใจ</p><div class="giftset-proof"><strong>ขั้นต่ำเพียง 10 ชุดต่อแบบ</strong><span>ประสบการณ์ 15 ปี</span><span>ปรับโลโก้สำหรับแบรนด์คุณ</span></div><p><a class="text-link" href="/smartgift/download-catalog${category ? '#catalog-'+esc(slug) : ''}">${category ? 'ดูแคตตาล็อก PDF หมวดนี้' : 'ดูแคตตาล็อกชุดของขวัญทั้ง 14 หมวด'} →</a></p></div></section>
    <section class="section container catalogue" data-catalog-view="owned-giftsets" data-owned-catalogue data-owned-category="${esc(category?.slug || '')}">
      ${menu}
      <div class="catalog-main" data-catalog-pane>
        ${subcategoryMenu(data, category)}
        <form class="catalog-search" data-owned-search role="search"><label class="sr-only" for="owned-search">ค้นหาชุดของขวัญ</label><input id="owned-search" name="q" type="search" placeholder="ค้นหารหัสรุ่น หรือของในชุด เช่น สมุด พาวเวอร์แบงก์"><button class="button teal">ค้นหา</button></form>
        ${renderPriceFilters()}
        <div class="catalog-toolbar"><p data-owned-count role="status">${items.length.toLocaleString('th-TH')} แบบ${category ? ' · '+esc(category.name) : ''}</p><label>เรียงตาม <select data-owned-sort><option value="original">ลำดับแค็ตตาล็อก</option><option value="sku">รหัสสินค้า</option></select></label></div>
        <div class="products-grid" data-owned-results>${items.slice(0,24).map(p => renderSetCard(p,50)).join('')}</div>
        <div class="pagination" data-owned-pagination></div><p class="source-note">จำนวนขั้นต่ำ 10 ชุดต่อแบบสำหรับคอลเลกชันนี้ · สี สินค้าในชุด งานโลโก้ และกำหนดส่ง ยืนยันในใบเสนอราคา</p>
      </div></section>`;
}
export function ownedProduct(p,data){return `<section class="section container"><div class="breadcrumbs"><a href="/smartgift">หน้าแรก</a> / <a href="${base}">ชุดของขวัญ</a> / <a href="${base+'/'+p.category}">${p.categoryName}</a> / ${esc(p.sku)}</div><div class="detail-layout"><div>${p.image?`<figure class="product-gallery"><div class="gallery-main owned-photo"><img data-gallery-main src="${p.image}" alt="${esc(p.name)}" width="800" height="800"></div><div class="gallery-options" role="group" aria-label="ภาพชุดของขวัญ">${p.images.map((image,i)=>`<button type="button" data-gallery-src="${image}" data-gallery-alt="${esc(p.name)} ภาพ ${i+1}" data-gallery-note="ภาพชุดของขวัญรุ่น ${esc(p.sku)} จากแค็ตตาล็อก SmartGift" aria-pressed="${!i}"><img src="${image}" alt="" width="90" height="90" loading="lazy"><span>ภาพ ${i+1}</span></button>`).join('')}</div><figcaption data-gallery-caption>ภาพชุดของขวัญรุ่น ${esc(p.sku)} จากแค็ตตาล็อก SmartGift</figcaption></figure>`:'<div class="empty-state">ติดต่อทีมเพื่อขอภาพสินค้ารุ่นนี้</div>'}</div><div class="detail-copy"><span class="eyebrow">ชุดของขวัญองค์กร · ${esc(p.sku)}</span><h1>${esc(p.name)}</h1><div class="giftset-minimum"><strong>สั่งขั้นต่ำเพียง 10 ชุดต่อแบบ</strong><span>เลือกสีและงานโลโก้ให้เหมาะกับแบรนด์คุณ</span></div><p class="product-summary">${esc(p.contents)}</p>${renderSetQuote(p)}<div class="actions"><a class="button outline" href="/smartgift/logo-preview?sku=${encodeURIComponent(p.sku)}">ลองวางโลโก้บนสินค้า</a><a class="button orange" href="/smartgift/contact?product=${encodeURIComponent(p.sku)}">ขอราคาชุดนี้ →</a><a class="button outline" href="/downloads/products/${encodeURIComponent(p.sku)}.pdf" download>ดาวน์โหลด PDF รุ่นนี้ ↓</a><a class="button outline" href="${base+'/'+p.category}">ดูชุดในหมวดเดียวกัน</a></div><section class="product-facts"><h2>รายละเอียดของในชุด</h2><ul>${p.details.map(d=>`<li>${d.label?`<strong>${esc(d.label)}:</strong> `:''}${esc(d.text)}</li>`).join('')}</ul></section><section class="product-facts"><h2>สั่งทำสำหรับองค์กร</h2><ul><li>ขั้นต่ำ 10 ชุดต่อแบบ</li><li>แจ้งจำนวน สีที่ต้องการ โลโก้ และวันใช้งาน</li><li>งานสกรีนหรือเลเซอร์และแพ็กเกจ ประเมินตามวัสดุและรูปแบบที่เลือก</li><li>ทีมยืนยันรายการสินค้า ราคา และกำหนดส่งก่อนสั่งผลิต</li></ul></section></div></div></section><section class="section container"><h2>ชุดของขวัญที่เกี่ยวข้อง</h2><div class="products-grid">${data.items.filter(x=>x.category===p.category&&x.sku!==p.sku).slice(0,4).map(ownedCard).join('')}</div></section>`;}
export function ownedSchema(p,origin){return {'@context':'https://schema.org','@graph':[{'@type':'Product',name:p.name,sku:p.sku,description:p.description,...(p.image?{image:p.images.map(i=>origin+i)}:{}),url:origin+p.url,category:p.categoryName,additionalProperty:[{'@type':'PropertyValue',name:'จำนวนสั่งขั้นต่ำต่อแบบ',value:10,unitText:'ชุด'}]},{'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'ชุดของขวัญองค์กร',item:origin+base},{'@type':'ListItem',position:2,name:p.categoryName,item:origin+base+'/'+p.category},{'@type':'ListItem',position:3,name:p.sku,item:origin+p.url}]}]};}
