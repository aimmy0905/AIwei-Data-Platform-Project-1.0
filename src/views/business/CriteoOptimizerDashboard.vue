<template>
  <div class="criteo-optimizer-dashboard">
    <div class="dashboard-header">
      <div class="dashboard-header__left">
        <h1 class="dashboard-title">Criteo优化师看板</h1>
        <p class="dashboard-subtitle">专注Criteo平台客户优化与数据分析</p>
      </div>

      <div class="dashboard-header__right">
        <RoleSwitcher
          :current-role="currentRole"
          :available-roles="availableRoles"
          @role-change="handleRoleChange"
        />
      </div>
    </div>

    <div class="dashboard-content" v-if="!loading && isDataLoaded">
      <!-- 个人业绩概览卡片 - 简化版本 -->
      <OptimizerMetricsCards
        :metrics="optimizerData.metrics!"
        :show-summary="showSummary"
        :loading="loading"
        @view-alerts="handleViewAlerts"
        @toggle-summary="toggleSummary"
        @optimize-accounts="handleOptimizeAccounts"
        @check-budgets="handleCheckBudgets"
        @analyze-performance="handleAnalyzePerformance"
        @view-details="handleViewDetails"
      />

      <!-- 账户余额模块 -->
      <AccountBalanceModule
        :balance-data="optimizerData.accountBalance!"
        :loading="loading"
        @refresh-data="loadAccountBalance"
        @remind-customer="handleRemindCustomer"
        @view-details="handleViewAccountDetails"
        @batch-remind="handleBatchRemind"
        @batch-export="handleBatchExport"
      />

      <!-- 数据总览模块 -->
      <div class="data-overview-section">
        <div class="section-title">
          <span class="section-icon">📊</span>
          <div class="title-content">
            <h3>客户数据总览</h3>
            <p>查看所有负责客户的详细数据信息</p>
          </div>
        </div>
        <div class="data-overview-content">
          <div class="overview-stats">
            <div class="stat-card">
              <div class="stat-icon">👥</div>
              <div class="stat-info">
                <div class="stat-value">{{ overviewStats.totalCustomers }}</div>
                <div class="stat-label">负责客户</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">💰</div>
              <div class="stat-info">
                <div class="stat-value">{{ formatCurrency(overviewStats.totalRevenue) }}</div>
                <div class="stat-label">总收入</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">📈</div>
              <div class="stat-info">
                <div class="stat-value">{{ overviewStats.averageROAS.toFixed(2) }}</div>
                <div class="stat-label">平均ROAS</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">⚡</div>
              <div class="stat-info">
                <div class="stat-value">{{ overviewStats.activeProjects }}</div>
                <div class="stat-label">活跃项目</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Criteo广告数据总览模块 -->
      <CriteoAdsOverviewModule
        :loading="loading"
        @time-range-change="handleTimeRangeChange"
        @investigate-alert="handleInvestigateAlert"
        @optimize-customer="handleOptimizeCustomer"
        @view-customer-details="handleViewCriteoAdsDetails"
      />
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p class="loading-text">正在加载Criteo优化师数据...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import RoleSwitcher from '@/components/business/RoleSwitcher.vue'
import OptimizerMetricsCards from '@/components/business/OptimizerMetricsCards.vue'
import AccountBalanceModule from '@/components/business/AccountBalanceModule.vue'
import CriteoAdsOverviewModule from '@/components/business/CriteoAdsOverviewModule.vue'
import { businessAPI } from '@/mock/business'
import type {
  BusinessRole,
  OptimizerMetrics,
  AccountBalanceData,
  CustomerAccountBalance,
  TimeRange
} from '@/types'

// Criteo广告客户数据接口
interface CriteoAdsCustomerData {
  customerId: string
  customerName: string
  optimizer: string
  spend: number
  impressions: number
  clicks: number
  ctr: number
  cpc: number
  conversionValue: number
  conversionValueByTime: number
  roas: number
  roasByTime: number
  conversions: number
  conversionRate: number
  cpa: number
  productRecommendation: 'excellent' | 'good' | 'fair' | 'poor'
  retargetingPerformance: 'excellent' | 'good' | 'fair' | 'poor'
  catalogQuality: 'excellent' | 'good' | 'fair' | 'poor'
  audienceSegmentation: 'excellent' | 'good' | 'fair' | 'poor'
  estimatedDaysRemaining: number
  anomalyAlerts: Array<{
    type: 'cpc' | 'spend' | 'conversion' | 'catalog'
    severity: 'high' | 'medium' | 'low'
    message: string
    threshold: number
    currentValue: number
    detectedAt: string
  }>
}

