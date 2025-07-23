<template>
  <div class="google-optimizer-dashboard">
    <div class="dashboard-header">
      <div class="dashboard-header__left">
        <h1 class="dashboard-title">Google优化师看板</h1>
        <p class="dashboard-subtitle">专注Google平台客户优化与数据分析</p>
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

      <!-- Google广告数据总览模块 -->
      <GoogleAdsOverviewModule
        :ads-data="optimizerData.adsOverview!"
        :loading="loading"
        @time-range-change="handleTimeRangeChange"
        @investigate-alert="handleInvestigateAlert"
        @optimize-customer="handleOptimizeCustomer"
        @view-customer-details="handleViewAdsCustomerDetails"
      />
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p class="loading-text">正在加载Google优化师数据...</p>
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
import GoogleAdsOverviewModule from '@/components/business/GoogleAdsOverviewModule.vue'
import { businessAPI } from '@/mock/business'
import type {
  BusinessRole,
  OptimizerMetrics,
  OptimizerTargetData,
  OptimizerCustomerAnalysisData,
  OptimizerCustomerQualityData,
  AccountBalanceData,
  GoogleAdsOverviewData,
  CustomerAccountBalance,
  AnomalyAlert,
  CustomerGoogleAdsData,
  TimeRange
} from '@/types'

const currentRole = ref('google_optimizer')
const availableRoles = ref<BusinessRole[]>([])
const loading = ref(false)
const showSummary = ref(false)

// Google优化师数据
const optimizerData = reactive<{
  metrics: OptimizerMetrics | null
  targets: OptimizerTargetData | null
  customerAnalysis: OptimizerCustomerAnalysisData | null
  customerQuality: OptimizerCustomerQualityData | null
  accountBalance: AccountBalanceData | null
  adsOverview: GoogleAdsOverviewData | null
}>({
  metrics: null,
  targets: null,
  customerAnalysis: null,
  customerQuality: null,
  accountBalance: null,
  adsOverview: null
})

// 计算属性：检查所有数据是否已加载
const isDataLoaded = computed(() => {
  return optimizerData.metrics !== null &&
         optimizerData.targets !== null &&
         optimizerData.customerAnalysis !== null &&
         optimizerData.customerQuality !== null &&
         optimizerData.accountBalance !== null &&
         optimizerData.adsOverview !== null
})

// 加载数据
const loadOptimizerData = async () => {
  try {
    loading.value = true

    // 并行加载所有数据
    const [metrics, targets, customerAnalysis, customerQuality, accountBalance, adsOverview] = await Promise.all([
      businessAPI.getGoogleOptimizerMetrics(),
      businessAPI.getGoogleOptimizerTargets(),
      businessAPI.getGoogleOptimizerCustomerAnalysis(),
      businessAPI.getGoogleOptimizerCustomerQuality(),
      businessAPI.getGoogleAccountBalance(),
      businessAPI.getGoogleAdsOverview()
    ])

    // 设置数据
    optimizerData.metrics = metrics
    optimizerData.targets = targets
    optimizerData.customerAnalysis = customerAnalysis
    optimizerData.customerQuality = customerQuality
    optimizerData.accountBalance = accountBalance
    optimizerData.adsOverview = adsOverview

  } catch (error) {
    console.error('Failed to load Google optimizer data:', error)
  } finally {
    loading.value = false
  }
}

// 单独加载账户余额数据
const loadAccountBalance = async () => {
  try {
    const accountBalance = await businessAPI.getGoogleAccountBalance()
    optimizerData.accountBalance = accountBalance
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
  console.log('View balance alerts')
}

const handleOptimizeAccounts = () => {
  console.log('Optimize accounts')
}

const handleCheckBudgets = () => {
  console.log('Check budgets')
}

const handleAnalyzePerformance = () => {
  console.log('Analyze performance')
}

const handleViewDetails = (section: string) => {
  console.log('View details for:', section)
}

const handleQuarterChange = (quarter: string) => {
  console.log('Quarter changed to:', quarter)
  // 根据季度重新加载相关数据
}

const handleViewCustomerDetails = (customerId: string) => {
  console.log('View customer details:', customerId)
}

const handleViewSegmentDetails = (segment: string) => {
  console.log('View segment details:', segment)
}

const handleRemindCustomer = (account: CustomerAccountBalance) => {
  console.log('Remind customer:', account.customerName)
}

const handleViewAccountDetails = (account: CustomerAccountBalance) => {
  console.log('View account details:', account.adAccount)
}

const handleBatchRemind = (accounts: CustomerAccountBalance[]) => {
  console.log('Batch remind customers:', accounts.length)
}

const handleBatchExport = (accounts: CustomerAccountBalance[]) => {
  console.log('Batch export accounts:', accounts.length)
}

const handleTimeRangeChange = (timeRange: TimeRange) => {
  console.log('Time range changed:', timeRange)
  // 根据时间范围重新加载广告数据
}

const handleInvestigateAlert = (alert: AnomalyAlert) => {
  console.log('Investigate alert:', alert.alertId)
}

const handleOptimizeCustomer = (customer: CustomerGoogleAdsData) => {
  console.log('Optimize customer:', customer.customerName)
}

const handleViewAdsCustomerDetails = (customer: CustomerGoogleAdsData) => {
  console.log('View ads customer details:', customer.customerName)
}

// 组件挂载时加载数据
onMounted(() => {
  loadOptimizerData()
})
</script>

<style scoped>
.google-optimizer-dashboard {
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

.coming-soon {
  text-align: center;
  padding: 80px 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.coming-soon-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.coming-soon h2 {
  color: #262626;
  margin-bottom: 12px;
}

.coming-soon p {
  color: #8c8c8c;
  max-width: 500px;
  margin: 0 auto;
}
</style>
