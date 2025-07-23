<template>
  <div class="optimizer-customer-analysis-module">
    <div class="analysis-module__header">
      <h3 class="analysis-module__title">新老客户分析</h3>
      <div class="analysis-module__controls">
        <div class="quarter-selector">
          <select v-model="selectedQuarter" @change="handleQuarterChange" class="quarter-select">
            <option value="2024Q1">2024年Q1</option>
            <option value="2024Q2">2024年Q2</option>
            <option value="2024Q3">2024年Q3</option>
            <option value="2024Q4">2024年Q4</option>
          </select>
        </div>
        <div class="analysis-summary">
          <span class="summary-label">新客转化率:</span>
          <span class="summary-value" :class="getConversionClass(customerAnalysis.newCustomerConversionRate)">
            {{ customerAnalysis.newCustomerConversionRate.toFixed(1) }}%
          </span>
        </div>
      </div>
    </div>

    <div class="analysis-module__content">
      <!-- 客户分布概览 -->
      <div class="customer-distribution">
        <div class="distribution-cards">
          <div class="distribution-card">
            <div class="card-header">
              <UserPlus :size="20" />
              <span>新客户</span>
            </div>
            <div class="card-content">
              <div class="card-value new-customer">{{ customerAnalysis.newCustomers.count }}家</div>
              <div class="card-details">
                <div class="detail-item">
                  <span class="detail-label">转化率:</span>
                  <span class="detail-value">{{ customerAnalysis.newCustomers.conversionRate.toFixed(1) }}%</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">平均花费:</span>
                  <span class="detail-value">{{ formatCurrency(customerAnalysis.newCustomers.avgSpend) }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">平均ROI:</span>
                  <span class="detail-value">{{ customerAnalysis.newCustomers.avgROI.toFixed(2) }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="distribution-card">
            <div class="card-header">
              <Users :size="20" />
              <span>老客户</span>
            </div>
            <div class="card-content">
              <div class="card-value existing-customer">{{ customerAnalysis.existingCustomers.count }}家</div>
              <div class="card-details">
                <div class="detail-item">
                  <span class="detail-label">留存率:</span>
                  <span class="detail-value">{{ customerAnalysis.existingCustomers.retentionRate.toFixed(1) }}%</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">平均花费:</span>
                  <span class="detail-value">{{ formatCurrency(customerAnalysis.existingCustomers.avgSpend) }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">平均ROI:</span>
                  <span class="detail-value">{{ customerAnalysis.existingCustomers.avgROI.toFixed(2) }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="distribution-card">
            <div class="card-header">
              <UserX :size="20" />
              <span>流失客户</span>
            </div>
            <div class="card-content">
              <div class="card-value churn-customer">{{ customerAnalysis.churnCustomers.count }}家</div>
              <div class="card-details">
                <div class="detail-item">
                  <span class="detail-label">流失率:</span>
                  <span class="detail-value">{{ customerAnalysis.churnCustomers.churnRate.toFixed(1) }}%</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">平均生命周期:</span>
                  <span class="detail-value">{{ customerAnalysis.churnCustomers.avgLifetime }}天</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">平均价值:</span>
                  <span class="detail-value">{{ formatCurrency(customerAnalysis.churnCustomers.avgValue) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 客户获取漏斗 -->
      <div class="acquisition-funnel">
        <div class="funnel-header">
          <h4>客户获取漏斗</h4>
          <div class="funnel-metrics">
            <span class="metric-item">
              <span class="metric-label">总转化率:</span>
              <span class="metric-value">{{ customerAnalysis.acquisitionFunnel.overallConversionRate.toFixed(1) }}%</span>
            </span>
          </div>
        </div>

        <div class="funnel-chart">
          <div
            v-for="stage in customerAnalysis.acquisitionFunnel.stages"
            :key="stage.stageName"
            class="funnel-stage"
            :style="{ width: getFunnelWidth(stage.conversionRate) + '%' }"
          >
            <div class="stage-content">
              <div class="stage-info">
                <span class="stage-name">{{ stage.stageName }}</span>
                <span class="stage-count">{{ stage.count }}人</span>
              </div>
              <div class="stage-rate">{{ stage.conversionRate.toFixed(1) }}%</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 客户生命周期分析 -->
      <div class="lifecycle-analysis">
        <div class="lifecycle-header">
          <h4>客户生命周期分析</h4>
          <div class="lifecycle-controls">
            <div class="view-selector">
              <button
                class="view-btn"
                :class="{ active: lifecycleView === 'stages' }"
                @click="lifecycleView = 'stages'"
              >
                生命周期阶段
              </button>
              <button
                class="view-btn"
                :class="{ active: lifecycleView === 'value' }"
                @click="lifecycleView = 'value'"
              >
                价值分布
              </button>
            </div>
          </div>
        </div>

        <div class="lifecycle-content" v-if="lifecycleView === 'stages'">
          <div class="stages-grid">
            <div
              v-for="stage in customerAnalysis.lifecycleStages"
              :key="stage.stageName"
              class="stage-card"
            >
              <div class="stage-card__header">
                <div class="stage-icon" :class="getStageIconClass(stage.icon)">
                  <component :is="getStageIcon(stage.icon)" :size="16" />
                </div>
                <span class="stage-name">{{ stage.stageName }}</span>
              </div>
              <div class="stage-card__content">
                <div class="stage-count">{{ stage.count }}家</div>
                <div class="stage-percentage">{{ stage.percentage.toFixed(1) }}%</div>
                <div class="stage-metrics">
                  <div class="metric">
                    <span class="metric-label">平均价值:</span>
                    <span class="metric-value">{{ formatCurrency(stage.avgValue) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="lifecycle-content" v-else>
          <div class="value-distribution">
            <div class="value-chart">
              <div
                v-for="segment in customerAnalysis.valueSegments"
                :key="segment.segmentName"
                class="value-segment"
                :style="{ height: getValueHeight(segment.percentage) + '%' }"
              >
                <div class="segment-info">
                  <div class="segment-name">{{ segment.segmentName }}</div>
                  <div class="segment-stats">
                    <div class="stat-item">{{ segment.customerCount }}家</div>
                    <div class="stat-item">{{ segment.percentage.toFixed(1) }}%</div>
                    <div class="stat-item">{{ formatCurrency(segment.totalValue) }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 客户详情列表 -->
      <div class="customer-details">
        <div class="details-header">
          <h4>客户详情列表</h4>
          <div class="details-controls">
            <div class="filter-controls">
              <select v-model="customerFilter" class="filter-select">
                <option value="all">全部客户</option>
                <option value="new">新客户</option>
                <option value="existing">老客户</option>
                <option value="churn">流失客户</option>
              </select>
            </div>
            <div class="sort-controls">
              <select v-model="sortBy" class="sort-select">
                <option value="spend">按花费排序</option>
                <option value="roi">按ROI排序</option>
                <option value="status">按状态排序</option>
                <option value="lastActivity">按最后活动时间</option>
              </select>
            </div>
          </div>
        </div>

        <div class="customers-table">
          <div class="table-header">
            <div class="header-cell customer-name">客户名称</div>
            <div class="header-cell customer-type">客户类型</div>
            <div class="header-cell last-activity">最后活动</div>
            <div class="header-cell total-spend">总花费</div>
            <div class="header-cell avg-roi">ROI</div>
            <div class="header-cell status">状态</div>
            <div class="header-cell actions">操作</div>
          </div>

          <div class="table-body">
            <div
              v-for="customer in filteredCustomers"
              :key="customer.customerId"
              class="table-row"
              :class="getCustomerRowClass(customer.type)"
            >
              <div class="table-cell customer-name">
                <div class="customer-info">
                  <div class="customer-name-text">{{ customer.customerName }}</div>
                  <div class="customer-id">ID: {{ customer.customerId }}</div>
                </div>
              </div>
              <div class="table-cell customer-type">
                <div class="type-badge" :class="getTypeBadgeClass(customer.type)">
                  {{ getTypeText(customer.type) }}
                </div>
              </div>
              <div class="table-cell last-activity">
                <span class="date-text">{{ formatDate(customer.lastActivity) }}</span>
              </div>
              <div class="table-cell total-spend">
                <span class="spend-amount">{{ formatCurrency(customer.spend) }}</span>
              </div>
              <div class="table-cell avg-roi">
                <span class="roi-value" :class="getROIClass(customer.roi)">
                  {{ customer.roi.toFixed(2) }}
                </span>
              </div>
              <div class="table-cell status">
                <div class="stage-badge" :class="getStageBadgeClass(customer.status)">
                  {{ getStageText(customer.status) }}
                </div>
              </div>
              <div class="table-cell actions">
                <button class="action-btn" @click="handleViewCustomerDetails(customer.customerId)">
                  <Eye :size="14" />
                  详情
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 无数据状态 -->
        <div v-if="filteredCustomers.length === 0" class="no-customers">
          <div class="no-data-icon">
            <Users :size="48" />
          </div>
          <div class="no-data-text">暂无匹配的客户数据</div>
          <div class="no-data-description">请调整筛选条件或检查数据同步状态</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { UserPlus, Users, UserX, Eye, Zap, TrendingUp, Shield } from 'lucide-vue-next'
import type { OptimizerCustomerAnalysisData } from '@/types'

interface Props {
  customerAnalysis: OptimizerCustomerAnalysisData
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<{
  'quarter-change': [quarter: string]
  'view-customer-details': [customerId: string]
}>()

// 响应式数据
const selectedQuarter = ref('2024Q4')
const lifecycleView = ref<'stages' | 'value'>('stages')
const customerFilter = ref<string>('all')
const sortBy = ref<string>('spend')

// 计算属性
const filteredCustomers = computed(() => {
  let filtered = props.customerAnalysis.customerDetails

  // 筛选
  if (customerFilter.value !== 'all') {
    filtered = filtered.filter(customer => customer.type === customerFilter.value)
  }

  // 排序
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'spend':
        return b.spend - a.spend
      case 'roi':
        return b.roi - a.roi
      case 'status':
        return a.status.localeCompare(b.status)
      case 'lastActivity':
        return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime()
      default:
        return 0
    }
  })

  return filtered
})

// 方法
const formatCurrency = (value: number): string => {
  if (value >= 100000000) {
    return `¥${(value / 100000000).toFixed(2)}亿`
  } else if (value >= 10000) {
    return `¥${(value / 10000).toFixed(1)}万`
  } else {
    return `¥${value.toLocaleString()}`
  }
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

const getConversionClass = (rate: number) => {
  if (rate >= 15) return 'conversion-excellent'
  if (rate >= 10) return 'conversion-good'
  if (rate >= 5) return 'conversion-warning'
  return 'conversion-poor'
}

const getFunnelWidth = (rate: number) => {
  return Math.max(rate, 10) // 最小宽度10%以便显示
}

const getValueHeight = (percentage: number) => {
  return Math.max(percentage * 2, 10) // 放大显示效果
}

const getStageIcon = (icon: string) => {
  const iconMap = {
    potential: Zap,
    new: UserPlus,
    growth: TrendingUp,
    mature: Shield,
    decline: UserX
  }
  return iconMap[icon as keyof typeof iconMap] || Users
}

const getStageIconClass = (icon: string) => {
  return `stage-icon-${icon}`
}

const getCustomerRowClass = (type: string) => {
  return `row-${type}`
}

const getTypeBadgeClass = (type: string) => {
  return `type-${type}`
}

const getTypeText = (type: string) => {
  const typeMap = {
    new: '新客户',
    existing: '老客户',
    churn: '流失客户'
  }
  return typeMap[type as keyof typeof typeMap] || type
}

const getROIClass = (roi: number) => {
  if (roi >= 4) return 'roi-excellent'
  if (roi >= 3) return 'roi-good'
  if (roi >= 2) return 'roi-warning'
  return 'roi-poor'
}

const getStageBadgeClass = (status: string) => {
  return `stage-${status}`
}

const getStageText = (status: string) => {
  const statusMap = {
    active: '活跃',
    inactive: '不活跃',
    potential: '潜在',
    at_risk: '风险',
    churned: '流失'
  }
  return statusMap[status as keyof typeof statusMap] || status
}

const handleQuarterChange = () => {
  emit('quarter-change', selectedQuarter.value)
}

const handleViewCustomerDetails = (customerId: string) => {
  emit('view-customer-details', customerId)
}
</script>

<style scoped>
.optimizer-customer-analysis-module {
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

.quarter-select {
  padding: 6px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  background: #fff;
  color: #262626;
  font-size: 14px;
  outline: none;
}

.analysis-summary {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.summary-label {
  color: #8c8c8c;
}

.summary-value {
  font-weight: 600;
  font-size: 16px;
}

.summary-value.conversion-excellent { color: #52c41a; }
.summary-value.conversion-good { color: #1890ff; }
.summary-value.conversion-warning { color: #fa8c16; }
.summary-value.conversion-poor { color: #ff4d4f; }

.analysis-module__content {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* 客户分布卡片 */
.distribution-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.distribution-card {
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  color: #1890ff;
  font-size: 14px;
  font-weight: 500;
}

.card-value {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 12px;
}

.card-value.new-customer { color: #52c41a; }
.card-value.existing-customer { color: #1890ff; }
.card-value.churn-customer { color: #ff4d4f; }

.card-details {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
}

.detail-label {
  color: #8c8c8c;
}

.detail-value {
  font-weight: 500;
  color: #262626;
}

/* 获取漏斗 */
.funnel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.funnel-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #262626;
}

.funnel-metrics {
  font-size: 14px;
}

.metric-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.metric-label {
  color: #8c8c8c;
}

.metric-value {
  font-weight: 600;
  color: #1890ff;
}

.funnel-chart {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
}

.funnel-stage {
  background: linear-gradient(135deg, #1890ff, #40a9ff);
  color: #fff;
  border-radius: 8px;
  padding: 16px;
  position: relative;
  transition: all 0.3s ease;
}

.funnel-stage:hover {
  transform: scale(1.02);
}

.stage-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stage-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stage-name {
  font-weight: 600;
  font-size: 14px;
}

.stage-count {
  font-size: 12px;
  opacity: 0.9;
}

.stage-rate {
  font-size: 18px;
  font-weight: 700;
}

/* 生命周期分析 */
.lifecycle-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.lifecycle-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #262626;
}

.view-selector {
  display: flex;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  overflow: hidden;
}

.view-btn {
  padding: 6px 12px;
  border: none;
  background: #fff;
  color: #595959;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.view-btn.active {
  background: #1890ff;
  color: #fff;
}

.stages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.stage-card {
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 16px;
}

.stage-card__header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.stage-icon {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.stage-icon-potential { background: #fadb14; }
.stage-icon-new { background: #52c41a; }
.stage-icon-growth { background: #1890ff; }
.stage-icon-mature { background: #722ed1; }
.stage-icon-decline { background: #ff4d4f; }

.stage-count {
  font-size: 20px;
  font-weight: 700;
  color: #262626;
}

.stage-percentage {
  font-size: 12px;
  color: #8c8c8c;
  margin-bottom: 8px;
}

.stage-metrics {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.metric {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
}

.metric-label {
  color: #8c8c8c;
}

.metric-value {
  font-weight: 500;
}

/* 价值分布图 */
.value-chart {
  display: flex;
  align-items: end;
  gap: 16px;
  height: 200px;
  padding: 20px;
}

.value-segment {
  flex: 1;
  background: linear-gradient(180deg, #1890ff, #40a9ff);
  border-radius: 4px 4px 0 0;
  display: flex;
  align-items: end;
  padding: 12px 8px;
  color: #fff;
  transition: all 0.3s ease;
}

.value-segment:hover {
  transform: scale(1.05);
}

.segment-info {
  text-align: center;
  width: 100%;
}

.segment-name {
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 8px;
}

.segment-stats {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-item {
  font-size: 10px;
  opacity: 0.9;
}

/* 客户详情表格 */
.details-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.details-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #262626;
}

.details-controls {
  display: flex;
  gap: 12px;
}

.filter-select,
.sort-select {
  padding: 6px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  background: #fff;
  color: #262626;
  font-size: 14px;
  outline: none;
}

.customers-table {
  border-radius: 8px;
  border: 1px solid #f0f0f0;
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 0.8fr 1fr 0.8fr;
  background: #fafafa;
  border-bottom: 1px solid #f0f0f0;
}

.header-cell {
  padding: 12px 16px;
  font-size: 13px;
  font-weight: 600;
  color: #595959;
  border-right: 1px solid #f0f0f0;
}

.header-cell:last-child {
  border-right: none;
}

.table-body {
  max-height: 400px;
  overflow-y: auto;
}

.table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 0.8fr 1fr 0.8fr;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s;
}

.table-row:hover {
  background: #f9f9f9;
}

.table-row.row-new { background: rgba(82, 196, 26, 0.05); }
.table-row.row-existing { background: rgba(24, 144, 255, 0.05); }
.table-row.row-churn { background: rgba(255, 77, 79, 0.05); }

.table-cell {
  padding: 12px 16px;
  font-size: 14px;
  color: #262626;
  border-right: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
}

.table-cell:last-child {
  border-right: none;
}

.customer-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.customer-name-text {
  font-weight: 500;
}

.customer-id {
  font-size: 12px;
  color: #8c8c8c;
}

.type-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
}

.type-badge.type-new {
  background: #f6ffed;
  color: #52c41a;
}

.type-badge.type-existing {
  background: #e6f7ff;
  color: #1890ff;
}

.type-badge.type-churn {
  background: #fff2f0;
  color: #ff4d4f;
}

.date-text {
  font-size: 13px;
  color: #595959;
}

.spend-amount {
  font-weight: 500;
}

.roi-value.roi-excellent { color: #52c41a; font-weight: 600; }
.roi-value.roi-good { color: #1890ff; font-weight: 600; }
.roi-value.roi-warning { color: #fa8c16; font-weight: 600; }
.roi-value.roi-poor { color: #ff4d4f; font-weight: 600; }

.stage-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
}

.stage-badge.stage-potential {
  background: #feffe6;
  color: #fadb14;
}

.stage-badge.stage-new {
  background: #f6ffed;
  color: #52c41a;
}

.stage-badge.stage-growth {
  background: #e6f7ff;
  color: #1890ff;
}

.stage-badge.stage-mature {
  background: #f9f0ff;
  color: #722ed1;
}

.stage-badge.stage-decline {
  background: #fff2f0;
  color: #ff4d4f;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: #1890ff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #40a9ff;
}

/* 无数据状态 */
.no-customers {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #8c8c8c;
}

.no-data-icon {
  margin-bottom: 16px;
  opacity: 0.5;
}

.no-data-text {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
}

.no-data-description {
  font-size: 14px;
}

@media (max-width: 1200px) {
  .distribution-cards {
    grid-template-columns: repeat(2, 1fr);
  }

  .stages-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .table-header,
  .table-row {
    grid-template-columns: 2fr 0.8fr 0.8fr 1fr 0.8fr 0.8fr 0.8fr;
  }
}

@media (max-width: 768px) {
  .optimizer-customer-analysis-module {
    padding: 16px;
  }

  .analysis-module__header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .distribution-cards {
    grid-template-columns: 1fr;
  }

  .stages-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .lifecycle-header {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }

  .details-header {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }

  .details-controls {
    flex-direction: column;
    gap: 8px;
  }

  .customers-table {
    overflow-x: auto;
  }

  .table-header,
  .table-row {
    min-width: 700px;
  }

  .value-chart {
    padding: 10px;
    gap: 8px;
  }
}
</style>
