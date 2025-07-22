<template>
  <div class="quarter-selector">
    <div class="quarter-selector__header">
      <h4 class="quarter-selector__title">{{ title }}</h4>
      <div class="quarter-selector__nav">
        <button 
          class="quarter-selector__nav-btn" 
          @click="previousYear"
          :disabled="!canGoPrevious"
          title="上一年"
        >
          <ChevronLeft :size="16" />
        </button>
        <span class="quarter-selector__year">{{ currentYear }}年</span>
        <button 
          class="quarter-selector__nav-btn" 
          @click="nextYear"
          :disabled="!canGoNext"
          title="下一年"
        >
          <ChevronRight :size="16" />
        </button>
      </div>
    </div>

    <div class="quarter-selector__quarters">
      <div
        v-for="quarter in quarters"
        :key="quarter.quarter"
        class="quarter-selector__quarter"
        :class="{
          'quarter-selector__quarter--active': quarter.isActive,
          'quarter-selector__quarter--current': quarter.isCurrent,
          'quarter-selector__quarter--future': quarter.isFuture
        }"
        @click="selectQuarter(quarter)"
      >
        <div class="quarter-selector__quarter-label">
          {{ quarter.label }}
        </div>
        <div class="quarter-selector__quarter-period">
          {{ quarter.period }}
        </div>
        <div v-if="quarter.isCurrent" class="quarter-selector__quarter-badge">
          当前
        </div>
      </div>
    </div>

    <!-- 快速选择 -->
    <div v-if="showQuickSelect" class="quarter-selector__quick">
      <button
        v-for="option in quickOptions"
        :key="option.value"
        class="quarter-selector__quick-btn"
        :class="{ 'quarter-selector__quick-btn--active': isQuickOptionActive(option) }"
        @click="selectQuickOption(option)"
      >
        {{ option.label }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import type { Quarter } from '@/types'

// Props
const props = withDefaults(defineProps<{
  modelValue?: Quarter
  title?: string
  showQuickSelect?: boolean
  minYear?: number
  maxYear?: number
}>(), {
  title: '季度选择',
  showQuickSelect: true,
  minYear: 2020,
  maxYear: new Date().getFullYear() + 1
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: Quarter]
  'change': [value: Quarter]
}>()

// 状态
const currentYear = ref(new Date().getFullYear())
const selectedQuarter = ref<Quarter | null>(null)

// 计算属性
const quarters = computed(() => {
  const now = new Date()
  const currentQuarter = Math.ceil((now.getMonth() + 1) / 3)
  const isCurrentYear = currentYear.value === now.getFullYear()

  return [1, 2, 3, 4].map(q => {
    const quarter: Quarter = {
      year: currentYear.value,
      quarter: q,
      label: `Q${q}`,
      period: getQuarterPeriod(currentYear.value, q),
      isActive: selectedQuarter.value?.year === currentYear.value && selectedQuarter.value?.quarter === q,
      isCurrent: isCurrentYear && q === currentQuarter,
      isFuture: currentYear.value > now.getFullYear() || (isCurrentYear && q > currentQuarter)
    }
    return quarter
  })
})

const canGoPrevious = computed(() => currentYear.value > props.minYear)
const canGoNext = computed(() => currentYear.value < props.maxYear)

const quickOptions = computed(() => {
  const now = new Date()
  const currentQuarterNum = Math.ceil((now.getMonth() + 1) / 3)
  const currentYear = now.getFullYear()

  const options = [
    {
      value: 'current',
      label: '本季度',
      quarter: { year: currentYear, quarter: currentQuarterNum, label: `${currentYear}年Q${currentQuarterNum}`, isActive: false }
    }
  ]

  // 上季度
  let lastQuarter = currentQuarterNum - 1
  let lastQuarterYear = currentYear
  if (lastQuarter === 0) {
    lastQuarter = 4
    lastQuarterYear = currentYear - 1
  }
  
  if (lastQuarterYear >= props.minYear) {
    options.push({
      value: 'last',
      label: '上季度',
      quarter: { year: lastQuarterYear, quarter: lastQuarter, label: `${lastQuarterYear}年Q${lastQuarter}`, isActive: false }
    })
  }

  // 去年同期
  const lastYearSameQuarter = currentYear - 1
  if (lastYearSameQuarter >= props.minYear) {
    options.push({
      value: 'lastYearSame',
      label: '去年同期',
      quarter: { year: lastYearSameQuarter, quarter: currentQuarterNum, label: `${lastYearSameQuarter}年Q${currentQuarterNum}`, isActive: false }
    })
  }

  return options
})

// 方法
const getQuarterPeriod = (year: number, quarter: number): string => {
  const startMonth = (quarter - 1) * 3 + 1
  const endMonth = quarter * 3
  return `${startMonth}月-${endMonth}月`
}

const selectQuarter = (quarter: Quarter) => {
  if (quarter.isFuture) return
  
  selectedQuarter.value = quarter
  emitChange(quarter)
}

const previousYear = () => {
  if (canGoPrevious.value) {
    currentYear.value--
  }
}

const nextYear = () => {
  if (canGoNext.value) {
    currentYear.value++
  }
}

const selectQuickOption = (option: any) => {
  const quarter = option.quarter
  currentYear.value = quarter.year
  selectedQuarter.value = quarter
  emitChange(quarter)
}

const isQuickOptionActive = (option: any): boolean => {
  if (!selectedQuarter.value) return false
  const quarter = option.quarter
  return selectedQuarter.value.year === quarter.year && selectedQuarter.value.quarter === quarter.quarter
}

const emitChange = (quarter: Quarter) => {
  emit('update:modelValue', quarter)
  emit('change', quarter)
}

// 初始化
onMounted(() => {
  if (props.modelValue) {
    selectedQuarter.value = props.modelValue
    currentYear.value = props.modelValue.year
  } else {
    // 默认选择当前季度
    const now = new Date()
    const currentQuarterNum = Math.ceil((now.getMonth() + 1) / 3)
    const defaultQuarter: Quarter = {
      year: now.getFullYear(),
      quarter: currentQuarterNum,
      label: `${now.getFullYear()}年Q${currentQuarterNum}`,
      isActive: true
    }
    selectedQuarter.value = defaultQuarter
    currentYear.value = now.getFullYear()
    emitChange(defaultQuarter)
  }
})

// 监听外部变化
watch(() => props.modelValue, (newValue) => {
  if (newValue && selectedQuarter.value !== newValue) {
    selectedQuarter.value = newValue
    currentYear.value = newValue.year
  }
})
</script>

<style scoped>
.quarter-selector {
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 16px;
}

.quarter-selector__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.quarter-selector__title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #262626;
}

