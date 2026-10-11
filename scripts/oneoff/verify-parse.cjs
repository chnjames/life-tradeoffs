// replicate the parse to verify records
const d=require('./src/data/dataset.json')
function parse(raw){
  return raw.trim().split(/[；;]\s*/).filter(Boolean).map(chunk=>{
    const um=chunk.match(/<?(https?:\/\/[^\s>]+)>?/)
    let url='',cite=chunk
    if(um){url=um[1];cite=chunk.slice(0,um.index).replace(/[<\s]*$/,'').trim()}
    cite=cite.replace(/\s+/g,' ').replace(/[.\s]*$/,'')
    return {cite,url}
  })
}
const x=d.items.find(i=>i.title.includes('低钠盐'))
console.log('低钠盐:',JSON.stringify(parse(x.sources),null,1))
const y=d.items.find(i=>i.title.includes('系安全带'))
console.log('安全带条数:',parse(y.sources).length)
parse(y.sources).forEach(r=>console.log(' -',r.cite.slice(0,60),'|',r.url?'有链接':'无链接'))
// 全库：引用为空的异常
let bad=0
d.items.forEach(i=>parse(i.sources).forEach(r=>{if(!r.cite)bad++}))
console.log('引用文字为空的记录数:',bad)
