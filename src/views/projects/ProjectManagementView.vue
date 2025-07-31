<template>
  <div class="project-data-panel">
    <div class="panel-header">
      <div class="header-content">
        <h3>项目管理</h3>
        <p>管理和分析您的项目数据，优化项目运营效率</p>
      </div>
      <div class="header-actions">
        <button
          class="action-btn action-btn--secondary"
          @click="router.push('/projects/goals')"
        >
          <Target :size="16" />
          目标管理
        </button>
        <button
          class="action-btn action-btn--secondary"
          @click="showExportModal = true"
        >
          <Download :size="16" />
          导出数据
        </button>
        <button class="action-btn action-btn--primary" @click="createProject">
          <Plus :size="16" />
          新建项目
        </button>
      </div>
    </div>

    <div class="project-content">
      <!-- 搜索和筛选区域 -->
      <div class="search-filter-section">
        <div class="search-section">
          <SearchInput
            v-model="searchQuery"
            placeholder="搜索项目名称、合同编号、客户名称、销售人员..."
            :suggestions="searchSuggestions"
            @search="handleSearch"
            @clear="handleSearchClear"
            class="project-search"
          />
          <div class="search-stats" v-if="searchQuery">
            找到 <strong>{{ filteredProjects.length }}</strong> 个结果
          </div>
        </div>

        <div class="filter-section">
          <FilterPanel
            :modal="true"
            :show-date-filter="true"
            :show-status-filter="true"
            :show-category-filter="true"
            :show-amount-filter="true"
            amount-label="服务费"
            :status-options="statusOptions"
            :category-options="typeOptions"
            :custom-filters="customFilterOptions"
            @filter-change="handleFilterChange"
            @filter-apply="handleFilterApply"
            @filter-clear="handleFilterClear"
          />
        </div>
      </div>

      <!-- 项目表格 -->
      <div class="project-table-section">
        <div class="table-header">
          <div class="table-header__left">
            <h3>项目列表</h3>
            <span class="record-count">共 {{ filteredProjects.length }} 条记录</span>
          </div>
          <div class="table-header__right">
            <div class="table-controls">
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
                  :class="{ 'view-btn--active': viewMode === 'grid' }"
                  @click="viewMode = 'grid'"
                  title="网格视图"
                >
                  <Grid :size="16" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 表格视图 -->
        <div v-if="viewMode === 'table'" class="project-table">
          <div class="table-wrapper">
            <table>
            <thead>
              <tr>
                <th class="fixed-column checkbox-col">
                  <input
                    type="checkbox"
                    v-model="selectAll"
                    @change="handleSelectAll"
                  />
                </th>
                <th @click="handleSort('project_name')" class="sortable fixed-column name-col">
                  项目名称
                  <ChevronUp v-if="sortField === 'project_name' && sortOrder === 'asc'" :size="14" />
                  <ChevronDown v-if="sortField === 'project_name' && sortOrder === 'desc'" :size="14" />
                </th>
                <th @click="handleSort('project_duration')" class="sortable">
                  项目时间
                  <ChevronUp v-if="sortField === 'project_duration' && sortOrder === 'asc'" :size="14" />
                  <ChevronDown v-if="sortField === 'project_duration' && sortOrder === 'desc'" :size="14" />
                </th>
                <th @click="handleSort('project_type')" class="sortable">
                  项目类型
                  <ChevronUp v-if="sortField === 'project_type' && sortOrder === 'asc'" :size="14" />
                  <ChevronDown v-if="sortField === 'project_type' && sortOrder === 'desc'" :size="14" />
                </th>
                <th @click="handleSort('project_status')" class="sortable">
                  项目状态
                  <ChevronUp v-if="sortField === 'project_status' && sortOrder === 'asc'" :size="14" />
                  <ChevronDown v-if="sortField === 'project_status' && sortOrder === 'desc'" :size="14" />
                </th>
                <th @click="handleSort('cooperation_period')" class="sortable">
                  合作周期
                  <ChevronUp v-if="sortField === 'cooperation_period' && sortOrder === 'asc'" :size="14" />
                  <ChevronDown v-if="sortField === 'cooperation_period' && sortOrder === 'desc'" :size="14" />
                </th>
                <th>合作平台</th>
                <th @click="handleSort('contract_number')" class="sortable">
                  合同编号
                  <ChevronUp v-if="sortField === 'contract_number' && sortOrder === 'asc'" :size="14" />
                  <ChevronDown v-if="sortField === 'contract_number' && sortOrder === 'desc'" :size="14" />
                </th>
                <th @click="handleSort('new_order_count')" class="sortable">
                  核算新单数
                  <ChevronUp v-if="sortField === 'new_order_count' && sortOrder === 'asc'" :size="14" />
                  <ChevronDown v-if="sortField === 'new_order_count' && sortOrder === 'desc'" :size="14" />
                </th>
                <th @click="handleSort('first_service_fee')" class="sortable">
                  首次到账服务费
                  <ChevronUp v-if="sortField === 'first_service_fee' && sortOrder === 'asc'" :size="14" />
                  <ChevronDown v-if="sortField === 'first_service_fee' && sortOrder === 'desc'" :size="14" />
                </th>
                <th @click="handleSort('first_payment_date')" class="sortable">
                  首次到账日期
                  <ChevronUp v-if="sortField === 'first_payment_date' && sortOrder === 'asc'" :size="14" />
                  <ChevronDown v-if="sortField === 'first_payment_date' && sortOrder === 'desc'" :size="14" />
                </th>
                <th @click="handleSort('customer_name')" class="sortable">
                  所属客户
                  <ChevronUp v-if="sortField === 'customer_name' && sortOrder === 'asc'" :size="14" />
                  <ChevronDown v-if="sortField === 'customer_name' && sortOrder === 'desc'" :size="14" />
                </th>
                <th @click="handleSort('service_fee')" class="sortable">
                  项目服务费
                  <ChevronUp v-if="sortField === 'service_fee' && sortOrder === 'asc'" :size="14" />
                  <ChevronDown v-if="sortField === 'service_fee' && sortOrder === 'desc'" :size="14" />
                </th>

                <th @click="handleSort('operation_team')" class="sortable">
                  负责运营团队
                  <ChevronUp v-if="sortField === 'operation_team' && sortOrder === 'asc'" :size="14" />
                  <ChevronDown v-if="sortField === 'operation_team' && sortOrder === 'desc'" :size="14" />
                </th>
                <th @click="handleSort('sales_person')" class="sortable">
                  销售人员
                  <ChevronUp v-if="sortField === 'sales_person' && sortOrder === 'asc'" :size="14" />
                  <ChevronDown v-if="sortField === 'sales_person' && sortOrder === 'desc'" :size="14" />
                </th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="project in paginatedProjects"
                :key="project.id"
                :class="{ 'selected': selectedProjects.includes(project.id) }"
              >
                <td class="fixed-column checkbox-col">
                  <input
                    type="checkbox"
                    :value="project.id"
                    v-model="selectedProjects"
                  />
                </td>
                <td class="fixed-column name-col">
                  <div class="project-name-cell">
                    <span class="name">{{ project.project_name }}</span>
                  </div>
                </td>
                <td class="project-duration">
                  <div class="duration-cell">
                    <div class="date-range">
                      {{ formatDate(project.project_duration.start_date) }} -
                      {{ formatDate(project.project_duration.end_date) }}
                    </div>
                  </div>
                </td>
                <td class="project-type">
                  <span class="type-badge" :class="`type-badge--${getTypeClass(project.project_type)}`">
                    {{ project.project_type }}
                  </span>
                </td>
                <td class="project-status">
                  <span class="status-badge" :class="`status-badge--${getStatusClass(project.project_status)}`">
                    {{ project.project_status }}
                  </span>
                </td>
                <td class="cooperation-period">{{ project.cooperation_period }}</td>
                <td class="cooperation-platform">
                  <div class="platform-tags">
                    <span
                      v-for="platform in project.cooperation_platform"
                      :key="platform"
                      class="platform-tag"
                    >
                      {{ platform }}
                    </span>
                  </div>
                </td>
                <td class="contract-number">{{ project.contract_number }}</td>
                <td class="new-order-count">{{ project.new_order_count }}</td>
                <td class="first-service-fee">${{ formatNumber(project.first_service_fee) }}</td>
                <td class="first-payment-date">{{ formatDate(project.first_payment_date) }}</td>
                <td class="customer-name">{{ project.customer_name }}</td>
                <td class="service-fee">${{ formatNumber(project.service_fee) }}</td>

                <td class="operation-team">{{ project.operation_team }}</td>
                <td class="sales-person">{{ project.sales_person }}</td>
                <td class="actions">
                  <div class="action-buttons">
                    <button
                      class="action-btn-text action-btn-text--primary"
                      @click="viewProjectDashboard(project.id)"
                    >
                      <BarChart3 :size="14" />
                      <span>数据面板</span>
                    </button>
                    <button
                      class="action-btn-text action-btn-text--secondary"
                      @click="manageProjectGoals(project.id)"
                    >
                      <Target :size="14" />
                      <span>项目目标</span>
                    </button>
                    <div class="dropdown-menu" :class="{ 'dropdown-menu--active': activeDropdown === project.id }">
                      <button
                        class="action-btn-text action-btn-text--secondary"
                        @click="toggleDropdown(project.id)"
                      >
                        <MoreHorizontal :size="14" />
                        <span>更多</span>
                      </button>
                      <div class="dropdown-content">
                        <button
                          class="dropdown-item"
                          @click="manageAdAccounts(project.id)"
                        >
                          <Monitor :size="14" />
                          <span>投放账号</span>
                        </button>
                        <button
                          class="dropdown-item"
                          @click="viewRenewalRecords(project.id)"
                        >
                          <DollarSign :size="14" />
                          <span>续费记录</span>
                        </button>
                        <button
                          class="dropdown-item"
                          @click="viewProjectReports(project.id)"
                        >
                          <FileText :size="14" />
                          <span>周报/月报</span>
                        </button>
                        <button
                          class="dropdown-item"
                          @click="manageProjectActivities(project.id)"
                        >
                          <Calendar :size="14" />
                          <span>活动管理</span>
                        </button>
                        <button
                          class="dropdown-item"
                          @click="viewCustomerReviews(project.id); activeDropdown = null"
                        >
                          <Star :size="14" />
                          <span>客户评价</span>
                        </button>
                        <button
                          class="dropdown-item"
                          @click="manageInfluencerData(project.id); activeDropdown = null"
                        >
                          <Users :size="14" />
                          <span>红人数据</span>
                        </button>
                        <button
                          class="dropdown-item"
                          @click="editProject(project.id); activeDropdown = null"
                        >
                          <Edit :size="14" />
                          <span>编辑</span>
                        </button>
                        <button
                          class="dropdown-item dropdown-item--danger"
                          @click="deleteProject(project.id)"
                        >
                          <Trash2 :size="14" />
                          <span>删除</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          </div>
        </div>

        <!-- 网格视图 -->
        <div v-if="viewMode === 'grid'" class="project-grid">
          <div
            v-for="project in paginatedProjects"
            :key="project.id"
            class="project-card"
            :class="{ 'selected': selectedProjects.includes(project.id) }"
          >
            <div class="project-card__header">
              <div class="project-card__checkbox">
                <input
                  type="checkbox"
                  :value="project.id"
                  v-model="selectedProjects"
                />
              </div>
              <div class="project-card__status">
                <span class="status-badge" :class="`status-badge--${getStatusClass(project.project_status)}`">
                  {{ project.project_status }}
                </span>
              </div>
            </div>

            <div class="project-card__content">
              <h4 class="project-card__title">{{ project.project_name }}</h4>
              <div class="project-card__info">
                <div class="info-item">
                  <span class="label">客户:</span>
                  <span class="value">{{ project.customer_name }}</span>
                </div>
                <div class="info-item">
                  <span class="label">类型:</span>
                  <span class="value type-badge" :class="`type-badge--${getTypeClass(project.project_type)}`">
                    {{ project.project_type }}
                  </span>
                </div>
                <div class="info-item">
                  <span class="label">服务费:</span>
                  <span class="value">${{ formatNumber(project.service_fee) }}</span>
                </div>
                <div class="info-item">
                  <span class="label">销售:</span>
                  <span class="value">{{ project.sales_person }}</span>
                </div>
                <div class="info-item">
                  <span class="label">团队:</span>
                  <span class="value">{{ project.operation_team }}</span>
                </div>
                <div class="info-item">
                  <span class="label">平台:</span>
                  <div class="platform-tags">
                    <span
                      v-for="platform in project.cooperation_platform"
                      :key="platform"
                      class="platform-tag"
                    >
                      {{ platform }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div class="project-card__actions">
              <button
                class="action-btn-small action-btn-small--primary"
                @click="viewProjectDashboard(project.id)"
                title="查看面板数据"
              >
                <BarChart3 :size="14" />
              </button>
              <button
                class="action-btn-small action-btn-small--secondary"
                @click="manageProjectGoals(project.id)"
                title="项目目标"
              >
                <Target :size="14" />
              </button>
              <button
                class="action-btn-small action-btn-small--secondary"
                @click="manageAdAccounts(project.id)"
                title="投放账号"
              >
                <Monitor :size="14" />
              </button>
              <button
                class="action-btn-small action-btn-small--warning"
                @click="editProject(project.id)"
                title="项目编辑"
              >
                <Edit :size="14" />
              </button>
            </div>
          </div>
        </div>

        <!-- 分页 -->
        <div class="pagination-section">
          <div class="pagination-info">
            显示第 {{ (currentPage - 1) * pageSize + 1 }} - {{ Math.min(currentPage * pageSize, filteredProjects.length) }} 条，
            共 {{ filteredProjects.length }} 条记录
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
    </div>

    <!-- 导出弹窗 -->
    <ExportModal
      v-if="showExportModal"
      :visible="showExportModal"
      :data="projects"
      :filtered-data="filteredProjects"
      :selected-data="selectedProjects.map(id => projects.find(p => p.id === id)).filter(p => p !== undefined)"
      :columns="exportFields"
      :total-count="projects.length"
      :filtered-count="filteredProjects.length"
      :selected-count="selectedProjects.length"
      default-filename="项目数据导出"
      @close="showExportModal = false"
      @export="handleExport"
    />

    <!-- 项目目标管理弹窗 -->
    <ProjectGoalsModal
      v-if="showProjectGoalsModal && selectedProject"
      :project-id="selectedProject.id"
      :project-info="selectedProject"
      @close="showProjectGoalsModal = false"
    />

    <!-- 投放账号管理弹窗 -->
    <AdAccountsModal
      v-if="showAdAccountsModal && selectedProject"
      :project-id="selectedProject.id"
      :project-info="selectedProject"
      @close="showAdAccountsModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  Download,
  Plus,
  List,
  Grid,
  ChevronUp,
  ChevronDown,
  BarChart3,
  Target,
  Monitor,
  DollarSign,
  FileText,
  Calendar,
  Star,
  Users,
  Edit,
  Trash2
} from 'lucide-vue-next'

