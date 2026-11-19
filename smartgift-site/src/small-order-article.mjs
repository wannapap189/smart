const photoPath = '/assets/articles/';
const cover = {
  sku: 'TZM47-3',
  contents: 'แก้วมัคเก็บอุณหภูมิ สมุด A5 และปากกา',
  image: photoPath + 'corporate-gift-set-mug-notebook-tzm47-3.webp',
  alt: 'ชุดของขวัญรุ่น TZM47-3 มีกล่องสีดำ แก้วมัคสีครีม ปากกา และสมุดปกสีเบจพร้อมตัวอย่างโลโก้',
};

const choices = [
  {
    sku: 'TFX00-2', name: 'ต้อนรับพนักงานใหม่',
    image: photoPath + 'a5-notebook-pen-tfx00-2.webp', height: 593,
    alt: 'สมุด A5 ปกลายดาวสีดำ มีตัวอย่างโลโก้ที่ด้านล่างของปก วางคู่ปากกาในกล่อง รุ่น TFX00-2',
    contents: 'สมุดโน้ต A5 และปากกาเจลหมึกดำ',
    reason: 'พนักงานเปิดใช้ได้ตั้งแต่วันปฐมนิเทศ บนปกมีลายดาวอยู่แล้ว ลองวางโลโก้ที่มุมล่างเพื่อให้ชื่อแบรนด์อ่านง่าย',
  },
  {
    sku: 'TFH07-2', name: 'ขอบคุณทีมที่เดินทางบ่อย',
    image: photoPath + 'umbrella-bottle-tfh07-2.webp', height: 540,
    alt: 'กระบอกน้ำสีดำพร้อมตัวอย่างโลโก้ข้างขวดและร่มพับในกล่องชุดของขวัญ รุ่น TFH07-2',
    contents: 'กระบอกน้ำสุญญากาศ 350 มล. และร่มพับ 5 ตอน',
    reason: 'ร่มรุ่นนี้พับแล้วเหลือ 15 ซม. เหมาะกับคนที่ต้องพกร่มไปพบลูกค้า ส่วนข้างกระบอกน้ำเป็นจุดที่เห็นโลโก้ทุกครั้งที่หยิบดื่ม',
  },
  {
    sku: 'TKF0095', name: 'มอบให้คู่ค้าที่ชอบชงกาแฟ',
    image: photoPath + 'moka-pot-coffee-set-tkf0095.webp', height: 550,
    alt: 'ชุดชงกาแฟรุ่น TKF0095 มีโมคาพอตสีขาวพร้อมตัวอย่างโลโก้ด้านข้างและเตาไฟฟ้าในกล่องเดียวกัน',
    contents: 'โมคาพอต เตาไฟฟ้า และอุปกรณ์ชงกาแฟ',
    reason: 'ถ้ารู้ว่าผู้รับชอบลงมือชงกาแฟ ชุดนี้เลือกได้ตรงความสนใจ ส่งภาพด้านของโมคาพอตที่ต้องการวางโลโก้ให้ทีมตรวจพื้นที่ก่อนสรุปแบบ',
  },
];

export const smallOrderArticle = {
  slug: 'corporate-gift-sets-small-orders',
  title: 'สั่งชุดของขวัญองค์กรจำนวนมาก เลือกรุ่น วางโลโก้ และวางแผนส่งหลายสาขา',
  lead: 'เทียบชุดของขวัญพร้อมโลโก้ 4 รุ่น และดูตัวอย่างการแบ่งส่ง 500 ชุดให้หลายสาขา เพื่อเตรียมขอใบเสนอราคา',
  description: 'วางแผนสั่งชุดของขวัญองค์กรจำนวนมาก เทียบ 4 รุ่นพร้อมภาพโลโก้ ดูวิธีจัดงบต่อชุด ตรวจตัวอย่างก่อนผลิต และแบ่งส่งหลายสาขา พร้อมขอราคาตามจำนวนที่ต้องการ',
  cover,
  photos: [cover, ...choices].map(p => p.image),
  otherModels: choices.map(p => p.sku),
  keywords: ['ชุดของขวัญองค์กรจำนวนมาก', 'ชุดของขวัญพิมพ์โลโก้', 'สั่งผลิตชุดของขวัญองค์กร'],
};

function productUrl(sku) {
  return '/smartgift/premium-giftset/set/' + sku.toLowerCase();
}

