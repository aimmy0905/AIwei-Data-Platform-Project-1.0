<template>
  <div class="service-fee-view">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="page-header__main">
        <h1 class="page-title">服务费管理</h1>
        <p class="page-description">管理客户项目的服务费收款记录</p>
      </div>
      <div class="page-header__actions">
        <button class="action-btn action-btn--primary" @click="showCreateModal = true">
          <Plus :size="16" />
          新建收款记录
        </button>
      </div>
    </div>

    <!-- 筛选与搜索区域 -->
    <div class="filter-section">
      <div class="filter-group">
        <div class="search-input-wrapper">
          <Search :size="16" class="search-icon" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索客户名称、项目名称..."
            class="search-input"
          />
        </div>
        <select v-model="filters.customer" class="filter-select">
          <option value="">全部客户</option>
          <option v-for="customer in customers" :key="customer.id" :value="customer.id">
            {{ customer.name }}
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
        <button class="action-btn action-btn--secondary" @click="resetFilters">
          <RotateCcw :size="16" />
          重置
        </button>
      </div>
    </div>

    <!-- 收款记录列表 -->
    <div class="content-section">
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th @click="sortBy('customerName')">
                客户名称
                <ChevronUp v-if="sortField === 'customerName' && sortOrder === 'asc'" :size="14" />
                <ChevronDown v-if="sortField === 'customerName' && sortOrder === 'desc'" :size="14" />
              </th>
              <th @click="sortBy('projectName')">
                项目名称
                <ChevronUp v-if="sortField === 'projectName' && sortOrder === 'asc'" :size="14" />
                <ChevronDown v-if="sortField === 'projectName' && sortOrder === 'desc'" :size="14" />
              </th>
              <th @click="sortBy('paymentDate')">
                收款日期
                <ChevronUp v-if="sortField === 'paymentDate' && sortOrder === 'asc'" :size="14" />
                <ChevronDown v-if="sortField === 'paymentDate' && sortOrder === 'desc'" :size="14" />
              </th>
              <th @click="sortBy('paymentAmount')">
                收款金额
                <ChevronUp v-if="sortField === 'paymentAmount' && sortOrder === 'asc'" :size="14" />
                <ChevronDown v-if="sortField === 'paymentAmount' && sortOrder === 'desc'" :size="14" />
              </th>
              <th>服务周期</th>
              <th>收款类型</th>
              <th>备注</th>
              <th @click="sortBy('creator')">
                创建人
                <ChevronUp v-if="sortField === 'creator' && sortOrder === 'asc'" :size="14" />
                <ChevronDown v-if="sortField === 'creator' && sortOrder === 'desc'" :size="14" />
              </th>
              <th @click="sortBy('createTime')">
                创建时间
                <ChevronUp v-if="sortField === 'createTime' && sortOrder === 'asc'" :size="14" />
                <ChevronDown v-if="sortField === 'createTime' && sortOrder === 'desc'" :size="14" />
              </th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="record in filteredRecords" :key="record.id" class="table-row">
              <td class="customer-name">{{ record.customerName }}</td>
              <td class="project-name">{{ record.projectName }}</td>
              <td class="payment-date">{{ formatDate(record.paymentDate) }}</td>
              <td class="payment-amount">${{ formatNumber(record.paymentAmount) }}</td>
              <td class="service-period">{{ record.servicePeriod }}</td>
              <td>
                <span class="payment-type-badge" :class="`type-badge--${record.paymentType === '首次付款' ? 'first' : 'renewal'}`">
                  {{ record.paymentType }}
                </span>
              </td>
              <td class="remark">{{ record.remark || '-' }}</td>
              <td class="creator">{{ record.creator }}</td>
              <td class="create-time">{{ formatDateTime(record.createTime) }}</td>
              <td class="actions">
                <div class="action-buttons">
                  <button class="action-btn action-btn--small" @click="editRecord(record)">
                    <Edit :size="14" />
                    <span>编辑</span>
                  </button>
                  <button class="action-btn action-btn--small action-btn--danger" @click="deleteRecord(record)">
                    <Trash2 :size="14" />
                    <span>删除</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="filteredRecords.length === 0" class="empty-state">
          <FileX :size="48" />
          <p>{{ searchQuery || hasActiveFilters ? '没有找到匹配的记录' : '暂无收款记录' }}</p>
          <button class="action-btn action-btn--primary" @click="showCreateModal = true">
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
          <button class="action-btn action-btn--secondary" @click="closeModal">
            取消
          </button>
          <button class="action-btn action-btn--primary" @click="saveRecord" :disabled="saving">
            {{ saving ? '保存中...' : '保存' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import {
  Plus, Search, RotateCcw, ChevronUp, ChevronDown, Edit, Trash2,
  FileX, X
} from 'lucide-vue-next'

// 接口定义
interface ServiceFeeRecord {
  id: number
  customerId: number
  customerName: string
  projectId: number
  projectName: string
  paymentDate: string
  paymentAmount: number
  servicePeriod: string
  paymentType: '首次付款' | '续费'
  remark?: string
  creator: string
  createTime: string
}

interface Customer {
  id: number
  name: string
}

interface Project {
  id: number
  name: string
  customerId: number
}

// 响应式数据
const showCreateModal = ref(false)
const showEditModal = ref(false)
const editingRecord = ref<ServiceFeeRecord | null>(null)
const saving = ref(false)
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(20)
const sortField = ref('createTime')
const sortOrder = ref<'asc' | 'desc'>('desc')

// 筛选条件
const filters = reactive({
  customer: '',
  paymentType: '',
  startDate: '',
  endDate: ''
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

// 模拟数据
const records = ref<ServiceFeeRecord[]>([
  {
    id: 1,
    customerId: 1,
    customerName: 'TechFlow Solutions',
    projectId: 1,
    projectName: '海外电商推广项目',
    paymentDate: '2024-01-15',
    paymentAmount: 30000,
    servicePeriod: '1年',
    paymentType: '首次付款',
    remark: '年度服务费',
    creator: '张财务',
    createTime: '2024-01-15 10:30:00'
  },
  {
    id: 2,
    customerId: 1,
    customerName: 'TechFlow Solutions',
    projectId: 1,
    projectName: '海外电商推广项目',
    paymentDate: '2024-09-10',
    paymentAmount: 18000,
    servicePeriod: '6个月',
    paymentType: '续费',
    remark: '下半年续费',
    creator: '李财务',
    createTime: '2024-09-10 14:20:00'
  },
  {
    id: 3,
    customerId: 2,
    customerName: 'Global Fashion Brand',
    projectId: 2,
    projectName: '时尚品牌推广',
    paymentDate: '2024-03-01',
    paymentAmount: 25000,
    servicePeriod: '6个月',
    paymentType: '首次付款',
    creator: '王财务',
    createTime: '2024-03-01 09:15:00'
  }
])

const customers = ref<Customer[]>([
  { id: 1, name: 'TechFlow Solutions' },
  { id: 2, name: 'Global Fashion Brand' },
  { id: 3, name: 'EcoLife Products' }
])

const projects = ref<Project[]>([
  { id: 1, name: '海外电商推广项目', customerId: 1 },
  { id: 2, name: '时尚品牌推广', customerId: 2 },
  { id: 3, name: '环保产品推广', customerId: 3 }
])

// 计算属性
const availableProjects = computed(() => {
  if (!formData.customerId) return []
  return projects.value.filter(project => project.customerId === parseInt(formData.customerId))
})

const hasActiveFilters = computed(() => {
  return filters.customer || filters.paymentType || filters.startDate || filters.endDate
})

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
  if (filters.customer) {
    filtered = filtered.filter(record => record.customerId === parseInt(filters.customer))
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

  // 排序
  filtered.sort((a, b) => {
    let aValue = a[sortField.value as keyof ServiceFeeRecord]
    let bValue = b[sortField.value as keyof ServiceFeeRecord]

    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase()
      bValue = (bValue as string).toLowerCase()
    }

    if (sortOrder.value === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
    }
  })

  // 分页
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filtered.slice(start, end)
})

const totalRecords = computed(() => records.value.length)
const totalPages = computed(() => Math.ceil(totalRecords.value / pageSize.value))

// 方法
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN')
}

const formatDateTime = (dateTimeString: string): string => {
  const date = new Date(dateTimeString)
  return date.toLocaleString('zh-CN')
}

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(0) + 'K'
  }
  return num.toLocaleString()
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
  filters.customer = ''
  filters.paymentType = ''
  filters.startDate = ''
  filters.endDate = ''
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
    // 模拟保存过程
    await new Promise(resolve => setTimeout(resolve, 1000))

    const customer = customers.value.find(c => c.id === parseInt(formData.customerId))
    const project = projects.value.find(p => p.id === parseInt(formData.projectId))

    if (editingRecord.value) {
      // 编辑现有记录
      const index = records.value.findIndex(r => r.id === editingRecord.value!.id)
      if (index > -1) {
        records.value[index] = {
          ...editingRecord.value,
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
      }
    } else {
      // 创建新记录
      const newRecord: ServiceFeeRecord = {
        id: Date.now(),
        customerId: parseInt(formData.customerId),
        customerName: customer?.name || '',
        projectId: parseInt(formData.projectId),
        projectName: project?.name || '',
        paymentDate: formData.paymentDate,
        paymentAmount: formData.paymentAmount,
        servicePeriod: formData.servicePeriod,
        paymentType: formData.paymentType,
        remark: formData.remark,
        creator: '当前用户',
        createTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
      }
      records.value.unshift(newRecord)
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
    // 模拟删除过程
    await new Promise(resolve => setTimeout(resolve, 500))

    const index = records.value.findIndex(r => r.id === record.id)
    if (index > -1) {
      records.value.splice(index, 1)
    }
  } catch (error) {
    console.error('删除失败:', error)
  }
}

// 生命周期
onMounted(() => {
  // 初始化数据
})
</script>

<style scoped>
.service-fee-view {
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

.filter-section {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.filter-group {
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
  flex-wrap: wrap;
}

.search-input-wrapper {
  position: relative;
  min-width: 250px;
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

.content-section {
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
  cursor: pointer;
  user-select: none;
  position: relative;
}

.data-table th:hover {
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

.type-badge--first {
  background: rgba(82, 196, 26, 0.1);
  color: var(--color-success);
}

.type-badge--renewal {
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
  background: var(--color-surface);
  color: var(--color-text-primary);
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
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: var(--font-size-xs);
  white-space: nowrap;
}

.action-btn--small:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: rgba(59, 130, 246, 0.05);
}

.action-btn--small span {
  margin-left: var(--spacing-xs);
}

.action-btn--danger:hover {
  border-color: var(--color-error);
  color: var(--color-error);
  background: rgba(239, 68, 68, 0.05);
}

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
  .filter-group {
    flex-direction: column;
    align-items: stretch;
  }

  .search-input-wrapper {
    min-width: auto;
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

  .action-btn--small {
    justify-content: flex-start;
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
