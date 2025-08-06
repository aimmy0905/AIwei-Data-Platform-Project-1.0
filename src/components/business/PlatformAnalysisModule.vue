<template>
  <div class="platform-analysis-module">
    <div class="analysis-module__header">
      <h3 class="analysis-module__title">平台新增及流失（总计）</h3>
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
              <th class="platform-header">平台名称</th>
              <th class="platform-header">项目数量</th>
              <th class="platform-header">活跃项目</th>
              <th class="platform-header">新增项目</th>
              <th class="platform-header">流失项目</th>
              <th class="platform-header">项目返点</th>
              <th class="platform-header">服务费</th>
              <th class="platform-header">毛利</th>
              <th class="platform-header">平台状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="platform in platformData" :key="platform.platformName" class="platform-row">
              <td class="platform-cell platform-name">
                <div class="platform-name-container">
                  <div class="platform-logo" :style="{ backgroundColor: platform.color }">
                    {{ platform.platformName.charAt(0) }}
                  </div>
                  <span>{{ platform.platformName }}</span>
                </div>
              </td>
              <td class="platform-cell">{{ platform.totalProjects }}</td>
              <td class="platform-cell">{{ platform.activeProjects }}</td>
              <td class="platform-cell new-projects">+{{ platform.newProjects }}</td>
              <td class="platform-cell churned-projects">-{{ platform.churnedProjects }}</td>
              <td class="platform-cell">¥{{ formatCurrency(platform.rebate) }}</td>
              <td class="platform-cell">¥{{ formatCurrency(platform.serviceFee) }}</td>
              <td class="platform-cell">¥{{ formatCurrency(platform.profit) }}</td>
              <td class="platform-cell">
                <span class="status-badge" :class="getStatusClass(platform.status)">
                  {{ getStatusText(platform.status) }}
                </span>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr class="summary-row">
              <td class="summary-cell">总计</td>
              <td class="summary-cell">{{ totalSummary.totalProjects }}</td>
              <td class="summary-cell">{{ totalSummary.activeProjects }}</td>
              <td class="summary-cell new-projects">+{{ totalSummary.newProjects }}</td>
              <td class="summary-cell churned-projects">-{{ totalSummary.churnedProjects }}</td>
              <td class="summary-cell">¥{{ formatCurrency(totalSummary.rebate) }}</td>
              <td class="summary-cell">¥{{ formatCurrency(totalSummary.serviceFee) }}</td>
              <td class="summary-cell">¥{{ formatCurrency(totalSummary.profit) }}</td>
              <td class="summary-cell">-</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ChevronLeft, ChevronRight, Briefcase, Percent, DollarSign, TrendingUp } from 'lucide-vue-next'

