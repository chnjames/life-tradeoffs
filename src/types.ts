export type Timing = 'emergency' | 'window' | 'prevent' | 'manage'

export interface LifeItem {
  ch: number
  chname: string
  num: number
  title: string
  money: string
  time: string
  will: string
  benefit: string
  metric: string
  evidence: '' | 'A' | 'B' | 'C'
  plain: string
  costDetail: string
  benefitDetail: string
  sources: string
  note: string
  timing: Timing
}

export interface ScenarioRef {
  ch: number
  num: number
}

export interface Scenario {
  key: string
  icon: string
  desc: string
  phase: string
  refs: ScenarioRef[]
}

export interface Stage {
  key: string
  icon: string
  age: string
  desc: string
  chapters: number[]
}

export interface Domain {
  key: string
  icon: string
  chapters: number[]
}

export interface Dataset {
  meta: {
    generatedAt: string
    itemCount: number
    source: string
    upstream: string
    upstreamHead?: { hash: string; date: string; url: string } | null
    license: string
  }
  items: LifeItem[]
  scenarios: Scenario[]
  stages: Stage[]
  domains: Domain[]
}

export interface PhaseInfo {
  key: Timing
  green: boolean
  title: string
  when: string
}

export const PHASES: PhaseInfo[] = [
  { key: 'window', green: false, title: '趁早做 · 过期难补', when: '只在特定阶段有效，拖过去就难补了' },
  { key: 'emergency', green: false, title: '出事当下 · 马上做', when: '正在发生时，先后顺序不能错' },
  { key: 'prevent', green: true, title: '平时做 · 防患未然', when: '花点小钱小时间，降低以后的风险' },
  { key: 'manage', green: true, title: '长期坚持 · 持续管理', when: '确诊之后，需要一直维持' },
]

export const PHASE_ORDER: Timing[] = ['window', 'emergency', 'prevent', 'manage']

// Evidence levels in plain language. Upstream grades A/B/C; we surface the
// meaning rather than the letter.
export const EVIDENCE_LABELS: Record<string, { short: string; long: string }> = {
  A: { short: '很可靠', long: '有具体数字，来自大型试验或多项研究汇总，最可信' },
  B: { short: '较可靠', long: '有研究支持，但样本较小或不是随机分组，可信但留有余地' },
  C: { short: '仅供参考', long: '证据较弱或主要来自经验判断，了解即可，别当成定论' },
}

export const evidenceLabel = (e: string) => EVIDENCE_LABELS[e] ?? { short: '未分级', long: '' }
