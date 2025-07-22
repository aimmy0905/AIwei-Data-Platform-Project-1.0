<template>
  <div class="sales-person-dashboard">
    <div class="dashboard-header">
      <div class="dashboard-header__left">
        <h1 class="dashboard-title">销售人员看板</h1>
        <p class="dashboard-subtitle">追踪个人业绩，管理客户关系</p>
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
      <p>正在加载个人数据...</p>
    </div>

    <div v-else class="dashboard-content">
      <!-- 个人绩效概览 -->
      <PersonalPerformanceCards
        :personal-performance="personalPerformanceData"
        :loading="loading"
        @view-targets="handleViewTargets"
        @manage-customers="handleManageCustomers"
        @renewal-tasks="handleRenewalTasks"
        @generate-report="handleGenerateReport"
      />

      <!-- 目标达成分析 -->
      <PersonalTargetAchievementModule
        :personal-performance="personalPerformanceData"
        :loading="loading"
        @time-range-change="handleTimeRangeChange"
      />

      <!-- 个人平台分布 -->
      <PersonalPlatformDistributionModule
        :platform-performance="platformPerformanceData"
        :loading="loading"
        @platform-click="handlePlatformClick"
        @optimization-action="handleOptimizationAction"
      />

      <!-- 客户管理 -->
      <PersonalCustomerManagementModule
        :customer-categories="customerCategoriesData"
        :customer-details="customerDetailsData"
        :loading="loading"
        @add-customer="handleAddCustomer"
        @contact-customer="handleContactCustomer"
        @view-customer-details="handleViewCustomerDetails"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { businessAPI } from '@/mock/business'
import RoleSwitcher from '@/components/business/RoleSwitcher.vue'
import PersonalPerformanceCards from '@/components/business/PersonalPerformanceCards.vue'
import PersonalTargetAchievementModule from '@/components/business/PersonalTargetAchievementModule.vue'
import PersonalPlatformDistributionModule from '@/components/business/PersonalPlatformDistributionModule.vue'
import PersonalCustomerManagementModule from '@/components/business/PersonalCustomerManagementModule.vue'
import type { 
  BusinessRole,
  PersonalPerformance,
  PersonalCustomerCategory,
  PersonalPlatformPerformance,
  PersonalCustomerDetail,
  PersonalRenewalTask,
  TimeRange
} from '@/types'

const currentRole = ref('sales_person')
const availableRoles = ref<BusinessRole[]>([])
const loading = ref(true)

// 数据状态
const personalPerformanceData = ref<PersonalPerformance>({
  employeeId: '',
  employeeName: '',
  serviceFeeTarget: 0,
  serviceFeeActual: 0,
  newOrdersTarget: 0,
  newOrdersActual: 0,
  serviceFeeCompletionRate: 0,
  newOrdersCompletionRate: 0,
  overallCompletionRate: 0,
  teamRanking: 0,
  totalTeamMembers: 0,
  assignedCustomerCount: 0,
  monthlyTrend: { currentMonth: 0, lastMonth: 0, trendDirection: 'stable' }
})

const customerCategoriesData = ref<PersonalCustomerCategory[]>([])
const platformPerformanceData = ref<PersonalPlatformPerformance[]>([])
const customerDetailsData = ref<PersonalCustomerDetail[]>([])
const renewalTasksData = ref<PersonalRenewalTask[]>([])

// 事件处理
const handleRoleChange = (role: string) => {
  currentRole.value = role
}

const handleViewTargets = () => {
  console.log('View targets clicked')
}

const handleManageCustomers = () => {
  console.log('Manage customers clicked')
}

const handleRenewalTasks = () => {
  console.log('Renewal tasks clicked')
}

const handleGenerateReport = () => {
  console.log('Generate report clicked')
}

const handleTimeRangeChange = (timeRange: TimeRange) => {
  console.log('Time range changed:', timeRange)
  // 根据时间筛选重新加载数据
  loadDashboardData()
}

const handlePlatformClick = (platform: string) => {
  console.log('Platform clicked:', platform)
}

const handleOptimizationAction = (recommendation: any) => {
  console.log('Optimization action:', recommendation)
}

const handleAddCustomer = () => {
  console.log('Add customer clicked')
}

const handleContactCustomer = (customer: PersonalCustomerDetail) => {
  console.log('Contact customer:', customer)
}

const handleViewCustomerDetails = (customer: PersonalCustomerDetail) => {
  console.log('View customer details:', customer)
}

// 数据加载
const loadDashboardData = async () => {
  try {
    loading.value = true
    
    // 并行加载所有数据
    const [
      personalPerformanceResponse,
      customerCategoriesResponse,
      platformPerformanceResponse,
      customerDetailsResponse,
      renewalTasksResponse
    ] = await Promise.all([
      businessAPI.getPersonalPerformance(),
      businessAPI.getPersonalCustomerCategories(),
      businessAPI.getPersonalPlatformPerformance(),
      businessAPI.getPersonalCustomerDetails(),
      businessAPI.getPersonalRenewalTasks()
    ])
    
    // 更新状态
    personalPerformanceData.value = personalPerformanceResponse
    customerCategoriesData.value = customerCategoriesResponse
    platformPerformanceData.value = platformPerformanceResponse
    customerDetailsData.value = customerDetailsResponse
    renewalTasksData.value = renewalTasksResponse
  } catch (error) {
    console.error('Failed to load dashboard data:', error)
  } finally {
    loading.value = false
  }
}

// 初始化
onMounted(async () => {
  await loadDashboardData()
})
</script>

<style scoped>
.sales-person-dashboard {
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
  .sales-person-dashboard {
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
}
</style>