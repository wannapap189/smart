export const phones = [
  {label:'094 464 8884', href:'tel:+66944648884'},
  {label:'02 871 5599', href:'tel:+6628715599'},
  {label:'02 871 6399', href:'tel:+6628716399'},
];
export function phoneLinks(contactPage=false){
  return phones.map(p=>contactPage
    ? `<a class="contact-line" href="${p.href}"><b>โทร</b><span>${p.label} ↗</span></a>`
    : `<a href="${p.href}">โทร ${p.label}</a>`).join('');
}
