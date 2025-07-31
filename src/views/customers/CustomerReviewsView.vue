<template>
  <div class="project-data-panel">
    <div class="panel-header">
      <div class="header-content">
        <h3>客户评价管理</h3>
        <p>记录和管理客户对项目服务的评价反馈</p>
      </div>
      <div class="header-actions">
        <!-- 操作按钮已移除 -->
      </div>
    </div>

    <div class="project-content">
      <!-- 搜索和筛选区域 -->
      <div class="search-filter-section">
        <div class="search-section">
          <div class="filter-section">
            <div class="filter-row">
              <div class="search-wrapper">
                <SearchInput
                  v-model="searchQuery"
                  placeholder="搜索客户名称、项目名称、评价人..."
                  @search="handleSearch"
                  @clear="handleSearchClear"
                  class="reviews-search"
                />
                <div class="search-stats" v-if="searchQuery">
                  找到 <strong>{{ filteredReviews.length }}</strong> 个结果
                </div>
              </div>

              <div class="filter-controls">
                <div class="filter-group">
                  <label class="filter-label">客户</label>
                  <select v-model="filters.customerId" @change="handleFilterChange" class="filter-select">
                    <option value="">全部客户</option>
                    <option v-for="customer in customers" :key="customer.id" :value="customer.id">
                      {{ customer.name }}
                    </option>
                  </select>
                </div>

                <div class="filter-group">
                  <label class="filter-label">项目</label>
                  <select v-model="filters.projectId" @change="handleFilterChange" class="filter-select">
                    <option value="">全部项目</option>
                    <option v-for="project in availableProjects" :key="project.id" :value="project.id">
                      {{ project.name }}
                    </option>
                  </select>
                </div>

                <div class="filter-group">
                  <label class="filter-label">评价月份</label>
                  <input
                    type="month"
                    v-model="filters.evaluationMonth"
                    @change="handleFilterChange"
                    class="filter-input"
                  />
                </div>

                <div class="filter-group">
                  <label class="filter-label">综合评分</label>
                  <select v-model="filters.ratingFilter" @change="handleFilterChange" class="filter-select">
                    <option value="">全部评分</option>
                    <option value="9-10">优秀 (9-10分)</option>
                    <option value="7-8">良好 (7-8分)</option>
                    <option value="5-6">一般 (5-6分)</option>
                    <option value="1-4">较差 (1-4分)</option>
                  </select>
                </div>

                <button class="filter-clear-btn" @click="clearFilters" v-if="hasActiveFilters">
                  <X :size="14" />
                  清除筛选
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 评价列表 -->
      <div class="project-table-section">
        <div class="table-header">
          <div class="table-header__left">
            <h3>评价记录</h3>
            <span class="record-count">共 {{ totalReviews }} 条记录</span>
          </div>
        </div>

        <div class="table-container">
          <table class="reviews-table">
            <thead>
              <tr>
                <th class="sortable" @click="handleSort('customerName')">
                  客户名称
                  <ChevronUp v-if="sortField === 'customerName' && sortOrder === 'asc'" :size="14" />
                  <ChevronDown v-if="sortField === 'customerName' && sortOrder === 'desc'" :size="14" />
                </th>
                <th class="sortable" @click="handleSort('projectName')">
                  项目名称
                  <ChevronUp v-if="sortField === 'projectName' && sortOrder === 'asc'" :size="14" />
                  <ChevronDown v-if="sortField === 'projectName' && sortOrder === 'desc'" :size="14" />
                </th>
                <th class="sortable" @click="handleSort('evaluationMonth')">
                  评价月份
                  <ChevronUp v-if="sortField === 'evaluationMonth' && sortOrder === 'asc'" :size="14" />
                  <ChevronDown v-if="sortField === 'evaluationMonth' && sortOrder === 'desc'" :size="14" />
                </th>
                <th class="sortable" @click="handleSort('overallRating')">
                  综合评分
                  <ChevronUp v-if="sortField === 'overallRating' && sortOrder === 'asc'" :size="14" />
                  <ChevronDown v-if="sortField === 'overallRating' && sortOrder === 'desc'" :size="14" />
                </th>
                <th>问题处理</th>
                <th>专业能力</th>
                <th>服务态度</th>
                <th>评价人</th>
                <th class="sortable" @click="handleSort('responsibleTeam')">
                  负责团队
                  <ChevronUp v-if="sortField === 'responsibleTeam' && sortOrder === 'asc'" :size="14" />
                  <ChevronDown v-if="sortField === 'responsibleTeam' && sortOrder === 'desc'" :size="14" />
                </th>
                <th class="sortable" @click="handleSort('createTime')">
                  创建时间
                  <ChevronUp v-if="sortField === 'createTime' && sortOrder === 'asc'" :size="14" />
                  <ChevronDown v-if="sortField === 'createTime' && sortOrder === 'desc'" :size="14" />
                </th>
                <th class="table-actions">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="review in displayedReviews" :key="review.id" class="table-row">
                <td class="customer-name">{{ review.customerName }}</td>
                <td class="project-name">{{ review.projectName }}</td>
                <td class="evaluation-month">{{ review.evaluationMonth }}</td>
                <td class="overall-rating">
                  <div class="rating-display" :class="getRatingClass(review.overallRating)">
                    <Star :size="14" :fill="'currentColor'" />
                    {{ review.overallRating }}
                  </div>
                </td>
                <td class="rating-score">{{ review.problemHandlingRating }}</td>
                <td class="rating-score">{{ review.professionalRating }}</td>
                <td class="rating-score">{{ review.serviceAttitudeRating }}</td>
                <td class="evaluator">{{ review.evaluator }}</td>
                <td class="responsible-team">{{ review.responsibleTeam }}</td>
                <td class="create-time">{{ formatDate(review.createTime) }}</td>
                <td class="table-actions">
                  <div class="action-buttons">
                    <button class="action-btn-sm action-btn-sm--info" @click="viewReview(review)" title="查看详情">
                      <Eye :size="14" />
                    </button>
                    <!-- 编辑和删除按钮已移除 -->
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 分页 -->
        <div class="pagination" v-if="totalPages > 1">
          <button
            class="pagination-btn"
            :disabled="currentPage === 1"
            @click="changePage(currentPage - 1)"
          >
            <ChevronLeft :size="16" />
            上一页
          </button>

          <div class="pagination-pages">
            <button
              v-for="page in visiblePages"
              :key="page"
              class="pagination-page"
              :class="{ active: page === currentPage }"
              @click="changePage(page)"
            >
              {{ page }}
            </button>
          </div>

          <button
            class="pagination-btn"
            :disabled="currentPage === totalPages"
            @click="changePage(currentPage + 1)"
          >
            下一页
            <ChevronRight :size="16" />
          </button>
        </div>
      </div>
    </div>

    <!-- 评价详情弹窗 -->
    <CustomerReviewDetailModal
      v-if="showDetailModal"
      :visible="showDetailModal"
      :review="viewingReview"
      @close="showDetailModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import {
  X, ChevronUp, ChevronDown, ChevronLeft, ChevronRight,
  Star, Eye
} from 'lucide-vue-next'
import SearchInput from '@/components/common/SearchInput.vue'
import CustomerReviewDetailModal from '@/components/customers/CustomerReviewDetailModalSimple.vue'
import {
  getCustomerReviews,
  getCustomers,
  getProjects,
  type CustomerReview
} from '@/mock/customer-reviews'

