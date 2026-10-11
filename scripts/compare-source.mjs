// 用 upstream book/*.md 重建 dataset，并与基线（html 快照产出的 dataset）逐条比对。
// 用法: node scripts/compare-source.mjs
import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const ROOT = join(here, '..')
const OUT = join(ROOT, 'src', 'data', 'dataset.json')

const before = JSON.parse(readFileSync(OUT, 'utf-8'))
execSync('node ' + JSON.stringify(join(here, 'build-data.mjs')), { stdio: 'inherit', cwd: ROOT })
const after = JSON.parse(readFileSync(OUT, 'utf-8'))

const key = (i) => i.ch + '-' + i.num
const bm = new Map(before.items.map((i) => [key(i), i]))
const am = new Map(after.items.map((i) => [key(i), i]))

const added = [...am.keys()].filter((k) => !bm.has(k))
const removed = [...bm.keys()].filter((k) => !am.has(k))
const titleChanged = [...am.keys()].filter((k) => bm.has(k) && bm.get(k).title !== am.get(k).title)
const fieldChanged = [...am.keys()].filter((k) => bm.has(k) &&
  ['plain', 'evidence', 'money', 'time', 'will'].some((f) => String(bm.get(k)[f]) !== String(am.get(k)[f])))

console.log('\n=== 比对结果 ===')
console.log('before items:', before.items.length, ' after items:', after.items.length)
console.log('added:', added.length, added.slice(0, 20))
console.log('removed:', removed.length, removed.slice(0, 20))
console.log('titleChanged:', titleChanged.length, titleChanged.slice(0, 20))
console.log('plain/evidence/tag changed:', fieldChanged.length, fieldChanged.slice(0, 30))
if (added.length || removed.length || titleChanged.length) {
  console.log('❗ 存在结构性差异，需要人工确认')
} else {
  console.log('✅ 条目 key 与标题完全一致')
}
