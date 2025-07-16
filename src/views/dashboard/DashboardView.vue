<template>
    <div class="dashboard-content">
    <!-- 筛选项部分 - 固定在顶部 -->
    <div class="dashboard-filter-container">
      <DashboardFilter
        :customer-options="customers"
        :initial-filters="filters"
        @filter-change="handleFilterChange"
        @filter-apply="handleFilterApply"
        @filter-reset="handleFilterReset"
      />
    </div>

    <!-- 预警提醒部分 -->
    <section id="alerts" class="dashboard-section">
      <AlertPanel
        :alerts="recentAlerts"
        :loading="loading"
        @mark-as-read="handleMarkAsRead"
        @mark-all-as-read="handleMarkAllAsRead"
        @dismiss-alert="handleDismissAlert"
        @quick-action="handleQuickAction"
      />
    </section>

    <!-- 客户目标部分 -->
    <section id="customer-goals" class="dashboard-section">
      <div class="section-card">
        <div class="section-header">
          <h2 class="section-title">客户目标</h2>
          <p class="section-description">网站的各个目标完成情况</p>
        </div>

        <!-- 使用共享的客户目标模块 -->
        <CustomerGoalsModule />
      </div>
    </section>

    <!-- 网站数据部分 -->
    <section id="website-data" class="dashboard-section">
      <WebsiteDataPanel
        :data="websiteData"
        :loading="loading"
      />
    </section>

    <!-- 渠道数据部分 -->
    <section id="channel-data" class="dashboard-section">
      <ChannelDataPanel />
    </section>

    <!-- 活动数据部分 -->
    <section id="campaign-data" class="dashboard-section">
      <CampaignDataPanel />
    </section>

    <!-- 产品销售部分 -->
    <section id="product-sales" class="dashboard-section">
      <ProductSalesPanel />
    </section>

    <!-- 红人数据部分 -->
    <section id="kol-data" class="dashboard-section">
      <KOLDataPanel />
    </section>

    <!-- 地区市场部分 -->
    <section id="market-data" class="dashboard-section">
      <MarketDataPanel />
    </section>

    <!-- 页面表现部分 -->
    <section id="page-performance" class="dashboard-section">
      <PagePerformancePanel />
    </section>

    <!-- 竞品分析部分 -->
    <section id="competitor-analysis" class="dashboard-section">
      <CompetitorPanel />
    </section>

    <!-- 广告数据部分 -->
    <section id="ad-platform-overview" class="dashboard-section">
      <AdPlatformOverviewPanel />
    </section>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Users,
  Target,
  Globe,
  AlertTriangle,
  Package,
  CreditCard,
  Clock,
  Calendar
} from 'lucide-vue-next'
import { mockGetDashboardData, mockGetCustomers } from '@/mock'
import LineChart from '@/components/charts/LineChart.vue'
import PieChartComponent from '@/components/charts/PieChart.vue'
import AlertPanel from '@/components/common/AlertPanel.vue'

import CustomerGoalsModule from '@/components/dashboard/CustomerGoalsModule.vue'
import WebsiteDataPanel from '@/components/dashboard/WebsiteDataPanel.vue'
import ChannelDataPanel from '@/components/dashboard/ChannelDataPanel.vue'
import CampaignDataPanel from '@/components/dashboard/CampaignDataPanel.vue'
import ProductSalesPanel from '@/components/dashboard/ProductSalesPanel.vue'
import KOLDataPanel from '@/components/dashboard/KOLDataPanel.vue'
import MarketDataPanel from '@/components/dashboard/MarketDataPanel.vue'
import PagePerformancePanel from '@/components/dashboard/PagePerformancePanel.vue'
import CompetitorPanel from '@/components/dashboard/CompetitorPanel.vue'
import AdPlatformOverviewPanel from '@/components/dashboard/AdPlatformOverviewPanel.vue'
import type { Customer, Alert, Channel, Campaign, ProductSales, WebsiteData } from '@/types'
import { useMenuStore } from '@/stores/menu'
import DashboardFilter from '@/components/common/DashboardFilter.vue'