import SearchInput from '@/components/common/SearchInput.vue'
import FilterPanel from '@/components/common/FilterPanel.vue'
import ExportModal from '@/components/common/ExportModal.vue'
import ProjectGoalsModal from '@/components/projects/ProjectGoalsModal.vue'
import AdAccountsModal from '@/components/projects/AdAccountsModal.vue'

import {
  mockProjects,
  projectTypeOptions,
  projectStatusOptions,
  operationTeamOptions,
  salesPersonOptions,
  type Project
} from '@/mock/projects'

const router = useRouter()

// 响应式数据
const projects = ref<Project[]>([])
const searchQuery = ref('')
const selectedProjects = ref<number[]>([])
const selectAll = ref(false)
const viewMode = ref<'table' | 'grid'>('table')
const sortField = ref<string>('')
const sortOrder = ref<'asc' | 'desc'>('asc')
const currentPage = ref(1)
const pageSize = ref(10)
const showExportModal = ref(false)
const activeDropdown = ref<number | null>(null)

// 弹窗状态
const showProjectGoalsModal = ref(false)
const showAdAccountsModal = ref(false)
const selectedProject = ref<Project | null>(null)

// 筛选相关
const filters = ref({
  status: [] as string[],
  type: [] as string[],
  dateRange: null as { start: string; end: string } | null,
  amountRange: null as { min: number; max: number } | null,
  operationTeam: [] as string[],
  salesPerson: [] as string[]
})

