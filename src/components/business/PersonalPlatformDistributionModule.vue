<template>
  <div class="personal-platform-distribution-module">
    <div class="platform-distribution-module__header">
      <h3 class="platform-distribution-module__title">个人平台分布</h3>
      <div class="platform-distribution-module__controls">
        <div class="view-toggle">
          <button
            v-for="view in viewOptions"
            :key="view.value"
            class="view-toggle__btn"
            :class="{ 'view-toggle__btn--active': currentView === view.value }"
            @click="currentView = view.value"
          >
            {{ view.label }}
          </button>
        </div>
      </div>
    </div>

    <div class="platform-distribution-module__content">
      <!-- 平台绩效卡片 -->
      <div class="platform-cards-section">
        <div class="platform-cards-grid">
          <div 
            v-for="platform in platformPerformance"
            :key="platform.platform"
            class="platform-card"
            :class="getPlatformCardClass(platform.performanceLevel)"
          >
            <div class="platform-card__header">
              <div class="platform-card__icon" :style="{ backgroundColor: platform.color }">
                <component :is="getPlatformIcon(platform.platform)" :size="20" />
              </div>
              <div class="platform-card__level">
                <span class="level-badge" :class="getLevelBadgeClass(platform.performanceLevel)">
                  {{ getLevelText(platform.performanceLevel) }}
                </span>
              </div>
            </div>

            <div class="platform-card__content">
              <h4 class="platform-card__name">{{ platform.platform }}</h4>
              
              <div class="platform-metrics">
                <div class="platform-metric">
                  <span class="metric-label">服务费</span>
                  <span class="metric-value">{{ formatCurrency(platform.serviceFee) }}</span>
                </div>
                <div class="platform-metric">
                  <span class="metric-label">单量</span>
                  <span class="metric-value">{{ platform.orderCount }}单</span>
                </div>
                <div class="platform-metric">
                  <span class="metric-label">客户数</span>
                  <span class="metric-value">{{ platform.customerCount }}家</span>
                </div>
                <div class="platform-metric">
                  <span class="metric-label">单均价值</span>
                  <span class="metric-value">{{ formatCurrency(platform.averageOrderValue) }}</span>
                </div>
                <div class="platform-metric">
                  <span class="metric-label">毛利率</span>
                  <span class="metric-value" :class="getProfitMarginClass(platform.profitMargin)">
                    {{ platform.profitMargin.toFixed(1) }}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 平台对比图表 -->
      <div class="platform-charts-section">
        <div class="chart-container">
          <div class="chart-header">
            <h4 class="chart-title">
              {{ currentView === 'serviceFee' ? '服务费分布' : currentView === 'orders' ? '订单量分布' : '客户数分布' }}
            </h4>
            <div class="chart-total">
              总计: {{ formatChartTotal() }}
            </div>
          </div>
          
          <div class="chart-content">
            <PieChart
              :data="pieChartData"
              :height="'320px'"
              :donut="true"
              :show-legend="true"
              @click="handleChartClick"
            />
          </div>
        </div>

        <div class="chart-container">
          <div class="chart-header">
            <h4 class="chart-title">平台绩效对比</h4>
          </div>
          
          <div class="chart-content">
            <BarChart
              :data="barChartData"
              :height="'320px'"
              :show-legend="true"
              :stack="false"
              @click="handleChartClick"
            />
          </div>
        </div>
      </div>

      <!-- 平台优化建议 -->
      <div class="platform-optimization-section">
        <h4 class="optimization-title">平台优化建议</h4>
        <div class="optimization-cards">
          <div 
            v-for="recommendation in optimizationRecommendations"
            :key="recommendation.platform"
            class="optimization-card"
            :class="getRecommendationClass(recommendation.type)"
          >
            <div class="optimization-card__header">
              <div class="optimization-card__platform">
                <div 
                  class="platform-dot"
                  :style="{ backgroundColor: recommendation.color }"
                ></div>
                <span class="platform-name">{{ recommendation.platform }}</span>
              </div>
              <div class="optimization-card__type">
                <component :is="getRecommendationIcon(recommendation.type)" :size="16" />
                <span class="type-text">{{ getRecommendationTypeText(recommendation.type) }}</span>
              </div>
            </div>

            <div class="optimization-card__content">
              <p class="optimization-description">{{ recommendation.description }}</p>
              <div class="optimization-actions">
                <div class="potential-impact">
                  <span class="impact-label">预期提升:</span>
                  <span class="impact-value">{{ recommendation.potentialImprovement }}</span>
                </div>
                <button 
                  class="optimization-action-btn"
                  @click="handleOptimizationAction(recommendation)"
                >
                  立即优化
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Globe, Search, Target, TrendingUp, AlertCircle, CheckCircle, Zap } from 'lucide-vue-next'
import PieChart from '@/components/charts/PieChart.vue'
import BarChart from '@/components/charts/BarChart.vue'
import type { PersonalPlatformPerformance } from '@/types'

