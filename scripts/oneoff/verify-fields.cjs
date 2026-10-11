const fs=require('fs')
const d=JSON.parse(fs.readFileSync('src/data/dataset.json','utf8'))
console.log('items:',d.items.length)
const cov=f=>d.items.filter(i=>i[f]&&i[f].length).length
;['plain','costDetail','benefitDetail','sources','note'].forEach(f=>{
  const lens=d.items.map(i=>(i[f]||'').length)
  console.log(`${f}: 非空${cov(f)} 长度min/中位/max ${Math.min(...lens)}/${lens.sort((a,b)=>a-b)[lens.length>>1]}/${Math.max(...lens)}`)
})
const x=d.items[0]
console.log('\n--- 样条:',x.title,'---')
console.log('成本:',x.costDetail.slice(0,120))
console.log('收益:',x.benefitDetail.slice(0,200))
console.log('来源:',x.sources.slice(0,150))
console.log('备注:',x.note.slice(0,150))
