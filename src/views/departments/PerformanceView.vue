<template>
  <div class="dashboard-content">
    <!-- 页面标题部分 -->
    <section class="dashboard-section">
      <div class="section-card">
        <div class="section-header">
          <h2 class="section-title">绩效管理</h2>
          <p class="section-description">分部门多层级绩效考核管理系统</p>
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
      </div>
    </section>

    <!-- 时间周期和筛选器 -->
    <section class="dashboard-section">
      <div class="section-card">
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
      </div>
    </section>

    <!-- 统计概览卡片 -->
    <section class="dashboard-section">
      <div class="section-card">
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
      </div>
    </section>

    <!-- 绩效列表 -->
    <section class="dashboard-section">
      <div class="section-card">
        <div class="section-header">
          <h2 class="section-title">绩效考核列表</h2>
          <div class="table-actions">
            <div class="view-toggle">
              <button
                class="view-btn"
                :class="{ 'view-btn--active': viewMode === 'table' }"
                @click="viewMode = 'table'"
              >
                <List :size="16" />
                列表视图
              </button>
              <button
                class="view-btn"
                :class="{ 'view-btn--active': viewMode === 'card' }"
                @click="viewMode = 'card'"
              >
                <Grid :size="16" />
                卡片视图
              </button>
            </div>
            <button class="btn btn--secondary" @click="refreshData">
              <RefreshCw :size="16" />
              刷新
            </button>
          </div>
        </div>

        <!-- 简化的表格视图 -->
        <div v-if="viewMode === 'table'" class="table-wrapper">
          <div class="simple-table">
            <div class="table-row table-header-row" :class="selectedDepartment">
              <div class="table-cell">员工姓名</div>
              <div class="table-cell">部门</div>
              <div class="table-cell">职位</div>
              <div class="table-cell">考核周期</div>
              <div class="table-cell" v-if="selectedDepartment === 'operations'">数据得分</div>
              <div class="table-cell" v-if="selectedDepartment === 'operations'">客户评价</div>
              <div class="table-cell" v-if="selectedDepartment === 'operations'">职能方案</div>
              <div class="table-cell" v-if="selectedDepartment === 'sales'">月度提成</div>
              <div class="table-cell" v-if="selectedDepartment === 'sales'">绩效底薪奖金</div>
              <div class="table-cell">综合得分</div>
              <div class="table-cell">等级</div>
              <div class="table-cell">操作</div>
            </div>

            <div v-for="record in filteredRecords" :key="record.id" class="table-row" :class="selectedDepartment">
              <div class="table-cell">
                <div class="employee-info">
                  <div class="employee-details">
                    <div class="employee-name">{{ record.employee_name }}</div>
                    <div class="employee-position">{{ record.employee_position }}</div>
                  </div>
                </div>
              </div>
              <div class="table-cell">
                <span class="department-badge" :class="`department-${record.department_type}`">
                  {{ record.department_name }}
                </span>
              </div>
              <div class="table-cell">{{ record.employee_position }}</div>
              <div class="table-cell">{{ formatPeriod(record.period, record.period_type) }}</div>

              <!-- 运营部门数据列 -->
              <template v-if="selectedDepartment === 'operations'">
                <div class="table-cell">
                  <div class="score-cell">
                    <span class="score-value">{{ record.data_score.toFixed(1) }}</span>
                    <span class="score-weight">({{ record.data_weight }}%)</span>
                  </div>
                </div>
                <div class="table-cell">
                  <div class="score-cell">
                    <span class="score-value">{{ (record.customer_score || 0).toFixed(1) }}</span>
                    <span class="score-weight">({{ record.customer_weight }}%)</span>
                  </div>
                </div>
                <div class="table-cell">
                  <div class="score-cell">
                    <span class="score-value">{{ (record.functional_score || record.intelligent_score || 0).toFixed(1) }}</span>
                    <span class="score-weight">({{ record.functional_weight || record.intelligent_weight }}%)</span>
                  </div>
                </div>
              </template>

              <!-- 销售部门数据列 -->
              <template v-if="selectedDepartment === 'sales'">
                <div class="table-cell">
                  <div class="score-cell">
                    <span class="score-value">{{ (record.monthly_commission_score || record.data_score || 0).toFixed(1) }}</span>
                    <span class="score-weight">(100%)</span>
                  </div>
                </div>
                <div class="table-cell">
                  <div class="score-cell">
                    <span class="score-value">{{ (record.performance_bonus_score || record.intelligent_score || 0).toFixed(1) }}</span>
                    <span class="score-weight">(100%)</span>
                  </div>
                </div>
              </template>

              <div class="table-cell">
                <div class="score-cell total-score-cell">
                  <span class="score-value total-score">{{ record.total_score.toFixed(1) }}</span>
                </div>
              </div>
              <div class="table-cell">
                <span class="grade-badge" :style="{ backgroundColor: getGradeColor(record.grade) }">
                  {{ record.grade }}
                </span>
              </div>
              <div class="table-cell">
                <div class="action-buttons-cell">
                  <button class="btn-icon" @click="viewDetails(record)" title="查看详情">
                    <Eye :size="14" />
                  </button>
                  <button class="btn-icon" @click="editRecord(record)" title="编辑">
                    <Edit :size="14" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 卡片视图 -->
        <div v-if="viewMode === 'card'" class="cards-grid">
          <div v-for="record in filteredRecords" :key="record.id" class="performance-card">
            <div class="card-header">
              <div class="employee-info">
                <div class="employee-details">
                  <div class="employee-name">{{ record.employee_name }}</div>
                  <div class="employee-position">{{ record.employee_position }}</div>
                </div>
              </div>
              <span class="grade-badge" :style="{ backgroundColor: getGradeColor(record.grade) }">
                {{ record.grade }}
              </span>
            </div>
            <div class="card-content">
              <div class="score-summary">
                <div class="total-score">{{ record.total_score.toFixed(1) }}</div>
                <div class="score-label">综合得分</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
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
  List,
  Grid,
  RefreshCw,
  Eye,
  Edit,
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
  OperationsPerformanceRecord,
  SalesPerformanceRecord,
  DepartmentType,
  PositionLevel,
  PeriodType
} from '@/types/departments'