interface PlatformOptimizationRecommendation {
  platform: string
  type: 'growth' | 'maintain' | 'improve' | 'risk'
  description: string
  potentialImprovement: string
  color: string
}

interface Props {
  platformPerformance: PersonalPlatformPerformance[]
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<{
  'platform-click': [platform: string]
  'optimization-action': [recommendation: PlatformOptimizationRecommendation]
}>()

const currentView = ref<'serviceFee' | 'orders' | 'customers'>('serviceFee')

const viewOptions = [
  { value: 'serviceFee' as const, label: '服务费分布' },
  { value: 'orders' as const, label: '订单量分布' },
  { value: 'customers' as const, label: '客户数分布' }
]

// 图表数据
const pieChartData = computed(() => {
  return props.platformPerformance.map(platform => ({
    name: platform.platform,
    value: currentView.value === 'serviceFee' 
      ? platform.serviceFee 
      : currentView.value === 'orders' 
        ? platform.orderCount 
        : platform.customerCount,
    color: platform.color
  }))
})

const barChartData = computed(() => {
  return {
    labels: props.platformPerformance.map(p => p.platform),
    datasets: [
      {
        label: '服务费 (万)',
        data: props.platformPerformance.map(p => p.serviceFee / 10000),
        color: '#1890ff'
      },
      {
        label: '订单量',
        data: props.platformPerformance.map(p => p.orderCount),
        color: '#52c41a'
      },
      {
        label: '客户数',
        data: props.platformPerformance.map(p => p.customerCount),
        color: '#fa8c16'
      }
    ]
  }
})

// 优化建议数据
const optimizationRecommendations = computed<PlatformOptimizationRecommendation[]>(() => {
  return props.platformPerformance.map(platform => {
    let type: 'growth' | 'maintain' | 'improve' | 'risk'
    let description: string
    let potentialImprovement: string

    switch (platform.performanceLevel) {
      case 'excellent':
        type = 'maintain'
        description = `${platform.platform}表现优秀，继续保持当前策略，可考虑适度扩大投入规模`
        potentialImprovement = '10-15%'
        break
      case 'good':
        type = 'growth'
        description = `${platform.platform}表现良好，建议增加客户开发和深度合作机会`
        potentialImprovement = '20-25%'
        break
      case 'average':
        type = 'improve'
        description = `${platform.platform}有改善空间，建议优化客户质量和服务策略`
        potentialImprovement = '15-30%'
        break
      default:
        type = 'risk'
        description = `${platform.platform}需要重点关注，建议深入分析问题并制定改善计划`
        potentialImprovement = '30-50%'
    }

    return {
      platform: platform.platform,
      type,
      description,
      potentialImprovement,
      color: platform.color
    }
  })
})

// 方法
const formatCurrency = (value: number): string => {
  if (value >= 100000000) {
    return `¥${(value / 100000000).toFixed(2)}亿`
  } else if (value >= 10000) {
    return `¥${(value / 10000).toFixed(2)}万`
  } else {
    return `¥${value.toLocaleString()}`
  }
}

const formatChartTotal = () => {
  const total = props.platformPerformance.reduce((sum, platform) => {
    return sum + (currentView.value === 'serviceFee' 
      ? platform.serviceFee 
      : currentView.value === 'orders' 
        ? platform.orderCount 
        : platform.customerCount)
  }, 0)

  if (currentView.value === 'serviceFee') {
    return formatCurrency(total)
  } else if (currentView.value === 'orders') {
    return `${total}单`
  } else {
    return `${total}家`
  }
}

const getPlatformIcon = (platform: string) => {
  // 简化处理，实际可以根据平台返回不同图标
  return Globe
}

const getPlatformCardClass = (level: string) => {
  return `platform-card--${level}`
}

const getLevelBadgeClass = (level: string) => {
  return `level-badge--${level}`
}

const getLevelText = (level: string) => {
  const textMap = {
    excellent: '优秀',
    good: '良好',
    average: '一般',
    needImprovement: '待改善'
  }
  return textMap[level as keyof typeof textMap] || level
}

const getProfitMarginClass = (margin: number) => {
  if (margin >= 30) return 'margin-excellent'
  if (margin >= 20) return 'margin-good'
  if (margin >= 10) return 'margin-average'
  return 'margin-poor'
}

const getRecommendationClass = (type: string) => {
  return `optimization-card--${type}`
}

const getRecommendationIcon = (type: string) => {
  const iconMap = {
    growth: TrendingUp,
    maintain: CheckCircle,
    improve: Target,
    risk: AlertCircle
  }
  return iconMap[type as keyof typeof iconMap] || Zap
}

const getRecommendationTypeText = (type: string) => {
  const textMap = {
    growth: '增长机会',
    maintain: '保持优势',
    improve: '优化提升',
    risk: '风险关注'
  }
  return textMap[type as keyof typeof textMap] || type
}

const handleChartClick = (params: any) => {
  emit('platform-click', params.name)
}

const handleOptimizationAction = (recommendation: PlatformOptimizationRecommendation) => {
  emit('optimization-action', recommendation)
}
</script>

<style scoped>
.personal-platform-distribution-module {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-bottom: 24px;
}

.platform-distribution-module__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.platform-distribution-module__title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #262626;
}

