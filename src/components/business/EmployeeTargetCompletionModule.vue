<template>
  <div class="employee-target-completion-module">
    <div class="target-completion-module__header">
      <h3 class="target-completion-module__title">项目部员工目标完成情况</h3>
      <div class="target-completion-module__controls">
        <TimeRangePicker
          v-model="selectedTimeRange"
          @change="handleTimeRangeChange"
        />
      </div>
    </div>

    <div class="target-completion-module__content">
      <!-- 目标情况卡片 -->
      <div class="target-metrics-cards">
        <div class="metric-card">
          <div class="metric-icon">
            <div class="icon-container projects-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" stroke-width="2"/>
                <path d="M7 8h10M7 12h6" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
          </div>
          <div class="metric-content">
            <div class="metric-label">项目总数</div>
            <div class="metric-value">{{ totalEmployeeProjects }}<span class="metric-unit">↑</span></div>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-icon">
            <div class="icon-container percentage-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M19 5L5 19M8.5 5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zM18.5 19a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
          </div>
          <div class="metric-content">
            <div class="metric-label">项目返点总数</div>
            <div class="metric-value">{{ formatCurrency(totalEmployeeRebateAmount) }}<span class="metric-unit">$</span></div>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-icon">
            <div class="icon-container service-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
                <path d="M12 1v6m0 6v6" stroke="currentColor" stroke-width="2"/>
                <path d="M21 12h-6m-6 0H3" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
          </div>
          <div class="metric-content">
            <div class="metric-label">项目总服务费</div>
            <div class="metric-value">{{ formatCurrency(totalEmployeeServiceFeeAmount) }}<span class="metric-unit">$</span></div>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-icon">
            <div class="icon-container profit-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" stroke-width="2"/>
                <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
          </div>
          <div class="metric-content">
            <div class="metric-label">项目总毛利</div>
            <div class="metric-value">{{ formatCurrency(totalEmployeeProfitAmount) }}<span class="metric-unit">$</span></div>
          </div>
        </div>
      </div>

      <!-- 员工目标完成表格 -->
      <div class="employee-targets-table-container">
        <table class="employee-targets-table">
          <thead>
            <tr>
              <th rowspan="2" class="department-header">部门</th>
              <th rowspan="2" class="employee-header">员工</th>
              <th colspan="3" class="target-group-header">目标</th>
              <th colspan="3" class="completion-group-header">实际完成</th>
              <th colspan="3" class="rate-group-header">完成率</th>
              <th colspan="2" class="difference-group-header">完成差值</th>
            </tr>
            <tr>
              <th class="target-header">合计毛利</th>
              <th class="target-header">服务费目标</th>
              <th class="target-header">返点目标</th>
              <th class="completion-header">合计毛利完成</th>
              <th class="completion-header">服务费完成</th>
              <th class="completion-header">返点完成</th>
              <th class="rate-header">总毛利率</th>
              <th class="rate-header">服务费率</th>
              <th class="rate-header">返点率</th>
              <th class="difference-header">服务费差</th>
              <th class="difference-header">返点差</th>
            </tr>
          </thead>
          <tbody>
            <!-- 运营部门员工 -->
            <tr v-for="(employee, index) in employeeData" :key="employee.employeeId" class="employee-row">
              <td v-if="isFirstInDepartment(index)" :rowspan="getDepartmentEmployeeCount(employee.departmentId)" class="department-cell">
                {{ getDepartmentName(employee.departmentId) }}
              </td>
              <td class="employee-cell">{{ employee.employeeName }}</td>
              <td class="target-cell">{{ formatCurrency(employee.targets.totalProfitTarget) }}</td>
              <td class="target-cell">{{ formatCurrency(employee.targets.serviceFeeTarget) }}</td>
              <td class="target-cell">{{ formatCurrency(employee.targets.rebateTarget) }}</td>
              <td class="completion-cell">{{ formatCurrency(employee.achievements.totalProfitActual) }}</td>
              <td class="completion-cell">{{ formatCurrency(employee.achievements.serviceFeeActual) }}</td>
              <td class="completion-cell">{{ formatCurrency(employee.achievements.rebateActual) }}</td>
              <td class="rate-cell" :class="getCompletionClass(employee.achievements.totalProfitRate)">{{ employee.achievements.totalProfitRate.toFixed(1) }}%</td>
              <td class="rate-cell" :class="getCompletionClass(employee.achievements.serviceFeeRate)">{{ employee.achievements.serviceFeeRate.toFixed(1) }}%</td>
              <td class="rate-cell" :class="getCompletionClass(employee.achievements.rebateRate)">{{ employee.achievements.rebateRate.toFixed(1) }}%</td>
              <td class="difference-cell" :class="getDifferenceClass(employee.achievements.serviceFeeActual - employee.targets.serviceFeeTarget)">{{ formatCurrencyDifference(employee.achievements.serviceFeeActual - employee.targets.serviceFeeTarget) }}</td>
              <td class="difference-cell" :class="getDifferenceClass(employee.achievements.rebateActual - employee.targets.rebateTarget)">{{ formatCurrencyDifference(employee.achievements.rebateActual - employee.targets.rebateTarget) }}</td>
            </tr>
          </tbody>
        </table>
      </div>



    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import PieChart from '@/components/charts/PieChart.vue'
