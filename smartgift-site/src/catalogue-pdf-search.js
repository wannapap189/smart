const form=document.querySelector('[data-pdf-search]');
const results=document.querySelector('[data-pdf-results]');
const status=document.querySelector('[data-pdf-status]');
let index, request=0;
form.addEventListener('submit',async event=>{
 event.preventDefault();
 const seq=++request, term=form.elements.q.value.trim().toLocaleLowerCase('th');
 results.replaceChildren();
 if(!term){status.textContent='กรอกรหัสหรือชื่อสินค้าที่ต้องการ';return;}
 status.textContent='กำลังค้นหา…';
 try {
  index??=fetch('/data/product-pdf-index.json').then(r=>{if(!r.ok)throw Error();return r.json();});
  const items=await index;
  if(seq!==request)return;
  const matches=items.filter(fields=>fields.some(field=>field.toLocaleLowerCase('th').includes(term))).sort(([a],[b])=>Number(b.toLowerCase()===term)-Number(a.toLowerCase()===term));
  status.textContent=matches.length?(matches.length>24?'แสดง 24 รุ่นแรก จาก '+matches.length.toLocaleString('th-TH')+' รุ่น กรุณาระบุคำค้นเพิ่มเพื่อเจาะจงรุ่น':'พบ '+matches.length+' รุ่น'):'ไม่พบรุ่นที่ตรงกับคำค้น ลองตรวจรหัสหรือใช้คำที่สั้นลง';
  for(const [sku,title] of matches.slice(0,24)){
   const card=document.createElement('article');card.className='download-card';
   const code=document.createElement('small');code.textContent=sku;
   const h=document.createElement('h3');h.textContent=title;
   const a=document.createElement('a');a.className='text-link';a.href='/downloads/products/'+encodeURIComponent(sku)+'.pdf';a.download=sku+'.pdf';a.textContent='ดาวน์โหลด PDF รุ่นนี้ ↓';
   card.append(code,h,a);results.append(card);
  }
 } catch(error){index=undefined;if(seq===request)status.textContent='โหลดรายการไม่ได้ กรุณาลองอีกครั้ง';}
});

