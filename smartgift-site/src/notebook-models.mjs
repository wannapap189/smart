import {smartNotebookName} from './notebook-selection.mjs';
import { readFileSync } from 'node:fs';

const models = JSON.parse(readFileSync(new URL('./notebook-models.json', import.meta.url), 'utf8'));
const powerModels = JSON.parse(readFileSync(new URL('./power-notebook-models.json', import.meta.url), 'utf8'));

export const powerNotebookIds = powerModels.map(model => model.productId);
export const notebookModelIds = [...models.map(model => model.productId), ...powerNotebookIds];

export const notebookComponents = models.map(({ id, name, description, image }) => ({
  id, name, description, image
}));

export const powerQuoteQuantity = 20;
const aliases = ['สมุดโน้ต', 'สมุดโน๊ต', 'สมุดจด', 'สมุดบันทึก', 'สมุดพิมพ์โลโก้', 'notebook'];
export const notebookRows = [...models, ...powerModels].map(model => {
  const { productId, name, description, image, factoryCode, minimumOrder } = model;
  const groups = [['ลักษณะของสมุด', [description]]];
  if (factoryCode) {
    const facts = ['รหัสรุ่นโรงงาน '+factoryCode];
    if (minimumOrder) facts.push('ขั้นต่ำการผลิตตามแคตตาล็อกโรงงาน '+minimumOrder+' เล่ม');
    groups.push(['ข้อมูลรุ่นจากโรงงาน', facts]);
  }
  groups.push(['สั่งทำสมุดพร้อมโลโก้', ['ระบุจำนวนเล่มที่ต้องการและส่งแบบโลโก้ เพื่อให้ทีมเสนอราคาและแนะนำตำแหน่งบนปกสำหรับรุ่นนี้']]);
  const powerAliases = [smartNotebookName, 'สมุดโน้ตอัจฉริยะ', 'สมุดอัจฉริยะ', 'สมุดโน๊ตเพาเวอร์แบงค์', 'สมุดพาวเวอร์แบงก์', 'สมุดพาวเวอร์แบงค์', 'สมุดพร้อมแบตเตอรี่สำรอง', 'power bank notebook'];
  const quoteNote = factoryCode
    ? 'ขอราคาตั้งแต่ '+powerQuoteQuantity+' ชุดต่อรุ่น (1 เล่มต่อชุด)'+(minimumOrder
      ? ' โรงงานระบุขั้นต่ำงานสั่งผลิต '+minimumOrder+' เล่ม สำหรับยอดต่ำกว่านี้ ทีมจะตรวจสอบกับโรงงานก่อนยืนยันราคาและการผลิต'
      : ' ส่งแบบโลโก้ให้ทีมยืนยันราคาและกำหนดส่ง')
    : '';
  return [productId, name, ['office'], image, groups,
    quoteNote, [], factoryCode ? [...aliases, ...powerAliases, factoryCode] : aliases, 'เล่ม',
    factoryCode ? 'ภาพและข้อมูลรุ่นจากแค็ตตาล็อกสมุดของโรงงาน' : 'ภาพสมุดรายรุ่นจากแค็ตตาล็อกสินค้าแยกชิ้นสำหรับชุดของขวัญ', factoryCode, minimumOrder, factoryCode ? powerQuoteQuantity : undefined];
});
