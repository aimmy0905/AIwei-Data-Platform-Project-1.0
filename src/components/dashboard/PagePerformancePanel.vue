<template>
  <div class="page-performance-panel">
    <div class="panel-header">
      <div class="header-content">
        <h2 class="section-title">页面表现</h2>
        <p class="section-description">网站页面性能监控和访问数据分析</p>
      </div>
      <div class="header-actions">
        <!-- 时间筛选器 -->
        <div class="time-filter">
          <select v-model="selectedTimeRange" @change="handleTimeRangeChange" class="time-select">
            <option value="today">今日</option>
            <option value="yesterday">昨天</option>
            <option value="last7days">近7天</option>
            <option value="last14days">近14天</option>
            <option value="last1month">近1个月</option>
            <option value="last3months">近3个月</option>
            <option value="last1year">近1年</option>
            <option value="custom">自定义时间</option>
          </select>
          <!-- 自定义时间选择器 -->
          <div v-if="selectedTimeRange === 'custom'" class="custom-date-range">
            <input
              type="date"
              v-model="customStartDate"
              @change="handleCustomDateChange"
              class="date-input"
            />
            <span class="date-separator">至</span>
            <input
              type="date"
              v-model="customEndDate"
              @change="handleCustomDateChange"
              class="date-input"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="panel-content">
      <!-- 标签页导航 -->
      <div class="tabs-container">
        <div class="tabs-header">
          <button
            class="tab-button"
            :class="{ active: activeTab === 'result' }"
            @click="activeTab = 'result'"
          >
            结果指标
          </button>
          <button
            class="tab-button"
            :class="{ active: activeTab === 'process' }"
            @click="activeTab = 'process'"
          >
            过程指标
          </button>
        </div>

        <div class="tabs-content">
          <!-- 结果指标标签页 -->
          <div v-if="activeTab === 'result'" class="tab-content">
            <div class="ranking-table">
              <div class="table-content">
                <div class="table-header">
                  <div class="page-col">落地页</div>
                  <div class="type-col">页面类型</div>
                  <div class="category-col">产品类别</div>
                  <div class="product-col">产品类型</div>
                  <div class="users-col">用户数</div>
                  <div class="new-users-col">新用户数</div>
                  <div class="conversion-col">转化率</div>
                  <div class="revenue-col">销售额</div>
                  <div class="users-ratio-col">用户数占比</div>
                  <div class="revenue-ratio-col">销售额占比</div>
                  <div class="bounce-col">跳出率</div>
                </div>
                <div class="table-body">
                  <div
                    v-for="page in resultPages"
                    :key="page.id"
                    class="table-row"
                  >
                    <div class="page-col">
                      <div class="page-info">
                        <div class="page-title">{{ page.pageName }}</div>
                        <div class="page-url">{{ page.pageUrl }}</div>
                      </div>
                    </div>
                    <div class="type-col">{{ page.pageType }}</div>
                    <div class="category-col">{{ page.productCategory || '-' }}</div>
                    <div class="product-col">{{ page.productType || '-' }}</div>
                    <div class="users-col">{{ formatNumber(page.users) }}</div>
                    <div class="new-users-col">{{ formatNumber(page.newUsers) }}</div>
                    <div class="conversion-col">{{ page.conversionRate }}%</div>
                    <div class="revenue-col">${{ formatNumber(page.revenue) }}</div>
                    <div class="users-ratio-col">{{ page.usersRatio }}%</div>
                    <div class="revenue-ratio-col">{{ page.revenueRatio }}%</div>
                    <div class="bounce-col">
                      <span class="bounce-rate" :class="getBounceClass(page.bounceRate)">{{ page.bounceRate }}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 过程指标标签页 -->
          <div v-if="activeTab === 'process'" class="tab-content">
            <div class="ranking-table">
              <div class="table-content">
                <div class="table-header">
                  <div class="page-col">落地页</div>
                  <div class="type-col">页面类型</div>
                  <div class="category-col">产品类别</div>
                  <div class="product-col">产品类型</div>
                  <div class="cart-col">加购数</div>
                  <div class="cart-rate-col">加购率</div>
                  <div class="checkout-col">支付页面</div>
                  <div class="checkout-rate-col">支付页面转化率</div>
                  <div class="session-col">平均会话时长</div>
                  <div class="time-col">页面停留时间</div>
                  <div class="load-col">页面加载时间</div>
                </div>
                <div class="table-body">
                  <div
                    v-for="page in processPages"
                    :key="page.id"
                    class="table-row"
                  >
                    <div class="page-col">
                      <div class="page-info">
                        <div class="page-title">{{ page.pageName }}</div>
                        <div class="page-url">{{ page.pageUrl }}</div>
                      </div>
                    </div>
                    <div class="type-col">{{ page.pageType }}</div>
                    <div class="category-col">{{ page.productCategory || '-' }}</div>
                    <div class="product-col">{{ page.productType || '-' }}</div>
                    <div class="cart-col">{{ formatNumber(page.addToCartCount) }}</div>
                    <div class="cart-rate-col">{{ page.addToCartRate }}%</div>
                    <div class="checkout-col">{{ formatNumber(page.checkoutPageViews) }}</div>
                    <div class="checkout-rate-col">{{ page.checkoutConversionRate }}%</div>
                    <div class="session-col">{{ formatTime(page.averageSessionDuration) }}</div>
                    <div class="time-col">{{ formatTime(page.averageTimeOnPage) }}</div>
                    <div class="load-col">
                      <span class="load-time" :class="getLoadTimeClass(page.averageLoadTime)">{{ formatLoadTime(page.averageLoadTime) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 模块小结 -->
    <ModuleSummary
      :default-text="'页面表现数据良好，核心页面转化率稳定。建议优化加载速度较慢的页面，提升用户体验。'"
      placeholder="请输入页面表现情况小结..."
      :stats="[
        { label: '监控页面', value: 15 },
        { label: '平均转化率', value: '6.2%' },
        { label: '性能状态', value: '良好', type: 'badge', class: 'status-good' }
      ]"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ModuleSummary from '@/components/common/ModuleSummary.vue'

// 定义数据类型
interface PageStats {
  pageViews: number
  pageViewsGrowth: number
  avgLoadTime: number
  loadTimeChange: number
  bounceRate: number
  bounceRateChange: number
  conversionRate: number
  conversionGrowth: number
}

interface ResultPageData {
  id: string
  pageName: string
  pageUrl: string
  pageType: string
  productCategory?: string
  productType?: string
  users: number
  newUsers: number
  conversionRate: number
  revenue: number
  usersRatio: number
  revenueRatio: number
  bounceRate: number
}

interface ProcessPageData {
  id: string
  pageName: string
  pageUrl: string
  pageType: string
  productCategory?: string
  productType?: string
  addToCartCount: number
  addToCartRate: number
  checkoutPageViews: number
  checkoutConversionRate: number
  averageSessionDuration: number
  averageTimeOnPage: number
  averageLoadTime: number
}

// 响应式数据
const activeTab = ref<'result' | 'process'>('result')
const selectedTimeRange = ref('last7days')
const customStartDate = ref('')
const customEndDate = ref('')

const resultPages = ref<ResultPageData[]>([
  {
    id: '1',
    pageName: '首页',
    pageUrl: '/',
    pageType: '首页',
    productCategory: '全品类',
    productType: '混合',
    users: 485000,
    newUsers: 145000,
    conversionRate: 4.2,
    revenue: 2850000,
    usersRatio: 35.2,
    revenueRatio: 42.8,
    bounceRate: 35
  },
  {
    id: '2',
    pageName: '产品列表页',
    pageUrl: '/products',
    pageType: '类目页',
    productCategory: '服装',
    productType: '时尚服饰',
    users: 320000,
    newUsers: 96000,
    conversionRate: 6.8,
    revenue: 1950000,
    usersRatio: 23.2,
    revenueRatio: 29.3,
    bounceRate: 28
  },
  {
    id: '3',
    pageName: '产品详情页',
    pageUrl: '/product/detail',
    pageType: '产品页',
    productCategory: '电子产品',
    productType: '数码配件',
    users: 280000,
    newUsers: 84000,
    conversionRate: 8.5,
    revenue: 1680000,
    usersRatio: 20.3,
    revenueRatio: 25.2,
    bounceRate: 22
  },
  {
    id: '4',
    pageName: '购物车页',
    pageUrl: '/cart',
    pageType: '购物车',
    productCategory: '全品类',
    productType: '混合',
    users: 150000,
    newUsers: 30000,
    conversionRate: 12.3,
    revenue: 950000,
    usersRatio: 10.9,
    revenueRatio: 14.3,
    bounceRate: 45
  },
  {
    id: '5',
    pageName: '结账页面',
    pageUrl: '/checkout',
    pageType: '结账页',
    productCategory: '全品类',
    productType: '混合',
    users: 95000,
    newUsers: 19000,
    conversionRate: 25.6,
    revenue: 850000,
    usersRatio: 6.9,
    revenueRatio: 12.8,
    bounceRate: 38
  }
])

const processPages = ref<ProcessPageData[]>([
  {
    id: '1',
    pageName: '首页',
    pageUrl: '/',
    pageType: '首页',
    productCategory: '全品类',
    productType: '混合',
    addToCartCount: 28500,
    addToCartRate: 5.9,
    checkoutPageViews: 18500,
    checkoutConversionRate: 3.8,
    averageSessionDuration: 180,
    averageTimeOnPage: 45,
    averageLoadTime: 1200
  },
  {
    id: '2',
    pageName: '产品列表页',
    pageUrl: '/products',
    pageType: '类目页',
    productCategory: '服装',
    productType: '时尚服饰',
    addToCartCount: 19500,
    addToCartRate: 6.1,
    checkoutPageViews: 14200,
    checkoutConversionRate: 4.4,
    averageSessionDuration: 240,
    averageTimeOnPage: 68,
    averageLoadTime: 980
  },
  {
    id: '3',
    pageName: '产品详情页',
    pageUrl: '/product/detail',
    pageType: '产品页',
    productCategory: '电子产品',
    productType: '数码配件',
    addToCartCount: 24800,
    addToCartRate: 8.9,
    checkoutPageViews: 18600,
    checkoutConversionRate: 6.6,
    averageSessionDuration: 300,
    averageTimeOnPage: 125,
    averageLoadTime: 1450
  },
  {
    id: '4',
    pageName: '购物车页',
    pageUrl: '/cart',
    pageType: '购物车',
    productCategory: '全品类',
    productType: '混合',
    addToCartCount: 0,
    addToCartRate: 0,
    checkoutPageViews: 18500,
    checkoutConversionRate: 12.3,
    averageSessionDuration: 120,
    averageTimeOnPage: 85,
    averageLoadTime: 850
  },
  {
    id: '5',
    pageName: '结账页面',
    pageUrl: '/checkout',
    pageType: '结账页',
    productCategory: '全品类',
    productType: '混合',
    addToCartCount: 0,
    addToCartRate: 0,
    checkoutPageViews: 0,
    checkoutConversionRate: 0,
    averageSessionDuration: 180,
    averageTimeOnPage: 120,
    averageLoadTime: 750
  }
])

// 工具函数
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(0) + 'K'
  }
  return num.toString()
}

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

