// Reviewed against source names, complete descriptions and catalogue photographs.
// Keep the older URL. Different colours, capacities, sizes and kit contents are not merged.
export const duplicateProducts = [
  ['12500','12499'], ['12463','12462'], ['8997','8337'],
  ['8899','2713'], ['8293','7682'], ['6814','6813'],
  ['5907','5846'], ['4707','1447'], ['3875','3340'],
  ['3433','3429'], ['3432','3429'], ['3431','3429'],
  ['3413','3412'], ['11605','2183'],
].map(([id,canonicalId])=>({id,canonicalId,evidence:id==='11605'
  ?'ชื่อและรายละเอียดตรงกัน ภาพจานลายเดียวกัน ตรวจเทียบด้วยสายตาแล้ว (ไฟล์ภาพต่างการบีบอัด)'
  :'ชื่อและรายละเอียดตรงกัน พิกเซลภาพต้นทางตรงกัน และตรวจภาพประกอบแล้ว'}));

export function mergeDuplicateProducts(data,archive){
  const active=new Map(data.items.map(p=>[String(p.id),p]));
  const archived=new Map(archive.map(p=>[String(p.id),p]));
  for(const entry of duplicateProducts){
    const kept=active.get(entry.canonicalId);
    const duplicate=active.get(entry.id)||archived.get(entry.id);
    if(!kept||!duplicate)continue;
    kept.categories=[...new Set([...kept.categories,...duplicate.categories])];
    kept.searchAliases=[...new Set([...(kept.searchAliases||[]),'GU-'+entry.id])];
    if(!archived.has(entry.id)){
      const record={...duplicate,removedAt:'2026-11-18',removalKind:'duplicate',
        canonicalId:entry.canonicalId,removalReason:'รวมรายการสินค้าซ้ำเข้ากับรายการหลัก',
        duplicateEvidence:entry.evidence};
      archive.push(record);archived.set(entry.id,record);
    }
  }
}
