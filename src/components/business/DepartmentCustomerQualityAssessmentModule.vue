<template>
  <div class="department-customer-quality-assessment-module">
        <div class="analysis-module__header">
      <h3 class="analysis-module__title">部门客户质量评估（部门）</h3>
      <div class="analysis-module__controls">
        <div class="time-controls">
          <button
            v-for="timeRange in timeRanges"
            :key="timeRange.key"
            class="time-btn"
            :class="{ 'time-btn--active': currentTimeRange === timeRange.key }"
            @click="handleTimeRangeChange(timeRange.key)"
          >
            {{ timeRange.label }}
          </button>
        </div>
        <div class="quarter-controls">
          <button class="quarter-nav-btn" @click="previousQuarter">
            <ChevronLeft :size="16" />
          </button>
          <button class="quarter-display">{{ currentQuarter }}</button>
          <button class="quarter-nav-btn" @click="nextQuarter" :disabled="isNextDisabled">
            <ChevronRight :size="16" />
          </button>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>正在加载部门客户质量评估数据...</p>
    </div>

    <div v-else class="analysis-module__content">
      <!-- 客户质量数据列表 -->
      <div class="quality-table-container">
      <table class="quality-table">
        <thead>
          <tr>
            <th rowspan="2" class="time-header">年度</th>
            <th rowspan="2" class="time-header">部门</th>
            <th colspan="4" class="category-header high-value">月消费 10万美金以上客户（所有平台）</th>
            <th colspan="4" class="category-header medium-high">月消费 5-10万美金客户（所有平台）</th>
            <th colspan="4" class="category-header medium">月消费 3-5万美金客户（所有平台）</th>
            <th colspan="4" class="category-header medium-low">月消费 1.5-3万美金客户（所有平台）</th>
            <th colspan="4" class="category-header low-value">月消费 1.5万以下美金客户（所有平台）</th>
          </tr>
          <tr>
            <!-- 10万美金以上客户 -->
            <th class="sub-header high-value">客户数</th>
            <th class="sub-header high-value">销售额</th>
            <th class="sub-header high-value">总消费</th>
            <th class="sub-header high-value">ROI</th>
            <!-- 5-10万美金客户 -->
            <th class="sub-header medium-high">客户数</th>
            <th class="sub-header medium-high">销售额</th>
            <th class="sub-header medium-high">总消费</th>
            <th class="sub-header medium-high">ROI</th>
            <!-- 3-5万美金客户 -->
            <th class="sub-header medium">客户数</th>
            <th class="sub-header medium">销售额</th>
            <th class="sub-header medium">总消费</th>
            <th class="sub-header medium">ROI</th>
            <!-- 1.5-3万美金客户 -->
            <th class="sub-header medium-low">客户数</th>
            <th class="sub-header medium-low">销售额</th>
            <th class="sub-header medium-low">总消费</th>
            <th class="sub-header medium-low">ROI</th>
            <!-- 1.5万以下客户 -->
            <th class="sub-header low-value">客户数</th>
            <th class="sub-header low-value">销售额</th>
            <th class="sub-header low-value">总消费</th>
            <th class="sub-header low-value">ROI</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="deptData in customerQualityData" :key="`${deptData.year}-${deptData.department}`" class="data-row">
            <td class="time-cell" v-if="deptData.isFirstOfYear" :rowspan="deptData.departmentCount">{{ deptData.year }}</td>
            <td class="time-cell">{{ deptData.department }}</td>

            <!-- 10万美金以上客户数据 -->
            <td class="data-cell high-value">{{ deptData.highValue.customers }}</td>
            <td class="data-cell high-value">{{ formatCurrency(deptData.highValue.sales) }}</td>
            <td class="data-cell high-value">{{ formatCurrency(deptData.highValue.consumption) }}</td>
            <td class="data-cell high-value">{{ formatPercentage(deptData.highValue.roi) }}</td>

            <!-- 5-10万美金客户数据 -->
            <td class="data-cell medium-high">{{ deptData.mediumHigh.customers }}</td>
            <td class="data-cell medium-high">{{ formatCurrency(deptData.mediumHigh.sales) }}</td>
            <td class="data-cell medium-high">{{ formatCurrency(deptData.mediumHigh.consumption) }}</td>
            <td class="data-cell medium-high">{{ formatPercentage(deptData.mediumHigh.roi) }}</td>

            <!-- 3-5万美金客户数据 -->
            <td class="data-cell medium">{{ deptData.medium.customers }}</td>
            <td class="data-cell medium">{{ formatCurrency(deptData.medium.sales) }}</td>
            <td class="data-cell medium">{{ formatCurrency(deptData.medium.consumption) }}</td>
            <td class="data-cell medium">{{ formatPercentage(deptData.medium.roi) }}</td>

            <!-- 1.5-3万美金客户数据 -->
            <td class="data-cell medium-low">{{ deptData.mediumLow.customers }}</td>
            <td class="data-cell medium-low">{{ formatCurrency(deptData.mediumLow.sales) }}</td>
            <td class="data-cell medium-low">{{ formatCurrency(deptData.mediumLow.consumption) }}</td>
            <td class="data-cell medium-low">{{ formatPercentage(deptData.mediumLow.roi) }}</td>

            <!-- 1.5万以下客户数据 -->
            <td class="data-cell low-value">{{ deptData.lowValue.customers }}</td>
            <td class="data-cell low-value">{{ formatCurrency(deptData.lowValue.sales) }}</td>
            <td class="data-cell low-value">{{ formatCurrency(deptData.lowValue.consumption) }}</td>
            <td class="data-cell low-value">{{ formatPercentage(deptData.lowValue.roi) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 图表展示区域 -->
    <div class="charts-container">
      <div class="chart-item">
        <h4 class="chart-title">用户数占比</h4>
        <div class="chart-container">
          <v-chart class="chart" :option="userCountChartOption" />
        </div>
      </div>

      <div class="chart-item">
        <h4 class="chart-title">销售额占比</h4>
        <div class="chart-container">
          <v-chart class="chart" :option="salesAmountChartOption" />
        </div>
      </div>

      <div class="chart-item">
        <h4 class="chart-title">总消费占比</h4>
        <div class="chart-container">
          <v-chart class="chart" :option="consumptionChartOption" />
        </div>
      </div>

      <div class="chart-item">
        <h4 class="chart-title">ROI占比</h4>
        <div class="chart-container">
          <v-chart class="chart" :option="roiChartOption" />
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import VChart from 'vue-echarts'

use([CanvasRenderer, PieChart, TitleComponent, TooltipComponent, LegendComponent])

interface CustomerSegment {
  customers: number
  sales: number
  consumption: number
  roi: number
}

interface DepartmentCustomerQualityData {
  year: string
  department: string
  isFirstOfYear: boolean
  departmentCount: number
  highValue: CustomerSegment     // 月消费 10万美金以上客户
  mediumHigh: CustomerSegment    // 月消费 5-10万美金客户
  medium: CustomerSegment        // 月消费 3-5万美金客户
  mediumLow: CustomerSegment     // 月消费 1.5-3万美金客户
  lowValue: CustomerSegment      // 月消费 1.5万以下客户
}

// Props
interface Props {
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

// Emits
const emit = defineEmits<{
  'time-range-change': [timeRange: string]
  'quarter-change': [quarter: string]
}>()

// 时间控制状态
const currentTimeRange = ref('季')
const currentQuarter = ref('2025年Q1')

const timeRanges = [
  { key: '年', label: '年' },
  { key: '季', label: '季' },
  { key: '月', label: '月' }
]

const isNextDisabled = computed(() => {
  return false // 根据实际逻辑判断
})

// 事件处理
const handleTimeRangeChange = (timeRange: string) => {
  currentTimeRange.value = timeRange
  emit('time-range-change', timeRange)
}

const previousQuarter = () => {
  emit('quarter-change', 'previous')
}

const nextQuarter = () => {
  if (!isNextDisabled.value) {
    emit('quarter-change', 'next')
  }
}

// 客户质量评估数据
const customerQualityData = ref<DepartmentCustomerQualityData[]>([
  {
    year: '2025年',
    department: '运营',
    isFirstOfYear: true,
    departmentCount: 5,
    highValue: { customers: 125, sales: 3500.0, consumption: 1200.0, roi: 291.7 },
    mediumHigh: { customers: 245, sales: 2800.0, consumption: 1850.0, roi: 151.4 },
    medium: { customers: 380, sales: 1900.0, consumption: 1520.0, roi: 125.0 },
    mediumLow: { customers: 520, sales: 1300.0, consumption: 1300.0, roi: 100.0 },
    lowValue: { customers: 850, sales: 680.0, consumption: 850.0, roi: 80.0 }
  },
  {
    year: '2025年',
    department: '运营一部',
    isFirstOfYear: false,
    departmentCount: 1,
    highValue: { customers: 28, sales: 850.0, consumption: 280.0, roi: 303.6 },
    mediumHigh: { customers: 58, sales: 680.0, consumption: 435.0, roi: 156.3 },
    medium: { customers: 92, sales: 460.0, consumption: 368.0, roi: 125.0 },
    mediumLow: { customers: 125, sales: 315.0, consumption: 315.0, roi: 100.0 },
    lowValue: { customers: 205, sales: 164.0, consumption: 205.0, roi: 80.0 }
  },
  {
    year: '2025年',
    department: '运营二部',
    isFirstOfYear: false,
    departmentCount: 1,
    highValue: { customers: 32, sales: 920.0, consumption: 315.0, roi: 292.1 },
    mediumHigh: { customers: 62, sales: 725.0, consumption: 465.0, roi: 155.9 },
    medium: { customers: 95, sales: 485.0, consumption: 380.0, roi: 127.6 },
    mediumLow: { customers: 130, sales: 325.0, consumption: 325.0, roi: 100.0 },
    lowValue: { customers: 210, sales: 168.0, consumption: 210.0, roi: 80.0 }
  },
  {
    year: '2025年',
    department: '运营三部',
    isFirstOfYear: false,
    departmentCount: 1,
    highValue: { customers: 33, sales: 890.0, consumption: 305.0, roi: 291.8 },
    mediumHigh: { customers: 63, sales: 710.0, consumption: 472.5, roi: 150.3 },
    medium: { customers: 98, sales: 485.0, consumption: 392.0, roi: 123.7 },
    mediumLow: { customers: 132, sales: 330.0, consumption: 330.0, roi: 100.0 },
    lowValue: { customers: 212, sales: 170.0, consumption: 212.0, roi: 80.2 }
  },
  {
    year: '2025年',
    department: '运营四部',
    isFirstOfYear: false,
    departmentCount: 1,
    highValue: { customers: 32, sales: 840.0, consumption: 300.0, roi: 280.0 },
    mediumHigh: { customers: 62, sales: 685.0, consumption: 477.5, roi: 143.5 },
    medium: { customers: 95, sales: 470.0, consumption: 380.0, roi: 123.7 },
    mediumLow: { customers: 133, sales: 330.0, consumption: 330.0, roi: 100.0 },
    lowValue: { customers: 213, sales: 178.0, consumption: 223.0, roi: 79.8 }
  }
])

// 格式化函数
const formatCurrency = (value: number): string => {
  return value.toFixed(1)
}

const formatPercentage = (value: number): string => {
  return `${value}%`
}

// 图表配置
const userCountChartOption = computed(() => ({
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c} ({d}%)'
  },
  legend: {
    orient: 'horizontal',
    bottom: '10px',
    textStyle: { fontSize: 10 }
  },
  series: [{
    name: '用户数',
    type: 'pie',
    radius: ['30%', '60%'],
    center: ['50%', '45%'],
    data: [
      { value: 125, name: '10万美金以上', itemStyle: { color: '#52c41a' } },
      { value: 245, name: '5-10万美金', itemStyle: { color: '#1890ff' } },
      { value: 380, name: '3-5万美金', itemStyle: { color: '#faad14' } },
      { value: 520, name: '1.5-3万美金', itemStyle: { color: '#722ed1' } },
      { value: 850, name: '1.5万以下', itemStyle: { color: '#ff4d4f' } }
    ],
    emphasis: {
      itemStyle: {
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowColor: 'rgba(0, 0, 0, 0.5)'
      }
    }
  }]
}))

const salesAmountChartOption = computed(() => ({
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c}万元 ({d}%)'
  },
  legend: {
    orient: 'horizontal',
    bottom: '10px',
    textStyle: { fontSize: 10 }
  },
  series: [{
    name: '销售额',
    type: 'pie',
    radius: ['30%', '60%'],
    center: ['50%', '45%'],
    data: [
      { value: 3500.0, name: '10万美金以上', itemStyle: { color: '#52c41a' } },
      { value: 2800.0, name: '5-10万美金', itemStyle: { color: '#1890ff' } },
      { value: 1900.0, name: '3-5万美金', itemStyle: { color: '#faad14' } },
      { value: 1300.0, name: '1.5-3万美金', itemStyle: { color: '#722ed1' } },
      { value: 680.0, name: '1.5万以下', itemStyle: { color: '#ff4d4f' } }
    ],
    emphasis: {
      itemStyle: {
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowColor: 'rgba(0, 0, 0, 0.5)'
      }
    }
  }]
}))

