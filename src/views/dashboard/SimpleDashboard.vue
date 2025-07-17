<template>
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
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { mockGetDashboardData, mockGetCustomers } from '@/mock'
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
import type { Customer, Alert, WebsiteData } from '@/types'
import { useMenuStore } from '@/stores/menu'

const menuStore = useMenuStore()
const loading = ref(false)
const customers = ref<Customer[]>([])
const recentAlerts = ref<Alert[]>([])

const websiteData = ref<WebsiteData>({
  totalSales: 0,
  totalCost: 0,
  roi: 0,
  averageOrderItems: 0,
  orderConversionCost: 0,
  averageOrderValue: 0,
  conversionRate: 0,
  storeVisits: 0,
  userVisitCost: 0,
  orders: 0,
  orderItemsPerOrder: 0,
  ordersPerCustomer: 0,
  returningCustomerOrders: 0,
  newCustomerOrders: 0,
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
  addToCartRate: 0,
  checkoutCompletionRate: 0,
  checkoutConversionRate: 0,
  returns: 0,
  returnAmount: 0,
  returnRate: 0,
  returnSalesRatio: 0,
  dailySoldUnits: 0,
  remainingStockDays: 0,
  inStockDays: 0,
  outOfStockDays: 0,
  averageStockDays: 0,
  sellThroughRate: 0
})

// 预警相关方法
const handleMarkAsRead = async (alertId: number) => {
  try {
    console.log('标记预警为已读:', alertId)
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
        alert('充值功能开发中...')
        break
      case 'renew':
        alert('续约功能开发中...')
        break
      case 'restock':
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
      recentAlerts.value = response.data.alerts.slice(0, 6)
      websiteData.value = response.data.websiteData
    }
  } catch (error) {
    console.error('加载数据失败:', error)
  } finally {
    loading.value = false
  }
}

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

// 初始化菜单状态
const initializeMenuState = () => {
  const initialMenuId = 'dashboard-alerts'
  menuStore.setActiveMenu(initialMenuId)
  if (!menuStore.isMenuOpen('dashboard')) {
    menuStore.toggleSubmenu('dashboard')
  }
}

// 生命周期
onMounted(() => {
  loadCustomers()
  loadDashboardData()
  initializeMenuState()
})
</script>

<style scoped>
.dashboard-section {
  margin-bottom: var(--spacing-2xl);
  scroll-margin-top: 80px;
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

/* 移动端适配 */
@media (max-width: 768px) {
  .dashboard-section {
    scroll-margin-top: 80px;
  }
}

@media (max-width: 480px) {
  .dashboard-section {
    scroll-margin-top: 80px;
    margin-bottom: var(--spacing-xl);
  }
}
</style>