import TimeRangePicker from './TimeRangePicker.vue'
import type { TimeRange } from '@/types'

interface EmployeeTargetData {
  employeeId: string
  employeeName: string
  departmentId: string
  targets: {
    totalProfitTarget: number
    serviceFeeTarget: number
    rebateTarget: number
  }
  achievements: {
    totalProfitActual: number
    totalProfitGap: number
    totalProfitRate: number
    serviceFeeActual: number
    serviceFeeGap: number
    serviceFeeRate: number
    rebateActual: number
    rebateGap: number
    rebateRate: number
  }
}

interface Props {
  employeeTargets?: EmployeeTargetData[]
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  employeeTargets: () => [],
  loading: false
})

const emit = defineEmits<{
  'time-range-change': [timeRange: TimeRange]
  'employee-click': [employeeId: string]
}>()

const selectedTimeRange = ref<TimeRange>({
  type: 'quick',
  startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
  endDate: new Date().toISOString().split('T')[0],
  period: 'quarterly',
  label: '本年度'
})

const currentChartType = ref<'profit' | 'serviceFee' | 'rebate'>('profit')
const currentCompletionChartType = ref<'profit' | 'serviceFee' | 'rebate'>('profit')

const chartTypes = [
  { value: 'profit' as const, label: '毛利' },
  { value: 'serviceFee' as const, label: '服务费' },
  { value: 'rebate' as const, label: '返点' }
]