// 组合式API
const menuStore = useMenuStore()

// 滚动监听相关
const activeSection = ref('alerts')
const sectionObserver = ref<IntersectionObserver | null>(null)

// 定义所有section的配置（按照设计文档顺序）
const dashboardSections = [
  { id: 'alerts', name: '预警提醒', icon: 'AlertTriangle' },
  { id: 'customer-goals', name: '客户目标', icon: 'Target' },
  { id: 'website-data', name: '网站数据', icon: 'Globe' },
  { id: 'channel-data', name: '渠道数据', icon: 'TrendingUp' },
  { id: 'campaign-data', name: '活动数据', icon: 'Calendar' },
  { id: 'product-sales', name: '产品销售', icon: 'Package' },
  { id: 'kol-data', name: '红人数据', icon: 'Users' },
  { id: 'market-data', name: '地区市场', icon: 'Globe' },
  { id: 'page-performance', name: '页面表现', icon: 'TrendingUp' },
  { id: 'competitor-analysis', name: '竞品分析', icon: 'BarChart3' },
  { id: 'ad-platform-overview', name: '广告数据', icon: 'DollarSign' }
]

// 响应式数据
const activePeriod = ref('7天')
const loading = ref(false)
const customers = ref<Customer[]>([])
const topCustomers = ref<Customer[]>([])
const recentAlerts = ref<Alert[]>([])
const channels = ref<Channel[]>([])
const campaigns = ref<Campaign[]>([])
const productSales = ref<ProductSales[]>([])



const websiteData = ref<WebsiteData>({
  // 结果指标
  totalSales: 0,
  totalCost: 0,
  roi: 0,
  averageOrderItems: 0,
  orderConversionCost: 0,
  averageOrderValue: 0,
  conversionRate: 0,
  storeVisits: 0,
  userVisitCost: 0,

  // 订单指标
  orders: 0,
  orderItemsPerOrder: 0,
  ordersPerCustomer: 0,
  returningCustomerOrders: 0,
  newCustomerOrders: 0,

  // 用户指标
  visitors: 0,
  visits: 0,
  newUsers: 0,
  returningUsers: 0,
  addToCartVisits: 0,
  reachCheckoutVisits: 0,
  completeCheckoutVisits: 0,
  completedCheckoutVisits: 0,
  averageVisitDuration: 0,
  bounceCount: 0,
  bounceRate: 0,

  // 用户漏斗
  addToCartRate: 0,
  checkoutCompletionRate: 0,
  checkoutConversionRate: 0,

  // 退货指标
  returns: 0,
  returnAmount: 0,
  returnRate: 0,
  returnSalesRatio: 0,

  // 库存指标
  dailySoldUnits: 0,
  remainingStockDays: 0,
  inStockDays: 0,
  outOfStockDays: 0,
  averageStockDays: 0,
  sellThroughRate: 0
})
interface ChartDataset {
  label: string
  data: number[]
  borderColor?: string
  backgroundColor?: string | string[]
}

interface ChartData {
  labels: string[]
  datasets: ChartDataset[]
}

interface DashboardChartData {
  revenue: ChartData
  channels: ChartData
}

const chartData = ref<DashboardChartData | null>(null)

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

// 计算属性 - unreadCount 被移除因为不需要在这个组件中使用



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
    color: data.datasets[0].backgroundColor?.[index] || '#1890ff'
  }))
})

