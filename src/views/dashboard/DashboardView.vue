<template>
  <div class="dashboard-view">
    <!-- 概览部分 -->
    <section id="overview" class="dashboard-section">
      <div class="section-header">
        <h2 class="section-title">概览看板</h2>
        <p class="section-description">欢迎使用艾维数据平台，以下是您的数据概览</p>
      </div>

      <div class="overview-content">
        <!-- 快速统计卡片 -->
        <div class="stats-grid">
          <div class="stat-card" v-for="stat in quickStats" :key="stat.title">
            <div class="stat-card__icon" :style="{ color: stat.color }">
              <component :is="getIcon(stat.icon)" :size="24" />
            </div>
            <div class="stat-card__content">
              <div class="stat-card__title">{{ stat.title }}</div>
              <div class="stat-card__value">{{ stat.value }}</div>
              <div class="stat-card__change" :class="stat.changeClass">
                <component :is="stat.trend === 'up' ? TrendingUp : TrendingDown" :size="16" />
                <span>{{ stat.change }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 图表区域 -->
        <div class="charts-grid">
          <div class="chart-card">
            <div class="chart-card__header">
              <h3>收入趋势</h3>
              <div class="chart-actions">
                <button 
                  v-for="period in periods" 
                  :key="period"
                  class="period-btn"
                  :class="{ 'period-btn--active': activePeriod === period }"
                  @click="activePeriod = period"
                >
                  {{ period }}
                </button>
              </div>
            </div>
            <div class="chart-container">
              <LineChart
                v-if="chartData && revenueChartData"
                :data="revenueChartData"
                height="300px"
                :smooth="true"
                :show-legend="false"
              />
              <div v-else class="chart-placeholder">
                <BarChart3 :size="48" />
                <span>加载中...</span>
              </div>
            </div>
          </div>

          <div class="chart-card">
            <div class="chart-card__header">
              <h3>渠道分布</h3>
            </div>
            <div class="chart-container">
              <PieChartComponent
                v-if="chartData && channelChartData"
                :data="channelChartData"
                height="300px"
                :show-legend="true"
                :donut="false"
              />
              <div v-else class="chart-placeholder">
                <PieChart :size="48" />
                <span>加载中...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 客户目标部分 -->
    <section id="customer-goals" class="dashboard-section">
      <div class="section-header">
        <h2 class="section-title">客户目标</h2>
        <p class="section-description">客户设定的目标和完成情况</p>
      </div>

      <div class="customer-goals-content">
        <div class="goals-grid">
          <div v-for="customer in topCustomers" :key="customer.id" class="goal-card">
            <div class="goal-card__header">
              <h4>{{ customer.name }}</h4>
              <span class="goal-card__industry">{{ customer.industry }}</span>
            </div>
            <div class="goal-card__progress">
              <div class="progress-item">
                <span class="progress-label">目标收入</span>
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: getGoalProgress(customer.revenue) + '%' }"></div>
                </div>
                <span class="progress-value">${{ formatNumber(customer.revenue) }}</span>
              </div>
              <div class="progress-item">
                <span class="progress-label">ROI 目标</span>
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: Math.min(customer.roi * 20, 100) + '%' }"></div>
                </div>
                <span class="progress-value">{{ customer.roi.toFixed(1) }}x</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 网站数据部分 -->
    <section id="website-data" class="dashboard-section">
      <div class="section-header">
        <h2 class="section-title">网站数据</h2>
        <p class="section-description">网站访问和用户行为数据</p>
      </div>

      <div class="website-data-content">
        <div class="website-stats-grid">
          <div class="website-stat-card">
            <div class="stat-icon">
              <Users :size="24" />
            </div>
            <div class="stat-content">
              <div class="stat-title">总访问量</div>
              <div class="stat-value">{{ formatNumber(websiteData.visitors) }}</div>
              <div class="stat-detail">
                新用户: {{ formatNumber(websiteData.newUsers) }} | 
                回访: {{ formatNumber(websiteData.returningUsers) }}
              </div>
            </div>
          </div>
          
          <div class="website-stat-card">
            <div class="stat-icon">
              <MousePointer :size="24" />
            </div>
            <div class="stat-content">
              <div class="stat-title">转化率</div>
              <div class="stat-value">{{ websiteData.conversionRate }}%</div>
              <div class="stat-detail">跳出率: {{ websiteData.bounceRate }}%</div>
            </div>
          </div>
          
          <div class="website-stat-card">
            <div class="stat-icon">
              <ShoppingCart :size="24" />
            </div>
            <div class="stat-content">
              <div class="stat-title">平均订单价值</div>
              <div class="stat-value">${{ websiteData.averageOrderValue.toFixed(2) }}</div>
              <div class="stat-detail">总订单: {{ websiteData.orders }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 渠道数据部分 -->
    <section id="channel-data" class="dashboard-section">
      <div class="section-header">
        <h2 class="section-title">渠道数据</h2>
        <p class="section-description">各渠道的表现和投资回报</p>
      </div>

      <div class="channel-data-content">
        <div class="channel-table">
          <div class="table-header">
            <div class="table-cell">渠道</div>
            <div class="table-cell">收入</div>
            <div class="table-cell">用户数</div>
            <div class="table-cell">会话</div>
            <div class="table-cell">转化率</div>
            <div class="table-cell">ROI</div>
          </div>
          <div v-for="channel in channels" :key="channel.id" class="table-row">
            <div class="table-cell">
              <div class="channel-info">
                <div class="channel-name">{{ channel.name }}</div>
                <div class="channel-type">{{ getChannelTypeText(channel.type) }}</div>
              </div>
            </div>
            <div class="table-cell">
              <span class="revenue-value">${{ formatNumber(channel.revenue) }}</span>
            </div>
            <div class="table-cell">{{ formatNumber(channel.users) }}</div>
            <div class="table-cell">{{ formatNumber(channel.sessions) }}</div>
            <div class="table-cell">{{ channel.conversionRate }}%</div>
            <div class="table-cell">
              <span class="roi-value" :class="getRoiClass(channel.roi)">
                {{ channel.roi > 0 ? channel.roi.toFixed(1) + 'x' : 'N/A' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 活动数据部分 -->
    <section id="campaign-data" class="dashboard-section">
      <div class="section-header">
        <h2 class="section-title">活动数据</h2>
        <p class="section-description">营销活动的表现和效果</p>
      </div>

      <div class="campaign-data-content">
        <div class="campaign-grid">
          <div v-for="campaign in campaigns" :key="campaign.id" class="campaign-card">
            <div class="campaign-card__header">
              <div class="campaign-info">
                <h4>{{ campaign.name }}</h4>
                <span class="campaign-type">{{ getCampaignTypeText(campaign.type) }}</span>
              </div>
              <span class="campaign-status" :class="`status--${campaign.status}`">
                {{ getCampaignStatusText(campaign.status) }}
              </span>
            </div>
            <div class="campaign-card__content">
              <div class="campaign-stats">
                <div class="campaign-stat">
                  <span class="stat-label">预算</span>
                  <span class="stat-value">${{ formatNumber(campaign.budget) }}</span>
                </div>
                <div class="campaign-stat">
                  <span class="stat-label">已花费</span>
                  <span class="stat-value">${{ formatNumber(campaign.spent) }}</span>
                </div>
                <div class="campaign-stat">
                  <span class="stat-label">收入</span>
                  <span class="stat-value">${{ formatNumber(campaign.revenue) }}</span>
                </div>
                <div class="campaign-stat">
                  <span class="stat-label">ROI</span>
                  <span class="stat-value">{{ campaign.roi.toFixed(1) }}x</span>
                </div>
              </div>
              <div class="campaign-progress">
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: (campaign.spent / campaign.budget * 100) + '%' }"></div>
                </div>
                <span class="progress-text">{{ (campaign.spent / campaign.budget * 100).toFixed(1) }}% 已使用</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 产品销售部分 -->
    <section id="product-sales" class="dashboard-section">
      <div class="section-header">
        <h2 class="section-title">产品销售</h2>
        <p class="section-description">各产品的销售情况和库存状态</p>
      </div>

      <div class="product-sales-content">
        <div class="product-grid">
          <div v-for="product in productSales" :key="product.id" class="product-card">
            <div class="product-card__image">
              <img :src="product.image" :alt="product.name" />
            </div>
            <div class="product-card__content">
              <div class="product-info">
                <h4>{{ product.name }}</h4>
                <span class="product-category">{{ product.category }}</span>
                <span class="product-price">${{ product.price }}</span>
              </div>
              <div class="product-stats">
                <div class="product-stat">
                  <span class="stat-label">销量</span>
                  <span class="stat-value">{{ product.soldQuantity }}</span>
                </div>
                <div class="product-stat">
                  <span class="stat-label">收入</span>
                  <span class="stat-value">${{ formatNumber(product.revenue) }}</span>
                </div>
                <div class="product-stat">
                  <span class="stat-label">库存</span>
                  <span class="stat-value" :class="getStockClass(product.stock)">
                    {{ product.stock }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 预警提醒部分 -->
    <section id="alerts" class="dashboard-section" v-if="recentAlerts.length > 0">
      <div class="section-header">
        <h2 class="section-title">预警提醒</h2>
        <p class="section-description">系统预警和重要提醒</p>
      </div>

      <div class="alerts-content">
        <div class="alerts-list">
          <div 
            v-for="alert in recentAlerts" 
            :key="alert.id"
            class="alert-item"
            :class="[
              `alert-item--${alert.level}`,
              { 'alert-item--unread': !alert.isRead }
            ]"
          >
            <div class="alert-icon">
              <component :is="getAlertIcon(alert.type)" :size="20" />
            </div>
            <div class="alert-content">
              <div class="alert-title">{{ alert.title }}</div>
              <div class="alert-message">{{ alert.message }}</div>
              <div class="alert-meta">
                <span class="alert-customer">{{ alert.customerName }}</span>
                <span class="alert-time">{{ formatTime(alert.createdAt) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Users,
  Target,
  Globe,
  AlertTriangle,
  Package,
  CreditCard,
  Clock,
  MousePointer,
  ShoppingCart
} from 'lucide-vue-next'
import { mockGetDashboardData } from '@/mock'
import LineChart from '@/components/charts/LineChart.vue'
import PieChartComponent from '@/components/charts/PieChart.vue'
import type { Customer, Alert, Channel, Campaign, ProductSales, WebsiteData } from '@/types'

// 响应式数据
const activePeriod = ref('7天')
const loading = ref(false)
const topCustomers = ref<Customer[]>([])
const recentAlerts = ref<Alert[]>([])
const channels = ref<Channel[]>([])
const campaigns = ref<Campaign[]>([])
const productSales = ref<ProductSales[]>([])
const websiteData = ref<WebsiteData>({
  totalSales: 0,
  totalCost: 0,
  roi: 0,
  orders: 0,
  averageOrderValue: 0,
  conversionRate: 0,
  visitors: 0,
  newUsers: 0,
  returningUsers: 0,
  bounceRate: 0
})
const chartData = ref<any>(null)

const periods = ['7天', '30天', '90天', '1年']

// 快速统计数据
const quickStats = ref([
  {
    title: '总收入',
    value: '$1,250,000',
    change: '+12.5%',
    trend: 'up',
    changeClass: 'stat-positive',
    icon: 'DollarSign',
    color: '#52c41a'
  },
  {
    title: '总用户',
    value: '125,000',
    change: '+8.2%',
    trend: 'up',
    changeClass: 'stat-positive',
    icon: 'Users',
    color: '#1890ff'
  },
  {
    title: 'ROI',
    value: '4.4x',
    change: '+0.3x',
    trend: 'up',
    changeClass: 'stat-positive',
    icon: 'Target',
    color: '#722ed1'
  },
  {
    title: '转化率',
    value: '3.2%',
    change: '-0.1%',
    trend: 'down',
    changeClass: 'stat-negative',
    icon: 'Globe',
    color: '#fa8c16'
  }
])

// 计算属性
const unreadCount = computed(() => recentAlerts.value.filter(a => !a.isRead).length)

// 收入趋势图表数据
const revenueChartData = computed(() => {
  if (!chartData.value) return null
  
  const data = chartData.value.revenue
  return {
    labels: data.labels,
    datasets: [{
      label: data.datasets[0].label,
      data: data.datasets[0].data,
      color: data.datasets[0].borderColor
    }]
  }
})

// 渠道分布图表数据
const channelChartData = computed(() => {
  if (!chartData.value) return null
  
  const data = chartData.value.channels
  return data.labels.map((label: string, index: number) => ({
    name: label,
    value: data.datasets[0].data[index],
    color: data.datasets[0].backgroundColor[index]
  }))
})

// 图标映射
const iconMap = {
  DollarSign,
  Users,
  Target,
  Globe
}

const alertIconMap = {
  balance: CreditCard,
  service: Clock,
  price: TrendingUp,
  stock: Package
}

// 方法
const getIcon = (iconName: string) => {
  return iconMap[iconName as keyof typeof iconMap] || BarChart3
}

const getAlertIcon = (type: string) => {
  return alertIconMap[type as keyof typeof alertIconMap] || AlertTriangle
}

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(0) + 'K'
  }
  return num.toString()
}

const getRoiClass = (roi: number): string => {
  if (roi >= 4) return 'roi-excellent'
  if (roi >= 3) return 'roi-good'
  if (roi >= 2) return 'roi-fair'
  return 'roi-poor'
}

const getStockClass = (stock: number): string => {
  if (stock <= 50) return 'stock-low'
  if (stock <= 100) return 'stock-medium'
  return 'stock-high'
}

const getGoalProgress = (revenue: number): number => {
  // 假设目标收入为最大收入的80%
  const maxRevenue = Math.max(...topCustomers.value.map(c => c.revenue))
  return Math.min((revenue / maxRevenue) * 100, 100)
}

const getChannelTypeText = (type: string): string => {
  const typeMap = {
    google: 'Google 广告',
    facebook: 'Facebook 广告',
    direct: '直接访问',
    email: '邮件营销',
    criteo: 'Criteo',
    bing: 'Bing 广告'
  }
  return typeMap[type as keyof typeof typeMap] || type
}

const getCampaignTypeText = (type: string): string => {
  const typeMap = {
    promotion: '促销活动',
    acquisition: '获客活动',
    seasonal: '季节性活动',
    branding: '品牌推广'
  }
  return typeMap[type as keyof typeof typeMap] || type
}

const getCampaignStatusText = (status: string): string => {
  const statusMap = {
    active: '进行中',
    paused: '已暂停',
    completed: '已完成'
  }
  return statusMap[status as keyof typeof statusMap] || status
}

const formatTime = (time: string): string => {
  const now = new Date()
  const alertTime = new Date(time)
  const diff = now.getTime() - alertTime.getTime()
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (days > 0) return `${days}天前`
  if (hours > 0) return `${hours}小时前`
  return '刚刚'
}

// 加载数据
const loadDashboardData = async () => {
  loading.value = true
  try {
    const response = await mockGetDashboardData()
    if (response.success && response.data) {
      topCustomers.value = response.data.customers.slice(0, 5)
      recentAlerts.value = response.data.alerts.slice(0, 6)
      channels.value = response.data.channels
      campaigns.value = response.data.campaigns
      productSales.value = response.data.productSales
      websiteData.value = response.data.websiteData
      chartData.value = response.data.chartData
    }
  } catch (error) {
    console.error('加载数据失败:', error)
  } finally {
    loading.value = false
  }
}

// 生命周期
onMounted(() => {
  loadDashboardData()
})
</script>

<style scoped>
.dashboard-view {
  padding: 0;
}

.dashboard-section {
  margin-bottom: var(--spacing-2xl);
  scroll-margin-top: calc(var(--header-height) + var(--spacing-lg));
}

.section-header {
  margin-bottom: var(--spacing-xl);
}

.section-title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-sm) 0;
}

