<template>
  <div class="service-fee-management">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="page-header__main">
        <div class="page-header__title">
          <button
            v-if="showBackButton"
            class="back-btn"
            @click="goBack"
            title="返回项目管理"
          >
            <ArrowLeft :size="20" />
          </button>
          <div>
            <h1 class="page-title">服务费管理</h1>
            <p class="page-description">管理客户项目的服务费收款记录</p>
          </div>
        </div>
      </div>
      <div class="page-header__actions">
        <button class="btn btn--primary" @click="showCreateModal = true">
          <Plus :size="16" />
          新建收款记录
        </button>
      </div>
    </div>

    <!-- 筛选与搜索区域 -->
    <div class="filter-section">
      <div class="filter-row">
        <div class="search-wrapper">
          <Search :size="16" class="search-icon" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索客户名称、项目名称..."
            class="search-input"
          />
        </div>

        <div class="filter-controls">
          <select v-model="filters.customerId" class="filter-select">
            <option value="">全部客户</option>
            <option v-for="customer in customers" :key="customer.id" :value="customer.id">
              {{ customer.name }}
            </option>
          </select>

          <select v-model="filters.projectId" class="filter-select">
            <option value="">全部项目</option>
            <option v-for="project in projects" :key="project.id" :value="project.id">
              {{ project.name }}
            </option>
          </select>

          <select v-model="filters.paymentType" class="filter-select">
            <option value="">全部类型</option>
            <option value="首次付款">首次付款</option>
            <option value="续费">续费</option>
          </select>

          <input
            v-model="filters.startDate"
            type="date"
            class="filter-input"
            placeholder="开始日期"
          />

          <input
            v-model="filters.endDate"
            type="date"
            class="filter-input"
            placeholder="结束日期"
          />

          <select v-model="filters.creator" class="filter-select">
            <option value="">全部创建人</option>
            <option v-for="creator in creators" :key="creator" :value="creator">
              {{ creator }}
            </option>
          </select>

          <button class="btn btn--secondary" @click="resetFilters">
            <RotateCcw :size="16" />
            重置
          </button>
        </div>
      </div>
    </div>

    <!-- 数据表格 -->
    <div class="table-section">
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th @click="sortBy('customerName')" class="sortable">
                客户名称
                <ChevronUp v-if="sortField === 'customerName' && sortOrder === 'asc'" :size="14" />
                <ChevronDown v-if="sortField === 'customerName' && sortOrder === 'desc'" :size="14" />
              </th>
              <th @click="sortBy('projectName')" class="sortable">
                项目名称
                <ChevronUp v-if="sortField === 'projectName' && sortOrder === 'asc'" :size="14" />
                <ChevronDown v-if="sortField === 'projectName' && sortOrder === 'desc'" :size="14" />
              </th>
              <th @click="sortBy('paymentDate')" class="sortable">
                收款日期
                <ChevronUp v-if="sortField === 'paymentDate' && sortOrder === 'asc'" :size="14" />
                <ChevronDown v-if="sortField === 'paymentDate' && sortOrder === 'desc'" :size="14" />
              </th>
              <th @click="sortBy('paymentAmount')" class="sortable">
                收款金额
                <ChevronUp v-if="sortField === 'paymentAmount' && sortOrder === 'asc'" :size="14" />
                <ChevronDown v-if="sortField === 'paymentAmount' && sortOrder === 'desc'" :size="14" />
              </th>
              <th>服务周期</th>
              <th>收款类型</th>
              <th>备注</th>
              <th @click="sortBy('creator')" class="sortable">
                创建人
                <ChevronUp v-if="sortField === 'creator' && sortOrder === 'asc'" :size="14" />
                <ChevronDown v-if="sortField === 'creator' && sortOrder === 'desc'" :size="14" />
              </th>
              <th @click="sortBy('createTime')" class="sortable">
                创建时间
                <ChevronUp v-if="sortField === 'createTime' && sortOrder === 'asc'" :size="14" />
                <ChevronDown v-if="sortField === 'createTime' && sortOrder === 'desc'" :size="14" />
              </th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="record in paginatedRecords" :key="record.id" class="table-row">
              <td class="customer-name">{{ record.customerName }}</td>
              <td class="project-name">{{ record.projectName }}</td>
              <td class="payment-date">{{ formatDate(record.paymentDate) }}</td>
              <td class="payment-amount">¥{{ formatCurrency(record.paymentAmount) }}</td>
              <td class="service-period">{{ record.servicePeriod }}</td>
              <td>
                <span class="payment-type-badge" :class="getPaymentTypeBadgeClass(record.paymentType)">
                  {{ record.paymentType }}
                </span>
              </td>
              <td class="remark" :title="record.remark">{{ record.remark || '-' }}</td>
              <td class="creator">{{ record.creator }}</td>
              <td class="create-time">{{ formatDateTime(record.createTime) }}</td>
              <td class="actions">
                <div class="action-buttons">
                  <button class="btn btn--small btn--outline" @click="editRecord(record)">
                    <Edit :size="14" />
                    编辑
                  </button>
                  <button class="btn btn--small btn--danger-outline" @click="deleteRecord(record)">
                    <Trash2 :size="14" />
                    删除
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- 空状态 -->
        <div v-if="filteredRecords.length === 0" class="empty-state">
          <FileX :size="48" />
          <p>{{ searchQuery || hasActiveFilters ? '没有找到匹配的记录' : '暂无收款记录' }}</p>
          <button class="btn btn--primary" @click="showCreateModal = true">
            <Plus :size="16" />
            新建收款记录
          </button>
        </div>
      </div>

      <!-- 分页 -->
      <div v-if="totalPages > 1" class="pagination">
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
          第 {{ currentPage }} 页，共 {{ totalPages }} 页，{{ totalRecords }} 条记录
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

    <!-- 新建/编辑收款记录模态框 -->
    <div v-if="showCreateModal || showEditModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ editingRecord ? '编辑收款记录' : '新建收款记录' }}</h3>
          <button class="modal-close" @click="closeModal">
            <X :size="20" />
          </button>
        </div>

        <div class="modal-body">
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label required">客户名称</label>
              <select
                v-model="formData.customerId"
                class="form-select"
                :class="{ 'form-input--error': formErrors.customerId }"
                @change="onCustomerChange"
              >
                <option value="">请选择客户</option>
                <option v-for="customer in customers" :key="customer.id" :value="customer.id">
                  {{ customer.name }}
                </option>
              </select>
              <span v-if="formErrors.customerId" class="error-message">{{ formErrors.customerId }}</span>
            </div>

            <div class="form-group">
              <label class="form-label required">项目名称</label>
              <select
                v-model="formData.projectId"
                class="form-select"
                :class="{ 'form-input--error': formErrors.projectId }"
                :disabled="!formData.customerId"
              >
                <option value="">请选择项目</option>
                <option v-for="project in availableProjects" :key="project.id" :value="project.id">
                  {{ project.name }}
                </option>
              </select>
              <span v-if="formErrors.projectId" class="error-message">{{ formErrors.projectId }}</span>
            </div>

            <div class="form-group">
              <label class="form-label required">收款日期</label>
              <input
                v-model="formData.paymentDate"
                type="date"
                class="form-input"
                :class="{ 'form-input--error': formErrors.paymentDate }"
              />
              <span v-if="formErrors.paymentDate" class="error-message">{{ formErrors.paymentDate }}</span>
            </div>

            <div class="form-group">
              <label class="form-label required">收款金额</label>
              <input
                v-model.number="formData.paymentAmount"
                type="number"
                step="0.01"
                min="1"
                class="form-input"
                :class="{ 'form-input--error': formErrors.paymentAmount }"
                placeholder="请输入收款金额"
              />
              <span v-if="formErrors.paymentAmount" class="error-message">{{ formErrors.paymentAmount }}</span>
            </div>

            <div class="form-group">
              <label class="form-label required">服务周期</label>
              <select
                v-model="formData.servicePeriod"
                class="form-select"
                :class="{ 'form-input--error': formErrors.servicePeriod }"
              >
                <option value="">请选择服务周期</option>
                <option value="1个月">1个月</option>
                <option value="3个月">3个月</option>
                <option value="6个月">6个月</option>
                <option value="1年">1年</option>
                <option value="自定义">自定义</option>
              </select>
              <span v-if="formErrors.servicePeriod" class="error-message">{{ formErrors.servicePeriod }}</span>
            </div>

            <div class="form-group">
              <label class="form-label required">收款类型</label>
              <div class="radio-group">
                <label class="radio-item">
                  <input
                    v-model="formData.paymentType"
                    type="radio"
                    value="首次付款"
                    class="radio-input"
                  />
                  <span class="radio-label">首次付款</span>
                </label>
                <label class="radio-item">
                  <input
                    v-model="formData.paymentType"
                    type="radio"
                    value="续费"
                    class="radio-input"
                  />
                  <span class="radio-label">续费</span>
                </label>
              </div>
              <span v-if="formErrors.paymentType" class="error-message">{{ formErrors.paymentType }}</span>
            </div>

            <div class="form-group form-group--full">
              <label class="form-label">备注</label>
              <textarea
                v-model="formData.remark"
                class="form-textarea"
                placeholder="请输入备注信息（可选）"
                rows="3"
                maxlength="200"
              ></textarea>
              <div class="char-count">{{ formData.remark?.length || 0 }}/200</div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn--secondary" @click="closeModal">
            取消
          </button>
          <button class="btn btn--primary" @click="saveRecord" :disabled="saving">
            {{ saving ? '保存中...' : '保存' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Plus, Search, RotateCcw, ChevronUp, ChevronDown, Edit, Trash2,
  FileX, X, ArrowLeft
} from 'lucide-vue-next'
import {
  type ServiceFeeRecord,
  type ServiceFeeCustomer,
  type ServiceFeeProject,
  mockGetServiceFeeRecords,
  mockGetServiceFeeCustomers,
  mockGetServiceFeeProjects,
  mockCreateServiceFeeRecord,
  mockUpdateServiceFeeRecord,
  mockDeleteServiceFeeRecord
} from '@/mock/service-fees'

const route = useRoute()
const router = useRouter()

// 响应式数据
const loading = ref(false)
const showCreateModal = ref(false)
const showEditModal = ref(false)
const editingRecord = ref<ServiceFeeRecord | null>(null)
const saving = ref(false)
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(20)
const sortField = ref('createTime')
const sortOrder = ref<'asc' | 'desc'>('desc')

// 数据
const records = ref<ServiceFeeRecord[]>([])
const customers = ref<ServiceFeeCustomer[]>([])
const projects = ref<ServiceFeeProject[]>([])

// 筛选条件
const filters = reactive({
  customerId: '',
  projectId: '',
  paymentType: '',
  startDate: '',
  endDate: '',
  creator: ''
})

// 表单数据
const formData = reactive({
  customerId: '',
  projectId: '',
  paymentDate: new Date().toISOString().split('T')[0],
  paymentAmount: 0,
  servicePeriod: '',
  paymentType: '首次付款' as '首次付款' | '续费',
  remark: ''
})

// 表单错误
const formErrors = reactive<Record<string, string>>({})

// 计算属性
const availableProjects = computed(() => {
  if (!formData.customerId) return []
  return projects.value.filter(project => project.customerId === parseInt(formData.customerId))
})

const creators = computed(() => {
  const uniqueCreators = [...new Set(records.value.map(record => record.creator))]
  return uniqueCreators.sort()
})

const hasActiveFilters = computed(() => {
  return filters.customerId || filters.projectId || filters.paymentType || filters.startDate || filters.endDate || filters.creator
})

// 是否显示返回按钮（当有来源页面参数时显示）
const showBackButton = computed(() => {
  return Boolean(route.query.projectId || route.query.projectName)
})

// 返回方法
const goBack = () => {
  router.push('/projects')
}

const filteredRecords = computed(() => {
  let filtered = [...records.value]

  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(record =>
      record.customerName.toLowerCase().includes(query) ||
      record.projectName.toLowerCase().includes(query)
    )
  }

  // 条件过滤
  if (filters.customerId) {
    filtered = filtered.filter(record => record.customerId === parseInt(filters.customerId))
  }

  if (filters.projectId) {
    filtered = filtered.filter(record => record.projectId === parseInt(filters.projectId))
  }

  if (filters.paymentType) {
    filtered = filtered.filter(record => record.paymentType === filters.paymentType)
  }

  if (filters.startDate) {
    filtered = filtered.filter(record => record.paymentDate >= filters.startDate)
  }

  if (filters.endDate) {
    filtered = filtered.filter(record => record.paymentDate <= filters.endDate)
  }

  if (filters.creator) {
    filtered = filtered.filter(record => record.creator === filters.creator)
  }

  // 排序
  filtered.sort((a, b) => {
    let aValue = a[sortField.value as keyof ServiceFeeRecord]
    let bValue = b[sortField.value as keyof ServiceFeeRecord]

    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase()
      bValue = (bValue as string).toLowerCase()
    }

    // 处理 undefined 值
    if (aValue === undefined && bValue === undefined) return 0
    if (aValue === undefined) return 1
    if (bValue === undefined) return -1

    if (sortOrder.value === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
    }
  })

  return filtered
})

