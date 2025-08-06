<template>
  <div class="customer-analysis-module">
    <div class="analysis-module__header">
      <h3 class="analysis-module__title">{{ title }}</h3>
      <div class="analysis-module__controls">
        <div class="view-toggle">
          <button
            v-for="view in viewTypes"
            :key="view.value"
            class="view-toggle__btn"
            :class="{ 'view-toggle__btn--active': currentView === view.value }"
            @click="currentView = view.value"
          >
            {{ view.label }}
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
              <th rowspan="2" class="summary-header">客户数</th>
              <th rowspan="2" class="summary-header">预估流失毛利贡献</th>
              <th rowspan="2" class="summary-header">预估流失返点</th>
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
              <th class="metric-header churned-customers">活跃客户数</th>
              <th class="metric-header churned-customers">总毛利</th>
              <th class="metric-header churned-customers">服务费</th>
              <th class="metric-header churned-customers">返点</th>
            </tr>
          </thead>
          <tbody>
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
              <!-- 汇总 -->
              <td class="data-cell">{{ customerData.allCustomers.activeCustomerCount }}家</td>
              <td class="data-cell negative">-{{ formatCurrency(customerData.churnedCustomers.estimatedProfitLoss) }}</td>
              <td class="data-cell negative">-{{ formatCurrency(customerData.churnedCustomers.estimatedRebateLoss) }}</td>
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
              <!-- 汇总 -->
              <td class="data-cell">{{ Math.round(customerData.allCustomers.activeCustomerCount * 1.05) }}家</td>
              <td class="data-cell negative">-{{ formatCurrency(customerData.churnedCustomers.estimatedProfitLoss * 0.9) }}</td>
              <td class="data-cell negative">-{{ formatCurrency(customerData.churnedCustomers.estimatedRebateLoss * 0.88) }}</td>
            </tr>
            <tr>
              <td class="quarter-cell">Q3季度</td>
              <!-- 所有客户数据 -->
              <td class="data-cell all-customers">{{ Math.round(customerData.allCustomers.activeCustomerCount * 1.12) }}家</td>
              <td class="data-cell all-customers">{{ formatCurrency(customerData.allCustomers.totalProfit * 1.15) }}</td>
              <td class="data-cell all-customers">{{ formatCurrency(customerData.allCustomers.serviceFee * 1.13) }}</td>
              <td class="data-cell all-customers">{{ formatCurrency(customerData.allCustomers.rebate * 1.09) }}</td>
              <!-- 新客户数据 -->
              <td class="data-cell new-customers">{{ Math.round(customerData.newCustomers.activeCustomerCount * 1.35) }}家</td>
              <td class="data-cell new-customers">{{ formatCurrency(customerData.newCustomers.totalProfit * 1.45) }}</td>
              <td class="data-cell new-customers">{{ formatCurrency(customerData.newCustomers.serviceFee * 1.38) }}</td>
              <td class="data-cell new-customers">{{ formatCurrency(customerData.newCustomers.rebate * 1.32) }}</td>
              <!-- 年新增客户 -->
              <td class="data-cell added-customers">{{ Math.round(customerData.newCustomers.activeCustomerCount * 1.50) }}家</td>
              <td class="data-cell added-customers">{{ formatCurrency(customerData.newCustomers.totalProfit * 1.60) }}</td>
              <td class="data-cell added-customers">{{ formatCurrency(customerData.newCustomers.serviceFee * 1.55) }}</td>
              <td class="data-cell added-customers">{{ formatCurrency(customerData.newCustomers.rebate * 1.48) }}</td>
              <!-- 流失客户 -->
              <td class="data-cell churned-customers">{{ Math.round(customerData.churnedCustomers.customerCount * 0.6) }}家</td>
              <td class="data-cell churned-customers negative">-{{ formatCurrency(customerData.churnedCustomers.estimatedProfitLoss * 0.75) }}</td>
              <td class="data-cell churned-customers negative">-{{ formatCurrency(customerData.churnedCustomers.estimatedServiceFeeLoss * 0.70) }}</td>
              <td class="data-cell churned-customers negative">-{{ formatCurrency(customerData.churnedCustomers.estimatedRebateLoss * 0.72) }}</td>
              <!-- 汇总 -->
              <td class="data-cell">{{ Math.round(customerData.allCustomers.activeCustomerCount * 1.12) }}家</td>
              <td class="data-cell negative">-{{ formatCurrency(customerData.churnedCustomers.estimatedProfitLoss * 0.75) }}</td>
              <td class="data-cell negative">-{{ formatCurrency(customerData.churnedCustomers.estimatedRebateLoss * 0.72) }}</td>
            </tr>
            <tr>
              <td class="quarter-cell">Q4季度</td>
              <!-- 所有客户数据 -->
              <td class="data-cell all-customers">{{ Math.round(customerData.allCustomers.activeCustomerCount * 1.18) }}家</td>
              <td class="data-cell all-customers">{{ formatCurrency(customerData.allCustomers.totalProfit * 1.22) }}</td>
              <td class="data-cell all-customers">{{ formatCurrency(customerData.allCustomers.serviceFee * 1.20) }}</td>
              <td class="data-cell all-customers">{{ formatCurrency(customerData.allCustomers.rebate * 1.15) }}</td>
              <!-- 新客户数据 -->
              <td class="data-cell new-customers">{{ Math.round(customerData.newCustomers.activeCustomerCount * 1.55) }}家</td>
              <td class="data-cell new-customers">{{ formatCurrency(customerData.newCustomers.totalProfit * 1.65) }}</td>
              <td class="data-cell new-customers">{{ formatCurrency(customerData.newCustomers.serviceFee * 1.58) }}</td>
              <td class="data-cell new-customers">{{ formatCurrency(customerData.newCustomers.rebate * 1.52) }}</td>
              <!-- 年新增客户 -->
              <td class="data-cell added-customers">{{ Math.round(customerData.newCustomers.activeCustomerCount * 1.75) }}家</td>
              <td class="data-cell added-customers">{{ formatCurrency(customerData.newCustomers.totalProfit * 1.85) }}</td>
              <td class="data-cell added-customers">{{ formatCurrency(customerData.newCustomers.serviceFee * 1.78) }}</td>
              <td class="data-cell added-customers">{{ formatCurrency(customerData.newCustomers.rebate * 1.68) }}</td>
              <!-- 流失客户 -->
              <td class="data-cell churned-customers">{{ Math.round(customerData.churnedCustomers.customerCount * 0.5) }}家</td>
              <td class="data-cell churned-customers negative">-{{ formatCurrency(customerData.churnedCustomers.estimatedProfitLoss * 0.60) }}</td>
              <td class="data-cell churned-customers negative">-{{ formatCurrency(customerData.churnedCustomers.estimatedServiceFeeLoss * 0.55) }}</td>
              <td class="data-cell churned-customers negative">-{{ formatCurrency(customerData.churnedCustomers.estimatedRebateLoss * 0.58) }}</td>
              <!-- 汇总 -->
              <td class="data-cell">{{ Math.round(customerData.allCustomers.activeCustomerCount * 1.18) }}家</td>
              <td class="data-cell negative">-{{ formatCurrency(customerData.churnedCustomers.estimatedProfitLoss * 0.60) }}</td>
              <td class="data-cell negative">-{{ formatCurrency(customerData.churnedCustomers.estimatedRebateLoss * 0.58) }}</td>
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

      <!-- 客户增长趋势 -->
      <div class="growth-trends-section">
        <div class="growth-card">
          <div class="growth-card__header">
            <TrendingUp :size="20" />
            <h4>客户增长分析</h4>
          </div>
          <div class="growth-card__content" v-if="customerData">
            <div class="growth-metrics">
              <div class="growth-metric">
                <span class="growth-label">新客户增长</span>
                <span class="growth-value positive">+{{ customerData.newCustomers.activeCustomerCount }}家</span>
                <span class="growth-percentage">{{ getNewCustomerGrowthRate() }}%</span>
              </div>
              <div class="growth-metric">
                <span class="growth-label">客户流失</span>
                <span class="growth-value negative">-{{ customerData.churnedCustomers.customerCount }}家</span>
                <span class="growth-percentage negative">{{ getChurnRate() }}%</span>
              </div>
              <div class="growth-metric">
                <span class="growth-label">净增长</span>
                <span class="growth-value" :class="getNetGrowthClass()">
                  {{ getNetGrowth() }}家
                </span>
                <span class="growth-percentage" :class="getNetGrowthClass()">
                  {{ getNetGrowthRate() }}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="efficiency-card">
          <div class="efficiency-card__header">
            <BarChart3 :size="20" />
            <h4>客户效率分析</h4>
          </div>
          <div class="efficiency-card__content" v-if="customerData">
            <div class="efficiency-metrics">
              <div class="efficiency-metric">
                <span class="efficiency-label">平均客户价值</span>
                <span class="efficiency-value">{{ formatCurrency(getAverageCustomerValue()) }}</span>
              </div>
              <div class="efficiency-metric">
                <span class="efficiency-label">新客户平均价值</span>
                <span class="efficiency-value">{{ formatCurrency(getNewCustomerAverageValue()) }}</span>
              </div>
              <div class="efficiency-metric">
                <span class="efficiency-label">老客户平均价值</span>
                <span class="efficiency-value">{{ formatCurrency(getOldCustomerAverageValue()) }}</span>
              </div>
              <div class="efficiency-metric">
                <span class="efficiency-label">客户留存率</span>
                <span class="efficiency-value">{{ getRetentionRate() }}%</span>
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
import { Users, UserCheck, UserPlus, UserX, TrendingUp, BarChart3 } from 'lucide-vue-next'
import PieChart from '@/components/charts/PieChart.vue'
import BarChart from '@/components/charts/BarChart.vue'
import type { CustomerAnalysisData } from '@/types'

