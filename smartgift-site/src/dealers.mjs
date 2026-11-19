export const dealerTitle = 'ตัวแทนจำหน่ายสินค้าพรีเมียมและชุดของขวัญองค์กร';
export const dealerDescription = 'สนใจเป็นตัวแทนจำหน่าย SmartGift หรือกำลังหาของพรีเมียมให้ลูกค้า เลือกสินค้าและแคตตาล็อก แล้วแจ้งรุ่น จำนวน งบประมาณ และวันรับของเพื่อสอบถามราคาทาง LINE';

const draft = [
  'สนใจเป็นตัวแทนจำหน่าย SmartGift และขอสอบถามราคาสำหรับลูกค้า',
  'ชื่อร้านหรือบริษัท …',
  'สินค้าหรือรหัสรุ่นที่สนใจ …',
  'จำนวน … ชิ้น/ชุด',
  'งบประมาณต่อชิ้น/ชุด … บาท',
  'งานโลโก้และบรรจุภัณฑ์ที่ต้องการ …',
  'วันที่และจังหวัดที่ต้องการรับของ …'
].join('\n');
const chat = 'https://line.me/R/oaMessage/%40smartgiftthailand/?';

export function dealerPage() {
  return `<section class="page-hero brief-hero"><div class="container">
    <nav class="breadcrumbs" aria-label="ตำแหน่งปัจจุบัน"><a href="/">หน้าแรก</a><span aria-hidden="true">/</span><span aria-current="page">ตัวแทนจำหน่าย</span></nav>
    <h1>ตัวแทนจำหน่าย</h1>
    <p>สำหรับร้านของพรีเมียม เอเจนซี และผู้ที่สนใจเป็นตัวแทนจำหน่าย SmartGift เลือกสินค้าไปเสนอให้ลูกค้า หรือส่งโจทย์ให้ทีมช่วยหารุ่นที่เหมาะกับงบประมาณ</p>
    <div class="actions"><a class="button teal" href="#dealer-inquiry">สอบถามเรื่องตัวแทนจำหน่าย</a><a class="button outline" href="/smartgift/download-catalog">ดาวน์โหลดแคตตาล็อก</a></div>
  </div></section>
  <section class="section container" aria-labelledby="dealer-products"><div class="section-head"><h2 id="dealer-products">เลือกสินค้าไปเสนอให้ลูกค้า</h2></div>
    <div class="download-grid">
      <article class="download-card"><h3>ชุดของขวัญองค์กร</h3><p>เทียบของในกล่องและงบต่อชุด แล้วจดรหัสรุ่นที่ลูกค้าสนใจไว้ขอราคา</p><a class="text-link" href="/smartgift/premium-giftset">เลือกชุดของขวัญ →</a></article>
      <article class="download-card"><h3>สินค้าพรีเมียมพิมพ์โลโก้</h3><p>เลือกกระเป๋า แก้วน้ำ ร่ม หรือสมุดเป็นรายชิ้น สำหรับงานสัมมนาและแคมเปญส่งเสริมการขาย</p><a class="text-link" href="/smartgift/products">ดูสินค้าทุกหมวด →</a></article>
      <article class="download-card"><h3>งานสั่งผลิตเฉพาะแบรนด์</h3><p>ถ้าลูกค้ามีมาสคอตหรือต้องการรูปทรงเฉพาะ ดูตัวอย่างงานแล้วส่งภาพอ้างอิงให้ทีมประเมิน</p><a class="text-link" href="/smartgift/custom-made">ดูงานสั่งผลิต →</a></article>
    </div>
  </section>
  <section class="section soft" id="dealer-inquiry" aria-labelledby="dealer-inquiry-title"><div class="container contact-layout">
    <div class="brief-help"><h2 id="dealer-inquiry-title">สอบถามราคาและเงื่อนไขตัวแทนจำหน่าย</h2>
      <p>ถ้ามีรุ่นในใจแล้ว ส่งรหัสรุ่นพร้อมจำนวนเพื่อให้ทีมเช็กราคาและระยะเวลาผลิต หากยังเลือกรุ่นอยู่ บอกว่านำไปให้ใคร ใช้ในงานอะไร และตั้งงบไว้เท่าไรต่อชิ้นหรือต่อชุด</p>
      <p>แนบโลโก้หรือภาพตัวอย่างในแชตได้ ทีมจะใช้ประกอบการประเมินงานพิมพ์และแพ็กเกจตามโจทย์ของลูกค้า</p>
    </div>
    <div class="brief-form" data-dealer-inquiry><h3>ขอราคาทาง LINE</h3><p class="brief-form-lead">เติมเฉพาะรายละเอียดที่ทราบ แล้วตรวจข้อความก่อนกดส่งให้ @smartgiftthailand ในแชต</p>
      <div data-dealer-editor hidden><label for="dealer-message">ข้อความที่ต้องการส่ง</label><textarea id="dealer-message" rows="8" maxlength="1200">${draft}</textarea></div>
      <div class="actions"><a class="button teal" data-dealer-line href="${chat}${encodeURIComponent(draft)}" target="_blank" rel="noopener">เปิดแชต LINE พร้อมข้อความ ↗</a></div>
    </div>
  </div></section>
  <script type="module">
    const inquiry = document.querySelector('[data-dealer-inquiry]');
    const editor = inquiry.querySelector('[data-dealer-editor]');
    const message = editor.querySelector('textarea');
    const link = inquiry.querySelector('[data-dealer-line]');
    function updateLink() {
      link.href = ${JSON.stringify(chat)} + encodeURIComponent(message.value.trim() || message.defaultValue);
    }
    editor.hidden = false;
    updateLink();
    message.addEventListener('input', updateLink);
    window.addEventListener('pageshow', updateLink);
  </script>`;
}
