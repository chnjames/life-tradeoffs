// 生成条目级出处账本 src/data/provenance.json
//
// 对每条（ch-num）在上游 git 历史里找出“碰过这条”的提交：
// 用 `git log -L` 成本太高（676 条 × 383 提交），改为按文件取提交列表，
// 再用固定锚点 `### N.` 在该提交的对应章节文件里判断该条是否存在/被改。
// 为控成本，每条只保留：首次收录 first + 最近 RECENT 条。
//
// 依赖 scripts/.upstream 是 eternity4719/HowToLiveBetter 的完整 clone。
import { execSync } from 'node:child_process'
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const ROOT = join(here, '..')
const UP = join(here, '.upstream')
const OUT_DIR = join(ROOT, 'src', 'data')
const RECENT = 3

function git(args, { allowFail = false } = {}) {
  try {
    return execSync('git -C ' + JSON.stringify(UP) + ' ' + args, { encoding: 'utf-8', maxBuffer: 1 << 28 }).trim()
  } catch (e) {
    if (allowFail) return ''
    throw e
  }
}

if (!existsSync(join(UP, '.git'))) {
  console.error('缺少 scripts/.upstream（上游完整 clone），跳过 provenance。')
  process.exit(0)
}

// 数据集里现有的条目
const dataset = JSON.parse(readFileSync(join(OUT_DIR, 'dataset.json'), 'utf-8'))
const items = dataset.items

// 章节号 -> 文件名（NN-xxx.md）
import { readdirSync } from 'node:fs'
const fileForCh = new Map()
for (const f of readdirSync(join(UP, 'book')).filter((x) => /^\d{2}-.+\.md$/.test(x))) {
  fileForCh.set(Number(f.slice(0, 2)), 'book/' + f)
}

const headHash = git('rev-parse HEAD')
const headDate = git('log -1 --format=%cs')

// 每个章节文件的提交历史（新->旧），一次性取出，减少 git 调用
const fileCommits = new Map() // ch -> [{hash,date,msg}]
function commitsForChapter(ch) {
  if (fileCommits.has(ch)) return fileCommits.get(ch)
  const file = fileForCh.get(ch)
  let list = []
  if (file) {
    const out = git('log --format=%H%x1f%cs%x1f%s -- ' + JSON.stringify(file), { allowFail: true })
    list = out.split('\n').filter(Boolean).map((line) => {
      const [hash, date, msg] = line.split('\x1f')
      return { hash, date, msg }
    })
  }
  fileCommits.set(ch, list)
  return list
}

// 判断某提交版本里是否存在 `### num.` 锚点（用 git cat-file，避免 checkout）
const blobCache = new Map()
function hasAnchor(hash, ch, num) {
  const file = fileForCh.get(ch)
  if (!file) return false
  const key = hash + ':' + file
  let text = blobCache.get(key)
  if (text === undefined) {
    text = git('cat-file -p ' + hash + ':' + file, { allowFail: true })
    blobCache.set(key, text)
  }
  // 锚点：行首 ### num.（空格）
  return new RegExp('^### ' + num + '\\.\\s', 'm').test(text)
}

const prov = {}
let processed = 0
for (const it of items) {
  const { ch, num } = it
  const commits = commitsForChapter(ch)
  // 从新到旧找“该条存在”的提交；第一个不存在的位置之前即其生命周期
  const touching = []
  for (const c of commits) {
    if (hasAnchor(c.hash, ch, num)) touching.push(c)
    else if (touching.length) break // 走到还没有该条的更早提交，停止
  }
  const recent = touching.slice(0, RECENT).map((c) => ({
    hash: c.hash.slice(0, 7), date: c.date, msg: c.msg,
    url: `https://github.com/eternity4719/HowToLiveBetter/commit/${c.hash}`,
  }))
  const firstRaw = touching[touching.length - 1]
  prov[ch + '-' + num] = {
    first: firstRaw ? {
      hash: firstRaw.hash.slice(0, 7), date: firstRaw.date,
      url: `https://github.com/eternity4719/HowToLiveBetter/commit/${firstRaw.hash}`,
    } : null,
    recent,
  }
  processed++
}

mkdirSync(OUT_DIR, { recursive: true })
const out = {
  upstream: 'https://github.com/eternity4719/HowToLiveBetter',
  head: { hash: headHash.slice(0, 7), date: headDate,
    url: `https://github.com/eternity4719/HowToLiveBetter/commit/${headHash}` },
  generatedAt: new Date().toISOString(),
  items: prov,
}
writeFileSync(join(OUT_DIR, 'provenance.json'), JSON.stringify(out))
console.log('provenance: ' + processed + ' items @ upstream ' + headHash.slice(0, 7) + ' (' + headDate + ')')