const consumptionChartOption = computed(() => ({
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c}万元 ({d}%)'
  },
  legend: {
    orient: 'horizontal',
    bottom: '10px',
    textStyle: { fontSize: 10 }
  },
  series: [{
    name: '总消费',
    type: 'pie',
    radius: ['30%', '60%'],
    center: ['50%', '45%'],
    data: [
      { value: 1200.0, name: '10万美金以上', itemStyle: { color: '#52c41a' } },
      { value: 1850.0, name: '5-10万美金', itemStyle: { color: '#1890ff' } },
      { value: 1520.0, name: '3-5万美金', itemStyle: { color: '#faad14' } },
      { value: 1300.0, name: '1.5-3万美金', itemStyle: { color: '#722ed1' } },
      { value: 850.0, name: '1.5万以下', itemStyle: { color: '#ff4d4f' } }
    ],
    emphasis: {
      itemStyle: {
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowColor: 'rgba(0, 0, 0, 0.5)'
      }
    }
  }]
}))

const roiChartOption = computed(() => ({
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c}% ({d}%)'
  },
  legend: {
    orient: 'horizontal',
    bottom: '10px',
    textStyle: { fontSize: 10 }
  },
  series: [{
    name: 'ROI',
    type: 'pie',
    radius: ['30%', '60%'],
    center: ['50%', '45%'],
    data: [
      { value: 291.7, name: '10万美金以上', itemStyle: { color: '#52c41a' } },
      { value: 151.4, name: '5-10万美金', itemStyle: { color: '#1890ff' } },
      { value: 125.0, name: '3-5万美金', itemStyle: { color: '#faad14' } },
      { value: 100.0, name: '1.5-3万美金', itemStyle: { color: '#722ed1' } },
      { value: 80.0, name: '1.5万以下', itemStyle: { color: '#ff4d4f' } }
    ],
    emphasis: {
      itemStyle: {
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowColor: 'rgba(0, 0, 0, 0.5)'
      }
    }
  }]
}))
</script>