const totalRecords = computed(() => filteredRecords.value.length)
const totalPages = computed(() => Math.ceil(totalRecords.value / pageSize.value))

const paginatedRecords = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredRecords.value.slice(start, end)
})

// 方法
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN')
}

const formatDateTime = (dateTimeString: string): string => {
  const date = new Date(dateTimeString)
  return date.toLocaleString('zh-CN')
}

const formatCurrency = (amount: number): string => {
  return amount.toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

const getPaymentTypeBadgeClass = (type: string): string => {
  return type === '首次付款' ? 'payment-type-badge--first' : 'payment-type-badge--renewal'
}

const sortBy = (field: string) => {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortOrder.value = 'asc'
  }
}

const resetFilters = () => {
  filters.customerId = ''
  filters.projectId = ''
  filters.paymentType = ''
  filters.startDate = ''
  filters.endDate = ''
  filters.creator = ''
  searchQuery.value = ''
  currentPage.value = 1
}

const onCustomerChange = () => {
  formData.projectId = ''
}

const validateForm = (): boolean => {
  Object.keys(formErrors).forEach(key => delete formErrors[key])

  if (!formData.customerId) {
    formErrors.customerId = '请选择客户'
  }

  if (!formData.projectId) {
    formErrors.projectId = '请选择项目'
  }

  if (!formData.paymentDate) {
    formErrors.paymentDate = '请选择收款日期'
  } else if (new Date(formData.paymentDate) > new Date()) {
    formErrors.paymentDate = '收款日期不能晚于当前日期'
  }

  if (!formData.paymentAmount || formData.paymentAmount < 1) {
    formErrors.paymentAmount = '请输入有效的收款金额（最小1元）'
  }

  if (!formData.servicePeriod) {
    formErrors.servicePeriod = '请选择服务周期'
  }

  if (!formData.paymentType) {
    formErrors.paymentType = '请选择收款类型'
  }

  if (formData.remark && formData.remark.length > 200) {
    formErrors.remark = '备注长度不能超过200字符'
  }

  return Object.keys(formErrors).length === 0
}

