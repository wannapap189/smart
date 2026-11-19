import {snowRoute,snowTitle,snowPage} from './snow-globe.mjs';
import {llmsText} from './llms.mjs';
import {eventsRoute,eventsTitle,eventsIntro,fanEventPage} from './fan-events.mjs';
import {siliconeRoute,siliconeTitle,siliconeIntro,siliconePage,cameraPouch} from './silicone-bags.mjs';
const productionIndexing=process.env.SMARTGIFT_INDEXABLE==='1';
import {homeGiftsetCards,homeProductCards} from './home-selections.mjs';
import {projectBriefPage} from './project-brief.mjs';
import {clientShowcase} from './client-showcase.mjs';
import {applyImageOverrides} from './image-overrides.mjs';
import {historicalPortfolio} from './historical-projects.mjs';
import {publicOrigin,canonicalPath,preservedPagePaths,excludedSitemapRoutes,generalPageSchema} from './seo-config.mjs';
import {projectPortfolio,homeProjectPortfolio} from './project-portfolio.mjs';
import {syncLocalProducts,localProducts} from './local-products.mjs';
import {enterprisePage} from './enterprise.mjs';
import {logoPreviewPage} from './logo-preview.mjs';
import {phoneLinks} from './contact-details.mjs';
import {heroCarousel} from "./hero-carousel.mjs";
import {dealerTitle,dealerDescription,dealerPage} from './dealers.mjs';
import {createPdfSearchIndex,createSearchIndex,homeSearch,globalSearchPage} from './global-search.mjs';
import {downloadCataloguePage,downloadDescription,ownBrandPage,companyProfileSection} from './business-pages.mjs';
import {loadOwnedSets,ownedCatalogue,ownedProduct,ownedSchema,ownedCard} from './owned-giftsets.mjs';
import {giftsetBuilder} from './giftset-builder.mjs';
import {notebookCategories} from './notebook-page.mjs';
import {catalogMenu} from './catalog-menu.mjs';
import {editionRoute,editionName,editionDescription,editionGroups,editionItems,editionPage} from './premium-gifts-2027.mjs';
import {notebookModelIds, powerNotebookIds} from './notebook-models.mjs';
import {existingNotebookIds, notebookRoute, powerNotebookRoute, smartNotebookName} from './notebook-selection.mjs';
import fs from 'node:fs/promises';
import path from 'node:path';
import {prepareCatalog} from './catalog-availability.mjs';
import {categoryIntent,keywordPlan} from './search-intent.mjs';
import {productUrl,skuFor,quoteButtonQuantity,renderProduct,productSchema,metadataFor,renderStylePreview,overrides} from './product-content.mjs';
import {articles} from './journal-catalog.mjs';
import {journalPageSpecs,journalHomePicks,journalSchema,journalGroups,journalKeywordRows,journalKeywordsCsv} from './journal.mjs';
const articleByRoute=new Map(articles.map(a=>['/blog/'+a.slug,a]));
const root=path.resolve('dist');
await syncLocalProducts(root);
await applyImageOverrides(root);
const unavailableProducts=await prepareCatalog(root);
const ownedSets=await loadOwnedSets();
const ownedByRoute=new Map(ownedSets.items.map(p=>[p.url.replace('/smartgift',''),p]));
const featured=JSON.parse(await fs.readFile(path.join(root,'data/featured.json'),'utf8'));
const cats=JSON.parse(await fs.readFile(path.join(root,'data/categories.json'),'utf8'));
const fullCatalog=JSON.parse(await fs.readFile(path.join(root,'data/catalog.json'),'utf8')).items.map(p=>({...p,...overrides[p.id]}));
const productsById=new Map(fullCatalog.map(p=>[p.id,p]));
const bookIds = [...notebookModelIds, ...existingNotebookIds];
const allNotebooks = bookIds.map(id => {
  const book = productsById.get(id);
  if (!book) throw new Error('Missing registered notebook '+id);
  return book;
});
const paperNotebooks = allNotebooks.filter(p => !powerNotebookIds.includes(p.id));
const powerNotebooks = allNotebooks.filter(p => powerNotebookIds.includes(p.id)).sort((a,b) => Number(b.id)-Number(a.id));
const picks2027=editionGroups(cats,productsById,ownedSets);
const booksByCategory=new Map([['notebooks',paperNotebooks],['power-bank-notebooks',powerNotebooks]]);
const standaloneBookIds=new Set(bookIds);
const officeItems=fullCatalog.filter(p=>p.categories.includes('office') && !standaloneBookIds.has(p.id));
cats.find(c=>c.slug==='office').browseCount=officeItems.length;
const categoryMenu=selected=>catalogMenu({cats,booksByCategory,giftCount:ownedSets.items.length,selected});
const searchIndex=createSearchIndex(fullCatalog,ownedSets.items,cats);
await fs.writeFile(path.join(root,'data/product-pdf-index.json'),JSON.stringify(createPdfSearchIndex(ownedSets.items,fullCatalog)));
const downloadFiles=JSON.parse(await fs.readFile(path.join(root,'data/downloads.json'),'utf8'));
await fs.writeFile(path.join(root,'data/search-index.json'),JSON.stringify(searchIndex));
for(const c of cats){const k=categoryIntent[c.slug];c.seoTitle=k.primary+' | '+c.name;c.seoDescription=k.intro;c.primaryKeyword=k.primary;c.secondaryKeywords=k.secondary;}
await fs.writeFile(path.join(root,'data/categories.json'),JSON.stringify(cats));
const origin=publicOrigin;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const notebookCard = product => card(product, {anchor:'book-'+skuFor(product)});
const notebookTemplates=notebookCategories.map(({key,heading,title,description,pdfUrl})=>
  `<template data-notebook-category="${key}" data-pdf-url="${esc(pdfUrl)}" data-heading="${esc(heading)}" data-title="${esc(title)}" data-description="${esc(description)}"></template>`+
  booksByCategory.get(key).map(p=>{
    const terms=[p.factoryCode,p.descriptionTh||p.description,...(p.searchAliases||[]),p.groups?.[0]?.bullets?.[0]];
    const search=[...new Set(terms.filter(Boolean))].join(' ');
    return `<template data-notebook-card="${p.id}" data-notebook-kind="${key}" data-search="${esc(search)}">${notebookCard(p)}</template>`;
  }).join('')
).join('');
const base='/smartgift';
const url=(p='')=>canonicalPath(p);
const icons={arrow:'↗',gift:'◇',bag:'▱',check:'✓'};
const conceptNames=['ของสะสมสำหรับแคมเปญ','ชุดแอคทีฟและกิจกรรมกีฬา','ชุดกระบอกน้ำและแก้วหูจับ','ชุดต้อนรับและอุปกรณ์ทำงาน','ของสะสมและบรรจุภัณฑ์เฉพาะ','ชุดสินค้าเพื่อจำหน่าย'];
const conceptBrands=['Coca-Cola','Nike','Toyota','Samsung','LEGO','adidas'];
const conceptUses=['เพิ่มความน่าสนใจให้กิจกรรมสะสมและของแถม','สร้างชุดสินค้าที่ตอบโจทย์ผู้ร่วมกิจกรรม','จัดกระบอกน้ำและแก้วหูจับเข้าคู่กันในกล่องของขวัญ','จัดอุปกรณ์ให้พร้อมใช้และสื่อภาพลักษณ์องค์กร','ต่อยอดรูปทรงและเอกลักษณ์เป็นของที่อยากเก็บ','ออกแบบคอลเลกชันให้สินค้าแต่ละชิ้นเข้ากัน'];
const conceptNote='<p class="source-note">ภาพแนวคิดจำลองด้วย AI เพื่อแสดงแนวทางออกแบบ ไม่ใช่ผลงานอ้างอิงลูกค้าหรือการรับรองจากแบรนด์ที่ปรากฏ</p>';
function concept(i){return `<a class="concept-card" href="${url('/custom-made')}?idea=${i}"><div class="concept-img concept-${i}" role="img" aria-label="แนวคิดจำลองชุดสินค้า ${conceptBrands[i]}"><span class="image-label">แนวคิดจำลอง</span></div><div class="card-copy"><span class="eyebrow">${conceptBrands[i]} · แนวคิดการออกแบบ</span><h3>${conceptNames[i]}</h3><p>${conceptUses[i]}</p><span class="text-link">ปรึกษาแนวทางสำหรับแบรนด์คุณ ↗</span></div></a>`;}
function card(p,{anchor}={}){return `<article class="product-card"${anchor ? ` id="${esc(anchor)}"` : ''}><a class="product-photo" href="${productUrl(p.id)}"><img src="${esc(p.image)}" alt="${esc(p.titleTh||p.name)}" loading="lazy" width="400" height="350"></a><div class="product-body"><span class="sku">รหัสอ้างอิง ${skuFor(p)}</span><h3><a href="${productUrl(p.id)}">${esc(p.titleTh||p.name)}</a></h3><div class="product-actions"><a href="${productUrl(p.id)}">รายละเอียด ↗</a><button class="add-product" data-add="${p.id}" ${quoteButtonQuantity(p)} aria-label="เพิ่ม ${esc(p.titleTh||p.name)} ในรายการขอราคา">＋ ขอราคา</button></div></div></article>`;}
function cards(ids){return ids.map(id=>featured.find(p=>p.id===id)).filter(Boolean).map(card).join('');}
function sectionHead(k,h,p,link='',label='ดูทั้งหมด'){return `<div class="section-head"><div><span class="eyebrow">${k}</span><h2>${h}</h2>${p?`<p>${p}</p>`:''}</div>${link?`<a class="text-link" href="${link}">${label} ↗</a>`:''}</div>`;}
const homeCategories = [
 ['drinkware','900010'],['bag','13339'],['folding-umbrella','9724'],['technology','13362'],['office','13328'],['lifestyle',null,'/assets/molded-concepts/cork-phone-stand.webp'],
 ['eco','13310'],['campaign',null,'/assets/industry-mockups/nestle-cup-v1.png'],['gift-set','13340'],
 ['packaging',null,'/assets/molded-concepts/mycelium-gift-insert.webp'],['seasonal','13276'],['custom',null,'/assets/molded-concepts/kodak-camera-pouch.webp']
];
function categories() {
 const cards = homeCategories.map(([slug,id,photo]) => {
  const c=cats.find(c=>c.slug===slug), p=productsById.get(id);
  const image=photo||p?.image;
  if(!c||!image)throw Error('Missing home category or photo '+slug);
  return `<a class="category-card" href="${url('/products')}?category=${slug}"><div><img src="${image}" alt="${esc(p?.titleTh||c.name)}" loading="lazy" width="240" height="180"></div><h3>${c.name}</h3><span>${(c.browseCount ?? c.count).toLocaleString('th-TH')} แบบ ↗</span></a>`;
 });
 const officePosition = homeCategories.findIndex(([slug]) => slug === 'office')+1;
 const bookTiles = [[notebookRoute,'สมุดโน้ต',paperNotebooks],[powerNotebookRoute,smartNotebookName,powerNotebooks]].filter(([, , list]) => list.length).map(([route, name, list]) =>
   `<a class="category-card" href="${url(route)}"><div><img src="${esc(list[0].image)}" alt="${esc(list[0].titleTh)}" loading="lazy" width="240" height="180"></div><h3>${name}</h3><span>${list.length} แบบ ↗</span></a>`);
 cards.splice(officePosition,0,...bookTiles);
 return '<div class="category-grid">'+cards.join('')+'</div>';
}
function articleCards(limit=articles.length){return `<div class="article-grid">${journalHomePicks(articles).slice(0,limit).map((a,i)=>`<a href="${url('/blog/'+a.slug)}"><span class="article-number">0${i+1}</span><div><span class="eyebrow">บทความและไอเดียจาก SmartGift</span><h3>${a.title}</h3><p>${a.lead}</p><span class="text-link">อ่านแนวทาง ↗</span></div></a>`).join('')}</div>`;}
function steps(){return `<div class="steps"><div><span>01</span><h3>บอกโจทย์และงบประมาณ</h3><p>กลุ่มผู้รับ จำนวน วันใช้งาน และแนวสินค้าที่สนใจ</p></div><div><span>02</span><h3>เลือกสินค้าและรับข้อเสนอ</h3><p>พิจารณาสินค้า งานโลโก้ แพ็กเกจ และใบเสนอราคา</p></div><div><span>03</span><h3>อนุมัติแบบแล้วผลิต</h3><p>ยืนยันรายละเอียดงานและกำหนดส่งก่อนเริ่มผลิต</p></div></div>`;}
function contactCta(){return `<section class="contact-band"><div class="container contact-inner"><div><span class="eyebrow">สร้างของขวัญที่มีความหมายร่วมกัน</span><h2>เริ่มต้นโครงการกับ SmartGift</h2><p>แจ้งงบ จำนวน และวันใช้งาน เพื่อรับแนวทางสินค้าที่เหมาะกับแบรนด์คุณ</p></div><a class="button orange" href="${url('/contact')}">ปรึกษาทีมออกแบบ <span>↗</span></a></div></section>`;}
function header(route){const nav=[['/premium-giftset','ชุดของขวัญองค์กร'],['/products','สินค้าพรีเมียม'],[editionRoute,editionName],['/custom-made','ผลิตเฉพาะแบรนด์'],['/portfolio','ผลงาน'],['/blog','บทความ'],['/download-catalog','แค็ตตาล็อก'],['/dealers','ตัวแทนจำหน่าย']];return `<a class="skip" href="#main">ข้ามไปเนื้อหา</a><div class="topline"><div class="container"><span>สินค้าส่งเสริมการขายและชุดของขวัญ · ผลิตเฉพาะแบรนด์</span><a href="https://line.me/R/ti/p/@smartgiftthailand" target="_blank" rel="noopener">LINE @smartgiftthailand ↗</a></div></div><header class="site-header"><div class="container nav-wrap"><a class="brand" href="${url('')}" aria-label="SmartGift Thailand หน้าแรก"><img src="/assets/logo.svg" alt="SmartGift Thailand" width="180" height="61"></a><nav id="main-navigation" aria-label="เมนูหลัก">${nav.map(([p,n])=>`<a ${route===p?'aria-current="page"':p==='/products'&&(route.startsWith('/products/')||route.startsWith('/products?'))?'aria-current="location"':''} href="${url(p)}">${n}</a>`).join('')}</nav><div class="header-actions"><a class="basket-link" href="${url('/quote-basket')}" aria-label="รายการขอใบเสนอราคา"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14l1 14H4L5 7Zm3 0V5a4 4 0 0 1 8 0v2"/></svg><span data-basket-count>0</span></a><a class="button orange header-quote" href="${url('/contact')}">ขอใบเสนอราคา</a><button id="menu-toggle" class="menu-toggle" aria-expanded="false" aria-controls="main-navigation" aria-label="เปิดเมนู"><span></span><span></span><span></span></button></div></div></header>`;}
function footer(){return `<footer><div class="container footer-grid"><div><a href="${url('')}"><img src="/assets/logo.svg" alt="SmartGift Thailand" width="180" height="61"></a><p>ออกแบบและผลิตสินค้าส่งเสริมการขาย<br>ชุดของขวัญองค์กร และสินค้าเฉพาะแบรนด์<br>ด้วยประสบการณ์ 15 ปี</p><a href="https://www.facebook.com/SmartGiftThailand/" target="_blank" rel="noopener">Facebook SmartGift Thailand ↗</a></div><div><h3>สินค้าและบริการ</h3><a href="${url('/premium-giftset')}">ชุดของขวัญองค์กร</a><a href="${url('/products')}">สินค้าพรีเมียม</a><a href="${url('/custom-made')}">ผลิตเฉพาะแบรนด์</a><a href="${url('/catalog')}">แค็ตตาล็อกสินค้า</a><a href="${url('/customize-gift-set')}">ออกแบบเซ็ตเอง</a></div><div><h3>รู้จัก SmartGift</h3><a href="${url('/about')}">เกี่ยวกับเรา</a><a href="${url('/dealers')}">ตัวแทนจำหน่าย</a><a href="${url('/portfolio')}">ตัวอย่างงานเฉพาะแบรนด์</a><a href="${url('/blog')}">บทความ</a><a href="${url('/contact')}">ติดต่อและขอใบเสนอราคา</a><a href="${url('/orders')}">ติดตามออเดอร์</a></div><div><h3>เริ่มต้นโครงการ</h3><a href="https://line.me/R/ti/p/@smartgiftthailand" target="_blank" rel="noopener">LINE @smartgiftthailand</a>${phoneLinks()}<a class="footer-brief-link" href="${url('/contact')}">แจ้งโจทย์และขอใบเสนอราคา ↗<small>งบประมาณ จำนวน และวันที่ต้องการใช้งาน</small></a><a href="/smartgift/enterprise">สินค้าสำหรับแคมเปญองค์กร</a><a href="/smartgift/logo-preview">ลองวางโลโก้บนสินค้า</a><a href="/smartgift/download-catalog">ดาวน์โหลดแค็ตตาล็อก</a><a href="/smartgift/own-brand">ผลิตสินค้าเพื่อขายในแบรนด์ตัวเอง</a><a href="${url('/privacy')}">ความเป็นส่วนตัว</a><a href="${url('/terms')}">ข้อมูลการขอราคา</a></div></div><div class="container footer-bottom"><span>© ${new Date().getFullYear()} SmartGift Thailand</span><span>สินค้าคัดสรรจาก GiftU · ภาพแนวคิดระบุแยกจากแค็ตตาล็อก</span></div></footer><div class="mobile-contact"><a href="https://line.me/R/ti/p/@smartgiftthailand" target="_blank" rel="noopener">คุยผ่าน LINE ↗</a><a href="${url('/contact')}">ขอใบเสนอราคา</a></div><div class="toast" id="toast" role="status" aria-live="polite"></div>`;}
function home(){return `<link rel="stylesheet" href="/homepage.css">
<section class="hero container" data-home-section="hero"><div class="hero-copy"><span class="eyebrow">สินค้าส่งเสริมการขาย · ผลิตเฉพาะแบรนด์</span><h1>ผลิตสินค้าพรีเมียม<br><em>สำหรับแคมเปญขององค์กร</em></h1><p>รับออกแบบและผลิตของแถม ของสะสม และชุดของขวัญ<br class="desktop-only">ให้เข้ากับแบรนด์ แคมเปญ และงบประมาณของคุณ</p><div class="hero-proof"><b>15 ปี</b><span>แห่งประสบการณ์<br>เชี่ยวชาญงานผลิตเฉพาะแบรนด์</span><a class="home-profile-link" href="${url('/about')}#company-profile">ดูโปรไฟล์บริษัท</a></div><div class="actions"><a class="button orange" href="#product-categories">เลือกดูหมวดสินค้า ↓</a><a class="button outline" href="${url('/premium-giftset')}">เลือกชุดของขวัญ เริ่ม 10 ชุด</a></div></div>${heroCarousel()}</section>
<section class="section category-section container home-categories" id="product-categories" data-home-section="categories">${sectionHead('เลือกสินค้าที่เหมาะกับแบรนด์คุณ','ครบทุกหมวด ของพรีเมียมที่ใช้ได้จริง','กระเป๋า แก้วน้ำ ร่ม เครื่องเขียน และอีกหลากหลายไอเดีย เลือกเป็นชิ้นหรือจัดเป็นชุดได้',url('/products'),'สินค้าทั้งหมด')}${categories()}</section>
${homeSearch(searchIndex.length)}
<section class="section soft home-giftsets" id="giftset-collection" data-home-section="giftsets"><div class="container">${sectionHead('Gift Set คือความเชี่ยวชาญของเรา','ชุดของขวัญ '+ownedSets.items.length.toLocaleString('th-TH')+' แบบ เริ่มเพียง 10 ชุด','เลือกชุดที่ตรงกับผู้รับ พร้อมปรับโลโก้ สี และแพ็กเกจให้เป็นแบรนด์ของคุณ',url('/premium-giftset'),'เลือกชุดของขวัญทั้งหมด')}<nav class="chips" aria-label="เลือกหมวดชุดของขวัญ">${[['office','สมุดและเครื่องเขียน'],['drinkware','แก้วและกระบอกน้ำ'],['umbrella','ร่มและอุปกรณ์กันแดด'],['wellness','สุขภาพและผ่อนคลาย'],['tea-coffee','ชาและกาแฟ'],['sports','กีฬาและกิจกรรมกลางแจ้ง']].map(([slug,name])=>`<a href="${url('/premium-giftset/'+slug)}">${name}</a>`).join('')}</nav><div class="products-grid">${homeGiftsetCards(ownedSets,ownedCard)}</div><div class="home-section-end"><p class="source-note">รุ่นจากคอลเลกชัน SmartGift พร้อมตัวอย่างการวางโลโก้ · ขั้นต่ำ 10 ชุดต่อแบบ รายละเอียดงานและกำหนดส่งยืนยันก่อนสั่ง</p><a class="text-link" href="${url('/customize-gift-set')}">ลองจัดชุดของขวัญเอง →</a></div></div></section>
<section class="section container home-featured" data-home-section="featured-products">${sectionHead('หลากหลายสินค้า ต่อยอดได้หลายแคมเปญ','สินค้าเด่นสำหรับแบรนด์ของคุณ','ตั้งแต่กระเป๋า ขวดน้ำ และร่ม ไปจนถึงอุปกรณ์ทำงานและของใช้ไลฟ์สไตล์',url('/products'),'ดูสินค้าทั้งหมด')}<div class="products-grid">${homeProductCards(fullCatalog,card)}</div><div class="home-section-end"><p class="source-note">ภาพแสดงตัวอย่างสินค้าและการวางโลโก้ ตรวจแบบและวิธีผลิตก่อนสั่ง</p><a class="text-link" href="${url('/logo-preview')}">อัปโหลดโลโก้ ลองวางบนสินค้า →</a></div></section>
<section class="section soft" data-home-section="campaign-solutions"><div class="container">${sectionHead('มีโจทย์แคมเปญอยู่แล้ว?','เปลี่ยนสินค้าที่เลือก ให้ตอบโจทย์ธุรกิจ','เลือกใช้เป็นของแถม ของแลกซื้อ สินค้าเพื่อจำหน่าย หรือพัฒนาแบบเฉพาะแบรนด์')}<div class="purpose-grid">${[
 ['ของแถมส่งเสริมการขาย','เลือกของที่น่าใช้ ให้เหมาะกับผู้รับและงบประมาณ','/enterprise','/assets/local-products/phone-wallet.jpg'],
 ['ของแลกซื้อและของสะสม','สร้างคอลเลกชันสำหรับสมาชิกและกิจกรรมของแบรนด์','/enterprise','/assets/local-products/fan-events/fan-acrylic-stage.webp'],
 ['สินค้าแบรนด์เพื่อจำหน่าย','พัฒนาสินค้าสำหรับขายหน้าร้านและช่องทางของคุณ','/own-brand','/assets/project-portfolio/home-one-bangkok-shopper.webp'],
 ['งานสั่งผลิตตามแบบ','สร้างรูปทรง คาแรกเตอร์ และแพ็กเกจเฉพาะแบรนด์','/custom-made','/assets/molded-concepts/adidas-sneaker-keyring.webp']
].map(([title,desc,path,image])=>`<a ${path==='/own-brand'?'id="brand-merchandise"':''} href="${url(path)}"><img src="${image}" alt="${path==='/own-brand'?'กระเป๋าช้อปปิ้งหูดำ พิมพ์โลโก้ One Bangkok':title}" width="320" height="250" loading="lazy"><div><h3>${title} <span>↗</span></h3><p>${desc}</p></div></a>`).join('')}</div></div></section>
${homeProjectPortfolio()}
${clientShowcase()}
<section class="section container" data-home-section="production-process"><div class="service-split"><div><span class="eyebrow">ใส่ใจทุกรายละเอียด</span><h2>จากสินค้าที่ชอบ<br>สู่ของที่เป็นแบรนด์คุณ</h2><p>เลือกวิธีทำโลโก้ให้เหมาะกับวัสดุ เชื่อมสินค้า กล่อง ถุง และการ์ดให้เป็นชุดเดียวกัน พร้อมสรุปรายละเอียดก่อนผลิต</p><a class="text-link" href="${url('/custom-made')}">ดูบริการผลิตเฉพาะแบรนด์ ↗</a></div><div class="finish-grid">${[['01','สกรีนโลโก้','วางตำแหน่งและสีให้เหมาะกับชิ้นงาน'],['02','ปั๊มนูน / เลเซอร์','เพิ่มรายละเอียดด้วยพื้นผิวและวัสดุ'],['03','พิมพ์สี','ถ่ายทอดลวดลายและกราฟิกของแบรนด์'],['04','ออกแบบแพ็กเกจ','จัดกล่อง ถุง และการ์ดให้เข้าชุด']].map(([n,t,d])=>`<div><span>${n}</span><h3>${t}</h3><p>${d}</p></div>`).join('')}</div></div>${steps()}</section>
<section class="section journal" data-home-section="articles"><div class="container">${sectionHead('บทความและไอเดียจาก SmartGift','เตรียมแคมเปญถัดไปให้พร้อม','แนวทางเลือกสินค้า วางงบ และเริ่มงานกับทีมออกแบบ',url('/blog'),'อ่านบทความทั้งหมด')}${articleCards(3)}</div></section>
${contactCta()}`;}

