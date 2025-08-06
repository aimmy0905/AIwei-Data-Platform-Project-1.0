<template>
  <div class="time-range-picker">
    <!-- 周期类型选择 -->
    <div class="time-range-picker__period-types">
      <button
        v-for="period in periodTypes"
        :key="period.value"
        class="time-range-picker__period-btn"
        :class="{ 'time-range-picker__period-btn--active': selectedPeriodType === period.value }"
        @click="selectPeriodType(period.value)"
      >
        {{ period.label }}
      </button>
    </div>

    <!-- 时间选择器 -->
    <div class="time-range-picker__selector" :key="`${selectedPeriodType}-${selectedYear}-${selectedQuarter}-${selectedMonth}`">
      <!-- 年度选择器 -->
      <template v-if="selectedPeriodType === 'yearly'">
        <button class="time-range-picker__nav-btn" @click="previousYear" :disabled="!canGoPreviousYear">
          <ChevronLeft :size="16" />
        </button>
        <button class="time-range-picker__display time-range-picker__display--clickable" @click="resetToCurrentYear">{{ selectedYear }}年</button>
        <button class="time-range-picker__nav-btn" @click="nextYear" :disabled="!canGoNextYear">
          <ChevronRight :size="16" />
        </button>
      </template>

      <!-- 季度选择器 -->
      <template v-else-if="selectedPeriodType === 'quarterly'">
        <button class="time-range-picker__nav-btn" @click="previousQuarter" :disabled="!canGoPreviousQuarter">
          <ChevronLeft :size="16" />
        </button>
        <button class="time-range-picker__display time-range-picker__display--clickable" @click="resetToCurrentQuarter">{{ selectedYear }}年Q{{ selectedQuarter }}</button>
        <button class="time-range-picker__nav-btn" @click="nextQuarter" :disabled="!canGoNextQuarter">
          <ChevronRight :size="16" />
        </button>
      </template>

      <!-- 月度选择器 -->
      <template v-else>
        <button class="time-range-picker__nav-btn" @click="previousMonth" :disabled="!canGoPreviousMonth">
          <ChevronLeft :size="16" />
        </button>
        <button class="time-range-picker__display time-range-picker__display--clickable" @click="resetToCurrentMonth">{{ selectedYear }}年{{ selectedMonth }}月</button>
        <button class="time-range-picker__nav-btn" @click="nextMonth" :disabled="!canGoNextMonth">
          <ChevronRight :size="16" />
        </button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import type { TimeRange } from '@/types'

// Props
const props = withDefaults(defineProps<{
  modelValue?: TimeRange
  defaultPeriod?: 'yearly' | 'quarterly' | 'monthly'
}>(), {
  defaultPeriod: 'quarterly'
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: TimeRange]
  'change': [value: TimeRange]
}>()

// 状态
const selectedPeriodType = ref(props.defaultPeriod)
const selectedYear = ref(new Date().getFullYear())
const selectedQuarter = ref(Math.ceil((new Date().getMonth() + 1) / 3))
const selectedMonth = ref(new Date().getMonth() + 1)

// 配置
const periodTypes = [
  { value: 'yearly' as const, label: '年' },
  { value: 'quarterly' as const, label: '季' },
  { value: 'monthly' as const, label: '月' }
]

// 计算属性
const canGoPreviousYear = computed(() => selectedYear.value > 2020)
const canGoNextYear = computed(() => selectedYear.value < new Date().getFullYear() + 1)

const canGoPreviousQuarter = computed(() => {
  if (selectedYear.value === 2020) return selectedQuarter.value > 1
  return selectedYear.value > 2020
})

const canGoNextQuarter = computed(() => {
  const currentYear = new Date().getFullYear()
  const currentQuarter = Math.ceil((new Date().getMonth() + 1) / 3)
  if (selectedYear.value === currentYear) return selectedQuarter.value < currentQuarter
  return selectedYear.value < currentYear
})

const canGoPreviousMonth = computed(() => {
  if (selectedYear.value === 2020) return selectedMonth.value > 1
  return selectedYear.value > 2020
})

const canGoNextMonth = computed(() => {
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth() + 1
  if (selectedYear.value === currentYear) return selectedMonth.value < currentMonth
  return selectedYear.value < currentYear
})

// 方法
const selectPeriodType = (type: 'yearly' | 'quarterly' | 'monthly') => {
  selectedPeriodType.value = type
  updateTimeRange()
}

const resetToCurrentYear = () => {
  selectedYear.value = new Date().getFullYear()
  updateTimeRange()
}

const resetToCurrentQuarter = () => {
  const now = new Date()
  selectedYear.value = now.getFullYear()
  selectedQuarter.value = Math.ceil((now.getMonth() + 1) / 3)
  updateTimeRange()
}

const resetToCurrentMonth = () => {
  const now = new Date()
  selectedYear.value = now.getFullYear()
  selectedMonth.value = now.getMonth() + 1
  updateTimeRange()
}

const previousYear = () => {
  if (canGoPreviousYear.value) {
    selectedYear.value--
    updateTimeRange()
  }
}

const nextYear = () => {
  if (canGoNextYear.value) {
    selectedYear.value++
    updateTimeRange()
  }
}

