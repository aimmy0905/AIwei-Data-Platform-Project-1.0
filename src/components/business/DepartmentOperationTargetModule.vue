<template>
  <div class="department-operation-target-module">
    <div class="target-module__header">
      <h3 class="target-module__title">部门运营目标完成</h3>
      <div class="target-module__controls">
        <div class="department-info">
          <span class="department-badge">{{ departmentTarget.departmentName }}</span>
          <span class="ranking-badge" :class="getRankingBadgeClass()">
            排名 #{{ getDepartmentRanking() }}
          </span>
        </div>
        <TimeRangePicker 
          v-model="selectedTimeRange"
          @change="handleTimeRangeChange"
        />
      </div>
    </div>

    <div class="target-module__content">
      <!-- 部门目标完成对比 -->
      <div class="department-target-comparison">
        <div class="comparison-cards">
          <!-- 总毛利对比 -->
          <div class="target-card">
            <div class="target-card__header">
              <div class="card-icon profit-icon">
                <TrendingUp :size="20" />
              </div>
              <div class="card-info">
                <h4>总毛利</h4>
                <div class="completion-rate" :class="getCompletionClass(departmentTarget.achievements.totalProfitRate)">
                  {{ departmentTarget.achievements.totalProfitRate.toFixed(1) }}%
                </div>
              </div>
            </div>
            <div class="target-card__content">
              <div class="target-values">
                <div class="value-item">
                  <span class="value-label">目标:</span>
                  <span class="value-amount">{{ formatCurrency(departmentTarget.targets.totalProfitTarget) }}</span>
                </div>
                <div class="value-item">
                  <span class="value-label">实际:</span>
                  <span class="value-amount">{{ formatCurrency(departmentTarget.achievements.totalProfitActual) }}</span>
                </div>
                <div class="value-item" :class="getGapClass(departmentTarget.achievements.totalProfitGap)">
                  <span class="value-label">差额:</span>
                  <span class="value-amount">{{ formatCurrency(Math.abs(departmentTarget.achievements.totalProfitGap)) }}</span>
                </div>
              </div>
              <div class="progress-bar">
                <div 
                  class="progress-fill"
                  :class="getProgressClass(departmentTarget.achievements.totalProfitRate)"
                  :style="{ width: Math.min(departmentTarget.achievements.totalProfitRate, 100) + '%' }"
                ></div>
              </div>
            </div>
          </div>

          <!-- 服务费对比 -->
          <div class="target-card">
            <div class="target-card__header">
              <div class="card-icon service-icon">
                <DollarSign :size="20" />
              </div>
              <div class="card-info">
                <h4>服务费</h4>
                <div class="completion-rate" :class="getCompletionClass(departmentTarget.achievements.serviceFeeRate)">
                  {{ departmentTarget.achievements.serviceFeeRate.toFixed(1) }}%
                </div>
              </div>
            </div>
            <div class="target-card__content">
              <div class="target-values">
                <div class="value-item">
                  <span class="value-label">目标:</span>
                  <span class="value-amount">{{ formatCurrency(departmentTarget.targets.serviceFeeTarget) }}</span>
                </div>
                <div class="value-item">
                  <span class="value-label">实际:</span>
                  <span class="value-amount">{{ formatCurrency(departmentTarget.achievements.serviceFeeActual) }}</span>
                </div>
                <div class="value-item" :class="getGapClass(departmentTarget.achievements.serviceFeeGap)">
                  <span class="value-label">差额:</span>
                  <span class="value-amount">{{ formatCurrency(Math.abs(departmentTarget.achievements.serviceFeeGap)) }}</span>
                </div>
              </div>
              <div class="progress-bar">
                <div 
                  class="progress-fill"
                  :class="getProgressClass(departmentTarget.achievements.serviceFeeRate)"
                  :style="{ width: Math.min(departmentTarget.achievements.serviceFeeRate, 100) + '%' }"
                ></div>
              </div>
            </div>
          </div>

          <!-- 返点对比 -->
          <div class="target-card">
            <div class="target-card__header">
              <div class="card-icon rebate-icon">
                <Gift :size="20" />
              </div>
              <div class="card-info">
                <h4>返点</h4>
                <div class="completion-rate" :class="getCompletionClass(departmentTarget.achievements.rebateRate)">
                  {{ departmentTarget.achievements.rebateRate.toFixed(1) }}%
                </div>
              </div>
            </div>
            <div class="target-card__content">
              <div class="target-values">
                <div class="value-item">
                  <span class="value-label">目标:</span>
                  <span class="value-amount">{{ formatCurrency(departmentTarget.targets.rebateTarget) }}</span>
                </div>
                <div class="value-item">
                  <span class="value-label">实际:</span>
                  <span class="value-amount">{{ formatCurrency(departmentTarget.achievements.rebateActual) }}</span>
                </div>
                <div class="value-item" :class="getGapClass(departmentTarget.achievements.rebateGap)">
                  <span class="value-label">差额:</span>
                  <span class="value-amount">{{ formatCurrency(Math.abs(departmentTarget.achievements.rebateGap)) }}</span>
                </div>
              </div>
              <div class="progress-bar">
                <div 
                  class="progress-fill"
                  :class="getProgressClass(departmentTarget.achievements.rebateRate)"
                  :style="{ width: Math.min(departmentTarget.achievements.rebateRate, 100) + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 部门目标分析 -->
      <div class="department-analysis-section">
        <div class="analysis-cards">
          <div class="analysis-card">
            <div class="analysis-card__header">
              <Target :size="20" />
              <h4>目标占比分析</h4>
            </div>
            <div class="analysis-card__content">
              <div class="percentage-display">
                <div class="percentage-value">{{ departmentTarget.targets.targetPercentage.toFixed(1) }}%</div>
                <div class="percentage-label">在公司总目标中的占比</div>
              </div>
              <div class="percentage-breakdown">
                <div class="breakdown-item">
                  <span class="breakdown-label">毛利目标占比</span>
                  <span class="breakdown-value">{{ getTargetPercentage('profit') }}%</span>
                </div>
                <div class="breakdown-item">
                  <span class="breakdown-label">服务费目标占比</span>
                  <span class="breakdown-value">{{ getTargetPercentage('service') }}%</span>
                </div>
                <div class="breakdown-item">
                  <span class="breakdown-label">返点目标占比</span>
                  <span class="breakdown-value">{{ getTargetPercentage('rebate') }}%</span>
                </div>
              </div>
            </div>
          </div>

          <div class="analysis-card">
            <div class="analysis-card__header">
              <BarChart3 :size="20" />
              <h4>完成情况分析</h4>
            </div>
            <div class="analysis-card__content">
              <div class="completion-display">
                <div class="completion-value">{{ departmentTarget.achievements.completionPercentage.toFixed(1) }}%</div>
                <div class="completion-label">在公司总完成中的占比</div>
              </div>
              <div class="completion-insights">
                <div class="insight-item" :class="getInsightClass('target')">
                  <span class="insight-icon">🎯</span>
                  <span class="insight-text">{{ getTargetInsight() }}</span>
                </div>
                <div class="insight-item" :class="getInsightClass('performance')">
                  <span class="insight-icon">📈</span>
                  <span class="insight-text">{{ getPerformanceInsight() }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 改进建议 -->
      <div class="improvement-suggestions" v-if="improvementSuggestions.length > 0">
        <h4 class="suggestions-title">改进建议</h4>
        <div class="suggestions-list">
          <div 
            v-for="(suggestion, index) in improvementSuggestions"
            :key="index"
            class="suggestion-item"
            :class="getSuggestionClass(suggestion.priority)"
          >
            <div class="suggestion-icon">
              <Lightbulb :size="18" />
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
import { TrendingUp, DollarSign, Gift, Target, BarChart3, Lightbulb } from 'lucide-vue-next'
import TimeRangePicker from './TimeRangePicker.vue'
import type { DepartmentTargetData, TimeRange } from '@/types'

interface Suggestion {
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
}

interface Props {
  departmentTarget: DepartmentTargetData
  allDepartments?: DepartmentTargetData[]
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  allDepartments: () => [],
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

// 改进建议
const improvementSuggestions = computed<Suggestion[]>(() => {
  const suggestions: Suggestion[] = []
  const dept = props.departmentTarget
  
  if (dept.achievements.totalProfitRate < 80) {
    suggestions.push({
      title: '提升毛利完成率',
      description: '当前毛利完成率较低，建议加强高价值客户开发，优化项目结构',
      priority: 'high'
    })
  }
  
  if (dept.achievements.serviceFeeRate < 85) {
    suggestions.push({
      title: '增加服务费收入',
      description: '服务费完成率有提升空间，建议拓展增值服务，提高服务单价',
      priority: 'high'
    })
  }
  
  if (dept.targets.targetPercentage > dept.achievements.completionPercentage) {
    suggestions.push({
      title: '平衡目标与产出',
      description: '目标占比高于实际产出占比，需要加强执行力或调整资源配置',
      priority: 'medium'
    })
  }
  
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

const getCompletionClass = (rate: number) => {
  if (rate >= 100) return 'completion-excellent'
  if (rate >= 80) return 'completion-good'
  if (rate >= 60) return 'completion-warning'
  return 'completion-poor'
}

const getGapClass = (gap: number) => {
  return gap >= 0 ? 'gap-positive' : 'gap-negative'
}

const getProgressClass = (rate: number) => {
  if (rate >= 100) return 'progress-excellent'
  if (rate >= 80) return 'progress-good'
  if (rate >= 60) return 'progress-warning'
  return 'progress-poor'
}

const getRankingBadgeClass = () => {
  const ranking = getDepartmentRanking()
  if (ranking === 1) return 'ranking-first'
  if (ranking <= 3) return 'ranking-top'
  return 'ranking-normal'
}

const getDepartmentRanking = () => {
  if (!props.allDepartments.length) return 1
  const sorted = [...props.allDepartments].sort((a, b) => b.achievements.totalProfitRate - a.achievements.totalProfitRate)
  return sorted.findIndex(d => d.departmentId === props.departmentTarget.departmentId) + 1
}

const getTargetPercentage = (type: 'profit' | 'service' | 'rebate') => {
  // 基于部门目标占比的简化计算
  return props.departmentTarget.targets.targetPercentage.toFixed(1)
}

const getTargetInsight = () => {
  const rate = props.departmentTarget.achievements.totalProfitRate
  if (rate >= 100) return '目标超额完成，表现优秀'
  if (rate >= 80) return '目标完成良好，继续保持'
  return '目标完成不足，需要加强'
}

const getPerformanceInsight = () => {
  const targetPct = props.departmentTarget.targets.targetPercentage
  const completionPct = props.departmentTarget.achievements.completionPercentage
  
  if (completionPct > targetPct) return '产出超出预期，效率较高'
  if (completionPct >= targetPct * 0.8) return '产出基本达标，表现稳定'
  return '产出低于预期，需要提升'
}

const getInsightClass = (type: 'target' | 'performance') => {
  if (type === 'target') {
    const rate = props.departmentTarget.achievements.totalProfitRate
    return rate >= 100 ? 'insight-positive' : rate >= 80 ? 'insight-warning' : 'insight-negative'
  } else {
    const targetPct = props.departmentTarget.targets.targetPercentage
    const completionPct = props.departmentTarget.achievements.completionPercentage
    return completionPct >= targetPct ? 'insight-positive' : 'insight-warning'
  }
}

const getSuggestionClass = (priority: string) => {
  return `suggestion-${priority}`
}

const getPriorityClass = (priority: string) => {
  return `priority-${priority}`
}

const getPriorityText = (priority: string) => {
  const textMap = { high: '高', medium: '中', low: '低' }
  return textMap[priority as keyof typeof textMap] || priority
}
</script>

<style scoped>
.department-operation-target-module {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-bottom: 24px;
}

.target-module__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.target-module__title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #262626;
}

.target-module__controls {
  display: flex;
  align-items: center;
  gap: 16px;
}

.department-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.department-badge {
  padding: 4px 12px;
  background: #e6f7ff;
  color: #1890ff;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.ranking-badge {
  padding: 4px 8px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 500;
}

.ranking-badge.ranking-first {
  background: #fff7e6;
  color: #fa8c16;
}

.ranking-badge.ranking-top {
  background: #f6ffed;
  color: #52c41a;
}

.ranking-badge.ranking-normal {
  background: #f0f0f0;
  color: #8c8c8c;
}

.target-module__content {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* 目标对比区域 */
.comparison-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 20px;
}

.target-card {
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 20px;
}

.target-card__header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.card-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.profit-icon {
  background: #722ed1;
}

.service-icon {
  background: #1890ff;
}

.rebate-icon {
  background: #52c41a;
}

.card-info {
  flex: 1;
}

.card-info h4 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: #262626;
}

.completion-rate {
  font-size: 14px;
  font-weight: 600;
}

.completion-rate.completion-excellent {
  color: #52c41a;
}

.completion-rate.completion-good {
  color: #1890ff;
}

.completion-rate.completion-warning {
  color: #fa8c16;
}

.completion-rate.completion-poor {
  color: #ff4d4f;
}

.target-values {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.value-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.value-label {
  font-size: 13px;
  color: #8c8c8c;
}

.value-amount {
  font-size: 14px;
  font-weight: 600;
  color: #262626;
}

.gap-positive .value-amount {
  color: #52c41a;
}

.gap-negative .value-amount {
  color: #ff4d4f;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: #f0f0f0;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.8s ease;
}

.progress-fill.progress-excellent {
  background: #52c41a;
}

.progress-fill.progress-good {
  background: #1890ff;
}

.progress-fill.progress-warning {
  background: #fa8c16;
}

.progress-fill.progress-poor {
  background: #ff4d4f;
}

/* 分析区域 */
.analysis-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.analysis-card {
  background: #fafafa;
  border-radius: 8px;
  padding: 20px;
}

.analysis-card__header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  color: #1890ff;
}

.analysis-card__header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.percentage-display,
.completion-display {
  text-align: center;
  margin-bottom: 16px;
}

.percentage-value,
.completion-value {
  font-size: 28px;
  font-weight: 700;
  color: #262626;
  line-height: 1.2;
}

.percentage-label,
.completion-label {
  font-size: 13px;
  color: #8c8c8c;
  margin-top: 4px;
}

.percentage-breakdown {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.breakdown-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.breakdown-item:last-child {
  border-bottom: none;
}

.breakdown-label {
  font-size: 13px;
  color: #595959;
}

.breakdown-value {
  font-size: 13px;
  font-weight: 600;
  color: #262626;
}

.completion-insights {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.insight-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 6px;
}

.insight-item.insight-positive {
  background: #f6ffed;
  color: #52c41a;
}

.insight-item.insight-warning {
  background: #fff7e6;
  color: #fa8c16;
}

.insight-item.insight-negative {
  background: #fff2f0;
  color: #ff4d4f;
}

.insight-text {
  font-size: 13px;
  font-weight: 500;
}

/* 改进建议区域 */
.improvement-suggestions {
  background: #f0f9ff;
  border: 1px solid #bae7ff;
  border-radius: 8px;
  padding: 20px;
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
  border-radius: 6px;
}

.suggestion-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1890ff;
  color: white;
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
  .department-operation-target-module {
    padding: 16px;
  }

  .target-module__header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .target-module__controls {
    justify-content: space-between;
  }

  .comparison-cards,
  .analysis-cards {
    grid-template-columns: 1fr;
  }

  .suggestion-item {
    flex-direction: column;
    text-align: center;
    gap: 8px;
  }
}
</style>