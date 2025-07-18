<template>
  <div class="customer-reviews-view">
    <div class="page-header">
      <div class="page-header__main">
        <h1 class="page-title">客户评价管理</h1>
        <p class="page-description">记录和管理客户对项目服务的评价反馈</p>
      </div>
      <div class="page-header__actions">
        <!-- 操作按钮已移除 -->
      </div>
    </div>

    <div class="reviews-content">
      <!-- 搜索和筛选区域 -->
      <div class="search-filter-section">
        <div class="search-section">
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

        <div class="filter-section">
          <div class="filter-row">
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

      <!-- 评价列表 -->
      <div class="reviews-list">
        <div class="list-header">
          <div class="list-actions">
                         <!-- 批量操作已移除 -->
            <div class="list-info">
              共 {{ totalReviews }} 条评价记录
            </div>
          </div>
        </div>

        <div class="reviews-table-container">
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
.customer-reviews-view {
  padding: 24px;
  background-color: #f8fafc;
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.page-header__main h1 {
  font-size: 28px;
  font-weight: 600;
  color: #1a202c;
  margin: 0 0 8px 0;
}

.page-header__main p {
  color: #64748b;
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
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn--primary {
  background-color: #3b82f6;
  color: white;
}

.action-btn--primary:hover {
  background-color: #2563eb;
}

.action-btn--secondary {
  background-color: #f1f5f9;
  color: #475569;
  border: 1px solid #e2e8f0;
}

.action-btn--secondary:hover {
  background-color: #e2e8f0;
}

.reviews-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.search-filter-section {
  padding: 24px;
  border-bottom: 1px solid #e2e8f0;
}

.search-section {
  margin-bottom: 20px;
}

.search-stats {
  margin-top: 8px;
  color: #64748b;
  font-size: 14px;
}

.filter-section .filter-row {
  display: flex;
  gap: 16px;
  align-items: end;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.filter-label {
  font-size: 14px;
  color: #374151;
  font-weight: 500;
}

.filter-select,
.filter-input {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  min-width: 140px;
}

.filter-clear-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  background-color: #f3f4f6;
  color: #6b7280;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.filter-clear-btn:hover {
  background-color: #e5e7eb;
}

.reviews-list {
  padding: 0;
}

.list-header {
  padding: 16px 24px;
  border-bottom: 1px solid #e2e8f0;
  background-color: #f8fafc;
}

.list-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.batch-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.selected-count {
  color: #3b82f6;
  font-weight: 500;
  font-size: 14px;
}

.batch-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid;
  cursor: pointer;
  font-size: 14px;
}

.batch-btn--danger {
  background-color: #fef2f2;
  color: #dc2626;
  border-color: #fecaca;
}

.batch-btn--secondary {
  background-color: #f8fafc;
  color: #64748b;
  border-color: #e2e8f0;
}

.list-info {
  color: #64748b;
  font-size: 14px;
}

.reviews-table-container {
  overflow-x: auto;
}

.reviews-table {
  width: 100%;
  border-collapse: collapse;
}

.reviews-table th,
.reviews-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

.reviews-table th {
  background-color: #f8fafc;
  font-weight: 600;
  color: #374151;
  font-size: 14px;
}

.reviews-table th.sortable {
  cursor: pointer;
  user-select: none;
  position: relative;
}

.reviews-table th.sortable:hover {
  background-color: #f1f5f9;
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
  gap: 4px;
  font-weight: 600;
}

.rating-excellent {
  color: #059669;
}

.rating-good {
  color: #3b82f6;
}

.rating-average {
  color: #f59e0b;
}

.rating-poor {
  color: #dc2626;
}

.rating-score {
  font-weight: 500;
  color: #374151;
}

.responsible-team {
  font-weight: 500;
  color: #3b82f6;
  background-color: #eff6ff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.action-buttons {
  display: flex;
  gap: 4px;
}

.action-btn-sm {
  padding: 6px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn-sm--info {
  background-color: #e0f2fe;
  color: #0891b2;
}

.action-btn-sm--primary {
  background-color: #dbeafe;
  color: #2563eb;
}

.action-btn-sm--danger {
  background-color: #fef2f2;
  color: #dc2626;
}

.action-btn-sm:hover {
  opacity: 0.8;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  padding: 20px;
  border-top: 1px solid #e2e8f0;
}

.pagination-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  cursor: pointer;
  color: #64748b;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-btn:not(:disabled):hover {
  background-color: #f1f5f9;
}

.pagination-pages {
  display: flex;
  gap: 4px;
}

.pagination-page {
  padding: 8px 12px;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  cursor: pointer;
  color: #64748b;
  min-width: 40px;
  text-align: center;
}

.pagination-page.active {
  background-color: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.pagination-page:not(.active):hover {
  background-color: #f1f5f9;
}
</style>
