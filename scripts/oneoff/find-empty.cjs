const d=require('./src/data/dataset.json')
function parse(raw){
  return raw.trim().split(/[；;]\s*/).filter(Boolean).map(chunk=>{
    const um=chunk.match(/<?(https?:\/\/[^\s>]+)>?/)
    let url='',cite=chunk
    if(um){url=um[1];cite=chunk.slice(0,um.index).replace(/[<\s]*$/,'').trim()}
    cite=cite.replace(/\s+/g,' ').replace(/[.\s]*$/,'')
    return {cite,url,raw:chunk}
  })
}
d.items.forEach(i=>parse(i.sources).forEach(r=>{
  if(!r.cite)console.log('【'+i.title+'】',JSON.stringify(r.raw))
}))
