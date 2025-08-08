<template>
  <div class="sales-person-dashboard">
    <div class="dashboard-header">
      <div class="dashboard-header__left">
        <h1 class="dashboard-title">销售人员看板</h1>
        <p class="dashboard-subtitle">追踪个人业绩，管理客户关系</p>
      </div>

      <div class="dashboard-header__right">
        <RoleSwitcher
          :current-role="currentRole"
          :available-roles="availableRoles"
          @role-change="handleRoleChange"
        />
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>正在加载数据...</p>
    </div>

    <div v-else class="dashboard-content">
      <!-- 核心指标概览 -->
      <div class="dashboard-section">
        <div class="section-header">
          <h2 class="section-title">核心指标概览</h2>
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

        <!-- 季度目标完成表格 -->
        <div class="quarterly-targets-table-container">
          <table class="quarterly-targets-table">
            <thead>
              <tr>
                <th rowspan="2">时间选择</th>
                <th rowspan="2">年度合计</th>
                <th colspan="3" class="target-group-header">目标</th>
                <th colspan="3" class="completion-group-header">完成</th>
                <th colspan="3" class="comparison-group-header">对比</th>
              </tr>
              <tr>
                <th class="target-header">服务费目标</th>
                <th class="target-header">新单目标</th>
                <th class="target-header">综合目标</th>
                <th class="completion-header">服务费完成</th>
                <th class="completion-header">新单完成</th>
                <th class="completion-header">综合完成</th>
                <th class="comparison-header">完成比例</th>
                <th class="comparison-header">服务费基准</th>
                <th class="comparison-header">订单基准</th>
              </tr>
            </thead>
            <tbody>
              <!-- 年度数据 -->
              <tr class="year-row">
                <td class="time-cell">2025年度</td>
                <td class="total-cell">¥3000万</td>
                <td class="target-cell">¥3000万</td>
                <td class="target-cell">180单</td>
                <td class="target-cell">95%</td>
                <td class="completion-cell">¥2850万</td>
                <td class="completion-cell">156单</td>
                <td class="completion-cell">92.5%</td>
                <td class="comparison-cell">95.0%</td>
                <td class="comparison-cell">86.7%</td>
                <td class="comparison-cell">90.8%</td>
              </tr>

              <!-- 季度数据 -->
              <tr v-for="quarter in annualQuarterlyTargets?.quarters || []" :key="quarter.quarter" class="quarter-row">
                <td class="time-cell">{{ quarter.quarter }}</td>
                <td class="total-cell">{{ formatCurrency(quarter.serviceFeeTarget) }}</td>
                <td class="target-cell">{{ formatCurrency(quarter.serviceFeeTarget) }}</td>
                <td class="target-cell">{{ quarter.newOrderTarget }}单</td>
                <td class="target-cell">95%</td>
                <td class="completion-cell">{{ formatCurrency(quarter.serviceFeeActual) }}</td>
                <td class="completion-cell">{{ quarter.newOrderActual }}单</td>
                <td class="completion-cell">{{ Math.round((quarter.serviceFeeCompletion + quarter.newOrderCompletion) / 2 * 10) / 10 }}%</td>
                <td class="comparison-cell">{{ quarter.serviceFeeCompletion }}%</td>
                <td class="comparison-cell">{{ quarter.newOrderCompletion }}%</td>
                <td class="comparison-cell">{{ Math.round((quarter.serviceFeeCompletion + quarter.newOrderCompletion) / 2 * 10) / 10 }}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 新签客户毛利完成模块 -->
      <div class="dashboard-section">
        <div class="section-header">
          <h2 class="section-title">新签客户毛利完成</h2>
          <ModuleTimeFilter
            :initial-time-range="selectedTimeRange"
            :initial-quarter="currentQuarter"
            @time-range-change="handleTimeRangeChange"
            @quarter-change="handleQuarterChange"
          />
        </div>

        <!-- 总体数据统计卡片 -->
        <div class="summary-cards-container">
          <div class="summary-card service-fee-summary">
            <div class="card-icon">
              <DollarSign :size="24" />
            </div>
            <div class="card-content">
              <div class="card-title">服务费目标</div>
              <div class="card-value">{{ formatCurrency(totalStats.serviceFeeTarget) }}</div>
            </div>
          </div>

          <div class="summary-card new-order-summary">
            <div class="card-icon">
              <TrendingUp :size="24" />
            </div>
            <div class="card-content">
              <div class="card-title">新单单量</div>
              <div class="card-value">{{ totalStats.newOrderVolume }}单</div>
            </div>
          </div>

          <div class="summary-card service-fee-actual">
            <div class="card-icon">
              <DollarSign :size="24" />
            </div>
            <div class="card-content">
              <div class="card-title">服务费</div>
              <div class="card-value">{{ formatCurrency(totalStats.serviceFee) }}</div>
              <div class="card-trend" :class="totalStats.serviceFeeTrend >= 0 ? 'positive' : 'negative'">
                {{ totalStats.serviceFeeTrend >= 0 ? '+' : '' }}{{ totalStats.serviceFeeTrend }}%
              </div>
            </div>
          </div>

          <div class="summary-card consumption-summary">
            <div class="card-icon">
              <TrendingUp :size="24" />
            </div>
            <div class="card-content">
              <div class="card-title">消费</div>
              <div class="card-value">{{ formatCurrency(totalStats.consumption) }}</div>
              <div class="card-trend" :class="totalStats.consumptionTrend >= 0 ? 'positive' : 'negative'">
                {{ totalStats.consumptionTrend >= 0 ? '+' : '' }}{{ totalStats.consumptionTrend }}%
              </div>
            </div>
          </div>

          <div class="summary-card rebate-summary">
            <div class="card-icon">
              <RefreshCw :size="24" />
            </div>
            <div class="card-content">
              <div class="card-title">返点</div>
              <div class="card-value">{{ totalStats.singlePoint }}个点</div>
              <div class="card-trend" :class="totalStats.singlePointTrend >= 0 ? 'positive' : 'negative'">
                {{ totalStats.singlePointTrend >= 0 ? '+' : '' }}{{ totalStats.singlePointTrend }}%
              </div>
            </div>
          </div>

          <div class="summary-card profit-summary">
            <div class="card-icon">
              <TrendingUp :size="24" />
            </div>
            <div class="card-content">
              <div class="card-title">毛利总计</div>
              <div class="card-value">{{ formatCurrency(totalStats.grossProfit) }}</div>
              <div class="card-trend" :class="totalStats.grossProfitTrend >= 0 ? 'positive' : 'negative'">
                {{ totalStats.grossProfitTrend >= 0 ? '+' : '' }}{{ totalStats.grossProfitTrend }}%
              </div>
            </div>
          </div>
        </div>

        <!-- 新签客户毛利完成表格 -->
        <div class="new-customer-profit-table-container">
          <table class="new-customer-profit-table">
            <thead>
              <tr>
                <th rowspan="2">客户名称</th>
                <th rowspan="2">年度</th>
                <th colspan="4" class="service-fee-group-header">服务费目标</th>
                <th colspan="4" class="service-fee-actual-group-header">服务费完成</th>
                <th colspan="4" class="consumption-group-header">消费</th>
                <th colspan="4" class="rebate-group-header">返点</th>
                <th colspan="4" class="profit-group-header">毛利</th>
              </tr>
              <tr>
                <th class="service-fee-header">Google</th>
                <th class="service-fee-header">Meta</th>
                <th class="service-fee-header">Criteo</th>
                <th class="service-fee-header">Bing</th>
                <th class="service-fee-actual-header">Google</th>
                <th class="service-fee-actual-header">Meta</th>
                <th class="service-fee-actual-header">Criteo</th>
                <th class="service-fee-actual-header">Bing</th>
                <th class="consumption-header">Google</th>
                <th class="consumption-header">Meta</th>
                <th class="consumption-header">Criteo</th>
                <th class="consumption-header">Bing</th>
                <th class="rebate-header">Google</th>
                <th class="rebate-header">Meta</th>
                <th class="rebate-header">Criteo</th>
                <th class="rebate-header">Bing</th>
                <th class="profit-header">Google</th>
                <th class="profit-header">Meta</th>
                <th class="profit-header">Criteo</th>
                <th class="profit-header">Bing</th>
              </tr>
            </thead>
            <tbody>
              <!-- 华为数据 -->
              <tr class="customer-row">
                <td class="customer-name-cell">华为</td>
                <td>2025</td>
                <td class="service-fee-cell">¥125.63万</td>
                <td class="service-fee-cell">¥98.52万</td>
                <td class="service-fee-cell">¥65.23万</td>
                <td class="service-fee-cell">¥45.12万</td>
                <td class="service-fee-actual-cell">¥118.95万</td>
                <td class="service-fee-actual-cell">¥92.48万</td>
                <td class="service-fee-actual-cell">¥61.75万</td>
                <td class="service-fee-actual-cell">¥42.36万</td>
                <td class="consumption-cell">¥2156.85万</td>
                <td class="consumption-cell">¥1685.42万</td>
                <td class="consumption-cell">¥1125.63万</td>
                <td class="consumption-cell">¥785.96万</td>
                <td class="rebate-cell">¥96.85万</td>
                <td class="rebate-cell">¥75.68万</td>
                <td class="rebate-cell">¥50.52万</td>
                <td class="rebate-cell">¥35.28万</td>
                <td class="profit-cell">¥22.10万</td>
                <td class="profit-cell">¥16.80万</td>
                <td class="profit-cell">¥11.23万</td>
                <td class="profit-cell">¥7.08万</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { DollarSign, TrendingUp, RefreshCw } from 'lucide-vue-next'
