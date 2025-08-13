

<template>
  <div class="sales-director-dashboard">
    <!-- 页面头部 -->
    <div class="dashboard-header">
      <div class="dashboard-header__left">
        <h1 class="dashboard-title">项目经理看板</h1>
        <p class="dashboard-subtitle">管理部门项目，协调团队资源</p>
      </div>

      <div class="dashboard-header__right">
        <RoleSwitcher
          :current-role="currentRole"
          :available-roles="availableRoles"
          @role-change="handleRoleChange"
        />
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>正在加载数据...</p>
    </div>

    <!-- 主要内容 -->
    <div v-else class="dashboard-content">


        <!-- 核心指标概览 -->
    <div class="dashboard-section">
      <div class="section-header">
        <h2 class="section-title">部门运营目标完成（总计）</h2>
        <ModuleTimeFilter
          :initial-time-range="selectedTimeRange"
          :initial-quarter="currentQuarter"
          @time-range-change="handleTimeRangeChange"
          @quarter-change="handleQuarterChange"
        />
      </div>

                  <!-- 目标卡片 -->
      <div v-if="annualQuarterlyTargets" class="target-cards-container">
        <!-- 服务费目标卡片 -->
        <div class="target-card service-fee-card">
          <div class="card-icon">
            <DollarSign :size="20" />
          </div>
          <div class="card-content">
            <div class="card-title">服务费目标</div>
            <div class="card-period">{{ selectedTimeRange === 'year' ? annualQuarterlyTargets.year + '年度' : currentQuarter }}</div>
            <div class="card-value">{{ formatCurrency(getCurrentTargetData().serviceFeeTarget) }}</div>
            <div class="card-subtitle">
              已完成: {{ formatCurrency(getCurrentTargetData().serviceFeeActual) }}
              <span class="completion-rate" :class="getCompletionClass(getCurrentTargetData().serviceFeeCompletion)">
                {{ getCurrentTargetData().serviceFeeCompletion }}%
              </span>
            </div>
          </div>
        </div>

        <!-- 新单目标卡片 -->
        <div class="target-card new-order-card">
          <div class="card-icon">
            <TrendingUp :size="20" />
          </div>
          <div class="card-content">
            <div class="card-title">新单目标</div>
            <div class="card-period">{{ selectedTimeRange === 'year' ? annualQuarterlyTargets.year + '年度' : currentQuarter }}</div>
            <div class="card-value">{{ getCurrentTargetData().newOrderTarget }}单</div>
            <div class="card-subtitle">
              已完成: {{ getCurrentTargetData().newOrderActual }}单
              <span class="completion-rate" :class="getCompletionClass(getCurrentTargetData().newOrderCompletion)">
                {{ getCurrentTargetData().newOrderCompletion }}%
              </span>
            </div>
          </div>
        </div>

        <!-- 综合完成率卡片 -->
        <div class="target-card completion-rate-card">
          <div class="card-icon">
            <TrendingUp :size="20" />
          </div>
          <div class="card-content">
            <div class="card-title">综合完成率</div>
            <div class="card-period">{{ selectedTimeRange === 'year' ? annualQuarterlyTargets.year + '年度' : currentQuarter }}</div>
            <div class="card-value">{{ Math.round((getCurrentTargetData().serviceFeeCompletion + getCurrentTargetData().newOrderCompletion) / 2 * 10) / 10 }}%</div>
            <div class="card-subtitle">
              服务费: {{ getCurrentTargetData().serviceFeeCompletion }}%
              <span class="separator">新单: {{ getCurrentTargetData().newOrderCompletion }}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 年度和季度目标表格 -->
      <div v-if="annualQuarterlyTargets" class="annual-quarterly-targets">
        <div class="targets-table-container">
          <table class="targets-table">
            <thead>
              <tr>
                <th rowspan="2">年度</th>
                <th rowspan="2">季度</th>
                <th colspan="3" class="target-group-header">目标</th>
                <th colspan="4" class="completion-group-header">实际完成</th>
                <th colspan="3" class="comparison-group-header">完成对比</th>
                <th colspan="3" class="baseline-group-header">完成差值</th>
              </tr>
                          <tr>
              <th class="target-header">合计毛利</th>
              <th class="target-header">服务费目标</th>
              <th class="target-header">返点目标</th>
              <th class="completion-header">会计完成毛利</th>
              <th class="completion-header">服务费完成</th>
              <th class="completion-header">返点完成</th>
              <th class="completion-header">合计毛利</th>
              <th class="comparison-header">总毛利完成</th>
              <th class="comparison-header">服务费完成</th>
              <th class="comparison-header">返点完成</th>
              <th class="baseline-header">总毛利差值</th>
              <th class="baseline-header">服务费差值</th>
              <th class="baseline-header">返点差值</th>
            </tr>
            </thead>
            <tbody>
              <!-- 年度总计行 -->
              <tr class="annual-row">
                <td rowspan="5">{{ annualQuarterlyTargets.year }}年</td>
                <td>{{ annualQuarterlyTargets.year }}年</td>
                <td class="target-cell">{{ formatCurrency(annualQuarterlyTargets.yearlyTarget.serviceFeeTarget * 1.25) }}</td>
                <td class="target-cell">{{ formatCurrency(annualQuarterlyTargets.yearlyTarget.serviceFeeTarget) }}</td>
                <td class="target-cell">{{ formatCurrency(annualQuarterlyTargets.yearlyTarget.serviceFeeTarget * 0.05) }}</td>
                <td class="completion-cell">{{ formatCurrency(annualQuarterlyTargets.yearlyTarget.serviceFeeActual * 1.2) }}</td>
                <td class="completion-cell">{{ formatCurrency(annualQuarterlyTargets.yearlyTarget.serviceFeeActual) }}</td>
                <td class="completion-cell">{{ formatCurrency(annualQuarterlyTargets.yearlyTarget.serviceFeeActual * 0.05) }}</td>
                <td class="completion-cell">{{ formatCurrency(annualQuarterlyTargets.yearlyTarget.serviceFeeActual * 1.25) }}</td>
                <td class="comparison-cell">{{ (annualQuarterlyTargets.yearlyTarget.serviceFeeCompletion * 1.2).toFixed(1) }}%</td>
                <td class="comparison-cell">{{ annualQuarterlyTargets.yearlyTarget.serviceFeeCompletion }}%</td>
                <td class="comparison-cell">{{ (annualQuarterlyTargets.yearlyTarget.serviceFeeCompletion * 0.05).toFixed(1) }}%</td>
                <td class="baseline-cell">{{ (annualQuarterlyTargets.yearlyTarget.serviceFeeCompletion * 1.2).toFixed(1) }}%</td>
                <td class="baseline-cell">{{ annualQuarterlyTargets.yearlyTarget.serviceFeeCompletion }}%</td>
                <td class="baseline-cell">{{ (annualQuarterlyTargets.yearlyTarget.serviceFeeCompletion * 0.05).toFixed(1) }}%</td>
              </tr>
              <!-- 季度行 -->
              <tr v-for="quarter in annualQuarterlyTargets.quarters" :key="quarter.quarter" class="quarterly-row">
                <td>{{ quarter.quarter }}季度</td>
                <td class="target-cell">{{ formatCurrency(quarter.serviceFeeTarget * 1.25) }}</td>
                <td class="target-cell">{{ formatCurrency(quarter.serviceFeeTarget) }}</td>
                <td class="target-cell">{{ formatCurrency(quarter.serviceFeeTarget * 0.05) }}</td>
                <td class="completion-cell">{{ formatCurrency(quarter.serviceFeeActual * 1.2) }}</td>
                <td class="completion-cell">{{ formatCurrency(quarter.serviceFeeActual) }}</td>
                <td class="completion-cell">{{ formatCurrency(quarter.serviceFeeActual * 0.05) }}</td>
                <td class="completion-cell">{{ formatCurrency(quarter.serviceFeeActual * 1.25) }}</td>
                <td class="comparison-cell" :class="getCompletionClass(quarter.serviceFeeCompletion)">{{ (quarter.serviceFeeCompletion * 1.2).toFixed(1) }}%</td>
                <td class="comparison-cell" :class="getCompletionClass(quarter.serviceFeeCompletion)">{{ quarter.serviceFeeCompletion }}%</td>
                <td class="comparison-cell" :class="getCompletionClass(quarter.newOrderCompletion)">{{ (quarter.newOrderCompletion * 0.05).toFixed(1) }}%</td>
                <td class="baseline-cell">{{ (quarter.serviceFeeCompletion * 1.2).toFixed(1) }}%</td>
                <td class="baseline-cell">{{ quarter.serviceFeeCompletion }}%</td>
                <td class="baseline-cell">{{ (quarter.newOrderCompletion * 0.05).toFixed(1) }}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 项目员工完成情况（部门成员）模块 -->
    <div class="dashboard-section">
      <div class="section-header">
        <h2 class="section-title">项目员工完成情况（部门成员）</h2>
        <ModuleTimeFilter
          :initial-time-range="selectedTimeRange"
          :initial-quarter="currentQuarter"
          @time-range-change="handleTimeRangeChange"
          @quarter-change="handleQuarterChange"
        />
      </div>

      <!-- 目标卡片 -->
      <div v-if="annualQuarterlyTargets" class="target-cards-container">
        <!-- 服务费目标卡片 -->
        <div class="target-card service-fee-card">
          <div class="card-icon">
            <DollarSign :size="20" />
          </div>
          <div class="card-content">
            <div class="card-title">服务费目标</div>
            <div class="card-period">{{ selectedTimeRange === 'year' ? annualQuarterlyTargets.year + '年度' : currentQuarter }}</div>
            <div class="card-value">{{ formatCurrency(getCurrentTargetData().serviceFeeTarget) }}</div>
            <div class="card-subtitle">
              已完成: {{ formatCurrency(getCurrentTargetData().serviceFeeActual) }}
              <span class="completion-rate" :class="getCompletionClass(getCurrentTargetData().serviceFeeCompletion)">
                {{ getCurrentTargetData().serviceFeeCompletion }}%
              </span>
            </div>
          </div>
        </div>

        <!-- 新单目标卡片 -->
        <div class="target-card new-order-card">
          <div class="card-icon">
            <TrendingUp :size="20" />
          </div>
          <div class="card-content">
            <div class="card-title">新单目标</div>
            <div class="card-period">{{ selectedTimeRange === 'year' ? annualQuarterlyTargets.year + '年度' : currentQuarter }}</div>
            <div class="card-value">{{ getCurrentTargetData().newOrderTarget }}单</div>
            <div class="card-subtitle">
              已完成: {{ getCurrentTargetData().newOrderActual }}单
              <span class="completion-rate" :class="getCompletionClass(getCurrentTargetData().newOrderCompletion)">
                {{ getCurrentTargetData().newOrderCompletion }}%
              </span>
            </div>
          </div>
        </div>

        <!-- 综合完成率卡片 -->
        <div class="target-card completion-rate-card">
          <div class="card-icon">
            <TrendingUp :size="20" />
          </div>
          <div class="card-content">
            <div class="card-title">综合完成率</div>
            <div class="card-period">{{ selectedTimeRange === 'year' ? annualQuarterlyTargets.year + '年度' : currentQuarter }}</div>
            <div class="card-value">{{ Math.round((getCurrentTargetData().serviceFeeCompletion + getCurrentTargetData().newOrderCompletion) / 2 * 10) / 10 }}%</div>
            <div class="card-subtitle">
              服务费: {{ getCurrentTargetData().serviceFeeCompletion }}%
              <span class="separator">新单: {{ getCurrentTargetData().newOrderCompletion }}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 员工目标表格 -->
      <div v-if="annualQuarterlyTargets" class="annual-quarterly-targets">
        <div class="targets-table-container">
          <table class="targets-table">
            <thead>
              <tr>
                <th rowspan="2">年度</th>
                <th rowspan="2">员工</th>
                <th colspan="3" class="target-group-header">目标</th>
                <th colspan="4" class="completion-group-header">实际完成</th>
                <th colspan="3" class="comparison-group-header">完成对比</th>
                <th colspan="3" class="baseline-group-header">完成差值</th>
              </tr>
              <tr>
                <th class="target-header">合计毛利</th>
                <th class="target-header">服务费目标</th>
                <th class="target-header">返点目标</th>
                <th class="completion-header">会计完成毛利</th>
                <th class="completion-header">服务费完成</th>
                <th class="completion-header">返点完成</th>
                <th class="completion-header">合计毛利</th>
                <th class="comparison-header">总毛利完成</th>
                <th class="comparison-header">服务费完成</th>
                <th class="comparison-header">返点完成</th>
                <th class="baseline-header">总毛利差值</th>
                <th class="baseline-header">服务费差值</th>
                <th class="baseline-header">返点差值</th>
              </tr>
            </thead>
            <tbody>
              <!-- 合计行 -->
              <tr class="annual-row">
                <td rowspan="6">{{ annualQuarterlyTargets.year }}年</td>
                <td>合计</td>
                <td class="target-cell">{{ formatCurrency(annualQuarterlyTargets.yearlyTarget.serviceFeeTarget * 1.25) }}</td>
                <td class="target-cell">{{ formatCurrency(annualQuarterlyTargets.yearlyTarget.serviceFeeTarget) }}</td>
                <td class="target-cell">{{ formatCurrency(annualQuarterlyTargets.yearlyTarget.serviceFeeTarget * 0.05) }}</td>
                <td class="completion-cell">{{ formatCurrency(annualQuarterlyTargets.yearlyTarget.serviceFeeActual * 1.2) }}</td>
                <td class="completion-cell">{{ formatCurrency(annualQuarterlyTargets.yearlyTarget.serviceFeeActual) }}</td>
                <td class="completion-cell">{{ formatCurrency(annualQuarterlyTargets.yearlyTarget.serviceFeeActual * 0.05) }}</td>
                <td class="completion-cell">{{ formatCurrency(annualQuarterlyTargets.yearlyTarget.serviceFeeActual * 1.25) }}</td>
                <td class="comparison-cell">{{ (annualQuarterlyTargets.yearlyTarget.serviceFeeCompletion * 1.2).toFixed(1) }}%</td>
                <td class="comparison-cell">{{ annualQuarterlyTargets.yearlyTarget.serviceFeeCompletion }}%</td>
                <td class="comparison-cell">{{ (annualQuarterlyTargets.yearlyTarget.serviceFeeCompletion * 0.05).toFixed(1) }}%</td>
                <td class="baseline-cell">{{ (annualQuarterlyTargets.yearlyTarget.serviceFeeCompletion * 1.2).toFixed(1) }}%</td>
                <td class="baseline-cell">{{ annualQuarterlyTargets.yearlyTarget.serviceFeeCompletion }}%</td>
                <td class="baseline-cell">{{ (annualQuarterlyTargets.yearlyTarget.serviceFeeCompletion * 0.05).toFixed(1) }}%</td>
              </tr>
              <!-- 员工行 -->
              <tr v-for="(employee, index) in employeeList" :key="employee" class="quarterly-row">
                <td>{{ employee }}</td>
                <td class="target-cell">{{ formatCurrency(annualQuarterlyTargets.yearlyTarget.serviceFeeTarget * 0.2 * 1.25) }}</td>
                <td class="target-cell">{{ formatCurrency(annualQuarterlyTargets.yearlyTarget.serviceFeeTarget * 0.2) }}</td>
                <td class="target-cell">{{ formatCurrency(annualQuarterlyTargets.yearlyTarget.serviceFeeTarget * 0.2 * 0.05) }}</td>
                <td class="completion-cell">{{ formatCurrency(annualQuarterlyTargets.yearlyTarget.serviceFeeActual * 0.2 * 1.2) }}</td>
                <td class="completion-cell">{{ formatCurrency(annualQuarterlyTargets.yearlyTarget.serviceFeeActual * 0.2) }}</td>
                <td class="completion-cell">{{ formatCurrency(annualQuarterlyTargets.yearlyTarget.serviceFeeActual * 0.2 * 0.05) }}</td>
                <td class="completion-cell">{{ formatCurrency(annualQuarterlyTargets.yearlyTarget.serviceFeeActual * 0.2 * 1.25) }}</td>
                <td class="comparison-cell" :class="getCompletionClass(annualQuarterlyTargets.yearlyTarget.serviceFeeCompletion)">{{ (annualQuarterlyTargets.yearlyTarget.serviceFeeCompletion * 1.2).toFixed(1) }}%</td>
                <td class="comparison-cell" :class="getCompletionClass(annualQuarterlyTargets.yearlyTarget.serviceFeeCompletion)">{{ annualQuarterlyTargets.yearlyTarget.serviceFeeCompletion }}%</td>
                <td class="comparison-cell" :class="getCompletionClass(annualQuarterlyTargets.yearlyTarget.newOrderCompletion)">{{ (annualQuarterlyTargets.yearlyTarget.newOrderCompletion * 0.05).toFixed(1) }}%</td>
                <td class="baseline-cell">{{ (annualQuarterlyTargets.yearlyTarget.serviceFeeCompletion * 1.2).toFixed(1) }}%</td>
                <td class="baseline-cell">{{ annualQuarterlyTargets.yearlyTarget.serviceFeeCompletion }}%</td>
                <td class="baseline-cell">{{ (annualQuarterlyTargets.yearlyTarget.newOrderCompletion * 0.05).toFixed(1) }}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>





    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { DollarSign, TrendingUp, TrendingDown, RefreshCw } from 'lucide-vue-next'