// 初始化数据已移至上面的 onMounted 函数中

// 计算属性
const searchSuggestions = computed(() => {
  const suggestions = new Set<string>()
  projects.value.forEach(project => {
    suggestions.add(project.project_name)
    suggestions.add(project.customer_name)
    suggestions.add(project.sales_person)
    suggestions.add(project.contract_number)
  })
  return Array.from(suggestions)
})

const statusOptions = computed(() => projectStatusOptions)
const typeOptions = computed(() => projectTypeOptions)

const customFilterOptions = computed(() => [
  {
    key: 'operationTeam',
    label: '运营团队',
    type: 'select' as const,
    multiple: true,
    options: operationTeamOptions
  },
  {
    key: 'salesPerson',
    label: '销售人员',
    type: 'select' as const,
    multiple: true,
    options: salesPersonOptions
  }
])

const filteredProjects = computed(() => {
  let result = [...projects.value]

  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(project =>
      project.project_name.toLowerCase().includes(query) ||
      project.customer_name.toLowerCase().includes(query) ||
      project.sales_person.toLowerCase().includes(query) ||
      project.contract_number.toLowerCase().includes(query)
    )
  }

  // 状态过滤
  if (filters.value.status.length > 0) {
    result = result.filter(project => filters.value.status.includes(project.project_status))
  }

  // 类型过滤
  if (filters.value.type.length > 0) {
    result = result.filter(project => filters.value.type.includes(project.project_type))
  }

  // 运营团队过滤
  if (filters.value.operationTeam.length > 0) {
    result = result.filter(project => filters.value.operationTeam.includes(project.operation_team))
  }

  // 销售人员过滤
  if (filters.value.salesPerson.length > 0) {
    result = result.filter(project => filters.value.salesPerson.includes(project.sales_person))
  }

  // 金额范围过滤
  if (filters.value.amountRange) {
    const { min, max } = filters.value.amountRange
    result = result.filter(project =>
      project.service_fee >= min && project.service_fee <= max
    )
  }

  // 日期范围过滤
  if (filters.value.dateRange) {
    const { start, end } = filters.value.dateRange
    result = result.filter(project => {
      const projectStart = new Date(project.project_duration.start_date)
      const filterStart = new Date(start)
      const filterEnd = new Date(end)
      return projectStart >= filterStart && projectStart <= filterEnd
    })
  }

  // 排序
  if (sortField.value) {
    result.sort((a, b) => {
      let aValue: any = a[sortField.value as keyof Project]
      let bValue: any = b[sortField.value as keyof Project]

      // 处理特殊字段
      if (sortField.value === 'project_duration') {
        aValue = new Date(a.project_duration.start_date)
        bValue = new Date(b.project_duration.start_date)
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (aValue < bValue) return sortOrder.value === 'asc' ? -1 : 1
      if (aValue > bValue) return sortOrder.value === 'asc' ? 1 : -1
      return 0
    })
  }

  return result
})

