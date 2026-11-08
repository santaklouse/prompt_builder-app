<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

type TargetModel = 'universal' | 'chatgpt' | 'claude' | 'gemini' | 'deepseek'
type PromptStyle = 'balanced' | 'detailed' | 'concise' | 'expert'

const { t, locale } = useI18n()

const request = ref('')
const target = ref<TargetModel>('universal')
const style = ref<PromptStyle>('balanced')

const options = ref({
  role: true,
  context: true,
  steps: true,
  examples: false,
  validation: true,
  questions: false,
})

const generatedPrompt = ref('')
const copyStatus = ref(false)
const errorMessage = ref('')

const selectedOptions = computed(() =>
  Object.entries(options.value)
    .filter(([, enabled]) => enabled)
    .map(([key]) => key),
)

const targetOptions: { value: TargetModel; label: string }[] = [
  { value: 'universal', label: 'builder.targets.universal' },
  { value: 'chatgpt', label: 'builder.targets.chatgpt' },
  { value: 'claude', label: 'builder.targets.claude' },
  { value: 'gemini', label: 'builder.targets.gemini' },
  { value: 'deepseek', label: 'builder.targets.deepseek' },
]

const styleOptions: { value: PromptStyle; label: string }[] = [
  { value: 'balanced', label: 'builder.styles.balanced' },
  { value: 'detailed', label: 'builder.styles.detailed' },
  { value: 'concise', label: 'builder.styles.concise' },
  { value: 'expert', label: 'builder.styles.expert' },
]

const checkboxOptions = [
  { key: 'role', label: 'builder.options.role' },
  { key: 'context', label: 'builder.options.context' },
  { key: 'steps', label: 'builder.options.steps' },
  { key: 'examples', label: 'builder.options.examples' },
  { key: 'validation', label: 'builder.options.validation' },
  { key: 'questions', label: 'builder.options.questions' },
] as const

function buildPrompt() {
  const trimmedRequest = request.value.trim()

  if (!trimmedRequest) {
    errorMessage.value = t('builder.inputRequired')
    generatedPrompt.value = ''
    return
  }

  errorMessage.value = ''

  const isEnglish = locale.value === 'en'
  const lines: string[] = []

  const section = (title: string, content: string) => {
    lines.push(`## ${title}`, content, '')
  }

  if (options.value.role) {
    section(
      t('builder.sections.role'),
      isEnglish
        ? 'Act as an experienced subject matter expert. Apply professional knowledge and follow established best practices.'
        : 'Действуй как опытный эксперт в соответствующей предметной области. Применяй профессиональные знания и следуй проверенным практикам.',
    )
  }

  if (options.value.context) {
    section(
      t('builder.sections.context'),
      isEnglish
        ? 'Analyze the available context. If information is missing, clearly state your assumptions and do not present assumptions as facts.'
        : 'Проанализируй доступный контекст. Если информации недостаточно, явно обозначь свои предположения и не выдавай их за факты.',
    )
  }

  section(
    t('builder.sections.objective'),
    trimmedRequest,
  )

  section(
    t('builder.sections.requirements'),
    isEnglish
      ? `Target model: ${target.value}. Prompt style: ${style.value}.`
      : `Целевая модель: ${target.value}. Стиль промпта: ${style.value}.`,
  )

  if (options.value.steps) {
    section(
      t('builder.sections.execution'),
      isEnglish
        ? 'Break the task into logical steps. Explain important decisions and complete the steps in a clear order.'
        : 'Разбей задачу на логические этапы. Объясняй важные решения и выполняй этапы в понятной последовательности.',
    )
  }

  if (options.value.examples) {
    section(
      t('builder.sections.examples'),
      isEnglish
        ? 'Include practical examples where they help explain the solution.'
        : 'Добавляй практические примеры там, где они помогают объяснить решение.',
    )
  }

  if (options.value.validation) {
    section(
      t('builder.sections.validation'),
      isEnglish
        ? 'Check the result for correctness, completeness, consistency and compliance with all requirements. Highlight limitations.'
        : 'Проверь результат на корректность, полноту, согласованность и соответствие всем требованиям. Отдельно укажи ограничения.',
    )
  }

  if (options.value.questions) {
    section(
      t('builder.sections.questions'),
      isEnglish
        ? 'If essential information is missing, ask concise clarifying questions before making critical assumptions.'
        : 'Если не хватает критически важной информации, задай краткие уточняющие вопросы до того, как делать существенные предположения.',
    )
  }

  section(
    t('builder.sections.output'),
    isEnglish
      ? 'Present the result in a clear, structured format. Use headings and lists where appropriate.'
      : 'Представь результат в понятном структурированном формате. Используй заголовки и списки, когда это уместно.',
  )

  if (style.value === 'concise') {
    lines.push(
      isEnglish
        ? 'Keep the response concise. Avoid unnecessary explanations.'
        : 'Отвечай кратко. Избегай ненужных объяснений.',
    )
  }

  if (style.value === 'detailed' || style.value === 'expert') {
    lines.push(
      isEnglish
        ? 'Provide sufficient technical detail. Explain important trade-offs and alternatives.'
        : 'Предоставляй достаточную техническую детализацию. Объясняй важные компромиссы и альтернативы.',
    )
  }

  generatedPrompt.value = lines.join('\n').trim()
}

