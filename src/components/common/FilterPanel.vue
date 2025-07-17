<template>
  <div class="filter-panel">
    <!-- 筛选触发按钮 (弹窗模式) -->
    <div v-if="modal" class="filter-trigger">
      <button
        class="filter-trigger-btn"
        @click="toggleModal"
        :class="{ 'filter-trigger-btn--active': hasActiveFilters }"
      >
        <Filter :size="20" />
        <span>筛选条件</span>
        <span v-if="activeFilterCount > 0" class="filter-count">{{ activeFilterCount }}</span>
        <ChevronDown
          :size="16"
          :class="{ 'filter-trigger-icon--rotated': showModal }"
        />
      </button>
    </div>

    <!-- 弹窗遮罩层 -->
    <div v-if="modal && showModal" class="filter-modal-overlay" @click="closeModal">
      <div class="filter-modal-content" @click.stop>
        <div class="filter-modal-header">
          <div class="filter-title">
            <Filter :size="20" />
            <h3>筛选条件</h3>
          </div>
          <div class="filter-actions">
            <button
              v-if="hasActiveFilters"
              class="filter-clear"
              @click="clearAllFilters"
              :title="clearAllTitle"
            >
              <X :size="16" />
              清除全部
            </button>
            <button
              class="filter-close"
              @click="closeModal"
              title="关闭"
            >
              <X :size="16" />
            </button>
          </div>
        </div>

        <div class="filter-modal-body">
          <!-- 筛选内容 -->
          <div class="filter-content">
            <!-- 日期范围筛选 -->
            <div v-if="showDateFilter" class="filter-group">
              <label class="filter-label">日期范围</label>
              <div class="date-filter">
                <select
                  v-model="filters.dateRange"
                  class="filter-select"
                  @change="handleFilterChange"
                >
                  <option value="">全部时间</option>
                  <option value="today">今天</option>
                  <option value="yesterday">昨天</option>
                  <option value="last7days">过去7天</option>
                  <option value="last30days">过去30天</option>
                  <option value="last90days">过去90天</option>
                  <option value="custom">自定义</option>
                </select>

                <div v-if="filters.dateRange === 'custom'" class="custom-date-range">
                  <input
                    v-model="filters.startDate"
                    type="date"
                    class="filter-input"
                    @change="handleFilterChange"
                  />
                  <span class="date-separator">至</span>
                  <input
                    v-model="filters.endDate"
                    type="date"
                    class="filter-input"
                    @change="handleFilterChange"
                  />
                </div>
              </div>
            </div>

            <!-- 状态筛选 -->
            <div v-if="showStatusFilter" class="filter-group">
              <label class="filter-label">状态</label>
              <div class="checkbox-group">
                <label
                  v-for="status in statusOptions"
                  :key="status.value"
                  class="filter-checkbox"
                >
                  <input
                    v-model="filters.status"
                    type="checkbox"
                    :value="status.value"
                    class="checkbox-input"
                    @change="handleFilterChange"
                  />
                  <span class="checkbox-text">{{ status.label }}</span>
                </label>
              </div>
            </div>

            <!-- 分类筛选 -->
            <div v-if="showCategoryFilter" class="filter-group">
              <label class="filter-label">分类</label>
              <select
                v-model="filters.category"
                class="filter-select"
                @change="handleFilterChange"
              >
                <option value="">全部分类</option>
                <option
                  v-for="category in categoryOptions"
                  :key="category.value"
                  :value="category.value"
                >
                  {{ category.label }}
                </option>
              </select>
            </div>

            <!-- 数值范围筛选 -->
            <div v-if="showAmountFilter" class="filter-group">
              <label class="filter-label">{{ amountLabel }}</label>
              <div class="amount-filter">
                <input
                  v-model.number="filters.minAmount"
                  type="number"
                  :placeholder="`最小${amountLabel}`"
                  class="filter-input"
                  @change="handleFilterChange"
                />
                <span class="amount-separator">-</span>
                <input
                  v-model.number="filters.maxAmount"
                  type="number"
                  :placeholder="`最大${amountLabel}`"
                  class="filter-input"
                  @change="handleFilterChange"
                />
              </div>
            </div>

            <!-- 自定义筛选选项 -->
            <div
              v-for="customFilter in customFilters"
              :key="customFilter.key"
              class="filter-group"
            >
              <label class="filter-label">{{ customFilter.label }}</label>

              <!-- 下拉选择 -->
              <select
                v-if="customFilter.type === 'select'"
                v-model="filters[customFilter.key]"
                class="filter-select"
                @change="handleFilterChange"
              >
                <option value="">{{ customFilter.placeholder || '全部' }}</option>
                <option
                  v-for="option in customFilter.options"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>

              <!-- 多选框组 -->
              <div v-else-if="customFilter.type === 'checkbox'" class="checkbox-group">
                <label
                  v-for="option in customFilter.options"
                  :key="option.value"
                  class="filter-checkbox"
                >
                  <input
                    v-model="filters[customFilter.key]"
                    type="checkbox"
                    :value="option.value"
                    class="checkbox-input"
                    @change="handleFilterChange"
                  />
                  <span class="checkbox-text">{{ option.label }}</span>
                </label>
              </div>

              <!-- 输入框 -->
              <input
                v-else-if="customFilter.type === 'input'"
                v-model="filters[customFilter.key]"
                type="text"
                :placeholder="customFilter.placeholder"
                class="filter-input"
                @input="handleFilterChange"
              />
            </div>
          </div>
        </div>

        <!-- 弹窗底部操作按钮 -->
        <div class="filter-modal-footer">
          <button
            class="filter-cancel"
            @click="closeModal"
          >
            取消
          </button>
          <button
            class="filter-apply"
            @click="applyFiltersAndClose"
            :disabled="!hasActiveFilters"
          >
            应用筛选 ({{ activeFilterCount }})
          </button>
        </div>
      </div>
    </div>

    <!-- 非弹窗模式 (原有样式) -->
    <div v-if="!modal" class="filter-panel-inline">
      <div class="filter-panel__header">
        <div class="filter-title">
          <Filter :size="20" />
          <h3>筛选条件</h3>
        </div>
        <div class="filter-actions">
          <button
            v-if="hasActiveFilters"
            class="filter-clear"
            @click="clearAllFilters"
            :title="clearAllTitle"
          >
            <X :size="16" />
            清除全部
          </button>
          <button
            class="filter-toggle"
            @click="toggleCollapse"
            :title="collapsed ? '展开筛选' : '收起筛选'"
          >
            <ChevronDown
              :size="16"
              :class="{ 'filter-toggle--rotated': collapsed }"
            />
          </button>
        </div>
      </div>

      <div v-if="!collapsed" class="filter-panel__content">
        <!-- 日期范围筛选 -->
        <div v-if="showDateFilter" class="filter-group">
          <label class="filter-label">日期范围</label>
          <div class="date-filter">
            <select
              v-model="filters.dateRange"
              class="filter-select"
              @change="handleFilterChange"
            >
              <option value="">全部时间</option>
              <option value="today">今天</option>
              <option value="yesterday">昨天</option>
              <option value="last7days">过去7天</option>
              <option value="last30days">过去30天</option>
              <option value="last90days">过去90天</option>
              <option value="custom">自定义</option>
            </select>

            <div v-if="filters.dateRange === 'custom'" class="custom-date-range">
              <input
                v-model="filters.startDate"
                type="date"
                class="filter-input"
                @change="handleFilterChange"
              />
              <span class="date-separator">至</span>
              <input
                v-model="filters.endDate"
                type="date"
                class="filter-input"
                @change="handleFilterChange"
              />
            </div>
          </div>
        </div>

        <!-- 状态筛选 -->
        <div v-if="showStatusFilter" class="filter-group">
          <label class="filter-label">状态</label>
          <div class="checkbox-group">
            <label
              v-for="status in statusOptions"
              :key="status.value"
              class="filter-checkbox"
            >
              <input
                v-model="filters.status"
                type="checkbox"
                :value="status.value"
                class="checkbox-input"
                @change="handleFilterChange"
              />
              <span class="checkbox-text">{{ status.label }}</span>
            </label>
          </div>
        </div>

        <!-- 分类筛选 -->
        <div v-if="showCategoryFilter" class="filter-group">
          <label class="filter-label">分类</label>
          <select
            v-model="filters.category"
            class="filter-select"
            @change="handleFilterChange"
          >
            <option value="">全部分类</option>
            <option
              v-for="category in categoryOptions"
              :key="category.value"
              :value="category.value"
            >
              {{ category.label }}
            </option>
          </select>
        </div>

        <!-- 数值范围筛选 -->
        <div v-if="showAmountFilter" class="filter-group">
          <label class="filter-label">{{ amountLabel }}</label>
          <div class="amount-filter">
            <input
              v-model.number="filters.minAmount"
              type="number"
              :placeholder="`最小${amountLabel}`"
              class="filter-input"
              @change="handleFilterChange"
            />
            <span class="amount-separator">-</span>
            <input
              v-model.number="filters.maxAmount"
              type="number"
              :placeholder="`最大${amountLabel}`"
              class="filter-input"
              @change="handleFilterChange"
            />
          </div>
        </div>

        <!-- 自定义筛选选项 -->
        <div
          v-for="customFilter in customFilters"
          :key="customFilter.key"
          class="filter-group"
        >
          <label class="filter-label">{{ customFilter.label }}</label>

          <!-- 下拉选择 -->
          <select
            v-if="customFilter.type === 'select'"
            v-model="filters[customFilter.key]"
            class="filter-select"
            @change="handleFilterChange"
          >
            <option value="">{{ customFilter.placeholder || '全部' }}</option>
            <option
              v-for="option in customFilter.options"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>

          <!-- 多选框组 -->
          <div v-else-if="customFilter.type === 'checkbox'" class="checkbox-group">
            <label
              v-for="option in customFilter.options"
              :key="option.value"
              class="filter-checkbox"
            >
              <input
                v-model="filters[customFilter.key]"
                type="checkbox"
                :value="option.value"
                class="checkbox-input"
                @change="handleFilterChange"
              />
              <span class="checkbox-text">{{ option.label }}</span>
            </label>
          </div>

          <!-- 输入框 -->
          <input
            v-else-if="customFilter.type === 'input'"
            v-model="filters[customFilter.key]"
            type="text"
            :placeholder="customFilter.placeholder"
            class="filter-input"
            @input="handleFilterChange"
          />
        </div>

        <!-- 应用筛选按钮 -->
        <div class="filter-footer">
          <button
            class="filter-apply"
            @click="applyFilters"
            :disabled="!hasActiveFilters"
          >
            应用筛选 ({{ activeFilterCount }})
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, reactive } from 'vue'
import { Filter, X, ChevronDown } from 'lucide-vue-next'

