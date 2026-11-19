(()=>{
const root=document.querySelector('[data-portfolio-gallery]');if(!root)return;
const links=[...root.querySelectorAll('[data-industry]')],cards=[...root.querySelectorAll('[data-gallery-card]')],logos=[...root.querySelectorAll('[data-client-groups]')],filters=[...root.querySelectorAll('[data-example-kind]')];
const select=root.querySelector('#pg-industry-select'),more=root.querySelector('#pg-more-logos');let group='all',kind='all',expanded=false;
const belongs=(tags)=>group==='all'||tags.split(' ').includes(group);
function render(){
 const link=links.find(l=>l.dataset.industry===group)||links[0];
 root.querySelector('#pg-group-title').textContent=link.dataset.title;root.querySelector('#pg-group-description').textContent=link.dataset.description;
 links.forEach(l=>{if(l===link)l.setAttribute('aria-current','true');else l.removeAttribute('aria-current')});select.value=group;
 const matching=logos.filter(l=>belongs(l.dataset.clientGroups));logos.forEach(l=>l.hidden=!matching.includes(l)||(!expanded&&matching.indexOf(l)>=6));
 root.querySelector('.pg-clients').hidden=!matching.length;more.hidden=matching.length<=6;more.setAttribute('aria-expanded',String(expanded));more.textContent=expanded?'ย่อโลโก้ ↑':`ดูครบ ${matching.length} โลโก้ ↓`;
 root.querySelector('[data-giftset-count]').textContent=cards.filter(c=>belongs(c.dataset.groups)&&c.dataset.format==='giftset').length;
 let total=0;cards.forEach(c=>{const typeMatch=kind==='all'||c.dataset.format===kind;c.hidden=!(belongs(c.dataset.groups)&&typeMatch);if(!c.hidden)total++;});
 filters.forEach(f=>f.setAttribute('aria-pressed',String(f.dataset.exampleKind===kind)));root.querySelector('#pg-result-count').textContent=total+' ตัวอย่าง';root.querySelector('.pg-empty').hidden=total>0;
}
function readHash(scroll=false){const id=location.hash.slice(1);if(id!=='clients'&&!id.startsWith('clients-'))return;const next=id==='clients'?'all':id.slice(8);group=links.some(l=>l.dataset.industry===next)?next:'all';kind='all';expanded=false;render();if(scroll)root.querySelector('#pg-results').scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}
links.forEach(l=>l.addEventListener('click',()=>{if(location.hash===l.hash){kind='all';expanded=false;render();root.querySelector('#pg-results').scrollIntoView({block:'start'});}}));
select.addEventListener('change',()=>{location.hash=select.value==='all'?'clients':'clients-'+select.value;});
filters.forEach(f=>f.addEventListener('click',()=>{kind=f.dataset.exampleKind;render();}));more.addEventListener('click',()=>{expanded=!expanded;render();});root.querySelector('[data-reset-gallery-kind]').addEventListener('click',()=>{kind='all';render();});
window.addEventListener('hashchange',()=>readHash(true));readHash();render();
})();
