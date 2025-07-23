<template>
  <div class="project-manager-dashboard">
    <div class="dashboard-header">
      <div class="dashboard-header__left">
        <h1 class="dashboard-title">项目经理看板</h1>
        <p class="dashboard-subtitle">管理部门项目，协调团队资源</p>
      </div>

      <div class="dashboard-header__right">
        <div class="department-selector">
          <select v-model="selectedDepartmentId" @change="handleDepartmentChange" class="department-select">
            <option value="DEPT_PM_001">华东营销部</option>
            <option value="DEPT_PM_002">华南营销部</option>
            <option value="DEPT_PM_003">华北营销部</option>
          </select>
        </div>
        <RoleSwitcher
          :current-role="currentRole"
          :available-roles="availableRoles"
          @role-change="handleRoleChange"
        />
      </div>
    </div>

    <div class="dashboard-content" v-if="!loading && isDataLoaded">
      <!-- 部门概览卡片 -->
      <DepartmentOverviewCards
        :department-metrics="departmentData.metrics!"
        :show-comparison="false"
        :loading="loading"
        @view-details="handleViewDetails"
      />

      <!-- 部门运营目标完成模块 -->
      <DepartmentOperationTargetModule
        :department-target="departmentData.target!"
        :all-departments="allDepartmentsComparison.departmentTargets"
        :loading="loading"
        @time-range-change="handleTimeRangeChange"
      />

      <!-- 部门客户分析模块 -->
      <DepartmentCustomerAnalysisModule
        :department-customer-analysis="departmentData.customerAnalysis!"
        :all-departments="allDepartmentsComparison.departmentCustomerAnalysis"
        :loading="loading"
        @view-change="handleViewChange"
        @chart-click="handleChartClick"
        @comparison-change="handleComparisonChange"
      />

      <!-- 部门平台分析模块 -->
      <DepartmentPlatformAnalysisModule
        :department-platform-analysis="departmentData.platformAnalysis!"
        :all-departments="allDepartmentsComparison.departmentPlatformAnalysis"
        :loading="loading"
        @view-change="handleViewChange"
        @chart-click="handleChartClick"
        @platform-change="handlePlatformChange"
      />

      <!-- 部门毛利贡献模块 -->
      <DepartmentProfitContributionModule
        :department-profit-contribution="departmentData.profitContribution!"
        :all-departments="allDepartmentsComparison.departmentProfitContribution"
        :loading="loading"
        @view-change="handleViewChange"
        @chart-click="handleChartClick"
      />
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p class="loading-text">正在加载部门数据...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import RoleSwitcher from '@/components/business/RoleSwitcher.vue'
import DepartmentOverviewCards from '@/components/business/DepartmentOverviewCards.vue'
import DepartmentOperationTargetModule from '@/components/business/DepartmentOperationTargetModule.vue'
import DepartmentCustomerAnalysisModule from '@/components/business/DepartmentCustomerAnalysisModule.vue'
import DepartmentPlatformAnalysisModule from '@/components/business/DepartmentPlatformAnalysisModule.vue'
import DepartmentProfitContributionModule from '@/components/business/DepartmentProfitContributionModule.vue'
import { businessAPI } from '@/mock/business'
import type {
  BusinessRole,
  DepartmentMetrics,
  DepartmentTargetData,
  DepartmentCustomerAnalysis,
  DepartmentPlatformAnalysis,
  DepartmentProfitContribution,
  TimeRange
} from '@/types'

const currentRole = ref('project_manager')
const availableRoles = ref<BusinessRole[]>([])
const selectedDepartmentId = ref('DEPT_PM_001')
const loading = ref(false)

// 计算属性：检查所有数据是否已加载
const isDataLoaded = computed(() => {
  return departmentData.metrics !== null &&
         departmentData.target !== null &&
         departmentData.customerAnalysis !== null &&
         departmentData.platformAnalysis !== null &&
         departmentData.profitContribution !== null
})