// 数据总览统计接口
interface OverviewStats {
  totalCustomers: number
  totalRevenue: number
  averageROAS: number
  activeProjects: number
}

const currentRole = ref('criteo_optimizer')
const availableRoles = ref<BusinessRole[]>([])
const loading = ref(false)
const showSummary = ref(false)

// Criteo优化师数据 - 简化结构，只有3个核心模块
const optimizerData = reactive<{
  metrics: OptimizerMetrics | null
  accountBalance: AccountBalanceData | null
}>({
  metrics: null,
  accountBalance: null
})

// 数据总览统计
const overviewStats = reactive<OverviewStats>({
  totalCustomers: 0,
  totalRevenue: 0,
  averageROAS: 0,
  activeProjects: 0
})

// 计算属性：检查所有数据是否已加载 - 简化版本
const isDataLoaded = computed(() => {
  return optimizerData.metrics !== null &&
         optimizerData.accountBalance !== null
})

// 格式化货币
const formatCurrency = (value: number): string => {
  if (value >= 100000000) {
    return `¥${(value / 100000000).toFixed(2)}亿`
  } else if (value >= 10000) {
    return `¥${(value / 10000).toFixed(2)}万`
  } else {
    return `¥${value.toLocaleString()}`
  }
}

// 加载数据 - 简化版本，只加载必要的模块
const loadOptimizerData = async () => {
  try {
    loading.value = true

    // 声明变量
    let metrics: OptimizerMetrics | null = null
    let accountBalance: AccountBalanceData | null = null

    try {
      // 并行加载Criteo数据
      const [metricsResult, accountBalanceResult] = await Promise.all([
        businessAPI.getCriteoOptimizerMetrics(),
        businessAPI.getCriteoAccountBalance()
      ])
      metrics = metricsResult
      accountBalance = accountBalanceResult
    } catch (error) {
      console.error('Failed to load Criteo optimizer data, using fallback:', error)
      // 使用Google优化师的API作为后备，但修改平台标识
      const [metricsResult, accountBalanceResult] = await Promise.all([
        businessAPI.getGoogleOptimizerMetrics(),
        businessAPI.getGoogleAccountBalance()
      ])
      metrics = { ...metricsResult, platform: 'criteo' }
      accountBalance = accountBalanceResult
    }

    // 设置数据
    if (metrics && accountBalance) {
      optimizerData.metrics = metrics
      optimizerData.accountBalance = accountBalance
    }

    // 设置数据总览统计 - 模拟数据
    overviewStats.totalCustomers = 12
    overviewStats.totalRevenue = 2850000
    overviewStats.averageROAS = 2.8
    overviewStats.activeProjects = 8

  } catch (error) {
    console.error('Failed to load Criteo optimizer data:', error)
  } finally {
    loading.value = false
  }
}

// 单独加载账户余额数据
const loadAccountBalance = async () => {
  try {
    let accountBalance: AccountBalanceData | null = null
    try {
      accountBalance = await businessAPI.getCriteoAccountBalance()
    } catch (error) {
      console.error('Failed to refresh Criteo account balance, using fallback:', error)
      accountBalance = await businessAPI.getGoogleAccountBalance()
    }
    if (accountBalance) {
      optimizerData.accountBalance = accountBalance
    }
  } catch (error) {
    console.error('Failed to refresh account balance:', error)
  }
}

// 事件处理器
const handleRoleChange = (role: string) => {
  currentRole.value = role
}

const toggleSummary = () => {
  showSummary.value = !showSummary.value
}

const handleViewAlerts = () => {
  console.log('View Criteo balance alerts')
}

const handleOptimizeAccounts = () => {
  console.log('Optimize Criteo accounts')
}

