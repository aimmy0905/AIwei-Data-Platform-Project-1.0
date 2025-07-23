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
      <!-- 部门列表表格 -->
      <div class="department-table-section">
        <div class="department-table">
          <div class="department-table__header">
            <div class="col-department">部门</div>
            <div class="col-target">目标设置</div>
            <div class="col-actual">实际完成</div>
            <div class="col-rate">完成率</div>
            <div class="col-ranking">排名</div>
          </div>
          <div class="department-table__body">
            <div 
              v-for="department in departmentTargets" 
              :key="department.departmentId"
              class="department-row"
            >
              <div class="col-department">
                <div class="department-info">
                  <span class="department-name">{{ department.departmentName }}</span>
                  <span class="department-id">{{ department.departmentId }}</span>
                </div>
              </div>
              <div class="col-target">
                <div class="target-metrics">
                  <div class="metric-item">
                    <span class="metric-label">毛利:</span>
                    <span class="metric-value">{{ formatCurrency(department.targets.totalProfitTarget) }}</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-label">服务费:</span>
                    <span class="metric-value">{{ formatCurrency(department.targets.serviceFeeTarget) }}</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-label">返点:</span>
                    <span class="metric-value">{{ formatCurrency(department.targets.rebateTarget) }}</span>
                  </div>
                  <div class="target-percentage">
                    占比: {{ department.targets.targetPercentage.toFixed(1) }}%
                  </div>
                </div>
              </div>
              <div class="col-actual">
                <div class="actual-metrics">
                  <div class="metric-item">
                    <span class="metric-label">毛利:</span>
                    <span class="metric-value" :class="getGapClass(department.achievements.totalProfitGap)">
                      {{ formatCurrency(department.achievements.totalProfitActual) }}
                    </span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-label">服务费:</span>
                    <span class="metric-value" :class="getGapClass(department.achievements.serviceFeeGap)">
                      {{ formatCurrency(department.achievements.serviceFeeActual) }}
                    </span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-label">返点:</span>
                    <span class="metric-value" :class="getGapClass(department.achievements.rebateGap)">
                      {{ formatCurrency(department.achievements.rebateActual) }}
                    </span>
                  </div>
                  <div class="completion-percentage">
                    占比: {{ department.achievements.completionPercentage.toFixed(1) }}%
                  </div>
                </div>
              </div>
              <div class="col-rate">
                <div class="completion-rates">
                  <div class="rate-item">
                    <span class="rate-label">毛利:</span>
                    <div class="rate-progress">
                      <div 
                        class="rate-bar" 
                        :class="getRateClass(department.achievements.totalProfitRate)"
                        :style="{ width: Math.min(department.achievements.totalProfitRate, 100) + '%' }"
                      ></div>
                      <span class="rate-text">{{ department.achievements.totalProfitRate.toFixed(1) }}%</span>
                    </div>
                  </div>
                  <div class="rate-item">
                    <span class="rate-label">服务费:</span>
                    <div class="rate-progress">
                      <div 
                        class="rate-bar" 
                        :class="getRateClass(department.achievements.serviceFeeRate)"
                        :style="{ width: Math.min(department.achievements.serviceFeeRate, 100) + '%' }"
                      ></div>
                      <span class="rate-text">{{ department.achievements.serviceFeeRate.toFixed(1) }}%</span>
                    </div>
                  </div>
                  <div class="rate-item">
                    <span class="rate-label">返点:</span>
                    <div class="rate-progress">
                      <div 
                        class="rate-bar" 
                        :class="getRateClass(department.achievements.rebateRate)"
                        :style="{ width: Math.min(department.achievements.rebateRate, 100) + '%' }"
                      ></div>
                      <span class="rate-text">{{ department.achievements.rebateRate.toFixed(1) }}%</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-ranking">
                <div class="ranking-badge" :class="getRankingClass(getDepartmentRanking(department))">
                  #{{ getDepartmentRanking(department) }}
                </div>
              </div>
            </div>
          </div>
        </div>
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
            <div class="chart-total">
              总计: {{ formatChartTotal() }}
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
          </div>
        </div>
      </div>

      <!-- 部门对比图表 -->
      <div class="department-comparison-chart">
        <div class="chart-header">
          <h4 class="chart-title">部门目标vs实际对比</h4>
        </div>
        <div class="chart-content">
          <BarChart
            :data="departmentComparisonData"
            :height="'400px'"
            :show-legend="true"
            :stack="false"
            @click="handleDepartmentClick"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import PieChart from '@/components/charts/PieChart.vue'
import BarChart from '@/components/charts/BarChart.vue'
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

