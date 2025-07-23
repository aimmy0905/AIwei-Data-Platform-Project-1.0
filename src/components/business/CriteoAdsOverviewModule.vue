<template>
  <div class="criteo-ads-overview-module">
    <div class="module-header">
      <div class="module-title">
        <span class="module-icon">🛍️</span>
        <h3>客户Criteo广告数据总览</h3>
      </div>
      <div class="module-actions">
        <TimeRangePicker
          v-model="selectedTimeRange"
          @change="handleTimeRangeChange"
        />
        <button class="export-btn" @click="handleExportData">
          <Download :size="16" />
          导出数据
        </button>
      </div>
    </div>

    <div class="module-content">
      <!-- 数据筛选和搜索 -->
      <div class="filter-section">
        <div class="search-filters">
          <div class="search-input">
            <Search :size="16" />
            <input
              v-model="searchKeyword"
              type="text"
              placeholder="搜索客户名称、账户..."
              @input="handleSearch"
            />
          </div>
          <select v-model="selectedStatus" @change="handleStatusFilter">
            <option value="">全部状态</option>
            <option value="active">正常</option>
            <option value="warning">预警</option>
            <option value="danger">异常</option>
          </select>
          <select v-model="selectedAlertType" @change="handleAlertFilter">
            <option value="">全部异常</option>
            <option value="cpc">CPC异常</option>
            <option value="spend">花费异常</option>
            <option value="conversion">转化异常</option>
            <option value="catalog">目录质量</option>
          </select>
        </div>
      </div>

      <!-- 数据总览卡片 -->
      <div class="overview-cards">
        <div class="overview-card">
          <div class="card-header">
            <span class="card-icon">💰</span>
            <h4>总花费</h4>
          </div>
          <div class="card-value">{{ formatCurrency(summaryData.totalSpend) }}</div>
          <div class="card-trend" :class="getTrendClass(summaryData.spendTrend)">
            <TrendingUp v-if="summaryData.spendTrend > 0" :size="14" />
            <TrendingDown v-else :size="14" />
            {{ Math.abs(summaryData.spendTrend).toFixed(1) }}%
          </div>
        </div>

        <div class="overview-card">
          <div class="card-header">
            <span class="card-icon">🎯</span>
            <h4>总转化价值</h4>
          </div>
          <div class="card-value">{{ formatCurrency(summaryData.totalConversionValue) }}</div>
          <div class="card-trend" :class="getTrendClass(summaryData.conversionValueTrend)">
            <TrendingUp v-if="summaryData.conversionValueTrend > 0" :size="14" />
            <TrendingDown v-else :size="14" />
            {{ Math.abs(summaryData.conversionValueTrend).toFixed(1) }}%
          </div>
        </div>

        <div class="overview-card">
          <div class="card-header">
            <span class="card-icon">📊</span>
            <h4>平均ROAS</h4>
          </div>
          <div class="card-value">{{ summaryData.averageROAS.toFixed(2) }}</div>
          <div class="card-trend" :class="getTrendClass(summaryData.roasTrend)">
            <TrendingUp v-if="summaryData.roasTrend > 0" :size="14" />
            <TrendingDown v-else :size="14" />
            {{ Math.abs(summaryData.roasTrend).toFixed(1) }}%
          </div>
        </div>

        <div class="overview-card">
          <div class="card-header">
            <span class="card-icon">⚠️</span>
            <h4>异常客户数</h4>
          </div>
          <div class="card-value alert-value">{{ summaryData.anomalyCustomers }}</div>
          <div class="card-description">需要关注优化</div>
        </div>
      </div>

      <!-- 客户数据表格 -->
      <div class="data-table-container">
        <div class="table-header">
          <h4>客户Criteo广告详细数据</h4>
          <div class="table-actions">
            <button class="refresh-btn" @click="refreshData" :disabled="loading">
              <RefreshCw :size="16" :class="{ 'animate-spin': loading }" />
              刷新
            </button>
          </div>
        </div>

        <div class="data-table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>客户信息</th>
                <th>投放数据</th>
                <th>转化数据</th>
                <th>Criteo特色指标</th>
                <th>余额状态</th>
                <th>异常提醒</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="customer in filteredData" :key="customer.customerId" class="data-row">
                <!-- 客户信息 -->
                <td class="customer-info">
                  <div class="customer-name">{{ customer.customerName }}</div>
                  <div class="customer-meta">{{ customer.optimizer }}</div>
                </td>

                <!-- 投放数据 -->
                <td class="campaign-data">
                  <div class="data-item">
                    <span class="data-label">花费:</span>
                    <span class="data-value">{{ formatCurrency(customer.spend) }}</span>
                  </div>
                  <div class="data-item">
                    <span class="data-label">展示:</span>
                    <span class="data-value">{{ formatNumber(customer.impressions) }}</span>
                  </div>
                  <div class="data-item">
                    <span class="data-label">点击:</span>
                    <span class="data-value">{{ formatNumber(customer.clicks) }}</span>
                  </div>
                  <div class="data-item">
                    <span class="data-label">CTR:</span>
                    <span class="data-value">{{ customer.ctr.toFixed(2) }}%</span>
                  </div>
                  <div class="data-item">
                    <span class="data-label">CPC:</span>
                    <span class="data-value">{{ formatCurrency(customer.cpc) }}</span>
                  </div>
                </td>

                <!-- 转化数据 -->
                <td class="conversion-data">
                  <div class="data-item">
                    <span class="data-label">转化价值:</span>
                    <span class="data-value">{{ formatCurrency(customer.conversionValue) }}</span>
                  </div>
                  <div class="data-item">
                    <span class="data-label">按时间:</span>
                    <span class="data-value">{{ formatCurrency(customer.conversionValueByTime) }}</span>
                  </div>
                  <div class="data-item">
                    <span class="data-label">ROAS:</span>
                    <span class="data-value" :class="getROASClass(customer.roas)">{{ customer.roas.toFixed(2) }}</span>
                  </div>
                  <div class="data-item">
                    <span class="data-label">按时间:</span>
                    <span class="data-value" :class="getROASClass(customer.roasByTime)">{{ customer.roasByTime.toFixed(2) }}</span>
                  </div>
                  <div class="data-item">
                    <span class="data-label">转化次数:</span>
                    <span class="data-value">{{ customer.conversions }}</span>
                  </div>
                  <div class="data-item">
                    <span class="data-label">转化率:</span>
                    <span class="data-value">{{ customer.conversionRate.toFixed(2) }}%</span>
                  </div>
                  <div class="data-item">
                    <span class="data-label">CPA:</span>
                    <span class="data-value">{{ formatCurrency(customer.cpa) }}</span>
                  </div>
                </td>

                <!-- Criteo特色指标 -->
                <td class="criteo-metrics">
                  <div class="data-item">
                    <span class="data-label">产品推荐:</span>
                    <span class="data-value" :class="getRecommendationClass(customer.productRecommendation)">
                      {{ customer.productRecommendation }}
                    </span>
                  </div>
                  <div class="data-item">
                    <span class="data-label">重定向效果:</span>
                    <span class="data-value retargeting-performance" :class="getRetargetingClass(customer.retargetingPerformance)">
                      {{ customer.retargetingPerformance }}
                    </span>
                  </div>
                  <div class="data-item">
                    <span class="data-label">目录质量:</span>
                    <span class="data-value catalog-quality" :class="getCatalogQualityClass(customer.catalogQuality)">
                      {{ customer.catalogQuality }}
                    </span>
                  </div>
                  <div class="data-item">
                    <span class="data-label">受众细分:</span>
                    <span class="data-value audience-segmentation" :class="getAudienceSegmentationClass(customer.audienceSegmentation)">
                      {{ customer.audienceSegmentation }}
                    </span>
                  </div>
                </td>

                <!-- 余额状态 -->
                <td class="balance-status">
                  <div class="balance-info">
                    <div class="balance-days" :class="getBalanceDaysClass(customer.estimatedDaysRemaining)">
                      {{ customer.estimatedDaysRemaining }}天
                    </div>
                    <div class="balance-description">预计剩余</div>
                  </div>
                </td>

                <!-- 异常提醒 -->
                <td class="anomaly-alerts">
                  <div class="alerts-container">
                    <div
                      v-for="alert in customer.anomalyAlerts"
                      :key="alert.type"
                      class="alert-badge"
                      :class="getAlertBadgeClass(alert.severity)"
                    >
                      {{ getAlertText(alert.type) }}
                    </div>
                    <div v-if="customer.anomalyAlerts.length === 0" class="no-alerts">
                      <CheckCircle :size="16" />
                      正常
                    </div>
                  </div>
                </td>

                <!-- 操作 -->
                <td class="actions">
                  <div class="action-buttons">
                    <button
                      v-if="customer.anomalyAlerts.length > 0"
                      class="action-btn investigate"
                      @click="handleInvestigateAlert(customer)"
                    >
                      <AlertTriangle :size="14" />
                      调查
                    </button>
                    <button class="action-btn optimize" @click="handleOptimizeCustomer(customer)">
                      <Zap :size="14" />
                      优化
                    </button>
                    <button class="action-btn view" @click="handleViewDetails(customer)">
                      <Eye :size="14" />
                      详情
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 分页 -->
        <div class="pagination" v-if="totalPages > 1">
          <button
            class="page-btn"
            :disabled="currentPage === 1"
            @click="changePage(currentPage - 1)"
          >
            <ChevronLeft :size="16" />
          </button>
          <span class="page-info">
            第 {{ currentPage }} 页，共 {{ totalPages }} 页
          </span>
          <button
            class="page-btn"
            :disabled="currentPage === totalPages"
            @click="changePage(currentPage + 1)"
          >
            <ChevronRight :size="16" />
          </button>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner"></div>
      <p>正在加载Criteo广告数据...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import {
  Search,
  Download,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Zap,
  Eye,
  ChevronLeft,
  ChevronRight
} from 'lucide-vue-next'
import TimeRangePicker from './TimeRangePicker.vue'
import type { TimeRange } from '@/types'

