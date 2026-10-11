<script setup lang="ts">
import { ref } from 'vue'
import type { Dataset } from '../types'
import Icon from './Icon.vue'
import { dailyItem } from '../store'
import { evDot, evShort } from '../labels'
import { SCENARIO_ICON, DOMAIN_ICON, toneAt } from '../meta'
import { go } from '../router'

const props = defineProps<{ data: Dataset }>()
const q = ref('')
const daily = dailyItem

function submit() { go('/search' + (q.value.trim() ? '?q=' + encodeURIComponent(q.value.trim()) : '')) }
function search(term: string) { go('/search?q=' + encodeURIComponent(term)) }

const quick = ['低钠盐', '工伤', '仲裁', '彩礼', '体检', '辞职']
const primaryMoments = props.data.scenarios.slice(0, 4)
</script>

<template>
  <div class="home view-fade">
    <!-- Hero：只讲一件事，给一个动作 -->
    <header class="hero">
      <div class="kicker">非官方衍生 · {{ data.meta.itemCount }} 条已核验建议</div>
      <h1>从眼前的一件小事开始，<br /><em>看清该花什么、换回什么</em></h1>
      <p class="sub">每条建议都标明依据有多可靠、要花多少钱和时间。这是一份备选单，不是任务清单——按你的处境挑着看就好。</p>

      <form class="search" @submit.prevent="submit">
        <Icon name="search" class="s-ico" />
        <input v-model="q" class="field" placeholder="搜你正遇到的事，比如：低钠盐 / 工伤 / 仲裁" aria-label="搜索建议" />
        <button type="submit" class="btn-primary">搜索</button>
      </form>
      <div class="quick">
        <span>试试</span>
        <a v-for="t in quick" :key="t" @click="search(t)">{{ t }}</a>
      </div>
    </header>

    <!-- 懵住时刻：主推，带顺序与时间窗 -->
    <section class="block-sec">
      <div class="sec-head">
        <h2>你可能正卡在某件事上</h2>
        <button class="btn-link" @click="go('/moments')">全部 {{ data.scenarios.length }} 个时刻 <Icon name="arrow" style="width:14px;height:14px" /></button>
      </div>
      <p class="sec-sub">这些时刻步骤不能乱，已按先后顺序排好，并标出最该抓紧的时间窗。</p>
      <div class="moment-grid">
        <a v-for="(s, i) in primaryMoments" :key="s.key" class="moment" @click="go('/moment/' + s.key)">
          <span class="m-ico" :class="'bg-' + toneAt(i)"><Icon :name="SCENARIO_ICON[s.key] || 'compass'" :tone="toneAt(i)" /></span>
          <span class="m-body">
            <span class="m-title">{{ s.key }}</span>
            <span class="m-desc">{{ s.desc }}</span>
          </span>
          <span v-if="s.phase" class="m-phase">{{ s.phase }}</span>
        </a>
      </div>
    </section>

    <!-- 生活领域 -->
    <section class="block-sec">
      <div class="sec-head">
        <h2>或者，按生活领域慢慢翻</h2>
        <button class="btn-link" @click="go('/domains')">全部领域 <Icon name="arrow" style="width:14px;height:14px" /></button>
      </div>
      <div class="domain-grid">
        <a v-for="(d, i) in data.domains" :key="d.key" class="domain" @click="go('/domain/' + d.key)">
          <span class="d-ico" :class="'bg-' + toneAt(i + 1)"><Icon :name="DOMAIN_ICON[d.key] || 'grid'" :tone="toneAt(i + 1)" /></span>
          <span class="d-title">{{ d.key }}</span>
        </a>
      </div>
    </section>

    <!-- 完整手册 + 今日一条：两条安静的入口 -->
    <section class="quiet">
      <a class="handbook" @click="go('/handbook')">
        <Icon name="book" class="hb-ico" />
        <span>
          <strong>读完整手册</strong>
          <em>原书 34 节，按主题系统阅读</em>
        </span>
        <Icon name="arrow" class="hb-arrow" />
      </a>
      <a class="daily" @click="go('/tip/' + daily.ch + '-' + daily.num)">
        <span class="dly-label">今日一条</span>
        <span class="dly-title">{{ daily.title }}</span>
        <span class="dly-meta">
          <span class="evmeta"><span class="d" :class="evDot(daily.evidence)"></span>{{ evShort(daily.evidence) }}</span>
          <Icon name="arrow" style="width:14px;height:14px" />
        </span>
      </a>
    </section>
  </div>
</template>