.view-toggle {
  display: flex;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  overflow: hidden;
}

.view-toggle__btn {
  padding: 6px 16px;
  background: #fff;
  border: none;
  color: #595959;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.view-toggle__btn:hover {
  background: #f5f5f5;
}

.view-toggle__btn--active {
  background: #1890ff;
  color: #fff;
}

.platform-distribution-module__content {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* 平台卡片区域 */
.platform-cards-section {
  background: #fafafa;
  border-radius: 8px;
  padding: 24px;
}

.platform-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.platform-card {
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 20px;
  transition: all 0.3s ease;
}

.platform-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.platform-card--excellent {
  border-left: 4px solid #52c41a;
}

.platform-card--good {
  border-left: 4px solid #1890ff;
}

.platform-card--average {
  border-left: 4px solid #faad14;
}

.platform-card--needImprovement {
  border-left: 4px solid #ff4d4f;
}

.platform-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.platform-card__icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.platform-card__level {
  display: flex;
}

.level-badge {
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 500;
}

.level-badge--excellent {
  background: #f6ffed;
  color: #52c41a;
}

.level-badge--good {
  background: #e6f7ff;
  color: #1890ff;
}

.level-badge--average {
  background: #fff7e6;
  color: #fa8c16;
}

.level-badge--needImprovement {
  background: #fff2f0;
  color: #ff4d4f;
}

.platform-card__content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.platform-card__name {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #262626;
}

.platform-metrics {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.platform-metric {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.metric-label {
  font-size: 12px;
  color: #8c8c8c;
}

.metric-value {
  font-size: 14px;
  font-weight: 600;
  color: #262626;
}

.metric-value.margin-excellent {
  color: #52c41a;
}

.metric-value.margin-good {
  color: #1890ff;
}

.metric-value.margin-average {
  color: #faad14;
}

.metric-value.margin-poor {
  color: #ff4d4f;
}

/* 图表区域 */
.platform-charts-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
}

.chart-container {
  background: #fafafa;
  border-radius: 8px;
  padding: 20px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.chart-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #262626;
}

.chart-total {
  font-size: 14px;
  font-weight: 600;
  color: #1890ff;
}

.chart-content {
  background: #fff;
  border-radius: 6px;
  padding: 16px;
}

/* 优化建议区域 */
.platform-optimization-section {
  background: #f0f9ff;
  border: 1px solid #bae7ff;
  border-radius: 8px;
  padding: 24px;
}

.optimization-title {
  margin: 0 0 20px 0;
  font-size: 16px;
  font-weight: 600;
  color: #262626;
}

.optimization-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 16px;
}

.optimization-card {
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 16px;
  transition: all 0.2s;
}

.optimization-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.optimization-card--growth {
  border-left: 4px solid #52c41a;
}

.optimization-card--maintain {
  border-left: 4px solid #1890ff;
}

.optimization-card--improve {
  border-left: 4px solid #faad14;
}

.optimization-card--risk {
  border-left: 4px solid #ff4d4f;
}

.optimization-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.optimization-card__platform {
  display: flex;
  align-items: center;
  gap: 8px;
}

.platform-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.platform-name {
  font-size: 14px;
  font-weight: 600;
  color: #262626;
}

.optimization-card__type {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #8c8c8c;
}

.type-text {
  font-size: 12px;
}

.optimization-card__content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.optimization-description {
  margin: 0;
  font-size: 13px;
  color: #595959;
  line-height: 1.5;
}

.optimization-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.potential-impact {
  display: flex;
  align-items: center;
  gap: 4px;
}

.impact-label {
  font-size: 12px;
  color: #8c8c8c;
}

.impact-value {
  font-size: 12px;
  font-weight: 600;
  color: #52c41a;
}

.optimization-action-btn {
  padding: 6px 12px;
  background: #1890ff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.2s;
}

.optimization-action-btn:hover {
  background: #40a9ff;
}

@media (max-width: 768px) {
  .personal-platform-distribution-module {
    padding: 16px;
  }

  .platform-distribution-module__header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .platform-cards-grid {
    grid-template-columns: 1fr;
  }

  .platform-charts-section {
    grid-template-columns: 1fr;
  }

  .optimization-cards {
    grid-template-columns: 1fr;
  }

  .optimization-actions {
    flex-direction: column;
    gap: 8px;
    align-items: stretch;
  }
}
</style>