function pageHero(eyebrow,title,desc){return `<section class="page-hero"><div class="container"><div class="breadcrumbs"><a href="${url('')}">หน้าแรก</a><span>/</span>${esc(title)}</div><span class="eyebrow">${eyebrow}</span><h1>${title}</h1><p>${desc}</p></div></section>`;}
function catalogue(gift=false,selected=gift?'gift-set':'') {
 const book=notebookCategories.find(c=>c.key===selected);
 const cat=cats.find(c=>c.slug===selected);
 const books=book?booksByCategory.get(selected):null;
 const heading=book?.heading || (gift?'ชุดของขวัญองค์กร':(cat?.name || 'สินค้าพรีเมียม'));
 const description=book?.description || (gift?'เลือกชุดที่ชอบ แล้วให้เราช่วยปรับสินค้า โลโก้ และแพ็กเกจให้เหมาะกับแบรนด์คุณ':(cat?.seoDescription || 'ค้นหาไอเดียสินค้าส่งเสริมการขายที่เหมาะกับแบรนด์และแคมเปญของคุณ'));
 const ordinaryItems = selected==='office' ? officeItems : cat ? fullCatalog.filter(p=>p.categories.includes(selected)) : [];
 const initialCards=books ? books.map(notebookCard).join('') : cat ? ordinaryItems.slice(0,24).map(card).join('') : '<p>กำลังโหลดสินค้า…</p>';
 return `${pageHero(gift?'ชุดของขวัญที่คัดสรรอย่างลงตัว':'สินค้าพรีเมียมสำหรับทุกโครงการ',heading,description)}
 <section class="section container catalogue" data-catalog-view="catalogue" data-catalogue data-default-category="${esc(selected)}">${categoryMenu(selected)}
 <div class="catalog-main" data-catalog-pane><form class="catalog-search" role="search"><label class="sr-only" for="product-search">ค้นหาสินค้า</label><input id="product-search" name="q" type="search" placeholder="ค้นหาชื่อสินค้า รหัส หรือประเภท เช่น กระเป๋า" autocomplete="off"><button class="button teal" type="submit">ค้นหา</button></form>
 <p data-notebook-download${book ? '' : ' hidden'}><a class="text-link" type="application/pdf" download${book ? ` href="${esc(book.pdfUrl)}"` : ''}>ดาวน์โหลดแคตตาล็อก${book ? esc(book.heading) : ''} (PDF) ↓</a></p>
 <div class="catalog-toolbar"><p id="catalog-count" role="status">${books ? books.length+' รายการ' : 'กำลังเตรียมรายการสินค้า…'}</p><label>เรียงตาม <select id="catalog-sort"><option value="new">รายการใหม่</option><option value="name">ชื่อสินค้า A–Z</option></select></label></div>
 <div id="product-results" class="products-grid">${initialCards}</div><div id="pagination" class="pagination"></div>
 <p class="source-note">ทีม SmartGift จะยืนยันราคา จำนวนขั้นต่ำ และกำหนดส่งตามรุ่น จำนวนที่ต้องการ และงานโลโก้</p>
 <div class="inline-cta"><h3>เลือกสินค้าได้หลายรายการเพื่อขอราคาในครั้งเดียว</h3><a class="button outline" href="${url('/quote-basket')}">ดูรายการที่เลือก →</a></div>
 ${notebookTemplates}</div></section>`;
}
function portfolio(){return `${pageHero('ชุดของขวัญและสินค้าเฉพาะแบรนด์','ผลงานของเรา','ประสบการณ์ 15 ปีในการดูแลสินค้าส่งเสริมการขาย เลือกชุดของขวัญให้ตรงผู้รับ พร้อมปรับโลโก้และแพ็กเกจให้เป็นแบรนด์ของคุณ')}${clientShowcase({full:true,ownedSets})}${projectPortfolio()}${historicalPortfolio()}<section class="section soft"><div class="container">${sectionHead('ต่อยอดไอเดีย','แนวคิดสำหรับโครงการถัดไป','สำรวจการจับคู่สินค้า สี และแพ็กเกจในรูปแบบใหม่')}<div class="notice">ภาพในส่วนแนวคิดนี้จำลองด้วย AI เพื่อแสดงแนวทางออกแบบ ไม่ใช่ผลงานที่ผลิตให้แบรนด์ที่ปรากฏ</div><div class="concept-grid portfolio-grid">${[0,1,2,3,4,5].map(concept).join('')}</div></div></section>${contactCta()}`;}
function custom(){return `${pageHero('ผลิตสินค้าเฉพาะแบรนด์','ออกแบบและผลิตสินค้าเฉพาะแบรนด์','พัฒนาแนวคิดสินค้าให้สอดคล้องกับแคมเปญ กลุ่มผู้รับ และงบประมาณของคุณ')}<section class="section container"><div class="service-split"><div><span class="eyebrow">จากไอเดียสู่สินค้าจริง</span><h2>เริ่มจากโจทย์ของคุณ<br>แล้วออกแบบให้ครบทุกชิ้น</h2><p>ไม่ว่าจะเป็นของแถม ของสะสม สินค้าสำหรับจำหน่าย หรือชุดของขวัญ เราช่วยพิจารณารายการสินค้า วัสดุ งานโลโก้ และบรรจุภัณฑ์ให้เข้ากัน</p><div class="actions"><a class="button orange" href="${url('/contact')}">ส่งโจทย์ให้ทีมออกแบบ ↗</a><a class="button outline" href="/smartgift/custom-made/silicone-bags">ดูกระเป๋าซิลิโคนสั่งทำ 14 แบบ →</a><a class="text-link" href="/smartgift/custom-made/silicone-bags#new-materials">ดูวัสดุและไอเดียงานขึ้นรูป →</a><a class="button outline" href="/smartgift/custom-made/fan-events">สินค้าแฟนคลับ เทศกาล และคอนเสิร์ต →</a><a class="text-link" href="/smartgift/own-brand">ผลิตสินค้าเพื่อจำหน่ายในแบรนด์คุณ →</a></div></div><figure><img class="rounded full-img" src="/assets/hero-custom.png" alt="แนวคิดจำลองงานขึ้นรูป PVC ซิลิโคน USB ตุ๊กตา โลหะ เซรามิก และแพ็กเกจ" width="1536" height="1024">${conceptNote}</figure></div>${steps()}</section><section class="section soft"><div class="container">${sectionHead('ข้อมูลสำหรับเริ่มโครงการ','เตรียมข้อมูลเพียง 4 เรื่อง','เพื่อให้ทีมคัดสินค้าและประเมินแนวทางได้ตรงความต้องการ')}<div class="info-grid">${[['เป้าหมายและผู้รับ','ใช้เพื่อจำหน่าย เป็นของแถม หรือมอบในโอกาสใด'],['จำนวนและงบประมาณ','จำนวนสินค้าหรือชุดที่ต้องการ และงบประมาณต่อชิ้น'],['วันใช้งาน','วันเปิดตัวแคมเปญ วันจัดงาน หรือกำหนดส่ง'],['แบรนด์และแนวทาง','โลโก้ สี ภาพตัวอย่าง หรือสินค้าที่สนใจ']].map(([t,d])=>`<div><h3>${t}</h3><p>${d}</p></div>`).join('')}</div></div></section>${contactCta()}`;}
function contact(){return projectBriefPage();}
function basket(){return `${pageHero('สินค้าที่คุณเลือก','รายการขอใบเสนอราคา','รวบรวมสินค้าที่สนใจ ระบุจำนวน แล้วส่งโจทย์ให้ทีมประเมินราคา')}<section class="section container"><div id="basket-content"><p>กำลังโหลดรายการ…</p></div><div class="basket-next"><p>การเลือกรายการยังไม่ใช่การสั่งซื้อ ไม่มีการชำระเงินบนเว็บไซต์</p><div class="actions"><a class="button outline" href="${url('/products')}">เลือกสินค้าเพิ่ม</a><a class="button orange" href="${url('/contact')}">ระบุรายละเอียดเพื่อขอราคา →</a></div></div></section>`;}
function about(){return `${pageHero('รู้จัก SmartGift','ประสบการณ์ 15 ปี ในงานสินค้าเฉพาะแบรนด์','SmartGift Thailand ให้ความสำคัญกับสินค้าที่สื่อสารตัวตนของธุรกิจ และนำไปใช้งานได้ตรงกับเป้าหมาย')}${companyProfileSection()}<section class="section container prose"><h2>ความเชี่ยวชาญที่เริ่มจากการเข้าใจโจทย์</h2><p>เราทำธุรกิจสินค้าพรีเมียมและสินค้าส่งเสริมการขายมาแล้ว 15 ปี โดยมีจุดเด่นด้านการผลิตเฉพาะแบรนด์ และการจัดชุดของขวัญที่เชื่อมสินค้า งานโลโก้ และบรรจุภัณฑ์เข้าด้วยกัน</p><h2>ครบทั้งสินค้าและภาพลักษณ์ของแบรนด์</h2><p>เริ่มจากกลุ่มผู้รับ การใช้งาน งบประมาณ และวันใช้งาน แล้วคัดทางเลือกที่เหมาะกับโครงการ ทั้งของแถม ชุดของขวัญองค์กร สินค้าอีเวนต์ และสินค้าที่พัฒนาเพื่อจำหน่าย</p><h2>สื่อสารรายละเอียดก่อนเริ่มงาน</h2><p>สรุปสินค้า วัสดุ งานตกแต่ง จำนวน และกำหนดส่งในข้อเสนอ ยืนยันแบบและเงื่อนไขที่ตกลงก่อนเริ่มผลิต เพื่อให้ทุกฝ่ายใช้รายละเอียดชุดเดียวกัน</p><a class="button orange" href="${url('/contact')}">ปรึกษาโครงการของคุณ →</a></section>`;}
function legal(privacy){return `${pageHero('ข้อมูลการใช้บริการ',privacy?'ความเป็นส่วนตัว':'ข้อมูลการขอใบเสนอราคา','ข้อมูลสำหรับการใช้งานเว็บไซต์ SmartGift')}<section class="section container prose">${privacy?'<h2>ข้อมูลในเบราว์เซอร์ของคุณ</h2><p>เว็บไซต์นี้บันทึกรหัสสินค้าและจำนวนในรายการขอราคาไว้ใน localStorage ของเบราว์เซอร์ เพื่อให้กลับมาเลือกต่อได้ คุณลบรายการได้จากหน้ารายการขอราคา หรือผ่านการล้างข้อมูลเว็บไซต์ของเบราว์เซอร์</p><h2>แบบฟอร์มติดต่อ</h2><p>ข้อมูลที่กรอกใช้เตรียมข้อความบรีฟบนอุปกรณ์ของคุณ เว็บไซต์ยังไม่มีระบบรับข้อความแบบฟอร์มบนเซิร์ฟเวอร์ การติดต่อเกิดขึ้นเมื่อคุณนำข้อความไปส่งผ่าน LINE หรือโทรหาทีมด้วยตนเอง</p><h2>บริการภายนอก</h2><p>รูปสินค้าอ้างอิงบางรายการโหลดจาก GiftU และเว็บไซต์ใช้ฟอนต์จาก Google Fonts เมื่อเปิด LINE หรือ Facebook จะอยู่ภายใต้นโยบายของบริการนั้น ๆ</p>':'<h2>รายการสินค้าและภาพประกอบ</h2><p>รายการจาก GiftU ใช้เป็นข้อมูลอ้างอิงเพื่อเสนอแนวทางสินค้า ภาพที่มีแบรนด์ของบุคคลอื่นไม่ใช่หลักฐานว่าเป็นลูกค้า SmartGift ภาพแนวคิดที่สร้างด้วย AI ระบุไว้แยกต่างหาก</p><h2>ราคาและการผลิต</h2><p>ทีมจะยืนยันราคา จำนวนขั้นต่ำ วัสดุ งานตกแต่ง และกำหนดส่งตามโครงการ การเพิ่มสินค้าในรายการขอราคาหรือสร้างข้อความบรีฟยังไม่ใช่การสั่งซื้อหรือยืนยันการผลิต</p><h2>เริ่มต้นโครงการ</h2><p>แจ้งจำนวน วันใช้งาน และโลโก้หรือแนวทางที่ต้องการ จากนั้นพิจารณาข้อเสนอและอนุมัติรายละเอียดก่อนดำเนินการ</p>'}</section>`;}
function structuredData(route,title,description){
 const owned=ownedByRoute.get(route);if(owned)return '<script type="application/ld+json">'+JSON.stringify(ownedSchema(owned,origin)).replace(/</g,'\\u003c')+'</script>';
 const product=productsById.get(route.match(/^\/products\/(?:gu|sg)-(\d+)$/)?.[1]);if(product)return '<script type="application/ld+json">'+JSON.stringify(productSchema(product,origin,cats)).replace(/</g,'\\u003c')+'</script>';
 const a=articleByRoute.get(route);
 const data=a ? journalSchema(a,origin) : generalPageSchema(route,title,description);
 if (route===editionRoute) {
   const list=editionItems(picks2027).map(row=>row.item);
   const collection=data['@graph'].find(node=>node['@type']==='WebPage');
   collection['@type']='CollectionPage';
   collection.mainEntity={'@type':'ItemList',numberOfItems:list.length,itemListElement:list.map((p,i)=>({'@type':'ListItem',position:i+1,url:origin+p.url,name:p.title}))};
 }
 if (route===notebookRoute || route===powerNotebookRoute) {
   const list=route===powerNotebookRoute?powerNotebooks:paperNotebooks;
   const collection=data['@graph'].find(node=>node['@type']==='WebPage');
   collection['@type']='CollectionPage';
   collection.mainEntity={'@type':'ItemList',numberOfItems:list.length,itemListElement:list.map((p,i)=>({'@type':'ListItem',position:i+1,url:origin+productUrl(p.id),name:p.titleTh}))};
 }
 if (route==='/blog' || route.startsWith('/blog/category/')) {
   const group=journalGroups.find(g=>route==='/blog/category/'+g.id);
   const list=group ? articles.filter(article=>article.group===group.id) : articles;
   const page=data['@graph'].find(node=>node['@type']==='WebPage');
   page['@type']='CollectionPage';
   page.mainEntity={'@type':'ItemList',numberOfItems:list.length,itemListElement:list.map((article,index)=>({'@type':'ListItem',position:index+1,url:origin+url('/blog/'+article.slug),name:article.title}))};
 }
 return '<script type="application/ld+json">'+JSON.stringify(data).replace(/</g,'\\u003c')+'</script>';
}
function template(route,title,description,body){const product=productsById.get(route.match(/^\/products\/(?:gu|sg)-(\d+)$/)?.[1]);const ownedSocial=ownedByRoute.get(route);const articleCover=articleByRoute.get(route)?.cover;const bookCover = (route===notebookRoute?paperNotebooks:route===powerNotebookRoute?powerNotebooks:[])[0]?.image;
const socialImage=route===editionRoute?origin+picks2027[0].items[0].image:bookCover?origin+bookCover:route===eventsRoute?origin+'/assets/local-products/fan-events/concert-light-stick.webp':route===siliconeRoute?origin+cameraPouch:articleCover?origin+articleCover.image:ownedSocial?.image?origin+ownedSocial.image:product?(product.image.startsWith('/')?origin+product.image:product.image):origin+'/assets/brand-hero-v2.png';return `<!doctype html><html lang="th"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(title)} | SmartGift Thailand</title><meta name="description" content="${esc(description)}">${productionIndexing&&!(route.startsWith('/products/gu-')&&!product)?'':'<meta name="robots" content="noindex,follow">'}<link rel="describedby" type="text/plain" href="/llms.txt"><meta name="theme-color" content="#008c8d"><link rel="canonical" href="${origin}${url(route)}"><meta property="og:title" content="${esc(title)} | SmartGift Thailand"><meta property="og:description" content="${esc(description)}"><meta property="og:image" content="${esc(socialImage)}"><meta property="og:url" content="${origin}${url(route)}"><meta property="og:type" content="${articleCover?'article':product?'product':'website'}">${articleCover?'<meta property="og:image:alt" content="'+esc(articleCover.alt)+'">':''}<link rel="icon" href="/assets/logo.svg"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet"><link rel="stylesheet" href="/styles.css">${route==='/blog'||route.startsWith('/blog/')?'<link rel="stylesheet" href="/journal.css">':''}${route==='/blog/corporate-gift-sets-small-orders'?'<link rel="stylesheet" href="/small-order-article.css">':''}<script src="/app.js" defer></script><script src="/watermarks.js" defer></script><script src="/hero-carousel.js" defer></script><script src="/owned-giftsets.js" defer></script>${structuredData(route,title,description)}<link rel="stylesheet" href="/logo-preview.css"></head><body data-route="${route}">${header(route)}<main id="main">${body}</main>${footer()}<a class="floating-line" href="https://line.me/R/ti/p/@smartgiftthailand" target="_blank" rel="noopener" aria-label="คุยกับ SmartGift ผ่าน LINE @smartgiftthailand"><svg width="23" height="23" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 3C6.5 3 2 6.6 2 11c0 3.9 3.5 7.2 8.2 7.8l-.4 2.5c-.1.5.3.7.7.4C15.9 18.5 22 15.5 22 11c0-4.4-4.5-8-10-8Z"/><text x="5.3" y="13" fill="#06a846" font-size="6.3" font-family="Arial,sans-serif" font-weight="bold">LINE</text></svg><span>คุยทาง LINE<small>@smartgiftthailand</small></span></a></body></html>`;}
const orderEntry = `<section class="page-hero order-entry"><div class="container"><div class="breadcrumbs"><a href="/smartgift">หน้าแรก</a><span>/</span>ติดตามออเดอร์</div><h1>ติดตามสถานะคำสั่งซื้อ</h1><p>สอบถามความคืบหน้าของงานผลิตและการจัดส่งกับทีม SmartGift ได้ทาง LINE</p></div></section>
<section class="section container"><div class="order-entry-card"><h2>สอบถามสถานะออเดอร์</h2><p>กรอกเลขอ้างอิงเพื่อเตรียมข้อความ แล้วแจ้งชื่อบริษัทหรือผู้สั่งซื้อในแชตให้ทีมตรวจสอบ</p><label class="order-reference-label" for="order-reference">เลขที่คำสั่งซื้อหรือใบเสนอราคา</label><input id="order-reference" type="text" maxlength="80" autocomplete="off" placeholder="เลขอ้างอิงบนเอกสารของคุณ"><a class="button teal" data-order-chat href="https://line.me/R/ti/p/@smartgiftthailand" target="_blank" rel="noopener noreferrer">สอบถามสถานะทาง LINE ↗</a></div></section>`;
const pages=[['/orders','ติดตามสถานะคำสั่งซื้อ','สอบถามความคืบหน้างานผลิตและการจัดส่งกับทีม SmartGift ด้วยเลขที่คำสั่งซื้อหรือเลขที่ใบเสนอราคา',orderEntry],['','รับทำของพรีเมียมและชุดของขวัญองค์กร','รับออกแบบและผลิตสินค้าส่งเสริมการขาย ชุดของขวัญองค์กร และสินค้าเฉพาะแบรนด์ ด้วยประสบการณ์ 15 ปี',home()],['/products','สินค้าพรีเมียม','ค้นหาสินค้าพรีเมียมตามหมวด และเลือกสินค้าเพื่อขอใบเสนอราคา',catalogue()],['/premium-giftset','ชุดของขวัญองค์กร','เลือกชุดของขวัญและปรับสินค้า โลโก้ พร้อมแพ็กเกจตามแบรนด์',ownedCatalogue(ownedSets,'',categoryMenu('owned-giftsets'))],['/portfolio','ผลงานของเรา · ชุดของขวัญและสินค้าเฉพาะแบรนด์','ชมผลงานออกแบบชุดของขวัญองค์กร สินค้าพิมพ์โลโก้ และงานผลิตของ SmartGift พร้อมเลือกชุดจากคอลเลกชันขั้นต่ำ 10 ชุดต่อแบบ',portfolio()],['/custom-made','รับผลิตสินค้าเฉพาะแบรนด์และของพรีเมียมตามแบบ','ออกแบบสินค้าและแพ็กเกจให้เข้ากับแคมเปญ',custom()],['/contact','ปรึกษาโครงการและขอใบเสนอราคา','เตรียมบรีฟและติดต่อ SmartGift ผ่าน LINE @smartgiftthailand',contact()],['/quote-basket','รายการขอใบเสนอราคา','สินค้าที่เลือกสำหรับให้ทีมประเมินราคา',basket()],['/about','เกี่ยวกับ SmartGift','ประสบการณ์ 15 ปีด้านสินค้าพรีเมียมและของขวัญองค์กร',about()],['/privacy','ความเป็นส่วนตัว','ข้อมูลการใช้เว็บไซต์และการติดต่อ',legal(true)],['/terms','ข้อมูลการขอราคา','รายละเอียดเกี่ยวกับสินค้าอ้างอิงและการขอใบเสนอราคา',legal(false)]];
pages.push(...journalPageSpecs(articles));
pages.push([editionRoute,editionName,editionDescription,editionPage(picks2027,categoryMenu('edition-2027'))]);
for(const c of notebookCategories) pages.push([c.route,c.title,c.description,catalogue(false,c.key)]);