import RoleSwitcher from '@/components/business/RoleSwitcher.vue'
import ModuleTimeFilter from '@/components/common/ModuleTimeFilter.vue'
import MetricCard from '@/components/business/MetricCard.vue'
import QuarterSelector from '@/components/business/QuarterSelector.vue'
import TargetComparisonCard from '@/components/business/TargetComparisonCard.vue'
import PieChart from '@/components/charts/PieChart.vue'
import BarChart from '@/components/charts/BarChart.vue'
import type {
  Quarter,
  BusinessRole,
  MetricCardProps,
  TargetComparison,
  AnnualQuarterlyTargets,
  PlatformData,
  CustomerProfitData,
  ProfitSummaryData,
  ChurnData,
  SalesPersonPerformance,
  RenewalCustomerData
} from '@/types'
import { businessAPI } from '@/mock/business'

// 状态
const currentRole = ref('project_manager')
const availableRoles = ref<BusinessRole[]>([])

const selectedQuarter = ref<Quarter>()
const coreMetrics = ref<MetricCardProps[]>([])
const targetComparisons = ref<TargetComparison[]>([])
const annualQuarterlyTargets = ref<AnnualQuarterlyTargets>({
  year: 2025,
  yearlyTarget: {
    serviceFeeTarget: 30000000,
    serviceFeeActual: 28500000,
    serviceFeeCompletion: 95.0,
    newOrderTarget: 180,
    newOrderActual: 156,
    newOrderCompletion: 86.7
  },
  quarters: [
    { quarter: 'Q1', serviceFeeTarget: 7500000, serviceFeeActual: 7125000, serviceFeeCompletion: 95.0, newOrderTarget: 45, newOrderActual: 39, newOrderCompletion: 86.7 },
    { quarter: 'Q2', serviceFeeTarget: 7500000, serviceFeeActual: 7125000, serviceFeeCompletion: 95.0, newOrderTarget: 45, newOrderActual: 39, newOrderCompletion: 86.7 },
    { quarter: 'Q3', serviceFeeTarget: 7500000, serviceFeeActual: 7125000, serviceFeeCompletion: 95.0, newOrderTarget: 45, newOrderActual: 39, newOrderCompletion: 86.7 },
    { quarter: 'Q4', serviceFeeTarget: 7500000, serviceFeeActual: 7125000, serviceFeeCompletion: 95.0, newOrderTarget: 45, newOrderActual: 39, newOrderCompletion: 86.7 }
  ]
})
const platformData = ref<PlatformData[]>([])
const customerProfitData = ref<CustomerProfitData>()
const profitSummary = ref<ProfitSummaryData>()
const churnAnalysis = ref<ChurnData[]>([])
const salesPerformance = ref<SalesPersonPerformance[]>([])
const renewalCustomers = ref<RenewalCustomerData[]>([])
const loading = ref(false)

