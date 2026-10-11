<script setup lang="ts">
import type { LifeItem } from '../types'
import Icon from './Icon.vue'
import { metaParts, evDot, evShort } from '../labels'
import { go } from '../router'

const props = defineProps<{ item: LifeItem; ordinal?: number; chapterTag?: boolean }>()
const key = `${props.item.ch}-${props.item.num}`
</script>

<template>
  <a class="tip-row" :href="'#/tip/' + key" @click="go('/tip/' + key)">
    <div class="row-main">
      <h3 class="row-title">{{ item.title }}</h3>
      <p v-if="item.plain" class="row-plain">{{ item.plain }}</p>
      <div class="row-meta">
        <span class="evmeta">
          <span class="d" :class="evDot(item.evidence)"></span>{{ evShort(item.evidence) }}
        </span>
        <template v-for="(m, i) in metaParts(item)" :key="i">
          <span class="sep">·</span><span>{{ m }}</span>
        </template>
        <span v-if="chapterTag" class="ch-tag">{{ item.chname }}</span>
      </div>
    </div>
    <Icon name="arrow" class="chev" />
  </a>
</template>

<style scoped>
.tip-row {
  display: flex; align-items: flex-start; gap: 14px; text-decoration: none; color: inherit;
  padding: 20px 6px; border-bottom: 1px solid var(--line); transition: .15s;
}
.tip-row:hover { background: color-mix(in srgb, var(--surface) 70%, transparent); padding-left: 12px; padding-right: 12px; border-radius: 10px; }
.row-main { flex: 1; min-width: 0; }
.row-title { font-size: 16.5px; font-weight: 650; line-height: 1.5; color: var(--ink); margin-bottom: 4px; }
.row-plain {
  font-size: 13.5px; color: var(--muted); line-height: 1.6; margin-bottom: 8px;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}
.row-meta { display: flex; flex-wrap: wrap; align-items: center; gap: 7px; font-size: 12.5px; color: var(--faint); }
.row-meta .sep { color: var(--line); }
.ch-tag { margin-left: auto; color: var(--muted); font-size: 12px; }
.chev { width: 16px; height: 16px; color: var(--faint); flex: none; margin-top: 4px; transition: .15s; }
.tip-row:hover .chev { color: var(--accent); transform: translateX(2px); }
</style>
