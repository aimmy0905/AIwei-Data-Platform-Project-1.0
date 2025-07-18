<template>
  <div class="activity-management">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="page-title">活动管理</h1>
          <p class="page-description">管理项目相关的营销活动和推广活动</p>
        </div>
        <div class="header-right">
          <button class="btn btn-primary" @click="showCreateModal = true">
            <Plus :size="16" />
            新建活动
          </button>
        </div>
      </div>
    </div>

    <!-- 活动数据概览 -->
    <div class="summary-section" v-if="activitySummary">
      <div class="summary-grid">
        <div class="summary-card">
          <div class="summary-icon">
            <BarChart3 :size="24" />
          </div>
          <div class="summary-content">
            <h3>{{ activitySummary.totalActivities }}</h3>
            <p>总活动数</p>
          </div>
        </div>
        <div class="summary-card">
          <div class="summary-icon active">
            <TrendingUp :size="24" />
          </div>
          <div class="summary-content">
            <h3>{{ activitySummary.activeActivities }}</h3>
            <p>进行中</p>
          </div>
        </div>
        <div class="summary-card">
          <div class="summary-icon">
            <DollarSign :size="24" />
          </div>
          <div class="summary-content">
            <h3>¥{{ formatNumber(activitySummary.totalRevenue) }}</h3>
            <p>总收入</p>
          </div>
        </div>
        <div class="summary-card">
          <div class="summary-icon">
            <Target :size="24" />
          </div>
          <div class="summary-content">
            <h3>{{ activitySummary.averageROI.toFixed(1) }}</h3>
            <p>平均ROI</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 筛选器 -->
    <div class="filter-section">
      <div class="filter-row">
        <div class="filter-item">
          <label>活动状态：</label>
          <select v-model="filters.status" class="form-select" @change="handleFilterChange">
            <option value="">全部状态</option>
            <option value="warm_up">预热中</option>
            <option value="running">进行中</option>
            <option value="ended">已结束</option>
            <option value="cancelled">已取消</option>
          </select>
        </div>
        <div class="filter-item">
          <label>活动类型：</label>
          <select v-model="filters.type" class="form-select" @change="handleFilterChange">
            <option value="">全部类型</option>
            <option value="promotion">促销活动</option>
            <option value="brand">品牌推广</option>
            <option value="holiday">节日活动</option>
            <option value="other">其他</option>
          </select>
        </div>
        <div class="filter-item">
          <label>活动阶段：</label>
          <select v-model="filters.stage" class="form-select" @change="handleFilterChange">
            <option value="">全部阶段</option>
            <option value="warm_up">预热</option>
            <option value="formal">正式</option>
          </select>
        </div>
        <div class="filter-item">
          <label>搜索：</label>
          <input
            v-model="filters.search"
            type="text"
            class="form-input"
            placeholder="搜索活动名称或内容..."
            @input="handleSearchChange"
          />
        </div>
        <div class="filter-item">
          <button class="btn btn-outline" @click="clearFilters">
            <X :size="16" />
            清空筛选
          </button>
        </div>
      </div>

      <!-- 高级筛选 -->
      <div class="advanced-filter" v-if="showAdvancedFilter">
        <div class="filter-row">
          <div class="filter-item">
            <label>ROI范围：</label>
            <input
              v-model.number="filters.roiMin"
              type="number"
              class="form-input"
              placeholder="最小ROI"
              step="0.1"
              @change="handleFilterChange"
            />
            <span class="filter-separator">-</span>
            <input
              v-model.number="filters.roiMax"
              type="number"
              class="form-input"
              placeholder="最大ROI"
              step="0.1"
              @change="handleFilterChange"
            />
          </div>
          <div class="filter-item">
            <label>预算范围：</label>
            <input
              v-model.number="filters.budgetMin"
              type="number"
              class="form-input"
              placeholder="最小预算"
              @change="handleFilterChange"
            />
            <span class="filter-separator">-</span>
            <input
              v-model.number="filters.budgetMax"
              type="number"
              class="form-input"
              placeholder="最大预算"
              @change="handleFilterChange"
            />
          </div>
        </div>
      </div>

      <div class="filter-actions">
        <button
          class="btn btn-text"
          @click="showAdvancedFilter = !showAdvancedFilter"
        >
          {{ showAdvancedFilter ? '收起' : '高级筛选' }}
          <ChevronDown :size="16" :class="{ 'rotate-180': showAdvancedFilter }" />
        </button>
        <div class="filter-results">
          共找到 {{ pagination.total }} 个活动
        </div>
      </div>
    </div>

    <!-- 排序和视图切换 -->
    <div class="toolbar-section">
      <div class="toolbar-left">
        <div class="sort-controls">
          <label>排序：</label>
          <select v-model="sortBy" class="form-select" @change="handleSortChange">
            <option value="updatedAt">更新时间</option>
            <option value="createdAt">创建时间</option>
            <option value="startTime">开始时间</option>
            <option value="budget">预算</option>
            <option value="name">活动名称</option>
          </select>
          <button
            class="btn btn-icon"
            @click="toggleSortOrder"
            :title="sortOrder === 'desc' ? '降序' : '升序'"
          >
            <ArrowUpDown :size="16" />
          </button>
        </div>
      </div>
      <div class="toolbar-right">
        <div class="view-controls">
          <button
            class="btn btn-icon"
            :class="{ active: viewMode === 'grid' }"
            @click="viewMode = 'grid'"
            title="网格视图"
          >
            <Grid :size="16" />
          </button>
          <button
            class="btn btn-icon"
            :class="{ active: viewMode === 'list' }"
            @click="viewMode = 'list'"
            title="列表视图"
          >
            <List :size="16" />
          </button>
        </div>
      </div>
    </div>

    <!-- 活动列表 -->
    <div class="content-section">
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>加载中...</p>
      </div>

      <!-- 网格视图 -->
      <div v-else-if="viewMode === 'grid'" class="activity-grid">
        <div v-for="activity in activities" :key="activity.id" class="activity-card">
          <div class="card-header">
            <h3 class="activity-name" @click="viewActivityDetail(activity.id)">
              {{ activity.name }}
            </h3>
            <span class="status-badge" :class="activity.status">
              {{ getStatusText(activity.status) }}
            </span>
          </div>
          <div class="card-content">
            <div class="activity-info">
              <div class="info-item">
                <Calendar :size="16" />
                <span>{{ formatDateRange(activity.startTime, activity.endTime) }}</span>
              </div>
              <div class="info-item">
                <DollarSign :size="16" />
                <span>预算: ¥{{ formatNumber(activity.budget) }}</span>
              </div>
              <div class="info-item">
                <Target :size="16" />
                <span>目标ROI: {{ activity.targetROI }}</span>
              </div>
              <div class="info-item">
                <User :size="16" />
                <span>负责人: {{ activity.ownerName }}</span>
              </div>
            </div>
            <div class="activity-platforms">
              <span class="platform-tag" v-for="channel in activity.channels" :key="channel">
                {{ channel }}
              </span>
            </div>
            <div class="activity-content">
              <p>{{ activity.content }}</p>
            </div>
          </div>
                    <div class="card-actions">
            <button class="btn btn-outline" @click="viewActivityDetail(activity.id)">
              <Eye :size="16" />
              查看详情
            </button>
            <button
              class="btn btn-outline"
              @click="editActivity(activity)"
              v-if="canEditActivity(activity)"
            >
              <Edit :size="16" />
              编辑
            </button>

            <!-- 快速状态操作 -->
            <div class="status-actions" v-if="getQuickActions(activity).length > 0">
              <button
                v-for="action in getQuickActions(activity)"
                :key="action.to"
                class="btn btn-sm"
                :class="getActionButtonClass(action)"
                @click="quickStatusChange(activity, action)"
                :title="action.description"
              >
                <component :is="getActionIcon(action)" :size="14" />
                {{ action.label }}
              </button>
            </div>

            <button
              class="btn btn-outline btn-danger"
              @click="deleteActivity(activity)"
              v-if="canDeleteActivity(activity)"
            >
              <Trash2 :size="16" />
              删除
            </button>
          </div>
        </div>
      </div>

      <!-- 列表视图 -->
      <div v-else-if="viewMode === 'list'" class="activity-table">
        <table>
          <thead>
            <tr>
              <th @click="handleSort('name')">
                活动名称
                <ArrowUpDown :size="14" />
              </th>
              <th @click="handleSort('type')">
                类型
                <ArrowUpDown :size="14" />
              </th>
              <th @click="handleSort('status')">
                状态
                <ArrowUpDown :size="14" />
              </th>
              <th @click="handleSort('startTime')">
                时间范围
                <ArrowUpDown :size="14" />
              </th>
              <th @click="handleSort('budget')">
                预算
                <ArrowUpDown :size="14" />
              </th>
              <th @click="handleSort('ownerName')">
                负责人
                <ArrowUpDown :size="14" />
              </th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="activity in activities" :key="activity.id">
              <td>
                <div class="activity-name-cell">
                  <strong @click="viewActivityDetail(activity.id)">{{ activity.name }}</strong>
                  <small>{{ activity.projectName }}</small>
                </div>
              </td>
              <td>
                <span class="type-badge" :class="activity.type">
                  {{ getTypeText(activity.type) }}
                </span>
              </td>
              <td>
                <span class="status-badge" :class="activity.status">
                  {{ getStatusText(activity.status) }}
                </span>
              </td>
              <td>
                <div class="date-range">
                  <div>{{ formatDate(activity.startTime) }}</div>
                  <div>{{ formatDate(activity.endTime) }}</div>
                </div>
              </td>
              <td>¥{{ formatNumber(activity.budget) }}</td>
              <td>{{ activity.ownerName }}</td>
              <td>
                <div class="action-buttons">
                  <button class="btn btn-sm btn-outline" @click="viewActivityDetail(activity.id)">
                    详情
                  </button>
                  <button class="btn btn-sm btn-outline" @click="editActivity(activity)">
                    编辑
                  </button>
                  <button
                    class="btn btn-sm btn-outline btn-danger"
                    @click="deleteActivity(activity)"
                    v-if="activity.status === 'warm_up'"
                  >
                    删除
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 空状态 -->
      <div v-else-if="activities.length === 0 && !loading" class="empty-state">
        <Calendar :size="64" class="empty-icon" />
        <h3>暂无活动</h3>
        <p>没有找到符合条件的活动，请调整筛选条件或创建新活动</p>
        <button class="btn btn-primary" @click="showCreateModal = true">
          <Plus :size="16" />
          创建第一个活动
        </button>
      </div>
    </div>

    <!-- 分页 -->
    <div class="pagination-section" v-if="pagination.total > 0">
      <div class="pagination-info">
        显示第 {{ (pagination.page - 1) * pagination.pageSize + 1 }} -
        {{ Math.min(pagination.page * pagination.pageSize, pagination.total) }} 条，
        共 {{ pagination.total }} 条
      </div>
      <div class="pagination-controls">
        <button
          class="btn btn-outline"
          @click="changePage(pagination.page - 1)"
          :disabled="pagination.page <= 1"
        >
          <ChevronLeft :size="16" />
          上一页
        </button>

        <div class="page-numbers">
          <button
            v-for="page in getPageNumbers()"
            :key="page"
            class="btn btn-outline"
            :class="{ active: page === pagination.page }"
            @click="changePage(page)"
          >
            {{ page }}
          </button>
        </div>

        <button
          class="btn btn-outline"
          @click="changePage(pagination.page + 1)"
          :disabled="pagination.page >= Math.ceil(pagination.total / pagination.pageSize)"
        >
          下一页
          <ChevronRight :size="16" />
        </button>
      </div>
    </div>

    <!-- 创建/编辑活动弹窗 -->
    <ActivityFormModal
      v-if="showCreateModal || showEditModal"
      :isEdit="showEditModal"
      :activity="editingActivity"
      @close="closeModals"
      @success="handleFormSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  Plus, Calendar, DollarSign, Target, User, Eye, Edit, Trash2, X,
  BarChart3, TrendingUp, ChevronDown, ArrowUpDown, Grid, List,
  ChevronLeft, ChevronRight, Play, Square, XCircle
} from 'lucide-vue-next'
import type { Activity, ActivitySummary, ActivityFilter } from '@/types'
import {
  mockGetActivities,
  mockGetActivitySummary,
  mockDeleteActivity,
  mockUpdateActivityStatus
} from '@/mock/activities'
import ActivityFormModal from '@/components/projects/ActivityFormModal.vue'
import { ActivityStatusService } from '@/services/activityStatusService'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// 响应式数据
const loading = ref(false)
const activities = ref<Activity[]>([])
const activitySummary = ref<ActivitySummary | null>(null)
const showCreateModal = ref(false)
const showEditModal = ref(false)
const editingActivity = ref<Activity | null>(null)
const showAdvancedFilter = ref(false)
const viewMode = ref<'grid' | 'list'>('grid')