// 时间筛选相关状态
const selectedTimeRange = ref('quarter')
const currentQuarter = ref('2025年Q1')

const timeOptions = [
  { label: '年', value: 'year' },
  { label: '季', value: 'quarter' },
  { label: '月', value: 'month' }
]

// 目标总览相关状态
const selectedTimePeriod = ref('2025')
const selectedProfitPeriod = ref('2025')

// 饼图数据
const serviceFeeChartData = ref([
  { name: 'Google', value: 1200, color: '#1890ff', percentage: 44.4 },
  { name: 'Meta', value: 850, color: '#52c41a', percentage: 31.5 },
  { name: 'Criteo', value: 320, color: '#faad14', percentage: 11.9 },
  { name: 'Bing', value: 180, color: '#f5222d', percentage: 6.7 },
  { name: '内容营销及其它', value: 150, color: '#722ed1', percentage: 5.6 }
])

const orderVolumeChartData = ref([
  { name: 'Google', value: 720, color: '#1890ff', percentage: 44.4 },
  { name: 'Meta', value: 510, color: '#52c41a', percentage: 31.5 },
  { name: 'Criteo', value: 192, color: '#faad14', percentage: 11.9 },
  { name: 'Bing', value: 108, color: '#f5222d', percentage: 6.7 },
  { name: '内容营销及其它', value: 90, color: '#722ed1', percentage: 5.6 }
])

