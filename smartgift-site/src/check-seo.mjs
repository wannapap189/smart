import fs from 'node:fs/promises';
import path from 'node:path';
import {publicOrigin,preservedPagePaths,excludedSitemapRoutes} from './seo-config.mjs';
const root=path.resolve('dist'),out=path.resolve('../outputs/seo');
await fs.mkdir(out,{recursive:true});
const errors=[],warnings=[],titles=new Map(),descriptions=new Map();
const walk=async d=>(await Promise.all((await fs.readdir(d,{withFileTypes:true})).map(e=>e.isDirectory()?walk(path.join(d,e.name)):path.join(d,e.name)))).flat();
const files=(await walk(root)).filter(f=>f.endsWith('.html'));
let imageCount=0,structuredCount=0;
for(const f of files){
 const h=await fs.readFile(f,'utf8'),rel=path.relative(root,f);
 const title=h.match(/<title>(.*?)<\/title>/s)?.[1];
 const description=h.match(/<meta name="description" content="([^"]*)"/)?.[1];
 const canonical=h.match(/<link rel="canonical" href="([^"]*)"/)?.[1];
 if(!title)errors.push({file:rel,issue:'missing-title'});
 if(!description)errors.push({file:rel,issue:'missing-description'});
 if(!canonical?.startsWith(publicOrigin+'/'))errors.push({file:rel,issue:'incorrect-canonical-origin'});
 if((h.match(/<h1[ >]/g)||[]).length!==1)errors.push({file:rel,issue:'h1-count'});
 if(!h.includes('<html lang="th">'))errors.push({file:rel,issue:'language'});
 if(!h.includes('content="noindex,follow"'))errors.push({file:rel,issue:'preview-must-remain-noindex'});
 for(const img of h.matchAll(/<img\b[^>]*>/g)){imageCount++;if(!/\balt="[^"]*"/.test(img[0]))errors.push({file:rel,issue:'image-alt-missing'});}
 for(const j of h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)){try{JSON.parse(j[1]);structuredCount++;}catch{errors.push({file:rel,issue:'invalid-json-ld'});}}
 const retired=/สินค้านี้ไม่อยู่ในแค็ตตาล็อกแล้ว|ชุดนี้ไม่อยู่ในแค็ตตาล็อกแล้ว|ดูสินค้ารายการหลัก/.test(title||'');
 if(!retired){for(const [map,value] of [[titles,title],[descriptions,description]]){if(!value)continue;const group=map.get(value)||new Set();group.add(canonical);map.set(value,group);}}
}
for(const [value,urls] of titles)if(urls.size>1)warnings.push({issue:'shared-title',value,urls:[...urls]});
for(const [value,urls] of descriptions)if(urls.size>1)warnings.push({issue:'shared-description',value,urls:[...urls]});
const sitemap=await fs.readFile(path.join(root,'sitemap.xml'),'utf8');
const sitemapUrls=[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);
if(new Set(sitemapUrls).size!==sitemapUrls.length)errors.push({issue:'duplicate-sitemap-url'});
for(const u of sitemapUrls)if(!u.startsWith(publicOrigin+'/'))errors.push({issue:'sitemap-origin',url:u});
for(const r of excludedSitemapRoutes)if(sitemapUrls.includes(publicOrigin+'/smartgift'+r))errors.push({issue:'utility-in-sitemap',route:r});
for(const [route,legacyPath] of preservedPagePaths){const f=path.join(root,legacyPath,'index.html');try{const h=await fs.readFile(f,'utf8');if(!h.includes('rel="canonical" href="'+publicOrigin+legacyPath+'"'))errors.push({issue:'legacy-canonical',route});}catch{errors.push({issue:'legacy-page-missing',route});}}
if(!(await fs.readFile(path.join(root,'robots.txt'),'utf8')).includes('Disallow: /'))errors.push({issue:'preview-robots'});
const report={checkedAt:new Date().toISOString(),status:errors.length?'failed':'passed',scope:'Local technical checks only, not Google indexing or ranking verification',htmlPages:files.length,sitemapUrls:sitemapUrls.length,imagesWithAltChecked:imageCount,structuredDataBlocks:structuredCount,preservedLegacyPages:preservedPagePaths.size,errors,warnings,remaining:['Recover and match all legacy product/category URLs; current archive inventory is partial.','Review Search Console page/query exports and backlinks to prioritize valuable URLs.','Before authorized launch, verify production robots/indexability, redirects, canonical host, mobile performance and Google structured data eligibility.','Product copy, source watermarks and supplier availability still require full catalog review.']};
await fs.writeFile(path.join(out,'technical-seo-audit.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify({...report,warnings:warnings.length,remaining:report.remaining.length}));
if(errors.length)process.exitCode=1;
