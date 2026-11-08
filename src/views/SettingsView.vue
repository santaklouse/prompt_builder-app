<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useSettingsStore } from '../stores/settings'

const { t } = useI18n()
const settings = useSettingsStore()
</script>

<template>
  <section class="page-heading">
    <div>
      <div class="eyebrow">PREFERENCES</div>
      <h1>{{ t('settings.title') }}</h1>
      <p class="page-description">{{ t('settings.description') }}</p>
    </div>
  </section>

  <section class="settings-list">
    <article class="panel settings-card">
      <div class="settings-card-icon">◐</div>
      <div class="settings-card-content">
        <h2>{{ t('settings.appearance') }}</h2>
        <p>{{ t('settings.appearanceDescription') }}</p>

        <div class="settings-theme-options">
          <label
            v-for="item in [
              { value: 'auto', label: t('common.auto') },
              { value: 'light', label: t('common.light') },
              { value: 'dark', label: t('common.dark') },
            ]"
            :key="item.value"
            class="style-option"
            :class="{ selected: settings.theme === item.value }"
          >
            <input
              v-model="settings.theme"
              type="radio"
              name="settings-theme"
              :value="item.value"
            />
            {{ item.label }}
          </label>
        </div>
      </div>
    </article>

    <article class="panel settings-card">
      <div class="settings-card-icon">文</div>
      <div class="settings-card-content">
        <h2>{{ t('common.language') }}</h2>
        <p>{{ t('settings.languageDescription') }}</p>

        <div class="settings-theme-options">
          <label
            class="style-option"
            :class="{ selected: settings.locale === 'ru' }"
          >
            <input
              v-model="settings.locale"
              type="radio"
              name="settings-language"
              value="ru"
            />
            Русский
          </label>

          <label
            class="style-option"
            :class="{ selected: settings.locale === 'en' }"
          >
            <input
              v-model="settings.locale"
              type="radio"
              name="settings-language"
              value="en"
            />
            English
          </label>
        </div>
      </div>
    </article>

    <article class="panel settings-card">
      <div class="settings-card-icon">✳</div>
      <div class="settings-card-content">
        <h2>{{ t('settings.ai') }}</h2>
        <p>{{ t('settings.aiDescription') }}</p>
        <div class="model-status">
          <span class="status-dot status-dot-muted"></span>
          {{ t('settings.modelStatus') }}
        </div>
      </div>
    </article>

    <article class="panel settings-card">
      <div class="settings-card-icon">⌑</div>
      <div class="settings-card-content">
        <h2>{{ t('settings.privacy') }}</h2>
        <p>{{ t('settings.privacyDescription') }}</p>
        <div class="privacy-label">
          <span class="status-dot"></span>
          Local-first architecture
        </div>
      </div>
    </article>
  </section>
</template>
