import {giftsetGuides} from './journal-giftsets.mjs';
import {merchGuides} from './journal-merch.mjs';
import {campaignGuides} from './journal-campaign.mjs';
import guides2027 from './journal-2027.json' with {type:'json'};
import additionalSets from './journal-extra-sets.json' with {type:'json'};
import additionalMerch from './journal-extra-merch.json' with {type:'json'};
import additionalBuying from './journal-extra-buying.json' with {type:'json'};
import {flashDriveGuides} from './journal-flash-drives.mjs';
import {smallOrderArticle, renderSmallOrderArticle} from './small-order-article.mjs';
import {canonicalPath} from './seo-config.mjs';
import {characterReferences} from './character-references.mjs';

export const journalGroups = [
  {id:'gift-sets', name:'ชุดของขวัญองค์กร', intro:'เลือกของในชุดให้ตรงกับผู้รับ กำหนดงบต่อชุด และออกแบบกล่องสำหรับโครงการของคุณ'},
  {id:'custom-merchandise', name:'สินค้าพรีเมียมสั่งผลิต', intro:'จากทรงกระเป๋าไปจนถึงมาสคอต เลือกวัสดุ สี รูปทรง และรายละเอียดที่ทำให้สินค้าเป็นของแบรนด์คุณ'},
  {id:'campaign-procurement', name:'วางแผนแคมเปญและจัดซื้อ', intro:'ใช้บรีฟ ตัวอย่าง และเกณฑ์ตรวจรับร่วมกัน ตั้งแต่ขอราคาจนถึงวันที่แต่ละสาขาได้รับของ'},
];
export const journalTitle = 'บทความชุดของขวัญองค์กรและสินค้าสั่งผลิตเฉพาะแบรนด์';
export const journalDescription = 'คู่มือสำหรับทีมจัดซื้อและการตลาด เลือกชุดของขวัญองค์กร พัฒนาสินค้าเฉพาะแบรนด์ และเตรียมแคมเปญสั่งผลิตจำนวนมาก';
const focus = ['ธนาคารและการเงิน','โรงพยาบาลและสุขภาพ','ห้างและค้าปลีก','บริษัทและแบรนด์','ราชการและการศึกษา'];
const journalRoot = '/smartgift/blog';
const annualGuide = 'promotional-gifts-2027';
const groupRoute = id => '/blog/category/' + id;
const groupUrl = id => canonicalPath(groupRoute(id));
const articleUrl = a => journalRoot + '/' + a.slug;
const groupInfo = a => journalGroups.find(g => g.id === a.group);
const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