// 筛选器状态
const filters = ref<ActivityFilter>({
  status: '',
  type: '',
  stage: '',
  search: '',
  roiMin: undefined,
  roiMax: undefined,
  budgetMin: undefined,
  budgetMax: undefined
})

// 排序状态
const sortBy = ref('updatedAt')
const sortOrder = ref<'asc' | 'desc'>('desc')

// 分页状态
const pagination = ref({
  page: 1,
  pageSize: 12,
  total: 0
})

// 搜索防抖
let searchTimeout: number | null = null

// 计算属性
const hasActiveFilters = computed(() => {
  return filters.value.status ||
         filters.value.type ||
         filters.value.stage ||
         filters.value.search ||
         filters.value.roiMin !== undefined ||
         filters.value.roiMax !== undefined ||
         filters.value.budgetMin !== undefined ||
         filters.value.budgetMax !== undefined
})

// 方法
const loadActivities = async () => {
  loading.value = true
  try {
    const response = await mockGetActivities(
      pagination.value.page,
      pagination.value.pageSize,
      {
        ...filters.value,
        sortBy: sortBy.value,
        sortOrder: sortOrder.value
      }
    )

    if (response.success && response.data) {
      activities.value = response.data.activities
      pagination.value.total = response.data.total
    }
  } catch (error) {
    console.error('加载活动列表失败:', error)
  } finally {
    loading.value = false
  }
}

