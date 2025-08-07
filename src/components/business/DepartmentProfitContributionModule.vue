<template>
  <div class="department-profit-contribution-module">
    <div class="analysis-module__header">
      <h3 class="analysis-module__title">平台毛利贡献分析（部门）</h3>
      <div class="analysis-module__controls">
        <div class="time-controls">
              <button
            v-for="timeRange in timeRanges"
            :key="timeRange.key"
            class="time-btn"
            :class="{ 'time-btn--active': currentTimeRange === timeRange.key }"
            @click="handleTimeRangeChange(timeRange.key)"
          >
            {{ timeRange.label }}
              </button>
            </div>
        <div class="quarter-controls">
          <button class="quarter-nav-btn" @click="previousQuarter">
            <ChevronLeft :size="16" />
          </button>
          <button class="quarter-display">{{ currentQuarter }}</button>
          <button class="quarter-nav-btn" @click="nextQuarter" :disabled="isNextDisabled">
            <ChevronRight :size="16" />
          </button>
          </div>
        </div>
          </div>

    <div class="analysis-module__content">
      <!-- 统计概览卡片 -->
      <div class="statistics-overview">
        <div class="stat-card">
          <div class="stat-card__header">
            <div class="stat-icon">
              <TrendingUp :size="24" />
            </div>
            <span class="stat-label">年度平台毛利贡献总额</span>
                </div>
          <div class="stat-card__content">
            <div class="stat-value">{{ formatCurrency(yearlyProfitTotal) }}</div>
            <div class="stat-unit">万元</div>
        </div>
      </div>

        <div class="stat-card">
          <div class="stat-card__header">
            <div class="stat-icon">
              <BarChart3 :size="24" />
            </div>
            <span class="stat-label">季度平台毛利贡献总额</span>
            </div>
          <div class="stat-card__content">
            <div class="stat-value">{{ formatCurrency(quarterlyProfitTotal) }}</div>
            <div class="stat-unit">万元</div>
          </div>
        </div>
          </div>

      <!-- 部门毛利贡献数据列表 -->
      <div class="platform-table-container">
        <table class="platform-table">
          <thead>
            <tr>
              <th rowspan="2" class="time-header">年度</th>
              <th rowspan="2" class="time-header">部门</th>
              <th colspan="4" class="category-header profit-contribution">平台毛利贡献（万元）</th>
              <th colspan="4" class="category-header profit-percentage">毛利贡献占比（%）</th>
              <th colspan="4" class="category-header growth-rate">同比增长率（%）</th>
            </tr>
            <tr>
              <!-- 平台毛利贡献 -->
              <th class="sub-header profit-contribution">Google</th>
              <th class="sub-header profit-contribution">FB</th>
              <th class="sub-header profit-contribution">Criteo</th>
              <th class="sub-header profit-contribution">Bing</th>
              <!-- 毛利贡献占比 -->
              <th class="sub-header profit-percentage">Google</th>
              <th class="sub-header profit-percentage">FB</th>
              <th class="sub-header profit-percentage">Criteo</th>
              <th class="sub-header profit-percentage">Bing</th>
              <!-- 同比增长率 -->
              <th class="sub-header growth-rate">Google</th>
              <th class="sub-header growth-rate">FB</th>
              <th class="sub-header growth-rate">Criteo</th>
              <th class="sub-header growth-rate">Bing</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="deptData in departmentProfitData" :key="`${deptData.year}-${deptData.department}`" class="data-row">
              <td class="time-cell" v-if="deptData.isFirstOfYear" :rowspan="deptData.departmentCount">{{ deptData.year }}</td>
              <td class="time-cell">{{ deptData.department }}</td>

              <!-- 平台毛利贡献 -->
              <td class="data-cell profit-contribution">{{ formatCurrency(deptData.profitContribution.google) }}</td>
              <td class="data-cell profit-contribution">{{ formatCurrency(deptData.profitContribution.fb) }}</td>
              <td class="data-cell profit-contribution">{{ formatCurrency(deptData.profitContribution.criteo) }}</td>
              <td class="data-cell profit-contribution">{{ formatCurrency(deptData.profitContribution.bing) }}</td>

              <!-- 毛利贡献占比 -->
              <td class="data-cell profit-percentage">{{ formatPercentage(deptData.profitPercentage.google) }}%</td>
              <td class="data-cell profit-percentage">{{ formatPercentage(deptData.profitPercentage.fb) }}%</td>
              <td class="data-cell profit-percentage">{{ formatPercentage(deptData.profitPercentage.criteo) }}%</td>
              <td class="data-cell profit-percentage">{{ formatPercentage(deptData.profitPercentage.bing) }}%</td>

              <!-- 同比增长率 -->
              <td class="data-cell growth-rate" :class="getGrowthClass(deptData.growthRate.google)">
                {{ formatGrowthRate(deptData.growthRate.google) }}%
              </td>
              <td class="data-cell growth-rate" :class="getGrowthClass(deptData.growthRate.fb)">
                {{ formatGrowthRate(deptData.growthRate.fb) }}%
              </td>
              <td class="data-cell growth-rate" :class="getGrowthClass(deptData.growthRate.criteo)">
                {{ formatGrowthRate(deptData.growthRate.criteo) }}%
              </td>
              <td class="data-cell growth-rate" :class="getGrowthClass(deptData.growthRate.bing)">
                {{ formatGrowthRate(deptData.growthRate.bing) }}%
              </td>
            </tr>
          </tbody>
        </table>
              </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ChevronLeft, ChevronRight, TrendingUp, BarChart3 } from 'lucide-vue-next'

