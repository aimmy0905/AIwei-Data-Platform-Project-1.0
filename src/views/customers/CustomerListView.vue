<template>
  <div class="customer-list-view">
    <div class="page-header">
      <div class="page-header__main">
        <h1 class="page-title">客户管理</h1>
        <p class="page-description">管理和分析您的客户数据，优化客户关系</p>
      </div>
      <div class="page-header__actions">
        <button class="action-btn action-btn--secondary">
          <Download :size="16" />
          导出数据
        </button>
        <button class="action-btn action-btn--primary">
          <Plus :size="16" />
          添加客户
        </button>
      </div>
    </div>

    <div class="customer-content">
      <!-- 搜索和筛选区域 -->
      <div class="search-filter-section">
        <div class="search-section">
          <SearchInput
            v-model="searchQuery"
            placeholder="搜索客户名称、网站或负责人..."
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

      <!-- 统计摘要 -->
      <div class="customer-stats">
        <div class="stat-card">
          <div class="stat-icon">
            <Users :size="24" />
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ customerStats.total }}</div>
            <div class="stat-label">总客户数</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">
            <TrendingUp :size="24" />
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ customerStats.active }}</div>
            <div class="stat-label">活跃客户</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">
            <DollarSign :size="24" />
          </div>
          <div class="stat-content">
            <div class="stat-value">${{ formatNumber(customerStats.totalRevenue) }}</div>
            <div class="stat-label">总收入</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">
            <Target :size="24" />
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ customerStats.avgROI }}x</div>
            <div class="stat-label">平均ROI</div>
          </div>
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
              <div class="sort-options">
                <select v-model="sortBy" @change="handleSort" class="sort-select">
                  <option value="name">按名称排序</option>
                  <option value="revenue">按收入排序</option>
                  <option value="roi">按ROI排序</option>
                  <option value="created">按创建时间排序</option>
                  <option value="updated">按更新时间排序</option>
                </select>
                <button 
                  class="sort-direction"
                  @click="toggleSortDirection"
                  :title="sortDirection === 'asc' ? '升序' : '降序'"
                >
                  <ArrowUpDown :size="16" />
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
                  客户信息
                  <ArrowUpDown :size="14" v-if="sortBy === 'name'" />
                </th>
                <th @click="setSortBy('industry')" class="sortable">
                  行业
                  <ArrowUpDown :size="14" v-if="sortBy === 'industry'" />
                </th>
                <th @click="setSortBy('revenue')" class="sortable">
                  收入
                  <ArrowUpDown :size="14" v-if="sortBy === 'revenue'" />
                </th>
                <th @click="setSortBy('roi')" class="sortable">
                  ROI
                  <ArrowUpDown :size="14" v-if="sortBy === 'roi'" />
                </th>
                <th @click="setSortBy('status')" class="sortable">
                  状态
                  <ArrowUpDown :size="14" v-if="sortBy === 'status'" />
                </th>
                <th @click="setSortBy('updated')" class="sortable">
                  最后更新
                  <ArrowUpDown :size="14" v-if="sortBy === 'updated'" />
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
                      <div class="customer-manager">负责人: {{ customer.manager }}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="industry-badge">{{ customer.industry }}</span>
                </td>
                <td>
                  <span class="revenue-value">${{ formatNumber(customer.revenue) }}</span>
                </td>
                <td>
                  <span class="roi-badge" :class="getRoiClass(customer.roi)">
                    {{ customer.roi }}x
                  </span>
                </td>
                <td>
                  <span class="status-badge" :class="`status-badge--${customer.status}`">
                    {{ getStatusText(customer.status) }}
                  </span>
                </td>
                <td>
                  <span class="update-time">{{ formatDate(customer.lastUpdated) }}</span>
                </td>
                <td @click.stop>
                  <div class="action-menu">
                    <button class="action-btn action-btn--small" @click="editCustomer(customer)">
                      <Edit :size="14" />
                    </button>
                    <button class="action-btn action-btn--small" @click="viewCustomer(customer)">
                      <Eye :size="14" />
                    </button>
                    <button class="action-btn action-btn--small" @click="showCustomerMenu(customer)">
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
        <button class="bulk-btn">
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import { 
  Plus, Download, Users, TrendingUp, DollarSign, Target,
  List, Grid, ArrowUpDown, ChevronLeft, ChevronRight,
  Edit, Eye, MoreHorizontal, Mail, Trash2, Loader
} from 'lucide-vue-next'
import { mockGetCustomers } from '@/mock'
import SearchInput from '@/components/common/SearchInput.vue'
import FilterPanel from '@/components/common/FilterPanel.vue'
import type { Customer } from '@/types'

// 响应式数据
const loading = ref(true)
const customers = ref<Customer[]>([])
const searchQuery = ref('')
const viewMode = ref<'table' | 'grid'>('table')
const sortBy = ref('name')
const sortDirection = ref<'asc' | 'desc'>('asc')
const selectedCustomers = ref<number[]>([])
const selectAll = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)

