<template>
  <div class="department-platform-analysis-module">
    <div class="analysis-module__header">
      <h3 class="analysis-module__title">平台新增及流失（部门）</h3>
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
              <Briefcase :size="24" />
            </div>
            <span class="stat-label">项目总数</span>
          </div>
          <div class="stat-card__content">
            <div class="stat-value">{{ formatNumber(platformStats.totalProjects) }}</div>
            <div class="stat-unit">个</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-card__header">
            <div class="stat-icon">
              <Percent :size="24" />
            </div>
            <span class="stat-label">项目返点总数</span>
          </div>
          <div class="stat-card__content">
            <div class="stat-value">{{ formatCurrency(platformStats.totalRebate) }}</div>
            <div class="stat-unit">¥</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-card__header">
            <div class="stat-icon">
              <DollarSign :size="24" />
            </div>
            <span class="stat-label">项目总服务费</span>
          </div>
          <div class="stat-card__content">
            <div class="stat-value">{{ formatCurrency(platformStats.totalServiceFee) }}</div>
            <div class="stat-unit">¥</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-card__header">
            <div class="stat-icon">
              <TrendingUp :size="24" />
            </div>
            <span class="stat-label">项目总毛利</span>
          </div>
          <div class="stat-card__content">
            <div class="stat-value">{{ formatCurrency(platformStats.totalProfit) }}</div>
            <div class="stat-unit">¥</div>
          </div>
        </div>
      </div>

      <!-- 平台数据列表 -->
      <div class="platform-table-container">
        <table class="platform-table">
          <thead>
            <tr>
              <th rowspan="2" class="time-header">年度</th>
              <th rowspan="2" class="time-header">员工</th>
              <th colspan="4" class="category-header all-platforms">所有平台项目数</th>
              <th colspan="4" class="category-header new-customers">2025年新签客户数（新客户）</th>
              <th colspan="4" class="category-header churned-customers">2025年流失客户数</th>
            </tr>
            <tr>
              <!-- 所有平台项目数 -->
              <th class="sub-header all-platforms">Google</th>
              <th class="sub-header all-platforms">FB</th>
              <th class="sub-header all-platforms">Criteo</th>
              <th class="sub-header all-platforms">Bing</th>
              <!-- 2025年新签客户数 -->
              <th class="sub-header new-customers">Google</th>
              <th class="sub-header new-customers">FB</th>
              <th class="sub-header new-customers">Criteo</th>
              <th class="sub-header new-customers">Bing</th>
              <!-- 2025年流失客户数 -->
              <th class="sub-header churned-customers">Google</th>
              <th class="sub-header churned-customers">FB</th>
              <th class="sub-header churned-customers">Criteo</th>
              <th class="sub-header churned-customers">Bing</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="deptData in departmentBasedData" :key="`${deptData.year}-${deptData.department}`" class="data-row">
              <td class="time-cell" v-if="deptData.isFirstOfYear" :rowspan="deptData.departmentCount">{{ deptData.year }}</td>
              <td class="time-cell">{{ deptData.department }}</td>

              <!-- 所有平台项目数 -->
              <td class="data-cell all-platforms">{{ deptData.allProjects.google || '' }}</td>
              <td class="data-cell all-platforms">{{ deptData.allProjects.fb || '' }}</td>
              <td class="data-cell all-platforms">{{ deptData.allProjects.criteo || '' }}</td>
              <td class="data-cell all-platforms">{{ deptData.allProjects.bing || '' }}</td>

              <!-- 2025年新签客户数 -->
              <td class="data-cell new-customers">{{ deptData.newCustomers.google || '' }}</td>
              <td class="data-cell new-customers">{{ deptData.newCustomers.fb || '' }}</td>
              <td class="data-cell new-customers">{{ deptData.newCustomers.criteo || '' }}</td>
              <td class="data-cell new-customers">{{ deptData.newCustomers.bing || '' }}</td>

              <!-- 2025年流失客户数 -->
              <td class="data-cell churned-customers">{{ deptData.churnedCustomers.google || '' }}</td>
              <td class="data-cell churned-customers">{{ deptData.churnedCustomers.fb || '' }}</td>
              <td class="data-cell churned-customers">{{ deptData.churnedCustomers.criteo || '' }}</td>
              <td class="data-cell churned-customers">{{ deptData.churnedCustomers.bing || '' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ChevronLeft, ChevronRight, Briefcase, Percent, DollarSign, TrendingUp } from 'lucide-vue-next'

interface DepartmentBasedData {
  year: string
  department: string
  isFirstOfYear: boolean
  departmentCount: number
  allProjects: {
    google: number
    fb: number
    criteo: number
    bing: number
  }
  newCustomers: {
    google: number
    fb: number
    criteo: number
    bing: number
  }
  churnedCustomers: {
    google: number
    fb: number
    criteo: number
    bing: number
  }
}

interface PlatformStats {
  totalProjects: number
  totalRebate: number
  totalServiceFee: number
  totalProfit: number
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

// 部门维度的平台数据
const departmentBasedData = ref<DepartmentBasedData[]>([
  {
    year: '2025年',
    department: '合计',
    isFirstOfYear: true,
    departmentCount: 5,
    allProjects: { google: 180, fb: 145, criteo: 68, bing: 52 },
    newCustomers: { google: 42, fb: 35, criteo: 18, bing: 15 },
    churnedCustomers: { google: 8, fb: 12, criteo: 5, bing: 3 }
  },
  {
    year: '2025年',
    department: '员工1',
    isFirstOfYear: false,
    departmentCount: 1,
    allProjects: { google: 48, fb: 38, criteo: 18, bing: 14 },
    newCustomers: { google: 12, fb: 10, criteo: 5, bing: 4 },
    churnedCustomers: { google: 2, fb: 3, criteo: 1, bing: 1 }
  },
  {
    year: '2025年',
    department: '员工2',
    isFirstOfYear: false,
    departmentCount: 1,
    allProjects: { google: 45, fb: 36, criteo: 16, bing: 12 },
    newCustomers: { google: 10, fb: 8, criteo: 4, bing: 3 },
    churnedCustomers: { google: 1, fb: 2, criteo: 1, bing: 0 }
  },
  {
    year: '2025年',
    department: '员工3',
    isFirstOfYear: false,
    departmentCount: 1,
    allProjects: { google: 42, fb: 35, criteo: 17, bing: 13 },
    newCustomers: { google: 11, fb: 9, criteo: 5, bing: 4 },
    churnedCustomers: { google: 3, fb: 4, criteo: 2, bing: 1 }
  },
  {
    year: '2025年',
    department: '员工4',
    isFirstOfYear: false,
    departmentCount: 1,
    allProjects: { google: 45, fb: 36, criteo: 17, bing: 13 },
    newCustomers: { google: 9, fb: 8, criteo: 4, bing: 4 },
    churnedCustomers: { google: 2, fb: 3, criteo: 1, bing: 1 }
  }
])

// 统计数据
const platformStats = computed<PlatformStats>(() => {
  // 基于实际数据计算统计值
  const totalData = departmentBasedData.value[0] // 运营总计行
  const totalProjects = totalData.allProjects.google + totalData.allProjects.fb +
                       totalData.allProjects.criteo + totalData.allProjects.bing

  return {
    totalProjects: totalProjects, // 445 项目
    totalRebate: 675000,  // 67.5万返点
    totalServiceFee: 1150000, // 115万服务费
    totalProfit: 475000   // 47.5万毛利
  }
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
const formatNumber = (num: number) => {
  return num.toLocaleString()
}

const formatCurrency = (amount: number) => {
  if (amount >= 10000) {
    return (amount / 10000).toFixed(1) + '万'
  }
  return amount.toLocaleString()
}
</script>

<style scoped>
.department-platform-analysis-module {
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
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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

.category-header.all-platforms {
  background: #e6f7ff !important;
  color: #1890ff !important;
  font-weight: 600;
  font-size: 12px;
  text-align: center;
}

.category-header.new-customers {
  background: #f6ffed !important;
  color: #52c41a !important;
  font-weight: 600;
  font-size: 12px;
  text-align: center;
}

.category-header.churned-customers {
  background: #fff2f0 !important;
  color: #ff4d4f !important;
  font-weight: 600;
  font-size: 12px;
  text-align: center;
}

.sub-header.all-platforms {
  background: #e6f7ff !important;
  color: #1890ff !important;
  font-weight: 600;
  font-size: 12px;
  white-space: nowrap;
}

.sub-header.new-customers {
  background: #f6ffed !important;
  color: #52c41a !important;
  font-weight: 600;
  font-size: 12px;
  white-space: nowrap;
}

.sub-header.churned-customers {
  background: #fff2f0 !important;
  color: #ff4d4f !important;
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

.data-cell.all-platforms {
  background: #f0f8ff !important;
  color: #1890ff !important;
  font-weight: 500;
  text-align: center;
  min-width: 80px;
}

.data-cell.new-customers {
  background: #f6ffed !important;
  color: #52c41a !important;
  font-weight: 500;
  text-align: center;
  min-width: 80px;
}

.data-cell.churned-customers {
  background: #fff2f0 !important;
  color: #ff4d4f !important;
  font-weight: 500;
  text-align: center;
  min-width: 80px;
}
</style>
