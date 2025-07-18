<template>
  <div class="project-goals-view">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="page-header__main">
        <h1 class="page-title">项目目标管理</h1>
        <p class="page-description">查看和管理所有项目的目标设定与完成情况</p>
      </div>
      <div class="page-header__actions">
        <button
          class="action-btn action-btn--secondary"
          @click="showDashboard = !showDashboard"
        >
          <BarChart3 :size="16" />
          {{ showDashboard ? '隐藏看板' : '显示看板' }}
        </button>
        <button
          class="action-btn action-btn--secondary"
          @click="exportGoals"
        >
          <Download :size="16" />
          导出数据
        </button>
        <button class="action-btn action-btn--primary" @click="createGoal">
          <Plus :size="16" />
          新建目标
        </button>
      </div>
    </div>

    <!-- 目标管理看板 -->
    <div v-if="showDashboard" class="dashboard-section">
      <ProjectGoalsDashboard />
    </div>

    <!-- 趋势分析 -->
    <div class="trend-analysis-section">
      <div class="section-header">
        <h3>趋势分析</h3>
        <button
          class="toggle-btn"
          @click="showTrendAnalysis = !showTrendAnalysis"
        >
          {{ showTrendAnalysis ? '收起分析' : '展开分析' }}
          <ChevronDown :size="16" :class="{ 'rotate-180': showTrendAnalysis }" />
        </button>
      </div>
      <div v-if="showTrendAnalysis" class="trend-analysis-content">
        <ProjectGoalsTrendAnalysis />
      </div>
    </div>

    <!-- 筛选区域 -->
    <div class="filter-section">
      <div class="filter-header">
        <h3>筛选条件</h3>
        <button
          class="filter-toggle"
          @click="showAdvancedFilter = !showAdvancedFilter"
        >
          <Filter :size="16" />
          {{ showAdvancedFilter ? '收起筛选' : '展开筛选' }}
          <ChevronDown :size="16" :class="{ 'rotate-180': showAdvancedFilter }" />
        </button>
      </div>

      <div class="filter-content" :class="{ 'filter-content--expanded': showAdvancedFilter }">
        <div class="filter-row">
          <!-- 基础筛选 -->
          <div class="filter-group">
            <label class="filter-label">目标类型</label>
            <select v-model="filters.goalType" @change="handleFilterChange" class="filter-select">
              <option value="">全部类型</option>
              <option value="月度">月度目标</option>
              <option value="季度">季度目标</option>
              <option value="年度">年度目标</option>
            </select>
          </div>

          <div class="filter-group">
            <label class="filter-label">完成状态</label>
            <select v-model="filters.completionStatus" @change="handleFilterChange" class="filter-select">
              <option value="">全部状态</option>
              <option value="excellent">超额完成 (≥110%)</option>
              <option value="good">达成目标 (90-109%)</option>
              <option value="warning">接近目标 (70-89%)</option>
              <option value="danger">未达目标 (<70%)</option>
            </select>
          </div>

          <div class="filter-group">
            <label class="filter-label">目标周期</label>
            <input
              type="text"
              v-model="filters.goalPeriod"
              @input="handleFilterChange"
              placeholder="例如：2024年12月"
              class="filter-input"
            />
          </div>
        </div>

        <!-- 高级筛选 -->
        <div v-if="showAdvancedFilter" class="advanced-filters">
          <div class="filter-row">
            <div class="filter-group">
              <label class="filter-label">客户名称</label>
              <select v-model="filters.customerId" @change="handleCustomerChange" class="filter-select">
                <option value="">全部客户</option>
                <option v-for="customer in customers" :key="customer.id" :value="customer.id">
                  {{ customer.name }}
                </option>
              </select>
            </div>

            <div class="filter-group">
              <label class="filter-label">项目名称</label>
              <select v-model="filters.projectId" @change="handleFilterChange" class="filter-select">
                <option value="">全部项目</option>
                <option v-for="project in availableProjects" :key="project.id" :value="project.id">
                  {{ project.project_name }}
                </option>
              </select>
            </div>

            <div class="filter-group">
              <label class="filter-label">创建人</label>
              <select v-model="filters.createdBy" @change="handleFilterChange" class="filter-select">
                <option value="">全部创建人</option>
                <option v-for="creator in creators" :key="creator" :value="creator">
                  {{ creator }}
                </option>
              </select>
            </div>
          </div>

          <div class="filter-row">
            <div class="filter-group">
              <label class="filter-label">创建时间范围</label>
              <div class="date-range">
                <input
                  type="date"
                  v-model="filters.startDate"
                  @change="handleFilterChange"
                  class="filter-input"
                />
                <span class="date-separator">至</span>
                <input
                  type="date"
                  v-model="filters.endDate"
                  @change="handleFilterChange"
                  class="filter-input"
                />
              </div>
            </div>

            <div class="filter-group">
              <label class="filter-label">销量目标范围</label>
              <div class="amount-range">
                <input
                  type="number"
                  v-model.number="filters.minSalesTarget"
                  @input="handleFilterChange"
                  placeholder="最小值"
                  class="filter-input"
                />
                <span class="range-separator">-</span>
                <input
                  type="number"
                  v-model.number="filters.maxSalesTarget"
                  @input="handleFilterChange"
                  placeholder="最大值"
                  class="filter-input"
                />
              </div>
            </div>

            <div class="filter-group">
              <label class="filter-label">完成率范围</label>
              <div class="amount-range">
                <input
                  type="number"
                  v-model.number="filters.minCompletionRate"
                  @input="handleFilterChange"
                  placeholder="最小值(%)"
                  class="filter-input"
                />
                <span class="range-separator">-</span>
                <input
                  type="number"
                  v-model.number="filters.maxCompletionRate"
                  @input="handleFilterChange"
                  placeholder="最大值(%)"
                  class="filter-input"
                />
              </div>
            </div>
          </div>

          <div class="filter-actions">
            <button class="action-btn action-btn--secondary" @click="resetFilters">
              <RotateCcw :size="16" />
              重置筛选
            </button>
            <button class="action-btn action-btn--primary" @click="applyFilters">
              <Search :size="16" />
              应用筛选
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 目标列表 -->
    <div class="goals-section">
      <div class="section-header">
        <div class="section-info">
          <h3>目标列表</h3>
          <span class="record-count">共 {{ filteredGoals.length }} 条记录</span>
        </div>
        <div class="section-actions">
          <div class="view-options">
            <button
              class="view-btn"
              :class="{ 'view-btn--active': viewMode === 'table' }"
              @click="viewMode = 'table'"
              title="表格视图"
            >
              <List :size="16" />
            </button>
            <button
              class="view-btn"
              :class="{ 'view-btn--active': viewMode === 'card' }"
              @click="viewMode = 'card'"
              title="卡片视图"
            >
              <Grid :size="16" />
            </button>
          </div>
          <div class="sort-options">
            <select v-model="sortBy" @change="handleSort" class="sort-select">
              <option value="created_at">创建时间</option>
              <option value="goal_period">目标周期</option>
              <option value="sales_target">销量目标</option>
              <option value="completion_rate">完成率</option>
            </select>
            <button
              class="sort-direction"
              @click="toggleSortDirection"
              :title="sortDirection === 'asc' ? '升序' : '降序'"
            >
              <ChevronUp v-if="sortDirection === 'asc'" :size="16" />
              <ChevronDown v-if="sortDirection === 'desc'" :size="16" />
            </button>
          </div>
        </div>
      </div>

      <!-- 表格视图 -->
      <div v-if="viewMode === 'table'" class="goals-table">
        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>客户名称</th>
                <th>项目名称</th>
                <th>目标类型</th>
                <th>目标周期</th>
                <th>销量目标</th>
                <th>成本目标</th>
                <th>ROI目标</th>
                <th>销量完成率</th>
                <th>ROI完成率</th>
                <th>综合状态</th>
                <th>创建人</th>
                <th>创建时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="goal in paginatedGoals" :key="goal.id" class="goal-row">
                <td>{{ goal.customer_name }}</td>
                <td>{{ goal.project_name }}</td>
                <td>
                  <span class="goal-type-badge" :class="getGoalTypeClass(goal.goal_type)">
                    {{ goal.goal_type }}
                  </span>
                </td>
                <td>{{ goal.goal_period }}</td>
                <td>¥{{ formatNumber(goal.sales_target) }}</td>
                <td>¥{{ formatNumber(goal.cost_target) }}</td>
                <td>{{ goal.roi_target }}x</td>
                <td>
                  <div class="completion-cell">
                    <span class="completion-rate" :class="getCompletionClass(goal.completion_rate?.sales || 0)">
                      {{ goal.completion_rate?.sales || 0 }}%
                    </span>
                    <div class="mini-progress">
                      <div
                        class="mini-progress-fill"
                        :style="{ width: Math.min(goal.completion_rate?.sales || 0, 100) + '%' }"
                        :class="getCompletionClass(goal.completion_rate?.sales || 0)"
                      ></div>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="completion-cell">
                    <span class="completion-rate" :class="getCompletionClass(goal.completion_rate?.roi || 0)">
                      {{ goal.completion_rate?.roi || 0 }}%
                    </span>
                    <div class="mini-progress">
                      <div
                        class="mini-progress-fill"
                        :style="{ width: Math.min(goal.completion_rate?.roi || 0, 100) + '%' }"
                        :class="getCompletionClass(goal.completion_rate?.roi || 0)"
                      ></div>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="status-badge" :class="getOverallStatusClass(goal)">
                    {{ getOverallStatusText(goal) }}
                  </span>
                </td>
                <td>{{ goal.created_by }}</td>
                <td>{{ formatDate(goal.created_at) }}</td>
                <td>
                  <div class="action-buttons">
                    <button
                      class="action-btn-small action-btn-small--primary"
                      @click="viewGoalDetail(goal)"
                      title="查看详情"
                    >
                      <Eye :size="14" />
                    </button>
                    <button
                      class="action-btn-small action-btn-small--secondary"
                      @click="editGoal(goal)"
                      title="编辑"
                    >
                      <Edit :size="14" />
                    </button>
                    <button
                      class="action-btn-small action-btn-small--danger"
                      @click="deleteGoal(goal)"
                      title="删除"
                    >
                      <Trash2 :size="14" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 卡片视图 -->
      <div v-if="viewMode === 'card'" class="goals-cards">
        <div
          v-for="goal in paginatedGoals"
          :key="goal.id"
          class="goal-card"
          @click="viewGoalDetail(goal)"
        >
          <div class="goal-card__header">
            <div class="goal-card__title">
              <h4>{{ goal.project_name }}</h4>
              <p>{{ goal.customer_name }}</p>
            </div>
            <div class="goal-card__type">
              <span class="goal-type-badge" :class="getGoalTypeClass(goal.goal_type)">
                {{ goal.goal_type }}
              </span>
            </div>
          </div>

          <div class="goal-card__period">
            <span class="period-text">{{ goal.goal_period }}</span>
          </div>

          <div class="goal-card__metrics">
            <div class="metric-row">
              <div class="metric-item">
                <span class="metric-label">销量完成率</span>
                <div class="metric-progress">
                  <div class="progress-bar">
                    <div
                      class="progress-fill"
                      :style="{ width: Math.min(goal.completion_rate?.sales || 0, 100) + '%' }"
                      :class="getCompletionClass(goal.completion_rate?.sales || 0)"
                    ></div>
                  </div>
                  <span class="progress-text" :class="getCompletionClass(goal.completion_rate?.sales || 0)">
                    {{ goal.completion_rate?.sales || 0 }}%
                  </span>
                </div>
              </div>

              <div class="metric-item">
                <span class="metric-label">ROI完成率</span>
                <div class="metric-progress">
                  <div class="progress-bar">
                    <div
                      class="progress-fill"
                      :style="{ width: Math.min(goal.completion_rate?.roi || 0, 100) + '%' }"
                      :class="getCompletionClass(goal.completion_rate?.roi || 0)"
                    ></div>
                  </div>
                  <span class="progress-text" :class="getCompletionClass(goal.completion_rate?.roi || 0)">
                    {{ goal.completion_rate?.roi || 0 }}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="goal-card__footer">
            <div class="goal-card__status">
              <span class="status-badge" :class="getOverallStatusClass(goal)">
                {{ getOverallStatusText(goal) }}
              </span>
            </div>
            <div class="goal-card__actions" @click.stop>
              <button
                class="action-btn-small action-btn-small--secondary"
                @click="editGoal(goal)"
                title="编辑"
              >
                <Edit :size="14" />
              </button>
              <button
                class="action-btn-small action-btn-small--danger"
                @click="deleteGoal(goal)"
                title="删除"
              >
                <Trash2 :size="14" />
              </button>
            </div>
          </div>
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
            @click="currentPage = 1"
          >
            首页
          </button>
          <button
            class="pagination-btn"
            :disabled="currentPage === 1"
            @click="currentPage--"
          >
            上一页
          </button>
          <span class="pagination-info">
            第 {{ currentPage }} 页，共 {{ totalPages }} 页
          </span>
          <button
            class="pagination-btn"
            :disabled="currentPage === totalPages"
            @click="currentPage++"
          >
            下一页
          </button>
          <button
            class="pagination-btn"
            :disabled="currentPage === totalPages"
            @click="currentPage = totalPages"
          >
            末页
          </button>
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
          <!-- 目标详情内容 -->
          <div class="goal-detail">
            <div class="detail-section">
              <h4>基本信息</h4>
              <div class="detail-grid">
                <div class="detail-item">
                  <span class="detail-label">客户名称</span>
                  <span class="detail-value">{{ selectedGoal.customer_name }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">项目名称</span>
                  <span class="detail-value">{{ selectedGoal.project_name }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">目标类型</span>
                  <span class="detail-value">{{ selectedGoal.goal_type }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">目标周期</span>
                  <span class="detail-value">{{ selectedGoal.goal_period }}</span>
                </div>
              </div>
            </div>

            <div class="detail-section">
              <h4>目标设定</h4>
              <div class="targets-grid">
                <div class="target-item">
                  <span class="target-label">销量目标</span>
                  <span class="target-value">¥{{ formatNumber(selectedGoal.sales_target) }}</span>
                </div>
                <div class="target-item">
                  <span class="target-label">成本目标</span>
                  <span class="target-value">¥{{ formatNumber(selectedGoal.cost_target) }}</span>
                </div>
                <div class="target-item">
                  <span class="target-label">ROI目标</span>
                  <span class="target-value">{{ selectedGoal.roi_target }}x</span>
                </div>
                <div class="target-item" v-if="selectedGoal.profit_target">
                  <span class="target-label">利润目标</span>
                  <span class="target-value">¥{{ formatNumber(selectedGoal.profit_target) }}</span>
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
                      目标: ¥{{ formatNumber(selectedGoal.sales_target) }} |
                      实际: ¥{{ formatNumber(selectedGoal.actual_sales || 0) }}
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
  ChevronUp,
  RotateCcw,
  Search,
  List,
  Grid,
  Eye,
  Edit,
  Trash2,
  X
} from 'lucide-vue-next'
import ProjectGoalsDashboard from '@/components/projects/ProjectGoalsDashboard.vue'
import ProjectGoalsTrendAnalysis from '@/components/projects/ProjectGoalsTrendAnalysis.vue'
import { mockProjectGoals, mockProjects, type ProjectGoal, type Project } from '@/mock/projects'

const router = useRouter()

// 响应式数据
const showDashboard = ref(true)
const showTrendAnalysis = ref(false)
const showAdvancedFilter = ref(false)
const viewMode = ref<'table' | 'card'>('table')
const sortBy = ref('created_at')
const sortDirection = ref<'asc' | 'desc'>('desc')
const currentPage = ref(1)
const pageSize = ref(10)
const showGoalDetail = ref(false)
const selectedGoal = ref<ProjectGoal | null>(null)

const goals = ref<ProjectGoal[]>([])
const customers = ref<Array<{id: number, name: string}>>([])
const projects = ref<Project[]>([])
const creators = ref<string[]>([])

const filters = reactive({
  goalType: '',
  completionStatus: '',
  goalPeriod: '',
  customerId: '',
  projectId: '',
  createdBy: '',
  startDate: '',
  endDate: '',
  minSalesTarget: null as number | null,
  maxSalesTarget: null as number | null,
  minCompletionRate: null as number | null,
  maxCompletionRate: null as number | null
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

  // 完成状态筛选
  if (filters.completionStatus) {
    result = result.filter(goal => {
      const avgCompletion = getAverageCompletion(goal)
      switch (filters.completionStatus) {
        case 'excellent': return avgCompletion >= 110
        case 'good': return avgCompletion >= 90 && avgCompletion < 110
        case 'warning': return avgCompletion >= 70 && avgCompletion < 90
        case 'danger': return avgCompletion < 70
        default: return true
      }
    })
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

  // 创建人筛选
  if (filters.createdBy) {
    result = result.filter(goal => goal.created_by === filters.createdBy)
  }

  // 创建时间范围筛选
  if (filters.startDate) {
    result = result.filter(goal =>
      new Date(goal.created_at) >= new Date(filters.startDate)
    )
  }
  if (filters.endDate) {
    result = result.filter(goal =>
      new Date(goal.created_at) <= new Date(filters.endDate)
    )
  }

  // 销量目标范围筛选
  if (filters.minSalesTarget !== null) {
    result = result.filter(goal => goal.sales_target >= filters.minSalesTarget!)
  }
  if (filters.maxSalesTarget !== null) {
    result = result.filter(goal => goal.sales_target <= filters.maxSalesTarget!)
  }

  // 完成率范围筛选
  if (filters.minCompletionRate !== null) {
    result = result.filter(goal => {
      const avgCompletion = getAverageCompletion(goal)
      return avgCompletion >= filters.minCompletionRate!
    })
  }
  if (filters.maxCompletionRate !== null) {
    result = result.filter(goal => {
      const avgCompletion = getAverageCompletion(goal)
      return avgCompletion <= filters.maxCompletionRate!
    })
  }

  // 排序
  result.sort((a, b) => {
    let aValue: any, bValue: any

    switch (sortBy.value) {
      case 'created_at':
        aValue = new Date(a.created_at).getTime()
        bValue = new Date(b.created_at).getTime()
        break
      case 'goal_period':
        aValue = a.goal_period
        bValue = b.goal_period
        break
      case 'sales_target':
        aValue = a.sales_target
        bValue = b.sales_target
        break
      case 'completion_rate':
        aValue = getAverageCompletion(a)
        bValue = getAverageCompletion(b)
        break
      default:
        aValue = a.created_at
        bValue = b.created_at
    }

    if (sortDirection.value === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

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

const resetFilters = () => {
  Object.keys(filters).forEach(key => {
    if (typeof filters[key as keyof typeof filters] === 'string') {
      (filters[key as keyof typeof filters] as string) = ''
    } else {
      (filters[key as keyof typeof filters] as number | null) = null
    }
  })
  currentPage.value = 1
}

const applyFilters = () => {
  currentPage.value = 1
  // 筛选逻辑已在computed中处理
}

const handleSort = () => {
  currentPage.value = 1
}

const toggleSortDirection = () => {
  sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  currentPage.value = 1
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

const exportGoals = () => {
  console.log('导出目标数据')
  // TODO: 实现导出功能
}
</script>

<style scoped>
.project-goals-view {
  padding: 24px;
  background: var(--color-background);
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--color-border);
}

.page-header__main h1 {
  font-size: 28px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 8px 0;
}

.page-header__main p {
  color: var(--color-text-secondary);
  margin: 0;
  font-size: 16px;
}

.page-header__actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 6px;
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn--primary {
  background: var(--color-primary);
  color: white;
}

.action-btn--primary:hover {
  background: var(--color-primary-hover);
}

.action-btn--secondary {
  background: var(--color-background-secondary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}

.action-btn--secondary:hover {
  background: var(--color-background-hover);
}

.dashboard-section {
  margin-bottom: 32px;
  background: var(--color-background-secondary);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  overflow: hidden;
}

/* 筛选区域 */
.filter-section {
  background: var(--color-background-secondary);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  margin-bottom: 24px;
  overflow: hidden;
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--color-border);
}

.filter-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.filter-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border: 1px solid var(--color-border);
  background: var(--color-background);
  color: var(--color-text-secondary);
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-toggle:hover {
  background: var(--color-background-hover);
  color: var(--color-text-primary);
}

.filter-toggle .rotate-180 {
  transform: rotate(180deg);
}

.filter-content {
  padding: 20px;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.filter-content--expanded {
  max-height: 1000px;
}

.filter-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
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

.date-range,
.amount-range {
  display: flex;
  align-items: center;
  gap: 8px;
}

.date-separator,
.range-separator {
  color: var(--color-text-secondary);
  font-size: 14px;
}

.advanced-filters {
  border-top: 1px solid var(--color-border);
  padding-top: 20px;
  margin-top: 20px;
}

.filter-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid var(--color-border);
}

/* 目标列表区域 */
.goals-section {
  background: var(--color-background-secondary);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  overflow: hidden;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid var(--color-border);
}

.section-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.section-info h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.record-count {
  color: var(--color-text-secondary);
  font-size: 14px;
}

.section-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.view-options {
  display: flex;
  gap: 4px;
}

.view-btn {
  padding: 6px 8px;
  border: 1px solid var(--color-border);
  background: var(--color-background);
  color: var(--color-text-secondary);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.view-btn:hover {
  background: var(--color-background-hover);
  color: var(--color-text-primary);
}

.view-btn--active {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.sort-options {
  display: flex;
  align-items: center;
  gap: 4px;
}

.sort-select {
  padding: 6px 8px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: var(--color-background);
  color: var(--color-text-primary);
  font-size: 14px;
}

.sort-direction {
  padding: 6px 8px;
  border: 1px solid var(--color-border);
  background: var(--color-background);
  color: var(--color-text-secondary);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.sort-direction:hover {
  background: var(--color-background-hover);
  color: var(--color-text-primary);
}

/* 表格视图 */
.goals-table {
  overflow-x: auto;
}

.table-wrapper {
  min-width: 1200px;
}

.goals-table table {
  width: 100%;
  border-collapse: collapse;
}

.goals-table th,
.goals-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid var(--color-border);
}

.goals-table th {
  background: var(--color-background-tertiary);
  font-weight: 600;
  color: var(--color-text-primary);
  font-size: 14px;
}

.goals-table td {
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

.completion-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
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

.mini-progress {
  width: 60px;
  height: 4px;
  background: var(--color-background-tertiary);
  border-radius: 2px;
  overflow: hidden;
}

.mini-progress-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.3s ease;
}

.mini-progress-fill.excellent {
  background: var(--color-success);
}

.mini-progress-fill.good {
  background: var(--color-primary);
}

.mini-progress-fill.warning {
  background: var(--color-warning);
}

.mini-progress-fill.danger {
  background: var(--color-danger);
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.excellent {
  background: var(--color-success-light);
  color: var(--color-success);
}

.status-badge.good {
  background: var(--color-primary-light);
  color: var(--color-primary);
}

.status-badge.warning {
  background: var(--color-warning-light);
  color: var(--color-warning);
}

.status-badge.danger {
  background: var(--color-danger-light);
  color: var(--color-danger);
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

.action-btn-small--secondary {
  background: var(--color-background-tertiary);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
}

.action-btn-small--secondary:hover {
  background: var(--color-background-hover);
  color: var(--color-text-primary);
}

.action-btn-small--danger {
  background: var(--color-danger-light);
  color: var(--color-danger);
}

.action-btn-small--danger:hover {
  background: var(--color-danger);
  color: white;
}

/* 卡片视图 */
.goals-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  padding: 20px;
}

.goal-card {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.goal-card:hover {
  border-color: var(--color-primary);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.goal-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.goal-card__title h4 {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 4px 0;
}

.goal-card__title p {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin: 0;
}

.goal-card__period {
  margin-bottom: 16px;
}

.period-text {
  font-size: 14px;
  color: var(--color-text-secondary);
  background: var(--color-background-secondary);
  padding: 4px 8px;
  border-radius: 4px;
}

.goal-card__metrics {
  margin-bottom: 16px;
}

.metric-row {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.metric-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.metric-label {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.metric-progress {
  display: flex;
  align-items: center;
  gap: 8px;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: var(--color-background-tertiary);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.progress-fill.excellent {
  background: var(--color-success);
}

.progress-fill.good {
  background: var(--color-primary);
}

.progress-fill.warning {
  background: var(--color-warning);
}

.progress-fill.danger {
  background: var(--color-danger);
}

.progress-text {
  font-size: 12px;
  font-weight: 600;
  min-width: 40px;
  text-align: right;
}

.progress-text.excellent {
  color: var(--color-success);
}

.progress-text.good {
  color: var(--color-primary);
}

.progress-text.warning {
  color: var(--color-warning);
}

.progress-text.danger {
  color: var(--color-danger);
}

.goal-card__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.goal-card__actions {
  display: flex;
  gap: 4px;
}

/* 分页 */
.pagination-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-top: 1px solid var(--color-border);
}

.pagination-info {
  color: var(--color-text-secondary);
  font-size: 14px;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pagination-btn {
  padding: 6px 12px;
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
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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

.goal-detail {
  display: flex;
  flex-direction: column;
  gap: 24px;
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

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-label {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.detail-value {
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
  .page-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .page-header__actions {
    justify-content: flex-end;
  }

  .filter-row {
    grid-template-columns: 1fr;
  }

  .section-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .section-actions {
    justify-content: space-between;
  }

  .goals-cards {
    grid-template-columns: 1fr;
  }

  .pagination-section {
    flex-direction: column;
    gap: 16px;
  }

  .detail-grid,
  .targets-grid {
    grid-template-columns: 1fr;
  }

  .create-info {
    flex-direction: column;
    gap: 8px;
  }
}
</style>
