<template>
    <div class="market-data-panel">
    <div class="section-header">
      <h2 class="section-title">地区市场数据</h2>
      <p class="section-description">全球市场表现分析和地区销售数据对比</p>
    </div>

    <div class="panel-content">
      <!-- 地区表现排行 -->
      <div class="ranking-section">

        <div class="ranking-table">
          <div class="table-content">
            <div class="table-header">
              <div class="country-col">国家</div>
              <div class="revenue-col">销售额</div>
              <div class="revenue-ratio-col">销售额占比</div>
              <div class="visits-col">访问量</div>
              <div class="visits-ratio-col">访问量占比</div>
              <div class="new-users-col">新用户数</div>
              <div class="conversion-col">转化率</div>
              <div class="add-cart-col">加购数</div>
              <div class="add-cart-rate-col">加购率</div>
              <div class="checkout-col">发起结账数</div>
              <div class="checkout-rate-col">发起结账率</div>
              <div class="avg-duration-col">平均停留时长</div>
              <div class="avg-pages-col">平均访问页数</div>
              <div class="bounce-rate-col">跳出率</div>
            </div>
            <div class="table-body">
              <div
                v-for="(region, index) in topRegions"
                :key="region.id"
                class="table-row"
              >
                <div class="country-col">
                  <div class="region-info">
                    <img :src="region.flag" :alt="region.name" class="flag">
                    <span class="name">{{ region.name }}</span>
                  </div>
                </div>
                <div class="revenue-col">${{ formatNumber(region.revenue) }}</div>
                <div class="revenue-ratio-col">{{ region.revenueRatio }}%</div>
                <div class="visits-col">{{ formatNumber(region.visits) }}</div>
                <div class="visits-ratio-col">{{ region.visitsRatio }}%</div>
                <div class="new-users-col">{{ formatNumber(region.newUsers) }}</div>
                <div class="conversion-col">{{ region.conversionRate }}%</div>
                <div class="add-cart-col">{{ formatNumber(region.addToCart) }}</div>
                <div class="add-cart-rate-col">{{ region.addToCartRate }}%</div>
                <div class="checkout-col">{{ formatNumber(region.checkoutInitiated) }}</div>
                <div class="checkout-rate-col">{{ region.checkoutRate }}%</div>
                <div class="avg-duration-col">{{ region.avgDuration }}</div>
                <div class="avg-pages-col">{{ region.avgPages }}</div>
                <div class="bounce-rate-col">{{ region.bounceRate }}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 地区分布图表 -->
      <div class="charts-section">
        <div class="chart-section chart-section-1">
          <h3>销售额地区分布</h3>
          <div class="chart-container">
            <div class="chart-wrapper">
              <PieChart
                :data="regionChartData"
                height="300px"
                :show-legend="false"
                :donut="false"
              />
            </div>
            <div class="chart-legend">
              <div
                v-for="item in regionChartData"
                :key="item.name"
                class="legend-item"
              >
                <div class="legend-color" :style="{ backgroundColor: item.color }"></div>
                <span class="legend-label">{{ item.name }}</span>
                <span class="legend-value">${{ formatNumber(item.value) }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="chart-section chart-section-2">
          <h3>用户量地区分布</h3>
          <div class="chart-container">
            <div class="chart-wrapper">
              <PieChart
                :data="userChartData"
                height="300px"
                :show-legend="false"
                :donut="false"
              />
            </div>
            <div class="chart-legend">
              <div
                v-for="item in userChartData"
                :key="item.name"
                class="legend-item"
              >
                <div class="legend-color" :style="{ backgroundColor: item.color }"></div>
                <span class="legend-label">{{ item.name }}</span>
                <span class="legend-value">{{ formatNumber(item.value) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Globe, TrendingUp, Users, ShoppingCart, AlertTriangle, Target, Zap, Info } from 'lucide-vue-next'
import PieChart from '@/components/charts/PieChart.vue'
import LineChart from '@/components/charts/LineChart.vue'

// 定义数据类型
interface MarketStats {
  totalRegions: number
  regionGrowth: number
  totalRevenue: number
  revenueGrowth: number
  totalUsers: number
  userGrowth: number
  avgOrderValue: number
  aovGrowth: number
}

interface Region {
  id: string
  name: string
  code: string
  flag: string
  revenue: number
  revenueRatio: number
  visits: number
  visitsRatio: number
  newUsers: number
  conversionRate: number
  addToCart: number
  addToCartRate: number
  checkoutInitiated: number
  checkoutRate: number
  avgDuration: string
  avgPages: number
  bounceRate: number
}

interface MarketInsight {
  id: string
  type: 'opportunity' | 'warning' | 'growth' | 'info'
  title: string
  description: string
  metric: string
  impact: 'positive' | 'negative' | 'neutral'
  impactText: string
}

interface ChartData {
  name: string
  value: number
  color: string
}

// 响应式数据
const activeView = ref('revenue')
const stats = ref<MarketStats>({
  totalRegions: 45,
  regionGrowth: 8,
  totalRevenue: 3250000,
  revenueGrowth: 15,
  totalUsers: 485000,
  userGrowth: 12,
  avgOrderValue: 89,
  aovGrowth: 5
})

const viewOptions = [
  { value: 'revenue', label: '按收入' },
  { value: 'users', label: '按用户' },
  { value: 'growth', label: '按增长' }
]

const topRegions = ref<Region[]>([
  {
    id: '1',
    name: '美国',
    code: 'US',
    flag: 'https://flagcdn.com/w20/us.png',
    revenue: 1250000,
    revenueRatio: 45.2,
    visits: 125000,
    visitsRatio: 42.8,
    newUsers: 85000,
    conversionRate: 3.2,
    addToCart: 12800,
    addToCartRate: 10.2,
    checkoutInitiated: 8500,
    checkoutRate: 6.8,
    avgDuration: '2m 35s',
    avgPages: 4.2,
    bounceRate: 35.8
  },
  {
    id: '2',
    name: '英国',
    code: 'UK',
    flag: 'https://flagcdn.com/w20/gb.png',
    revenue: 680000,
    revenueRatio: 23.6,
    visits: 78000,
    visitsRatio: 26.7,
    newUsers: 52000,
    conversionRate: 2.8,
    addToCart: 7200,
    addToCartRate: 9.2,
    checkoutInitiated: 4800,
    checkoutRate: 6.2,
    avgDuration: '2m 18s',
    avgPages: 3.8,
    bounceRate: 42.1
  },
  {
    id: '3',
    name: '加拿大',
    code: 'CA',
    flag: 'https://flagcdn.com/w20/ca.png',
    revenue: 450000,
    revenueRatio: 18.1,
    visits: 65000,
    visitsRatio: 22.3,
    newUsers: 41000,
    conversionRate: 2.5,
    addToCart: 5850,
    addToCartRate: 9.0,
    checkoutInitiated: 3900,
    checkoutRate: 6.0,
    avgDuration: '2m 12s',
    avgPages: 3.5,
    bounceRate: 38.9
  },
  {
    id: '4',
    name: '澳大利亚',
    code: 'AU',
    flag: 'https://flagcdn.com/w20/au.png',
    revenue: 380000,
    revenueRatio: 13.2,
    visits: 45000,
    visitsRatio: 15.4,
    newUsers: 28000,
    conversionRate: 2.9,
    addToCart: 4050,
    addToCartRate: 9.0,
    checkoutInitiated: 2700,
    checkoutRate: 6.0,
    avgDuration: '2m 28s',
    avgPages: 4.0,
    bounceRate: 33.7
  },
  {
    id: '5',
    name: '德国',
    code: 'DE',
    flag: 'https://flagcdn.com/w20/de.png',
    revenue: 320000,
    revenueRatio: 10.1,
    visits: 38000,
    visitsRatio: 13.0,
    newUsers: 22000,
    conversionRate: 2.2,
    addToCart: 3040,
    addToCartRate: 8.0,
    checkoutInitiated: 1900,
    checkoutRate: 5.0,
    avgDuration: '1m 58s',
    avgPages: 3.2,
    bounceRate: 45.3
  },
  {
    id: '6',
    name: '法国',
    code: 'FR',
    flag: 'https://flagcdn.com/w20/fr.png',
    revenue: 280000,
    revenueRatio: 8.5,
    visits: 32000,
    visitsRatio: 11.0,
    newUsers: 19000,
    conversionRate: 2.1,
    addToCart: 2560,
    addToCartRate: 8.0,
    checkoutInitiated: 1600,
    checkoutRate: 5.0,
    avgDuration: '1m 52s',
    avgPages: 3.0,
    bounceRate: 48.2
  },
  {
    id: '7',
    name: '日本',
    code: 'JP',
    flag: 'https://flagcdn.com/w20/jp.png',
    revenue: 240000,
    revenueRatio: 7.3,
    visits: 28000,
    visitsRatio: 9.6,
    newUsers: 16000,
    conversionRate: 1.9,
    addToCart: 2240,
    addToCartRate: 8.0,
    checkoutInitiated: 1400,
    checkoutRate: 5.0,
    avgDuration: '1m 45s',
    avgPages: 2.8,
    bounceRate: 52.1
  }
])

const marketInsights = ref<MarketInsight[]>([
  {
    id: '1',
    type: 'opportunity',
    title: '新兴市场机会',
    description: '东南亚市场显示出强劲增长潜力，建议加大投入',
    metric: '增长率 +25%',
    impact: 'positive',
    impactText: '高潜力'
  },
  {
    id: '2',
    type: 'warning',
    title: '欧洲市场放缓',
    description: '欧洲部分地区增长放缓，需要调整营销策略',
    metric: '增长率 +3%',
    impact: 'negative',
    impactText: '需关注'
  },
  {
    id: '3',
    type: 'growth',
    title: '北美表现强劲',
    description: '北美市场持续增长，客单价稳步提升',
    metric: '收入占比 42%',
    impact: 'positive',
    impactText: '表现优异'
  },
  {
    id: '4',
    type: 'info',
    title: '季节性趋势',
    description: '节假日期间各地区表现差异明显，需要本地化策略',
    metric: '峰值差异 35%',
    impact: 'neutral',
    impactText: '需优化'
  }
])

// 计算属性
const regionChartData = computed<ChartData[]>(() => {
  const colors = ['#1890ff', '#52c41a', '#fa8c16', '#722ed1', '#eb2f96', '#13c2c2', '#faad14']
  return topRegions.value.slice(0, 7).map((region, index) => ({
    name: region.name,
    value: region.revenue,
    color: colors[index]
  }))
})

const userChartData = computed<ChartData[]>(() => {
  const colors = ['#1890ff', '#52c41a', '#fa8c16', '#722ed1', '#eb2f96', '#13c2c2', '#faad14']
  return topRegions.value.slice(0, 7).map((region, index) => ({
    name: region.name,
    value: region.visits,
    color: colors[index]
  }))
})

const trendChartData = computed(() => {
  const months = ['1月', '2月', '3月', '4月', '5月', '6月']
  const regions = ['美国', '英国', '加拿大', '澳大利亚']
  const colors = ['#1890ff', '#52c41a', '#fa8c16', '#722ed1']

  return {
    labels: months,
    datasets: regions.map((region, index) => ({
      label: region,
      data: Array.from({ length: 6 }, () => Math.floor(Math.random() * 100000) + 50000),
      color: colors[index]
    }))
  }
})

// 工具函数
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(0) + 'K'
  }
  return num.toString()
}