// Criteo广告客户数据接口
interface CriteoAdsCustomerData {
  customerId: string
  customerName: string
  optimizer: string
  // 投放数据
  spend: number
  impressions: number
  clicks: number
  ctr: number
  cpc: number
  // 转化数据
  conversionValue: number
  conversionValueByTime: number
  roas: number
  roasByTime: number
  conversions: number
  conversionRate: number
  cpa: number
  // Criteo特色指标
  productRecommendation: 'excellent' | 'good' | 'fair' | 'poor'
  retargetingPerformance: 'excellent' | 'good' | 'fair' | 'poor'
  catalogQuality: 'excellent' | 'good' | 'fair' | 'poor'
  audienceSegmentation: 'excellent' | 'good' | 'fair' | 'poor'
  // 余额状态
  estimatedDaysRemaining: number
  // 异常提醒
  anomalyAlerts: AnomalyAlert[]
}

interface AnomalyAlert {
  type: 'cpc' | 'spend' | 'conversion' | 'catalog'
  severity: 'high' | 'medium' | 'low'
  message: string
  threshold: number
  currentValue: number
  detectedAt: string
}

interface SummaryData {
  totalSpend: number
  spendTrend: number
  totalConversionValue: number
  conversionValueTrend: number
  averageROAS: number
  roasTrend: number
  anomalyCustomers: number
}

