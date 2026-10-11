// 极简 hash 路由：无第三方依赖，支持 /tip/1-5 这类可分享链接与前进后退。
// 解析结果：{ name, params: string[], query: Record<string,string> }
import { reactive, computed } from 'vue'

export interface Route {
  raw: string
  name: string
  params: string[]
  query: Record<string, string>
}

function parse(): Route {
  let hash = window.location.hash.replace(/^#/, '')
  if (!hash.startsWith('/')) hash = '/'
  const [path, qs] = hash.split('?')
  const segs = path.split('/').filter(Boolean).map((s) => decodeURIComponent(s))
  const query: Record<string, string> = {}
  if (qs) {
    qs.split('&').filter(Boolean).forEach((kv) => {
      const [k, v] = kv.split('=').map((s) => decodeURIComponent(s ?? ''))
      if (k) query[k] = v ?? ''
    })
  }
  const name = segs[0] ?? 'home'
  return { raw: path, name, params: segs.slice(1), query }
}

const route = reactive<Route>(parse())
window.addEventListener('hashchange', () => Object.assign(route, parse()))

export function useRoute() {
  return route
}

export function go(path: string) {
  if (window.location.hash === '#' + path) {
    Object.assign(route, parse())
  } else {
    window.location.hash = path
  }
  window.scrollTo(0, 0)
}

// 便捷读取
export const tipKey = computed(() =>
  route.name === 'tip' && route.params[0] ? route.params[0] : ''
)