function quoteFor(sku) {
  return `<details class="sg-guide-quote">
    <summary>ขอราคารุ่น ${sku}</summary>
    <form method="get" action="/contact-us/#brief-form">
      <input type="hidden" name="product" value="${sku}">
      <label>จำนวนที่ต้องการ (ชุด)<input type="number" inputmode="numeric" name="sets" min="10" max="10000000" step="1" placeholder="เช่น 500" required></label>
      <div class="sg-guide-quote-actions">
        <button class="button teal" type="submit" data-prepare-line hidden>เตรียมข้อความสำหรับ LINE</button>
        <button class="text-link" type="submit">กรอกบรีฟขอใบเสนอราคา →</button>
      </div>
      <div data-line-draft hidden><label>ข้อความที่จะส่ง<textarea rows="3" readonly></textarea></label>
        <a class="button teal" target="_blank" rel="noopener" data-open-line>เปิดแชต LINE พร้อมข้อความ ↗</a>
        <button type="button" class="text-link" data-copy-line>คัดลอกข้อความ</button><span role="status"></span>
      </div>
    </form>
  </details>`;
}

export function renderSmallOrderArticle() {
  const cards = choices.map(p => `
    <section class="sg-guide-choice">
      <a class="sg-guide-photo" href="${productUrl(p.sku)}"><img src="${p.image}" width="660" height="${p.height}" alt="${p.alt}" loading="lazy" decoding="async"></a>
      <div class="sg-guide-choice-copy">
        <h3>${p.name}</h3><p><a class="sg-guide-model" href="${productUrl(p.sku)}">${p.contents} รุ่น ${p.sku}</a></p><p>${p.reason}</p>
        ${quoteFor(p.sku)}
      </div>
    </section>`).join('');
  return `<article class="sg-guide" aria-labelledby="gift-guide-title">
    <header class="sg-guide-hero"><div class="container">
      <nav class="sg-guide-crumbs" aria-label="เส้นทางการนำทาง"><a href="/">หน้าแรก</a><span aria-hidden="true">/</span><a href="/smartgift/blog">บทความ</a><span aria-hidden="true">/</span><span>ชุดของขวัญองค์กร</span></nav>
      <div class="sg-guide-intro">
        <div class="sg-guide-opening"><p class="sg-guide-kicker">คู่มือเลือกชุดของขวัญสำหรับองค์กร</p>
          <h1 id="gift-guide-title">${smallOrderArticle.title}</h1>
          <p class="sg-guide-deck">ธนาคารที่เตรียมของขอบคุณลูกค้าหลายสาขา โรงพยาบาลที่จัดประชุมวิชาการ และห้างที่เตรียมของสมนาคุณสมาชิก ต่างมีโจทย์เรื่องคนรับและวันส่งมอบ ลองเริ่มจากยอดผู้รับแต่ละจุด แล้วค่อยเลือกรุ่น ตำแหน่งโลโก้ และกล่องให้พอดีกับงบต่อชุด</p>
          <p class="sg-guide-byline">โดยทีม SmartGift Thailand · <time datetime="2026-11-18">18 พฤศจิกายน 2569</time></p>
          <a class="text-link" href="#choose-a-set">ดูตัวอย่างตามลักษณะผู้รับ ↓</a>
        </div>
        <figure class="sg-guide-cover">
          <a class="sg-guide-photo" href="${productUrl(cover.sku)}"><img src="${cover.image}" width="1200" height="918" fetchpriority="high" alt="${cover.alt}"></a>
          <figcaption><strong>ของขวัญสำหรับวันประชุมกับคู่ค้า</strong><p><a class="sg-guide-model" href="${productUrl(cover.sku)}">${cover.contents} รุ่น ${cover.sku}</a></p><p>แก้วมัคความจุ 480 มล. ใช้ที่โต๊ะทำงานได้ ส่วนปกสมุดเป็นตำแหน่งที่เห็นโลโก้เมื่อนำเข้าประชุมครั้งถัดไป</p>${quoteFor(cover.sku)}</figcaption>
        </figure>
      </div>
    </div></header>
    <section class="container sg-guide-choices" id="choose-a-set" aria-labelledby="guide-choices-title">
      <h2 id="guide-choices-title">อีก 3 ชุด เลือกให้ตรงกับคนรับ</h2>
      <p>หากชุดประชุมยังไม่ตรงกับโอกาสที่คุณจะมอบ ลองเทียบของในกล่องและตำแหน่งโลโก้จากสามรุ่นนี้</p>
      <div class="sg-guide-cards">${cards}</div>
    </section>
    <div class="container sg-guide-details">
      <div class="sg-guide-reading">
        <section><h2>ตัวอย่างการวางแผน 500 ชุดสำหรับ 8 สาขา</h2>
          <p>สมมติว่าธนาคารจะมอบของขอบคุณลูกค้า 500 ชุด สาขาใหญ่ 2 แห่งรับแห่งละ 100 ชุด และอีก 6 แห่งรับแห่งละ 50 ชุด ยอดรวมพอดีกับจำนวนผลิต ฝ่ายจัดซื้อจึงขอราคาสองทางเลือกมาเทียบได้ ทั้งส่งรวมที่คลังและส่งตรงทั้ง 8 สาขา</p>
          <ul><li><strong>ก่อนขอราคา</strong> ระบุงบต่อชุดว่ารวมกล่อง โลโก้ และค่าจัดส่งหรือยัง พร้อมแนบยอดแยกสาขาเพื่อให้ทีมประเมินค่าขนส่ง</li>
          <li><strong>ก่อนผลิตทั้งล็อต</strong> ตรวจตัวอย่างสินค้าในกล่องจริง ดูสี ตำแหน่งและขนาดโลโก้ แล้วให้ผู้รับผิดชอบยืนยันแบบเดียวกันกับทีมผลิต</li>
          <li><strong>ก่อนกระจายของ</strong> ยืนยันวันรับของแต่ละจุด จำนวนชุดต่อกล่องขนส่ง และชื่อสาขาบนฉลาก เพื่อให้ปลายทางตรวจรับได้ตรงยอด</li></ul>
        </section>
        <section><h2>ควรวางโลโก้บนชิ้นไหนในชุด?</h2>
          <p>ถ้าอยากให้ผู้รับเห็นแบรนด์ตอนเปิดของขวัญ ให้เริ่มดูพื้นที่บนฝากล่อง ถ้าอยากให้เห็นระหว่างใช้งาน ให้เลือกชิ้นหลักสักชิ้น เช่น ปกสมุดหรือด้านข้างกระบอกน้ำ แล้วขอภาพตัวอย่างที่ระบุขนาดโลโก้จริงเป็นเซนติเมตร</p>
          <ul><li><strong>บนสมุด</strong> สังเกตแนวสายรัดและตัวล็อก ลองดูทั้งตอนปิดสมุดและตอนถือว่ามีอะไรบังชื่อแบรนด์หรือไม่</li>
          <li><strong>บนแก้วหรือขวด</strong> ดูว่าหูจับหรือความโค้งของผิวทำให้โลโก้อ่านยากตรงไหน หากโลโก้มีตัวหนังสือเล็ก ให้ทีมตรวจความคมชัดบนวัสดุของรุ่นนั้น</li>
          <li><strong>บนกล่อง</strong> ถ้าของขวัญมีการ์ดหรือปลอกสวม ให้ตรวจด้วยว่าเมื่อจัดกล่องเสร็จ โลโก้ยังอยู่ในตำแหน่งที่ต้องการ</li></ul>
          <a class="text-link" href="/smartgift/logo-preview?sku=TZM47-3">ลองวางโลโก้บนรุ่น TZM47-3 →</a>
        </section>
        <section><h2>ถ้าแต่ละสาขาต้องการคนละแบบ ควรขอราคาอย่างไร?</h2>
          <p>แยกยอดตามรหัสรุ่น สี และงานโลโก้ก่อนรวมเป็นยอดโครงการ เช่น ใช้ชุดสมุดสำหรับสมาชิกทั่วไป และชุดกาแฟสำหรับคู่ค้า หากแต่ละกลุ่มได้กล่องหรือการ์ดต่างกัน ให้ระบุแยกในใบเสนอราคาด้วย ทีมจัดซื้อจะเห็นค่าใช้จ่ายของแต่ละแบบชัดขึ้น</p>
        </section>
      </div>
      <aside class="sg-guide-brief" aria-labelledby="guide-brief-title">
        <h2 id="guide-brief-title">ส่งอะไรให้ทีมประเมินราคา?</h2>
        <ul><li>รหัสรุ่นและจำนวนชุดต่อแบบ</li><li>งบต่อชุด พร้อมระบุว่ารวมกล่องหรือค่าจัดส่งด้วยไหม</li><li>ไฟล์โลโก้และชิ้นที่ต้องการวาง</li><li>วันที่ต้องรับของและจำนวนจุดจัดส่ง</li></ul>
        <p>หากมีหลายรุ่นหรือหลายจุดส่ง ระบุยอดแยกรุ่นและจำนวนสาขาในบรีฟเดียวได้</p>
        <a class="button teal" href="/contact-us/#brief-form">ขอใบเสนอราคาสำหรับโครงการ →</a>
        <a class="text-link" href="/smartgift/download-catalog">ดูแคตตาล็อกทั้ง 14 หมวด →</a>
        <p class="sg-guide-minimum"><strong>สำหรับงานจำนวนน้อย</strong><br>เฉพาะชุดของขวัญในคอลเลกชัน SmartGift เริ่มสั่งได้ที่ 10 ชุดต่อแบบ สินค้าเดี่ยวและงานสั่งผลิตเฉพาะประเมินขั้นต่ำตามรุ่นและวิธีผลิต</p>
      </aside>
    </div>
  </article><script type="module" src="/giftset-article-quote.js"></script>`;
}
