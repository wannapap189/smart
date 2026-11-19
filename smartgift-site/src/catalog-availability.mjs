import {shirtProducts,similarEditions,foldingUmbrellas,umbrellaNames,displayCategoryNames} from './catalog-curation.mjs';
import fs from 'node:fs/promises';
import path from 'node:path';
import {mergeDuplicateProducts} from './catalog-duplicates.mjs';

// Match explicit product status, never infer availability from listing age.
const unavailable = /sold\s*out|out[\s-]*of[\s-]*stock|discontinued|สินค้าหมด|หมดแล้ว|หมดสต[็๊]อก|ยกเลิกการผลิต|เลิกผลิต|ยุติการผลิต|停[产產]|售罄|售完|缺[货貨]/i;
export async function prepareCatalog(root) {
  const dataPath=path.join(root,'data/catalog.json');
  const data=JSON.parse(await fs.readFile(dataPath,'utf8'));
  const photos=JSON.parse(await fs.readFile(new URL('./reviewed-supplier-images.json',import.meta.url),'utf8'));
  const approvedPaths=new Set(Object.values(photos).flatMap(p=>[p.image,...(p.gallery||[]),p.originalImage,p.mockupImage].filter(Boolean)));
  for(const file of approvedPaths){
    if(!file.startsWith('/assets/')||file.includes('..'))throw new Error('Invalid reviewed image '+file);
    await fs.access(path.join(root,file));
  }
  const featuredPath=path.join(root,'data/featured.json');
  const featuredIds=new Set(JSON.parse(await fs.readFile(featuredPath,'utf8')).map(p=>p.id));
  const archivePath=path.resolve('../catalog-import/unavailable-products.json');
  let archive=[];
  try{archive=JSON.parse(await fs.readFile(archivePath,'utf8'));}catch(e){if(e.code!=='ENOENT')throw e;}
  const activeIds=new Set(data.items.map(p=>p.id));
  archive=archive.filter(p=>{
    if(p.removalKind!=='supplier-photo'||!photos[p.id])return true;
    if(p.wasFeatured)featuredIds.add(p.id);
    if(!activeIds.has(p.id)){
      const {removalKind,removalReason,removedAt,wasFeatured,...original}=p;
      data.items.push(original);
      activeIds.add(p.id);
    }
    return false;
  });
  mergeDuplicateProducts(data,archive);
  const blocked=new Set(archive.map(p=>p.id));
  for(const p of data.items){
    if(similarEditions.has(p.id)&&!blocked.has(p.id)){
      archive.push({...p,removalKind:'similar-edition',relatedId:similarEditions.get(p.id),wasFeatured:featuredIds.has(p.id),removalReason:'คัดแบบที่มีภาพหรือรูปทรงใกล้กันออกจากรายการแสดง',removedAt:new Date().toISOString().slice(0,10)});
      blocked.add(p.id);
    }
    if(shirtProducts.has(p.id)&&!blocked.has(p.id)){
      archive.push({...p,removalKind:'assortment',wasFeatured:featuredIds.has(p.id),removalReason:'งดเสนอเสื้อเป็นสินค้าสั่งผลิต',removedAt:new Date().toISOString().slice(0,10)});
      blocked.add(p.id);
    }
    if(foldingUmbrellas.has(p.id)){
      if(!p.categories.includes('folding-umbrella'))p.categories.push('folding-umbrella');
      if(umbrellaNames[p.id])p.titleTh=umbrellaNames[p.id];
    }
    const evidence=[p.name,p.titleTh,p.catalogStatusTh,p.availability,p.stockStatus].filter(Boolean).join('\n');
    if(unavailable.test(evidence)&&!blocked.has(p.id)){
      archive.push({...p,removedAt:'2026-11-18',removalReason:'ต้นทางระบุหมดสินค้าหรือยุติการผลิต',availabilityEvidence:evidence});
      blocked.add(p.id);
    }
    if(blocked.has(p.id)||p.source==='SmartGift'||Number(p.id)>=900000)continue;
    const reviewed=photos[p.id];
    if(!reviewed){
      archive.push({...p,removalKind:'supplier-photo',wasFeatured:featuredIds.has(p.id),
        removalReason:'ยังไม่มีภาพของรุ่นนี้ที่ผ่านการตรวจ',removedAt:new Date().toISOString().slice(0,10)});
      blocked.add(p.id);
      continue;
    }
    for(const field of ['image','images','gallery','originalImage','mockupImage','remoteImage'])delete p[field];
    Object.assign(p,reviewed);
  }
  data.items=data.items.filter(p=>!blocked.has(p.id));
  await fs.writeFile(archivePath,JSON.stringify(archive,null,2));
  await fs.writeFile(dataPath,JSON.stringify(data));
  const byId=new Map(data.items.map(p=>[p.id,p]));
  const featured=[...featuredIds].map(id=>byId.get(id)).filter(Boolean);
  await fs.writeFile(featuredPath,JSON.stringify(featured));
  const categoryPath=path.join(root,'data/categories.json');
  const categories=JSON.parse(await fs.readFile(categoryPath,'utf8'));
  if(!categories.some(c=>c.slug==='folding-umbrella'))categories.splice(2,0,{slug:'folding-umbrella'});
  for(const c of categories){if(displayCategoryNames[c.slug])c.name=displayCategoryNames[c.slug];}
  for(const c of categories)c.count=data.items.filter(p=>p.categories.includes(c.slug)).length;
  await fs.writeFile(categoryPath,JSON.stringify(categories));
  return archive;
}
