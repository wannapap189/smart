import {portfolioGallery} from './portfolio-gallery.mjs';
import {extraIndustries} from './industry-mockups.mjs';
import fs from 'node:fs';

// Only original logo files recovered from SmartGift's own historical client section.
// No inferred customers from supplier catalogue images or AI concepts.
export const clients = JSON.parse(fs.readFileSync(new URL('./client-showcase.json', import.meta.url), 'utf8'));
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const industries = [
 {id:'banks',name:'ธนาคารและสถาบันการเงิน',intro:'งานโลโก้ที่เน้นความเรียบร้อย และเอกลักษณ์ที่ชัดเจนขององค์กร'},
 {id:'hospitals',name:'โรงพยาบาลและสุขภาพ',intro:'สินค้าและงานพิมพ์ที่ถ่ายทอดอัตลักษณ์ของเครือโรงพยาบาล'},
 {id:'retail',name:'ห้างสรรพสินค้าและค้าปลีก',intro:'กระเป๋า สินค้าแคมเปญ และของที่ระลึกสำหรับแบรนด์และพื้นที่ค้าปลีก'},
 {id:'companies',name:'บริษัทและแบรนด์',intro:'งานสินค้าเฉพาะแบรนด์ ทั้งงานโลโก้ คอลเลกชัน และตัวอย่างก่อนผลิต'},
 {id:'public',name:'หน่วยงานรัฐและองค์กร',intro:'งานสำหรับภาครัฐ รัฐวิสาหกิจ และองค์กรระหว่างประเทศ'},
 {id:'universities',name:'มหาวิทยาลัยและการศึกษา',intro:'ของที่ระลึกและสินค้าที่ถ่ายทอดเอกลักษณ์ของสถาบันและหลักสูตร'},
 ...extraIndustries
];
const caseBase='/assets/project-portfolio/';
export const industryCases=[
 {industry:'banks',brand:'ADB / GMS EOC',title:'แฟลชไดร์ฟโลหะ พร้อมงานโลโก้องค์กร',image:'usb-612-clean-v1.png',description:'ตัวอย่างงานแฟลชไดร์ฟที่ใช้ตัวอักษรและตราสัญลักษณ์ขององค์กรบนตัวเรือนโลหะ',source:'https://www.usbthailand.com/our-portfolio/612.htm',origin:'ผลงานในอดีตจาก USBThailand'},
 {industry:'hospitals',brand:'เครือโรงพยาบาลกรุงเทพ',title:'แฟลชไดร์ฟการ์ด พิมพ์กราฟิกเต็มพื้นที่',image:'usb-hospital-clean-v1.png',description:'ตัวอย่างงานของโรงพยาบาลกรุงเทพระยอง ใช้สี กราฟิก และตราเครือโรงพยาบาลในชิ้นงานเดียวกัน',source:'https://www.usbthailand.com/our-portfolio/714.htm',origin:'ผลงานในอดีตจาก USBThailand'},
 {industry:'retail',brand:'ONE BANGKOK',title:'กระเป๋าช้อปปิ้ง พร้อมโลโก้เฉพาะแบรนด์',image:'one-bangkok-clear-cutout.png',description:'ภาพตัวอย่างกระเป๋าใส หูสีดำ พร้อมงานพิมพ์โลโก้จากแฟ้มโครงการ SmartGift',source:'/portfolio/#one-bangkok',origin:'ภาพตัวอย่างสินค้าจากแฟ้มงาน SmartGift'},
 {industry:'retail',brand:'ROYAL PARAGON HALL',title:'แฟลชไดร์ฟโลหะ สลักโลโก้',image:'usb-1396-clean-v1.png',description:'ตัวอย่างงานตัวอักษรสีทองบนตัวเรือนโลหะ แสดงรายละเอียดงานโลโก้ของรอยัล พารากอน ฮอลล์',source:'https://www.usbthailand.com/our-portfolio/1396.htm',origin:'ผลงานในอดีตจาก USBThailand'},
 {industry:'companies',brand:'UD TRUCKS',title:'แก้วหูจับ พร้อมโลโก้และตราครบรอบ',image:'ud-trucks-tumbler-cutout.png',description:'แก้วสีดำพร้อมโลโก้สีขาวและตราครบรอบ 50 ปี จากภาพตัวอย่างงานในโครงการ',source:'/portfolio/#ud-trucks',origin:'ภาพตัวอย่างงานโลโก้จากแฟ้มงาน SmartGift'},
 {industry:'companies',brand:'True Digital Park',title:'ลวดลายสำหรับคอลเลกชันเฉพาะแบรนด์',image:'true-pride-sample-cutout.png',description:'ตัวอย่างสำหรับตรวจสีและสัดส่วนกราฟิกบนชิ้นงาน ก่อนยืนยันรายละเอียดการผลิต',source:'/portfolio/#true-pride',origin:'ตัวอย่างสำหรับตรวจแบบจากแฟ้มงาน SmartGift'},
 {industry:'public',brand:'DTI',title:'แฟลชไดร์ฟโลหะ พร้อมงานเลเซอร์โลโก้',image:'usb-511-clean-v1.png',description:'ภาพรายละเอียดตัวอักษรและตราสัญลักษณ์ DTI บนตัวเรือนโลหะ จากผลงานที่เผยแพร่บน USBThailand',source:'https://www.usbthailand.com/our-portfolio/511.htm',origin:'ผลงานในอดีตจาก USBThailand'},
 {industry:'universities',brand:'NIDA · GS-TM',title:'แฟลชไดร์ฟยางหยอด ขึ้นรูปตามแบบ',image:'usb-708-clean-v1.png',description:'งานขึ้นรูปพร้อมสีและตราสัญลักษณ์ NIDA และ GS-TM แสดงแนวทางทำของที่ระลึกเฉพาะสถาบัน',source:'https://www.usbthailand.com/our-portfolio/708.htm',origin:'ผลงานในอดีตจาก USBThailand'}
];
const logoCard=c=>`<figure class="client-logo-card"><div class="client-logo-frame"><img src="/assets/client-logos/${escape(c.file)}" alt="โลโก้ ${escape(c.name)}" width="150" height="150" loading="lazy"></div><figcaption>${escape(c.name)}</figcaption></figure>`;
const industryLinks=()=>`<nav class="client-industry-nav" aria-label="เลือกประเภทธุรกิจ">${industries.map(g=>`<a href="/portfolio/#clients-${g.id}">${g.name}</a>`).join('')}</nav>`;
export function clientShowcase({full=false,ownedSets}={}) {
  if(full)return portfolioGallery({clients,industries,cases:industryCases,ownedSets});
  const selected = full ? clients : clients.slice(0,16);
  return `<section class="client-showcase section" id="clients" aria-labelledby="clients-title"><div class="container client-showcase-layout"><div class="client-showcase-intro"><span class="eyebrow">15 ปี กับงานที่หลากหลาย</span><h2 id="clients-title">ส่วนหนึ่งของลูกค้า<br>ที่ไว้วางใจเรา</h2><p>จากแบรนด์ไทยถึงแบรนด์ระดับโลก<br>เราดูแลสินค้าเฉพาะแบรนด์<br>ให้ตอบโจทย์ของแต่ละองค์กร</p><div class="client-showcase-count"><strong>${clients.length}</strong><span>แบรนด์และองค์กร<br>จากรายชื่อลูกค้าของเรา</span></div>${full?'<a class="text-link" href="#project-examples-title">ชมตัวอย่างงานผลิต ↓</a>':`<a class="button outline" href="/portfolio/#clients">ดูรายชื่อลูกค้าเพิ่มเติม ↗</a>`}</div><div>${industryLinks()}<div class="client-logo-grid">${selected.map(c=>`<figure class="client-logo-card"><div class="client-logo-frame"><img src="/assets/client-logos/${escape(c.file)}" alt="โลโก้ ${escape(c.name)}" width="150" height="150" loading="lazy"></div><figcaption>${escape(c.name)}</figcaption></figure>`).join('')}</div><p class="client-showcase-note">รายชื่อและโลโก้จากเว็บไซต์ SmartGift Thailand เดิม แสดงประสบการณ์ที่ผ่านมาของเรา</p></div></div></section>`;
}
