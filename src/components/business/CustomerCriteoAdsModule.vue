<template>
  <div class="customer-criteo-ads-module analysis-module">
    <!-- 模块头部 -->
    <div class="analysis-module__header">
      <h3 class="analysis-module__title">客户Criteo广告数据总览</h3>
      <div class="analysis-module__controls">
        <!-- 时间筛选按钮 -->
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

        <!-- 季度导航 -->
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
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>正在加载Criteo广告数据...</p>
    </div>

    <!-- 内容区域 -->
    <div v-else class="analysis-module__content">
      <!-- 数据表格 -->
      <div class="criteo-ads-table-container">
        <table class="criteo-ads-table">
          <thead>
            <tr>
              <th class="customer-header">客户名称</th>
              <th class="optimizer-header">优化师</th>
              <th class="metric-header">花费</th>
              <th class="metric-header">转化价值</th>
              <th class="metric-header">转化价值（按转化时间）</th>
              <th class="metric-header">ROAS</th>
              <th class="metric-header">ROAS（按转化时间）</th>
              <th class="metric-header">转化次数</th>
              <th class="metric-header">转化率</th>
              <th class="metric-header">展示次数</th>
              <th class="metric-header">点击次数</th>
              <th class="metric-header">点击率 (CTR)</th>
              <th class="metric-header">CPC</th>
              <th class="metric-header">CPA</th>
              <th class="metric-header">预计还能花费天数</th>
              <th class="alert-header">异常数据提醒</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(customer, index) in criteoAdsData"
              :key="customer.customerId"
              class="data-row"
            >
              <td class="customer-name">{{ customer.customerName }}</td>
              <td class="optimizer-name">{{ customer.optimizer }}</td>
              <td class="metric-value">¥{{ formatCurrency(customer.spend) }}</td>
              <td class="metric-value">¥{{ formatCurrency(customer.conversionValue) }}</td>
              <td class="metric-value">¥{{ formatCurrency(customer.conversionValueByTime) }}</td>
              <td class="metric-value roas">{{ customer.roas }}</td>
              <td class="metric-value roas">{{ customer.roasByTime }}</td>
              <td class="metric-value">{{ customer.conversions }}</td>
              <td class="metric-value">{{ customer.conversionRate }}%</td>
              <td class="metric-value">{{ formatNumber(customer.impressions) }}</td>
              <td class="metric-value">{{ formatNumber(customer.clicks) }}</td>
              <td class="metric-value">{{ customer.ctr }}%</td>
              <td class="metric-value">¥{{ customer.cpc }}</td>
              <td class="metric-value">¥{{ formatCurrency(customer.cpa) }}</td>
              <td class="metric-value days">{{ customer.estimatedDaysLeft }}天</td>
              <td class="alert-cell">
                <div v-if="customer.alerts.length > 0" class="alert-badges">
                  <span
                    v-for="alert in customer.alerts"
                    :key="alert.type"
                    :class="['alert-badge', `alert-badge--${alert.severity}`]"
                    :title="alert.message"
                  >
                    {{ alert.type }}
                  </span>
                </div>
                <span v-else class="no-alert">正常</span>
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
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

// 数据接口定义
interface CriteoAdsAlert {
  type: string
  severity: 'high' | 'medium' | 'low'
  message: string
}

interface CriteoAdsData {
  customerId: string
  customerName: string
  optimizer: string
  spend: number
  conversionValue: number
  conversionValueByTime: number
  roas: number
  roasByTime: number
  conversions: number
  conversionRate: number
  impressions: number
  clicks: number
  ctr: number
  cpc: number
  cpa: number
  estimatedDaysLeft: number
  alerts: CriteoAdsAlert[]
}

// Props 和 Emits
const props = defineProps<{
  loading?: boolean
}>()

const emits = defineEmits<{
  'time-range-change': [value: string]
  'quarter-change': [value: string]
}>()

// 响应式数据
const selectedTimeRange = ref('quarter')
const currentQuarter = ref('2025年Q1')

const timeOptions = [
  { label: '年', value: 'year' },
  { label: '季', value: 'quarter' },
  { label: '月', value: 'month' }
]

