<template>
  <div class="time-range-picker">
    <div class="time-range-picker__tabs">
      <button
        v-for="tab in tabs"
        :key="tab.type"
        class="time-range-picker__tab"
        :class="{ 'time-range-picker__tab--active': selectedTab === tab.type }"
        @click="selectTab(tab.type)"
      >
        {{ tab.label }}
      </button>
    </div>

    <div class="time-range-picker__content">
      <!-- 快捷选择 -->
      <div v-if="selectedTab === 'quick'" class="time-range-picker__quick">
        <div class="time-range-picker__quick-buttons">
          <button
            v-for="option in quickOptions"
            :key="option.value"
            class="time-range-picker__quick-btn"
            :class="{ 'time-range-picker__quick-btn--active': selectedQuick === option.value }"
            @click="selectQuickOption(option.value)"
          >
            {{ option.label }}
          </button>
        </div>
      </div>

      <!-- 自定义范围 -->
      <div v-if="selectedTab === 'custom'" class="time-range-picker__custom">
        <div class="time-range-picker__date-inputs">
          <div class="time-range-picker__date-group">
            <label class="time-range-picker__label">开始日期</label>
            <input
              v-model="customStartDate"
              type="date"
              class="time-range-picker__date-input"
              @change="updateCustomRange"
            />
          </div>
          <div class="time-range-picker__date-separator">至</div>
          <div class="time-range-picker__date-group">
            <label class="time-range-picker__label">结束日期</label>
            <input
              v-model="customEndDate"
              type="date"
              class="time-range-picker__date-input"
              @change="updateCustomRange"
            />
          </div>
        </div>
      </div>

      <!-- 周期选择 -->
      <div v-if="selectedTab === 'period'" class="time-range-picker__period">
        <div class="time-range-picker__period-type">
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

        <!-- 年度选择器 -->
        <div v-if="selectedPeriodType === 'yearly'" class="time-range-picker__year-selector">
          <button class="time-range-picker__nav-btn" @click="previousYear" :disabled="!canGoPreviousYear">
            <ChevronLeft :size="16" />
          </button>
          <div class="time-range-picker__year-display">{{ selectedYear }}年</div>
          <button class="time-range-picker__nav-btn" @click="nextYear" :disabled="!canGoNextYear">
            <ChevronRight :size="16" />
          </button>
        </div>

        <!-- 季度选择器 -->
        <div v-if="selectedPeriodType === 'quarterly'" class="time-range-picker__quarter-selector">
          <button class="time-range-picker__nav-btn" @click="previousQuarter" :disabled="!canGoPreviousQuarter">
            <ChevronLeft :size="16" />
          </button>
          <div class="time-range-picker__quarter-display">{{ selectedYear }}年Q{{ selectedQuarter }}</div>
          <button class="time-range-picker__nav-btn" @click="nextQuarter" :disabled="!canGoNextQuarter">
            <ChevronRight :size="16" />
          </button>
        </div>

        <!-- 月度选择器 -->
        <div v-if="selectedPeriodType === 'monthly'" class="time-range-picker__month-selector">
          <button class="time-range-picker__nav-btn" @click="previousMonth" :disabled="!canGoPreviousMonth">
            <ChevronLeft :size="16" />
          </button>
          <div class="time-range-picker__month-display">{{ selectedYear }}年{{ selectedMonth }}月</div>
          <button class="time-range-picker__nav-btn" @click="nextMonth" :disabled="!canGoNextMonth">
            <ChevronRight :size="16" />
          </button>
        </div>
      </div>
    </div>

    <!-- 当前选择显示 -->
    <div class="time-range-picker__current">
      <Calendar :size="16" class="time-range-picker__current-icon" />
      <span class="time-range-picker__current-text">{{ currentDisplayText }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-vue-next'
import type { TimeRange } from '@/types'

// Props
const props = withDefaults(defineProps<{
  modelValue?: TimeRange
  defaultType?: 'quick' | 'custom' | 'period'
  defaultPeriod?: 'yearly' | 'quarterly' | 'monthly'
}>(), {
  defaultType: 'quick',
  defaultPeriod: 'quarterly'
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: TimeRange]
  'change': [value: TimeRange]
}>()

// 状态
const selectedTab = ref(props.defaultType)
const selectedQuick = ref('current_quarter')
const selectedPeriodType = ref(props.defaultPeriod)
const selectedYear = ref(new Date().getFullYear())
const selectedQuarter = ref(Math.ceil((new Date().getMonth() + 1) / 3))
const selectedMonth = ref(new Date().getMonth() + 1)
const customStartDate = ref('')
const customEndDate = ref('')

// 配置
const tabs = [
  { type: 'quick' as const, label: '快捷选择' },
  { type: 'custom' as const, label: '自定义' },
  { type: 'period' as const, label: '周期' }
]

const quickOptions = [
  { value: 'today', label: '今日' },
  { value: 'yesterday', label: '昨日' },
  { value: 'current_week', label: '本周' },
  { value: 'last_week', label: '上周' },
  { value: 'current_month', label: '本月' },
  { value: 'last_month', label: '上月' },
  { value: 'current_quarter', label: '本季度' },
  { value: 'last_quarter', label: '上季度' },
  { value: 'current_year', label: '本年度' },
  { value: 'last_year', label: '去年' }
]

const periodTypes = [
  { value: 'yearly' as const, label: '年度' },
  { value: 'quarterly' as const, label: '季度' },
  { value: 'monthly' as const, label: '月度' }
]

// 计算属性
const currentDisplayText = computed(() => {
  if (selectedTab.value === 'quick') {
    const option = quickOptions.find(opt => opt.value === selectedQuick.value)
    return option?.label || ''
  } else if (selectedTab.value === 'custom') {
    if (customStartDate.value && customEndDate.value) {
      return `${customStartDate.value} 至 ${customEndDate.value}`
    }
    return '请选择日期范围'
  } else {
    if (selectedPeriodType.value === 'yearly') {
      return `${selectedYear.value}年`
    } else if (selectedPeriodType.value === 'quarterly') {
      return `${selectedYear.value}年Q${selectedQuarter.value}`
    } else {
      return `${selectedYear.value}年${selectedMonth.value}月`
    }
  }
})

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
const selectTab = (tab: 'quick' | 'custom' | 'period') => {
  selectedTab.value = tab
  updateTimeRange()
}

const selectQuickOption = (option: string) => {
  selectedQuick.value = option
  updateTimeRange()
}

const selectPeriodType = (type: 'yearly' | 'quarterly' | 'monthly') => {
  selectedPeriodType.value = type
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

const updateCustomRange = () => {
  if (customStartDate.value && customEndDate.value) {
    updateTimeRange()
  }
}

const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0]
}