// 员工列表
const employeeList = ref([
  '员工1',
  '员工2',
  '员工3',
  '员工4',
  '员工5'
])

// 平台数据
const platformServiceFeeShare = ref([
  { name: 'Google', value: 45.2, color: '#1890ff' },
  { name: 'Meta', value: 28.8, color: '#52c41a' },
  { name: 'Criteo', value: 15.6, color: '#faad14' },
  { name: 'Bing', value: 10.4, color: '#f5222d' }
])

const platformProfitShare = ref([
  { name: 'Google', value: 42.8, color: '#1890ff' },
  { name: 'Meta', value: 31.2, color: '#52c41a' },
  { name: 'Criteo', value: 16.5, color: '#faad14' },
  { name: 'Bing', value: 9.5, color: '#f5222d' }
])

const topCustomerCompare = ref([
  { name: '华为', serviceFee: 418.5, profit: 653.13 },
  { name: '小米', serviceFee: 378.0, profit: 567.0 },
  { name: 'OPPO', serviceFee: 334.2, profit: 501.3 },
  { name: 'vivo', serviceFee: 309.6, profit: 464.4 },
  { name: '一加', serviceFee: 285.2, profit: 427.8 }
])

// 目标数据
const targetData: Record<string, any> = {
  '2025': { serviceFeeTarget: 30000000, serviceFeeActual: 28500000, serviceFeeCompletion: 95.0, newOrderTarget: 180, newOrderActual: 156, newOrderCompletion: 86.7, overallCompletion: 90.9 },
  '2025-Q1': { serviceFeeTarget: 7500000, serviceFeeActual: 7125000, serviceFeeCompletion: 95.0, newOrderTarget: 45, newOrderActual: 39, newOrderCompletion: 86.7, overallCompletion: 90.9 },
  '2025-Q2': { serviceFeeTarget: 7500000, serviceFeeActual: 7125000, serviceFeeCompletion: 95.0, newOrderTarget: 45, newOrderActual: 39, newOrderCompletion: 86.7, overallCompletion: 90.9 },
  '2025-Q3': { serviceFeeTarget: 7500000, serviceFeeActual: 7125000, serviceFeeCompletion: 95.0, newOrderTarget: 45, newOrderActual: 39, newOrderCompletion: 86.7, overallCompletion: 90.9 },
  '2025-Q4': { serviceFeeTarget: 7500000, serviceFeeActual: 7125000, serviceFeeCompletion: 95.0, newOrderTarget: 45, newOrderActual: 39, newOrderCompletion: 86.7, overallCompletion: 90.9 }
}

