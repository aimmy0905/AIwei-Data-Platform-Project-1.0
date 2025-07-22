<template>
  <div class="sales-director-dashboard">
    <!-- 页面头部 -->
    <div class="dashboard-header">
      <div class="dashboard-header__left">
        <h1 class="dashboard-title">销售总监看板</h1>
        <p class="dashboard-subtitle">全面掌控销售业绩与团队表现</p>
      </div>

      <div class="dashboard-header__right">
        <RoleSwitcher
          :current-role="currentRole"
          :available-roles="availableRoles"
          @role-change="handleRoleChange"
        />
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>正在加载数据...</p>
    </div>

    <!-- 主要内容 -->
    <div v-else class="dashboard-content">
      <!-- 时间选择器 -->
      <div class="dashboard-time-selector">
      <TimeRangePicker
        v-model="selectedTimeRange"
        @change="handleTimeRangeChange"
      />
    </div>

    <!-- 核心指标卡片区域 -->
    <div class="dashboard-section">
      <h2 class="section-title">核心指标概览</h2>
      <div class="metrics-grid">
        <MetricCard
          v-for="metric in coreMetrics"
          :key="metric.title"
          v-bind="metric"
        />
      </div>
    </div>

    <!-- 目标完成情况模块 -->
    <div class="dashboard-section">
      <div class="section-header">
        <h2 class="section-title">目标完成情况</h2>
        <QuarterSelector
          v-model="selectedQuarter"
          :show-quick-select="false"
          @change="handleQuarterChange"
        />
      </div>

      <div class="target-comparison-grid">
        <TargetComparisonCard
          v-for="target in targetComparisons"
          :key="target.targetType"
          v-bind="target"
        />
      </div>
    </div>

    <!-- 新单服务费及单量完成模块 -->
    <div class="dashboard-section">
      <h2 class="section-title">新单服务费及单量完成</h2>
      <div class="platform-analysis-grid">
        <div class="platform-summary-card">
          <h3>服务费总计</h3>
          <div class="summary-value">{{ formatCurrency(platformSummary.totalServiceFee) }}</div>
          <PieChart :data="platformChartData" height="200px" />
        </div>

        <div class="platform-summary-card">
          <h3>单量总计</h3>
          <div class="summary-value">{{ platformSummary.totalOrders }}单</div>
          <BarChart :data="platformBarChartData" height="200px" />
        </div>
      </div>
    </div>

    <!-- 新签客户毛利完成模块 -->
    <div class="dashboard-section">
      <h2 class="section-title">新签客户毛利完成</h2>
      <div class="profit-analysis-table-container">
        <table class="profit-analysis-table">
          <thead>
            <tr>
              <th>平台</th>
              <th>新单单量</th>
              <th>服务费</th>
              <th>消费</th>
              <th>返点</th>
              <th>毛利</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(platform, key) in customerProfitData?.platforms || {}" :key="key">
              <td class="platform-name">{{ getPlatformName(key as string) }}</td>
              <td>{{ (platform as any).orderCount }}</td>
              <td>{{ formatCurrency((platform as any).serviceFee) }}</td>
              <td>{{ formatCurrency((platform as any).consumption) }}</td>
              <td>{{ formatCurrency((platform as any).rebate) }}</td>
              <td class="profit-value">{{ formatCurrency((platform as any).profit) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 所有客户2025年毛利完成模块 -->
    <div class="dashboard-section">
      <h2 class="section-title">所有客户2025年毛利完成</h2>
      <div class="profit-summary-grid">
        <div class="profit-summary-card">
          <div class="profit-summary-icon">
            <DollarSign :size="24" />
          </div>
          <div class="profit-summary-content">
            <div class="profit-summary-label">总毛利</div>
            <div class="profit-summary-value">{{ formatCurrency(profitSummary?.totalProfit || 0) }}</div>
            <div class="profit-summary-progress">
              <div class="progress-bar">
                <div
                  class="progress-fill"
                  :style="{ width: `${profitSummary?.completionRate || 0}%` }"
                ></div>
              </div>
              <span class="progress-text">{{ profitSummary?.completionRate || 0 }}%</span>
            </div>
          </div>
        </div>

        <div class="profit-summary-card">
          <div class="profit-summary-icon">
            <TrendingUp :size="24" />
          </div>
          <div class="profit-summary-content">
            <div class="profit-summary-label">同比增长</div>
            <div class="profit-summary-value positive">+{{ profitSummary?.yearOverYearGrowth || 0 }}%</div>
            <div class="profit-summary-meta">毛利率: {{ profitSummary?.profitMargin || 0 }}%</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 流失客户分析模块 -->
    <div class="dashboard-section">
      <h2 class="section-title">流失客户分析</h2>
      <div class="churn-analysis-grid">
        <div
          v-for="churn in churnAnalysis"
          :key="churn.category"
          class="churn-analysis-card"
          :class="`risk-${churn.riskLevel}`"
        >
          <div class="churn-card-header">
            <h4>{{ getChurnCategoryName(churn.category) }}</h4>
            <span class="risk-badge" :class="`risk-badge--${churn.riskLevel}`">
              {{ getRiskLevelText(churn.riskLevel) }}
            </span>
          </div>

          <div class="churn-metrics">
            <div class="churn-metric">
              <span class="metric-label">流失客户</span>
              <span class="metric-value">{{ churn.customerCount }}家</span>
            </div>
            <div class="churn-metric">
              <span class="metric-label">预估损失毛利</span>
              <span class="metric-value danger">{{ formatCurrency(churn.estimatedProfitLoss) }}</span>
            </div>
            <div class="churn-metric">
              <span class="metric-label">流失率</span>
              <span class="metric-value">{{ churn.churnRate }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 销售完成情况模块 -->
    <div class="dashboard-section">
      <h2 class="section-title">销售完成情况</h2>
      <div class="sales-performance-table-container">
        <table class="sales-performance-table">
          <thead>
            <tr>
              <th>排名</th>
              <th>姓名</th>
              <th>部门</th>
              <th>总服务费</th>
              <th>总毛利</th>
              <th>目标完成率</th>
              <th>客户数</th>
              <th>环比增长</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="person in salesPerformance" :key="person.id">
              <td class="rank-cell">
                <div class="rank-badge" :class="`rank-${person.rank}`">
                  {{ person.rank }}
                </div>
              </td>
              <td class="name-cell">{{ person.name }}</td>
              <td>{{ person.department }}</td>
              <td>{{ formatCurrency(person.totalServiceFee) }}</td>
              <td>{{ formatCurrency(person.totalProfit) }}</td>
              <td>
                <div class="completion-rate" :class="getCompletionRateClass(person.targetCompletion)">
                  {{ person.targetCompletion }}%
                </div>
              </td>
              <td>{{ person.customerCount }}家</td>
              <td>
                <div class="growth-rate" :class="person.lastMonthGrowth >= 0 ? 'positive' : 'negative'">
                  {{ person.lastMonthGrowth >= 0 ? '+' : '' }}{{ person.lastMonthGrowth }}%
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 续费客户名单模块 -->
    <div class="dashboard-section">
      <h2 class="section-title">续费客户名单</h2>
      <div class="renewal-customers-container">
        <div class="renewal-summary">
          <div class="renewal-stat">
            <span class="stat-label">待续费客户</span>
            <span class="stat-value">{{ renewalCustomers.length }}家</span>
          </div>
          <div class="renewal-stat">
            <span class="stat-label">预估续费金额</span>
            <span class="stat-value">{{ formatCurrency(getTotalRenewalValue()) }}</span>
          </div>
        </div>

        <div class="renewal-customers-list">
          <div
            v-for="customer in renewalCustomers"
            :key="customer.id"
            class="renewal-customer-card"
            :class="`priority-${customer.priority}`"
          >
            <div class="customer-info">
              <h4 class="customer-name">{{ customer.customerName }}</h4>
              <div class="customer-meta">
                <span class="sales-person">负责人: {{ customer.salesPerson }}</span>
                <span class="contract-end">到期: {{ customer.contractEndDate }}</span>
              </div>
            </div>

            <div class="renewal-details">
              <div class="renewal-value">
                <span class="label">预估金额</span>
                <span class="value">{{ formatCurrency(customer.estimatedRenewalValue) }}</span>
              </div>
              <div class="renewal-probability">
                <span class="label">续费概率</span>
                <span class="value">{{ customer.renewalProbability }}%</span>
              </div>
            </div>

            <div class="renewal-status">
              <span class="status-badge" :class="`status-${customer.renewalStatus}`">
                {{ getRenewalStatusText(customer.renewalStatus) }}
              </span>
              <span class="priority-badge" :class="`priority-${customer.priority}`">
                {{ getPriorityText(customer.priority) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { DollarSign, TrendingUp } from 'lucide-vue-next'
import RoleSwitcher from '@/components/business/RoleSwitcher.vue'
import TimeRangePicker from '@/components/business/TimeRangePicker.vue'
import MetricCard from '@/components/business/MetricCard.vue'
import QuarterSelector from '@/components/business/QuarterSelector.vue'
import TargetComparisonCard from '@/components/business/TargetComparisonCard.vue'
import PieChart from '@/components/charts/PieChart.vue'
import BarChart from '@/components/charts/BarChart.vue'
import type {
  TimeRange,
  Quarter,
  BusinessRole,
  MetricCardProps,
  TargetComparison,
  PlatformData,
  CustomerProfitData,
  ProfitSummaryData,
  ChurnData,
  SalesPersonPerformance,
  RenewalCustomerData
} from '@/types'
import { businessAPI } from '@/mock/business'

// 状态
const currentRole = ref('sales_director')
const availableRoles = ref<BusinessRole[]>([])
const selectedTimeRange = ref<TimeRange>()
const selectedQuarter = ref<Quarter>()
const coreMetrics = ref<MetricCardProps[]>([])
const targetComparisons = ref<TargetComparison[]>([])
const platformData = ref<PlatformData[]>([])
const customerProfitData = ref<CustomerProfitData>()
const profitSummary = ref<ProfitSummaryData>()
const churnAnalysis = ref<ChurnData[]>([])
const salesPerformance = ref<SalesPersonPerformance[]>([])
const renewalCustomers = ref<RenewalCustomerData[]>([])
const loading = ref(true)

// 计算属性
const platformSummary = computed(() => {
  const totalServiceFee = platformData.value.reduce((sum, p) => sum + p.serviceFee, 0)
  const totalOrders = platformData.value.reduce((sum, p) => sum + p.orderCount, 0)
  return { totalServiceFee, totalOrders }
})

const platformChartData = computed(() =>
  platformData.value.map(p => ({
    name: p.platform,
    value: p.serviceFee,
    color: p.color
  }))
)

const platformBarChartData = computed(() => ({
  labels: platformData.value.map(p => p.platform),
  datasets: [{
    label: '单量',
    data: platformData.value.map(p => p.orderCount),
    color: '#1890ff'
  }]
}))

// 方法
const handleRoleChange = (role: string) => {
  currentRole.value = role
  // 这里可以添加角色切换后的数据重新加载逻辑
  console.log('角色切换至:', role)
}

const handleTimeRangeChange = (timeRange: TimeRange) => {
  selectedTimeRange.value = timeRange
  console.log('时间范围变更:', timeRange)
  // 重新加载数据
}

const handleQuarterChange = (quarter: Quarter) => {
  selectedQuarter.value = quarter
  console.log('季度变更:', quarter)
  // 重新加载季度数据
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

const getPlatformName = (key: string): string => {
  const names: Record<string, string> = {
    google: 'Google',
    meta: 'Meta',
    criteo: 'Criteo',
    bing: 'Bing',
    total: '合计'
  }
  return names[key] || key
}

const getChurnCategoryName = (category: string): string => {
  const names: Record<string, string> = {
    total: '总流失客户',
    new_customer: '新客户流失',
    old_customer: '老客户流失'
  }
  return names[category] || category
}

const getRiskLevelText = (level: string): string => {
  const texts: Record<string, string> = {
    high: '高风险',
    medium: '中风险',
    low: '低风险'
  }
  return texts[level] || level
}

const getCompletionRateClass = (rate: number): string => {
  if (rate >= 95) return 'excellent'
  if (rate >= 85) return 'good'
  if (rate >= 70) return 'average'
  return 'poor'
}

const getRenewalStatusText = (status: string): string => {
  const texts: Record<string, string> = {
    pending: '待联系',
    contacted: '已联系',
    negotiating: '协商中',
    confirmed: '已确认',
    declined: '已拒绝'
  }
  return texts[status] || status
}

const getPriorityText = (priority: string): string => {
  const texts: Record<string, string> = {
    high: '高优先级',
    medium: '中优先级',
    low: '低优先级'
  }
  return texts[priority] || priority
}

const getTotalRenewalValue = (): number => {
  return renewalCustomers.value.reduce((sum, customer) => sum + customer.estimatedRenewalValue, 0)
}

// 生命周期
onMounted(async () => {
  // 加载数据
  try {
    const [
      rolesData,
      metricsData,
      targetData,
      platformDistData,
      profitData,
      profitSummaryData,
      churnData,
      salesPerfData,
      renewalData
    ] = await Promise.all([
      businessAPI.getRoles(),
      businessAPI.getSalesDirectorMetrics(),
      businessAPI.getTargetComparison(),
      businessAPI.getPlatformDistribution(),
      businessAPI.getCustomerProfitData(),
      businessAPI.getProfitSummary(),
      businessAPI.getChurnData(),
      businessAPI.getSalesPersonPerformance(),
      businessAPI.getRenewalCustomerData()
    ])

    availableRoles.value = rolesData
    coreMetrics.value = metricsData
    targetComparisons.value = targetData
    platformData.value = platformDistData
    customerProfitData.value = profitData
    profitSummary.value = profitSummaryData
    churnAnalysis.value = churnData
    salesPerformance.value = salesPerfData
    renewalCustomers.value = renewalData
  } catch (error) {
    console.error('数据加载失败:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.sales-director-dashboard {
  padding: 24px;
  background: #f5f5f5;
  min-height: 100vh;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.dashboard-title {
  margin: 0 0 4px 0;
  font-size: 24px;
  font-weight: 600;
  color: #262626;
}

.dashboard-subtitle {
  margin: 0;
  color: #8c8c8c;
  font-size: 14px;
}

.dashboard-time-selector {
  margin-bottom: 24px;
}

.dashboard-section {
  margin-bottom: 32px;
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  margin: 0 0 20px 0;
  font-size: 18px;
  font-weight: 600;
  color: #262626;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.target-comparison-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
}

.platform-analysis-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
}

.platform-summary-card {
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
}

.platform-summary-card h3 {
  margin: 0 0 8px 0;
  font-size: 16px;
  color: #595959;
}

.summary-value {
  font-size: 24px;
  font-weight: 700;
  color: #262626;
  margin-bottom: 16px;
}

.profit-analysis-table-container {
  overflow-x: auto;
}

.profit-analysis-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.profit-analysis-table th,
.profit-analysis-table td {
  padding: 12px 8px;
  text-align: right;
  border-bottom: 1px solid #f0f0f0;
}

.profit-analysis-table th {
  background: #fafafa;
  font-weight: 600;
  color: #262626;
}

.profit-analysis-table .platform-name {
  text-align: left;
  font-weight: 500;
}

.profit-analysis-table .profit-value {
  color: #52c41a;
  font-weight: 600;
}

.profit-summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.profit-summary-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
}

.profit-summary-icon {
  width: 48px;
  height: 48px;
  background: #1890ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.profit-summary-content {
  flex: 1;
}

.profit-summary-label {
  font-size: 13px;
  color: #8c8c8c;
  margin-bottom: 4px;
}

.profit-summary-value {
  font-size: 20px;
  font-weight: 700;
  color: #262626;
  margin-bottom: 8px;
}

.profit-summary-value.positive {
  color: #52c41a;
}

.profit-summary-progress {
  display: flex;
  align-items: center;
  gap: 8px;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: #f0f0f0;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #52c41a;
  border-radius: 3px;
}

.progress-text {
  font-size: 12px;
  color: #595959;
  font-weight: 500;
}

.profit-summary-meta {
  font-size: 12px;
  color: #8c8c8c;
}

.churn-analysis-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 20px;
}

.churn-analysis-card {
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 20px;
  background: #fafafa;
}

.churn-analysis-card.risk-high {
  border-left: 4px solid #ff4d4f;
}

.churn-analysis-card.risk-medium {
  border-left: 4px solid #faad14;
}

.churn-analysis-card.risk-low {
  border-left: 4px solid #52c41a;
}

.churn-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.churn-card-header h4 {
  margin: 0;
  font-size: 16px;
  color: #262626;
}

.risk-badge {
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 500;
}

.risk-badge--high {
  background: #fff2f0;
  color: #ff4d4f;
}

.risk-badge--medium {
  background: #fff7e6;
  color: #faad14;
}

.risk-badge--low {
  background: #f6ffed;
  color: #52c41a;
}

.churn-metrics {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.churn-metric {
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
  font-weight: 500;
  color: #262626;
}

.metric-value.danger {
  color: #ff4d4f;
}

.sales-performance-table-container {
  overflow-x: auto;
}

.sales-performance-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.sales-performance-table th,
.sales-performance-table td {
  padding: 12px 8px;
  text-align: center;
  border-bottom: 1px solid #f0f0f0;
}

.sales-performance-table th {
  background: #fafafa;
  font-weight: 600;
  color: #262626;
}

.rank-cell {
  text-align: center;
}

.rank-badge {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  color: white;
}

.rank-badge.rank-1 {
  background: #ffd700;
  color: #262626;
}

.rank-badge.rank-2 {
  background: #c0c0c0;
  color: #262626;
}

.rank-badge.rank-3 {
  background: #cd7f32;
}

.rank-badge:not(.rank-1):not(.rank-2):not(.rank-3) {
  background: #d9d9d9;
  color: #262626;
}

.name-cell {
  text-align: left;
  font-weight: 500;
}

.completion-rate {
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 500;
}

.completion-rate.excellent {
  background: #f6ffed;
  color: #52c41a;
}

.completion-rate.good {
  background: #e6f7ff;
  color: #1890ff;
}

.completion-rate.average {
  background: #fff7e6;
  color: #faad14;
}

.completion-rate.poor {
  background: #fff2f0;
  color: #ff4d4f;
}

.growth-rate.positive {
  color: #52c41a;
}

.growth-rate.negative {
  color: #ff4d4f;
}

.renewal-customers-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.renewal-summary {
  display: flex;
  gap: 40px;
  padding: 16px;
  background: #fafafa;
  border-radius: 6px;
}

.renewal-stat {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-label {
  font-size: 12px;
  color: #8c8c8c;
}

.stat-value {
  font-size: 18px;
  font-weight: 600;
  color: #262626;
}

.renewal-customers-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 16px;
}

.renewal-customer-card {
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 16px;
  background: #fff;
}

.renewal-customer-card.priority-high {
  border-left: 4px solid #ff4d4f;
}

.renewal-customer-card.priority-medium {
  border-left: 4px solid #faad14;
}

.renewal-customer-card.priority-low {
  border-left: 4px solid #52c41a;
}

.customer-info {
  margin-bottom: 12px;
}

.customer-name {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: #262626;
}

.customer-meta {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #8c8c8c;
}

.renewal-details {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.renewal-details .label {
  font-size: 12px;
  color: #8c8c8c;
  display: block;
}

.renewal-details .value {
  font-size: 14px;
  font-weight: 600;
  color: #262626;
}

.renewal-status {
  display: flex;
  gap: 8px;
}

.status-badge,
.priority-badge {
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 500;
}

.status-badge.status-pending {
  background: #f5f5f5;
  color: #8c8c8c;
}

.status-badge.status-contacted {
  background: #e6f7ff;
  color: #1890ff;
}

.status-badge.status-negotiating {
  background: #fff7e6;
  color: #faad14;
}

.status-badge.status-confirmed {
  background: #f6ffed;
  color: #52c41a;
}

.status-badge.status-declined {
  background: #fff2f0;
  color: #ff4d4f;
}

.priority-badge.priority-high {
  background: #fff2f0;
  color: #ff4d4f;
}

.priority-badge.priority-medium {
  background: #fff7e6;
  color: #faad14;
}

.priority-badge.priority-low {
  background: #f6ffed;
  color: #52c41a;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .target-comparison-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .sales-director-dashboard {
    padding: 16px;
  }

  .dashboard-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .metrics-grid {
    grid-template-columns: 1fr;
  }

  .platform-analysis-grid {
    grid-template-columns: 1fr;
  }

  .profit-summary-grid {
    grid-template-columns: 1fr;
  }

  .churn-analysis-grid {
    grid-template-columns: 1fr;
  }

  .renewal-customers-list {
    grid-template-columns: 1fr;
  }

  .renewal-summary {
    flex-direction: column;
    gap: 12px;
  }
}

/* 加载状态 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.loading-spinner {
  width: 32px;
  height: 32px;
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

.loading-container p {
  color: #8c8c8c;
  margin: 0;
}
</style>
