// Website overlays keep the original source images intact.
(()=>{
 const installed=new WeakSet();
 const position=new WeakMap();
 const resize=new ResizeObserver(entries=>entries.forEach(({target})=>position.get(target)?.()));
 function install(img){
  if(installed.has(img)||img.closest('.brand, .client-logo-frame')||/logo\.(svg|png)$/i.test(img.getAttribute('src')||''))return;
  installed.add(img);
  const host=img.parentElement;
  if(getComputedStyle(host).position==='static')host.classList.add('sg-watermark-host');
  const mark=document.createElement('span');
  mark.className='sg-watermark';mark.textContent=img.hasAttribute('data-reference-photo')?'คัดโดย Smart Gift':'Smart Gift';mark.setAttribute('aria-hidden','true');
  host.append(mark);
  const update=()=>{
   const imageBox=img.getBoundingClientRect(),hostBox=host.getBoundingClientRect();
   mark.hidden=imageBox.width<40||imageBox.height<35;
   const small=imageBox.width<140;
   mark.style.fontSize=small?'8px':'11px';
   mark.style.left=(imageBox.right-hostBox.left-host.clientLeft+host.scrollLeft-(small?4:10))+'px';
   mark.style.top=(imageBox.bottom-hostBox.top-host.clientTop+host.scrollTop-(small?4:10))+'px';
  };
  position.set(img,update);resize.observe(img);img.addEventListener('load',update);update();
 }
 function scan(root){if(root instanceof HTMLImageElement)install(root);root.querySelectorAll?.('img').forEach(install);}
 scan(document);
 new MutationObserver(changes=>changes.forEach(change=>change.addedNodes.forEach(scan))).observe(document.body,{childList:true,subtree:true});
})();
