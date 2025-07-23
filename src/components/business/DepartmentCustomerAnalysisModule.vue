<template>
  <div class="department-customer-analysis-module">
    <div class="analysis-module__header">
      <h3 class="analysis-module__title">部门客户分析及流失客户分析</h3>
      <div class="analysis-module__controls">
        <div class="department-ranking">
          <span class="ranking-label">部门排名:</span>
          <span class="ranking-value" :class="getRankingClass()">
            #{{ departmentCustomerAnalysis.departmentRanking.profitRanking }}
          </span>
          <span class="ranking-metric">毛利</span>
          <span class="ranking-value" :class="getRankingClass('customer')">
            #{{ departmentCustomerAnalysis.departmentRanking.customerCountRanking }}
          </span>
          <span class="ranking-metric">客户数</span>
        </div>
      </div>
    </div>

    <div class="analysis-module__content">
      <!-- 部门表现概览 -->
      <div class="department-performance-overview">
        <div class="performance-cards">
          <div class="performance-card">
            <div class="performance-card__header">
              <Crown :size="20" />
              <span>毛利排名</span>
            </div>
            <div class="performance-card__content">
              <div class="ranking-display">
                <span class="ranking-number">#{{ departmentCustomerAnalysis.departmentRanking.profitRanking }}</span>
                <span class="ranking-description">{{ getRankingDescription('profit') }}</span>
              </div>
            </div>
          </div>

          <div class="performance-card">
            <div class="performance-card__header">
              <Users :size="20" />
              <span>客户数排名</span>
            </div>
            <div class="performance-card__content">
              <div class="ranking-display">
                <span class="ranking-number">#{{ departmentCustomerAnalysis.departmentRanking.customerCountRanking }}</span>
                <span class="ranking-description">{{ getRankingDescription('customer') }}</span>
              </div>
            </div>
          </div>

          <div class="performance-card">
            <div class="performance-card__header">
              <TrendingUp :size="20" />
              <span>增长排名</span>
            </div>
            <div class="performance-card__content">
              <div class="ranking-display">
                <span class="ranking-number">#{{ departmentCustomerAnalysis.departmentRanking.growthRanking }}</span>
                <span class="ranking-description">{{ getRankingDescription('growth') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 使用通用客户分析组件 -->
      <CustomerAnalysisModule
        :customer-data="departmentCustomerAnalysis.customerData"
        :title="`${departmentCustomerAnalysis.departmentName} - 客户分析详情`"
        :loading="loading"
        @view-change="handleViewChange"
        @chart-click="handleChartClick"
      />

      <!-- 部门对比分析 -->
      <div class="department-comparison-section">
        <div class="comparison-header">
          <h4>与其他部门对比</h4>
          <div class="comparison-toggle">
            <button 
              v-for="metric in comparisonMetrics"
              :key="metric.key"
              class="comparison-btn"
              :class="{ 'comparison-btn--active': currentComparison === metric.key }"
              @click="currentComparison = metric.key"
            >
              {{ metric.label }}
            </button>
          </div>
        </div>

        <div class="comparison-content">
          <div class="comparison-chart">
            <BarChart
              :data="comparisonChartData"
              :height="'280px'"
              :show-legend="false"
              :stack="false"
              @click="handleComparisonChartClick"
            />
          </div>
          
          <div class="comparison-insights">
            <div class="insight-card">
              <div class="insight-header">
                <BarChart3 :size="20" />
                <span>对比洞察</span>
              </div>
              <div class="insight-content">
                <div class="insight-item">
                  <span class="insight-label">相对表现:</span>
                  <span class="insight-value" :class="getPerformanceClass()">
                    {{ getPerformanceText() }}
                  </span>
                </div>
                <div class="insight-item">
                  <span class="insight-label">改进空间:</span>
                  <span class="insight-value">{{ getImprovementText() }}</span>
                </div>
                <div class="insight-item">
                  <span class="insight-label">关键优势:</span>
                  <span class="insight-value">{{ getAdvantageText() }}</span>
                </div>
              </div>
            </div>

            <div class="benchmark-card">
              <div class="benchmark-header">
                <Target :size="20" />
                <span>基准对比</span>
              </div>
              <div class="benchmark-content">
                <div class="benchmark-metric">
                  <span class="metric-name">平均客户价值</span>
                  <div class="metric-comparison">
                    <span class="metric-current">{{ formatCurrency(getAverageCustomerValue()) }}</span>
                    <span class="metric-benchmark">vs 部门平均 {{ formatCurrency(getBenchmarkValue()) }}</span>
                  </div>
                </div>
                <div class="benchmark-metric">
                  <span class="metric-name">客户增长率</span>
                  <div class="metric-comparison">
                    <span class="metric-current">{{ getCustomerGrowthRate() }}%</span>
                    <span class="metric-benchmark">vs 公司平均 15.2%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 改进建议 -->
      <div class="department-recommendations" v-if="recommendations.length > 0">
        <div class="recommendations-header">
          <h4>部门改进建议</h4>
          <span class="recommendations-count">{{ recommendations.length }}条建议</span>
        </div>
        <div class="recommendations-list">
          <div 
            v-for="(recommendation, index) in recommendations"
            :key="index"
            class="recommendation-item"
            :class="getRecommendationClass(recommendation.priority)"
          >
            <div class="recommendation-icon">
              <component :is="getRecommendationIcon(recommendation.type)" :size="18" />
            </div>
            <div class="recommendation-content">
              <h5 class="recommendation-title">{{ recommendation.title }}</h5>
              <p class="recommendation-description">{{ recommendation.description }}</p>
            </div>
            <div class="recommendation-action">
              <button class="action-btn" @click="handleRecommendationAction(recommendation)">
                立即执行
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Crown, Users, TrendingUp, BarChart3, Target, UserPlus, Shield, AlertTriangle, Lightbulb } from 'lucide-vue-next'
import CustomerAnalysisModule from './CustomerAnalysisModule.vue'
import BarChart from '@/components/charts/BarChart.vue'
import type { DepartmentCustomerAnalysis } from '@/types'

interface Recommendation {
  type: 'acquisition' | 'retention' | 'optimization' | 'strategy'
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  action?: string
}

interface Props {
  departmentCustomerAnalysis: DepartmentCustomerAnalysis
  allDepartments?: DepartmentCustomerAnalysis[]
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  allDepartments: () => [],
  loading: false
})

