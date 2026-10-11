const d=require('./src/data/dataset.json')
const noHttp=d.items.filter(i=>!/https?:/.test(i.sources)).length
const multi=d.items.filter(i=>(i.sources.match(/https?:\/\//g)||[]).length>1).length
console.log('无链接:',noHttp,' 多链接:',multi)
// 看几条多链接的
d.items.filter(i=>(i.sources.match(/https?:\/\//g)||[]).length>1).slice(0,3).forEach(i=>{
  console.log('---',i.title,'---');console.log(i.sources.slice(0,400))
})