import RoleSwitcher from '@/components/business/RoleSwitcher.vue'
import ModuleTimeFilter from '@/components/common/ModuleTimeFilter.vue'
import type {
  BusinessRole,
  AnnualQuarterlyTargets
} from '@/types'

const currentRole = ref('sales_person')
const availableRoles = ref<BusinessRole[]>([])
const loading = ref(true)
const selectedTimeRange = ref('year')
const currentQuarter = ref('2025-Q1')
const selectedProfitPeriod = ref('year')
const selectedTimePeriod = ref('year')

// 年度季度目标数据
const annualQuarterlyTargets = ref<AnnualQuarterlyTargets>({
  year: 2025,
  quarters: [
    { quarter: 'Q1', serviceFeeTarget: 7500000, serviceFeeActual: 7125000, serviceFeeCompletion: 95.0, newOrderTarget: 45, newOrderActual: 39, newOrderCompletion: 86.7 },
    { quarter: 'Q2', serviceFeeTarget: 7500000, serviceFeeActual: 7125000, serviceFeeCompletion: 95.0, newOrderTarget: 45, newOrderActual: 39, newOrderCompletion: 86.7 },
    { quarter: 'Q3', serviceFeeTarget: 7500000, serviceFeeActual: 7125000, serviceFeeCompletion: 95.0, newOrderTarget: 45, newOrderActual: 39, newOrderCompletion: 86.7 },
    { quarter: 'Q4', serviceFeeTarget: 7500000, serviceFeeActual: 7125000, serviceFeeCompletion: 95.0, newOrderTarget: 45, newOrderActual: 39, newOrderCompletion: 86.7 }
  ]
})

