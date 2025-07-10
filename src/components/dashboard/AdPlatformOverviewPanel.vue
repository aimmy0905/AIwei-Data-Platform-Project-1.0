<template>
  <div class="ad-platform-overview-panel">
    <div class="section-header">
      <h2 class="section-title">广告数据总览</h2>
      <p class="section-description">全平台广告数据汇总和表现分析</p>
    </div>

    <div class="panel-content">
      <!-- 广告概览统计 -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">
            <DollarSign />
          </div>
          <div class="stat-content">
            <h3>总广告支出</h3>
            <div class="stat-value">${{ formatNumber(stats.totalSpend) }}</div>
            <div class="stat-change positive">+{{ stats.spendGrowth }}%</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <TrendingUp />
          </div>
          <div class="stat-content">
            <h3>总收入</h3>
            <div class="stat-value">${{ formatNumber(stats.totalRevenue) }}</div>
            <div class="stat-change positive">+{{ stats.revenueGrowth }}%</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <Target />
          </div>
          <div class="stat-content">
            <h3>平均 ROAS</h3>
            <div class="stat-value">{{ stats.averageROAS }}x</div>
            <div class="stat-change positive">+{{ stats.roasGrowth }}%</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <MousePointer />
          </div>
          <div class="stat-content">
            <h3>平均 CPC</h3>
            <div class="stat-value">${{ stats.averageCPC }}</div>
            <div class="stat-change negative">+{{ stats.cpcChange }}%</div>
          </div>
        </div>
      </div>

      <!-- 平台表现对比 -->
      <div class="platform-comparison">
        <h3>平台表现对比</h3>
        <div class="platform-grid">
          <div
            v-for="platform in adPlatforms"
            :key="platform.id"
            class="platform-card"
          >
            <div class="platform-header">
              <div class="platform-info">
                <img :src="platform.logo" :alt="platform.name" class="platform-logo">
                <div>
                  <h4>{{ platform.name }}</h4>
                  <span class="platform-status" :class="platform.status">{{ getStatusText(platform.status) }}</span>
                </div>
              </div>
              <div class="platform-roas" :class="getROASClass(platform.roas)">
                {{ platform.roas }}x
              </div>
            </div>

            <div class="platform-metrics">
              <div class="metric-row">
                <span class="metric-label">支出:</span>
                <span class="metric-value">${{ formatNumber(platform.spend) }}</span>
              </div>
              <div class="metric-row">
                <span class="metric-label">收入:</span>
                <span class="metric-value">${{ formatNumber(platform.revenue) }}</span>
              </div>
              <div class="metric-row">
                <span class="metric-label">点击数:</span>
                <span class="metric-value">{{ formatNumber(platform.clicks) }}</span>
              </div>
              <div class="metric-row">
                <span class="metric-label">转化数:</span>
                <span class="metric-value">{{ formatNumber(platform.conversions) }}</span>
              </div>
            </div>

            <div class="platform-chart">
              <div class="chart-header">
                <span>本月趋势</span>
                <span class="trend-indicator" :class="getTrendClass(platform.trend)">
                  {{ platform.trend > 0 ? '+' : '' }}{{ platform.trend }}%
                </span>
              </div>
              <div class="mini-chart">
                <div
                  v-for="(value, index) in platform.trendData"
                  :key="index"
                  class="chart-bar"
                  :style="{ height: (value / Math.max(...platform.trendData)) * 100 + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 广告表现趋势 -->
      <div class="trend-section">
        <h3>广告表现趋势</h3>
        <div class="trend-controls">
          <div class="metric-selector">
            <button
              v-for="metric in trendMetrics"
              :key="metric.value"
              :class="['metric-btn', { active: activeTrendMetric === metric.value }]"
              @click="activeTrendMetric = metric.value"
            >
              {{ metric.label }}
            </button>
          </div>
          <div class="period-selector">
            <select v-model="selectedPeriod" class="period-select">
              <option value="7d">最近7天</option>
              <option value="30d">最近30天</option>
              <option value="90d">最近90天</option>
            </select>
          </div>
        </div>
        <div class="trend-chart">
          <LineChart :data="trendChartData" />
        </div>
      </div>

      <!-- 广告活动排行 -->
      <div class="campaign-ranking">
        <h3>广告活动排行</h3>
        <div class="ranking-table">
          <div class="table-header">
            <div class="rank-col">排名</div>
            <div class="campaign-col">活动名称</div>
            <div class="platform-col">平台</div>
            <div class="spend-col">支出</div>
            <div class="revenue-col">收入</div>
            <div class="roas-col">ROAS</div>
            <div class="status-col">状态</div>
          </div>
          <div class="table-body">
            <div
              v-for="(campaign, index) in topCampaigns"
              :key="campaign.id"
              class="table-row"
            >
              <div class="rank-col">
                <span class="rank-badge" :class="getRankClass(index + 1)">{{ index + 1 }}</span>
              </div>
              <div class="campaign-col">
                <div class="campaign-info">
                  <div class="campaign-name">{{ campaign.name }}</div>
                  <div class="campaign-type">{{ campaign.type }}</div>
                </div>
              </div>
              <div class="platform-col">
                <span class="platform-badge" :class="campaign.platform.toLowerCase()">{{ campaign.platform }}</span>
              </div>
              <div class="spend-col">${{ formatNumber(campaign.spend) }}</div>
              <div class="revenue-col">${{ formatNumber(campaign.revenue) }}</div>
              <div class="roas-col">
                <span class="roas-value" :class="getROASClass(campaign.roas)">{{ campaign.roas }}x</span>
              </div>
              <div class="status-col">
                <span class="status-badge" :class="campaign.status">{{ getStatusText(campaign.status) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 广告洞察 -->
      <div class="insights-section">
        <h3>广告洞察</h3>
        <div class="insights-grid">
          <div
            v-for="insight in adInsights"
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
            <div class="insight-actions">
              <button class="action-btn primary">查看详情</button>
              <button class="action-btn secondary">优化建议</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { DollarSign, TrendingUp, Target, MousePointer, AlertTriangle, Zap, Info, CheckCircle } from 'lucide-vue-next'
import LineChart from '@/components/charts/LineChart.vue'

// 定义数据类型
interface AdStats {
  totalSpend: number
  spendGrowth: number
  totalRevenue: number
  revenueGrowth: number
  averageROAS: number
  roasGrowth: number
  averageCPC: number
  cpcChange: number
}

interface AdPlatform {
  id: string
  name: string
  logo: string
  spend: number
  revenue: number
  roas: number
  clicks: number
  conversions: number
  status: 'active' | 'paused' | 'warning'
  trend: number
  trendData: number[]
}

interface Campaign {
  id: string
  name: string
  type: string
  platform: string
  spend: number
  revenue: number
  roas: number
  status: 'active' | 'paused' | 'completed'
}

interface AdInsight {
  id: string
  type: 'opportunity' | 'warning' | 'success' | 'info'
  title: string
  description: string
  metric: string
  impact: 'positive' | 'negative' | 'neutral'
  impactText: string
}

// 响应式数据
const activeTrendMetric = ref('roas')
const selectedPeriod = ref('30d')

const stats = ref<AdStats>({
  totalSpend: 125000,
  spendGrowth: 8,
  totalRevenue: 485000,
  revenueGrowth: 15,
  averageROAS: 3.88,
  roasGrowth: 6,
  averageCPC: 1.25,
  cpcChange: 3
})

const trendMetrics = [
  { value: 'roas', label: 'ROAS' },
  { value: 'spend', label: '支出' },
  { value: 'revenue', label: '收入' },
  { value: 'cpc', label: 'CPC' }
]

const adPlatforms = ref<AdPlatform[]>([
  {
    id: '1',
    name: 'Meta Ads',
    logo: '/logos/meta.png',
    spend: 45000,
    revenue: 185000,
    roas: 4.11,
    clicks: 125000,
    conversions: 2850,
    status: 'active',
    trend: 12,
    trendData: [80, 95, 88, 92, 105, 98, 110]
  },
  {
    id: '2',
    name: 'Google Ads',
    logo: '/logos/google.png',
    spend: 38000,
    revenue: 142000,
    roas: 3.74,
    clicks: 98000,
    conversions: 2150,
    status: 'active',
    trend: 8,
    trendData: [75, 82, 78, 85, 88, 92, 95]
  },
  {
    id: '3',
    name: 'Bing Ads',
    logo: '/logos/bing.png',
    spend: 28000,
    revenue: 95000,
    roas: 3.39,
    clicks: 65000,
    conversions: 1420,
    status: 'warning',
    trend: -3,
    trendData: [85, 78, 82, 75, 73, 70, 68]
  },
  {
    id: '4',
    name: 'Criteo',
    logo: '/logos/criteo.png',
    spend: 14000,
    revenue: 63000,
    roas: 4.5,
    clicks: 42000,
    conversions: 980,
    status: 'active',
    trend: 18,
    trendData: [60, 65, 72, 78, 85, 88, 92]
  }
])

const topCampaigns = ref<Campaign[]>([
  {
    id: '1',
    name: '夏季护肤品推广',
    type: '转化活动',
    platform: 'Meta',
    spend: 15000,
    revenue: 68000,
    roas: 4.53,
    status: 'active'
  },
  {
    id: '2',
    name: '品牌认知度提升',
    type: '品牌活动',
    platform: 'Google',
    spend: 12000,
    revenue: 52000,
    roas: 4.33,
    status: 'active'
  },
  {
    id: '3',
    name: '重定向活动',
    type: '重定向',
    platform: 'Criteo',
    spend: 8000,
    revenue: 35000,
    roas: 4.38,
    status: 'active'
  },
  {
    id: '4',
    name: '搜索广告优化',
    type: '搜索活动',
    platform: 'Google',
    spend: 10000,
    revenue: 38000,
    roas: 3.8,
    status: 'active'
  },
  {
    id: '5',
    name: '视频广告测试',
    type: '视频活动',
    platform: 'Meta',
    spend: 9000,
    revenue: 32000,
    roas: 3.56,
    status: 'paused'
  }
])

const adInsights = ref<AdInsight[]>([
  {
    id: '1',
    type: 'opportunity',
    title: 'Criteo 表现优异',
    description: 'Criteo 平台的 ROAS 达到 4.5x，建议增加投入',
    metric: 'ROAS: 4.5x',
    impact: 'positive',
    impactText: '高潜力'
  },
  {
    id: '2',
    type: 'warning',
    title: 'Bing Ads 表现下滑',
    description: 'Bing Ads 平台的表现连续3周下滑，需要优化策略',
    metric: '下滑: -3%',
    impact: 'negative',
    impactText: '需关注'
  },
  {
    id: '3',
    type: 'success',
    title: 'Meta Ads 增长强劲',
    description: 'Meta Ads 平台本月增长 12%，转化率稳步提升',
    metric: '增长: +12%',
    impact: 'positive',
    impactText: '表现优异'
  },
  {
    id: '4',
    type: 'info',
    title: 'CPC 成本上升',
    description: '整体 CPC 成本上升 3%，建议优化关键词策略',
    metric: 'CPC: $1.25',
    impact: 'neutral',
    impactText: '需优化'
  }
])

// 计算属性
const trendChartData = computed(() => {
  const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  const platforms = ['Meta', 'Google', 'Bing', 'Criteo']
  const colors = ['#1877f2', '#4285f4', '#00809d', '#ff6900']

  return {
    labels: days,
    datasets: platforms.map((platform, index) => ({
      label: platform,
      data: Array.from({ length: 7 }, () => Math.floor(Math.random() * 50) + 50),
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

const getStatusText = (status: string): string => {
  const statusMap = {
    active: '活跃',
    paused: '暂停',
    warning: '警告',
    completed: '完成'
  }
  return statusMap[status as keyof typeof statusMap] || status
}

const getROASClass = (roas: number): string => {
  if (roas >= 4) return 'roas-excellent'
  if (roas >= 3) return 'roas-good'
  if (roas >= 2) return 'roas-fair'
  return 'roas-poor'
}

const getTrendClass = (trend: number): string => {
  if (trend > 0) return 'trend-positive'
  if (trend < 0) return 'trend-negative'
  return 'trend-neutral'
}

const getRankClass = (rank: number): string => {
  if (rank === 1) return 'rank-first'
  if (rank === 2) return 'rank-second'
  if (rank === 3) return 'rank-third'
  return 'rank-default'
}

const getInsightIcon = (type: string) => {
  const iconMap = {
    opportunity: Target,
    warning: AlertTriangle,
    success: CheckCircle,
    info: Info
  }
  return iconMap[type as keyof typeof iconMap] || Info
}

onMounted(() => {
  console.log('广告数据总览面板已加载')
})
</script>

<style scoped>
.ad-platform-overview-panel {
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

.stat-change.negative {
  color: var(--color-danger);
}

.platform-comparison {
  margin-bottom: 32px;
}

.platform-comparison h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text);
  margin: 0 0 16px 0;
}

.platform-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.platform-card {
  background: var(--color-background-soft);
  border-radius: 8px;
  padding: 20px;
}

.platform-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.platform-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.platform-logo {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  object-fit: cover;
}

.platform-info h4 {
  font-size: 16px;
  font-weight: 500;
  color: var(--color-text);
  margin: 0 0 4px 0;
}

.platform-status {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  color: white;
}

.platform-status.active { background: var(--color-success); }
.platform-status.paused { background: var(--color-warning); }
.platform-status.warning { background: var(--color-danger); }

.platform-roas {
  font-size: 18px;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 6px;
  color: white;
}

.platform-roas.roas-excellent { background: var(--color-success); }
.platform-roas.roas-good { background: var(--color-warning); }
.platform-roas.roas-fair { background: var(--color-info); }
.platform-roas.roas-poor { background: var(--color-danger); }

.platform-metrics {
  margin-bottom: 16px;
}

.metric-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.metric-label {
  font-size: 14px;
  color: var(--color-text-secondary);
}

.metric-value {
  font-weight: 500;
  color: var(--color-text);
}

.platform-chart {
  border-top: 1px solid var(--color-border);
  padding-top: 16px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.chart-header span {
  font-size: 14px;
  color: var(--color-text-secondary);
}

.trend-indicator {
  font-size: 12px;
  font-weight: 500;
  padding: 2px 6px;
  border-radius: 4px;
}

.trend-indicator.trend-positive {
  background: var(--color-success-light);
  color: var(--color-success);
}

.trend-indicator.trend-negative {
  background: var(--color-danger-light);
  color: var(--color-danger);
}

.mini-chart {
  display: flex;
  align-items: end;
  gap: 2px;
  height: 40px;
}

.chart-bar {
  flex: 1;
  background: var(--color-primary);
  border-radius: 2px;
  min-height: 4px;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.chart-bar:hover {
  opacity: 1;
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

.trend-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.metric-selector {
  display: flex;
  gap: 8px;
}

.metric-btn {
  padding: 6px 12px;
  border: 1px solid var(--color-border);
  background: var(--color-background);
  color: var(--color-text-secondary);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.metric-btn.active {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.period-select {
  padding: 6px 12px;
  border: 1px solid var(--color-border);
  background: var(--color-background);
  color: var(--color-text);
  border-radius: 4px;
  cursor: pointer;
}

.trend-chart {
  background: var(--color-background-soft);
  border-radius: 8px;
  padding: 16px;
  height: 300px;
}

.campaign-ranking {
  margin-bottom: 32px;
}

.campaign-ranking h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text);
  margin: 0 0 16px 0;
}

.ranking-table {
  background: var(--color-background-soft);
  border-radius: 8px;
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 60px 1fr 100px 100px 100px 80px 80px;
  gap: 16px;
  padding: 16px;
  background: var(--color-background-mute);
  font-weight: 600;
  color: var(--color-text-secondary);
  font-size: 14px;
}

.table-row {
  display: grid;
  grid-template-columns: 60px 1fr 100px 100px 100px 80px 80px;
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

.campaign-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.campaign-name {
  font-weight: 500;
  color: var(--color-text);
}

.campaign-type {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.platform-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  color: white;
}

.platform-badge.meta { background: #1877f2; }
.platform-badge.google { background: #4285f4; }
.platform-badge.bing { background: #00809d; }
.platform-badge.criteo { background: #ff6900; }

.roas-value.roas-excellent { color: var(--color-success); }
.roas-value.roas-good { color: var(--color-warning); }
.roas-value.roas-fair { color: var(--color-info); }
.roas-value.roas-poor { color: var(--color-danger); }

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  color: white;
}

.status-badge.active { background: var(--color-success); }
.status-badge.paused { background: var(--color-warning); }
.status-badge.completed { background: var(--color-info); }

.insights-section h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text);
  margin: 0 0 16px 0;
}

.insights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
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
.insight-icon.success { background: var(--color-primary); }
.insight-icon.info { background: var(--color-info); }

.insight-content {
  flex: 1;
}

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

.insight-actions {
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

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .platform-grid {
    grid-template-columns: 1fr;
  }

  .trend-controls {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }

  .table-header,
  .table-row {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .insights-grid {
    grid-template-columns: 1fr;
  }

  .insight-card {
    flex-direction: column;
  }

  .insight-actions {
    flex-direction: row;
    align-items: center;
  }
}
</style>