const chartTypes = [
  { value: 'profit' as const, label: '毛利' },
  { value: 'serviceFee' as const, label: '服务费' },
  { value: 'rebate' as const, label: '返点' }
]

// 目标分配占比数据
const targetDistributionData = computed(() => {
  return props.departmentTargets.map(dept => ({
    name: dept.departmentName,
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
  return props.departmentTargets.map(dept => ({
    name: dept.departmentName,
    value: currentChartType.value === 'profit' 
      ? dept.achievements.totalProfitActual
      : currentChartType.value === 'serviceFee'
        ? dept.achievements.serviceFeeActual
        : dept.achievements.rebateActual,
    color: getDepartmentColor(dept.departmentId)
  }))
})

// 部门对比图表数据
const departmentComparisonData = computed(() => {
  const departments = props.departmentTargets.map(dept => dept.departmentName)
  
  return {
    labels: departments,
    datasets: [
      {
        label: '目标毛利 (万)',
        data: props.departmentTargets.map(dept => dept.targets.totalProfitTarget / 10000),
        color: '#e6f7ff',
        borderColor: '#1890ff',
        borderWidth: 2
      },
      {
        label: '实际毛利 (万)',
        data: props.departmentTargets.map(dept => dept.achievements.totalProfitActual / 10000),
        color: '#1890ff'
      },
      {
        label: '目标服务费 (万)',
        data: props.departmentTargets.map(dept => dept.targets.serviceFeeTarget / 10000),
        color: '#f6ffed',
        borderColor: '#52c41a',
        borderWidth: 2
      },
      {
        label: '实际服务费 (万)',
        data: props.departmentTargets.map(dept => dept.achievements.serviceFeeActual / 10000),
        color: '#52c41a'
      }
    ]
  }
})

// 方法
const handleTimeRangeChange = (timeRange: TimeRange) => {
  selectedTimeRange.value = timeRange
  emit('time-range-change', timeRange)
}

const handleChartClick = (params: any) => {
  if (params && params.name) {
    const dept = props.departmentTargets.find(d => d.departmentName === params.name)
    if (dept) {
      emit('department-click', dept.departmentId)
    }
  }
}

const handleDepartmentClick = (params: any) => {
  if (params && params.name) {
    const dept = props.departmentTargets.find(d => d.departmentName === params.name)
    if (dept) {
      emit('department-click', dept.departmentId)
    }
  }
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

const formatChartTotal = () => {
  const total = props.departmentTargets.reduce((sum, dept) => {
    return sum + (currentChartType.value === 'profit' 
      ? dept.achievements.totalProfitActual
      : currentChartType.value === 'serviceFee'
        ? dept.achievements.serviceFeeActual
        : dept.achievements.rebateActual)
  }, 0)
  return formatCurrency(total)
}

const getGapClass = (gap: number) => {
  return gap >= 0 ? 'value-positive' : 'value-negative'
}

const getRateClass = (rate: number) => {
  if (rate >= 100) return 'rate-excellent'
  if (rate >= 80) return 'rate-good'
  if (rate >= 60) return 'rate-warning'
  return 'rate-poor'
}

const getRankingClass = (rank: number) => {
  if (rank === 1) return 'rank-first'
  if (rank === 2) return 'rank-second'
  if (rank === 3) return 'rank-third'
  return 'rank-other'
}

const getDepartmentRanking = (department: DepartmentTargetData) => {
  // 根据总毛利完成率排名
  const sorted = [...props.departmentTargets].sort((a, b) => 
    b.achievements.totalProfitRate - a.achievements.totalProfitRate
  )
  return sorted.findIndex(d => d.departmentId === department.departmentId) + 1
}

const getDepartmentColor = (departmentId: string) => {
  const colors = ['#1890ff', '#52c41a', '#fa8c16', '#722ed1', '#13c2c2', '#eb2f96']
  const index = props.departmentTargets.findIndex(d => d.departmentId === departmentId)
  return colors[index % colors.length]
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

/* 部门表格 */
.department-table {
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
}

.department-table__header {
  display: grid;
  grid-template-columns: 1.5fr 2fr 2fr 2fr 1fr;
  background: #fafafa;
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 600;
  color: #8c8c8c;
  border-bottom: 1px solid #f0f0f0;
}

.department-table__body {
  background: #fff;
}

.department-row {
  display: grid;
  grid-template-columns: 1.5fr 2fr 2fr 2fr 1fr;
  padding: 20px 16px;
  border-bottom: 1px solid #f5f5f5;
  transition: background-color 0.2s;
}

.department-row:hover {
  background: #fafafa;
}

.department-row:last-child {
  border-bottom: none;
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

/* 对比图表 */
.department-comparison-chart {
  background: #fafafa;
  border-radius: 8px;
  padding: 20px;
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