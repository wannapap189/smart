import {powerQuoteQuantity} from './notebook-models.mjs';
import {notebookRoute, powerNotebookRoute, smartNotebookName} from './notebook-selection.mjs';

export const notebookCategories = [
  {key:'notebooks', route:notebookRoute, pdfUrl:'/downloads/catalogs/notebooks.pdf', heading:'สมุดโน้ตสั่งทำแบบเล่มเดี่ยว', title:'สมุดโน้ตสั่งทำแบบเล่มเดี่ยวและสมุดพิมพ์โลโก้',
    description:'เลือกสมุดโน้ตและแพลนเนอร์สำหรับองค์กร ดูปกและขนาดของแต่ละแบบ พร้อมขอราคาตามจำนวนเล่ม'},
  {key:'power-bank-notebooks', route:powerNotebookRoute, pdfUrl:'/downloads/catalogs/power-bank-notebooks.pdf', heading:smartNotebookName, title:smartNotebookName+'สั่งทำพร้อมโลโก้',
    description:'เลือก'+smartNotebookName+'ตามรูปแบบการใช้งานและรหัสโรงงาน ขอราคาพร้อมโลโก้ได้ตั้งแต่ '+powerQuoteQuantity+' ชุดต่อรุ่น ชุดละ 1 เล่ม'}
];
