export const snowRoute = '/custom-made/snowball';
export const snowPath = '/shop/1130/ของขวัญปีใหม่/ของขวัญปีใหม่-ธีมสินค้า/ของขวัญปีใหม่-สั่งทำ-ส่ง/snowball/';
export const snowTitle = 'ลูกแก้วหิมะสั่งทำสำหรับสยามพารากอนและสยามเซ็นเตอร์';
const files = '/assets/project-portfolio/paragon-studio';
export const snowWork = {
  id: 'siam-snow-globe', brand: 'SIAM PARAGON · SIAM CENTER', kind: 'work', groups: ['retail','entertainment'],
  title: 'ลูกแก้วหิมะลิมิเต็ดสำหรับแคมเปญปลายปี 2558', image: files+'.webp', url: snowPath,
  description: 'ลูกแก้วสยามพารากอนพร้อมอักษร P สีทอง และป้ายชื่อบนฐาน',
  origin: 'วิดีโอต้นฉบับของสยามพารากอน และข่าวแคมเปญ The Season of Siam Celebration ปี 2558',
  type: 'ชมภาพและวิดีโอสินค้า', keywords: ['ลูกแก้วหิมะสั่งทำ','ของสะสมห้างสรรพสินค้า','Snow Globe']
};
export function snowPage() {
  const videos = `<figure><img src="${snowWork.image}" alt="ภาพตัวอย่างลูกแก้วหิมะสยามพารากอน อักษร P สีทองบนเสาสีงาช้าง" width="960" height="720" style="display:block;width:100%;height:auto;border-radius:16px"><figcaption>ภาพตัวอย่างสินค้า · สยามพารากอน</figcaption></figure><figure><div class="project-video-player"><video controls playsinline preload="none" style="display:block;width:100%;height:auto;aspect-ratio:4/3;object-fit:contain" poster="${snowWork.image}" aria-label="ชมลูกแก้วหิมะสยามพารากอน"><source src="${files}.mp4" type="video/mp4"></video><span class="video-watermark" aria-hidden="true">Smart Gift</span></div><figcaption>ชมรายละเอียดจากชิ้นงาน · อักษร P และเกล็ดหิมะภายในลูกแก้ว</figcaption></figure>`;
  return `<section class="section container"><div class="section-head"><div><h2>ชมลูกแก้วหิมะสยามพารากอนจากชิ้นงานจริง</h2><p>ในคลิปจากแฟ้ม SmartGift จะเห็นทั้งป้ายชื่อบนฐาน ตัวอักษร P ภายในลูกแก้ว และจังหวะที่เกล็ดหิมะค่อย ๆ ตกลงมา</p></div></div><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(260px,100%),1fr));gap:24px">${videos}</div></section>
  <section class="section soft"><div class="container"><h2>สองศูนย์การค้า สองลายสะสม</h2><p>SmartGift เคยทำลูกแก้วหิมะให้ทั้งสยามพารากอนและสยามเซ็นเตอร์ แคมเปญ The Season of Siam Celebration ในเดือนธันวาคม 2558 มอบลูกแก้วลายเฉพาะของแต่ละศูนย์ให้ลูกค้าที่ซื้อสินค้าตามเงื่อนไข</p><p>อ่านข่าวแคมเปญจาก <a href="https://retailnews.asia/siam-paragon-siam-center-welcome-festival-happiness">Retail News Asia</a> และ <a href="https://www.nationthailand.com/business/30275762">The Nation</a></p></div></section>
  <section class="section container"><h2>สั่งทำลูกแก้วหิมะสำหรับแบรนด์ของคุณ</h2><p>ส่งภาพสัญลักษณ์ อาคาร หรือคาแรกเตอร์ที่ต้องการ พร้อมจำนวนและวันใช้งาน ทีมจะช่วยวางองค์ประกอบด้านใน รูปทรงฐาน และกล่องให้เหมาะกับการมอบเป็นของขวัญหรือจำหน่ายเป็นของสะสม</p><div class="actions"><a class="button orange" href="https://line.me/R/ti/p/@smartgiftthailand">ปรึกษางานลูกแก้วหิมะทาง LINE ↗</a><a class="text-link" href="/portfolio/">ดูผลงานอื่น →</a></div></section>`;
}