const getRankClass = (rank: number): string => {
  if (rank === 1) return 'rank-first'
  if (rank === 2) return 'rank-second'
  if (rank === 3) return 'rank-third'
  return 'rank-default'
}

const getGrowthClass = (growth: number): string => {
  if (growth > 10) return 'growth-excellent'
  if (growth > 5) return 'growth-good'
  if (growth > 0) return 'growth-positive'
  return 'growth-negative'
}

const getInsightIcon = (type: string) => {
  const iconMap = {
    opportunity: Target,
    warning: AlertTriangle,
    growth: TrendingUp,
    info: Info
  }
  return iconMap[type as keyof typeof iconMap] || Info
}

onMounted(() => {
  console.log('地区市场数据面板已加载')
})
</script>

<style scoped>
.market-data-panel {
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
  padding: 24px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

.stat-card {
  background: var(--color-background-soft);
  border-radius: 8px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background: var(--color-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-content h3 {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin: 0 0 8px 0;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 4px;
}

.stat-change {
  font-size: 12px;
  font-weight: 500;
}

.stat-change.positive {
  color: var(--color-success);
}

.ranking-section {
  margin-bottom: 32px;
}

.ranking-section .section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.ranking-section h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
}

.view-toggle {
  display: flex;
  gap: 8px;
}

.toggle-btn {
  padding: 6px 12px;
  border: 1px solid var(--color-border);
  background: var(--color-background);
  color: var(--color-text-secondary);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.toggle-btn.active {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
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
  grid-template-columns: 120px 100px 80px 100px 80px 100px 80px 100px 80px 100px 80px 120px 80px 80px;
  gap: 8px;
  padding: 16px 12px;
  background: #f8fafc;
  font-weight: 600;
  color: #64748b;
  font-size: 12px;
  border-bottom: 1px solid #e2e8f0;
}

.table-row {
  display: grid;
  grid-template-columns: 120px 100px 80px 100px 80px 100px 80px 100px 80px 100px 80px 120px 80px 80px;
  gap: 8px;
  padding: 16px 12px;
  border-bottom: 1px solid #f1f5f9;
  align-items: center;
  font-size: 12px;
  transition: background-color 0.2s;
}

.table-row:hover {
  background-color: #f8fafc;
}

.table-row:last-child {
  border-bottom: none;
}

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
.rank-default { background: var(--color-text-secondary); }

.region-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.flag {
  width: 20px;
  height: 14px;
  border-radius: 2px;
  object-fit: cover;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.name {
  font-weight: 500;
  color: var(--color-text);
  font-size: 12px;
}

.country-col {
  min-width: 0;
}

.revenue-col,
.revenue-ratio-col,
.visits-col,
.visits-ratio-col,
.new-users-col,
.conversion-col,
.add-cart-col,
.add-cart-rate-col,
.checkout-col,
.checkout-rate-col,
.avg-duration-col,
.avg-pages-col,
.bounce-rate-col {
  text-align: right;
  font-weight: 500;
}

.growth-value.growth-excellent { color: var(--color-success); }
.growth-value.growth-good { color: var(--color-warning); }
.growth-value.growth-positive { color: var(--color-info); }
.growth-value.growth-negative { color: var(--color-danger); }

.charts-section {
  display: grid !important;
  grid-template-columns: 1fr 1fr !important;
  gap: 24px;
  margin-bottom: 32px;
}

@media (max-width: 1024px) {
  .charts-section {
    grid-template-columns: 1fr !important;
    gap: 20px;
  }
}

.chart-section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  min-height: 400px;
  display: flex !important;
  flex-direction: column;
  visibility: visible !important;
  opacity: 1 !important;
}

.chart-section-1 {
  background: #f0f9ff !important;
  border: 2px solid #3b82f6 !important;
}

.chart-section-2 {
  background: #f0fdf4 !important;
  border: 2px solid #10b981 !important;
}

.chart-section h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text);
  margin: 0 0 16px 0;
  text-align: center;
}

.chart-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  flex: 1;
}

