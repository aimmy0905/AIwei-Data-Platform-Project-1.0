<template>
  <div class="customer-list-view">
    <div class="page-header">
      <div class="page-header__main">
        <h1 class="page-title">客户管理</h1>
        <p class="page-description">管理和分析您的客户数据，优化客户关系</p>
      </div>
      <div class="page-header__actions">
        <button
          class="action-btn action-btn--secondary"
          @click="showExportModal = true"
        >
          <Download :size="16" />
          导出数据
        </button>
        <button class="action-btn action-btn--primary" @click="createCustomer">
          <Plus :size="16" />
          新建客户
        </button>
      </div>
    </div>

    <div class="customer-content">
      <!-- 搜索和筛选区域 -->
      <div class="search-filter-section">
        <div class="search-section">
          <SearchInput
            v-model="searchQuery"
            placeholder="搜索客户名称、联系人、联系电话、签单销售人员..."
            :suggestions="searchSuggestions"
            @search="handleSearch"
            @clear="handleSearchClear"
            class="customer-search"
          />
          <div class="search-stats" v-if="searchQuery">
            找到 <strong>{{ filteredCustomers.length }}</strong> 个结果
          </div>
        </div>

        <div class="filter-section">
          <FilterPanel
            :modal="true"
            :show-date-filter="true"
            :show-status-filter="true"
            :show-category-filter="true"
            :show-amount-filter="true"
            amount-label="收入"
            :status-options="statusOptions"
            :category-options="industryOptions"
            :custom-filters="customFilterOptions"
            @filter-change="handleFilterChange"
            @filter-apply="handleFilterApply"
            @filter-clear="handleFilterClear"
          />
        </div>
      </div>



      <!-- 客户表格 -->
      <div class="customer-table-section">
        <div class="table-header">
          <div class="table-header__left">
            <h3>客户列表</h3>
            <span class="record-count">共 {{ filteredCustomers.length }} 条记录</span>
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
        <div v-if="viewMode === 'table'" class="customer-table">
          <table>
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    v-model="selectAll"
                    @change="handleSelectAll"
                    class="checkbox-input"
                  />
                </th>
                <th @click="setSortBy('name')" class="sortable">
                  客户名称
                  <ArrowUpDown :size="14" v-if="sortBy === 'name'" />
                </th>
                <th @click="setSortBy('cooperationType')" class="sortable">
                  合作方式
                  <ArrowUpDown :size="14" v-if="sortBy === 'cooperationType'" />
                </th>
                <th @click="setSortBy('industry')" class="sortable">
                  客户行业
                  <ArrowUpDown :size="14" v-if="sortBy === 'industry'" />
                </th>
                <th>地区</th>
                <th>联系人</th>
                <th>联系岗位</th>
                <th>联系电话</th>
                <th>服务团队</th>
                <th @click="setSortBy('cooperationStartTime')" class="sortable">
                  合作开始时间
                  <ArrowUpDown :size="14" v-if="sortBy === 'cooperationStartTime'" />
                </th>
                <th @click="setSortBy('serviceStartTime')" class="sortable">
                  服务开始时间
                  <ArrowUpDown :size="14" v-if="sortBy === 'serviceStartTime'" />
                </th>
                <th @click="setSortBy('grade')" class="sortable">
                  分级
                  <ArrowUpDown :size="14" v-if="sortBy === 'grade'" />
                </th>
                <th @click="setSortBy('status')" class="sortable">
                  状态
                  <ArrowUpDown :size="14" v-if="sortBy === 'status'" />
                </th>
                <th @click="setSortBy('signingSales')" class="sortable">
                  签单销售人员
                  <ArrowUpDown :size="14" v-if="sortBy === 'signingSales'" />
                </th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="customer in paginatedCustomers"
                :key="customer.id"
                class="customer-row"
                :class="{ 'customer-row--selected': selectedCustomers.includes(customer.id) }"
                @click="handleRowClick(customer)"
              >
                <td @click.stop>
                  <input
                    type="checkbox"
                    v-model="selectedCustomers"
                    :value="customer.id"
                    class="checkbox-input"
                  />
                </td>
                <td>
                  <div class="customer-info">
                    <div class="customer-avatar">
                      {{ customer.name.charAt(0).toUpperCase() }}
                    </div>
                    <div class="customer-details">
                      <div class="customer-name">{{ customer.name }}</div>
                      <div class="customer-website">{{ customer.website }}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="cooperation-badge">{{ customer.cooperationType }}</span>
                </td>
                <td>
                  <span class="industry-badge">{{ customer.industry }}</span>
                </td>
                <td>
                  <span class="region-text">{{ getCustomerRegions(customer) }}</span>
                </td>
                <td>
                  <span class="contact-text">{{ customer.primaryContact.name }}</span>
                </td>
                <td>
                  <span class="position-text">{{ customer.primaryContact.position }}</span>
                </td>
                <td>
                  <span class="phone-text">{{ customer.primaryContact.phone }}</span>
                </td>
                <td>
                  <span class="team-text">{{ customer.serviceTeam }}</span>
                </td>
                <td>
                  <span class="date-text">{{ formatDate(customer.cooperationStartTime) }}</span>
                </td>
                <td>
                  <span class="date-text">{{ formatDate(customer.serviceStartTime) }}</span>
                </td>
                <td>
                  <span class="grade-badge" :class="`grade-badge--${customer.grade}`">
                    {{ customer.grade }}
                  </span>
                </td>
                <td>
                  <span class="status-badge" :class="`status-badge--${customer.status}`">
                    {{ getStatusText(customer.status) }}
                  </span>
                </td>
                <td>
                  <span class="sales-text">{{ customer.signingSales }}</span>
                </td>
                <td @click.stop>
                  <div class="action-menu">
                    <button class="action-btn action-btn--small" @click="viewCustomer(customer)" title="查看详情">
                      <Eye :size="14" />
                    </button>
                    <button class="action-btn action-btn--small" @click="editCustomer(customer)" title="客户编辑">
                      <Edit :size="14" />
                    </button>
                    <button class="action-btn action-btn--small" @click="addCustomerQA(customer)" title="添加Q&A">
                      <MessageSquare :size="14" />
                    </button>
                    <button class="action-btn action-btn--small" @click="showCustomerMenu(customer)" title="更多操作">
                      <MoreHorizontal :size="14" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 网格视图 -->
        <div v-else class="customer-grid">
          <div
            v-for="customer in paginatedCustomers"
            :key="customer.id"
            class="customer-card"
            @click="handleCardClick(customer)"
          >
            <div class="customer-card__header">
              <div class="customer-avatar-large">
                {{ customer.name.charAt(0).toUpperCase() }}
              </div>
              <div class="customer-actions">
                <button class="card-action" @click.stop="editCustomer(customer)">
                  <Edit :size="16" />
                </button>
                <button class="card-action" @click.stop="showCustomerMenu(customer)">
                  <MoreHorizontal :size="16" />
                </button>
              </div>
            </div>
            <div class="customer-card__content">
              <h4 class="customer-card__name">{{ customer.name }}</h4>
              <p class="customer-card__website">{{ customer.website }}</p>
              <div class="customer-card__info">
                <div class="info-item">
                  <span class="info-label">合作方式</span>
                  <span class="cooperation-tag">{{ customer.cooperationType }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">服务团队</span>
                  <span class="team-tag">{{ customer.serviceTeam }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">联系人</span>
                  <span class="contact-info">{{ customer.primaryContact.name }} ({{ customer.primaryContact.position }})</span>
                </div>
              </div>
              <div class="customer-card__metrics">
                <div class="metric">
                  <span class="metric-label">收入</span>
                  <span class="metric-value">${{ formatNumber(customer.revenue) }}</span>
                </div>
                <div class="metric">
                  <span class="metric-label">ROI</span>
                  <span class="metric-value" :class="getRoiClass(customer.roi)">{{ customer.roi }}x</span>
                </div>
              </div>
              <div class="customer-card__footer">
                <span class="industry-tag">{{ customer.industry }}</span>
                <span class="grade-tag" :class="`grade-tag--${customer.grade}`">{{ customer.grade }}级</span>
                <span class="status-indicator" :class="`status-indicator--${customer.status}`"></span>
              </div>
            </div>
          </div>
        </div>

        <!-- 分页 -->
        <div class="pagination-section">
          <div class="pagination-info">
            显示第 {{ (currentPage - 1) * pageSize + 1 }} - {{ Math.min(currentPage * pageSize, filteredCustomers.length) }} 条，
            共 {{ filteredCustomers.length }} 条记录
          </div>
          <div class="pagination-controls">
            <button
              class="pagination-btn"
              :disabled="currentPage === 1"
              @click="goToPage(currentPage - 1)"
            >
              <ChevronLeft :size="16" />
              上一页
            </button>
            <div class="pagination-numbers">
              <button
                v-for="page in visiblePages"
                :key="page"
                class="pagination-number"
                :class="{ 'pagination-number--active': page === currentPage }"
                @click="goToPage(page)"
              >
                {{ page }}
              </button>
            </div>
            <button
              class="pagination-btn"
              :disabled="currentPage === totalPages"
              @click="goToPage(currentPage + 1)"
            >
              下一页
              <ChevronRight :size="16" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 批量操作栏 -->
    <div v-if="selectedCustomers.length > 0" class="bulk-actions">
      <div class="bulk-actions__info">
        已选择 {{ selectedCustomers.length }} 个客户
      </div>
      <div class="bulk-actions__buttons">
        <button class="bulk-btn">
          <Mail :size="16" />
          发送邮件
        </button>
        <button
          class="bulk-btn"
          @click="showExportModal = true"
        >
          <Download :size="16" />
          导出选中
        </button>
        <button class="bulk-btn bulk-btn--danger">
          <Trash2 :size="16" />
          删除选中
        </button>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-overlay">
      <Loader :size="48" class="loading-spinner" />
      <span>加载客户数据中...</span>
    </div>

    <!-- 导出弹窗 -->
    <ExportModal
      :visible="showExportModal"
      :data="customers"
      :filtered-data="filteredCustomers"
      :selected-data="selectedCustomersData"
      :columns="exportColumns"
      :total-count="customers.length"
      :filtered-count="filteredCustomers.length"
      :selected-count="selectedCustomers.length"
      default-filename="customers"
      @close="showExportModal = false"
      @export="handleExportComplete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import {
  Plus, Download, Users, TrendingUp, DollarSign, Target,
  List, Grid, ArrowUpDown, ChevronLeft, ChevronRight,
  Edit, Eye, MoreHorizontal, Mail, Trash2, Loader, MessageSquare
} from 'lucide-vue-next'
import { mockGetCustomers, type ExtendedCustomer } from '@/mock/customer'
import SearchInput from '@/components/common/SearchInput.vue'
import FilterPanel from '@/components/common/FilterPanel.vue'
import ExportModal from '@/components/common/ExportModal.vue'
import { formatters } from '@/utils/export'
import type { ExportColumn } from '@/utils/export'

// 路由
const router = useRouter()

// 响应式数据
const loading = ref(true)
const customers = ref<ExtendedCustomer[]>([])
const searchQuery = ref('')
const viewMode = ref<'table' | 'grid'>('table')
const sortBy = ref('name')
const sortDirection = ref<'asc' | 'desc'>('asc')
const selectedCustomers = ref<number[]>([])
const selectAll = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const showExportModal = ref(false)

const filters = reactive({
  dateRange: '',
  startDate: '',
  endDate: '',
  status: [] as string[],
  category: '',
  minAmount: null as number | null,
  maxAmount: null as number | null,
  cooperationType: '',
  serviceTeam: '',
  grade: '',
  signingSales: ''
})

// 筛选选项配置
const statusOptions = [
  { value: 'active', label: '活跃' },
  { value: 'inactive', label: '非活跃' },
  { value: 'suspended', label: '暂停' }
]

const industryOptions = [
  { value: 'fashion', label: '时尚服装' },
  { value: 'tech', label: '数码科技' },
  { value: 'beauty', label: '美容护肤' },
  { value: 'sports', label: '体育用品' },
  { value: 'home', label: '家居装饰' }
]

const customFilterOptions = [
  {
    key: 'cooperationType',
    label: '合作方式',
    type: 'select' as const,
    options: [
      { value: '代运营', label: '代运营' },
      { value: '咨询服务', label: '咨询服务' },
      { value: '技术支持', label: '技术支持' },
      { value: '培训服务', label: '培训服务' }
    ]
  },
  {
    key: 'serviceTeam',
    label: '服务团队',
    type: 'select' as const,
    options: [
      { value: '时尚组', label: '时尚组' },
      { value: '科技组', label: '科技组' },
      { value: '美妆组', label: '美妆组' },
      { value: '运动组', label: '运动组' },
      { value: '家居组', label: '家居组' }
    ]
  },
  {
    key: 'grade',
    label: '客户分级',
    type: 'select' as const,
    options: [
      { value: 'A', label: 'A级客户' },
      { value: 'B', label: 'B级客户' },
      { value: 'C', label: 'C级客户' }
    ]
  },
  {
    key: 'signingSales',
    label: '签单销售人员',
    type: 'input' as const,
    placeholder: '输入销售人员姓名'
  }
]

// 计算属性
const searchSuggestions = computed(() => {
  const suggestions = new Set<string>()
  customers.value.forEach(customer => {
    suggestions.add(customer.name)
    suggestions.add(customer.primaryContact.name)
    suggestions.add(customer.primaryContact.phone)
    suggestions.add(customer.signingSales)
    suggestions.add(customer.cooperationType)
    suggestions.add(customer.serviceTeam)
  })
  return Array.from(suggestions)
})

const filteredCustomers = computed(() => {
  let result = customers.value

  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(customer =>
      customer.name.toLowerCase().includes(query) ||
      customer.primaryContact.name.toLowerCase().includes(query) ||
      customer.primaryContact.phone.toLowerCase().includes(query) ||
      customer.signingSales.toLowerCase().includes(query) ||
      customer.cooperationType.toLowerCase().includes(query) ||
      customer.serviceTeam.toLowerCase().includes(query)
    )
  }

  // 状态过滤
  if (filters.status.length > 0) {
    result = result.filter(customer => filters.status.includes(customer.status))
  }

  // 行业过滤
  if (filters.category) {
    const industryMap: Record<string, string> = {
      'fashion': '时尚服装',
      'tech': '数码科技',
      'beauty': '美容护肤',
      'sports': '体育用品',
      'home': '家居装饰'
    }
    result = result.filter(customer => customer.industry === industryMap[filters.category])
  }

  // 合作方式过滤
  if (filters.cooperationType) {
    result = result.filter(customer => customer.cooperationType === filters.cooperationType)
  }

  // 服务团队过滤
  if (filters.serviceTeam) {
    result = result.filter(customer => customer.serviceTeam === filters.serviceTeam)
  }

  // 客户分级过滤
  if (filters.grade) {
    result = result.filter(customer => customer.grade === filters.grade)
  }

  // 签单销售人员过滤
  if (filters.signingSales) {
    result = result.filter(customer =>
      customer.signingSales.toLowerCase().includes(filters.signingSales.toLowerCase())
    )
  }

  // 收入范围过滤
  if (filters.minAmount !== null) {
    result = result.filter(customer => customer.revenue >= filters.minAmount!)
  }
  if (filters.maxAmount !== null) {
    result = result.filter(customer => customer.revenue <= filters.maxAmount!)
  }

  // 排序
  result.sort((a, b) => {
    let valueA: unknown, valueB: unknown

    switch (sortBy.value) {
      case 'name':
        valueA = a.name.toLowerCase()
        valueB = b.name.toLowerCase()
        break
      case 'cooperationType':
        valueA = a.cooperationType
        valueB = b.cooperationType
        break
      case 'revenue':
        valueA = a.revenue
        valueB = b.revenue
        break
      case 'roi':
        valueA = a.roi
        valueB = b.roi
        break
      case 'cooperationStartTime':
        valueA = new Date(a.cooperationStartTime).getTime()
        valueB = new Date(b.cooperationStartTime).getTime()
        break
      case 'serviceStartTime':
        valueA = new Date(a.serviceStartTime).getTime()
        valueB = new Date(b.serviceStartTime).getTime()
        break
      case 'grade':
        valueA = a.grade
        valueB = b.grade
        break
      case 'lastUpdated':
        valueA = new Date(a.lastUpdated).getTime()
        valueB = new Date(b.lastUpdated).getTime()
        break
      default:
        valueA = a.name.toLowerCase()
        valueB = b.name.toLowerCase()
    }

    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return sortDirection.value === 'asc'
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA)
    }

    if (typeof valueA === 'number' && typeof valueB === 'number') {
      return sortDirection.value === 'asc' ? valueA - valueB : valueB - valueA
    }

    return 0
  })

  return result
})

