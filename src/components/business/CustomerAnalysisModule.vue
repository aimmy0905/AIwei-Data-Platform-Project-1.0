<template>
  <div class="customer-analysis-module">
    <div class="analysis-module__header">
      <h3 class="analysis-module__title">{{ title }}</h3>
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

    <div class="analysis-module__content">
      <!-- 数据概览表格 -->
      <div class="overview-table-container">
        <table class="overview-table" v-if="customerData">
          <thead>
            <tr>
              <th rowspan="2" class="year-header">年度</th>
              <th rowspan="2" class="quarter-header">季度</th>
              <th colspan="4" class="category-header all-customers">所有客户数据 (包括存量客户和新客户)</th>
              <th colspan="4" class="category-header new-customers">2025新客户 (新客户)</th>
              <th colspan="4" class="category-header added-customers">2025年新增客户</th>
              <th colspan="4" class="category-header churned-customers">2025年流失客户</th>
            </tr>
            <tr>
              <!-- 所有客户数据 -->
              <th class="metric-header all-customers">活跃客户数</th>
              <th class="metric-header all-customers">总毛利</th>
              <th class="metric-header all-customers">服务费</th>
              <th class="metric-header all-customers">返点</th>
              <!-- 2025新客户 -->
              <th class="metric-header new-customers">活跃客户数</th>
              <th class="metric-header new-customers">总毛利</th>
              <th class="metric-header new-customers">服务费</th>
              <th class="metric-header new-customers">返点</th>
              <!-- 2025年新增客户 -->
              <th class="metric-header added-customers">活跃客户数</th>
              <th class="metric-header added-customers">总毛利</th>
              <th class="metric-header added-customers">服务费</th>
              <th class="metric-header added-customers">返点</th>
              <!-- 2025年流失客户 -->
              <th class="metric-header churned-customers">客户数</th>
              <th class="metric-header churned-customers">预估流失毛利贡献</th>
              <th class="metric-header churned-customers">预估流失服务费</th>
              <th class="metric-header churned-customers">预估流失返点</th>
            </tr>
          </thead>
          <tbody v-if="showDepartments && departmentData">
            <tr v-for="(dept, index) in departmentData" :key="dept.departmentId">
              <td v-if="index === 0" :rowspan="departmentData.length" class="year-cell">运营</td>
              <td class="quarter-cell">{{ dept.departmentName }}</td>
              <!-- 所有客户数据 -->
              <td class="data-cell all-customers">{{ dept.customerData.allCustomers.activeCustomerCount }}家</td>
              <td class="data-cell all-customers">{{ formatCurrency(dept.customerData.allCustomers.totalProfit) }}</td>
              <td class="data-cell all-customers">{{ formatCurrency(dept.customerData.allCustomers.serviceFee) }}</td>
              <td class="data-cell all-customers">{{ formatCurrency(dept.customerData.allCustomers.rebate) }}</td>
              <!-- 新客户数据 -->
              <td class="data-cell new-customers">{{ dept.customerData.newCustomers.activeCustomerCount }}家</td>
              <td class="data-cell new-customers">{{ formatCurrency(dept.customerData.newCustomers.totalProfit) }}</td>
              <td class="data-cell new-customers">{{ formatCurrency(dept.customerData.newCustomers.serviceFee) }}</td>
              <td class="data-cell new-customers">{{ formatCurrency(dept.customerData.newCustomers.rebate) }}</td>
              <!-- 年新增客户 -->
              <td class="data-cell added-customers">{{ dept.customerData.newCustomers.activeCustomerCount }}家</td>
              <td class="data-cell added-customers">{{ formatCurrency(dept.customerData.newCustomers.totalProfit) }}</td>
              <td class="data-cell added-customers">{{ formatCurrency(dept.customerData.newCustomers.serviceFee) }}</td>
              <td class="data-cell added-customers">{{ formatCurrency(dept.customerData.newCustomers.rebate) }}</td>
              <!-- 流失客户 -->
              <td class="data-cell churned-customers">{{ dept.customerData.churnedCustomers.customerCount }}家</td>
              <td class="data-cell churned-customers negative">-{{ formatCurrency(dept.customerData.churnedCustomers.estimatedProfitLoss) }}</td>
              <td class="data-cell churned-customers negative">-{{ formatCurrency(dept.customerData.churnedCustomers.estimatedServiceFeeLoss) }}</td>
              <td class="data-cell churned-customers negative">-{{ formatCurrency(dept.customerData.churnedCustomers.estimatedRebateLoss) }}</td>
            </tr>
            <!-- 运营总计行 -->
            <tr class="yearly-summary-row">
              <td class="year-cell yearly-total"></td>
              <td class="quarter-cell yearly-total">运营总计</td>
              <!-- 所有客户数据总计 -->
              <td class="data-cell all-customers yearly-total">{{ getTotalActiveCustomers('all') }}家</td>
              <td class="data-cell all-customers yearly-total">{{ formatCurrency(getTotalProfit('all')) }}</td>
              <td class="data-cell all-customers yearly-total">{{ formatCurrency(getTotalServiceFee('all')) }}</td>
              <td class="data-cell all-customers yearly-total">{{ formatCurrency(getTotalRebate('all')) }}</td>
              <!-- 新客户数据总计 -->
              <td class="data-cell new-customers yearly-total">{{ getTotalActiveCustomers('new') }}家</td>
              <td class="data-cell new-customers yearly-total">{{ formatCurrency(getTotalProfit('new')) }}</td>
              <td class="data-cell new-customers yearly-total">{{ formatCurrency(getTotalServiceFee('new')) }}</td>
              <td class="data-cell new-customers yearly-total">{{ formatCurrency(getTotalRebate('new')) }}</td>
              <!-- 年新增客户总计 -->
              <td class="data-cell added-customers yearly-total">{{ getTotalActiveCustomers('new') }}家</td>
              <td class="data-cell added-customers yearly-total">{{ formatCurrency(getTotalProfit('new')) }}</td>
              <td class="data-cell added-customers yearly-total">{{ formatCurrency(getTotalServiceFee('new')) }}</td>
              <td class="data-cell added-customers yearly-total">{{ formatCurrency(getTotalRebate('new')) }}</td>
              <!-- 流失客户总计 -->
              <td class="data-cell churned-customers yearly-total">{{ getTotalChurnedCustomers() }}家</td>
              <td class="data-cell churned-customers yearly-total negative">-{{ formatCurrency(getTotalChurnedProfit()) }}</td>
              <td class="data-cell churned-customers yearly-total negative">-{{ formatCurrency(getTotalChurnedServiceFee()) }}</td>
              <td class="data-cell churned-customers yearly-total negative">-{{ formatCurrency(getTotalChurnedRebate()) }}</td>
            </tr>
          </tbody>
          <tbody v-else-if="customerData">
            <tr>
              <td rowspan="4" class="year-cell">2025年</td>
              <td class="quarter-cell">Q1季度</td>
              <!-- 所有客户数据 -->
              <td class="data-cell all-customers">{{ customerData.allCustomers.activeCustomerCount }}家</td>
              <td class="data-cell all-customers">{{ formatCurrency(customerData.allCustomers.totalProfit) }}</td>
              <td class="data-cell all-customers">{{ formatCurrency(customerData.allCustomers.serviceFee) }}</td>
              <td class="data-cell all-customers">{{ formatCurrency(customerData.allCustomers.rebate) }}</td>
              <!-- 新客户数据 -->
              <td class="data-cell new-customers">{{ customerData.newCustomers.activeCustomerCount }}家</td>
              <td class="data-cell new-customers">{{ formatCurrency(customerData.newCustomers.totalProfit) }}</td>
              <td class="data-cell new-customers">{{ formatCurrency(customerData.newCustomers.serviceFee) }}</td>
              <td class="data-cell new-customers">{{ formatCurrency(customerData.newCustomers.rebate) }}</td>
              <!-- 年新增客户 -->
              <td class="data-cell added-customers">{{ customerData.newCustomers.activeCustomerCount }}家</td>
              <td class="data-cell added-customers">{{ formatCurrency(customerData.newCustomers.totalProfit) }}</td>
              <td class="data-cell added-customers">{{ formatCurrency(customerData.newCustomers.serviceFee) }}</td>
              <td class="data-cell added-customers">{{ formatCurrency(customerData.newCustomers.rebate) }}</td>
              <!-- 流失客户 -->
              <td class="data-cell churned-customers">{{ customerData.churnedCustomers.customerCount }}家</td>
              <td class="data-cell churned-customers negative">-{{ formatCurrency(customerData.churnedCustomers.estimatedProfitLoss) }}</td>
              <td class="data-cell churned-customers negative">-{{ formatCurrency(customerData.churnedCustomers.estimatedServiceFeeLoss) }}</td>
              <td class="data-cell churned-customers negative">-{{ formatCurrency(customerData.churnedCustomers.estimatedRebateLoss) }}</td>
            </tr>
            <tr>
              <td class="quarter-cell">Q2季度</td>
              <!-- 所有客户数据 -->
              <td class="data-cell all-customers">{{ Math.round(customerData.allCustomers.activeCustomerCount * 1.05) }}家</td>
              <td class="data-cell all-customers">{{ formatCurrency(customerData.allCustomers.totalProfit * 1.08) }}</td>
              <td class="data-cell all-customers">{{ formatCurrency(customerData.allCustomers.serviceFee * 1.06) }}</td>
              <td class="data-cell all-customers">{{ formatCurrency(customerData.allCustomers.rebate * 1.04) }}</td>
              <!-- 新客户数据 -->
              <td class="data-cell new-customers">{{ Math.round(customerData.newCustomers.activeCustomerCount * 1.15) }}家</td>
              <td class="data-cell new-customers">{{ formatCurrency(customerData.newCustomers.totalProfit * 1.20) }}</td>
              <td class="data-cell new-customers">{{ formatCurrency(customerData.newCustomers.serviceFee * 1.18) }}</td>
              <td class="data-cell new-customers">{{ formatCurrency(customerData.newCustomers.rebate * 1.12) }}</td>
              <!-- 年新增客户 -->
              <td class="data-cell added-customers">{{ Math.round(customerData.newCustomers.activeCustomerCount * 1.25) }}家</td>
              <td class="data-cell added-customers">{{ formatCurrency(customerData.newCustomers.totalProfit * 1.30) }}</td>
              <td class="data-cell added-customers">{{ formatCurrency(customerData.newCustomers.serviceFee * 1.28) }}</td>
              <td class="data-cell added-customers">{{ formatCurrency(customerData.newCustomers.rebate * 1.22) }}</td>
              <!-- 流失客户 -->
              <td class="data-cell churned-customers">{{ Math.round(customerData.churnedCustomers.customerCount * 0.8) }}家</td>
              <td class="data-cell churned-customers negative">-{{ formatCurrency(customerData.churnedCustomers.estimatedProfitLoss * 0.9) }}</td>
              <td class="data-cell churned-customers negative">-{{ formatCurrency(customerData.churnedCustomers.estimatedServiceFeeLoss * 0.85) }}</td>
              <td class="data-cell churned-customers negative">-{{ formatCurrency(customerData.churnedCustomers.estimatedRebateLoss * 0.88) }}</td>
            </tr>
            <tr>
              <td class="quarter-cell">Q3季度</td>
              <!-- 所有客户数据 -->
              <td class="data-cell all-customers">{{ Math.round(customerData.allCustomers.activeCustomerCount * 1.12) }}家</td>
              <td class="data-cell all-customers">{{ formatCurrency(customerData.allCustomers.totalProfit * 1.15) }}</td>
              <td class="data-cell all-customers">{{ formatCurrency(customerData.allCustomers.serviceFee * 1.13) }}</td>
              <td class="data-cell all-customers">{{ formatCurrency(customerData.allCustomers.rebate * 1.10) }}</td>
              <!-- 新客户数据 -->
              <td class="data-cell new-customers">{{ Math.round(customerData.newCustomers.activeCustomerCount * 1.35) }}家</td>
              <td class="data-cell new-customers">{{ formatCurrency(customerData.newCustomers.totalProfit * 1.45) }}</td>
              <td class="data-cell new-customers">{{ formatCurrency(customerData.newCustomers.serviceFee * 1.41) }}</td>
              <td class="data-cell new-customers">{{ formatCurrency(customerData.newCustomers.rebate * 1.36) }}</td>
              <!-- 年新增客户 -->
              <td class="data-cell added-customers">{{ Math.round(customerData.newCustomers.activeCustomerCount * 1.55) }}家</td>
              <td class="data-cell added-customers">{{ formatCurrency(customerData.newCustomers.totalProfit * 1.65) }}</td>
              <td class="data-cell added-customers">{{ formatCurrency(customerData.newCustomers.serviceFee * 1.59) }}</td>
              <td class="data-cell added-customers">{{ formatCurrency(customerData.newCustomers.rebate * 1.52) }}</td>
              <!-- 流失客户 -->
              <td class="data-cell churned-customers">{{ Math.round(customerData.churnedCustomers.customerCount * 0.65) }}家</td>
              <td class="data-cell churned-customers negative">-{{ formatCurrency(customerData.churnedCustomers.estimatedProfitLoss * 0.75) }}</td>
              <td class="data-cell churned-customers negative">-{{ formatCurrency(customerData.churnedCustomers.estimatedServiceFeeLoss * 0.70) }}</td>
              <td class="data-cell churned-customers negative">-{{ formatCurrency(customerData.churnedCustomers.estimatedRebateLoss * 0.72) }}</td>
            </tr>
            <tr>
              <td class="quarter-cell">Q4季度</td>
              <!-- 所有客户数据 -->
              <td class="data-cell all-customers">{{ Math.round(customerData.allCustomers.activeCustomerCount * 1.18) }}家</td>
              <td class="data-cell all-customers">{{ formatCurrency(customerData.allCustomers.totalProfit * 1.22) }}</td>
              <td class="data-cell all-customers">{{ formatCurrency(customerData.allCustomers.serviceFee * 1.20) }}</td>
              <td class="data-cell all-customers">{{ formatCurrency(customerData.allCustomers.rebate * 1.16) }}</td>
              <!-- 新客户数据 -->
              <td class="data-cell new-customers">{{ Math.round(customerData.newCustomers.activeCustomerCount * 1.50) }}家</td>
              <td class="data-cell new-customers">{{ formatCurrency(customerData.newCustomers.totalProfit * 1.65) }}</td>
              <td class="data-cell new-customers">{{ formatCurrency(customerData.newCustomers.serviceFee * 1.58) }}</td>
              <td class="data-cell new-customers">{{ formatCurrency(customerData.newCustomers.rebate * 1.48) }}</td>
              <!-- 年新增客户 -->
              <td class="data-cell added-customers">{{ Math.round(customerData.newCustomers.activeCustomerCount * 1.75) }}家</td>
              <td class="data-cell added-customers">{{ formatCurrency(customerData.newCustomers.totalProfit * 1.90) }}</td>
              <td class="data-cell added-customers">{{ formatCurrency(customerData.newCustomers.serviceFee * 1.84) }}</td>
              <td class="data-cell added-customers">{{ formatCurrency(customerData.newCustomers.rebate * 1.76) }}</td>
              <!-- 流失客户 -->
              <td class="data-cell churned-customers">{{ Math.round(customerData.churnedCustomers.customerCount * 0.50) }}家</td>
              <td class="data-cell churned-customers negative">-{{ formatCurrency(customerData.churnedCustomers.estimatedProfitLoss * 0.60) }}</td>
              <td class="data-cell churned-customers negative">-{{ formatCurrency(customerData.churnedCustomers.estimatedServiceFeeLoss * 0.55) }}</td>
              <td class="data-cell churned-customers negative">-{{ formatCurrency(customerData.churnedCustomers.estimatedRebateLoss * 0.58) }}</td>
            </tr>
            <!-- 年度总计行 -->
            <tr class="yearly-summary-row">
              <td class="year-cell yearly-total"></td>
              <td class="quarter-cell yearly-total">2025年度总计</td>
              <!-- 所有客户数据总计 -->
              <td class="data-cell all-customers yearly-total">{{ Math.round(customerData.allCustomers.activeCustomerCount * 4.35) }}家</td>
              <td class="data-cell all-customers yearly-total">{{ formatCurrency(customerData.allCustomers.totalProfit * 4.45) }}</td>
              <td class="data-cell all-customers yearly-total">{{ formatCurrency(customerData.allCustomers.serviceFee * 4.39) }}</td>
              <td class="data-cell all-customers yearly-total">{{ formatCurrency(customerData.allCustomers.rebate * 4.28) }}</td>
              <!-- 新客户数据总计 -->
              <td class="data-cell new-customers yearly-total">{{ Math.round(customerData.newCustomers.activeCustomerCount * 5.05) }}家</td>
              <td class="data-cell new-customers yearly-total">{{ formatCurrency(customerData.newCustomers.totalProfit * 5.30) }}</td>
              <td class="data-cell new-customers yearly-total">{{ formatCurrency(customerData.newCustomers.serviceFee * 5.14) }}</td>
              <td class="data-cell new-customers yearly-total">{{ formatCurrency(customerData.newCustomers.rebate * 4.96) }}</td>
              <!-- 年新增客户总计 -->
              <td class="data-cell added-customers yearly-total">{{ Math.round(customerData.newCustomers.activeCustomerCount * 5.75) }}家</td>
              <td class="data-cell added-customers yearly-total">{{ formatCurrency(customerData.newCustomers.totalProfit * 6.10) }}</td>
              <td class="data-cell added-customers yearly-total">{{ formatCurrency(customerData.newCustomers.serviceFee * 5.91) }}</td>
              <td class="data-cell added-customers yearly-total">{{ formatCurrency(customerData.newCustomers.rebate * 5.60) }}</td>
              <!-- 流失客户总计 -->
              <td class="data-cell churned-customers yearly-total">{{ Math.round(customerData.churnedCustomers.customerCount * 2.9) }}家</td>
              <td class="data-cell churned-customers yearly-total negative">-{{ formatCurrency(customerData.churnedCustomers.estimatedProfitLoss * 3.15) }}</td>
              <td class="data-cell churned-customers yearly-total negative">-{{ formatCurrency(customerData.churnedCustomers.estimatedServiceFeeLoss * 3.05) }}</td>
              <td class="data-cell churned-customers yearly-total negative">-{{ formatCurrency(customerData.churnedCustomers.estimatedRebateLoss * 3.08) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 占比分析图表 -->
      <div class="proportion-charts-section">
        <div class="chart-container">
          <div class="chart-header">
            <h4 class="chart-title">{{ getChartTitle() }}</h4>
            <div class="chart-toggle">
              <button
                v-for="view in viewTypes"
                :key="view.value"
                class="toggle-btn"
                :class="{ 'toggle-btn--active': currentView === view.value }"
                @click="currentView = view.value"
              >
                {{ view.label }}
              </button>
            </div>
          </div>
          <div class="chart-content">
            <PieChart
              :data="proportionChartData"
              :height="'320px'"
              :donut="true"
              :show-legend="true"
              @click="handleChartClick"
            />
          </div>
        </div>

        <!-- 趋势分析图表 -->
        <div class="chart-container">
          <div class="chart-header">
            <h4 class="chart-title">客户价值贡献对比</h4>
          </div>
          <div class="chart-content">
            <BarChart
              :data="customerValueComparisonData"
              :height="'320px'"
              :show-legend="true"
              :stack="true"
              @click="handleChartClick"
            />
          </div>
        </div>
      </div>


    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Users, UserCheck, UserPlus, UserX, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import PieChart from '@/components/charts/PieChart.vue'
import BarChart from '@/components/charts/BarChart.vue'
import type { CustomerAnalysisData, DepartmentCustomerAnalysis } from '@/types'

interface Props {
  customerData?: CustomerAnalysisData | null
  departmentData?: DepartmentCustomerAnalysis[]
  title: string
  loading?: boolean
  showDepartments?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<{
  'view-change': [view: string]
  'chart-click': [data: any]
  'time-range-change': [timeRange: string]
  'quarter-change': [quarter: string]
}>()

// 时间选择器状态
const currentTimeRange = ref('quarter')
const currentQuarter = ref('2025年Q1')

const timeRanges = [
  { key: 'year', label: '年' },
  { key: 'quarter', label: '季' },
  { key: 'month', label: '月' }
]

const isNextDisabled = computed(() => {
  return currentQuarter.value.includes('Q4')
})

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

const currentView = ref<'customerCount' | 'profit' | 'serviceFee' | 'rebate'>('customerCount')

const viewTypes = [
  { value: 'customerCount' as const, label: '客户数占比' },
  { value: 'profit' as const, label: '毛利占比' },
  { value: 'serviceFee' as const, label: '服务费占比' },
  { value: 'rebate' as const, label: '返点占比' }
]

// 占比图表数据
const proportionChartData = computed(() => {
  if (!props.customerData) return []

  const data = props.customerData
  let chartData = []

  switch (currentView.value) {
    case 'customerCount':
      chartData = [
        { name: '老客户', value: data.oldCustomers.activeCustomerCount, color: '#1890ff' },
        { name: '新客户', value: data.newCustomers.activeCustomerCount, color: '#52c41a' },
        { name: '流失客户', value: data.churnedCustomers.customerCount, color: '#ff4d4f' }
      ]
      break
    case 'profit':
      chartData = [
        { name: '老客户', value: data.oldCustomers.totalProfit, color: '#1890ff' },
        { name: '新客户', value: data.newCustomers.totalProfit, color: '#52c41a' }
      ]
      break
    case 'serviceFee':
      chartData = [
        { name: '老客户', value: data.oldCustomers.serviceFee, color: '#1890ff' },
        { name: '新客户', value: data.newCustomers.serviceFee, color: '#52c41a' }
      ]
      break
    case 'rebate':
      chartData = [
        { name: '老客户', value: data.oldCustomers.rebate, color: '#1890ff' },
        { name: '新客户', value: data.newCustomers.rebate, color: '#52c41a' }
      ]
      break
  }

  return chartData.filter(item => item.value > 0)
})

// 客户价值对比数据
const customerValueComparisonData = computed(() => {
  if (!props.customerData) return { labels: [], datasets: [] }

  const data = props.customerData

  return {
    labels: ['老客户', '新客户'],
    datasets: [
      {
        label: '毛利 (万)',
        data: [data.oldCustomers.totalProfit / 10000, data.newCustomers.totalProfit / 10000],
        color: '#1890ff'
      },
      {
        label: '服务费 (万)',
        data: [data.oldCustomers.serviceFee / 10000, data.newCustomers.serviceFee / 10000],
        color: '#52c41a'
      },
      {
        label: '返点 (万)',
        data: [data.oldCustomers.rebate / 10000, data.newCustomers.rebate / 10000],
        color: '#fa8c16'
      }
    ]
  }
})

// 方法
const handleChartClick = (params: any) => {
  emit('chart-click', params)
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

const getChartTitle = () => {
  const titles = {
    customerCount: '客户数量占比',
    profit: '毛利贡献占比',
    serviceFee: '服务费占比',
    rebate: '返点占比'
  }
  return titles[currentView.value] || '占比分析'
}

const getNewCustomerGrowthRate = () => {
  if (!props.customerData) return 0
  const total = props.customerData.allCustomers.activeCustomerCount
  const newCustomers = props.customerData.newCustomers.activeCustomerCount
  return total > 0 ? ((newCustomers / total) * 100).toFixed(1) : '0'
}

const getChurnRate = () => {
  if (!props.customerData) return 0
  const total = props.customerData.allCustomers.activeCustomerCount + props.customerData.churnedCustomers.customerCount
  const churned = props.customerData.churnedCustomers.customerCount
  return total > 0 ? ((churned / total) * 100).toFixed(1) : '0'
}

const getNetGrowth = () => {
  if (!props.customerData) return 0
  return props.customerData.newCustomers.activeCustomerCount - props.customerData.churnedCustomers.customerCount
}

const getNetGrowthRate = () => {
  if (!props.customerData) return 0
  const netGrowth = getNetGrowth()
  const total = props.customerData.allCustomers.activeCustomerCount
  return total > 0 ? ((netGrowth / total) * 100).toFixed(1) : '0'
}

const getNetGrowthClass = () => {
  const netGrowth = getNetGrowth()
  return netGrowth > 0 ? 'positive' : netGrowth < 0 ? 'negative' : ''
}

const getAverageCustomerValue = () => {
  if (!props.customerData) return 0
  const { totalProfit, activeCustomerCount } = props.customerData.allCustomers
  return activeCustomerCount > 0 ? totalProfit / activeCustomerCount : 0
}

const getNewCustomerAverageValue = () => {
  if (!props.customerData) return 0
  const { totalProfit, activeCustomerCount } = props.customerData.newCustomers
  return activeCustomerCount > 0 ? totalProfit / activeCustomerCount : 0
}

const getOldCustomerAverageValue = () => {
  if (!props.customerData) return 0
  const { totalProfit, activeCustomerCount } = props.customerData.oldCustomers
  return activeCustomerCount > 0 ? totalProfit / activeCustomerCount : 0
}

const getRetentionRate = () => {
  if (!props.customerData) return 0
  const oldCustomers = props.customerData.oldCustomers.activeCustomerCount
  const churned = props.customerData.churnedCustomers.customerCount
  const total = oldCustomers + churned
  return total > 0 ? ((oldCustomers / total) * 100).toFixed(1) : '0'
}

// 部门数据总计计算方法
const getTotalActiveCustomers = (type: 'all' | 'new') => {
  if (!props.departmentData) return 0
  return props.departmentData.reduce((total, dept) => {
    if (type === 'all') {
      return total + dept.customerData.allCustomers.activeCustomerCount
    } else {
      return total + dept.customerData.newCustomers.activeCustomerCount
    }
  }, 0)
}

const getTotalProfit = (type: 'all' | 'new') => {
  if (!props.departmentData) return 0
  return props.departmentData.reduce((total, dept) => {
    if (type === 'all') {
      return total + dept.customerData.allCustomers.totalProfit
    } else {
      return total + dept.customerData.newCustomers.totalProfit
    }
  }, 0)
}

const getTotalServiceFee = (type: 'all' | 'new') => {
  if (!props.departmentData) return 0
  return props.departmentData.reduce((total, dept) => {
    if (type === 'all') {
      return total + dept.customerData.allCustomers.serviceFee
    } else {
      return total + dept.customerData.newCustomers.serviceFee
    }
  }, 0)
}

const getTotalRebate = (type: 'all' | 'new') => {
  if (!props.departmentData) return 0
  return props.departmentData.reduce((total, dept) => {
    if (type === 'all') {
      return total + dept.customerData.allCustomers.rebate
    } else {
      return total + dept.customerData.newCustomers.rebate
    }
  }, 0)
}

const getTotalChurnedCustomers = () => {
  if (!props.departmentData) return 0
  return props.departmentData.reduce((total, dept) => {
    return total + dept.customerData.churnedCustomers.customerCount
  }, 0)
}

const getTotalChurnedProfit = () => {
  if (!props.departmentData) return 0
  return props.departmentData.reduce((total, dept) => {
    return total + dept.customerData.churnedCustomers.estimatedProfitLoss
  }, 0)
}

const getTotalChurnedServiceFee = () => {
  if (!props.departmentData) return 0
  return props.departmentData.reduce((total, dept) => {
    return total + dept.customerData.churnedCustomers.estimatedServiceFeeLoss
  }, 0)
}

const getTotalChurnedRebate = () => {
  if (!props.departmentData) return 0
  return props.departmentData.reduce((total, dept) => {
    return total + dept.customerData.churnedCustomers.estimatedRebateLoss
  }, 0)
}

// 监听视图变化
import { watch } from 'vue'
watch(currentView, (view) => {
  emit('view-change', view)
})
</script>

<style scoped>
.customer-analysis-module {
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
  padding: 6px 12px;
  border: 1px solid #d9d9d9;
  background: #fafafa;
  color: #262626;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  min-width: 100px;
  text-align: center;
}



.analysis-module__content {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* 概览表格 - 匹配部门目标表格样式 */
.overview-table-container {
  overflow-x: auto;
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
}

.overview-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  min-width: 1200px;
}

.overview-table th {
  background: #fafafa;
  border: 1px solid #f0f0f0;
  padding: 12px 8px;
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: #595959;
}

.overview-table td {
  border: 1px solid #f0f0f0;
  padding: 12px 8px;
  text-align: center;
  font-size: 13px;
  vertical-align: middle;
}

/* 表头样式 - 匹配部门表格 */
.year-header,
.quarter-header {
  background: #f0f2f5 !important;
  color: #262626 !important;
  font-weight: 600;
}

.summary-header {
  background: #f9f0ff !important;
  color: #722ed1 !important;
  font-weight: 600;
}

/* 不同数据类型的表头颜色 - 匹配部门表格样式 */
.category-header.all-customers,
.metric-header.all-customers {
  background: #e6f7ff !important;
  color: #1890ff !important;
  font-weight: 600;
}

.category-header.new-customers,
.metric-header.new-customers {
  background: #f6ffed !important;
  color: #52c41a !important;
  font-weight: 600;
}

.category-header.added-customers,
.metric-header.added-customers {
  background: #fff7e6 !important;
  color: #faad14 !important;
  font-weight: 600;
}

.category-header.churned-customers,
.metric-header.churned-customers {
  background: #fff2f0 !important;
  color: #ff4d4f !important;
  font-weight: 600;
}

.metric-header {
  min-width: 80px;
}

/* 表格数据单元格 - 匹配部门表格 */
.year-cell {
  background: #f0f2f5 !important;
  color: #262626 !important;
  font-weight: 600;
  text-align: center !important;
}

.quarter-cell {
  background: #f0f2f5 !important;
  color: #262626 !important;
  font-weight: 500;
}

/* 不同数据类型的数据单元格颜色 */
.data-cell.all-customers {
  background: #f0f8ff !important;
  color: #1890ff !important;
  font-weight: 500;
  min-width: 80px;
}

.data-cell.new-customers {
  background: #f6ffed !important;
  color: #52c41a !important;
  font-weight: 500;
  min-width: 80px;
}

.data-cell.added-customers {
  background: #fffbf0 !important;
  color: #faad14 !important;
  font-weight: 500;
  min-width: 80px;
}

.data-cell.churned-customers {
  background: #fff2f0 !important;
  color: #ff4d4f !important;
  font-weight: 500;
  min-width: 80px;
}

.data-cell {
  background: #f0f8ff !important;
  color: #1890ff !important;
  font-weight: 500;
  min-width: 80px;
}

.data-cell.empty {
  background: #fafafa !important;
  color: #bfbfbf !important;
}

.data-cell.negative {
  color: #ff4d4f !important;
  font-weight: 600;
}

.data-cell.positive {
  color: #52c41a !important;
  font-weight: 600;
}

/* 年度总计行样式 */
.yearly-summary-row {
  background: #f9f9f9 !important;
  font-weight: 600;
  border-top: 2px solid #d9d9d9 !important;
}

.yearly-summary-row .year-cell.yearly-total {
  background: #f9f9f9 !important;
  border-right: 1px solid #d9d9d9 !important;
}

.yearly-summary-row .quarter-cell.yearly-total {
  background: #e6f7ff !important;
  color: #1890ff !important;
  font-weight: 700;
  text-align: center !important;
  font-size: 14px;
}

.yearly-summary-row .data-cell.yearly-total {
  font-weight: 600;
  font-size: 13px;
}

.yearly-summary-row .data-cell.all-customers.yearly-total {
  background: #e6f7ff !important;
  color: #1890ff !important;
}

.yearly-summary-row .data-cell.new-customers.yearly-total {
  background: #f6ffed !important;
  color: #52c41a !important;
}

.yearly-summary-row .data-cell.added-customers.yearly-total {
  background: #fff7e6 !important;
  color: #faad14 !important;
}

.yearly-summary-row .data-cell.churned-customers.yearly-total {
  background: #fff2f0 !important;
  color: #ff4d4f !important;
}

/* 表格悬停效果 - 匹配部门表格 */
.overview-table tbody tr:hover {
  background: #f0f8ff !important;
}

.overview-table tbody tr:hover .data-cell {
  background: #f0f8ff !important;
}

.overview-table tbody tr:hover .quarter-cell,
.overview-table tbody tr:hover .year-cell {
  background: #e6f7ff !important;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .overview-table {
    min-width: 1000px;
    font-size: 11px;
  }

  .overview-table th,
  .overview-table td {
    padding: 6px 8px;
  }
}

@media (max-width: 768px) {
  .overview-table {
    min-width: 800px;
    font-size: 10px;
  }

  .overview-table th,
  .overview-table td {
    padding: 4px 6px;
  }
}

/* 图表区域 */
.proportion-charts-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
}

.chart-container {
  background: #fafafa;
  border-radius: 8px;
  padding: 20px;
}

.chart-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #262626;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
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

.chart-content {
  background: #fff;
  border-radius: 6px;
  padding: 16px;
}



@media (max-width: 768px) {
  .customer-analysis-module {
    padding: 16px;
  }

  .analysis-module__header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .overview-table-container {
    margin: 0 -16px;
  }

  .proportion-charts-section {
    grid-template-columns: 1fr;
  }
}
</style>