function productCover(model,file,alt,caption) {
  return {model,image:'/assets/articles/journal-'+file+'.webp',alt,caption,href:'/smartgift/products/'+model.toLowerCase()};
}
const earlier = {
  'choose-promotional-gifts': {
    group:'campaign-procurement',keywords:['เลือกของแถมส่งเสริมการขาย','ของสมนาคุณสมาชิก'],
    industries:['ห้างและค้าปลีก','ธนาคารและการเงิน'],
    title:'เลือกของแถมให้ลูกค้าอยากหยิบมาใช้อีกหลังจบแคมเปญ',
    lead:'ปากกาที่เพาะต้นอ่อนได้หนึ่งด้าม ชวนให้ลูกค้ากลับมาดูสิ่งที่ปลูก ลองใช้พฤติกรรมของผู้รับเป็นจุดเริ่มต้นของบรีฟของแถม',
    cover:productCover('GU-13138','plant','ปากกาสามสีพร้อมกระเปาะใสสำหรับเพาะต้นอ่อนและโลโก้ ปตท. บนด้าม','ตัวอย่างการวางโลโก้ ปตท. บนด้ามปากกาเพาะต้นอ่อน GU-13138 โดยเว้นกระเปาะใสไว้ให้มองเห็นต้นไม้'),
    example:['หลังลูกค้ารับของไปแล้ว เขาจะทำอะไรต่อ','GU-13138 เป็นปากกาเจลที่มีกระเปาะใสสำหรับเพาะเมล็ดอยู่ด้านบน สำหรับงานเปิดบัญชีเยาวชนหรือกิจกรรมโรงเรียน ลองจัดจุดให้ผู้รับเติมน้ำครั้งแรก แล้วใส่คำแนะนำดูแลสั้น ๆ ไว้บนการ์ด หากจะใช้ภาพต้นอ่อนบนสื่อแจก ให้แสดงด้วยว่าตอนรับปากกาครั้งแรก ลูกค้าจะเห็นอะไรในกระเปาะ'],
    links:[['/products/gu-13138','ดูปากกาเพาะต้นอ่อน GU-13138'],['/products?category=campaign','เลือกของแถมสำหรับแคมเปญ']],
    checklist:['ผู้รับได้ของเมื่อทำกิจกรรมใด','ผู้รับจะหยิบชิ้นนี้ไปใช้อย่างไรหลังจบงาน','ติดตามยอดรับสิทธิ์เทียบกับจำนวนที่จัดไว้ได้ที่จุดใด'],
  },
  'create-brand-merchandise': {
    group:'custom-merchandise',keywords:['ผลิตสินค้าในแบรนด์ตัวเอง','ออกแบบสินค้าสำหรับขายหน้าร้าน'],
    industries:['บริษัทและแบรนด์','ห้างและค้าปลีก'],
    title:'ทำของสะสมในแบรนด์ตัวเอง เริ่มจากพวงกุญแจที่ลูกค้าหมุนเล่นได้',
    lead:'พวงกุญแจฟลิปบุ๊กเปลี่ยนภาพเมื่อหมุนปุ่มด้านข้าง ลองออกแบบภาพแรก ภาพสุดท้าย และโลโก้ให้ทำงานร่วมกันบนชิ้นเล็ก ๆ',
    cover:productCover('GU-13338','flip','พวงกุญแจฟลิปบุ๊กสีเขียวมิ้นต์และเหลือง มีปุ่มหมุน โซ่ลูกปัด และตัวอย่างโลโก้ Spotify','ตัวอย่างการวางโลโก้ Spotify บนกรอบพวงกุญแจฟลิปบุ๊ก GU-13338 ช่องกลางใช้เล่าเรื่องผ่านภาพเคลื่อนไหว'),
    example:['ให้ลูกค้าลองหมุนก่อนตัดสินใจซื้อ','รุ่น GU-13338 ใช้ปุ่มหมุนเลื่อนแผ่นภาพโดยไม่ต้องใช้แบตเตอรี่ แบรนด์เพลงอาจให้แผ่นเสียงหมุน ส่วนร้านกาแฟอาจเล่าเรื่องตั้งแต่เมล็ดถึงถ้วย ลองตัดภาพเป็นลำดับสั้น ๆ พิมพ์ขนาดจริง แล้วให้คนที่ไม่เคยเห็นแบบทดลองหมุน หากเขาเข้าใจภาพได้ในรอบเดียว ค่อยเลือกเฟรมที่ใช้โชว์หน้าร้านและพิมพ์บนกล่อง'],
    links:[['/products/gu-13338','ดูพวงกุญแจฟลิปบุ๊ก GU-13338'],['/custom-made','บรีฟคอลเลกชันของแบรนด์คุณ']],
    checklist:['ระบุว่าใครจะซื้อของสะสมและซื้อที่ไหน','เตรียมภาพต้นฉบับที่แบรนด์มีสิทธิ์นำไปผลิต','กำหนดสีกรอบ ลำดับภาพ และวิธีโชว์ชิ้นทดลองที่หน้าร้าน'],
  },
  'logo-printing-guide': {
    group:'custom-merchandise',keywords:['วิธีพิมพ์โลโก้สินค้าพรีเมียม','สกรีน ปัก เลเซอร์โลโก้'],
    industries:['บริษัทและแบรนด์','ราชการและการศึกษา'],
    lead:'ดูตัวอย่างซองบัตรกับสายคล้อง พื้นผิวสองชนิดในชิ้นเดียวช่วยให้เห็นว่าควรวางโลโก้ไว้ที่ไหน และส่งตัวอย่างอะไรให้ทีมผลิต',
    cover:productCover('GU-13231','lanyard','สายคล้องบัตรสีเหลืองพิมพ์โลโก้ DHL สีแดง คู่กับซองบัตรสีดำและตะขอถอดได้','ตัวอย่างการวางโลโก้ DHL บนสายคล้องและบัตรที่สอดในซอง รุ่น GU-13231'),
    example:['ซองบัตรกับสายคล้อง ต้องอนุมัติคนละจุด','ซองรุ่น GU-13231 ใช้สายคล้องถอดได้ หากต้องการตรากดจมบนซอง ให้ส่งตัวอย่างบนพื้นผิวจริงมาดูใต้แสงธรรมชาติ ส่วนลายซ้ำบนสาย ให้ลองคล้องคอแล้วตรวจทั้งสองฝั่งว่าชื่อแบรนด์หันถูกทาง ตะเข็บและตะขอไม่บังตัวอักษร ถ้าเลือกทอโลโก้ลงในสาย ขอชิ้นเทียบเส้นด้ายและดูตัวอักษรเล็กที่ขนาดใช้งานจริงก่อนยืนยัน'],
    links:[['/products/gu-13231','ดูซองบัตรและสายคล้อง GU-13231'],['/logo-preview','ทดลองวางโลโก้']],
    source:['คู่มือเตรียมลายสำหรับสายคล้องของ Pinpops','https://www.pinpops.com/en/artwork-instructions/'],
    checklist:['ส่งไฟล์ต้นฉบับพร้อมสีแบรนด์ที่อนุมัติ','ระบุด้านและขนาดโลโก้บนชิ้นงานเป็นเซนติเมตร','เทียบตัวอย่างบนวัสดุจริงก่อนอนุมัติ'],
  },
  'prepare-production-timeline': {
    group:'campaign-procurement',keywords:['ระยะเวลาสั่งผลิตของพรีเมียม','วางแผนผลิตของแจกงานอีเวนต์'],
    industries:['ห้างและค้าปลีก','โรงพยาบาลและสุขภาพ','ราชการและการศึกษา'],
    lead:'ใช้บ้านไม้ประดับไฟเป็นตัวอย่างวางกำหนดการ ตั้งแต่เห็นชิ้นจริงตอนเปิดไฟ จนถึงวันที่แต่ละสาขาต้องจัดหน้าร้านเสร็จ',
    cover:productCover('GU-13270','cabin','บ้านไม้ประดับไฟรูปตุ๊กตาหิมะ หลังคาฉลุลายดาวและโลโก้ IKEA ที่ฐาน','ตัวอย่างการวางโลโก้ IKEA บนฐานบ้านไม้ประดับไฟ GU-13270 สำหรับคอลเลกชันเทศกาล'),
    example:['แยกวันส่งของออกจากวันที่ต้องเปิดไฟที่หน้าร้าน','สำหรับบ้านไม้ GU-13270 ขอชมต้นแบบทั้งตอนเปิดและปิดไฟ เพื่อตรวจช่องฉลุ สีของแสง และบริเวณฐานที่วางโลโก้ จากนั้นทดลองหยิบชิ้นงานออกจากกล่องและเปิดสวิตช์ด้านล่าง ให้สาขานำร่องลองจัดวางจริงก่อนกำหนดวันกระจายของ วิธีนี้ทำให้ทีมรู้ว่าต้องเผื่อเวลาตรวจชิ้นงานและจัดหน้าร้านเท่าไร'],
    links:[['/products/gu-13270','ดูบ้านไม้ประดับไฟ GU-13270'],['/products?category=seasonal','ดูของพรีเมียมสำหรับเทศกาล']],
    checklist:['ระบุวันที่ต้องถึงสถานที่จัดงาน','ขอวันตรวจต้นแบบและวันอนุมัติลายที่ทีมทำได้จริง','เผื่อเวลาตรวจนับและแบ่งบรรจุก่อนแจก'],
  },
  'request-quotation-checklist': {
    group:'campaign-procurement',keywords:['ขอใบเสนอราคาสินค้าพรีเมียม','บรีฟงานสั่งผลิตองค์กร'],
    industries:['บริษัทและแบรนด์','ธนาคารและการเงิน','ราชการและการศึกษา'],
    lead:'บรีฟที่ตั้งโทรศัพท์พับได้ให้ตีราคาได้ตรงกัน ตั้งแต่ขนาดซองบัตร ตำแหน่งโลโก้ ไปจนถึงวิธีทดสอบกับโทรศัพท์ที่ลูกค้าใช้',
    cover:productCover('SG-900005','stand','ที่ตั้งโทรศัพท์พับได้สีน้ำตาลพร้อมช่องใส่บัตรและตัวอย่างโลโก้ Visa ตั้งโทรศัพท์ในแนวนอน','ตัวอย่างการวางโลโก้ Visa กลางช่องใส่บัตรของที่ตั้งโทรศัพท์ SG-900005 จากภาพรุ่นสินค้าในแฟ้ม SmartGift'),
    example:['แนบภาพเมื่อใช้งานจริงกับใบขอราคา','ที่ตั้งโทรศัพท์ SG-900005 มีทั้งหน้าซองใส่บัตรและแนวพับ ทำเครื่องหมายตำแหน่งโลโก้บนภาพตอนกางและตอนพับ แล้วระบุจำนวนชิ้นต่อสี ขอให้ผู้เสนอราคาแยกค่าสินค้า ค่าตกแต่ง และกล่องต่อชิ้น หากต้องใช้กับเคสโทรศัพท์รุ่นใด ให้ระบุชื่อรุ่นและส่งเคสตัวอย่างเพื่อลองตั้งและหยิบบัตรก่อนยืนยันยอดผลิต'],
    links:[['/products/sg-900005','ดูที่ตั้งโทรศัพท์พับได้ SG-900005'],['/contact','ส่งรายละเอียดเพื่อขอใบเสนอราคา']],
    checklist:['ส่งจำนวนแยกตามรหัสสินค้า','แนบไฟล์โลโก้พร้อมตำแหน่งทุกด้าน','บอกงบต่อชิ้นหรือทั้งโครงการ รวมเงื่อนไขกล่องและส่งของ'],
  },
};

