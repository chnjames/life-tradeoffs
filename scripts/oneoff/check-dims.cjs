const fs = require('fs')
const d = JSON.parse(fs.readFileSync('src/data/dataset.json','utf8'))

console.log('=== 我的 dataset ===')
console.log('条目数:', d.items.length)
const chaps = {}
d.items.forEach(i=>{ chaps[i.ch] = chaps[i.ch]||{name:i.chname,n:0}; chaps[i.ch].n++ })
console.log('章节数:', Object.keys(chaps).length)

// 字段非空覆盖率
const cov = f => d.items.filter(i=>i[f]&&String(i[f]).length).length
;['money','time','will','benefit','metric','evidence','plain'].forEach(f=>
  console.log(`字段 ${f} 非空: ${cov(f)}/${d.items.length}`))

// plain 长度分布（是否被截断）
const lens = d.items.map(i=>(i.plain||'').length)
console.log('plain 长度 min/中位/max:', Math.min(...lens), lens.sort((a,b)=>a-b)[Math.floor(lens.length/2)], Math.max(...lens))

// 原书快照里每条的完整字段 vs 我提取的：看一条原始结构
const raw = fs.readFileSync('scripts/source/hltb.html','utf8').replace(/\\n/g,'\n')
const i = raw.indexOf('### 1. 系安全带')
const block = raw.slice(i, raw.indexOf('### 2.', i))
console.log('\n=== 原书第1节第1条 原始正文字数 ===', block.length)
console.log('原书该条字段:', (block.match(/^- .+：/gm)||[]).map(s=>s.trim()))
