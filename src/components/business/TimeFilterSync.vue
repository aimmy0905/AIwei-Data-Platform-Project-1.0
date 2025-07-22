<template>
  <div class="time-filter-sync">
    <div class="time-filter-sync__header">
      <h4 class="time-filter-sync__title">时间筛选</h4>
      <div class="time-filter-sync__controls">
        <button 
          class="sync-btn"
          :class="{ 'sync-btn--active': isSyncEnabled }"
          @click="toggleSync"
        >
          <component :is="LinkIcon" :size="16" />
          同步所有模块
        </button>
        <button class="reset-btn" @click="resetToDefaults">
          重置
        </button>
      </div>
    </div>

    <div class="time-filter-sync__content">
      <!-- 全局时间选择器 -->
      <div class="global-filter">
        <h5 class="filter-section-title">全局时间设置</h5>
        <TimeRangePicker 
          v-model="globalTimeRange"
          @change="handleGlobalTimeChange"
        />
      </div>

      <!-- 模块独立设置 -->
      <div v-if="!isSyncEnabled" class="module-filters">
        <h5 class="filter-section-title">模块独立设置</h5>
        <div class="module-filter-list">
          <div 
            v-for="module in moduleFilters" 
            :key="module.moduleId"
            class="module-filter-item"
          >
            <div class="module-filter-header">
              <div class="module-info">
                <component :is="getModuleIcon(module.moduleId)" :size="16" />
                <span class="module-name">{{ getModuleName(module.moduleId) }}</span>
              </div>
              <button 
                class="module-sync-btn"
                @click="syncModuleToGlobal(module.moduleId)"
              >
                同步全局
              </button>
            </div>
            <div class="module-filter-picker">
              <TimeRangePicker 
                :model-value="module.timeRange"
                @change="(timeRange) => handleModuleTimeChange(module.moduleId, timeRange)"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- 同步状态预览 -->
      <div v-if="isSyncEnabled" class="sync-preview">
        <h5 class="filter-section-title">应用范围</h5>
        <div class="sync-modules">
          <div 
            v-for="module in moduleFilters" 
            :key="module.moduleId"
            class="sync-module-item"
          >
            <component :is="getModuleIcon(module.moduleId)" :size="16" />
            <span class="sync-module-name">{{ getModuleName(module.moduleId) }}</span>
            <div class="sync-status">
              <component :is="CheckIcon" :size="14" />
            </div>
          </div>
        </div>
      </div>

      <!-- 当前选择摘要 -->
      <div class="time-summary">
        <h5 class="filter-section-title">当前选择</h5>
        <div class="summary-content">
          <div class="summary-item">
            <span class="summary-label">时间范围:</span>
            <span class="summary-value">{{ formatTimeRange(globalTimeRange) }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">同步状态:</span>
            <span class="summary-value" :class="isSyncEnabled ? 'sync-enabled' : 'sync-disabled'">
              {{ isSyncEnabled ? '已启用' : '已禁用' }}
            </span>
          </div>
          <div class="summary-item">
            <span class="summary-label">应用模块:</span>
            <span class="summary-value">{{ activeModulesCount }}个模块</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Link, Check, Target, DollarSign, Users, TrendingUp, FileText, RefreshCw } from 'lucide-vue-next'
import TimeRangePicker from './TimeRangePicker.vue'
import type { TimeRange, ModuleTimeFilter } from '@/types'

interface Props {
  modules: string[]
  defaultTimeRange?: TimeRange
}

const props = withDefaults(defineProps<Props>(), {
  modules: () => ['overview', 'target', 'service-fee', 'sales', 'profit', 'renewal'],
  defaultTimeRange: () => ({
    type: 'quick',
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    period: 'monthly',
    label: '本月'
  })
})

const emit = defineEmits<{
  'time-change': [filters: ModuleTimeFilter[]]
  'sync-change': [isSynced: boolean]
}>()

// Icons
const LinkIcon = Link
const CheckIcon = Check

// State
const isSyncEnabled = ref(true)
const globalTimeRange = ref<TimeRange>({ ...props.defaultTimeRange })

const moduleFilters = ref<ModuleTimeFilter[]>(
  props.modules.map(moduleId => ({
    moduleId,
    timeRange: { ...props.defaultTimeRange },
    isSynced: true
  }))
)

// Computed
const activeModulesCount = computed(() => {
  return isSyncEnabled.value ? moduleFilters.value.length : moduleFilters.value.filter(m => !m.isSynced).length
})

// Methods
const getModuleName = (moduleId: string): string => {
  const nameMap: Record<string, string> = {
    overview: '团队概览',
    target: '目标完成',
    'service-fee': '服务费分布',
    sales: '销售完成',
    profit: '客户毛利',
    renewal: '续费客户'
  }
  return nameMap[moduleId] || moduleId
}

const getModuleIcon = (moduleId: string) => {
  const iconMap: Record<string, any> = {
    overview: Users,
    target: Target,
    'service-fee': DollarSign,
    sales: TrendingUp,
    profit: FileText,
    renewal: RefreshCw
  }
  return iconMap[moduleId] || Target
}