// 图标映射
const iconMap = {
  DollarSign,
  Users,
  Target,
  Globe,
  BarChart3,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Package
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

// 客户目标相关方法
const getGoalStatusText = (status: string): string => {
  const statusMap = {
    active: '进行中',
    completed: '已完成',
    paused: '已暂停',
    cancelled: '已取消'
  }
  return statusMap[status as keyof typeof statusMap] || status
}

const getProgressClass = (progress: number): string => {
  if (progress >= 100) return 'progress-excellent'
  if (progress >= 80) return 'progress-good'
  if (progress >= 60) return 'progress-fair'
  return 'progress-poor'
}

const getGoalTypeText = (type: string): string => {
  const typeMap = {
    monthly: '月度',
    quarterly: '季度',
    yearly: '年度'
  }
  return typeMap[type as keyof typeof typeMap] || type
}

const viewGoalDetails = (goalId: number) => {
  console.log('查看目标详情:', goalId)
  // 这里可以跳转到目标详情页面或打开详情弹窗
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



// 加载客户数据
const loadCustomers = async () => {
  try {
    const response = await mockGetCustomers()
    if (response.success && response.data) {
      customers.value = response.data
    }
  } catch (error) {
    console.error('加载客户数据失败:', error)
  }
}



// 预警相关方法
const handleMarkAsRead = async (alertId: number) => {
  try {
    // 调用API标记为已读
    console.log('标记预警为已读:', alertId)
    // 更新本地状态
    const alert = recentAlerts.value.find(a => a.id === alertId)
    if (alert) {
      alert.isRead = true
    }
  } catch (error) {
    console.error('标记预警失败:', error)
  }
}

const handleMarkAllAsRead = async () => {
  try {
    console.log('标记所有预警为已读')
    // 更新本地状态
    recentAlerts.value.forEach(alert => {
      alert.isRead = true
    })
  } catch (error) {
    console.error('标记所有预警失败:', error)
  }
}

const handleDismissAlert = async (alertId: number) => {
  try {
    console.log('忽略预警:', alertId)
    // 从列表中移除
    const index = recentAlerts.value.findIndex(a => a.id === alertId)
    if (index > -1) {
      recentAlerts.value.splice(index, 1)
    }
  } catch (error) {
    console.error('忽略预警失败:', error)
  }
}

const handleQuickAction = async (alert: any, action: string) => {
  try {
    console.log('执行快捷操作:', action, alert)

    switch (action) {
      case 'recharge':
        // 跳转到充值页面或弹出充值弹窗
        alert('充值功能开发中...')
        break
      case 'renew':
        // 跳转到续约页面或弹出续约弹窗
        alert('续约功能开发中...')
        break
      case 'restock':
        // 跳转到补货页面或弹出补货弹窗
        alert('补货功能开发中...')
        break
      default:
        console.warn('未知的快捷操作:', action)
    }
  } catch (error) {
    console.error('执行快捷操作失败:', error)
  }
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

// 滚动监听函数
const setupScrollObserver = () => {
  // 创建 Intersection Observer 来监听section的可见性
  sectionObserver.value = new IntersectionObserver(
    (entries) => {
      // 找到最可见的section（intersectionRatio最大的）
      const mostVisibleEntry = entries.reduce((prev, current) => {
        return (current.intersectionRatio > prev.intersectionRatio) ? current : prev
      })

      if (mostVisibleEntry.isIntersecting) {
        const sectionId = mostVisibleEntry.target.id
        if (sectionId && activeSection.value !== sectionId) {
          console.log('Section changed:', activeSection.value, '->', sectionId)
          activeSection.value = sectionId
          // 更新侧边栏活跃状态
          updateSidebarActiveState(sectionId)
          // 更新面包屑
          updateBreadcrumb(sectionId)
        }
      }
    },
    {
      root: null,
      rootMargin: '-10% 0px -70% 0px', // 优化边界设置，提高检测精度
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0] // 多个阈值获得更精确的intersectionRatio
    }
  )

  // 观察所有section元素
  nextTick(() => {
    dashboardSections.forEach(section => {
      const element = document.getElementById(section.id)
      if (element && sectionObserver.value) {
        sectionObserver.value.observe(element)
      }
    })
  })
}

// 更新侧边栏活跃状态
const updateSidebarActiveState = (sectionId: string) => {
  // 根据sectionId构建菜单ID，匹配菜单配置中的ID格式
  const menuId = `dashboard-${sectionId}`
  console.log('Updating sidebar active state for section:', sectionId, 'menuId:', menuId)

  // 使用menuStore的setActiveMenu方法更新活跃菜单
  menuStore.setActiveMenu(menuId)

  // 确保父级菜单（数据看板）也是展开的
  if (!menuStore.isMenuOpen('dashboard')) {
    menuStore.toggleSubmenu('dashboard')
  }
}

// 更新面包屑
const updateBreadcrumb = (sectionId: string) => {
  const section = dashboardSections.find(s => s.id === sectionId)
  if (section) {
    // 动态更新面包屑数据
    const breadcrumbData = [
      { id: 'dashboard', name: '数据看板', icon: 'BarChart3', path: '/dashboard' },
      { id: `dashboard-${sectionId}`, name: section.name, icon: section.icon, path: `/dashboard#${sectionId}` }
    ]
    // 使用 menu store 的动态面包屑功能
    menuStore.setDynamicBreadcrumb(breadcrumbData)
    // 更新页面标题
    document.title = `${section.name} - 艾维数据平台`
  }
}

// 平滑滚动到指定section
const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest'
    })
    // 手动设置活跃section，确保同步
    activeSection.value = sectionId
    updateSidebarActiveState(sectionId)
    updateBreadcrumb(sectionId)
  }
}