// 模拟Criteo广告数据
const criteoAdsData = ref<CriteoAdsData[]>([
  {
    customerId: '1',
    customerName: '华为技术有限公司',
    optimizer: '优化师3',
    spend: 89000,
    conversionValue: 385000,
    conversionValueByTime: 368000,
    roas: 4.3,
    roasByTime: 4.1,
    conversions: 245,
    conversionRate: 3.5,
    impressions: 1800000,
    clicks: 7000,
    ctr: 0.39,
    cpc: 12.7,
    cpa: 363.3,
    estimatedDaysLeft: 16,
    alerts: []
  },
  {
    customerId: '2',
    customerName: '腾讯科技(深圳)有限公司',
    optimizer: '优化师1',
    spend: 72000,
    conversionValue: 295000,
    conversionValueByTime: 285000,
    roas: 4.1,
    roasByTime: 4.0,
    conversions: 185,
    conversionRate: 3.2,
    impressions: 1450000,
    clicks: 5800,
    ctr: 0.40,
    cpc: 12.4,
    cpa: 389.2,
    estimatedDaysLeft: 23,
    alerts: [
      { type: 'CPC异常', severity: 'low', message: 'Criteo CPC较上周下降8%' }
    ]
  },
  {
    customerId: '3',
    customerName: '阿里巴巴(中国)有限公司',
    optimizer: '优化师2',
    spend: 135000,
    conversionValue: 598000,
    conversionValueByTime: 575000,
    roas: 4.4,
    roasByTime: 4.3,
    conversions: 295,
    conversionRate: 3.8,
    impressions: 2200000,
    clicks: 7800,
    ctr: 0.35,
    cpc: 17.3,
    cpa: 457.6,
    estimatedDaysLeft: 9,
    alerts: [
      { type: 'CPC异常', severity: 'high', message: 'Criteo CPC异常偏高，超出预算25%' },
      { type: '花费异常', severity: 'medium', message: '日花费波动较大' }
    ]
  },
  {
    customerId: '4',
    customerName: '百度在线网络技术(北京)有限公司',
    optimizer: '优化师3',
    spend: 68000,
    conversionValue: 275000,
    conversionValueByTime: 262000,
    roas: 4.0,
    roasByTime: 3.9,
    conversions: 165,
    conversionRate: 2.9,
    impressions: 1320000,
    clicks: 5700,
    ctr: 0.43,
    cpc: 11.9,
    cpa: 412.1,
    estimatedDaysLeft: 26,
    alerts: []
  },
  {
    customerId: '5',
    customerName: '京东科技信息技术有限公司',
    optimizer: '优化师2',
    spend: 58000,
    conversionValue: 245000,
    conversionValueByTime: 235000,
    roas: 4.2,
    roasByTime: 4.1,
    conversions: 145,
    conversionRate: 3.1,
    impressions: 1150000,
    clicks: 4700,
    ctr: 0.41,
    cpc: 12.3,
    cpa: 400.0,
    estimatedDaysLeft: 31,
    alerts: [
      { type: '转化异常', severity: 'low', message: 'Criteo转化表现优于预期15%' }
    ]
  }
])

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

const formatCurrency = (value: number) => {
  return value.toLocaleString('zh-CN')
}

const formatNumber = (value: number) => {
  if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + 'M'
  } else if (value >= 1000) {
    return (value / 1000).toFixed(1) + 'K'
  }
  return value.toString()
}
</script>

<style scoped>
.customer-criteo-ads-module {
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
  width: 32px;
  height: 32px;
  border: 1px solid #d9d9d9;
  background: #fff;
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
  font-weight: 500;
  color: #262626;
  min-width: 80px;
  text-align: center;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #8c8c8c;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f0f0f0;
  border-top: 3px solid #1890ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.analysis-module__content {
  min-height: 400px;
}

.criteo-ads-table-container {
  overflow-x: auto;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
}

.criteo-ads-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 1600px;
  background: #fff;
}

.criteo-ads-table th,
.criteo-ads-table td {
  padding: 12px 8px;
  border-bottom: 1px solid #e8e8e8;
  border-right: 1px solid #e8e8e8;
  text-align: center;
  font-size: 13px;
  white-space: nowrap;
}

.criteo-ads-table th {
  background: #fafafa;
  font-weight: 600;
  color: #262626;
  position: sticky;
  top: 0;
  z-index: 1;
}

.customer-header,
.optimizer-header {
  background: #f0f2f5 !important;
  color: #262626 !important;
  font-weight: 600;
  font-size: 12px;
  min-width: 150px;
}

.metric-header {
  background: #fafafa !important;
  color: #262626 !important;
  font-weight: 600;
  font-size: 12px;
  min-width: 100px;
}

.alert-header {
  background: #fff2e8 !important;
  color: #fa8c16 !important;
  font-weight: 600;
  font-size: 12px;
  min-width: 120px;
}

.data-row:nth-child(even) {
  background: #fafafa;
}

.data-row:hover {
  background: #e6f7ff;
}

.customer-name {
  text-align: left !important;
  font-weight: 500;
  color: #262626 !important;
  background: #f0f2f5 !important;
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.optimizer-name {
  text-align: center !important;
  font-weight: 500;
  color: #262626 !important;
  background: #f0f2f5 !important;
}

.metric-value {
  font-weight: 500;
  color: #595959;
}

.metric-value.roas {
  color: #52c41a !important;
  font-weight: 600;
}

.metric-value.days {
  color: #1890ff !important;
}

.alert-cell {
  text-align: center !important;
}

.alert-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  justify-content: center;
}

.alert-badge {
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 11px;
  font-weight: 500;
  white-space: nowrap;
}

.alert-badge--high {
  background: #ffebee;
  color: #f5222d;
  border: 1px solid #ffa39e;
}

.alert-badge--medium {
  background: #fff7e6;
  color: #fa8c16;
  border: 1px solid #ffd591;
}

.alert-badge--low {
  background: #f6ffed;
  color: #52c41a;
  border: 1px solid #b7eb8f;
}

.no-alert {
  color: #52c41a;
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .customer-criteo-ads-module {
    padding: 16px;
  }

  .analysis-module__header {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }

  .analysis-module__controls {
    justify-content: space-between;
  }

  .criteo-ads-table {
    font-size: 12px;
  }

  .criteo-ads-table th,
  .criteo-ads-table td {
    padding: 8px 4px;
  }
}
</style>