const getQuickDateRange = (option: string): { start: Date; end: Date } => {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  switch (option) {
    case 'today':
      return { start: today, end: today }

    case 'yesterday':
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      return { start: yesterday, end: yesterday }

    case 'current_week':
      const weekStart = new Date(today)
      weekStart.setDate(today.getDate() - today.getDay())
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 6)
      return { start: weekStart, end: weekEnd }

    case 'last_week':
      const lastWeekEnd = new Date(today)
      lastWeekEnd.setDate(today.getDate() - today.getDay() - 1)
      const lastWeekStart = new Date(lastWeekEnd)
      lastWeekStart.setDate(lastWeekEnd.getDate() - 6)
      return { start: lastWeekStart, end: lastWeekEnd }

    case 'current_month':
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      return { start: monthStart, end: monthEnd }

    case 'last_month':
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)
      return { start: lastMonthStart, end: lastMonthEnd }

    case 'current_quarter':
      const quarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1)
      const quarterEnd = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3 + 3, 0)
      return { start: quarterStart, end: quarterEnd }

    case 'last_quarter':
      const lastQuarterStartMonth = Math.floor(now.getMonth() / 3) * 3 - 3
      const lastQuarterYear = lastQuarterStartMonth < 0 ? now.getFullYear() - 1 : now.getFullYear()
      const adjustedMonth = lastQuarterStartMonth < 0 ? lastQuarterStartMonth + 12 : lastQuarterStartMonth
      const lastQuarterStart = new Date(lastQuarterYear, adjustedMonth, 1)
      const lastQuarterEnd = new Date(lastQuarterYear, adjustedMonth + 3, 0)
      return { start: lastQuarterStart, end: lastQuarterEnd }

    case 'current_year':
      const yearStart = new Date(now.getFullYear(), 0, 1)
      const yearEnd = new Date(now.getFullYear(), 11, 31)
      return { start: yearStart, end: yearEnd }

    case 'last_year':
      const lastYearStart = new Date(now.getFullYear() - 1, 0, 1)
      const lastYearEnd = new Date(now.getFullYear() - 1, 11, 31)
      return { start: lastYearStart, end: lastYearEnd }

    default:
      return { start: today, end: today }
  }
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
  let timeRange: TimeRange

  if (selectedTab.value === 'quick') {
    const { start, end } = getQuickDateRange(selectedQuick.value)
    const option = quickOptions.find(opt => opt.value === selectedQuick.value)
    timeRange = {
      type: 'quick',
      startDate: formatDate(start),
      endDate: formatDate(end),
      period: 'quarterly', // 默认值
      label: option?.label || ''
    }
  } else if (selectedTab.value === 'custom') {
    timeRange = {
      type: 'custom',
      startDate: customStartDate.value,
      endDate: customEndDate.value,
      period: 'quarterly', // 默认值
      label: `${customStartDate.value} 至 ${customEndDate.value}`
    }
  } else {
    const { start, end } = getPeriodDateRange()
    timeRange = {
      type: 'period',
      startDate: formatDate(start),
      endDate: formatDate(end),
      period: selectedPeriodType.value,
      label: currentDisplayText.value
    }
  }

  emit('update:modelValue', timeRange)

  // 在初始化时跳过 change 事件，避免死循环
  if (!skipEmit) {
    emit('change', timeRange)
  }
}