const paginatedCustomers = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredCustomers.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredCustomers.value.length / pageSize.value)
})

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, start + 4)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

const customerStats = computed(() => {
  const total = filteredCustomers.value.length
  const active = filteredCustomers.value.filter(c => c.status === 'active').length
  const totalRevenue = filteredCustomers.value.reduce((sum, c) => sum + c.revenue, 0)
  const gradeA = filteredCustomers.value.filter(c => c.grade === 'A').length

  return { total, active, totalRevenue, gradeA }
})

const selectedCustomersData = computed(() => {
  return customers.value.filter(customer => selectedCustomers.value.includes(customer.id))
})

const exportColumns: ExportColumn[] = [
  {
    key: 'name',
    label: '客户名称'
  },
  {
    key: 'cooperationType',
    label: '合作方式'
  },
  {
    key: 'industry',
    label: '客户行业'
  },
  {
    key: 'regions',
    label: '地区',
    formatter: (value) => Array.isArray(value) ? value.join(', ') : String(value || '')
  },
  {
    key: 'primaryContact',
    label: '联系人',
    formatter: (value: any) => value?.name || ''
  },
  {
    key: 'primaryContact',
    label: '联系岗位',
    formatter: (value: any) => value?.position || ''
  },
  {
    key: 'primaryContact',
    label: '联系电话',
    formatter: (value: any) => value?.phone || ''
  },
  {
    key: 'serviceTeam',
    label: '服务团队'
  },
  {
    key: 'cooperationStartTime',
    label: '合作开始时间',
    formatter: formatters.date
  },
  {
    key: 'serviceStartTime',
    label: '服务开始时间',
    formatter: formatters.date
  },
  {
    key: 'grade',
    label: '分级'
  },
  {
    key: 'status',
    label: '状态',
    formatter: (value) => {
      const statusMap = {
        active: '活跃',
        inactive: '非活跃',
        suspended: '暂停'
      }
      return statusMap[value as keyof typeof statusMap] || String(value || '')
    }
  },
  {
    key: 'signingSales',
    label: '签单销售人员'
  },
  {
    key: 'revenue',
    label: '收入',
    formatter: formatters.currency
  },
  {
    key: 'roi',
    label: 'ROI',
    formatter: (value) => typeof value === 'number' ? `${value}x` : String(value || '')
  }
]

