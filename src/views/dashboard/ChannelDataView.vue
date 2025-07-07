<template>
  <div class="channel-data-view">
    <div class="page-header">
      <h1 class="page-title">渠道数据分析</h1>
      <p class="page-description">深入分析各个渠道的表现，优化投放策略</p>
      <div class="page-actions">
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

    <div class="channel-content" v-if="!loading">
      <!-- 渠道概览卡片 -->
      <div class="channel-overview">
        <div class="overview-card" v-for="channel in channelStats" :key="channel.id">
          <div class="overview-card__header">
            <div class="channel-icon" :style="{ backgroundColor: channel.color + '20', color: channel.color }">
              <component :is="getChannelIcon(channel.type)" :size="24" />
            </div>
            <div class="channel-info">
              <h3>{{ channel.name }}</h3>
              <span class="channel-type">{{ getChannelTypeText(channel.type) }}</span>
            </div>
          </div>
          <div class="overview-card__metrics">
            <div class="metric">
              <span class="metric-label">收入</span>
              <span class="metric-value">${{ formatNumber(channel.revenue) }}</span>
            </div>
            <div class="metric">
              <span class="metric-label">ROI</span>
              <span class="metric-value" :class="getRoiClass(channel.roi)">{{ channel.roi }}x</span>
            </div>
            <div class="metric">
              <span class="metric-label">转化率</span>
              <span class="metric-value">{{ channel.conversionRate }}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 图表分析区域 -->
      <div class="charts-section">
        <div class="chart-grid">
          <!-- 渠道收入分布 -->
          <div class="chart-card">
            <div class="chart-card__header">
              <h3>渠道收入分布</h3>
              <div class="chart-options">
                <button 
                  class="chart-option"
                  :class="{ 'chart-option--active': revenueChartType === 'pie' }"
                  @click="revenueChartType = 'pie'"
                >
                  饼图
                </button>
                <button 
                  class="chart-option"
                  :class="{ 'chart-option--active': revenueChartType === 'bar' }"
                  @click="revenueChartType = 'bar'"
                >
                  柱图
                </button>
              </div>
            </div>
            <div class="chart-container">
              <PieChart
                v-if="revenueChartType === 'pie'"
                :data="revenueDistributionData"
                height="350px"
                :show-legend="true"
                :donut="true"
                :radius="['40%', '70%']"
              />
              <BarChart
                v-else
                :data="revenueBarData"
                height="350px"
                :show-legend="false"
                :horizontal="false"
              />
            </div>
          </div>

          <!-- 转化率对比 -->
          <div class="chart-card">
            <div class="chart-card__header">
              <h3>转化率对比</h3>
            </div>
            <div class="chart-container">
              <BarChart
                :data="conversionRateData"
                height="350px"
                :show-legend="false"
                :horizontal="true"
              />
            </div>
          </div>

          <!-- ROI趋势 -->
          <div class="chart-card chart-card--wide">
            <div class="chart-card__header">
              <h3>ROI趋势分析</h3>
              <div class="chart-legend">
                <div 
                  v-for="(dataset, index) in roiTrendData.datasets" 
                  :key="dataset.label"
                  class="legend-item"
                >
                  <span 
                    class="legend-color"
                    :style="{ backgroundColor: dataset.color || getDefaultColor(index) }"
                  ></span>
                  <span>{{ dataset.label }}</span>
                </div>
              </div>
            </div>
            <div class="chart-container">
              <LineChart
                :data="roiTrendData"
                height="350px"
                :smooth="true"
                :show-legend="false"
              />
            </div>
          </div>

          <!-- 成本效益分析 -->
          <div class="chart-card chart-card--wide">
            <div class="chart-card__header">
              <h3>成本效益分析</h3>
            </div>
            <div class="chart-container">
              <AreaChart
                :data="costEfficiencyData"
                height="350px"
                :smooth="true"
                :stack="false"
                :show-legend="true"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- 详细数据表格 -->
      <div class="data-table-section">
        <div class="section-header">
          <h3>详细数据</h3>
          <div class="table-actions">
            <button class="action-btn">
              <Download :size="16" />
              导出数据
            </button>
            <button class="action-btn">
              <RefreshCw :size="16" />
              刷新
            </button>
          </div>
        </div>
        <div class="data-table">
          <table>
            <thead>
              <tr>
                <th>渠道</th>
                <th>类型</th>
                <th>收入</th>
                <th>成本</th>
                <th>用户数</th>
                <th>会话数</th>
                <th>转化率</th>
                <th>ROI</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="channel in channelStats" :key="channel.id">
                <td>
                  <div class="channel-cell">
                    <div class="channel-icon-small" :style="{ backgroundColor: channel.color + '20', color: channel.color }">
                      <component :is="getChannelIcon(channel.type)" :size="16" />
                    </div>
                    <span>{{ channel.name }}</span>
                  </div>
                </td>
                <td>{{ getChannelTypeText(channel.type) }}</td>
                <td class="revenue-cell">${{ formatNumber(channel.revenue) }}</td>
                <td class="cost-cell">${{ formatNumber(channel.cost) }}</td>
                <td>{{ formatNumber(channel.users) }}</td>
                <td>{{ formatNumber(channel.sessions) }}</td>
                <td>{{ channel.conversionRate }}%</td>
                <td>
                  <span class="roi-badge" :class="getRoiClass(channel.roi)">
                    {{ channel.roi }}x
                  </span>
                </td>
                <td>
                  <button class="action-btn action-btn--small">
                    <MoreHorizontal :size="16" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-else class="loading-state">
      <Loader :size="48" class="loading-spinner" />
      <span>加载渠道数据中...</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { 
  Globe, 
  Monitor, 
  Mail, 
  Search, 
  Target,
  Download,
  RefreshCw,
  MoreHorizontal,
  Loader
} from 'lucide-vue-next'
import { mockGetChannels } from '@/mock'
import LineChart from '@/components/charts/LineChart.vue'
import PieChart from '@/components/charts/PieChart.vue'
import BarChart from '@/components/charts/BarChart.vue'
import AreaChart from '@/components/charts/AreaChart.vue'
import type { Channel } from '@/types'

