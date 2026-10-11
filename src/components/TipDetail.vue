<script setup lang="ts">
import { computed } from 'vue'
import { ref } from 'vue'
import type { LifeItem } from '../types'
import Icon from './Icon.vue'
import { metaParts, metricLabel, evDot, evShort, evLong } from '../labels'
import {
  isFavorite, toggleFavorite, getStatus, setStatus,
  getLearn, setLearn, habitDoneToday, toggleHabitToday, habitStreak,
  type ItemStatus, type LearnStatus,
} from '../store'
import { go } from '../router'

const props = defineProps<{ item: LifeItem }>()

// 条目级出处（懒加载，不进首屏包）
interface CommitRef { hash: string; date: string; msg?: string; url: string }
interface ProvEntry { first: { hash: string; date: string; url: string } | null; recent: CommitRef[] }
const provenance = ref<ProvEntry | null>(null)
;(async () => {
  try {
    const mod = await import('../data/provenance.json')
    provenance.value = (mod.default.items as Record<string, ProvEntry>)[props.item.ch + '-' + props.item.num] ?? null
  } catch { provenance.value = null }
})()

const sources = computed(() => {
  const raw = props.item.sources.trim()
  if (!raw) return []
  return raw.split(/[；;]\s*/).filter(Boolean).map((chunk) => {
    const m = chunk.match(/<?(https?:\/\/[^\s>]+)>?/)
    let url = ''; let cite = chunk
    if (m) { url = m[1]; cite = chunk.slice(0, m.index).replace(/[<\s]*$/, '').trim() }
    cite = cite.replace(/\s+/g, ' ').replace(/[.\s]*$/, '')
    if (!cite && url) { try { cite = new URL(url).hostname.replace(/^www\./, '') } catch { cite = '原文链接' } }
    return { cite, url }
  })
})

// 低调的“我的记录”操作
const fav = computed({ get: () => isFavorite(props.item), set: (v: boolean) => { if (v !== isFavorite(props.item)) toggleFavorite(props.item) } })
const status = computed<ItemStatus>({ get: () => getStatus(props.item), set: (v) => setStatus(props.item, v) })
const learn = computed<LearnStatus>(() => getLearn(props.item))
function toggleLearn(s: LearnStatus) { setLearn(props.item, getLearn(props.item) === s ? '' : s) }
const habitOn = computed(() => habitDoneToday(props.item))
function toggleHabit() { toggleHabitToday(props.item) }
const streak = computed(() => habitStreak(props.item))
function back() { if (window.history.length > 1) window.history.back(); else go('/') }
</script>

<template>
  <article class="tip view-fade">
    <button class="back" @click="back">
      <Icon name="back" style="width:15px;height:15px" /> 返回
    </button>

    <nav class="crumbs">
      <a :href="'#/handbook/' + item.ch" @click.prevent="go('/handbook/' + item.ch)">第 {{ item.ch }} 节 · {{ item.chname }}</a>
    </nav>

    <h1 class="tip-title">{{ item.title }}</h1>
    <div class="tip-meta">
      <span class="evmeta"><span class="d" :class="evDot(item.evidence)"></span>{{ evShort(item.evidence) }}</span>
      <template v-for="(m, i) in metaParts(item)" :key="i"><span class="sep">·</span><span>{{ m }}</span></template>
      <template v-if="metricLabel(item.metric)"><span class="sep">·</span><span>{{ metricLabel(item.metric) }}</span></template>
    </div>

    <p v-if="item.plain" class="lead">{{ item.plain }}</p>

    <div class="blocks">
      <section v-if="item.costDetail" class="block">
        <h4>要花什么</h4><p>{{ item.costDetail }}</p>
      </section>
      <section v-if="item.benefitDetail" class="block">
        <h4>能换回什么</h4><p>{{ item.benefitDetail }}</p>
      </section>
      <section v-if="item.note" class="block note">
        <h4>补充与边界</h4><p>{{ item.note }}</p>
      </section>

      <section class="block evidence">
        <h4>依据有多可靠</h4>
        <p class="ev-line">
          <span class="d" :class="evDot(item.evidence)"></span>
          <strong>{{ evShort(item.evidence) }}</strong> — {{ evLong(item.evidence) }}
        </p>
      </section>

      <section v-if="sources.length" class="block">
        <h4>原文出处</h4>
        <ul class="srcs">
          <li v-for="(r, i) in sources" :key="i">
            <span class="cite">{{ r.cite }}</span>
            <a v-if="r.url" :href="r.url" target="_blank" rel="noopener nofollow">查看原文 ↗</a>
          </li>
        </ul>
      </section>

      <!-- 条目级 git 出处：据原仓库提交历史 -->
      <section v-if="provenance && (provenance.first || provenance.recent.length)" class="block history">
        <h4>资料更新记录</h4>
        <p v-if="provenance.first" class="since">
          最早收录于原书 {{ provenance.first.date }} 的提交
          <a :href="provenance.first.url" target="_blank" rel="noopener">{{ provenance.first.hash }}</a>
        </p>
        <ul v-if="provenance.recent.length" class="commits">
          <li v-for="c in provenance.recent" :key="c.hash">
            <span class="c-date">{{ c.date.slice(5) }}</span>
            <a :href="c.url" target="_blank" rel="noopener" class="c-hash">{{ c.hash }}</a>
            <span class="c-msg">{{ c.msg }}</span>
          </li>
        </ul>
        <p class="hist-note">据原仓库 git 提交历史按本条标题匹配，仅反映书中文本的改动。</p>
      </section>
    </div>

    <!-- 闭环操作：低调收在底部，不打扰阅读 -->
    <div class="mine">
      <div class="mine-h">记一下（只存在你这台设备）</div>
      <div class="mine-row">
        <button class="act" :class="{ on: fav }" @click="fav = !fav">
          <Icon name="star" style="width:15px;height:15px" />{{ fav ? '已在清单' : '加入清单' }}
        </button>
        <button class="act" :class="{ on: learn === 'review' }" @click="toggleLearn('review')">加入温习</button>
        <button class="act" :class="{ on: habitOn }" @click="toggleHabit">
          每日打卡<span v-if="streak"> · 连续 {{ streak }}</span>
        </button>
        <button class="act" :class="{ on: status === 'done' }" @click="status = status === 'done' ? '' : 'done'">
          <Icon name="check" style="width:15px;height:15px" />{{ status === 'done' ? '已做到' : '做到了' }}
        </button>
        <button class="act mute" :class="{ on: status === 'skip' }" @click="status = status === 'skip' ? '' : 'skip'">暂不适合</button>
      </div>
    </div>
  </article>