interface Props {
  customerData: CustomerAnalysisData | null
  title: string
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<{
  'view-change': [view: string]
  'chart-click': [data: any]
}>()

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

.view-toggle {
  display: flex;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  overflow: hidden;
}

.view-toggle__btn {
  padding: 6px 16px;
  background: #fff;
  border: none;
  color: #595959;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.view-toggle__btn:hover {
  background: #f5f5f5;
}

.view-toggle__btn--active {
  background: #1890ff;
  color: #fff;
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

/* 增长趋势区域 */
.growth-trends-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
}

.growth-card,
.efficiency-card {
  background: #f0f9ff;
  border: 1px solid #bae7ff;
  border-radius: 8px;
  padding: 20px;
}

.growth-card__header,
.efficiency-card__header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  color: #1890ff;
}

.growth-card__header h4,
.efficiency-card__header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.growth-metrics,
.efficiency-metrics {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.growth-metric,
.efficiency-metric {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #fff;
  border-radius: 6px;
}

.growth-label,
.efficiency-label {
  font-size: 14px;
  color: #595959;
  flex: 1;
}

.growth-value,
.efficiency-value {
  font-size: 16px;
  font-weight: 600;
  color: #262626;
  margin-right: 12px;
}

.growth-value.positive {
  color: #52c41a;
}

.growth-value.negative {
  color: #ff4d4f;
}

.growth-percentage {
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 10px;
  background: #f0f0f0;
  color: #8c8c8c;
}

.growth-percentage.positive {
  background: #f6ffed;
  color: #52c41a;
}

.growth-percentage.negative {
  background: #fff2f0;
  color: #ff4d4f;
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

  .view-toggle {
    justify-content: center;
  }

  .overview-table-container {
    margin: 0 -16px;
  }

  .proportion-charts-section,
  .growth-trends-section {
    grid-template-columns: 1fr;
  }

  .growth-metric,
  .efficiency-metric {
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }

  .growth-label,
  .efficiency-label {
    margin-bottom: 4px;
  }
}
</style>
