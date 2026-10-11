<script setup lang="ts">
// 统一手绘线性图标：24x24 描边，颜色由外部容器 class 控制（默认 currentColor）。
import { computed } from 'vue'
const props = defineProps<{ name: string; tone?: string }>()

// 各图标的内部路径（stroke 风格）
const PATHS: Record<string, string> = {
  // 八个懵住时刻
  layoff: '<path d="M4 7h16l-1.2 12.2a1.5 1.5 0 0 1-1.5 1.3H6.7a1.5 1.5 0 0 1-1.5-1.3Z"/><path d="M8.5 7V5.5A1.5 1.5 0 0 1 10 4h4a1.5 1.5 0 0 1 1.5 1.5V7"/><path d="M10 11v5M14 11v5"/>',
  wage: '<rect x="4" y="6" width="16" height="12" rx="2"/><circle cx="12" cy="12" r="2.4"/><path d="M6 9.5v5M18 9.5v5"/>',
  rent: '<path d="M4 10.5 12 5l8 5.5"/><path d="M6 10v9h12v-9"/><path d="M10 19v-4h4v4"/>',
  marry: '<path d="M12 19 5.5 12.2a3.6 3.6 0 0 1 5-5L12 8.7l1.5-1.5a3.6 3.6 0 0 1 5 5Z"/>',
  baby: '<path d="M9 12.5h.01M15 12.5h.01"/><circle cx="12" cy="11" r="8"/><path d="M9 15c.8.8 1.8 1.2 3 1.2s2.2-.4 3-1.2"/>',
  chronic: '<path d="M3 13h4l2-5 4 9 2-4h6"/>',
  farewell: '<path d="M12 6c-2-2.6-6-1.4-6 2 0 2.4 2.4 4 6 6.6C15.6 12 18 10.4 18 8c0-3.4-4-4.6-6-2Z"/><path d="M12 21v-6.4"/>',
  scam: '<path d="M12 3 3 8v4c0 5 3.8 8 9 9 5.2-1 9-4 9-9V8Z"/><path d="m9.5 12 1.8 1.8 3.4-3.6"/>',
  // 六个生活领域
  work: '<rect x="4" y="7" width="16" height="12" rx="2"/><path d="M8 7V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V7"/><path d="M9 12h.01M15 12h.01"/>',
  money: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5v9M14.2 9.4c-.5-.7-1.2-1-2.2-1-1.2 0-2 .6-2 1.5 0 2 4.2 1.1 4.2 3.2 0 .9-.9 1.5-2.1 1.5-1 0-1.8-.4-2.4-1.1"/>',
  home: '<path d="M4 11 12 4l8 7"/><path d="M6 10v9h12v-9"/><path d="M10 19v-4.5h4V19"/>',
  health: '<path d="M11.5 4v3.2H8.2c-1 0-1.7.8-1.7 1.7v2.6h3l1.2 2 1.6-3.2h.4"/><path d="M11.5 4h3.3c1 0 1.7.8 1.7 1.7V20"/>',
  family: '<circle cx="8.5" cy="8" r="2.6"/><circle cx="16" cy="9.2" r="2.1"/><path d="M3.5 19c.4-2.6 2.3-4 5-4s4.6 1.4 5 4"/><path d="M14.5 15.2c2 .2 3.6 1.5 4 3.8"/>',
  rights: '<path d="M12 3 4 6v5c0 4.6 3.2 8 8 10 4.8-2 8-5.4 8-10V6Z"/><path d="m9 12 2 2 4-4"/>',
  // 通用
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.2-3.2"/>',
  book: '<path d="M5 5.5A2.5 2.5 0 0 1 7.5 3H19v15H7.5A2.5 2.5 0 0 0 5 20.5Z"/><path d="M5 18a2.5 2.5 0 0 1 2.5-2.5H19"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M5 20c.6-3.4 3.4-5 7-5s6.4 1.6 7 5"/>',
  back: '<path d="M14 6l-6 6 6 6"/>',
  arrow: '<path d="M9 6l6 6-6 6"/>',
  star: '<path d="m12 4 2.3 4.8 5.2.7-3.8 3.6 1 5.1L12 15.7 7.3 18.2l1-5.1L4.5 9.5l5.2-.7Z"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2.4 4.3-4.3 2.4 2.4-4.3Z"/>',
  stage: '<path d="M5 19h14"/><path d="M7 19v-6h3.5v6"/><path d="M13.5 19V8H17v11"/>',
  grid: '<rect x="4" y="4" width="7" height="7" rx="1.6"/><rect x="13" y="4" width="7" height="7" rx="1.6"/><rect x="4" y="13" width="7" height="7" rx="1.6"/><rect x="13" y="13" width="7" height="7" rx="1.6"/>',
}

const inner = computed(() => PATHS[props.name] ?? PATHS.grid)
const toneClass = computed(() => (props.tone ? `tone-${props.tone}` : ''))
</script>

<template>
  <svg class="ico" :class="toneClass" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" v-html="inner" />
</template>

<style scoped>
.ico { width: 100%; height: 100%; }
.tone-pink { color: var(--pink); }
.tone-blue { color: var(--blue); }
.tone-sage { color: var(--sage); }
.tone-apricot { color: var(--apricot); }
.tone-lilac { color: var(--lilac); }
</style>
