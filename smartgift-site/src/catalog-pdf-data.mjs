import fs from 'node:fs/promises';
import {createPdfSearchIndex} from './global-search.mjs';
import {overrides,skuFor} from './product-content.mjs';
import {loadOwnedSets} from './owned-giftsets.mjs';
import {syncLocalProducts} from './local-products.mjs';
import {prepareCatalog} from './catalog-availability.mjs';
import {notebookModelIds, powerNotebookIds} from './notebook-models.mjs';
import {existingNotebookIds} from './notebook-selection.mjs';
import {notebookCategories} from './notebook-page.mjs';
await syncLocalProducts('dist');
await prepareCatalog('dist');
const categories=JSON.parse(await fs.readFile('dist/data/categories.json','utf8'));
const owned=await loadOwnedSets();
const data=JSON.parse(await fs.readFile('dist/data/catalog.json','utf8'));
const notebookIds=new Set([...notebookModelIds,...existingNotebookIds]);
const powerIds=new Set(powerNotebookIds);
const catalog=data.items.map(raw=>({...raw,...overrides[raw.id]}));
const products=catalog.map(p=>{
 const details=p.groups?.flatMap(g=>g.bullets.map(text=>({label:g.heading,text}))) || (p.descriptionTh||'').split(/\r?\n/).map(text=>({label:'',text}));
 if (p.saleUnit === 'เล่ม' && p.factoryCode && p.quoteQuantity && p.catalogStatusTh) {
   details.push({label:'จำนวนสำหรับขอใบเสนอราคา',text:p.catalogStatusTh});
 }
 const primary=p.categories.includes('folding-umbrella')?'folding-umbrella':p.categories[0];
 const category=notebookIds.has(p.id)?(powerIds.has(p.id)?'power-bank-notebooks':'notebooks'):primary;
 return {sku:skuFor(p),title:p.titleTh||p.name,image:p.image,category,details};
});
const sets=owned.items.map(p=>({sku:p.sku,title:p.name,image:p.image,category:p.category,contents:p.contents,details:p.details}));
const notebookBooks=notebookCategories.map(({key,heading})=>({slug:key,name:heading}));
await fs.writeFile('../tmp/catalog-pdf-edit.json',JSON.stringify({products,sets,categories:categories.map(({name,slug})=>({name,slug})),setCategories:owned.categories,notebookBooks}));


await fs.writeFile('dist/data/product-pdf-index.json',JSON.stringify(createPdfSearchIndex(owned.items,catalog)));