const formatLoadTime = (milliseconds: number): string => {
  if (milliseconds < 1000) {
    return `${milliseconds}ms`
  } else {
    return `${(milliseconds / 1000).toFixed(1)}s`
  }
}

const getBounceClass = (rate: number): string => {
  if (rate <= 30) return 'bounce-excellent'
  if (rate <= 45) return 'bounce-good'
  if (rate <= 60) return 'bounce-fair'
  return 'bounce-poor'
}

const getLoadTimeClass = (time: number): string => {
  if (time < 1000) return 'load-excellent'
  if (time < 2000) return 'load-good'
  if (time < 3000) return 'load-fair'
  return 'load-poor'
}

// 时间筛选处理方法
const handleTimeRangeChange = () => {
  console.log('时间范围变更:', selectedTimeRange.value)
  loadPagePerformanceData()
}

const handleCustomDateChange = () => {
  if (customStartDate.value && customEndDate.value) {
    console.log('自定义时间范围:', customStartDate.value, '至', customEndDate.value)
    loadPagePerformanceData()
  }
}

const loadPagePerformanceData = () => {
  // 根据选择的时间范围重新加载数据
  console.log('根据时间范围重新加载页面表现数据...')
  // 实际项目中这里会调用API获取对应时间范围的数据
}

onMounted(() => {
  console.log('页面表现面板已加载')
  loadPagePerformanceData()
})
</script>

