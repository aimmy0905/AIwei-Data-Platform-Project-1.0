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
            <h3>目标列表 - {{ currentGoalTypeText }}</h3>
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
                <span class="tab-icon">📊</span>
                <span class="tab-text">{{ type.label }}</span>
                <span v-if="filters.goalType === type.value" class="tab-indicator"></span>
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
                        class="action-btn-small action-btn-small--info"
                        @click="viewProjectAllGoals(goal)"
                        title="查看该项目全部目标"
                      >
                        全部目标
                      </button>
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

    <!-- 项目全部目标弹窗 -->
    <div v-if="showProjectAllGoals && selectedProjectGoals" class="modal-overlay" @click="closeProjectAllGoals">
      <div class="modal-container modal-container--large" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">{{ selectedProjectGoals.projectName }} - 全部目标</h3>
          <div class="modal-header-actions">
            <button class="action-btn action-btn--primary" @click="createProjectGoal">
              <Plus :size="16" />
              新建项目目标
            </button>
            <button class="modal-close" @click="closeProjectAllGoals">
              <X :size="20" />
            </button>
          </div>
        </div>
        <div class="modal-content">
          <div class="project-all-goals">
            <div class="project-summary">
              <div class="summary-item">
                <span class="summary-label">客户名称</span>
                <span class="summary-value">{{ selectedProjectGoals.customerName }}</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">目标总数</span>
                <span class="summary-value">{{ selectedProjectGoals.goals.length }} 个</span>
              </div>
            </div>

            <div class="goals-by-type">
              <div
                v-for="goalType in ['月度', '季度', '年度']"
                :key="goalType"
                class="goal-type-section"
              >
                <div class="goal-type-header">
                  <h4 class="goal-type-title">{{ goalType }}目标</h4>
                  <span class="goal-count">{{ getGoalsByType(selectedProjectGoals.goals, goalType).length }} 个</span>
                </div>

                <div class="goals-table">
                  <table v-if="getGoalsByType(selectedProjectGoals.goals, goalType).length > 0">
                    <thead>
                      <tr>
                        <th>目标周期</th>
                        <th>销售额目标</th>
                        <th>利润目标</th>
                        <th>ROI目标</th>
                        <th>完成状态</th>
                        <th>创建时间</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="goal in getGoalsByType(selectedProjectGoals.goals, goalType)" :key="goal.id">
                        <td>{{ goal.goal_period }}</td>
                        <td>
                          <div class="goal-metric">
                            <div class="metric-target">${{ formatNumber(goal.sales_target) }}</div>
                            <div class="metric-actual">${{ formatNumber(goal.actual_sales || 0) }}</div>
                            <div class="metric-progress">
                              <div class="progress-bar-small">
                                <div
                                  class="progress-fill-small progress-fill--sales"
                                  :style="{ width: Math.min(goal.completion_rate?.sales || 0, 100) + '%' }"
                                ></div>
                              </div>
                              <span class="progress-text-small">{{ goal.completion_rate?.sales || 0 }}%</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div class="goal-metric">
                            <div class="metric-target">${{ formatNumber(goal.profit_target || 0) }}</div>
                            <div class="metric-actual">${{ formatNumber(goal.actual_profit || 0) }}</div>
                            <div class="metric-progress">
                              <div class="progress-bar-small">
                                <div
                                  class="progress-fill-small progress-fill--profit"
                                  :style="{ width: Math.min(goal.completion_rate?.profit || 0, 100) + '%' }"
                                ></div>
                              </div>
                              <span class="progress-text-small">{{ goal.completion_rate?.profit || 0 }}%</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div class="goal-metric">
                            <div class="metric-target">{{ goal.roi_target }}x</div>
                            <div class="metric-actual">{{ goal.actual_roi || 0 }}x</div>
                            <div class="metric-progress">
                              <div class="progress-bar-small">
                                <div
                                  class="progress-fill-small progress-fill--roi"
                                  :style="{ width: Math.min(goal.completion_rate?.roi || 0, 100) + '%' }"
                                ></div>
                              </div>
                              <span class="progress-text-small">{{ goal.completion_rate?.roi || 0 }}%</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span class="completion-status" :class="getCompletionClass(getAverageCompletion(goal))">
                            {{ getCompletionStatusText(getAverageCompletion(goal)) }}
                          </span>
                        </td>
                        <td>{{ formatDate(goal.created_at) }}</td>
                      </tr>
                    </tbody>
                  </table>
                  <div v-else class="no-goals-message">
                    暂无{{ goalType }}目标数据
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 新建目标弹窗 -->
    <div v-if="showCreateGoal" class="modal-overlay" @click="closeCreateGoal">
      <div class="modal-container modal-container--medium" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">新建目标</h3>
          <button class="modal-close" @click="closeCreateGoal">
            <X :size="20" />
          </button>
        </div>
        <div class="modal-content">
          <form @submit.prevent="submitCreateGoal" class="create-goal-form">
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">项目名称 *</label>
                <select v-model="newGoal.project_id" class="form-select" required>
                  <option value="">请选择项目</option>
                  <option v-for="project in projects" :key="project.id" :value="project.id">
                    {{ project.project_name }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">目标类型 *</label>
                <select v-model="newGoal.goal_type" class="form-select" required @change="updateGoalPeriodOptions">
                  <option value="">请选择目标类型</option>
                  <option value="月度">月度目标</option>
                  <option value="季度">季度目标</option>
                  <option value="年度">年度目标</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">目标周期 *</label>
                <select v-model="newGoal.goal_period" class="form-select" required>
                  <option value="">请选择目标周期</option>
                  <option v-for="period in goalPeriodOptions" :key="period" :value="period">
                    {{ period }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">销售额目标 *</label>
                <input
                  type="number"
                  v-model.number="newGoal.sales_target"
                  class="form-input"
                  placeholder="请输入销售额目标"
                  min="0"
                  step="1000"
                  required
                />
              </div>

              <div class="form-group">
                <label class="form-label">成本目标 *</label>
                <input
                  type="number"
                  v-model.number="newGoal.cost_target"
                  class="form-input"
                  placeholder="请输入成本目标"
                  min="0"
                  step="1000"
                  required
                />
              </div>

              <div class="form-group">
                <label class="form-label">ROI目标 *</label>
                <input
                  type="number"
                  v-model.number="newGoal.roi_target"
                  class="form-input"
                  placeholder="请输入ROI目标"
                  min="0"
                  step="0.1"
                  required
                />
              </div>

              <div class="form-group">
                <label class="form-label">利润目标</label>
                <input
                  type="number"
                  v-model.number="newGoal.profit_target"
                  class="form-input"
                  placeholder="请输入利润目标"
                  min="0"
                  step="1000"
                />
              </div>

              <div class="form-group">
                <label class="form-label">用户数目标</label>
                <input
                  type="number"
                  v-model.number="newGoal.user_count_target"
                  class="form-input"
                  placeholder="请输入用户数目标"
                  min="0"
                  step="100"
                />
              </div>

              <div class="form-group form-group--full">
                <label class="form-label">备注</label>
                <textarea
                  v-model="newGoal.remarks"
                  class="form-textarea"
                  placeholder="请输入备注信息"
                  rows="3"
                ></textarea>
              </div>
            </div>

            <div class="form-actions">
              <button type="button" class="btn btn--secondary" @click="closeCreateGoal">
                取消
              </button>
              <button type="submit" class="btn btn--primary" :disabled="!isFormValid">
                创建目标
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import {
  Plus,
  X
} from 'lucide-vue-next'

import { mockProjectGoals, mockProjects, type ProjectGoal, type Project } from '@/mock/projects'

// 响应式数据
const currentPage = ref(1)
const pageSize = ref(10)
const showGoalDetail = ref(false)
const selectedGoal = ref<ProjectGoal | null>(null)
const showProjectAllGoals = ref(false)
const selectedProjectGoals = ref<ProjectGroup | null>(null)
const showCreateGoal = ref(false)

const goals = ref<ProjectGoal[]>([])
const customers = ref<Array<{id: number, name: string}>>([])
const projects = ref<Project[]>([])

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

// 新建目标表单数据
const newGoal = reactive({
  project_id: '',
  goal_type: '',
  goal_period: '',
  sales_target: 0,
  cost_target: 0,
  roi_target: 0,
  profit_target: 0,
  user_count_target: 0,
  remarks: ''
})

const goalPeriodOptions = ref<string[]>([])

// 项目分组接口
interface ProjectGroup {
  projectId: number
  projectName: string
  customerName: string
  goals: ProjectGoal[]
}

// 初始化数据
onMounted(() => {
  loadGoals()
  loadCustomers()
  loadProjects()
  // 设置默认显示当前时间周期的目标
  setDefaultFilters()
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

  // 当显示全部目标时，按项目名称和目标类型排序，便于查看
  if (!filters.goalType) {
    result.sort((a, b) => {
      // 首先按项目名称排序
      if (a.project_name !== b.project_name) {
        return a.project_name.localeCompare(b.project_name)
      }
      // 然后按目标类型排序（月度 -> 季度 -> 年度）
      const typeOrder = { '月度': 1, '季度': 2, '年度': 3 }
      return (typeOrder[a.goal_type] || 4) - (typeOrder[b.goal_type] || 4)
    })
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

// 当前目标类型显示文本
const currentGoalTypeText = computed(() => {
  const goalType = goalTypes.value.find(type => type.value === filters.goalType)
  return goalType ? goalType.label : '月度目标'
})

// 表单验证
const isFormValid = computed(() => {
  return newGoal.project_id &&
         newGoal.goal_type &&
         newGoal.goal_period &&
         newGoal.sales_target > 0 &&
         newGoal.cost_target > 0 &&
         newGoal.roi_target > 0
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

// 根据目标类型筛选目标
const getGoalsByType = (goals: ProjectGoal[], goalType: string) => {
  return goals.filter(goal => goal.goal_type === goalType)
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



const formatNumber = (num: number) => {
  return num.toLocaleString('zh-CN')
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}

// 设置默认筛选条件，显示当前时间周期的目标
const setDefaultFilters = () => {
  // 默认显示月度目标
  filters.goalType = '月度'
}

const selectGoalType = (type: string) => {
  filters.goalType = type
  currentPage.value = 1
}

const handleFilterChange = () => {
  currentPage.value = 1
}

const handleCustomerChange = () => {
  filters.projectId = ''
  handleFilterChange()
}





const createGoal = () => {
  showCreateGoal.value = true
  resetNewGoalForm()
}

// 重置新建目标表单
const resetNewGoalForm = () => {
  Object.assign(newGoal, {
    project_id: '',
    goal_type: '',
    goal_period: '',
    sales_target: 0,
    cost_target: 0,
    roi_target: 0,
    profit_target: 0,
    user_count_target: 0,
    remarks: ''
  })
  goalPeriodOptions.value = []
}

// 关闭新建目标弹窗
const closeCreateGoal = () => {
  showCreateGoal.value = false
  resetNewGoalForm()
}

// 更新目标周期选项
const updateGoalPeriodOptions = () => {
  const currentYear = new Date().getFullYear()

  goalPeriodOptions.value = []

  if (newGoal.goal_type === '月度') {
    // 生成月度选项：当前年份的12个月
    for (let month = 1; month <= 12; month++) {
      goalPeriodOptions.value.push(`${currentYear}年${month}月`)
    }
    // 添加下一年的前几个月
    for (let month = 1; month <= 3; month++) {
      goalPeriodOptions.value.push(`${currentYear + 1}年${month}月`)
    }
  } else if (newGoal.goal_type === '季度') {
    // 生成季度选项
    for (let quarter = 1; quarter <= 4; quarter++) {
      goalPeriodOptions.value.push(`${currentYear}年Q${quarter}`)
    }
    for (let quarter = 1; quarter <= 2; quarter++) {
      goalPeriodOptions.value.push(`${currentYear + 1}年Q${quarter}`)
    }
  } else if (newGoal.goal_type === '年度') {
    // 生成年度选项
    for (let year = currentYear; year <= currentYear + 2; year++) {
      goalPeriodOptions.value.push(`${year}年`)
    }
  }
}

// 提交新建目标
const submitCreateGoal = () => {
  if (!isFormValid.value) {
    alert('请填写所有必填字段')
    return
  }

  // 获取选中的项目信息
  const selectedProject = projects.value.find(p => p.id === parseInt(newGoal.project_id))
  if (!selectedProject) {
    alert('请选择有效的项目')
    return
  }

  // 生成新的目标ID
  const newId = Math.max(...goals.value.map(g => g.id)) + 1

  // 创建新目标对象
  const goalToCreate: ProjectGoal = {
    id: newId,
    project_id: parseInt(newGoal.project_id),
    customer_name: selectedProject.customer_name,
    project_name: selectedProject.project_name,
    goal_type: newGoal.goal_type as '月度' | '季度' | '年度',
    goal_period: newGoal.goal_period,
    sales_target: newGoal.sales_target,
    cost_target: newGoal.cost_target,
    roi_target: newGoal.roi_target,
    profit_target: newGoal.profit_target || 0,
    user_count_target: newGoal.user_count_target || 0,
    actual_sales: 0,
    actual_cost: 0,
    actual_roi: 0,
    actual_profit: 0,
    actual_user_count: 0,
    completion_rate: {
      sales: 0,
      cost: 0,
      roi: 0,
      profit: 0,
      user_count: 0
    },
    created_at: new Date().toISOString().split('T')[0],
    created_by: '当前用户', // 这里应该从用户状态获取
    remarks: newGoal.remarks || ''
  }

  // 添加到目标列表
  goals.value.unshift(goalToCreate)

  // 关闭弹窗
  closeCreateGoal()

  // 显示成功消息
  alert('目标创建成功！')

  console.log('新建目标:', goalToCreate)
}

// 查看项目全部目标
const viewProjectAllGoals = (goal: ProjectGoal) => {
  // 获取该项目的所有目标
  const projectGoals = goals.value.filter(g => g.project_id === goal.project_id)

  selectedProjectGoals.value = {
    projectId: goal.project_id,
    projectName: goal.project_name,
    customerName: goal.customer_name,
    goals: projectGoals.sort((a, b) => {
      // 按目标类型和时间排序
      const typeOrder = { '月度': 1, '季度': 2, '年度': 3 }
      const typeComparison = (typeOrder[a.goal_type] || 4) - (typeOrder[b.goal_type] || 4)
      if (typeComparison !== 0) return typeComparison
      return b.created_at.localeCompare(a.created_at) // 最新的在前
    })
  }

  showProjectAllGoals.value = true
}

const closeProjectAllGoals = () => {
  showProjectAllGoals.value = false
  selectedProjectGoals.value = null
}

// 为当前项目创建新目标
const createProjectGoal = () => {
  if (selectedProjectGoals.value) {
    // 预填充项目信息
    newGoal.project_id = selectedProjectGoals.value.projectId.toString()

    // 关闭全部目标弹窗
    closeProjectAllGoals()

    // 打开新建目标弹窗
    showCreateGoal.value = true

    // 重置其他表单字段
    newGoal.goal_type = ''
    newGoal.goal_period = ''
    newGoal.sales_target = 0
    newGoal.cost_target = 0
    newGoal.roi_target = 0
    newGoal.profit_target = 0
    newGoal.user_count_target = 0
    newGoal.remarks = ''
    goalPeriodOptions.value = []
  }
}

// 计算平均完成率
const getAverageCompletion = (goal: ProjectGoal) => {
  const rates = [
    goal.completion_rate?.sales || 0,
    goal.completion_rate?.cost || 0,
    goal.completion_rate?.roi || 0
  ]
  return rates.reduce((sum, rate) => sum + rate, 0) / rates.length
}

// 获取完成状态文本
const getCompletionStatusText = (rate: number) => {
  if (rate >= 110) return '超额完成'
  if (rate >= 90) return '达成目标'
  if (rate >= 70) return '接近目标'
  return '未达目标'
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
  gap: 4px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  padding: 8px;
  border-radius: 16px;
  width: fit-content;
  border: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  backdrop-filter: blur(10px);
}

.goal-type-tab {
  padding: 12px 18px;
  border: none;
  background: transparent;
  color: #64748b;
  border-radius: 12px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 80px;
  justify-content: center;
}

.goal-type-tab::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1));
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 12px;
}

.goal-type-tab:hover::before {
  opacity: 1;
}

.goal-type-tab:hover {
  background: rgba(255, 255, 255, 0.9);
  color: #1e293b;
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 8px 25px -8px rgba(59, 130, 246, 0.3);
}

.goal-type-tab--active {
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 8px 25px -8px rgba(59, 130, 246, 0.5);
}

.goal-type-tab--active::before {
  opacity: 0;
}

.goal-type-tab--active:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 12px 30px -8px rgba(59, 130, 246, 0.6);
}



.tab-icon {
  font-size: 16px;
  opacity: 0.8;
  transition: transform 0.3s ease;
}

.goal-type-tab:hover .tab-icon {
  transform: scale(1.1);
}

.tab-text {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.025em;
}

.tab-indicator {
  position: absolute;
  bottom: 4px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 3px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 2px;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    width: 0;
    opacity: 0;
  }
  to {
    width: 20px;
    opacity: 1;
  }
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
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 500;
}

.action-btn-small--info {
  background: var(--color-info-light, #e0f2fe);
  color: var(--color-info, #0288d1);
}

.action-btn-small--info:hover {
  background: var(--color-info, #0288d1);
  color: white;
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

.goals-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.goal-item {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
  transition: all 0.2s ease;
}

.goal-item:hover {
  border-color: var(--color-primary);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.goal-period {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);
}

.goal-metrics {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.metric-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.metric-label {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.metric-progress {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.progress-text {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  min-width: 35px;
  text-align: right;
}

.metric-values {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--font-size-xs);
}

.target-value {
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-medium);
}

.actual-value {
  color: var(--color-text-primary);
  font-weight: var(--font-weight-semibold);
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

.goal-actions {
  display: flex;
  gap: var(--spacing-xs);
  justify-content: flex-end;
}

.action-btn-small {
  padding: var(--spacing-xs) var(--spacing-sm);
  border: none;
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.action-btn-small--primary {
  background: var(--color-primary-light);
  color: var(--color-primary);
}

.action-btn-small--primary:hover {
  background: var(--color-primary);
  color: white;
}

.action-btn-small--secondary {
  background: var(--color-background);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
}

.action-btn-small--secondary:hover {
  background: var(--color-background-hover);
  color: var(--color-text-primary);
  border-color: var(--color-primary);
}

.action-btn-small--danger {
  background: var(--color-danger-light);
  color: var(--color-danger);
}

.action-btn-small--danger:hover {
  background: var(--color-danger);
  color: white;
}

.no-goals {
  text-align: center;
  padding: var(--spacing-lg);
  color: var(--color-text-secondary);
  font-style: italic;
  background: var(--color-background);
  border: 1px dashed var(--color-border);
  border-radius: var(--border-radius-md);
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
  z-index: var(--z-modal, 1040);
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

.modal-header-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
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

/* 项目全部目标弹窗样式 */
.modal-container--large {
  max-width: 1200px;
  width: 95%;
  max-height: 95vh;
}

.project-all-goals {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.project-summary {
  display: flex;
  gap: var(--spacing-xl);
  padding: var(--spacing-md);
  background: var(--color-background);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--color-border);
}

.summary-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.summary-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-medium);
}

.summary-value {
  font-size: var(--font-size-lg);
  color: var(--color-text-primary);
  font-weight: var(--font-weight-semibold);
}

.goals-by-type {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.goal-type-section {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
}

.goal-type-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--color-background);
  border-bottom: 1px solid var(--color-border);
}

.goal-type-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0;
}

.goal-count {
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--color-primary-light);
  color: var(--color-primary);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.goals-table {
  overflow-x: auto;
}

.goals-table table {
  width: 100%;
  border-collapse: collapse;
}

.goals-table th,
.goals-table td {
  padding: var(--spacing-sm) var(--spacing-md);
  text-align: left;
  border-bottom: 1px solid var(--color-border-light);
}

.goals-table th {
  background: var(--color-background);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
}

.goals-table td {
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
}

.goal-metric {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  min-width: 120px;
}

.metric-target {
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.metric-actual {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}

.metric-progress {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.progress-bar-small {
  flex: 1;
  height: 4px;
  background: var(--color-background);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill-small {
  height: 100%;
  border-radius: 2px;
  transition: width 0.3s ease;
}

.progress-text-small {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
  min-width: 30px;
  text-align: right;
}

.completion-status {
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.completion-status.excellent {
  background: var(--color-success-light);
  color: var(--color-success);
}

.completion-status.good {
  background: var(--color-primary-light);
  color: var(--color-primary);
}

.completion-status.warning {
  background: var(--color-warning-light);
  color: var(--color-warning);
}

.completion-status.danger {
  background: var(--color-danger-light);
  color: var(--color-danger);
}

.no-goals-message {
  padding: var(--spacing-xl);
  text-align: center;
  color: var(--color-text-secondary);
  font-style: italic;
  background: var(--color-background);
}

/* 新建目标弹窗样式 */
.modal-container--medium {
  max-width: 800px;
  width: 90%;
  max-height: 90vh;
}

.create-goal-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.form-group--full {
  grid-column: 1 / -1;
}

.form-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.form-select,
.form-input,
.form-textarea {
  padding: var(--spacing-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  transition: border-color 0.2s ease;
}

.form-select:focus,
.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--color-border);
}

.btn {
  padding: var(--spacing-sm) var(--spacing-lg);
  border: none;
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 80px;
}

.btn--primary {
  background: var(--color-primary);
  color: white;
}

.btn--primary:hover:not(:disabled) {
  background: var(--color-primary-dark, #2563eb);
}

.btn--primary:disabled {
  background: var(--color-border);
  color: var(--color-text-secondary);
  cursor: not-allowed;
}

.btn--secondary {
  background: var(--color-background);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}

.btn--secondary:hover {
  background: var(--color-background-hover);
  border-color: var(--color-primary);
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

  .projects-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
    padding: var(--spacing-md);
  }

  .project-card-header {
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-sm);
  }

  .goal-metrics {
    gap: var(--spacing-md);
  }

  .metric-item {
    background: var(--color-surface);
    padding: var(--spacing-sm);
    border-radius: var(--border-radius-sm);
    border: 1px solid var(--color-border-light);
  }

  .goal-actions {
    flex-wrap: wrap;
    justify-content: center;
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

  .modal-container--medium {
    width: 95%;
    max-width: none;
  }

  .form-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-sm);
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .btn {
    width: 100%;
  }
}
</style>
