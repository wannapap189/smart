import {snowRoute,snowPath} from './snow-globe.mjs';
// Local preview remains noindex. These are the intended public canonical URLs;
// this module does not publish the site or enable production indexing.
export const publicOrigin='https://www.smartgiftthailand.com';
export const preservedPagePaths=new Map([
 ['', '/'],
 [snowRoute,snowPath],
 ['/portfolio','/portfolio/'],
 ['/about','/about-us/'],
 ['/contact','/contact-us/'],
]);
export const canonicalPath=route=>preservedPagePaths.get(route)??'/smartgift'+route;
export const excludedSitemapRoutes=new Set(['/catalog','/ideas','/customize-gift-set','/quote-basket','/search','/logo-preview','/image-style-preview','/404']);
export function generalPageSchema(route,title,description){
 const pageUrl=publicOrigin+canonicalPath(route),orgId=publicOrigin+'/#organization';
 const org={'@type':'Organization','@id':orgId,name:'SmartGift Thailand',url:publicOrigin+'/',logo:publicOrigin+'/assets/logo.svg',telephone:['+66944648884','+6628715599','+6628716399'],sameAs:['https://www.facebook.com/SmartGiftThailand/','https://line.me/R/ti/p/@smartgiftthailand']};
 const page={'@type':route==='/portfolio'?'CollectionPage':route==='/about'?'AboutPage':route==='/contact'?'ContactPage':'WebPage','@id':pageUrl,url:pageUrl,name:title,description,inLanguage:'th-TH',isPartOf:{'@id':publicOrigin+'/#website'}};
 const graph=[org,{'@type':'WebSite','@id':publicOrigin+'/#website',url:publicOrigin+'/',name:'SmartGift Thailand',inLanguage:'th-TH',publisher:{'@id':orgId}},page];
 if(route)graph.push({'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'หน้าแรก',item:publicOrigin+'/'},{'@type':'ListItem',position:2,name:title,item:pageUrl}]});
 return {'@context':'https://schema.org','@graph':graph};
}
