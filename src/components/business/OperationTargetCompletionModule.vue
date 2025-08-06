<template>
  <div class="operation-target-completion-module">
    <div class="target-completion-module__header">
      <h3 class="target-completion-module__title">总运营目标完成</h3>
      <div class="target-completion-module__controls">
        <TimeRangePicker
          v-model="selectedTimeRange"
          @change="handleTimeRangeChange"
        />
      </div>
    </div>

    <div class="target-completion-module__content">
      <!-- 运营目标完成表格 -->
      <div class="operation-targets-table-container">
        <table class="operation-targets-table">
          <thead>
            <tr>
              <th rowspan="2" class="year-header">年度</th>
              <th rowspan="2" class="period-header">季度</th>
              <th colspan="3" class="target-group-header">目标</th>
              <th colspan="3" class="completion-group-header">实际完成</th>
              <th colspan="3" class="comparison-group-header">完成率</th>
              <th colspan="3" class="difference-group-header">完成差值</th>
            </tr>
            <tr>
              <th class="target-header">合计毛利</th>
              <th class="target-header">服务费</th>
              <th class="target-header">返点</th>
              <th class="completion-header">合计毛利</th>
              <th class="completion-header">服务费</th>
              <th class="completion-header">返点</th>
              <th class="comparison-header">合计毛利</th>
              <th class="comparison-header">服务费</th>
              <th class="comparison-header">返点</th>
              <th class="difference-header">合计毛利</th>
              <th class="difference-header">服务费</th>
              <th class="difference-header">返点</th>
            </tr>
          </thead>
          <tbody>
            <!-- 年度汇总行 -->
            <tr class="annual-row" v-if="annualTargetData">
              <td rowspan="5">{{ currentYear }}年</td>
              <td>{{ currentYear }}年</td>
              <td class="target-cell">{{ formatCurrency(annualTargetData.targets.totalProfitTarget) }}</td>
              <td class="target-cell">{{ formatCurrency(annualTargetData.targets.serviceFeeTarget) }}</td>
              <td class="target-cell">{{ formatCurrency(annualTargetData.targets.rebateTarget) }}</td>
              <td class="completion-cell">{{ formatCurrency(annualTargetData.achievements.totalProfitActual) }}</td>
              <td class="completion-cell">{{ formatCurrency(annualTargetData.achievements.serviceFeeActual) }}</td>
              <td class="completion-cell">{{ formatCurrency(annualTargetData.achievements.rebateActual) }}</td>
              <td class="comparison-cell" :class="getCompletionClass(annualTargetData.achievements.totalProfitRate)">{{ annualTargetData.achievements.totalProfitRate.toFixed(1) }}%</td>
              <td class="comparison-cell" :class="getCompletionClass(annualTargetData.achievements.serviceFeeRate)">{{ annualTargetData.achievements.serviceFeeRate.toFixed(1) }}%</td>
              <td class="comparison-cell" :class="getCompletionClass(annualTargetData.achievements.rebateRate)">{{ annualTargetData.achievements.rebateRate.toFixed(1) }}%</td>
              <td class="difference-cell" :class="getDifferenceClass(annualTargetData.achievements.totalProfitActual - annualTargetData.targets.totalProfitTarget)">{{ formatCurrencyDifference(annualTargetData.achievements.totalProfitActual - annualTargetData.targets.totalProfitTarget) }}</td>
              <td class="difference-cell" :class="getDifferenceClass(annualTargetData.achievements.serviceFeeActual - annualTargetData.targets.serviceFeeTarget)">{{ formatCurrencyDifference(annualTargetData.achievements.serviceFeeActual - annualTargetData.targets.serviceFeeTarget) }}</td>
              <td class="difference-cell" :class="getDifferenceClass(annualTargetData.achievements.rebateActual - annualTargetData.targets.rebateTarget)">{{ formatCurrencyDifference(annualTargetData.achievements.rebateActual - annualTargetData.targets.rebateTarget) }}</td>
            </tr>
            <!-- 季度行 -->
            <tr v-for="quarter in props.operationTargets" :key="quarter.quarter" class="quarterly-row">
              <td>{{ quarter.quarter }}</td>
              <td class="target-cell">{{ formatCurrency(quarter.targets.totalProfitTarget) }}</td>
              <td class="target-cell">{{ formatCurrency(quarter.targets.serviceFeeTarget) }}</td>
              <td class="target-cell">{{ formatCurrency(quarter.targets.rebateTarget) }}</td>
              <td class="completion-cell">{{ formatCurrency(quarter.achievements.totalProfitActual) }}</td>
              <td class="completion-cell">{{ formatCurrency(quarter.achievements.serviceFeeActual) }}</td>
              <td class="completion-cell">{{ formatCurrency(quarter.achievements.rebateActual) }}</td>
              <td class="comparison-cell" :class="getCompletionClass(quarter.achievements.totalProfitRate)">{{ quarter.achievements.totalProfitRate.toFixed(1) }}%</td>
              <td class="comparison-cell" :class="getCompletionClass(quarter.achievements.serviceFeeRate)">{{ quarter.achievements.serviceFeeRate.toFixed(1) }}%</td>
              <td class="comparison-cell" :class="getCompletionClass(quarter.achievements.rebateRate)">{{ quarter.achievements.rebateRate.toFixed(1) }}%</td>
              <td class="difference-cell" :class="getDifferenceClass(quarter.achievements.totalProfitActual - quarter.targets.totalProfitTarget)">{{ formatCurrencyDifference(quarter.achievements.totalProfitActual - quarter.targets.totalProfitTarget) }}</td>
              <td class="difference-cell" :class="getDifferenceClass(quarter.achievements.serviceFeeActual - quarter.targets.serviceFeeTarget)">{{ formatCurrencyDifference(quarter.achievements.serviceFeeActual - quarter.targets.serviceFeeTarget) }}</td>
              <td class="difference-cell" :class="getDifferenceClass(quarter.achievements.rebateActual - quarter.targets.rebateTarget)">{{ formatCurrencyDifference(quarter.achievements.rebateActual - quarter.targets.rebateTarget) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import TimeRangePicker from './TimeRangePicker.vue'
import type { OperationTargetData, TimeRange } from '@/types'

interface Props {
  operationTargets: OperationTargetData[]
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<{
  'time-range-change': [timeRange: TimeRange]
  'quarter-change': [quarter: string]
}>()

const selectedTimeRange = ref<TimeRange>({
  type: 'quick',
  startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
  endDate: new Date().toISOString().split('T')[0],
  period: 'quarterly',
  label: '本年度'
})

// 当前年份
const currentYear = computed(() => new Date().getFullYear())

// 年度汇总数据
const annualTargetData = computed(() => {
  if (props.operationTargets.length === 0) return null

  const totalTargets = props.operationTargets.reduce((acc, quarter) => ({
    totalProfitTarget: acc.totalProfitTarget + quarter.targets.totalProfitTarget,
    serviceFeeTarget: acc.serviceFeeTarget + quarter.targets.serviceFeeTarget,
    rebateTarget: acc.rebateTarget + quarter.targets.rebateTarget
  }), { totalProfitTarget: 0, serviceFeeTarget: 0, rebateTarget: 0 })

  const totalAchievements = props.operationTargets.reduce((acc, quarter) => ({
    totalProfitActual: acc.totalProfitActual + quarter.achievements.totalProfitActual,
    serviceFeeActual: acc.serviceFeeActual + quarter.achievements.serviceFeeActual,
    rebateActual: acc.rebateActual + quarter.achievements.rebateActual
  }), { totalProfitActual: 0, serviceFeeActual: 0, rebateActual: 0 })

  return {
    targets: totalTargets,
    achievements: {
      ...totalAchievements,
      totalProfitRate: totalTargets.totalProfitTarget > 0 ? (totalAchievements.totalProfitActual / totalTargets.totalProfitTarget) * 100 : 0,
      serviceFeeRate: totalTargets.serviceFeeTarget > 0 ? (totalAchievements.serviceFeeActual / totalTargets.serviceFeeTarget) * 100 : 0,
      rebateRate: totalTargets.rebateTarget > 0 ? (totalAchievements.rebateActual / totalTargets.rebateTarget) * 100 : 0
    }
  }
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
  if (rate >= 100) return 'excellent'
  if (rate >= 80) return 'good'
  if (rate >= 60) return 'average'
  return 'poor'
}

const formatCurrencyDifference = (value: number): string => {
  const prefix = value >= 0 ? '+' : ''
  if (Math.abs(value) >= 100000000) {
    return `${prefix}${(value / 100000000).toFixed(2)}亿`
  } else if (Math.abs(value) >= 10000) {
    return `${prefix}${(value / 10000).toFixed(2)}万`
  } else {
    return `${prefix}${value.toLocaleString()}`
  }
}

const getDifferenceClass = (difference: number) => {
  if (difference > 0) return 'positive'
  if (difference < 0) return 'negative'
  return 'neutral'
}
</script>

<style scoped>
.operation-target-completion-module {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-bottom: 24px;
}

.target-completion-module__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.target-completion-module__title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #262626;
}

.target-completion-module__content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* 运营目标表格样式 */
.operation-targets-table-container {
  overflow-x: auto;
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
}

.operation-targets-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  min-width: 1300px;
}

.operation-targets-table th {
  background: #fafafa;
  border: 1px solid #f0f0f0;
  padding: 12px 8px;
  text-align: center;
  font-weight: 600;
  color: #262626;
  white-space: nowrap;
}

.operation-targets-table td {
  border: 1px solid #f0f0f0;
  padding: 10px 8px;
  text-align: center;
  color: #595959;
}

/* 表头分组样式 */
.target-group-header {
  background: #e6f7ff !important;
  color: #1890ff !important;
  font-weight: 600;
}

.completion-group-header {
  background: #f6ffed !important;
  color: #52c41a !important;
  font-weight: 600;
}

.comparison-group-header {
  background: #fff7e6 !important;
  color: #faad14 !important;
  font-weight: 600;
}

.target-header {
  background: #e6f7ff !important;
  color: #1890ff !important;
  font-weight: 600;
}

.completion-header {
  background: #f6ffed !important;
  color: #52c41a !important;
  font-weight: 600;
}

.comparison-header {
  background: #fff7e6 !important;
  color: #faad14 !important;
  font-weight: 600;
}

.difference-group-header {
  background: #f9f0ff !important;
  color: #722ed1 !important;
  font-weight: 600;
}

.difference-header {
  background: #f9f0ff !important;
  color: #722ed1 !important;
  font-weight: 600;
}

/* 数据单元格样式 */
.target-cell {
  background: #f0f8ff !important;
  color: #1890ff !important;
  font-weight: 500;
}

.completion-cell {
  background: #f6ffed !important;
  color: #52c41a !important;
  font-weight: 500;
}

.comparison-cell {
  background: #fffbf0 !important;
  font-weight: 600;
}

.difference-cell {
  background: #fafafa !important;
  font-weight: 500;
}

/* 完成率颜色样式 */
.comparison-cell.excellent {
  color: #52c41a !important;
  font-weight: 600;
}

.comparison-cell.good {
  color: #1890ff !important;
  font-weight: 600;
}

.comparison-cell.average {
  color: #faad14 !important;
  font-weight: 600;
}

.comparison-cell.poor {
  color: #ff4d4f !important;
  font-weight: 600;
}

/* 完成差值颜色样式 */
.difference-cell.positive {
  color: #52c41a !important;
  font-weight: 600;
}

.difference-cell.negative {
  color: #ff4d4f !important;
  font-weight: 600;
}

.difference-cell.neutral {
  color: #8c8c8c !important;
  font-weight: 500;
}

/* 行样式 */
.annual-row {
  background: #f9f9f9 !important;
  font-weight: 500;
}

.annual-row td {
  color: #262626 !important;
  font-weight: 500;
}

.quarterly-row:nth-child(even) {
  background: #fafafa !important;
}

.quarterly-row:hover {
  background: #f0f8ff !important;
}

@media (max-width: 768px) {
  .operation-target-completion-module {
    padding: 16px;
  }

  .target-completion-module__header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .operation-targets-table {
    font-size: 12px;
  }

  .operation-targets-table th,
  .operation-targets-table td {
    padding: 8px 6px;
  }
}
</style>