const filters = reactive({
  dateRange: '',
  startDate: '',
  endDate: '',
  status: [] as string[],
  category: '',
  minAmount: null as number | null,
  maxAmount: null as number | null,
  manager: '',
  roiRange: ''
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
    key: 'manager',
    label: '负责人',
    type: 'input' as const,
    placeholder: '输入负责人姓名'
  },
  {
    key: 'roiRange',
    label: 'ROI范围',
    type: 'select' as const,
    options: [
      { value: 'low', label: '低于2x' },
      { value: 'medium', label: '2x-4x' },
      { value: 'high', label: '高于4x' }
    ]
  }
]

// 计算属性
const searchSuggestions = computed(() => {
  const suggestions = new Set<string>()
  customers.value.forEach(customer => {
    suggestions.add(customer.name)
    suggestions.add(customer.manager)
    suggestions.add(customer.industry)
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
      customer.website.toLowerCase().includes(query) ||
      customer.manager.toLowerCase().includes(query) ||
      customer.industry.toLowerCase().includes(query)
    )
  }

  // 状态过滤
  if (filters.status.length > 0) {
    result = result.filter(customer => filters.status.includes(customer.status))
  }

  // 行业过滤
  if (filters.category) {
    result = result.filter(customer => {
      const industryMap: Record<string, string> = {
        'fashion': '时尚服装',
        'tech': '数码科技',
        'beauty': '美容护肤',
        'sports': '体育用品',
        'home': '家居装饰'
      }
      return customer.industry === industryMap[filters.category]
    })
  }

  // 收入范围过滤
  if (filters.minAmount !== null) {
    result = result.filter(customer => customer.revenue >= filters.minAmount!)
  }
  if (filters.maxAmount !== null) {
    result = result.filter(customer => customer.revenue <= filters.maxAmount!)
  }

  // 负责人过滤
  if (filters.manager) {
    result = result.filter(customer => 
      customer.manager.toLowerCase().includes(filters.manager.toLowerCase())
    )
  }

  // ROI范围过滤
  if (filters.roiRange) {
    result = result.filter(customer => {
      switch (filters.roiRange) {
        case 'low': return customer.roi < 2
        case 'medium': return customer.roi >= 2 && customer.roi <= 4
        case 'high': return customer.roi > 4
        default: return true
      }
    })
  }

  // 排序
  result.sort((a, b) => {
    let valueA: unknown, valueB: unknown
    
    switch (sortBy.value) {
      case 'name':
        valueA = a.name.toLowerCase()
        valueB = b.name.toLowerCase()
        break
      case 'revenue':
        valueA = a.revenue
        valueB = b.revenue
        break
      case 'roi':
        valueA = a.roi
        valueB = b.roi
        break
      case 'created':
        valueA = new Date(a.createdAt).getTime()
        valueB = new Date(b.createdAt).getTime()
        break
      case 'updated':
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
  const avgROI = total > 0 ? 
    (filteredCustomers.value.reduce((sum, c) => sum + c.roi, 0) / total).toFixed(1) : '0.0'
  
  return { total, active, totalRevenue, avgROI }
})

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

const handleRowClick = (customer: Customer) => {
  viewCustomer(customer)
}

const handleCardClick = (customer: Customer) => {
  viewCustomer(customer)
}

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const editCustomer = (customer: Customer) => {
  console.log('编辑客户:', customer.name)
}

const viewCustomer = (customer: Customer) => {
  console.log('查看客户:', customer.name)
}

const showCustomerMenu = (customer: Customer) => {
  console.log('显示客户菜单:', customer.name)
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
}

.table-header {
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border-light);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-md);
}

.table-header__left h3 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-xs) 0;
}

.record-count {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.table-controls {
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
}

.view-options {
  display: flex;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-sm);
  overflow: hidden;
}

.view-btn {
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--color-surface);
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--duration-fast);
}

.view-btn:hover {
  background: var(--color-background);
}

.view-btn--active {
  background: var(--color-primary);
  color: white;
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
}

.customer-table table {
  width: 100%;
  border-collapse: collapse;
}

.customer-table th,
.customer-table td {
  padding: var(--spacing-md);
  text-align: left;
  border-bottom: 1px solid var(--color-border-light);
}

.customer-table th {
  background: var(--color-background);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
  position: sticky;
  top: 0;
  z-index: 1;
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
  transition: background-color var(--duration-fast);
}

.customer-row:hover {
  background: var(--color-background);
}

.customer-row--selected {
  background: var(--color-primary-light);
}

.customer-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
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
}

.customer-website {
  font-size: var(--font-size-sm);
  color: var(--color-primary);
  margin-bottom: var(--spacing-xs);
  text-decoration: none;
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
  }
  
  .customer-stats {
    grid-template-columns: 1fr;
  }
  
  .table-header {
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-sm);
  }
  
  .table-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .customer-grid {
    grid-template-columns: 1fr;
  }
  
  .bulk-actions {
    left: var(--spacing-md);
    right: var(--spacing-md);
    transform: none;
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-md);
  }
  
  .bulk-actions__buttons {
    justify-content: center;
  }
  
  .pagination-section {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
  }
}
</style>