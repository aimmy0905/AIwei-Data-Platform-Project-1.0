<template>
  <div class="dashboard-filter">
    <div class="filter-section">
      <!-- 客户选择 -->
      <div class="filter-group">
        <label class="filter-label">客户选择</label>
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
      </div>

      <!-- 项目选择 -->
      <div class="filter-group">
        <label class="filter-label">项目选择</label>
        <select
          v-model="filters.projectId"
          class="filter-select"
          @change="handleFilterChange"
          :disabled="!filters.customerId"
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

      <!-- 查看模式 -->
      <div class="filter-group">
        <label class="filter-label">查看模式</label>
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

// 响应式数据
const filters = reactive<DashboardFilters>({
  customerId: null,
  projectId: '',
  viewMode: 'all',
  ...props.initialFilters
})

// 计算属性
const currentProjects = computed(() => {
  if (!filters.customerId) return []
  const customer = props.customerOptions.find(c => c.id === filters.customerId)
  return customer?.projects || []
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

const applyFilters = () => {
  emit('filterApply', { ...filters })
}

const resetFilters = () => {
  filters.customerId = null
  filters.projectId = ''
  filters.viewMode = 'all'

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

.filter-select {
  width: 100%;
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

.filter-select:disabled {
  background: var(--color-background-mute);
  color: var(--color-text-disabled);
  cursor: not-allowed;
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

.filter-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 120px;
}

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

  .quick-actions {
    justify-content: center;
  }
}
</style>
