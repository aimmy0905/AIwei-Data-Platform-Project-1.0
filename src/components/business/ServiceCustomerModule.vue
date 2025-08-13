<template>
  <div class="service-customer-module analysis-module">
    <!-- 模块头部 -->
    <div class="analysis-module__header">
      <h3 class="analysis-module__title">服务客户模块</h3>
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
      <p>正在加载服务客户数据...</p>
    </div>

    <!-- 内容区域 -->
    <div v-else class="analysis-module__content">
      <!-- 数据表格 -->
      <div class="service-customer-table-container">
        <table class="service-customer-table">
          <thead>
            <tr>
              <th rowspan="2" class="customer-header">客户名称</th>
              <th rowspan="2" class="cooperation-header">合作形式</th>
              <th rowspan="2" class="team-status-header">团队合作情况</th>
              <th rowspan="2" class="team-header">协作团队</th>
              <th rowspan="2" class="level-header">客户分级</th>
              <th rowspan="2" class="sales-header">销售额</th>
              <th rowspan="2" class="spend-header">各平台总花费</th>
              <th rowspan="2" class="roi-header">整站ROI</th>
              <th rowspan="2" class="price-header">客单价</th>
              <th rowspan="2" class="orders-header">订单数</th>
              <th rowspan="2" class="conversion-header">订单转化率</th>
              <th colspan="3" class="platform-group-header meta">Meta</th>
              <th colspan="3" class="platform-group-header google">Google</th>
              <th colspan="3" class="platform-group-header criteo">Criteo</th>
              <th colspan="3" class="platform-group-header bing">Bing</th>
            </tr>
            <tr>
              <!-- Meta 子列 -->
              <th class="platform-sub-header meta">花费</th>
              <th class="platform-sub-header meta">订单价值</th>
              <th class="platform-sub-header meta">ROI</th>
              <!-- Google 子列 -->
              <th class="platform-sub-header google">花费</th>
              <th class="platform-sub-header google">订单价值</th>
              <th class="platform-sub-header google">ROI</th>
              <!-- Criteo 子列 -->
              <th class="platform-sub-header criteo">花费</th>
              <th class="platform-sub-header criteo">订单价值</th>
              <th class="platform-sub-header criteo">ROI</th>
              <!-- Bing 子列 -->
              <th class="platform-sub-header bing">花费</th>
              <th class="platform-sub-header bing">订单价值</th>
              <th class="platform-sub-header bing">ROI</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="customer in serviceCustomerData"
              :key="customer.customerId"
              class="data-row"
            >
              <td class="customer-name">{{ customer.customerName }}</td>
              <td class="cooperation-form">{{ customer.cooperationForm }}</td>
              <td class="team-status">{{ customer.teamStatus }}</td>
              <td class="collaboration-team">{{ customer.collaborationTeam }}</td>
              <td class="customer-level">{{ customer.customerLevel }}</td>
              <td class="sales-amount">{{ formatCurrency(customer.salesAmount) }}万</td>
              <td class="total-spend">{{ formatCurrency(customer.totalSpend) }}万</td>
              <td class="overall-roi">{{ customer.overallROI }}%</td>
              <td class="avg-order-value">{{ formatCurrency(customer.avgOrderValue) }}</td>
              <td class="order-count">{{ customer.orderCount }}</td>
              <td class="conversion-rate">{{ customer.conversionRate }}%</td>

              <!-- Meta 数据 -->
              <td class="platform-value meta">{{ formatCurrency(customer.platforms.meta.spend) }}万</td>
              <td class="platform-value meta">{{ formatCurrency(customer.platforms.meta.orderValue) }}万</td>
              <td class="platform-value meta">{{ customer.platforms.meta.roi }}%</td>

              <!-- Google 数据 -->
              <td class="platform-value google">{{ formatCurrency(customer.platforms.google.spend) }}万</td>
              <td class="platform-value google">{{ formatCurrency(customer.platforms.google.orderValue) }}万</td>
              <td class="platform-value google">{{ customer.platforms.google.roi }}%</td>

              <!-- Criteo 数据 -->
              <td class="platform-value criteo">{{ formatCurrency(customer.platforms.criteo.spend) }}万</td>
              <td class="platform-value criteo">{{ formatCurrency(customer.platforms.criteo.orderValue) }}万</td>
              <td class="platform-value criteo">{{ customer.platforms.criteo.roi }}%</td>

              <!-- Bing 数据 -->
              <td class="platform-value bing">{{ formatCurrency(customer.platforms.bing.spend) }}万</td>
              <td class="platform-value bing">{{ formatCurrency(customer.platforms.bing.orderValue) }}万</td>
              <td class="platform-value bing">{{ customer.platforms.bing.roi }}%</td>
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
interface ServiceCustomerData {
  customerId: string
  customerName: string
  cooperationForm: string
  teamStatus: string
  collaborationTeam: string
  customerLevel: string
  salesAmount: number
  totalSpend: number
  overallROI: number
  avgOrderValue: number
  orderCount: number
  conversionRate: number
  platforms: {
    meta: {
      spend: number
      orderValue: number
      roi: number
    }
    google: {
      spend: number
      orderValue: number
      roi: number
    }
    criteo: {
      spend: number
      orderValue: number
      roi: number
    }
    bing: {
      spend: number
      orderValue: number
      roi: number
    }
  }
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

// 模拟服务客户数据
const serviceCustomerData = ref<ServiceCustomerData[]>([
  {
    customerId: '1',
    customerName: '华为技术有限公司',
    cooperationForm: '长期合作',
    teamStatus: '良好',
    collaborationTeam: '运营团队A',
    customerLevel: 'A级',
    salesAmount: 2850.0,
    totalSpend: 1425.0,
    overallROI: 200.0,
    avgOrderValue: 285.0,
    orderCount: 100,
    conversionRate: 3.5,
    platforms: {
      meta: { spend: 450.0, orderValue: 900.0, roi: 200.0 },
      google: { spend: 380.0, orderValue: 760.0, roi: 200.0 },
      criteo: { spend: 320.0, orderValue: 640.0, roi: 200.0 },
      bing: { spend: 275.0, orderValue: 550.0, roi: 200.0 }
    }
  },
  {
    customerId: '2',
    customerName: '腾讯科技(深圳)有限公司',
    cooperationForm: '项目合作',
    teamStatus: '优秀',
    collaborationTeam: '运营团队B',
    customerLevel: 'A级',
    salesAmount: 2650.0,
    totalSpend: 1325.0,
    overallROI: 180.0,
    avgOrderValue: 265.0,
    orderCount: 95,
    conversionRate: 3.2,
    platforms: {
      meta: { spend: 420.0, orderValue: 756.0, roi: 180.0 },
      google: { spend: 355.0, orderValue: 639.0, roi: 180.0 },
      criteo: { spend: 298.0, orderValue: 536.4, roi: 180.0 },
      bing: { spend: 252.0, orderValue: 453.6, roi: 180.0 }
    }
  },
  {
    customerId: '3',
    customerName: '阿里巴巴(中国)有限公司',
    cooperationForm: '战略合作',
    teamStatus: '优秀',
    collaborationTeam: '运营团队C',
    customerLevel: 'S级',
    salesAmount: 2450.0,
    totalSpend: 1225.0,
    overallROI: 220.0,
    avgOrderValue: 245.0,
    orderCount: 110,
    conversionRate: 4.0,
    platforms: {
      meta: { spend: 390.0, orderValue: 858.0, roi: 220.0 },
      google: { spend: 330.0, orderValue: 726.0, roi: 220.0 },
      criteo: { spend: 275.0, orderValue: 605.0, roi: 220.0 },
      bing: { spend: 230.0, orderValue: 506.0, roi: 220.0 }
    }
  },
  {
    customerId: '4',
    customerName: '百度在线网络技术(北京)有限公司',
    cooperationForm: '长期合作',
    teamStatus: '良好',
    collaborationTeam: '运营团队A',
    customerLevel: 'A级',
    salesAmount: 2250.0,
    totalSpend: 1125.0,
    overallROI: 190.0,
    avgOrderValue: 225.0,
    orderCount: 85,
    conversionRate: 2.8,
    platforms: {
      meta: { spend: 360.0, orderValue: 684.0, roi: 190.0 },
      google: { spend: 305.0, orderValue: 579.5, roi: 190.0 },
      criteo: { spend: 255.0, orderValue: 484.5, roi: 190.0 },
      bing: { spend: 205.0, orderValue: 389.5, roi: 190.0 }
    }
  },
  {
    customerId: '5',
    customerName: '京东科技信息技术有限公司',
    cooperationForm: '项目合作',
    teamStatus: '良好',
    collaborationTeam: '运营团队B',
    customerLevel: 'B级',
    salesAmount: 2050.0,
    totalSpend: 1025.0,
    overallROI: 170.0,
    avgOrderValue: 205.0,
    orderCount: 75,
    conversionRate: 2.5,
    platforms: {
      meta: { spend: 328.0, orderValue: 557.6, roi: 170.0 },
      google: { spend: 278.0, orderValue: 472.6, roi: 170.0 },
      criteo: { spend: 230.0, orderValue: 391.0, roi: 170.0 },
      bing: { spend: 189.0, orderValue: 321.3, roi: 170.0 }
    }
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
  return value.toFixed(1)
}
</script>

<style scoped>
.service-customer-module {
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

.service-customer-table-container {
  overflow-x: auto;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
}

.service-customer-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 1800px;
  background: #fff;
}

.service-customer-table th,
.service-customer-table td {
  padding: 12px 8px;
  border-bottom: 1px solid #e8e8e8;
  border-right: 1px solid #e8e8e8;
  text-align: center;
  font-size: 13px;
  white-space: nowrap;
}

.service-customer-table th {
  background: #fafafa;
  font-weight: 600;
  color: #262626;
  position: sticky;
  top: 0;
  z-index: 1;
}

.customer-header,
.cooperation-header,
.team-status-header,
.team-header,
.level-header {
  background: #f0f2f5 !important;
  color: #262626 !important;
  font-weight: 600;
  font-size: 12px;
  min-width: 120px;
}

.sales-header,
.spend-header,
.roi-header,
.price-header,
.orders-header,
.conversion-header {
  background: #fafafa !important;
  color: #262626 !important;
  font-weight: 600;
  font-size: 12px;
  min-width: 100px;
}

.platform-group-header {
  background: #e6f7ff !important;
  color: #1890ff !important;
  font-weight: 600;
  font-size: 12px;
  text-align: center;
}

.platform-sub-header {
  background: #f0f9ff !important;
  color: #1890ff !important;
  font-weight: 600;
  font-size: 12px;
  white-space: nowrap;
  min-width: 80px;
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

.cooperation-form,
.team-status,
.collaboration-team,
.customer-level {
  font-weight: 500;
  color: #262626 !important;
  background: #f0f2f5 !important;
}

.sales-amount,
.total-spend,
.overall-roi,
.avg-order-value,
.order-count,
.conversion-rate {
  font-weight: 500;
  color: #595959;
}

.platform-value {
  font-size: 13px;
  font-weight: 500;
}

.platform-value.meta {
  color: #1890ff !important;
  background: #e6f7ff !important;
}

.platform-value.google {
  color: #52c41a !important;
  background: #f6ffed !important;
}

.platform-value.criteo {
  color: #fa8c16 !important;
  background: #fff7e6 !important;
}

.platform-value.bing {
  color: #722ed1 !important;
  background: #f9f0ff !important;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .service-customer-module {
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

  .service-customer-table {
    font-size: 12px;
  }

  .service-customer-table th,
  .service-customer-table td {
    padding: 8px 4px;
  }
}
</style>
