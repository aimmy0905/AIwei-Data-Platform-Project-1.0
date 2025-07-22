<template>
  <div class="target-comparison-card">
    <div class="target-comparison-card__header">
      <div class="target-comparison-card__type">
        <component 
          :is="typeIcon" 
          :size="20" 
          class="target-comparison-card__type-icon"
          :style="{ color: typeColor }"
        />
        <h4 class="target-comparison-card__title">{{ typeTitle }}</h4>
      </div>
      <div class="target-comparison-card__status" :class="statusClass">
        {{ getStatusText() }}
      </div>
    </div>

    <div class="target-comparison-card__content">
      <!-- 目标和实际值对比 -->
      <div class="target-comparison-card__values">
        <div class="target-comparison-card__value-item">
          <div class="target-comparison-card__value-label">目标值</div>
          <div class="target-comparison-card__value-number target-value">
            {{ formatValue(targetValue) }}
          </div>
        </div>
        
        <div class="target-comparison-card__vs">VS</div>
        
        <div class="target-comparison-card__value-item">
          <div class="target-comparison-card__value-label">实际值</div>
          <div class="target-comparison-card__value-number actual-value">
            {{ formatValue(actualValue) }}
          </div>
        </div>
      </div>

      <!-- 进度条 -->
      <div class="target-comparison-card__progress">
        <div class="target-comparison-card__progress-bar">
          <div 
            class="target-comparison-card__progress-fill" 
            :style="{ 
              width: `${Math.min(completionRate, 100)}%`,
              backgroundColor: getProgressColor()
            }"
          >
            <div class="target-comparison-card__progress-text">
              {{ completionRate.toFixed(1) }}%
            </div>
          </div>
        </div>
      </div>

      <!-- 差值显示 -->
      <div class="target-comparison-card__difference">
        <div class="target-comparison-card__difference-item">
          <span class="target-comparison-card__difference-label">差值:</span>
          <span 
            class="target-comparison-card__difference-value"
            :class="{ 
              'positive': difference >= 0, 
              'negative': difference < 0 
            }"
          >
            {{ difference >= 0 ? '+' : '' }}{{ formatValue(difference) }}
          </span>
        </div>
        
        <div class="target-comparison-card__completion-rate">
          <span class="target-comparison-card__completion-label">完成率:</span>
          <span 
            class="target-comparison-card__completion-value"
            :class="completionRateClass"
          >
            {{ completionRate.toFixed(1) }}%
          </span>
        </div>
      </div>

      <!-- 趋势指示器 -->
      <div v-if="showTrend && trend" class="target-comparison-card__trend">
        <div class="target-comparison-card__trend-indicator" :class="`trend-${trend.direction}`">
          <component :is="getTrendIcon()" :size="14" />
          <span class="target-comparison-card__trend-text">
            {{ getTrendText() }}
          </span>
        </div>
      </div>
    </div>

    <!-- 额外操作 -->
    <div v-if="$slots.actions" class="target-comparison-card__actions">
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Target, DollarSign, TrendingUp, TrendingDown, Minus, AlertCircle } from 'lucide-vue-next'
import type { TargetComparison } from '@/types'

// Props
interface Props extends TargetComparison {
  showTrend?: boolean
  trend?: {
    direction: 'up' | 'down' | 'stable'
    value: number
    period: string
  }
}

const props = withDefaults(defineProps<Props>(), {
  showTrend: false
})

// 计算属性
const typeIcon = computed(() => {
  return props.targetType === 'service_fee' ? DollarSign : Target
})

const typeColor = computed(() => {
  return props.targetType === 'service_fee' ? '#52c41a' : '#1890ff'
})

const typeTitle = computed(() => {
  const titleMap = {
    service_fee: '服务费目标',
    new_orders: '新单目标'
  }
  return titleMap[props.targetType] || '目标'
})

const statusClass = computed(() => {
  if (props.completionRate >= 100) return 'status-completed'
  if (props.completionRate >= 80) return 'status-good'
  if (props.completionRate >= 50) return 'status-warning'
  return 'status-danger'
})

const completionRateClass = computed(() => {
  if (props.completionRate >= 100) return 'completion-excellent'
  if (props.completionRate >= 80) return 'completion-good'
  if (props.completionRate >= 50) return 'completion-warning'
  return 'completion-danger'
})

