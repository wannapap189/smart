# SmartGift Thailand

เว็บไซต์สินค้าพรีเมียมและชุดของขวัญองค์กรของ SmartGift Thailand ประกอบด้วยข้อมูลหน้าสินค้า แคตตาล็อก บทความ และช่องทางขอใบเสนอราคา

## เปิดเว็บไซต์บนเครื่อง

ติดตั้ง Python 3.11 ขึ้นไปและ Node.js 24 จากนั้นรันคำสั่งในโฟลเดอร์หลักของ repository

```shell
python restore-media.py
cd smartgift-site
node serve.mjs
```

เปิด [หน้าแรก](http://127.0.0.1:4173/smartgift/) เพื่อดูเว็บ โปรแกรมโหลดภาพ วิดีโอ และ PDF จาก [GitHub Release](https://github.com/wannapap189/smart/releases/tag/web-2026-11-19) และตรวจ SHA-256 ก่อนนำมาใช้ สามารถดาวน์โหลดแพ็กจากหน้า Release เอง แล้วใช้ `python restore-media.py --archives PATH` โดยแทน PATH ด้วยโฟลเดอร์ที่เก็บแพ็กทั้งหมด

## แก้และตรวจเว็บ

แก้ไฟล์ใน `smartgift-site/src` แล้วรันคำสั่งต่อไปนี้จากโฟลเดอร์ `smartgift-site` หลังติดตั้งสื่อแล้ว

```shell
node src/build.mjs
node src/verify.mjs
```

[llms.txt](llms.txt) รวบรวมลิงก์หลักสำหรับค้นข้อมูล SmartGift ส่วน [รายการสื่อและค่า SHA-256](media-manifest.json) ใช้ตรวจฉบับของไฟล์ดาวน์โหลด

