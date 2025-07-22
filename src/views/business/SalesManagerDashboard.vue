<template>
  <div class="sales-manager-dashboard">
    <div class="dashboard-header">
      <div class="dashboard-header__left">
        <h1 class="dashboard-title">销售经理看板</h1>
        <p class="dashboard-subtitle">管理团队业绩，优化销售策略</p>
      </div>

      <div class="dashboard-header__right">
        <RoleSwitcher
          :current-role="currentRole"
          :available-roles="availableRoles"
          @role-change="handleRoleChange"
        />
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>正在加载数据...</p>
    </div>

    <div v-else class="dashboard-content">
      <!-- 时间筛选器 -->
      <TimeFilterSync
        :modules="['overview', 'target', 'service-fee', 'sales', 'profit', 'renewal']"
        @time-change="handleTimeFilterChange"
        @sync-change="handleSyncChange"
      />

      <!-- 团队概览卡片 -->
      <TeamOverviewCards
        :team-data="teamMetrics"
        :loading="loading"
      />

      <!-- 目标完成情况 -->
      <TargetCompletionModule
        :team-members="teamMemberPerformance"
        :team-ranking="teamStatistics.teamRanking"
        :total-teams="teamStatistics.totalTeams"
        :loading="loading"
        @quarter-change="handleQuarterChange"
      />

      <!-- 新单服务费及单量完成 -->
      <NewOrderServiceFeeModule
        :platform-data="platformDistribution"
        :loading="loading"
        @platform-click="handlePlatformClick"
      />

      <!-- 销售完成情况 -->
      <SalesCompletionModule
        :team-members="teamMemberPerformance"
        :team-statistics="teamStatistics"
        :loading="loading"
      />

      <!-- 客户毛利明细 -->
      <CustomerProfitDetailsModule
        :customer-details="customerProfitDetails"
        :loading="loading"
        @customer-click="handleCustomerClick"
      />

      <!-- 续费客户名单 -->
      <RenewalCustomerListModule
        :renewal-customers="renewalCustomers"
        :loading="loading"
        @follow-up="handleFollowUp"
        @view-details="handleViewDetails"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { businessAPI } from '@/mock/business'
import RoleSwitcher from '@/components/business/RoleSwitcher.vue'
import TimeFilterSync from '@/components/business/TimeFilterSync.vue'
import TeamOverviewCards from '@/components/business/TeamOverviewCards.vue'
import TargetCompletionModule from '@/components/business/TargetCompletionModule.vue'
import NewOrderServiceFeeModule from '@/components/business/NewOrderServiceFeeModule.vue'
import SalesCompletionModule from '@/components/business/SalesCompletionModule.vue'
import CustomerProfitDetailsModule from '@/components/business/CustomerProfitDetailsModule.vue'
import RenewalCustomerListModule from '@/components/business/RenewalCustomerListModule.vue'
import type {
  BusinessRole,
  TeamMetrics,
  TeamMemberPerformance,
  TeamSalesStatistics,
  PlatformData,
  CustomerProfitDetail,
  RenewalCustomerData,
  Quarter,
  ModuleTimeFilter
} from '@/types'

const currentRole = ref('sales_manager')
const availableRoles = ref<BusinessRole[]>([])
const loading = ref(true)
const isLoadingData = ref(false) // 防止数据加载过程中的重复触发

// 防抖相关
let timeFilterDebounceTimer: number | null = null

// 数据状态
const teamMetrics = ref<TeamMetrics>({
  teamId: '',
  teamName: '',
  memberCount: 0,
  totalServiceFee: 0,
  totalNewOrders: 0,
  totalCustomers: 0,
  averageCompletionRate: 0,
  teamRanking: 0,
  topPerformer: { employeeId: '', employeeName: '', completionRate: 0 }
})

const teamMemberPerformance = ref<TeamMemberPerformance[]>([])
const teamStatistics = ref<TeamSalesStatistics>({
  teamCompletionRate: 0,
  teamRanking: 0,
  totalTeams: 0,
  memberDistribution: { excellent: 0, good: 0, needImprovement: 0 },
  monthlyTrend: { currentMonth: 0, lastMonth: 0, trendDirection: 'stable' }
})

const platformDistribution = ref<PlatformData[]>([])
const customerProfitDetails = ref<CustomerProfitDetail[]>([])
const renewalCustomers = ref<RenewalCustomerData[]>([])

// 事件处理
const handleRoleChange = (role: string) => {
  currentRole.value = role
}

const handleTimeFilterChange = (filters: ModuleTimeFilter[]) => {
  // 防止在数据加载过程中重复触发
  if (isLoadingData.value) {
    return
  }

  // 清除之前的防抖定时器
  if (timeFilterDebounceTimer) {
    clearTimeout(timeFilterDebounceTimer)
  }

  // 使用防抖避免频繁触发
  timeFilterDebounceTimer = setTimeout(() => {
    console.log('Time filters changed:', filters)
    // 根据时间筛选重新加载数据
    loadDashboardData()
    timeFilterDebounceTimer = null
  }, 300) // 300ms 防抖延迟
}

const handleSyncChange = (isSynced: boolean) => {
  console.log('Sync changed:', isSynced)
}

const handleQuarterChange = (quarter: Quarter) => {
  console.log('Quarter changed:', quarter)
}

const handlePlatformClick = (platform: string) => {
  console.log('Platform clicked:', platform)
}

const handleCustomerClick = (customer: CustomerProfitDetail) => {
  console.log('Customer clicked:', customer)
}

const handleFollowUp = (customer: RenewalCustomerData) => {
  console.log('Follow up customer:', customer)
}

const handleViewDetails = (customer: RenewalCustomerData) => {
  console.log('View customer details:', customer)
}

// 数据加载
const loadDashboardData = async () => {
  try {
    // 防止重复加载
    if (isLoadingData.value) {
      return
    }

    loading.value = true
    isLoadingData.value = true

    // 并行加载所有数据
    const [
      teamMetricsResponse,
      teamMembersResponse,
      teamStatsResponse,
      platformDataResponse,
      customerDetailsResponse,
      renewalCustomersResponse
    ] = await Promise.all([
      businessAPI.getTeamMetrics(),
      businessAPI.getTeamMemberPerformance(),
      businessAPI.getTeamSalesStatistics(),
      businessAPI.getTeamPlatformDistribution(),
      businessAPI.getTeamCustomerProfitDetails(),
      businessAPI.getTeamRenewalCustomers()
    ])

    // 更新状态
    teamMetrics.value = teamMetricsResponse
    teamMemberPerformance.value = teamMembersResponse
    teamStatistics.value = teamStatsResponse
    platformDistribution.value = platformDataResponse
    customerProfitDetails.value = customerDetailsResponse
    renewalCustomers.value = renewalCustomersResponse
  } catch (error) {
    console.error('Failed to load dashboard data:', error)
  } finally {
    loading.value = false
    isLoadingData.value = false
  }
}

// 初始化
onMounted(async () => {
  await loadDashboardData()
})

// 清理
onUnmounted(() => {
  if (timeFilterDebounceTimer) {
    clearTimeout(timeFilterDebounceTimer)
    timeFilterDebounceTimer = null
  }
})
</script>

<style scoped>
.sales-manager-dashboard {
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

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #f0f0f0;
  border-top: 4px solid #1890ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-state p {
  color: #8c8c8c;
  font-size: 16px;
  margin: 0;
}

.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: 0;
}

@media (max-width: 768px) {
  .sales-manager-dashboard {
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
}</style>