const loadSummary = async () => {
  try {
    const response = await mockGetActivitySummary()
    if (response.success && response.data) {
      activitySummary.value = response.data
    }
  } catch (error) {
    console.error('加载活动汇总失败:', error)
  }
}

const handleFilterChange = () => {
  pagination.value.page = 1
  loadActivities()
}

const handleSearchChange = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  searchTimeout = setTimeout(() => {
    handleFilterChange()
  }, 500)
}

const handleSortChange = () => {
  loadActivities()
}

const handleSort = (field: string) => {
  if (sortBy.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = field
    sortOrder.value = 'desc'
  }
  handleSortChange()
}

const toggleSortOrder = () => {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  handleSortChange()
}

const clearFilters = () => {
  filters.value = {
    status: '',
    type: '',
    stage: '',
    search: '',
    roiMin: undefined,
    roiMax: undefined,
    budgetMin: undefined,
    budgetMax: undefined
  }
  pagination.value.page = 1
  loadActivities()
}

const changePage = (page: number) => {
  pagination.value.page = page
  loadActivities()
}

const getPageNumbers = () => {
  const totalPages = Math.ceil(pagination.value.total / pagination.value.pageSize)
  const current = pagination.value.page
  const pages: number[] = []

  // 显示当前页前后2页
  const start = Math.max(1, current - 2)
  const end = Math.min(totalPages, current + 2)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
}

