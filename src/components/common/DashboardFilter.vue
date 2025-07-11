<template>
  <div class="dashboard-filter">
    <div class="filter-section">
      <!-- 客户筛选 -->
      <div class="filter-group">
        <label class="filter-label">客户项目</label>
        <div class="customer-filter">
                    <select
            v-model.number="filters.customerId"
            class="filter-select"
            @change="handleCustomerChange"
          >
            <option :value="null">全部客户</option>
            <option
              v-for="customer in customerOptions"
              :key="customer.id"
              :value="customer.id"
            >
              {{ customer.name }}
            </option>
          </select>

          <select
            v-if="filters.customerId"
            v-model="filters.projectId"
            class="filter-select"
            @change="handleFilterChange"
          >
            <option value="">全部项目</option>
            <option
              v-for="project in currentProjects"
              :key="project.id"
              :value="project.id"
            >
              {{ project.name }}
            </option>
          </select>
        </div>

        <div class="quick-actions">
          <button
            class="quick-btn"
            :class="{ 'quick-btn--active': filters.viewMode === 'all' }"
            @click="setViewMode('all')"
          >
            查看全部
          </button>
          <button
            class="quick-btn"
            :class="{ 'quick-btn--active': filters.viewMode === 'my' }"
            @click="setViewMode('my')"
          >
            我负责的
          </button>
        </div>
      </div>

      <!-- 时间筛选 -->
      <div class="filter-group">
        <label class="filter-label">时间范围</label>
        <div class="date-filter">
          <div class="quick-dates">
            <button
              v-for="period in quickPeriods"
              :key="period.value"
              class="period-btn"
              :class="{ 'period-btn--active': filters.dateRange === period.value }"
              @click="setDateRange(period.value)"
            >
              {{ period.label }}
            </button>
          </div>

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



      <!-- 操作按钮 -->
      <div class="filter-actions">
        <button
          class="filter-reset"
          @click="resetFilters"
        >
          <RotateCcw :size="16" />
          重置
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, reactive } from 'vue'
import { RotateCcw } from 'lucide-vue-next'

// 类型定义
import type { Customer, Project } from '@/types'

interface DashboardFilters {
  customerId: number | null
  projectId: string
  viewMode: 'all' | 'my'
  dateRange: string
  startDate: string
  endDate: string
}

interface Props {
  customerOptions?: Customer[]
  initialFilters?: Partial<DashboardFilters>
}

const props = withDefaults(defineProps<Props>(), {
  customerOptions: () => [],
  initialFilters: () => ({})
})

// 事件定义
const emit = defineEmits<{
  filterChange: [filters: DashboardFilters]
  filterApply: [filters: DashboardFilters]
  filterReset: []
}>()

// 快速时间选项
const quickPeriods = [
  { value: 'today', label: '今日' },
  { value: 'yesterday', label: '昨日' },
  { value: 'last7days', label: '近7日' },
  { value: 'last14days', label: '近14天' },
  { value: 'last90days', label: '近90天' },
  { value: 'last1year', label: '近1年' },
  { value: 'custom', label: '自定义' }
]

// 响应式数据
const filters = reactive<DashboardFilters>({
  customerId: null,
  projectId: '',
  viewMode: 'all',
  dateRange: 'today',
  startDate: '',
  endDate: '',
  ...props.initialFilters
})

// 计算属性
const currentProjects = computed(() => {
  if (!filters.customerId) return []
  const customer = props.customerOptions.find(c => c.id === filters.customerId)
  return customer?.projects || []
})

const hasValidFilters = computed(() => {
  // 至少需要有日期范围
  if (!filters.dateRange) return false

  // 如果是自定义日期，需要有开始和结束日期
  if (filters.dateRange === 'custom') {
    return filters.startDate && filters.endDate
  }

  return true
})

// 监听器
watch(filters, () => {
  emit('filterChange', { ...filters })
}, { deep: true })

// 方法
const handleCustomerChange = () => {
  // 客户变化时重置项目选择
  filters.projectId = ''
  handleFilterChange()
}

const handleFilterChange = () => {
  // 筛选变化已通过watch处理
}

const setViewMode = (mode: 'all' | 'my') => {
  filters.viewMode = mode
  handleFilterChange()
}

const setDateRange = (range: string) => {
  filters.dateRange = range

  // 如果不是自定义范围，清除自定义日期
  if (range !== 'custom') {
    filters.startDate = ''
    filters.endDate = ''
  }

  handleFilterChange()
}

const applyFilters = () => {
  if (hasValidFilters.value) {
    emit('filterApply', { ...filters })
  }
}

const resetFilters = () => {
  filters.customerId = null
  filters.projectId = ''
  filters.viewMode = 'all'
  filters.dateRange = 'today'
  filters.startDate = ''
  filters.endDate = ''

  emit('filterReset')
}

// 暴露给父组件的方法
defineExpose({
  resetFilters,
  applyFilters,
  filters
})
</script>

<style scoped>
.dashboard-filter {
  background: white;
  padding: 16px 24px;
  margin: 0;
  border: none !important;
  box-shadow: none !important;
  outline: none !important;
}

.filter-section {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  align-items: flex-start;
}

.filter-group {
  flex: 1;
  min-width: 200px;
}

.filter-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 8px;
}

.customer-filter {
  display: flex;
  gap: 12px;
  margin-bottom: 8px;
}

.filter-select {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 14px;
  background: var(--color-background-soft);
  color: var(--color-text);
}

.filter-select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.quick-actions {
  display: flex;
  gap: 8px;
}

.quick-btn {
  padding: 6px 12px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-background-soft);
  color: var(--color-text-secondary);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.quick-btn:hover {
  background: var(--color-background-mute);
}

.quick-btn--active {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.date-filter {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.quick-dates {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.period-btn {
  padding: 6px 12px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-background-soft);
  color: var(--color-text-secondary);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.period-btn:hover {
  background: var(--color-background-mute);
}

.period-btn--active {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.custom-date-range {
  display: flex;
  align-items: center;
  gap: 12px;
}

.filter-input {
  padding: 8px 12px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 14px;
  background: var(--color-background-soft);
  color: var(--color-text);
}

.filter-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.date-separator {
  color: var(--color-text-secondary);
  font-size: 14px;
}



.filter-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 120px;
}

.filter-apply,
.filter-reset {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 16px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-apply {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.filter-apply:hover:not(:disabled) {
  opacity: 0.9;
}

.filter-apply:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.filter-reset {
  background: var(--color-background-soft);
  color: var(--color-text-secondary);
}

.filter-reset:hover {
  background: var(--color-background-mute);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .filter-section {
    flex-direction: column;
  }

  .filter-group {
    min-width: 100%;
  }

  .customer-filter {
    flex-direction: column;
  }

  .quick-dates {
    justify-content: center;
  }

  .custom-date-range {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
