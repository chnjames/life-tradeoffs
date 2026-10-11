<script setup lang="ts">
import type { Scenario } from '../types'
import Icon from './Icon.vue'
import { SCENARIO_ICON, toneAt } from '../meta'
import { go } from '../router'
defineProps<{ scenarios: Scenario[] }>()
</script>

<template>
  <div class="view-fade narrow-wrap">
    <div class="h-sec">
      <h2>你可能正卡在某件事上</h2>
      <div class="meta">这些时刻步骤不能乱——点进去是按顺序排好的清单，并标了时间窗</div>
    </div>
    <div class="list">
      <a v-for="(s, i) in scenarios" :key="s.key" class="row" @click="go('/moment/' + s.key)">
        <span class="ico" :class="'bg-' + toneAt(i)"><Icon :name="SCENARIO_ICON[s.key] || 'compass'" :tone="toneAt(i)" /></span>
        <span class="body">
          <span class="t">{{ s.key }}<i v-if="s.phase" class="phase-tag">{{ s.phase }}</i></span>
          <span class="d">{{ s.desc }}</span>
        </span>
        <Icon name="arrow" class="chev" />
      </a>
    </div>
  </div>
</template>

<style scoped>
.narrow-wrap { max-width: 760px; margin: 0 auto; }
.row { display: flex; align-items: center; gap: 17px; padding: 20px 6px; border-bottom: 1px solid var(--line); cursor: pointer; text-decoration: none; transition: .15s; }
.row:hover { padding-left: 12px; }
.ico { width: 50px; height: 50px; border-radius: 14px; flex: none; display: flex; align-items: center; justify-content: center; }
.ico svg { width: 26px; height: 26px; }
.body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 3px; }
.t { font-size: 17.5px; font-weight: 650; color: var(--ink); display: flex; align-items: center; gap: 10px; }
.phase-tag { font-style: normal; font-size: 11.5px; color: var(--accent-deep); background: var(--accent-wash); padding: 2px 10px; border-radius: 999px; font-weight: 500; }
.d { font-size: 13.5px; color: var(--muted); }
.chev { width: 17px; height: 17px; color: var(--faint); flex: none; }
.row:hover .chev { color: var(--accent); }
.bg-pink { background: var(--pink-wash); } .bg-blue { background: var(--blue-wash); }
.bg-sage { background: var(--sage-wash); } .bg-apricot { background: var(--apricot-wash); }
.bg-lilac { background: var(--lilac-wash); }
</style>