// 响应式数据
const loading = ref(true)
const activePeriod = ref('30天')
const revenueChartType = ref('pie')
const channelStats = ref<Channel[]>([])

const periods = ['7天', '30天', '90天', '1年']

// 渠道图标映射
const channelIconMap = {
  google: Search,
  facebook: Monitor,
  direct: Globe,
  email: Mail,
  criteo: Target,
  bing: Search
}

// 渠道类型映射
const channelTypeMap = {
  google: '搜索广告',
  facebook: '社交媒体',
  direct: '直接访问',
  email: '邮件营销',
  criteo: '重定向广告',
  bing: '搜索广告'
}

// 计算属性
const revenueDistributionData = computed(() => {
  return channelStats.value.map((channel) => ({
    name: channel.name,
    value: channel.revenue,
    color: getChannelColor(channel.type)
  }))
})

const revenueBarData = computed(() => ({
  labels: channelStats.value.map(c => c.name),
  datasets: [{
    label: '收入',
    data: channelStats.value.map(c => c.revenue),
    color: '#1890ff'
  }]
}))

const conversionRateData = computed(() => ({
  labels: channelStats.value.map(c => c.name),
  datasets: [{
    label: '转化率',
    data: channelStats.value.map(c => c.conversionRate),
    color: '#52c41a'
  }]
}))

const roiTrendData = computed(() => ({
  labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
  datasets: channelStats.value.slice(0, 3).map((channel) => ({
    label: channel.name,
    data: generateTrendData(channel.roi),
    color: getChannelColor(channel.type)
  }))
}))

const costEfficiencyData = computed(() => ({
  labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
  datasets: [
    {
      label: '收入',
      data: [180000, 195000, 210000, 225000, 240000, 255000],
      color: '#52c41a'
    },
    {
      label: '成本',
      data: [45000, 48000, 52000, 55000, 58000, 62000],
      color: '#f5222d'
    }
  ]
}))

