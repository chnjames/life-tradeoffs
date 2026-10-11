// Reactive, localStorage-persisted personal state.
// Pure frontend: favorites, per-item action status, the saved personal list,
// and a deterministic "daily item". No backend, no account.
import { reactive, computed, watch } from 'vue'
import type { LifeItem, Timing } from './types'
import dataset from './data/dataset.json'
import type { Dataset } from './types'

const data = dataset as unknown as Dataset

export type ItemStatus = '' | 'doing' | 'done' | 'skip'
export type LearnStatus = '' | 'understood' | 'review' | 'notyet'

interface PersistShape {
  favorites: string[]
  status: Record<string, ItemStatus>
  learn: Record<string, LearnStatus>
  habits: Record<string, string[]>   // key -> ISO dates checked
  todos: Record<string, string>     // key -> due ISO date
  myList: string[]
}

const STORAGE_KEY = 'lifefit:v1'

function load(): PersistShape {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    /* ignore corrupt state */
  }
  return { favorites: [], status: {}, learn: {}, habits: {}, todos: {}, myList: [] }
}

const initial = load()

const state = reactive({
  favorites: new Set<string>(initial.favorites),
  status: { ...initial.status } as Record<string, ItemStatus>,
  learn: { ...initial.learn } as Record<string, LearnStatus>,
  habits: { ...initial.habits } as Record<string, string[]>,
  todos: { ...initial.todos } as Record<string, string>,
  myList: [...initial.myList],
})

watch(
  state,
  () => {
    const persist: PersistShape = {
      favorites: [...state.favorites],
      status: state.status,
      learn: state.learn,
      habits: state.habits,
      todos: state.todos,
      myList: state.myList,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(persist))
  },
  { deep: true }
)

export const itemKey = (it: Pick<LifeItem, 'ch' | 'num'>) => it.ch + '-' + it.num

// ---- favorites ----
export function toggleFavorite(it: LifeItem) {
  const k = itemKey(it)
  if (state.favorites.has(k)) state.favorites.delete(k)
  else state.favorites.add(k)
}
export const isFavorite = (it: LifeItem) => state.favorites.has(itemKey(it))
export const favoriteItems = computed<LifeItem[]>(() =>
  [...state.favorites].map((k) => byKey.get(k)).filter((i): i is LifeItem => Boolean(i))
)

// ---- status ----
export function setStatus(it: LifeItem, s: ItemStatus) {
  const k = itemKey(it)
  state.status[k] = s
}
export const getStatus = (it: LifeItem): ItemStatus => state.status[itemKey(it)] ?? ''

// ---- saved personal list ----
export function saveMyList(items: LifeItem[]) {
  state.myList = items.map(itemKey)
}
const byKey = new Map(data.items.map((i) => [itemKey(i), i]))
export const myListItems = computed<LifeItem[]>(() =>
  state.myList.map((k) => byKey.get(k)).filter((i): i is LifeItem => Boolean(i))
)
export const hasMyList = computed(() => state.myList.length > 0)

// how many of the saved list are done
export const myListProgress = computed(() => {
  const total = state.myList.length
  const done = state.myList.filter((k) => state.status[k] === 'done').length
  return { total, done }
})

// ---- daily item: deterministic by local date ----
function daySeed(): number {
  const d = new Date()
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate()
}
// simple deterministic hash
const hash = (s: string) => {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
  return Math.abs(h)
}
export const dailyItem = computed<LifeItem>(() => {
  const idx = hash(String(daySeed())) % data.items.length
  return data.items[idx]
})

// ---- learning steps: understand / review ----
export function setLearn(it: LifeItem, s: LearnStatus) {
  state.learn[itemKey(it)] = s
}
export const getLearn = (it: LifeItem): LearnStatus => state.learn[itemKey(it)] ?? ''

// items queued for review
export const reviewItems = computed<LifeItem[]>(() =>
  data.items.filter((i) => state.learn[itemKey(i)] === 'review')
)
export const notYetItems = computed<LifeItem[]>(() =>
  data.items.filter((i) => state.learn[itemKey(i)] === 'notyet')
)

// ---- habits (repeatable check-in) ----
const todayISO = () => new Date().toISOString().slice(0, 10)
export function toggleHabitToday(it: LifeItem) {
  const k = itemKey(it)
  const days = state.habits[k] ?? []
  const t = todayISO()
  state.habits[k] = days.includes(t) ? days.filter((d) => d !== t) : [...days, t]
}
export const habitDoneToday = (it: LifeItem): boolean =>
  (state.habits[itemKey(it)] ?? []).includes(todayISO())
// count consecutive days up to today
export function habitStreak(it: LifeItem): number {
  const days = new Set(state.habits[itemKey(it)] ?? [])
  let streak = 0
  const d = new Date()
  // tolerate a missed day: walk back day by day while present
  for (;;) {
    const iso = d.toISOString().slice(0, 10)
    if (days.has(iso)) { streak++; d.setDate(d.getDate() - 1) }
    else break
  }
  return streak
}
export const habitItems = computed<LifeItem[]>(() =>
  data.items.filter((i) => state.habits[itemKey(i)] !== undefined)
)

// ---- todos (one-off, with a due date) ----
export function setTodo(it: LifeItem, due: string) {
  const k = itemKey(it)
  if (due) state.todos[k] = due
  else delete state.todos[k]
}
export const getTodo = (it: LifeItem): string => state.todos[itemKey(it)] ?? ''
export const todoItems = computed(() =>
  Object.entries(state.todos).map(([k, due]) => ({ item: byKey.get(k), due }))
    .filter((x): x is { item: LifeItem; due: string } => Boolean(x.item))
)

// ---- backup / restore ----
export function exportBackup(): string {
  return JSON.stringify({ ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'), _exportedAt: new Date().toISOString() }, null, 2)
}
export function importBackup(json: string): boolean {
  try {
    const x = JSON.parse(json)
    state.favorites = new Set(x.favorites ?? [])
    state.status = x.status ?? {}
    state.learn = x.learn ?? {}
    state.habits = x.habits ?? {}
    state.todos = x.todos ?? {}
    state.myList = x.myList ?? []
    return true
  } catch {
    return false
  }
}

// convenience for components that need timing typing
export type { Timing }