// Mock employee data - this would normally come from props or API
const employeeData = ref<EmployeeTargetData[]>([
  // 运营一部-燕琴
  {
    employeeId: 'emp-001',
    employeeName: '员工 1',
    departmentId: 'ops-001',
    targets: { totalProfitTarget: 1000000, serviceFeeTarget: 700000, rebateTarget: 300000 },
    achievements: { totalProfitActual: 950000, totalProfitGap: -50000, totalProfitRate: 95.0, serviceFeeActual: 665000, serviceFeeGap: -35000, serviceFeeRate: 95.0, rebateActual: 285000, rebateGap: -15000, rebateRate: 95.0 }
  },
  {
    employeeId: 'emp-002',
    employeeName: '员工 2',
    departmentId: 'ops-001',
    targets: { totalProfitTarget: 800000, serviceFeeTarget: 560000, rebateTarget: 240000 },
    achievements: { totalProfitActual: 760000, totalProfitGap: -40000, totalProfitRate: 95.0, serviceFeeActual: 532000, serviceFeeGap: -28000, serviceFeeRate: 95.0, rebateActual: 228000, rebateGap: -12000, rebateRate: 95.0 }
  },
  {
    employeeId: 'emp-003',
    employeeName: '员工 3',
    departmentId: 'ops-001',
    targets: { totalProfitTarget: 750000, serviceFeeTarget: 525000, rebateTarget: 225000 },
    achievements: { totalProfitActual: 712500, totalProfitGap: -37500, totalProfitRate: 95.0, serviceFeeActual: 498750, serviceFeeGap: -26250, serviceFeeRate: 95.0, rebateActual: 213750, rebateGap: -11250, rebateRate: 95.0 }
  },
  {
    employeeId: 'emp-004',
    employeeName: '员工 4',
    departmentId: 'ops-001',
    targets: { totalProfitTarget: 600000, serviceFeeTarget: 420000, rebateTarget: 180000 },
    achievements: { totalProfitActual: 570000, totalProfitGap: -30000, totalProfitRate: 95.0, serviceFeeActual: 399000, serviceFeeGap: -21000, serviceFeeRate: 95.0, rebateActual: 171000, rebateGap: -9000, rebateRate: 95.0 }
  },
  {
    employeeId: 'emp-005',
    employeeName: '员工 5',
    departmentId: 'ops-001',
    targets: { totalProfitTarget: 850000, serviceFeeTarget: 595000, rebateTarget: 255000 },
    achievements: { totalProfitActual: 807500, totalProfitGap: -42500, totalProfitRate: 95.0, serviceFeeActual: 565250, serviceFeeGap: -29750, serviceFeeRate: 95.0, rebateActual: 242250, rebateGap: -12750, rebateRate: 95.0 }
  },
  // 运营二部-李明
  {
    employeeId: 'emp-006',
    employeeName: '员工 6',
    departmentId: 'ops-002',
    targets: { totalProfitTarget: 900000, serviceFeeTarget: 630000, rebateTarget: 270000 },
    achievements: { totalProfitActual: 855000, totalProfitGap: -45000, totalProfitRate: 95.0, serviceFeeActual: 598500, serviceFeeGap: -31500, serviceFeeRate: 95.0, rebateActual: 256500, rebateGap: -13500, rebateRate: 95.0 }
  },
  {
    employeeId: 'emp-007',
    employeeName: '员工 7',
    departmentId: 'ops-002',
    targets: { totalProfitTarget: 700000, serviceFeeTarget: 490000, rebateTarget: 210000 },
    achievements: { totalProfitActual: 665000, totalProfitGap: -35000, totalProfitRate: 95.0, serviceFeeActual: 465500, serviceFeeGap: -24500, serviceFeeRate: 95.0, rebateActual: 199500, rebateGap: -10500, rebateRate: 95.0 }
  },
  {
    employeeId: 'emp-008',
    employeeName: '员工 8',
    departmentId: 'ops-002',
    targets: { totalProfitTarget: 650000, serviceFeeTarget: 455000, rebateTarget: 195000 },
    achievements: { totalProfitActual: 617500, totalProfitGap: -32500, totalProfitRate: 95.0, serviceFeeActual: 432250, serviceFeeGap: -22750, serviceFeeRate: 95.0, rebateActual: 185250, rebateGap: -9750, rebateRate: 95.0 }
  },
  {
    employeeId: 'emp-009',
    employeeName: '员工 9',
    departmentId: 'ops-002',
    targets: { totalProfitTarget: 750000, serviceFeeTarget: 525000, rebateTarget: 225000 },
    achievements: { totalProfitActual: 712500, totalProfitGap: -37500, totalProfitRate: 95.0, serviceFeeActual: 498750, serviceFeeGap: -26250, serviceFeeRate: 95.0, rebateActual: 213750, rebateGap: -11250, rebateRate: 95.0 }
  },
  {
    employeeId: 'emp-010',
    employeeName: '员工 10',
    departmentId: 'ops-002',
    targets: { totalProfitTarget: 500000, serviceFeeTarget: 350000, rebateTarget: 150000 },
    achievements: { totalProfitActual: 475000, totalProfitGap: -25000, totalProfitRate: 95.0, serviceFeeActual: 332500, serviceFeeGap: -17500, serviceFeeRate: 95.0, rebateActual: 142500, rebateGap: -7500, rebateRate: 95.0 }
  },
  // 运营三部-张伟
  {
    employeeId: 'emp-011',
    employeeName: '员工 11',
    departmentId: 'ops-003',
    targets: { totalProfitTarget: 800000, serviceFeeTarget: 560000, rebateTarget: 240000 },
    achievements: { totalProfitActual: 760000, totalProfitGap: -40000, totalProfitRate: 95.0, serviceFeeActual: 532000, serviceFeeGap: -28000, serviceFeeRate: 95.0, rebateActual: 228000, rebateGap: -12000, rebateRate: 95.0 }
  },
  {
    employeeId: 'emp-012',
    employeeName: '员工 12',
    departmentId: 'ops-003',
    targets: { totalProfitTarget: 720000, serviceFeeTarget: 504000, rebateTarget: 216000 },
    achievements: { totalProfitActual: 684000, totalProfitGap: -36000, totalProfitRate: 95.0, serviceFeeActual: 478800, serviceFeeGap: -25200, serviceFeeRate: 95.0, rebateActual: 205200, rebateGap: -10800, rebateRate: 95.0 }
  },
  {
    employeeId: 'emp-013',
    employeeName: '员工 13',
    departmentId: 'ops-003',
    targets: { totalProfitTarget: 680000, serviceFeeTarget: 476000, rebateTarget: 204000 },
    achievements: { totalProfitActual: 646000, totalProfitGap: -34000, totalProfitRate: 95.0, serviceFeeActual: 452200, serviceFeeGap: -23800, serviceFeeRate: 95.0, rebateActual: 193800, rebateGap: -10200, rebateRate: 95.0 }
  },
  {
    employeeId: 'emp-014',
    employeeName: '员工 14',
    departmentId: 'ops-003',
    targets: { totalProfitTarget: 600000, serviceFeeTarget: 420000, rebateTarget: 180000 },
    achievements: { totalProfitActual: 570000, totalProfitGap: -30000, totalProfitRate: 95.0, serviceFeeActual: 399000, serviceFeeGap: -21000, serviceFeeRate: 95.0, rebateActual: 171000, rebateGap: -9000, rebateRate: 95.0 }
  }
])

