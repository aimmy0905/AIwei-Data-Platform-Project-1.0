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
      <!-- 数据概览卡片 -->
      <div class="overview-cards">
        <div class="overview-card" v-if="customerData">
          <div class="overview-card__header">
            <Users :size="20" />
            <span>全部客户</span>
          </div>
          <div class="overview-card__content">
            <div class="overview-metric">
              <span class="metric-label">客户数</span>
              <span class="metric-value">{{ customerData.allCustomers.activeCustomerCount }}家</span>
            </div>
            <div class="overview-metric">
              <span class="metric-label">总毛利</span>
              <span class="metric-value">{{ formatCurrency(customerData.allCustomers.totalProfit) }}</span>
            </div>
            <div class="overview-metric">
              <span class="metric-label">服务费</span>
              <span class="metric-value">{{ formatCurrency(customerData.allCustomers.serviceFee) }}</span>
            </div>
            <div class="overview-metric">
              <span class="metric-label">返点</span>
              <span class="metric-value">{{ formatCurrency(customerData.allCustomers.rebate) }}</span>
            </div>
          </div>
        </div>

        <div class="overview-card card--old" v-if="customerData">
          <div class="overview-card__header">
            <UserCheck :size="20" />
            <span>老客户 (2025前)</span>
          </div>
          <div class="overview-card__content">
            <div class="overview-metric">
              <span class="metric-label">客户数</span>
              <span class="metric-value">{{ customerData.oldCustomers.activeCustomerCount }}家</span>
            </div>
            <div class="overview-metric">
              <span class="metric-label">总毛利</span>
              <span class="metric-value">{{ formatCurrency(customerData.oldCustomers.totalProfit) }}</span>
            </div>
            <div class="overview-metric">
              <span class="metric-label">服务费</span>
              <span class="metric-value">{{ formatCurrency(customerData.oldCustomers.serviceFee) }}</span>
            </div>
            <div class="overview-metric">
              <span class="metric-label">返点</span>
              <span class="metric-value">{{ formatCurrency(customerData.oldCustomers.rebate) }}</span>
            </div>
          </div>
        </div>

        <div class="overview-card card--new" v-if="customerData">
          <div class="overview-card__header">
            <UserPlus :size="20" />
            <span>新客户 (2025)</span>
          </div>
          <div class="overview-card__content">
            <div class="overview-metric">
              <span class="metric-label">客户数</span>
              <span class="metric-value">{{ customerData.newCustomers.activeCustomerCount }}家</span>
            </div>
            <div class="overview-metric">
              <span class="metric-label">总毛利</span>
              <span class="metric-value">{{ formatCurrency(customerData.newCustomers.totalProfit) }}</span>
            </div>
            <div class="overview-metric">
              <span class="metric-label">服务费</span>
              <span class="metric-value">{{ formatCurrency(customerData.newCustomers.serviceFee) }}</span>
            </div>
            <div class="overview-metric">
              <span class="metric-label">返点</span>
              <span class="metric-value">{{ formatCurrency(customerData.newCustomers.rebate) }}</span>
            </div>
          </div>
        </div>

        <div class="overview-card card--churn" v-if="customerData">
          <div class="overview-card__header">
            <UserX :size="20" />
            <span>流失客户 (2025)</span>
          </div>
          <div class="overview-card__content">
            <div class="overview-metric">
              <span class="metric-label">客户数</span>
              <span class="metric-value">{{ customerData.churnedCustomers.customerCount }}家</span>
            </div>
            <div class="overview-metric">
              <span class="metric-label">预估流失毛利</span>
              <span class="metric-value negative">-{{ formatCurrency(customerData.churnedCustomers.estimatedProfitLoss) }}</span>
            </div>
            <div class="overview-metric">
              <span class="metric-label">预估流失服务费</span>
              <span class="metric-value negative">-{{ formatCurrency(customerData.churnedCustomers.estimatedServiceFeeLoss) }}</span>
            </div>
            <div class="overview-metric">
              <span class="metric-label">预估流失返点</span>
              <span class="metric-value negative">-{{ formatCurrency(customerData.churnedCustomers.estimatedRebateLoss) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 占比分析图表 -->
      <div class="proportion-charts-section">
        <div class="chart-container">
          <div class="chart-header">
            <h4 class="chart-title">{{ getChartTitle() }}</h4>
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

/* 概览卡片 */
.overview-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.overview-card {
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 20px;
  transition: all 0.2s;
}

.overview-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.overview-card.card--old {
  border-left: 4px solid #1890ff;
}

.overview-card.card--new {
  border-left: 4px solid #52c41a;
}

.overview-card.card--churn {
  border-left: 4px solid #ff4d4f;
}

.overview-card__header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  color: #262626;
  font-weight: 600;
}

.overview-card__content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.overview-metric {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.metric-label {
  font-size: 13px;
  color: #8c8c8c;
}

.metric-value {
  font-size: 14px;
  font-weight: 600;
  color: #262626;
}

.metric-value.negative {
  color: #ff4d4f;
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

.chart-header {
  margin-bottom: 16px;
}

.chart-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #262626;
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

  .overview-cards {
    grid-template-columns: 1fr;
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