// 目标数据映射
const targetData: Record<string, any> = {
  '2025': { serviceFeeTarget: 30000000, serviceFeeActual: 28500000, serviceFeeCompletion: 95.0, newOrderTarget: 180, newOrderActual: 156, newOrderCompletion: 86.7 },
  '2025-Q1': { serviceFeeTarget: 7500000, serviceFeeActual: 7125000, serviceFeeCompletion: 95.0, newOrderTarget: 45, newOrderActual: 39, newOrderCompletion: 86.7 },
  '2025-Q2': { serviceFeeTarget: 7500000, serviceFeeActual: 7125000, serviceFeeCompletion: 95.0, newOrderTarget: 45, newOrderActual: 39, newOrderCompletion: 86.7 },
  '2025-Q3': { serviceFeeTarget: 7500000, serviceFeeActual: 7125000, serviceFeeCompletion: 95.0, newOrderTarget: 45, newOrderActual: 39, newOrderCompletion: 86.7 },
  '2025-Q4': { serviceFeeTarget: 7500000, serviceFeeActual: 7125000, serviceFeeCompletion: 95.0, newOrderTarget: 45, newOrderActual: 39, newOrderCompletion: 86.7 }
}

// 计算属性
const getCurrentTargetData = () => {
  const key = selectedTimeRange.value === 'year' ? '2025' : currentQuarter.value
  return targetData[key] || targetData['2025']
}

const getCompletionClass = (completion: number) => {
  if (completion >= 90) return 'excellent'
  if (completion >= 70) return 'good'
  return 'poor'
}

// 格式化货币
const formatCurrency = (value: number) => {
  return `¥${(value / 10000).toFixed(2)}万`
}

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

// 事件处理
const handleRoleChange = (role: string) => {
  currentRole.value = role
}

const handleTimeRangeChange = (timeRange: string) => {
  selectedTimeRange.value = timeRange
  console.log('Time range changed:', timeRange)
}

const handleQuarterChange = (quarter: string) => {
  currentQuarter.value = quarter
  console.log('Quarter changed:', quarter)
}

// 初始化
onMounted(async () => {
  loading.value = false
})
</script>

<style scoped>
.sales-person-dashboard {
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

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #f0f0f0;
  border-top: 4px solid #1890ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-state p {
  color: #8c8c8c;
  font-size: 16px;
  margin: 0;
}

.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* 模块通用样式 */
.dashboard-section {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
  background: #fafafa;
}

.section-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #262626;
}

/* 目标卡片样式 */
.target-cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  padding: 24px;
}

.target-card {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px;
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.target-card:hover {
  border-color: #1890ff;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.15);
}

.card-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: #f0f9ff;
  color: #1890ff;
  flex-shrink: 0;
}

.service-fee-card .card-icon {
  background: #f0f9ff;
  color: #1890ff;
}

