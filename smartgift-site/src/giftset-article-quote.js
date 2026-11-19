const officialAccount = encodeURIComponent('@smartgiftthailand');

for (const form of document.querySelectorAll('.sg-guide-quote form')) {
  const prepare = form.querySelector('[data-prepare-line]');
  const draft = form.querySelector('[data-line-draft]');
  const message = draft.querySelector('textarea');
  const chat = draft.querySelector('[data-open-line]');
  const status = draft.querySelector('[role="status"]');
  const quantity = form.elements.sets;
  prepare.hidden = false;

  form.addEventListener('submit', event => {
    if (event.submitter !== prepare) return;
    event.preventDefault();
    const count = quantity.valueAsNumber.toLocaleString('th-TH');
    message.value = `ขอใบเสนอราคาชุดของขวัญองค์กร รุ่น ${form.elements.product.value} จำนวน ${count} ชุด พร้อมโลโก้องค์กร กรุณาแจ้งราคาต่อชุด รายละเอียดกล่อง และระยะเวลาผลิต`;
    chat.href = 'https://line.me/R/oaMessage/' + officialAccount + '/?' + encodeURIComponent(message.value);
    status.textContent = '';
    draft.hidden = false;
    chat.focus();
  });

  quantity.addEventListener('input', () => {
    draft.hidden = true;
    chat.removeAttribute('href');
    message.value = '';
    status.textContent = '';
  });

  draft.querySelector('[data-copy-line]').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(message.value);
      status.textContent = 'คัดลอกข้อความแล้ว';
    } catch {
      message.focus();
      message.select();
      status.textContent = 'เลือกข้อความแล้ว กดคัดลอกเพื่อนำไปวางใน LINE';
    }
  });
}