<style scoped>
.department-customer-quality-assessment-module {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-bottom: 24px;
}

.analysis-module__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.analysis-module__title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #262626;
}

.analysis-module__controls {
  display: flex;
  align-items: center;
  gap: 16px;
}

.time-controls {
  display: flex;
  gap: 8px;
}

.time-btn {
  padding: 6px 12px;
  border: 1px solid #d9d9d9;
  background: #fff;
  color: #595959;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.time-btn:hover {
  border-color: #40a9ff;
  color: #40a9ff;
}

.time-btn--active {
  background: #1890ff;
  border-color: #1890ff;
  color: #fff;
}

.quarter-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.quarter-nav-btn {
  padding: 4px;
  border: 1px solid #d9d9d9;
  background: #fff;
  color: #595959;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.quarter-nav-btn:hover:not(:disabled) {
  border-color: #40a9ff;
  color: #40a9ff;
}

.quarter-nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quarter-display {
  padding: 4px 12px;
  border: 1px solid #d9d9d9;
  background: #fff;
  color: #262626;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: default;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f0f0f0;
  border-top: 3px solid #1890ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-state p {
  color: #8c8c8c;
  margin: 0;
}

.quality-table-container {
  padding: 24px;
  overflow-x: auto;
}

.quality-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  min-width: 1800px;
}