const resetForm = () => {
  formData.customerId = ''
  formData.projectId = ''
  formData.paymentDate = new Date().toISOString().split('T')[0]
  formData.paymentAmount = 0
  formData.servicePeriod = ''
  formData.paymentType = '首次付款'
  formData.remark = ''
  Object.keys(formErrors).forEach(key => delete formErrors[key])
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  editingRecord.value = null
  resetForm()
}

const editRecord = (record: ServiceFeeRecord) => {
  editingRecord.value = record
  formData.customerId = record.customerId.toString()
  formData.projectId = record.projectId.toString()
  formData.paymentDate = record.paymentDate
  formData.paymentAmount = record.paymentAmount
  formData.servicePeriod = record.servicePeriod
  formData.paymentType = record.paymentType
  formData.remark = record.remark || ''
  showEditModal.value = true
}

const saveRecord = async () => {
  if (!validateForm()) return

  saving.value = true
  try {
    const customer = customers.value.find(c => c.id === parseInt(formData.customerId))
    const project = projects.value.find(p => p.id === parseInt(formData.projectId))

    const recordData = {
      customerId: parseInt(formData.customerId),
      customerName: customer?.name || '',
      projectId: parseInt(formData.projectId),
      projectName: project?.name || '',
      paymentDate: formData.paymentDate,
      paymentAmount: formData.paymentAmount,
      servicePeriod: formData.servicePeriod,
      paymentType: formData.paymentType,
      remark: formData.remark
    }

          if (editingRecord.value) {
        // 编辑现有记录
        const response = await mockUpdateServiceFeeRecord(editingRecord.value.id, recordData)
        if (response.success && response.data) {
          const index = records.value.findIndex(r => r.id === editingRecord.value!.id)
          if (index > -1) {
            records.value[index] = response.data
          }
        }
      } else {
        // 创建新记录
        const response = await mockCreateServiceFeeRecord(recordData)
        if (response.success && response.data) {
          records.value.unshift(response.data)
        }
      }

    closeModal()
  } catch (error) {
    console.error('保存失败:', error)
  } finally {
    saving.value = false
  }
}

