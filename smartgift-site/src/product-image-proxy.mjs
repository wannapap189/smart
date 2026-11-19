import {readFile,writeFile,mkdir} from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
const cache=path.resolve('../catalog-import/product-image-cache');
export function approvedImageUrl(value){try{const u=new URL(value);return u.protocol==='https:'&&u.hostname==='www.giftu.com.hk'&&u.pathname.startsWith('/upload/product/')&&!u.username&&!u.password?u:null;}catch{return null;}}
export async function serveProductImage(url,res,root){
 const sku=url.searchParams.get('sku'),view=Number(url.searchParams.get('view')||0);
 const index=JSON.parse(await readFile(path.join(root,'data/search-index.json'),'utf8'));
 const p=index.find(p=>p.sku===sku),src=p&&(p.images||[p.image])[view];
 const target=approvedImageUrl(src);
 if(!p||!Number.isInteger(view)||view<0||!target){res.writeHead(404);res.end();return;}
 const key=createHash('sha256').update(target.href).digest('hex'),file=path.join(cache,key);
 try{const [bytes,type]=await Promise.all([readFile(file),readFile(file+'.type','utf8')]);res.writeHead(200,{'Content-Type':type,'Cache-Control':'private, max-age=86400','X-Content-Type-Options':'nosniff'});res.end(bytes);return;}catch{}
 try{const response=await fetch(target,{redirect:'error',signal:AbortSignal.timeout(15000)});const type=(response.headers.get('content-type')||'').split(';')[0];if(!response.ok||!['image/png','image/jpeg','image/webp','image/gif'].includes(type))throw Error('image');const chunks=[];let length=0;for await(const chunk of response.body){length+=chunk.length;if(length>15*1024*1024)throw Error('size');chunks.push(chunk);}const bytes=Buffer.concat(chunks);await mkdir(cache,{recursive:true});await writeFile(file,bytes);await writeFile(file+'.type',type);res.writeHead(200,{'Content-Type':type,'Cache-Control':'private, max-age=86400','X-Content-Type-Options':'nosniff'});res.end(bytes);}catch{res.writeHead(502,{'Content-Type':'text/plain; charset=utf-8'});res.end('ภาพสินค้ายังไม่พร้อมแสดง');}
}
