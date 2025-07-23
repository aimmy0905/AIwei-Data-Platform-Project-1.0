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
      <!-- 季度标签页 -->
      <div class="quarter-tabs">
        <button 
          v-for="quarter in quarters"
          :key="quarter.value"
          class="quarter-tab"
          :class="{ 'quarter-tab--active': currentQuarter === quarter.value }"
          @click="currentQuarter = quarter.value"
        >
          {{ quarter.label }}
        </button>
      </div>

      <!-- 目标完成对比 -->
      <div class="target-comparison-section" v-if="currentTargetData">
        <div class="comparison-cards">
          <!-- 总毛利对比 -->
          <div class="comparison-card">
            <div class="comparison-card__header">
              <div class="card-icon profit-icon">
                <TrendingUp :size="20" />
              </div>
              <div class="card-title">
                <h4>合计毛利</h4>
                <div class="completion-rate" :class="getCompletionClass(currentTargetData.achievements.totalProfitRate)">
                  {{ currentTargetData.achievements.totalProfitRate.toFixed(1) }}%
                </div>
              </div>
            </div>
            <div class="comparison-card__content">
              <div class="target-value">
                <span class="label">目标:</span>
                <span class="value">{{ formatCurrency(currentTargetData.targets.totalProfitTarget) }}</span>
              </div>
              <div class="actual-value">
                <span class="label">实际:</span>
                <span class="value">{{ formatCurrency(currentTargetData.achievements.totalProfitActual) }}</span>
              </div>
              <div class="gap-value" :class="getGapClass(currentTargetData.achievements.totalProfitGap)">
                <span class="label">差额:</span>
                <span class="value">{{ formatCurrency(Math.abs(currentTargetData.achievements.totalProfitGap)) }}</span>
              </div>
              <!-- 进度条 -->
              <div class="progress-bar">
                <div 
                  class="progress-bar__fill"
                  :class="getProgressClass(currentTargetData.achievements.totalProfitRate)"
                  :style="{ width: Math.min(currentTargetData.achievements.totalProfitRate, 100) + '%' }"
                ></div>
              </div>
            </div>
          </div>

          <!-- 服务费对比 -->
          <div class="comparison-card">
            <div class="comparison-card__header">
              <div class="card-icon service-icon">
                <DollarSign :size="20" />
              </div>
              <div class="card-title">
                <h4>服务费</h4>
                <div class="completion-rate" :class="getCompletionClass(currentTargetData.achievements.serviceFeeRate)">
                  {{ currentTargetData.achievements.serviceFeeRate.toFixed(1) }}%
                </div>
              </div>
            </div>
            <div class="comparison-card__content">
              <div class="target-value">
                <span class="label">目标:</span>
                <span class="value">{{ formatCurrency(currentTargetData.targets.serviceFeeTarget) }}</span>
              </div>
              <div class="actual-value">
                <span class="label">实际:</span>
                <span class="value">{{ formatCurrency(currentTargetData.achievements.serviceFeeActual) }}</span>
              </div>
              <div class="gap-value" :class="getGapClass(currentTargetData.achievements.serviceFeeGap)">
                <span class="label">差额:</span>
                <span class="value">{{ formatCurrency(Math.abs(currentTargetData.achievements.serviceFeeGap)) }}</span>
              </div>
              <!-- 进度条 -->
              <div class="progress-bar">
                <div 
                  class="progress-bar__fill"
                  :class="getProgressClass(currentTargetData.achievements.serviceFeeRate)"
                  :style="{ width: Math.min(currentTargetData.achievements.serviceFeeRate, 100) + '%' }"
                ></div>
              </div>
            </div>
          </div>

          <!-- 返点对比 -->
          <div class="comparison-card">
            <div class="comparison-card__header">
              <div class="card-icon rebate-icon">
                <Gift :size="20" />
              </div>
              <div class="card-title">
                <h4>返点</h4>
                <div class="completion-rate" :class="getCompletionClass(currentTargetData.achievements.rebateRate)">
                  {{ currentTargetData.achievements.rebateRate.toFixed(1) }}%
                </div>
              </div>
            </div>
            <div class="comparison-card__content">
              <div class="target-value">
                <span class="label">目标:</span>
                <span class="value">{{ formatCurrency(currentTargetData.targets.rebateTarget) }}</span>
              </div>
              <div class="actual-value">
                <span class="label">实际:</span>
                <span class="value">{{ formatCurrency(currentTargetData.achievements.rebateActual) }}</span>
              </div>
              <div class="gap-value" :class="getGapClass(currentTargetData.achievements.rebateGap)">
                <span class="label">差额:</span>
                <span class="value">{{ formatCurrency(Math.abs(currentTargetData.achievements.rebateGap)) }}</span>
              </div>
              <!-- 进度条 -->
              <div class="progress-bar">
                <div 
                  class="progress-bar__fill"
                  :class="getProgressClass(currentTargetData.achievements.rebateRate)"
                  :style="{ width: Math.min(currentTargetData.achievements.rebateRate, 100) + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- 季度对比图表 -->
        <div class="quarter-comparison-chart">
          <div class="chart-header">
            <h4 class="chart-title">季度对比分析</h4>
            <div class="chart-legend">
              <span class="legend-item">
                <span class="legend-color legend-color--target"></span>
                目标
              </span>
              <span class="legend-item">
                <span class="legend-color legend-color--actual"></span>
                实际
              </span>
            </div>
          </div>
          <div class="chart-content">
            <BarChart
              :data="quarterComparisonChartData"
              :height="'320px'"
              :show-legend="false"
              :stack="false"
              @click="handleChartClick"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { TrendingUp, DollarSign, Gift } from 'lucide-vue-next'
