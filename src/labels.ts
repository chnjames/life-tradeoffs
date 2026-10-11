// 把数据里的代码值翻译成普通人能看懂的克制短句。
// 列表/详情里以 13px 灰字呈现，没有值就不显示。
import type { LifeItem } from './types'
import { evidenceLabel } from './types'

// 花钱
const MONEY: Record<string, string> = {
  '0': '几乎不花钱',
  '少': '花点小钱',
  '中': '有一定花费',
  '多': '花费较多',
}
// 时间
const TIME: Record<string, string> = {
  '顺手': '顺手可做',
  '少': '花几分钟',
  '中': '要花几小时',
  '多': '长期投入',
}
// 毅力
const WILL: Record<string, string> = {
  '否': '不用毅力',
  '些': '一点坚持',
  '多': '很靠坚持',
}
// 换回什么（口径）
const METRIC: Record<string, string> = {
  '寿命': '换回寿命',
  '钱': '换回金钱',
  '时间': '换回时间精力',
  '自由': '换回人身自由',
}

export function metaParts(it: LifeItem): string[] {
  const out: string[] = []
  if (it.money && MONEY[it.money]) out.push(MONEY[it.money])
  if (it.time && TIME[it.time]) out.push(TIME[it.time])
  if (it.will && WILL[it.will]) out.push(WILL[it.will])
  return out
}

export function metricLabel(m: string): string {
  return METRIC[m] ?? ''
}

// 证据：一个色点级别（供前端配色）+ 通俗短词
export function evDot(ev: string): string {
  return ev === 'A' ? 'dot-a' : ev === 'B' ? 'dot-b' : ev === 'C' ? 'dot-c' : 'dot-none'
}
export function evShort(ev: string): string {
  return evidenceLabel(ev).short
}
export function evLong(ev: string): string {
  return evidenceLabel(ev).long
}