// 响应式数据
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const sortField = ref('createTime')
const sortOrder = ref<'asc' | 'desc'>('desc')

// 筛选条件
const filters = ref({
  customerId: '',
  projectId: '',
  evaluationMonth: '',
  ratingFilter: ''
})

// 弹窗状态
const showDetailModal = ref(false)
const viewingReview = ref<CustomerReview | null>(null)

// 数据
const reviews = ref<CustomerReview[]>([])
const customers = ref<Array<{id: string, name: string}>>([])
const projects = ref<Array<{id: string, customerId: string, name: string}>>([])
const totalReviews = ref(0)

// 计算属性
const filteredReviews = computed(() => {
  let result = [...reviews.value]

  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(review =>
      review.customerName.toLowerCase().includes(query) ||
      review.projectName.toLowerCase().includes(query) ||
      review.evaluator.toLowerCase().includes(query)
    )
  }

  // 客户过滤
  if (filters.value.customerId) {
    result = result.filter(review => review.customerId === filters.value.customerId)
  }

  // 项目过滤
  if (filters.value.projectId) {
    result = result.filter(review => review.projectId === filters.value.projectId)
  }

  // 评价月份过滤
  if (filters.value.evaluationMonth) {
    result = result.filter(review => review.evaluationMonth === filters.value.evaluationMonth)
  }

  // 评分过滤
  if (filters.value.ratingFilter) {
    const [min, max] = filters.value.ratingFilter.split('-').map(Number)
    result = result.filter(review => review.overallRating >= min && review.overallRating <= max)
  }

    // 排序
  result.sort((a, b) => {
    let aValue = a[sortField.value as keyof CustomerReview]
    let bValue = b[sortField.value as keyof CustomerReview]

    // 处理 undefined 值
    if (aValue === undefined) aValue = ''
    if (bValue === undefined) bValue = ''

    if (typeof aValue === 'string') aValue = aValue.toLowerCase()
    if (typeof bValue === 'string') bValue = bValue.toLowerCase()

    if (sortOrder.value === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  return result
})

const displayedReviews = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredReviews.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredReviews.value.length / pageSize.value)
})