const emit = defineEmits<{
  'view-change': [view: string]
  'chart-click': [data: any]
  'comparison-change': [metric: string]
}>()

const currentComparison = ref<string>('profit')

const comparisonMetrics = [
  { key: 'profit', label: '毛利对比' },
  { key: 'customers', label: '客户数对比' },
  { key: 'growth', label: '增长率对比' }
]

// 对比图表数据
const comparisonChartData = computed(() => {
  if (!props.allDepartments.length) return { labels: [], datasets: [] }
  
  const departments = props.allDepartments.map(d => d.departmentName)
  let data = []
  let label = ''
  
  switch (currentComparison.value) {
    case 'profit':
      data = props.allDepartments.map(d => d.customerData.allCustomers.totalProfit / 10000)
      label = '总毛利 (万)'
      break
    case 'customers':
      data = props.allDepartments.map(d => d.customerData.allCustomers.activeCustomerCount)
      label = '客户数'
      break
    case 'growth':
      data = props.allDepartments.map(d => getGrowthRateForDept(d))
      label = '增长率 (%)'
      break
  }
  
  return {
    labels: departments,
    datasets: [{
      label,
      data,
      color: departments.map(name => 
        name === props.departmentCustomerAnalysis.departmentName ? '#1890ff' : '#d9d9d9'
      )
    }]
  }
})

// 改进建议
const recommendations = computed<Recommendation[]>(() => {
  const dept = props.departmentCustomerAnalysis
  const data = dept.customerData
  const suggestions: Recommendation[] = []
  
  // 基于排名生成建议
  if (dept.departmentRanking.profitRanking > 3) {
    suggestions.push({
      type: 'optimization',
      title: '提升毛利表现',
      description: '当前毛利排名较后，建议优化高价值客户服务，提升客户单价',
      priority: 'high'
    })
  }
  
  if (dept.departmentRanking.customerCountRanking > dept.departmentRanking.profitRanking) {
    suggestions.push({
      type: 'strategy',
      title: '平衡客户质量与数量',
      description: '客户数排名优于毛利排名，建议重点提升客户质量而非数量',
      priority: 'medium'
    })
  }
  
  const churnRate = (data.churnedCustomers.customerCount / 
    (data.allCustomers.activeCustomerCount + data.churnedCustomers.customerCount)) * 100
  
  if (churnRate > 10) {
    suggestions.push({
      type: 'retention',
      title: '加强客户保留',
      description: `客户流失率达${churnRate.toFixed(1)}%，建议加强客户关系维护`,
      priority: 'high'
    })
  }
  
  if (data.newCustomers.activeCustomerCount < data.oldCustomers.activeCustomerCount * 0.3) {
    suggestions.push({
      type: 'acquisition',
      title: '增加新客户获取',
      description: '新客户占比偏低，建议加强市场开拓和客户获取',
      priority: 'medium'
    })
  }
  
  return suggestions
})