// 类型定义
interface FilterOption {
  value: string | number
  label: string
}

interface CustomFilter {
  key: string
  label: string
  type: 'select' | 'checkbox' | 'input'
  options?: FilterOption[]
  placeholder?: string
}

interface FilterData {
  dateRange: string
  startDate: string
  endDate: string
  status: string[]
  category: string
  minAmount: number | null
  maxAmount: number | null
  [key: string]: unknown
}

// 属性定义
interface Props {
  modal?: boolean // 新增：是否使用弹窗模式
  showDateFilter?: boolean
  showStatusFilter?: boolean
  showCategoryFilter?: boolean
  showAmountFilter?: boolean
  amountLabel?: string
  statusOptions?: FilterOption[]
  categoryOptions?: FilterOption[]
  customFilters?: CustomFilter[]
  clearAllTitle?: string
  initialFilters?: Partial<FilterData>
}

const props = withDefaults(defineProps<Props>(), {
  modal: false, // 默认不使用弹窗模式
  showDateFilter: true,
  showStatusFilter: true,
  showCategoryFilter: true,
  showAmountFilter: true,
  amountLabel: '金额',
  statusOptions: () => [
    { value: 'active', label: '活跃' },
    { value: 'inactive', label: '暂停' },
    { value: 'suspended', label: '暂停' }
  ],
  categoryOptions: () => [
    { value: 'fashion', label: '时尚服装' },
    { value: 'tech', label: '数码科技' },
    { value: 'beauty', label: '美容护肤' },
    { value: 'sports', label: '体育用品' },
    { value: 'home', label: '家居装饰' }
  ],
  customFilters: () => [],
  clearAllTitle: '清除所有筛选条件'
})

