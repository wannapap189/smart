import fs from 'node:fs';
import {cameraPouch, moldedGallery} from './molded-concepts.mjs';
export {cameraPouch};
const styles=JSON.parse(fs.readFileSync(new URL('./silicone-bags.json',import.meta.url),'utf8'));
const families=[
  ['character','กระเป๋าติดมาสคอตและชาร์ม','แบบเจาะรูช่วยให้ลูกค้าจัดตำแหน่งตัวการ์ตูนเองได้ เลือกให้เหมาะกับของที่จะใส่ก่อนตัดสินใจเรื่องขนาดชาร์ม'],
  ['carry','กระเป๋าคาดอก คาดเอว และสะพายไหล่','เทียบสัดส่วนกระเป๋าขณะสะพายจริง แล้วเลือกตำแหน่งโลโก้ให้เห็นชัดทั้งเวลาถือและสะพาย'],
  ['organizer','กระเป๋าจัดระเบียบและถุงหูรูด','เลือกช่องเปิดให้เหมาะกับของที่ลูกค้าหยิบใช้ เช่น กุญแจ เครื่องสำอาง หรือของใช้หลังออกกำลังกาย'],
];
export const siliconeRoute='/custom-made/silicone-bags';
export const siliconeTitle='สั่งทำกระเป๋าซิลิโคนและชาร์มมาสคอตเฉพาะแบรนด์';
export const siliconeIntro='เลือกจากกระเป๋าซิลิโคน 14 แบบ ทั้งรุ่นติดชาร์มการ์ตูน กระเป๋าคาดอก และกระเป๋าเครื่องสำอาง พร้อมปรับสี โลโก้ และรายละเอียดตามโครงการ';
export const siliconeRows=styles.map(p=>[
  p.id,p.title,['bag','custom','campaign'],p.images[0].replace('/assets/local-products/',''),[
    ['รายละเอียดแบบอ้างอิง',['กระเป๋าซิลิโคนสั่งทำสำหรับแบรนด์และองค์กร','รหัสแบบ '+p.model,'ขนาดตามแบบโรงงาน '+p.size]],
    ['ออกแบบสำหรับแบรนด์ของคุณ',[p.use,'ส่งไฟล์โลโก้หรือตัวละคร พร้อมจำนวนและวันที่ใช้ เพื่อให้ทีมประเมินงานแม่พิมพ์ สี และตัวอย่างก่อนผลิต']],
  ],'แบบอ้างอิงสำหรับสั่งผลิต สี อุปกรณ์ จำนวนขั้นต่ำ และกำหนดส่งยืนยันตามโครงการ',p.images.slice(1).map(url=>url.replace('/assets/local-products/',''))
]);
export function siliconePage(products,card,menu){
  const categories=families.map(([key,label,desc])=>{
    const items=styles.filter(p=>p.group===key);
    return `<section id="silicone-${key}" class="section container"><h2>${label}</h2><p>${desc}</p><div class="products-grid">${items.map(p=>card(products.get(p.id))).join('')}</div></section>`;
  }).join('');
  return `<header class="page-hero"><div class="container"><nav class="breadcrumbs" aria-label="เส้นทางหน้าเว็บ"><a href="/">หน้าแรก</a> / <a href="/smartgift/custom-made">ผลิตเฉพาะแบรนด์</a> / กระเป๋าซิลิโคน</nav><h1>${siliconeTitle}</h1><p>${siliconeIntro}</p><div class="actions">${families.map(([key,label])=>`<a class="button outline" href="#silicone-${key}">${label}</a>`).join('')}</div></div></header>
    <section class="section container catalogue" data-catalog-view="silicone-bags">${menu}<div class="special-collection-content" data-catalog-pane>
    <section class="section container"><div class="service-split"><div><h2>เปลี่ยนเอกลักษณ์ของแบรนด์ให้เป็นทรงกระเป๋า</h2><p>กระเป๋าทรงกล้องตัวอย่างนี้ใช้เลนส์นูนกับแถบสีเหลืองแดงให้คนจำแบรนด์ได้ตั้งแต่ด้านหน้า ส่วนด้านหลังใช้เป็นช่องใส่บัตรสมาชิก คุณเลือกได้ว่าจะใช้รูปสินค้า มาสคอต หรือสัญลักษณ์ของแบรนด์เป็นจุดเริ่มต้น</p><p>หากกำลังวางแผนสินค้าแลกซื้อหรือคอลเลกชันหน้าร้าน ส่งภาพสินค้า หรือมาสคอต พร้อมจำนวนที่ต้องการ และงบต่อใบมาให้ทีมประเมินได้เลย</p><a class="button orange" href="/contact-us/#brief-form">ส่งบรีฟกระเป๋าซิลิโคน →</a></div><figure><img class="rounded full-img" src="${cameraPouch}" width="1280" height="640" alt="ตัวอย่างกระเป๋าซิลิโคนซิป Kodak ลายกล้องฟิล์มสีเหลืองแดง ด้านหลังมีช่องใส่บัตร"><figcaption>แนวคิดกระเป๋าทรงกล้อง Kodak ด้านหน้าเป็นเลนส์นูน ด้านหลังใส่บัตรได้</figcaption></figure></div><nav class="molded-jumps" aria-label="ดูตัวอย่างงานขึ้นรูป"><a href="#stone-coasters">ที่รองแก้วหินดูดน้ำ ↓</a><a href="#new-materials">วัสดุจากต่างประเทศ ↓</a><a href="#molded-ideas">ของสะสมขึ้นรูป ↓</a><a href="/smartgift/custom-made/fan-events">สินค้าแฟนคลับและอีเวนต์ →</a></nav></section>${categories}${moldedGallery()}<div class="container section"><a class="button orange" href="/contact-us/#brief-form">ส่งแบบให้ทีมประเมินการผลิต →</a></div></div></section>`;
}