// 员工卡片数据计算
const totalEmployeeProjects = computed(() => 445)

const totalEmployeeRebateAmount = computed(() => {
  return employeeData.value.reduce((sum, emp) => sum + emp.achievements.rebateActual, 0)
})

const totalEmployeeServiceFeeAmount = computed(() => {
  return employeeData.value.reduce((sum, emp) => sum + emp.achievements.serviceFeeActual, 0)
})

const totalEmployeeProfitAmount = computed(() => {
  return employeeData.value.reduce((sum, emp) => sum + emp.achievements.totalProfitActual, 0)
})

// 目标分配占比数据
const targetDistributionData = computed(() => {
  return employeeData.value.map((emp) => ({
    name: emp.employeeName,
    value: currentChartType.value === 'profit'
      ? emp.targets.totalProfitTarget
      : currentChartType.value === 'serviceFee'
        ? emp.targets.serviceFeeTarget
        : emp.targets.rebateTarget,
    color: getEmployeeColor(emp.employeeId)
  }))
})

// 完成情况占比数据
const completionDistributionData = computed(() => {
  return employeeData.value.map((emp) => ({
    name: emp.employeeName,
    value: currentCompletionChartType.value === 'profit'
      ? emp.achievements.totalProfitActual
      : currentCompletionChartType.value === 'serviceFee'
        ? emp.achievements.serviceFeeActual
        : emp.achievements.rebateActual,
    color: getEmployeeColor(emp.employeeId)
  }))
})

// 方法
const handleTimeRangeChange = (timeRange: TimeRange) => {
  selectedTimeRange.value = timeRange
  emit('time-range-change', timeRange)
}

const handleChartClick = (params: unknown) => {
  const clickParams = params as { name?: string }
  if (clickParams && clickParams.name) {
    const employee = employeeData.value.find(emp => emp.employeeName === clickParams.name)
    if (employee) {
      emit('employee-click', employee.employeeId)
    }
  }
}

const getDepartmentName = (departmentId: string): string => {
  const departmentNames: Record<string, string> = {
    'ops-001': '运营一部-燕琴',
    'ops-002': '运营二部-李明',
    'ops-003': '运营三部-张伟'
  }
  return departmentNames[departmentId] || departmentId
}

const isFirstInDepartment = (index: number): boolean => {
  if (index === 0) return true
  return employeeData.value[index].departmentId !== employeeData.value[index - 1].departmentId
}

const getDepartmentEmployeeCount = (departmentId: string): number => {
  return employeeData.value.filter(emp => emp.departmentId === departmentId).length
}

