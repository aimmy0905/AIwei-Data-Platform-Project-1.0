<template>
  <div class="google-ads-overview-module">
    <div class="ads-module__header">
      <h3 class="ads-module__title">客户Google广告数据总览</h3>
      <div class="ads-module__controls">
        <div class="performance-summary">
          <span class="summary-label">总ROAS:</span>
          <span class="summary-value" :class="getROASClass(adsData.summary.totalROAS)">
            {{ adsData.summary.totalROAS.toFixed(2) }}
          </span>
        </div>
        <TimeRangePicker 
          v-model="selectedTimeRange"
          @change="handleTimeRangeChange"
        />
      </div>
    </div>

    <div class="ads-module__content">
      <!-- 数据统计概览 -->
      <div class="ads-statistics-overview">
        <div class="stats-grid">
          <div class="stats-card">
            <div class="stats-card__header">
              <DollarSign :size="20" />
              <span>总花费</span>
            </div>
            <div class="stats-card__content">
              <div class="stats-value">{{ formatCurrency(adsData.summary.totalSpend) }}</div>
              <div class="stats-trend">
                <TrendingUp v-if="getSpendTrend() > 0" :size="14" />
                <TrendingDown v-else :size="14" />
                {{ Math.abs(getSpendTrend()).toFixed(1) }}%
              </div>
            </div>
          </div>

          <div class="stats-card">
            <div class="stats-card__header">
              <Eye :size="20" />
              <span>总展示</span>
            </div>
            <div class="stats-card__content">
              <div class="stats-value">{{ formatNumber(adsData.summary.totalImpressions) }}</div>
              <div class="stats-description">展示次数</div>
            </div>
          </div>

          <div class="stats-card">
            <div class="stats-card__header">
              <MousePointer :size="20" />
              <span>总点击</span>
            </div>
            <div class="stats-card__content">
              <div class="stats-value">{{ formatNumber(adsData.summary.totalClicks) }}</div>
              <div class="stats-description">CTR: {{ (adsData.summary.avgCTR * 100).toFixed(2) }}%</div>
            </div>
          </div>

          <div class="stats-card">
            <div class="stats-card__header">
              <Target :size="20" />
              <span>总转化</span>
            </div>
            <div class="stats-card__content">
              <div class="stats-value">{{ formatNumber(adsData.summary.totalConversions) }}</div>
              <div class="stats-description">转化率: {{ (adsData.summary.avgConversionRate * 100).toFixed(2) }}%</div>
            </div>
          </div>

          <div class="stats-card">
            <div class="stats-card__header">
              <BarChart3 :size="20" />
              <span>平均CPC</span>
            </div>
            <div class="stats-card__content">
              <div class="stats-value">{{ formatCurrency(adsData.summary.avgCPC) }}</div>
              <div class="stats-description">单次点击成本</div>
            </div>
          </div>

          <div class="stats-card">
            <div class="stats-card__header">
              <TrendingUp :size="20" />
              <span>总ROAS</span>
            </div>
            <div class="stats-card__content">
              <div class="stats-value roas-value" :class="getROASClass(adsData.summary.totalROAS)">
                {{ adsData.summary.totalROAS.toFixed(2) }}
              </div>
              <div class="stats-description">广告投资回报率</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 异常数据提醒 -->
      <div class="anomaly-alerts-section" v-if="adsData.anomalyAlerts.length > 0">
        <div class="alerts-header">
          <h4>异常数据提醒</h4>
          <span class="alerts-count">{{ adsData.anomalyAlerts.length }}个异常</span>
        </div>
        <div class="alerts-list">
          <div 
            v-for="alert in adsData.anomalyAlerts"
            :key="alert.alertId"
            class="alert-item"
            :class="getAlertSeverityClass(alert.severity)"
          >
            <div class="alert-icon">
              <AlertTriangle :size="20" />
            </div>
            <div class="alert-content">
              <div class="alert-customer">{{ alert.customerName }}</div>
              <div class="alert-description">{{ alert.description }}</div>
              <div class="alert-details">
                <span class="alert-metric">当前值: {{ alert.currentValue }}</span>
                <span class="alert-expected">预期值: {{ alert.expectedValue }}</span>
                <span class="alert-deviation">偏差: {{ alert.deviation.toFixed(1) }}%</span>
              </div>
            </div>
            <div class="alert-actions">
              <button class="alert-action-btn" @click="handleInvestigateAlert(alert)">
                调查
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 客户广告数据列表 -->
      <div class="customer-ads-section">
        <div class="customer-ads-header">
          <h4>客户广告数据明细</h4>
          <div class="ads-controls">
            <div class="filter-controls">
              <select v-model="performanceFilter" class="filter-select">
                <option value="all">全部表现</option>
                <option value="excellent">表现优秀</option>
                <option value="good">表现良好</option>
                <option value="needs_attention">需要关注</option>
                <option value="poor">表现较差</option>
              </select>
            </div>
            <div class="sort-controls">
              <select v-model="sortMetric" class="sort-select">
                <option value="spend">按花费排序</option>
                <option value="roas">按ROAS排序</option>
                <option value="conversions">按转化排序</option>
                <option value="lastOptimized">按优化时间</option>
              </select>
            </div>
          </div>
        </div>

        <div class="customer-ads-table">
          <div class="ads-table-header">
            <div class="header-cell customer">客户名称</div>
            <div class="header-cell campaigns">广告系列</div>
            <div class="header-cell spend">花费</div>
            <div class="header-cell performance">表现指标</div>
            <div class="header-cell roas">ROAS</div>
            <div class="header-cell status">状态</div>
            <div class="header-cell last-optimized">最后优化</div>
            <div class="header-cell actions">操作</div>
          </div>

          <div class="ads-table-body">
            <div 
              v-for="customer in filteredCustomerAds"
              :key="customer.customerId"
              class="ads-table-row"
              :class="getCustomerRowClass(customer.performanceStatus)"
            >
              <div class="table-cell customer">
                <div class="customer-info">
                  <div class="customer-name">{{ customer.customerName }}</div>
                  <div class="customer-id">ID: {{ customer.customerId }}</div>
                </div>
              </div>
              <div class="table-cell campaigns">
                <span class="campaign-count">{{ customer.campaignCount }}个系列</span>
              </div>
              <div class="table-cell spend">
                <div class="spend-info">
                  <div class="spend-amount">{{ formatCurrency(customer.spend) }}</div>
                </div>
              </div>
              <div class="table-cell performance">
                <div class="performance-metrics">
                  <div class="metric-item">
                    <span class="metric-label">展示:</span>
                    <span class="metric-value">{{ formatNumber(customer.impressions) }}</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-label">点击:</span>
                    <span class="metric-value">{{ formatNumber(customer.clicks) }}</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-label">转化:</span>
                    <span class="metric-value">{{ customer.conversions }}</span>
                  </div>
                </div>
              </div>
              <div class="table-cell roas">
                <div class="roas-display" :class="getROASClass(customer.roas)">
                  {{ customer.roas.toFixed(2) }}
                </div>
              </div>
              <div class="table-cell status">
                <div class="status-badge" :class="getStatusBadgeClass(customer.performanceStatus)">
                  {{ getStatusText(customer.performanceStatus) }}
                </div>
              </div>
              <div class="table-cell last-optimized">
                <span class="optimize-time">{{ formatOptimizeTime(customer.lastOptimized) }}</span>
              </div>
              <div class="table-cell actions">
                <div class="action-buttons">
                  <button 
                    class="action-btn optimize-btn"
                    @click="handleOptimizeCustomer(customer)"
                  >
                    <Zap :size="14" />
                    优化
                  </button>
                  <button 
                    class="action-btn detail-btn"
                    @click="handleViewCustomerDetails(customer)"
                  >
                    <BarChart3 :size="14" />
                    详情
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 无数据状态 -->
        <div v-if="filteredCustomerAds.length === 0" class="no-customer-data">
          <div class="no-data-icon">
            <BarChart3 :size="48" />
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
import { DollarSign, Eye, MousePointer, Target, BarChart3, TrendingUp, TrendingDown, AlertTriangle, Zap } from 'lucide-vue-next'
import TimeRangePicker from './TimeRangePicker.vue'
import type { GoogleAdsOverviewData, CustomerGoogleAdsData, AnomalyAlert, TimeRange } from '@/types'

