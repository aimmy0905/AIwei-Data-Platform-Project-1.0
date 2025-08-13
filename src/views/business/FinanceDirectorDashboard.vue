<template>
  <div class="finance-director-dashboard">
    <!-- 页面头部 -->
    <div class="dashboard-header">
      <div class="dashboard-header__left">
        <h1 class="dashboard-title">财务总监看板</h1>
        <p class="dashboard-subtitle">全面掌控财务状况与经营风险</p>
      </div>

      <div class="dashboard-header__right">
        <RoleSwitcher
          :current-role="currentRole"
          :available-roles="availableRoles"
          @role-change="handleRoleChange"
        />
      </div>
    </div>

    <!-- 时间选择器 -->
    <div class="dashboard-time-selector">
      <TimeRangePicker
        v-model="selectedTimeRange"
        @change="handleTimeRangeChange"
      />
    </div>

        <!-- 财务核心指标卡片区域 -->
    <div class="dashboard-section" v-if="financialData">
      <h2 class="section-title">财务核心指标</h2>
      <div class="metrics-grid">
        <MetricCard
          title="总服务费"
          :value="financialData.serviceFee.total"
          unit="¥"
          trend="up"
          :trend-value="financialData.serviceFee.quarterlyGrowth"
          trend-period="环比增长"
          color="#52c41a"
          icon="DollarSign"
        />

        <MetricCard
          title="总单量"
          :value="financialData.orders.total"
          unit="单"
          trend="up"
          :trend-value="financialData.orders.quarterlyGrowth"
          trend-period="环比增长"
          color="#1890ff"
          icon="TrendingUp"
        />

        <MetricCard
          title="总毛利"
          :value="financialData.profit.gross"
          unit="¥"
          trend="up"
          :trend-value="financialData.profit.quarterlyGrowth"
          trend-period="环比增长"
          color="#fa8c16"
          icon="Target"
        />

        <MetricCard
          title="总返点"
          :value="financialData.rebate.total"
          unit="¥"
          trend="up"
          :trend-value="financialData.rebate.quarterlyGrowth"
          trend-period="环比增长"
          color="#722ed1"
          icon="BarChart3"
        />
      </div>
    </div>

        <!-- 销售人员目标完成情况模块 -->
    <div class="dashboard-section">
      <div class="section-header">
        <h2 class="section-title">销售人员目标完成情况</h2>
        <div class="target-filter">
          <select v-model="selectedTimePeriod" @change="handleTimePeriodChange" class="time-filter-select">
            <option value="2025">2025年</option>
            <option value="2025-Q1">2025年 Q1季度</option>
            <option value="2025-Q2">2025年 Q2季度</option>
            <option value="2025-Q3">2025年 Q3季度</option>
            <option value="2025-Q4">2025年 Q4季度</option>
            <option value="2025-01">2025年 1月</option>
            <option value="2025-02">2025年 2月</option>
            <option value="2025-03">2025年 3月</option>
            <option value="2025-04">2025年 4月</option>
            <option value="2025-05">2025年 5月</option>
            <option value="2025-06">2025年 6月</option>
            <option value="2025-07">2025年 7月</option>
            <option value="2025-08">2025年 8月</option>
            <option value="2025-09">2025年 9月</option>
            <option value="2025-10">2025年 10月</option>
            <option value="2025-11">2025年 11月</option>
            <option value="2025-12">2025年 12月</option>
          </select>
        </div>
      </div>

      <div class="target-cards-grid">
        <div class="target-card service-fee-card">
          <div class="target-card-header">
            <div class="target-card-icon">
              <DollarSign :size="24" />
            </div>
            <div class="target-card-title">
              <h3>服务费目标</h3>
              <p class="target-period">{{ getTimePeriodLabel(selectedTimePeriod) }}</p>
            </div>
          </div>
          <div class="target-card-content">
            <div class="target-value">{{ formatCurrency(currentTargetData.serviceFeeTarget) }}</div>
            <div class="completion-info">
              <div class="completion-value">已完成: {{ formatCurrency(currentTargetData.serviceFeeActual) }}</div>
              <div class="completion-rate" :class="getCompletionClass(currentTargetData.serviceFeeCompletion)">
                {{ currentTargetData.serviceFeeCompletion }}%
              </div>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: currentTargetData.serviceFeeCompletion + '%' }"></div>
            </div>
          </div>
        </div>

        <div class="target-card new-order-card">
          <div class="target-card-header">
            <div class="target-card-icon">
              <TrendingUp :size="24" />
            </div>
            <div class="target-card-title">
              <h3>新单目标</h3>
              <p class="target-period">{{ getTimePeriodLabel(selectedTimePeriod) }}</p>
            </div>
          </div>
          <div class="target-card-content">
            <div class="target-value">{{ currentTargetData.newOrderTarget }}单</div>
            <div class="completion-info">
              <div class="completion-value">已完成: {{ currentTargetData.newOrderActual }}单</div>
              <div class="completion-rate" :class="getCompletionClass(currentTargetData.newOrderCompletion)">
                {{ currentTargetData.newOrderCompletion }}%
              </div>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: currentTargetData.newOrderCompletion + '%' }"></div>
            </div>
          </div>
        </div>

        <div class="target-card overall-card">
          <div class="target-card-header">
            <div class="target-card-icon">
              <TrendingUp :size="24" />
            </div>
            <div class="target-card-title">
              <h3>综合完成率</h3>
              <p class="target-period">{{ getTimePeriodLabel(selectedTimePeriod) }}</p>
            </div>
          </div>
          <div class="target-card-content">
            <div class="target-value overall-rate" :class="getCompletionClass(currentTargetData.overallCompletion)">
              {{ currentTargetData.overallCompletion }}%
            </div>
            <div class="completion-info">
              <div class="completion-metrics">
                <span class="metric-item">服务费: {{ currentTargetData.serviceFeeCompletion }}%</span>
                <span class="metric-item">新单: {{ currentTargetData.newOrderCompletion }}%</span>
              </div>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: currentTargetData.overallCompletion + '%' }"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="sales-personnel-table-container">
        <table class="sales-personnel-table">
          <thead>
            <tr>
              <th rowspan="2">年度</th>
              <th rowspan="2">销售</th>
              <th colspan="2" class="target-group-header">目标</th>
              <th colspan="2" class="completion-group-header">完成</th>
              <th colspan="3" class="comparison-group-header">完成比例</th>
              <th colspan="2" class="baseline-group-header">完成基准</th>
            </tr>
            <tr>
              <th class="target-header">服务费目标</th>
              <th class="target-header">新单目标</th>
              <th class="completion-header">服务费完成</th>
              <th class="completion-header">单量完成</th>
              <th class="comparison-header">服务费完成比例</th>
              <th class="comparison-header">新单完成比例</th>
              <th class="comparison-header">完成比例</th>
              <th class="baseline-header">服务费基准</th>
              <th class="baseline-header">订单基准</th>
            </tr>
          </thead>
          <tbody>
            <!-- 销售人员1 -->
            <tr class="personnel-row">
              <td rowspan="5">2025年</td>
              <td class="personnel-name-cell">销售1</td>
              <td class="target-cell">¥450.00万</td>
              <td class="target-cell">270单</td>
              <td class="completion-cell">¥418.50万</td>
              <td class="completion-cell">251单</td>
              <td class="comparison-cell excellent">93.0%</td>
              <td class="comparison-cell excellent">92.9%</td>
              <td class="comparison-cell excellent">93.0%</td>
              <td class="baseline-cell">93.0%</td>
              <td class="baseline-cell">92.9%</td>
            </tr>

            <!-- 销售人员2 -->
            <tr class="personnel-row">
              <td class="personnel-name-cell">销售2</td>
              <td class="target-cell">¥420.00万</td>
              <td class="target-cell">252单</td>
              <td class="completion-cell">¥378.00万</td>
              <td class="completion-cell">227单</td>
              <td class="comparison-cell excellent">90.0%</td>
              <td class="comparison-cell excellent">90.1%</td>
              <td class="comparison-cell excellent">90.1%</td>
              <td class="baseline-cell">90.0%</td>
              <td class="baseline-cell">90.1%</td>
            </tr>

            <!-- 销售人员3 -->
            <tr class="personnel-row">
              <td class="personnel-name-cell">销售3</td>
              <td class="target-cell">¥380.00万</td>
              <td class="target-cell">228单</td>
              <td class="completion-cell">¥334.20万</td>
              <td class="completion-cell">201单</td>
              <td class="comparison-cell good">87.9%</td>
              <td class="comparison-cell good">88.2%</td>
              <td class="comparison-cell good">88.1%</td>
              <td class="baseline-cell">87.9%</td>
              <td class="baseline-cell">88.2%</td>
            </tr>

            <!-- 销售人员4 -->
            <tr class="personnel-row">
              <td class="personnel-name-cell">销售4</td>
              <td class="target-cell">¥360.00万</td>
              <td class="target-cell">216单</td>
              <td class="completion-cell">¥309.60万</td>
              <td class="completion-cell">186单</td>
              <td class="comparison-cell good">86.0%</td>
              <td class="comparison-cell good">86.1%</td>
              <td class="comparison-cell good">86.1%</td>
              <td class="baseline-cell">86.0%</td>
              <td class="baseline-cell">86.1%</td>
            </tr>

            <!-- 销售人员5 -->
            <tr class="personnel-row">
              <td class="personnel-name-cell">销售5</td>
              <td class="target-cell">¥340.00万</td>
              <td class="target-cell">204单</td>
              <td class="completion-cell">¥285.20万</td>
              <td class="completion-cell">171单</td>
              <td class="comparison-cell average">83.9%</td>
              <td class="comparison-cell average">83.8%</td>
              <td class="comparison-cell average">83.9%</td>
              <td class="baseline-cell">83.9%</td>
              <td class="baseline-cell">83.8%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 销售毛利完成模块 -->
    <div class="dashboard-section">
      <div class="section-header">
        <h2 class="section-title">销售毛利完成</h2>
        <div class="profit-filter">
          <select v-model="selectedProfitPeriod" @change="handleProfitPeriodChange" class="time-filter-select">
            <option value="2025">2025年</option>
            <option value="2025-Q1">2025年 Q1季度</option>
            <option value="2025-Q2">2025年 Q2季度</option>
            <option value="2025-Q3">2025年 Q3季度</option>
            <option value="2025-Q4">2025年 Q4季度</option>
            <option value="2025-01">2025年 1月</option>
            <option value="2025-02">2025年 2月</option>
            <option value="2025-03">2025年 3月</option>
            <option value="2025-04">2025年 4月</option>
            <option value="2025-05">2025年 5月</option>
            <option value="2025-06">2025年 6月</option>
            <option value="2025-07">2025年 7月</option>
            <option value="2025-08">2025年 8月</option>
            <option value="2025-09">2025年 9月</option>
            <option value="2025-10">2025年 10月</option>
            <option value="2025-11">2025年 11月</option>
            <option value="2025-12">2025年 12月</option>
          </select>
        </div>
      </div>

      <div class="profit-cards-grid">
        <div class="profit-card total-profit-card">
          <div class="profit-card-header">
            <div class="profit-card-icon">
              <TrendingUp :size="24" />
            </div>
            <div class="profit-card-title">
              <h3>总毛利完成</h3>
              <p class="profit-period">{{ getTimePeriodLabel(selectedProfitPeriod) }}</p>
            </div>
          </div>
          <div class="profit-card-content">
            <div class="profit-value">{{ formatCurrency(currentProfitData.totalProfit) }}</div>
            <div class="profit-details">
              <div class="detail-item">
                <span class="detail-label">新客户:</span>
                <span class="detail-value">{{ formatCurrency(currentProfitData.newCustomerProfit) }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">老客户:</span>
                <span class="detail-value">{{ formatCurrency(currentProfitData.oldCustomerProfit) }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="profit-card service-fee-card">
          <div class="profit-card-header">
            <div class="profit-card-icon">
              <DollarSign :size="24" />
            </div>
            <div class="profit-card-title">
              <h3>服务费合计</h3>
              <p class="profit-period">{{ getTimePeriodLabel(selectedProfitPeriod) }}</p>
            </div>
          </div>
          <div class="profit-card-content">
            <div class="profit-value">{{ formatCurrency(currentProfitData.totalServiceFee) }}</div>
            <div class="profit-details">
              <div class="detail-item">
                <span class="detail-label">新客户:</span>
                <span class="detail-value">{{ formatCurrency(currentProfitData.newCustomerServiceFee) }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">老客户:</span>
                <span class="detail-value">{{ formatCurrency(currentProfitData.oldCustomerServiceFee) }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="profit-card rebate-card">
          <div class="profit-card-header">
            <div class="profit-card-icon">
              <TrendingUp :size="24" />
            </div>
            <div class="profit-card-title">
              <h3>返点合计</h3>
              <p class="profit-period">{{ getTimePeriodLabel(selectedProfitPeriod) }}</p>
            </div>
          </div>
          <div class="profit-card-content">
            <div class="profit-value">{{ formatCurrency(currentProfitData.totalRebate) }}</div>
            <div class="profit-details">
              <div class="detail-item">
                <span class="detail-label">新客户:</span>
                <span class="detail-value">{{ formatCurrency(currentProfitData.newCustomerRebate) }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">老客户:</span>
                <span class="detail-value">{{ formatCurrency(currentProfitData.oldCustomerRebate) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="employee-profit-table-container">
        <table class="employee-profit-table">
          <thead>
            <tr>
              <th rowspan="3">时间选择</th>
              <th rowspan="3">年度合计</th>
              <th colspan="3" class="target-group-header">毛利合计</th>
              <th colspan="3" class="completion-group-header">2025年度（新客户）</th>
              <th colspan="3" class="comparison-group-header">2025年度（老客户）</th>
            </tr>
            <tr>
              <th class="target-header">总毛利完成</th>
              <th class="target-header">服务费合计</th>
              <th class="target-header">返点合计</th>
              <th class="completion-header">总毛利完成</th>
              <th class="completion-header">服务费合计</th>
              <th class="completion-header">返点合计</th>
              <th class="comparison-header">完成比例</th>
              <th class="comparison-header">服务费基准</th>
              <th class="comparison-header">订单基准</th>
            </tr>
          </thead>
          <tbody>
            <!-- 年度数据 -->
            <tr class="year-row">
              <td rowspan="6">2025年</td>
              <td>年度合计</td>
              <td class="target-cell">¥3,331.26万</td>
              <td class="target-cell">¥2,422.50万</td>
              <td class="target-cell">¥908.76万</td>
              <td class="completion-cell">¥2,665.01万</td>
              <td class="completion-cell">¥1,938.00万</td>
              <td class="completion-cell">¥727.01万</td>
              <td class="comparison-cell excellent">80.0%</td>
              <td class="comparison-cell excellent">80.0%</td>
              <td class="comparison-cell excellent">80.0%</td>
            </tr>

            <!-- 销售1数据 -->
            <tr class="personnel-row">
              <td>销售1</td>
              <td class="target-cell">¥653.13万</td>
              <td class="target-cell">¥418.50万</td>
              <td class="target-cell">¥234.63万</td>
              <td class="completion-cell">¥522.50万</td>
              <td class="completion-cell">¥334.80万</td>
              <td class="completion-cell">¥187.70万</td>
              <td class="comparison-cell excellent">80.0%</td>
              <td class="comparison-cell excellent">80.0%</td>
              <td class="comparison-cell excellent">80.0%</td>
            </tr>

            <!-- 销售2数据 -->
            <tr class="personnel-row">
              <td>销售2</td>
              <td class="target-cell">¥567.00万</td>
              <td class="target-cell">¥378.00万</td>
              <td class="target-cell">¥189.00万</td>
              <td class="completion-cell">¥453.60万</td>
              <td class="completion-cell">¥302.40万</td>
              <td class="completion-cell">¥151.20万</td>
              <td class="comparison-cell excellent">80.0%</td>
              <td class="comparison-cell excellent">80.0%</td>
              <td class="comparison-cell excellent">80.0%</td>
            </tr>

            <!-- 销售3数据 -->
            <tr class="personnel-row">
              <td>销售3</td>
              <td class="target-cell">¥501.30万</td>
              <td class="target-cell">¥334.20万</td>
              <td class="target-cell">¥167.10万</td>
              <td class="completion-cell">¥401.04万</td>
              <td class="completion-cell">¥267.36万</td>
              <td class="completion-cell">¥133.68万</td>
              <td class="comparison-cell excellent">80.0%</td>
              <td class="comparison-cell excellent">80.0%</td>
              <td class="comparison-cell excellent">80.0%</td>
            </tr>

            <!-- 销售4数据 -->
            <tr class="personnel-row">
              <td>销售4</td>
              <td class="target-cell">¥464.40万</td>
              <td class="target-cell">¥309.60万</td>
              <td class="target-cell">¥154.80万</td>
              <td class="completion-cell">¥371.52万</td>
              <td class="completion-cell">¥247.68万</td>
              <td class="completion-cell">¥123.84万</td>
              <td class="comparison-cell excellent">80.0%</td>
              <td class="comparison-cell excellent">80.0%</td>
              <td class="comparison-cell excellent">80.0%</td>
            </tr>

            <!-- 销售5数据 -->
            <tr class="personnel-row">
              <td>销售5</td>
              <td class="target-cell">¥427.80万</td>
              <td class="target-cell">¥285.20万</td>
              <td class="target-cell">¥142.60万</td>
              <td class="completion-cell">¥342.24万</td>
              <td class="completion-cell">¥228.16万</td>
              <td class="completion-cell">¥114.08万</td>
              <td class="comparison-cell excellent">80.0%</td>
              <td class="comparison-cell excellent">80.0%</td>
              <td class="comparison-cell excellent">80.0%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 运营部门目标完成情况模块 -->
    <OperationTargetCompletionModule
      :operation-targets="operationTargetsData"
      :loading="loading"
      @time-range-change="handleTimeRangeChange"
      @quarter-change="handleQuarterChange"
    />

    <!-- 运营部门目标完成情况（部门）模块 -->
    <DepartmentTargetCompletionModule
      :department-targets="departmentTargetsData"
      :loading="loading"
      @time-range-change="handleTimeRangeChange"
      @department-click="handleDepartmentClick"
    />

    <!-- 项目部员工目标完成情况模块 -->
    <EmployeeTargetCompletionModule
      :employee-targets="employeeTargetsData"
      :loading="loading"
      @time-range-change="handleTimeRangeChange"
      @employee-click="handleEmployeeClick"
    />



        <!-- 财务比率分析模块 -->
    <div class="dashboard-section" v-if="financialData">
      <h2 class="section-title">财务比率分析</h2>
      <div class="ratios-grid">
        <div class="ratio-card">
          <div class="ratio-icon">
            <TrendingUp :size="24" />
          </div>
          <div class="ratio-content">
            <div class="ratio-label">流动比率</div>
            <div class="ratio-value">{{ financialData.ratios.currentRatio }}</div>
            <div class="ratio-status good">健康</div>
          </div>
        </div>

        <div class="ratio-card">
          <div class="ratio-icon">
            <Shield :size="24" />
          </div>
          <div class="ratio-content">
            <div class="ratio-label">速动比率</div>
            <div class="ratio-value">{{ financialData.ratios.quickRatio }}</div>
            <div class="ratio-status good">良好</div>
          </div>
        </div>

        <div class="ratio-card">
          <div class="ratio-icon">
            <Percent :size="24" />
          </div>
          <div class="ratio-content">
            <div class="ratio-label">资产收益率</div>
            <div class="ratio-value">{{ financialData.ratios.returnOnAssets }}%</div>
            <div class="ratio-status excellent">优秀</div>
          </div>
        </div>

        <div class="ratio-card">
          <div class="ratio-icon">
            <BarChart3 :size="24" />
          </div>
          <div class="ratio-content">
            <div class="ratio-label">净资产收益率</div>
            <div class="ratio-value">{{ financialData.ratios.returnOnEquity }}%</div>
            <div class="ratio-status excellent">优秀</div>
          </div>
        </div>
      </div>
    </div>


  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { TrendingUp, Shield, Percent, BarChart3, AlertTriangle, DollarSign } from 'lucide-vue-next'
import RoleSwitcher from '@/components/business/RoleSwitcher.vue'
import TimeRangePicker from '@/components/business/TimeRangePicker.vue'
import MetricCard from '@/components/business/MetricCard.vue'
import OperationTargetCompletionModule from '@/components/business/OperationTargetCompletionModule.vue'
import DepartmentTargetCompletionModule from '@/components/business/DepartmentTargetCompletionModule.vue'
import EmployeeTargetCompletionModule from '@/components/business/EmployeeTargetCompletionModule.vue'
import type {
  TimeRange,
  BusinessRole,
  FinancialAnalysisData,
  BudgetExecutionData,
  FinancialRiskAlert,
  OperationTargetData,
  DepartmentTargetData
} from '@/types'
import { businessAPI } from '@/mock/business'

// 状态
const currentRole = ref('finance_director')
const availableRoles = ref<BusinessRole[]>([])
const selectedTimeRange = ref<TimeRange>()
const selectedSalesTimeRange = ref<TimeRange>()
const selectedTimePeriod = ref('2025')
const selectedProfitPeriod = ref('2025')
const financialData = ref<FinancialAnalysisData | null>(null)
const budgetExecution = ref<BudgetExecutionData[]>([])
const riskAlerts = ref<FinancialRiskAlert[]>([])
const operationTargetsData = ref<OperationTargetData[]>([
  {
    quarter: '2025-Q1',
    targets: {
      totalProfitTarget: 12000000,
      serviceFeeTarget: 8000000,
      rebateTarget: 4000000
    },
    achievements: {
      totalProfitActual: 11400000,
      totalProfitGap: -600000,
      totalProfitRate: 95.0,
      serviceFeeActual: 7600000,
      serviceFeeGap: -400000,
      serviceFeeRate: 95.0,
      rebateActual: 3800000,
      rebateGap: -200000,
      rebateRate: 95.0
    }
  },
  {
    quarter: '2025-Q2',
    targets: {
      totalProfitTarget: 13000000,
      serviceFeeTarget: 8500000,
      rebateTarget: 4500000
    },
    achievements: {
      totalProfitActual: 12350000,
      totalProfitGap: -650000,
      totalProfitRate: 95.0,
      serviceFeeActual: 8075000,
      serviceFeeGap: -425000,
      serviceFeeRate: 95.0,
      rebateActual: 4275000,
      rebateGap: -225000,
      rebateRate: 95.0
    }
  },
  {
    quarter: '2025-Q3',
    targets: {
      totalProfitTarget: 14000000,
      serviceFeeTarget: 9000000,
      rebateTarget: 5000000
    },
    achievements: {
      totalProfitActual: 13300000,
      totalProfitGap: -700000,
      totalProfitRate: 95.0,
      serviceFeeActual: 8550000,
      serviceFeeGap: -450000,
      serviceFeeRate: 95.0,
      rebateActual: 4750000,
      rebateGap: -250000,
      rebateRate: 95.0
    }
  },
  {
    quarter: '2025-Q4',
    targets: {
      totalProfitTarget: 15000000,
      serviceFeeTarget: 9500000,
      rebateTarget: 5500000
    },
    achievements: {
      totalProfitActual: 14250000,
      totalProfitGap: -750000,
      totalProfitRate: 95.0,
      serviceFeeActual: 9025000,
      serviceFeeGap: -475000,
      serviceFeeRate: 95.0,
      rebateActual: 5225000,
      rebateGap: -275000,
      rebateRate: 95.0
    }
  }
])
const departmentTargetsData = ref<DepartmentTargetData[]>([
  {
    departmentId: 'ops-001',
    targets: {
      totalProfitTarget: 3000000,
      serviceFeeTarget: 2000000,
      rebateTarget: 1000000
    },
    achievements: {
      totalProfitActual: 2850000,
      totalProfitGap: -150000,
      totalProfitRate: 95.0,
      serviceFeeActual: 1900000,
      serviceFeeGap: -100000,
      serviceFeeRate: 95.0,
      rebateActual: 950000,
      rebateGap: -50000,
      rebateRate: 95.0
    }
  },
  {
    departmentId: 'ops-002',
    targets: {
      totalProfitTarget: 2500000,
      serviceFeeTarget: 1700000,
      rebateTarget: 800000
    },
    achievements: {
      totalProfitActual: 2375000,
      totalProfitGap: -125000,
      totalProfitRate: 95.0,
      serviceFeeActual: 1615000,
      serviceFeeGap: -85000,
      serviceFeeRate: 95.0,
      rebateActual: 760000,
      rebateGap: -40000,
      rebateRate: 95.0
    }
  },
  {
    departmentId: 'ops-003',
    targets: {
      totalProfitTarget: 2200000,
      serviceFeeTarget: 1500000,
      rebateTarget: 700000
    },
    achievements: {
      totalProfitActual: 2090000,
      totalProfitGap: -110000,
      totalProfitRate: 95.0,
      serviceFeeActual: 1425000,
      serviceFeeGap: -75000,
      serviceFeeRate: 95.0,
      rebateActual: 665000,
      rebateGap: -35000,
      rebateRate: 95.0
    }
  }
])

const employeeTargetsData = ref([])

const salesTargetData = ref([
  {
    year: '2025',
    salesperson: '张三',
    serviceFeeTarget: 2000000,
    newOrderTarget: 30,
    serviceFeeCompletion: 1700000,
    orderCompletion: 26,
    serviceFeeRatio: 85,
    newOrderRatio: 87,
    totalRatio: 86
  },
  {
    year: '2025',
    salesperson: '李四',
    serviceFeeTarget: 1800000,
    newOrderTarget: 25,
    serviceFeeCompletion: 1440000,
    orderCompletion: 19,
    serviceFeeRatio: 80,
    newOrderRatio: 76,
    totalRatio: 78
  },
  {
    year: '2025',
    salesperson: '王五',
    serviceFeeTarget: 2200000,
    newOrderTarget: 35,
    serviceFeeCompletion: 1980000,
    orderCompletion: 32,
    serviceFeeRatio: 90,
    newOrderRatio: 91,
    totalRatio: 91
  },
  {
    year: '2025',
    salesperson: '赵六',
    serviceFeeTarget: 1600000,
    newOrderTarget: 20,
    serviceFeeCompletion: 1280000,
    orderCompletion: 17,
    serviceFeeRatio: 80,
    newOrderRatio: 85,
    totalRatio: 82
  }
])

// 目标总览相关状态
interface TargetDataItem {
  serviceFeeTarget: number
  serviceFeeActual: number
  serviceFeeCompletion: number
  newOrderTarget: number
  newOrderActual: number
  newOrderCompletion: number
  overallCompletion: number
}

const targetData: Record<string, TargetDataItem> = {
  '2025': { serviceFeeTarget: 30000000, serviceFeeActual: 26850000, serviceFeeCompletion: 89.5, newOrderTarget: 1800, newOrderActual: 1620, newOrderCompletion: 90.0, overallCompletion: 89.8 },
  '2025-Q1': { serviceFeeTarget: 7000000, serviceFeeActual: 6265000, serviceFeeCompletion: 89.5, newOrderTarget: 420, newOrderActual: 378, newOrderCompletion: 90.0, overallCompletion: 89.8 },
  '2025-Q2': { serviceFeeTarget: 7500000, serviceFeeActual: 6712500, serviceFeeCompletion: 89.5, newOrderTarget: 450, newOrderActual: 405, newOrderCompletion: 90.0, overallCompletion: 89.8 },
  '2025-Q3': { serviceFeeTarget: 8000000, serviceFeeActual: 7160000, serviceFeeCompletion: 89.5, newOrderTarget: 480, newOrderActual: 432, newOrderCompletion: 90.0, overallCompletion: 89.8 },
  '2025-Q4': { serviceFeeTarget: 7500000, serviceFeeActual: 6712500, serviceFeeCompletion: 89.5, newOrderTarget: 450, newOrderActual: 405, newOrderCompletion: 90.0, overallCompletion: 89.8 },
  '2025-01': { serviceFeeTarget: 2333333, serviceFeeActual: 2088333, serviceFeeCompletion: 89.5, newOrderTarget: 140, newOrderActual: 126, newOrderCompletion: 90.0, overallCompletion: 89.8 },
  '2025-02': { serviceFeeTarget: 2333333, serviceFeeActual: 2088333, serviceFeeCompletion: 89.5, newOrderTarget: 140, newOrderActual: 126, newOrderCompletion: 90.0, overallCompletion: 89.8 },
  '2025-03': { serviceFeeTarget: 2333333, serviceFeeActual: 2088333, serviceFeeCompletion: 89.5, newOrderTarget: 140, newOrderActual: 126, newOrderCompletion: 90.0, overallCompletion: 89.8 },
  '2025-04': { serviceFeeTarget: 2500000, serviceFeeActual: 2237500, serviceFeeCompletion: 89.5, newOrderTarget: 150, newOrderActual: 135, newOrderCompletion: 90.0, overallCompletion: 89.8 },
  '2025-05': { serviceFeeTarget: 2500000, serviceFeeActual: 2237500, serviceFeeCompletion: 89.5, newOrderTarget: 150, newOrderActual: 135, newOrderCompletion: 90.0, overallCompletion: 89.8 },
  '2025-06': { serviceFeeTarget: 2500000, serviceFeeActual: 2237500, serviceFeeCompletion: 89.5, newOrderTarget: 150, newOrderActual: 135, newOrderCompletion: 90.0, overallCompletion: 89.8 },
  '2025-07': { serviceFeeTarget: 2666667, serviceFeeActual: 2386667, serviceFeeCompletion: 89.5, newOrderTarget: 160, newOrderActual: 144, newOrderCompletion: 90.0, overallCompletion: 89.8 },
  '2025-08': { serviceFeeTarget: 2666667, serviceFeeActual: 2386667, serviceFeeCompletion: 89.5, newOrderTarget: 160, newOrderActual: 144, newOrderCompletion: 90.0, overallCompletion: 89.8 },
  '2025-09': { serviceFeeTarget: 2666667, serviceFeeActual: 2386667, serviceFeeCompletion: 89.5, newOrderTarget: 160, newOrderActual: 144, newOrderCompletion: 90.0, overallCompletion: 89.8 },
  '2025-10': { serviceFeeTarget: 2500000, serviceFeeActual: 2237500, serviceFeeCompletion: 89.5, newOrderTarget: 150, newOrderActual: 135, newOrderCompletion: 90.0, overallCompletion: 89.8 },
  '2025-11': { serviceFeeTarget: 2500000, serviceFeeActual: 2237500, serviceFeeCompletion: 89.5, newOrderTarget: 150, newOrderActual: 135, newOrderCompletion: 90.0, overallCompletion: 89.8 },
  '2025-12': { serviceFeeTarget: 2500000, serviceFeeActual: 2237500, serviceFeeCompletion: 89.5, newOrderTarget: 150, newOrderActual: 135, newOrderCompletion: 90.0, overallCompletion: 89.8 }
}

// 目标总览相关计算属性
const currentTargetData = computed(() => {
  return targetData[selectedTimePeriod.value] || targetData['2025']
})

// 毛利数据相关状态
interface ProfitDataItem {
  totalProfit: number
  totalServiceFee: number
  totalRebate: number
  newCustomerProfit: number
  newCustomerServiceFee: number
  newCustomerRebate: number
  oldCustomerProfit: number
  oldCustomerServiceFee: number
  oldCustomerRebate: number
}

const profitData: Record<string, ProfitDataItem> = {
  '2025': { totalProfit: 33312600, totalServiceFee: 24225000, totalRebate: 9087600, newCustomerProfit: 26650100, newCustomerServiceFee: 19380000, newCustomerRebate: 7270100, oldCustomerProfit: 6662500, oldCustomerServiceFee: 4845000, oldCustomerRebate: 1817500 },
  '2025-Q1': { totalProfit: 7745000, totalServiceFee: 5623000, totalRebate: 2122000, newCustomerProfit: 6196000, newCustomerServiceFee: 4498400, newCustomerRebate: 1697600, oldCustomerProfit: 1549000, oldCustomerServiceFee: 1124600, oldCustomerRebate: 424400 },
  '2025-Q2': { totalProfit: 8863000, totalServiceFee: 6441000, totalRebate: 2422000, newCustomerProfit: 7090400, newCustomerServiceFee: 5152800, newCustomerRebate: 1937600, oldCustomerProfit: 1772600, oldCustomerServiceFee: 1288200, oldCustomerRebate: 484400 },
  '2025-Q3': { totalProfit: 9712000, totalServiceFee: 7058500, totalRebate: 2653500, newCustomerProfit: 7769600, newCustomerServiceFee: 5646800, newCustomerRebate: 2122800, oldCustomerProfit: 1942400, oldCustomerServiceFee: 1411700, oldCustomerRebate: 530700 },
  '2025-Q4': { totalProfit: 6992600, totalServiceFee: 5102500, totalRebate: 1890100, newCustomerProfit: 5594100, newCustomerServiceFee: 4082000, newCustomerRebate: 1512100, oldCustomerProfit: 1398500, oldCustomerServiceFee: 1020500, oldCustomerRebate: 378000 },
  '2025-01': { totalProfit: 2581700, totalServiceFee: 1874300, totalRebate: 707400, newCustomerProfit: 2065400, newCustomerServiceFee: 1499400, newCustomerRebate: 565900, oldCustomerProfit: 516300, oldCustomerServiceFee: 374900, oldCustomerRebate: 141500 },
  '2025-02': { totalProfit: 2581700, totalServiceFee: 1874300, totalRebate: 707400, newCustomerProfit: 2065400, newCustomerServiceFee: 1499400, newCustomerRebate: 565900, oldCustomerProfit: 516300, oldCustomerServiceFee: 374900, oldCustomerRebate: 141500 },
  '2025-03': { totalProfit: 2581700, totalServiceFee: 1874300, totalRebate: 707400, newCustomerProfit: 2065400, newCustomerServiceFee: 1499400, newCustomerRebate: 565900, oldCustomerProfit: 516300, oldCustomerServiceFee: 374900, oldCustomerRebate: 141500 },
  '2025-04': { totalProfit: 2954300, totalServiceFee: 2147000, totalRebate: 807300, newCustomerProfit: 2363500, newCustomerServiceFee: 1717600, newCustomerRebate: 645800, oldCustomerProfit: 590900, oldCustomerServiceFee: 429400, oldCustomerRebate: 161500 },
  '2025-05': { totalProfit: 2954300, totalServiceFee: 2147000, totalRebate: 807300, newCustomerProfit: 2363500, newCustomerServiceFee: 1717600, newCustomerRebate: 645800, oldCustomerProfit: 590900, oldCustomerServiceFee: 429400, oldCustomerRebate: 161500 },
  '2025-06': { totalProfit: 2954300, totalServiceFee: 2147000, totalRebate: 807300, newCustomerProfit: 2363500, newCustomerServiceFee: 1717600, newCustomerRebate: 645800, oldCustomerProfit: 590900, oldCustomerServiceFee: 429400, oldCustomerRebate: 161500 },
  '2025-07': { totalProfit: 3237300, totalServiceFee: 2352800, totalRebate: 884500, newCustomerProfit: 2590000, newCustomerServiceFee: 1882200, newCustomerRebate: 707600, oldCustomerProfit: 647500, oldCustomerServiceFee: 470600, oldCustomerRebate: 176900 },
  '2025-08': { totalProfit: 3237300, totalServiceFee: 2352800, totalRebate: 884500, newCustomerProfit: 2590000, newCustomerServiceFee: 1882200, newCustomerRebate: 707600, oldCustomerProfit: 647500, oldCustomerServiceFee: 470600, oldCustomerRebate: 176900 },
  '2025-09': { totalProfit: 3237300, totalServiceFee: 2352800, totalRebate: 884500, newCustomerProfit: 2590000, newCustomerServiceFee: 1882200, newCustomerRebate: 707600, oldCustomerProfit: 647500, oldCustomerServiceFee: 470600, oldCustomerRebate: 176900 },
  '2025-10': { totalProfit: 2330900, totalServiceFee: 1700800, totalRebate: 630000, newCustomerProfit: 1864700, newCustomerServiceFee: 1360700, newCustomerRebate: 504000, oldCustomerProfit: 466200, oldCustomerServiceFee: 340200, oldCustomerRebate: 126000 },
  '2025-11': { totalProfit: 2330900, totalServiceFee: 1700800, totalRebate: 630000, newCustomerProfit: 1864700, newCustomerServiceFee: 1360700, newCustomerRebate: 504000, oldCustomerProfit: 466200, oldCustomerServiceFee: 340200, oldCustomerRebate: 126000 },
  '2025-12': { totalProfit: 2330900, totalServiceFee: 1700800, totalRebate: 630000, newCustomerProfit: 1864700, newCustomerServiceFee: 1360700, newCustomerRebate: 504000, oldCustomerProfit: 466200, oldCustomerServiceFee: 340200, oldCustomerRebate: 126000 }
}

// 毛利数据相关计算属性
const currentProfitData = computed(() => {
  return profitData[selectedProfitPeriod.value] || profitData['2025']
})

// 方法
const handleRoleChange = (role: string) => {
  currentRole.value = role
  console.log('角色切换至:', role)
}

const handleTimeRangeChange = (timeRange: TimeRange) => {
  selectedTimeRange.value = timeRange
  console.log('时间范围变更:', timeRange)
}

const handleQuarterChange = (quarter: string) => {
  console.log('季度变更:', quarter)
}

const handleTimePeriodChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  selectedTimePeriod.value = target.value
  console.log('时间周期切换至:', target.value)
}

const getCompletionClass = (rate: number): string => {
  if (rate >= 95) return 'excellent'
  if (rate >= 85) return 'good'
  if (rate >= 70) return 'average'
  return 'poor'
}

const handleDepartmentClick = (departmentId: string) => {
  console.log('部门点击:', departmentId)
}

const handleEmployeeClick = (employeeId: string) => {
  console.log('员工点击:', employeeId)
}

const handleSalesTimeRangeChange = (timeRange: TimeRange) => {
  selectedSalesTimeRange.value = timeRange
  console.log('销售时间范围变更:', timeRange)
}

const getRatioClass = (ratio: number): string => {
  if (ratio >= 90) return 'excellent'
  if (ratio >= 80) return 'good'
  if (ratio >= 70) return 'fair'
  return 'poor'
}

const handleProfitPeriodChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  selectedProfitPeriod.value = target.value
  console.log('毛利时间周期切换至:', target.value)
}

const getTimePeriodLabel = (period: string): string => {
  const labels: Record<string, string> = {
    '2025': '2025年',
    '2025-Q1': '2025年Q1',
    '2025-Q2': '2025年Q2',
    '2025-Q3': '2025年Q3',
    '2025-Q4': '2025年Q4',
    '2025-01': '2025年1月',
    '2025-02': '2025年2月',
    '2025-03': '2025年3月',
    '2025-04': '2025年4月',
    '2025-05': '2025年5月',
    '2025-06': '2025年6月',
    '2025-07': '2025年7月',
    '2025-08': '2025年8月',
    '2025-09': '2025年9月',
    '2025-10': '2025年10月',
    '2025-11': '2025年11月',
    '2025-12': '2025年12月'
  }
  return labels[period] || period
}

const formatCurrency = (value: number): string => {
  if (value >= 100000000) {
    return `¥${(value / 100000000).toFixed(2)}亿`
  } else if (value >= 10000) {
    return `¥${(value / 10000).toFixed(2)}万`
  } else {
    return `¥${value.toLocaleString()}`
  }
}

const getExecutionRateClass = (rate: number): string => {
  if (rate <= 80) return 'low'
  if (rate <= 100) return 'normal'
  if (rate <= 110) return 'high'
  return 'exceed'
}

const getLevelText = (level: string): string => {
  const texts: Record<string, string> = {
    high: '高风险',
    medium: '中风险',
    low: '低风险'
  }
  return texts[level] || level
}

// 生命周期
onMounted(async () => {
  try {
    const [
      rolesData,
      financialAnalysisData,
      budgetData,
      riskData
    ] = await Promise.all([
      businessAPI.getRoles(),
      businessAPI.getFinancialAnalysisData(),
      businessAPI.getBudgetExecutionData(),
      businessAPI.getFinancialRiskAlerts()
    ])

    availableRoles.value = rolesData
    financialData.value = financialAnalysisData
    budgetExecution.value = budgetData
    riskAlerts.value = riskData
  } catch (error) {
    console.error('数据加载失败:', error)
  }
})
</script>

<style scoped>
.finance-director-dashboard {
  padding: 24px;
  background: #f5f5f5;
  min-height: 100vh;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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

.dashboard-time-selector {
  margin-bottom: 24px;
}

.dashboard-section {
  margin-bottom: 32px;
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section-title {
  margin: 0 0 20px 0;
  font-size: 18px;
  font-weight: 600;
  color: #262626;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.target-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.target-card {
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.card-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.card-icon.service-fee {
  background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
}

.card-icon.new-orders {
  background: linear-gradient(135deg, #1890ff 0%, #40a9ff 100%);
}

.card-icon.total {
  background: linear-gradient(135deg, #722ed1 0%, #9254de 100%);
}

.card-info {
  flex: 1;
}

.card-title {
  font-size: 14px;
  color: #8c8c8c;
  margin-bottom: 4px;
}

.card-value {
  font-size: 20px;
  font-weight: 700;
  color: #262626;
}

.card-progress {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: #f0f0f0;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #52c41a 0%, #73d13d 100%);
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 12px;
  color: #8c8c8c;
  white-space: nowrap;
}

.sales-target-table-container {
  overflow-x: auto;
  margin-top: 20px;
}

.sales-target-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  border: 1px solid #f0f0f0;
}

.sales-target-table th,
.sales-target-table td {
  padding: 12px 8px;
  text-align: center;
  border-bottom: 1px solid #f0f0f0;
  border-right: 1px solid #f0f0f0;
}

.sales-target-table th {
  background: #fafafa;
  font-weight: 600;
  color: #262626;
}

.sales-target-table .sub-header th {
  background: #f0f9ff;
  font-size: 12px;
  color: #595959;
}

.year-cell,
.salesperson-cell {
  text-align: left !important;
  font-weight: 500;
}

.target-cell {
  color: #1890ff;
  font-weight: 500;
}

.completion-cell {
  color: #52c41a;
  font-weight: 500;
}

.ratio-cell,
.total-ratio-cell {
  font-weight: 600;
}

.ratio-cell.excellent,
.total-ratio-cell.excellent {
  color: #52c41a;
  background: #f6ffed;
}

.ratio-cell.good,
.total-ratio-cell.good {
  color: #1890ff;
  background: #e6f7ff;
}

.ratio-cell.fair,
.total-ratio-cell.fair {
  color: #faad14;
  background: #fff7e6;
}

.ratio-cell.poor,
.total-ratio-cell.poor {
  color: #ff4d4f;
  background: #fff2f0;
}

/* 目标卡片样式 */
.target-filter {
  display: flex;
  align-items: center;
}

.target-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
  margin-top: 20px;
  margin-bottom: 32px;
}

.target-card {
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.target-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.target-card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.target-card-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.service-fee-card .target-card-icon {
  background: linear-gradient(135deg, #1890ff, #40a9ff);
}

.new-order-card .target-card-icon {
  background: linear-gradient(135deg, #52c41a, #73d13d);
}

.overall-card .target-card-icon {
  background: linear-gradient(135deg, #faad14, #ffc53d);
}

.target-card-title h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #262626;
}

.target-period {
  margin: 4px 0 0 0;
  font-size: 12px;
  color: #8c8c8c;
}

.target-card-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.target-value {
  font-size: 28px;
  font-weight: 700;
  color: #262626;
  line-height: 1;
}

.target-value.overall-rate {
  font-size: 32px;
}

.completion-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.completion-value {
  font-size: 14px;
  color: #595959;
}

.completion-rate {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.completion-rate.excellent {
  color: #52c41a;
  background: #f6ffed;
}

.completion-rate.good {
  color: #1890ff;
  background: #e6f7ff;
}

.completion-rate.average {
  color: #faad14;
  background: #fff7e6;
}

.completion-rate.poor {
  color: #ff4d4f;
  background: #fff2f0;
}

.completion-metrics {
  display: flex;
  gap: 16px;
}

.metric-item {
  font-size: 12px;
  color: #8c8c8c;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #1890ff, #40a9ff);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.service-fee-card .progress-fill {
  background: linear-gradient(90deg, #1890ff, #40a9ff);
}

.new-order-card .progress-fill {
  background: linear-gradient(90deg, #52c41a, #73d13d);
}

.overall-card .progress-fill {
  background: linear-gradient(90deg, #faad14, #ffc53d);
}

/* 销售人员表格样式 */
.sales-personnel-table-container {
  overflow-x: auto !important;
  background: #fff !important;
  border: 1px solid #f0f0f0 !important;
  border-radius: 6px !important;
}

.sales-personnel-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  min-width: 1400px;
}

.sales-personnel-table th {
  background: #fafafa !important;
  border: 1px solid #f0f0f0 !important;
  padding: 12px 8px !important;
  text-align: center !important;
  font-weight: 600 !important;
  color: #262626 !important;
  white-space: nowrap !important;
}

.sales-personnel-table td {
  border: 1px solid #f0f0f0 !important;
  padding: 10px 8px !important;
  text-align: center !important;
  color: #595959 !important;
}

.sales-personnel-table .personnel-name-cell {
  text-align: left !important;
  font-weight: 500 !important;
  color: #262626 !important;
  padding-left: 16px !important;
}

.sales-personnel-table .target-group-header {
  background: #e6f7ff !important;
  color: #1890ff !important;
  font-weight: 600;
}

.sales-personnel-table .completion-group-header {
  background: #f6ffed !important;
  color: #52c41a !important;
  font-weight: 600;
}

.sales-personnel-table .comparison-group-header {
  background: #fff7e6 !important;
  color: #faad14 !important;
  font-weight: 600;
}

.sales-personnel-table .baseline-group-header {
  background: #f0f0f0 !important;
  color: #595959 !important;
  font-weight: 600;
}

.sales-personnel-table .target-header {
  background: #e6f7ff !important;
  color: #1890ff !important;
  font-weight: 600;
}

.sales-personnel-table .completion-header {
  background: #f6ffed !important;
  color: #52c41a !important;
  font-weight: 600;
}

.sales-personnel-table .comparison-header {
  background: #fff7e6 !important;
  color: #faad14 !important;
  font-weight: 600;
}

.sales-personnel-table .baseline-header {
  background: #f0f0f0 !important;
  color: #595959 !important;
  font-weight: 600;
}

.sales-personnel-table .target-cell {
  background: #f0f8ff !important;
  color: #1890ff !important;
  font-weight: 500;
}

.sales-personnel-table .completion-cell {
  background: #f6ffed !important;
  color: #52c41a !important;
  font-weight: 500;
}

.sales-personnel-table .comparison-cell {
  background: #fffbf0 !important;
  font-weight: 600;
}

.sales-personnel-table .baseline-cell {
  background: #f9f9f9 !important;
  color: #8c8c8c !important;
  font-weight: 400;
}

.sales-personnel-table .comparison-cell.excellent {
  color: #52c41a !important;
  font-weight: 600;
}

.sales-personnel-table .comparison-cell.good {
  color: #1890ff !important;
  font-weight: 600;
}

.sales-personnel-table .comparison-cell.average {
  color: #faad14 !important;
  font-weight: 600;
}

.sales-personnel-table .comparison-cell.poor {
  color: #ff4d4f !important;
  font-weight: 600;
}

.sales-personnel-table .personnel-row {
  background: #fff !important;
}

.sales-personnel-table .personnel-row:nth-child(even) {
  background: #fafafa !important;
}

.sales-personnel-table .personnel-row:hover {
  background: #f0f8ff !important;
}

/* 毛利卡片样式 */
.profit-filter {
  display: flex;
  align-items: center;
}

.time-filter-select {
  padding: 6px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  color: #262626;
  background: #fff;
  cursor: pointer;
}

.time-filter-select:focus {
  outline: none;
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.profit-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
  margin-top: 20px;
  margin-bottom: 32px;
}

.profit-card {
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.profit-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.profit-card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.profit-card-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.total-profit-card .profit-card-icon {
  background: linear-gradient(135deg, #52c41a, #73d13d);
}

.service-fee-card .profit-card-icon {
  background: linear-gradient(135deg, #1890ff, #40a9ff);
}

.rebate-card .profit-card-icon {
  background: linear-gradient(135deg, #ff4d4f, #ff7875);
}

.profit-card-title h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #262626;
}

.profit-period {
  margin: 4px 0 0 0;
  font-size: 12px;
  color: #8c8c8c;
}

.profit-card-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.profit-value {
  font-size: 28px;
  font-weight: 700;
  color: #262626;
  line-height: 1;
}

.profit-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-label {
  font-size: 12px;
  color: #8c8c8c;
}

.detail-value {
  font-size: 14px;
  font-weight: 500;
  color: #595959;
}

/* 员工总毛利完成表格样式 */
.employee-profit-table-container {
  overflow-x: auto !important;
  background: #fff !important;
  border: 1px solid #f0f0f0 !important;
  border-radius: 6px !important;
}

.employee-profit-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  min-width: 1400px;
}

.employee-profit-table th {
  background: #fafafa !important;
  border: 1px solid #f0f0f0 !important;
  padding: 12px 8px !important;
  text-align: center !important;
  font-weight: 600 !important;
  color: #262626 !important;
  white-space: nowrap !important;
}

.employee-profit-table td {
  border: 1px solid #f0f0f0 !important;
  padding: 10px 8px !important;
  text-align: center !important;
  color: #595959 !important;
}

/* 员工总毛利完成表格 - 组标题样式 */
.employee-profit-table .target-group-header {
  background: #e6f7ff !important;
  color: #1890ff !important;
  font-weight: 600;
}

.employee-profit-table .completion-group-header {
  background: #f6ffed !important;
  color: #52c41a !important;
  font-weight: 600;
}

.employee-profit-table .comparison-group-header {
  background: #fff7e6 !important;
  color: #faad14 !important;
  font-weight: 600;
}

/* 员工总毛利完成表格 - 子标题样式 */
.employee-profit-table .target-header {
  background: #f0f8ff !important;
  color: #1890ff !important;
  font-weight: 500;
  font-size: 12px;
}

.employee-profit-table .completion-header {
  background: #f0fff0 !important;
  color: #52c41a !important;
  font-weight: 500;
  font-size: 12px;
}

.employee-profit-table .comparison-header {
  background: #fffbf0 !important;
  color: #faad14 !important;
  font-weight: 500;
  font-size: 12px;
}

/* 员工总毛利完成表格 - 数据单元格样式 */
.employee-profit-table .target-cell {
  background: #f8fcff !important;
  color: #1890ff !important;
  font-weight: 500;
}

.employee-profit-table .completion-cell {
  background: #f8fff8 !important;
  color: #52c41a !important;
  font-weight: 500;
}

.employee-profit-table .comparison-cell {
  background: #fffdf8 !important;
  color: #faad14 !important;
  font-weight: 600;
}

.employee-profit-table .comparison-cell.excellent {
  color: #52c41a !important;
  font-weight: 600;
}

.employee-profit-table .comparison-cell.good {
  color: #1890ff !important;
  font-weight: 600;
}

.employee-profit-table .comparison-cell.average {
  color: #faad14 !important;
  font-weight: 600;
}

.employee-profit-table .comparison-cell.poor {
  color: #ff4d4f !important;
  font-weight: 600;
}

/* 员工总毛利完成表格 - 行样式 */
.employee-profit-table .year-row {
  background: #f0f8ff !important;
  font-weight: 600;
}

.employee-profit-table .personnel-row {
  background: #fff !important;
}

.employee-profit-table .personnel-row:nth-child(even) {
  background: #fafafa !important;
}

.employee-profit-table .personnel-row:hover {
  background: #f0f8ff !important;
}

.revenue-analysis-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
}

.revenue-summary-card {
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 20px;
}

.revenue-summary-card h3 {
  margin: 0 0 16px 0;
  font-size: 16px;
  color: #262626;
}

.revenue-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.revenue-item {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 12px;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.revenue-item:last-child {
  border-bottom: none;
}

.revenue-item-name {
  font-weight: 500;
  color: #262626;
}

.revenue-item-amount {
  font-weight: 600;
  color: #52c41a;
}

.revenue-item-percentage {
  font-size: 12px;
  color: #8c8c8c;
}

.budget-execution-table-container {
  overflow-x: auto;
}

.budget-execution-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.budget-execution-table th,
.budget-execution-table td {
  padding: 12px 8px;
  text-align: right;
  border-bottom: 1px solid #f0f0f0;
}

.budget-execution-table th {
  background: #fafafa;
  font-weight: 600;
  color: #262626;
}

.department-name {
  text-align: left !important;
  font-weight: 500;
}

.execution-rate {
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 500;
}

.execution-rate.low {
  background: #fff2f0;
  color: #ff4d4f;
}

.execution-rate.normal {
  background: #f6ffed;
  color: #52c41a;
}

.execution-rate.high {
  background: #fff7e6;
  color: #faad14;
}

.execution-rate.exceed {
  background: #fff2f0;
  color: #ff4d4f;
}

.variance.positive {
  color: #52c41a;
}

.variance.negative {
  color: #ff4d4f;
}

.remaining.positive {
  color: #52c41a;
}

.remaining.negative {
  color: #ff4d4f;
}

.ratios-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.ratio-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
}

.ratio-icon {
  width: 48px;
  height: 48px;
  background: #1890ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.ratio-content {
  flex: 1;
}

.ratio-label {
  font-size: 13px;
  color: #8c8c8c;
  margin-bottom: 4px;
}

.ratio-value {
  font-size: 20px;
  font-weight: 700;
  color: #262626;
  margin-bottom: 4px;
}

.ratio-status {
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 10px;
  font-weight: 500;
}

.ratio-status.excellent {
  background: #f6ffed;
  color: #52c41a;
}

.ratio-status.good {
  background: #e6f7ff;
  color: #1890ff;
}

.risk-alerts-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.risk-alert-card {
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 20px;
  background: #fff;
}

.risk-alert-card.risk-high {
  border-left: 4px solid #ff4d4f;
  background: #fff2f0;
}

.risk-alert-card.risk-medium {
  border-left: 4px solid #faad14;
  background: #fff7e6;
}

.risk-alert-card.risk-low {
  border-left: 4px solid #52c41a;
  background: #f6ffed;
}

.alert-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
}

.alert-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.alert-icon--high {
  background: #ff4d4f;
}

.alert-icon--medium {
  background: #faad14;
}

.alert-icon--low {
  background: #52c41a;
}

.alert-info {
  flex: 1;
}

.alert-title {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: #262626;
}

.alert-description {
  margin: 0;
  font-size: 13px;
  color: #595959;
}

.alert-level {
  margin-left: auto;
}

.level-badge {
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 500;
}

.level-badge.level-high {
  background: #fff2f0;
  color: #ff4d4f;
}

.level-badge.level-medium {
  background: #fff7e6;
  color: #faad14;
}

.level-badge.level-low {
  background: #f6ffed;
  color: #52c41a;
}

.alert-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.alert-values {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #8c8c8c;
}

.alert-recommendation {
  font-size: 13px;
  color: #595959;
  line-height: 1.4;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .ratios-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .finance-director-dashboard {
    padding: 16px;
  }

  .dashboard-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .metrics-grid {
    grid-template-columns: 1fr;
  }

  .revenue-analysis-grid {
    grid-template-columns: 1fr;
  }

  .ratios-grid {
    grid-template-columns: 1fr;
  }

  .revenue-item {
    grid-template-columns: 1fr;
    gap: 4px;
  }
}
</style>