const totalPages = computed(() => Math.ceil(filteredProjects.value.length / pageSize.value))

const paginatedProjects = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredProjects.value.slice(start, end)
})

const exportFields = computed(() => [
  { key: 'project_name', label: '项目名称' },
  { key: 'customer_name', label: '所属客户' },
  { key: 'project_type', label: '项目类型' },
  { key: 'project_status', label: '项目状态' },
  { key: 'cooperation_period', label: '合作周期' },
  { key: 'contract_number', label: '合同编号' },
  { key: 'service_fee', label: '项目服务费' },

  { key: 'operation_team', label: '负责运营团队' },
  { key: 'sales_person', label: '销售人员' }
])

// 方法
const handleSearch = () => {
  currentPage.value = 1
}

const handleSearchClear = () => {
  searchQuery.value = ''
  currentPage.value = 1
}

const handleFilterChange = (newFilters: any) => {
  filters.value = { ...filters.value, ...newFilters }
}

const handleFilterApply = (appliedFilters: any) => {
  filters.value = { ...filters.value, ...appliedFilters }
  currentPage.value = 1
}

const handleFilterClear = () => {
  filters.value = {
    status: [],
    type: [],
    dateRange: null,
    amountRange: null,
    operationTeam: [],
    salesPerson: []
  }
  currentPage.value = 1
}