// 初始化
onMounted(() => {
  updateTimeRange(true) // 初始化时跳过 change 事件避免死循环
})

// 键盘快捷键
const handleKeydown = (event: KeyboardEvent) => {
  if (selectedTab.value === 'period') {
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
    }
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.time-range-picker {
  background: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  overflow: hidden;
}

.time-range-picker__tabs {
  display: flex;
  border-bottom: 1px solid #f0f0f0;
}

.time-range-picker__tab {
  flex: 1;
  padding: 8px 16px;
  border: none;
  background: #fafafa;
  color: #595959;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 13px;
}

.time-range-picker__tab:hover {
  background: #f5f5f5;
  color: #262626;
}

.time-range-picker__tab--active {
  background: #fff;
  color: #1890ff;
  font-weight: 500;
}

.time-range-picker__content {
  padding: 16px;
}

.time-range-picker__quick-buttons {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
}

.time-range-picker__quick-btn {
  padding: 6px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background: #fff;
  color: #595959;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 12px;
  text-align: center;
}

.time-range-picker__quick-btn:hover {
  border-color: #40a9ff;
  color: #40a9ff;
}

.time-range-picker__quick-btn--active {
  border-color: #1890ff;
  background: #1890ff;
  color: #fff;
}

.time-range-picker__date-inputs {
  display: flex;
  align-items: center;
  gap: 12px;
}

.time-range-picker__date-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.time-range-picker__label {
  font-size: 12px;
  color: #8c8c8c;
}

.time-range-picker__date-input {
  padding: 6px 8px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 13px;
}

.time-range-picker__date-separator {
  margin-top: 16px;
  color: #8c8c8c;
  font-size: 12px;
}

.time-range-picker__period-type {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.time-range-picker__period-btn {
  padding: 6px 16px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background: #fff;
  color: #595959;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 13px;
}

.time-range-picker__period-btn:hover {
  border-color: #40a9ff;
  color: #40a9ff;
}

.time-range-picker__period-btn--active {
  border-color: #1890ff;
  background: #1890ff;
  color: #fff;
}

.time-range-picker__year-selector,
.time-range-picker__quarter-selector,
.time-range-picker__month-selector {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.time-range-picker__nav-btn {
  width: 32px;
  height: 32px;
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
  border-color: #40a9ff;
  color: #40a9ff;
}

.time-range-picker__nav-btn:disabled {
  color: #d9d9d9;
  cursor: not-allowed;
  border-color: #f0f0f0;
}

.time-range-picker__year-display,
.time-range-picker__quarter-display,
.time-range-picker__month-display {
  font-size: 16px;
  font-weight: 500;
  color: #262626;
  min-width: 120px;
  text-align: center;
}

.time-range-picker__current {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #f5f5f5;
  border-top: 1px solid #f0f0f0;
}

.time-range-picker__current-icon {
  color: #1890ff;
}

.time-range-picker__current-text {
  font-size: 13px;
  color: #262626;
  font-weight: 500;
}
</style>
