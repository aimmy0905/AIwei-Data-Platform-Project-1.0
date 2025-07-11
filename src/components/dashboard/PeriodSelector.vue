<template>
  <div class="period-selector">
    <div class="selector-label">
      <Calendar :size="16" />
      <span>对比周期</span>
    </div>
    <div class="selector-buttons">
      <button
        v-for="option in periodOptions"
        :key="option.value"
        class="period-btn"
        :class="{ 'period-btn--active': modelValue === option.value }"
        @click="$emit('update:modelValue', option.value)"
      >
        <component :is="option.icon" :size="14" />
        {{ option.label }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Calendar, TrendingUp, BarChart3 } from 'lucide-vue-next'
import type { ComparisonPeriod } from '@/types'

interface Props {
  modelValue: ComparisonPeriod
}

interface PeriodOption {
  value: ComparisonPeriod
  label: string
  icon: any
  description: string
}

defineProps<Props>()
defineEmits<{
  'update:modelValue': [value: ComparisonPeriod]
}>()

const periodOptions: PeriodOption[] = [
  {
    value: 'mom',
    label: '月度对比',
    icon: TrendingUp,
    description: '与上月数据对比'
  },
  {
    value: 'qoq',
    label: '季度对比',
    icon: BarChart3,
    description: '与上季度数据对比'
  }
]
</script>

<style scoped>
.period-selector {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-sm);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
}

.selector-label {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  white-space: nowrap;
}

.selector-buttons {
  display: flex;
  gap: var(--spacing-xs);
}

.period-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.period-btn:hover {
  background: var(--color-primary-light);
  border-color: var(--color-primary);
  color: var(--color-primary);
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

.period-btn--active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
  box-shadow: var(--shadow-md);
}

.period-btn--active:hover {
  background: var(--color-primary-dark);
  border-color: var(--color-primary-dark);
  color: white;
  transform: translateY(-1px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .period-selector {
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-sm);
  }

  .selector-label {
    justify-content: center;
  }

  .selector-buttons {
    justify-content: center;
  }

  .period-btn {
    flex: 1;
    justify-content: center;
    padding: var(--spacing-sm);
  }
}

@media (max-width: 480px) {
  .period-selector {
    padding: var(--spacing-xs);
  }

  .selector-buttons {
    flex-direction: column;
  }

  .period-btn {
    width: 100%;
  }
}

/* 深色模式支持 */
@media (prefers-color-scheme: dark) {
  .period-selector {
    background: var(--color-surface-dark, #1f2937);
    border-color: var(--color-border-dark, #374151);
  }

  .period-btn {
    border-color: var(--color-border-dark, #374151);
    color: var(--color-text-secondary-dark, #d1d5db);
  }

  .period-btn:hover {
    background: var(--color-primary-light-dark, rgba(59, 130, 246, 0.1));
  }
}
</style>