// 事件定义
const emit = defineEmits<{
  filterChange: [filters: FilterData]
  filterApply: [filters: FilterData]
  filterClear: []
}>()

// 响应式数据
const collapsed = ref(false)
const showModal = ref(false) // 新增：控制弹窗显示
const filters = reactive<FilterData>({
  dateRange: '',
  startDate: '',
  endDate: '',
  status: [],
  category: '',
  minAmount: null,
  maxAmount: null,
  ...props.initialFilters
})

// 计算属性
const hasActiveFilters = computed(() => {
  return Object.entries(filters).some(([key, value]) => {
    if (key === 'status') return Array.isArray(value) && value.length > 0
    if (typeof value === 'string') return value.trim() !== ''
    if (typeof value === 'number') return value !== null && !isNaN(value)
    if (Array.isArray(value)) return value.length > 0
    return Boolean(value)
  })
})

const activeFilterCount = computed(() => {
  let count = 0

  if (filters.dateRange) count++
  if (filters.status.length > 0) count++
  if (filters.category) count++
  if (filters.minAmount !== null || filters.maxAmount !== null) count++

  // 计算自定义筛选
  props.customFilters.forEach(filter => {
    const value = filters[filter.key]
    if (Array.isArray(value) && value.length > 0) count++
    else if (typeof value === 'string' && value.trim()) count++
    else if (typeof value === 'number' && !isNaN(value)) count++
  })

  return count
})

