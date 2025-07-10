<template>
  <div class="website-data-panel">
    <div class="panel-header">
      <div class="header-content">
        <h3>网站数据</h3>
        <p>网站访问和用户行为数据分析</p>
      </div>
      <div class="header-actions">
        <button class="custom-dimension-btn" @click="showCustomDimension = true">
          <Settings :size="16" />
          自定义维度
        </button>
      </div>
    </div>

    <!-- 标签页导航 -->
    <div class="tabs-nav">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        class="tab-btn"
        :class="{ 'tab-btn--active': activeTab === tab.key }"
        @click="activeTab = tab.key"
      >
        <component :is="tab.icon" :size="16" />
        {{ tab.label }}
      </button>
    </div>

    <!-- 标签页内容 -->
    <div class="tab-content">
      <!-- 结果指标 -->
      <div v-if="activeTab === 'results'" class="tab-panel">
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-icon">
              <DollarSign :size="24" />
            </div>
            <div class="metric-content">
              <div class="metric-label">总销售额</div>
              <div class="metric-value">${{ formatNumber(data.totalSales) }}</div>
              <div class="metric-change positive">+12.5%</div>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon">
              <CreditCard :size="24" />
            </div>
            <div class="metric-content">
              <div class="metric-label">总花费</div>
              <div class="metric-value">${{ formatNumber(data.totalCost) }}</div>
              <div class="metric-change negative">+8.3%</div>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon">
              <TrendingUp :size="24" />
            </div>
            <div class="metric-content">
              <div class="metric-label">ROI</div>
              <div class="metric-value">{{ data.roi.toFixed(1) }}x</div>
              <div class="metric-change positive">+5.2%</div>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon">
              <Package :size="24" />
            </div>
            <div class="metric-content">
              <div class="metric-label">订单平均产品数(AOI)</div>
              <div class="metric-value">{{ data.averageOrderItems.toFixed(1) }}</div>
              <div class="metric-change positive">+2.1%</div>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon">
              <Target :size="24" />
            </div>
            <div class="metric-content">
              <div class="metric-label">订单转化成本</div>
              <div class="metric-value">${{ data.orderConversionCost.toFixed(2) }}</div>
              <div class="metric-change negative">+3.8%</div>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon">
              <ShoppingCart :size="24" />
            </div>
            <div class="metric-content">
              <div class="metric-label">平均订单价值</div>
              <div class="metric-value">${{ data.averageOrderValue.toFixed(2) }}</div>
              <div class="metric-change positive">+7.2%</div>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon">
              <Percent :size="24" />
            </div>
            <div class="metric-content">
              <div class="metric-label">转化率</div>
              <div class="metric-value">{{ data.conversionRate.toFixed(1) }}%</div>
              <div class="metric-change positive">+1.5%</div>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon">
              <Eye :size="24" />
            </div>
            <div class="metric-content">
              <div class="metric-label">商店访问次数</div>
              <div class="metric-value">{{ formatNumber(data.storeVisits) }}</div>
              <div class="metric-change positive">+15.3%</div>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon">
              <Users :size="24" />
            </div>
            <div class="metric-content">
              <div class="metric-label">用户访问成本</div>
              <div class="metric-value">${{ data.userVisitCost.toFixed(2) }}</div>
              <div class="metric-change negative">+4.1%</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 订单指标 -->
      <div v-if="activeTab === 'orders'" class="tab-panel">
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-icon">
              <ShoppingBag :size="24" />
            </div>
            <div class="metric-content">
              <div class="metric-label">订单量</div>
              <div class="metric-value">{{ formatNumber(data.orders) }}</div>
              <div class="metric-change positive">+18.2%</div>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon">
              <Package :size="24" />
            </div>
            <div class="metric-content">
              <div class="metric-label">每笔订单订购数量</div>
              <div class="metric-value">{{ data.orderItemsPerOrder.toFixed(1) }}</div>
              <div class="metric-change positive">+3.5%</div>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon">
              <User :size="24" />
            </div>
            <div class="metric-content">
              <div class="metric-label">每位客户订单数</div>
              <div class="metric-value">{{ data.ordersPerCustomer.toFixed(1) }}</div>
              <div class="metric-change positive">+5.8%</div>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon">
              <RefreshCw :size="24" />
            </div>
            <div class="metric-content">
              <div class="metric-label">订单数(回头客)</div>
              <div class="metric-value">{{ formatNumber(data.returningCustomerOrders) }}</div>
              <div class="metric-change positive">+12.7%</div>
              <div class="metric-detail">占比: {{ ((data.returningCustomerOrders / data.orders) * 100).toFixed(1) }}%</div>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon">
              <UserPlus :size="24" />
            </div>
            <div class="metric-content">
              <div class="metric-label">订单数(新客户)</div>
              <div class="metric-value">{{ formatNumber(data.newCustomerOrders) }}</div>
              <div class="metric-change positive">+22.1%</div>
              <div class="metric-detail">占比: {{ ((data.newCustomerOrders / data.orders) * 100).toFixed(1) }}%</div>
            </div>
          </div>
        </div>

        <!-- 订单分布图表 -->
        <div class="chart-section">
          <h4>订单分布</h4>
          <div class="chart-container">
            <div class="distribution-chart">
              <div class="chart-item">
                <div class="chart-bar">
                  <div
                    class="chart-fill chart-fill--returning"
                    :style="{ width: (data.returningCustomerOrders / data.orders) * 100 + '%' }"
                  ></div>
                </div>
                <div class="chart-label">回头客订单</div>
                <div class="chart-value">{{ formatNumber(data.returningCustomerOrders) }}</div>
              </div>
              <div class="chart-item">
                <div class="chart-bar">
                  <div
                    class="chart-fill chart-fill--new"
                    :style="{ width: (data.newCustomerOrders / data.orders) * 100 + '%' }"
                  ></div>
                </div>
                <div class="chart-label">新客户订单</div>
                <div class="chart-value">{{ formatNumber(data.newCustomerOrders) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 用户指标 -->
      <div v-if="activeTab === 'users'" class="tab-panel">
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-icon">
              <Users :size="24" />
            </div>
            <div class="metric-content">
              <div class="metric-label">在线商店访客数</div>
              <div class="metric-value">{{ formatNumber(data.visitors) }}</div>
              <div class="metric-change positive">+14.3%</div>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon">
              <Eye :size="24" />
            </div>
            <div class="metric-content">
              <div class="metric-label">访问</div>
              <div class="metric-value">{{ formatNumber(data.visits) }}</div>
              <div class="metric-change positive">+18.7%</div>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon">
              <UserPlus :size="24" />
            </div>
            <div class="metric-content">
              <div class="metric-label">新用户</div>
              <div class="metric-value">{{ formatNumber(data.newUsers) }}</div>
              <div class="metric-change positive">+25.1%</div>
              <div class="metric-detail">占比: {{ ((data.newUsers / data.visitors) * 100).toFixed(1) }}%</div>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon">
              <RefreshCw :size="24" />
            </div>
            <div class="metric-content">
              <div class="metric-label">回访用户</div>
              <div class="metric-value">{{ formatNumber(data.returningUsers) }}</div>
              <div class="metric-change positive">+8.9%</div>
              <div class="metric-detail">占比: {{ ((data.returningUsers / data.visitors) * 100).toFixed(1) }}%</div>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon">
              <ShoppingCart :size="24" />
            </div>
            <div class="metric-content">
              <div class="metric-label">加购访问次数</div>
              <div class="metric-value">{{ formatNumber(data.addToCartVisits) }}</div>
              <div class="metric-change positive">+16.4%</div>
              <div class="metric-detail">占比: {{ ((data.addToCartVisits / data.visits) * 100).toFixed(1) }}%</div>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon">
              <CreditCard :size="24" />
            </div>
            <div class="metric-content">
              <div class="metric-label">到达结账页面访问</div>
              <div class="metric-value">{{ formatNumber(data.reachCheckoutVisits) }}</div>
              <div class="metric-change positive">+12.8%</div>
              <div class="metric-detail">占比: {{ ((data.reachCheckoutVisits / data.visits) * 100).toFixed(1) }}%</div>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon">
              <Check :size="24" />
            </div>
            <div class="metric-content">
              <div class="metric-label">完成结账访问</div>
              <div class="metric-value">{{ formatNumber(data.completedCheckoutVisits) }}</div>
              <div class="metric-change positive">+10.5%</div>
              <div class="metric-detail">占比: {{ ((data.completedCheckoutVisits / data.visits) * 100).toFixed(1) }}%</div>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon">
              <Clock :size="24" />
            </div>
            <div class="metric-content">
              <div class="metric-label">平均访问持续时间</div>
              <div class="metric-value">{{ formatDuration(data.averageVisitDuration) }}</div>
              <div class="metric-change positive">+8.2%</div>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon">
              <LogOut :size="24" />
            </div>
            <div class="metric-content">
              <div class="metric-label">跳出量</div>
              <div class="metric-value">{{ formatNumber(data.bounceCount) }}</div>
              <div class="metric-change negative">-3.1%</div>
              <div class="metric-detail">跳出率: {{ data.bounceRate.toFixed(1) }}%</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 用户漏斗 -->
      <div v-if="activeTab === 'funnel'" class="tab-panel">
        <div class="funnel-section">
          <h4>用户转化漏斗</h4>
          <div class="funnel-chart">
            <div class="funnel-step">
              <div class="funnel-bar" style="width: 100%">
                <div class="funnel-content">
                  <span class="funnel-label">访问</span>
                  <span class="funnel-value">{{ formatNumber(data.visits) }}</span>
                </div>
              </div>
            </div>

            <div class="funnel-step">
              <div class="funnel-bar" :style="{ width: (data.addToCartVisits / data.visits * 100) + '%' }">
                <div class="funnel-content">
                  <span class="funnel-label">加购</span>
                  <span class="funnel-value">{{ formatNumber(data.addToCartVisits) }}</span>
                </div>
              </div>
              <div class="funnel-rate">{{ data.addToCartRate.toFixed(1) }}%</div>
            </div>

            <div class="funnel-step">
              <div class="funnel-bar" :style="{ width: (data.reachCheckoutVisits / data.visits * 100) + '%' }">
                <div class="funnel-content">
                  <span class="funnel-label">到达结账</span>
                  <span class="funnel-value">{{ formatNumber(data.reachCheckoutVisits) }}</span>
                </div>
              </div>
              <div class="funnel-rate">{{ ((data.reachCheckoutVisits / data.visits) * 100).toFixed(1) }}%</div>
            </div>

            <div class="funnel-step">
              <div class="funnel-bar" :style="{ width: (data.completedCheckoutVisits / data.visits * 100) + '%' }">
                <div class="funnel-content">
                  <span class="funnel-label">完成结账</span>
                  <span class="funnel-value">{{ formatNumber(data.completedCheckoutVisits) }}</span>
                </div>
              </div>
              <div class="funnel-rate">{{ data.checkoutCompletionRate.toFixed(1) }}%</div>
            </div>
          </div>
        </div>

        <div class="conversion-metrics">
          <div class="metric-card">
            <div class="metric-icon">
              <ShoppingCart :size="24" />
            </div>
            <div class="metric-content">
              <div class="metric-label">加购率</div>
              <div class="metric-value">{{ data.addToCartRate.toFixed(1) }}%</div>
              <div class="metric-change positive">+2.3%</div>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon">
              <Check :size="24" />
            </div>
            <div class="metric-content">
              <div class="metric-label">完成结账率</div>
              <div class="metric-value">{{ data.checkoutCompletionRate.toFixed(1) }}%</div>
              <div class="metric-change positive">+1.8%</div>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon">
              <CreditCard :size="24" />
            </div>
            <div class="metric-content">
              <div class="metric-label">结账转化率</div>
              <div class="metric-value">{{ data.checkoutConversionRate.toFixed(1) }}%</div>
              <div class="metric-change positive">+3.2%</div>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon">
              <Target :size="24" />
            </div>
            <div class="metric-content">
              <div class="metric-label">总转化率</div>
              <div class="metric-value">{{ data.conversionRate.toFixed(1) }}%</div>
              <div class="metric-change positive">+1.5%</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 退货指标 -->
      <div v-if="activeTab === 'returns'" class="tab-panel">
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-icon">
              <RotateCcw :size="24" />
            </div>
            <div class="metric-content">
              <div class="metric-label">退货数</div>
              <div class="metric-value">{{ formatNumber(data.returns) }}</div>
              <div class="metric-change negative">+5.2%</div>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon">
              <DollarSign :size="24" />
            </div>
            <div class="metric-content">
              <div class="metric-label">退货金额</div>
              <div class="metric-value">${{ formatNumber(data.returnAmount) }}</div>
              <div class="metric-change negative">+8.1%</div>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon">
              <Percent :size="24" />
            </div>
            <div class="metric-content">
              <div class="metric-label">退货数量比例</div>
              <div class="metric-value">{{ data.returnRate.toFixed(1) }}%</div>
              <div class="metric-change negative">+0.8%</div>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon">
              <TrendingDown :size="24" />
            </div>
            <div class="metric-content">
              <div class="metric-label">退货销售额占比</div>
              <div class="metric-value">{{ data.returnSalesRatio.toFixed(1) }}%</div>
              <div class="metric-change negative">+0.5%</div>
            </div>
          </div>
        </div>

        <!-- 退货趋势图表 -->
        <div class="chart-section">
          <h4>退货趋势分析</h4>
          <div class="return-analysis">
            <div class="analysis-item">
              <div class="analysis-label">退货率趋势</div>
              <div class="analysis-value declining">下降 0.3%</div>
              <div class="analysis-desc">相比上月有所改善</div>
            </div>
            <div class="analysis-item">
              <div class="analysis-label">主要退货原因</div>
              <div class="analysis-value">尺寸不合适</div>
              <div class="analysis-desc">占退货总数的 42%</div>
            </div>
            <div class="analysis-item">
              <div class="analysis-label">退货处理时间</div>
              <div class="analysis-value">2.3天</div>
              <div class="analysis-desc">平均退货处理周期</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 库存指标 -->
      <div v-if="activeTab === 'inventory'" class="tab-panel">
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-icon">
              <Package :size="24" />
            </div>
            <div class="metric-content">
              <div class="metric-label">每日售出库存单位数</div>
              <div class="metric-value">{{ formatNumber(data.dailySoldUnits) }}</div>
              <div class="metric-change positive">+12.3%</div>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon">
              <Calendar :size="24" />
            </div>
            <div class="metric-content">
              <div class="metric-label">剩余库存天数</div>
              <div class="metric-value">{{ data.remainingStockDays }}天</div>
              <div class="metric-change" :class="data.remainingStockDays < 30 ? 'negative' : 'positive'">
                {{ data.remainingStockDays < 30 ? '库存偏低' : '库存充足' }}
              </div>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon">
              <CheckCircle :size="24" />
            </div>
            <div class="metric-content">
              <div class="metric-label">有货天数</div>
              <div class="metric-value">{{ data.inStockDays }}天</div>
              <div class="metric-change positive">{{ ((data.inStockDays / 30) * 100).toFixed(1) }}%</div>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon">
              <XCircle :size="24" />
            </div>
            <div class="metric-content">
              <div class="metric-label">缺货天数</div>
              <div class="metric-value">{{ data.outOfStockDays }}天</div>
              <div class="metric-change" :class="data.outOfStockDays > 0 ? 'negative' : 'positive'">
                {{ ((data.outOfStockDays / 30) * 100).toFixed(1) }}%
              </div>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon">
              <Clock :size="24" />
            </div>
            <div class="metric-content">
              <div class="metric-label">在库天数</div>
              <div class="metric-value">{{ data.averageStockDays }}天</div>
              <div class="metric-change positive">-2.1天</div>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon">
              <TrendingUp :size="24" />
            </div>
            <div class="metric-content">
              <div class="metric-label">售罄率</div>
              <div class="metric-value">{{ data.sellThroughRate.toFixed(1) }}%</div>
              <div class="metric-change positive">+5.3%</div>
            </div>
          </div>
        </div>

        <!-- 库存状态分析 -->
        <div class="chart-section">
          <h4>库存状态分析</h4>
          <div class="inventory-analysis">
            <div class="status-item">
              <div class="status-indicator status-good"></div>
              <div class="status-content">
                <div class="status-label">库存充足</div>
                <div class="status-value">75% 产品</div>
              </div>
            </div>
            <div class="status-item">
              <div class="status-indicator status-warning"></div>
              <div class="status-content">
                <div class="status-label">库存偏低</div>
                <div class="status-value">20% 产品</div>
              </div>
            </div>
            <div class="status-item">
              <div class="status-indicator status-danger"></div>
              <div class="status-content">
                <div class="status-label">缺货</div>
                <div class="status-value">5% 产品</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 自定义维度模态框 -->
    <CustomDimensionModal
      :visible="showCustomDimension"
      :data="data"
      @close="showCustomDimension = false"
      @export="handleExportCustomData"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  DollarSign,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Package,
  Target,
  ShoppingCart,
  Percent,
  Eye,
  Users,
  ShoppingBag,
  User,
  RefreshCw,
  UserPlus,
  Check,
  Clock,
  LogOut,
  RotateCcw,
  Calendar,
  CheckCircle,
  XCircle,
  BarChart3,
  PieChart,
  Activity,
  ArrowLeft,
  Settings
} from 'lucide-vue-next'
import CustomDimensionModal from './CustomDimensionModal.vue'
import type { WebsiteData } from '@/types'

interface Props {
  data: WebsiteData
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

// 响应式数据
const activeTab = ref('results')
const showCustomDimension = ref(false)

// 标签页配置
const tabs = [
  { key: 'results', label: '结果指标', icon: BarChart3 },
  { key: 'orders', label: '订单指标', icon: ShoppingBag },
  { key: 'users', label: '用户指标', icon: Users },
  { key: 'funnel', label: '用户漏斗', icon: Activity },
  { key: 'returns', label: '退货指标', icon: ArrowLeft },
  { key: 'inventory', label: '库存指标', icon: Package }
]

// 方法
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(0) + 'K'
  }
  return num.toString()
}