.quality-table th,
.quality-table td {
  padding: 12px 8px;
  text-align: center;
  border: 1px solid #f0f0f0;
  white-space: nowrap;
}

.time-header {
  background: #f0f2f5 !important;
  color: #262626 !important;
  font-weight: 600;
  font-size: 12px;
  position: sticky;
  left: 0;
  z-index: 2;
}

.time-cell {
  background: #f0f2f5 !important;
  color: #262626 !important;
  font-weight: 600;
  font-size: 13px;
  position: sticky;
  left: 0;
  z-index: 1;
  min-width: 80px;
}

.category-header.high-value {
  background: #f6ffed !important;
  color: #52c41a !important;
  font-weight: 600;
  font-size: 12px;
  text-align: center;
}

.category-header.medium-high {
  background: #f0f8ff !important;
  color: #1890ff !important;
  font-weight: 600;
  font-size: 12px;
  text-align: center;
}

.category-header.medium {
  background: #fff7e6 !important;
  color: #faad14 !important;
  font-weight: 600;
  font-size: 12px;
  text-align: center;
}

.category-header.medium-low {
  background: #f9f0ff !important;
  color: #722ed1 !important;
  font-weight: 600;
  font-size: 12px;
  text-align: center;
}

.category-header.low-value {
  background: #fff2f0 !important;
  color: #ff4d4f !important;
  font-weight: 600;
  font-size: 12px;
  text-align: center;
}

