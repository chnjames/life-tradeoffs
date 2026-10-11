<script setup lang="ts">
import type { Domain } from '../types'
import Icon from './Icon.vue'
import { DOMAIN_ICON, toneAt } from '../meta'
import { go } from '../router'
defineProps<{ domains: Domain[]; counts: Record<string, number> }>()
</script>

<template>
  <div class="view-fade">
    <div class="h-sec">
      <h2>按生活领域翻</h2>
      <div class="meta">没想好搜什么，就从一个和你最相关的领域进去</div>
    </div>
    <div class="grid">
      <a v-for="(d, i) in domains" :key="d.key" class="card" @click="go('/domain/' + d.key)">
        <span class="ico" :class="'bg-' + toneAt(i)"><Icon :name="DOMAIN_ICON[d.key] || 'grid'" :tone="toneAt(i)" /></span>
        <span class="t">{{ d.key }}</span>
        <span class="c">{{ counts[d.key] ?? 0 }} 条建议</span>
        <Icon name="arrow" class="chev" />
      </a>
    </div>
  </div>
</template>

<style scoped>
.grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.card { position: relative; display: flex; flex-direction: column; gap: 10px; cursor: pointer; text-decoration: none;
  border: 1px solid var(--line); border-radius: var(--radius); padding: 24px 22px; background: var(--surface); transition: .16s; }
.card:hover { border-color: var(--accent); box-shadow: var(--shadow-md); transform: translateY(-2px); }
.ico { width: 50px; height: 50px; border-radius: 14px; display: flex; align-items: center; justify-content: center; }
.ico svg { width: 26px; height: 26px; }
.t { font-size: 17px; font-weight: 650; color: var(--ink); }
.c { font-size: 13px; color: var(--muted); }
.chev { position: absolute; top: 24px; right: 20px; width: 16px; height: 16px; color: var(--faint); }
.card:hover .chev { color: var(--accent); }
.bg-pink { background: var(--pink-wash); } .bg-blue { background: var(--blue-wash); }
.bg-sage { background: var(--sage-wash); } .bg-apricot { background: var(--apricot-wash); }
.bg-lilac { background: var(--lilac-wash); }
@media (max-width: 720px) { .grid { grid-template-columns: 1fr; } }
</style>