const formatCurrency = (value: number): string => {
  if (value >= 100000000) {
    return `$${(value / 100000000).toFixed(2)}亿`
  } else if (value >= 10000) {
    return `$${(value / 10000).toFixed(2)}万`
  } else {
    return `$${value.toLocaleString()}`
  }
}

const formatCompletionChartTotal = () => {
  const total = employeeData.value.reduce((sum, emp) => {
    return sum + (currentCompletionChartType.value === 'profit'
      ? emp.achievements.totalProfitActual
      : currentCompletionChartType.value === 'serviceFee'
        ? emp.achievements.serviceFeeActual
        : emp.achievements.rebateActual)
  }, 0)
  return formatCurrency(total)
}

const getEmployeeColor = (employeeId: string) => {
  const colors = ['#1890ff', '#52c41a', '#fa8c16', '#722ed1', '#13c2c2', '#eb2f96', '#f759ab', '#597ef7', '#36cfc9', '#73d13d', '#ffc53d', '#ff7a45']
  const index = employeeData.value.findIndex(emp => emp.employeeId === employeeId)
  return colors[index % colors.length]
}

const getCompletionClass = (rate: number) => {
  if (rate >= 100) return 'excellent'
  if (rate >= 80) return 'good'
  if (rate >= 60) return 'average'
  return 'poor'
}

const formatCurrencyDifference = (value: number): string => {
  const prefix = value >= 0 ? '+' : ''
  if (Math.abs(value) >= 100000000) {
    return `${prefix}${(value / 100000000).toFixed(2)}亿`
  } else if (Math.abs(value) >= 10000) {
    return `${prefix}${(value / 10000).toFixed(2)}万`
  } else {
    return `${prefix}${value.toLocaleString()}`
  }
}

const getDifferenceClass = (difference: number) => {
  if (difference > 0) return 'positive'
  if (difference < 0) return 'negative'
  return 'neutral'
}
</script>

<style scoped>
.employee-target-completion-module {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-bottom: 24px;
}

.target-completion-module__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.target-completion-module__title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #262626;
}

.target-completion-module__content {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* 目标情况卡片样式 */
.target-metrics-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}

