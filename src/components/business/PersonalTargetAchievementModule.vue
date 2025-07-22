<template>
  <div class="personal-target-achievement-module">
    <div class="target-achievement-module__header">
      <h3 class="target-achievement-module__title">目标达成分析</h3>
      <div class="target-achievement-module__controls">
        <TimeRangePicker 
          v-model="selectedTimeRange"
          @change="handleTimeRangeChange"
        />
      </div>
    </div>

    <div class="target-achievement-module__content">
      <!-- 目标进度圆环图 -->
      <div class="target-progress-section">
        <div class="progress-rings">
          <div class="progress-ring-container">
            <div class="progress-ring-wrapper">
              <svg class="progress-ring" width="160" height="160">
                <!-- 背景圆环 -->
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke="#f0f0f0"
                  stroke-width="8"
                />
                <!-- 服务费进度 -->
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  :stroke="getServiceFeeColor()"
                  stroke-width="8"
                  stroke-linecap="round"
                  :stroke-dasharray="ringCircumference"
                  :stroke-dashoffset="serviceFeeOffset"
                  transform="rotate(-90 80 80)"
                  class="progress-ring__progress"
                />
              </svg>
              <div class="progress-ring__content">
                <div class="progress-ring__percentage">
                  {{ personalPerformance.serviceFeeCompletionRate.toFixed(0) }}%
                </div>
                <div class="progress-ring__label">服务费完成</div>
              </div>
            </div>
            <div class="progress-ring-info">
              <div class="ring-info-item">
                <span class="ring-info-label">目标:</span>
                <span class="ring-info-value">{{ formatCurrency(personalPerformance.serviceFeeTarget) }}</span>
              </div>
              <div class="ring-info-item">
                <span class="ring-info-label">实际:</span>
                <span class="ring-info-value">{{ formatCurrency(personalPerformance.serviceFeeActual) }}</span>
              </div>
              <div class="ring-info-item">
                <span class="ring-info-label">差额:</span>
                <span class="ring-info-value" :class="getGapClass('serviceFee')">
                  {{ formatCurrency(Math.abs(personalPerformance.serviceFeeActual - personalPerformance.serviceFeeTarget)) }}
                </span>
              </div>
            </div>
          </div>

          <div class="progress-ring-container">
            <div class="progress-ring-wrapper">
              <svg class="progress-ring" width="160" height="160">
                <!-- 背景圆环 -->
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke="#f0f0f0"
                  stroke-width="8"
                />
                <!-- 新单进度 -->
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  :stroke="getNewOrdersColor()"
                  stroke-width="8"
                  stroke-linecap="round"
                  :stroke-dasharray="ringCircumference"
                  :stroke-dashoffset="newOrdersOffset"
                  transform="rotate(-90 80 80)"
                  class="progress-ring__progress"
                />
              </svg>
              <div class="progress-ring__content">
                <div class="progress-ring__percentage">
                  {{ personalPerformance.newOrdersCompletionRate.toFixed(0) }}%
                </div>
                <div class="progress-ring__label">新单完成</div>
              </div>
            </div>
            <div class="progress-ring-info">
              <div class="ring-info-item">
                <span class="ring-info-label">目标:</span>
                <span class="ring-info-value">{{ personalPerformance.newOrdersTarget }}单</span>
              </div>
              <div class="ring-info-item">
                <span class="ring-info-label">实际:</span>
                <span class="ring-info-value">{{ personalPerformance.newOrdersActual }}单</span>
              </div>
              <div class="ring-info-item">
                <span class="ring-info-label">差额:</span>
                <span class="ring-info-value" :class="getGapClass('newOrders')">
                  {{ Math.abs(personalPerformance.newOrdersActual - personalPerformance.newOrdersTarget) }}单
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 目标达成预测 -->
      <div class="target-forecast-section">
        <h4 class="forecast-title">目标达成预测</h4>
        <div class="forecast-cards">
          <div class="forecast-card">
            <div class="forecast-card__header">
              <TrendingUp :size="20" />
              <span class="forecast-card__title">本月预测</span>
            </div>
            <div class="forecast-card__content">
              <div class="forecast-metric">
                <span class="forecast-label">服务费预计完成:</span>
                <span class="forecast-value" :class="getForecastClass(monthlyForecast.serviceFee)">
                  {{ monthlyForecast.serviceFee.toFixed(1) }}%
                </span>
              </div>
              <div class="forecast-metric">
                <span class="forecast-label">新单预计完成:</span>
                <span class="forecast-value" :class="getForecastClass(monthlyForecast.newOrders)">
                  {{ monthlyForecast.newOrders.toFixed(1) }}%
                </span>
              </div>
            </div>
          </div>

          <div class="forecast-card">
            <div class="forecast-card__header">
              <Calendar :size="20" />
              <span class="forecast-card__title">季度预测</span>
            </div>
            <div class="forecast-card__content">
              <div class="forecast-metric">
                <span class="forecast-label">服务费预计完成:</span>
                <span class="forecast-value" :class="getForecastClass(quarterlyForecast.serviceFee)">
                  {{ quarterlyForecast.serviceFee.toFixed(1) }}%
                </span>
              </div>
              <div class="forecast-metric">
                <span class="forecast-label">新单预计完成:</span>
                <span class="forecast-value" :class="getForecastClass(quarterlyForecast.newOrders)">
                  {{ quarterlyForecast.newOrders.toFixed(1) }}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 改善建议 -->
      <div class="improvement-suggestions">
        <h4 class="suggestions-title">改善建议</h4>
        <div class="suggestions-list">
          <div 
            v-for="(suggestion, index) in improvementSuggestions"
            :key="index"
            class="suggestion-item"
            :class="getSuggestionClass(suggestion.type)"
          >
            <div class="suggestion-icon">
              <component :is="getSuggestionIcon(suggestion.type)" :size="18" />
            </div>
            <div class="suggestion-content">
              <h5 class="suggestion-title">{{ suggestion.title }}</h5>
              <p class="suggestion-description">{{ suggestion.description }}</p>
            </div>
            <div class="suggestion-priority">
              <span class="priority-badge" :class="getPriorityClass(suggestion.priority)">
                {{ getPriorityText(suggestion.priority) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { TrendingUp, Calendar, Target, Users, Clock, Lightbulb, AlertTriangle } from 'lucide-vue-next'
import TimeRangePicker from './TimeRangePicker.vue'
import type { PersonalPerformance, TimeRange } from '@/types'

interface Suggestion {
  type: 'target' | 'customer' | 'time' | 'strategy'
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
}

interface Props {
  personalPerformance: PersonalPerformance
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<{
  'time-range-change': [timeRange: TimeRange]
}>()

const selectedTimeRange = ref<TimeRange>({
  type: 'quick',
  startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
  endDate: new Date().toISOString().split('T')[0],
  period: 'monthly',
  label: '本月'
})

// 圆环相关计算
const ringCircumference = 2 * Math.PI * 70

const serviceFeeOffset = computed(() => {
  const percentage = Math.min(props.personalPerformance.serviceFeeCompletionRate, 100)
  return ringCircumference - (percentage / 100) * ringCircumference
})

const newOrdersOffset = computed(() => {
  const percentage = Math.min(props.personalPerformance.newOrdersCompletionRate, 100)
  return ringCircumference - (percentage / 100) * ringCircumference
})

// 模拟预测数据
const monthlyForecast = ref({
  serviceFee: props.personalPerformance.serviceFeeCompletionRate * 1.1,
  newOrders: props.personalPerformance.newOrdersCompletionRate * 1.05
})

const quarterlyForecast = ref({
  serviceFee: props.personalPerformance.serviceFeeCompletionRate * 1.25,
  newOrders: props.personalPerformance.newOrdersCompletionRate * 1.2
})

// 改善建议数据
const improvementSuggestions = computed<Suggestion[]>(() => {
  const suggestions: Suggestion[] = []
  
  if (props.personalPerformance.serviceFeeCompletionRate < 80) {
    suggestions.push({
      type: 'target',
      title: '加强服务费达成',
      description: '当前服务费完成率较低，建议重点关注高价值客户，提升单客户服务费',
      priority: 'high'
    })
  }
  
  if (props.personalPerformance.newOrdersCompletionRate < 85) {
    suggestions.push({
      type: 'customer',
      title: '增加新单获取',
      description: '新单完成率有提升空间，建议加强客户开发和现有客户深度合作',
      priority: 'high'
    })
  }
  
  if (props.personalPerformance.assignedCustomerCount < 20) {
    suggestions.push({
      type: 'customer',
      title: '扩大客户基数',
      description: '当前客户数量偏少，建议主动开发新客户，扩大客户基数',
      priority: 'medium'
    })
  }
  
  suggestions.push({
    type: 'strategy',
    title: '优化客户结构',
    description: '分析高价值客户特征，复制成功模式到其他客户',
    priority: 'medium'
  })
  
  return suggestions
})

// 方法
const handleTimeRangeChange = (timeRange: TimeRange) => {
  selectedTimeRange.value = timeRange
  emit('time-range-change', timeRange)
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

const getServiceFeeColor = () => {
  const rate = props.personalPerformance.serviceFeeCompletionRate
  if (rate >= 120) return '#52c41a'
  if (rate >= 100) return '#1890ff'
  if (rate >= 80) return '#faad14'
  return '#ff4d4f'
}

const getNewOrdersColor = () => {
  const rate = props.personalPerformance.newOrdersCompletionRate
  if (rate >= 120) return '#52c41a'
  if (rate >= 100) return '#1890ff'
  if (rate >= 80) return '#faad14'
  return '#ff4d4f'
}

const getGapClass = (type: 'serviceFee' | 'newOrders') => {
  const isPositive = type === 'serviceFee' 
    ? props.personalPerformance.serviceFeeActual >= props.personalPerformance.serviceFeeTarget
    : props.personalPerformance.newOrdersActual >= props.personalPerformance.newOrdersTarget
  
  return isPositive ? 'gap-positive' : 'gap-negative'
}

const getForecastClass = (percentage: number) => {
  if (percentage >= 100) return 'forecast-good'
  if (percentage >= 80) return 'forecast-warning'
  return 'forecast-poor'
}

const getSuggestionIcon = (type: string) => {
  const iconMap = {
    target: Target,
    customer: Users,
    time: Clock,
    strategy: Lightbulb
  }
  return iconMap[type as keyof typeof iconMap] || AlertTriangle
}

const getSuggestionClass = (type: string) => {
  return `suggestion-${type}`
}

const getPriorityClass = (priority: string) => {
  return `priority-${priority}`
}

const getPriorityText = (priority: string) => {
  const textMap = {
    high: '高',
    medium: '中',
    low: '低'
  }
  return textMap[priority as keyof typeof textMap] || priority
}
</script>

<style scoped>
.personal-target-achievement-module {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-bottom: 24px;
}

.target-achievement-module__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.target-achievement-module__title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #262626;
}

.target-achievement-module__content {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* 进度圆环区域 */
.target-progress-section {
  background: #fafafa;
  border-radius: 8px;
  padding: 24px;
}

.progress-rings {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 32px;
  justify-items: center;
}

.progress-ring-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.progress-ring-wrapper {
  position: relative;
}

.progress-ring__progress {
  transition: stroke-dashoffset 1.5s ease;
}

.progress-ring__content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.progress-ring__percentage {
  font-size: 28px;
  font-weight: 700;
  color: #262626;
  line-height: 1.2;
}

.progress-ring__label {
  font-size: 14px;
  color: #8c8c8c;
  margin-top: 4px;
}

.progress-ring-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 200px;
}

.ring-info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
}

.ring-info-label {
  font-size: 13px;
  color: #8c8c8c;
}

.ring-info-value {
  font-size: 13px;
  font-weight: 600;
  color: #262626;
}

.ring-info-value.gap-positive {
  color: #52c41a;
}

.ring-info-value.gap-negative {
  color: #ff4d4f;
}

/* 预测区域 */
.target-forecast-section {
  background: #fff7e6;
  border: 1px solid #ffd591;
  border-radius: 8px;
  padding: 24px;
}

.forecast-title {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #262626;
}

.forecast-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.forecast-card {
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  padding: 16px;
}

.forecast-card__header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  color: #1890ff;
}

.forecast-card__title {
  font-size: 14px;
  font-weight: 600;
}

.forecast-card__content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.forecast-metric {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.forecast-label {
  font-size: 13px;
  color: #595959;
}

.forecast-value {
  font-size: 14px;
  font-weight: 600;
}

.forecast-value.forecast-good {
  color: #52c41a;
}

.forecast-value.forecast-warning {
  color: #faad14;
}

.forecast-value.forecast-poor {
  color: #ff4d4f;
}

/* 改善建议区域 */
.improvement-suggestions {
  background: #f6ffed;
  border: 1px solid #b7eb8f;
  border-radius: 8px;
  padding: 24px;
}

.suggestions-title {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #262626;
}

.suggestions-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.suggestion-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  transition: all 0.2s;
}

.suggestion-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.suggestion-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e6f7ff;
  color: #1890ff;
  flex-shrink: 0;
}

.suggestion-content {
  flex: 1;
}

.suggestion-title {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 600;
  color: #262626;
}

.suggestion-description {
  margin: 0;
  font-size: 13px;
  color: #595959;
  line-height: 1.5;
}

.suggestion-priority {
  flex-shrink: 0;
}

.priority-badge {
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 500;
}

.priority-badge.priority-high {
  background: #fff2f0;
  color: #ff4d4f;
}

.priority-badge.priority-medium {
  background: #fff7e6;
  color: #fa8c16;
}

.priority-badge.priority-low {
  background: #f6ffed;
  color: #52c41a;
}

@media (max-width: 768px) {
  .personal-target-achievement-module {
    padding: 16px;
  }

  .target-achievement-module__header {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }

  .progress-rings {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .forecast-cards {
    grid-template-columns: 1fr;
  }

  .suggestion-item {
    flex-direction: column;
    text-align: center;
  }

  .suggestion-priority {
    align-self: center;
  }
}
</style>