// 毛利数据
const profitData: Record<string, any> = {
  '2025': { totalProfit: 6992600, totalServiceFee: 5102500, totalRebate: 1890100, newCustomerProfit: 5594100, newCustomerServiceFee: 4082000, newCustomerRebate: 1512100, oldCustomerProfit: 1398500, oldCustomerServiceFee: 1020500, oldCustomerRebate: 378000 },
  '2025-Q1': { totalProfit: 1748150, totalServiceFee: 1275625, totalRebate: 472525, newCustomerProfit: 1398525, newCustomerServiceFee: 1020500, newCustomerRebate: 378025, oldCustomerProfit: 349625, oldCustomerServiceFee: 255125, oldCustomerRebate: 94500 },
  '2025-Q2': { totalProfit: 1748150, totalServiceFee: 1275625, totalRebate: 472525, newCustomerProfit: 1398525, newCustomerServiceFee: 1020500, newCustomerRebate: 378025, oldCustomerProfit: 349625, oldCustomerServiceFee: 255125, oldCustomerRebate: 94500 },
  '2025-Q3': { totalProfit: 1748150, totalServiceFee: 1275625, totalRebate: 472525, newCustomerProfit: 1398525, newCustomerServiceFee: 1020500, newCustomerRebate: 378025, oldCustomerProfit: 349625, oldCustomerServiceFee: 255125, oldCustomerRebate: 94500 },
  '2025-Q4': { totalProfit: 6992600, totalServiceFee: 5102500, totalRebate: 1890100, newCustomerProfit: 5594100, newCustomerServiceFee: 4082000, newCustomerRebate: 1512100, oldCustomerProfit: 1398500, oldCustomerServiceFee: 1020500, oldCustomerRebate: 378000 }
}

// 计算属性
const platformSummary = computed(() => {
  const totalServiceFee = platformData.value.reduce((sum, p) => sum + p.serviceFee, 0)
  const totalOrders = platformData.value.reduce((sum, p) => sum + p.orderCount, 0)
  return { totalServiceFee, totalOrders }
})

// 目标总览相关计算属性
const currentTargetData = computed(() => {
  return targetData[selectedTimePeriod.value] || targetData['2025']
})

const currentProfitData = computed(() => {
  return profitData[selectedProfitPeriod.value] || profitData['2025']
})

// 获取当前目标数据的方法
const getCurrentTargetData = () => {
  return targetData[selectedTimePeriod.value] || targetData['2025']
}

// 流失客户卡片数据
const churnAnnualCard = computed(() => ({
  count: 88,
  serviceFeeLoss: 8800000, // 880万
  profitLoss: 12100000 // 1210万
}))

const churnNewCard = computed(() => ({
  count: 45,
  serviceFeeLoss: 2800000, // 280万
  profitLoss: 3850000 // 385万
}))

const churnOldCard = computed(() => ({
  count: 43,
  serviceFeeLoss: 6000000, // 600万
  profitLoss: 8250000 // 825万
}))

// 客户毛利明细统计数据
const customerDetailStats = computed(() => {
  // 模拟数据，实际应从表格数据计算
  return {
    totalCustomers: 25,
    newCustomers: 12,
    oldCustomers: 13,
    totalProfit: 98400000, // 9840万
    newCustomerProfit: 42500000, // 4250万
    oldCustomerProfit: 55900000, // 5590万
    totalServiceFee: 24225000, // 2422.5万
    newCustomerServiceFee: 10800000, // 1080万
    oldCustomerServiceFee: 13425000, // 1342.5万
    totalRebate: 9087600, // 908.76万
    newCustomerRebate: 4250000, // 425万
    oldCustomerRebate: 4837600, // 483.76万
    totalConsumption: 181650000, // 18165万
    newCustomerConsumption: 81000000, // 8100万
    oldCustomerConsumption: 100650000, // 10065万
  }
})

// 总体数据统计
const totalStats = computed(() => {
  const currentData = getCurrentTargetData()

  return {
    // 服务费目标
    serviceFeeTarget: currentData.serviceFeeTarget || 30000000, // 3000万
    serviceFeeTargetTrend: 15.2,

    // 新单单量
    newOrderVolume: currentData.newOrderActual || 156,
    newOrderVolumeTarget: currentData.newOrderTarget || 180,
    newOrderVolumeTrend: 12.8,

    // 服务费
    serviceFee: currentData.serviceFeeActual || 28500000, // 2850万
    serviceFeeTrend: 8.5,

    // 消费
    consumption: 18600000, // 1860万
    consumptionTrend: -3.2,

    // 返点
    singlePoint: 45,
    singlePointTrend: 0,

    // 毛利总计
    grossProfit: 9840000, // 984万
    grossProfitTrend: 18.7
  }
})

// 方法
const handleRoleChange = (role: string) => {
  currentRole.value = role
  // 这里可以添加角色切换后的数据重新加载逻辑
  console.log('角色切换至:', role)
}