pages.push([eventsRoute,eventsTitle,eventsIntro,fanEventPage(productsById,card,categoryMenu('fan-events'))]);
pages.push([siliconeRoute,siliconeTitle,siliconeIntro,siliconePage(productsById,card,categoryMenu('silicone-bags'))]);
pages.push(['/catalog','แค็ตตาล็อกสินค้า','เลือกไอเดียสินค้าพรีเมียมจากทุกหมวด',catalogue()],['/customize-gift-set','จัดชุดของขวัญองค์กรด้วยตัวเอง','เลือกสินค้า จำนวน และแพ็กเกจเพื่อขอราคาชุดของขวัญเฉพาะแบรนด์',giftsetBuilder()],['/ideas','ไอเดียชุดของขวัญ','ไอเดียสำหรับชุดของขวัญองค์กร',catalogue(true)]);
for(const [slug,name,cat] of [['nature','ธรรมชาติ','eco'],['culture','วัฒนธรรม','seasonal'],['travel','ท่องเที่ยว','bag'],['health','สุขภาพ','lifestyle']])pages.push(['/ideas/'+slug,'ชุดของขวัญธีม'+name,'คัดสินค้าให้เข้ากับธีม'+name,pageHero('ไอเดียชุดของขวัญ','ชุดของขวัญธีม'+name,'เลือกสินค้าในธีมที่สนใจ แล้วให้ทีมช่วยจัดชุดและออกแบบแพ็กเกจ')+`<section class="section container"><div class="products-grid">${featured.filter(p=>p.categories.includes(cat)).slice(0,8).map(card).join('')}</div><div class="actions"><a class="button orange" href="${url('/products')}?category=${cat}">ดูสินค้าธีมนี้ทั้งหมด →</a></div></section>`+contactCta()]);
pages.push([snowRoute,snowTitle,snowWorkIntro(),pageHero('ผลงานของเรา · ของสะสมสั่งผลิต',snowTitle,snowWorkIntro())+snowPage()]);
function snowWorkIntro(){return 'ย้อนชมผลงานลูกแก้วหิมะสั่งทำสำหรับแคมเปญปลายปี 2558 ผ่านภาพสินค้าและวิดีโอของสยามพารากอน';}
pages.push(['/keyword-plan','แผนคำค้นและ SEO ของ SmartGift','สรุปคำค้นตามเจตนาซื้อและหน้าที่รับผิดชอบ',keywordPlan(cats,journalKeywordRows(articles))]);
pages.push(['/dealers',dealerTitle,dealerDescription,dealerPage()]);
pages.push(['/enterprise','สินค้าพรีเมียมสำหรับองค์กร ของแถมและแคมเปญแลกซื้อ','พัฒนากระเป๋า ขวดน้ำ ร่ม และสินค้าสำหรับธนาคาร โรงพยาบาล ห้างสรรพสินค้า',enterprisePage()]);
pages.push(['/logo-preview','ลองวางโลโก้บนสินค้า','อัปโหลดโลโก้ จัดตำแหน่ง และดาวน์โหลดภาพตัวอย่างสินค้าเพื่อขอราคา',logoPreviewPage()]);
// Homepage sections are composed explicitly in home() to preserve nested carousel boundaries.
pages.push(['/search','ค้นหาสินค้าทั้งหมด','ค้นหาสินค้าพรีเมียมและชุดของขวัญทุกหมวดด้วยชื่อสินค้า รหัสรุ่น หรือของในชุด',globalSearchPage(searchIndex.length)]);
const productCatalogues=JSON.parse(await fs.readFile(path.join(root,'data/product-catalogues.json'),'utf8'));
const notebookDownloads=notebookCategories.map(category => ({
  slug:category.key, name:category.heading, count:booksByCategory.get(category.key).length,
  url:category.pdfUrl, browse:url(category.route),
  bytes:productCatalogues.find(item=>item.url===category.pdfUrl)?.bytes
}));
pages.push(['/download-catalog','ดาวน์โหลดแคตตาล็อกสินค้าและชุดของขวัญ',downloadDescription,downloadCataloguePage(downloadFiles,productCatalogues,notebookDownloads)]);
pages.push(['/own-brand','พัฒนาสินค้าเพื่อจำหน่ายภายใต้แบรนด์ของคุณ','ปรึกษาการพัฒนาสินค้าเพื่อขายในแบรนด์ของตนเอง ตั้งแต่รูปแบบ วัสดุ โลโก้ และบรรจุภัณฑ์',ownBrandPage()]);
pages.push(['/image-style-preview','ตัวอย่างภาพสินค้าในสไตล์ SmartGift','ตัวอย่างฉากสินค้าและรายละเอียดภาษาไทย',renderStylePreview(['13340','13339','13362'].map(id=>productsById.get(id)))]);
for(const p of fullCatalog){const meta=metadataFor(p);pages.push([productUrl(p.id).replace('/smartgift',''),meta.title,meta.description,renderProduct(p,cats)]);}
for(const c of ownedSets.categories)pages.push(['/premium-giftset/'+c.slug,c.name+' ขั้นต่ำ 10 ชุดต่อแบบ',c.name+' สำหรับองค์กร เลือกจาก '+c.count+' แบบ พร้อมปรับโลโก้',ownedCatalogue(ownedSets,c.slug,categoryMenu('owned-giftsets'))]);
for(const p of ownedSets.items)pages.push([p.url.replace('/smartgift',''),p.name+' | ขั้นต่ำ 10 ชุด',p.description,ownedProduct(p,ownedSets)]);
for(const p of ownedSets.archived){const route=p.url.replace('/smartgift',''),dir=path.join(root,'smartgift',route);await fs.mkdir(dir,{recursive:true});await fs.writeFile(path.join(dir,'index.html'),template(route,'ชุดนี้ไม่อยู่ในแค็ตตาล็อกแล้ว','เลือกชุดของขวัญอื่นสำหรับโครงการของคุณ',pageHero('ปรับปรุงรายการสินค้า','ชุดนี้ไม่อยู่ในแค็ตตาล็อกแล้ว','เราได้คัดชุดที่มีพาวเวอร์แบงก์สเปกรุ่นเก่าออกจากแค็ตตาล็อก')+`<section class="section container"><a class="button teal" href="${url('/premium-giftset')}">เลือกชุดของขวัญอื่น →</a></section>`));}
for(const [route,title,description,body] of pages){const dir=path.join(root,'smartgift',route);await fs.mkdir(dir,{recursive:true});await fs.writeFile(path.join(dir,'index.html'),template(route,title,description,body));}
for(const [route,legacyPath] of preservedPagePaths){
 if(!route)continue;
 const page=pages.find(p=>p[0]===route);if(!page)throw new Error('Missing preserved page '+route);
 const dir=path.join(root,legacyPath);await fs.mkdir(dir,{recursive:true});await fs.writeFile(path.join(dir,'index.html'),template(...page));
}
for(const p of unavailableProducts){
 const route='/products/gu-'+p.id;const dir=path.join(root,'smartgift',route);await fs.mkdir(dir,{recursive:true});
 if(p.removalKind==='similar-edition'){
  const other=productsById.get(p.relatedId);
  const more=other?'<a class="button teal" href="'+productUrl(other.id)+'">ดูรุ่น '+esc(other.titleTh||other.name)+' →</a>':'<a class="button teal" href="'+url('/products')+'">ดูสินค้าในแค็ตตาล็อก →</a>';
  await fs.writeFile(path.join(dir,'index.html'),template(route,'GU-'+p.id+' · รุ่นที่คัดออกจากแค็ตตาล็อก','รุ่น GU-'+p.id+' ไม่อยู่ในรายการที่แสดงปัจจุบัน เลือกดูรูปแบบใกล้เคียงและตรวจรายละเอียดก่อนขอราคา',pageHero('แค็ตตาล็อกสินค้า','เลือกรุ่นอื่นในกลุ่มนี้','เราได้คัดรุ่นที่มีรูปทรงใกล้เคียงกันไว้ให้เลือก ตรวจสเปกของรุ่นที่สนใจก่อนขอราคา')+'<section class="section container">'+more+'</section>'));
  continue;
 }
 const replacement=productsById.get(p.canonicalId);
 if(p.removalKind==='duplicate'&&replacement){
  const target=productUrl(replacement.id);
  let html=template(route,'ดูสินค้ารายการหลัก','เราได้รวมรายการสินค้าซ้ำเพื่อให้เลือกสินค้าได้ง่ายขึ้น',pageHero('รายการสินค้า','รวมสินค้านี้ไว้ในรายการหลักแล้ว','รายละเอียดและการขอราคาของสินค้านี้อยู่ในหน้าเดียวกัน')+'<section class="section container"><a class="button teal" href="'+target+'">ดูสินค้ารายการหลัก →</a></section>');
  html=html.replace('href="'+origin+url(route)+'"','href="'+origin+target+'"').replace('</head>','<meta http-equiv="refresh" content="0;url='+target+'"></head>');
  await fs.writeFile(path.join(dir,'index.html'),html);continue;
 }
 await fs.writeFile(path.join(dir,'index.html'),template(route,'สินค้านี้ไม่อยู่ในแค็ตตาล็อกแล้ว','เลือกสินค้ารุ่นอื่นสำหรับโครงการของคุณ',pageHero('ปรับปรุงรายการสินค้า','สินค้านี้ไม่อยู่ในแค็ตตาล็อกแล้ว',(p.removalKind==='supplier-photo'||p.removalKind==='duplicate'&&!replacement)?'ทีมกำลังปรับปรุงภาพอ้างอิงของรุ่นนี้ เลือกชมแบบอื่นหรือส่งโจทย์ให้ทีมช่วยหาสินค้าที่เหมาะกับโครงการของคุณ':p.removalKind==='assortment'?'ขณะนี้ SmartGift คัดแบบอื่นไว้สำหรับงานสั่งผลิตขององค์กร เลือกชมรุ่นที่เปิดรับงานได้จากแค็ตตาล็อก':p.removalKind==='legacy-catalog'?'เราได้ปรับรายการสินค้า โดยคัดรุ่นและรูปแบบเก่าออก เพื่อให้เลือกสินค้าที่เหมาะกับแคมเปญปัจจุบันได้ง่ายขึ้น':p.removalKind==='legacy-powerbank'?'เราได้ปรับรายการพาวเวอร์แบงก์ โดยคัดสเปกรุ่นเก่าออก เพื่อให้เลือกสินค้าที่เหมาะกับการใช้งานปัจจุบันได้ง่ายขึ้น':'รายการนี้ถูกนำออกเนื่องจากข้อมูลต้นทางระบุว่าไม่มีสินค้าหรือยุติการผลิต')+'<section class="section container"><a class="button teal" href="'+url('/products')+'">เลือกสินค้าอื่น →</a></section>'));
}
await fs.mkdir(path.join(root,'category-variants'),{recursive:true});
for(const c of cats) await fs.writeFile(path.join(root,'category-variants',c.slug+'.html'),template('/products?category='+c.slug,c.seoTitle,c.seoDescription,catalogue(false,c.slug)));
await fs.copyFile(path.join(root,'smartgift','index.html'),path.join(root,'index.html'));
await fs.writeFile(path.join(root,'404.html'),template('/404','ไม่พบหน้าที่ต้องการ','กลับไปเลือกสินค้า SmartGift',pageHero('ไม่พบหน้าที่ต้องการ','ไม่พบหน้าที่ต้องการ','กลับไปเลือกสินค้า หรือปรึกษาทีมเพื่อค้นหารายการที่คุณสนใจ')+`<section class="section container"><a class="button orange" href="${url('/products')}">ดูสินค้าทั้งหมด →</a></section>`));
if(process.env.SMARTGIFT_SKIP_LLMS!=='1'){
 await fs.writeFile(path.join(root,'llms.txt'),llmsText(cats,{productionIndexing}));
 await fs.writeFile('llms.txt',llmsText(cats,{productionIndexing}));
}
await fs.writeFile(path.join(root,'robots.txt'),productionIndexing?`User-agent: *\nAllow: /\nSitemap: ${publicOrigin}/sitemap.xml\n`:'User-agent: *\nDisallow: /\n');
await fs.writeFile(path.join(root,'sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+pages.filter(([r])=>!excludedSitemapRoutes.has(r)).map(([r])=>'<url><loc>'+origin+url(r)+'</loc></url>').join('')+cats.map(c=>'<url><loc>'+origin+url('/products')+'?category='+c.slug+'</loc></url>').join('')+'</urlset>');
await fs.copyFile('src/styles.css',path.join(root,'styles.css'));
await fs.copyFile('src/small-order-article.css',path.join(root,'small-order-article.css'));
for(const file of ['journal.css','journal-filter.js'])await fs.copyFile('src/'+file,path.join(root,file));
await fs.writeFile(path.join(root,'downloads/smartgift-article-keywords.csv'),journalKeywordsCsv(articles));
await fs.copyFile('src/giftset-article-quote.js',path.join(root,'giftset-article-quote.js'));
await fs.copyFile('src/app.js',path.join(root,'app.js'));
for(const name of ['catalog-menu.js','premium-gifts-2027.js'])await fs.copyFile('src/'+name,path.join(root,name));
await fs.copyFile('src/catalogue-pdf-search.js',path.join(root,'catalogue-pdf-search.js'));
await fs.copyFile('src/search-core.js',path.join(root,'search-core.js'));
await fs.copyFile('src/global-search.js',path.join(root,'global-search.js'));
await fs.copyFile('src/own-brand.js',path.join(root,'own-brand.js'));
await fs.copyFile('src/owned-giftsets.js',path.join(root,'owned-giftsets.js'));
await fs.copyFile('src/owned-catalogue-view.mjs',path.join(root,'owned-catalogue-view.js'));
console.log(`Built ${pages.length+2} HTML pages. Preserved ${cats.length} category slugs. Indexing ${productionIndexing?'enabled':'disabled'}.`);

await fs.copyFile("src/watermarks.js",path.join(root,"watermarks.js"));

await fs.copyFile("src/hero-carousel.js",path.join(root,"hero-carousel.js"));

for(const name of ['logo-preview.js','logo-layout.js','logo-preview.css'])await fs.copyFile('src/'+name,path.join(root,name));

for(const name of ['portfolio-gallery.css','portfolio-gallery.js','homepage.css'])await fs.copyFile('src/'+name,path.join(root,name));