interface PlatformData {
  platformName: string
  totalProjects: number
  activeProjects: number
  newProjects: number
  churnedProjects: number
  rebate: number
  serviceFee: number
  profit: number
  status: 'active' | 'warning' | 'inactive'
  color: string
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

// 模拟平台数据
const platformData = ref<PlatformData[]>([
  {
    platformName: 'Google Ads',
    totalProjects: 45,
    activeProjects: 38,
    newProjects: 8,
    churnedProjects: 3,
    rebate: 285000,
    serviceFee: 450000,
    profit: 165000,
    status: 'active',
    color: '#4285f4'
  },
  {
    platformName: 'Facebook Ads',
    totalProjects: 32,
    activeProjects: 28,
    newProjects: 5,
    churnedProjects: 2,
    rebate: 195000,
    serviceFee: 320000,
    profit: 125000,
    status: 'active',
    color: '#1877f2'
  },
  {
    platformName: 'Bing Ads',
    totalProjects: 18,
    activeProjects: 15,
    newProjects: 3,
    churnedProjects: 1,
    rebate: 95000,
    serviceFee: 180000,
    profit: 85000,
    status: 'warning',
    color: '#00809d'
  },
  {
    platformName: 'Criteo',
    totalProjects: 12,
    activeProjects: 10,
    newProjects: 2,
    churnedProjects: 0,
    rebate: 65000,
    serviceFee: 120000,
    profit: 55000,
    status: 'active',
    color: '#ff6900'
  },
  {
    platformName: 'Amazon Ads',
    totalProjects: 8,
    activeProjects: 6,
    newProjects: 1,
    churnedProjects: 2,
    rebate: 35000,
    serviceFee: 80000,
    profit: 45000,
    status: 'warning',
    color: '#ff9900'
  }
])

// 统计数据
const platformStats = computed<PlatformStats>(() => {
  return platformData.value.reduce((acc, platform) => ({
    totalProjects: acc.totalProjects + platform.totalProjects,
    totalRebate: acc.totalRebate + platform.rebate,
    totalServiceFee: acc.totalServiceFee + platform.serviceFee,
    totalProfit: acc.totalProfit + platform.profit
  }), {
    totalProjects: 0,
    totalRebate: 0,
    totalServiceFee: 0,
    totalProfit: 0
  })
})

// 汇总数据
const totalSummary = computed(() => {
  return platformData.value.reduce((acc, platform) => ({
    totalProjects: acc.totalProjects + platform.totalProjects,
    activeProjects: acc.activeProjects + platform.activeProjects,
    newProjects: acc.newProjects + platform.newProjects,
    churnedProjects: acc.churnedProjects + platform.churnedProjects,
    rebate: acc.rebate + platform.rebate,
    serviceFee: acc.serviceFee + platform.serviceFee,
    profit: acc.profit + platform.profit
  }), {
    totalProjects: 0,
    activeProjects: 0,
    newProjects: 0,
    churnedProjects: 0,
    rebate: 0,
    serviceFee: 0,
    profit: 0
  })
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

const getStatusClass = (status: string) => {
  switch (status) {
    case 'active':
      return 'status-active'
    case 'warning':
      return 'status-warning'
    case 'inactive':
      return 'status-inactive'
    default:
      return 'status-active'
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'active':
      return '正常'
    case 'warning':
      return '注意'
    case 'inactive':
      return '停用'
    default:
      return '正常'
  }
}
</script>

<style scoped>
.platform-analysis-module {
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
  font-size: 14px;
  min-width: 1000px;
}

.platform-table th {
  background: #fafafa;
  border: 1px solid #f0f0f0;
  padding: 12px 16px;
  text-align: center;
  font-size: 13px;
  font-weight: 600;
  color: #595959;
  white-space: nowrap;
}

.platform-table td {
  border: 1px solid #f0f0f0;
  padding: 12px 16px;
  text-align: center;
  font-size: 13px;
  vertical-align: middle;
  color: #595959;
}

.platform-header {
  background: #f0f2f5 !important;
  color: #262626 !important;
  font-weight: 600;
}

.platform-name {
  text-align: left !important;
}

.platform-name-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.platform-logo {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
}

.new-projects {
  color: #52c41a !important;
  font-weight: 600;
}

.churned-projects {
  color: #ff4d4f !important;
  font-weight: 600;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.status-active {
  background: #f6ffed;
  color: #52c41a;
  border: 1px solid #b7eb8f;
}

.status-warning {
  background: #fff7e6;
  color: #faad14;
  border: 1px solid #ffd666;
}

.status-inactive {
  background: #fff2f0;
  color: #ff4d4f;
  border: 1px solid #ffb3b3;
}

/* 汇总行样式 */
.summary-row {
  background: #f0f2f5 !important;
}

.summary-cell {
  background: #f0f2f5 !important;
  color: #262626 !important;
  font-weight: 600;
  border-top: 2px solid #d9d9d9 !important;
}

.summary-cell.new-projects {
  color: #52c41a !important;
  font-weight: 600;
}

.summary-cell.churned-projects {
  color: #ff4d4f !important;
  font-weight: 600;
}
</style>