interface Props {
  adsData: GoogleAdsOverviewData
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<{
  'time-range-change': [timeRange: TimeRange]
  'investigate-alert': [alert: AnomalyAlert]
  'optimize-customer': [customer: CustomerGoogleAdsData]
  'view-customer-details': [customer: CustomerGoogleAdsData]
}>()

// 响应式数据
const selectedTimeRange = ref<TimeRange>({
  type: 'quick',
  startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
  endDate: new Date().toISOString().split('T')[0],
  period: 'monthly',
  label: '本月'
})

const performanceFilter = ref<string>('all')
const sortMetric = ref<string>('spend')

// 计算属性
const filteredCustomerAds = computed(() => {
  let filtered = props.adsData.customerAdsData

  // 按表现状态筛选
  if (performanceFilter.value !== 'all') {
    filtered = filtered.filter(customer => customer.performanceStatus === performanceFilter.value)
  }

  // 排序
  filtered.sort((a, b) => {
    switch (sortMetric.value) {
      case 'spend':
        return b.spend - a.spend
      case 'roas':
        return b.roas - a.roas
      case 'conversions':
        return b.conversions - a.conversions
      case 'lastOptimized':
        return new Date(b.lastOptimized).getTime() - new Date(a.lastOptimized).getTime()
      default:
        return 0
    }
  })

  return filtered
})

// 方法
const formatCurrency = (value: number): string => {
  if (value >= 100000) {
    return `$${(value / 1000).toFixed(1)}K`
  } else {
    return `$${value.toLocaleString()}`
  }
}

const formatNumber = (value: number): string => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`
  } else {
    return value.toString()
  }
}

const formatOptimizeTime = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return '今天'
  if (diffDays === 1) return '昨天'
  if (diffDays <= 7) return `${diffDays}天前`
  return `${Math.floor(diffDays / 7)}周前`
}

const getROASClass = (roas: number) => {
  if (roas >= 4) return 'roas-excellent'
  if (roas >= 3) return 'roas-good'
  if (roas >= 2) return 'roas-warning'
  return 'roas-poor'
}

const getSpendTrend = (): number => {
  // 模拟花费趋势数据
  return 12.5
}

const getAlertSeverityClass = (severity: string) => {
  return `alert-${severity}`
}

const getCustomerRowClass = (status: string) => {
  return `row-status-${status}`
}

const getStatusBadgeClass = (status: string) => {
  return `status-${status}`
}

const getStatusText = (status: string) => {
  const statusMap = {
    excellent: '优秀',
    good: '良好',
    needs_attention: '需关注',
    poor: '较差'
  }
  return statusMap[status as keyof typeof statusMap] || status
}

const handleTimeRangeChange = (timeRange: TimeRange) => {
  selectedTimeRange.value = timeRange
  emit('time-range-change', timeRange)
}

const handleInvestigateAlert = (alert: AnomalyAlert) => {
  emit('investigate-alert', alert)
}

const handleOptimizeCustomer = (customer: CustomerGoogleAdsData) => {
  emit('optimize-customer', customer)
}

const handleViewCustomerDetails = (customer: CustomerGoogleAdsData) => {
  emit('view-customer-details', customer)
}
</script>

<style scoped>
.google-ads-overview-module {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-bottom: 24px;
}

.ads-module__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.ads-module__title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #262626;
}

.ads-module__controls {
  display: flex;
  align-items: center;
  gap: 16px;
}

.performance-summary {
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

.summary-value.roas-excellent {
  color: #52c41a;
}

.summary-value.roas-good {
  color: #1890ff;
}

.summary-value.roas-warning {
  color: #fa8c16;
}

.summary-value.roas-poor {
  color: #ff4d4f;
}

.ads-module__content {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* 数据统计概览 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.stats-card {
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 16px;
}

.stats-card__header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  color: #1890ff;
  font-size: 14px;
  font-weight: 500;
}

.stats-value {
  font-size: 20px;
  font-weight: 700;
  color: #262626;
  margin-bottom: 4px;
}

.stats-value.roas-value.roas-excellent {
  color: #52c41a;
}

.stats-value.roas-value.roas-good {
  color: #1890ff;
}

.stats-value.roas-value.roas-warning {
  color: #fa8c16;
}

.stats-value.roas-value.roas-poor {
  color: #ff4d4f;
}

.stats-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #52c41a;
}

.stats-description {
  font-size: 12px;
  color: #8c8c8c;
}

/* 异常数据提醒 */
.anomaly-alerts-section {
  background: #fff2f0;
  border: 1px solid #ffccc7;
  border-radius: 8px;
  padding: 20px;
}

.alerts-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.alerts-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #262626;
}

.alerts-count {
  padding: 2px 8px;
  background: #ff4d4f;
  color: #fff;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 500;
}

.alerts-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.alert-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: #fff;
  border-radius: 6px;
  border-left: 4px solid #ff4d4f;
}

.alert-item.alert-high {
  border-left-color: #ff4d4f;
}

.alert-item.alert-medium {
  border-left-color: #fa8c16;
}

.alert-item.alert-low {
  border-left-color: #fadb14;
}

.alert-icon {
  color: #ff4d4f;
  flex-shrink: 0;
}

.alert-content {
  flex: 1;
}

.alert-customer {
  font-weight: 600;
  color: #262626;
  margin-bottom: 4px;
}

.alert-description {
  font-size: 14px;
  color: #595959;
  margin-bottom: 8px;
}

.alert-details {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #8c8c8c;
}

.alert-action-btn {
  padding: 6px 12px;
  background: #ff4d4f;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.2s;
}

.alert-action-btn:hover {
  background: #ff7875;
}

/* 客户广告数据表格 */
.customer-ads-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.customer-ads-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #262626;
}

.ads-controls {
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

.customer-ads-table {
  border-radius: 8px;
  border: 1px solid #f0f0f0;
  overflow: hidden;
}

.ads-table-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.5fr 0.8fr 0.8fr 1fr 1fr;
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

.ads-table-body {
  max-height: 600px;
  overflow-y: auto;
}

.ads-table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.5fr 0.8fr 0.8fr 1fr 1fr;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s;
}

.ads-table-row:hover {
  background: #f9f9f9;
}

.ads-table-row.row-status-excellent {
  background: rgba(82, 196, 26, 0.05);
}

.ads-table-row.row-status-needs_attention {
  background: rgba(250, 140, 22, 0.05);
}

.ads-table-row.row-status-poor {
  background: rgba(255, 77, 79, 0.05);
}

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

.customer-name {
  font-weight: 500;
}

.customer-id {
  font-size: 12px;
  color: #8c8c8c;
}

.campaign-count {
  background: #f5f5f5;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
}

.performance-metrics {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.metric-item {
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

.roas-display {
  font-weight: 700;
  font-size: 16px;
}

.roas-display.roas-excellent {
  color: #52c41a;
}

.roas-display.roas-good {
  color: #1890ff;
}

.roas-display.roas-warning {
  color: #fa8c16;
}

.roas-display.roas-poor {
  color: #ff4d4f;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
}

.status-badge.status-excellent {
  background: #f6ffed;
  color: #52c41a;
}

.status-badge.status-good {
  background: #e6f7ff;
  color: #1890ff;
}

.status-badge.status-needs_attention {
  background: #fff7e6;
  color: #fa8c16;
}

.status-badge.status-poor {
  background: #fff2f0;
  color: #ff4d4f;
}

.optimize-time {
  font-size: 12px;
  color: #8c8c8c;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.optimize-btn {
  background: #52c41a;
  color: #fff;
}

.optimize-btn:hover {
  background: #73d13d;
}

.detail-btn {
  background: #1890ff;
  color: #fff;
}

.detail-btn:hover {
  background: #40a9ff;
}

/* 无数据状态 */
.no-customer-data {
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
  .ads-table-header,
  .ads-table-row {
    grid-template-columns: 2fr 0.8fr 1fr 1fr 0.6fr 0.8fr 0.8fr 1fr;
  }
}

@media (max-width: 768px) {
  .google-ads-overview-module {
    padding: 16px;
  }

  .ads-module__header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .ads-controls {
    flex-direction: column;
    gap: 8px;
  }

  .customer-ads-table {
    overflow-x: auto;
  }

  .ads-table-header,
  .ads-table-row {
    min-width: 900px;
  }

  .alert-item {
    flex-direction: column;
    text-align: center;
    gap: 8px;
  }

  .alert-details {
    justify-content: center;
  }
}
</style>