import fs from 'node:fs';

// Reuse reviewed catalogue imagery. These are design examples, not delivery claims.
const sets=['./portfolio-giftsets.json','./portfolio-giftsets-more.json','./gallery-new.json'].flatMap(file=>JSON.parse(fs.readFileSync(new URL(file,import.meta.url),'utf8')));
const selectedSetSkus=['TZX02-2','TMZ5312','TTB14-3','TBC4117','TKF0195','TJS46-5','MXF71-4','TZM50-2'];
export function homeGiftsetCards(ownedSets,renderCard){
 return selectedSetSkus.map(sku=>{
  const product=ownedSets.items.find(p=>p.sku===sku),preview=sets.find(p=>p.sku===sku);
  if(!product||!preview)throw Error('Missing home gift set '+sku);
  return renderCard({...product,image:preview.image,name:preview.title+' รุ่น '+sku});
 }).join('');
}

const selectedProducts=[
 ['900001','/assets/local-products/one-bangkok-trapezoid-lg.webp'],
 ['902005','/assets/local-products/fan-events/concert-light-stick.webp'],
 ['900006','/assets/industry-mockups/hospitals-v1.png'],
 ['11202',null],
 ['12115','/assets/industry-mockups/true-speaker-v1.png'],
 ['13039','/assets/industry-mockups/krungthai-notebook-v1.png'],
 ['13220','/assets/industry-mockups/beauty-v1.png'],
 ['13138','/assets/industry-mockups/ptt-plantpen-v1.png']
];
export function homeProductCards(products,renderCard){
 return selectedProducts.map(([id,image])=>{
  const product=products.find(p=>p.id===id);
  if(!product)throw Error('Missing home product '+id);
  return renderCard({...product,image:image||product.image});
 }).join('');
}
