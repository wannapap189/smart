import http from 'node:http';
import {createReadStream} from 'node:fs';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import {serveProductImage} from './src/product-image-proxy.mjs';
const root=path.resolve('dist');
const port=Number(process.env.SMARTGIFT_PORT||4173);
if(!Number.isInteger(port)||port<1||port>65535) throw Error('SMARTGIFT_PORT must be a valid TCP port');
const types={'.mp4':'video/mp4','.pdf':'application/pdf','.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml','.xml':'application/xml','.txt':'text/plain; charset=utf-8'};
http.createServer(async(req,res)=>{try{const url=new URL(req.url,'http://localhost');if(url.pathname==='/product-image'){await serveProductImage(url,res,root);return;}const requested=decodeURIComponent(url.pathname);let file=path.resolve(root,'.'+requested);const category=url.searchParams.get('category');if(requested.replace(/\/$/,'')==='/smartgift/products'&&category&&/^[a-z-]+$/.test(category)){const variant=path.join(root,'category-variants',category+'.html');try{await stat(variant);file=variant}catch{}}if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}if((await stat(file)).isDirectory())file=path.join(file,'index.html');const {size}=await stat(file);const headers={'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store','Accept-Ranges':'bytes'};
let start=0,end=size-1,status=200;
if(req.headers.range){
 const m=/^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
 if(m&&(m[1]||m[2])){if(m[1]){start=Number(m[1]);end=m[2]?Math.min(Number(m[2]),end):end;}else{start=Math.max(0,size-Number(m[2]));}}
 if(!m||(!m[1]&&!m[2])||!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start>end||start>=size){res.writeHead(416,{'Content-Range':`bytes */${size}`});res.end();return;}
 status=206;headers['Content-Range']=`bytes ${start}-${end}/${size}`;
}
headers['Content-Length']=size?end-start+1:0;res.writeHead(status,headers);
if(req.method==='HEAD'||!size){res.end();return;}
const stream=createReadStream(file,{start,end});stream.on('error',()=>res.destroy());res.on('close',()=>stream.destroy());stream.pipe(res);}catch{res.writeHead(404,{'Content-Type':'text/html; charset=utf-8'});res.end(await readFile(path.join(root,'404.html')));}}).listen(port,'127.0.0.1',()=>console.log('SmartGift: http://127.0.0.1:'+port));