.quarter-selector__nav {
  display: flex;
  align-items: center;
  gap: 8px;
}

.quarter-selector__nav-btn {
  width: 28px;
  height: 28px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background: #fff;
  color: #595959;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.quarter-selector__nav-btn:hover:not(:disabled) {
  border-color: #40a9ff;
  color: #40a9ff;
}

.quarter-selector__nav-btn:disabled {
  color: #d9d9d9;
  cursor: not-allowed;
  border-color: #f0f0f0;
}

.quarter-selector__year {
  font-size: 14px;
  font-weight: 500;
  color: #262626;
  min-width: 60px;
  text-align: center;
}

.quarter-selector__quarters {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-bottom: 16px;
}

.quarter-selector__quarter {
  position: relative;
  padding: 12px 8px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
}

.quarter-selector__quarter:hover:not(.quarter-selector__quarter--future) {
  border-color: #40a9ff;
  background: #f6ffed;
}

.quarter-selector__quarter--active {
  border-color: #1890ff;
  background: #e6f7ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.quarter-selector__quarter--current {
  border-color: #52c41a;
  background: #f6ffed;
}

.quarter-selector__quarter--current.quarter-selector__quarter--active {
  border-color: #1890ff;
  background: #e6f7ff;
}

.quarter-selector__quarter--future {
  border-color: #f0f0f0;
  background: #fafafa;
  color: #bfbfbf;
  cursor: not-allowed;
}

.quarter-selector__quarter-label {
  font-size: 14px;
  font-weight: 600;
  color: #262626;
  margin-bottom: 2px;
}

.quarter-selector__quarter--future .quarter-selector__quarter-label {
  color: #bfbfbf;
}

.quarter-selector__quarter-period {
  font-size: 11px;
  color: #8c8c8c;
}

.quarter-selector__quarter--future .quarter-selector__quarter-period {
  color: #d9d9d9;
}

.quarter-selector__quarter-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #52c41a;
  color: #fff;
  font-size: 10px;
  padding: 1px 4px;
  border-radius: 6px;
  font-weight: 500;
}

.quarter-selector__quick {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.quarter-selector__quick-btn {
  padding: 4px 8px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background: #fff;
  color: #595959;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.quarter-selector__quick-btn:hover {
  border-color: #40a9ff;
  color: #40a9ff;
}

.quarter-selector__quick-btn--active {
  border-color: #1890ff;
  background: #1890ff;
  color: #fff;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .quarter-selector__quarters {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .quarter-selector__header {
    flex-direction: column;
    gap: 8px;
    align-items: stretch;
  }
  
  .quarter-selector__nav {
    justify-content: center;
  }
  
  .quarter-selector__quick {
    justify-content: center;
  }
}
</style>