// 方法
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(0) + 'K'
  }
  return num.toLocaleString()
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN')
}

const getRoiClass = (roi: number): string => {
  if (roi >= 4) return 'roi-excellent'
  if (roi >= 3) return 'roi-good'
  if (roi >= 2) return 'roi-fair'
  return 'roi-poor'
}

const getStatusText = (status: string): string => {
  const statusMap = {
    active: '活跃',
    inactive: '非活跃',
    suspended: '暂停'
  }
  return statusMap[status as keyof typeof statusMap] || status
}

const getCustomerRegions = (customer: ExtendedCustomer): string => {
  return customer.regions.slice(0, 2).join(', ') + (customer.regions.length > 2 ? '...' : '')
}

const handleSearch = (query: string) => {
  searchQuery.value = query
  currentPage.value = 1
}

const handleSearchClear = () => {
  searchQuery.value = ''
  currentPage.value = 1
}

const handleFilterChange = () => {
  currentPage.value = 1
}

const handleFilterApply = () => {
  currentPage.value = 1
}

const handleFilterClear = () => {
  Object.keys(filters).forEach(key => {
    if (Array.isArray(filters[key as keyof typeof filters])) {
      (filters[key as keyof typeof filters] as unknown[]) = []
    } else {
      (filters[key as keyof typeof filters] as string | number | null) = ''
    }
  })
  currentPage.value = 1
}