// 监听器
watch(filters, () => {
  emit('filterChange', { ...filters })
}, { deep: true })

// 方法
const handleFilterChange = () => {
  // 筛选变化已通过watch处理
}

const toggleCollapse = () => {
  collapsed.value = !collapsed.value
}

const toggleModal = () => {
  showModal.value = !showModal.value
}

const closeModal = () => {
  showModal.value = false
}

const clearAllFilters = () => {
  filters.dateRange = ''
  filters.startDate = ''
  filters.endDate = ''
  filters.status = []
  filters.category = ''
  filters.minAmount = null
  filters.maxAmount = null

  // 清除自定义筛选
  props.customFilters.forEach(filter => {
    if (filter.type === 'checkbox') {
      filters[filter.key] = []
    } else {
      filters[filter.key] = ''
    }
  })

  emit('filterClear')
}

const applyFilters = () => {
  emit('filterApply', { ...filters })
}

const applyFiltersAndClose = () => {
  applyFilters()
  closeModal()
}
</script>

<style scoped>
.filter-panel {
  position: relative;
}

/* 弹窗模式触发按钮 */
.filter-trigger {
  margin-bottom: var(--spacing-md);
}

.filter-trigger-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  cursor: pointer;
  transition: all var(--duration-fast);
  position: relative;
}

.filter-trigger-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.filter-trigger-btn--active {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: var(--color-primary-light);
}

.filter-count {
  background: var(--color-primary);
  color: white;
  font-size: var(--font-size-xs);
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.filter-trigger-icon--rotated {
  transform: rotate(180deg);
}

/* 弹窗样式 */
.filter-modal-overlay {
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
  backdrop-filter: blur(4px);
}

.filter-modal-content {
  background: var(--color-surface);
  border-radius: var(--border-radius-lg);
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-lg);
}

.filter-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border-light);
  background: var(--color-background);
}

.filter-modal-body {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-lg);
}

.filter-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.filter-modal-footer {
  display: flex;
  gap: var(--spacing-sm);
  justify-content: flex-end;
  padding: var(--spacing-lg);
  border-top: 1px solid var(--color-border-light);
  background: var(--color-background);
}

.filter-cancel {
  padding: var(--spacing-sm) var(--spacing-lg);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--duration-fast);
}

.filter-cancel:hover {
  background: var(--color-background);
}

.filter-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: none;
  border: none;
  border-radius: var(--border-radius-sm);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--duration-fast);
}

.filter-close:hover {
  background: var(--color-background);
  color: var(--color-text-primary);
}

