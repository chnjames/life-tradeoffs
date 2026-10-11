<script setup lang="ts">
import { computed } from 'vue'
import type { Dataset } from '../types'
import GroupedItems from './GroupedItems.vue'
import Icon from './Icon.vue'
import { go } from '../router'

const props = defineProps<{ data: Dataset; chapter?: string }>()

const chapters = computed(() => {
  const m = new Map<number, { name: string; count: number }>()
  props.data.items.forEach((i) => {
    const cur = m.get(i.ch)
    if (cur) cur.count++
    else m.set(i.ch, { name: i.chname, count: 1 })
  })
  return [...m.entries()].sort((a, b) => a[0] - b[0]).map(([ch, v]) => ({ ch, ...v }))
})

const activeCh = computed(() => (props.chapter ? Number(props.chapter) : 0))
const chapterItems = computed(() =>
  activeCh.value ? props.data.items.filter((i) => i.ch === activeCh.value) : []
)
const activeName = computed(() => chapters.value.find((c) => c.ch === activeCh.value)?.name ?? '')
</script>

<template>
  <div class="hb view-fade">
    <aside class="sidenav">
      <button class="hb-home" :class="{ on: !activeCh }" @click="go('/handbook')">
        <Icon name="book" style="width:17px;height:17px" /> 完整手册
      </button>
      <div class="ch-list">
        <button v-for="c in chapters" :key="c.ch" class="ch" :class="{ on: c.ch === activeCh }"
          @click="go('/handbook/' + c.ch)">
          <span class="num">{{ String(c.ch).padStart(2, '0') }}</span>
          <span class="nm">{{ c.name }}</span>
          <span class="cnt">{{ c.count }}</span>
        </button>
      </div>
    </aside>

    <section class="content">
      <template v-if="!activeCh">
        <div class="h-sec">
          <h2>完整手册 · 34 节</h2>
          <div class="meta">原书《高性价比人生指南》的系统目录，点一节进去按时机阅读</div>
        </div>
        <div class="toc-grid">
          <a v-for="c in chapters" :key="c.ch" class="toc" @click="go('/handbook/' + c.ch)">
            <span class="num">{{ String(c.ch).padStart(2, '0') }}</span>
            <span class="nm">{{ c.name }}</span>
            <span class="cnt">{{ c.count }} 条</span>
          </a>
        </div>
      </template>

      <template v-else>
        <button class="back" @click="go('/handbook')"><Icon name="back" style="width:15px;height:15px" /> 完整手册</button>
        <div class="h-sec">
          <h2>{{ String(activeCh).padStart(2, '0') }} · {{ activeName }}</h2>
          <div class="meta">{{ chapterItems.length }} 条 · 按“该什么时候做”排好</div>
        </div>
        <GroupedItems :items="chapterItems" />
      </template>
    </section>
  </div>
</template>

<style scoped>
.hb { display: grid; grid-template-columns: 290px minmax(0, 700px); gap: 44px; align-items: start; }
.sidenav { position: sticky; top: 86px; max-height: calc(100dvh - 120px); overflow-y: auto;
  padding-right: 22px; border-right: 1px solid var(--line); }
.hb-home { display: flex; align-items: center; gap: 9px; width: 100%; text-align: left; cursor: pointer;
  background: none; border: none; color: var(--ink); font-size: 15px; font-weight: 700; padding: 10px 12px; border-radius: 10px; }
.hb-home.on { background: var(--accent-wash); color: var(--accent-deep); }
.ch-list { margin-top: 6px; display: flex; flex-direction: column; }
.ch { display: flex; align-items: baseline; gap: 9px; width: 100%; text-align: left; cursor: pointer;
  background: none; border: none; padding: 7px 12px; border-radius: 9px; color: var(--body); font-size: 13.5px; line-height: 1.4; transition: .12s; }
.ch:hover { background: var(--wash); color: var(--ink); }
.ch.on { background: var(--accent-wash); color: var(--accent-deep); font-weight: 600; }
.ch .num { font-size: 11.5px; color: var(--faint); flex: none; width: 20px; }
.ch .nm { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ch .cnt { font-size: 11px; color: var(--faint); flex: none; }

.toc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 28px; }
.toc { display: flex; align-items: baseline; gap: 12px; padding: 15px 4px; border-bottom: 1px solid var(--line); cursor: pointer; text-decoration: none; transition: .15s; }
.toc:hover { padding-left: 10px; }
.toc .num { font-size: 12px; color: var(--faint); width: 22px; flex: none; }
.toc .nm { flex: 1; color: var(--ink); font-size: 15px; font-weight: 550; }
.toc .cnt { font-size: 12.5px; color: var(--muted); }
@media (max-width: 820px) {
  .hb { grid-template-columns: 1fr; gap: 20px; }
  .sidenav { position: static; max-height: none; }
  .ch-list { flex-direction: row; flex-wrap: wrap; gap: 4px; }
  .ch .nm { display: none; }
  .ch { width: auto; padding: 6px 12px; }
  .toc-grid { grid-template-columns: 1fr; }
}
</style>