const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i)
      }
      pages.push('...', total)
    } else if (current >= total - 3) {
      pages.push(1, '...')
      for (let i = total - 4; i <= total; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1, '...')
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i)
      }
      pages.push('...', total)
    }
  }

  return pages
})

const availableProjects = computed(() => {
  if (filters.value.customerId) {
    return projects.value.filter(project => project.customerId === filters.value.customerId)
  }
  return projects.value
})

const hasActiveFilters = computed(() => {
  return filters.value.customerId ||
         filters.value.projectId ||
         filters.value.evaluationMonth ||
         filters.value.ratingFilter
})

// 方法
const loadData = async () => {
  const result = getCustomerReviews({
    page: currentPage.value,
    pageSize: pageSize.value,
    search: searchQuery.value
  })

  reviews.value = result.data
  totalReviews.value = result.total
}

const loadCustomers = () => {
  customers.value = getCustomers()
}

const loadProjects = () => {
  projects.value = getProjects()
}

const handleSearch = () => {
  currentPage.value = 1
  loadData()
}

const handleSearchClear = () => {
  searchQuery.value = ''
  currentPage.value = 1
  loadData()
}

const handleFilterChange = () => {
  // 当客户改变时，清空项目筛选
  if (filters.value.customerId) {
    filters.value.projectId = ''
  }

  currentPage.value = 1
  loadData()
}

const clearFilters = () => {
  filters.value = {
    customerId: '',
    projectId: '',
    evaluationMonth: '',
    ratingFilter: ''
  }
  currentPage.value = 1
  loadData()
}

const handleSort = (field: string) => {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortOrder.value = 'asc'
  }
}

const changePage = (page: number | string) => {
  if (typeof page === 'number') {
    currentPage.value = page
    loadData()
  }
}

// 选择功能已移除

const getRatingClass = (rating: number) => {
  if (rating >= 9) return 'rating-excellent'
  if (rating >= 7) return 'rating-good'
  if (rating >= 5) return 'rating-average'
  return 'rating-poor'
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}

const viewReview = (review: CustomerReview) => {
  viewingReview.value = review
  showDetailModal.value = true
}

// 删除、编辑、导出功能已移除

// 生命周期
onMounted(() => {
  loadData()
  loadCustomers()
  loadProjects()
})

// 监听器
watch([searchQuery, filters], () => {
  currentPage.value = 1
}, { deep: true })
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
  gap: var(--spacing-md);
}

.project-content {
  padding: var(--spacing-lg);
}

.search-filter-section {
  margin-bottom: var(--spacing-xl);
}

.search-section {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
}