// 部门数据
const departmentData = reactive<{
  metrics: DepartmentMetrics | null
  target: DepartmentTargetData | null
  customerAnalysis: DepartmentCustomerAnalysis | null
  platformAnalysis: DepartmentPlatformAnalysis | null
  profitContribution: DepartmentProfitContribution | null
}>({
  metrics: null,
  target: null,
  customerAnalysis: null,
  platformAnalysis: null,
  profitContribution: null
})

// 所有部门对比数据
const allDepartmentsComparison = reactive<{
  departments: DepartmentMetrics[]
  departmentTargets: DepartmentTargetData[]
  departmentCustomerAnalysis: DepartmentCustomerAnalysis[]
  departmentPlatformAnalysis: DepartmentPlatformAnalysis[]
  departmentProfitContribution: DepartmentProfitContribution[]
}>({
  departments: [],
  departmentTargets: [],
  departmentCustomerAnalysis: [],
  departmentPlatformAnalysis: [],
  departmentProfitContribution: []
})

// 加载数据
const loadDepartmentData = async () => {
  try {
    loading.value = true

    // 并行加载所有数据
    const [metrics, target, customerAnalysis, platformAnalysis, profitContribution, allDepartments] = await Promise.all([
      businessAPI.getDepartmentMetrics(),
      businessAPI.getDepartmentTarget(),
      businessAPI.getDepartmentCustomerAnalysisForManager(),
      businessAPI.getDepartmentPlatformAnalysis(),
      businessAPI.getDepartmentProfitContribution(),
      businessAPI.getAllDepartmentsData()
    ])

    // 设置部门数据
    departmentData.metrics = metrics
    departmentData.target = target
    departmentData.customerAnalysis = customerAnalysis
    departmentData.platformAnalysis = platformAnalysis
    departmentData.profitContribution = profitContribution

    // 设置对比数据
    allDepartmentsComparison.departments = allDepartments.departments
    allDepartmentsComparison.departmentTargets = allDepartments.departmentTargets
    allDepartmentsComparison.departmentCustomerAnalysis = allDepartments.departmentCustomerAnalysis
    allDepartmentsComparison.departmentPlatformAnalysis = allDepartments.departmentPlatformAnalysis
    allDepartmentsComparison.departmentProfitContribution = allDepartments.departmentProfitContribution

  } catch (error) {
    console.error('Failed to load department data:', error)
  } finally {
    loading.value = false
  }
}

// 事件处理器
const handleRoleChange = (role: string) => {
  currentRole.value = role
}

const handleDepartmentChange = () => {
  console.log('Department changed to:', selectedDepartmentId.value)
  // 在实际应用中，这里会重新加载选定部门的数据
  loadDepartmentData()
}

const handleViewDetails = (section: string) => {
  console.log('View details for:', section)
}

const handleTimeRangeChange = (timeRange: TimeRange) => {
  console.log('Time range changed:', timeRange)
  // 根据时间范围重新加载数据
}

const handleViewChange = (view: string) => {
  console.log('View changed to:', view)
}

const handleChartClick = (data: unknown) => {
  console.log('Chart clicked:', data)
}

const handleComparisonChange = (metric: string) => {
  console.log('Comparison metric changed to:', metric)
}

const handlePlatformChange = (platform: string) => {
  console.log('Platform changed to:', platform)
}

// 组件挂载时加载数据
onMounted(() => {
  loadDepartmentData()
})
</script>

<style scoped>
.project-manager-dashboard {
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

.dashboard-header__right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.department-selector {
  display: flex;
  align-items: center;
  gap: 8px;
}

.department-select {
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  background: #fff;
  color: #262626;
  font-size: 14px;
  outline: none;
  cursor: pointer;
  transition: border-color 0.2s;
}

.department-select:hover {
  border-color: #40a9ff;
}

.department-select:focus {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
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

.loading-container {
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
  width: 40px;
  height: 40px;
  border: 4px solid #f0f0f0;
  border-top: 4px solid #1890ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  color: #8c8c8c;
  margin: 0;
  font-size: 14px;
}

@media (max-width: 768px) {
  .project-manager-dashboard {
    padding: 16px;
  }

  .dashboard-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .dashboard-header__right {
    justify-content: space-between;
  }

  .dashboard-content {
    gap: 16px;
  }
}
</style>