// 处理子菜单导航的section变化
const handleSectionChange = (sectionId: string) => {
  activeSection.value = sectionId
  updateSidebarActiveState(sectionId)
  updateBreadcrumb(sectionId)
}

// 暴露给全局使用（如果需要）
defineExpose({
  scrollToSection
})

// 初始化菜单状态
const initializeMenuState = () => {
  // 设置初始活跃菜单为预警提醒
  const initialMenuId = 'dashboard-alerts'
  menuStore.setActiveMenu(initialMenuId)

  // 确保数据看板父级菜单是展开的
  if (!menuStore.isMenuOpen('dashboard')) {
    menuStore.toggleSubmenu('dashboard')
  }

  // 设置初始面包屑
  updateBreadcrumb('alerts')
}

// 筛选项相关状态和方法
interface DashboardFilters {
  customerId: number | null
  projectId: string
  viewMode: 'all' | 'my'
  dateRange: string
  startDate: string
  endDate: string
}

const filters = ref<DashboardFilters>({
  customerId: null,
  projectId: '',
  viewMode: 'all',
  dateRange: 'today',
  startDate: '',
  endDate: ''
})



const handleFilterChange = (newFilters: DashboardFilters) => {
  filters.value = { ...newFilters }
}

const handleFilterApply = (appliedFilters: DashboardFilters) => {
  console.log('Filter applied:', appliedFilters)
  filters.value = { ...appliedFilters }
  // 应用过滤逻辑，例如重新加载数据
  loadDashboardData()
}

const handleFilterReset = () => {
  console.log('Filter reset')
  // 重置过滤器
  filters.value = {
    customerId: null,
    projectId: '',
    viewMode: 'all',
    dateRange: 'today',
    startDate: '',
    endDate: ''
  }
  loadDashboardData()
}



// 生命周期
onMounted(() => {
  loadCustomers()
  loadDashboardData()
  setupScrollObserver()
  initializeMenuState()
})

onUnmounted(() => {
  if (sectionObserver.value) {
    sectionObserver.value.disconnect()
  }
})
</script>

<style scoped>
.dashboard-content {
  padding-top: 20px;
  max-width: 1200px;
  margin: 0 auto;
  padding-left: 20px;
  padding-right: 20px;
}

/* 筛选项容器样式 */
.dashboard-filter-container {
  position: sticky;
  top: 64px;
  z-index: 1000;
  background-color: rgba(255, 255, 255, 0.98);
  border-bottom: 1px solid var(--color-border-light);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  margin-bottom: var(--spacing-2xl);
  backdrop-filter: blur(12px);
  border-radius: 8px;
  margin-left: -20px;
  margin-right: -20px;
  padding-left: 20px;
  padding-right: 20px;
}





/* 移动端适配 */
@media (max-width: 1024px) {
  .dashboard-filter-container {
    margin-left: -20px;
    margin-right: -20px;
    padding-left: 20px;
    padding-right: 20px;
  }
}

