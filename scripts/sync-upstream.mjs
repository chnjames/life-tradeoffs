// 同步上游仓库 eternity4719/HowToLiveBetter 到 scripts/.upstream（完整历史）。
// 本地手动运行：npm run sync:upstream
// CI 每日运行后会重建数据并在有变化时开 PR。
import { execSync } from 'node:child_process'
import { existsSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const DEST = join(here, '.upstream')
const URL = 'https://github.com/eternity4719/HowToLiveBetter.git'

const run = (cmd, opts = {}) => execSync(cmd, { stdio: 'inherit', ...opts })

if (!existsSync(join(DEST, '.git'))) {
  mkdirSync(here, { recursive: true })
  run(`git clone --quiet ${JSON.stringify(URL)} ${JSON.stringify(DEST)}`)
  console.log('cloned upstream ->', DEST)
} else {
  run('git fetch --quiet origin main', { cwd: DEST })
  run('git reset --hard --quiet origin/main', { cwd: DEST })
  console.log('updated upstream -> origin/main')
}
const head = execSync('git log -1 --format="%h %cs %s"', { cwd: DEST, encoding: 'utf-8' }).trim()
console.log('HEAD:', head)