const handleTimeRangeChange = (timeRange: string) => {
  selectedTimeRange.value = timeRange
  console.log('时间范围切换至:', timeRange)
}

const handleQuarterChange = (quarter: string) => {
  currentQuarter.value = quarter
  console.log('季度切换至:', quarter)
}

const handleTimePeriodChange = () => {
  console.log('目标时间周期切换至:', selectedTimePeriod.value)
}

const handleProfitPeriodChange = () => {
  console.log('毛利时间周期切换至:', selectedProfitPeriod.value)
}

// 格式化货币
const formatCurrency = (amount: number): string => {
  if (amount >= 10000) {
    return `$${(amount / 10000).toFixed(2)}万`
  }
  return `$${amount.toLocaleString()}`
}

// 获取完成率样式类
const getCompletionClass = (rate: number): string => {
  if (rate >= 95) return 'excellent'
  if (rate >= 85) return 'good'
  if (rate >= 70) return 'average'
  return 'poor'
}

// 获取时间周期标签
const getTimePeriodLabel = (period: string): string => {
  const labels: Record<string, string> = {
    '2025': '2025年',
    '2025-Q1': '2025年 Q1季度',
    '2025-Q2': '2025年 Q2季度',
    '2025-Q3': '2025年 Q3季度',
    '2025-Q4': '2025年 Q4季度',
    '2025-01': '2025年 1月',
    '2025-02': '2025年 2月',
    '2025-03': '2025年 3月',
    '2025-04': '2025年 4月',
    '2025-05': '2025年 5月',
    '2025-06': '2025年 6月',
    '2025-07': '2025年 7月',
    '2025-08': '2025年 8月',
    '2025-09': '2025年 9月',
    '2025-10': '2025年 10月',
    '2025-11': '2025年 11月',
    '2025-12': '2025年 12月'
  }
  return labels[period] || period
}

// 数据加载方法
const loadDashboardData = async () => {
  try {
    loading.value = true
    const [
      rolesData,
      metricsData,
      targetData,
      annualTargetsData,
      platformDistData,
      profitData,
      profitSummaryData,
      churnData,
      salesPerfData,
      renewalData
    ] = await Promise.all([
      businessAPI.getRoles(),
      businessAPI.getSalesDirectorMetrics(),
      businessAPI.getTargetComparison(),
      businessAPI.getAnnualQuarterlyTargets(),
      businessAPI.getPlatformDistribution(),
      businessAPI.getCustomerProfitData(),
      businessAPI.getProfitSummary(),
      businessAPI.getChurnData(),
      businessAPI.getSalesPersonPerformance(),
      businessAPI.getRenewalCustomerData()
    ])

    availableRoles.value = rolesData
    coreMetrics.value = metricsData
    targetComparisons.value = targetData
    annualQuarterlyTargets.value = annualTargetsData
    platformData.value = platformDistData
    customerProfitData.value = profitData
    profitSummary.value = profitSummaryData
    churnAnalysis.value = churnData
    salesPerformance.value = salesPerfData
    renewalCustomers.value = renewalData
  } catch (error) {
    console.error('数据加载失败:', error)
  } finally {
    loading.value = false
  }
}

// 生命周期
onMounted(async () => {
  await loadDashboardData()
})
</script>

<style scoped>
.sales-director-dashboard {
  padding: 24px;
  background: #f5f5f5;
  min-height: 100vh;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  background: #fff;
  padding: 20px 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.dashboard-header__left {
  flex: 1;
}

.dashboard-header__right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.dashboard-title {
  margin: 0 0 4px 0;
  font-size: 24px;
  font-weight: 600;
  color: #262626;
}

.dashboard-subtitle {
  margin: 0;
  color: #8c8c8c;
  font-size: 14px;
}

.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.dashboard-section {
  margin-bottom: 32px;
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 目标卡片样式 - 完全匹配截图设计 */
.dashboard-section .target-cards-container {
  display: flex !important;
  gap: 12px !important;
  margin-bottom: 16px !important;
}

.dashboard-section .target-card {
  flex: 1;
  background: #f8fbff !important;
  border: none !important;
  border-radius: 12px !important;
  padding: 16px !important;
  position: relative !important;
  overflow: hidden !important;
  transition: all 0.3s ease !important;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06) !important;
}

.dashboard-section .target-card:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08) !important;
}

.dashboard-section .target-card .card-icon {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 40px !important;
  height: 40px !important;
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%) !important;
  border-radius: 8px !important;
  color: white !important;
  margin-bottom: 12px !important;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3) !important;
}

.dashboard-section .target-card .card-content {
  flex: 1 !important;
}

.dashboard-section .target-card .card-title {
  font-size: 14px !important;
  font-weight: 500 !important;
  color: #595959 !important;
  margin: 0 0 4px 0 !important;
}

.dashboard-section .target-card .card-period {
  font-size: 12px !important;
  color: #8c8c8c !important;
  margin: 0 0 8px 0 !important;
}

.dashboard-section .target-card .card-value {
  font-size: 20px !important;
  font-weight: 600 !important;
  color: #262626 !important;
  margin: 0 0 8px 0 !important;
  line-height: 1.2 !important;
}

.dashboard-section .target-card .card-subtitle {
  font-size: 12px !important;
  color: #8c8c8c !important;
  margin: 0 !important;
  display: flex !important;
  align-items: center !important;
  gap: 8px !important;
}

.dashboard-section .target-card .completion-rate {
  font-weight: 600 !important;
  padding: 2px 6px !important;
  border-radius: 4px !important;
  font-size: 11px !important;
}

.dashboard-section .target-card .completion-rate.excellent {
  background: #f6ffed !important;
  color: #52c41a !important;
}

.dashboard-section .target-card .completion-rate.good {
  background: #fff7e6 !important;
  color: #fa8c16 !important;
}

.dashboard-section .target-card .completion-rate.average {
  background: #fff1f0 !important;
  color: #ff4d4f !important;
}

