<template>
  <div class="competitor-panel">
    <div class="section-header">
      <h2 class="section-title">竞品分析</h2>
      <p class="section-description">竞争对手数据分析和市场份额对比</p>
    </div>

    <div class="panel-content">
      <!-- 竞品概览统计 -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">
            <Target />
          </div>
          <div class="stat-content">
            <h3>监控竞品</h3>
            <div class="stat-value">{{ stats.totalCompetitors }}</div>
            <div class="stat-change positive">+{{ stats.competitorGrowth }}%</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <TrendingUp />
          </div>
          <div class="stat-content">
            <h3>市场份额</h3>
            <div class="stat-value">{{ stats.marketShare }}%</div>
            <div class="stat-change positive">+{{ stats.shareGrowth }}%</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <Crown />
          </div>
          <div class="stat-content">
            <h3>排名位置</h3>
            <div class="stat-value">#{{ stats.ranking }}</div>
            <div class="stat-change positive">+{{ stats.rankingChange }}</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <Zap />
          </div>
          <div class="stat-content">
            <h3>竞争强度</h3>
            <div class="stat-value">{{ stats.competitionIntensity }}</div>
            <div class="stat-change negative">+{{ stats.intensityChange }}%</div>
          </div>
        </div>
      </div>

      <!-- 竞品排行榜 -->
      <div class="ranking-section">
        <div class="section-header">
          <h3>竞品表现排行</h3>
          <div class="view-toggle">
            <button
              v-for="metric in rankingMetrics"
              :key="metric.value"
              :class="['toggle-btn', { active: activeRankingMetric === metric.value }]"
              @click="activeRankingMetric = metric.value"
            >
              {{ metric.label }}
            </button>
          </div>
        </div>

        <div class="ranking-table">
          <div class="table-header">
            <div class="rank-col">排名</div>
            <div class="brand-col">品牌</div>
            <div class="revenue-col">预估收入</div>
            <div class="traffic-col">流量</div>
            <div class="share-col">市场份额</div>
            <div class="growth-col">增长率</div>
            <div class="threat-col">威胁等级</div>
          </div>
          <div class="table-body">
            <div
              v-for="(competitor, index) in competitors"
              :key="competitor.id"
              class="table-row"
              :class="{ 'current-brand': competitor.isCurrentBrand }"
            >
              <div class="rank-col">
                <span class="rank-badge" :class="getRankClass(index + 1)">{{ index + 1 }}</span>
              </div>
              <div class="brand-col">
                <div class="brand-info">
                  <img :src="competitor.logo" :alt="competitor.name" class="brand-logo">
                  <div>
                    <div class="brand-name">{{ competitor.name }}</div>
                    <div class="brand-category">{{ competitor.category }}</div>
                  </div>
                  <div v-if="competitor.isCurrentBrand" class="current-badge">当前</div>
                </div>
              </div>
              <div class="revenue-col">${{ formatNumber(competitor.estimatedRevenue) }}</div>
              <div class="traffic-col">{{ formatNumber(competitor.monthlyTraffic) }}</div>
              <div class="share-col">{{ competitor.marketShare }}%</div>
              <div class="growth-col">
                <span class="growth-value" :class="getGrowthClass(competitor.growth)">
                  {{ competitor.growth > 0 ? '+' : '' }}{{ competitor.growth }}%
                </span>
              </div>
              <div class="threat-col">
                <span class="threat-level" :class="getThreatClass(competitor.threatLevel)">
                  {{ getThreatText(competitor.threatLevel) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 市场份额分布 -->
      <div class="market-share-section">
        <h3>市场份额分布</h3>
        <div class="chart-container">
          <div class="chart-wrapper">
            <PieChart :data="marketShareData" />
          </div>
          <div class="share-legend">
            <div
              v-for="item in marketShareData"
              :key="item.name"
              class="legend-item"
            >
              <div class="legend-color" :style="{ backgroundColor: item.color }"></div>
              <span class="legend-label">{{ item.name }}</span>
              <span class="legend-value">{{ item.value }}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 竞品表现趋势 -->
      <div class="trend-section">
        <h3>竞品表现趋势</h3>
        <div class="trend-chart">
          <LineChart :data="competitorTrendData" />
        </div>
      </div>

      <!-- 竞品详细对比 -->
      <div class="comparison-section">
        <h3>详细对比分析</h3>
        <div class="comparison-grid">
          <div
            v-for="comparison in detailedComparisons"
            :key="comparison.id"
            class="comparison-card"
          >
            <div class="comparison-header">
              <h4>{{ comparison.title }}</h4>
              <span class="comparison-status" :class="comparison.status">
                {{ getStatusText(comparison.status) }}
              </span>
            </div>
            <div class="comparison-metrics">
              <div class="metric-row">
                <span class="metric-label">我们:</span>
                <span class="metric-value our-value">{{ comparison.ourValue }}</span>
              </div>
              <div class="metric-row">
                <span class="metric-label">竞品平均:</span>
                <span class="metric-value competitor-value">{{ comparison.competitorAvg }}</span>
              </div>
              <div class="metric-row">
                <span class="metric-label">行业最佳:</span>
                <span class="metric-value best-value">{{ comparison.industryBest }}</span>
              </div>
            </div>
            <div class="comparison-chart">
              <div class="chart-bar">
                <div
                  class="chart-fill our-fill"
                  :style="{ width: getComparisonPercentage(comparison.ourValue, comparison.industryBest) + '%' }"
                ></div>
              </div>
              <div class="chart-bar">
                <div
                  class="chart-fill competitor-fill"
                  :style="{ width: getComparisonPercentage(comparison.competitorAvg, comparison.industryBest) + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 竞品洞察 -->
      <div class="insights-section">
        <h3>竞品洞察</h3>
        <div class="insights-grid">
          <div
            v-for="insight in competitorInsights"
            :key="insight.id"
            class="insight-card"
          >
            <div class="insight-icon" :class="insight.type">
              <component :is="getInsightIcon(insight.type)" />
            </div>
            <div class="insight-content">
              <h4>{{ insight.title }}</h4>
              <p>{{ insight.description }}</p>
              <div class="insight-actions">
                <button class="action-btn primary">查看详情</button>
                <button class="action-btn secondary">设置监控</button>
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
import { Target, TrendingUp, Crown, Zap, AlertTriangle, Eye, TrendingDown, Info } from 'lucide-vue-next'
import PieChart from '@/components/charts/PieChart.vue'
import LineChart from '@/components/charts/LineChart.vue'

// 定义数据类型
interface CompetitorStats {
  totalCompetitors: number
  competitorGrowth: number
  marketShare: number
  shareGrowth: number
  ranking: number
  rankingChange: number
  competitionIntensity: string
  intensityChange: number
}

interface Competitor {
  id: string
  name: string
  logo: string
  category: string
  estimatedRevenue: number
  monthlyTraffic: number
  marketShare: number
  growth: number
  threatLevel: 'high' | 'medium' | 'low'
  isCurrentBrand?: boolean
}

interface DetailedComparison {
  id: string
  title: string
  ourValue: string
  competitorAvg: string
  industryBest: string
  status: 'leading' | 'competitive' | 'lagging'
}

interface CompetitorInsight {
  id: string
  type: 'opportunity' | 'threat' | 'trend' | 'info'
  title: string
  description: string
}

interface ChartData {
  name: string
  value: number
  color: string
}

// 响应式数据
const activeRankingMetric = ref('revenue')
const stats = ref<CompetitorStats>({
  totalCompetitors: 12,
  competitorGrowth: 8,
  marketShare: 15.6,
  shareGrowth: 2.3,
  ranking: 3,
  rankingChange: 1,
  competitionIntensity: '高',
  intensityChange: 12
})

const rankingMetrics = [
  { value: 'revenue', label: '收入' },
  { value: 'traffic', label: '流量' },
  { value: 'share', label: '份额' },
  { value: 'growth', label: '增长' }
]

const competitors = ref<Competitor[]>([
  {
    id: '1',
    name: 'Brand Leader',
    logo: '/logos/brand-leader.png',
    category: '护肤品',
    estimatedRevenue: 2500000,
    monthlyTraffic: 1200000,
    marketShare: 25.8,
    growth: 12,
    threatLevel: 'high'
  },
  {
    id: '2',
    name: 'Market Giant',
    logo: '/logos/market-giant.png',
    category: '护肤品',
    estimatedRevenue: 1800000,
    monthlyTraffic: 950000,
    marketShare: 18.9,
    growth: 8,
    threatLevel: 'high'
  },
  {
    id: '3',
    name: '我们的品牌',
    logo: '/logos/our-brand.png',
    category: '护肤品',
    estimatedRevenue: 1500000,
    monthlyTraffic: 780000,
    marketShare: 15.6,
    growth: 15,
    threatLevel: 'medium',
    isCurrentBrand: true
  },
  {
    id: '4',
    name: 'Rising Star',
    logo: '/logos/rising-star.png',
    category: '护肤品',
    estimatedRevenue: 1200000,
    monthlyTraffic: 650000,
    marketShare: 12.5,
    growth: 25,
    threatLevel: 'medium'
  },
  {
    id: '5',
    name: 'Niche Player',
    logo: '/logos/niche-player.png',
    category: '护肤品',
    estimatedRevenue: 800000,
    monthlyTraffic: 420000,
    marketShare: 8.3,
    growth: 5,
    threatLevel: 'low'
  }
])

const detailedComparisons = ref<DetailedComparison[]>([
  {
    id: '1',
    title: '平均客单价',
    ourValue: '$89',
    competitorAvg: '$76',
    industryBest: '$125',
    status: 'competitive'
  },
  {
    id: '2',
    title: '转化率',
    ourValue: '3.2%',
    competitorAvg: '2.8%',
    industryBest: '4.5%',
    status: 'leading'
  },
  {
    id: '3',
    title: '客户获取成本',
    ourValue: '$28',
    competitorAvg: '$35',
    industryBest: '$22',
    status: 'competitive'
  },
  {
    id: '4',
    title: '品牌知名度',
    ourValue: '45%',
    competitorAvg: '52%',
    industryBest: '78%',
    status: 'lagging'
  },
  {
    id: '5',
    title: '客户满意度',
    ourValue: '4.3/5',
    competitorAvg: '4.1/5',
    industryBest: '4.7/5',
    status: 'leading'
  },
  {
    id: '6',
    title: '市场响应速度',
    ourValue: '2.1天',
    competitorAvg: '3.5天',
    industryBest: '1.8天',
    status: 'competitive'
  }
])

const competitorInsights = ref<CompetitorInsight[]>([
  {
    id: '1',
    type: 'threat',
    title: 'Rising Star 快速增长',
    description: 'Rising Star 品牌在过去6个月增长了25%，主要通过社交媒体营销和网红合作'
  },
  {
    id: '2',
    type: 'opportunity',
    title: '高端市场空白',
    description: '高端护肤品市场存在空白，可以考虑推出高端产品线'
  },
  {
    id: '3',
    type: 'trend',
    title: '可持续包装趋势',
    description: '越来越多竞品开始采用可持续包装，这可能成为重要的差异化因素'
  },
  {
    id: '4',
    type: 'info',
    title: '季节性促销策略',
    description: '竞品在节假日期间的促销策略分析，可以为我们的营销策略提供参考'
  }
])

// 计算属性
const marketShareData = computed<ChartData[]>(() => {
  const colors = ['#1890ff', '#52c41a', '#fa8c16', '#722ed1', '#eb2f96']
  return competitors.value.map((competitor, index) => ({
    name: competitor.name,
    value: competitor.marketShare,
    color: colors[index % colors.length]
  }))
})

const competitorTrendData = computed(() => {
  const months = ['1月', '2月', '3月', '4月', '5月', '6月']
  const topCompetitors = competitors.value.slice(0, 4)
  const colors = ['#1890ff', '#52c41a', '#fa8c16', '#722ed1']

  return {
    labels: months,
    datasets: topCompetitors.map((competitor, index) => ({
      label: competitor.name,
      data: Array.from({ length: 6 }, () => Math.floor(Math.random() * 20) + competitor.marketShare - 10),
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
  if (growth > 15) return 'growth-excellent'
  if (growth > 5) return 'growth-good'
  if (growth > 0) return 'growth-positive'
  return 'growth-negative'
}

const getThreatClass = (level: string): string => {
  return `threat-${level}`
}

const getThreatText = (level: string): string => {
  const textMap = {
    high: '高威胁',
    medium: '中威胁',
    low: '低威胁'
  }
  return textMap[level as keyof typeof textMap] || level
}

const getStatusText = (status: string): string => {
  const statusMap = {
    leading: '领先',
    competitive: '竞争',
    lagging: '落后'
  }
  return statusMap[status as keyof typeof statusMap] || status
}

const getComparisonPercentage = (value: string, best: string): number => {
  // 简化的百分比计算，实际应用中需要更复杂的逻辑
  const numValue = parseFloat(value.replace(/[^0-9.]/g, ''))
  const numBest = parseFloat(best.replace(/[^0-9.]/g, ''))
  return Math.min((numValue / numBest) * 100, 100)
}

const getInsightIcon = (type: string) => {
  const iconMap = {
    threat: AlertTriangle,
    opportunity: Target,
    trend: TrendingUp,
    info: Info
  }
  return iconMap[type as keyof typeof iconMap] || Info
}

onMounted(() => {
  console.log('竞品分析面板已加载')
})
</script>

<style scoped>
.competitor-panel {
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

.table-row.current-brand {
  background: var(--color-primary-light);
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

.brand-info {
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
}

.brand-logo {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  object-fit: cover;
}

.brand-name {
  font-weight: 500;
  color: var(--color-text);
}

.brand-category {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.current-badge {
  position: absolute;
  right: -8px;
  top: -8px;
  background: var(--color-primary);
  color: white;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 500;
}

.growth-value.growth-excellent { color: var(--color-success); }
.growth-value.growth-good { color: var(--color-warning); }
.growth-value.growth-positive { color: var(--color-info); }
.growth-value.growth-negative { color: var(--color-danger); }

.threat-level {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  color: white;
}

.threat-level.threat-high { background: var(--color-danger); }
.threat-level.threat-medium { background: var(--color-warning); }
.threat-level.threat-low { background: var(--color-success); }

.market-share-section {
  margin-bottom: 32px;
}

.market-share-section h3 {
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

.share-legend {
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

.comparison-section {
  margin-bottom: 32px;
}

.comparison-section h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text);
  margin: 0 0 16px 0;
}

.comparison-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.comparison-card {
  background: var(--color-background-soft);
  border-radius: 8px;
  padding: 20px;
}

.comparison-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.comparison-header h4 {
  font-size: 16px;
  font-weight: 500;
  color: var(--color-text);
  margin: 0;
}

.comparison-status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  color: white;
}

.comparison-status.leading { background: var(--color-success); }
.comparison-status.competitive { background: var(--color-warning); }
.comparison-status.lagging { background: var(--color-danger); }

.comparison-metrics {
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
}

.our-value { color: var(--color-primary); }
.competitor-value { color: var(--color-warning); }
.best-value { color: var(--color-success); }

.comparison-chart {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.chart-bar {
  width: 100%;
  height: 6px;
  background: var(--color-background-mute);
  border-radius: 3px;
  overflow: hidden;
}

.chart-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.our-fill { background: var(--color-primary); }
.competitor-fill { background: var(--color-warning); }

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

.insight-icon.threat { background: var(--color-danger); }
.insight-icon.opportunity { background: var(--color-success); }
.insight-icon.trend { background: var(--color-primary); }
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
  margin: 0 0 16px 0;
  line-height: 1.5;
}

.insight-actions {
  display: flex;
  gap: 8px;
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

  .table-header,
  .table-row {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .chart-container {
    flex-direction: column;
  }

  .comparison-grid {
    grid-template-columns: 1fr;
  }

  .insights-grid {
    grid-template-columns: 1fr;
  }
}
</style>