const deleteRecord = async (record: ServiceFeeRecord) => {
  if (!confirm(`确定要删除客户"${record.customerName}"的收款记录吗？`)) return

  try {
    const response = await mockDeleteServiceFeeRecord(record.id)
    if (response.success) {
      const index = records.value.findIndex(r => r.id === record.id)
      if (index > -1) {
        records.value.splice(index, 1)
      }
    }
  } catch (error) {
    console.error('删除失败:', error)
  }
}

const loadData = async () => {
  loading.value = true
  try {
    const [recordsResponse, customersResponse, projectsResponse] = await Promise.all([
      mockGetServiceFeeRecords(),
      mockGetServiceFeeCustomers(),
      mockGetServiceFeeProjects()
    ])

    if (recordsResponse.success && recordsResponse.data) {
      records.value = recordsResponse.data
    }
    if (customersResponse.success && customersResponse.data) {
      customers.value = customersResponse.data
    }
    if (projectsResponse.success && projectsResponse.data) {
      projects.value = projectsResponse.data
    }
  } catch (error) {
    console.error('加载数据失败:', error)
  } finally {
    loading.value = false
  }
}

// 处理路由查询参数
const applyRouteFilters = () => {
  const query = route.query

  // 如果有项目ID参数，应用项目筛选
  if (query.projectId) {
    filters.projectId = query.projectId as string
  }

  // 如果有项目名称参数，更新搜索查询
  if (query.projectName) {
    searchQuery.value = query.projectName as string
  }

  // 如果有支付类型参数，应用支付类型筛选
  if (query.paymentType) {
    filters.paymentType = query.paymentType as string
  }
}