interface DepartmentProfitData {
  year: string
  department: string
  isFirstOfYear: boolean
  departmentCount: number
  profitContribution: {
    google: number
    fb: number
    criteo: number
    bing: number
  }
  profitPercentage: {
    google: number
    fb: number
    criteo: number
    bing: number
  }
  growthRate: {
    google: number
    fb: number
    criteo: number
    bing: number
  }
}

interface Props {
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<{
  'time-range-change': [timeRange: string]
  'quarter-change': [quarter: string]
}>()

const currentTimeRange = ref('quarter')
const currentQuarter = ref('2025年Q1')

const timeRanges = [
  { key: 'year', label: '年' },
  { key: 'quarter', label: '季' },
  { key: 'month', label: '月' }
]

const isNextDisabled = computed(() => {
  return currentQuarter.value.includes('Q4')
})

// 部门毛利贡献数据
const departmentProfitData = ref<DepartmentProfitData[]>([
  {
    year: '2025年',
    department: '运营',
    isFirstOfYear: true,
    departmentCount: 5,
    profitContribution: { google: 808.1, fb: 638.7, criteo: 395.5, bing: 264.2 },
    profitPercentage: { google: 38.3, fb: 30.3, criteo: 18.8, bing: 12.5 },
    growthRate: { google: 16.2, fb: 13.4, criteo: 9.3, bing: 6.3 }
  },
  {
    year: '2025年',
    department: '运营一部',
    isFirstOfYear: false,
    departmentCount: 1,
    profitContribution: { google: 185.6, fb: 142.8, criteo: 89.3, bing: 57.8 },
    profitPercentage: { google: 39.1, fb: 30.1, criteo: 18.8, bing: 12.2 },
    growthRate: { google: 15.2, fb: 12.8, criteo: 8.9, bing: 6.3 }
  },
  {
    year: '2025年',
    department: '运营二部',
    isFirstOfYear: false,
    departmentCount: 1,
    profitContribution: { google: 198.5, fb: 155.2, criteo: 95.1, bing: 62.8 },
    profitPercentage: { google: 38.6, fb: 30.4, criteo: 18.6, bing: 12.3 },
    growthRate: { google: 18.5, fb: 15.2, criteo: 11.3, bing: 8.7 }
  },
  {
    year: '2025年',
    department: '运营三部',
    isFirstOfYear: false,
    departmentCount: 1,
    profitContribution: { google: 205.2, fb: 165.8, criteo: 102.9, bing: 68.5 },
    profitPercentage: { google: 37.9, fb: 30.6, criteo: 19.0, bing: 12.7 },
    growthRate: { google: 16.8, fb: 13.9, criteo: 9.2, bing: 5.8 }
  },
  {
    year: '2025年',
    department: '运营四部',
    isFirstOfYear: false,
    departmentCount: 1,
    profitContribution: { google: 218.8, fb: 174.9, criteo: 108.2, bing: 75.1 },
    profitPercentage: { google: 37.6, fb: 30.1, criteo: 18.6, bing: 12.9 },
    growthRate: { google: 14.2, fb: 11.5, criteo: 7.8, bing: 4.2 }
  }
])

// 计算统计数据
const yearlyProfitTotal = computed(() => {
  const totalRow = departmentProfitData.value.find(item => item.department === '运营')
  if (!totalRow) return 0
  return totalRow.profitContribution.google +
         totalRow.profitContribution.fb +
         totalRow.profitContribution.criteo +
         totalRow.profitContribution.bing
})

const quarterlyProfitTotal = computed(() => {
  // 当前季度总额 (这里用Q1的数据作为示例)
  const q1Row = departmentProfitData.value.find(item => item.department === '运营一部')
  if (!q1Row) return 0
  return q1Row.profitContribution.google +
         q1Row.profitContribution.fb +
         q1Row.profitContribution.criteo +
         q1Row.profitContribution.bing
})

// 事件处理
const handleTimeRangeChange = (timeRange: string) => {
  currentTimeRange.value = timeRange
  emit('time-range-change', timeRange)
}

const previousQuarter = () => {
  emit('quarter-change', 'previous')
}

const nextQuarter = () => {
  if (!isNextDisabled.value) {
    emit('quarter-change', 'next')
  }
}

// 工具函数
const formatCurrency = (amount: number) => {
  return amount.toFixed(1)
}

const formatPercentage = (percentage: number) => {
  return percentage.toFixed(1)
}

const formatGrowthRate = (rate: number) => {
  return rate >= 0 ? `+${rate.toFixed(1)}` : rate.toFixed(1)
}

const getGrowthClass = (rate: number) => {
  if (rate > 0) return 'positive-growth'
  if (rate < 0) return 'negative-growth'
  return 'neutral-growth'
}
</script>

<style scoped>
.department-profit-contribution-module {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-bottom: 24px;
}

.analysis-module__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.analysis-module__title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #262626;
}

