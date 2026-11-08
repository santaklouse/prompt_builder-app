<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, watchEffect } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useSettingsStore } from './stores/settings'

const settings = useSettingsStore()
const { t, locale } = useI18n()

const themeOptions = computed(() => [
  { value: 'auto', label: t('common.auto') },
  { value: 'light', label: t('common.light') },
  { value: 'dark', label: t('common.dark') },
])

function applyTheme() {
  const prefersDark = window.matchMedia(
    '(prefers-color-scheme: dark)',
  ).matches

  const resolvedTheme =
    settings.theme === 'auto'
      ? (prefersDark ? 'dark' : 'light')
      : settings.theme

  document.documentElement.dataset.theme = resolvedTheme
  document.documentElement.style.colorScheme = resolvedTheme
}

function handleSystemThemeChange() {
  if (settings.theme === 'auto') {
    applyTheme()
  }
}

watchEffect(() => {
  locale.value = settings.locale
})

watchEffect(() => {
  settings.theme
  applyTheme()
})

onMounted(() => {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQuery.addEventListener('change', handleSystemThemeChange)
  window.addEventListener('storage', applyTheme)
})

onBeforeUnmount(() => {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQuery.removeEventListener('change', handleSystemThemeChange)
  window.removeEventListener('storage', applyTheme)
})
</script>

<template>
  <div class="app-shell">
    <aside class="sidebar">
      <RouterLink to="/" class="brand">
        <span class="brand-mark">P</span>
        <span class="brand-name">Prompt<span>Builder</span></span>
      </RouterLink>

      <div class="sidebar-caption">{{ t('app.tagline') }}</div>

      <nav class="main-nav">
        <RouterLink to="/" class="nav-link">
          <span class="nav-icon">✳</span>
          {{ t('navigation.builder') }}
        </RouterLink>

        <RouterLink to="/settings" class="nav-link">
          <span class="nav-icon">⚙</span>
          {{ t('navigation.settings') }}
        </RouterLink>
      </nav>

      <div class="sidebar-footer">
        <span class="status-dot"></span>
        <span>Local-first workspace</span>
      </div>
    </aside>

    <main class="main-area">
      <header class="topbar">
        <div class="topbar-title">{{ t('app.name') }}</div>

        <div class="topbar-controls">
          <label class="control-label" for="language-select">
            {{ t('common.language') }}
          </label>

          <select
            id="language-select"
            v-model="settings.locale"
            class="select-control language-select"
            aria-label="Language"
          >
            <option value="ru">RU</option>
            <option value="en">EN</option>
          </select>

          <label class="control-label" for="theme-select">
            {{ t('common.theme') }}
          </label>

          <select
            id="theme-select"
            v-model="settings.theme"
            class="select-control theme-select"
            aria-label="Theme"
          >
            <option
              v-for="option in themeOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </div>
      </header>

      <div class="page-content">
        <RouterView />
      </div>

      <footer class="app-footer">
        <span>Prompt Builder</span>
        <span>Local AI · Privacy first</span>
      </footer>
    </main>
  </div>
</template>
