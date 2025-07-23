<template>
  <div class="optimizer-target-module">
    <div class="target-module__header">
      <h3 class="target-module__title">运营目标达成情况</h3>
      <div class="target-module__controls">
        <div class="quarter-selector">
          <select v-model="selectedQuarter" @change="handleQuarterChange" class="quarter-select">
            <option value="2024Q1">2024年Q1</option>
            <option value="2024Q2">2024年Q2</option>
            <option value="2024Q3">2024年Q3</option>
            <option value="2024Q4">2024年Q4</option>
          </select>
        </div>
        <div class="target-summary">
          <span class="summary-label">季度完成率:</span>
          <span class="summary-value" :class="getCompletionClass(targetData.quarterCompletion)">
            {{ targetData.quarterCompletion.toFixed(1) }}%
          </span>
        </div>
      </div>
    </div>

    <div class="target-module__content">
      <!-- 目标达成概览 -->
      <div class="target-overview">
        <div class="overview-cards">
          <div class="target-card">
            <div class="target-card__header">
              <Target :size="20" />
              <span>季度毛利目标</span>
            </div>
            <div class="target-card__content">
              <div class="target-progress">
                <div class="progress-info">
                  <span class="current-value">{{ formatCurrency(targetData.currentProfit) }}</span>
                  <span class="target-value">/ {{ formatCurrency(targetData.targetProfit) }}</span>
                </div>
                <div class="progress-bar">
                  <div 
                    class="progress-fill" 
                    :class="getProgressClass(targetData.quarterCompletion)"
                    :style="{ width: Math.min(targetData.quarterCompletion, 100) + '%' }"
                  ></div>
                </div>
              </div>
              <div class="target-status">
                <span class="status-badge" :class="getStatusClass(targetData.quarterCompletion)">
                  {{ getStatusText(targetData.quarterCompletion) }}
                </span>
              </div>
            </div>
          </div>

          <div class="target-card">
            <div class="target-card__header">
              <Users :size="20" />
              <span>客户数量目标</span>
            </div>
            <div class="target-card__content">
              <div class="target-progress">
                <div class="progress-info">
                  <span class="current-value">{{ targetData.currentCustomers }}家</span>
                  <span class="target-value">/ {{ targetData.targetCustomers }}家</span>
                </div>
                <div class="progress-bar">
                  <div 
                    class="progress-fill" 
                    :class="getProgressClass(getCustomerCompletion())"
                    :style="{ width: Math.min(getCustomerCompletion(), 100) + '%' }"
                  ></div>
                </div>
              </div>
              <div class="target-status">
                <span class="status-badge" :class="getStatusClass(getCustomerCompletion())">
                  {{ getStatusText(getCustomerCompletion()) }}
                </span>
              </div>
            </div>
          </div>

          <div class="target-card">
            <div class="target-card__header">
              <TrendingUp :size="20" />
              <span>ROI目标</span>
            </div>
            <div class="target-card__content">
              <div class="target-progress">
                <div class="progress-info">
                  <span class="current-value">{{ targetData.currentROI.toFixed(2) }}</span>
                  <span class="target-value">/ {{ targetData.targetROI.toFixed(2) }}</span>
                </div>
                <div class="progress-bar">
                  <div 
                    class="progress-fill" 
                    :class="getProgressClass(getROICompletion())"
                    :style="{ width: Math.min(getROICompletion(), 100) + '%' }"
                  ></div>
                </div>
              </div>
              <div class="target-status">
                <span class="status-badge" :class="getStatusClass(getROICompletion())">
                  {{ getStatusText(getROICompletion()) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 月度达成趋势 -->
      <div class="monthly-trends">
        <div class="trends-header">
          <h4>月度达成趋势</h4>
          <div class="trend-legend">
            <div class="legend-item">
              <div class="legend-color profit"></div>
              <span>毛利完成率</span>
            </div>
            <div class="legend-item">
              <div class="legend-color roi"></div>
              <span>ROI达成率</span>
            </div>
          </div>
        </div>
        
        <div class="trends-chart">
          <div class="chart-container">
            <div 
              v-for="(month, index) in targetData.monthlyTrends" 
              :key="month.month"
              class="chart-bar-group"
            >
              <div class="month-bars">
                <div 
                  class="chart-bar profit-bar"
                  :style="{ height: month.profitCompletion + '%' }"
                  :title="`毛利完成率: ${month.profitCompletion}%`"
                ></div>
                <div 
                  class="chart-bar roi-bar"
                  :style="{ height: month.roiCompletion + '%' }"
                  :title="`ROI达成率: ${month.roiCompletion}%`"
                ></div>
              </div>
              <div class="month-label">{{ month.month }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 目标分解详情 -->
      <div class="target-breakdown">
        <div class="breakdown-header">
          <h4>目标分解详情</h4>
          <div class="breakdown-controls">
            <button class="breakdown-btn" :class="{ active: viewMode === 'monthly' }" @click="viewMode = 'monthly'">
              按月查看
            </button>
            <button class="breakdown-btn" :class="{ active: viewMode === 'weekly' }" @click="viewMode = 'weekly'">
              按周查看
            </button>
          </div>
        </div>

        <div class="breakdown-table">
          <div class="table-header">
            <div class="header-cell period">时间</div>
            <div class="header-cell target">毛利目标</div>
            <div class="header-cell actual">实际完成</div>
            <div class="header-cell completion">完成率</div>
            <div class="header-cell variance">差异</div>
            <div class="header-cell status">状态</div>
          </div>
          
          <div class="table-body">
            <div 
              v-for="item in getBreakdownData()" 
              :key="item.period"
              class="table-row"
              :class="getRowClass(item.completionRate)"
            >
              <div class="table-cell period">{{ item.period }}</div>
              <div class="table-cell target">{{ formatCurrency(item.target) }}</div>
              <div class="table-cell actual">{{ formatCurrency(item.actual) }}</div>
              <div class="table-cell completion">
                <span class="completion-rate" :class="getCompletionClass(item.completionRate)">
                  {{ item.completionRate.toFixed(1) }}%
                </span>
              </div>
              <div class="table-cell variance">
                <span class="variance-value" :class="getVarianceClass(item.variance)">
                  {{ item.variance > 0 ? '+' : '' }}{{ formatCurrency(item.variance) }}
                </span>
              </div>
              <div class="table-cell status">
                <div class="status-indicator" :class="getStatusClass(item.completionRate)">
                  {{ getStatusText(item.completionRate) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Target, Users, TrendingUp } from 'lucide-vue-next'
import type { OptimizerTargetData } from '@/types'

interface Props {
  targetData: OptimizerTargetData
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<{
  'quarter-change': [quarter: string]
}>()

// 响应式数据
const selectedQuarter = ref('2024Q4')
const viewMode = ref<'monthly' | 'weekly'>('monthly')

// 计算属性
const getCustomerCompletion = () => {
  return (props.targetData.currentCustomers / props.targetData.targetCustomers) * 100
}

const getROICompletion = () => {
  return (props.targetData.currentROI / props.targetData.targetROI) * 100
}

const getBreakdownData = () => {
  return viewMode.value === 'monthly' ? props.targetData.monthlyBreakdown : props.targetData.weeklyBreakdown
}

// 方法
const formatCurrency = (value: number): string => {
  if (value >= 100000000) {
    return `¥${(value / 100000000).toFixed(2)}亿`
  } else if (value >= 10000) {
    return `¥${(value / 10000).toFixed(1)}万`
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

const getProgressClass = (rate: number) => {
  if (rate >= 100) return 'progress-excellent'
  if (rate >= 80) return 'progress-good'
  if (rate >= 60) return 'progress-warning'
  return 'progress-poor'
}

const getStatusClass = (rate: number) => {
  if (rate >= 100) return 'status-excellent'
  if (rate >= 80) return 'status-good'
  if (rate >= 60) return 'status-warning'
  return 'status-poor'
}

const getStatusText = (rate: number) => {
  if (rate >= 100) return '已达成'
  if (rate >= 80) return '良好'
  if (rate >= 60) return '需努力'
  return '待改进'
}

const getRowClass = (rate: number) => {
  return `row-${getStatusClass(rate).replace('status-', '')}`
}

const getVarianceClass = (variance: number) => {
  return variance >= 0 ? 'variance-positive' : 'variance-negative'
}

const handleQuarterChange = () => {
  emit('quarter-change', selectedQuarter.value)
}
</script>

<style scoped>
.optimizer-target-module {
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

.quarter-select {
  padding: 6px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  background: #fff;
  color: #262626;
  font-size: 14px;
  outline: none;
}

.target-summary {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.summary-label {
  color: #8c8c8c;
}

.summary-value {
  font-weight: 600;
  font-size: 16px;
}

.summary-value.completion-excellent { color: #52c41a; }
.summary-value.completion-good { color: #1890ff; }
.summary-value.completion-warning { color: #fa8c16; }
.summary-value.completion-poor { color: #ff4d4f; }

.target-module__content {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* 目标概览卡片 */
.overview-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
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
  gap: 8px;
  margin-bottom: 16px;
  color: #1890ff;
  font-size: 14px;
  font-weight: 500;
}

.target-progress {
  margin-bottom: 12px;
}

.progress-info {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-bottom: 8px;
}

.current-value {
  font-size: 20px;
  font-weight: 700;
  color: #262626;
}

.target-value {
  font-size: 14px;
  color: #8c8c8c;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.8s ease;
}

.progress-fill.progress-excellent { background: #52c41a; }
.progress-fill.progress-good { background: #1890ff; }
.progress-fill.progress-warning { background: #fa8c16; }
.progress-fill.progress-poor { background: #ff4d4f; }

.status-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
}

.status-badge.status-excellent {
  background: #f6ffed;
  color: #52c41a;
}

.status-badge.status-good {
  background: #e6f7ff;
  color: #1890ff;
}

.status-badge.status-warning {
  background: #fff7e6;
  color: #fa8c16;
}

.status-badge.status-poor {
  background: #fff2f0;
  color: #ff4d4f;
}

/* 月度趋势图 */
.trends-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.trends-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #262626;
}

.trend-legend {
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

.legend-color.profit { background: #1890ff; }
.legend-color.roi { background: #52c41a; }

.chart-container {
  display: flex;
  align-items: end;
  gap: 16px;
  height: 120px;
  padding: 0 20px;
  border-bottom: 1px solid #f0f0f0;
}

.chart-bar-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.month-bars {
  display: flex;
  gap: 4px;
  height: 100px;
  align-items: end;
}

.chart-bar {
  width: 12px;
  border-radius: 2px 2px 0 0;
  transition: all 0.3s ease;
}

.chart-bar:hover {
  opacity: 0.8;
}

.profit-bar { background: #1890ff; }
.roi-bar { background: #52c41a; }

.month-label {
  font-size: 11px;
  color: #8c8c8c;
  margin-top: 8px;
}

/* 目标分解表格 */
.breakdown-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.breakdown-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #262626;
}

.breakdown-controls {
  display: flex;
  gap: 8px;
}

.breakdown-btn {
  padding: 6px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  background: #fff;
  color: #595959;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.breakdown-btn.active {
  background: #1890ff;
  color: #fff;
  border-color: #1890ff;
}

.breakdown-table {
  border-radius: 8px;
  border: 1px solid #f0f0f0;
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 1fr 1.2fr 1.2fr 0.8fr 1fr 0.8fr;
  background: #fafafa;
  border-bottom: 1px solid #f0f0f0;
}

.header-cell {
  padding: 12px 16px;
  font-size: 13px;
  font-weight: 600;
  color: #595959;
  border-right: 1px solid #f0f0f0;
}

.header-cell:last-child {
  border-right: none;
}

.table-body {
  max-height: 400px;
  overflow-y: auto;
}

.table-row {
  display: grid;
  grid-template-columns: 1fr 1.2fr 1.2fr 0.8fr 1fr 0.8fr;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s;
}

.table-row:hover {
  background: #f9f9f9;
}

.table-row.row-excellent { background: rgba(82, 196, 26, 0.05); }
.table-row.row-good { background: rgba(24, 144, 255, 0.05); }
.table-row.row-warning { background: rgba(250, 140, 22, 0.05); }
.table-row.row-poor { background: rgba(255, 77, 79, 0.05); }

.table-cell {
  padding: 12px 16px;
  font-size: 14px;
  color: #262626;
  border-right: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
}

.table-cell:last-child {
  border-right: none;
}

.completion-rate.completion-excellent { color: #52c41a; font-weight: 600; }
.completion-rate.completion-good { color: #1890ff; font-weight: 600; }
.completion-rate.completion-warning { color: #fa8c16; font-weight: 600; }
.completion-rate.completion-poor { color: #ff4d4f; font-weight: 600; }

.variance-value.variance-positive { color: #52c41a; }
.variance-value.variance-negative { color: #ff4d4f; }

.status-indicator {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
}

.status-indicator.status-excellent {
  background: #f6ffed;
  color: #52c41a;
}

.status-indicator.status-good {
  background: #e6f7ff;
  color: #1890ff;
}

.status-indicator.status-warning {
  background: #fff7e6;
  color: #fa8c16;
}

.status-indicator.status-poor {
  background: #fff2f0;
  color: #ff4d4f;
}

@media (max-width: 1200px) {
  .overview-cards {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .table-header,
  .table-row {
    grid-template-columns: 1fr 1fr 1fr 0.8fr 1fr 0.8fr;
  }
}

@media (max-width: 768px) {
  .optimizer-target-module {
    padding: 16px;
  }

  .target-module__header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .overview-cards {
    grid-template-columns: 1fr;
  }

  .trends-header {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }

  .chart-container {
    padding: 0 10px;
    gap: 8px;
  }

  .breakdown-header {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }

  .breakdown-table {
    overflow-x: auto;
  }

  .table-header,
  .table-row {
    min-width: 600px;
  }
}
</style>