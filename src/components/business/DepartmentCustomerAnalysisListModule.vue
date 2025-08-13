<template>
  <div class="department-customer-analysis-list-module">
    <div class="analysis-module__header">
      <h3 class="analysis-module__title">新老客户分析及流失客户分析（部门）</h3>
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
      <div class="analysis-table-container">
        <table class="analysis-table">
          <thead>
            <tr>
              <th rowspan="2" class="year-header">年度</th>
              <th rowspan="2" class="dept-header">员工</th>
              <th colspan="4" class="category-header all-customers">所有客户数据 (包括存量客户和新客户)</th>
              <th colspan="4" class="category-header new-customers">2025新客户 (新客户)</th>
              <th colspan="4" class="category-header added-customers">2025年新增客户</th>
              <th colspan="4" class="category-header churned-customers">2025年流失客户</th>
            </tr>
            <tr>
              <!-- 所有客户数据 -->
              <th class="sub-header all-customers">活跃客户数</th>
              <th class="sub-header all-customers">总毛利</th>
              <th class="sub-header all-customers">服务费</th>
              <th class="sub-header all-customers">返点</th>
              <!-- 2025新客户 -->
              <th class="sub-header new-customers">活跃客户数</th>
              <th class="sub-header new-customers">总毛利</th>
              <th class="sub-header new-customers">服务费</th>
              <th class="sub-header new-customers">返点</th>
              <!-- 2025年新增客户 -->
              <th class="sub-header added-customers">活跃客户数</th>
              <th class="sub-header added-customers">总毛利</th>
              <th class="sub-header added-customers">服务费</th>
              <th class="sub-header added-customers">返点</th>
              <!-- 2025年流失客户 -->
              <th class="sub-header churned-customers">客户数</th>
              <th class="sub-header churned-customers">预估流失毛利贡献</th>
              <th class="sub-header churned-customers">预估流失服务费</th>
              <th class="sub-header churned-customers">预估流失返点</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(dept, index) in displayDepartments" :key="dept.name" class="department-row">
              <td v-if="index === 0" :rowspan="displayDepartments.length" class="year-cell">2025年</td>
              <td class="dept-cell">{{ dept.name }}</td>
              <!-- 所有客户数据 -->
              <td class="data-cell all-customers">{{ dept.data.allCustomers.activeCustomerCount }}</td>
              <td class="data-cell all-customers">{{ formatCurrency(dept.data.allCustomers.totalProfit) }}</td>
              <td class="data-cell all-customers">{{ formatCurrency(dept.data.allCustomers.serviceFee) }}</td>
              <td class="data-cell all-customers">{{ formatCurrency(dept.data.allCustomers.rebate) }}</td>
              <!-- 2025新客户 -->
              <td class="data-cell new-customers">{{ dept.data.newCustomers.activeCustomerCount }}</td>
              <td class="data-cell new-customers">{{ formatCurrency(dept.data.newCustomers.totalProfit) }}</td>
              <td class="data-cell new-customers">{{ formatCurrency(dept.data.newCustomers.serviceFee) }}</td>
              <td class="data-cell new-customers">{{ formatCurrency(dept.data.newCustomers.rebate) }}</td>
              <!-- 2025年新增客户 -->
              <td class="data-cell added-customers">{{ dept.data.newCustomers.activeCustomerCount }}</td>
              <td class="data-cell added-customers">{{ formatCurrency(dept.data.newCustomers.totalProfit) }}</td>
              <td class="data-cell added-customers">{{ formatCurrency(dept.data.newCustomers.serviceFee) }}</td>
              <td class="data-cell added-customers">{{ formatCurrency(dept.data.newCustomers.rebate) }}</td>
              <!-- 2025年流失客户 -->
              <td class="data-cell churned-customers">{{ dept.data.churnedCustomers.customerCount }}</td>
              <td class="data-cell churned-customers">{{ formatCurrency(Math.abs(dept.data.churnedCustomers.estimatedProfitLoss)) }}</td>
              <td class="data-cell churned-customers">{{ formatCurrency(Math.abs(dept.data.churnedCustomers.estimatedServiceFeeLoss)) }}</td>
              <td class="data-cell churned-customers">{{ formatCurrency(Math.abs(dept.data.churnedCustomers.estimatedRebateLoss)) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 占比分析图表 -->
      <div class="proportion-charts-section">
        <div class="chart-container">
          <div class="chart-header">
            <h4 class="chart-title">{{ getChartTitle() }}</h4>
            <div class="chart-toggle">
              <button
                v-for="view in viewTypes"
                :key="view.value"
                class="toggle-btn"
                :class="{ 'toggle-btn--active': currentView === view.value }"
                @click="currentView = view.value"
              >
                {{ view.label }}
              </button>
            </div>
          </div>
          <div class="chart-content">
            <PieChart
              :data="proportionChartData"
              :height="'320px'"
              :donut="true"
              :show-legend="true"
              @click="handleChartClick"
            />
          </div>
        </div>

        <!-- 趋势分析图表 -->
        <div class="chart-container">
          <div class="chart-header">
            <h4 class="chart-title">客户价值贡献对比</h4>
          </div>
          <div class="chart-content">
            <BarChart
              :data="customerValueComparisonData"
              :height="'320px'"
              :show-legend="true"
              :stack="true"
              @click="handleChartClick"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import PieChart from '@/components/charts/PieChart.vue'
import BarChart from '@/components/charts/BarChart.vue'
import type { DepartmentCustomerAnalysis } from '@/types'

interface Props {
  departmentData: DepartmentCustomerAnalysis[]
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<{
  'department-click': [departmentId: string]
  'view-change': [view: string]
  'time-range-change': [timeRange: string]
  'quarter-change': [quarter: string]
  'chart-click': [data: any]
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

// 显示的部门数据
const displayDepartments = computed(() => {
  const departmentNames = ['合计', '员工1', '员工2', '员工3', '员工4']

  return departmentNames.map((name, index) => {
    // 使用现有数据或创建默认数据
    const sourceData = props.departmentData[index] || props.departmentData[0] || {
      customerData: {
        allCustomers: { activeCustomerCount: 0, totalProfit: 0, serviceFee: 0, rebate: 0 },
        newCustomers: { activeCustomerCount: 0, totalProfit: 0, serviceFee: 0, rebate: 0 },
        churnedCustomers: { customerCount: 0, estimatedProfitLoss: 0, estimatedServiceFeeLoss: 0, estimatedRebateLoss: 0 }
      }
    }

    return {
      name,
      data: sourceData.customerData
    }
  })
})

const handleTimeRangeChange = (timeRange: string) => {
  currentTimeRange.value = timeRange
  emit('time-range-change', timeRange)
}

const previousQuarter = () => {
  // 实现季度切换逻辑
  emit('quarter-change', 'previous')
}

const nextQuarter = () => {
  if (!isNextDisabled.value) {
    // 实现季度切换逻辑
    emit('quarter-change', 'next')
  }
}

const formatCurrency = (amount: number) => {
  return `${(amount / 10000).toFixed(1)}万`
}

// 图表相关状态和逻辑
const currentView = ref<'customerCount' | 'profit' | 'serviceFee' | 'rebate'>('customerCount')

const viewTypes = [
  { value: 'customerCount' as const, label: '客户数占比' },
  { value: 'profit' as const, label: '毛利占比' },
  { value: 'serviceFee' as const, label: '服务费占比' },
  { value: 'rebate' as const, label: '返点占比' }
]

// 占比图表数据（基于部门汇总）
const proportionChartData = computed(() => {
  if (!props.departmentData || props.departmentData.length === 0) return []

  // 汇总所有部门数据
  const totalData = props.departmentData.reduce((acc, dept) => {
    acc.allCustomers += dept.customerData.allCustomers.activeCustomerCount
    acc.newCustomers += dept.customerData.newCustomers.activeCustomerCount
    acc.churnedCustomers += dept.customerData.churnedCustomers.customerCount
    acc.allProfit += dept.customerData.allCustomers.totalProfit
    acc.newProfit += dept.customerData.newCustomers.totalProfit
    acc.allServiceFee += dept.customerData.allCustomers.serviceFee
    acc.newServiceFee += dept.customerData.newCustomers.serviceFee
    acc.allRebate += dept.customerData.allCustomers.rebate
    acc.newRebate += dept.customerData.newCustomers.rebate
    return acc
  }, {
    allCustomers: 0,
    newCustomers: 0,
    churnedCustomers: 0,
    allProfit: 0,
    newProfit: 0,
    allServiceFee: 0,
    newServiceFee: 0,
    allRebate: 0,
    newRebate: 0
  })

  let chartData = []

  switch (currentView.value) {
    case 'customerCount':
      const oldCustomers = totalData.allCustomers - totalData.newCustomers
      chartData = [
        { name: '老客户', value: oldCustomers, color: '#1890ff' },
        { name: '新客户', value: totalData.newCustomers, color: '#52c41a' },
        { name: '流失客户', value: totalData.churnedCustomers, color: '#ff4d4f' }
      ]
      break
    case 'profit':
      const oldProfit = totalData.allProfit - totalData.newProfit
      chartData = [
        { name: '老客户', value: oldProfit, color: '#1890ff' },
        { name: '新客户', value: totalData.newProfit, color: '#52c41a' }
      ]
      break
    case 'serviceFee':
      const oldServiceFee = totalData.allServiceFee - totalData.newServiceFee
      chartData = [
        { name: '老客户', value: oldServiceFee, color: '#1890ff' },
        { name: '新客户', value: totalData.newServiceFee, color: '#52c41a' }
      ]
      break
    case 'rebate':
      const oldRebate = totalData.allRebate - totalData.newRebate
      chartData = [
        { name: '老客户', value: oldRebate, color: '#1890ff' },
        { name: '新客户', value: totalData.newRebate, color: '#52c41a' }
      ]
      break
  }

  return chartData.filter(item => item.value > 0)
})

// 客户价值对比数据
const customerValueComparisonData = computed(() => {
  if (!props.departmentData || props.departmentData.length === 0) return { labels: [], datasets: [] }

  // 汇总所有部门数据
  const totalData = props.departmentData.reduce((acc, dept) => {
    acc.allProfit += dept.customerData.allCustomers.totalProfit
    acc.newProfit += dept.customerData.newCustomers.totalProfit
    acc.allServiceFee += dept.customerData.allCustomers.serviceFee
    acc.newServiceFee += dept.customerData.newCustomers.serviceFee
    acc.allRebate += dept.customerData.allCustomers.rebate
    acc.newRebate += dept.customerData.newCustomers.rebate
    return acc
  }, {
    allProfit: 0,
    newProfit: 0,
    allServiceFee: 0,
    newServiceFee: 0,
    allRebate: 0,
    newRebate: 0
  })

  const oldProfit = totalData.allProfit - totalData.newProfit
  const oldServiceFee = totalData.allServiceFee - totalData.newServiceFee
  const oldRebate = totalData.allRebate - totalData.newRebate

  return {
    labels: ['老客户', '新客户'],
    datasets: [
      {
        label: '毛利 (万)',
        data: [oldProfit / 10000, totalData.newProfit / 10000],
        color: '#1890ff'
      },
      {
        label: '服务费 (万)',
        data: [oldServiceFee / 10000, totalData.newServiceFee / 10000],
        color: '#52c41a'
      },
      {
        label: '返点 (万)',
        data: [oldRebate / 10000, totalData.newRebate / 10000],
        color: '#fa8c16'
      }
    ]
  }
})

const handleChartClick = (params: any) => {
  emit('chart-click', params)
}

const getChartTitle = () => {
  const titles = {
    customerCount: '客户数量占比',
    profit: '毛利贡献占比',
    serviceFee: '服务费占比',
    rebate: '返点占比'
  }
  return titles[currentView.value] || '占比分析'
}
</script>

<style scoped>
.department-customer-analysis-list-module {
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

.analysis-table-container {
  overflow-x: auto;
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
}

.analysis-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  min-width: 1400px;
}

.analysis-table th {
  background: #fafafa;
  border: 1px solid #f0f0f0;
  padding: 12px 8px;
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: #595959;
  white-space: nowrap;
}

.analysis-table td {
  border: 1px solid #f0f0f0;
  padding: 12px 8px;
  text-align: center;
  font-size: 13px;
  vertical-align: middle;
  color: #595959;
}

.year-header {
  background: #f0f2f5 !important;
  color: #262626 !important;
  font-weight: 600;
  width: 80px;
  min-width: 80px;
  text-align: center;
}

.dept-header {
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

.category-header.all-customers {
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

.category-header.added-customers {
  background: #fff7e6 !important;
  color: #faad14 !important;
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

.sub-header.all-customers {
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

.sub-header.added-customers {
  background: #fff7e6 !important;
  color: #faad14 !important;
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

.year-cell {
  background: #f0f2f5 !important;
  color: #262626 !important;
  font-weight: 600;
  text-align: center;
  width: 80px;
  min-width: 80px;
  vertical-align: middle;
}

.dept-cell {
  background: #f0f2f5 !important;
  color: #262626 !important;
  font-weight: 600;
  position: sticky;
  left: 0;
  z-index: 2;
  text-align: left !important;
  min-width: 120px;
}

.data-cell.all-customers {
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

.data-cell.added-customers {
  background: #fffbf0 !important;
  color: #faad14 !important;
  font-weight: 500;
  text-align: center;
  min-width: 80px;
}

.data-cell.churned-customers {
  background: #fff7f6 !important;
  color: #ff4d4f !important;
  font-weight: 500;
  text-align: center;
  min-width: 80px;
}

.department-row:hover {
  background: #f0f8ff !important;
}

.department-row:hover .data-cell {
  background: #f0f8ff !important;
}

/* 图表区域 */
.proportion-charts-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
}

.chart-container {
  background: #fafafa;
  border-radius: 8px;
  padding: 20px;
}

.chart-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #262626;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.chart-toggle {
  display: flex;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  overflow: hidden;
}

.toggle-btn {
  padding: 6px 12px;
  background: #fff;
  border: none;
  color: #595959;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.toggle-btn:hover {
  background: #f5f5f5;
}

.toggle-btn--active {
  background: #1890ff;
  color: #fff;
}

.chart-content {
  background: #fff;
  border-radius: 6px;
  padding: 16px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .department-customer-analysis-list-module {
    padding: 16px;
  }

  .analysis-module__header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .analysis-table-container {
    margin: 0 -16px;
  }

  .proportion-charts-section {
    grid-template-columns: 1fr;
  }
}
</style>
