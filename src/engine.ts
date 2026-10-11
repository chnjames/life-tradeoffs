// Quiz definitions and the personalisation engine.
//
// The engine answers two questions the upstream ordering ignores:
//   1. applicability  - is this item relevant to THIS person
//   2. timing         - does it have a deadline / is it actionable now
// Importance, feasibility and evidence reuse upstream fields.
import type { LifeItem } from './types'

export interface QuizQuestion {
  t: string
  o: string[]
}

export const QUESTIONS: QuizQuestion[] = [
  { t: '你目前的人生阶段更接近？', o: ['18-25 学生或初入职场', '26-35 打拼期', '36-50 上有老下有小', '50 岁以上'] },
  { t: '家里目前有？', o: ['学龄前孩子', '上学的孩子', '需要照顾的老人', '暂时都没有'] },
  { t: '健康状况？', o: ['有慢性病在管', '一切正常', '想改善烟酒或体重'] },
  { t: '工作状态？', o: ['稳定在职', '自由职业或接单', '担心失业或正在找工作'] },
  { t: '未来一两年的大计划？', o: ['结婚或买房', '创业或做副业', '出国或留学', '没有特别计划'] },
  { t: '日常通勤方式？', o: ['开车', '骑电动车或摩托', '公共交通或步行'] },
]

// Per question index -> chapter relevance weight. Chapters that a given
// answer makes more important receive a boost.
const CHAPTER_RULES: Record<number, Record<number, number>> = {
  0: { 1: 4, 13: 3 },
  1: { 20: 4, 27: 4, 18: 3, 30: 4, 17: 3 },
  2: { 16: 4, 34: 3 },
  3: { 19: 4, 7: 3 },
  4: { 10: 4, 12: 3, 11: 3, 32: 3, 26: 3, 15: 3 },
  5: { 1: 4, 13: 3 },
}

/**
 * Score every item for the given answer vector and return the top items.
 * Returns LifeItem[] ordered by personal relevance, then evidence.
 */
export function buildPersonalList(answers: number[], items: LifeItem[], limit = 16): LifeItem[] {
  const chapterScore: Record<number, number> = {}
  answers.forEach((ai, qi) => {
    // later options are usually "none"/older -> soften the boost
    const factor = ai <= 1 ? 1 : ai === 2 ? 0.7 : 0.35
    const rules = CHAPTER_RULES[qi]
    if (rules) {
      for (const [ch, w] of Object.entries(rules)) {
        chapterScore[Number(ch)] = (chapterScore[Number(ch)] ?? 0) + w * factor
      }
    }
  })

  const scored = items.map((item) => {
    let s = chapterScore[item.ch] ?? 0
    if (item.evidence === 'A') s += 2
    if (item.benefit === '大') s += 1
    if (item.will === '否') s += 0.6
    // break ties by timing priority so windowed/urgent items surface first
    const timingBias: Record<string, number> = { window: 0.4, emergency: 0.3, prevent: 0.15, manage: 0.1 }
    s += timingBias[item.timing] ?? 0
    return { item, s }
  })

  scored.sort((a, b) => b.s - a.s)
  return scored.slice(0, limit).map((x) => x.item)
}

/**
 * Group items by timing in the canonical display order.
 * Empty timing buckets are omitted.
 */
export function groupByTiming(items: LifeItem[]): Record<string, LifeItem[]> {
  const groups: Record<string, LifeItem[]> = { window: [], emergency: [], prevent: [], manage: [] }
  for (const it of items) groups[it.timing]?.push(it)
  return groups
}