// 监听筛选条件变化，重置分页
watch([searchQuery, filters], () => {
  currentPage.value = 1
}, { deep: true })

// 生命周期
onMounted(async () => {
  await loadData()
  // 数据加载完成后应用路由筛选参数
  applyRouteFilters()
})
</script>

<style scoped>
.service-fee-management {
  padding: 0;
}

/* 页面头部 */
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

.page-header__title {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-xs);
}

.back-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-secondary);
  padding: var(--spacing-xs);
  border-radius: var(--border-radius-md);
  transition: all var(--duration-fast);
}

.back-btn:hover {
  background: var(--color-background);
  color: var(--color-text-primary);
}

.page-title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-xs) 0;
}

.page-description {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  margin: 0;
}

.page-header__actions {
  display: flex;
  gap: var(--spacing-sm);
  align-items: center;
  flex-wrap: wrap;
}

/* 筛选区域 */
.filter-section {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.filter-row {
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
  flex-wrap: wrap;
}

.search-wrapper {
  position: relative;
  min-width: 280px;
}

.search-icon {
  position: absolute;
  left: var(--spacing-sm);
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-secondary);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-sm) var(--spacing-sm) 40px;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  background: var(--color-surface);
  color: var(--color-text-primary);
}

.search-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.filter-controls {
  display: flex;
  gap: var(--spacing-sm);
  align-items: center;
  flex-wrap: wrap;
}

.filter-select,
.filter-input {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  background: var(--color-surface);
  color: var(--color-text-primary);
  min-width: 120px;
}

.filter-select:focus,
.filter-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* 表格区域 */
.table-section {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xl);
}

.table-container {
  overflow-x: auto;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  margin-bottom: var(--spacing-lg);
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  background: var(--color-surface);
}

.data-table th {
  background: var(--color-background);
  padding: var(--spacing-md);
  text-align: left;
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  border-bottom: 1px solid var(--color-border);
  font-size: var(--font-size-sm);
  white-space: nowrap;
  position: relative;
}

