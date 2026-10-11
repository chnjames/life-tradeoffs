// Build structured dataset from the vendored book snapshot.
// Output: src/data/dataset.json  (items + timing + scenario packs + meta)
//
// The snapshot is the offline single-file HTML released by the upstream
// project; its body text stores newlines as the two characters \ n, so we
// unescape before parsing.
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { STAGES, DOMAINS } from './taxonomy.mjs'
import { MOMENTS } from './moments.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const ROOT = join(here, '..')
const UPSTREAM = join(here, '.upstream', 'book')
const OUT_DIR = join(ROOT, 'src', 'data')
const OUT = join(OUT_DIR, 'dataset.json')

// ---- load source text ----
// Primary source: the upstream book/*.md (34 chapter files). Files are named
// `NN-章名.md`; we concatenate in chapter order with explicit `# N. 名称`
// headings so the existing position-based chapter parser keeps working.
// Fallback: the vendored single-file HTML snapshot (newlines stored as \n).
function loadBookMarkdown() {
  const files = readdirSync(UPSTREAM).filter((f) => /^\d{2}-.+\.md$/.test(f)).sort()
  if (!files.length) throw new Error('upstream book/ has no chapter files; run scripts/sync-upstream.mjs first')
  return files.map((f) => readFileSync(join(UPSTREAM, f), 'utf-8').replace(/\r\n/g, '\n').trimEnd()).join('\n\n')
}
let raw
try {
  raw = loadBookMarkdown()
} catch {
  const SNAPSHOT = join(here, 'source', 'hltb.html')
  raw = readFileSync(SNAPSHOT, 'utf-8').replace(/\\n/g, '\n')
}

// ---- chapters ----
const chapters = []
for (const m of raw.matchAll(/^# (\d+)\. (.+)$/gm)) {
  chapters.push({ pos: m.index, ch: Number(m[1]), name: m[2].trim() })
}
const chapterAt = (pos) => {
  let cur = chapters[0]
  for (let k = 0; k < chapters.length; k++) {
    if (chapters[k].pos <= pos && (k === chapters.length - 1 || pos < chapters[k + 1].pos)) {
      cur = chapters[k]
    }
  }
  return cur || { ch: 0, name: '前言' }
}

// ---- fields ----
const fieldAfter = (tail, name) => {
  const m = tail.match(new RegExp('-\\s*' + name + '：([\\s\\S]*?)(?:\\n- |\\n### |$)'))
  return m ? m[1].replace(/\s+/g, ' ').trim() : ''
}
// Full-length field: preserve internal newlines (used for 收益/来源/备注).
// Stop at the next field, the next item (###), a chapter heading (#) or a
// markdown fence that signals we have crossed out of the item block.
const fieldFull = (tail, name) => {
  const m = tail.match(new RegExp('-\\s*' + name + '：([\\s\\S]*?)(?:\\n- [^\\n]*：|\\n#{1,3} |\\n```|\\n### |$)'))
  return m ? m[1].trim() : ''
}

// ---- items ----
const items = []
for (const m of raw.matchAll(/^### (\d+)\. (.+)$/gm)) {
  const pos = m.index
  const tail = raw.slice(pos, pos + 6000)
  const tags = {}
  const tagm = tail.match(/<!--\s*成本标签:\s*(.*?)-->/)
  if (tagm) {
    for (const kv of tagm[1].matchAll(/(\S+)=(\S+)/g)) tags[kv[1]] = kv[2]
  }
  const evm = tail.match(/-\s*证据等级：\s*([ABC])/)
  const c = chapterAt(pos)
  items.push({
    ch: c.ch, chname: c.name, num: Number(m[1]),
    title: m[2].trim(),
    money: tags['钱'] ?? '', time: tags['时间'] ?? '', will: tags['毅力'] ?? '',
    benefit: tags['收益'] ?? '', metric: tags['口径'] ?? '',
    evidence: evm ? evm[1] : '',
    plain: fieldAfter(tail, '说人话'),
    costDetail: fieldFull(tail, '成本'),
    benefitDetail: fieldFull(tail, '收益'),
    sources: fieldFull(tail, '来源'),
    note: fieldFull(tail, '备注'),
  })
}

// ---- timing classification (the layer upstream does not provide) ----
const timingOf = (it) => {
  if (it.ch === 13) return 'emergency'
  if (it.ch === 16 || it.ch === 34) return 'manage'
  if (/仲裁|时效|期限|登记|领证|之前|岁|窗口|身份|报到|催告|申报/.test(it.title)) return 'window'
  if (it.ch === 27) return 'window'
  return 'prevent'
}
items.forEach((it) => { it.timing = timingOf(it) })

// ---- scenario packs: cross-chapter aggregation by keyword ----
const byKey = new Map(items.map((i) => [i.ch + '-' + i.num, i]))
const collect = (rules, limit) => {
  const seen = new Set(); const out = []
  for (const [ch, kws] of rules) {
    for (const it of items) {
      if (it.ch !== ch) continue
      if (kws.length && !kws.some((k) => it.title.includes(k))) continue
      const key = it.ch + '-' + it.num
      if (!seen.has(key)) { seen.add(key); out.push({ ch: it.ch, num: it.num }) }
    }
  }
  return out.slice(0, limit)
}

// Build moments into scenario-shaped objects (ordered refs + phase label).
const scenarios = MOMENTS.map((m) => ({
  key: m.key, icon: m.icon, desc: m.desc, phase: m.phase,
  refs: collect(m.rules, 12),
}))

// sanity checks
const missing = scenarios.flatMap((s) =>
  s.refs.filter((r) => !byKey.has(r.ch + '-' + r.num)).map((r) => s.key + ':' + r.ch + '-' + r.num))
if (missing.length) throw new Error('Scenario refs missing: ' + missing.join(', '))

mkdirSync(OUT_DIR, { recursive: true })

// 上游资料版本（来自 scripts/.upstream 的 HEAD），没有 clone 时省略
let upstreamHead = null
try {
  const g = (args) => execSync('git -C ' + JSON.stringify(join(here, '.upstream')) + ' ' + args, { encoding: 'utf-8' }).trim()
  const hash = g('rev-parse HEAD')
  upstreamHead = {
    hash: hash.slice(0, 7),
    date: g('log -1 --format=%cs'),
    url: `https://github.com/eternity4719/HowToLiveBetter/commit/${hash}`,
  }
} catch { /* snapshot mode without cloned upstream */ }

const dataset = {
  meta: {
    generatedAt: new Date().toISOString(),
    itemCount: items.length,
    source: 'upstream book/*.md',
    upstream: 'https://github.com/eternity4719/HowToLiveBetter',
    upstreamHead,
    license: 'CC BY 4.0 (upstream content)',
  },
  items, scenarios, stages: STAGES, domains: DOMAINS,
}
writeFileSync(OUT, JSON.stringify(dataset, null, 1))
console.log('items:', items.length)
console.log('moments:', scenarios.map((s) => s.key + '=' + s.refs.length).join(', '))
console.log('stages:', STAGES.length, 'domains:', DOMAINS.length)
console.log('->', OUT)