.metric-card {
  background: linear-gradient(135deg, #e8f4fd 0%, #f0f8ff 100%);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  border: 1px solid #e1f0fe;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(24, 144, 255, 0.12);
}

.metric-card:nth-child(1) {
  background: linear-gradient(135deg, #e8f4fd 0%, #f0f8ff 100%);
  border-color: #91d5ff;
}

.metric-card:nth-child(2) {
  background: linear-gradient(135deg, #f6ffed 0%, #f9ffef 100%);
  border-color: #b7eb8f;
}

.metric-card:nth-child(3) {
  background: linear-gradient(135deg, #fff7e6 0%, #fffbf0 100%);
  border-color: #ffd591;
}

.metric-card:nth-child(4) {
  background: linear-gradient(135deg, #f9f0ff 0%, #faf5ff 100%);
  border-color: #d3adf7;
}

.metric-icon {
  flex-shrink: 0;
}

.icon-container {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.projects-icon {
  background: linear-gradient(135deg, #1890ff 0%, #40a9ff 100%);
}

.percentage-icon {
  background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
}

.service-icon {
  background: linear-gradient(135deg, #fa8c16 0%, #ffa940 100%);
}

.profit-icon {
  background: linear-gradient(135deg, #722ed1 0%, #9254de 100%);
}

.metric-content {
  flex: 1;
  min-width: 0;
}

.metric-label {
  font-size: 14px;
  color: #595959;
  margin-bottom: 4px;
  font-weight: 500;
}

.metric-value {
  font-size: 24px;
  font-weight: 700;
  color: #262626;
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.metric-unit {
  font-size: 14px;
  color: #52c41a;
  font-weight: 600;
}

.metric-card:nth-child(1) .metric-unit {
  color: #1890ff;
}

.metric-card:nth-child(2) .metric-unit {
  color: #52c41a;
}

.metric-card:nth-child(3) .metric-unit {
  color: #fa8c16;
}

.metric-card:nth-child(4) .metric-unit {
  color: #722ed1;
}

/* 员工目标表格 */
.employee-targets-table-container {
  overflow-x: auto;
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
}

.employee-targets-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  min-width: 1400px;
}

.employee-targets-table th {
  background: #fafafa;
  border: 1px solid #f0f0f0;
  padding: 12px 8px;
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: #595959;
}

.employee-targets-table td {
  border: 1px solid #f0f0f0;
  padding: 12px 8px;
  text-align: center;
  font-size: 13px;
  vertical-align: middle;
}

.employee-row:hover {
  background: #f0f8ff !important;
}

/* 部门分组边界样式 */
.employee-row:nth-child(6) td {
  border-top: 3px solid #1890ff !important;
}

.employee-row:nth-child(11) td {
  border-top: 3px solid #1890ff !important;
}

/* 表头样式 */
.department-header,
.employee-header {
  background: #f0f2f5 !important;
  color: #262626 !important;
  font-weight: 600;
}

.target-group-header {
  background: #e6f7ff !important;
  color: #1890ff !important;
  font-weight: 600;
}

.completion-group-header {
  background: #f6ffed !important;
  color: #52c41a !important;
  font-weight: 600;
}

.rate-group-header {
  background: #fff7e6 !important;
  color: #faad14 !important;
  font-weight: 600;
}

.difference-group-header {
  background: #f9f0ff !important;
  color: #722ed1 !important;
  font-weight: 600;
}

.target-header {
  background: #e6f7ff !important;
  color: #1890ff !important;
  font-weight: 600;
}

.completion-header {
  background: #f6ffed !important;
  color: #52c41a !important;
  font-weight: 600;
}

.rate-header {
  background: #fff7e6 !important;
  color: #faad14 !important;
  font-weight: 600;
}

.difference-header {
  background: #f9f0ff !important;
  color: #722ed1 !important;
  font-weight: 600;
}

/* 数据单元格样式 */
.department-cell {
  background: #f0f2f5 !important;
  color: #262626 !important;
  font-weight: 600;
  text-align: left !important;
  vertical-align: middle;
  border-right: 3px solid #d9d9d9 !important;
  position: relative;
}

.department-cell::after {
  content: '';
  position: absolute;
  right: -3px;
  top: 0;
  bottom: 0;
  width: 3px;
  background: #1890ff;
}

.employee-cell {
  background: #f8f8f8 !important;
  color: #262626 !important;
  font-weight: 500;
  text-align: left !important;
}

.target-cell {
  background: #f0f8ff !important;
  color: #1890ff !important;
  font-weight: 500;
}

.completion-cell {
  background: #f6ffed !important;
  color: #52c41a !important;
  font-weight: 500;
}

.rate-cell {
  background: #fffbf0 !important;
  font-weight: 600;
}

.difference-cell {
  background: #fafafa !important;
  font-weight: 500;
}

/* 完成率颜色样式 */
.rate-cell.excellent {
  color: #52c41a !important;
}

.rate-cell.good {
  color: #1890ff !important;
}

.rate-cell.average {
  color: #faad14 !important;
}

.rate-cell.poor {
  color: #ff4d4f !important;
}

/* 完成差值颜色样式 */
.difference-cell.positive {
  color: #52c41a !important;
  font-weight: 600;
}

.difference-cell.negative {
  color: #ff4d4f !important;
  font-weight: 600;
}

.difference-cell.neutral {
  color: #8c8c8c !important;
  font-weight: 500;
}

/* 分布分析 */
.distribution-analysis-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
}

.chart-container {
  background: #fafafa;
  border-radius: 8px;
  padding: 20px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.chart-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #262626;
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

.chart-total {
  font-size: 14px;
  font-weight: 600;
  color: #1890ff;
}

.chart-content {
  background: #fff;
  border-radius: 6px;
  padding: 16px;
}

@media (max-width: 1200px) {
  .target-metrics-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .employee-target-completion-module {
    padding: 16px;
  }

  .target-completion-module__header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .target-metrics-cards {
    grid-template-columns: 1fr;
  }

  .distribution-analysis-section {
    grid-template-columns: 1fr;
  }

  .chart-header {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }

  .chart-toggle {
    justify-content: center;
  }
}
</style>