const handleCheckBudgets = () => {
  console.log('Check Criteo budgets')
}

const handleAnalyzePerformance = () => {
  console.log('Analyze Criteo performance')
}

const handleViewDetails = (section: string) => {
  console.log('View Criteo details for:', section)
}

const handleRemindCustomer = (account: CustomerAccountBalance) => {
  console.log('Remind Criteo customer:', account.customerName)
}

const handleViewAccountDetails = (account: CustomerAccountBalance) => {
  console.log('View Criteo account details:', account.adAccount)
}

const handleBatchRemind = (accounts: CustomerAccountBalance[]) => {
  console.log('Batch remind Criteo customers:', accounts.length)
}

const handleBatchExport = (accounts: CustomerAccountBalance[]) => {
  console.log('Batch export Criteo accounts:', accounts.length)
}

const handleTimeRangeChange = (timeRange: TimeRange) => {
  console.log('Criteo time range changed:', timeRange)
  // 根据时间范围重新加载Criteo广告数据
}

const handleInvestigateAlert = (customer: CriteoAdsCustomerData) => {
  console.log('Investigate Criteo alert for customer:', customer.customerName)
}

const handleOptimizeCustomer = (customer: CriteoAdsCustomerData) => {
  console.log('Optimize Criteo customer:', customer.customerName)
}

const handleViewCriteoAdsDetails = (customer: CriteoAdsCustomerData) => {
  console.log('View Criteo ads details for customer:', customer.customerName)
}

// 组件挂载时加载数据
onMounted(() => {
  loadOptimizerData()
})
</script>

<style scoped>
.criteo-optimizer-dashboard {
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

.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* 数据总览节区样式 */
.data-overview-section {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
}

.section-title {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 16px;
}

.section-icon {
  font-size: 24px;
  margin-top: 2px;
}

.title-content h3 {
  margin: 0 0 4px 0;
  font-size: 18px;
  font-weight: 600;
  color: #262626;
}

.title-content p {
  margin: 0;
  color: #8c8c8c;
  font-size: 14px;
}

/* 数据总览内容 */
.data-overview-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.overview-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
  border-left: 4px solid #722ed1;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(114, 46, 209, 0.15);
}

.stat-icon {
  font-size: 32px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #722ed1 0%, #9254de 100%);
  border-radius: 8px;
  color: #fff;
  flex-shrink: 0;
}

.stat-info {
  flex: 1;
  min-width: 0;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #262626;
  margin-bottom: 4px;
  line-height: 1.2;
}

.stat-label {
  font-size: 13px;
  color: #8c8c8c;
  font-weight: 500;
}

/* 加载状态 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #f0f0f0;
  border-top: 3px solid #722ed1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.loading-text {
  color: #595959;
  font-size: 14px;
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .criteo-optimizer-dashboard {
    padding: 16px;
  }

  .dashboard-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .dashboard-title {
    font-size: 20px;
  }

  .section-title {
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }

  .section-icon {
    font-size: 20px;
  }

  .title-content h3 {
    font-size: 16px;
  }

  .overview-stats {
    grid-template-columns: 1fr;
  }

  .stat-card {
    padding: 12px;
  }

  .stat-icon {
    width: 40px;
    height: 40px;
    font-size: 24px;
  }

  .stat-value {
    font-size: 20px;
  }
}

@media (max-width: 480px) {
  .criteo-optimizer-dashboard {
    padding: 12px;
  }

  .dashboard-header {
    padding: 16px;
  }

  .data-overview-section {
    padding: 16px;
  }

  .section-title {
    padding-bottom: 12px;
    margin-bottom: 16px;
  }

  .stat-card {
    flex-direction: column;
    text-align: center;
    gap: 8px;
  }

  .stat-info {
    min-width: auto;
  }
}

/* Criteo品牌色彩主题 */
.criteo-optimizer-dashboard .dashboard-header {
  border-top: 4px solid #722ed1;
}

/* 为Criteo定制的颜色主题 */
.criteo-optimizer-dashboard .stat-card {
  border-left-color: #722ed1;
}

.criteo-optimizer-dashboard .loading-spinner {
  border-top-color: #722ed1;
}
</style>