import BarChart from '@/components/charts/BarChart.vue'
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

const currentQuarter = ref<string>('')

// 季度选项
const quarters = computed(() => {
  const currentYear = new Date().getFullYear()
  return [
    { value: `${currentYear}-Q1`, label: `${currentYear}年Q1` },
    { value: `${currentYear}-Q2`, label: `${currentYear}年Q2` },
    { value: `${currentYear}-Q3`, label: `${currentYear}年Q3` },
    { value: `${currentYear}-Q4`, label: `${currentYear}年Q4` }
  ]
})

// 当前季度数据
const currentTargetData = computed(() => {
  return props.operationTargets.find(target => target.quarter === currentQuarter.value)
})

// 季度对比图表数据
const quarterComparisonChartData = computed(() => {
  const quarters = props.operationTargets.map(target => target.quarter)
  
  return {
    labels: quarters,
    datasets: [
      {
        label: '目标总毛利 (万)',
        data: props.operationTargets.map(target => target.targets.totalProfitTarget / 10000),
        color: '#e6f7ff',
        borderColor: '#1890ff',
        borderWidth: 2
      },
      {
        label: '实际总毛利 (万)',
        data: props.operationTargets.map(target => target.achievements.totalProfitActual / 10000),
        color: '#1890ff'
      },
      {
        label: '目标服务费 (万)',
        data: props.operationTargets.map(target => target.targets.serviceFeeTarget / 10000),
        color: '#f6ffed',
        borderColor: '#52c41a',
        borderWidth: 2
      },
      {
        label: '实际服务费 (万)',
        data: props.operationTargets.map(target => target.achievements.serviceFeeActual / 10000),
        color: '#52c41a'
      },
      {
        label: '目标返点 (万)',
        data: props.operationTargets.map(target => target.targets.rebateTarget / 10000),
        color: '#fff7e6',
        borderColor: '#fa8c16',
        borderWidth: 2
      },
      {
        label: '实际返点 (万)',
        data: props.operationTargets.map(target => target.achievements.rebateActual / 10000),
        color: '#fa8c16'
      }
    ]
  }
})

// 初始化当前季度
watch(() => props.operationTargets, (targets) => {
  if (targets.length > 0 && !currentQuarter.value) {
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const currentMonth = currentDate.getMonth() + 1
    const quarter = Math.ceil(currentMonth / 3)
    currentQuarter.value = `${currentYear}-Q${quarter}`
    
    // 如果当前季度没有数据，使用第一个可用季度
    if (!targets.find(t => t.quarter === currentQuarter.value)) {
      currentQuarter.value = targets[0].quarter
    }
  }
}, { immediate: true })

// 方法
const handleTimeRangeChange = (timeRange: TimeRange) => {
  selectedTimeRange.value = timeRange
  emit('time-range-change', timeRange)
}

const handleChartClick = (params: any) => {
  if (params && params.name) {
    currentQuarter.value = params.name
    emit('quarter-change', params.name)
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

// 监听季度变化
watch(currentQuarter, (quarter) => {
  emit('quarter-change', quarter)
})
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

/* 季度标签页 */
.quarter-tabs {
  display: flex;
  border-bottom: 2px solid #f0f0f0;
  margin-bottom: 8px;
}

.quarter-tab {
  padding: 12px 24px;
  background: none;
  border: none;
  color: #8c8c8c;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  position: relative;
  transition: all 0.3s;
}

.quarter-tab:hover {
  color: #1890ff;
}

.quarter-tab--active {
  color: #1890ff;
}

.quarter-tab--active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background: #1890ff;
}

/* 对比卡片区域 */
.target-comparison-section {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.comparison-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
}

.comparison-card {
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 20px;
  transition: all 0.2s;
}

.comparison-card:hover {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.comparison-card__header {
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

.card-icon.profit-icon {
  background: #722ed1;
}

.card-icon.service-icon {
  background: #1890ff;
}

.card-icon.rebate-icon {
  background: #52c41a;
}

.card-title {
  flex: 1;
}

.card-title h4 {
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

.comparison-card__content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.target-value,
.actual-value,
.gap-value {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
}

.label {
  font-size: 13px;
  color: #8c8c8c;
}

.value {
  font-size: 14px;
  font-weight: 600;
  color: #262626;
}

.gap-value.gap-positive .value {
  color: #52c41a;
}

.gap-value.gap-negative .value {
  color: #ff4d4f;
}

/* 进度条 */
.progress-bar {
  width: 100%;
  height: 6px;
  background: #f0f0f0;
  border-radius: 3px;
  overflow: hidden;
  margin-top: 12px;
}

.progress-bar__fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.8s ease;
}

.progress-bar__fill.progress-excellent {
  background: #52c41a;
}

.progress-bar__fill.progress-good {
  background: #1890ff;
}

.progress-bar__fill.progress-warning {
  background: #fa8c16;
}

.progress-bar__fill.progress-poor {
  background: #ff4d4f;
}

/* 图表区域 */
.quarter-comparison-chart {
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

.chart-legend {
  display: flex;
  gap: 16px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #8c8c8c;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.legend-color--target {
  background: #e6f7ff;
  border: 1px solid #1890ff;
}

.legend-color--actual {
  background: #1890ff;
}

.chart-content {
  background: #fff;
  border-radius: 6px;
  padding: 16px;
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

  .quarter-tabs {
    flex-wrap: wrap;
  }

  .quarter-tab {
    padding: 8px 16px;
    font-size: 13px;
  }

  .comparison-cards {
    grid-template-columns: 1fr;
  }

  .chart-header {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }

  .chart-legend {
    justify-content: center;
  }
}
</style>