function articlePhotos(a) {
  return [...(a.photos || [a.cover.image]), ...(a.workExamples || []).map(p=>'/assets/project-portfolio/'+p.image), a.detailPhoto?.image].filter(Boolean);
}

function workGallery(examples) {
  if (!examples?.length) return '';
  return `<section id="usb-3d-examples" class="jg-work-gallery" aria-labelledby="usb-3d-title"><h2 id="usb-3d-title">ผลงานแฟลชไดรฟ์ยางหยอด 3 มิติจาก USBThailand</h2>
    <div class="jg-work-grid">${examples.map(p=>`<figure><a href="${esc(p.source)}"><img src="/assets/project-portfolio/${esc(p.image)}" alt="${esc(p.alt)}" loading="lazy" decoding="async" width="640" height="480"></a><figcaption><h3>${esc(p.title)}</h3><p>${esc(p.description)}</p><a href="${esc(p.source)}" aria-label="ดูผลงาน ${esc(p.title)} บน USBThailand">ดูผลงานต้นฉบับ ↗</a></figcaption></figure>`).join('')}</div></section>`;
}

export function collectArticles(legacy) {
  const bySlug = new Map(legacy.map(a => {
    const update=earlier[a.slug];
    const entry={...a,...update};
    if (update?.example) entry.sections=[update.example,...a.sections];
    return [a.slug,entry];
  }));
  bySlug.set(smallOrderArticle.slug,{...smallOrderArticle,group:'gift-sets',industries:['ธนาคารและการเงิน','โรงพยาบาลและสุขภาพ','ห้างและค้าปลีก']});
  for (const [group, guides] of [[journalGroups[0],giftsetGuides],[journalGroups[1],merchGuides],[journalGroups[2],campaignGuides]]) {
    for (const a of guides) bySlug.set(a.slug,{...a,group:group.id});
  }
  for (const entry of [...guides2027, ...additionalSets, ...additionalMerch, ...additionalBuying, ...flashDriveGuides]) {
    if (bySlug.has(entry.slug) || !groupInfo(entry)) throw Error('Invalid editorial entry '+entry.slug);
    bySlug.set(entry.slug,entry);
  }
  const all = [...bySlug.values()].sort((a,b)=>(b.published||'').localeCompare(a.published||''));
  const owners=new Map();
  for (const a of all) {
    for (const slug of a.related || []) {
      if (!bySlug.has(slug) || slug === a.slug) throw Error('Invalid related guide '+slug+' in '+a.slug);
    }
    const model=a.cover.model || a.cover.sku;
    if (!model) throw Error('Missing featured product for '+a.slug);
    const linkedModels=(a.links || []).map(([url])=>url.match(/\/(?:products|set)\/([\w-]+)\/?(?:[?#].*)?$/i)?.[1]).filter(Boolean);
    const models=[model,...(a.otherModels || []),...linkedModels].map(id=>'model:'+id.toUpperCase());
    const photos=articlePhotos(a);
    for (const key of [...models,...photos]) {
      const owner=owners.get(key);
      if (owner && owner!==a.slug) throw Error('Repeated editorial product or photo '+key+' in '+owner+' and '+a.slug);
      owners.set(key,a.slug);
    }
  }
  return all;
}

function directoryCard(a) {
  return `<article class="jg-card" data-audience="${esc(a.industries.join('|'))}"><a href="${articleUrl(a)}">
    <div class="jg-card-photo"><img alt="${esc(a.cover.alt)}" src="${esc(a.cover.image)}" loading="lazy" decoding="async" width="500" height="330"></div>
    <div class="jg-card-copy"><h3>${esc(a.title)}</h3><p>${esc(a.lead)}</p><span class="jg-read">อ่านบทความ →</span></div>
  </a></article>`;
}

export function journalHomePicks(articles) {
  return [annualGuide,smallOrderArticle.slug,'create-brand-merchandise'].map(slug=>articles.find(a=>a.slug===slug));
}

export function journalIndex(articles,id='') {
  const current = journalGroups.find(g=>g.id===id);
  const groups = current ? [current] : journalGroups;
  const count = current ? articles.filter(a=>a.group===id).length : articles.length;
  const hero = current ? `<header class="jg-heading"><div class="container"><nav aria-label="เส้นทางหน้าเว็บ"><a href="/">หน้าแรก</a> / <a href="${journalRoot}">บทความ</a></nav><h1>${esc(current.name)}</h1><p>${esc(current.intro)}</p></div></header>` :
  `<header class="jg-hero"><div class="container jg-hero-inner"><div class="jg-hero-copy"><nav aria-label="เส้นทางหน้าเว็บ"><a href="/">หน้าแรก</a> / บทความ</nav>
    <h1>ชุดของขวัญองค์กร<br><em>และสินค้าสั่งผลิตเฉพาะแบรนด์</em></h1>
    <p>คู่มือสำหรับทีมจัดซื้อและการตลาด ตั้งแต่เลือกของในชุด ออกแบบสินค้าตามโจทย์ของลูกค้า ไปจนถึงตรวจตัวอย่างและแบ่งส่งหลายสาขา</p>
    <ul class="jg-design-routes" aria-label="ไอเดียสำหรับโจทย์สั่งผลิตเฉพาะแบรนด์">
      <li><a href="${journalRoot}/${annualGuide}">วางแผนของพรีเมี่ยมปี 2570 ตามงบและวิธีแจก →</a></li>
      <li><a href="${journalRoot}/retail-private-label-gift-collection">ออกแบบชุดของขวัญและกล่องในสไตล์แบรนด์คุณ →</a></li>
      <li><a href="${journalRoot}/retail-shopping-bag-custom-design">พัฒนากระเป๋าสำหรับขายหน้าร้าน →</a></li>
      <li><a href="${journalRoot}/custom-brand-mascot-art-toy-prototype">ขึ้นรูป Art Toy จากมาสคอตขององค์กร →</a></li>
    </ul><div class="actions"><a class="button teal" href="#journal-topics">ดูบทความทุกหมวด ↓</a><a class="text-link" href="/smartgift/custom-made">ดูบริการผลิตเฉพาะแบรนด์ →</a></div>
    </div><div class="jg-hero-photo"><img src="/assets/articles/journal-cover.webp" alt="มาสคอตผ้าสีเขียว พวงกุญแจรูปถุงช้อปปิ้ง และแก้วหูช้างพร้อมลายพิมพ์ ตัวอย่างสินค้าที่ออกแบบให้ต่างกันตามแบรนด์" width="1150" height="767" fetchpriority="high"></div></div></header>`;
  return `<div class="jg">${hero}<div class="container jg-list" id="journal-topics">
    <div class="jg-tools"><nav class="jg-tabs" aria-label="หมวดบทความ"><a href="${journalRoot}" ${!id?'aria-current="page"':''}>ทั้งหมด <span>${articles.length}</span></a>
    ${journalGroups.map(g=>`<a href="${groupUrl(g.id)}" ${g.id===id?'aria-current="page"':''}>${g.name} <span>${articles.filter(a=>a.group===g.id).length}</span></a>`).join('')}</nav>
    <label class="jg-filter" hidden>ประเภทธุรกิจ<select data-journal-filter><option value="">ทุกธุรกิจ</option>${focus.map(label=>`<option>${label}</option>`).join('')}</select></label></div>
    ${id==='custom-merchandise'?characterReferences(esc):''}
    <p class="jg-count" role="status" data-journal-count>${count} บทความ</p>
    ${groups.map(g=>`<section class="jg-group" data-journal-group aria-label="${g.name}">${current?'<h2 class="sr-only">บทความในหมวดนี้</h2>':`<div class="jg-section-head"><div><h2>${g.name}</h2><p>${g.intro}</p></div><a class="text-link" href="${groupUrl(g.id)}">ดูหมวดนี้ →</a></div>`}
    ${!current && g.id==='custom-merchandise'?`<a class="text-link" href="${groupUrl(g.id)}#character-ideas">ดูภาพพวงกุญแจ อาร์ตทอย ฝาแก้ว และกระเป๋าซิลิโคน →</a>`:''}
    <div class="jg-grid">${articles.filter(a=>a.group===g.id).map(directoryCard).join('')}</div></section>`).join('')}
    <p data-journal-empty hidden>ยังไม่มีบทความสำหรับธุรกิจนี้ในหมวดที่เลือก <button type="button" class="text-link">ดูทุกธุรกิจในหมวดนี้</button></p>
    </div><script type="module" src="/journal-filter.js"></script></div>`;
}

function industryTags(a) {
  return `<nav class="jg-tags" aria-label="บทความตามประเภทธุรกิจ">${a.industries.map(name=>`<a href="${journalRoot}?industry=${encodeURIComponent(name)}">${esc(name)}</a>`).join('')}</nav>`;
}

function annualDirectory(articles) {
  const memberSlugs=new Set(guides2027.map(a=>a.slug));
  return `<nav class="jg-year-guides" aria-labelledby="year-guides"><h2 id="year-guides">เลือกอ่านตามงานที่กำลังเตรียม</h2>${journalGroups.map(g=>`<section><h3>${g.name}</h3><ul>${articles.filter(b=>memberSlugs.has(b.slug) && b.slug!==annualGuide && b.group===g.id).map(b=>`<li><a href="${articleUrl(b)}">${esc(b.title)}</a></li>`).join('')}</ul></section>`).join('')}</nav>`;
}

function comparison(rows) {
  if (!rows) return '';
  return `<section class="jg-compare"><h2>ตารางช่วยตัดสินใจ</h2><table aria-label="ตารางเปรียบเทียบสำหรับการจัดซื้อ"><thead><tr><th scope="col">รายการ</th><th scope="col">สิ่งที่ควรดู</th><th scope="col">วิธีนำไปใช้</th></tr></thead><tbody>${rows.map(row=>{const [item,point,action]=row.split('|'); return `<tr><th scope="row">${esc(item)}</th><td>${esc(point)}</td><td>${esc(action)}</td></tr>`;}).join('')}</tbody></table></section>`;
}

export function renderJournalArticle(a, articles) {
  const group=groupInfo(a);
  if (a.slug===smallOrderArticle.slug) return renderSmallOrderArticle()+`<div class="container jg-return"><a href="${groupUrl(a.group)}">อ่านบทความหมวด${group.name} →</a>${industryTags(a)}</div>`;
  const others = articles.filter(b=> b.group===a.group && b.slug!==a.slug);
  const related = a.related ? a.related.map(slug=>articles.find(b=>b.slug===slug)) : others.sort((x,y) => y.industries.filter(t=>a.industries.includes(t)).length - x.industries.filter(t=>a.industries.includes(t)).length).slice(0,2);
  const published = a.published || '2026-11-18';
  const displayDate = new Intl.DateTimeFormat('th-TH',{dateStyle:'long',timeZone:'Asia/Bangkok'}).format(new Date(published+'T09:00:00+07:00'));
  return `<article class="jg jg-article"><header class="jg-heading"><div class="container">
    <nav aria-label="เส้นทางหน้าเว็บ"><a href="/">หน้าแรก</a> / <a href="${journalRoot}">บทความ</a> / <a href="${groupUrl(group.id)}">${group.name}</a></nav>
    <div class="jg-story-intro"><div><h1>${esc(a.title)}</h1><p class="jg-lead">${esc(a.lead)}</p><p class="jg-by">โดยทีม SmartGift Thailand · <time datetime="${published}">${displayDate}</time></p>
    ${industryTags(a)}</div><figure><a href="${esc(a.cover.href)}" class="jg-story-photo"><img src="${esc(a.cover.image)}" alt="${esc(a.cover.alt)}" width="800" height="600" fetchpriority="high"></a><figcaption>${esc(a.cover.caption)}</figcaption></figure></div>
  </div></header><div class="container jg-reading"><div class="jg-body">
    <p class="jg-answer">${esc(a.answer)}</p>
    ${workGallery(a.workExamples)}
    ${a.sections.map(([title,body],i)=>`<section id="section-${i+1}"><h2>${esc(title)}</h2>${(Array.isArray(body)?body:[body]).map(p=>`<p>${esc(p)}</p>`).join('')}</section>`).join('')}
    ${a.detailPhoto ? `<figure class="jg-detail-photo"><img loading="lazy" decoding="async" src="${esc(a.detailPhoto.image)}" alt="${esc(a.detailPhoto.alt)}"><figcaption>${esc(a.detailPhoto.caption)}</figcaption></figure>` : ''}
    ${comparison(a.steps)}
    ${a.source ? `<p><a href="${esc(a.source[1])}">${esc(a.source[0])} ↗</a></p>` : ''}
    <section><h2>คำถามที่พบบ่อย</h2>${a.faqs.map(([q,ans])=>`<details><summary>${esc(q)}</summary><p>${esc(ans)}</p></details>`).join('')}</section>
    ${a.slug===annualGuide ? annualDirectory(articles) : `<section><h2>บทความที่เกี่ยวข้อง</h2><ul>${related.map(b=>`<li><a href="${articleUrl(b)}">${esc(b.title)}</a></li>`).join('')}</ul>${a.steps && !a.related.includes(annualGuide) ? `<a href="${journalRoot}/${annualGuide}">กลับไปเลือกหัวข้อในคู่มือของพรีเมี่ยมปี 2570 →</a>` : ''}</section>`}
    </div><aside class="jg-aside"><h2>สิ่งที่ควรเตรียม</h2><ul>${a.checklist.map(t=>'<li>'+esc(t)+'</li>').join('')}</ul>
    <h3>สินค้าและบริการที่เกี่ยวข้อง</h3><ul>${a.links.map(([href,label])=>`<li><a href="${esc(canonicalPath(href))}">${esc(label)} →</a></li>`).join('')}</ul>
    <a class="button teal" href="/contact-us/#brief-form">ส่งบรีฟขอใบเสนอราคา →</a></aside>
  </div></article>`;
}

export function journalPageSpecs(articles) {
  return [
    ['/blog',journalTitle,journalDescription,journalIndex(articles)],
    ...journalGroups.map(g=>[groupRoute(g.id),'บทความ'+g.name,g.intro,journalIndex(articles,g.id)]),
    ...articles.map(a=>['/blog/'+a.slug,a.title,a.description||a.lead,renderJournalArticle(a,articles)]),
  ];
}

export function journalKeywordRows(articles) {
  return articles.map(a=>[groupInfo(a).name,a.title,a.keywords[0],a.keywords.slice(1).join(' · '),articleUrl(a)]);
}

export function journalKeywordsCsv(articles) {
  const rows = [['หมวดบทความ','หัวข้อ','คำค้นหลัก','คำค้นที่เกี่ยวข้อง','URL'],...journalKeywordRows(articles)];
  return '\uFEFF'+rows.map(row=>row.map(v=>'"'+v.replaceAll('"','""')+'"').join(',')).join('\r\n')+'\r\n';
}

export function journalSchema(a, origin) {
  const group=groupInfo(a), pageUrl=origin+articleUrl(a);
  const crumbs=[['หน้าแรก','/'],['บทความ',journalRoot],[group.name,groupUrl(group.id)],[a.title,articleUrl(a)]];
  return {'@context':'https://schema.org','@graph':[
    {'@type':'BlogPosting',headline:a.title,description:a.description||a.lead,inLanguage:'th-TH',articleSection:group.name,
      image:articlePhotos(a).map(p=>origin+p),keywords:a.keywords,
      datePublished:(a.published||'2026-11-18')+'T09:00:00+07:00',dateModified:(a.published||'2026-11-18')+'T09:00:00+07:00',
      author:{'@type':'Organization',name:'SmartGift Thailand',url:origin+'/about-us/'},
      publisher:{'@type':'Organization',name:'SmartGift Thailand',logo:{'@type':'ImageObject',url:origin+'/assets/logo.svg'}},
      mainEntityOfPage:{'@type':'WebPage','@id':pageUrl},url:pageUrl},
    {'@type':'BreadcrumbList',itemListElement:crumbs.map(([name,href],i)=>({'@type':'ListItem',position:i+1,name,item:origin+href}))}
  ]};
}
