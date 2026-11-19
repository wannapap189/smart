export const orderQuantities = [50, 100, 500];
export const budgetBands = [
  {key: '100-300', min: 100, max: 300, label: '100–300 บาท'},
  {key: '301-500', min: 301, max: 500, label: '301–500 บาท'},
  {key: '501-1000', min: 501, max: 1000, label: '501–1,000 บาท'}
];

const money = new Intl.NumberFormat('th-TH');
const entities = {'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'};
function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, c => entities[c]);
}

export function priceAt(item, quantity) {
  return item.salePrices?.[orderQuantities.indexOf(quantity)];
}

export function renderSetCard(item, quantity) {
  const name = escapeHtml(item.name);
  const url = escapeHtml(orderQuantities.includes(quantity) && quantity !== orderQuantities[0] ? item.url + '?qty=' + quantity : item.url);
  const price = priceAt(item, quantity);
  const photo = item.image
    ? `<img src="${escapeHtml(item.image)}" alt="${name}" loading="lazy" width="600" height="600">`
    : '<span class="missing-photo">ติดต่อขอภาพสินค้ารุ่นนี้</span>';
  const priceLine = Number.isFinite(price)
    ? `<p class="giftset-tier-price"><strong>${money.format(price)} บาท/ชุด</strong><span>เมื่อสั่ง ${quantity} ชุด</span></p>`
    : '';
  return `<article class="product-card owned-set-card"><a class="product-photo owned-photo" data-set-detail-link href="${url}">${photo}</a><div class="product-body"><span class="sku">${escapeHtml(item.sku)} · ขั้นต่ำ 10 ชุด</span><h3><a data-set-detail-link href="${url}">${name}</a></h3><p class="set-contents">${escapeHtml(item.contents)}</p>${priceLine}<div class="product-actions"><a data-set-detail-link href="${url}">ดูของในชุด ↗</a><a href="/smartgift/contact?product=${encodeURIComponent(item.sku)}">ขอราคา</a></div></div></article>`;
}

const lineProfile = 'https://line.me/R/ti/p/@smartgiftthailand';
const lineId = new URL(lineProfile).pathname.split('/').pop();
const giftsetChat = 'https://line.me/R/oaMessage/' + encodeURIComponent(lineId) + '/';

export function renderSetQuote(item) {
  const choices = orderQuantities.map(quantity => {
    const message = `ขอส่งแบบโลโก้เพื่อยืนยันราคาชุดของขวัญ รุ่น ${item.sku} จำนวน ${quantity} ชุด`;
    return {quantity, message, href:giftsetChat + '?' + encodeURIComponent(message)};
  });
  const initial = choices[0];
  const options = choices.map(({quantity, message, href}) =>
    `<option value="${quantity}" data-draft="${escapeHtml(message)}" data-chat="${escapeHtml(href)}">${quantity} ชุด</option>`
  ).join('');
  return `<div class="set-detail-quote" id="giftset-logo-quote" data-set-quote>
    <div class="set-detail-quote-controls">
      <label class="giftset-budget-choice"><span>จำนวนชุดที่ต้องการสั่ง</span><select name="qty" disabled>${options}</select></label>
      <a class="button giftset-line-quote" data-set-chat href="${escapeHtml(initial.href)}" target="_blank" rel="noopener noreferrer"><span aria-hidden="true" class="giftset-line-mark">LINE</span>ส่งแบบโลโก้เพื่อยืนยันราคา</a>
    </div>
    <details class="set-quote-desktop"><summary>ใช้ LINE บนคอมพิวเตอร์</summary>
      <p data-set-draft>${escapeHtml(initial.message)}</p>
      <button type="button" class="text-link" data-copy-draft hidden>คัดลอกข้อความ</button>
      <a class="text-link" href="${lineProfile}" target="_blank" rel="noopener noreferrer">เปิด LINE @smartgiftthailand ↗</a>
      <span role="status" data-copy-status></span>
    </details>
  </div>`;
}

export function renderPriceFilters() {
  const quantities = orderQuantities.map(q => `<label><input type="radio" name="qty" value="${q}"${q === 50 ? ' checked' : ''}><span>${q} ชุด</span></label>`).join('');
  const bands = budgetBands.map(b => `<option value="${b.key}">${b.label}</option>`).join('');
  return `<div class="giftset-price-filters"><fieldset class="giftset-quantity-choice"><legend>จำนวนชุดที่สั่ง</legend>${quantities}</fieldset><label class="giftset-budget-choice"><span>ช่วงราคาต่อชุด (ก่อน VAT)</span><select name="budget"><option value="">ทุกช่วงราคา</option>${bands}</select></label><div class="giftset-price-confirmation" id="giftset-price-confirmation"><p class="giftset-price-note">ราคาที่แสดงเป็นราคาประมาณการตามจำนวนชุดที่เลือก กรุณาส่งไฟล์หรือภาพตัวอย่างโลโก้ที่ต้องการให้ทีมงานตรวจแบบและยืนยันราคาก่อนสั่งผลิต</p><a class="button giftset-line-quote" href="${giftsetChat}" target="_blank" rel="noopener noreferrer"><span aria-hidden="true" class="giftset-line-mark">LINE</span>ส่งแบบโลโก้เพื่อยืนยันราคา</a></div></div>`;
}