const handleSort = () => {
  currentPage.value = 1
}

const setSortBy = (field: string) => {
  if (sortBy.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = field
    sortDirection.value = 'asc'
  }
  currentPage.value = 1
}

const toggleSortDirection = () => {
  sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
}

const handleSelectAll = () => {
  if (selectAll.value) {
    selectedCustomers.value = paginatedCustomers.value.map(c => c.id)
  } else {
    selectedCustomers.value = []
  }
}

const handleRowClick = (customer: ExtendedCustomer) => {
  viewCustomer(customer)
}

const handleCardClick = (customer: ExtendedCustomer) => {
  viewCustomer(customer)
}

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const createCustomer = () => {
  router.push({ name: 'customer-create' })
}

const editCustomer = (customer: ExtendedCustomer) => {
  console.log('编辑客户:', customer.name)
}

const viewCustomer = (customer: ExtendedCustomer) => {
  router.push({ name: 'customer-detail', params: { id: customer.id.toString() } })
}

const addCustomerQA = (customer: ExtendedCustomer) => {
  console.log('添加客户Q&A:', customer.name)
  // 这里可以打开Q&A添加弹窗
}

const showCustomerMenu = (customer: ExtendedCustomer) => {
  console.log('显示客户菜单:', customer.name)
}

const handleExportComplete = (exportData: {
  format: string
  data: Record<string, unknown>[]
  columns: ExportColumn[]
  options: Record<string, unknown>
}) => {
  console.log('导出完成:', {
    format: exportData.format,
    recordCount: exportData.data.length,
    columnCount: exportData.columns.length
  })

  // 这里可以添加导出完成后的处理逻辑
  // 例如：记录导出日志、显示成功消息等
}