.filter-section {
  background: transparent;
  border: none;
  padding: 0;
  margin: 0;
}

.filter-row {
  display: flex;
  gap: var(--spacing-md);
  align-items: flex-start;
  flex-wrap: wrap;
}

.search-wrapper {
  flex: 1;
  min-width: 280px;
}

.search-stats {
  margin-top: var(--spacing-xs);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

.filter-controls {
  display: flex;
  gap: var(--spacing-md);
  align-items: flex-end;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.filter-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  font-weight: var(--font-weight-medium);
}

.filter-select,
.filter-input {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  background: var(--color-surface);
  color: var(--color-text-primary);
  min-width: 140px;
}

.filter-select:focus,
.filter-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
}

.filter-clear-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-background);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  cursor: pointer;
  font-size: var(--font-size-sm);
  transition: all var(--duration-fast);
}

.filter-clear-btn:hover {
  background: var(--color-background-hover);
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.project-table-section {
  margin-bottom: var(--spacing-xl);
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--color-border-light);
}

.table-header__left {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
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
}

.table-container {
  overflow-x: auto;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  margin-bottom: var(--spacing-lg);
}

.reviews-table {
  width: 100%;
  border-collapse: collapse;
  background: var(--color-surface);
}

.reviews-table th,
.reviews-table td {
  padding: var(--spacing-md);
  text-align: left;
  border-bottom: 1px solid var(--color-border);
}

.reviews-table th {
  background: var(--color-background);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
}

.reviews-table th.sortable {
  cursor: pointer;
  user-select: none;
  position: relative;
}

.reviews-table th.sortable:hover {
  background: var(--color-background-hover);
}

.table-row:hover {
  background: var(--color-background);
}

.table-checkbox {
  width: 40px;
}

.table-actions {
  width: 120px;
}

.rating-display {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-weight: var(--font-weight-semibold);
}

.rating-excellent {
  color: var(--color-success);
}

.rating-good {
  color: var(--color-primary);
}

.rating-average {
  color: var(--color-warning);
}

.rating-poor {
  color: var(--color-danger);
}

.rating-score {
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.responsible-team {
  font-weight: var(--font-weight-medium);
  color: var(--color-primary);
  background: var(--color-primary-light);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
}

.action-buttons {
  display: flex;
  gap: var(--spacing-xs);
}

.action-btn-sm {
  padding: var(--spacing-xs);
  border: none;
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: all var(--duration-fast);
}

.action-btn-sm--info {
  background: var(--color-info-light);
  color: var(--color-info);
}

.action-btn-sm--primary {
  background: var(--color-primary-light);
  color: var(--color-primary);
}

.action-btn-sm--danger {
  background: var(--color-danger-light);
  color: var(--color-danger);
}

.action-btn-sm:hover {
  opacity: 0.8;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-lg);
  border-top: 1px solid var(--color-border);
}

.pagination-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  cursor: pointer;
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  transition: all var(--duration-fast);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-btn:not(:disabled):hover {
  background: var(--color-background-hover);
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.pagination-pages {
  display: flex;
  gap: var(--spacing-xs);
}

.pagination-page {
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  cursor: pointer;
  color: var(--color-text-secondary);
  min-width: 40px;
  text-align: center;
  font-size: var(--font-size-sm);
  transition: all var(--duration-fast);
}

.pagination-page.active {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.pagination-page:not(.active):hover {
  background: var(--color-background-hover);
  border-color: var(--color-primary);
  color: var(--color-primary);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .filter-row {
    flex-direction: column;
    align-items: stretch;
  }

  .search-wrapper {
    min-width: auto;
  }

  .filter-controls {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-group {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .filter-select,
  .filter-input {
    min-width: auto;
    flex: 1;
  }
}

@media (max-width: 768px) {
  .panel-header {
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-md);
  }

  .header-actions {
    justify-content: center;
  }

  .table-container {
    font-size: var(--font-size-xs);
  }

  .reviews-table th,
  .reviews-table td {
    padding: var(--spacing-sm);
  }

  .pagination {
    flex-wrap: wrap;
  }

  .filter-group {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
