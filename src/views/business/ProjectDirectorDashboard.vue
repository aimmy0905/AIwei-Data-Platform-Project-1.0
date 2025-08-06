<template>
  <div class="project-director-dashboard">
    <div class="dashboard-header">
      <div class="dashboard-header__left">
        <h1 class="dashboard-title">项目总监看板</h1>
        <p class="dashboard-subtitle">全面管控运营数据，统筹项目资源</p>
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
      <p>正在加载项目总监数据...</p>
    </div>

    <div v-else class="dashboard-content">
      <!-- 总运营目标完成模块 -->
      <OperationTargetCompletionModule
        :operation-targets="operationTargetsData"
        :loading="loading"
        @time-range-change="handleTimeRangeChange"
        @quarter-change="handleQuarterChange"
      />

      <!-- 项目组完成情况模块 -->
      <DepartmentTargetCompletionModule
        :department-targets="departmentTargetsData"
        :loading="loading"
        @time-range-change="handleTimeRangeChange"
        @department-click="handleDepartmentClick"
      />

      <!-- 客户分析模块（总计） -->
      <CustomerAnalysisModule
        :customer-data="customerAnalysisTotalData"
        :department-data="departmentCustomerAnalysisData"
        :title="'新老客户分析及流失客户分析（总计）'"
        :loading="loading"
        :show-departments="true"
        @view-change="handleCustomerViewChange"
        @chart-click="handleCustomerChartClick"
      />


    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { businessAPI } from '@/mock/business'
import RoleSwitcher from '@/components/business/RoleSwitcher.vue'
import OperationTargetCompletionModule from '@/components/business/OperationTargetCompletionModule.vue'
import DepartmentTargetCompletionModule from '@/components/business/DepartmentTargetCompletionModule.vue'
import CustomerAnalysisModule from '@/components/business/CustomerAnalysisModule.vue'
import type {
  BusinessRole,
  OperationTargetData,
  DepartmentTargetData,
  CustomerAnalysisData,
  DepartmentCustomerAnalysis,
  TimeRange
} from '@/types'

const currentRole = ref('project_director')
const availableRoles = ref<BusinessRole[]>([])
const loading = ref(true)
const selectedDepartment = ref<string>('')

// 数据状态
const operationTargetsData = ref<OperationTargetData[]>([])
const departmentTargetsData = ref<DepartmentTargetData[]>([])
const customerAnalysisTotalData = ref<CustomerAnalysisData | null>(null)
const departmentCustomerAnalysisData = ref<DepartmentCustomerAnalysis[]>([])

// 计算属性
const selectedDepartmentCustomerData = computed(() => {
  if (!selectedDepartment.value) return null
  return departmentCustomerAnalysisData.value.find(
    dept => dept.departmentId === selectedDepartment.value
  ) || null
})

// 事件处理
const handleRoleChange = (role: string) => {
  currentRole.value = role
}

const handleTimeRangeChange = (timeRange: TimeRange) => {
  console.log('Time range changed:', timeRange)
  // 根据时间筛选重新加载数据
  loadDashboardData()
}

const handleQuarterChange = (quarter: string) => {
  console.log('Quarter changed:', quarter)
}

const handleDepartmentClick = (departmentId: string) => {
  console.log('Department clicked:', departmentId)
  selectedDepartment.value = departmentId
}

const handleCustomerViewChange = (view: string) => {
  console.log('Customer view changed:', view)
}

const handleCustomerChartClick = (data: any) => {
  console.log('Customer chart clicked:', data)
}

const handleDepartmentSelect = () => {
  console.log('Department selected:', selectedDepartment.value)
}

// 数据加载
const loadDashboardData = async () => {
  try {
    loading.value = true

    // 并行加载所有数据
    const [
      operationTargetsResponse,
      departmentTargetsResponse,
      customerAnalysisTotalResponse,
      departmentCustomerAnalysisResponse
    ] = await Promise.all([
      businessAPI.getOperationTargets(),
      businessAPI.getDepartmentTargets(),
      businessAPI.getCustomerAnalysisTotal(),
      businessAPI.getDepartmentCustomerAnalysis()
    ])

    // 更新状态
    operationTargetsData.value = operationTargetsResponse
    departmentTargetsData.value = departmentTargetsResponse
    customerAnalysisTotalData.value = customerAnalysisTotalResponse
    departmentCustomerAnalysisData.value = departmentCustomerAnalysisResponse

    // 默认选择第一个部门
    if (departmentCustomerAnalysisResponse.length > 0) {
      selectedDepartment.value = departmentCustomerAnalysisResponse[0].departmentId
    }
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
.project-director-dashboard {
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


</style>