.section-description {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  margin: 0;
}

/* 概览部分样式 */
.overview-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-lg);
}

.stat-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  transition: all var(--duration-fast);
}

.stat-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.stat-card__icon {
  width: 48px;
  height: 48px;
  border-radius: var(--border-radius-md);
  background: var(--color-background);
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-card__content {
  flex: 1;
}

.stat-card__title {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-xs);
}

.stat-card__value {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xs);
}

.stat-card__change {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.stat-positive {
  color: var(--color-success);
}

.stat-negative {
  color: var(--color-error);
}

.charts-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--spacing-lg);
}

.chart-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
}

.chart-card__header {
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border-light);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.chart-card__header h3 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0;
}

.chart-actions {
  display: flex;
  gap: var(--spacing-xs);
}

.period-btn {
  padding: var(--spacing-xs) var(--spacing-sm);
  background: none;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--duration-fast);
}

.period-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.period-btn--active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

.chart-container {
  padding: var(--spacing-lg);
  height: 300px;
}

.chart-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-md);
  background: var(--color-background);
  border: 2px dashed var(--color-border);
  border-radius: var(--border-radius-md);
  color: var(--color-text-secondary);
}

/* 客户目标样式 */
.goals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-lg);
}

.goal-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
}

.goal-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-md);
}

