<template>
  <div class="meta-optimizer-dashboard">
    <div class="dashboard-header">
      <div class="dashboard-header__left">
        <h1 class="dashboard-title">Meta优化师看板</h1>
        <p class="dashboard-subtitle">专注Meta平台客户优化与数据分析</p>
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
      <!-- 个人业绩概览卡片 -->
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

      <!-- 运营目标模块 -->
      <OptimizerTargetModule
        :target-data="optimizerData.targets!"
        :loading="loading"
        @quarter-change="handleQuarterChange"
      />

      <!-- 新老客户分析模块 -->
      <OptimizerCustomerAnalysisModule
        :customer-analysis="optimizerData.customerAnalysis!"
        :loading="loading"
        @quarter-change="handleQuarterChange"
        @view-customer-details="handleViewCustomerDetails"
      />

      <!-- 客户质量评估模块 -->
      <OptimizerCustomerQualityModule
        :quality-data="optimizerData.customerQuality!"
        :loading="loading"
        @quarter-change="handleQuarterChange"
        @view-segment-details="handleViewSegmentDetails"
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
          <h3>客户数据总览</h3>
          <p>查看所有负责客户的详细数据信息</p>
        </div>
        <!-- 这里可以放置通用的客户数据总览组件 -->
        <div class="data-overview-placeholder">
          <div class="placeholder-content">
            <span class="placeholder-icon">📊</span>
            <h4>客户数据总览</h4>
            <p>显示所有负责客户的综合数据分析，包括基本信息、合作状态、业绩表现等</p>
          </div>
        </div>
      </div>

      <!-- Facebook广告数据总览模块 -->
      <FacebookAdsOverviewModule
        :loading="loading"
        @time-range-change="handleTimeRangeChange"
        @investigate-alert="handleInvestigateAlert"
        @optimize-customer="handleOptimizeCustomer"
        @view-customer-details="handleViewFacebookAdsDetails"
      />

      <!-- Bing广告数据对比模块 -->
      <div class="bing-ads-section">
        <div class="section-title">
          <h3>客户Bing广告数据总览</h3>
          <p>提供跨平台数据对比，帮助了解客户在不同平台的表现</p>
        </div>
        <div class="bing-ads-placeholder">
          <div class="placeholder-content">
            <span class="placeholder-icon">🔍</span>
            <h4>Bing广告数据对比</h4>
            <p>显示客户在Bing平台的投放数据，用于Meta平台效果对比分析</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p class="loading-text">正在加载Meta优化师数据...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import RoleSwitcher from '@/components/business/RoleSwitcher.vue'
import OptimizerMetricsCards from '@/components/business/OptimizerMetricsCards.vue'
import OptimizerTargetModule from '@/components/business/OptimizerTargetModule.vue'
import OptimizerCustomerAnalysisModule from '@/components/business/OptimizerCustomerAnalysisModule.vue'
import OptimizerCustomerQualityModule from '@/components/business/OptimizerCustomerQualityModule.vue'
import AccountBalanceModule from '@/components/business/AccountBalanceModule.vue'
import FacebookAdsOverviewModule from '@/components/business/FacebookAdsOverviewModule.vue'
import { businessAPI } from '@/mock/business'
import type {
  BusinessRole,
  OptimizerMetrics,
  OptimizerTargetData,
  OptimizerCustomerAnalysisData,
  OptimizerCustomerQualityData,
  AccountBalanceData,
  CustomerAccountBalance,
  TimeRange
} from '@/types'

// Facebook广告客户数据接口
interface FacebookAdsCustomerData {
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
  frequency: number
  audienceQuality: 'excellent' | 'good' | 'fair' | 'poor'
  creativePerformance: 'excellent' | 'good' | 'fair' | 'poor'
  pixelStatus: 'active' | 'warning' | 'error'
  estimatedDaysRemaining: number
  anomalyAlerts: Array<{
    type: 'cpc' | 'spend' | 'conversion' | 'frequency'
    severity: 'high' | 'medium' | 'low'
    message: string
    threshold: number
    currentValue: number
    detectedAt: string
  }>
}

const currentRole = ref('meta_optimizer')
const availableRoles = ref<BusinessRole[]>([])
const loading = ref(false)
const showSummary = ref(false)

// Meta优化师数据
const optimizerData = reactive<{
  metrics: OptimizerMetrics | null
  targets: OptimizerTargetData | null
  customerAnalysis: OptimizerCustomerAnalysisData | null
  customerQuality: OptimizerCustomerQualityData | null
  accountBalance: AccountBalanceData | null
}>({
  metrics: null,
  targets: null,
  customerAnalysis: null,
  customerQuality: null,
  accountBalance: null
})

// 计算属性：检查所有数据是否已加载
const isDataLoaded = computed(() => {
  return optimizerData.metrics !== null &&
         optimizerData.targets !== null &&
         optimizerData.customerAnalysis !== null &&
         optimizerData.customerQuality !== null &&
         optimizerData.accountBalance !== null
})

