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
        :title="'新老客户分析及流失客户分析（总计）'"
        :loading="loading"
        @view-change="handleCustomerViewChange"
        @chart-click="handleCustomerChartClick"
      />

      <!-- 客户分析模块（部门） -->
      <div class="department-customer-analysis-section">
        <div class="section-header">
          <h3>新老客户分析及流失客户分析（部门）</h3>
          <div class="department-selector">
            <select v-model="selectedDepartment" @change="handleDepartmentSelect">
              <option value="">全部部门</option>
              <option 
                v-for="dept in departmentCustomerAnalysisData" 
                :key="dept.departmentId" 
                :value="dept.departmentId"
              >
                {{ dept.departmentName }}
              </option>
            </select>
          </div>
        </div>
        <CustomerAnalysisModule
          v-if="selectedDepartmentCustomerData"
          :customer-data="selectedDepartmentCustomerData.customerData"
          :title="`${selectedDepartmentCustomerData.departmentName} - 客户分析`"
          :loading="loading"
          @view-change="handleCustomerViewChange"
          @chart-click="handleCustomerChartClick"
        />
      </div>

      <!-- 平台分析和其他模块将在后续添加 -->
      <div class="more-modules-placeholder">
        <div class="placeholder-card">
          <div class="placeholder-content">
            <h4>更多功能模块</h4>
            <p>平台新增及流失模块、平台毛利贡献分析、客户质量评估等模块正在完善中...</p>
            <div class="module-list">
              <div class="module-item">📈 平台新增及流失模块（总计/部门）</div>
              <div class="module-item">💰 平台毛利贡献分析模块（总计/部门）</div>
              <div class="module-item">⭐ 客户质量评估模块（总计/部门）</div>
              <div class="module-item">🏆 客户贡献模块（总计）</div>
              <div class="module-item">🔄 续费客户名单模块</div>
            </div>
          </div>
        </div>
      </div>
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

/* 部门客户分析区域 */
.department-customer-analysis-section {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-bottom: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.section-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #262626;
}

.department-selector select {
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  background: #fff;
  color: #262626;
  font-size: 14px;
  cursor: pointer;
}

.department-selector select:focus {
  outline: none;
  border-color: #40a9ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

/* 更多模块占位区域 */
.more-modules-placeholder {
  margin-top: 24px;
}

.placeholder-card {
  background: #fff;
  border: 2px dashed #d9d9d9;
  border-radius: 8px;
  padding: 40px;
  text-align: center;
}

.placeholder-content h4 {
  margin: 0 0 16px 0;
  font-size: 18px;
  color: #262626;
}

.placeholder-content p {
  margin: 0 0 24px 0;
  color: #8c8c8c;
  font-size: 14px;
}

.module-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 12px;
  max-width: 800px;
  margin: 0 auto;
}

.module-item {
  padding: 12px 16px;
  background: #fafafa;
  border-radius: 6px;
  color: #595959;
  font-size: 13px;
  text-align: left;
}
</style>