const handleSelectAll = () => {
  if (selectAll.value) {
    selectedProjects.value = paginatedProjects.value.map(p => p.id)
  } else {
    selectedProjects.value = []
  }
}

const handleSort = (field: string) => {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortOrder.value = 'asc'
  }
}

const getStatusClass = (status: string) => {
  const statusMap: Record<string, string> = {
    '活跃': 'active',
    '流失': 'lost',
    '暂停服务': 'paused'
  }
  return statusMap[status] || 'default'
}

const getTypeClass = (type: string) => {
  const typeMap: Record<string, string> = {
    '新客户': 'new',
    '二次开发': 'development',
    '失效复活': 'revival'
  }
  return typeMap[type] || 'default'
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}

const formatNumber = (num: number) => {
  return num.toLocaleString('zh-CN')
}

// 操作方法
const createProject = () => {
  console.log('创建项目')
  // TODO: 实现创建项目功能
}

const viewProjectDashboard = (projectId: number) => {
  // 找到对应的项目信息
  const project = projects.value.find(p => p.id === projectId)
  if (project) {
    // 跳转到主dashboard页面，并传递项目筛选参数
    router.push({
      name: 'dashboard',
      query: {
        projectId: projectId.toString(),
        projectName: project.project_name,
        customerName: project.customer_name
      }
    })
  }
}

const manageProjectGoals = (projectId: number) => {
  const project = projects.value.find(p => p.id === projectId)
  if (project) {
    selectedProject.value = project
    showProjectGoalsModal.value = true
  }
}

const manageAdAccounts = (projectId: number) => {
  const project = projects.value.find(p => p.id === projectId)
  if (project) {
    selectedProject.value = project
    showAdAccountsModal.value = true
  }
}

const viewProjectReports = (projectId: number) => {
  console.log('查看周报/月报:', projectId)
  // 跳转到周报月报页面，并传递项目ID参数
  router.push({
    name: 'reports',
    query: {
      projectId: projectId.toString()
    }
  })
}

