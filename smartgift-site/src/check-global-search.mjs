import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {searchProducts,paginate} from './search-core.js';
import {brandBrief} from './own-brand.js';
const index=JSON.parse(await fs.readFile('dist/data/search-index.json','utf8'));
const premium=JSON.parse(await fs.readFile('dist/data/catalog.json','utf8')).items;
const owned=JSON.parse(await fs.readFile('dist/data/owned-giftsets.json','utf8')).items;
const removed=JSON.parse(await fs.readFile('../catalog-import/unavailable-products.json','utf8'));
assert.equal(index.length,premium.length+owned.length);
assert.equal(new Set(index.map(p=>p.url)).size,index.length);
for(const sku of ['TYD0038','GU-13339'])assert.equal(searchProducts(index,sku)[0]?.sku,sku);
assert.equal(searchProducts(index,'gu13339')[0]?.sku,'GU-13339');
const mixed=searchProducts(index,'กระเป๋า');assert(mixed.some(p=>p.kind==='sets'));assert(mixed.some(p=>p.kind==='premium'));
assert(searchProducts(index,'กระเป๋า','sets').every(p=>p.kind==='sets'));
assert.equal(searchProducts(index,'no-such-product-xyz-54321').length,0);
for(const p of removed)assert(!index.some(x=>x.sku==='GU-'+p.id));
const retiredSets=JSON.parse(await fs.readFile('../catalog-import/retired-owned-giftsets.json','utf8'));
for(const p of retiredSets)assert(!index.some(x=>x.sku===p.sku));
for(const id of ['13362','11351','13314'])assert(premium.some(p=>String(p.id)===id),'Modern model must remain: '+id);
const reviewed=JSON.parse(await fs.readFile(new URL('./reviewed-supplier-images.json',import.meta.url),'utf8'));
for(const p of premium.filter(p=>Number(p.id)<900000)){
  assert.equal(p.image,reviewed[p.id]?.image);
  assert([p.image,...(p.gallery||[]),p.originalImage,p.mockupImage].filter(Boolean).every(src=>src.startsWith('/assets/')));
}
for(const id of ['166','832','9357','9397','9412']){
  assert(!premium.some(p=>p.id===id));
  assert(removed.some(p=>p.id===id&&p.removalKind==='supplier-photo'));
}
const words=searchProducts(index,'สมุด ปากกา');assert(words.length>0);assert(words.every(p=>p.searchText.includes('สมุด')&&p.searchText.includes('ปากกา')));
assert.equal(paginate(mixed,-2).page,1);assert.equal(paginate([],999).page,1);assert.equal(paginate(mixed,999999).page,Math.ceil(mixed.length/24));
const data=new Map(Object.entries({name:'ทดสอบ',brand:'แบรนด์ทดสอบ',contact:'LINE test',product:'Art Toy',development:'ขึ้นรูปใหม่',quantity:'500',budget:'100000',launch:'เดือนหน้า',market:'ผู้สะสม ขายออนไลน์',idea:'มาสคอตต้นฉบับ',reference:'https://example.com'}));
const brief=brandBrief(data);for(const v of data.values())assert(brief.includes(v));assert(brief.includes('เพื่อจำหน่ายภายใต้แบรนด์ของตนเอง'));
const files=JSON.parse(await fs.readFile('dist/data/downloads.json','utf8'));
const [bundle, ...sections] = files;
assert.equal(sections.length,14);
assert.equal(bundle.count, sections.reduce((sum, file) => sum + file.count, 0));
assert.equal(bundle.pages, sections.reduce((sum, file) => sum + file.pages, 0));
const fullPdf = {url:bundle.pdfUrl, bytes:bundle.pdfBytes};
for (const file of [...files, fullPdf]) {
  const handle = await fs.open('dist' + file.url);
  try {
    assert.equal((await handle.stat()).size, file.bytes);
    const magic = file === bundle ? Buffer.from([0x50,0x4b,0x03,0x04]) : Buffer.from('%PDF-');
    const header = Buffer.alloc(magic.length);
    await handle.read(header, 0, header.length, 0);
    assert.deepEqual(header, magic);
  } finally {
    await handle.close();
  }
}
console.log(JSON.stringify({searchItems:index.length,premium:premium.length,giftSets:owned.length,mixedSearchResults:mixed.length,downloadFiles:files.length,status:'passed'}));