const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

const handleExportCustomData = (data: any[]) => {
  console.log('导出自定义数据:', data)
  // 这里可以实现导出功能，比如生成Excel文件
  // 暂时用console.log模拟
  showCustomDimension.value = false
}
</script>

<style scoped>
.website-data-panel {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
}

.panel-header {
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border-light);
  background: var(--color-background);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-content h3 {
  margin: 0 0 var(--spacing-xs) 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.header-content p {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

.header-actions {
  display: flex;
  gap: var(--spacing-sm);
}

.custom-dimension-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all 0.2s;
}

.custom-dimension-btn:hover {
  background: var(--color-primary-dark);
  transform: translateY(-1px);
}

.tabs-nav {
  display: flex;
  background: var(--color-background-light);
  border-bottom: 1px solid var(--color-border-light);
  overflow-x: auto;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-md) var(--spacing-lg);
  background: none;
  border: none;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  border-bottom: 2px solid transparent;
}

.tab-btn:hover {
  background: var(--color-surface);
  color: var(--color-text-primary);
}

.tab-btn--active {
  background: var(--color-surface);
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}

.tab-content {
  padding: var(--spacing-lg);
}

.tab-panel {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.metric-card {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-lg);
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  transition: all 0.2s;
}

.metric-card:hover {
  border-color: var(--color-primary-light);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.metric-icon {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--color-primary-light);
  color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.metric-content {
  flex: 1;
}

.metric-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-xs);
}