// 加载数据
const loadCustomers = async () => {
  loading.value = true
  try {
    const response = await mockGetCustomers()
    if (response.success && response.data) {
      customers.value = response.data
    }
  } catch (error) {
    console.error('加载客户数据失败:', error)
  } finally {
    loading.value = false
  }
}

// 生命周期
onMounted(() => {
  loadCustomers()
})
</script>

<style scoped>
.customer-list-view {
  position: relative;
  padding: 0;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-xl);
  flex-wrap: wrap;
  gap: var(--spacing-md);
}

.page-header__main {
  flex: 1;
  min-width: 300px;
}

.page-title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-sm) 0;
}

.page-description {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  margin: 0;
}

.page-header__actions {
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

.action-btn--small {
  padding: var(--spacing-xs);
  border-radius: var(--border-radius-sm);
}

.customer-content {
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

.customer-search {
  max-width: 500px;
}

.search-stats {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.customer-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-lg);
}

.stat-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  transition: all var(--duration-fast);
}

.stat-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--border-radius-md);
  background: var(--color-primary-light);
  color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xs);
}

.stat-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.customer-table-section {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
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

.sort-options {
  display: flex;
  gap: var(--spacing-xs);
  align-items: center;
}

.sort-select {
  padding: var(--spacing-xs) var(--spacing-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-sm);
  background: var(--color-surface);
  color: var(--color-text-primary);
}

.sort-direction {
  padding: var(--spacing-xs);
  background: none;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-sm);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--duration-fast);
}

