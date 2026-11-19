import {smartNotebookName} from './notebook-selection.mjs';
import fs from 'node:fs';
import {notebookComponents} from './notebook-models.mjs';
const original = JSON.parse(fs.readFileSync(new URL('./giftset-components.json',import.meta.url),'utf8'));
const notebooks = new Map(notebookComponents.map(item => [item.id, {...item, group: 'notebook'}]));
const components = original.map(item => notebooks.get(item.id) || item);
const represented = new Set(components.map(item => item.id));
components.push(...[...notebooks.values()].filter(item => !represented.has(item.id)));
const entities = {'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'};
const esc = value => String(value).replace(/[&<>"']/g,c=>entities[c]);
const groupNames = {
  drink: 'แก้วและกระบอกน้ำ',
  travel: 'กระเป๋า ร่ม และของเดินทาง',
  notebook: 'สมุดโน้ต',
  desk: 'เครื่องเขียนและของใช้บนโต๊ะ',
  lifestyle: 'ของใช้ในชีวิตประจำวัน',
  tech: 'อุปกรณ์ไอที'
};

function componentCard(item) {
  return `<article class="product-card component-card" data-component-group="${esc(item.group)}"><div class="product-photo"><img src="${esc(item.image)}" alt="${esc(item.name)}" loading="lazy" width="640" height="440"></div>
  <div class="product-body"><h3>${esc(item.name)}</h3>${item.description ? '<p>'+esc(item.description)+'</p>' : ''}
  <div class="product-actions"><button type="button" class="add-product" data-build-add="${esc(item.id)}" aria-pressed="false">＋ เพิ่มในชุด</button><a class="component-selection-link" href="#builder-request">ดูชุดที่เลือก →</a></div></div></article>`;
}

export function giftsetBuilder() {
  const filters = Object.entries(groupNames).map(([id, name]) => {
    const count = components.filter(item => item.group === id).length;
    return count ? `<button type="button" data-component-filter="${id}" aria-pressed="false">${name} <span>${count}</span></button>` : '';
  }).join('');
  return `<section class="page-hero"><div class="container"><div class="breadcrumbs"><a href="/smartgift">หน้าแรก</a><span>/</span>ออกแบบชุดของขวัญ</div>
    <h1>จัดชุดของขวัญในแบบของคุณ</h1>
    <p>เลือกของจากภาพตัวอย่าง หรือพิมพ์รายการที่อยากได้ในชุด แล้วบอกงบต่อชุดและจำนวนชุดให้ทีม SmartGift ช่วยจัดแบบและเสนอราคา</p>
    <a class="text-link" href="#builder-request">แจ้งรายการและงบประมาณ →</a>
  </div></section>
  <section class="section container builder-layout" data-set-builder><div><div class="section-head"><div>
    <h2>เลือกของใส่ชุดของขวัญ</h2><p>เลือกสินค้าข้ามหมวดได้ หากอยากเพิ่มของที่ไม่มีในภาพ ให้พิมพ์บอกในช่อง “รายการที่ต้องการในแต่ละชุด”</p>
    <div class="notebook-jumps"><a href="/smartgift/products/notebooks">เลือกสมุดโน้ตแบบเล่มเดี่ยว →</a><a href="/smartgift/products/power-bank-notebooks">ดู${smartNotebookName} →</a></div>
  </div></div>
  <div class="component-filters" role="group" aria-label="กรองตามหมวดสินค้า" hidden>
    <button type="button" data-component-filter="all" aria-pressed="true">ทั้งหมด <span>${components.length}</span></button>${filters}
  </div>
  <p class="sr-only" data-component-result role="status"></p>
  <div class="products-grid builder-products">${components.map(componentCard).join('')}</div>
  <a class="text-link builder-next" href="#builder-request">ระบุรายละเอียดชุดของคุณ →</a></div>
  <aside class="builder-panel" id="builder-request"><h2>ชุดของคุณ</h2>
    <div id="builder-selection" aria-live="polite"></div>
    <form id="builder-form">
      <label>รายการที่ต้องการในแต่ละชุด<textarea name="requestedItems" maxlength="700" rows="3" placeholder="เช่น สมุด 1 เล่ม ปากกา 2 ด้าม และแก้วเก็บอุณหภูมิ 1 ใบ"></textarea></label>
      <label>จำนวนชุดที่ต้องการ *<input name="sets" type="number" min="1" max="1000000" value="100" required></label>
      <label>งบประมาณต่อชุด (บาท)<input name="budget" maxlength="80" placeholder="เช่น 500 หรือ 500–800"></label>
      <label>แนวทางบรรจุภัณฑ์<select name="packaging"><option>ให้ทีมแนะนำกล่องที่เหมาะกับสินค้า</option><option>ใช้กระเป๋าเป็นบรรจุภัณฑ์หลัก</option><option>มีแบบกล่องหรือแพ็กเกจของแบรนด์แล้ว</option><option>ยังไม่ต้องการบรรจุภัณฑ์เพิ่มเติม</option></select></label>
      <label>ผู้รับและโอกาสใช้งาน<textarea name="occasion" rows="2" maxlength="300" placeholder="เช่น ของขอบคุณคู่ค้า งานเปิดตัวสินค้า"></textarea></label>
      <p class="form-note">ทีมจะตรวจรายการ งานโลโก้ และบรรจุภัณฑ์ให้เหมาะกับงบ ก่อนยืนยันราคาและกำหนดส่ง</p>
      <button class="button orange" type="submit">บันทึกชุดและเตรียมขอราคา →</button><p id="builder-status" role="status"></p>
    </form>
  </aside></section>`;
}