const manageProjectActivities = (projectId: number) => {
  console.log('管理项目活动:', projectId)
  // TODO: 打开项目活动管理弹窗
}

const viewCustomerReviews = (projectId: number) => {
  const project = projects.value.find(p => p.id === projectId)
  if (project) {
    // 跳转到客户评价页面，并传递项目筛选参数
    router.push({
      name: 'customer-reviews',
      query: {
        projectId: projectId.toString(),
        projectName: project.project_name,
        customerName: project.customer_name
      }
    })
  }
}

const manageInfluencerData = (projectId: number) => {
  const project = projects.value.find(p => p.id === projectId)
  if (project) {
    // 跳转到红人数据管理页面
    router.push({
      name: 'kol-posts',
      query: {
        projectId: projectId.toString(),
        projectName: project.project_name
      }
    })
  }
}

const editProject = (projectId: number) => {
  const project = projects.value.find(p => p.id === projectId)
  if (project) {
    // 跳转到项目编辑页面或打开编辑弹窗
    console.log('编辑项目:', project.project_name)
    // 这里可以打开编辑弹窗或跳转到编辑页面
    // 暂时显示一个提示
    alert(`编辑项目: ${project.project_name}`)
  }
}

const deleteProject = (projectId: number) => {
  const project = projects.value.find(p => p.id === projectId)
  if (project && confirm(`确定要删除项目 "${project.project_name}" 吗？此操作不可撤销。`)) {
    // 从列表中移除项目
    projects.value = projects.value.filter(p => p.id !== projectId)
    // 关闭下拉菜单
    activeDropdown.value = null
    console.log('已删除项目:', project.project_name)
  }
}

const handleExport = (exportData: any) => {
  console.log('导出数据:', exportData)
  // TODO: 实现数据导出功能
}

const toggleDropdown = (projectId: number) => {
  activeDropdown.value = activeDropdown.value === projectId ? null : projectId
}

const viewRenewalRecords = (projectId: number) => {
  const project = projects.value.find(p => p.id === projectId)
  if (project) {
    // 跳转到服务费管理页面，并传递项目筛选参数
    router.push({
      name: 'service-fees',
      query: {
        projectId: projectId.toString(),
        projectName: project.project_name,
        paymentType: '续费' // 只显示续费记录
      }
    })
  }
}

// 点击外部关闭下拉菜单
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.dropdown-menu')) {
    activeDropdown.value = null
  }
}

// 监听点击事件
onMounted(() => {
  projects.value = [...mockProjects]
  document.addEventListener('click', handleClickOutside)
})

// 组件卸载时移除监听
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
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
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: var(--spacing-lg);
  align-items: start;
}

.search-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.project-search {
  max-width: 500px;
}

.search-stats {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
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

.table-header__left {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.table-header__left h3 {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.record-count {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  background: var(--color-gray-100);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-full);
  font-weight: var(--font-weight-medium);
}

.table-header__right {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.view-options {
  display: flex;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  overflow: hidden;
}

.view-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-sm);
  background: transparent;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--duration-fast);
  width: 36px;
  height: 36px;
}

.view-btn:hover {
  background: var(--color-gray-50);
  color: var(--color-text-primary);
}

.view-btn--active {
  background: var(--color-primary);
  color: white;
}

.view-btn--active:hover {
  background: var(--color-primary-hover);
  transform: translateY(-1px);
}

.action-btn--small {
  padding: var(--spacing-xs);
  border-radius: var(--border-radius-sm);
}

.project-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.search-filter-section {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: var(--spacing-lg);
  align-items: start;
}

.search-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.project-search {
  max-width: 500px;
}

.search-stats {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
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

.table-controls {
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
}

.view-options {
  display: flex;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.view-btn {
  padding: var(--spacing-sm) var(--spacing-md);
  background: transparent;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--duration-fast);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  height: 36px;
}

.view-btn:hover {
  background: var(--color-background);
  color: var(--color-text-primary);
  transform: translateY(-1px);
}

.view-btn--active {
  background: var(--color-primary);
  color: white;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
}

.view-btn--active:hover {
  background: var(--color-primary-hover);
  transform: translateY(-1px);
}

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
  min-width: 1800px;
  table-layout: fixed;
}

.project-table th,
.project-table td {
  padding: 12px 8px;
  text-align: left;
  border-bottom: 1px solid var(--color-border);
  font-size: 13px;
  word-wrap: break-word;
  overflow: hidden;
}

.project-table td.actions {
  overflow: visible;
}

.action-buttons {
  position: relative;
  overflow: visible;
}

