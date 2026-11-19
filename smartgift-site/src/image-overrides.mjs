import fs from 'node:fs/promises';
// Reviewed replacements only. Supplier originals are retained outside public assets.
export const imageOverrides={
 '443':{image:'/assets/localized/gu-443-clean-v1.png',gallery:['/assets/localized/gu-443-clean-v1.png'],catalogStatusTh:'ภาพแค็ตตาล็อกปรับแต่งด้วย AI เพื่อลบลายน้ำ ตรวจเทียบตัวอย่างจริงก่อนสั่งผลิต'},
 '5158':{image:'/assets/localized/gu-5158-clean-v1.png',gallery:['/assets/localized/gu-5158-clean-v1.png'],catalogStatusTh:'ภาพแค็ตตาล็อกปรับแต่งด้วย AI เพื่อลบลายน้ำ ตรวจเทียบตัวอย่างจริงก่อนสั่งผลิต'},
 '499':{image:'/assets/localized/gu-499-th-v1.png',gallery:['/assets/localized/gu-499-th-v1.png'],catalogStatusTh:'ภาพแค็ตตาล็อกปรับแต่งด้วย AI และจัดข้อความภาษาไทย ตรวจเทียบแบบจริงก่อนสั่งผลิต',descriptionTh:'เสื้อโปโลแขนสั้น ผ้าฝ้าย 100% น้ำหนักผ้า 230 กรัม/ตร.ม. ตามภาพแค็ตตาล็อก\nปรับสีคอและปลายแขน พร้อมสกรีนหรือปักโลโก้ตามแบบ\nขนาดในตาราง S / M / L / XL / XXL\nความกว้างอก 44 / 49 / 54 / 59 / 64 ซม.\nความยาวเสื้อ 62 / 67 / 72 / 77 / 82 ซม.\nความยาวแขน 19 / 20 / 21 / 22 / 23 ซม.\nยืนยันขนาด สี และแบบก่อนสั่งผลิต'},
};
export async function applyImageOverrides(root){
 for(const name of ['catalog','featured']){
  const file=root+'/data/'+name+'.json';const data=JSON.parse(await fs.readFile(file,'utf8'));const rows=Array.isArray(data)?data:data.items;
  for(const p of rows){const replacement=imageOverrides[p.id];if(replacement)Object.assign(p,replacement);}
  await fs.writeFile(file,JSON.stringify(data));
 }
}
