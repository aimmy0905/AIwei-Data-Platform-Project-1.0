<template>
  <div class="performance-view-new">
    <div class="page-header">
      <h1 class="page-title">绩效管理</h1>
      <p class="page-description">分部门多层级绩效考核管理系统</p>
    </div>

    <!-- 部门切换器 -->
    <div class="department-switcher">
      <div class="department-tabs">
        <button
          v-for="dept in departments"
          :key="dept.value"
          class="department-tab"
          :class="{ 'department-tab--active': selectedDepartment === dept.value }"
          @click="selectedDepartment = dept.value"
        >
          <component :is="dept.icon" :size="16" />
          {{ dept.label }}
        </button>
      </div>
    </div>

    <!-- 时间周期切换器 -->
    <div class="period-switcher">
      <div class="period-tabs">
        <button
          v-for="period in availablePeriodTypes"
          :key="period.value"
          class="period-tab"
          :class="{ 'period-tab--active': selectedPeriodType === period.value }"
          @click="selectedPeriodType = period.value"
        >
          <component :is="period.icon" :size="16" />
          {{ period.label }}
        </button>
      </div>

      <div class="period-selector">
        <select v-model="selectedPeriod" class="period-select">
          <option v-for="period in availablePeriods" :key="period.value" :value="period.value">
            {{ period.label }}
          </option>
        </select>
      </div>
    </div>

    <!-- 筛选器和操作区 -->
    <div class="filters-section">
      <div class="filters">
        <!-- 职级筛选 -->
        <div class="filter-group">
          <label class="filter-label">职级筛选</label>
          <select v-model="selectedPositionLevel" class="filter-select">
            <option value="">全部职级</option>
            <option value="staff">普通员工</option>
            <option value="manager">管理层</option>
          </select>
        </div>

        <!-- 状态筛选 -->
        <div class="filter-group">
          <label class="filter-label">考核状态</label>
          <select v-model="selectedStatus" class="filter-select">
            <option value="">全部状态</option>
            <option value="draft">草稿</option>
            <option value="in_progress">进行中</option>
            <option value="completed">已完成</option>
            <option value="approved">已审批</option>
          </select>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <button
          v-if="canSetTargets"
          class="btn btn--primary"
          @click="showTargetModal = true"
        >
          <Target :size="16" />
          设置目标
        </button>

        <button
          v-if="canRate"
          class="btn btn--secondary"
          @click="showRatingModal = true"
        >
          <Star :size="16" />
          {{ selectedDepartment === 'operations' ? '职能方案评分' : '过程管理评分' }}
        </button>

        <button class="btn btn--outline" @click="exportData">
          <Download :size="16" />
          导出数据
        </button>
      </div>
    </div>

    <!-- 统计概览卡片 -->
    <div class="stats-overview">
      <div class="stat-card stat-card--primary">
        <div class="stat-icon">
          <Users :size="20" />
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.totalEmployees }}</div>
          <div class="stat-label">参与考核人数</div>
          <div class="stat-trend">
            <TrendingUp :size="12" />
            <span>+5.2%</span>
          </div>
        </div>
      </div>

      <div class="stat-card stat-card--success">
        <div class="stat-icon">
          <Award :size="20" />
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.averageScore.toFixed(1) }}</div>
          <div class="stat-label">平均综合得分</div>
          <div class="stat-trend">
            <TrendingUp :size="12" />
            <span>+2.1%</span>
          </div>
        </div>
      </div>

      <div class="stat-card stat-card--info">
        <div class="stat-icon">
          <CheckCircle :size="20" />
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.completedCount }}</div>
          <div class="stat-label">已完成考核</div>
          <div class="stat-progress">
            <div class="progress-bar">
              <div
                class="progress-fill"
                :style="{ width: `${(stats.completedCount / stats.totalEmployees) * 100}%` }"
              ></div>
            </div>
            <span>{{ ((stats.completedCount / stats.totalEmployees) * 100).toFixed(1) }}%</span>
          </div>
        </div>
      </div>

      <div class="stat-card stat-card--warning">
        <div class="stat-icon">
          <Clock :size="20" />
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.pendingCount }}</div>
          <div class="stat-label">待完成考核</div>
          <div class="stat-deadline">
            <AlertCircle :size="12" />
            <span>{{ daysUntilDeadline }}天截止</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 运营部门绩效列表 -->
    <OperationsPerformanceTable
      v-if="selectedDepartment === 'operations'"
      :records="filteredOperationsRecords"
      :view-mode="viewMode"
      @view-details="viewDetails"
      @edit-record="editRecord"
      @rate-employee="rateEmployee"
      @view-all-performance="viewAllPerformance"
    />

    <!-- 销售部门绩效列表 -->
    <SalesPerformanceTable
      v-if="selectedDepartment === 'sales'"
      :records="filteredSalesRecords"
      :view-mode="viewMode"
      @view-details="viewDetails"
      @edit-record="editRecord"
      @rate-employee="rateEmployee"
      @view-all-performance="viewAllPerformance"
    />

    <!-- 详情弹窗 -->
    <PerformanceDetailModal
      v-if="showDetailModal"
      :record="selectedRecord"
      :department-type="selectedDepartment"
      @close="closeDetailModal"
    />

    <!-- 目标设置弹窗 -->
    <TargetSettingModal
      v-if="showTargetModal"
      :department-type="selectedDepartment"
      :available-periods="availablePeriods"
      @close="closeTargetModal"
      @submit="submitTarget"
    />

    <!-- 评分录入弹窗 -->
    <RatingModal
      v-if="showRatingModal"
      :department-type="selectedDepartment"
      :available-periods="availablePeriods"
      @close="closeRatingModal"
      @submit="submitRating"
    />

    <!-- 全部绩效弹窗 -->
    <AllPerformanceModal
      v-if="showAllPerformanceModal"
      :employee="selectedEmployeeForAll"
      :department-type="selectedDepartment"
      @close="closeAllPerformanceModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  Calendar,
  BarChart,
  TrendingUp,
  Users,
  Award,
  CheckCircle,
  Clock,
  AlertCircle,
  Target,
  Star,
  Download,
  Building2,
  ShoppingCart
} from 'lucide-vue-next'

