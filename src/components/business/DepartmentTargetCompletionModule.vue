<template>
  <div class="department-target-completion-module">
    <div class="target-completion-module__header">
      <h3 class="target-completion-module__title">项目组完成情况</h3>
      <div class="target-completion-module__controls">
        <TimeRangePicker
          v-model="selectedTimeRange"
          @change="handleTimeRangeChange"
        />
      </div>
    </div>

    <div class="target-completion-module__content">
      <!-- 目标情况卡片 -->
      <div class="target-metrics-cards">
        <div class="metric-card">
          <div class="metric-icon">
            <div class="icon-container projects-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" stroke-width="2"/>
                <path d="M7 8h10M7 12h6" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
          </div>
          <div class="metric-content">
            <div class="metric-label">项目总数</div>
            <div class="metric-value">{{ totalDepartmentProjects }}<span class="metric-unit">↑</span></div>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-icon">
            <div class="icon-container percentage-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M19 5L5 19M8.5 5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zM18.5 19a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
          </div>
          <div class="metric-content">
            <div class="metric-label">项目返点总数</div>
            <div class="metric-value">{{ formatCurrency(totalDepartmentRebateAmount) }}<span class="metric-unit">$</span></div>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-icon">
            <div class="icon-container service-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
                <path d="M12 1v6m0 6v6" stroke="currentColor" stroke-width="2"/>
                <path d="M21 12h-6m-6 0H3" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
          </div>
          <div class="metric-content">
            <div class="metric-label">项目总服务费</div>
            <div class="metric-value">{{ formatCurrency(totalDepartmentServiceFeeAmount) }}<span class="metric-unit">$</span></div>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-icon">
            <div class="icon-container profit-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" stroke-width="2"/>
                <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
          </div>
          <div class="metric-content">
            <div class="metric-label">项目总毛利</div>
            <div class="metric-value">{{ formatCurrency(totalDepartmentProfitAmount) }}<span class="metric-unit">$</span></div>
          </div>
        </div>
      </div>

      <!-- 部门目标完成表格 -->
      <div class="department-targets-table-container">
        <table class="department-targets-table">
          <thead>
            <tr>
              <th rowspan="2" class="department-header">部门</th>
              <th colspan="3" class="target-group-header">目标</th>
              <th colspan="3" class="completion-group-header">实际完成</th>
              <th colspan="3" class="rate-group-header">完成率</th>
              <th colspan="3" class="difference-group-header">完成差值</th>
            </tr>
            <tr>
              <th class="target-header">合计毛利</th>
              <th class="target-header">服务费目标</th>
              <th class="target-header">返点目标</th>
              <th class="completion-header">合计毛利完成</th>
              <th class="completion-header">服务费完成</th>
              <th class="completion-header">返点完成</th>
              <th class="rate-header">总毛利率</th>
              <th class="rate-header">服务费率</th>
              <th class="rate-header">返点率</th>
              <th class="difference-header">服务费差</th>
              <th class="difference-header">返点差</th>
            </tr>
          </thead>
          <tbody>
            <!-- 运营部门总计行 -->
            <tr v-if="operationsSummaryData" class="operations-summary-row">
              <td class="department-cell">运营</td>
              <td class="target-cell">{{ formatCurrency(operationsSummaryData.targets.totalProfitTarget) }}</td>
              <td class="target-cell">{{ formatCurrency(operationsSummaryData.targets.serviceFeeTarget) }}</td>
              <td class="target-cell">{{ formatCurrency(operationsSummaryData.targets.rebateTarget) }}</td>
              <td class="completion-cell">{{ formatCurrency(operationsSummaryData.achievements.totalProfitActual) }}</td>
              <td class="completion-cell">{{ formatCurrency(operationsSummaryData.achievements.serviceFeeActual) }}</td>
              <td class="completion-cell">{{ formatCurrency(operationsSummaryData.achievements.rebateActual) }}</td>
              <td class="rate-cell" :class="getCompletionClass(operationsSummaryData.achievements.totalProfitRate)">{{ operationsSummaryData.achievements.totalProfitRate.toFixed(1) }}%</td>
              <td class="rate-cell" :class="getCompletionClass(operationsSummaryData.achievements.serviceFeeRate)">{{ operationsSummaryData.achievements.serviceFeeRate.toFixed(1) }}%</td>
              <td class="rate-cell" :class="getCompletionClass(operationsSummaryData.achievements.rebateRate)">{{ operationsSummaryData.achievements.rebateRate.toFixed(1) }}%</td>
              <td class="difference-cell" :class="getDifferenceClass(operationsSummaryData.achievements.serviceFeeActual - operationsSummaryData.targets.serviceFeeTarget)">{{ formatCurrencyDifference(operationsSummaryData.achievements.serviceFeeActual - operationsSummaryData.targets.serviceFeeTarget) }}</td>
              <td class="difference-cell" :class="getDifferenceClass(operationsSummaryData.achievements.rebateActual - operationsSummaryData.targets.rebateTarget)">{{ formatCurrencyDifference(operationsSummaryData.achievements.rebateActual - operationsSummaryData.targets.rebateTarget) }}</td>
            </tr>
            <!-- 各部门行 -->
            <tr v-for="(department, index) in props.departmentTargets" :key="department.departmentId" class="department-row">
              <td class="department-cell">{{ getDepartmentName(index) }}</td>
              <td class="target-cell">{{ formatCurrency(department.targets.totalProfitTarget) }}</td>
              <td class="target-cell">{{ formatCurrency(department.targets.serviceFeeTarget) }}</td>
              <td class="target-cell">{{ formatCurrency(department.targets.rebateTarget) }}</td>
              <td class="completion-cell">{{ formatCurrency(department.achievements.totalProfitActual) }}</td>
              <td class="completion-cell">{{ formatCurrency(department.achievements.serviceFeeActual) }}</td>
              <td class="completion-cell">{{ formatCurrency(department.achievements.rebateActual) }}</td>
              <td class="rate-cell" :class="getCompletionClass(department.achievements.totalProfitRate)">{{ department.achievements.totalProfitRate.toFixed(1) }}%</td>
              <td class="rate-cell" :class="getCompletionClass(department.achievements.serviceFeeRate)">{{ department.achievements.serviceFeeRate.toFixed(1) }}%</td>
              <td class="rate-cell" :class="getCompletionClass(department.achievements.rebateRate)">{{ department.achievements.rebateRate.toFixed(1) }}%</td>
              <td class="difference-cell" :class="getDifferenceClass(department.achievements.serviceFeeActual - department.targets.serviceFeeTarget)">{{ formatCurrencyDifference(department.achievements.serviceFeeActual - department.targets.serviceFeeTarget) }}</td>
              <td class="difference-cell" :class="getDifferenceClass(department.achievements.rebateActual - department.targets.rebateTarget)">{{ formatCurrencyDifference(department.achievements.rebateActual - department.targets.rebateTarget) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 目标占比分析 -->
      <div class="distribution-analysis-section">
        <div class="chart-container">
          <div class="chart-header">
            <h4 class="chart-title">目标分配占比</h4>
            <div class="chart-toggle">
              <button
                v-for="type in chartTypes"
                :key="type.value"
                class="toggle-btn"
                :class="{ 'toggle-btn--active': currentChartType === type.value }"
                @click="currentChartType = type.value"
              >
                {{ type.label }}
              </button>
            </div>
          </div>
          <div class="chart-content">
            <PieChart
              :data="targetDistributionData"
              :height="'300px'"
              :donut="true"
              :show-legend="true"
              @click="handleChartClick"
            />
          </div>
        </div>

        <div class="chart-container">
          <div class="chart-header">
            <h4 class="chart-title">完成情况占比</h4>
            <div class="chart-toggle">
              <button
                v-for="type in chartTypes"
                :key="type.value"
                class="toggle-btn"
                :class="{ 'toggle-btn--active': currentCompletionChartType === type.value }"
                @click="currentCompletionChartType = type.value"
              >
                {{ type.label }}
              </button>
            </div>
          </div>
          <div class="chart-content">
            <PieChart
              :data="completionDistributionData"
              :height="'300px'"
              :donut="true"
              :show-legend="true"
              @click="handleChartClick"
            />
            <div class="chart-total">
              总计: {{ formatCompletionChartTotal() }}
            </div>
          </div>
        </div>
      </div>


    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import PieChart from '@/components/charts/PieChart.vue'
import TimeRangePicker from './TimeRangePicker.vue'
import type { DepartmentTargetData, TimeRange } from '@/types'

interface Props {
  departmentTargets: DepartmentTargetData[]
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<{
  'time-range-change': [timeRange: TimeRange]
  'department-click': [departmentId: string]
}>()

const selectedTimeRange = ref<TimeRange>({
  type: 'quick',
  startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
  endDate: new Date().toISOString().split('T')[0],
  period: 'quarterly',
  label: '本年度'
})

const currentChartType = ref<'profit' | 'serviceFee' | 'rebate'>('profit')
const currentCompletionChartType = ref<'profit' | 'serviceFee' | 'rebate'>('profit')

const chartTypes = [
  { value: 'profit' as const, label: '毛利' },
  { value: 'serviceFee' as const, label: '服务费' },
  { value: 'rebate' as const, label: '返点' }
]

// 部门卡片数据计算
const totalDepartmentProjects = computed(() => 445)

const totalDepartmentRebateAmount = computed(() => {
  return operationsSummaryData.value?.achievements.rebateActual || 675000
})

const totalDepartmentServiceFeeAmount = computed(() => {
  return operationsSummaryData.value?.achievements.serviceFeeActual || 1150000
})

const totalDepartmentProfitAmount = computed(() => {
  return operationsSummaryData.value?.achievements.totalProfitActual || 475000
})

// 目标分配占比数据
const targetDistributionData = computed(() => {
  return props.departmentTargets.map((dept, index) => ({
    name: getDepartmentName(index),
    value: currentChartType.value === 'profit'
      ? dept.targets.totalProfitTarget
      : currentChartType.value === 'serviceFee'
        ? dept.targets.serviceFeeTarget
        : dept.targets.rebateTarget,
    color: getDepartmentColor(dept.departmentId)
  }))
})

// 完成情况占比数据
const completionDistributionData = computed(() => {
  return props.departmentTargets.map((dept, index) => ({
    name: getDepartmentName(index),
    value: currentCompletionChartType.value === 'profit'
      ? dept.achievements.totalProfitActual
      : currentCompletionChartType.value === 'serviceFee'
        ? dept.achievements.serviceFeeActual
        : dept.achievements.rebateActual,
    color: getDepartmentColor(dept.departmentId)
  }))
})

// 运营部门汇总数据
const operationsSummaryData = computed(() => {
  if (props.departmentTargets.length === 0) return null

  const totalTargets = props.departmentTargets.reduce((acc, dept) => ({
    totalProfitTarget: acc.totalProfitTarget + dept.targets.totalProfitTarget,
    serviceFeeTarget: acc.serviceFeeTarget + dept.targets.serviceFeeTarget,
    rebateTarget: acc.rebateTarget + dept.targets.rebateTarget
  }), { totalProfitTarget: 0, serviceFeeTarget: 0, rebateTarget: 0 })

  const totalAchievements = props.departmentTargets.reduce((acc, dept) => ({
    totalProfitActual: acc.totalProfitActual + dept.achievements.totalProfitActual,
    serviceFeeActual: acc.serviceFeeActual + dept.achievements.serviceFeeActual,
    rebateActual: acc.rebateActual + dept.achievements.rebateActual
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

const handleChartClick = (params: unknown) => {
  const clickParams = params as { name?: string }
  if (clickParams && clickParams.name) {
    // Find the department by employee name (e.g., "员工1" -> index 0)
    const employeeMatch = clickParams.name.match(/员工(\d+)/)
    if (employeeMatch) {
      const employeeIndex = parseInt(employeeMatch[1]) - 1
      const dept = props.departmentTargets[employeeIndex]
      if (dept) {
        emit('department-click', dept.departmentId)
      }
    }
  }
}



const getDepartmentName = (index: number): string => {
  if (index === 0) return '运营一部-燕琴'
  if (index === 1) return '运营二部-李明'
  if (index === 2) return '运营三部-张伟'
  return `运营${index + 1}部`
}

const formatCurrency = (value: number): string => {
  if (value >= 100000000) {
    return `$${(value / 100000000).toFixed(2)}亿`
  } else if (value >= 10000) {
    return `$${(value / 10000).toFixed(2)}万`
  } else {
    return `$${value.toLocaleString()}`
  }
}

const formatCompletionChartTotal = () => {
  const total = props.departmentTargets.reduce((sum, dept) => {
    return sum + (currentCompletionChartType.value === 'profit'
      ? dept.achievements.totalProfitActual
      : currentCompletionChartType.value === 'serviceFee'
        ? dept.achievements.serviceFeeActual
        : dept.achievements.rebateActual)
  }, 0)
  return formatCurrency(total)
}

const getDepartmentColor = (departmentId: string) => {
  const colors = ['#1890ff', '#52c41a', '#fa8c16', '#722ed1', '#13c2c2', '#eb2f96']
  const index = props.departmentTargets.findIndex(d => d.departmentId === departmentId)
  return colors[index % colors.length]
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
.department-target-completion-module {
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
  gap: 32px;
}

/* 目标情况卡片样式 */
.target-metrics-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}

.metric-card {
  background: linear-gradient(135deg, #e8f4fd 0%, #f0f8ff 100%);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  border: 1px solid #e1f0fe;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(24, 144, 255, 0.12);
}

.metric-card:nth-child(1) {
  background: linear-gradient(135deg, #e8f4fd 0%, #f0f8ff 100%);
  border-color: #91d5ff;
}

.metric-card:nth-child(2) {
  background: linear-gradient(135deg, #f6ffed 0%, #f9ffef 100%);
  border-color: #b7eb8f;
}

.metric-card:nth-child(3) {
  background: linear-gradient(135deg, #fff7e6 0%, #fffbf0 100%);
  border-color: #ffd591;
}

.metric-card:nth-child(4) {
  background: linear-gradient(135deg, #f9f0ff 0%, #faf5ff 100%);
  border-color: #d3adf7;
}

.metric-icon {
  flex-shrink: 0;
}

.icon-container {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.projects-icon {
  background: linear-gradient(135deg, #1890ff 0%, #40a9ff 100%);
}

.percentage-icon {
  background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
}

.service-icon {
  background: linear-gradient(135deg, #fa8c16 0%, #ffa940 100%);
}

.profit-icon {
  background: linear-gradient(135deg, #722ed1 0%, #9254de 100%);
}

.metric-content {
  flex: 1;
  min-width: 0;
}

.metric-label {
  font-size: 14px;
  color: #595959;
  margin-bottom: 4px;
  font-weight: 500;
}

.metric-value {
  font-size: 24px;
  font-weight: 700;
  color: #262626;
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.metric-unit {
  font-size: 14px;
  color: #52c41a;
  font-weight: 600;
}

.metric-card:nth-child(1) .metric-unit {
  color: #1890ff;
}

.metric-card:nth-child(2) .metric-unit {
  color: #52c41a;
}

.metric-card:nth-child(3) .metric-unit {
  color: #fa8c16;
}

.metric-card:nth-child(4) .metric-unit {
  color: #722ed1;
}

/* 部门目标表格 */
.department-targets-table-container {
  overflow-x: auto;
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
}

.department-targets-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  min-width: 1200px;
}

.department-targets-table th {
  background: #fafafa;
  border: 1px solid #f0f0f0;
  padding: 12px 8px;
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: #595959;
}

.department-targets-table td {
  border: 1px solid #f0f0f0;
  padding: 12px 8px;
  text-align: center;
  font-size: 13px;
  vertical-align: middle;
}

.department-row:hover {
  background: #f0f8ff !important;
}

/* 表头样式 */
.year-header {
  background: #f0f2f5 !important;
  color: #262626 !important;
  font-weight: 600;
  width: 80px;
  min-width: 80px;
}

.department-header {
  background: #f0f2f5 !important;
  color: #262626 !important;
  font-weight: 600;
}

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

.rate-group-header {
  background: #fff7e6 !important;
  color: #faad14 !important;
  font-weight: 600;
}

.difference-group-header {
  background: #f9f0ff !important;
  color: #722ed1 !important;
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

.rate-header {
  background: #fff7e6 !important;
  color: #faad14 !important;
  font-weight: 600;
}

.difference-header {
  background: #f9f0ff !important;
  color: #722ed1 !important;
  font-weight: 600;
}

/* 数据单元格样式 */
.year-cell {
  background: #f0f2f5 !important;
  color: #262626 !important;
  font-weight: 600;
  text-align: center !important;
  width: 80px;
  min-width: 80px;
}

.department-cell {
  background: #f0f2f5 !important;
  color: #262626 !important;
  font-weight: 600;
  text-align: left !important;
}

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

.rate-cell {
  background: #fffbf0 !important;
  font-weight: 600;
}

.difference-cell {
  background: #fafafa !important;
  font-weight: 500;
}

/* 完成率颜色样式 */
.rate-cell.excellent {
  color: #52c41a !important;
}

.rate-cell.good {
  color: #1890ff !important;
}

.rate-cell.average {
  color: #faad14 !important;
}

.rate-cell.poor {
  color: #ff4d4f !important;
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

/* 运营部门汇总行样式 */
.operations-summary-row {
  background: #f9f9f9 !important;
  font-weight: 600;
  border-bottom: 2px solid #d9d9d9 !important;
}

.operations-cell {
  background: #e6f7ff !important;
  color: #1890ff !important;
  font-weight: 700;
  text-align: left !important;
  font-size: 14px;
}

.operations-summary-row .target-cell,
.operations-summary-row .completion-cell,
.operations-summary-row .rate-cell,
.operations-summary-row .difference-cell {
  font-weight: 600;
}

.department-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.department-name {
  font-weight: 600;
  color: #262626;
  font-size: 14px;
}

.department-id {
  font-size: 12px;
  color: #8c8c8c;
}

.target-metrics,
.actual-metrics {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.metric-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
}

.metric-label {
  color: #8c8c8c;
  min-width: 50px;
}

.metric-value {
  font-weight: 600;
  color: #262626;
}

.metric-value.value-positive {
  color: #52c41a;
}

.metric-value.value-negative {
  color: #ff4d4f;
}

.target-percentage,
.completion-percentage {
  margin-top: 4px;
  padding-top: 6px;
  border-top: 1px solid #f0f0f0;
  font-size: 11px;
  color: #595959;
  font-weight: 500;
}

.completion-rates {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.rate-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.rate-label {
  font-size: 11px;
  color: #8c8c8c;
}

.rate-progress {
  position: relative;
  height: 16px;
  background: #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
}

.rate-bar {
  height: 100%;
  border-radius: 8px;
  transition: width 0.8s ease;
}

.rate-bar.rate-excellent {
  background: #52c41a;
}

.rate-bar.rate-good {
  background: #1890ff;
}

.rate-bar.rate-warning {
  background: #fa8c16;
}

.rate-bar.rate-poor {
  background: #ff4d4f;
}

.rate-text {
  position: absolute;
  top: 0;
  right: 4px;
  line-height: 16px;
  font-size: 10px;
  color: #fff;
  font-weight: 500;
}

.ranking-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
}

.ranking-badge.rank-first {
  background: #ffd700;
  color: #8b6914;
}

.ranking-badge.rank-second {
  background: #c0c0c0;
  color: #595959;
}

.ranking-badge.rank-third {
  background: #cd7f32;
  color: #fff;
}

.ranking-badge.rank-other {
  background: #8c8c8c;
}

/* 分布分析 */
.distribution-analysis-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
}

.chart-container {
  background: #fafafa;
  border-radius: 8px;
  padding: 20px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.chart-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #262626;
}

.chart-toggle {
  display: flex;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  overflow: hidden;
}

.toggle-btn {
  padding: 6px 12px;
  background: #fff;
  border: none;
  color: #595959;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.toggle-btn:hover {
  background: #f5f5f5;
}

.toggle-btn--active {
  background: #1890ff;
  color: #fff;
}

.chart-total {
  font-size: 14px;
  font-weight: 600;
  color: #1890ff;
}

.chart-content {
  background: #fff;
  border-radius: 6px;
  padding: 16px;
}



@media (max-width: 1200px) {
  .department-table__header,
  .department-row {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .department-table__header > div,
  .department-row > div {
    padding: 8px;
    border-bottom: 1px solid #f0f0f0;
  }

  .department-table__header > div:last-child,
  .department-row > div:last-child {
    border-bottom: none;
  }
}

@media (max-width: 768px) {
  .department-target-completion-module {
    padding: 16px;
  }

  .target-completion-module__header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .distribution-analysis-section {
    grid-template-columns: 1fr;
  }

  .chart-header {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }

  .chart-toggle {
    justify-content: center;
  }
}
</style>
