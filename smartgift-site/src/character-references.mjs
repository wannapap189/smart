const images = '/assets/articles/character-reference/';

const references = [
  {
    file:'cafe-amazon-drive-thru', type:'ฝาแก้วกาแฟ', title:'ร้าน Café Amazon ใต้ฝาโดม',
    alt:'แก้ว Café Amazon สีเขียว ฝาโดมใสครอบโมเดลร้านไดรฟ์ทรูและรถสีแดง',
    design:'ฝาใสกลายเป็นตู้โชว์ขนาดจิ๋ว ร้านกาแฟและรถหนึ่งคันเล่าเรื่องไดรฟ์ทรูได้แม้เห็นจากระยะไกล',
    credit:'Sale Here', url:'https://salehere.co.th/articles/cafe-amazon-tumbler',
  },
  {
    file:'popmart-twinkle-crossbody', type:'กระเป๋าซิลิโคน', title:'กระเป๋าพระจันทร์เสี้ยว POP MART',
    alt:'กระเป๋าสะพายซิลิโคนสีเหลืองรูปพระจันทร์เสี้ยว มีคาแรกเตอร์ Twinkle Twinkle ตรงกลางและสายสะพายสีเหลือง',
    design:'ส่วนโค้งของพระจันทร์เป็นทั้งตัวกระเป๋าและที่นั่งของมาสคอต ลองเริ่มวาดจากท่าประจำตัวของคาแรกเตอร์ แล้วค่อยหาตำแหน่งสายสะพาย',
    credit:'POP MART', url:'https://www.popmart.com/us/products/2198/pop-bean-pajama-party-twinkle-silicone-crossbody-bag',
  },
  {
    file:'made-by-cooper-cubone', type:'พวงกุญแจมาสคอต', title:'พวงกุญแจยางนูน Cubone',
    alt:'พวงกุญแจ PVC รูป Cubone จาก Pokémon คู่กับดอกไม้สีชมพูและห่วงโลหะ',
    design:'ตัดขอบตามตัวละครและดอกไม้ ใช้เส้นนูนคั่นสีให้ลายอ่านง่าย เมื่อนำมาทำกับมาสคอตของคุณ ให้ลองย่อแบบเท่าขนาดที่ห้อยจริง',
    credit:'Made by Cooper', url:'https://www.madebycooper.com/products/keyrings/pvc-keyrings/',
  },
  {
    file:'medicom-peko-bearbrick', type:'อาร์ตทอย', title:'Peko-chan ในร่าง BE@RBRICK',
    alt:'ฟิกเกอร์ BE@RBRICK สีทองสองขนาด ใบหน้า Peko-chan สวมกระดิ่งและยกมือท่าแมวกวัก',
    design:'ใบหน้า กระดิ่ง และท่าแมวกวักทำให้จำ Peko-chan รุ่นนี้ได้ทั้งตัวเล็กและตัวใหญ่ เป็นตัวอย่างของการเก็บจุดเด่นเดิมไว้เมื่อต้องเปลี่ยนขนาด',
    credit:'MEDICOM TOY', url:'https://store.medicomtoy.co.jp/en/products/be-rbrick-manekineko-pekochan-fuku-gold-plated-100-400-10173',
  },
  {
    file:'sanrio-my-melody-pouch', type:'กระเป๋าซิลิโคน', title:'กระเป๋าตั้งโต๊ะรูป My Melody',
    alt:'กระเป๋าซิลิโคนสามมิติรูป My Melody สีชมพูขาว เปิดช่องด้านบนให้เห็นของที่ใส่ได้',
    design:'ตัวกระเป๋าเป็นมาสคอตทั้งตัว ช่องเก็บของซ่อนอยู่ด้านหลังใบหน้า งานลักษณะนี้ควรลองใส่ของที่ลูกค้าจะพกจริงก่อนสรุปขนาดช่องเปิด',
    credit:'Sanrio', url:'https://www.sanrio.com/products/my-melody-3d-pochi-silicone-case-pink',
  },
  {
    file:'yiwu-mascot-charm', type:'พวงกุญแจมาสคอต', title:'มาสคอตผ้านุ่มสำหรับห้อยกระเป๋า',
    alt:'พวงกุญแจตุ๊กตาผ้าสีเขียวทรงหยดน้ำ ปักหน้ายิ้มและลายใบไม้ มีห่วงโลหะด้านบน',
    design:'ทรงหยดน้ำกับใบหน้าปักใช้รายละเอียดเพียงไม่กี่จุดก็จำได้ ลองเทียบความฟูและน้ำหนักตอนห้อยกับซิปกระเป๋าในการตรวจตัวอย่าง',
    credit:'Yiwu Superstar', url:'https://yiwu-superstar.com/case-study/promotional-gift-mascot-project/',
  },
  {
    file:'tokidoki-cherry-blossom', type:'อาร์ตทอย', title:'Unicorno ในสวนบอนไซของ tokidoki',
    alt:'อาร์ตทอย Unicorno ลายไม้กับดอกซากุระสีชมพู จัดเป็นบอนไซบนฐานตั้งโชว์',
    design:'ดอกซากุระ ลายไม้ และฐานบอนไซเล่าเรื่องเดียวกัน หากทำคอลเลกชันตามฤดูกาล ลองเลือกของประกอบเพียงชิ้นเดียวที่ช่วยให้ผู้ซื้อจำแต่ละรุ่นได้',
    credit:'tokidoki', url:'https://www.tokidoki.it/products/botanical-harmony-unicorno-cherry-blossom-serenity-special-edition',
  },
];