.new-order-card .card-icon {
  background: #f6ffed;
  color: #52c41a;
}

.completion-rate-card .card-icon {
  background: #fff7e6;
  color: #fa8c16;
}

.card-content {
  flex: 1;
}

.card-title {
  font-size: 14px;
  color: #8c8c8c;
  margin-bottom: 4px;
}

.card-period {
  font-size: 12px;
  color: #bfbfbf;
  margin-bottom: 8px;
}

.card-value {
  font-size: 24px;
  font-weight: 600;
  color: #262626;
  margin-bottom: 8px;
}

.card-subtitle {
  font-size: 12px;
  color: #8c8c8c;
  display: flex;
  align-items: center;
  gap: 8px;
}

.completion-rate {
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 500;
  font-size: 11px;
}

.completion-rate.excellent {
  background: #f6ffed;
  color: #52c41a;
}

.completion-rate.good {
  background: #fff7e6;
  color: #fa8c16;
}

.completion-rate.poor {
  background: #fff2f0;
  color: #ff4d4f;
}

.separator {
  color: #d9d9d9;
}

/* 表格样式 */
.quarterly-targets-table-container,
.new-customer-profit-table-container {
  padding: 0 24px 24px;
  overflow-x: auto;
}

.quarterly-targets-table,
.new-customer-profit-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  background: #fff;
}

.quarterly-targets-table th,
.quarterly-targets-table td,
.new-customer-profit-table th,
.new-customer-profit-table td {
  padding: 12px 8px;
  text-align: center;
  border: 1px solid #e8e8e8;
  white-space: nowrap;
}

.quarterly-targets-table th,
.new-customer-profit-table th {
  background: #fafafa;
  font-weight: 600;
  color: #262626;
}

/* 表格分组头部样式 */
.target-group-header {
  background: #e6f7ff !important;
  color: #1890ff !important;
}

.completion-group-header {
  background: #f6ffed !important;
  color: #52c41a !important;
}

.comparison-group-header {
  background: #fff7e6 !important;
  color: #fa8c16 !important;
}

.service-fee-group-header,
.service-fee-actual-group-header {
  background: #e6f7ff !important;
  color: #1890ff !important;
}

.consumption-group-header {
  background: #fff2e8 !important;
  color: #fa541c !important;
}

.rebate-group-header {
  background: #f9f0ff !important;
  color: #722ed1 !important;
}

.profit-group-header {
  background: #f6ffed !important;
  color: #52c41a !important;
}

/* 年度行样式 */
.year-row {
  background: #fafafa;
  font-weight: 600;
}

.year-row td {
  background: #fafafa;
}

/* 季度行样式 */
.quarter-row:hover {
  background: #f5f5f5;
}

/* 客户行样式 */
.customer-row:hover {
  background: #f5f5f5;
}

.customer-name-cell {
  font-weight: 600;
  color: #1890ff;
}

/* 统计卡片样式 */
.summary-cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  padding: 24px;
  background: #fafafa;
}

.summary-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
  transition: all 0.3s ease;
}

.summary-card:hover {
  border-color: #1890ff;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.15);
}

.summary-card .card-icon {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.service-fee-summary .card-icon,
.service-fee-actual .card-icon {
  background: #e6f7ff;
  color: #1890ff;
}

.new-order-summary .card-icon {
  background: #f6ffed;
  color: #52c41a;
}

.consumption-summary .card-icon {
  background: #fff2e8;
  color: #fa541c;
}

.rebate-summary .card-icon {
  background: #f9f0ff;
  color: #722ed1;
}

.profit-summary .card-icon {
  background: #f6ffed;
  color: #52c41a;
}

.summary-card .card-content {
  flex: 1;
}

.summary-card .card-title {
  font-size: 12px;
  color: #8c8c8c;
  margin-bottom: 4px;
}

.summary-card .card-value {
  font-size: 18px;
  font-weight: 600;
  color: #262626;
  margin-bottom: 2px;
}

.card-trend {
  font-size: 11px;
  font-weight: 500;
}

.card-trend.positive {
  color: #52c41a;
}

.card-trend.negative {
  color: #ff4d4f;
}

@media (max-width: 768px) {
  .sales-person-dashboard {
    padding: 16px;
  }

  .dashboard-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .dashboard-title {
    font-size: 20px;
  }

  .target-cards-container {
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 16px;
  }

  .summary-cards-container {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 12px;
    padding: 16px;
  }

  .section-header {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }

  .quarterly-targets-table-container,
  .new-customer-profit-table-container {
    padding: 0 16px 16px;
  }

  .quarterly-targets-table th,
  .quarterly-targets-table td,
  .new-customer-profit-table th,
  .new-customer-profit-table td {
    padding: 8px 4px;
    font-size: 12px;
  }
}
</style>
