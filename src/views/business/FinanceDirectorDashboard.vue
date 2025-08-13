<template>
  <div class="finance-director-dashboard">
    <!-- 页面头部 -->
    <div class="dashboard-header">
      <div class="dashboard-header__left">
        <h1 class="dashboard-title">财务总监看板</h1>
        <p class="dashboard-subtitle">全面掌控财务状况与经营风险</p>
      </div>

      <div class="dashboard-header__right">
        <RoleSwitcher
          :current-role="currentRole"
          :available-roles="availableRoles"
          @role-change="handleRoleChange"
        />
      </div>
    </div>

    <!-- 时间选择器 -->
    <div class="dashboard-time-selector">
      <TimeRangePicker
        v-model="selectedTimeRange"
        @change="handleTimeRangeChange"
      />
    </div>

        <!-- 财务核心指标卡片区域 -->
    <div class="dashboard-section" v-if="financialData">
      <h2 class="section-title">财务核心指标</h2>
      <div class="metrics-grid">
        <MetricCard
          title="总服务费"
          :value="financialData.serviceFee.total"
          unit="¥"
          trend="up"
          :trend-value="financialData.serviceFee.quarterlyGrowth"
          trend-period="环比增长"
          color="#52c41a"
          icon="DollarSign"
        />

        <MetricCard
          title="总单量"
          :value="financialData.orders.total"
          unit="单"
          trend="up"
          :trend-value="financialData.orders.quarterlyGrowth"
          trend-period="环比增长"
          color="#1890ff"
          icon="TrendingUp"
        />

        <MetricCard
          title="总毛利"
          :value="financialData.profit.gross"
          unit="¥"
          trend="up"
          :trend-value="financialData.profit.quarterlyGrowth"
          trend-period="环比增长"
          color="#fa8c16"
          icon="Target"
        />

        <MetricCard
          title="总返点"
          :value="financialData.rebate.total"
          unit="¥"
          trend="up"
          :trend-value="financialData.rebate.quarterlyGrowth"
          trend-period="环比增长"
          color="#722ed1"
          icon="BarChart3"
        />
      </div>
    </div>

        <!-- 销售部门目标完成模块 -->
    <div class="dashboard-section">
      <div class="section-header">
        <h2 class="section-title">销售部门目标完成</h2>
        <TimeRangePicker
          v-model="selectedSalesTimeRange"
          @change="handleSalesTimeRangeChange"
        />
      </div>

      <!-- 目标数据卡片 -->
      <div class="target-cards-grid">
        <div class="target-card">
          <div class="card-header">
            <div class="card-icon service-fee">💰</div>
            <div class="card-info">
              <div class="card-title">服务费目标</div>
              <div class="card-value">{{ formatCurrency(8500000) }}</div>
            </div>
          </div>
          <div class="card-progress">
            <div class="progress-bar">
              <div class="progress-fill" style="width: 85%"></div>
            </div>
            <div class="progress-text">85% 完成</div>
          </div>
        </div>

        <div class="target-card">
          <div class="card-header">
            <div class="card-icon new-orders">📋</div>
            <div class="card-info">
              <div class="card-title">新单目标</div>
              <div class="card-value">120 单</div>
            </div>
          </div>
          <div class="card-progress">
            <div class="progress-bar">
              <div class="progress-fill" style="width: 78%"></div>
            </div>
            <div class="progress-text">78% 完成</div>
          </div>
        </div>

        <div class="target-card">
          <div class="card-header">
            <div class="card-icon total">🎯</div>
            <div class="card-info">
              <div class="card-title">总体完成率</div>
              <div class="card-value">81.5%</div>
            </div>
          </div>
          <div class="card-progress">
            <div class="progress-bar">
              <div class="progress-fill" style="width: 81.5%"></div>
            </div>
            <div class="progress-text">超预期完成</div>
          </div>
        </div>
      </div>

      <!-- 数据列表 -->
      <div class="sales-target-table-container">
        <table class="sales-target-table">
          <thead>
            <tr>
              <th>年度</th>
              <th>销售</th>
              <th colspan="2">目标</th>
              <th colspan="2">完成</th>
              <th colspan="3">完成比例</th>
            </tr>
            <tr class="sub-header">
              <th></th>
              <th></th>
              <th>服务费目标</th>
              <th>新单目标</th>
              <th>服务费完成</th>
              <th>单量完成</th>
              <th>服务费完成比例</th>
              <th>新单完成比例</th>
              <th>完成总比例</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="record in salesTargetData" :key="record.year + record.salesperson">
              <td class="year-cell">{{ record.year }}</td>
              <td class="salesperson-cell">{{ record.salesperson }}</td>
              <td class="target-cell">{{ formatCurrency(record.serviceFeeTarget) }}</td>
              <td class="target-cell">{{ record.newOrderTarget }} 单</td>
              <td class="completion-cell">{{ formatCurrency(record.serviceFeeCompletion) }}</td>
              <td class="completion-cell">{{ record.orderCompletion }} 单</td>
              <td class="ratio-cell" :class="getRatioClass(record.serviceFeeRatio)">{{ record.serviceFeeRatio }}%</td>
              <td class="ratio-cell" :class="getRatioClass(record.newOrderRatio)">{{ record.newOrderRatio }}%</td>
              <td class="total-ratio-cell" :class="getRatioClass(record.totalRatio)">{{ record.totalRatio }}%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 预算执行分析模块 -->
    <div class="dashboard-section">
      <h2 class="section-title">预算执行分析</h2>
      <div class="budget-execution-table-container">
        <table class="budget-execution-table">
          <thead>
            <tr>
              <th>部门</th>
              <th>预算金额</th>
              <th>实际支出</th>
              <th>执行率</th>
              <th>差异</th>
              <th>剩余预算</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="budget in budgetExecution" :key="budget.department">
              <td class="department-name">{{ budget.department }}</td>
              <td>{{ formatCurrency(budget.budgetAmount) }}</td>
              <td>{{ formatCurrency(budget.actualAmount) }}</td>
              <td>
                <div class="execution-rate" :class="getExecutionRateClass(budget.executionRate)">
                  {{ budget.executionRate }}%
                </div>
              </td>
              <td>
                <div class="variance" :class="budget.variance >= 0 ? 'positive' : 'negative'">
                  {{ budget.variance >= 0 ? '+' : '' }}{{ formatCurrency(budget.variance) }}
                </div>
              </td>
              <td>
                <div class="remaining" :class="budget.remainingBudget >= 0 ? 'positive' : 'negative'">
                  {{ formatCurrency(budget.remainingBudget) }}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

        <!-- 财务比率分析模块 -->
    <div class="dashboard-section" v-if="financialData">
      <h2 class="section-title">财务比率分析</h2>
      <div class="ratios-grid">
        <div class="ratio-card">
          <div class="ratio-icon">
            <TrendingUp :size="24" />
          </div>
          <div class="ratio-content">
            <div class="ratio-label">流动比率</div>
            <div class="ratio-value">{{ financialData.ratios.currentRatio }}</div>
            <div class="ratio-status good">健康</div>
          </div>
        </div>

        <div class="ratio-card">
          <div class="ratio-icon">
            <Shield :size="24" />
          </div>
          <div class="ratio-content">
            <div class="ratio-label">速动比率</div>
            <div class="ratio-value">{{ financialData.ratios.quickRatio }}</div>
            <div class="ratio-status good">良好</div>
          </div>
        </div>

        <div class="ratio-card">
          <div class="ratio-icon">
            <Percent :size="24" />
          </div>
          <div class="ratio-content">
            <div class="ratio-label">资产收益率</div>
            <div class="ratio-value">{{ financialData.ratios.returnOnAssets }}%</div>
            <div class="ratio-status excellent">优秀</div>
          </div>
        </div>

        <div class="ratio-card">
          <div class="ratio-icon">
            <BarChart3 :size="24" />
          </div>
          <div class="ratio-content">
            <div class="ratio-label">净资产收益率</div>
            <div class="ratio-value">{{ financialData.ratios.returnOnEquity }}%</div>
            <div class="ratio-status excellent">优秀</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 财务风险预警模块 -->
    <div class="dashboard-section">
      <h2 class="section-title">财务风险预警</h2>
      <div class="risk-alerts-container">
        <div
          v-for="alert in riskAlerts"
          :key="alert.id"
          class="risk-alert-card"
          :class="`risk-${alert.level}`"
        >
          <div class="alert-header">
            <div class="alert-icon" :class="`alert-icon--${alert.level}`">
              <AlertTriangle :size="20" />
            </div>
            <div class="alert-info">
              <h4 class="alert-title">{{ alert.title }}</h4>
              <p class="alert-description">{{ alert.description }}</p>
            </div>
            <div class="alert-level">
              <span class="level-badge" :class="`level-${alert.level}`">
                {{ getLevelText(alert.level) }}
              </span>
            </div>
          </div>

          <div class="alert-details">
            <div class="alert-values">
              <span class="current-value">当前值: {{ formatCurrency(alert.currentValue) }}</span>
              <span class="threshold-value">阈值: {{ formatCurrency(alert.thresholdValue) }}</span>
            </div>
            <div class="alert-recommendation">
              <strong>建议:</strong> {{ alert.recommendation }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { TrendingUp, Shield, Percent, BarChart3, AlertTriangle } from 'lucide-vue-next'
import RoleSwitcher from '@/components/business/RoleSwitcher.vue'
import TimeRangePicker from '@/components/business/TimeRangePicker.vue'
import MetricCard from '@/components/business/MetricCard.vue'
import type {
  TimeRange,
  BusinessRole,
  FinancialAnalysisData,
  BudgetExecutionData,
  FinancialRiskAlert
} from '@/types'
import { businessAPI } from '@/mock/business'

// 状态
const currentRole = ref('finance_director')
const availableRoles = ref<BusinessRole[]>([])
const selectedTimeRange = ref<TimeRange>()
const selectedSalesTimeRange = ref<TimeRange>()
const financialData = ref<FinancialAnalysisData | null>(null)
const budgetExecution = ref<BudgetExecutionData[]>([])
const riskAlerts = ref<FinancialRiskAlert[]>([])
const salesTargetData = ref([
  {
    year: '2025',
    salesperson: '张三',
    serviceFeeTarget: 2000000,
    newOrderTarget: 30,
    serviceFeeCompletion: 1700000,
    orderCompletion: 26,
    serviceFeeRatio: 85,
    newOrderRatio: 87,
    totalRatio: 86
  },
  {
    year: '2025',
    salesperson: '李四',
    serviceFeeTarget: 1800000,
    newOrderTarget: 25,
    serviceFeeCompletion: 1440000,
    orderCompletion: 19,
    serviceFeeRatio: 80,
    newOrderRatio: 76,
    totalRatio: 78
  },
  {
    year: '2025',
    salesperson: '王五',
    serviceFeeTarget: 2200000,
    newOrderTarget: 35,
    serviceFeeCompletion: 1980000,
    orderCompletion: 32,
    serviceFeeRatio: 90,
    newOrderRatio: 91,
    totalRatio: 91
  },
  {
    year: '2025',
    salesperson: '赵六',
    serviceFeeTarget: 1600000,
    newOrderTarget: 20,
    serviceFeeCompletion: 1280000,
    orderCompletion: 17,
    serviceFeeRatio: 80,
    newOrderRatio: 85,
    totalRatio: 82
  }
])

// 方法
const handleRoleChange = (role: string) => {
  currentRole.value = role
  console.log('角色切换至:', role)
}

const handleTimeRangeChange = (timeRange: TimeRange) => {
  selectedTimeRange.value = timeRange
  console.log('时间范围变更:', timeRange)
}

const handleSalesTimeRangeChange = (timeRange: TimeRange) => {
  selectedSalesTimeRange.value = timeRange
  console.log('销售时间范围变更:', timeRange)
}

const getRatioClass = (ratio: number): string => {
  if (ratio >= 90) return 'excellent'
  if (ratio >= 80) return 'good'
  if (ratio >= 70) return 'fair'
  return 'poor'
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

const getExecutionRateClass = (rate: number): string => {
  if (rate <= 80) return 'low'
  if (rate <= 100) return 'normal'
  if (rate <= 110) return 'high'
  return 'exceed'
}

const getLevelText = (level: string): string => {
  const texts: Record<string, string> = {
    high: '高风险',
    medium: '中风险',
    low: '低风险'
  }
  return texts[level] || level
}

// 生命周期
onMounted(async () => {
  try {
    const [
      rolesData,
      financialAnalysisData,
      budgetData,
      riskData
    ] = await Promise.all([
      businessAPI.getRoles(),
      businessAPI.getFinancialAnalysisData(),
      businessAPI.getBudgetExecutionData(),
      businessAPI.getFinancialRiskAlerts()
    ])

    availableRoles.value = rolesData
    financialData.value = financialAnalysisData
    budgetExecution.value = budgetData
    riskAlerts.value = riskData
  } catch (error) {
    console.error('数据加载失败:', error)
  }
})
</script>

<style scoped>
.finance-director-dashboard {
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

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.target-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.target-card {
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.card-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.card-icon.service-fee {
  background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
}

.card-icon.new-orders {
  background: linear-gradient(135deg, #1890ff 0%, #40a9ff 100%);
}

.card-icon.total {
  background: linear-gradient(135deg, #722ed1 0%, #9254de 100%);
}

.card-info {
  flex: 1;
}

.card-title {
  font-size: 14px;
  color: #8c8c8c;
  margin-bottom: 4px;
}

.card-value {
  font-size: 20px;
  font-weight: 700;
  color: #262626;
}

.card-progress {
  display: flex;
  align-items: center;
  gap: 12px;
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
  background: linear-gradient(90deg, #52c41a 0%, #73d13d 100%);
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 12px;
  color: #8c8c8c;
  white-space: nowrap;
}

.sales-target-table-container {
  overflow-x: auto;
  margin-top: 20px;
}

.sales-target-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  border: 1px solid #f0f0f0;
}

.sales-target-table th,
.sales-target-table td {
  padding: 12px 8px;
  text-align: center;
  border-bottom: 1px solid #f0f0f0;
  border-right: 1px solid #f0f0f0;
}

.sales-target-table th {
  background: #fafafa;
  font-weight: 600;
  color: #262626;
}

.sales-target-table .sub-header th {
  background: #f0f9ff;
  font-size: 12px;
  color: #595959;
}

.year-cell,
.salesperson-cell {
  text-align: left !important;
  font-weight: 500;
}

.target-cell {
  color: #1890ff;
  font-weight: 500;
}

.completion-cell {
  color: #52c41a;
  font-weight: 500;
}

.ratio-cell,
.total-ratio-cell {
  font-weight: 600;
}

.ratio-cell.excellent,
.total-ratio-cell.excellent {
  color: #52c41a;
  background: #f6ffed;
}

.ratio-cell.good,
.total-ratio-cell.good {
  color: #1890ff;
  background: #e6f7ff;
}

.ratio-cell.fair,
.total-ratio-cell.fair {
  color: #faad14;
  background: #fff7e6;
}

.ratio-cell.poor,
.total-ratio-cell.poor {
  color: #ff4d4f;
  background: #fff2f0;
}

.revenue-analysis-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
}

.revenue-summary-card {
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 20px;
}

.revenue-summary-card h3 {
  margin: 0 0 16px 0;
  font-size: 16px;
  color: #262626;
}

.revenue-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.revenue-item {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 12px;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.revenue-item:last-child {
  border-bottom: none;
}

.revenue-item-name {
  font-weight: 500;
  color: #262626;
}

.revenue-item-amount {
  font-weight: 600;
  color: #52c41a;
}

.revenue-item-percentage {
  font-size: 12px;
  color: #8c8c8c;
}

.budget-execution-table-container {
  overflow-x: auto;
}

.budget-execution-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.budget-execution-table th,
.budget-execution-table td {
  padding: 12px 8px;
  text-align: right;
  border-bottom: 1px solid #f0f0f0;
}

.budget-execution-table th {
  background: #fafafa;
  font-weight: 600;
  color: #262626;
}

.department-name {
  text-align: left !important;
  font-weight: 500;
}

.execution-rate {
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 500;
}

.execution-rate.low {
  background: #fff2f0;
  color: #ff4d4f;
}

.execution-rate.normal {
  background: #f6ffed;
  color: #52c41a;
}

.execution-rate.high {
  background: #fff7e6;
  color: #faad14;
}

.execution-rate.exceed {
  background: #fff2f0;
  color: #ff4d4f;
}

.variance.positive {
  color: #52c41a;
}

.variance.negative {
  color: #ff4d4f;
}

.remaining.positive {
  color: #52c41a;
}

.remaining.negative {
  color: #ff4d4f;
}

.ratios-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.ratio-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
}

.ratio-icon {
  width: 48px;
  height: 48px;
  background: #1890ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.ratio-content {
  flex: 1;
}

.ratio-label {
  font-size: 13px;
  color: #8c8c8c;
  margin-bottom: 4px;
}

.ratio-value {
  font-size: 20px;
  font-weight: 700;
  color: #262626;
  margin-bottom: 4px;
}

.ratio-status {
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 10px;
  font-weight: 500;
}

.ratio-status.excellent {
  background: #f6ffed;
  color: #52c41a;
}

.ratio-status.good {
  background: #e6f7ff;
  color: #1890ff;
}

.risk-alerts-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.risk-alert-card {
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 20px;
  background: #fff;
}

.risk-alert-card.risk-high {
  border-left: 4px solid #ff4d4f;
  background: #fff2f0;
}

.risk-alert-card.risk-medium {
  border-left: 4px solid #faad14;
  background: #fff7e6;
}

.risk-alert-card.risk-low {
  border-left: 4px solid #52c41a;
  background: #f6ffed;
}

.alert-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
}

.alert-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.alert-icon--high {
  background: #ff4d4f;
}

.alert-icon--medium {
  background: #faad14;
}

.alert-icon--low {
  background: #52c41a;
}

.alert-info {
  flex: 1;
}

.alert-title {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: #262626;
}

.alert-description {
  margin: 0;
  font-size: 13px;
  color: #595959;
}

.alert-level {
  margin-left: auto;
}

.level-badge {
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 500;
}

.level-badge.level-high {
  background: #fff2f0;
  color: #ff4d4f;
}

.level-badge.level-medium {
  background: #fff7e6;
  color: #faad14;
}

.level-badge.level-low {
  background: #f6ffed;
  color: #52c41a;
}

.alert-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.alert-values {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #8c8c8c;
}

.alert-recommendation {
  font-size: 13px;
  color: #595959;
  line-height: 1.4;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .ratios-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .finance-director-dashboard {
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

  .revenue-analysis-grid {
    grid-template-columns: 1fr;
  }

  .ratios-grid {
    grid-template-columns: 1fr;
  }

  .revenue-item {
    grid-template-columns: 1fr;
    gap: 4px;
  }
}
</style>
