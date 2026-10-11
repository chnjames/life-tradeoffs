<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { LifeItem, Timing } from '../types'
import TipRow from './TipRow.vue'
import { go } from '../router'

const props = defineProps<{ items: LifeItem[]; initialQuery?: string }>()
const q = ref(props.initialQuery ?? '')
const ev = ref<'' | 'A' | 'B' | 'C'>('')
const tm = ref<'' | Timing>('')

watch(() => props.initialQuery, (v) => { q.value = v ?? '' })

const EV_OPTS = [
  { label: '全部可靠度', value: '' as const },
  { label: '很可靠', value: 'A' as const },
  { label: '较可靠', value: 'B' as const },
  { label: '仅供参考', value: 'C' as const },
]
const TM_OPTS = [
  { label: '任何时机', value: '' as const },
  { label: '趁早做，过期难补', value: 'window' as const },
  { label: '出事当下马上做', value: 'emergency' as const },
  { label: '平时做防患未然', value: 'prevent' as const },
  { label: '长期坚持管理', value: 'manage' as const },
]

const filtered = computed(() => {
  const term = q.value.trim()
  return props.items.filter((i) => {
    if (term && !(i.title + i.plain + i.chname).includes(term)) return false
    if (ev.value && i.evidence !== ev.value) return false
    if (tm.value && i.timing !== tm.value) return false
    return true
  })
})
const shown = computed(() => filtered.value.slice(0, 60))
</script>

<template>
  <div class="view-fade md-wrap">
    <button class="back" @click="go('/')"><span style="font-size:15px">←</span> 回首页</button>
    <h1 class="s-title">找一条适合你的建议</h1>

    <input v-model="q" class="field" placeholder="输入关键词，如：低钠盐、工伤、彩礼、辞职" autofocus />

    <div class="filters" style="margin-top:18px">
      <button v-for="o in EV_OPTS" :key="'e'+o.label" class="chip" :class="{ on: ev === o.value }" @click="ev = o.value">{{ o.label }}</button>
    </div>
    <div class="filters">
      <button v-for="o in TM_OPTS" :key="'t'+o.label" class="chip" :class="{ on: tm === o.value }" @click="tm = o.value">{{ o.label }}</button>
    </div>

    <div class="list-hint" v-if="q.trim() || ev || tm">为你找到 {{ filtered.length }} 条</div>

    <div v-if="shown.length">
      <TipRow v-for="it in shown" :key="it.ch + '-' + it.num" :item="it" chapter-tag />
    </div>
    <div v-else-if="q.trim()" class="empty">没找到含“{{ q.trim() }}”的建议，换个更口语的词试试。</div>
    <div v-else class="empty">输入关键词，或从上面的时机开始翻。</div>

    <p v-if="filtered.length > 60" class="more">还有 {{ filtered.length - 60 }} 条，把关键词写具体些</p>
  </div>
</template>

<style scoped>
.md-wrap { max-width: 760px; margin: 0 auto; }
.s-title { font-size: 27px; font-weight: 700; color: var(--ink); margin-bottom: 18px; }
.empty { padding: 40px 4px; color: var(--muted); font-size: 14.5px; }
.more { color: var(--muted); font-size: 13px; padding: 18px 4px; }
</style>