.goal-card__header h4 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0;
}

.goal-card__industry {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  background: var(--color-background);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-sm);
}

.goal-card__progress {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.progress-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.progress-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  min-width: 80px;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: var(--color-background);
  border-radius: var(--border-radius-sm);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--color-primary);
  border-radius: var(--border-radius-sm);
  transition: width var(--duration-normal);
}

.progress-value {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  min-width: 80px;
  text-align: right;
}

/* 网站数据样式 */
.website-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-lg);
}

.website-stat-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--border-radius-md);
  background: var(--color-primary-light);
  color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-content {
  flex: 1;
}

.stat-title {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-xs);
}

.stat-value {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xs);
}

.stat-detail {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}

/* 渠道数据样式 */
.channel-table {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
}

.table-header,
.table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr;
  gap: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-lg);
}

.table-header {
  background: var(--color-background);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
}

.table-row {
  border-bottom: 1px solid var(--color-border-light);
  transition: background-color var(--duration-fast);
}

.table-row:hover {
  background: var(--color-background);
}

.table-row:last-child {
  border-bottom: none;
}

.table-cell {
  display: flex;
  align-items: center;
  font-size: var(--font-size-sm);
}

.channel-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.channel-name {
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.channel-type {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}

.revenue-value {
  font-weight: var(--font-weight-semibold);
  color: var(--color-success);
}

.roi-value {
  font-weight: var(--font-weight-semibold);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-sm);
}