export function characterReferences(esc) {
  const card=item=>`<article class="cr-card" data-cr-card>
    <a class="cr-photo" data-cr-open href="${images}${item.file}.webp" aria-label="ดูภาพใหญ่ · ${esc(item.title)}"><img data-reference-photo loading="lazy" decoding="async" src="${images}${item.file}.webp" alt="${esc(item.alt)}"><span class="cr-zoom" aria-hidden="true">⤢</span></a>
    <div class="cr-copy"><span class="cr-type">${esc(item.type)}</span><h3 data-cr-title>${esc(item.title)}</h3><p data-cr-design>${esc(item.design)}</p>
    <a class="cr-credit" data-cr-source href="${esc(item.url)}" target="_blank" rel="noopener noreferrer">ภาพจาก ${esc(item.credit)} ↗</a></div></article>`;
  return `<section class="cr-gallery" id="character-ideas" aria-labelledby="cr-title">
    <div class="cr-intro"><div><h2 id="cr-title">เมื่อมาสคอตกลายเป็นของสะสม</h2><p>ดูภาพอ้างอิง ${references.length} แบบจากแบรนด์และผู้ผลิตในไทยและต่างประเทศ เลือกดูทรง วัสดุ และรายละเอียดที่อยากนำมาออกแบบให้แบรนด์ของคุณ</p></div><a class="text-link" href="/contact-us/#brief-form">ส่งโจทย์สั่งผลิต →</a></div>
    <div class="cr-grid">${references.slice(0,4).map(card).join('')}</div>
    <p><a class="text-link" href="/smartgift/custom-made/silicone-bags">เลือกกระเป๋าซิลิโคน 14 แบบสำหรับผลิตมาสคอตของคุณ →</a></p>
    <details class="cr-more"><summary><span class="cr-show">ดูอีก ${references.length - 4} แบบ</span><span class="cr-hide">ย่อแกลเลอรี</span></summary>
    <div class="cr-grid">${references.slice(4).map(card).join('')}</div></details>
    <dialog class="cr-dialog" data-cr-dialog aria-labelledby="cr-dialog-title"><div class="cr-dialog-inner">
      <button type="button" data-cr-close autofocus>ปิดภาพ ×</button><div class="cr-dialog-photo" data-cr-image></div>
      <div class="cr-dialog-info" aria-live="polite"><h3 id="cr-dialog-title"></h3><p data-cr-desc></p><a class="cr-credit" data-cr-credit target="_blank" rel="noopener noreferrer"></a></div>
      <nav aria-label="เลือกภาพอ้างอิง"><button type="button" data-cr-prev>← ก่อนหน้า</button><span data-cr-count></span><button type="button" data-cr-next>ถัดไป →</button></nav>
    </div></dialog></section>`;
}
