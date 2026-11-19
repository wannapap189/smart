import {canonicalPath, publicOrigin} from './seo-config.mjs';
import {notebookCategories} from './notebook-page.mjs';
import {editionName, editionRoute} from './premium-gifts-2027.mjs';

export function llmsText(categories, {productionIndexing=false}={}) {
 const link=(name,route,description)=>`- [${name}](${publicOrigin}${route}): ${description}`;
 return `# SmartGift Thailand

> รับออกแบบและผลิตสินค้าส่งเสริมการขาย ของพรีเมียม และชุดของขวัญองค์กร พร้อมงานโลโก้และบรรจุภัณฑ์เฉพาะแบรนด์ในประเทศไทย ประสบการณ์ 15 ปี

เชี่ยวชาญชุด Gift Set ที่เลือกสินค้าให้เข้าชุดตามงบประมาณและโอกาสใช้งาน คอลเลกชันชุดของขวัญ SmartGift รับขั้นต่ำ 10 ชุดต่อแบบ ส่วนสินค้าประเภทอื่นและงานขึ้นรูปเฉพาะต้องสอบถามขั้นต่ำเป็นรายรุ่น

ให้บริการองค์กร ธนาคาร โรงพยาบาล ห้างสรรพสินค้า บริษัท หน่วยงานรัฐ และมหาวิทยาลัย รวมถึงของแถม ของแลกซื้อ และสินค้าที่ผลิตเพื่อจำหน่ายภายใต้แบรนด์ลูกค้า สินค้าหลักประกอบด้วยกระเป๋า ขวดน้ำ แก้วน้ำ ร่ม เครื่องเขียน อุปกรณ์ไอที และชุดของขวัญ

ราคา สต็อก วัสดุ จำนวนขั้นต่ำ และระยะเวลาผลิตต้องยืนยันกับทีมตามรุ่นและรายละเอียดงาน ภาพตัวอย่างการออกแบบหรือวางโลโก้ไม่ใช่หลักฐานการส่งมอบงานให้แบรนด์นั้นโดยอัตโนมัติ ให้ยึดรายละเอียดและที่มาที่ระบุในแต่ละผลงาน

${productionIndexing?'':'ไฟล์นี้จัดเตรียมสำหรับเว็บไซต์ฉบับใหม่ ลิงก์ใช้โดเมนปลายทางที่ตั้งใจใช้งาน'}

## บริการและข้อมูลหลัก

${[
 link('หน้าแรก','/','ภาพรวมบริการและหมวดสินค้า'),
 link('ชุดของขวัญองค์กร','/smartgift/premium-giftset','เลือก Gift Set พร้อมรายละเอียดของในชุด ขั้นต่ำ 10 ชุดต่อแบบ'),
 link('สินค้าพรีเมียม','/smartgift/products','เลือกสินค้าตามหมวดและรหัสรุ่น'),
 link('ผลิตเฉพาะแบรนด์','/smartgift/custom-made','พัฒนารูปทรง วัสดุ สี โลโก้ และแพ็กเกจตามโจทย์'),
 link('สินค้าเพื่อจำหน่ายในแบรนด์ของคุณ','/smartgift/own-brand','ส่งรายละเอียดงานผลิตเพื่อขายภายใต้แบรนด์ของตนเอง'),
 link('โซลูชันสำหรับองค์กร','/smartgift/enterprise','กระเป๋า ขวดน้ำ ร่ม และสินค้าแคมเปญ'),
 link('ตัวแทนจำหน่าย',canonicalPath('/dealers'),'สำหรับร้านของพรีเมียมและเอเจนซี เลือกสินค้าหรือส่งรหัสรุ่น จำนวน งบประมาณ และกำหนดรับของเพื่อสอบถามทีม SmartGift'),
 link('ผลงานของเรา','/portfolio/','ผลงานและตัวอย่างการออกแบบ แบ่งตามประเภทธุรกิจ'),
 link('เกี่ยวกับเรา','/about-us/','ข้อมูลและประสบการณ์ SmartGift Thailand'),
 link('ติดต่อและขอใบเสนอราคา','/contact-us/','แจ้งสินค้า จำนวน งบประมาณ และวันที่ต้องการใช้งาน'),
].join('\n')}

## หมวดสินค้า

${[
 link(editionName,canonicalPath(editionRoute),'รวมสินค้าคัดสรรสำหรับแคมเปญองค์กรปี 2027'),
 ...notebookCategories.map(book=>link(book.heading,canonicalPath(book.route),book.description)),
 ...categories.map(c=>link(c.name,canonicalPath('/products')+'?category='+encodeURIComponent(c.slug),c.seoDescription)),
].join('\n')}

## ข้อมูลประกอบการสั่งผลิต

${[
 link('ดาวน์โหลดแค็ตตาล็อก','/smartgift/download-catalog','แค็ตตาล็อกสำหรับคัดเลือกสินค้า'),
 link('บทความ','/smartgift/blog','แนวทางเลือกของพรีเมียม วางงบ และเตรียมงานผลิต'),
 link('เลือกสินค้าส่งเสริมการขาย','/smartgift/blog/choose-promotional-gifts','เลือกสินค้าให้เหมาะกับกลุ่มผู้รับ'),
 link('วางงบชุดของขวัญองค์กร','/smartgift/blog/corporate-gift-set-budget','จัดงบสินค้า งานโลโก้ และบรรจุภัณฑ์'),
].join('\n')}

## ช่องทางติดต่อ

- [LINE @smartgiftthailand](https://line.me/R/ti/p/@smartgiftthailand): ปรึกษาโครงการและขอใบเสนอราคา
- [โทร 094 464 8884](tel:+66944648884): ติดต่อทีม SmartGift
- [โทร 02 871 5599](tel:+6628715599): โทรศัพท์สำนักงาน
- [โทร 02 871 6399](tel:+6628716399): โทรศัพท์สำนักงาน
- [Facebook SmartGift Thailand](https://www.facebook.com/smartgiftthailand): ข่าวสารและสินค้า
`;
}