</template>

<style scoped>
.crumbs { font-size: 13px; color: var(--muted); margin-bottom: 18px; }
.crumbs a { color: var(--muted); text-decoration: none; }
.crumbs a:hover { color: var(--accent); }
.tip-title { font-size: 30px; line-height: 1.4; font-weight: 700; color: var(--ink); margin-bottom: 14px; letter-spacing: -0.01em; }
.tip-meta { display: flex; flex-wrap: wrap; gap: 8px; font-size: 13px; color: var(--muted); padding-bottom: 20px; border-bottom: 1px solid var(--line); }
.tip-meta .sep { color: var(--line); }
.lead { font-size: 17px; line-height: 1.85; color: var(--ink); margin: 24px 0 8px; font-weight: 500; }

.blocks { margin-top: 18px; display: flex; flex-direction: column; gap: 26px; }
.block h4 { font-size: 13px; letter-spacing: 0.06em; color: var(--accent-deep); font-weight: 700; margin-bottom: 8px; }
.block p { font-size: 15px; line-height: 1.9; color: var(--body); white-space: pre-wrap; }
.block.note p { color: var(--body); }
.ev-line { display: flex; align-items: baseline; gap: 8px; }
.ev-line .d { width: 8px; height: 8px; border-radius: 50%; flex: none; align-self: center; }
.ev-line strong { color: var(--ink); }
.evmeta .d.dot-a, .d.dot-a { background: var(--ev-a); }
.evmeta .d.dot-b, .d.dot-b { background: var(--ev-b); }
.evmeta .d.dot-c, .d.dot-c { background: var(--ev-c); }

.srcs { list-style: none; display: flex; flex-direction: column; gap: 9px; }
.srcs li { display: flex; gap: 12px; font-size: 13.5px; line-height: 1.6; flex-wrap: wrap; }
.srcs .cite { color: var(--muted); flex: 1; min-width: 200px; }
.srcs a { color: var(--accent-ink); text-decoration: none; white-space: nowrap; }
.srcs a:hover { text-decoration: underline; }

.history .since { font-size: 13px; color: var(--muted); margin-bottom: 10px; }
.history .since a { font-family: ui-monospace, Menlo, monospace; font-size: 12px; }
.commits { list-style: none; display: flex; flex-direction: column; gap: 8px; margin-bottom: 8px; }
.commits li { display: flex; gap: 10px; font-size: 12.5px; line-height: 1.55; align-items: baseline; }
.c-date { color: var(--faint); flex: none; font-variant-numeric: tabular-nums; }
.c-hash { color: var(--accent-ink); text-decoration: none; font-family: ui-monospace, Menlo, monospace; font-size: 11.5px; flex: none; }
.c-hash:hover { text-decoration: underline; }
.c-msg { color: var(--muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.hist-note { font-size: 11.5px; color: var(--faint); }

.mine { margin-top: 40px; padding-top: 22px; border-top: 1px solid var(--line); }
.mine-h { font-size: 12.5px; color: var(--faint); letter-spacing: 0.05em; margin-bottom: 12px; }
.mine-row { display: flex; flex-wrap: wrap; gap: 9px; }
.act {
  display: inline-flex; align-items: center; gap: 6px; cursor: pointer;
  font-size: 13.5px; color: var(--muted); background: transparent;
  border: 1px solid var(--line); border-radius: 999px; padding: 8px 16px; transition: .15s;
}
.act:hover { border-color: var(--accent); color: var(--ink); }
.act.on { background: var(--accent-wash); border-color: var(--accent); color: var(--accent-deep); font-weight: 600; }
.act.mute.on { color: var(--muted); border-color: var(--line); background: var(--wash); }
@media (max-width: 720px) { .tip-title { font-size: 24px; } }
</style>
