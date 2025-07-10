<template>
  <div class="comparison-indicator" :class="comparisonClass">
    <div class="comparison-content">
      <!-- 趋势箭头 -->
      <div class="trend-icon" :class="trendClass">
        <TrendingUp v-if="comparison.trend === 'up'" :size="14" />
        <TrendingDown v-if="comparison.trend === 'down'" :size="14" />
        <Minus v-if="comparison.trend === 'neutral'" :size="14" />
      </div>

      <!-- 百分比变化 -->
      <div class="percentage-change">
        {{ formatPercentage(comparison.changePercent) }}
      </div>

      <!-- 绝对变化 (可选) -->
      <div v-if="showAbsolute" class="absolute-change">
        {{ formatAbsolute(comparison.change) }}
      </div>
    </div>

    <!-- 期间标签 (可选) -->
    <div v-if="showPeriodLabel" class="period-label">
      {{ periodLabel }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { TrendingUp, TrendingDown, Minus } from 'lucide-vue-next'
import type { PeriodComparison, ComparisonPeriod } from '@/types'

interface Props {
  comparison: PeriodComparison
  period?: ComparisonPeriod
  showAbsolute?: boolean
  showPeriodLabel?: boolean
  showBothPeriods?: boolean
  format?: 'number' | 'currency' | 'percentage'
}

const props = withDefaults(defineProps<Props>(), {
  period: 'mom',
  showAbsolute: false,
  showPeriodLabel: false,
  showBothPeriods: false,
  format: 'number'
})

// 计算样式类
const comparisonClass = computed(() => ({
  'comparison-indicator--positive': props.comparison.trend === 'up',
  'comparison-indicator--negative': props.comparison.trend === 'down',
  'comparison-indicator--neutral': props.comparison.trend === 'neutral'
}))

const trendClass = computed(() => ({
  'trend-icon--positive': props.comparison.trend === 'up',
  'trend-icon--negative': props.comparison.trend === 'down',
  'trend-icon--neutral': props.comparison.trend === 'neutral'
}))

// 期间标签
const periodLabel = computed(() => {
  return props.period === 'mom' ? '环比' : '同比'
})

// 格式化百分比
const formatPercentage = (value: number): string => {
  const sign = value > 0 ? '+' : ''
  return `${sign}${Math.abs(value).toFixed(1)}%`
}

// 格式化绝对值
const formatAbsolute = (value: number): string => {
  const sign = value > 0 ? '+' : ''

  switch (props.format) {
    case 'currency':
      return `${sign}$${Math.abs(value).toLocaleString()}`
    case 'percentage':
      return `${sign}${Math.abs(value).toFixed(1)}%`
    default:
      return `${sign}${Math.abs(value).toLocaleString()}`
  }
}
</script>

<style scoped>
.comparison-indicator {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  font-size: 0.75rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.comparison-content {
  display: flex;
  align-items: center;
  gap: 4px;
}

.trend-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.trend-icon--positive {
  background-color: var(--color-success-light, #f0f9ff);
  color: var(--color-success, #10b981);
}

.trend-icon--negative {
  background-color: var(--color-error-light, #fef2f2);
  color: var(--color-error, #ef4444);
}

.trend-icon--neutral {
  background-color: var(--color-gray-100, #f5f5f5);
  color: var(--color-gray-500, #6b7280);
}

.percentage-change {
  font-weight: 600;
  line-height: 1;
}

.comparison-indicator--positive .percentage-change {
  color: var(--color-success, #10b981);
}

.comparison-indicator--negative .percentage-change {
  color: var(--color-error, #ef4444);
}

.comparison-indicator--neutral .percentage-change {
  color: var(--color-gray-500, #6b7280);
}

.absolute-change {
  font-size: 0.6875rem;
  opacity: 0.8;
  font-weight: 400;
}

.period-label {
  font-size: 0.625rem;
  color: var(--color-gray-400, #9ca3af);
  font-weight: 400;
  text-align: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .comparison-indicator {
    font-size: 0.6875rem;
  }

  .trend-icon {
    width: 16px;
    height: 16px;
  }

  .absolute-change {
    font-size: 0.625rem;
  }

  .period-label {
    font-size: 0.5625rem;
  }
}

/* 悬停效果 */
.comparison-indicator:hover .trend-icon {
  transform: scale(1.1);
}

/* 深色模式支持 */
@media (prefers-color-scheme: dark) {
  .trend-icon--positive {
    background-color: rgba(16, 185, 129, 0.1);
  }

  .trend-icon--negative {
    background-color: rgba(239, 68, 68, 0.1);
  }

  .trend-icon--neutral {
    background-color: rgba(107, 114, 128, 0.1);
  }
}
</style>