const formatTimeRange = (timeRange: TimeRange): string => {
  if (timeRange.type === 'quick') {
    return timeRange.label
  } else if (timeRange.type === 'custom') {
    return `${timeRange.startDate} ~ ${timeRange.endDate}`
  } else {
    return `${timeRange.label} (${timeRange.period})`
  }
}

const toggleSync = () => {
  isSyncEnabled.value = !isSyncEnabled.value
  
  if (isSyncEnabled.value) {
    // 启用同步时，将所有模块设置为全局时间
    moduleFilters.value.forEach(filter => {
      filter.timeRange = { ...globalTimeRange.value }
      filter.isSynced = true
    })
  } else {
    // 禁用同步时，保持当前设置但标记为非同步
    moduleFilters.value.forEach(filter => {
      filter.isSynced = false
    })
  }
  
  emit('sync-change', isSyncEnabled.value)
  emit('time-change', moduleFilters.value)
}

const handleGlobalTimeChange = (timeRange: TimeRange) => {
  globalTimeRange.value = timeRange
  
  if (isSyncEnabled.value) {
    // 同步模式下，更新所有模块
    moduleFilters.value.forEach(filter => {
      filter.timeRange = { ...timeRange }
    })
  }
  
  emit('time-change', moduleFilters.value)
}

const handleModuleTimeChange = (moduleId: string, timeRange: TimeRange) => {
  const filter = moduleFilters.value.find(f => f.moduleId === moduleId)
  if (filter) {
    filter.timeRange = timeRange
    filter.isSynced = false
  }
  
  emit('time-change', moduleFilters.value)
}

const syncModuleToGlobal = (moduleId: string) => {
  const filter = moduleFilters.value.find(f => f.moduleId === moduleId)
  if (filter) {
    filter.timeRange = { ...globalTimeRange.value }
    filter.isSynced = true
  }
  
  emit('time-change', moduleFilters.value)
}

const resetToDefaults = () => {
  globalTimeRange.value = { ...props.defaultTimeRange }
  moduleFilters.value.forEach(filter => {
    filter.timeRange = { ...props.defaultTimeRange }
    filter.isSynced = true
  })
  isSyncEnabled.value = true
  
  emit('sync-change', true)
  emit('time-change', moduleFilters.value)
}

// Watch for prop changes
watch(() => props.modules, (newModules) => {
  moduleFilters.value = newModules.map(moduleId => {
    const existing = moduleFilters.value.find(f => f.moduleId === moduleId)
    return existing || {
      moduleId,
      timeRange: { ...globalTimeRange.value },
      isSynced: isSyncEnabled.value
    }
  })
}, { immediate: true })
</script>

<style scoped>
.time-filter-sync {
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 24px;
}

.time-filter-sync__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.time-filter-sync__title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #262626;
}

.time-filter-sync__controls {
  display: flex;
  gap: 8px;
}

.sync-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  color: #595959;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}

.sync-btn:hover {
  border-color: #40a9ff;
  color: #40a9ff;
}

.sync-btn--active {
  background: #e6f7ff;
  border-color: #1890ff;
  color: #1890ff;
}

.reset-btn {
  padding: 6px 12px;
  background: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  color: #595959;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}

.reset-btn:hover {
  border-color: #ff4d4f;
  color: #ff4d4f;
}

.time-filter-sync__content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.filter-section-title {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: #262626;
}

.global-filter {
  padding: 16px;
  background: #fafafa;
  border-radius: 6px;
}

.module-filters {
  padding: 16px;
  background: #fafafa;
  border-radius: 6px;
}

.module-filter-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.module-filter-item {
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  padding: 16px;
}

.module-filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.module-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.module-name {
  font-size: 14px;
  font-weight: 600;
  color: #262626;
}

.module-sync-btn {
  padding: 4px 8px;
  background: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  color: #595959;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.module-sync-btn:hover {
  border-color: #40a9ff;
  color: #40a9ff;
}

.sync-preview {
  padding: 16px;
  background: #f6ffed;
  border: 1px solid #b7eb8f;
  border-radius: 6px;
}

.sync-modules {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sync-module-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #fff;
  border-radius: 4px;
}

.sync-module-name {
  flex: 1;
  font-size: 13px;
  color: #262626;
}

.sync-status {
  color: #52c41a;
}

.time-summary {
  padding: 16px;
  background: #fff7e6;
  border: 1px solid #ffd591;
  border-radius: 6px;
}

.summary-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary-label {
  font-size: 13px;
  color: #8c8c8c;
}

.summary-value {
  font-size: 13px;
  font-weight: 600;
  color: #262626;
}

.summary-value.sync-enabled {
  color: #52c41a;
}

.summary-value.sync-disabled {
  color: #faad14;
}

@media (max-width: 768px) {
  .time-filter-sync {
    padding: 16px;
  }

  .time-filter-sync__header {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }

  .time-filter-sync__controls {
    justify-content: center;
  }

  .module-filter-header {
    flex-direction: column;
    gap: 8px;
    align-items: stretch;
  }

  .summary-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
  }
}
</style>