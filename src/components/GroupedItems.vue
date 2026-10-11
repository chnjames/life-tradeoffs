<script setup lang="ts">
import { computed } from 'vue'
import type { LifeItem } from '../types'
import { PHASES } from '../types'
import TipRow from './TipRow.vue'

const props = defineProps<{ items: LifeItem[]; chapterTag?: boolean }>()

const groups = computed(() => {
  const g: Record<string, LifeItem[]> = { window: [], emergency: [], prevent: [], manage: [] }
  props.items.forEach((i) => g[i.timing]?.push(i))
  return g
})
// 是否有跨时机（只有一种时机时不显示分组标题，减少噪音）
const kinds = computed(() => PHASES.filter((p) => groups.value[p.key].length).length)
</script>

<template>
  <template v-for="p in PHASES" :key="p.key">
    <template v-if="groups[p.key].length">
      <div v-if="kinds > 1" class="phase">
        <h4>{{ p.title }}</h4><span class="when">{{ p.when }}</span>
      </div>
      <TipRow v-for="(it, k) in groups[p.key]" :key="it.ch + '-' + it.num"
        :item="it" :ordinal="k + 1" :chapter-tag="chapterTag" />
    </template>
  </template>
</template>