<style scoped>
.page-performance-panel {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
  height: auto !important;
  min-height: 200px;
}

.section-header {
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
}

.section-title {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.section-description {
  color: #6b7280;
  margin: 0;
}

.panel-content {
  padding: 0 24px 24px 24px;
}

.tabs-container {
  margin-bottom: 24px;
}

.tabs-header {
  display: flex;
  gap: 2px;
  margin-bottom: 0;
  border-bottom: 1px solid #e5e7eb;
}

.tab-button {
  padding: 12px 24px;
  border: none;
  background: #f8fafc;
  color: #64748b;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  border-radius: 8px 8px 0 0;
}

.tab-button.active {
  background: white;
  color: #1f2937;
  font-weight: 600;
  border-bottom: 2px solid #3b82f6;
}

.tab-content {
  padding-top: 16px;
}

.ranking-table {
  background: white;
  border-radius: 8px;
  overflow-x: auto;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.table-content {
  min-width: 1200px;
}

.table-header {
  display: grid;
  gap: 12px;
  padding: 16px;
  background: #f8fafc;
  font-weight: 600;
  color: #64748b;
  font-size: 13px;
  border-bottom: 1px solid #e2e8f0;
  white-space: nowrap;
}

.table-row {
  display: grid;
  gap: 12px;
  padding: 16px;
  border-bottom: 1px solid #f1f5f9;
  align-items: center;
  font-size: 13px;
  transition: background-color 0.2s;
}

.table-row:hover {
  background-color: #f8fafc;
}

.table-row:last-child {
  border-bottom: none;
}

/* 结果指标表格列 */
.tab-content:first-of-type .table-header,
.tab-content:first-of-type .table-row {
  grid-template-columns: 200px 100px 120px 120px 100px 100px 80px 120px 100px 100px 80px;
}

/* 过程指标表格列 */
.tab-content:last-of-type .table-header,
.tab-content:last-of-type .table-row {
  grid-template-columns: 200px 100px 120px 120px 100px 80px 120px 140px 120px 120px 120px;
}

.page-col {
  text-align: left;
  min-width: 0;
}

.page-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.page-title {
  font-weight: 500;
  color: #1f2937;
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.page-url {
  font-size: 11px;
  color: #6b7280;
  font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.type-col,
.category-col,
.product-col,
.users-col,
.new-users-col,
.conversion-col,
.revenue-col,
.users-ratio-col,
.revenue-ratio-col,
.cart-col,
.cart-rate-col,
.checkout-col,
.checkout-rate-col,
.session-col,
.load-col {
  text-align: right;
  font-weight: 500;
  white-space: nowrap;
}

.bounce-col {
  text-align: right;
}

.bounce-rate.bounce-excellent { color: #10b981; }
.bounce-rate.bounce-good { color: #f59e0b; }
.bounce-rate.bounce-fair { color: #3b82f6; }
.bounce-rate.bounce-poor { color: #ef4444; }

.load-time.load-excellent { color: #10b981; }
.load-time.load-good { color: #f59e0b; }
.load-time.load-fair { color: #3b82f6; }
.load-time.load-poor { color: #ef4444; }

.rank-badge {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  color: white;
}

.rank-first { background: #ffd700; }
.rank-second { background: #c0c0c0; }
.rank-third { background: #cd7f32; }
.rank-default { background: #64748b; }

.performance-score {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  color: white;
}

.performance-score.performance-excellent { background: var(--color-success); }
.performance-score.performance-good { background: var(--color-warning); }
.performance-score.performance-fair { background: var(--color-info); }
.performance-score.performance-poor { background: var(--color-danger); }

.trend-section {
  margin-bottom: 32px;
}

.trend-section h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text);
  margin: 0 0 16px 0;
}

.trend-chart {
  background: var(--color-background-soft);
  border-radius: 8px;
  padding: 16px;
  height: 300px;
}

.metrics-section {
  margin-bottom: 32px;
}

.metrics-section h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text);
  margin: 0 0 16px 0;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.metric-card {
  background: var(--color-background-soft);
  border-radius: 8px;
  padding: 20px;
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.metric-header h4 {
  font-size: 16px;
  font-weight: 500;
  color: var(--color-text);
  margin: 0;
}

.metric-score {
  font-size: 18px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 4px;
  color: white;
}

.metric-score.metric-excellent { background: var(--color-success); }
.metric-score.metric-good { background: var(--color-warning); }
.metric-score.metric-fair { background: var(--color-info); }
.metric-score.metric-poor { background: var(--color-danger); }

.metric-description {
  color: var(--color-text-secondary);
  font-size: 14px;
  margin-bottom: 16px;
}

.metric-chart {
  margin-bottom: 12px;
}

.chart-bar {
  width: 100%;
  height: 8px;
  background: var(--color-background-mute);
  border-radius: 4px;
  overflow: hidden;
}

.chart-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.chart-fill.metric-excellent { background: var(--color-success); }
.chart-fill.metric-good { background: var(--color-warning); }
.chart-fill.metric-fair { background: var(--color-info); }
.chart-fill.metric-poor { background: var(--color-danger); }

.metric-details {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--color-text-secondary);
}

.suggestions-section h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text);
  margin: 0 0 16px 0;
}

.suggestions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 16px;
}

.suggestion-card {
  background: var(--color-background-soft);
  border-radius: 8px;
  padding: 20px;
  display: flex;
  gap: 16px;
}

.suggestion-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: white;
}

.suggestion-icon.high { background: var(--color-danger); }
.suggestion-icon.medium { background: var(--color-warning); }
.suggestion-icon.low { background: var(--color-info); }

.suggestion-content {
  flex: 1;
}

.suggestion-content h4 {
  font-size: 16px;
  font-weight: 500;
  color: var(--color-text);
  margin: 0 0 8px 0;
}

.suggestion-content p {
  color: var(--color-text-secondary);
  margin: 0 0 12px 0;
  line-height: 1.5;
}

.suggestion-impact {
  display: flex;
  gap: 8px;
  align-items: center;
}

.impact-label {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.impact-value {
  font-size: 12px;
  font-weight: 500;
  padding: 2px 6px;
  border-radius: 4px;
  color: white;
}

.impact-value.high { background: var(--color-danger); }
.impact-value.medium { background: var(--color-warning); }
.impact-value.low { background: var(--color-info); }

.suggestion-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-end;
}

.action-btn {
  padding: 6px 12px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s;
}

.action-btn.primary {
  background: var(--color-primary);
  color: white;
}

.action-btn.secondary {
  background: var(--color-background);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
}

.action-btn:hover {
  opacity: 0.8;
}

@media (max-width: 1200px) {
  .ranking-table {
    overflow-x: scroll;
  }

  .table-content {
    min-width: 1400px;
  }
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .table-header,
  .table-row {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .metrics-grid {
    grid-template-columns: 1fr;
  }

  .suggestions-grid {
    grid-template-columns: 1fr;
  }

  .suggestion-card {
    flex-direction: column;
  }

  .suggestion-actions {
    flex-direction: row;
    align-items: center;
  }
}

/* 时间筛选器样式 */
.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
  padding: 24px 24px 20px 24px;
  border-bottom: 1px solid #e2e8f0;
}

.header-content {
  flex: 1;
  padding-right: 24px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.time-filter {
  display: flex;
  align-items: center;
  gap: 8px;
}

.time-select {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  font-size: 14px;
  cursor: pointer;
  min-width: 120px;
}

.time-select:focus {
  outline: none;
  border-color: #3b82f6;
}

.custom-date-range {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 12px;
}

.date-input {
  padding: 8px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
}

.date-input:focus {
  outline: none;
  border-color: #3b82f6;
}

.date-separator {
  color: #6b7280;
  font-size: 14px;
}

@media (max-width: 1024px) {
  .panel-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .header-actions {
    width: 100%;
    justify-content: flex-start;
  }
}

@media (max-width: 768px) {
  .time-filter {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .custom-date-range {
    margin-left: 0;
  }
}
</style>