.sort-direction:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.customer-table {
  overflow-x: auto;
  background: var(--color-surface);
  position: relative;
}

.customer-table table {
  width: 100%;
  min-width: 1200px; /* 确保表格足够宽以触发水平滚动 */
  border-collapse: collapse;
}

.customer-table th,
.customer-table td {
  padding: var(--spacing-lg) var(--spacing-md);
  text-align: left;
  border-bottom: 1px solid var(--color-border-light);
  white-space: nowrap;
}

.customer-table th {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  position: sticky;
  top: 0;
  z-index: 1;
  border-bottom: 2px solid var(--color-border);
  white-space: nowrap;
}

/* 固定第一列（复选框） */
.customer-table th:first-child,
.customer-table td:first-child {
  position: sticky;
  left: 0;
  z-index: 3;
  background: var(--color-surface);
  border-right: 1px solid var(--color-border);
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
  width: 60px;
  min-width: 60px;
  max-width: 60px;
}

/* 固定第二列（客户名称） */
.customer-table th:nth-child(2),
.customer-table td:nth-child(2) {
  position: sticky;
  left: 60px; /* 调整第一列的宽度 */
  z-index: 2;
  background: var(--color-surface);
  border-right: 1px solid var(--color-border);
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
  min-width: 200px;
}