.data-table th.sortable {
  cursor: pointer;
  user-select: none;
}

.data-table th.sortable:hover {
  background: var(--color-background-hover);
}

.data-table td {
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
  font-size: var(--font-size-sm);
  vertical-align: top;
}

.table-row:hover {
  background: var(--color-background);
}

.customer-name,
.project-name {
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.payment-amount {
  font-weight: var(--font-weight-semibold);
  color: var(--color-success);
}

.payment-type-badge {
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  white-space: nowrap;
}

.payment-type-badge--first {
  background: rgba(82, 196, 26, 0.1);
  color: var(--color-success);
}

.payment-type-badge--renewal {
  background: rgba(24, 144, 255, 0.1);
  color: var(--color-info);
}

.remark {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.actions {
  min-width: 150px;
}

.action-buttons {
  display: flex;
  gap: var(--spacing-xs);
  align-items: center;
}

/* 按钮样式 */
.btn {
  display: inline-flex;
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
  background: var(--color-surface);
  color: var(--color-text-primary);
}

.btn--primary {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

.btn--primary:hover {
  background: var(--color-primary-hover);
  border-color: var(--color-primary-hover);
}

.btn--secondary {
  background: var(--color-surface);
  color: var(--color-text-primary);
}

.btn--secondary:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.btn--small {
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: var(--font-size-xs);
  white-space: nowrap;
}

.btn--outline:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: rgba(59, 130, 246, 0.05);
}

.btn--danger-outline:hover {
  border-color: var(--color-error);
  color: var(--color-error);
  background: rgba(239, 68, 68, 0.05);
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-lg);
  padding: var(--spacing-2xl);
  color: var(--color-text-secondary);
  text-align: center;
}

/* 分页 */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-lg);
}

.pagination-btn {
  padding: var(--spacing-xs) var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  background: var(--color-surface);
  color: var(--color-text-primary);
  cursor: pointer;
  transition: all var(--duration-fast);
  font-size: var(--font-size-sm);
}

.pagination-btn:hover:not(:disabled) {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  margin: 0 var(--spacing-md);
}

/* 模态框样式 */
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
  background: var(--color-surface);
  border-radius: var(--border-radius-lg);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  max-width: 800px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
}

.modal-header h3 {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.modal-close {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-secondary);
  padding: var(--spacing-xs);
  border-radius: var(--border-radius-md);
  transition: all var(--duration-fast);
}

.modal-close:hover {
  background: var(--color-background);
  color: var(--color-text-primary);
}

.modal-body {
  padding: var(--spacing-lg);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
  padding: var(--spacing-lg);
  border-top: 1px solid var(--color-border);
}

/* 表单样式 */
.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-lg);
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
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.form-label.required::after {
  content: ' *';
  color: var(--color-error);
}

.form-input,
.form-select,
.form-textarea {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  background: var(--color-surface);
  color: var(--color-text-primary);
  transition: all var(--duration-fast);
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-input--error,
.form-select--error,
.form-textarea--error {
  border-color: var(--color-error);
}

.form-input--error:focus,
.form-select--error:focus,
.form-textarea--error:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
  line-height: var(--line-height-relaxed);
}

.error-message {
  font-size: var(--font-size-xs);
  color: var(--color-error);
}

.radio-group {
  display: flex;
  gap: var(--spacing-md);
  margin-top: var(--spacing-xs);
}

.radio-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  cursor: pointer;
  font-size: var(--font-size-sm);
}

.radio-input {
  width: 16px;
  height: 16px;
  accent-color: var(--color-primary);
  cursor: pointer;
}

.radio-label {
  color: var(--color-text-primary);
  cursor: pointer;
  user-select: none;
}

.char-count {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  text-align: right;
  margin-top: var(--spacing-xs);
}

/* 响应式设计 */
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

  .filter-select,
  .filter-input {
    min-width: auto;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .action-buttons {
    flex-direction: column;
    align-items: stretch;
  }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: stretch;
  }

  .page-header__actions {
    justify-content: center;
  }

  .data-table {
    font-size: var(--font-size-xs);
  }

  .data-table th,
  .data-table td {
    padding: var(--spacing-sm);
  }

  .pagination {
    flex-wrap: wrap;
  }
}
</style>