.chart-wrapper {
  width: 100%;
  max-width: 320px;
  height: 300px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: var(--color-text-secondary);
  font-size: 14px;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--color-background-soft);
  border-top: 3px solid var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.chart-legend {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  max-width: 320px;
  margin-top: 8px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.legend-item:hover {
  background-color: var(--color-background-soft);
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.legend-label {
  flex: 1;
  color: var(--color-text);
  font-size: 14px;
  font-weight: 500;
}

.legend-value {
  font-weight: 600;
  color: var(--color-text-secondary);
  font-size: 13px;
}

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
  overflow: hidden;
  position: relative;
}

.insights-section {
  margin-top: 40px;
  clear: both;
}

.insights-section h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text);
  margin: 0 0 16px 0;
}

.insights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.insight-card {
  background: var(--color-background-soft);
  border-radius: 8px;
  padding: 20px;
  display: flex;
  gap: 16px;
}

.insight-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: white;
}

.insight-icon.opportunity { background: var(--color-success); }
.insight-icon.warning { background: var(--color-warning); }
.insight-icon.growth { background: var(--color-primary); }
.insight-icon.info { background: var(--color-info); }

.insight-content h4 {
  font-size: 16px;
  font-weight: 500;
  color: var(--color-text);
  margin: 0 0 8px 0;
}

.insight-content p {
  color: var(--color-text-secondary);
  margin: 0 0 12px 0;
  line-height: 1.5;
}

.insight-metrics {
  display: flex;
  gap: 12px;
  align-items: center;
}

.metric {
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text);
}

.impact {
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 500;
}

.impact.positive {
  background: var(--color-success-light);
  color: var(--color-success);
}

.impact.negative {
  background: var(--color-danger-light);
  color: var(--color-danger);
}

.impact.neutral {
  background: var(--color-info-light);
  color: var(--color-info);
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .ranking-table {
    overflow-x: auto;
  }

  .table-header,
  .table-row {
    min-width: 1200px;
  }

  .chart-container {
    flex-direction: column;
  }

  .insights-grid {
    grid-template-columns: 1fr;
  }
}
</style>