/* 表头的固定列样式 */
.customer-table th:first-child {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  z-index: 4;
}

.customer-table th:nth-child(2) {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  z-index: 3;
}

.customer-table th.sortable {
  cursor: pointer;
  user-select: none;
  transition: color var(--duration-fast);
}

.customer-table th.sortable:hover {
  color: var(--color-primary);
}

.customer-row {
  cursor: pointer;
  transition: all var(--duration-fast);
  position: relative;
}

.customer-row:hover {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.customer-row:hover td:first-child,
.customer-row:hover td:nth-child(2) {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}



.customer-row--selected {
  background: var(--color-primary-light);
}

.customer-row--selected:hover {
  background: var(--color-primary-light);
}

.customer-row--selected td:first-child,
.customer-row--selected td:nth-child(2) {
  background: var(--color-primary-light);
}

.customer-row--selected:hover td:first-child,
.customer-row--selected:hover td:nth-child(2) {
  background: var(--color-primary-light);
}

.customer-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  white-space: normal;
  min-width: 200px;
}

.customer-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--color-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-sm);
}

.customer-details {
  flex: 1;
  min-width: 0;
}

.customer-name {
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xs);
  white-space: normal;
  word-break: break-word;
}

.customer-website {
  font-size: var(--font-size-sm);
  color: var(--color-primary);
  margin-bottom: var(--spacing-xs);
  text-decoration: none;
  white-space: normal;
  word-break: break-word;
}

.customer-manager {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}

.industry-badge {
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
  color: var(--color-text-primary);
}

.revenue-value {
  font-weight: var(--font-weight-semibold);
  color: var(--color-success);
}

.roi-badge {
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.roi-excellent {
  background: rgba(82, 196, 26, 0.1);
  color: var(--color-success);
}
.roi-good {
  background: rgba(24, 144, 255, 0.1);
  color: var(--color-info);
}
.roi-fair {
  background: rgba(250, 173, 20, 0.1);
  color: var(--color-warning);
}
.roi-poor {
  background: rgba(245, 34, 45, 0.1);
  color: var(--color-error);
}

.region-text,
.contact-text,
.team-text,
.date-text,
.sales-text {
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
}

.grade-badge {
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  text-align: center;
  min-width: 24px;
}

.grade-badge--A {
  background: rgba(82, 196, 26, 0.1);
  color: var(--color-success);
}

.grade-badge--B {
  background: rgba(24, 144, 255, 0.1);
  color: var(--color-info);
}

.grade-badge--C {
  background: rgba(250, 173, 20, 0.1);
  color: var(--color-warning);
}

.status-badge {
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.status-badge--active {
  background: rgba(82, 196, 26, 0.1);
  color: var(--color-success);
}

.status-badge--inactive,
.status-badge--suspended {
  background: rgba(140, 140, 140, 0.1);
  color: var(--color-text-secondary);
}

.update-time {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.action-menu {
  display: flex;
  gap: var(--spacing-xs);
}

.checkbox-input {
  width: 16px;
  height: 16px;
  accent-color: var(--color-primary);
}

.customer-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-lg);
  padding: var(--spacing-lg);
}

.customer-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  cursor: pointer;
  transition: all var(--duration-fast);
}

.customer-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.customer-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.customer-avatar-large {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: var(--color-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-lg);
}

.customer-actions {
  display: flex;
  gap: var(--spacing-xs);
}

.card-action {
  padding: var(--spacing-xs);
  background: none;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-sm);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--duration-fast);
}

.card-action:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.customer-card__name {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-xs) 0;
}

.customer-card__website {
  font-size: var(--font-size-sm);
  color: var(--color-primary);
  margin: 0 0 var(--spacing-md) 0;
}

.customer-card__info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-md);
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-label {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}

