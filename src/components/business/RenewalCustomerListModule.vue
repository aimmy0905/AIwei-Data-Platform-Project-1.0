<template>
  <div class="renewal-customer-list-module analysis-module">
    <!-- 模块头部 -->
    <div class="analysis-module__header">
      <h3 class="analysis-module__title">续费客户名单</h3>
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
      <p>正在加载续费客户数据...</p>
    </div>

    <!-- 内容区域 -->
    <div v-else class="analysis-module__content">
      <!-- 统计概览 -->
      <div class="statistics-overview">
        <div class="stat-card">
          <div class="stat-card__icon">
            <Users :size="24" />
          </div>
          <div class="stat-card__content">
            <div class="stat-card__label">续费客户总数</div>
            <div class="stat-card__value">{{ totalRenewalCustomers }} 个</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-card__icon">
            <DollarSign :size="24" />
          </div>
          <div class="stat-card__content">
            <div class="stat-card__label">续费总金额</div>
            <div class="stat-card__value">{{ formatCurrency(totalRenewalAmount) }} 万元</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-card__icon">
            <TrendingUp :size="24" />
          </div>
          <div class="stat-card__content">
            <div class="stat-card__label">续费率</div>
            <div class="stat-card__value">{{ renewalRate }}%</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-card__icon">
            <Calendar :size="24" />
          </div>
          <div class="stat-card__content">
            <div class="stat-card__label">平均续费周期</div>
            <div class="stat-card__value">{{ averageRenewalCycle }} 个月</div>
          </div>
        </div>
      </div>

      <!-- 续费客户列表 -->
      <div class="renewal-table-container">
        <table class="renewal-table">
          <thead>
            <tr>
              <th class="department-header">优化部门</th>
              <th class="customer-header">客户名称</th>
              <th class="metric-header">销售</th>
              <th class="department-header">优化部门</th>
              <th class="metric-header">合作项目</th>
              <th class="metric-header">合作时间</th>
              <th class="metric-header">合作年份</th>
              <th class="metric-header">上一次合作周期</th>
              <th class="metric-header">服务到期时间</th>
              <th class="metric-header">上一次续费项目</th>
              <th class="metric-header">上一次续费金额</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(group, groupIndex) in groupedRenewalData" :key="groupIndex">
              <tr
                v-for="(customer, customerIndex) in group.customers"
                :key="customer.customerId"
                class="data-row"
              >
                <!-- 优化部门合并单元格 -->
                <td v-if="customerIndex === 0"
                    :rowspan="group.customers.length"
                    class="department-cell">
                  {{ group.department }}
                </td>

                <td class="customer-name">{{ customer.customerName }}</td>
                <td class="metric-value">{{ customer.salesPerson }}</td>
                <td class="department-cell">{{ getDepartmentName(customerIndex) }}</td>
                <td class="metric-value">{{ customer.cooperationProject }}</td>
                <td class="metric-value">{{ customer.cooperationTime }}</td>
                <td class="metric-value">{{ customer.cooperationYear }}</td>
                <td class="metric-value">{{ customer.lastCooperationCycle }}</td>
                <td class="metric-value">{{ customer.serviceExpiryTime }}</td>
                <td class="metric-value">{{ customer.lastRenewalProject }}</td>
                <td class="metric-value amount">{{ formatCurrency(customer.lastRenewalAmount) }}</td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits } from 'vue'
import { ChevronLeft, ChevronRight, Users, DollarSign, TrendingUp, Calendar } from 'lucide-vue-next'