.roi-excellent { 
  background: rgba(82, 196, 26, 0.1);
  color: var(--color-success);
}
.roi-good { 
  background: rgba(24, 144, 255, 0.1);
  color: var(--color-info);
}
.roi-fair { 
  background: rgba(250, 173, 20, 0.1);
  color: var(--color-warning);
}
.roi-poor { 
  background: rgba(245, 34, 45, 0.1);
  color: var(--color-error);
}

/* 活动数据样式 */
.campaign-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: var(--spacing-lg);
}

.campaign-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
}

.campaign-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-md);
}

.campaign-info h4 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-xs) 0;
}

.campaign-type {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.campaign-status {
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.status--active {
  background: rgba(82, 196, 26, 0.1);
  color: var(--color-success);
}

.status--paused {
  background: rgba(250, 173, 20, 0.1);
  color: var(--color-warning);
}

.status--completed {
  background: rgba(140, 140, 140, 0.1);
  color: var(--color-text-secondary);
}

.campaign-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.campaign-stat {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.campaign-stat .stat-label {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}

.campaign-stat .stat-value {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.campaign-progress {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.campaign-progress .progress-bar {
  flex: 1;
  height: 6px;
  background: var(--color-background);
  border-radius: var(--border-radius-sm);
  overflow: hidden;
}

.campaign-progress .progress-fill {
  height: 100%;
  background: var(--color-warning);
  border-radius: var(--border-radius-sm);
  transition: width var(--duration-normal);
}

.progress-text {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  white-space: nowrap;
}

/* 产品销售样式 */
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-lg);
}

.product-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
}

.product-card__image {
  height: 200px;
  background: var(--color-background);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.product-card__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-card__content {
  padding: var(--spacing-lg);
}

.product-info {
  margin-bottom: var(--spacing-md);
}

.product-info h4 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-xs) 0;
}

.product-category {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-right: var(--spacing-sm);
}

.product-price {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
}

.product-stats {
  display: flex;
  justify-content: space-between;
  gap: var(--spacing-md);
}

.product-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
}

