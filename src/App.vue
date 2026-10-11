<script setup lang="ts">
import { computed } from 'vue'
import dataset from './data/dataset.json'
import type { Dataset } from './types'
import { useRoute, go } from './router'
import Icon from './components/Icon.vue'
import HomeView from './components/HomeView.vue'
import MomentList from './components/MomentList.vue'
import MomentDetail from './components/MomentDetail.vue'
import DomainList from './components/DomainList.vue'
import DomainDetail from './components/DomainDetail.vue'
import SearchView from './components/SearchView.vue'
import Handbook from './components/Handbook.vue'
import TipDetail from './components/TipDetail.vue'
import MineView from './components/MineView.vue'

const data = dataset as unknown as Dataset
const route = useRoute()

const currentMoment = computed(() => data.scenarios.find((s) => s.key === route.params[0]))
const currentDomain = computed(() => data.domains.find((d) => d.key === route.params[0]))
const currentTip = computed(() => {
  const [ch, num] = (route.params[0] ?? '').split('-').map(Number)
  if (!ch || !num) return undefined
  return data.items.find((i) => i.ch === ch && i.num === num)
})

// 领域条数
const domainCounts = computed(() => {
  const o: Record<string, number> = {}
  data.domains.forEach((d) => {
    o[d.key] = data.items.filter((i) => d.chapters.includes(i.ch)).length
  })
  return o
})
const domainItems = computed(() => {
  const d = currentDomain.value
  return d ? data.items.filter((i) => d.chapters.includes(i.ch)) : []
})

const nav = [
  { name: 'moments', label: '懵住时刻', match: ['moments', 'moment'] },
  { name: 'handbook', label: '完整手册', match: ['handbook', 'tip'] },
  { name: 'mine', label: '我的', match: ['mine'] },
]
function active(matches: string[]) { return matches.includes(route.name) }
</script>

<template>
  <div class="topbar">
    <div class="in">
      <button class="brand" @click="go('/')">
        <Icon name="book" />
        <span class="zh">取舍</span>
        <span class="en">Life Tradeoffs</span>
      </button>
      <nav>
        <span v-for="n in nav" :key="n.name" :class="{ active: active(n.match) }" @click="go('/' + n.name)">{{ n.label }}</span>
      </nav>
    </div>
  </div>

  <main :class="{ narrow: route.name === 'tip' || route.name === 'search' }">
    <HomeView v-if="route.name === 'home'" :data="data" />

    <MomentList v-else-if="route.name === 'moments'" :scenarios="data.scenarios" />
    <MomentDetail v-else-if="route.name === 'moment' && currentMoment" :scenario="currentMoment" :items="data.items" />

    <DomainList v-else-if="route.name === 'domains'" :domains="data.domains" :counts="domainCounts" />
    <DomainDetail v-else-if="route.name === 'domain' && currentDomain" :domain="currentDomain" :items="domainItems" />

    <SearchView v-else-if="route.name === 'search'" :items="data.items" :initial-query="route.query.q ?? ''" />

    <Handbook v-else-if="route.name === 'handbook'" :data="data" :chapter="route.params[0] ?? ''" />
    <TipDetail v-else-if="route.name === 'tip' && currentTip" :item="currentTip" />

    <MineView v-else-if="route.name === 'mine'" />

    <div v-else class="notfound">
      <p>没找到这个页面。</p>
      <button class="btn-link" @click="go('/')">回首页</button>
    </div>
  </main>

  <footer class="site">
    <div class="in">
      <span>取舍 · 人生适配清单（非官方衍生）</span>
      <span>
        内容基于《高性价比人生指南》CC BY 4.0，数字与结论以
        <a :href="data.meta.upstream" target="_blank" rel="noopener">原仓库中文原文</a> 为准；这是备选单，不是任务清单。
      </span>
      <span v-if="data.meta.upstreamHead" class="ver">
        资料版本
        <a :href="data.meta.upstreamHead.url" target="_blank" rel="noopener">{{ data.meta.upstreamHead.hash }}</a>
        · {{ data.meta.upstreamHead.date }}
      </span>
    </div>
  </footer>
</template>

<style scoped>
.notfound { padding: 60px 0; color: var(--muted); display: flex; flex-direction: column; gap: 14px; align-items: flex-start; }
.ver { font-variant-numeric: tabular-nums; }
.ver a { font-family: ui-monospace, Menlo, monospace; font-size: 11.5px; }
</style>