// 接口定义
interface RenewalCustomerData {
  customerId: string
  customerName: string
  salesPerson: string
  optimizationDepartment: string
  cooperationProject: string
  cooperationTime: string
  cooperationYear: string
  lastCooperationCycle: string
  serviceExpiryTime: string
  lastRenewalProject: string
  lastRenewalAmount: number
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

// 模拟续费客户数据
const renewalCustomerData = ref<RenewalCustomerData[]>([
  {
    customerId: '1',
    customerName: '华为技术有限公司',
    salesPerson: '张三',
    optimizationDepartment: 'Google优化部',
    cooperationProject: 'Google Ads推广',
    cooperationTime: '2023-03-15',
    cooperationYear: '2023年',
    lastCooperationCycle: '12个月',
    serviceExpiryTime: '2025-03-15',
    lastRenewalProject: 'Google Ads续费',
    lastRenewalAmount: 520.0
  },
  {
    customerId: '2',
    customerName: '腾讯科技(深圳)有限公司',
    salesPerson: '李四',
    optimizationDepartment: 'Meta优化部',
    cooperationProject: 'Facebook广告投放',
    cooperationTime: '2023-01-10',
    cooperationYear: '2023年',
    lastCooperationCycle: '12个月',
    serviceExpiryTime: '2025-01-10',
    lastRenewalProject: 'Facebook Ads续费',
    lastRenewalAmount: 450.0
  },
  {
    customerId: '3',
    customerName: '阿里巴巴(中国)有限公司',
    salesPerson: '王五',
    optimizationDepartment: 'Criteo优化部',
    cooperationProject: 'Criteo电商推广',
    cooperationTime: '2023-06-01',
    cooperationYear: '2023年',
    lastCooperationCycle: '6个月',
    serviceExpiryTime: '2025-06-01',
    lastRenewalProject: 'Criteo续费',
    lastRenewalAmount: 400.0
  },
  {
    customerId: '4',
    customerName: '百度在线网络技术(北京)有限公司',
    salesPerson: '赵六',
    optimizationDepartment: 'Bing优化部',
    cooperationProject: 'Bing Ads推广',
    cooperationTime: '2023-05-20',
    cooperationYear: '2023年',
    lastCooperationCycle: '12个月',
    serviceExpiryTime: '2025-05-20',
    lastRenewalProject: 'Bing Ads续费',
    lastRenewalAmount: 380.0
  },
  {
    customerId: '5',
    customerName: '京东科技信息技术有限公司',
    salesPerson: '孙七',
    optimizationDepartment: 'Google优化部',
    cooperationProject: 'Google购物广告',
    cooperationTime: '2023-08-10',
    cooperationYear: '2023年',
    lastCooperationCycle: '6个月',
    serviceExpiryTime: '2025-08-10',
    lastRenewalProject: 'Google Shopping续费',
    lastRenewalAmount: 300.0
  },
  {
    customerId: '6',
    customerName: '小米科技有限责任公司',
    salesPerson: '周八',
    optimizationDepartment: 'Meta优化部',
    cooperationProject: 'Instagram推广',
    cooperationTime: '2023-04-25',
    cooperationYear: '2023年',
    lastCooperationCycle: '12个月',
    serviceExpiryTime: '2025-04-25',
    lastRenewalProject: 'Instagram Ads续费',
    lastRenewalAmount: 260.0
  }
])

// 计算属性
const totalRenewalCustomers = computed(() => {
  return renewalCustomerData.value.length
})

const totalRenewalAmount = computed(() => {
  return renewalCustomerData.value.reduce((sum, customer) => sum + customer.lastRenewalAmount, 0)
})

const renewalRate = computed(() => {
  // 简化计算，假设75%的续费率
  return '75.0'
})

const averageRenewalCycle = computed(() => {
  // 基于合作周期计算平均值
  const cycles = renewalCustomerData.value.map(c => parseInt(c.lastCooperationCycle))
  const totalCycles = cycles.reduce((sum, cycle) => sum + cycle, 0)
  return totalRenewalCustomers.value > 0 ? (totalCycles / totalRenewalCustomers.value).toFixed(1) : '0.0'
})

// 按优化部门分组数据
const groupedRenewalData = computed(() => {
  const groups = new Map()

  renewalCustomerData.value.forEach(customer => {
    const department = customer.optimizationDepartment
    if (!groups.has(department)) {
      groups.set(department, {
        department,
        customers: []
      })
    }
    groups.get(department).customers.push(customer)
  })

  return Array.from(groups.values())
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

const getDepartmentName = (index: number): string => {
  const departments = ['运营1部', '运营2部', '运营3部', '运营4部', '运营5部', '运营6部']
  return departments[index % departments.length]
}

const formatCurrency = (value: number) => {
  return value.toFixed(1)
}


</script>

<style scoped>
.renewal-customer-list-module {
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
  display: flex;
  flex-direction: column;
  gap: 24px;
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

.renewal-table-container {
  overflow-x: auto;
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
}

.renewal-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 1200px;
}

.renewal-table th {
  background: #fafafa;
  border: 1px solid #f0f0f0;
  padding: 12px 8px;
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: #595959;
  white-space: nowrap;
}

.renewal-table td {
  border: 1px solid #f0f0f0;
  padding: 12px 8px;
  text-align: center;
  font-size: 13px;
  vertical-align: middle;
  color: #595959;
}

.department-header {
  background: #f0f2f5 !important;
  color: #262626 !important;
  font-weight: 600;
  position: sticky;
  left: 0;
  z-index: 3;
  min-width: 120px;
  text-align: center;
  vertical-align: middle;
}

.customer-header {
  background: #f0f2f5 !important;
  color: #262626 !important;
  font-weight: 600;
  min-width: 180px;
  text-align: center;
  vertical-align: middle;
}

.metric-header {
  background: #f0f2f5 !important;
  color: #262626 !important;
  font-weight: 600;
  min-width: 100px;
}

.data-row:nth-child(even) {
  background: #fafafa;
}

.data-row:hover {
  background: #e6f7ff;
}

.department-cell {
  text-align: center !important;
  font-weight: 600;
  color: #262626 !important;
  background: #f0f2f5 !important;
  position: sticky;
  left: 0;
  z-index: 2;
  min-width: 120px;
  vertical-align: middle;
  border-right: 2px solid #d9d9d9;
}

.customer-name {
  text-align: left !important;
  font-weight: 500;
  color: #262626 !important;
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.metric-value {
  font-weight: 500;
  color: #595959;
}

.metric-value.amount {
  color: #1890ff;
  font-weight: 600;
}


</style>