.analysis-module__controls {
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
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
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
  padding: 6px 12px;
  border: 1px solid #d9d9d9;
  background: #fafafa;
  color: #262626;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  min-width: 100px;
  text-align: center;
}

.analysis-module__content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* 统计概览样式 */
.statistics-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #e8e8e8;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-card__header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: #1890ff;
  color: #fff;
  border-radius: 6px;
}

.stat-label {
  font-size: 14px;
  color: #595959;
  font-weight: 500;
}

.stat-card__content {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #262626;
}

.stat-unit {
  font-size: 14px;
  color: #8c8c8c;
}

/* 表格样式 */
.platform-table-container {
  overflow-x: auto;
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
}

.platform-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  min-width: 1400px;
}

.platform-table th {
  background: #fafafa;
  border: 1px solid #f0f0f0;
  padding: 12px 8px;
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: #595959;
  white-space: nowrap;
}

.platform-table td {
  border: 1px solid #f0f0f0;
  padding: 12px 8px;
  text-align: center;
  font-size: 13px;
  vertical-align: middle;
  color: #595959;
}

.time-header {
  background: #f0f2f5 !important;
  color: #262626 !important;
  font-weight: 600;
  position: sticky;
  left: 0;
  z-index: 3;
  min-width: 80px;
  text-align: center;
  vertical-align: middle;
}

.category-header.profit-contribution {
  background: #fff7e6 !important;
  color: #fa8c16 !important;
  font-weight: 600;
  font-size: 12px;
  text-align: center;
}

.category-header.profit-percentage {
  background: #f6ffed !important;
  color: #52c41a !important;
  font-weight: 600;
  font-size: 12px;
  text-align: center;
}

.category-header.growth-rate {
  background: #f0f5ff !important;
  color: #2f54eb !important;
  font-weight: 600;
  font-size: 12px;
  text-align: center;
}

.sub-header.profit-contribution {
  background: #fff7e6 !important;
  color: #fa8c16 !important;
  font-weight: 600;
  font-size: 12px;
  white-space: nowrap;
}

.sub-header.profit-percentage {
  background: #f6ffed !important;
  color: #52c41a !important;
  font-weight: 600;
  font-size: 12px;
  white-space: nowrap;
}

.sub-header.growth-rate {
  background: #f0f5ff !important;
  color: #2f54eb !important;
  font-weight: 600;
  font-size: 12px;
  white-space: nowrap;
}

.time-cell {
  background: #f0f2f5 !important;
  color: #262626 !important;
  font-weight: 600;
  position: sticky;
  left: 0;
  z-index: 2;
  text-align: center !important;
  min-width: 80px;
}

.data-cell.profit-contribution {
  background: #fffbf0 !important;
  color: #fa8c16 !important;
  font-weight: 500;
  text-align: center;
  min-width: 80px;
}

.data-cell.profit-percentage {
  background: #f6ffed !important;
  color: #52c41a !important;
  font-weight: 500;
  text-align: center;
  min-width: 80px;
}

.data-cell.growth-rate {
  background: #f0f5ff !important;
  color: #2f54eb !important;
  font-weight: 500;
  text-align: center;
  min-width: 80px;
}

.data-cell.growth-rate.positive-growth {
  color: #52c41a !important;
  font-weight: 600;
}

.data-cell.growth-rate.negative-growth {
  color: #ff4d4f !important;
  font-weight: 600;
}

.data-cell.growth-rate.neutral-growth {
  color: #8c8c8c !important;
}
</style>
