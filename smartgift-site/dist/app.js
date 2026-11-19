(()=>{'use strict';const productUrl=id=>'/smartgift/products/'+(Number(id)>=900000?'sg-':'gu-')+id;const sku=id=>(Number(id)>=900000?'SG-':'GU-')+id;const base='/smartgift',key='smartgift-quote-v2';const $=(s,r=document)=>r.querySelector(s);const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));let basket=[];try{basket=JSON.parse(localStorage.getItem(key)||'[]').filter(x=>x && (/^\d+$/.test(x.id) || isCustomSet(x)) && Number.isInteger(x.quantity)&&x.quantity>0).slice(0,100)}catch{}let catalogPromise,featuredPromise;const fetchJson=async u=>{const r=await fetch(u);if(!r.ok)throw Error('โหลดข้อมูลไม่สำเร็จ');return r.json()};const catalog=()=>catalogPromise||(catalogPromise=fetchJson('/data/catalog.json').then(d=>d.items).catch(e=>{catalogPromise=null;throw e}));const featured=()=>featuredPromise||(featuredPromise=fetchJson('/data/featured.json'));function toast(t){const el=$('#toast');el.textContent=t;el.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove('show'),2800)}function sync(){document.querySelectorAll('[data-basket-count]').forEach(el=>el.textContent=basket.length);document.querySelectorAll('[data-add]').forEach(el=>{const added=basket.some(p=>p.id===el.dataset.add);el.classList.toggle('selected',added);el.textContent=added?'✓ เลือกแล้ว':'＋ ขอราคา';el.setAttribute('aria-pressed',String(added))})}function save(){let persisted=true;try{localStorage.setItem(key,JSON.stringify(basket))}catch{persisted=false;toast('เบราว์เซอร์ไม่อนุญาตบันทึกรายการ ข้อมูลจะอยู่ในหน้านี้เท่านั้น')}sync();return persisted}document.addEventListener('click',e=>{const b=e.target.closest('[data-add]');if(!b)return;const id=b.dataset.add;if(basket.some(p=>p.id===id)){toast('สินค้านี้อยู่ในรายการขอราคาแล้ว');return}if(basket.length>=100){toast('เลือกได้สูงสุด 100 รายการต่อบรีฟ');return}basket.push({id,quantity:Number(b.dataset.quoteQuantity)||Number(b.dataset.orderMin)||1});save();toast('เพิ่มสินค้าในรายการขอราคาแล้ว')});document.addEventListener('error',e=>{if(e.target.tagName==='IMG'&&!e.target.src.endsWith('/assets/placeholder.svg')){e.target.src='/assets/placeholder.svg';e.target.alt+=' — ภาพต้นทางไม่พร้อมแสดง'}},true);const menu=$('#menu-toggle');menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'ปิดเมนู':'เปิดเมนู');$('#main-navigation').classList.toggle('open',open)});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu){menu.setAttribute('aria-expanded','false');$('#main-navigation').classList.remove('open')}});sync();window.addEventListener('storage',e=>{if(e.key===key)location.reload()});
function minimumQuoteQuantity(product) {
  return product?.quoteQuantity || (product?.saleUnit === 'เล่ม' && product.minimumOrder) || 1;
}
function quoteUnit(product) {
  return product?.quoteQuantity ? 'ชุด' : product?.saleUnit;
}
function quoteQuantityAttribute(product) {
  if (product.quoteQuantity) return `data-quote-quantity="${Number(product.quoteQuantity)}"`;
  if (product.saleUnit === 'เล่ม' && product.minimumOrder) return `data-order-min="${Number(product.minimumOrder)}"`;
  return '';
}
function productCard(p){const title=p.titleTh||p.name;return `<article class="product-card"><a class="product-photo" href="${productUrl(p.id)}"><img src="${esc(p.image)}" alt="${esc(title)}" loading="lazy" width="400" height="350"></a><div class="product-body"><span class="sku">รหัสอ้างอิง ${sku(p.id)}</span><h3><a href="${productUrl(p.id)}">${esc(title)}</a></h3><div class="product-actions"><a href="${productUrl(p.id)}">รายละเอียด ↗</a><button class="add-product" data-add="${p.id}" ${quoteQuantityAttribute(p)} aria-label="เพิ่ม ${esc(title)} ในรายการขอราคา">＋ ขอราคา</button></div></div></article>`}
const params=new URLSearchParams(location.search);const catNames={drinkware:'แก้วน้ำและกระบอกน้ำ',bag:'กระเป๋าและสิ่งทอ',technology:'อุปกรณ์เทคโนโลยี',office:'ของใช้สำนักงาน',lifestyle:'ของใช้ในชีวิตประจำวัน',eco:'ของพรีเมียมรักษ์โลก',apparel:'หมวกและเครื่องแต่งกายเสริม','folding-umbrella':'ร่มพับพิมพ์โลโก้',campaign:'ของสำหรับแคมเปญ','gift-set':'ชุดของขวัญพรีเมียม',packaging:'บรรจุภัณฑ์และกล่อง',seasonal:'สินค้าตามฤดูกาล',custom:'สั่งผลิตตามแบบ'};
function detail(id){if(/^\d+$/.test(id)){location.replace(base+'/products/gu-'+id)}else{$('#main').innerHTML='<section class="section container"><h1>ไม่พบสินค้ารหัสนี้</h1><a href="/smartgift/products">เลือกสินค้าในแค็ตตาล็อก</a></section>'}}
let disposeCatalogue;
function initCatalogue() {
  disposeCatalogue?.();
  disposeCatalogue = undefined;
  const area = $('[data-catalogue]');
  if (!area || (area.dataset.catalogView && area.dataset.catalogView !== 'catalogue')) return;
  const initialParams = new URLSearchParams(location.search);
  if (initialParams.has('item')) return detail(initialParams.get('item'));
  const lifecycle = new AbortController();
  const options = {signal:lifecycle.signal};

  const productsPath = base + '/products';
  const pageSize = 24;
  const input = $('#product-search', area);
  const results = $('#product-results', area);
  const count = $('#catalog-count', area);
  const notebookDownload = $('[data-notebook-download]', area);
  const pager = $('#pagination', area);
  const sortField = $('#catalog-sort', area);
  const heading = $('.page-hero h1');
  const intro = $('.page-hero p');
  const crumbs = $('.page-hero .breadcrumbs');
  const homeCrumb = crumbs?.querySelector('a')?.cloneNode(true);
  const links = [...area.querySelectorAll('a[data-category]')];
  const notebookInfo = new Map([...area.querySelectorAll('template[data-notebook-category]')].map(template => [
    template.dataset.notebookCategory, template.dataset
  ]));
  const fold = text => String(text ?? '').normalize('NFKC').toLowerCase();
  const notebooks = [...area.querySelectorAll('template[data-notebook-card]')].map(template => {
    const id = template.dataset.notebookCard;
    const name = template.content.querySelector('h3').textContent.trim();
    const text = fold([id, sku(id), name, template.dataset.search].join(' '));
    return {id, name, template, kind:template.dataset.notebookKind, text};
  });
  const notebookIds = new Set(notebooks.map(item => item.id));
  const defaultHeading = 'สินค้าพรีเมียม';
  const defaultIntro = 'ค้นหาไอเดียสินค้าส่งเสริมการขายที่เหมาะกับแบรนด์และแคมเปญของคุณ';
  const metadata = new Map();
  let schemaKey;
  let ordinary;
  let loading;
  let failed = false;
  let category, query, page, sort;
  let inputTimer;
  disposeCatalogue = () => { lifecycle.abort(); clearTimeout(inputTimer); };

  function readLocation() {
    const url = new URL(location.href);
    const path = url.pathname.replace(/\/index\.html$/, '').replace(/\/+$/, '');
    const kind = path.startsWith(productsPath + '/') ? path.slice(productsPath.length + 1) : '';
    let routeCategory = '';
    if (notebookInfo.has(kind)) routeCategory = kind;
    else if (path === base + '/ideas') routeCategory = 'gift-set';
    else if (path !== productsPath && path !== base + '/catalog') routeCategory = area.dataset.defaultCategory || '';
    category = url.searchParams.get('category') ?? routeCategory;
    query = url.searchParams.get('q') || '';
    const requested = Number(url.searchParams.get('page'));
    page = Number.isSafeInteger(requested) && requested > 0 ? requested : 1;
    sort = url.searchParams.get('sort') === 'name' ? 'name' : 'new';
    input.value = query;
    sortField.value = sort;
  }
  function categoryUrl(value) {
    const isNotebook = notebookInfo.has(value);
    const url = new URL(productsPath + (isNotebook ? '/' + value : ''), location.origin);
    if (value && !isNotebook) url.searchParams.set('category', value);
    return url;
  }
  function writeHistory(mode, keepHash = false) {
    const url = categoryUrl(category);
    if (query) url.searchParams.set('q', query);
    if (page > 1) url.searchParams.set('page', String(page));
    if (sort !== 'new') url.searchParams.set('sort', sort);
    if (keepHash) url.hash = location.hash;
    if (url.href !== location.href) history[mode + 'State'](null, '', url.href);
  }
  function updateSchema(siteUrl, title, description) {
    const key = [siteUrl.href, title, description].join('\n');
    if (key === schemaKey) return;
    const script = document.head.querySelector('script[type="application/ld+json"]');
    if (!script) return;
    const schema = JSON.parse(script.textContent);
    const graph = schema['@graph'] || [];
    const entry = graph.find(node => ['CollectionPage','WebPage'].includes(node['@type']));
    if (!entry) return;
    const isNotebook = notebookInfo.has(category);
    Object.assign(entry, {'@type':isNotebook?'CollectionPage':'WebPage', '@id':siteUrl.href, url:siteUrl.href, name:title, description});
    if (isNotebook) {
      const rows = notebooks.filter(item=>item.kind===category);
      entry.mainEntity = {'@type':'ItemList', numberOfItems:rows.length, itemListElement:rows.map((item,i)=>({
        '@type':'ListItem', position:i+1, url:siteUrl.origin+productUrl(item.id), name:item.name
      }))};
    } else delete entry.mainEntity;
    const trail = graph.find(node=>node['@type']==='BreadcrumbList');
    if (trail?.itemListElement?.length) Object.assign(trail.itemListElement.at(-1), {name:title, item:siteUrl.href});
    script.textContent = JSON.stringify(schema);
    schemaKey = key;
  }
  function displayMeta() {
    const book = notebookInfo.get(category), info = metadata.get(category);
    const name = book?.heading || info?.name || catNames[category] || category || defaultHeading;
    const title = book?.title || info?.seoTitle || name;
    const description = book?.description || info?.seoDescription || defaultIntro;
    if (notebookDownload) {
      notebookDownload.hidden = !book;
      const link = notebookDownload.querySelector('a');
      if (book) {
        link.href = book.pdfUrl;
        link.textContent = 'ดาวน์โหลดแคตตาล็อก'+book.heading+' (PDF) ↓';
      } else link.removeAttribute('href');
    }
    heading.textContent = name;
    intro.textContent = description;
    const eyebrow = $('.page-hero .eyebrow');
    if (eyebrow) eyebrow.textContent = category === 'gift-set' ? 'ชุดของขวัญที่คัดสรรอย่างลงตัว' : 'สินค้าพรีเมียมสำหรับทุกโครงการ';
    document.title = title + ' | SmartGift Thailand';
    for (const [selector, text] of [['meta[name="description"]', description], ['meta[property="og:title"]', document.title], ['meta[property="og:description"]', description]]) {
      document.querySelector(selector)?.setAttribute('content', text);
    }
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      const siteUrl = new URL(canonical.href);
      const route = categoryUrl(category);
      siteUrl.pathname = route.pathname;
      siteUrl.search = route.search;
      siteUrl.hash = '';
      canonical.href = siteUrl.href;
      document.querySelector('meta[property="og:url"]')?.setAttribute('content', siteUrl.href);
      updateSchema(siteUrl, title, description);
    }
    if (crumbs && homeCrumb) {
      const separator = () => Object.assign(document.createElement('span'), {textContent:'/'});
      crumbs.replaceChildren(homeCrumb.cloneNode(true), separator());
      if (category) {
        const allLink = Object.assign(document.createElement('a'), {href:productsPath, textContent:defaultHeading});
        crumbs.append(allLink, separator());
      }
      crumbs.append(document.createTextNode(name));
    }
    links.forEach(link => {
      const selected = link.dataset.category === category;
      link.classList.toggle('active', selected);
      if (selected) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    return book?.heading || info?.name || catNames[category] || category || 'สินค้าทั้งหมด';
  }
  function loadOrdinary() {
    if (loading || failed) return;
    loading = Promise.all([fetchJson('/data/categories.json'), catalog()]).then(([categories, products]) => {
      categories.forEach(item => metadata.set(item.slug, item));
      ordinary = products.map(product => {
        const name = product.titleTh || product.name;
        const terms = [name, product.name, product.id, product.sku || sku(product.id), product.factoryCode,
          ...(product.searchAliases || []), product.descriptionTh, product.description,
          ...product.categories.map(key => metadata.get(key)?.name || key)];
        return {id:product.id, name, product, text:fold(terms.join(' '))};
      });
    }).catch(() => { failed = true; }).finally(() => {
      loading = null;
      if (!lifecycle.signal.aborted && area.getAttribute('aria-busy')!=='true' && !notebookInfo.has(category)) render();
    });
  }
  function renderPager(totalPages, hasResults) {
    const pages = [...new Set([1, page-1, page, page+1, totalPages])].filter(n => n>0 && n<=totalPages).sort((a,b) => a-b);
    const numberButtons = pages.map((n, i) =>
      (i && n>pages[i-1]+1 ? '<span>…</span>' : '') +
      '<button data-page="'+n+'"'+(page===n?' aria-current="page"':'')+' aria-label="หน้าที่ '+n+'">'+n+'</button>');
    pager.innerHTML = hasResults ? '<button data-page="'+(page-1)+'"'+(page===1?' disabled':'')+' aria-label="หน้าก่อนหน้า">←</button>'+
      numberButtons.join('')+'<button data-page="'+(page+1)+'"'+(page===totalPages?' disabled':'')+' aria-label="หน้าถัดไป">→</button>' : '';
  }
  function render({anchor = false, retainInitial = false} = {}) {
    const categoryName = displayMeta();
    const isNotebook = notebookInfo.has(category);
    if (!isNotebook && !ordinary) {
      if (failed) {
        count.textContent = 'โหลดข้อมูลไม่สำเร็จ';
        results.innerHTML = '<div class="error-block"><p>กรุณาตรวจการเชื่อมต่อแล้วลองโหลดรายการอีกครั้ง</p><button type="button" class="button teal" id="retry-catalog">ลองอีกครั้ง</button></div>';
      } else {
        count.textContent = 'กำลังโหลดรายการสินค้า…';
        if (!retainInitial) results.innerHTML = '<p>กำลังโหลดสินค้า…</p>';
        loadOrdinary();
      }
      pager.replaceChildren();
      return;
    }
    const terms = fold(query).trim().split(/\s+/).filter(Boolean);
    const eligible = isNotebook
      ? notebooks.filter(item => item.kind === category)
      : ordinary.filter(item => !category || (item.product.categories.includes(category) &&
          (category !== 'office' || !notebookIds.has(String(item.id)))));
    const matched = eligible.filter(item => terms.every(term => item.text.includes(term)));
    if (sort === 'name') matched.sort((a,b) => a.name.localeCompare(b.name,'th'));
    else if (!isNotebook) matched.sort((a,b) => Number(b.id)-Number(a.id));
    const pages = Math.max(1, Math.ceil(matched.length/pageSize));
    const oldPage = page;
    const anchored = anchor && isNotebook && location.hash.match(/^#book-(?:GU|SG)-(\d+)$/i);
    const anchoredIndex = anchored ? matched.findIndex(item => String(item.id) === anchored[1]) : -1;
    page = anchoredIndex<0 ? Math.min(page,pages) : Math.floor(anchoredIndex/pageSize)+1;
    if (page !== oldPage) writeHistory('replace', !!anchored);
    count.textContent = categoryName+' · '+matched.length.toLocaleString('th-TH')+' รายการ'+(query ? ' · “'+query+'”' : '');
    const visible = matched.slice((page-1)*pageSize, page*pageSize);
    if (!visible.length) {
      results.innerHTML = '<div class="empty-state"><h2>ไม่พบสินค้าที่ตรงกับคำค้น</h2><p>ลองค้นด้วยชื่อสินค้า รหัส หรือเลือกหมวดอื่น</p><button id="reset-search" type="button" class="button outline">ล้างคำค้นและดูสินค้าทั้งหมด</button></div>';
    } else if (isNotebook) {
      results.replaceChildren(...visible.map(item => item.template.content.cloneNode(true)));
    } else {
      results.innerHTML = visible.map(item => productCard(item.product)).join('');
    }
    renderPager(pages, visible.length);
    sync();
    if (anchoredIndex >= 0) {
      const hash = location.hash;
      const target = 'book-' + sku(matched[anchoredIndex].id);
      requestAnimationFrame(() => { if (!lifecycle.signal.aborted && location.hash === hash) document.getElementById(target)?.scrollIntoView(); });
    }
  }
  function apply(mode) {
    clearTimeout(inputTimer);
    writeHistory(mode);
    render();
  }
  area.addEventListener('click', event => {
    const link = event.target.closest('a[data-category]');
    if (link) {
      if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey ||
          (link.target && link.target !== '_self') || link.hasAttribute('download')) return;
      event.preventDefault();
      category = link.dataset.category;
      query = input.value.trim();
      page = 1;
      apply('push');
      return;
    }
    const button = event.target.closest('button');
    if (!button || button.disabled) return;
    if (button.hasAttribute('data-page')) {
      page = Number(button.dataset.page);
      apply('push');
      $('.catalog-search', area).scrollIntoView({block:'start', behavior:'smooth'});
    } else if (button.id === 'reset-search') {
      input.value = query = category = '';
      page = 1;
      apply('push');
    } else if (button.id === 'retry-catalog') {
      failed = false;
      render();
    }
  }, options);
  area.addEventListener('smartgift:catalog-leaving', () => clearTimeout(inputTimer), options);
  const search = mode => {
    query = input.value.trim();
    page = 1;
    apply(mode);
  };
  $('.catalog-search', area).addEventListener('submit', event => {
    event.preventDefault();
    search('push');
  }, options);
  input.addEventListener('input', () => {
    clearTimeout(inputTimer);
    inputTimer = setTimeout(() => search('replace'), 300);
  }, options);
  sortField.addEventListener('change', () => {
    query = input.value.trim();
    sort = sortField.value;
    page = 1;
    apply('push');
  }, options);
  function restore() {
    clearTimeout(inputTimer);
    readLocation();
    render({anchor:true});
  }
  if (area.hasAttribute('data-catalog-view')) area.addEventListener('smartgift:catalog-restore', restore, options);
  else window.addEventListener('popstate', restore, options);
  readLocation();
  if (initialParams.has('category') && notebookInfo.has(category)) writeHistory('replace', true);
  render({anchor:true, retainInitial:true});
}
function isCustomSet(row) {
  return /^set-[a-z0-9-]+$/.test(row.id) && Array.isArray(row.set?.samples) &&
    row.set.samples.every(name => typeof name === 'string') &&
    ['requested','budget','packaging','occasion'].every(field => typeof row.set[field] === 'string');
}
function setDescription(set) {
  return [
    set.samples.length && 'ตัวอย่างที่เลือก: ' + set.samples.join(' • '),
    set.requested && 'รายการที่ต้องการในชุด: ' + set.requested,
    set.packaging && 'บรรจุภัณฑ์: ' + set.packaging,
    set.occasion && 'ผู้รับและโอกาส: ' + set.occasion
  ].filter(Boolean).join('\n');
}
function customBasketRow(item) {
  const {id,quantity,set} = item;
  return `<article class="basket-row custom-set-row"><div><h2>ชุดของขวัญจัดตามรายการ</h2><p>${esc(setDescription(set))}</p><p>งบต่อชุด: ${esc(set.budget||'ขอคำแนะนำ')}${set.budget?' บาท':''}</p></div><label>จำนวนชุด<input aria-label="จำนวนชุดของขวัญจัดตามรายการ" type="number" min="1" max="1000000" value="${quantity}" data-quantity="${esc(id)}"></label><button type="button" class="remove-item" data-remove="${esc(id)}" aria-label="ลบชุดของขวัญจัดตามรายการ">ลบรายการ</button></article>`;
}
async function getBasketItems() {
  if (!basket.length || basket.every(isCustomSet)) return basket;
  const list=await featured();
  const missing=basket.some(row=>!isCustomSet(row)&&!list.some(product=>product.id===row.id));
  const products=new Map((missing?await catalog():list).map(product=>[product.id,product]));
  const valid=basket.filter(row=>isCustomSet(row)||products.has(row.id));
  const removed=valid.length!==basket.length;
  let adjusted=false;
  for (const row of valid) {
    const minimum=products.get(row.id)?.quoteQuantity;
    if (minimum && row.quantity<minimum) { row.quantity=minimum; adjusted=true; }
  }
  if (removed||adjusted) {
    basket=valid;
    save();
    toast(adjusted?'ปรับจำนวนสมุดโน๊ตอัจฉริยะในรายการให้ตรงกับขั้นต่ำแล้ว':'นำสินค้าที่ไม่อยู่ในแค็ตตาล็อกออกจากรายการขอราคาแล้ว');
  }
  return basket.map(row=>isCustomSet(row)?row:{...row,product:products.get(row.id)});
}
async function showBasket(){const el=$('#basket-content');if(!el)return;try{const items=await getBasketItems();el.innerHTML=items.length?items.map(item=>{if(isCustomSet(item))return customBasketRow(item);const {product:p,id,quantity}=item;return `<article class="basket-row"><img src="${esc(p?.image||'/assets/placeholder.svg')}" alt="${esc(p?.titleTh||p?.name||id)}" width="110" height="100"><div><h2><a href="${productUrl(id)}">${esc(p?.titleTh||p?.name||'GU-'+id)}</a></h2><p>${sku(id)} · ${p?.source==='SmartGift'?'สินค้าคัดสรรโดย SmartGift':'สินค้าอ้างอิงจาก GiftU'}</p></div><label>จำนวนที่ต้องการ${quoteUnit(p)?' ('+esc(quoteUnit(p))+')':''}<input aria-label="จำนวนสินค้า ${sku(id)}" type="number" min="${minimumQuoteQuantity(p)}" max="10000000" value="${quantity}" data-quantity="${id}"></label><button class="remove-item" data-remove="${id}" aria-label="ลบสินค้า ${sku(id)}">ลบรายการ</button></article>`}).join('')+'<button class="clear-basket">ล้างรายการทั้งหมด</button>':`<div class="empty-state"><h2>ยังไม่มีสินค้าในรายการ</h2><p>กด “ขอราคา” ที่สินค้าเพื่อรวบรวมรายการที่สนใจ</p><a class="button teal" href="${base}/products">เลือกสินค้า →</a></div>`;el.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>{basket=basket.filter(p=>p.id!==b.dataset.remove);save();showBasket()});el.querySelectorAll('[data-quantity]').forEach(n=>{n.addEventListener('input',()=>{const v=Number(n.value);if(Number.isInteger(v)&&v>=Number(n.min)&&v<=Number(n.max)){basket.find(p=>p.id===n.dataset.quantity).quantity=v;save()}});n.addEventListener('change',()=>{const v=Math.max(Number(n.min),Math.min(Number(n.max),Math.floor(Number(n.value)||1)));n.value=v;basket.find(p=>p.id===n.dataset.quantity).quantity=v;save()})});$('.clear-basket')?.addEventListener('click',()=>{basket=[];save();showBasket()})}catch{el.innerHTML='<div class="error-block">ไม่สามารถโหลดชื่อสินค้าได้ กรุณาลองใหม่ รายการที่เลือกยังเก็บไว้ในเบราว์เซอร์</div>'}}
const form=$('#brief-form');if(form){const today=new Date();form.elements.date.min=[today.getFullYear(),String(today.getMonth()+1).padStart(2,'0'),String(today.getDate()).padStart(2,'0')].join('-');const fallbackSet=new URLSearchParams(location.hash.slice(1));if(fallbackSet.has('set')){form.elements.product.value='ชุดของขวัญจัดตามรายการ';form.elements.detail.value=(fallbackSet.get('set')||'').slice(0,2000);form.elements.quantity.value=fallbackSet.get('sets')||'';form.elements.budget.value=(fallbackSet.get('budget')||'').slice(0,80);}const activeSet=basket.find(row=>row.id===params.get('bundle')&&isCustomSet(row));if(activeSet){form.elements.product.value='ชุดของขวัญจัดตามรายการ';form.elements.detail.value=setDescription(activeSet.set);form.elements.quantity.value=activeSet.quantity;form.elements.budget.value=activeSet.set.budget;}if(params.get('sets'))form.elements.quantity.value=params.get('sets');if(params.get('set')){form.elements.detail.value=params.get('set').slice(0,2000);form.elements.quantity.value=params.get('sets')||'';form.elements.budget.value=params.get('budget')||'';}const uses={clients:'ชุดของขวัญสำหรับลูกค้าและคู่ค้า',employees:'ชุดของขวัญสำหรับพนักงานและทีมงาน',events:'ชุดของขวัญสำหรับงานอีเวนต์',seasonal:'ชุดของขวัญสำหรับเทศกาล'};if(uses[params.get('use')])form.elements.detail.value=uses[params.get('use')];if(params.get('product'))form.elements.product.value=params.get('product');
const bookQuantity=Number(params.get('bookQuantity'));
const productParam=params.get('product') || '';
const productSku=productParam.trim().split(/\s/)[0].toUpperCase();
const powerSkus=new Set((form.dataset.powerSkus || '').split(',').filter(Boolean));
const powerInquiry=powerSkus.has(productSku);
const validBookQuantity=Number.isInteger(bookQuantity)&&bookQuantity>=1&&bookQuantity<=10000000;
const notebookInquiry=!!productParam&&(validBookQuantity||powerInquiry);
const inquiryUnit=powerInquiry?'ชุด':'เล่ม';
if(notebookInquiry){
  const minimum=powerInquiry?Number(form.dataset.powerMinimum):1;
  form.elements.quantity.min=minimum;
  form.elements.quantity.required=powerInquiry;
  form.elements.quantity.value=Math.max(minimum,validBookQuantity?bookQuantity:minimum);
  form.querySelector('[data-quantity-label]').textContent=powerInquiry?'จำนวนชุดที่ต้องการ (1 เล่มต่อชุด)':'จำนวนที่ต้องการ (เล่ม)';
  const unitBudget=form.elements.budgetBasis.querySelector('option[value="ต่อชิ้น / ชุด"]');
  unitBudget.value=unitBudget.textContent='ต่อ'+inquiryUnit;
}
form.addEventListener('submit',async e=>{e.preventDefault();const submit=form.querySelector('button[type="submit"]');submit.disabled=true;try{const d=new FormData(form);let lines=['ขอปรึกษาโครงการกับ SmartGift',`ชื่อ: ${d.get('name')}`,`บริษัท/แบรนด์: ${d.get('company')||'-'}`,`ติดต่อกลับ: ${d.get('contact')}`,`โครงการ: ${d.get('purpose')}`,`จำนวน: ${d.get('quantity')||'ขอคำแนะนำ'}${notebookInquiry&&d.get('quantity')?' '+inquiryUnit:''}`,`งบประมาณ${d.get('budgetBasis')&&d.get('budgetBasis')!=='ขอคำแนะนำ'?' ('+d.get('budgetBasis')+')':''}: ${d.get('budget')||'ขอคำแนะนำ'}${d.get('budget')?' บาท':''}`,`วันใช้งาน: ${d.get('date')||'ยังไม่กำหนด'}`,`สินค้าที่สนใจ: ${d.get('product')||'-'}`,`รายละเอียด: ${d.get('detail')||'-'}`];if(basket.some(row=>row.id!==activeSet?.id)){
  lines.push('','รายการสินค้าที่เลือก:');
  let rows;try{rows=await getBasketItems()}catch{rows=basket}
  for(const row of rows.filter(x=>x.id!==activeSet?.id)){
    if(isCustomSet(row)) lines.push('• ชุดของขวัญจัดตามรายการ — '+row.quantity+' ชุด',setDescription(row.set),'งบต่อชุด: '+(row.set.budget?row.set.budget+' บาท':'ขอคำแนะนำ'));
    else {
      const power=powerSkus.has(sku(row.id));
      const quantity=power?Math.max(row.quantity,Number(form.dataset.powerMinimum)):row.quantity;
      lines.push('• '+sku(row.id)+' '+(row.product?.titleTh||row.product?.name||'')+' — '+quantity+' '+(power?'ชุด':(quoteUnit(row.product)||'ชิ้น/ชุด')));
    }
  }
}$('#brief-text').value=lines.join('\n');$('#brief-output').hidden=false;$('#brief-output').scrollIntoView({behavior:'smooth',block:'center'});toast('เตรียมบรีฟแล้ว กรุณาคัดลอกและส่งผ่าน LINE')}finally{submit.disabled=false}});$('#copy-brief').addEventListener('click',async()=>{const text=$('#brief-text');try{await navigator.clipboard.writeText(text.value);$('#copy-status').textContent='คัดลอกแล้ว เปิด LINE แล้ววางข้อความเพื่อส่งให้ทีม';toast('คัดลอกบรีฟแล้ว')}catch{text.focus();text.select();$('#copy-status').textContent='กรุณาคัดลอกข้อความที่เลือก แล้วนำไปวางใน LINE'}})}
document.querySelectorAll('[data-feature]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-feature]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));document.querySelectorAll('.feature-panel').forEach(p=>p.classList.toggle('is-active',p.id==='feature-'+button.dataset.feature));}));document.querySelectorAll('[data-gallery-src]').forEach(button=>button.addEventListener('click',()=>{const gallery=button.closest('.product-gallery');const img=gallery.querySelector('[data-gallery-main]');img.src=button.dataset.gallerySrc;img.alt=button.dataset.galleryAlt;gallery.querySelector('[data-gallery-caption]').textContent=button.dataset.galleryNote;gallery.querySelectorAll('[data-gallery-src]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));}));
const builder=$('[data-set-builder]');
if (builder) {
  const buttons=[...builder.querySelectorAll('[data-build-add]')];
  const form=builder.querySelector('#builder-form');
  const selection=builder.querySelector('#builder-selection');
  const status=builder.querySelector('#builder-status');
  const filters=builder.querySelector('.component-filters');
  if(filters){
    const cards=[...builder.querySelectorAll('[data-component-group]')];
    filters.hidden=false;
    filters.addEventListener('click',event=>{
      const selected=event.target.closest('[data-component-filter]');
      if(!selected)return;
      const group=selected.dataset.componentFilter;
      for(const button of filters.querySelectorAll('button'))button.setAttribute('aria-pressed',String(button===selected));
      for(const card of cards)card.hidden=group!=='all'&&card.dataset.componentGroup!==group;
      builder.querySelector('[data-component-result]').textContent='แสดง '+cards.filter(card=>!card.hidden).length+' รายการ';
    });
  }
  const picked=new Set();
  const itemName=button=>button.closest('.product-card').querySelector('h3').textContent.trim();
  function renderSelection() {
    const list=document.createElement('ul');
    for(const button of buttons) {
      const id=button.dataset.buildAdd, active=picked.has(id);
      button.classList.toggle('selected',active);
      button.setAttribute('aria-pressed',String(active));
      button.textContent=active?'✓ อยู่ในชุดแล้ว':'＋ เพิ่มในชุด';
      button.setAttribute('aria-label',(active?'นำออกจากชุด: ':'เพิ่มในชุด: ')+itemName(button));
      if(!active)continue;
      const row=document.createElement('li'),name=document.createElement('span'),remove=document.createElement('button');
      name.textContent=itemName(button);
      remove.type='button';remove.dataset.buildRemove=id;remove.textContent='×';remove.setAttribute('aria-label','นำ '+name.textContent+' ออกจากชุด');
      row.append(name,remove);list.append(row);
    }
    if(picked.size) selection.replaceChildren(list);
    else selection.textContent='เลือกจากภาพตัวอย่าง หรือพิมพ์รายการที่ต้องการด้านล่าง';
    status.textContent='';
  }
  builder.addEventListener('click',event=>{
    const add=event.target.closest('[data-build-add]'),remove=event.target.closest('[data-build-remove]');
    if(!add&&!remove)return;
    if(remove)picked.delete(remove.dataset.buildRemove);
    else if(picked.has(add.dataset.buildAdd))picked.delete(add.dataset.buildAdd);
    else picked.add(add.dataset.buildAdd);
    renderSelection();
  });
  form.addEventListener('input',()=>{status.textContent=''});
  form.addEventListener('submit',event=>{
    event.preventDefault();
    const fields=new FormData(form);
    const set={
      samples:buttons.filter(b=>picked.has(b.dataset.buildAdd)).map(itemName),
      requested:fields.get('requestedItems').trim(),
      budget:fields.get('budget').trim(),
      packaging:fields.get('packaging'),
      occasion:fields.get('occasion').trim()
    };
    if(!set.samples.length&&!set.requested){status.textContent='เลือกภาพอย่างน้อย 1 รายการ หรือพิมพ์ของที่ต้องการในชุด';form.elements.requestedItems.focus();return;}
    const qty=Number(fields.get('sets'));
    if(!Number.isInteger(qty)||qty<1||qty>1000000){form.elements.sets.reportValidity();return;}
    let bundle=basket.find(row=>isCustomSet(row)&&JSON.stringify(row.set)===JSON.stringify(set));
    if(!bundle){
      if(basket.length>=100){status.textContent='รายการขอราคาเต็ม กรุณานำรายการเดิมออกก่อนบันทึกชุด';return;}
      bundle={id:'set-'+Array.from(crypto.getRandomValues(new Uint32Array(3)),v=>v.toString(36)).join('-'),quantity:qty,set};
      basket.push(bundle);
    } else bundle.quantity=qty;
    const target=new URL(base+'/contact',location.origin);
    if(save())target.searchParams.set('bundle',bundle.id);
    else target.hash=new URLSearchParams({set:setDescription(set),sets:String(qty),budget:set.budget}).toString();
    location.assign(target);
  });
  renderSelection();
}
const orderReference=$('#order-reference');
if(orderReference){
  const chat=$('[data-order-chat]');
  const profile=chat.href;
  orderReference.addEventListener('input',()=>{
    const ref=orderReference.value.trim();
    chat.href=ref?'https://line.me/R/oaMessage/%40smartgiftthailand/?'+encodeURIComponent('ขอสอบถามสถานะคำสั่งซื้อ เลขอ้างอิง '+ref):profile;
  });
}
document.addEventListener('smartgift:catalog-view', () => { initCatalogue(); sync(); });
initCatalogue();showBasket();})();
