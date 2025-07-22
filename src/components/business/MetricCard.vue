<template>
  <div class="metric-card" :style="{ borderLeftColor: color }">
    <div class="metric-card__header">
      <div class="metric-card__icon" :style="{ backgroundColor: color }">
        <component :is="iconComponent" :size="20" />
      </div>
      <div class="metric-card__title-group">
        <h3 class="metric-card__title">{{ title }}</h3>
        <div v-if="target" class="metric-card__target">
          目标: {{ formatValue(target, unit) }}
        </div>
      </div>
    </div>

    <div class="metric-card__body">
      <div class="metric-card__value-section">
        <div class="metric-card__main-value">
          {{ formatValue(value, unit) }}
        </div>
        
        <!-- 进度条 (当有目标值时显示) -->
        <div v-if="target" class="metric-card__progress">
          <div class="metric-card__progress-bar">
            <div 
              class="metric-card__progress-fill" 
              :style="{ 
                width: `${Math.min(progressPercentage, 100)}%`,
                backgroundColor: getProgressColor()
              }"
            ></div>
          </div>
          <div class="metric-card__progress-text">
            {{ progressPercentage.toFixed(1) }}%
          </div>
        </div>
      </div>

      <!-- 趋势指示器 -->
      <div class="metric-card__trend">
        <div class="metric-card__trend-indicator" :class="`metric-card__trend-indicator--${trend}`">
          <component :is="trendIcon" :size="16" />
          <span class="metric-card__trend-value">{{ formatTrendValue() }}</span>
        </div>
        <div class="metric-card__trend-period">{{ trendPeriod }}</div>
      </div>
    </div>

    <!-- 额外信息 -->
    <div v-if="$slots.extra" class="metric-card__extra">
      <slot name="extra"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { TrendingUp, TrendingDown, Minus, DollarSign, Target, Users, BarChart3 } from 'lucide-vue-next'
import type { MetricCardProps } from '@/types'

// Props
const props = withDefaults(defineProps<MetricCardProps>(), {
  unit: '',
  trend: 'stable',
  trendValue: 0,
  trendPeriod: '对比上期',
  color: '#1890ff',
  icon: 'BarChart3'
})

// 计算属性
const iconComponent = computed(() => {
  const iconMap: Record<string, any> = {
    DollarSign,
    Target,
    Users,
    BarChart3,
    TrendingUp,
    TrendingDown
  }
  return iconMap[props.icon] || BarChart3
})

const trendIcon = computed(() => {
  switch (props.trend) {
    case 'up':
      return TrendingUp
    case 'down':
      return TrendingDown
    default:
      return Minus
  }
})

const progressPercentage = computed(() => {
  if (!props.target || props.target === 0) return 0
  return (props.value / props.target) * 100
})

// 方法
const formatValue = (value: number, unit: string): string => {
  let formattedValue: string

  if (unit === '%') {
    formattedValue = value.toFixed(1) + '%'
  } else if (unit === '¥' || unit === 'CNY') {
    formattedValue = formatCurrency(value)
  } else if (value >= 10000) {
    formattedValue = (value / 10000).toFixed(1) + '万'
  } else if (value >= 1000) {
    formattedValue = (value / 1000).toFixed(1) + 'K'
  } else {
    formattedValue = value.toLocaleString()
  }

  return unit && unit !== '%' && unit !== '¥' && unit !== 'CNY' 
    ? `${formattedValue}${unit}` 
    : formattedValue
}

const formatCurrency = (value: number): string => {
  if (value >= 100000000) {
    return `¥${(value / 100000000).toFixed(2)}亿`
  } else if (value >= 10000) {
    return `¥${(value / 10000).toFixed(2)}万`
  } else {
    return `¥${value.toLocaleString()}`
  }
}

const formatTrendValue = (): string => {
  const absValue = Math.abs(props.trendValue)
  
  if (props.unit === '%') {
    return `${absValue.toFixed(1)}%`
  } else if (absValue >= 10000) {
    return `${(absValue / 10000).toFixed(1)}万`
  } else if (absValue >= 1000) {
    return `${(absValue / 1000).toFixed(1)}K`
  } else {
    return absValue.toLocaleString()
  }
}

const getProgressColor = (): string => {
  const percentage = progressPercentage.value
  
  if (percentage >= 100) {
    return '#52c41a'  // 绿色 - 已完成
  } else if (percentage >= 80) {
    return '#1890ff'  // 蓝色 - 接近完成
  } else if (percentage >= 50) {
    return '#faad14'  // 橙色 - 进行中
  } else {
    return '#ff4d4f'  // 红色 - 需关注
  }
}
</script>

<style scoped>
.metric-card {
  background: #fff;
  border: 1px solid #f0f0f0;
  border-left: 4px solid #1890ff;
  border-radius: 8px;
  padding: 20px;
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.metric-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.metric-card__header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 16px;
}

.metric-card__icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.metric-card__title-group {
  flex: 1;
  min-width: 0;
}

.metric-card__title {
  font-size: 16px;
  font-weight: 600;
  color: #262626;
  margin: 0 0 4px 0;
  line-height: 1.4;
}

.metric-card__target {
  font-size: 12px;
  color: #8c8c8c;
  line-height: 1.4;
}

.metric-card__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.metric-card__value-section {
  flex: 1;
}

.metric-card__main-value {
  font-size: 32px;
  font-weight: 700;
  color: #262626;
  line-height: 1.2;
  margin-bottom: 12px;
}

.metric-card__progress {
  display: flex;
  align-items: center;
  gap: 8px;
}

.metric-card__progress-bar {
  flex: 1;
  height: 6px;
  background: #f5f5f5;
  border-radius: 3px;
  overflow: hidden;
}

.metric-card__progress-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.metric-card__progress-text {
  font-size: 12px;
  font-weight: 600;
  color: #595959;
  min-width: 40px;
  text-align: right;
}

.metric-card__trend {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.metric-card__trend-indicator {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.metric-card__trend-indicator--up {
  background: #f6ffed;
  color: #52c41a;
}

.metric-card__trend-indicator--down {
  background: #fff2f0;
  color: #ff4d4f;
}

.metric-card__trend-indicator--stable {
  background: #f5f5f5;
  color: #8c8c8c;
}

.metric-card__trend-value {
  font-weight: 600;
}

.metric-card__trend-period {
  font-size: 11px;
  color: #8c8c8c;
}

.metric-card__extra {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .metric-card {
    padding: 16px;
  }
  
  .metric-card__main-value {
    font-size: 28px;
  }
  
  .metric-card__title {
    font-size: 14px;
  }
  
  .metric-card__icon {
    width: 36px;
    height: 36px;
  }
}

/* 特殊状态样式 */
.metric-card--warning {
  border-left-color: #faad14;
}

.metric-card--success {
  border-left-color: #52c41a;
}

.metric-card--danger {
  border-left-color: #ff4d4f;
}

.metric-card--loading {
  opacity: 0.7;
  pointer-events: none;
}

.metric-card--loading .metric-card__main-value {
  background: linear-gradient(90deg, #f0f0f0 25%, #e6e6e6 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  color: transparent;
  border-radius: 4px;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>