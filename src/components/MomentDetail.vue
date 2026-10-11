<script setup lang="ts">
import { computed } from 'vue'
import type { Scenario, LifeItem } from '../types'
import Icon from './Icon.vue'
import { SCENARIO_ICON, toneAt } from '../meta'
import { evDot, evShort, metaParts } from '../labels'
import { go } from '../router'

const props = defineProps<{ scenario: Scenario; items: LifeItem[] }>()
const idx = computed(() => {
  const m = new Map<string, LifeItem>()
  props.items.forEach((i) => m.set(i.ch + '-' + i.num, i))
  return m
})
const steps = computed(() =>
  props.scenario.refs
    .map((r) => idx.value.get(r.ch + '-' + r.num))
    .filter((i): i is LifeItem => Boolean(i))
)
const tIdx = computed(() => {
  const i = ['被裁员了','被欠薪加班没给钱','租房签约与退租','准备结婚','要生孩子','确诊慢性病','家人走了','被骗了'].indexOf(props.scenario.key)
  return i < 0 ? 0 : i
})
</script>

<template>
  <div class="view-fade md-wrap">
    <button class="back" @click="go('/moments')"><Icon name="back" style="width:15px;height:15px" /> 所有时刻</button>

    <header class="head">
      <span class="h-ico" :class="'bg-' + toneAt(tIdx)"><Icon :name="SCENARIO_ICON[scenario.key] || 'compass'" :tone="toneAt(tIdx)" /></span>
      <div>
        <h1>{{ scenario.key }}<i v-if="scenario.phase" class="phase-tag">{{ scenario.phase }}</i></h1>
        <p>{{ scenario.desc }}</p>
      </div>
    </header>

    <div class="tip-order">{{ steps.length }} 步 · 按下面的先后顺序做，别跳步</div>
    <ol class="steps">
      <li v-for="(it, k) in steps" :key="it.ch + '-' + it.num">
        <a :href="'#/tip/' + it.ch + '-' + it.num" @click="go('/tip/' + it.ch + '-' + it.num)">
          <span class="n">{{ k + 1 }}</span>
          <span class="c">
            <span class="t">{{ it.title }}</span>
            <span class="m">
              <span class="evmeta"><span class="d" :class="evDot(it.evidence)"></span>{{ evShort(it.evidence) }}</span>
              <template v-for="(x, i) in metaParts(it)" :key="i"><span class="sep">·</span><span>{{ x }}</span></template>
            </span>
          </span>
          <Icon name="arrow" class="chev" />
        </a>
      </li>
    </ol>
  </div>
</template>

<style scoped>
.md-wrap { max-width: 760px; margin: 0 auto; }
.head { display: flex; gap: 18px; align-items: flex-start; margin-bottom: 10px; }
.h-ico { width: 58px; height: 58px; border-radius: 17px; flex: none; display: flex; align-items: center; justify-content: center; }
.h-ico svg { width: 30px; height: 30px; }
h1 { font-size: 28px; font-weight: 700; color: var(--ink); display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.phase-tag { font-style: normal; font-size: 12.5px; color: var(--accent-deep); background: var(--accent-wash); padding: 3px 12px; border-radius: 999px; font-weight: 500; }
.head p { color: var(--muted); font-size: 14.5px; margin-top: 6px; }
.tip-order { font-size: 13.5px; color: var(--muted); margin: 22px 0 6px; padding-left: 2px; }
.steps { list-style: none; counter-reset: s; }
.steps a { display: flex; align-items: flex-start; gap: 15px; padding: 18px 4px; border-bottom: 1px solid var(--line); text-decoration: none; color: inherit; transition: .15s; }
.steps a:hover { padding-left: 10px; }
.n { width: 26px; height: 26px; flex: none; border-radius: 50%; background: var(--wash); color: var(--accent-deep); font-size: 13.5px; font-weight: 700; display: flex; align-items: center; justify-content: center; margin-top: 1px; }
.c { flex: 1; min-width: 0; }
.t { display: block; font-size: 15.5px; font-weight: 600; color: var(--ink); line-height: 1.5; margin-bottom: 4px; }
.m { display: flex; flex-wrap: wrap; gap: 7px; font-size: 12.5px; color: var(--faint); align-items: center; }
.m .sep { color: var(--line); }
.chev { width: 16px; height: 16px; color: var(--faint); flex: none; margin-top: 5px; }
.steps a:hover .chev { color: var(--accent); }
.bg-pink { background: var(--pink-wash); } .bg-blue { background: var(--blue-wash); }
.bg-sage { background: var(--sage-wash); } .bg-apricot { background: var(--apricot-wash); }
.bg-lilac { background: var(--lilac-wash); }
</style>
