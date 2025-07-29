<template>
  <div class="project-data-panel">
    <div class="panel-header">
      <div class="header-content">
        <h3>项目目标管理</h3>
        <p>查看和管理所有项目的目标设定与完成情况</p>
      </div>
      <div class="header-actions">
        <button class="action-btn action-btn--primary" @click="createGoal">
          <Plus :size="16" />
          新建目标
        </button>
      </div>
    </div>

    <div class="project-content">
      <!-- 搜索和筛选区域 -->
      <div class="search-filter-section">
        <div class="search-section">
          <div class="filter-section">
            <div class="filter-row">
              <div class="filter-group">
                <label class="filter-label">客户名称:</label>
                <select v-model="filters.customerId" @change="handleCustomerChange" class="filter-select">
                  <option value="">全部客户</option>
                  <option v-for="customer in customers" :key="customer.id" :value="customer.id">
                    {{ customer.name }}
                  </option>
                </select>
              </div>

              <div class="filter-group">
                <label class="filter-label">项目名称:</label>
                <select v-model="filters.projectId" @change="handleFilterChange" class="filter-select">
                  <option value="">全部项目</option>
                  <option v-for="project in availableProjects" :key="project.id" :value="project.id">
                    {{ project.project_name }}
                  </option>
                </select>
              </div>

              <div class="filter-group">
                <label class="filter-label">目标月份:</label>
                <input
                  type="month"
                  v-model="filters.goalPeriod"
                  @input="handleFilterChange"
                  placeholder="——年——月"
                  class="filter-input"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 目标表格 -->
      <div class="project-table-section">
        <div class="table-header">
          <div class="table-header__left">
            <h3>目标列表</h3>
            <span class="record-count">共 {{ filteredGoals.length }} 条记录</span>
          </div>
          <div class="table-header__right">
            <!-- 目标类型标签页 -->
            <div class="goal-type-tabs">
              <button
                v-for="type in goalTypes"
                :key="type.value"
                class="goal-type-tab"
                :class="{ 'goal-type-tab--active': filters.goalType === type.value }"
                @click="selectGoalType(type.value)"
              >
                {{ type.label }}
              </button>
            </div>
          </div>
        </div>

        <!-- 表格视图 -->
        <div class="project-table">
          <div class="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>项目名称</th>
                  <th>所属客户</th>
                  <th>销售额目标</th>
                  <th>利润目标</th>
                  <th>成本目标</th>
                  <th>ROI目标</th>
                  <th>用户数目标</th>
                  <th>目标周期</th>
                  <th>目标月份</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="goal in paginatedGoals" :key="goal.id" class="goal-row">
                  <td>{{ goal.project_name }}</td>
                  <td>{{ goal.customer_name }}</td>
                  <td>
                    <div class="target-cell">
                      <div class="target-amount">${{ formatNumber(goal.sales_target) }}</div>
                      <div class="progress-container">
                        <div class="progress-bar">
                          <div
                            class="progress-fill progress-fill--sales"
                            :style="{ width: Math.min(goal.completion_rate?.sales || 0, 100) + '%' }"
                          ></div>
                        </div>
                        <span class="progress-percentage">{{ goal.completion_rate?.sales || 0 }}%</span>
                      </div>
                      <div class="current-amount">当前: ${{ formatNumber(goal.actual_sales || 0) }}</div>
                    </div>
                  </td>
                  <td>
                    <div class="target-cell">
                      <div class="target-amount">${{ formatNumber(goal.profit_target || 0) }}</div>
                      <div class="progress-container">
                        <div class="progress-bar">
                          <div
                            class="progress-fill progress-fill--profit"
                            :style="{ width: Math.min(goal.completion_rate?.profit || 0, 100) + '%' }"
                          ></div>
                        </div>
                        <span class="progress-percentage">{{ goal.completion_rate?.profit || 0 }}%</span>
                      </div>
                      <div class="current-amount">当前: ${{ formatNumber(goal.actual_profit || 0) }}</div>
                    </div>
                  </td>
                  <td>
                    <div class="target-cell">
                      <div class="target-amount">${{ formatNumber(goal.cost_target) }}</div>
                      <div class="progress-container">
                        <div class="progress-bar">
                          <div
                            class="progress-fill progress-fill--cost"
                            :style="{ width: Math.min(goal.completion_rate?.cost || 0, 100) + '%' }"
                          ></div>
                        </div>
                        <span class="progress-percentage">{{ goal.completion_rate?.cost || 0 }}%</span>
                      </div>
                      <div class="current-amount">当前: ${{ formatNumber(goal.actual_cost || 0) }}</div>
                    </div>
                  </td>
                  <td>
                    <div class="target-cell">
                      <div class="target-amount">{{ goal.roi_target }}%</div>
                      <div class="progress-container">
                        <div class="progress-bar">
                          <div
                            class="progress-fill progress-fill--roi"
                            :style="{ width: Math.min(goal.completion_rate?.roi || 0, 100) + '%' }"
                          ></div>
                        </div>
                        <span class="progress-percentage">{{ goal.completion_rate?.roi || 0 }}%</span>
                      </div>
                      <div class="current-amount">当前: {{ (goal.actual_roi || 0) }}%</div>
                    </div>
                  </td>
                  <td>
                    <div class="target-cell">
                      <div class="target-amount">{{ formatNumber(goal.user_count_target || 0) }}</div>
                      <div class="progress-container">
                        <div class="progress-bar">
                          <div
                            class="progress-fill progress-fill--users"
                            :style="{ width: Math.min(goal.completion_rate?.user_count || 0, 100) + '%' }"
                          ></div>
                        </div>
                        <span class="progress-percentage">{{ goal.completion_rate?.user_count || 0 }}%</span>
                      </div>
                      <div class="current-amount">当前: {{ formatNumber(goal.actual_user_count || 0) }}</div>
                    </div>
                  </td>
                  <td>
                    <span class="goal-type-badge" :class="getGoalTypeClass(goal.goal_type)">
                      {{ goal.goal_type }}目标
                    </span>
                  </td>
                  <td>{{ goal.goal_period }}</td>
                  <td>
                    <div class="action-buttons">
                      <button
                        class="action-btn-small action-btn-small--primary"
                        @click="editGoal(goal)"
                        title="编辑"
                      >
                        编辑
                      </button>
                      <button
                        class="action-btn-small action-btn-small--danger"
                        @click="deleteGoal(goal)"
                        title="删除"
                      >
                        删除
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 分页 -->
        <div class="pagination-section">
          <div class="pagination-info">
            显示第 {{ (currentPage - 1) * pageSize + 1 }} - {{ Math.min(currentPage * pageSize, filteredGoals.length) }} 条，
            共 {{ filteredGoals.length }} 条记录
          </div>
          <div class="pagination-controls">
            <button
              class="pagination-btn"
              :disabled="currentPage === 1"
              @click="currentPage = currentPage - 1"
            >
              上一页
            </button>
            <span class="pagination-current">{{ currentPage }} / {{ totalPages }}</span>
            <button
              class="pagination-btn"
              :disabled="currentPage === totalPages"
              @click="currentPage = currentPage + 1"
            >
              下一页
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 目标详情弹窗 -->
    <div v-if="showGoalDetail && selectedGoal" class="modal-overlay" @click="closeGoalDetail">
      <div class="modal-container" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">目标详情</h3>
          <button class="modal-close" @click="closeGoalDetail">
            <X :size="20" />
          </button>
        </div>
        <div class="modal-content">
          <div class="detail-grid">
            <div class="detail-section">
              <h4>基本信息</h4>
              <div class="detail-info">
                <div class="info-item">
                  <span class="info-label">项目名称</span>
                  <span class="info-value">{{ selectedGoal.project_name }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">客户名称</span>
                  <span class="info-value">{{ selectedGoal.customer_name }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">目标类型</span>
                  <span class="info-value">{{ selectedGoal.goal_type }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">目标周期</span>
                  <span class="info-value">{{ selectedGoal.goal_period }}</span>
                </div>
              </div>
            </div>

            <div class="detail-section">
              <h4>目标设定</h4>
              <div class="targets-grid">
                <div class="target-item" v-if="selectedGoal.sales_target">
                  <span class="target-label">销量目标</span>
                  <span class="target-value">${{ formatNumber(selectedGoal.sales_target) }}</span>
                </div>
                <div class="target-item" v-if="selectedGoal.cost_target">
                  <span class="target-label">成本目标</span>
                  <span class="target-value">${{ formatNumber(selectedGoal.cost_target) }}</span>
                </div>
                <div class="target-item" v-if="selectedGoal.roi_target">
                  <span class="target-label">ROI目标</span>
                  <span class="target-value">{{ selectedGoal.roi_target }}x</span>
                </div>
                <div class="target-item" v-if="selectedGoal.profit_target">
                  <span class="target-label">利润目标</span>
                  <span class="target-value">${{ formatNumber(selectedGoal.profit_target) }}</span>
                </div>
                <div class="target-item" v-if="selectedGoal.user_count_target">
                  <span class="target-label">用户数目标</span>
                  <span class="target-value">{{ formatNumber(selectedGoal.user_count_target) }}</span>
                </div>
              </div>
            </div>

            <div class="detail-section">
              <h4>完成情况</h4>
              <div class="completion-grid">
                <div class="completion-item">
                  <div class="completion-header">
                    <span class="completion-label">销量完成情况</span>
                    <span class="completion-rate" :class="getCompletionClass(selectedGoal.completion_rate?.sales || 0)">
                      {{ selectedGoal.completion_rate?.sales || 0 }}%
                    </span>
                  </div>
                  <div class="completion-details">
                    <span class="detail-text">
                                      目标: ${{ formatNumber(selectedGoal.sales_target) }} |
                实际: ${{ formatNumber(selectedGoal.actual_sales || 0) }}
                    </span>
                  </div>
                  <div class="progress-bar">
                    <div
                      class="progress-fill"
                      :style="{ width: Math.min(selectedGoal.completion_rate?.sales || 0, 100) + '%' }"
                      :class="getCompletionClass(selectedGoal.completion_rate?.sales || 0)"
                    ></div>
                  </div>
                </div>

                <div class="completion-item">
                  <div class="completion-header">
                    <span class="completion-label">ROI完成情况</span>
                    <span class="completion-rate" :class="getCompletionClass(selectedGoal.completion_rate?.roi || 0)">
                      {{ selectedGoal.completion_rate?.roi || 0 }}%
                    </span>
                  </div>
                  <div class="completion-details">
                    <span class="detail-text">
                      目标: {{ selectedGoal.roi_target }}x |
                      实际: {{ selectedGoal.actual_roi || 0 }}x
                    </span>
                  </div>
                  <div class="progress-bar">
                    <div
                      class="progress-fill"
                      :style="{ width: Math.min(selectedGoal.completion_rate?.roi || 0, 100) + '%' }"
                      :class="getCompletionClass(selectedGoal.completion_rate?.roi || 0)"
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div class="detail-section" v-if="selectedGoal.remarks">
              <h4>备注</h4>
              <p class="remarks-text">{{ selectedGoal.remarks }}</p>
            </div>

            <div class="detail-section">
              <h4>创建信息</h4>
              <div class="create-info">
                <span>创建人：{{ selectedGoal.created_by }}</span>
                <span>创建时间：{{ formatDate(selectedGoal.created_at) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import {
  BarChart3,
  Download,
  Plus,
  Filter,
  ChevronDown,
  RotateCcw,
  Search,
  Eye,
  Edit,
  Trash2,
  X
} from 'lucide-vue-next'

import { mockProjectGoals, mockProjects, type ProjectGoal, type Project } from '@/mock/projects'

const router = useRouter()

// 响应式数据
const currentPage = ref(1)
const pageSize = ref(10)
const showGoalDetail = ref(false)
const selectedGoal = ref<ProjectGoal | null>(null)

const goals = ref<ProjectGoal[]>([])
const customers = ref<Array<{id: number, name: string}>>([])
const projects = ref<Project[]>([])
const creators = ref<string[]>([])

const goalTypes = ref([
  { value: '月度', label: '月度目标' },
  { value: '季度', label: '季度目标' },
  { value: '年度', label: '年度目标' }
])

const filters = reactive({
  goalType: '',
  goalPeriod: '',
  customerId: '',
  projectId: ''
})

// 初始化数据
onMounted(() => {
  loadGoals()
  loadCustomers()
  loadProjects()
  loadCreators()
})

// 计算属性
const availableProjects = computed(() => {
  if (!filters.customerId) return projects.value
  return projects.value.filter(project =>
    project.customer_name === customers.value.find(c => c.id === parseInt(filters.customerId))?.name
  )
})

const filteredGoals = computed(() => {
  let result = [...goals.value]

  // 目标类型筛选
  if (filters.goalType) {
    result = result.filter(goal => goal.goal_type === filters.goalType)
  }

  // 目标周期筛选
  if (filters.goalPeriod) {
    result = result.filter(goal =>
      goal.goal_period.toLowerCase().includes(filters.goalPeriod.toLowerCase())
    )
  }

  // 客户筛选
  if (filters.customerId) {
    const customerName = customers.value.find(c => c.id === parseInt(filters.customerId))?.name
    result = result.filter(goal => goal.customer_name === customerName)
  }

  // 项目筛选
  if (filters.projectId) {
    result = result.filter(goal => goal.project_id === parseInt(filters.projectId))
  }

  return result
})

const paginatedGoals = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredGoals.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredGoals.value.length / pageSize.value)
})

// 方法
const loadGoals = () => {
  goals.value = mockProjectGoals
}

const loadCustomers = () => {
  const uniqueCustomers = [...new Set(mockProjectGoals.map(goal => goal.customer_name))]
  customers.value = uniqueCustomers.map((name, index) => ({
    id: index + 1,
    name
  }))
}

const loadProjects = () => {
  projects.value = mockProjects
}

const loadCreators = () => {
  creators.value = [...new Set(mockProjectGoals.map(goal => goal.created_by))]
}

const getAverageCompletion = (goal: ProjectGoal) => {
  const rates = [
    goal.completion_rate?.sales || 0,
    goal.completion_rate?.cost || 0,
    goal.completion_rate?.roi || 0
  ]
  return rates.reduce((sum, rate) => sum + rate, 0) / rates.length
}

const getGoalTypeClass = (type: string) => {
  const typeMap: Record<string, string> = {
    '月度': 'monthly',
    '季度': 'quarterly',
    '年度': 'yearly'
  }
  return typeMap[type] || 'default'
}

const getCompletionClass = (rate: number) => {
  if (rate >= 110) return 'excellent'
  if (rate >= 90) return 'good'
  if (rate >= 70) return 'warning'
  return 'danger'
}

const getOverallStatusClass = (goal: ProjectGoal) => {
  const avgCompletion = getAverageCompletion(goal)
  return getCompletionClass(avgCompletion)
}

const getOverallStatusText = (goal: ProjectGoal) => {
  const avgCompletion = getAverageCompletion(goal)
  if (avgCompletion >= 110) return '超额完成'
  if (avgCompletion >= 90) return '达成目标'
  if (avgCompletion >= 70) return '接近目标'
  return '未达目标'
}

const formatNumber = (num: number) => {
  return num.toLocaleString('zh-CN')
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}

const handleFilterChange = () => {
  currentPage.value = 1
}

const handleCustomerChange = () => {
  filters.projectId = ''
  handleFilterChange()
}

const selectGoalType = (type: string) => {
  filters.goalType = type
  currentPage.value = 1
}

const resetFilters = () => {
  filters.goalType = ''
  filters.goalPeriod = ''
  filters.customerId = ''
  filters.projectId = ''
  currentPage.value = 1
}

const applyFilters = () => {
  currentPage.value = 1
  // 筛选逻辑已在computed中处理
}



const createGoal = () => {
  console.log('创建新目标')
  // TODO: 实现创建目标功能
}

const viewGoalDetail = (goal: ProjectGoal) => {
  selectedGoal.value = goal
  showGoalDetail.value = true
}

const editGoal = (goal: ProjectGoal) => {
  console.log('编辑目标:', goal.id)
  // TODO: 实现编辑目标功能
}

const deleteGoal = (goal: ProjectGoal) => {
  if (confirm('确定要删除这个目标吗？')) {
    goals.value = goals.value.filter(g => g.id !== goal.id)
    console.log('删除目标:', goal.id)
  }
}

const closeGoalDetail = () => {
  showGoalDetail.value = false
  selectedGoal.value = null
}


</script>

<style scoped>
.project-data-panel {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
}

.panel-header {
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border-light);
  background: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-content h3 {
  margin: 0 0 var(--spacing-xs) 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.header-content p {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

.header-actions {
  display: flex;
  gap: var(--spacing-sm);
  align-items: center;
  flex-wrap: wrap;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--duration-fast);
  text-decoration: none;
}

.action-btn--primary {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

.action-btn--primary:hover {
  background: var(--color-primary-hover);
  border-color: var(--color-primary-hover);
}

.action-btn--secondary {
  background: var(--color-surface);
  color: var(--color-text-primary);
}

.action-btn--secondary:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.project-content {
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.search-filter-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.search-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

/* 筛选区域 */
.filter-section {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 20px;
}

.filter-row {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
}

.filter-select,
.filter-input {
  padding: 8px 12px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: var(--color-background);
  color: var(--color-text-primary);
  font-size: 14px;
}

.filter-select:focus,
.filter-input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.project-table-section {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  overflow: visible;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.table-header {
  padding: var(--spacing-xl) var(--spacing-lg);
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-bottom: 2px solid var(--color-border-light);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  position: relative;
}

.table-header::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--color-primary), transparent);
}

.table-header__left {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.table-header__left h3 {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.table-header__left h3::before {
  content: '';
  width: 4px;
  height: 20px;
  background: var(--color-primary);
  border-radius: 2px;
}

.record-count {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-medium);
  padding: var(--spacing-xs) var(--spacing-sm);
  background: rgba(59, 130, 246, 0.1);
  border-radius: var(--border-radius-sm);
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.record-count::before {
  content: '📊';
  font-size: 12px;
}

.table-header__right {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

/* 目标类型标签页样式 */
.goal-type-tabs {
  display: flex;
  gap: 8px;
  background: var(--color-background);
  padding: 6px;
  border-radius: 12px;
  width: fit-content;
  border: 1px solid var(--color-border);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.goal-type-tab {
  padding: 12px 20px;
  border: 1px solid var(--color-border);
  background: var(--color-background);
  color: var(--color-text-primary);
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
  position: relative;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.goal-type-tab:hover {
  background: var(--color-primary-light);
  color: var(--color-primary);
  border-color: var(--color-primary);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.goal-type-tab--active {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.goal-type-tab--active:hover {
  background: var(--color-primary);
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
}

/* 表格视图 */
.project-table {
  position: relative;
}

.table-wrapper {
  overflow-x: auto;
  overflow-y: visible;
}

.project-table table {
  width: 100%;
  border-collapse: collapse;
  min-width: 1200px;
}

.project-table th,
.project-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid var(--color-border);
}

.project-table th {
  background: var(--color-background);
  font-weight: 600;
  color: var(--color-text-primary);
  font-size: 14px;
  position: sticky;
  top: 0;
  z-index: 1;
}

.project-table td {
  font-size: 14px;
  color: var(--color-text-primary);
}

.goal-row:hover {
  background: var(--color-background-hover);
}

.goal-type-badge {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.goal-type-badge.monthly {
  background: var(--color-primary-light);
  color: var(--color-primary);
}

.goal-type-badge.quarterly {
  background: var(--color-success-light);
  color: var(--color-success);
}

.goal-type-badge.yearly {
  background: var(--color-warning-light);
  color: var(--color-warning);
}

.action-buttons {
  display: flex;
  gap: 4px;
}

.action-btn-small {
  padding: 4px 6px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn-small--primary {
  background: var(--color-primary-light);
  color: var(--color-primary);
}

.action-btn-small--primary:hover {
  background: var(--color-primary);
  color: white;
}

.action-btn-small--danger {
  background: var(--color-danger-light);
  color: var(--color-danger);
}

.action-btn-small--danger:hover {
  background: var(--color-danger);
  color: white;
}

/* 分页 */
.pagination-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  background: var(--color-background);
  border-top: 1px solid var(--color-border);
}

.pagination-info {
  font-size: 14px;
  color: var(--color-text-secondary);
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pagination-btn {
  padding: 8px 12px;
  border: 1px solid var(--color-border);
  background: var(--color-background);
  color: var(--color-text-primary);
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.pagination-btn:hover:not(:disabled) {
  background: var(--color-background-hover);
  border-color: var(--color-primary);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 目标单元格样式 */
.target-cell {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 120px;
}

.target-amount {
  font-weight: 600;
  color: var(--color-text-primary);
  font-size: 14px;
}

.progress-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: #f0f0f0;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s ease;
}

/* 不同目标类型的进度条颜色 */
.progress-fill--sales {
  background: linear-gradient(90deg, #10b981, #059669);
}

.progress-fill--profit {
  background: linear-gradient(90deg, #3b82f6, #2563eb);
}

.progress-fill--cost {
  background: linear-gradient(90deg, #f59e0b, #d97706);
}

.progress-fill--roi {
  background: linear-gradient(90deg, #8b5cf6, #7c3aed);
}

.progress-fill--users {
  background: linear-gradient(90deg, #ef4444, #dc2626);
}

.progress-percentage {
  font-size: 12px;
  font-weight: 600;
  min-width: 35px;
  text-align: right;
}

.current-amount {
  font-size: 11px;
  color: var(--color-text-secondary);
}

/* 目标详情弹窗 */
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

.modal-container {
  background: var(--color-background);
  border-radius: 8px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-background-secondary);
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.modal-close {
  padding: 4px;
  border: none;
  background: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: var(--color-background-hover);
  color: var(--color-text-primary);
}

.modal-content {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}

.detail-section h4 {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 12px 0;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.detail-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-label {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.info-value {
  font-size: 14px;
  color: var(--color-text-primary);
  font-weight: 500;
}

.targets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
}

.target-item {
  background: var(--color-background-secondary);
  padding: 12px;
  border-radius: 6px;
  border: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.target-label {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.target-value {
  font-size: 16px;
  color: var(--color-text-primary);
  font-weight: 600;
}

.completion-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.completion-item {
  background: var(--color-background-secondary);
  padding: 16px;
  border-radius: 6px;
  border: 1px solid var(--color-border);
}

.completion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.completion-label {
  font-size: 14px;
  color: var(--color-text-primary);
  font-weight: 500;
}

.completion-rate {
  font-size: 14px;
  font-weight: 600;
}

.completion-rate.excellent {
  color: var(--color-success);
}

.completion-rate.good {
  color: var(--color-primary);
}

.completion-rate.warning {
  color: var(--color-warning);
}

.completion-rate.danger {
  color: var(--color-danger);
}

.completion-details {
  margin-bottom: 8px;
}

.detail-text {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.remarks-text {
  font-size: 14px;
  color: var(--color-text-primary);
  line-height: 1.5;
  margin: 0;
}

.create-info {
  display: flex;
  gap: 24px;
  font-size: 14px;
  color: var(--color-text-secondary);
}

@media (max-width: 768px) {
  .panel-header {
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-lg);
  }

  .header-actions {
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .action-btn {
    flex: 1;
    justify-content: center;
  }

  .search-filter-section {
    gap: var(--spacing-md);
  }

  .filter-row {
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-sm);
  }

  .filter-group {
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-xs);
  }

  .table-header {
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-sm);
    padding: var(--spacing-md);
  }

  .goal-type-tabs {
    align-self: center;
  }

  .pagination-section {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
    gap: var(--spacing-sm);
  }

  .pagination-controls {
    justify-content: center;
    flex-wrap: wrap;
  }

  .detail-grid,
  .targets-grid {
    grid-template-columns: 1fr;
  }

  .create-info {
    flex-direction: column;
    gap: 8px;
  }

  .target-cell {
    min-width: 100px;
  }

  .target-amount {
    font-size: 12px;
  }
}
</style>
