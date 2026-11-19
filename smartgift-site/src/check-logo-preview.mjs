import assert from 'node:assert/strict';
import {fitRect,constrainLogo,hitLogo,logoDimensions} from './logo-layout.js';
import {approvedImageUrl} from './product-image-proxy.mjs';
const r=fitRect(2000,1000);assert.equal(r.width/r.height,2);assert(r.x>=40&&r.y>=40&&r.y+r.height<=890);
for(const aspect of [.02,.5,1,2,50])for(const angle of [-180,-90,-45,0,30,90,180]){const s=constrainLogo({x:-500,y:2000,size:70,angle},aspect),d=logoDimensions(s,aspect),a=angle*Math.PI/180,halfX=(Math.abs(Math.cos(a))*d.width+Math.abs(Math.sin(a))*d.height)/2,halfY=(Math.abs(Math.sin(a))*d.width+Math.abs(Math.cos(a))*d.height)/2;assert(s.x-halfX>=-1e-8&&s.x+halfX<=1000+1e-8);assert(s.y-halfY>=-1e-8&&s.y+halfY<=930+1e-8);assert(hitLogo({x:s.x,y:s.y},s,aspect));assert(!hitLogo({x:10000,y:10000},s,aspect));}
assert(approvedImageUrl('https://www.giftu.com.hk/upload/product/example.jpg?v=1'));
for(const url of ['http://127.0.0.1/private','https://www.giftu.com.hk.evil.test/upload/product/a','https://www.giftu.com.hk/upload/product/../../private','https://user:pass@www.giftu.com.hk/upload/product/a','file:///C:/secret','data:image/svg+xml,<svg>'])assert.equal(approvedImageUrl(url),null);
console.log('Logo layout: fit, rotation, drag bounds, extreme aspect ratios and image URL restrictions passed.');
