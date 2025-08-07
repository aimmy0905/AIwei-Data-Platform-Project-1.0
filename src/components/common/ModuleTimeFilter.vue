<template>
  <div class="time-filter-controls">
    <div class="time-controls">
      <button
        v-for="option in timeOptions"
        :key="option.value"
        :class="['time-btn', { 'time-btn--active': selectedTimeRange === option.value }]"
        @click="handleTimeRangeChange(option.value)"
      >
        {{ option.label }}
      </button>
    </div>
    <div class="quarter-controls">
      <button
        class="quarter-nav-btn"
        :disabled="isPrevDisabled"
        @click="handlePrevQuarter"
      >
        <ChevronLeft :size="16" />
      </button>
      <div class="quarter-display">{{ currentQuarter }}</div>
      <button
        class="quarter-nav-btn"
        :disabled="isNextDisabled"
        @click="handleNextQuarter"
      >
        <ChevronRight :size="16" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineEmits } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

// Props
const props = defineProps<{
  initialTimeRange?: string
  initialQuarter?: string
}>()

// Emits
const emits = defineEmits<{
  'time-range-change': [value: string]
  'quarter-change': [value: string]
}>()

// 响应式数据
const selectedTimeRange = ref(props.initialTimeRange || 'quarter')
const currentQuarter = ref(props.initialQuarter || '2025年Q1')

const timeOptions = [
  { label: '年', value: 'year' },
  { label: '季', value: 'quarter' },
  { label: '月', value: 'month' }
]

// 计算属性
const isPrevDisabled = computed(() => {
  return currentQuarter.value === '2025年Q1'
})

const isNextDisabled = computed(() => {
  return currentQuarter.value === '2025年Q4'
})

// 方法
const handleTimeRangeChange = (value: string) => {
  selectedTimeRange.value = value
  emits('time-range-change', value)
}

const handlePrevQuarter = () => {
  const quarters = ['2025年Q1', '2025年Q2', '2025年Q3', '2025年Q4']
  const currentIndex = quarters.indexOf(currentQuarter.value)
  if (currentIndex > 0) {
    currentQuarter.value = quarters[currentIndex - 1]
    emits('quarter-change', currentQuarter.value)
  }
}

const handleNextQuarter = () => {
  const quarters = ['2025年Q1', '2025年Q2', '2025年Q3', '2025年Q4']
  const currentIndex = quarters.indexOf(currentQuarter.value)
  if (currentIndex < quarters.length - 1) {
    currentQuarter.value = quarters[currentIndex + 1]
    emits('quarter-change', currentQuarter.value)
  }
}
</script>

<style scoped>
.time-filter-controls {
  display: flex;
  align-items: center;
  gap: 16px;
}

.time-controls {
  display: flex;
  gap: 8px;
}

.time-btn {
  padding: 6px 12px;
  border: 1px solid #d9d9d9;
  background: #fff;
  color: #595959;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.time-btn:hover {
  border-color: #40a9ff;
  color: #40a9ff;
}

.time-btn--active {
  background: #1890ff;
  border-color: #1890ff;
  color: #fff;
}

.quarter-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.quarter-nav-btn {
  padding: 4px;
  border: 1px solid #d9d9d9;
  background: #fff;
  color: #595959;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.quarter-nav-btn:hover:not(:disabled) {
  border-color: #40a9ff;
  color: #40a9ff;
}

.quarter-nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quarter-display {
  font-size: 14px;
  font-weight: 500;
  min-width: 80px;
  text-align: center;
  color: #262626;
}
</style>