// 方法
const formatValue = (value: number): string => {
  if (props.unit === '%') {
    return `${value.toFixed(1)}%`
  }
  
  if (props.unit === '¥' || props.targetType === 'service_fee') {
    return formatCurrency(value)
  }
  
  if (value >= 10000) {
    return `${(value / 10000).toFixed(1)}万${props.unit}`
  }
  
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K${props.unit}`
  }
  
  return `${value.toLocaleString()}${props.unit}`
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

const getStatusText = (): string => {
  if (props.completionRate >= 100) return '已完成'
  if (props.completionRate >= 80) return '接近完成'
  if (props.completionRate >= 50) return '进行中'
  return '需关注'
}

const getProgressColor = (): string => {
  if (props.completionRate >= 100) return '#52c41a'  // 绿色
  if (props.completionRate >= 80) return '#1890ff'   // 蓝色
  if (props.completionRate >= 50) return '#faad14'   // 橙色
  return '#ff4d4f'  // 红色
}

const getTrendIcon = () => {
  if (!props.trend) return Minus
  
  switch (props.trend.direction) {
    case 'up': return TrendingUp
    case 'down': return TrendingDown
    default: return Minus
  }
}

const getTrendText = (): string => {
  if (!props.trend) return ''
  
  const { direction, value, period } = props.trend
  const directionText = direction === 'up' ? '上升' : direction === 'down' ? '下降' : '持平'
  const formattedValue = formatValue(Math.abs(value))
  
  return `${period}${directionText} ${formattedValue}`
}
</script>

<style scoped>
.target-comparison-card {
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 20px;
  transition: all 0.3s ease;
}

.target-comparison-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.target-comparison-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.target-comparison-card__type {
  display: flex;
  align-items: center;
  gap: 8px;
}

.target-comparison-card__title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #262626;
}

.target-comparison-card__status {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-completed {
  background: #f6ffed;
  color: #52c41a;
}

.status-good {
  background: #e6f7ff;
  color: #1890ff;
}

.status-warning {
  background: #fff7e6;
  color: #fa8c16;
}

.status-danger {
  background: #fff2f0;
  color: #ff4d4f;
}

.target-comparison-card__content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.target-comparison-card__values {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.target-comparison-card__value-item {
  flex: 1;
  text-align: center;
}

.target-comparison-card__value-label {
  font-size: 12px;
  color: #8c8c8c;
  margin-bottom: 4px;
}

.target-comparison-card__value-number {
  font-size: 24px;
  font-weight: 700;
  line-height: 1.2;
}

.target-comparison-card__value-number.target-value {
  color: #595959;
}

.target-comparison-card__value-number.actual-value {
  color: #1890ff;
}

.target-comparison-card__vs {
  font-size: 14px;
  font-weight: 600;
  color: #8c8c8c;
  margin: 0 16px;
}

.target-comparison-card__progress {
  position: relative;
}

.target-comparison-card__progress-bar {
  height: 24px;
  background: #f5f5f5;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
}

.target-comparison-card__progress-fill {
  height: 100%;
  border-radius: 12px;
  transition: width 0.8s ease;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 8px;
  min-width: 40px;
}

.target-comparison-card__progress-text {
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.target-comparison-card__difference {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.target-comparison-card__difference-item,
.target-comparison-card__completion-rate {
  display: flex;
  align-items: center;
  gap: 4px;
}

.target-comparison-card__difference-label,
.target-comparison-card__completion-label {
  font-size: 13px;
  color: #8c8c8c;
}

.target-comparison-card__difference-value {
  font-size: 14px;
  font-weight: 600;
}

.target-comparison-card__difference-value.positive {
  color: #52c41a;
}

.target-comparison-card__difference-value.negative {
  color: #ff4d4f;
}

.target-comparison-card__completion-value {
  font-size: 14px;
  font-weight: 600;
}

.completion-excellent {
  color: #52c41a;
}

.completion-good {
  color: #1890ff;
}

.completion-warning {
  color: #fa8c16;
}

.completion-danger {
  color: #ff4d4f;
}

.target-comparison-card__trend {
  display: flex;
  justify-content: center;
}

.target-comparison-card__trend-indicator {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
}

.trend-up {
  background: #f6ffed;
  color: #52c41a;
}

.trend-down {
  background: #fff2f0;
  color: #ff4d4f;
}

.trend-stable {
  background: #f5f5f5;
  color: #8c8c8c;
}

.target-comparison-card__actions {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .target-comparison-card {
    padding: 16px;
  }
  
  .target-comparison-card__values {
    flex-direction: column;
    gap: 16px;
  }
  
  .target-comparison-card__vs {
    transform: rotate(90deg);
    margin: 8px 0;
  }
  
  .target-comparison-card__value-number {
    font-size: 20px;
  }
  
  .target-comparison-card__difference {
    flex-direction: column;
    gap: 8px;
    align-items: stretch;
  }
}

/* 动画效果 */
@keyframes progressFill {
  from {
    width: 0%;
  }
}

.target-comparison-card__progress-fill {
  animation: progressFill 1s ease-out;
}
</style>