import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {duplicateProducts,mergeDuplicateProducts} from './catalog-duplicates.mjs';
import {searchProducts} from './search-core.js';
const catalog=JSON.parse(await fs.readFile('dist/data/catalog.json','utf8'));
const index=JSON.parse(await fs.readFile('dist/data/search-index.json','utf8'));
const archive=JSON.parse(await fs.readFile('../catalog-import/unavailable-products.json','utf8'));
const sitemap=await fs.readFile('dist/sitemap.xml','utf8');
const heldForPhoto=new Set(archive.filter(p=>p.removalKind==='supplier-photo').map(p=>p.id));
for(const {id,canonicalId} of duplicateProducts){
 assert(!catalog.items.some(p=>p.id===id));
 assert(archive.some(p=>p.id===id&&p.canonicalId===canonicalId&&p.removalKind==='duplicate'));
 assert(!sitemap.includes('/gu-'+id+'</loc>'));
 const html=await fs.readFile('dist/smartgift/products/gu-'+id+'/index.html','utf8');
 if(heldForPhoto.has(canonicalId)){
   assert(!catalog.items.some(p=>p.id===canonicalId));
   assert(!index.some(p=>p.sku==='GU-'+canonicalId));
   assert(!html.includes('http-equiv="refresh"'));
 }else{
   assert(catalog.items.some(p=>p.id===canonicalId));
   assert.equal(searchProducts(index,'GU-'+id)[0]?.sku,'GU-'+canonicalId);
   assert.equal(searchProducts(index,'gu'+id)[0]?.sku,'GU-'+canonicalId);
   assert(html.includes('content="0;url=/smartgift/products/gu-'+canonicalId+'"'));
 }
 assert(!html.includes('"@type":"Product"'));
 assert(!html.includes('ต้นทางระบุว่าไม่มีสินค้า'));
}
// A shared name/image does not establish equivalence: capacities, size and design matter.
for(const id of ['11978','11976','3182','3181','3638','3637','11889','11886','448','447']){
 assert(catalog.items.some(p=>p.id===id)||heldForPhoto.has(id),'Distinct variant must remain independently tracked: '+id);
}
const before=JSON.stringify({catalog,archive});mergeDuplicateProducts(catalog,archive);
assert.equal(JSON.stringify({catalog,archive}),before,'Repeated build must be idempotent');
console.log(JSON.stringify({removedDuplicates:duplicateProducts.length,activeProducts:catalog.items.length,aliasSearch:'passed',originalUrls:'passed',distinctVariants:'preserved'}));
