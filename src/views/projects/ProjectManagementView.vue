<template>
  <div class="project-management-view">
    <div class="page-header">
      <div class="page-header__main">
        <h1 class="page-title">项目管理</h1>
        <p class="page-description">管理和分析您的项目数据，优化项目运营效率</p>
      </div>
      <div class="page-header__actions">
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
          <table>
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    v-model="selectAll"
                    @change="handleSelectAll"
                  />
                </th>
                <th @click="handleSort('project_name')" class="sortable">
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
                <th @click="handleSort('balance_info')" class="sortable">
                  余额信息
                  <ChevronUp v-if="sortField === 'balance_info' && sortOrder === 'asc'" :size="14" />
                  <ChevronDown v-if="sortField === 'balance_info' && sortOrder === 'desc'" :size="14" />
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
                <td>
                  <input
                    type="checkbox"
                    :value="project.id"
                    v-model="selectedProjects"
                  />
                </td>
                <td class="project-name">
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
                <td class="first-service-fee">¥{{ formatNumber(project.first_service_fee) }}</td>
                <td class="first-payment-date">{{ formatDate(project.first_payment_date) }}</td>
                <td class="customer-name">{{ project.customer_name }}</td>
                <td class="service-fee">¥{{ formatNumber(project.service_fee) }}</td>
                <td class="balance-info">¥{{ formatNumber(project.balance_info) }}</td>
                <td class="operation-team">{{ project.operation_team }}</td>
                <td class="sales-person">{{ project.sales_person }}</td>
                <td class="actions">
                  <div class="action-buttons">
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
                      class="action-btn-small action-btn-small--secondary"
                      @click="viewRenewalRecords(project.id)"
                      title="服务续费记录"
                    >
                      <DollarSign :size="14" />
                    </button>
                    <button
                      class="action-btn-small action-btn-small--secondary"
                      @click="viewProjectReports(project.id)"
                      title="项目周报/月报"
                    >
                      <FileText :size="14" />
                    </button>
                    <button
                      class="action-btn-small action-btn-small--secondary"
                      @click="manageProjectActivities(project.id)"
                      title="项目活动"
                    >
                      <Calendar :size="14" />
                    </button>
                    <button
                      class="action-btn-small action-btn-small--secondary"
                      @click="viewCustomerReviews(project.id)"
                      title="客户评价记录"
                    >
                      <Star :size="14" />
                    </button>
                    <button
                      class="action-btn-small action-btn-small--secondary"
                      @click="manageInfluencerData(project.id)"
                      title="红人数据"
                    >
                      <Users :size="14" />
                    </button>
                    <button
                      class="action-btn-small action-btn-small--warning"
                      @click="editProject(project.id)"
                      title="项目编辑"
                    >
                      <Edit :size="14" />
                    </button>
                    <button
                      class="action-btn-small action-btn-small--danger"
                      @click="deleteProject(project.id)"
                      title="项目删除"
                    >
                      <Trash2 :size="14" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
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
                  <span class="value">¥{{ formatNumber(project.service_fee) }}</span>
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
      title="导出项目数据"
      :fields="exportFields"
      :data="filteredProjects"
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

    <!-- 续费记录管理弹窗 -->
    <RenewalRecordsModal
      v-if="showRenewalRecordsModal && selectedProject"
      :project-id="selectedProject.id"
      :project-info="selectedProject"
      @close="showRenewalRecordsModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
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
import RenewalRecordsModal from '@/components/projects/RenewalRecordsModal.vue'

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

// 弹窗状态
const showProjectGoalsModal = ref(false)
const showAdAccountsModal = ref(false)
const showRenewalRecordsModal = ref(false)
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

// 初始化数据
onMounted(() => {
  projects.value = [...mockProjects]
})

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
    type: 'select',
    multiple: true,
    options: operationTeamOptions
  },
  {
    key: 'salesPerson',
    label: '销售人员',
    type: 'select',
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
  { key: 'balance_info', label: '余额信息' },
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
  router.push(`/projects/${projectId}/dashboard`)
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

const viewRenewalRecords = (projectId: number) => {
  const project = projects.value.find(p => p.id === projectId)
  if (project) {
    selectedProject.value = project
    showRenewalRecordsModal.value = true
  }
}

const viewProjectReports = (projectId: number) => {
  console.log('查看项目报告:', projectId)
  // TODO: 打开项目报告弹窗
}

const manageProjectActivities = (projectId: number) => {
  console.log('管理项目活动:', projectId)
  // TODO: 打开项目活动管理弹窗
}

const viewCustomerReviews = (projectId: number) => {
  console.log('查看客户评价:', projectId)
  // TODO: 打开客户评价弹窗
}

const manageInfluencerData = (projectId: number) => {
  console.log('管理红人数据:', projectId)
  // TODO: 打开红人数据管理弹窗
}

const editProject = (projectId: number) => {
  console.log('编辑项目:', projectId)
  // TODO: 打开项目编辑弹窗
}

const deleteProject = (projectId: number) => {
  console.log('删除项目:', projectId)
  // TODO: 实现删除项目功能
}

const handleExport = (exportData: any) => {
  console.log('导出数据:', exportData)
  // TODO: 实现数据导出功能
}
</script>

<style scoped>
.project-management-view {
  padding: 24px;
  background: var(--color-background);
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
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
  font-size: 14px;
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

.project-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.search-filter-section {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.search-section {
  flex: 1;
}

.project-search {
  width: 100%;
}

.search-stats {
  margin-top: 8px;
  font-size: 14px;
  color: var(--color-text-secondary);
}

.filter-section {
  flex-shrink: 0;
}

.project-table-section {
  background: var(--color-background-secondary);
  border-radius: 8px;
  border: 1px solid var(--color-border);
  overflow: hidden;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-background);
}

.table-header__left h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 4px 0;
}

.record-count {
  font-size: 14px;
  color: var(--color-text-secondary);
}

.table-controls {
  display: flex;
  align-items: center;
  gap: 16px;
}

.view-options {
  display: flex;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  overflow: hidden;
}

.view-btn {
  padding: 8px 12px;
  border: none;
  background: var(--color-background);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.view-btn:hover {
  background: var(--color-background-hover);
}

.view-btn--active {
  background: var(--color-primary);
  color: white;
}

.project-table {
  overflow-x: auto;
}

.project-table table {
  width: 100%;
  border-collapse: collapse;
  min-width: 1200px;
}

.project-table th,
.project-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid var(--color-border);
  font-size: 14px;
}

.project-table th {
  background: var(--color-background);
  font-weight: 600;
  color: var(--color-text-primary);
  position: sticky;
  top: 0;
  z-index: 1;
}

.project-table th.sortable {
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: center;
  gap: 4px;
}

.project-table th.sortable:hover {
  background: var(--color-background-hover);
}

.project-table td {
  color: var(--color-text-secondary);
  vertical-align: top;
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
  gap: 4px;
  flex-wrap: wrap;
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

@media (max-width: 768px) {
  .project-management-view {
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .search-filter-section {
    flex-direction: column;
    gap: 12px;
  }

  .project-grid {
    grid-template-columns: 1fr;
    padding: 16px;
  }

  .pagination-section {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }
}
</style>
