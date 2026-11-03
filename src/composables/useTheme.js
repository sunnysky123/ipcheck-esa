import { ref } from 'vue'

const STORAGE_KEY = 'ipcheck-theme'
const THEME_BG = { dark: '#060913', light: '#eef2f9' }

function persist(t) {
  try { localStorage.setItem(STORAGE_KEY, t) } catch { /* 隐私模式等场景下忽略 */ }
}

function storedTheme() {
  try {
    const t = localStorage.getItem(STORAGE_KEY)
    if (t === 'light' || t === 'dark') return t
  } catch { /* ignore */ }
  return null
}

function systemTheme() {
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

function apply(t) {
  document.documentElement.dataset.theme = t
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_BG[t])
}

export function useTheme() {
  const media = window.matchMedia('(prefers-color-scheme: light)')
  const theme = ref(storedTheme() ?? systemTheme())
  let followSystem = !storedTheme()

  // 系统颜色模式变化时,仅在用户未手动选择主题的情况下跟随切换
  media.addEventListener?.('change', () => {
    if (!followSystem) return
    theme.value = systemTheme()
    apply(theme.value)
  })

  function toggle() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    followSystem = false
    persist(theme.value)
    apply(theme.value)
  }

  return { theme, toggle }
}
