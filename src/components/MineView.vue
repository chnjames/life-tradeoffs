<script setup lang="ts">
import { ref } from 'vue'
import { favoriteItems, reviewItems, habitItems, myListProgress } from '../store'
import TipRow from './TipRow.vue'

const tab = ref<'list' | 'review' | 'habits'>('list')
const progress = myListProgress
const tabs = [
  { key: 'list', label: '我的清单' },
  { key: 'review', label: '温习' },
  { key: 'habits', label: '打卡与待办' },
] as const
</script>

<template>
  <div class="view-fade md-wrap">
    <div class="h-sec">
      <h2>我的</h2>
      <div class="meta">只存在这台设备，不上传、不用注册</div>
    </div>

    <div v-if="progress.total" class="prog">
      清单完成 {{ progress.done }}/{{ progress.total }}
      <div class="track"><i :style="{ width: (progress.total ? progress.done/progress.total*100 : 0) + '%' }"></i></div>
    </div>

    <div class="filters">
      <button v-for="t in tabs" :key="t.key" class="chip" :class="{ on: tab === t.key }" @click="tab = t.key">{{ t.label }}</button>
    </div>

    <template v-if="tab === 'list'">
      <TipRow v-for="it in favoriteItems" :key="it.ch+'-'+it.num" :item="it" chapter-tag />
      <p v-if="!favoriteItems.length" class="empty">还没有收藏。看到合适的建议，在条目底部点“加入清单”。</p>
    </template>

    <template v-else-if="tab === 'review'">
      <TipRow v-for="it in reviewItems" :key="it.ch+'-'+it.num" :item="it" chapter-tag />
      <p v-if="!reviewItems.length" class="empty">没有需要温习的条目。在条目底部点“加入温习”，隔几天回来回忆一次。</p>
    </template>

    <template v-else>
      <TipRow v-for="it in habitItems" :key="it.ch+'-'+it.num" :item="it" chapter-tag />
      <p v-if="!habitItems.length" class="empty">还没有打卡项。在条目底部可设置“每日打卡”或标记“做到了”。</p>
    </template>
  </div>
</template>

<style scoped>
.md-wrap { max-width: 760px; margin: 0 auto; }
.prog { font-size: 13.5px; color: var(--muted); margin-bottom: 18px; }
.track { height: 6px; background: var(--wash); border-radius: 999px; overflow: hidden; margin-top: 8px; }
.track i { display: block; height: 100%; background: var(--accent); border-radius: 999px; }
.empty { padding: 40px 4px; color: var(--muted); font-size: 14.5px; }
</style>