/* 非弹窗模式样式 (原有样式保持不变) */
.filter-panel-inline {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
}

.filter-panel__header {
  padding: var(--spacing-md) var(--spacing-lg);
  border-bottom: 1px solid var(--color-border-light);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--color-background);
}

.filter-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--color-text-primary);
}

.filter-title h3 {
  margin: 0;
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
}

.filter-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.filter-clear,
.filter-toggle {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  background: none;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--duration-fast);
}

.filter-clear:hover,
.filter-toggle:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.filter-toggle--rotated {
  transform: rotate(180deg);
}

.filter-panel__content {
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.filter-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.filter-select,
.filter-input {
  height: 36px;
  padding: 0 var(--spacing-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-sm);
  background: var(--color-surface);
  color: var(--color-text-primary);
  transition: border-color var(--duration-fast);
}

.filter-select:focus,
.filter-input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.date-filter {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.custom-date-range {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.date-separator,
.amount-separator {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

.amount-filter {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.amount-filter .filter-input {
  flex: 1;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.filter-checkbox {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;
  font-size: var(--font-size-sm);
}

.checkbox-input {
  width: 16px;
  height: 16px;
  accent-color: var(--color-primary);
}

.checkbox-text {
  color: var(--color-text-primary);
  user-select: none;
}

.filter-footer {
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--color-border-light);
}

.filter-apply {
  width: 100%;
  height: 40px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--duration-fast);
}

.filter-apply:hover:not(:disabled) {
  background: var(--color-primary-hover);
}

.filter-apply:disabled {
  background: var(--color-text-disabled);
  cursor: not-allowed;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .checkbox-group {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-sm);
  }

  .filter-modal-content {
    width: 95%;
    max-height: 85vh;
  }
}

@media (max-width: 768px) {
  .filter-panel__header {
    padding: var(--spacing-sm) var(--spacing-md);
    flex-wrap: wrap;
  }

  .filter-title {
    flex: 1;
  }

  .filter-actions {
    flex-wrap: wrap;
  }

  .filter-panel__content {
    padding: var(--spacing-md);
    gap: var(--spacing-md);
  }

  .filter-group {
    gap: var(--spacing-xs);
  }

  .filter-label {
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-semibold);
  }

  .filter-select,
  .filter-input {
    height: 40px;
    font-size: var(--font-size-sm);
  }

  .custom-date-range,
  .amount-filter {
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-xs);
  }

  .date-separator,
  .amount-separator {
    text-align: center;
    padding: var(--spacing-xs) 0;
  }

  .checkbox-group {
    grid-template-columns: 1fr;
    gap: var(--spacing-xs);
  }

  .filter-checkbox {
    padding: var(--spacing-xs);
    border-radius: var(--border-radius-sm);
    transition: background-color var(--duration-fast);
  }

  .filter-checkbox:hover {
    background: var(--color-background);
  }

  .filter-footer {
    padding-top: var(--spacing-sm);
  }

  .filter-apply {
    height: 44px;
    font-size: var(--font-size-md);
  }

  .filter-modal-content {
    width: 98%;
    max-height: 90vh;
  }

  .filter-modal-header,
  .filter-modal-body,
  .filter-modal-footer {
    padding: var(--spacing-md);
  }
}

@media (max-width: 480px) {
  .filter-panel__header {
    padding: var(--spacing-xs) var(--spacing-sm);
  }

  .filter-title h3 {
    font-size: var(--font-size-sm);
  }

  .filter-clear,
  .filter-toggle {
    padding: var(--spacing-xs);
    font-size: var(--font-size-xs);
  }

  .filter-panel__content {
    padding: var(--spacing-sm);
  }

  .filter-select,
  .filter-input {
    height: 36px;
    padding: 0 var(--spacing-xs);
  }

  .checkbox-input {
    width: 18px;
    height: 18px;
  }

  .checkbox-text {
    font-size: var(--font-size-sm);
  }

  .filter-apply {
    height: 40px;
    font-size: var(--font-size-sm);
  }

  .filter-modal-header,
  .filter-modal-body,
  .filter-modal-footer {
    padding: var(--spacing-sm);
  }
}
</style>