.dashboard-section .target-card .separator {
  color: #d9d9d9 !important;
  margin: 0 4px !important;
}

/* 总体数据统计卡片样式 */
.summary-cards-container {
  display: flex !important;
  gap: 12px !important;
  margin-bottom: 20px !important;
  flex-wrap: wrap !important;
}

/* 响应式：确保在小屏幕时有合理的最小宽度 */
@media (max-width: 768px) {
  .summary-cards-container {
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)) !important;
  }
}
@media (max-width: 480px) {
  .summary-cards-container {
    grid-template-columns: 1fr !important;
  }
}

.summary-card {
  flex: 1 !important;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%) !important;
  border-radius: 12px !important;
  padding: 16px !important;
  display: flex !important;
  align-items: center !important;
  gap: 12px !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06) !important;
  transition: all 0.3s ease !important;
  border: 1px solid rgba(24, 144, 255, 0.1) !important;
  min-height: 100px !important;
}

.summary-card:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1) !important;
}

.summary-card .card-icon {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 48px !important;
  height: 48px !important;
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%) !important;
  border-radius: 12px !important;
  color: white !important;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3) !important;
  flex-shrink: 0 !important;
}

.summary-card .card-content {
  flex: 1 !important;
  min-width: 0 !important;
}

.summary-card .card-title {
  font-size: 14px !important;
  font-weight: 500 !important;
  color: #595959 !important;
  margin: 0 0 4px 0 !important;
  white-space: nowrap !important;
}

.summary-card .card-value {
  font-size: 20px !important;
  font-weight: 600 !important;
  color: #262626 !important;
  margin: 0 0 4px 0 !important;
  line-height: 1.2 !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}

.summary-card .card-period {
  font-size: 12px !important;
  color: #8c8c8c !important;
  margin: 0 0 8px 0 !important;
}

.summary-card .card-completion {
  font-size: 12px !important;
  color: #8c8c8c !important;
  margin: 0 !important;
  display: flex !important;
  align-items: center !important;
  gap: 4px !important;
  flex-wrap: wrap !important;
}

.summary-card .completion-percentage {
  font-weight: 600 !important;
  color: #1890ff !important;
}

.summary-card .separator {
  color: #d9d9d9 !important;
  margin: 0 4px !important;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  margin: 0 0 20px 0;
  font-size: 18px;
  font-weight: 600;
  color: #262626;
}

/* 目标总览卡片样式 */
.target-filter {
  display: flex;
  align-items: center;
}

.time-filter-select {
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  font-size: 14px;
  color: #262626;
  background: #fff;
  cursor: pointer;
  min-width: 160px;
}

.time-filter-select:focus {
  outline: none;
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.target-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  margin-top: 12px;
  margin-bottom: 20px;
}

.target-card {
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 20px;
  transition: all 0.3s ease;
}

.target-card:hover {
  border-color: #1890ff;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.15);
}

.target-card-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.target-card-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: #1890ff;
  border-radius: 8px;
  color: white;
  margin-right: 12px;
}

.target-card-title h3 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: #262626;
}

.target-period {
  margin: 0;
  font-size: 12px;
  color: #8c8c8c;
}

.target-card-content {
  flex: 1;
}

.target-value {
  font-size: 24px;
  font-weight: 600;
  color: #262626;
  margin-bottom: 12px;
}

.completion-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.completion-value {
  font-size: 14px;
  color: #595959;
}

.completion-rate {
  font-size: 14px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 4px;
}

.completion-rate.excellent {
  background: #f6ffed;
  color: #52c41a;
}

.completion-rate.good {
  background: #fff7e6;
  color: #fa8c16;
}

.completion-rate.average {
  background: #fff1f0;
  color: #ff4d4f;
}

.completion-rate.poor {
  background: #fff0f6;
  color: #eb2f96;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: #f5f5f5;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #1890ff 0%, #40a9ff 100%);
  border-radius: 3px;
  transition: width 0.3s ease;
}

/* 年度和季度目标表格样式 */
.annual-quarterly-targets {
  margin-top: 20px;
}

.targets-table-container {
  overflow-x: auto;
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
}

.targets-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  min-width: 1000px;
}

.targets-table th {
  background: #fafafa;
  border: 1px solid #f0f0f0;
  padding: 12px 8px;
  text-align: center;
  font-weight: 600;
  color: #262626;
  white-space: nowrap;
}

.targets-table td {
  border: 1px solid #f0f0f0;
  padding: 10px 8px;
  text-align: center;
  color: #595959;
}

.targets-table .target-group-header {
  background: #e6f7ff !important;
  color: #1890ff !important;
}

.targets-table .completion-group-header {
  background: #f6ffed !important;
  color: #52c41a !important;
}

.targets-table .comparison-group-header {
  background: #fff7e6 !important;
  color: #fa8c16 !important;
}

.targets-table .baseline-group-header {
  background: #f9f0ff !important;
  color: #722ed1 !important;
}

.targets-table .annual-row {
  background: #fafafa;
  font-weight: 600;
}

.targets-table .quarterly-row:nth-child(even) {
  background: #fafafa;
}

.targets-table .quarterly-row:hover {
  background: #f0f8ff;
}

/* 新单服务费及单量完成表格样式 */
.new-order-completion-table-container {
  overflow-x: auto;
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  margin-bottom: 20px;
}

.new-order-completion-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  min-width: 1200px;
}

.new-order-completion-table th {
  background: #fafafa;
  border: 1px solid #f0f0f0;
  padding: 12px 8px;
  text-align: center;
  font-weight: 600;
  color: #262626;
  white-space: nowrap;
}

.new-order-completion-table td {
  border: 1px solid #f0f0f0;
  padding: 10px 8px;
  text-align: center;
  color: #595959;
}

.new-order-completion-table .service-fee-header {
  background: #e6f7ff !important;
  color: #1890ff !important;
}