.project-table th {
  background: var(--color-background);
  font-weight: 600;
  color: var(--color-text-primary);
  position: sticky;
  top: 0;
  z-index: 1;
}

/* 表头固定列需要更高的z-index和明确的position */
.project-table th.sticky-column {
  position: sticky;
  top: 0;
  z-index: 12;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

/* 强制第一列和第二列固定 */
.project-table th:nth-child(1),
.project-table td:nth-child(1) {
  position: sticky;
  left: 0;
  z-index: 10;
  background: var(--color-surface);
  border-right: 1px solid var(--color-border);
  width: 50px;
  min-width: 50px;
  max-width: 50px;
}

.project-table th:nth-child(2),
.project-table td:nth-child(2) {
  position: sticky;
  left: 50px;
  z-index: 10;
  background: var(--color-surface);
  border-right: 1px solid var(--color-border);
  width: 200px;
  min-width: 200px;
  max-width: 200px;
}

/* 表头的固定列需要更高的z-index */
.project-table th:nth-child(1) {
  z-index: 12;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.project-table th:nth-child(2) {
  z-index: 12;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.project-table th.sortable {
  cursor: pointer;
  user-select: none;
  position: relative;
}

.project-table th.sortable:hover {
  background: var(--color-background-hover);
}

.project-table th.sortable svg {
  display: inline-block;
  margin-left: 4px;
  vertical-align: middle;
}

/* 列宽设置 - 重写版本 */
.project-table th:nth-child(1), .project-table td:nth-child(1) { width: 60px; min-width: 60px; max-width: 60px; } /* 复选框 */
.project-table th:nth-child(2), .project-table td:nth-child(2) { width: 220px; min-width: 220px; max-width: 220px; } /* 项目名称 */
.project-table th:nth-child(3), .project-table td:nth-child(3) { width: 160px; } /* 项目时间 */
.project-table th:nth-child(4), .project-table td:nth-child(4) { width: 80px; } /* 项目类型 */
.project-table th:nth-child(5), .project-table td:nth-child(5) { width: 80px; } /* 项目状态 */
.project-table th:nth-child(6), .project-table td:nth-child(6) { width: 80px; } /* 合作周期 */
.project-table th:nth-child(7), .project-table td:nth-child(7) { width: 120px; } /* 合作平台 */
.project-table th:nth-child(8), .project-table td:nth-child(8) { width: 100px; } /* 合同编号 */
.project-table th:nth-child(9), .project-table td:nth-child(9) { width: 80px; } /* 核算新单数 */
.project-table th:nth-child(10), .project-table td:nth-child(10) { width: 120px; } /* 首次到账服务费 */
.project-table th:nth-child(11), .project-table td:nth-child(11) { width: 100px; } /* 首次到账日期 */
.project-table th:nth-child(12), .project-table td:nth-child(12) { width: 140px; } /* 所属客户 */
.project-table th:nth-child(13), .project-table td:nth-child(13) { width: 100px; } /* 项目服务费 */
.project-table th:nth-child(14), .project-table td:nth-child(14) { width: 120px; } /* 负责运营团队 */
.project-table th:nth-child(15), .project-table td:nth-child(15) { width: 80px; } /* 销售人员 */
.project-table th:nth-child(16), .project-table td:nth-child(16) { width: 280px; } /* 操作 */

.project-table td {
  color: var(--color-text-secondary);
  vertical-align: top;
  position: relative;
}

.project-table tr:hover {
  background: var(--color-background-hover);
}

.project-table tr.selected {
  background: var(--color-primary-light);
}

.project-name-cell .name {
  font-weight: 500;
  color: var(--color-text-primary);
}

.duration-cell .date-range {
  font-size: 13px;
  white-space: nowrap;
}

.status-badge,
.type-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
}

.status-badge--active {
  background: var(--color-success-light);
  color: var(--color-success);
}

.status-badge--lost {
  background: var(--color-danger-light);
  color: var(--color-danger);
}

.status-badge--paused {
  background: var(--color-warning-light);
  color: var(--color-warning);
}

.type-badge--new {
  background: var(--color-primary-light);
  color: var(--color-primary);
}

.type-badge--development {
  background: var(--color-info-light);
  color: var(--color-info);
}

.type-badge--revival {
  background: var(--color-warning-light);
  color: var(--color-warning);
}

.platform-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.platform-tag {
  padding: 2px 6px;
  background: var(--color-background-tertiary);
  border: 1px solid var(--color-border);
  border-radius: 3px;
  font-size: 11px;
  color: var(--color-text-secondary);
}

.action-buttons {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  align-items: center;
  position: relative;
}

.action-btn-small {
  padding: 6px 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn-small--primary {
  background: var(--color-primary);
  color: white;
}

.action-btn-small--primary:hover {
  background: var(--color-primary-hover);
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

.action-btn-small--warning {
  background: var(--color-warning-light);
  color: var(--color-warning);
}

.action-btn-small--warning:hover {
  background: var(--color-warning);
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

/* 带文字的操作按钮样式 */
.action-btn-text {
  padding: 6px 12px;
  border: 1px solid var(--color-border);
  background: var(--color-background);
  color: var(--color-text-secondary);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  white-space: nowrap;
}

.action-btn-text:hover {
  background: var(--color-background-hover);
}

.action-btn-text--primary {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.action-btn-text--primary:hover {
  background: var(--color-primary-hover);
}

.action-btn-text--secondary {
  background: var(--color-background-secondary);
  color: var(--color-text-primary);
}

.action-btn-text--secondary:hover {
  background: var(--color-background-hover);
  color: var(--color-primary);
}

.action-btn-text--warning {
  background: var(--color-warning-light);
  color: var(--color-warning);
  border-color: var(--color-warning);
}

.action-btn-text--warning:hover {
  background: var(--color-warning);
  color: white;
}

.action-btn-text--danger {
  background: var(--color-danger-light);
  color: var(--color-danger);
  border-color: var(--color-danger);
}

.action-btn-text--danger:hover {
  background: var(--color-danger);
  color: white;
}

/* 下拉菜单样式 */
.dropdown-menu {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  display: none;
  position: absolute;
  top: 100%;
  right: 0;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 99999;
  min-width: 150px;
  padding: 8px 0;
}

.dropdown-menu--active .dropdown-content {
  display: block;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 16px;
  border: none;
  background: none;
  color: var(--color-text-primary);
  font-size: 13px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  white-space: nowrap;
}

.dropdown-item:hover {
  background: var(--color-background-hover);
}

.dropdown-item--danger {
  color: var(--color-danger);
}

.dropdown-item--danger:hover {
  background: var(--color-danger-light);
}

.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 20px;
  padding: 24px;
}

.project-card {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 20px;
  transition: all 0.2s ease;
}

.project-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: var(--color-primary-light);
}

.project-card.selected {
  border-color: var(--color-primary);
  background: var(--color-primary-light);
}

.project-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.project-card__title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 12px 0;
}

.project-card__info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-item .label {
  font-size: 13px;
  color: var(--color-text-secondary);
  min-width: 60px;
}

.info-item .value {
  font-size: 13px;
  color: var(--color-text-primary);
  font-weight: 500;
}

.project-card__actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

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

/* 固定列样式 - 重写版本 */
.fixed-column {
  position: sticky;
  z-index: 10;
  background: var(--color-surface);
  border-right: 2px solid var(--color-border);
}

.checkbox-col {
  left: 0;
  width: 60px;
  min-width: 60px;
  max-width: 60px;
  text-align: center;
}

.name-col {
  left: 60px;
  width: 220px;
  min-width: 220px;
  max-width: 220px;
}

/* 表头固定列样式 */
.project-table th.fixed-column {
  z-index: 12;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  position: sticky;
  top: 0;
}

/* 悬停状态 */
.project-row:hover .fixed-column {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.project-row.selected .fixed-column {
  background: var(--color-primary-light);
}

.project-row.selected:hover .fixed-column {
  background: var(--color-primary-light);
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .search-filter-section {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-lg);
  }

  .page-header__actions {
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

  .search-section {
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .project-search {
    max-width: none;
  }

  .table-header {
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-sm);
    padding: var(--spacing-md);
  }

  .table-controls {
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-sm);
  }

  .view-options {
    align-self: center;
  }

  .project-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
    padding: var(--spacing-md);
  }

  .project-card {
    padding: var(--spacing-md);
  }

  .project-table {
    font-size: var(--font-size-sm);
  }

  .project-table th,
  .project-table td {
    padding: var(--spacing-sm);
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
}

@media (max-width: 480px) {
  .page-title {
    font-size: var(--font-size-2xl);
  }

  .project-card {
    padding: var(--spacing-sm);
  }

  .project-table {
    font-size: var(--font-size-xs);
  }

  .project-table th,
  .project-table td {
    padding: var(--spacing-xs);
  }

  .action-btn {
    padding: var(--spacing-xs) var(--spacing-sm);
    font-size: var(--font-size-xs);
  }

  .pagination-number {
    width: 28px;
    height: 28px;
    font-size: var(--font-size-xs);
  }
}
</style>