// 导入新的配置和数据
import {
  currentUserRole,
  currentUserId,
  operationsPerformanceRecords,
  salesPerformanceRecords,
  getEmployeesByRole,
  getTargetSettableEmployees,
  getRatableEmployees,
  getGradeColor,
  getGradeDescription
} from '@/mock/performance-new'

import type {
  DepartmentType,
  PositionLevel,
  PeriodType,
  OperationsPerformanceRecord,
  SalesPerformanceRecord
} from '@/types/departments'

// 导入子组件（需要创建）
import OperationsPerformanceTable from '@/components/performance/OperationsPerformanceTable.vue'
import SalesPerformanceTable from '@/components/performance/SalesPerformanceTable.vue'
import PerformanceDetailModal from '@/components/performance/PerformanceDetailModal.vue'
import TargetSettingModal from '@/components/performance/TargetSettingModal.vue'
import RatingModal from '@/components/performance/RatingModal.vue'
import AllPerformanceModal from '@/components/performance/AllPerformanceModal.vue'

// 响应式数据
const selectedDepartment = ref<DepartmentType>('operations')
const selectedPeriodType = ref<PeriodType>('monthly')
const selectedPeriod = ref('2024-01')
const selectedPositionLevel = ref<PositionLevel | ''>('')
const selectedStatus = ref('')
const viewMode = ref<'table' | 'card'>('table')

// 模态框状态
const showDetailModal = ref(false)
const showTargetModal = ref(false)
const showRatingModal = ref(false)
const showAllPerformanceModal = ref(false)
const selectedRecord = ref<OperationsPerformanceRecord | SalesPerformanceRecord | null>(null)
const selectedEmployeeForAll = ref<OperationsPerformanceRecord | SalesPerformanceRecord | null>(null)

