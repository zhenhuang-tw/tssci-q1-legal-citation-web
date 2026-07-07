export function useTheme() {
  const theme = ref<'light' | 'dark' | 'auto'>('auto')

  const colorSchemeQuery = ref<MediaQueryList | null>(null)

  function applyTheme(t: 'light' | 'dark' | 'auto') {
    const resolved =
      t === 'auto'
        ? window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
        : t
    document.documentElement.setAttribute('data-theme', resolved)
  }

  function setTheme(t: 'light' | 'dark' | 'auto') {
    theme.value = t
    localStorage.setItem('theme', t)
    applyTheme(t)
  }

  function toggleTheme() {
    const resolved =
      theme.value === 'auto'
        ? window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
        : theme.value
    setTheme(resolved === 'dark' ? 'light' : 'dark')
  }

  const isDark = computed(() => {
    if (theme.value === 'dark') return true
    if (theme.value === 'light') return false
    if (import.meta.server) return false
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  // Init on mount
  if (import.meta.client) {
    const stored = localStorage.getItem('theme') as 'light' | 'dark' | 'auto' | null
    theme.value = stored ?? 'auto'
    applyTheme(theme.value)

    // Watch system preference when in auto mode
    watch(theme, (val) => {
      if (val !== 'auto' && colorSchemeQuery.value) {
        colorSchemeQuery.value = null
      }
    })

    onMounted(() => {
      if (theme.value === 'auto') {
        const mq = window.matchMedia('(prefers-color-scheme: dark)')
        colorSchemeQuery.value = mq
        const handler = () => applyTheme('auto')
        mq.addEventListener('change', handler)
      }
    })
  }

  return { theme, setTheme, toggleTheme, isDark }
}
