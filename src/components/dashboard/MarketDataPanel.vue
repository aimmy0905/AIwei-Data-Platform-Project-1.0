<template>
  <div class="market-data-panel">
    <div class="section-header">
      <h2 class="section-title">地区市场数据</h2>
      <p class="section-description">全球市场表现分析和地区销售数据对比</p>
    </div>

    <div class="panel-content">
      <!-- 全球概览统计 -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">
            <Globe />
          </div>
          <div class="stat-content">
            <h3>覆盖国家/地区</h3>
            <div class="stat-value">{{ stats.totalRegions }}</div>
            <div class="stat-change positive">+{{ stats.regionGrowth }}%</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <TrendingUp />
          </div>
          <div class="stat-content">
            <h3>全球总收入</h3>
            <div class="stat-value">${{ formatNumber(stats.totalRevenue) }}</div>
            <div class="stat-change positive">+{{ stats.revenueGrowth }}%</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <Users />
          </div>
          <div class="stat-content">
            <h3>全球用户</h3>
            <div class="stat-value">{{ formatNumber(stats.totalUsers) }}</div>
            <div class="stat-change positive">+{{ stats.userGrowth }}%</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <ShoppingCart />
          </div>
          <div class="stat-content">
            <h3>平均客单价</h3>
            <div class="stat-value">${{ stats.avgOrderValue }}</div>
            <div class="stat-change positive">+{{ stats.aovGrowth }}%</div>
          </div>
        </div>
      </div>

      <!-- 地区表现排行 -->
      <div class="ranking-section">
        <div class="section-header">
          <h3>地区表现排行</h3>
          <div class="view-toggle">
            <button
              v-for="view in viewOptions"
              :key="view.value"
              :class="['toggle-btn', { active: activeView === view.value }]"
              @click="activeView = view.value"
            >
              {{ view.label }}
            </button>
          </div>
        </div>

        <div class="ranking-table">
          <div class="table-header">
            <div class="rank-col">排名</div>
            <div class="region-col">国家/地区</div>
            <div class="revenue-col">收入</div>
            <div class="users-col">用户数</div>
            <div class="orders-col">订单数</div>
            <div class="aov-col">客单价</div>
            <div class="growth-col">增长率</div>
          </div>
          <div class="table-body">
            <div
              v-for="(region, index) in topRegions"
              :key="region.id"
              class="table-row"
            >
              <div class="rank-col">
                <span class="rank-badge" :class="getRankClass(index + 1)">{{ index + 1 }}</span>
              </div>
              <div class="region-col">
                <div class="region-info">
                  <img :src="region.flag" :alt="region.name" class="flag">
                  <div>
                    <div class="name">{{ region.name }}</div>
                    <div class="code">{{ region.code }}</div>
                  </div>
                </div>
              </div>
              <div class="revenue-col">${{ formatNumber(region.revenue) }}</div>
              <div class="users-col">{{ formatNumber(region.users) }}</div>
              <div class="orders-col">{{ formatNumber(region.orders) }}</div>
              <div class="aov-col">${{ region.avgOrderValue }}</div>
              <div class="growth-col">
                <span class="growth-value" :class="getGrowthClass(region.growth)">
                  {{ region.growth > 0 ? '+' : '' }}{{ region.growth }}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 地区分布图表 -->
      <div class="chart-section">
        <h3>收入地区分布</h3>
        <div class="chart-container">
          <div class="chart-wrapper">
            <PieChart :data="regionChartData" />
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

      <!-- 时间趋势分析 -->
      <div class="trend-section">
        <h3>地区收入趋势</h3>
        <div class="trend-chart">
          <LineChart :data="trendChartData" />
        </div>
      </div>

      <!-- 市场洞察 -->
      <div class="insights-section">
        <h3>市场洞察</h3>
        <div class="insights-grid">
          <div
            v-for="insight in marketInsights"
            :key="insight.id"
            class="insight-card"
          >
            <div class="insight-icon" :class="insight.type">
              <component :is="getInsightIcon(insight.type)" />
            </div>
            <div class="insight-content">
              <h4>{{ insight.title }}</h4>
              <p>{{ insight.description }}</p>
              <div class="insight-metrics">
                <span class="metric">{{ insight.metric }}</span>
                <span class="impact" :class="insight.impact">{{ insight.impactText }}</span>
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
  users: number
  orders: number
  avgOrderValue: number
  growth: number
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
    flag: '/flags/us.png',
    revenue: 1250000,
    users: 125000,
    orders: 15600,
    avgOrderValue: 95,
    growth: 12
  },
  {
    id: '2',
    name: '英国',
    code: 'UK',
    flag: '/flags/uk.png',
    revenue: 680000,
    users: 78000,
    orders: 9200,
    avgOrderValue: 87,
    growth: 18
  },
  {
    id: '3',
    name: '加拿大',
    code: 'CA',
    flag: '/flags/ca.png',
    revenue: 450000,
    users: 52000,
    orders: 6100,
    avgOrderValue: 92,
    growth: 15
  },
  {
    id: '4',
    name: '澳大利亚',
    code: 'AU',
    flag: '/flags/au.png',
    revenue: 380000,
    users: 45000,
    orders: 5200,
    avgOrderValue: 85,
    growth: 10
  },
  {
    id: '5',
    name: '德国',
    code: 'DE',
    flag: '/flags/de.png',
    revenue: 320000,
    users: 38000,
    orders: 4800,
    avgOrderValue: 78,
    growth: 8
  },
  {
    id: '6',
    name: '法国',
    code: 'FR',
    flag: '/flags/fr.png',
    revenue: 280000,
    users: 32000,
    orders: 4200,
    avgOrderValue: 82,
    growth: 6
  },
  {
    id: '7',
    name: '日本',
    code: 'JP',
    flag: '/flags/jp.png',
    revenue: 240000,
    users: 28000,
    orders: 3600,
    avgOrderValue: 88,
    growth: -2
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
  padding: 24px;
  background: var(--color-background);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section-header {
  margin-bottom: 24px;
}

.section-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--color-text);
  margin: 0 0 8px 0;
}