// 方法
const handleViewChange = (view: string) => {
  emit('view-change', view)
}

const handleChartClick = (data: any) => {
  emit('chart-click', data)
}

const handleComparisonChartClick = (params: any) => {
  console.log('Comparison chart clicked:', params)
}

const handleRecommendationAction = (recommendation: Recommendation) => {
  console.log('Recommendation action:', recommendation)
}

const formatCurrency = (value: number): string => {
  if (value >= 100000000) {
    return `¥${(value / 100000000).toFixed(2)}亿`
  } else if (value >= 10000) {
    return `¥${(value / 10000).toFixed(2)}万`
  } else {
    return `¥${value.toLocaleString()}`
  }
}

const getRankingClass = (type = 'profit') => {
  let ranking = props.departmentCustomerAnalysis.departmentRanking.profitRanking
  if (type === 'customer') ranking = props.departmentCustomerAnalysis.departmentRanking.customerCountRanking
  if (type === 'growth') ranking = props.departmentCustomerAnalysis.departmentRanking.growthRanking
  
  if (ranking === 1) return 'ranking-first'
  if (ranking <= 3) return 'ranking-top'
  return 'ranking-normal'
}

const getRankingDescription = (type: 'profit' | 'customer' | 'growth') => {
  const rankings = props.departmentCustomerAnalysis.departmentRanking
  let ranking = rankings.profitRanking
  
  if (type === 'customer') ranking = rankings.customerCountRanking
  if (type === 'growth') ranking = rankings.growthRanking
  
  if (ranking === 1) return '表现优异'
  if (ranking <= 3) return '表现良好'
  if (ranking <= 5) return '表现一般'
  return '需要改进'
}

const getGrowthRateForDept = (dept: DepartmentCustomerAnalysis) => {
  const data = dept.customerData
  const total = data.allCustomers.activeCustomerCount + data.churnedCustomers.customerCount
  return total > 0 ? (data.newCustomers.activeCustomerCount / total * 100) : 0
}

const getAverageCustomerValue = () => {
  const data = props.departmentCustomerAnalysis.customerData.allCustomers
  return data.activeCustomerCount > 0 ? data.totalProfit / data.activeCustomerCount : 0
}

const getBenchmarkValue = () => {
  // 简化的基准值计算
  return getAverageCustomerValue() * 0.85
}

const getCustomerGrowthRate = () => {
  return getGrowthRateForDept(props.departmentCustomerAnalysis).toFixed(1)
}

const getPerformanceClass = () => {
  const ranking = props.departmentCustomerAnalysis.departmentRanking.profitRanking
  if (ranking === 1) return 'performance-excellent'
  if (ranking <= 3) return 'performance-good'
  return 'performance-normal'
}

const getPerformanceText = () => {
  const ranking = props.departmentCustomerAnalysis.departmentRanking.profitRanking
  if (ranking === 1) return '领先'
  if (ranking <= 3) return '优秀'
  return '一般'
}

const getImprovementText = () => {
  const rankings = props.departmentCustomerAnalysis.departmentRanking
  if (rankings.profitRanking > rankings.customerCountRanking) return '提升客户价值'
  if (rankings.customerCountRanking > rankings.profitRanking) return '增加客户数量'
  return '保持均衡发展'
}

const getAdvantageText = () => {
  const rankings = props.departmentCustomerAnalysis.departmentRanking
  if (rankings.profitRanking === 1) return '毛利表现出色'
  if (rankings.customerCountRanking === 1) return '客户数量领先'
  if (rankings.growthRanking === 1) return '增长速度最快'
  return '整体表现稳定'
}

const getRecommendationClass = (priority: string) => {
  return `recommendation-${priority}`
}