async function copyPrompt() {
  if (!generatedPrompt.value) {
    return
  }

  try {
    await navigator.clipboard.writeText(generatedPrompt.value)
    copyStatus.value = true
    window.setTimeout(() => {
      copyStatus.value = false
    }, 1800)
  } catch {
    errorMessage.value = 'Clipboard access is unavailable in this browser.'
  }
}

function clearForm() {
  request.value = ''
  generatedPrompt.value = ''
  errorMessage.value = ''
  copyStatus.value = false
}
</script>

<template>
  <section class="page-heading">
    <div>
      <div class="eyebrow">{{ t('builder.eyebrow') }}</div>
      <h1>{{ t('builder.title') }}</h1>
      <p class="page-description">{{ t('builder.description') }}</p>
    </div>
  </section>

  <section class="builder-grid">
    <div class="panel input-panel">
      <div class="panel-heading">
        <div>
          <div class="panel-kicker">01 / INPUT</div>
          <h2>{{ t('builder.requestLabel') }}</h2>
        </div>
        <button class="text-button" type="button" @click="clearForm">
          {{ t('common.clear') }}
        </button>
      </div>

      <textarea
        v-model="request"
        class="request-input"
        :placeholder="t('builder.requestPlaceholder')"
        rows="6"
      />

      <div class="field-group">
        <div class="field-label">{{ t('builder.targetLabel') }}</div>

        <div class="radio-grid">
          <label
            v-for="item in targetOptions"
            :key="item.value"
            class="choice-card"
            :class="{ selected: target === item.value }"
          >
            <input
              v-model="target"
              type="radio"
              name="target"
              :value="item.value"
            />
            <span>{{ t(item.label) }}</span>
          </label>
        </div>
      </div>

      <div class="field-group">
        <div class="field-label">{{ t('builder.styleLabel') }}</div>

        <div class="style-options">
          <label
            v-for="item in styleOptions"
            :key="item.value"
            class="style-option"
            :class="{ selected: style === item.value }"
          >
            <input
              v-model="style"
              type="radio"
              name="style"
              :value="item.value"
            />
            {{ t(item.label) }}
          </label>
        </div>
      </div>

      <div class="field-group">
        <div class="field-label">{{ t('builder.optionsLabel') }}</div>

        <div class="checkbox-grid">
          <label
            v-for="item in checkboxOptions"
            :key="item.key"
            class="checkbox-option"
          >
            <input
              v-model="options[item.key]"
              type="checkbox"
            />
            <span>{{ t(item.label) }}</span>
          </label>
        </div>
      </div>

      <div v-if="errorMessage" class="error-message" role="alert">
        {{ errorMessage }}
      </div>

      <button class="primary-button generate-button" type="button" @click="buildPrompt">
        <span>✳</span>
        {{ t('builder.generate') }}
      </button>
    </div>

    <div class="panel output-panel">
      <div class="panel-heading">
        <div>
          <div class="panel-kicker">02 / OUTPUT</div>
          <h2>{{ t('builder.outputTitle') }}</h2>
        </div>

        <button
          class="secondary-button"
          type="button"
          :disabled="!generatedPrompt"
          @click="copyPrompt"
        >
          {{ copyStatus ? t('common.copied') : t('common.copy') }}
        </button>
      </div>

      <div v-if="generatedPrompt" class="output-content">
        <div class="output-status">
          <span class="status-dot"></span>
          {{ t('builder.outputReady') }}
        </div>

        <pre class="prompt-output">{{ generatedPrompt }}</pre>
      </div>

      <div v-else class="output-empty">
        <div class="empty-icon">✳</div>
        <h3>{{ t('builder.outputEmpty') }}</h3>
        <p>{{ t('builder.outputHint') }}</p>
      </div>

      <div class="output-footer">
        <span>{{ generatedPrompt.length }} characters</span>
        <span>{{ selectedOptions.length }} options enabled</span>
      </div>
    </div>
  </section>
</template>