// 计算属性
const departments = computed(() => [
  { value: 'operations' as DepartmentType, label: '运营部门', icon: Building2 },
  { value: 'sales' as DepartmentType, label: '销售部门', icon: ShoppingCart }
])

const availablePeriodTypes = computed(() => {
  const types = [
    { value: 'monthly' as PeriodType, label: '月度考核', icon: Calendar }
  ]
  
  // 运营部门项目经理支持季度考核
  if (selectedDepartment.value === 'operations') {
    types.push({ value: 'quarterly' as PeriodType, label: '季度考核', icon: BarChart })
  }
  
  return types
})

const availablePeriods = computed(() => {
  const periods = []
  const currentYear = 2024

  if (selectedPeriodType.value === 'monthly') {
    for (let month = 1; month <= 12; month++) {
      const value = `${currentYear}-${month.toString().padStart(2, '0')}`
      const label = `${currentYear}年${month}月`
      periods.push({ value, label })
    }
  } else if (selectedPeriodType.value === 'quarterly') {
    for (let quarter = 1; quarter <= 4; quarter++) {
      const value = `${currentYear}-Q${quarter}`
      const label = `${currentYear}年第${quarter}季度`
      periods.push({ value, label })
    }
  }

  return periods
})

// 权限相关计算属性
const viewableEmployeeIds = computed(() => {
  return getEmployeesByRole(currentUserRole, currentUserId)
})

const canSetTargets = computed(() => {
  return getTargetSettableEmployees(currentUserRole, currentUserId).length > 0
})

const canRate = computed(() => {
  return getRatableEmployees(currentUserRole, currentUserId).length > 0
})

// 筛选后的绩效记录
const filteredOperationsRecords = computed(() => {
  return operationsPerformanceRecords.filter(record => {
    // 权限过滤
    if (!viewableEmployeeIds.value.includes(record.employee_id)) {
      return false
    }

    // 周期类型过滤
    if (record.period_type !== selectedPeriodType.value) {
      return false
    }

    // 具体周期过滤
    if (record.period !== selectedPeriod.value) {
      return false
    }

    // 职级过滤
    if (selectedPositionLevel.value && record.position_level !== selectedPositionLevel.value) {
      return false
    }

    // 状态过滤
    if (selectedStatus.value && record.status !== selectedStatus.value) {
      return false
    }

    return true
  })
})

const filteredSalesRecords = computed(() => {
  return salesPerformanceRecords.filter(record => {
    // 权限过滤
    if (!viewableEmployeeIds.value.includes(record.employee_id)) {
      return false
    }

    // 具体周期过滤
    if (record.period !== selectedPeriod.value) {
      return false
    }

    // 职级过滤
    if (selectedPositionLevel.value && record.position_level !== selectedPositionLevel.value) {
      return false
    }

    // 状态过滤
    if (selectedStatus.value && record.status !== selectedStatus.value) {
      return false
    }

    return true
  })
})

// 统计数据
const stats = computed(() => {
  const records = selectedDepartment.value === 'operations' 
    ? filteredOperationsRecords.value 
    : filteredSalesRecords.value
    
  return {
    totalEmployees: records.length,
    averageScore: records.length > 0
      ? records.reduce((sum, r) => sum + r.total_score, 0) / records.length
      : 0,
    completedCount: records.filter(r => r.status === 'completed' || r.status === 'approved').length,
    pendingCount: records.filter(r => r.status === 'draft' || r.status === 'in_progress').length
  }
})

const daysUntilDeadline = computed(() => {
  // 模拟计算截止日期
  return 15
})

// 生命周期
onMounted(() => {
  loadData()
})

// 方法
const loadData = () => {
  // 加载数据
}