const viewActivityDetail = (activityId: number) => {
  router.push(`/projects/activities/${activityId}`)
}

const editActivity = (activity: Activity) => {
  editingActivity.value = activity
  showEditModal.value = true
}

const deleteActivity = async (activity: Activity) => {
  if (!confirm(`确定要删除活动"${activity.name}"吗？`)) {
    return
  }

  try {
    const response = await mockDeleteActivity(activity.id)
    if (response.success) {
      loadActivities()
      loadSummary()
    } else {
      alert(response.message || '删除失败')
    }
  } catch (error) {
    console.error('删除活动失败:', error)
    alert('删除活动失败')
  }
}

const closeModals = () => {
  showCreateModal.value = false
  showEditModal.value = false
  editingActivity.value = null
}

const handleFormSuccess = (activity: Activity) => {
  // 刷新活动列表和汇总数据
  loadActivities()
  loadSummary()
}

// 格式化函数
const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('zh-CN').format(value)
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

const formatDateRange = (startDate: string, endDate: string): string => {
  return `${formatDate(startDate)} - ${formatDate(endDate)}`
}

const getStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    warm_up: '预热中',
    running: '进行中',
    ended: '已结束',
    cancelled: '已取消'
  }
  return statusMap[status] || status
}

const getTypeText = (type: string): string => {
  const typeMap: Record<string, string> = {
    promotion: '促销活动',
    brand: '品牌推广',
    holiday: '节日活动',
    other: '其他'
  }
  return typeMap[type] || type
}

