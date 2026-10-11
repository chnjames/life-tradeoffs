const d=require('./src/data/dataset.json')
const x=d.items.find(i=>i.title.includes('低钠盐'))
console.log('=== sources 原始字段 ===')
console.log(JSON.stringify(x.sources))
// 全库看 sources 里是否普遍含 @url: 或 markdown 链接语法
const atUrl=d.items.filter(i=>i.sources.includes('@url:')).length
const mdLink=d.items.filter(i=>/\]\(https?:/.test(i.sources)).length
const bareHttp=d.items.filter(i=!/https?:/.test(i.sources)).length
console.log('\n含 @url: 条数:',atUrl)
console.log('含 markdown ](http 条数:',mdLink)
console.log('完全无链接条数:',bareHttp)