const viewDetails = (record: OperationsPerformanceRecord | SalesPerformanceRecord) => {
  selectedRecord.value = record
  showDetailModal.value = true
}

const closeDetailModal = () => {
  showDetailModal.value = false
  selectedRecord.value = null
}

const editRecord = (record: OperationsPerformanceRecord | SalesPerformanceRecord) => {
  console.log('编辑绩效记录:', record)
}

const rateEmployee = (record: OperationsPerformanceRecord | SalesPerformanceRecord) => {
  selectedRecord.value = record
  showRatingModal.value = true
}

const viewAllPerformance = (record: OperationsPerformanceRecord | SalesPerformanceRecord) => {
  selectedEmployeeForAll.value = record
  showAllPerformanceModal.value = true
}

const closeTargetModal = () => {
  showTargetModal.value = false
}

const closeRatingModal = () => {
  showRatingModal.value = false
  selectedRecord.value = null
}

const closeAllPerformanceModal = () => {
  showAllPerformanceModal.value = false
  selectedEmployeeForAll.value = null
}

const submitTarget = (data: any) => {
  console.log('提交目标设置:', data)
  closeTargetModal()
}

const submitRating = (data: any) => {
  console.log('提交评分:', data)
  closeRatingModal()
}

const exportData = () => {
  console.log('导出数据')
}
</script>

<style scoped>
/* 基础样式 */
.performance-view-new {
  padding: 24px;
  background: #f8fafc;
  min-height: 100vh;
}

.page-header {
  margin-bottom: 32px;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
}

.page-description {
  color: #6b7280;
  font-size: 1.1rem;
}

/* 部门切换器样式 */
.department-switcher {
  margin-bottom: 24px;
}

.department-tabs {
  display: flex;
  gap: 8px;
  background: white;
  padding: 8px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  width: fit-content;
}

.department-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: none;
  background: transparent;
  border-radius: 8px;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;
}

.department-tab:hover {
  background: #f3f4f6;
  color: #374151;
}

.department-tab--active {
  background: #4f46e5;
  color: white;
}

/* 时间周期切换器样式 */
.period-switcher {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.period-tabs {
  display: flex;
  gap: 8px;
  background: white;
  padding: 8px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.period-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: none;
  background: transparent;
  border-radius: 8px;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;
}

.period-tab:hover {
  background: #f3f4f6;
  color: #374151;
}

.period-tab--active {
  background: #4f46e5;
  color: white;
}

.period-select {
  padding: 10px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: white;
  font-size: 14px;
  color: #374151;
}

/* 筛选器和操作区样式 */
.filters-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.filters {
  display: flex;
  gap: 16px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.filter-label {
  font-size: 12px;
  font-weight: 500;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  font-size: 14px;
  color: #374151;
  min-width: 120px;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.btn--primary {
  background: #4f46e5;
  color: white;
}

.btn--primary:hover {
  background: #4338ca;
}

.btn--secondary {
  background: #10b981;
  color: white;
}

.btn--secondary:hover {
  background: #059669;
}

.btn--outline {
  background: white;
  color: #6b7280;
  border: 1px solid #d1d5db;
}

.btn--outline:hover {
  background: #f9fafb;
  color: #374151;
}

/* 统计概览样式 */
.stats-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.stat-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.stat-card--primary .stat-icon {
  background: #4f46e5;
}

.stat-card--success .stat-icon {
  background: #10b981;
}

.stat-card--info .stat-icon {
  background: #3b82f6;
}

.stat-card--warning .stat-icon {
  background: #f59e0b;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  line-height: 1;
}

.stat-label {
  color: #6b7280;
  font-size: 14px;
  margin-top: 4px;
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 8px;
  color: #10b981;
  font-size: 12px;
  font-weight: 500;
}

.stat-progress {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #3b82f6;
  transition: width 0.3s ease;
}

.stat-deadline {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 8px;
  color: #f59e0b;
  font-size: 12px;
  font-weight: 500;
}
</style>