// 权限检查方法
const canEditActivity = (activity: Activity): boolean => {
  const currentUser = authStore.user
  if (!currentUser) return false
  return ActivityStatusService.canEditActivity(activity, currentUser.role)
}

const canDeleteActivity = (activity: Activity): boolean => {
  const currentUser = authStore.user
  if (!currentUser) return false
  return ActivityStatusService.canDeleteActivity(activity, currentUser.role)
}

// 快速状态操作方法
const getQuickActions = (activity: Activity) => {
  const currentUser = authStore.user
  if (!currentUser) return []

  const availableTransitions = ActivityStatusService.getAvailableTransitions(
    activity.status,
    currentUser.role
  )

  // 只显示最常用的快速操作
  return availableTransitions.filter(transition => {
    return transition.to === 'running' ||
           transition.to === 'ended' ||
           (transition.to === 'cancelled' && activity.status === 'warm_up')
  })
}

const getActionButtonClass = (action: any): string => {
  const baseClass = 'btn-quick-action'
  switch (action.to) {
    case 'running':
      return `${baseClass} btn-success`
    case 'ended':
      return `${baseClass} btn-info`
    case 'cancelled':
      return `${baseClass} btn-danger`
    default:
      return baseClass
  }
}

const getActionIcon = (action: any) => {
  switch (action.to) {
    case 'running':
      return Play
    case 'ended':
      return Square
    case 'cancelled':
      return XCircle
    default:
      return Play
  }
}

const quickStatusChange = async (activity: Activity, action: any) => {
  const currentUser = authStore.user
  if (!currentUser) return

  const confirmMessage = action.confirmMessage || `确定要${action.label}吗？`

  if (!confirm(confirmMessage)) {
    return
  }

  let reason = ''
  if (action.requiresReason) {
    reason = prompt('请输入变更原因：') || ''
    if (!reason.trim()) {
      alert('请填写变更原因')
      return
    }
  }

  try {
    // 验证状态变更
    const validation = ActivityStatusService.validateStatusChange(
      activity,
      action.to,
      currentUser,
      reason
    )

    if (!validation.valid) {
      alert(validation.error)
      return
    }

        // 调用API更新状态
    const response = await mockUpdateActivityStatus(activity.id, action.to, reason)

    if (response.success && response.data) {
      // 重新加载活动列表
      loadActivities()
      loadSummary()

      alert(`活动状态已更新为：${ActivityStatusService.getStatusText(action.to)}`)
    } else {
      alert(response.message || '状态更新失败')
    }

  } catch (error) {
    console.error('状态变更失败:', error)
    alert('状态变更失败，请重试')
  }
}