.new-order-completion-table .order-count-header {
  background: #f6ffed !important;
  color: #52c41a !important;
}

.new-order-completion-table .year-row {
  background: #fafafa;
  font-weight: 600;
}

.new-order-completion-table .quarter-row:nth-child(even) {
  background: #fafafa;
}

.new-order-completion-table .quarter-row:hover {
  background: #f0f8ff;
}

/* 饼图容器样式 */
.pie-charts-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 20px;
}

.pie-chart-section {
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 16px;
}

.chart-title {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #262626;
  text-align: center;
}

.chart-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.pie-chart-wrapper {
  flex: 1;
  min-width: 200px;
}

.chart-legend {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  flex-shrink: 0;
}

.legend-text {
  color: #595959;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 新签客户毛利完成表格样式 */
.new-customer-profit-table-container {
  overflow-x: auto;
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  margin-bottom: 20px;
}

.new-customer-profit-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  min-width: 1600px;
}

.new-customer-profit-table th {
  background: #fafafa;
  border: 1px solid #f0f0f0;
  padding: 12px 8px;
  text-align: center;
  font-weight: 600;
  color: #262626;
  white-space: nowrap;
}

.new-customer-profit-table td {
  border: 1px solid #f0f0f0;
  padding: 10px 8px;
  text-align: center;
  color: #595959;
}

.new-customer-profit-table .service-fee-group-header {
  background: #e6f7ff !important;
  color: #1890ff !important;
}

.new-customer-profit-table .service-fee-actual-group-header {
  background: #f6ffed !important;
  color: #52c41a !important;
}

.new-customer-profit-table .consumption-group-header {
  background: #fff7e6 !important;
  color: #fa8c16 !important;
}

.new-customer-profit-table .rebate-group-header {
  background: #f9f0ff !important;
  color: #722ed1 !important;
}

.new-customer-profit-table .profit-group-header {
  background: #fff0f6 !important;
  color: #eb2f96 !important;
}

.new-customer-profit-table .customer-row:nth-child(even) {
  background: #fafafa;
}

.new-customer-profit-table .customer-row:hover {
  background: #f0f8ff;
}

.new-customer-profit-table .customer-name-cell {
  font-weight: 600;
  background: #f0f8ff;
}

/* 图表卡片样式 */
.charts-compact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.chart-card {
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  min-height: 200px;
}

.chart-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.chart-card--full-width {
  grid-column: 1 / -1;
  min-height: 300px;
}

/* 响应式样式 */
@media (max-width: 768px) {
  .sales-director-dashboard {
    padding: 16px;
  }

  .dashboard-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .target-cards-grid {
    grid-template-columns: 1fr;
  }

  .pie-charts-container {
    grid-template-columns: 1fr;
  }

  .charts-compact-grid {
    grid-template-columns: 1fr;
  }

  .summary-cards-container {
    flex-direction: column;
  }

  .chart-content {
    flex-direction: column;
    gap: 12px;
  }

  .pie-chart-wrapper {
    min-width: auto;
  }
}

/* 加载状态 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f0f0f0;
  border-top: 4px solid #1890ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-container p {
  margin: 0;
  color: #8c8c8c;
  font-size: 14px;
}

/* 表格滚动提示 */
.table-scroll-hint {
  text-align: center;
  margin-bottom: 8px;
  font-size: 12px;
  color: #8c8c8c;
}

/* 客户毛利明细表格样式 */
.customer-profit-detail-table-container {
  overflow-x: auto;
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  margin-bottom: 20px;
}

.customer-profit-detail-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  min-width: 1800px;
}

.customer-profit-detail-table th {
  background: #fafafa;
  border: 1px solid #f0f0f0;
  padding: 12px 8px;
  text-align: center;
  font-weight: 600;
  color: #262626;
  white-space: nowrap;
}

.customer-profit-detail-table td {
  border: 1px solid #f0f0f0;
  padding: 10px 8px;
  text-align: center;
  color: #595959;
}

.customer-profit-detail-table .platform-group-header {
  background: #e6f7ff !important;
  color: #1890ff !important;
}

.customer-profit-detail-table .customer-status-header {
  background: #f6ffed !important;
  color: #52c41a !important;
}

.customer-profit-detail-table .customer-row:nth-child(even) {
  background: #fafafa;
}

.customer-profit-detail-table .customer-row:hover {
  background: #f0f8ff;
}

.customer-profit-detail-table .customer-name-cell {
  font-weight: 600;
  background: #f0f8ff;
}

.customer-profit-detail-table .status-active {
  color: #52c41a;
  font-weight: 600;
}

.customer-profit-detail-table .status-inactive {
  color: #ff4d4f;
  font-weight: 600;
}

.customer-profit-detail-table .renewal-amount-cell {
  font-weight: 600;
  color: #1890ff;
}

.customer-profit-detail-table .service-fee-cell {
  color: #52c41a;
}

.customer-profit-detail-table .rebate-cell {
  color: #fa8c16;
}

.customer-profit-detail-table .consumption-cell {
  color: #722ed1;
}

.customer-profit-detail-table .platform-cell {
  color: #595959;
}

/* 毛利卡片样式 */
.profit-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.profit-card {
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 20px;
  transition: all 0.3s ease;
}

.profit-card:hover {
  border-color: #1890ff;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.15);
}

.profit-card-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.profit-card-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: #1890ff;
  border-radius: 8px;
  color: white;
  margin-right: 12px;
}

.profit-card-title h3 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: #262626;
}

.profit-period {
  margin: 0;
  font-size: 12px;
  color: #8c8c8c;
}

.profit-card-content {
  flex: 1;
}

.profit-value {
  font-size: 24px;
  font-weight: 600;
  color: #262626;
  margin-bottom: 12px;
}

.profit-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.detail-label {
  color: #8c8c8c;
}

.detail-value {
  color: #595959;
  font-weight: 500;
}
</style>