.section-description {
  color: var(--color-text-secondary);
  margin: 0;
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
  background: var(--color-background-soft);
  border-radius: 8px;
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 60px 1fr 120px 100px 100px 100px 100px;
  gap: 16px;
  padding: 16px;
  background: var(--color-background-mute);
  font-weight: 600;
  color: var(--color-text-secondary);
  font-size: 14px;
}

.table-row {
  display: grid;
  grid-template-columns: 60px 1fr 120px 100px 100px 100px 100px;
  gap: 16px;
  padding: 16px;
  border-top: 1px solid var(--color-border);
  align-items: center;
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
  gap: 12px;
}

.flag {
  width: 24px;
  height: 16px;
  border-radius: 2px;
  object-fit: cover;
}

.name {
  font-weight: 500;
  color: var(--color-text);
}

.code {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.growth-value.growth-excellent { color: var(--color-success); }
.growth-value.growth-good { color: var(--color-warning); }
.growth-value.growth-positive { color: var(--color-info); }
.growth-value.growth-negative { color: var(--color-danger); }

.chart-section {
  margin-bottom: 32px;
}

.chart-section h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text);
  margin: 0 0 16px 0;
}

.chart-container {
  display: flex;
  gap: 32px;
  align-items: center;
}

.chart-wrapper {
  flex: 1;
  max-width: 400px;
}

.chart-legend {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.legend-label {
  flex: 1;
  color: var(--color-text);
}

.legend-value {
  font-weight: 500;
  color: var(--color-text-secondary);
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

  .table-header,
  .table-row {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .chart-container {
    flex-direction: column;
  }

  .insights-grid {
    grid-template-columns: 1fr;
  }
}
</style>