// 响应式数据
const selectedDepartment = ref<DepartmentType>('operations')
const selectedPeriodType = ref<PeriodType>('monthly')
const selectedPeriod = ref('2024-01')
const selectedPositionLevel = ref<PositionLevel | ''>('')
const selectedStatus = ref('')
const viewMode = ref<'table' | 'card'>('table')

// 模态框状态
const showTargetModal = ref(false)
const showRatingModal = ref(false)

// 计算属性
const departments = computed(() => [
  { value: 'operations' as DepartmentType, label: '运营部门', icon: Building2 },
  { value: 'sales' as DepartmentType, label: '销售部门', icon: ShoppingCart }
])

const availablePeriodTypes = computed(() => {
  const types = [
    { value: 'monthly' as PeriodType, label: '月度考核', icon: Calendar }
  ]

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
const filteredRecords = computed(() => {
  let records: (OperationsPerformanceRecord | SalesPerformanceRecord)[] = []

  if (selectedDepartment.value === 'operations') {
    records = operationsPerformanceRecords.filter(record => {
      if (!viewableEmployeeIds.value.includes(record.employee_id)) return false
      if (record.period_type !== selectedPeriodType.value) return false
      if (record.period !== selectedPeriod.value) return false
      if (selectedPositionLevel.value && record.position_level !== selectedPositionLevel.value) return false
      if (selectedStatus.value && record.status !== selectedStatus.value) return false
      return true
    })
  } else if (selectedDepartment.value === 'sales') {
    records = salesPerformanceRecords.filter(record => {
      if (!viewableEmployeeIds.value.includes(record.employee_id)) return false
      if (record.period !== selectedPeriod.value) return false
      if (selectedPositionLevel.value && record.position_level !== selectedPositionLevel.value) return false
      if (selectedStatus.value && record.status !== selectedStatus.value) return false
      return true
    })
  }

  return records
})

// 统计数据
const stats = computed(() => {
  const records = filteredRecords.value

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
  return 15
})

// 方法
const formatPeriod = (period: string, periodType: PeriodType) => {
  if (periodType === 'quarterly') {
    const [year, quarter] = period.split('-Q')
    return `${year}年第${quarter}季度`
  } else if (periodType === 'monthly') {
    const [year, month] = period.split('-')
    return `${year}年${parseInt(month)}月`
  }
  return period
}

const viewDetails = (record: OperationsPerformanceRecord | SalesPerformanceRecord) => {
  console.log('查看详情:', record)
}

const editRecord = (record: OperationsPerformanceRecord | SalesPerformanceRecord) => {
  console.log('编辑记录:', record)
}

const refreshData = () => {
  console.log('刷新数据')
}

const exportData = () => {
  console.log('导出数据')
}

// 生命周期
onMounted(() => {
  console.log('绩效管理页面已加载')
})
</script>

<style scoped>
/* 使用与dashboard一致的样式 */
.dashboard-content {
  padding-top: 20px;
  max-width: 1200px;
  margin: 0 auto;
  padding-left: 20px;
  padding-right: 20px;
}

.dashboard-section {
  margin-bottom: var(--spacing-2xl);
  scroll-margin-top: 160px;
}

.section-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.section-header {
  margin-bottom: var(--spacing-xl);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0;
}

.section-description {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  margin: 0;
}

/* 部门切换器 */
.department-switcher {
  margin-bottom: 0;
}

.department-tabs {
  display: flex;
  gap: 8px;
  background: #f8fafc;
  padding: 8px;
  border-radius: 12px;
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

/* 时间周期切换器 */
.period-switcher {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.period-tabs {
  display: flex;
  gap: 8px;
  background: #f8fafc;
  padding: 8px;
  border-radius: 12px;
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

.period-selector {
  min-width: 200px;
}

.period-select {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-background);
  color: var(--color-text-primary);
  font-size: 14px;
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.period-select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* 筛选器和操作区 */
.filters-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 0;
  gap: 20px;
}

.filters {
  display: flex;
  gap: 20px;
  align-items: flex-end;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 150px;
}

.filter-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
}

.filter-select {
  padding: 10px 12px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 14px;
  background: var(--color-background);
  color: var(--color-text-primary);
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.filter-select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.action-buttons {
  display: flex;
  gap: 12px;
  align-items: center;
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

/* 统计概览 */
.stats-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 0;
}

.stat-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 16px;
  border: 1px solid #e5e7eb;
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

/* 表格操作 */
.table-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.view-toggle {
  display: flex;
  gap: 4px;
  background: #f3f4f6;
  padding: 4px;
  border-radius: 8px;
}

.view-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: none;
  background: transparent;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;
}

.view-btn:hover {
  background: #e5e7eb;
  color: #374151;
}

.view-btn--active {
  background: white;
  color: #4f46e5;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* 优化表格样式 */
.table-wrapper {
  margin-top: 24px;
  background: white;
  border-radius: 12px;
  overflow-x: auto;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.simple-table {
  width: 100%;
  min-width: 1200px;
  border-collapse: collapse;
}

.table-row {
  display: grid;
  gap: 16px;
  padding: 16px;
  border-bottom: 1px solid #f1f5f9;
  align-items: center;
  transition: background-color 0.2s ease;
}

.table-row:hover:not(.table-header-row) {
  background-color: #f8fafc;
}

.table-row:last-child {
  border-bottom: none;
}

/* 运营部门表格布局 - 10列 */
.table-row.operations {
  grid-template-columns: 1fr 100px 100px 120px 100px 100px 100px 100px 80px 100px;
}

/* 销售部门表格布局 - 9列 */
.table-row.sales {
  grid-template-columns: 1fr 100px 100px 120px 100px 100px 100px 80px 100px;
}

/* 默认表格行布局 */
.table-row:not(.operations):not(.sales) {
  grid-template-columns: 1fr 100px 100px 120px 100px 100px 100px 100px 80px 100px;
}

.table-header-row {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  font-weight: 600;
  color: #475569;
  border-bottom: 2px solid #e2e8f0;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.table-header-row:hover {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%) !important;
}

.table-cell {
  display: flex;
  align-items: center;
  min-height: 48px;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.employee-info {
  display: flex;
  align-items: center;
  width: 100%;
  min-width: 0;
}



.employee-details {
  flex: 1;
  min-width: 0;
}

.employee-name {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
  font-size: 15px;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.employee-position {
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.department-badge {
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-align: center;
  white-space: nowrap;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.department-operations {
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
  color: #166534;
  border: 1px solid #86efac;
}

.department-sales {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  color: #1e40af;
  border: 1px solid #93c5fd;
}

.score-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 8px;
  background: #f8fafc;
  border-radius: 8px;
  min-width: 80px;
}

.score-value {
  font-weight: 700;
  color: #1f2937;
  font-size: 16px;
  line-height: 1.2;
}

.score-weight {
  font-size: 11px;
  color: #64748b;
  margin-top: 2px;
  font-weight: 500;
}

.total-score-cell {
  background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%);
  border: 1px solid #c4b5fd;
}

.total-score-cell .score-value {
  font-size: 20px;
  color: #4f46e5;
  font-weight: 800;
}

.grade-badge {
  padding: 8px 16px;
  border-radius: 20px;
  color: white;
  font-weight: 700;
  font-size: 14px;
  text-align: center;
  min-width: 44px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.action-buttons-cell {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.btn-icon {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.btn-icon:hover {
  background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
  color: #475569;
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.btn-icon:active {
  transform: translateY(0);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* 卡片视图样式 */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.performance-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.2s ease;
}

.performance-card:hover {
  border-color: #4f46e5;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.card-content {
  text-align: center;
}

.score-summary {
  padding: 20px;
  background: #f8fafc;
  border-radius: 8px;
}

.total-score {
  font-size: 2.5rem;
  font-weight: 700;
  color: #4f46e5;
  margin-bottom: 4px;
}

.score-label {
  color: #6b7280;
  font-size: 14px;
}
</style>