interface Props {
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<{
  'time-range-change': [timeRange: TimeRange]
  'investigate-alert': [customer: CriteoAdsCustomerData]
  'optimize-customer': [customer: CriteoAdsCustomerData]
  'view-customer-details': [customer: CriteoAdsCustomerData]
}>()

// 响应式数据
const selectedTimeRange = ref<TimeRange>({ start: '', end: '' })
const searchKeyword = ref('')
const selectedStatus = ref('')
const selectedAlertType = ref('')
const currentPage = ref(1)
const pageSize = 10
const loading = ref(false)

// 数据
const summaryData = reactive<SummaryData>({
  totalSpend: 0,
  spendTrend: 0,
  totalConversionValue: 0,
  conversionValueTrend: 0,
  averageROAS: 0,
  roasTrend: 0,
  anomalyCustomers: 0
})

const customerData = ref<CriteoAdsCustomerData[]>([])

// 模拟数据
const mockData: CriteoAdsCustomerData[] = [
  {
    customerId: 'cust_001',
    customerName: 'Fashion Retailer Co.',
    optimizer: 'Criteo优化师A',
    spend: 28500,
    impressions: 850000,
    clicks: 12750,
    ctr: 1.5,
    cpc: 2.24,
    conversionValue: 85500,
    conversionValueByTime: 82650,
    roas: 3.0,
    roasByTime: 2.9,
    conversions: 285,
    conversionRate: 2.24,
    cpa: 100,
    productRecommendation: 'excellent',
    retargetingPerformance: 'good',
    catalogQuality: 'excellent',
    audienceSegmentation: 'good',
    estimatedDaysRemaining: 8,
    anomalyAlerts: []
  },
  {
    customerId: 'cust_002',
    customerName: 'Electronics Store Plus',
    optimizer: 'Criteo优化师B',
    spend: 18200,
    impressions: 520000,
    clicks: 7800,
    ctr: 1.5,
    cpc: 2.33,
    conversionValue: 54600,
    conversionValueByTime: 56420,
    roas: 3.0,
    roasByTime: 3.1,
    conversions: 182,
    conversionRate: 2.33,
    cpa: 100,
    productRecommendation: 'good',
    retargetingPerformance: 'excellent',
    catalogQuality: 'good',
    audienceSegmentation: 'fair',
    estimatedDaysRemaining: 15,
    anomalyAlerts: []
  },
  {
    customerId: 'cust_003',
    customerName: 'Home Decor Mart',
    optimizer: 'Criteo优化师A',
    spend: 22100,
    impressions: 620000,
    clicks: 9300,
    ctr: 1.5,
    cpc: 2.38,
    conversionValue: 55250,
    conversionValueByTime: 53095,
    roas: 2.5,
    roasByTime: 2.4,
    conversions: 221,
    conversionRate: 2.38,
    cpa: 100,
    productRecommendation: 'fair',
    retargetingPerformance: 'fair',
    catalogQuality: 'poor',
    audienceSegmentation: 'poor',
    estimatedDaysRemaining: 3,
    anomalyAlerts: [
      {
        type: 'catalog',
        severity: 'high',
        message: '产品目录质量较差，影响推荐效果',
        threshold: 80,
        currentValue: 45,
        detectedAt: '2025-07-23T10:00:00Z'
      },
      {
        type: 'cpc',
        severity: 'medium',
        message: 'CPC偏高，建议优化竞价策略',
        threshold: 2.2,
        currentValue: 2.38,
        detectedAt: '2025-07-23T11:30:00Z'
      }
    ]
  }
]

// 计算属性
const filteredData = computed(() => {
  let filtered = customerData.value

  // 搜索过滤
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    filtered = filtered.filter(
      customer =>
        customer.customerName.toLowerCase().includes(keyword) ||
        customer.optimizer.toLowerCase().includes(keyword)
    )
  }

  // 状态过滤
  if (selectedStatus.value) {
    filtered = filtered.filter(customer => {
      const hasAlerts = customer.anomalyAlerts.length > 0
      const lowBalance = customer.estimatedDaysRemaining <= 3
      
      if (selectedStatus.value === 'active') return !hasAlerts && !lowBalance
      if (selectedStatus.value === 'warning') return !hasAlerts && lowBalance
      if (selectedStatus.value === 'danger') return hasAlerts
      
      return true
    })
  }

  // 异常类型过滤
  if (selectedAlertType.value) {
    filtered = filtered.filter(customer =>
      customer.anomalyAlerts.some(alert => alert.type === selectedAlertType.value)
    )
  }

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredData.value.length / pageSize))