// 加载数据
const loadOptimizerData = async () => {
  try {
    loading.value = true

    // 并行加载所有数据 - 使用Meta优化师的API接口
    const [metrics, targets, customerAnalysis, customerQuality, accountBalance] = await Promise.all([
      businessAPI.getMetaOptimizerMetrics(),
      businessAPI.getMetaOptimizerTargets(),
      businessAPI.getMetaOptimizerCustomerAnalysis(),
      businessAPI.getMetaOptimizerCustomerQuality(),
      businessAPI.getMetaAccountBalance()
    ])

    // 设置数据
    optimizerData.metrics = metrics
    optimizerData.targets = targets
    optimizerData.customerAnalysis = customerAnalysis
    optimizerData.customerQuality = customerQuality
    optimizerData.accountBalance = accountBalance

  } catch (error) {
    console.error('Failed to load Meta optimizer data:', error)
    // 如果API不存在，使用Google优化师的API作为后备
    try {
      const [metrics, targets, customerAnalysis, customerQuality, accountBalance] = await Promise.all([
        businessAPI.getGoogleOptimizerMetrics(),
        businessAPI.getGoogleOptimizerTargets(),
        businessAPI.getGoogleOptimizerCustomerAnalysis(),
        businessAPI.getGoogleOptimizerCustomerQuality(),
        businessAPI.getGoogleAccountBalance()
      ])

      // 修改平台标识为Meta
      const metaMetrics = { ...metrics, platform: 'meta' }
      
      optimizerData.metrics = metaMetrics
      optimizerData.targets = targets
      optimizerData.customerAnalysis = customerAnalysis
      optimizerData.customerQuality = customerQuality
      optimizerData.accountBalance = accountBalance
    } catch (fallbackError) {
      console.error('Failed to load fallback data:', fallbackError)
    }
  } finally {
    loading.value = false
  }
}

// 单独加载账户余额数据
const loadAccountBalance = async () => {
  try {
    const accountBalance = await businessAPI.getMetaAccountBalance()
    optimizerData.accountBalance = accountBalance
  } catch (error) {
    console.error('Failed to refresh Meta account balance:', error)
    // 使用Google API作为后备
    try {
      const accountBalance = await businessAPI.getGoogleAccountBalance()
      optimizerData.accountBalance = accountBalance
    } catch (fallbackError) {
      console.error('Failed to refresh fallback account balance:', fallbackError)
    }
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
  console.log('View Meta balance alerts')
}

const handleOptimizeAccounts = () => {
  console.log('Optimize Meta accounts')
}

const handleCheckBudgets = () => {
  console.log('Check Meta budgets')
}

const handleAnalyzePerformance = () => {
  console.log('Analyze Meta performance')
}

const handleViewDetails = (section: string) => {
  console.log('View Meta details for:', section)
}

const handleQuarterChange = (quarter: string) => {
  console.log('Quarter changed to:', quarter)
  // 根据季度重新加载相关数据
}

const handleViewCustomerDetails = (customerId: string) => {
  console.log('View Meta customer details:', customerId)
}

const handleViewSegmentDetails = (segment: string) => {
  console.log('View Meta segment details:', segment)
}

const handleRemindCustomer = (account: CustomerAccountBalance) => {
  console.log('Remind Meta customer:', account.customerName)
}

const handleViewAccountDetails = (account: CustomerAccountBalance) => {
  console.log('View Meta account details:', account.adAccount)
}

const handleBatchRemind = (accounts: CustomerAccountBalance[]) => {
  console.log('Batch remind Meta customers:', accounts.length)
}

const handleBatchExport = (accounts: CustomerAccountBalance[]) => {
  console.log('Batch export Meta accounts:', accounts.length)
}

const handleTimeRangeChange = (timeRange: TimeRange) => {
  console.log('Meta time range changed:', timeRange)
  // 根据时间范围重新加载Facebook广告数据
}

const handleInvestigateAlert = (customer: FacebookAdsCustomerData) => {
  console.log('Investigate Meta alert for customer:', customer.customerName)
}

const handleOptimizeCustomer = (customer: FacebookAdsCustomerData) => {
  console.log('Optimize Meta customer:', customer.customerName)
}

const handleViewFacebookAdsDetails = (customer: FacebookAdsCustomerData) => {
  console.log('View Facebook ads details for customer:', customer.customerName)
}

// 组件挂载时加载数据
onMounted(() => {
  loadOptimizerData()
})
</script>

<style scoped>
.meta-optimizer-dashboard {
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

/* 通用节区样式 */
.data-overview-section,
.bing-ads-section {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
}

.section-title {
  margin-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 16px;
}

.section-title h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: #262626;
}

.section-title p {
  margin: 0;
  color: #8c8c8c;
  font-size: 14px;
}

/* 占位符样式 */
.data-overview-placeholder,
.bing-ads-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  background: #fafafa;
  border-radius: 8px;
  border: 2px dashed #d9d9d9;
}

.placeholder-content {
  text-align: center;
  max-width: 400px;
}

.placeholder-icon {
  font-size: 48px;
  margin-bottom: 16px;
  display: block;
}

.placeholder-content h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #262626;
}

.placeholder-content p {
  margin: 0;
  color: #8c8c8c;
  font-size: 14px;
  line-height: 1.5;
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
  border-top: 3px solid #1890ff;
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
  .meta-optimizer-dashboard {
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

  .section-title h3 {
    font-size: 16px;
  }

  .data-overview-placeholder,
  .bing-ads-placeholder {
    min-height: 150px;
    padding: 20px;
  }

  .placeholder-icon {
    font-size: 36px;
    margin-bottom: 12px;
  }

  .placeholder-content h4 {
    font-size: 14px;
  }

  .placeholder-content p {
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .meta-optimizer-dashboard {
    padding: 12px;
  }

  .dashboard-header {
    padding: 16px;
  }

  .data-overview-section,
  .bing-ads-section {
    padding: 16px;
  }

  .section-title {
    padding-bottom: 12px;
    margin-bottom: 16px;
  }
}
</style>