const previousQuarter = () => {
  if (canGoPreviousQuarter.value) {
    if (selectedQuarter.value === 1) {
      selectedQuarter.value = 4
      selectedYear.value--
    } else {
      selectedQuarter.value--
    }
    updateTimeRange()
  }
}

const nextQuarter = () => {
  if (canGoNextQuarter.value) {
    if (selectedQuarter.value === 4) {
      selectedQuarter.value = 1
      selectedYear.value++
    } else {
      selectedQuarter.value++
    }
    updateTimeRange()
  }
}

const previousMonth = () => {
  if (canGoPreviousMonth.value) {
    if (selectedMonth.value === 1) {
      selectedMonth.value = 12
      selectedYear.value--
    } else {
      selectedMonth.value--
    }
    updateTimeRange()
  }
}

const nextMonth = () => {
  if (canGoNextMonth.value) {
    if (selectedMonth.value === 12) {
      selectedMonth.value = 1
      selectedYear.value++
    } else {
      selectedMonth.value++
    }
    updateTimeRange()
  }
}

const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0]
}

const getPeriodDateRange = (): { start: Date; end: Date } => {
  if (selectedPeriodType.value === 'yearly') {
    const start = new Date(selectedYear.value, 0, 1)
    const end = new Date(selectedYear.value, 11, 31)
    return { start, end }
  } else if (selectedPeriodType.value === 'quarterly') {
    const startMonth = (selectedQuarter.value - 1) * 3
    const start = new Date(selectedYear.value, startMonth, 1)
    const end = new Date(selectedYear.value, startMonth + 3, 0)
    return { start, end }
  } else {
    const start = new Date(selectedYear.value, selectedMonth.value - 1, 1)
    const end = new Date(selectedYear.value, selectedMonth.value, 0)
    return { start, end }
  }
}

const updateTimeRange = (skipEmit = false) => {
  const { start, end } = getPeriodDateRange()

  let label = ''
  if (selectedPeriodType.value === 'yearly') {
    label = `${selectedYear.value}年`
  } else if (selectedPeriodType.value === 'quarterly') {
    label = `${selectedYear.value}年Q${selectedQuarter.value}`
  } else {
    label = `${selectedYear.value}年${selectedMonth.value}月`
  }

  const timeRange: TimeRange = {
    type: 'period',
    startDate: formatDate(start),
    endDate: formatDate(end),
    period: selectedPeriodType.value,
    label: label
  }

  emit('update:modelValue', timeRange)

  if (!skipEmit) {
    emit('change', timeRange)
  }
}

// 键盘快捷键支持
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    if (selectedPeriodType.value === 'yearly') previousYear()
    else if (selectedPeriodType.value === 'quarterly') previousQuarter()
    else previousMonth()
  } else if (event.key === 'ArrowRight') {
    event.preventDefault()
    if (selectedPeriodType.value === 'yearly') nextYear()
    else if (selectedPeriodType.value === 'quarterly') nextQuarter()
    else nextMonth()
  } else if (event.key === 'Home') {
    event.preventDefault()
    if (selectedPeriodType.value === 'yearly') resetToCurrentYear()
    else if (selectedPeriodType.value === 'quarterly') resetToCurrentQuarter()
    else resetToCurrentMonth()
  }
}

// 初始化
onMounted(() => {
  updateTimeRange(true)
  document.addEventListener('keydown', handleKeydown)
})

// 清理
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.time-range-picker {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  font-size: 14px;
}

.time-range-picker__period-types {
  display: flex;
  gap: 4px;
}

.time-range-picker__period-btn {
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  background: #f5f5f5;
  color: #595959;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 13px;
}

.time-range-picker__period-btn:hover {
  background: #e6f7ff;
  color: #1890ff;
}

.time-range-picker__period-btn--active {
  background: #1890ff;
  color: #fff;
}

.time-range-picker__selector {
  display: flex;
  align-items: center;
  gap: 8px;
}

.time-range-picker__year-selector,
.time-range-picker__quarter-selector,
.time-range-picker__month-selector {
  display: flex;
  align-items: center;
  gap: 8px;
}

.time-range-picker__nav-btn {
  width: 24px;
  height: 24px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background: #fff;
  color: #595959;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.time-range-picker__nav-btn:hover:not(:disabled) {
  border-color: #1890ff;
  color: #1890ff;
}

.time-range-picker__nav-btn:disabled {
  color: #d9d9d9;
  cursor: not-allowed;
  border-color: #f0f0f0;
}

.time-range-picker__display {
  font-size: 14px;
  font-weight: 500;
  color: #262626;
  min-width: 80px;
  text-align: center;
}

.time-range-picker__display--clickable {
  border: none;
  background: none;
  cursor: pointer;
  transition: all 0.2s;
  padding: 4px 8px;
  border-radius: 4px;
}

.time-range-picker__display--clickable:hover {
  background: #e6f7ff;
  color: #1890ff;
}

@media (max-width: 768px) {
  .time-range-picker {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }

  .time-range-picker__period-types {
    justify-content: center;
  }

  .time-range-picker__selector {
    justify-content: center;
  }
}
</style>