<style scoped>
.hero { padding: 14px 0 40px; }
.kicker { font-size: 13px; color: var(--accent); letter-spacing: 0.08em; font-weight: 600; margin-bottom: 18px; }
.hero h1 { font-size: 38px; line-height: 1.38; font-weight: 700; color: var(--ink); letter-spacing: -0.01em; margin-bottom: 16px; }
.hero h1 em { font-style: normal; color: var(--accent); }
.sub { font-size: 16px; color: var(--muted); max-width: 46ch; line-height: 1.8; margin-bottom: 30px; }

.search { display: flex; align-items: center; gap: 12px; max-width: 620px; }
.s-ico { width: 20px; height: 20px; color: var(--faint); flex: none; }
.search .field { flex: 1; font-size: 16px; }
.quick { display: flex; flex-wrap: wrap; gap: 7px 16px; align-items: center; margin-top: 14px; font-size: 13.5px; color: var(--faint); padding-left: 2px; }
.quick a { color: var(--muted); cursor: pointer; }
.quick a:hover { color: var(--accent); }

.block-sec { padding: 34px 0 6px; border-top: 1px solid var(--line); }
.sec-head { display: flex; align-items: baseline; justify-content: space-between; gap: 16px; margin-bottom: 6px; }
.sec-head h2 { font-size: 23px; font-weight: 650; }
.sec-sub { font-size: 14px; color: var(--muted); margin-bottom: 22px; }

.moment-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 30px; }
.moment { display: flex; align-items: center; gap: 15px; padding: 18px 4px; border-bottom: 1px solid var(--line); cursor: pointer; text-decoration: none; transition: .15s; }
.moment:hover { padding-left: 8px; }
.m-ico { width: 48px; height: 48px; border-radius: 14px; flex: none; display: flex; align-items: center; justify-content: center; }
.m-ico svg { width: 26px; height: 26px; }
.m-body { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.m-title { font-size: 16.5px; font-weight: 650; color: var(--ink); }
.m-desc { font-size: 12.5px; color: var(--muted); line-height: 1.5; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.m-phase { font-size: 11.5px; color: var(--accent-deep); background: var(--accent-wash); padding: 3px 10px; border-radius: 999px; white-space: nowrap; flex: none; }

.domain-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px 26px; }
.domain { display: flex; align-items: center; gap: 13px; cursor: pointer; text-decoration: none; }
.d-ico { width: 44px; height: 44px; border-radius: 13px; flex: none; display: flex; align-items: center; justify-content: center; transition: .15s; }
.domain:hover .d-ico { transform: translateY(-2px); }
.d-ico svg { width: 23px; height: 23px; }
.d-title { font-size: 15.5px; font-weight: 600; color: var(--ink); }

.quiet { display: grid; grid-template-columns: 1.2fr 1fr; gap: 18px; margin-top: 38px; }
.handbook, .daily { display: flex; align-items: center; gap: 14px; text-decoration: none; cursor: pointer;
  border: 1px solid var(--line); border-radius: var(--radius); padding: 20px 22px; background: var(--surface); transition: .15s; }
.handbook:hover, .daily:hover { border-color: var(--accent); box-shadow: var(--shadow-md); }
.hb-ico { width: 30px; height: 30px; color: var(--accent); flex: none; }
.handbook span { flex: 1; display: flex; flex-direction: column; }
.handbook strong { color: var(--ink); font-size: 16px; }
.handbook em { font-style: normal; font-size: 13px; color: var(--muted); }
.hb-arrow { width: 16px; height: 16px; color: var(--faint); }
.daily { flex-direction: column; align-items: flex-start; gap: 8px; background: var(--lemon-wash); border-color: var(--lemon-line); }
.dly-label { font-size: 12px; font-weight: 700; color: #94791f; letter-spacing: 0.08em; }
.dly-title { font-size: 14.5px; color: var(--ink); line-height: 1.55; font-weight: 600;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.dly-meta { display: flex; align-items: center; justify-content: space-between; width: 100%; font-size: 12.5px; color: var(--muted); }

/* icon tile soft backgrounds */
.bg-pink { background: var(--pink-wash); } .bg-blue { background: var(--blue-wash); }
.bg-sage { background: var(--sage-wash); } .bg-apricot { background: var(--apricot-wash); }
.bg-lilac { background: var(--lilac-wash); }

@media (max-width: 720px) {
  .hero h1 { font-size: 28px; }
  .moment-grid, .quiet { grid-template-columns: 1fr; }
  .domain-grid { grid-template-columns: 1fr 1fr; gap: 18px; }
  .search { flex-wrap: wrap; }
  .search .btn-primary { width: 100%; justify-content: center; }
}
</style>