const getRecommendationIcon = (type: string) => {
  const iconMap = {
    acquisition: UserPlus,
    retention: Shield,
    optimization: TrendingUp,
    strategy: Lightbulb
  }
  return iconMap[type as keyof typeof iconMap] || AlertTriangle
}
</script>

<style scoped>
.department-customer-analysis-module {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-bottom: 24px;
}

.analysis-module__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.analysis-module__title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #262626;
}

.department-ranking {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.ranking-label {
  color: #8c8c8c;
}

.ranking-value {
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 12px;
}

.ranking-value.ranking-first {
  background: #fff7e6;
  color: #fa8c16;
}

.ranking-value.ranking-top {
  background: #f6ffed;
  color: #52c41a;
}

.ranking-value.ranking-normal {
  background: #f0f0f0;
  color: #8c8c8c;
}

.ranking-metric {
  color: #8c8c8c;
  font-size: 12px;
}

.analysis-module__content {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* 部门表现概览 */
.performance-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.performance-card {
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 16px;
}

.performance-card__header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  color: #1890ff;
  font-size: 14px;
  font-weight: 500;
}

.ranking-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.ranking-number {
  font-size: 24px;
  font-weight: 700;
  color: #262626;
}

.ranking-description {
  font-size: 12px;
  color: #8c8c8c;
}

/* 部门对比区域 */
.department-comparison-section {
  background: #fafafa;
  border-radius: 8px;
  padding: 24px;
}

.comparison-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.comparison-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #262626;
}

.comparison-toggle {
  display: flex;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  overflow: hidden;
}

.comparison-btn {
  padding: 6px 16px;
  background: #fff;
  border: none;
  color: #595959;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.comparison-btn:hover {
  background: #f5f5f5;
}

.comparison-btn--active {
  background: #1890ff;
  color: #fff;
}

.comparison-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
}

.comparison-chart {
  background: #fff;
  border-radius: 6px;
  padding: 16px;
}

.comparison-insights {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.insight-card,
.benchmark-card {
  background: #fff;
  border-radius: 6px;
  padding: 16px;
}

.insight-header,
.benchmark-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  color: #1890ff;
  font-size: 14px;
  font-weight: 600;
}

.insight-content,
.benchmark-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.insight-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.insight-label {
  font-size: 13px;
  color: #8c8c8c;
}

.insight-value {
  font-size: 13px;
  font-weight: 500;
  color: #262626;
}

.insight-value.performance-excellent {
  color: #52c41a;
}

.insight-value.performance-good {
  color: #1890ff;
}

.benchmark-metric {
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.benchmark-metric:last-child {
  border-bottom: none;
}

.metric-name {
  font-size: 13px;
  color: #8c8c8c;
  display: block;
  margin-bottom: 4px;
}

.metric-comparison {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.metric-current {
  font-size: 14px;
  font-weight: 600;
  color: #262626;
}

.metric-benchmark {
  font-size: 11px;
  color: #8c8c8c;
}

/* 改进建议区域 */
.department-recommendations {
  background: #f6ffed;
  border: 1px solid #b7eb8f;
  border-radius: 8px;
  padding: 20px;
}

.recommendations-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.recommendations-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #262626;
}

.recommendations-count {
  padding: 2px 8px;
  background: #52c41a;
  color: #fff;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 500;
}

.recommendations-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.recommendation-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: #fff;
  border-radius: 6px;
}

.recommendation-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #52c41a;
  color: white;
  flex-shrink: 0;
}

.recommendation-content {
  flex: 1;
}

.recommendation-title {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 600;
  color: #262626;
}

.recommendation-description {
  margin: 0;
  font-size: 13px;
  color: #595959;
  line-height: 1.5;
}

.action-btn {
  padding: 6px 12px;
  background: #1890ff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.2s;
}

.action-btn:hover {
  background: #40a9ff;
}

@media (max-width: 1200px) {
  .comparison-content {
    grid-template-columns: 1fr;
  }
  
  .comparison-insights {
    flex-direction: row;
  }
}

@media (max-width: 768px) {
  .department-customer-analysis-module {
    padding: 16px;
  }

  .analysis-module__header {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }

  .performance-cards {
    grid-template-columns: repeat(3, 1fr);
  }

  .comparison-header {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }

  .comparison-insights {
    flex-direction: column;
  }

  .recommendation-item {
    flex-direction: column;
    text-align: center;
    gap: 8px;
  }
}
</style>