.sub-header.high-value {
  background: #f6ffed !important;
  color: #52c41a !important;
  font-weight: 600;
  font-size: 12px;
  white-space: nowrap;
}

.sub-header.medium-high {
  background: #f0f8ff !important;
  color: #1890ff !important;
  font-weight: 600;
  font-size: 12px;
  white-space: nowrap;
}

.sub-header.medium {
  background: #fff7e6 !important;
  color: #faad14 !important;
  font-weight: 600;
  font-size: 12px;
  white-space: nowrap;
}

.sub-header.medium-low {
  background: #f9f0ff !important;
  color: #722ed1 !important;
  font-weight: 600;
  font-size: 12px;
  white-space: nowrap;
}

.sub-header.low-value {
  background: #fff2f0 !important;
  color: #ff4d4f !important;
  font-weight: 600;
  font-size: 12px;
  white-space: nowrap;
}

.data-row:hover {
  background: #fafafa;
}

.data-cell.high-value {
  background: #f6ffed !important;
  color: #52c41a !important;
  font-weight: 500;
  text-align: center;
  min-width: 80px;
}

.data-cell.medium-high {
  background: #f0f8ff !important;
  color: #1890ff !important;
  font-weight: 500;
  text-align: center;
  min-width: 80px;
}

.data-cell.medium {
  background: #fff7e6 !important;
  color: #faad14 !important;
  font-weight: 500;
  text-align: center;
  min-width: 80px;
}

.data-cell.medium-low {
  background: #f9f0ff !important;
  color: #722ed1 !important;
  font-weight: 500;
  text-align: center;
  min-width: 80px;
}

.data-cell.low-value {
  background: #fff2f0 !important;
  color: #ff4d4f !important;
  font-weight: 500;
  text-align: center;
  min-width: 80px;
}

.charts-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-top: 24px;
}

.chart-item {
  background: #fafafa;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #e8e8e8;
  text-align: center;
}

.chart-title {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #262626;
}

.chart-container {
  height: 350px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
}

.chart {
  height: 100%;
  width: 100%;
  min-height: 330px;
}
</style>