// 方法
const getChannelIcon = (type: string) => {
  return channelIconMap[type as keyof typeof channelIconMap] || Globe
}

const getChannelTypeText = (type: string) => {
  return channelTypeMap[type as keyof typeof channelTypeMap] || type
}

const getChannelColor = (type: string) => {
  const colorMap = {
    google: '#4285f4',
    facebook: '#1877f2',
    direct: '#52c41a',
    email: '#fa8c16',
    criteo: '#722ed1',
    bing: '#00809d'
  }
  return colorMap[type as keyof typeof colorMap] || '#1890ff'
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

const getDefaultColor = (index: number): string => {
  const colors = ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1', '#fa8c16']
  return colors[index % colors.length]
}

const generateTrendData = (baseValue: number): number[] => {
  const variation = baseValue * 0.2
  return Array.from({ length: 6 }, () => 
    Math.round((baseValue + (Math.random() - 0.5) * variation) * 100) / 100
  )
}

// 加载数据
const loadChannelData = async () => {
  loading.value = true
  try {
    const response = await mockGetChannels()
    if (response.success && response.data) {
      channelStats.value = response.data.map(channel => ({
        ...channel,
        color: getChannelColor(channel.type)
      }))
    }
  } catch (error) {
    console.error('加载渠道数据失败:', error)
  } finally {
    loading.value = false
  }
}

// 生命周期
onMounted(() => {
  loadChannelData()
})
</script>

<style scoped>
.channel-data-view {
  padding: 0;
}

.page-header {
  margin-bottom: var(--spacing-xl);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: var(--spacing-md);
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

.page-actions {
  display: flex;
  gap: var(--spacing-xs);
  align-items: center;
}

.period-btn {
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--color-surface);
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

.channel-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.channel-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-lg);
}

.overview-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  transition: all var(--duration-fast);
}

.overview-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.overview-card__header {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.channel-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--border-radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
}

.channel-info h3 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-xs) 0;
}

.channel-type {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.overview-card__metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-md);
}

.metric {
  text-align: center;
}

.metric-label {
  display: block;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-xs);
}

.metric-value {
  display: block;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.charts-section {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xl);
}

.chart-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-xl);
}

.chart-card {
  border: 1px solid var(--color-border-light);
  border-radius: var(--border-radius-md);
  overflow: hidden;
}

.chart-card--wide {
  grid-column: span 2;
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

.chart-options {
  display: flex;
  gap: var(--spacing-xs);
}

.chart-option {
  padding: var(--spacing-xs) var(--spacing-sm);
  background: none;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--duration-fast);
}

.chart-option:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.chart-option--active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

.chart-legend {
  display: flex;
  gap: var(--spacing-md);
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.chart-container {
  padding: var(--spacing-lg);
}

.data-table-section {
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

.table-actions {
  display: flex;
  gap: var(--spacing-sm);
}

.action-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--duration-fast);
}

.action-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.action-btn--small {
  padding: var(--spacing-xs);
}

.data-table {
  overflow-x: auto;
}

.data-table table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: var(--spacing-md);
  text-align: left;
  border-bottom: 1px solid var(--color-border-light);
}

.data-table th {
  background: var(--color-background);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
}

.data-table td {
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
}

.channel-cell {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.channel-icon-small {
  width: 24px;
  height: 24px;
  border-radius: var(--border-radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
}

.revenue-cell {
  font-weight: var(--font-weight-semibold);
  color: var(--color-success);
}

.cost-cell {
  font-weight: var(--font-weight-semibold);
  color: var(--color-error);
}

.roi-badge {
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
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

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: var(--spacing-lg);
  color: var(--color-text-secondary);
}

.loading-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .chart-grid {
    grid-template-columns: 1fr;
  }
  
  .chart-card--wide {
    grid-column: span 1;
  }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .channel-overview {
    grid-template-columns: 1fr;
  }
  
  .overview-card__metrics {
    grid-template-columns: 1fr;
  }
  
  .chart-legend {
    justify-content: center;
  }
}
</style>