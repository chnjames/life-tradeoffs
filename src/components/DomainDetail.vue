<script setup lang="ts">
import type { Domain, LifeItem } from '../types'
import Icon from './Icon.vue'
import GroupedItems from './GroupedItems.vue'
import { go } from '../router'
defineProps<{ domain: Domain; items: LifeItem[] }>()
</script>

<template>
  <div class="view-fade md-wrap">
    <button class="back" @click="go('/domains')"><Icon name="back" style="width:15px;height:15px" /> 所有领域</button>
    <div class="h-sec">
      <h2>{{ domain.key }}</h2>
      <div class="meta">{{ items.length }} 条建议 · 按“该什么时候做”排好</div>
    </div>
    <GroupedItems :items="items" />
  </div>
</template>

<style scoped>
.md-wrap { max-width: 760px; margin: 0 auto; }
</style>
