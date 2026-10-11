const d=require('./src/data/dataset.json')
const x=d.items.find(i=>i.title.includes('低钠盐'))
console.log('低钠盐 备注结尾:', JSON.stringify(x.note.slice(-80)))
const leak=d.items.filter(i=>i.note.includes('```')||i.sources.includes('```')).length
console.log('疑似代码块泄漏:',leak)
const empty=d.items.filter(i=>!i.note||!i.sources||!i.benefitDetail).length
console.log('完整字段缺失:',empty)
// URL 提取检查
const withUrl=d.items.filter(i=>/https?:\/\//.test(i.sources)).length
console.log('来源含链接:',withUrl)
