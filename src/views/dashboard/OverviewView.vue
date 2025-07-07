<template>
  <div class="overview-view">
    <div class="page-header">
      <h1 class="page-title">概览看板</h1>
      <p class="page-description">欢迎使用艾维数据平台，以下是您的数据概览</p>
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
            <div class="chart-placeholder">
              <BarChart3 :size="48" />
              <span>收入趋势图表</span>
              <p>显示过去{{ activePeriod }}的收入变化趋势</p>
            </div>
          </div>
        </div>

        <div class="chart-card">
          <div class="chart-card__header">
            <h3>渠道分布</h3>
          </div>
          <div class="chart-container">
            <div class="chart-placeholder">
              <PieChart :size="48" />
              <span>渠道分布饼图</span>
              <p>展示各个流量渠道的收入占比</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 客户列表 -->
      <div class="customer-section">
        <div class="section-header">
          <h3>最新客户数据</h3>
          <router-link :to="{ name: 'customer-list' }" class="view-all-link">
            查看全部
            <ArrowRight :size="16" />
          </router-link>
        </div>
        <div class="customer-table">
          <div class="table-header">
            <div class="table-cell">客户名称</div>
            <div class="table-cell">行业</div>
            <div class="table-cell">收入</div>
            <div class="table-cell">ROI</div>
            <div class="table-cell">状态</div>
          </div>
          <div 
            v-for="customer in topCustomers" 
            :key="customer.id"
            class="table-row"
          >
            <div class="table-cell">
              <div class="customer-info">
                <div class="customer-name">{{ customer.name }}</div>
                <div class="customer-manager">负责人: {{ customer.manager }}</div>
              </div>
            </div>
            <div class="table-cell">{{ customer.industry }}</div>
            <div class="table-cell">
              <span class="revenue-value">${{ formatNumber(customer.revenue) }}</span>
            </div>
            <div class="table-cell">
              <span class="roi-value" :class="getRoiClass(customer.roi)">
                {{ customer.roi.toFixed(1) }}x
              </span>
            </div>
            <div class="table-cell">
              <span class="status-badge" :class="`status-badge--${customer.status}`">
                {{ getStatusText(customer.status) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 预警提醒 -->
      <div class="alerts-section" v-if="recentAlerts.length > 0">
        <div class="section-header">
          <h3>预警提醒</h3>
          <span class="alert-count">{{ unreadCount }}条未读</span>
        </div>
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
              <div class="alert-time">{{ formatTime(alert.createdAt) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  TrendingDown,
  ArrowRight,
  DollarSign,
  Users,
  Target,
  Globe,
  AlertTriangle,
  Package,
  CreditCard,
  Clock
} from 'lucide-vue-next'
import { mockGetDashboardData } from '@/mock'
import type { Customer, Alert } from '@/types'

// 响应式数据
const activePeriod = ref('7天')
const loading = ref(false)
const topCustomers = ref<Customer[]>([])
const recentAlerts = ref<Alert[]>([])

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

const getStatusText = (status: string): string => {
  const statusMap = {
    active: '活跃',
    inactive: '暂停',
    suspended: '暂停'
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
      recentAlerts.value = response.data.alerts.slice(0, 4)
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
.overview-view {
  padding: 0;
}

.page-header {
  margin-bottom: var(--spacing-xl);
}

.page-title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-sm) 0;
}

.page-description {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  margin: 0;
}

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

.chart-placeholder span {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
}

.chart-placeholder p {
  font-size: var(--font-size-sm);
  margin: 0;
  text-align: center;
}

.customer-section,
.alerts-section {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
}

.section-header {
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border-light);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.section-header h3 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0;
}

.view-all-link {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--color-primary);
  text-decoration: none;
  font-size: var(--font-size-sm);
  transition: color var(--duration-fast);
}

.view-all-link:hover {
  color: var(--color-primary-hover);
}

.alert-count {
  font-size: var(--font-size-sm);
  color: var(--color-error);
  background: rgba(245, 34, 45, 0.1);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-sm);
}

.customer-table {
  display: flex;
  flex-direction: column;
}

.table-header,
.table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
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

.customer-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.customer-name {
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.customer-manager {
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

.status-badge {
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.status-badge--active {
  background: rgba(82, 196, 26, 0.1);
  color: var(--color-success);
}

.status-badge--inactive,
.status-badge--suspended {
  background: rgba(140, 140, 140, 0.1);
  color: var(--color-text-secondary);
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

.alert-time {
  font-size: var(--font-size-xs);
  color: var(--color-text-disabled);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .charts-grid {
    grid-template-columns: 1fr;
  }
  
  .table-header,
  .table-row {
    grid-template-columns: 1fr;
    gap: var(--spacing-sm);
  }
  
  .customer-table .table-cell:not(:first-child) {
    display: none;
  }
}
</style>