.product-stat .stat-label {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}

.product-stat .stat-value {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.stock-low {
  color: var(--color-error);
}

.stock-medium {
  color: var(--color-warning);
}

.stock-high {
  color: var(--color-success);
}

/* 预警提醒样式 */
.alerts-content {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
}

.alerts-list {
  display: flex;
  flex-direction: column;
}

.alert-item {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-lg);
  border-bottom: 1px solid var(--color-border-light);
  transition: background-color var(--duration-fast);
}

.alert-item:hover {
  background: var(--color-background);
}

.alert-item:last-child {
  border-bottom: none;
}

.alert-item--unread {
  background: var(--color-primary-light);
}

.alert-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--border-radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.alert-item--low .alert-icon {
  background: rgba(24, 144, 255, 0.1);
  color: var(--color-info);
}

.alert-item--medium .alert-icon {
  background: rgba(250, 173, 20, 0.1);
  color: var(--color-warning);
}

.alert-item--high .alert-icon,
.alert-item--critical .alert-icon {
  background: rgba(245, 34, 45, 0.1);
  color: var(--color-error);
}

.alert-content {
  flex: 1;
  min-width: 0;
}

.alert-title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xs);
}

.alert-message {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: var(--line-height-normal);
  margin-bottom: var(--spacing-xs);
}

.alert-meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-xs);
  color: var(--color-text-disabled);
}

.alert-customer {
  font-weight: var(--font-weight-medium);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .charts-grid {
    grid-template-columns: 1fr;
  }
  
  .goals-grid {
    grid-template-columns: 1fr;
  }
  
  .website-stats-grid {
    grid-template-columns: 1fr;
  }
  
  .table-header,
  .table-row {
    grid-template-columns: 1fr;
    gap: var(--spacing-sm);
  }
  
  .channel-table .table-cell:not(:first-child) {
    display: none;
  }
  
  .campaign-grid {
    grid-template-columns: 1fr;
  }
  
  .product-grid {
    grid-template-columns: 1fr;
  }
}
</style>