@media (max-width: 768px) {
  .dashboard-filter-container {
    margin-left: -20px;
    margin-right: -20px;
    padding-left: 20px;
    padding-right: 20px;
    margin-bottom: var(--spacing-2xl);
  }

  .dashboard-filter-container.sticky {
    top: 60px;
    padding-left: 20px;
    padding-right: 20px;
    max-width: none;
    z-index: 1001;
  }
}

  .dashboard-content {
    padding-top: 20px;
    max-width: 1200px;
    margin: 0 auto;
    padding-left: 20px;
    padding-right: 20px;
  }

  .dashboard-section {
    scroll-margin-top: 140px; /* 考虑筛选项高度 */
  }

@media (max-width: 480px) {
  .dashboard-filter-container {
    margin-left: -20px;
    margin-right: -20px;
    padding-left: 20px;
    padding-right: 20px;
    margin-bottom: var(--spacing-2xl);
  }

  .dashboard-filter-container.sticky {
    top: 56px;
    padding-left: 20px;
    padding-right: 20px;
    max-width: none;
    z-index: 1002;
  }
}

.dashboard-content {
  padding-top: 20px;
  max-width: 1200px;
  margin: 0 auto;
  padding-left: 20px;
  padding-right: 20px;
}

.dashboard-section {
  margin-bottom: var(--spacing-2xl);
  scroll-margin-top: 80px; /* 头部导航的高度 */
}

.section-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
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
.goals-tabs {
  display: flex;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-xl);
  border-bottom: 1px solid var(--color-border);
}

.tab-button {
  padding: var(--spacing-sm) var(--spacing-lg);
  border: none;
  background: none;
  color: var(--color-text-secondary);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all var(--duration-fast);
}

.tab-button:hover {
  color: var(--color-primary);
}

.tab-button.active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}

.goals-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.summary-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.summary-icon {
  width: 48px;
  height: 48px;
  background: var(--color-primary-light);
  border-radius: var(--border-radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
}

.progress-circle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--color-primary-light);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
}

.summary-content {
  flex: 1;
}

.summary-value {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xs);
}

.summary-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.goals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: var(--spacing-xl);
}

.goal-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all var(--duration-fast);
}

.goal-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.goal-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: var(--spacing-lg);
}

.goal-info h4 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-xs) 0;
}

.goal-customer {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-right: var(--spacing-sm);
}

.goal-period {
  font-size: var(--font-size-sm);
  color: var(--color-primary);
  background: var(--color-primary-light);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-sm);
}

.goal-status {
  display: flex;
  align-items: center;
}

.status-badge {
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.status-active {
  background: #dcfce7;
  color: #166534;
}

.status-completed {
  background: #e0e7ff;
  color: #3730a3;
}

.status-paused {
  background: #fef3c7;
  color: #92400e;
}

.status-cancelled {
  background: #fee2e2;
  color: #991b1b;
}

.goal-card__content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.goal-metric {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.metric-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-medium);
}

.metric-progress {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.metric-values {
  display: flex;
  align-items: baseline;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-xs);
}

.metric-actual {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.metric-target {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.progress-bar {
  height: 8px;
  background: var(--color-background);
  border-radius: var(--border-radius-sm);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: var(--border-radius-sm);
  transition: width var(--duration-normal);
}

.progress-excellent {
  background: #22c55e;
}

.progress-good {
  background: #3b82f6;
}

.progress-fair {
  background: #f59e0b;
}

.progress-poor {
  background: #ef4444;
}

.goal-card__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: var(--spacing-lg);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--color-border-light);
}

.goal-period-info {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.detail-button {
  padding: var(--spacing-xs) var(--spacing-md);
  border: 1px solid var(--color-primary);
  background: white;
  color: var(--color-primary);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all var(--duration-fast);
}

.detail-button:hover {
  background: var(--color-primary);
  color: white;
}

.empty-state {
  text-align: center;
  padding: var(--spacing-3xl) var(--spacing-xl);
  color: var(--color-text-secondary);
}

.empty-icon {
  margin-bottom: var(--spacing-lg);
  opacity: 0.5;
}

.empty-state h3 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-sm) 0;
}

.empty-state p {
  margin: 0;
  color: var(--color-text-secondary);
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