// 方法
const formatCurrency = (value: number): string => {
  if (value >= 100000) {
    return `$${(value / 1000).toFixed(1)}K`
  }
  return `$${value.toLocaleString()}`
}

const formatNumber = (value: number): string => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`
  }
  return value.toString()
}

const getTrendClass = (trend: number) => {
  return trend > 0 ? 'trend-positive' : trend < 0 ? 'trend-negative' : 'trend-neutral'
}

const getROASClass = (roas: number) => {
  if (roas >= 4) return 'roas-excellent'
  if (roas >= 3) return 'roas-good'
  if (roas >= 2) return 'roas-warning'
  return 'roas-poor'
}

const getRecommendationClass = (performance: string) => {
  return `performance-${performance}`
}

const getRetargetingClass = (performance: string) => {
  return `performance-${performance}`
}

const getCatalogQualityClass = (quality: string) => {
  return `quality-${quality}`
}

const getAudienceSegmentationClass = (segmentation: string) => {
  return `segmentation-${segmentation}`
}

const getBalanceDaysClass = (days: number) => {
  if (days <= 3) return 'balance-critical'
  if (days <= 7) return 'balance-warning'
  return 'balance-normal'
}

const getAlertBadgeClass = (severity: string) => {
  return `alert-${severity}`
}

const getAlertText = (type: string) => {
  const alertTexts = {
    cpc: 'CPC异常',
    spend: '花费异常',
    conversion: '转化异常',
    catalog: '目录质量'
  }
  return alertTexts[type as keyof typeof alertTexts] || type
}

// 事件处理
const handleTimeRangeChange = (timeRange: TimeRange) => {
  selectedTimeRange.value = timeRange
  emit('time-range-change', timeRange)
  loadData()
}

const handleSearch = () => {
  currentPage.value = 1
}

const handleStatusFilter = () => {
  currentPage.value = 1
}

const handleAlertFilter = () => {
  currentPage.value = 1
}

const handleExportData = () => {
  console.log('Export Criteo ads data')
}

const handleInvestigateAlert = (customer: CriteoAdsCustomerData) => {
  emit('investigate-alert', customer)
}

const handleOptimizeCustomer = (customer: CriteoAdsCustomerData) => {
  emit('optimize-customer', customer)
}

const handleViewDetails = (customer: CriteoAdsCustomerData) => {
  emit('view-customer-details', customer)
}

const refreshData = () => {
  loadData()
}

const changePage = (page: number) => {
  currentPage.value = page
}

const loadData = () => {
  loading.value = true
  
  // 模拟API调用
  setTimeout(() => {
    customerData.value = mockData
    
    // 计算汇总数据
    summaryData.totalSpend = mockData.reduce((sum, customer) => sum + customer.spend, 0)
    summaryData.totalConversionValue = mockData.reduce((sum, customer) => sum + customer.conversionValue, 0)
    summaryData.averageROAS = mockData.reduce((sum, customer) => sum + customer.roas, 0) / mockData.length
    summaryData.anomalyCustomers = mockData.filter(customer => customer.anomalyAlerts.length > 0).length
    
    // 模拟趋势数据
    summaryData.spendTrend = 8.2
    summaryData.conversionValueTrend = 5.7
    summaryData.roasTrend = -1.8
    
    loading.value = false
  }, 1000)
}

// 组件挂载时加载数据
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.criteo-ads-overview-module {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
  position: relative;
}

.module-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
}

.module-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.module-icon {
  font-size: 20px;
}

.module-title h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #262626;
}

.module-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.export-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: #722ed1;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.export-btn:hover {
  background: #9254de;
}

.module-content {
  padding: 24px;
}

.filter-section {
  margin-bottom: 24px;
}

.search-filters {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.search-input {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  background: #fff;
  min-width: 200px;
}

.search-input input {
  border: none;
  outline: none;
  flex: 1;
  font-size: 14px;
}

.search-filters select {
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  background: #fff;
  font-size: 14px;
  cursor: pointer;
}

.overview-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.overview-card {
  background: #fafafa;
  padding: 16px;
  border-radius: 8px;
  border-left: 4px solid #722ed1;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.card-icon {
  font-size: 16px;
}

.card-header h4 {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: #595959;
}

.card-value {
  font-size: 24px;
  font-weight: 700;
  color: #262626;
  margin-bottom: 4px;
}

.card-value.alert-value {
  color: #fa8c16;
}

.card-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 500;
}

.card-trend.trend-positive {
  color: #52c41a;
}

.card-trend.trend-negative {
  color: #ff4d4f;
}

.card-trend.trend-neutral {
  color: #8c8c8c;
}

.data-table-container {
  background: #fff;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.table-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #262626;
}

.table-actions {
  display: flex;
  gap: 8px;
}

.refresh-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: #f5f5f5;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}

.refresh-btn:hover:not(:disabled) {
  background: #f0f0ff;
  border-color: #9254de;
}

.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.data-table-wrapper {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.data-table th {
  background: #fafafa;
  padding: 12px;
  text-align: left;
  font-weight: 600;
  color: #262626;
  border-bottom: 1px solid #f0f0f0;
  white-space: nowrap;
}

.data-table td {
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
  vertical-align: top;
}

.data-row:hover {
  background: #fafafa;
}

.customer-info {
  min-width: 120px;
}

.customer-name {
  font-weight: 600;
  color: #262626;
  margin-bottom: 4px;
}

.customer-meta {
  font-size: 12px;
  color: #8c8c8c;
}

.campaign-data,
.conversion-data,
.criteo-metrics {
  min-width: 160px;
}

.data-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}

.data-item:last-child {
  margin-bottom: 0;
}

.data-label {
  color: #8c8c8c;
  font-size: 12px;
}

.data-value {
  font-weight: 500;
  color: #262626;
}

.data-value.roas-excellent {
  color: #52c41a;
}

.data-value.roas-good {
  color: #1890ff;
}

.data-value.roas-warning {
  color: #fa8c16;
}

.data-value.roas-poor {
  color: #ff4d4f;
}

.data-value.performance-excellent {
  color: #52c41a;
}

.data-value.performance-good {
  color: #1890ff;
}

.data-value.performance-fair {
  color: #fa8c16;
}

.data-value.performance-poor {
  color: #ff4d4f;
}

.data-value.quality-excellent {
  color: #52c41a;
}

.data-value.quality-good {
  color: #1890ff;
}

.data-value.quality-fair {
  color: #fa8c16;
}

.data-value.quality-poor {
  color: #ff4d4f;
}

.data-value.segmentation-excellent {
  color: #52c41a;
}

.data-value.segmentation-good {
  color: #1890ff;
}

.data-value.segmentation-fair {
  color: #fa8c16;
}

.data-value.segmentation-poor {
  color: #ff4d4f;
}

.balance-status {
  text-align: center;
  min-width: 80px;
}

.balance-info {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.balance-days {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 4px;
}

.balance-days.balance-critical {
  color: #ff4d4f;
}

.balance-days.balance-warning {
  color: #fa8c16;
}

.balance-days.balance-normal {
  color: #52c41a;
}

.balance-description {
  font-size: 12px;
  color: #8c8c8c;
}

.anomaly-alerts {
  min-width: 120px;
}

.alerts-container {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.alert-badge {
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 500;
  text-align: center;
}

.alert-badge.alert-high {
  background: #ff4d4f;
  color: #fff;
}

.alert-badge.alert-medium {
  background: #fa8c16;
  color: #fff;
}

.alert-badge.alert-low {
  background: #fadb14;
  color: #262626;
}

.no-alerts {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #52c41a;
}

.actions {
  min-width: 120px;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.action-btn.investigate {
  background: #fff2f0;
  color: #ff4d4f;
}

.action-btn.investigate:hover {
  background: #ff4d4f;
  color: #fff;
}

.action-btn.optimize {
  background: #f0f0ff;
  color: #722ed1;
}

.action-btn.optimize:hover {
  background: #722ed1;
  color: #fff;
}

.action-btn.view {
  background: #e6f7ff;
  color: #1890ff;
}

.action-btn.view:hover {
  background: #1890ff;
  color: #fff;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-top: 1px solid #f0f0f0;
}

.page-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background: #fff;
  color: #595959;
  cursor: pointer;
  transition: all 0.2s;
}

.page-btn:hover:not(:disabled) {
  border-color: #9254de;
  color: #9254de;
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-info {
  font-size: 14px;
  color: #595959;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #f0f0f0;
  border-top: 3px solid #722ed1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 12px;
}

.loading-overlay p {
  color: #595959;
  font-size: 14px;
}

@media (max-width: 768px) {
  .module-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .search-filters {
    flex-direction: column;
    align-items: stretch;
  }

  .search-input {
    min-width: auto;
  }

  .overview-cards {
    grid-template-columns: 1fr;
  }

  .data-table-wrapper {
    font-size: 12px;
  }

  .data-table th,
  .data-table td {
    padding: 8px;
  }

  .action-buttons {
    flex-direction: row;
  }
}
</style>