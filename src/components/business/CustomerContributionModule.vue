<template>
  <div class="customer-contribution-module analysis-module">
    <!-- 模块头部 -->
    <div class="analysis-module__header">
      <h3 class="analysis-module__title">客户贡献（总计）</h3>
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
      <p>正在加载客户贡献数据...</p>
    </div>

    <!-- 内容区域 -->
    <div v-else class="analysis-module__content">
      <!-- 统计卡片 -->
      <div class="statistics-overview">
        <div class="stat-card">
          <div class="stat-card__icon">
            <DollarSign :size="24" />
          </div>
          <div class="stat-card__content">
            <div class="stat-card__label">销售额</div>
            <div class="stat-card__value">{{ formatCurrency(totalSales) }} 万元</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-card__icon">
            <TrendingUp :size="24" />
          </div>
          <div class="stat-card__content">
            <div class="stat-card__label">总毛利</div>
            <div class="stat-card__value">{{ formatCurrency(totalProfit) }} 万元</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-card__icon">
            <CreditCard :size="24" />
          </div>
          <div class="stat-card__content">
            <div class="stat-card__label">总服务费</div>
            <div class="stat-card__value">{{ formatCurrency(totalServiceFee) }} 万元</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-card__icon">
            <ShoppingCart :size="24" />
          </div>
          <div class="stat-card__content">
            <div class="stat-card__label">总消费</div>
            <div class="stat-card__value">{{ formatCurrency(totalConsumption) }} 万元</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-card__icon">
            <ArrowDownUp :size="24" />
          </div>
          <div class="stat-card__content">
            <div class="stat-card__label">总返点</div>
            <div class="stat-card__value">{{ formatCurrency(totalRebate) }} 万元</div>
          </div>
        </div>
      </div>

      <!-- 数据表格 -->
      <div class="contribution-table-container">
        <table class="contribution-table">
          <thead>
            <tr>
              <th rowspan="2" class="customer-header">客户名称 (从高到低)</th>
              <th rowspan="2" class="metric-header">销售额</th>
              <th rowspan="2" class="metric-header">总毛利</th>
              <th rowspan="2" class="metric-header">总服务费</th>
              <th rowspan="2" class="metric-header">总消费</th>
              <th rowspan="2" class="metric-header">总返点</th>
              <th colspan="4" class="platform-group-header service-fee">分平台服务费</th>
              <th colspan="4" class="platform-group-header consumption">分平台消费</th>
              <th colspan="4" class="platform-group-header rebate">分平台返点</th>
            </tr>
            <tr>
              <!-- 分平台服务费 -->
              <th class="platform-sub-header service-fee">Google</th>
              <th class="platform-sub-header service-fee">FB</th>
              <th class="platform-sub-header service-fee">Criteo</th>
              <th class="platform-sub-header service-fee">Bing</th>
              <!-- 分平台消费 -->
              <th class="platform-sub-header consumption">Google</th>
              <th class="platform-sub-header consumption">FB</th>
              <th class="platform-sub-header consumption">Criteo</th>
              <th class="platform-sub-header consumption">Bing</th>
              <!-- 分平台返点 -->
              <th class="platform-sub-header rebate">Google</th>
              <th class="platform-sub-header rebate">FB</th>
              <th class="platform-sub-header rebate">Criteo</th>
              <th class="platform-sub-header rebate">Bing</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(customer, index) in customerContributionData"
              :key="customer.customerId"
              class="data-row"
            >
              <td class="customer-name">{{ customer.customerName }}</td>
              <td class="metric-value">{{ formatCurrency(customer.salesAmount) }}</td>
              <td class="metric-value">{{ formatCurrency(customer.totalProfit) }}</td>
              <td class="metric-value">{{ formatCurrency(customer.totalServiceFee) }}</td>
              <td class="metric-value">{{ formatCurrency(customer.totalConsumption) }}</td>
              <td class="metric-value">{{ formatCurrency(customer.totalRebate) }}</td>

              <!-- 分平台服务费 -->
              <td class="platform-value service-fee google">{{ formatCurrency(customer.platformServiceFee.google) }}</td>
              <td class="platform-value service-fee facebook">{{ formatCurrency(customer.platformServiceFee.facebook) }}</td>
              <td class="platform-value service-fee criteo">{{ formatCurrency(customer.platformServiceFee.criteo) }}</td>
              <td class="platform-value service-fee bing">{{ formatCurrency(customer.platformServiceFee.bing) }}</td>

              <!-- 分平台消费 -->
              <td class="platform-value consumption google">{{ formatCurrency(customer.platformConsumption.google) }}</td>
              <td class="platform-value consumption facebook">{{ formatCurrency(customer.platformConsumption.facebook) }}</td>
              <td class="platform-value consumption criteo">{{ formatCurrency(customer.platformConsumption.criteo) }}</td>
              <td class="platform-value consumption bing">{{ formatCurrency(customer.platformConsumption.bing) }}</td>

              <!-- 分平台返点 -->
              <td class="platform-value rebate google">{{ formatCurrency(customer.platformRebate.google) }}</td>
              <td class="platform-value rebate facebook">{{ formatCurrency(customer.platformRebate.facebook) }}</td>
              <td class="platform-value rebate criteo">{{ formatCurrency(customer.platformRebate.criteo) }}</td>
              <td class="platform-value rebate bing">{{ formatCurrency(customer.platformRebate.bing) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits } from 'vue'
import { ChevronLeft, ChevronRight, DollarSign, TrendingUp, CreditCard, ShoppingCart, ArrowDownUp } from 'lucide-vue-next'

// 接口定义
interface CustomerContributionData {
  customerId: string
  customerName: string
  salesAmount: number
  totalProfit: number
  totalServiceFee: number
  totalConsumption: number
  totalRebate: number
  platformServiceFee: {
    google: number
    facebook: number
    criteo: number
    bing: number
  }
  platformConsumption: {
    google: number
    facebook: number
    criteo: number
    bing: number
  }
  platformRebate: {
    google: number
    facebook: number
    criteo: number
    bing: number
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

// 模拟客户贡献数据
const customerContributionData = ref<CustomerContributionData[]>([
  {
    customerId: '1',
    customerName: '华为技术有限公司',
    salesAmount: 2850.0,
    totalProfit: 1425.0,
    totalServiceFee: 855.0,
    totalConsumption: 2280.0,
    totalRebate: 570.0,
    platformServiceFee: { google: 342.0, facebook: 285.0, criteo: 171.0, bing: 57.0 },
    platformConsumption: { google: 912.0, facebook: 684.0, criteo: 456.0, bing: 228.0 },
    platformRebate: { google: 228.0, facebook: 171.0, criteo: 114.0, bing: 57.0 }
  },
  {
    customerId: '2',
    customerName: '腾讯科技(深圳)有限公司',
    salesAmount: 2650.0,
    totalProfit: 1325.0,
    totalServiceFee: 795.0,
    totalConsumption: 2120.0,
    totalRebate: 530.0,
    platformServiceFee: { google: 318.0, facebook: 265.0, criteo: 159.0, bing: 53.0 },
    platformConsumption: { google: 848.0, facebook: 636.0, criteo: 424.0, bing: 212.0 },
    platformRebate: { google: 212.0, facebook: 159.0, criteo: 106.0, bing: 53.0 }
  },
  {
    customerId: '3',
    customerName: '阿里巴巴(中国)有限公司',
    salesAmount: 2450.0,
    totalProfit: 1225.0,
    totalServiceFee: 735.0,
    totalConsumption: 1960.0,
    totalRebate: 490.0,
    platformServiceFee: { google: 294.0, facebook: 245.0, criteo: 147.0, bing: 49.0 },
    platformConsumption: { google: 784.0, facebook: 588.0, criteo: 392.0, bing: 196.0 },
    platformRebate: { google: 196.0, facebook: 147.0, criteo: 98.0, bing: 49.0 }
  },
  {
    customerId: '4',
    customerName: '百度在线网络技术(北京)有限公司',
    salesAmount: 2250.0,
    totalProfit: 1125.0,
    totalServiceFee: 675.0,
    totalConsumption: 1800.0,
    totalRebate: 450.0,
    platformServiceFee: { google: 270.0, facebook: 225.0, criteo: 135.0, bing: 45.0 },
    platformConsumption: { google: 720.0, facebook: 540.0, criteo: 360.0, bing: 180.0 },
    platformRebate: { google: 180.0, facebook: 135.0, criteo: 90.0, bing: 45.0 }
  },
  {
    customerId: '5',
    customerName: '京东科技信息技术有限公司',
    salesAmount: 2050.0,
    totalProfit: 1025.0,
    totalServiceFee: 615.0,
    totalConsumption: 1640.0,
    totalRebate: 410.0,
    platformServiceFee: { google: 246.0, facebook: 205.0, criteo: 123.0, bing: 41.0 },
    platformConsumption: { google: 656.0, facebook: 492.0, criteo: 328.0, bing: 164.0 },
    platformRebate: { google: 164.0, facebook: 123.0, criteo: 82.0, bing: 41.0 }
  }
])

// 计算属性
const totalSales = computed(() => {
  return customerContributionData.value.reduce((sum, customer) => sum + customer.salesAmount, 0)
})

const totalProfit = computed(() => {
  return customerContributionData.value.reduce((sum, customer) => sum + customer.totalProfit, 0)
})

const totalServiceFee = computed(() => {
  return customerContributionData.value.reduce((sum, customer) => sum + customer.totalServiceFee, 0)
})

const totalConsumption = computed(() => {
  return customerContributionData.value.reduce((sum, customer) => sum + customer.totalConsumption, 0)
})

const totalRebate = computed(() => {
  return customerContributionData.value.reduce((sum, customer) => sum + customer.totalRebate, 0)
})

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
.customer-contribution-module {
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

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
}

.loading-spinner {
  width: 32px;
  height: 32px;
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
  /* 内容区域不需要额外padding，因为父容器已经有了 */
}

.statistics-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 8px;
  border: 1px solid #e8e8e8;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-card__icon {
  margin-right: 12px;
  color: #fff;
  background: #1890ff;
  padding: 8px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-card__content {
  flex: 1;
}

.stat-card__label {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
  font-weight: 500;
}

.stat-card__value {
  font-size: 20px;
  font-weight: 600;
  color: #262626;
}

.contribution-table-container {
  overflow-x: auto;
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
}

.contribution-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 1200px;
}

.contribution-table th {
  background: #fafafa;
  border: 1px solid #f0f0f0;
  padding: 12px 8px;
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: #595959;
  white-space: nowrap;
}

.contribution-table td {
  border: 1px solid #f0f0f0;
  padding: 12px 8px;
  text-align: center;
  font-size: 13px;
  vertical-align: middle;
  color: #595959;
}

.customer-header {
  background: #f0f2f5 !important;
  color: #262626 !important;
  font-weight: 600;
  position: sticky;
  left: 0;
  z-index: 3;
  min-width: 180px;
  text-align: center;
  vertical-align: middle;
}

.metric-header {
  background: #f0f2f5 !important;
  color: #262626 !important;
  font-weight: 600;
  min-width: 80px;
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
  min-width: 60px;
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
  position: sticky;
  left: 0;
  z-index: 2;
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.metric-value {
  font-weight: 500;
  color: #595959;
}

.platform-value {
  font-size: 13px;
  font-weight: 500;
}

.platform-value.google {
  color: #1890ff !important;
  background: #e6f7ff !important;
}

.platform-value.facebook {
  color: #1890ff !important;
  background: #e6f7ff !important;
}

.platform-value.criteo {
  color: #fa8c16 !important;
  background: #fff7e6 !important;
}

.platform-value.bing {
  color: #722ed1 !important;
  background: #f9f0ff !important;
}

.data-cell.google-platform {
  color: #1890ff !important;
  background: #e6f7ff !important;
}

.data-cell.fb-platform {
  color: #1890ff !important;
  background: #e6f7ff !important;
}

.data-cell.criteo-platform {
  color: #fa8c16 !important;
  background: #fff7e6 !important;
}

.data-cell.bing-platform {
  color: #722ed1 !important;
  background: #f9f0ff !important;
}

/* 分平台数据组颜色区分 - 表头样式 */
.platform-group-header.service-fee {
  background: #e6f7ff !important;
  color: #1890ff !important;
  font-weight: 600;
}

.platform-group-header.consumption {
  background: #f6ffed !important;
  color: #52c41a !important;
  font-weight: 600;
}

.platform-group-header.rebate {
  background: #fff7e6 !important;
  color: #faad14 !important;
  font-weight: 600;
}

/* 分平台数据组颜色区分 - 子表头样式 */
.platform-sub-header.service-fee {
  background: #f0f8ff !important;
  color: #1890ff !important;
  font-weight: 600;
}

.platform-sub-header.consumption {
  background: #f6ffed !important;
  color: #52c41a !important;
  font-weight: 600;
}

.platform-sub-header.rebate {
  background: #fffbf0 !important;
  color: #faad14 !important;
  font-weight: 600;
}

/* 分平台数据组颜色区分 - 数据单元格样式 */
.platform-value.service-fee {
  background: #f0f8ff !important;
  color: #1890ff !important;
  font-weight: 500;
}

.platform-value.consumption {
  background: #f6ffed !important;
  color: #52c41a !important;
  font-weight: 500;
}

.platform-value.rebate {
  background: #fffbf0 !important;
  color: #faad14 !important;
  font-weight: 500;
}
</style>