// 生命周期
onMounted(() => {
  loadActivities()
  loadSummary()

  // 检查是否有编辑查询参数
  const editId = route.query.edit
  if (editId) {
    const activityId = parseInt(editId as string)
    const activity = activities.value.find(a => a.id === activityId)
    if (activity) {
      editActivity(activity)
    }
  }
})

// 监听筛选条件变化
watch(
  () => filters.value,
  () => {
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }
    searchTimeout = setTimeout(() => {
      handleFilterChange()
    }, 100)
  },
  { deep: true }
)
</script>

<style scoped>
.activity-management {
  padding: 24px;
  background: #f8f9fa;
  min-height: 100vh;
}

.page-header {
  background: white;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 8px 0;
}

.page-description {
  color: #666;
  margin: 0;
}

.filter-section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.filter-row {
  display: flex;
  gap: 20px;
  align-items: center;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-item label {
  font-weight: 500;
  color: #333;
  white-space: nowrap;
}

.form-select,
.form-input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.content-section {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.activity-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.activity-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  background: #fafafa;
  transition: all 0.2s;
}

.activity-card:hover {
  border-color: #1976d2;
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.activity-name {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.planning {
  background: #fff3cd;
  color: #856404;
}

.status-badge.active {
  background: #d1ecf1;
  color: #0c5460;
}

.status-badge.completed {
  background: #d4edda;
  color: #155724;
}

.status-badge.paused {
  background: #f8d7da;
  color: #721c24;
}

.activity-info {
  margin-bottom: 16px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  color: #666;
  font-size: 14px;
}

.activity-platforms {
  margin-bottom: 16px;
}

.platform-tag {
  display: inline-block;
  background: #e3f2fd;
  color: #1976d2;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  margin-right: 8px;
  margin-bottom: 4px;
}

.card-actions {
  display: flex;
  gap: 8px;
}

.btn {
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-primary {
  background: #1976d2;
  color: white;
}

.btn-primary:hover {
  background: #1565c0;
}

.btn-outline {
  background: transparent;
  color: #1976d2;
  border: 1px solid #1976d2;
}

.btn-outline:hover {
  background: #1976d2;
  color: white;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.empty-icon {
  color: #ccc;
  margin-bottom: 16px;
}

.empty-state h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  color: #333;
}

.empty-state p {
  margin: 0;
  font-size: 14px;
}

/* 汇总数据样式 */
.summary-section {
  background: white;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.summary-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.summary-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background: #e3f2fd;
  color: #1976d2;
}

.summary-icon.active {
  background: #e8f5e8;
  color: #2e7d32;
}

.summary-content h3 {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 4px 0;
}

.summary-content p {
  font-size: 14px;
  color: #666;
  margin: 0;
}

/* 高级筛选样式 */
.advanced-filter {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e0e0e0;
}

.filter-separator {
  margin: 0 8px;
  color: #666;
}

.filter-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e0e0e0;
}

.filter-results {
  font-size: 14px;
  color: #666;
}

.btn-text {
  background: transparent;
  color: #1976d2;
  border: none;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
}

.btn-text:hover {
  background: #f5f5f5;
}

.rotate-180 {
  transform: rotate(180deg);
}

/* 工具栏样式 */
.toolbar-section {
  background: white;
  border-radius: 8px;
  padding: 16px 24px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.toolbar-left, .toolbar-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.sort-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sort-controls label {
  font-weight: 500;
  color: #333;
  white-space: nowrap;
}

.view-controls {
  display: flex;
  gap: 4px;
}

.btn-icon {
  padding: 8px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-icon:hover {
  background: #f5f5f5;
  border-color: #1976d2;
}

.btn-icon.active {
  background: #1976d2;
  color: white;
  border-color: #1976d2;
}

/* 加载状态样式 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #666;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #1976d2;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 活动卡片增强样式 */
.activity-name {
  cursor: pointer;
  transition: color 0.2s;
}

.activity-name:hover {
  color: #1976d2;
}

.activity-content {
  margin-top: 12px;
}

.activity-content p {
  font-size: 14px;
  color: #666;
  line-height: 1.4;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.btn-danger {
  color: #d32f2f;
  border-color: #d32f2f;
}

.btn-danger:hover {
  background: #d32f2f;
  color: white;
}

/* 表格视图样式 */
.activity-table {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.activity-table table {
  width: 100%;
  border-collapse: collapse;
}

.activity-table th {
  background: #f8f9fa;
  padding: 16px;
  text-align: left;
  font-weight: 600;
  color: #333;
  border-bottom: 1px solid #e0e0e0;
  cursor: pointer;
  user-select: none;
  transition: background 0.2s;
}

.activity-table th:hover {
  background: #e9ecef;
}

.activity-table th {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.activity-table td {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  vertical-align: top;
}

.activity-table tr:hover {
  background: #f8f9fa;
}

.activity-name-cell strong {
  display: block;
  font-weight: 600;
  color: #1a1a1a;
  cursor: pointer;
  transition: color 0.2s;
}

.activity-name-cell strong:hover {
  color: #1976d2;
}

.activity-name-cell small {
  display: block;
  color: #666;
  font-size: 12px;
  margin-top: 4px;
}

.type-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.type-badge.promotion {
  background: #e3f2fd;
  color: #1976d2;
}

.type-badge.brand {
  background: #f3e5f5;
  color: #7b1fa2;
}

.type-badge.holiday {
  background: #fff3e0;
  color: #f57c00;
}

.type-badge.other {
  background: #f5f5f5;
  color: #616161;
}

.date-range div {
  font-size: 14px;
  line-height: 1.2;
}

.date-range div:first-child {
  font-weight: 500;
}

.date-range div:last-child {
  color: #666;
  margin-top: 2px;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 12px;
}

/* 状态操作按钮样式 */
.status-actions {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.btn-quick-action {
  padding: 4px 8px;
  font-size: 11px;
  border-radius: 3px;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s;
}

.btn-quick-action.btn-success {
  background: #e8f5e8;
  color: #2e7d32;
  border: 1px solid #2e7d32;
}

.btn-quick-action.btn-success:hover {
  background: #2e7d32;
  color: white;
}

.btn-quick-action.btn-info {
  background: #e3f2fd;
  color: #1976d2;
  border: 1px solid #1976d2;
}

.btn-quick-action.btn-info:hover {
  background: #1976d2;
  color: white;
}

.btn-quick-action.btn-danger {
  background: #ffebee;
  color: #d32f2f;
  border: 1px solid #d32f2f;
}

.btn-quick-action.btn-danger:hover {
  background: #d32f2f;
  color: white;
}

/* 分页样式 */
.pagination-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
}

.pagination-info {
  color: #666;
  font-size: 14px;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.page-numbers {
  display: flex;
  gap: 4px;
}

.pagination-controls .btn {
  min-width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pagination-controls .btn.active {
  background: #1976d2;
  color: white;
  border-color: #1976d2;
}

.pagination-controls .btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e0e0e0;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.modal-body {
  padding: 24px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .filter-row {
    flex-direction: column;
    gap: 12px;
  }

  .filter-item {
    width: 100%;
  }

  .toolbar-section {
    flex-direction: column;
    gap: 16px;
  }

  .activity-grid {
    grid-template-columns: 1fr;
  }

  .summary-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .activity-table {
    overflow-x: auto;
  }

  .pagination-section {
    flex-direction: column;
    gap: 16px;
  }
}
</style>
