import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import type { Locale } from '../i18n'

export type ThemeMode = 'auto' | 'light' | 'dark'

const STORAGE_KEY = 'prompt-builder-settings'

interface StoredSettings {
  locale?: Locale
  theme?: ThemeMode
}

function readSettings(): StoredSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)

    if (!raw) {
      return {}
    }

    return JSON.parse(raw) as StoredSettings
  } catch {
    return {}
  }
}

export const useSettingsStore = defineStore('settings', () => {
  const stored = readSettings()

  const locale = ref<Locale>(
    stored.locale === 'en' ? 'en' : 'ru',
  )

  const theme = ref<ThemeMode>(
    stored.theme === 'light' || stored.theme === 'dark'
      ? stored.theme
      : 'auto',
  )

  const isAutoTheme = computed(() => theme.value === 'auto')

  watch(
    [locale, theme],
    ([newLocale, newTheme]) => {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            locale: newLocale,
            theme: newTheme,
          }),
        )
      } catch {
        // The application remains usable if storage is unavailable.
      }
    },
    { deep: true },
  )

  return {
    locale,
    theme,
    isAutoTheme,
  }
})