.metric-value {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xs);
}

.metric-change {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.metric-change.positive {
  color: var(--color-success);
}

.metric-change.negative {
  color: var(--color-error);
}

.metric-detail {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
  margin-top: var(--spacing-xs);
}

.chart-section {
  margin-top: var(--spacing-xl);
  padding: var(--spacing-lg);
  background: var(--color-background);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--color-border);
}

.chart-section h4 {
  margin: 0 0 var(--spacing-lg) 0;
  font-size: var(--font-size-md);
  color: var(--color-text-primary);
}

.distribution-chart {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.chart-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.chart-bar {
  flex: 1;
  height: 40px;
  background: var(--color-border-light);
  border-radius: var(--border-radius-sm);
  position: relative;
  overflow: hidden;
}

.chart-fill {
  height: 100%;
  border-radius: var(--border-radius-sm);
  display: flex;
  align-items: center;
  padding: 0 var(--spacing-sm);
  color: white;
  font-weight: var(--font-weight-medium);
}

.chart-fill--returning {
  background: var(--color-primary);
}

.chart-fill--new {
  background: var(--color-success);
}

.chart-label {
  min-width: 100px;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.chart-value {
  min-width: 80px;
  text-align: right;
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.funnel-section h4 {
  margin: 0 0 var(--spacing-lg) 0;
  font-size: var(--font-size-md);
  color: var(--color-text-primary);
}

.funnel-chart {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-xl);
}

.funnel-step {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.funnel-bar {
  height: 50px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
  border-radius: var(--border-radius-sm);
  display: flex;
  align-items: center;
  padding: 0 var(--spacing-md);
  color: white;
  font-weight: var(--font-weight-medium);
  position: relative;
}

.funnel-content {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.funnel-rate {
  min-width: 60px;
  text-align: center;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
}

.conversion-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-lg);
}

.return-analysis,
.inventory-analysis {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-lg);
}

.analysis-item {
  padding: var(--spacing-md);
  background: var(--color-surface);
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--color-border);
}

.analysis-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-xs);
}

.analysis-value {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xs);
}

.analysis-value.declining {
  color: var(--color-success);
}

.analysis-desc {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
}

.status-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--color-surface);
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--color-border);
}

.status-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.status-indicator.status-good {
  background: var(--color-success);
}

.status-indicator.status-warning {
  background: var(--color-warning);
}

.status-indicator.status-danger {
  background: var(--color-error);
}

.status-content {
  flex: 1;
}

.status-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-xs);
}

.status-value {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .metrics-grid {
    grid-template-columns: 1fr;
  }

  .conversion-metrics,
  .return-analysis,
  .inventory-analysis {
    grid-template-columns: 1fr;
  }

  .tabs-nav {
    flex-wrap: wrap;
  }

  .tab-btn {
    flex: 1;
    min-width: 120px;
  }
}
</style>
