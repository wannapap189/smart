import fs from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve('dist');
const walk=async dir=>(await Promise.all((await fs.readdir(dir,{withFileTypes:true})).map(e=>e.isDirectory()?walk(path.join(dir,e.name)):path.join(dir,e.name)))).flat();
const files=await walk(root),errors=[],fileSet=new Set(files);
const catalog=JSON.parse(await fs.readFile(path.join(root,'data/catalog.json'),'utf8')).items;
const categories=JSON.parse(await fs.readFile(path.join(root,'data/categories.json'),'utf8'));
const owned=JSON.parse(await fs.readFile(path.join(root,'data/owned-giftsets.json'),'utf8'));
const ids=new Set(catalog.map(p=>p.id)),slugs=new Set(categories.map(c=>c.slug));
let links=0,schemas=0,articles=0,products=0;const titles=new Set(),canonicals=new Set();
for(const file of files.filter(f=>f.endsWith('.html'))){const html=await fs.readFile(file,'utf8');
 if((html.match(/<h1[ >]/g)||[]).length!==1)errors.push('Heading: '+file);
 for(const m of html.matchAll(/(?:href|src)="(\/[^"#]*)"/g)){links++;const u=new URL(m[1].replaceAll('&amp;','&'),'https://example.test');const target=path.join(root,decodeURIComponent(u.pathname));if(!fileSet.has(target)&&!fileSet.has(path.join(target,'index.html')))errors.push('Missing '+u.pathname+' in '+file);if(u.searchParams.has('item')&&!ids.has(u.searchParams.get('item')))errors.push('Unknown product '+u.href);if(u.searchParams.has('category')&&!slugs.has(u.searchParams.get('category')))errors.push('Unknown category '+u.href);}
 for(const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)){schemas++;try{const d=JSON.parse(m[1]);if(d['@graph'].some(n=>n['@type']==='BlogPosting'))articles++;const product=d['@graph'].find(n=>n['@type']==='Product');if(product){products++;if(!product.name||!product.sku||!product.description)errors.push('Incomplete Product '+file);if(product.offers||product.aggregateRating)errors.push('Unverified offers/reviews '+file);const title=html.match(/<title>(.*?)<\/title>/s)?.[1],canonical=html.match(/rel="canonical" href="([^"]+)"/)?.[1];if(titles.has(title)||canonicals.has(canonical))errors.push('Duplicate product metadata '+file);titles.add(title);canonicals.add(canonical)}}catch{errors.push('Invalid structured data '+file)}}
}
for(const c of categories){const count=catalog.filter(p=>p.categories.includes(c.slug)).length;if(count!==c.count)errors.push('Count mismatch '+c.slug);}
if(ids.size!==catalog.length)errors.push('Duplicate product IDs');
const blogRoot=path.join(root,'smartgift','blog');
const articlePages=files.filter(file=>file.startsWith(blogRoot+path.sep)&&!file.startsWith(path.join(blogRoot,'category')+path.sep)&&path.basename(file)==='index.html'&&path.dirname(file)!==blogRoot);
if(articles!==articlePages.length||!articlePages.length)errors.push('Expected one BlogPosting schema per article page');
if(products!==catalog.length+owned.items.length)errors.push('Product page coverage mismatch');
if(new Set(owned.items.map(p=>p.sku)).size!==owned.items.length)errors.push('Duplicate owned gift set');
if(owned.categories.reduce((n,c)=>n+c.count,0)!==owned.items.length)errors.push('Owned category count mismatch');
for(const p of owned.items){if(p.minimumOrder!==10||!p.details.length||!p.sourceRows.length)errors.push('Incomplete owned gift set '+p.sku)}
for(const file of files.filter(f=>f.endsWith('.html'))){if(!(await fs.readFile(file,'utf8')).includes('class="floating-line"'))errors.push('Missing LINE shortcut '+file);}
if(errors.length){console.error(errors.join('\n'));process.exit(1)}
console.log(JSON.stringify({htmlPages:files.filter(f=>f.endsWith('.html')).length,checkedLinks:links,products:ids.size,productPages:products,categories:slugs.size,articleSchemas:articles,allSchemas:schemas,status:'passed'}));
