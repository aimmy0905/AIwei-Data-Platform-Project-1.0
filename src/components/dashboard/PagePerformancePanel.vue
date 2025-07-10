<template>
  <div class="page-performance-panel">
    <div class="section-header">
      <h2 class="section-title">页面表现</h2>
      <p class="section-description">网站页面性能监控和访问数据分析</p>
    </div>

    <div class="panel-content">
      <!-- 页面性能概览 -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">
            <Globe />
          </div>
          <div class="stat-content">
            <h3>页面浏览量</h3>
            <div class="stat-value">{{ formatNumber(stats.pageViews) }}</div>
            <div class="stat-change positive">+{{ stats.pageViewsGrowth }}%</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <Clock />
          </div>
          <div class="stat-content">
            <h3>平均加载时间</h3>
            <div class="stat-value">{{ stats.avgLoadTime }}s</div>
            <div class="stat-change negative">+{{ stats.loadTimeChange }}%</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <MousePointer />
          </div>
          <div class="stat-content">
            <h3>跳出率</h3>
            <div class="stat-value">{{ stats.bounceRate }}%</div>
            <div class="stat-change positive">-{{ stats.bounceRateChange }}%</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <TrendingUp />
          </div>
          <div class="stat-content">
            <h3>转化率</h3>
            <div class="stat-value">{{ stats.conversionRate }}%</div>
            <div class="stat-change positive">+{{ stats.conversionGrowth }}%</div>
          </div>
        </div>
      </div>

      <!-- 页面表现排行 -->
      <div class="ranking-section">
        <div class="section-header">
          <h3>页面表现排行</h3>
          <div class="view-toggle">
            <button
              v-for="metric in metrics"
              :key="metric.value"
              :class="['toggle-btn', { active: activeMetric === metric.value }]"
              @click="activeMetric = metric.value"
            >
              {{ metric.label }}
            </button>
          </div>
        </div>

        <div class="ranking-table">
          <div class="table-header">
            <div class="rank-col">排名</div>
            <div class="page-col">页面</div>
            <div class="views-col">浏览量</div>
            <div class="time-col">停留时间</div>
            <div class="bounce-col">跳出率</div>
            <div class="conversion-col">转化率</div>
            <div class="performance-col">性能评分</div>
          </div>
          <div class="table-body">
            <div
              v-for="(page, index) in topPages"
              :key="page.id"
              class="table-row"
            >
              <div class="rank-col">
                <span class="rank-badge" :class="getRankClass(index + 1)">{{ index + 1 }}</span>
              </div>
              <div class="page-col">
                <div class="page-info">
                  <div class="page-title">{{ page.title }}</div>
                  <div class="page-url">{{ page.url }}</div>
                </div>
              </div>
              <div class="views-col">{{ formatNumber(page.views) }}</div>
              <div class="time-col">{{ formatTime(page.avgTime) }}</div>
              <div class="bounce-col">
                <span class="bounce-rate" :class="getBounceClass(page.bounceRate)">{{ page.bounceRate }}%</span>
              </div>
              <div class="conversion-col">{{ page.conversionRate }}%</div>
              <div class="performance-col">
                <div class="performance-score" :class="getPerformanceClass(page.performanceScore)">
                  {{ page.performanceScore }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 页面流量趋势 -->
      <div class="trend-section">
        <h3>页面流量趋势</h3>
        <div class="trend-chart">
          <LineChart :data="trafficTrendData" />
        </div>
      </div>

      <!-- 页面性能指标 -->
      <div class="metrics-section">
        <h3>核心性能指标</h3>
        <div class="metrics-grid">
          <div
            v-for="metric in performanceMetrics"
            :key="metric.id"
            class="metric-card"
          >
            <div class="metric-header">
              <h4>{{ metric.name }}</h4>
              <span class="metric-score" :class="getMetricClass(metric.score)">{{ metric.score }}</span>
            </div>
            <div class="metric-description">{{ metric.description }}</div>
            <div class="metric-chart">
              <div class="chart-bar">
                <div
                  class="chart-fill"
                  :class="getMetricClass(metric.score)"
                  :style="{ width: (metric.score / 100) * 100 + '%' }"
                ></div>
              </div>
            </div>
            <div class="metric-details">
              <span class="current-value">当前: {{ metric.currentValue }}</span>
              <span class="target-value">目标: {{ metric.targetValue }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 页面优化建议 -->
      <div class="suggestions-section">
        <h3>优化建议</h3>
        <div class="suggestions-grid">
          <div
            v-for="suggestion in optimizationSuggestions"
            :key="suggestion.id"
            class="suggestion-card"
          >
            <div class="suggestion-icon" :class="suggestion.priority">
              <component :is="getSuggestionIcon(suggestion.type)" />
            </div>
            <div class="suggestion-content">
              <h4>{{ suggestion.title }}</h4>
              <p>{{ suggestion.description }}</p>
              <div class="suggestion-impact">
                <span class="impact-label">预期影响:</span>
                <span class="impact-value" :class="suggestion.priority">{{ suggestion.impact }}</span>
              </div>
            </div>
            <div class="suggestion-actions">
              <button class="action-btn primary">立即优化</button>
              <button class="action-btn secondary">了解更多</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Globe, Clock, MousePointer, TrendingUp, Zap, AlertTriangle, Target, Settings } from 'lucide-vue-next'
import LineChart from '@/components/charts/LineChart.vue'

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

interface PageData {
  id: string
  title: string
  url: string
  views: number
  avgTime: number
  bounceRate: number
  conversionRate: number
  performanceScore: number
}

interface PerformanceMetric {
  id: string
  name: string
  description: string
  score: number
  currentValue: string
  targetValue: string
}

interface OptimizationSuggestion {
  id: string
  type: 'performance' | 'seo' | 'ux' | 'conversion'
  priority: 'high' | 'medium' | 'low'
  title: string
  description: string
  impact: string
}

// 响应式数据
const activeMetric = ref('views')
const stats = ref<PageStats>({
  pageViews: 1250000,
  pageViewsGrowth: 15,
  avgLoadTime: 2.3,
  loadTimeChange: 5,
  bounceRate: 42,
  bounceRateChange: 8,
  conversionRate: 3.2,
  conversionGrowth: 12
})

const metrics = [
  { value: 'views', label: '浏览量' },
  { value: 'time', label: '停留时间' },
  { value: 'bounce', label: '跳出率' },
  { value: 'conversion', label: '转化率' }
]

const topPages = ref<PageData[]>([
  {
    id: '1',
    title: '首页',
    url: '/',
    views: 485000,
    avgTime: 180,
    bounceRate: 35,
    conversionRate: 4.2,
    performanceScore: 92
  },
  {
    id: '2',
    title: '产品页面',
    url: '/products',
    views: 320000,
    avgTime: 240,
    bounceRate: 28,
    conversionRate: 6.8,
    performanceScore: 88
  },
  {
    id: '3',
    title: '产品详情',
    url: '/product/detail',
    views: 280000,
    avgTime: 300,
    bounceRate: 22,
    conversionRate: 8.5,
    performanceScore: 85
  },
  {
    id: '4',
    title: '购物车',
    url: '/cart',
    views: 150000,
    avgTime: 120,
    bounceRate: 45,
    conversionRate: 12.3,
    performanceScore: 78
  },
  {
    id: '5',
    title: '结账页面',
    url: '/checkout',
    views: 95000,
    avgTime: 180,
    bounceRate: 38,
    conversionRate: 25.6,
    performanceScore: 82
  },
  {
    id: '6',
    title: '关于我们',
    url: '/about',
    views: 75000,
    avgTime: 150,
    bounceRate: 55,
    conversionRate: 1.2,
    performanceScore: 90
  }
])

const performanceMetrics = ref<PerformanceMetric[]>([
  {
    id: '1',
    name: '首次内容绘制 (FCP)',
    description: '页面开始加载到首次内容出现的时间',
    score: 85,
    currentValue: '1.2s',
    targetValue: '< 1.8s'
  },
  {
    id: '2',
    name: '最大内容绘制 (LCP)',
    description: '页面主要内容完全加载的时间',
    score: 78,
    currentValue: '2.3s',
    targetValue: '< 2.5s'
  },
  {
    id: '3',
    name: '首次输入延迟 (FID)',
    description: '用户首次交互到浏览器响应的时间',
    score: 92,
    currentValue: '45ms',
    targetValue: '< 100ms'
  },
  {
    id: '4',
    name: '累积布局偏移 (CLS)',
    description: '页面加载过程中布局稳定性指标',
    score: 88,
    currentValue: '0.08',
    targetValue: '< 0.1'
  }
])

const optimizationSuggestions = ref<OptimizationSuggestion[]>([
  {
    id: '1',
    type: 'performance',
    priority: 'high',
    title: '优化图片加载',
    description: '使用WebP格式和延迟加载可以显著提升页面加载速度',
    impact: '提升20%加载速度'
  },
  {
    id: '2',
    type: 'seo',
    priority: 'medium',
    title: '改善页面标题',
    description: '优化页面标题和元描述以提高搜索引擎排名',
    impact: '提升15%搜索流量'
  },
  {
    id: '3',
    type: 'ux',
    priority: 'high',
    title: '减少页面跳出',
    description: '优化页面布局和内容结构，提升用户体验',
    impact: '降低10%跳出率'
  },
  {
    id: '4',
    type: 'conversion',
    priority: 'medium',
    title: '优化转化流程',
    description: '简化购买流程，减少用户操作步骤',
    impact: '提升25%转化率'
  }
])

// 计算属性
const trafficTrendData = computed(() => {
  const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  const pages = ['首页', '产品页', '详情页', '购物车']
  const colors = ['#1890ff', '#52c41a', '#fa8c16', '#722ed1']

  return {
    labels: days,
    datasets: pages.map((page, index) => ({
      label: page,
      data: Array.from({ length: 7 }, () => Math.floor(Math.random() * 50000) + 20000),
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

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

const getRankClass = (rank: number): string => {
  if (rank === 1) return 'rank-first'
  if (rank === 2) return 'rank-second'
  if (rank === 3) return 'rank-third'
  return 'rank-default'
}

const getBounceClass = (rate: number): string => {
  if (rate <= 30) return 'bounce-excellent'
  if (rate <= 45) return 'bounce-good'
  if (rate <= 60) return 'bounce-fair'
  return 'bounce-poor'
}

const getPerformanceClass = (score: number): string => {
  if (score >= 90) return 'performance-excellent'
  if (score >= 80) return 'performance-good'
  if (score >= 70) return 'performance-fair'
  return 'performance-poor'
}

const getMetricClass = (score: number): string => {
  if (score >= 90) return 'metric-excellent'
  if (score >= 80) return 'metric-good'
  if (score >= 70) return 'metric-fair'
  return 'metric-poor'
}

const getSuggestionIcon = (type: string) => {
  const iconMap = {
    performance: Zap,
    seo: Target,
    ux: MousePointer,
    conversion: TrendingUp
  }
  return iconMap[type as keyof typeof iconMap] || Settings
}

onMounted(() => {
  console.log('页面表现面板已加载')
})
</script>

<style scoped>
.page-performance-panel {
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
  grid-template-columns: 60px 1fr 100px 100px 80px 80px 100px;
  gap: 16px;
  padding: 16px;
  background: var(--color-background-mute);
  font-weight: 600;
  color: var(--color-text-secondary);
  font-size: 14px;
}

.table-row {
  display: grid;
  grid-template-columns: 60px 1fr 100px 100px 80px 80px 100px;
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

.page-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.page-title {
  font-weight: 500;
  color: var(--color-text);
}

.page-url {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.bounce-rate.bounce-excellent { color: var(--color-success); }
.bounce-rate.bounce-good { color: var(--color-warning); }
.bounce-rate.bounce-fair { color: var(--color-info); }
.bounce-rate.bounce-poor { color: var(--color-danger); }

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
</style>