.cooperation-tag,
.team-tag {
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--color-background);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
  color: var(--color-text-primary);
}

.contact-info {
  font-size: var(--font-size-xs);
  color: var(--color-text-primary);
}

.customer-card__metrics {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.metric {
  text-align: center;
}

.metric-label {
  display: block;
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-xs);
}

.metric-value {
  display: block;
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.customer-card__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.industry-tag {
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--color-background);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}

.grade-tag {
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.grade-tag--A {
  background: rgba(82, 196, 26, 0.1);
  color: var(--color-success);
}

.grade-tag--B {
  background: rgba(24, 144, 255, 0.1);
  color: var(--color-info);
}

.grade-tag--C {
  background: rgba(250, 173, 20, 0.1);
  color: var(--color-warning);
}

.status-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.status-indicator--active {
  background: var(--color-success);
}

.status-indicator--inactive,
.status-indicator--suspended {
  background: var(--color-text-disabled);
}

.pagination-section {
  padding: var(--spacing-lg);
  border-top: 1px solid var(--color-border-light);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-md);
}

.pagination-info {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.pagination-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  cursor: pointer;
  transition: all var(--duration-fast);
}

.pagination-btn:hover:not(:disabled) {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.pagination-btn:disabled {
  color: var(--color-text-disabled);
  cursor: not-allowed;
}

.pagination-numbers {
  display: flex;
  gap: var(--spacing-xs);
}

.pagination-number {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  cursor: pointer;
  transition: all var(--duration-fast);
}

.pagination-number:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.pagination-number--active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

.bulk-actions {
  position: fixed;
  bottom: var(--spacing-lg);
  left: 50%;
  transform: translateX(-50%);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-xl);
  padding: var(--spacing-md) var(--spacing-lg);
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  z-index: 1000;
}

.bulk-actions__info {
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  font-weight: var(--font-weight-medium);
}

.bulk-actions__buttons {
  display: flex;
  gap: var(--spacing-sm);
}

.bulk-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  cursor: pointer;
  transition: all var(--duration-fast);
}

.bulk-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.bulk-btn--danger:hover {
  border-color: var(--color-error);
  color: var(--color-error);
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-lg);
  z-index: 999;
}

.loading-spinner {
  animation: spin 1s linear infinite;
  color: var(--color-primary);
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .search-filter-section {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }

  .customer-stats {
    grid-template-columns: repeat(2, 1fr);
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

  .customer-search {
    max-width: none;
  }

  .customer-stats {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }

  .stat-card {
    padding: var(--spacing-md);
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

  .customer-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
    padding: var(--spacing-md);
  }

  .customer-card {
    padding: var(--spacing-md);
  }

  .customer-table {
    font-size: var(--font-size-sm);
  }

  .customer-table th,
  .customer-table td {
    padding: var(--spacing-sm);
  }

  .cooperation-badge,
  .industry-badge,
  .grade-badge,
  .status-badge {
    font-size: var(--font-size-xs);
    padding: 2px 6px;
  }

  .bulk-actions {
    left: var(--spacing-md);
    right: var(--spacing-md);
    transform: none;
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-md);
    padding: var(--spacing-md);
  }

  .bulk-actions__buttons {
    justify-content: center;
    flex-wrap: wrap;
  }

  .bulk-action-btn {
    flex: 1;
    min-width: 120px;
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

  .pagination-numbers {
    order: 2;
    justify-content: center;
  }

  .pagination-btn {
    min-width: 80px;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: var(--font-size-2xl);
  }

  .stat-card {
    flex-direction: column;
    text-align: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm);
  }

  .stat-icon {
    align-self: center;
    width: 40px;
    height: 40px;
  }

  .stat-value {
    font-size: var(--font-size-xl);
  }

  .customer-card {
    padding: var(--spacing-sm);
  }

  .customer-table {
    font-size: var(--font-size-xs);
  }

  .customer-table th,
  .customer-table td {
    padding: var(--spacing-xs);
  }

  .table-actions {
    gap: var(--spacing-xs);
  }

  .action-btn {
    padding: var(--spacing-xs) var(--spacing-sm);
    font-size: var(--font-size-xs);
  }

  .bulk-action-btn {
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
