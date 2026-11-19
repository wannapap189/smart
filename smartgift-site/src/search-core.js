export const normalize=value=>String(value??'').normalize('NFKC').toLocaleLowerCase('th').replace(/[‐‑–—]/g,'-').replace(/\s+/g,' ').trim();
const code=value=>normalize(value).replace(/[\s-]/g,'');
export function searchProducts(items,query='',scope='all'){
 const q=normalize(query),words=q.split(' ').filter(Boolean);
 return items.filter(p=>scope==='all'||p.kind===scope).map(p=>{
  const exactCode=q&&[p.sku,...(p.aliases||[])].some(sku=>code(sku)===code(q));
  if(!exactCode&&!words.every(w=>p.searchText.includes(w)))return null;
  const title=normalize(p.title);
  return {product:p,score:exactCode?1000:q&&title.includes(q)?100:words.filter(w=>title.includes(w)).length*10};
 }).filter(Boolean).sort((a,b)=>b.score-a.score).map(r=>r.product);
}
export function paginate(items,requestedPage=1,size=24){const pages=Math.max(1,Math.ceil(items.length/size));const page=Math.min(pages,Math.max(1,Math.floor(Number(requestedPage))||1));return {page,pages,items:items.slice((page-1)*size,page*size)};}
