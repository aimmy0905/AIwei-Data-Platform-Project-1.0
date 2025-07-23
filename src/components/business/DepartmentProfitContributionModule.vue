<template>
  <div class="department-profit-contribution-module">
    <div class="profit-module__header">
      <h3 class="profit-module__title">部门毛利贡献及客户分析</h3>
      <div class="profit-module__controls">
        <div class="contribution-summary">
          <span class="summary-label">部门贡献:</span>
          <span class="summary-value" :class="getContributionClass()">
            {{ getContributionPercentage() }}%
          </span>
          <span class="summary-metric">占公司总毛利</span>
        </div>
      </div>
    </div>

    <div class="profit-module__content">
      <!-- 部门毛利贡献概览 -->
      <div class="department-profit-overview">
        <div class="profit-contribution-cards">
          <div class="contribution-card">
            <div class="contribution-card__header">
              <div class="card-icon profit-icon">
                <TrendingUp :size="24" />
              </div>
              <div class="card-meta">
                <h4>总毛利贡献</h4>
                <div class="contribution-trend" :class="getTrendClass()">
                  <TrendingUp v-if="getProfitGrowthRate() > 0" :size="14" />
                  <TrendingDown v-else :size="14" />
                  {{ Math.abs(getProfitGrowthRate()).toFixed(1) }}%
                </div>
              </div>
            </div>
            <div class="contribution-card__content">
              <div class="contribution-value">{{ formatCurrency(getTotalProfit()) }}</div>
              <div class="contribution-description">
                在{{ departmentProfitContribution.totalDepartments }}个部门中排名 #{{ departmentProfitContribution.departmentRanking }}
              </div>
              <div class="progress-bar">
                <div
                  class="progress-fill"
                  :class="getRankingProgressClass()"
                  :style="{ width: getProgressWidth() + '%' }"
                ></div>
              </div>
            </div>
          </div>

          <div class="contribution-card">
            <div class="contribution-card__header">
              <div class="card-icon customer-icon">
                <Users :size="24" />
              </div>
              <div class="card-meta">
                <h4>客户质量指数</h4>
                <div class="quality-score">
                  {{ getCustomerQualityScore() }}分
                </div>
              </div>
            </div>
            <div class="contribution-card__content">
              <div class="quality-metrics">
                <div class="quality-metric">
                  <span class="metric-label">平均客户价值</span>
                  <span class="metric-value">{{ formatCurrency(getAverageCustomerValue()) }}</span>
                </div>
                <div class="quality-metric">
                  <span class="metric-label">高价值客户占比</span>
                  <span class="metric-value">{{ getHighValueCustomerRatio() }}%</span>
                </div>
              </div>
            </div>
          </div>

          <div class="contribution-card">
            <div class="contribution-card__header">
              <div class="card-icon efficiency-icon">
                <Zap :size="24" />
              </div>
              <div class="card-meta">
                <h4>效率指标</h4>
                <div class="efficiency-rating">
                  {{ getEfficiencyRating() }}
                </div>
              </div>
            </div>
            <div class="contribution-card__content">
              <div class="efficiency-metrics">
                <div class="efficiency-metric">
                  <span class="metric-label">人均产出</span>
                  <span class="metric-value">{{ formatCurrency(getPerCapitaOutput()) }}</span>
                </div>
                <div class="efficiency-metric">
                  <span class="metric-label">客户转化率</span>
                  <span class="metric-value">{{ getCustomerConversionRate() }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 部门毛利构成分析 -->
      <div class="department-profit-composition">
        <div class="composition-header">
          <h4>毛利构成分析</h4>
          <div class="composition-controls">
            <div class="view-toggle">
              <button
                v-for="view in compositionViews"
                :key="view.key"
                class="toggle-btn"
                :class="{ 'toggle-btn--active': currentCompositionView === view.key }"
                @click="currentCompositionView = view.key"
              >
                {{ view.label }}
              </button>
            </div>
          </div>
        </div>

        <div class="composition-content">
          <div class="composition-chart">
            <PieChart
              :data="profitCompositionData"
              :height="'320px'"
              :show-legend="true"
              @click="handleCompositionChartClick"
            />
          </div>

          <div class="composition-details">
            <div class="details-header">
              <h5>构成明细</h5>
              <span class="total-amount">总计: {{ formatCurrency(getTotalProfit()) }}</span>
            </div>
            <div class="details-list">
              <div
                v-for="(item, index) in getCompositionDetails()"
                :key="index"
                class="detail-item"
                :class="getDetailItemClass(item.type)"
              >
                <div class="detail-info">
                  <div class="detail-name">{{ item.name }}</div>
                  <div class="detail-description">{{ item.description }}</div>
                </div>
                <div class="detail-values">
                  <div class="detail-amount">{{ formatCurrency(item.amount) }}</div>
                  <div class="detail-percentage">{{ item.percentage.toFixed(1) }}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 部门客户贡献分析 -->
      <div class="department-customer-contribution">
        <div class="customer-contribution-header">
          <h4>客户贡献分析</h4>
          <div class="contribution-stats">
            <div class="stat-item">
              <span class="stat-value">{{ getTopCustomersCount() }}</span>
              <span class="stat-label">核心客户</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ getTopCustomersContribution() }}%</span>
              <span class="stat-label">贡献占比</span>
            </div>
          </div>
        </div>

        <div class="customer-contribution-content">
          <div class="contribution-chart">
            <BarChart
              :data="customerContributionData"
              :height="'300px'"
              :show-legend="false"
              :stack="false"
              @click="handleCustomerChartClick"
            />
          </div>

          <div class="contribution-insights">
            <div class="insights-header">
              <Target :size="20" />
              <h5>贡献洞察</h5>
            </div>
            <div class="insights-content">
              <div class="insight-item" :class="getConcentrationRiskClass()">
                <span class="insight-icon">⚠️</span>
                <div class="insight-text">
                  <strong>客户集中度风险:</strong> {{ getConcentrationRiskText() }}
                </div>
              </div>
              <div class="insight-item">
                <span class="insight-icon">📈</span>
                <div class="insight-text">
                  <strong>增长机会:</strong> {{ getGrowthOpportunityText() }}
                </div>
              </div>
              <div class="insight-item">
                <span class="insight-icon">🎯</span>
                <div class="insight-text">
                  <strong>优化建议:</strong> {{ getOptimizationSuggestion() }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 部门对比基准 -->
      <div class="department-benchmark-comparison">
        <div class="benchmark-header">
          <h4>部门对比基准</h4>
        </div>

        <div class="benchmark-content">
          <div class="benchmark-metrics">
            <div class="benchmark-metric">
              <div class="metric-header">
                <span class="metric-name">毛利率</span>
                <span class="metric-ranking">#{{ departmentProfitContribution.departmentRanking }}</span>
              </div>
              <div class="metric-comparison">
                <div class="comparison-bar">
                  <div class="bar-fill" :style="{ width: '75%' }"></div>
                  <div class="bar-indicator" :style="{ left: getDepartmentPosition() + '%' }"></div>
                </div>
                <div class="comparison-values">
                  <span class="value-current">{{ getProfitMargin().toFixed(1) }}%</span>
                  <span class="value-average">行业平均 25.8%</span>
                </div>
              </div>
            </div>

            <div class="benchmark-metric">
              <div class="metric-header">
                <span class="metric-name">客户价值</span>
                <span class="metric-status" :class="getValueStatusClass()">{{ getValueStatus() }}</span>
              </div>
              <div class="metric-comparison">
                <div class="comparison-bar">
                  <div class="bar-fill" :style="{ width: '68%' }"></div>
                  <div class="bar-indicator" :style="{ left: getValuePosition() + '%' }"></div>
                </div>
                <div class="comparison-values">
                  <span class="value-current">{{ formatCurrency(getAverageCustomerValue()) }}</span>
                  <span class="value-average">部门平均 {{ formatCurrency(getDepartmentAverageValue()) }}</span>
                </div>
              </div>
            </div>

            <div class="benchmark-metric">
              <div class="metric-header">
                <span class="metric-name">成长性</span>
                <span class="metric-trend" :class="getGrowthTrendClass()">{{ getGrowthTrend() }}</span>
              </div>
              <div class="metric-comparison">
                <div class="comparison-bar">
                  <div class="bar-fill" :style="{ width: '82%' }"></div>
                  <div class="bar-indicator" :style="{ left: getGrowthPosition() + '%' }"></div>
                </div>
                <div class="comparison-values">
                  <span class="value-current">{{ getProfitGrowthRate().toFixed(1) }}%</span>
                  <span class="value-average">公司平均 15.2%</span>
                </div>
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
import { TrendingUp, TrendingDown, Users, Zap, Target } from 'lucide-vue-next'
import PieChart from '@/components/charts/PieChart.vue'
import BarChart from '@/components/charts/BarChart.vue'
import type { DepartmentProfitContribution } from '@/types'

interface Props {
  departmentProfitContribution: DepartmentProfitContribution
  allDepartments?: DepartmentProfitContribution[]
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  allDepartments: () => [],
  loading: false
})

const emit = defineEmits<{
  'view-change': [view: string]
  'chart-click': [data: unknown]
}>()

const currentCompositionView = ref<string>('platform')

const compositionViews = [
  { key: 'platform', label: '平台构成' },
  { key: 'service', label: '服务类型' },
  { key: 'customer', label: '客户分布' }
]

// 计算属性
const profitCompositionData = computed(() => {
  const data = props.departmentProfitContribution

  switch (currentCompositionView.value) {
    case 'platform':
      return [
        { name: 'Google', value: data.platformProfit.google, color: '#1890ff' },
        { name: 'Facebook', value: data.platformProfit.facebook, color: '#52c41a' },
        { name: 'Amazon', value: data.platformProfit.amazon, color: '#fa8c16' },
        { name: '其他', value: data.platformProfit.others, color: '#d9d9d9' }
      ]
    case 'service':
      return [
        { name: '广告投放', value: data.serviceProfit.advertising, color: '#722ed1' },
        { name: '优化服务', value: data.serviceProfit.optimization, color: '#13c2c2' },
        { name: '数据分析', value: data.serviceProfit.analytics, color: '#eb2f96' },
        { name: '咨询服务', value: data.serviceProfit.consulting, color: '#fa541c' }
      ]
    case 'customer':
      return [
        { name: 'A级客户', value: data.customerProfit.gradeA, color: '#52c41a' },
        { name: 'B级客户', value: data.customerProfit.gradeB, color: '#1890ff' },
        { name: 'C级客户', value: data.customerProfit.gradeC, color: '#fa8c16' }
      ]
    default:
      return []
  }
})

const customerContributionData = computed(() => {
  const data = props.departmentProfitContribution.topCustomers.slice(0, 10)

  return {
    labels: data.map(customer => customer.customerName),
    datasets: [{
      label: '毛利贡献',
      data: data.map(customer => customer.profitContribution / 10000),
      color: '#1890ff'
    }]
  }
})

// 方法
const handleCompositionChartClick = (params: unknown) => {
  console.log('Composition chart clicked:', params)
  emit('chart-click', { type: 'composition', data: params })
}

const handleCustomerChartClick = (params: unknown) => {
  console.log('Customer chart clicked:', params)
  emit('chart-click', { type: 'customer', data: params })
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

const getTotalProfit = () => {
  return props.departmentProfitContribution.totalProfit
}

const getContributionPercentage = () => {
  return props.departmentProfitContribution.contributionPercentage.toFixed(1)
}

const getContributionClass = () => {
  const percentage = props.departmentProfitContribution.contributionPercentage
  if (percentage >= 20) return 'contribution-high'
  if (percentage >= 10) return 'contribution-medium'
  return 'contribution-low'
}

const getProfitGrowthRate = () => {
  return props.departmentProfitContribution.profitGrowthRate
}

const getTrendClass = () => {
  return getProfitGrowthRate() > 0 ? 'trend-positive' : 'trend-negative'
}

const getRankingProgressClass = () => {
  const ranking = props.departmentProfitContribution.departmentRanking
  if (ranking === 1) return 'progress-first'
  if (ranking <= 3) return 'progress-top'
  return 'progress-normal'
}

const getProgressWidth = () => {
  const ranking = props.departmentProfitContribution.departmentRanking
  const total = props.departmentProfitContribution.totalDepartments
  return ((total - ranking + 1) / total) * 100
}

const getCustomerQualityScore = () => {
  return props.departmentProfitContribution.customerQualityScore
}

const getAverageCustomerValue = () => {
  return props.departmentProfitContribution.averageCustomerValue
}

const getHighValueCustomerRatio = () => {
  return props.departmentProfitContribution.highValueCustomerRatio.toFixed(1)
}

const getEfficiencyRating = () => {
  const score = props.departmentProfitContribution.efficiencyScore
  if (score >= 90) return '优秀'
  if (score >= 80) return '良好'
  if (score >= 70) return '一般'
  return '需改进'
}

const getPerCapitaOutput = () => {
  return props.departmentProfitContribution.perCapitaOutput
}

const getCustomerConversionRate = () => {
  return props.departmentProfitContribution.customerConversionRate.toFixed(1)
}

const getCompositionDetails = () => {
  const data = props.departmentProfitContribution
  const total = getTotalProfit()

  switch (currentCompositionView.value) {
    case 'platform':
      return [
        {
          name: 'Google',
          description: '搜索广告及展示广告',
          amount: data.platformProfit.google,
          percentage: (data.platformProfit.google / total) * 100,
          type: 'platform'
        },
        {
          name: 'Facebook',
          description: '社交媒体广告',
          amount: data.platformProfit.facebook,
          percentage: (data.platformProfit.facebook / total) * 100,
          type: 'platform'
        },
        {
          name: 'Amazon',
          description: '电商平台广告',
          amount: data.platformProfit.amazon,
          percentage: (data.platformProfit.amazon / total) * 100,
          type: 'platform'
        },
        {
          name: '其他',
          description: '其他平台广告',
          amount: data.platformProfit.others,
          percentage: (data.platformProfit.others / total) * 100,
          type: 'platform'
        }
      ]
    case 'service':
      return [
        {
          name: '广告投放',
          description: '广告账户管理与投放',
          amount: data.serviceProfit.advertising,
          percentage: (data.serviceProfit.advertising / total) * 100,
          type: 'service'
        },
        {
          name: '优化服务',
          description: '广告优化与策略调整',
          amount: data.serviceProfit.optimization,
          percentage: (data.serviceProfit.optimization / total) * 100,
          type: 'service'
        },
        {
          name: '数据分析',
          description: '数据报告与分析服务',
          amount: data.serviceProfit.analytics,
          percentage: (data.serviceProfit.analytics / total) * 100,
          type: 'service'
        },
        {
          name: '咨询服务',
          description: '战略咨询与培训',
          amount: data.serviceProfit.consulting,
          percentage: (data.serviceProfit.consulting / total) * 100,
          type: 'service'
        }
      ]
    default:
      return []
  }
}

const getDetailItemClass = (type: string) => {
  return `detail-item--${type}`
}

const getTopCustomersCount = () => {
  return props.departmentProfitContribution.topCustomers.filter(c => c.isCore).length
}

const getTopCustomersContribution = () => {
  const topCustomers = props.departmentProfitContribution.topCustomers.slice(0, 3)
  const topContribution = topCustomers.reduce((sum, customer) => sum + customer.profitContribution, 0)
  return ((topContribution / getTotalProfit()) * 100).toFixed(1)
}

const getConcentrationRiskClass = () => {
  const concentration = parseFloat(getTopCustomersContribution())
  if (concentration > 60) return 'insight-high-risk'
  if (concentration > 40) return 'insight-medium-risk'
  return 'insight-low-risk'
}

const getConcentrationRiskText = () => {
  const concentration = parseFloat(getTopCustomersContribution())
  if (concentration > 60) return '客户集中度过高，存在较大业务风险'
  if (concentration > 40) return '客户集中度偏高，建议分散客户结构'
  return '客户结构相对均衡，风险可控'
}

const getGrowthOpportunityText = () => {
  const growthRate = getProfitGrowthRate()
  if (growthRate > 20) return '增长势头强劲，可考虑扩大市场投入'
  if (growthRate > 10) return '稳定增长中，可适度扩张业务规模'
  return '增长缓慢，需要寻找新的增长点'
}

const getOptimizationSuggestion = () => {
  const efficiency = props.departmentProfitContribution.efficiencyScore
  if (efficiency < 70) return '提升服务效率，优化作业流程'
  if (efficiency < 85) return '加强团队协作，提升客户满意度'
  return '保持优秀表现，探索创新服务模式'
}

const getDepartmentPosition = () => {
  const ranking = props.departmentProfitContribution.departmentRanking
  const total = props.departmentProfitContribution.totalDepartments
  return ((total - ranking + 1) / total) * 100
}

const getProfitMargin = () => {
  return props.departmentProfitContribution.profitMargin
}

const getValueStatus = () => {
  const value = getAverageCustomerValue()
  if (value > 500000) return '优秀'
  if (value > 300000) return '良好'
  return '一般'
}

const getValueStatusClass = () => {
  const status = getValueStatus()
  if (status === '优秀') return 'status-excellent'
  if (status === '良好') return 'status-good'
  return 'status-normal'
}

const getValuePosition = () => {
  // 模拟位置计算
  return 68
}

const getDepartmentAverageValue = () => {
  return getAverageCustomerValue() * 0.85
}

const getGrowthTrend = () => {
  const rate = getProfitGrowthRate()
  if (rate > 15) return '快速增长'
  if (rate > 5) return '稳定增长'
  return '增长缓慢'
}

const getGrowthTrendClass = () => {
  const trend = getGrowthTrend()
  if (trend === '快速增长') return 'trend-fast'
  if (trend === '稳定增长') return 'trend-stable'
  return 'trend-slow'
}

const getGrowthPosition = () => {
  // 模拟位置计算
  return 82
}
</script>

<style scoped>
.department-profit-contribution-module {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-bottom: 24px;
}

.profit-module__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.profit-module__title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #262626;
}

.contribution-summary {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.summary-label {
  color: #8c8c8c;
}

.summary-value {
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 13px;
}

.summary-value.contribution-high {
  background: #f6ffed;
  color: #52c41a;
}

.summary-value.contribution-medium {
  background: #e6f7ff;
  color: #1890ff;
}

.summary-value.contribution-low {
  background: #fff7e6;
  color: #fa8c16;
}

.summary-metric {
  color: #8c8c8c;
  font-size: 12px;
}

.profit-module__content {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* 部门毛利贡献概览 */
.profit-contribution-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.contribution-card {
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 20px;
}

.contribution-card__header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 16px;
}

.card-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.profit-icon {
  background: linear-gradient(135deg, #722ed1 0%, #9254de 100%);
}

.customer-icon {
  background: linear-gradient(135deg, #1890ff 0%, #40a9ff 100%);
}

.efficiency-icon {
  background: linear-gradient(135deg, #fa8c16 0%, #ffa940 100%);
}

.card-meta {
  flex: 1;
}

.card-meta h4 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: #262626;
}

.contribution-trend,
.quality-score,
.efficiency-rating {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 500;
}

.contribution-trend.trend-positive {
  color: #52c41a;
}

.contribution-trend.trend-negative {
  color: #ff4d4f;
}

.quality-score,
.efficiency-rating {
  color: #1890ff;
  font-weight: 600;
}

.contribution-value {
  font-size: 28px;
  font-weight: 700;
  color: #262626;
  line-height: 1.2;
  margin-bottom: 8px;
}

.contribution-description {
  font-size: 13px;
  color: #8c8c8c;
  margin-bottom: 12px;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: #f0f0f0;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.8s ease;
}

.progress-fill.progress-first {
  background: #ffd700;
}

.progress-fill.progress-top {
  background: #52c41a;
}

.progress-fill.progress-normal {
  background: #1890ff;
}

.quality-metrics,
.efficiency-metrics {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.quality-metric,
.efficiency-metric {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px solid #f0f0f0;
}

.quality-metric:last-child,
.efficiency-metric:last-child {
  border-bottom: none;
}

.metric-label {
  font-size: 13px;
  color: #8c8c8c;
}

.metric-value {
  font-size: 13px;
  font-weight: 600;
  color: #262626;
}

/* 毛利构成分析 */
.department-profit-composition {
  background: #fafafa;
  border-radius: 8px;
  padding: 24px;
}

.composition-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.composition-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #262626;
}

.view-toggle {
  display: flex;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  overflow: hidden;
}

.toggle-btn {
  padding: 6px 16px;
  background: #fff;
  border: none;
  color: #595959;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.toggle-btn:hover {
  background: #f5f5f5;
}

.toggle-btn--active {
  background: #1890ff;
  color: #fff;
}

.composition-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.composition-chart {
  background: #fff;
  border-radius: 6px;
  padding: 16px;
}

.composition-details {
  background: #fff;
  border-radius: 6px;
  padding: 16px;
}

.details-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.details-header h5 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #262626;
}

.total-amount {
  font-size: 14px;
  font-weight: 600;
  color: #1890ff;
}

.details-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-radius: 6px;
  border-left: 4px solid #d9d9d9;
}

.detail-item--platform {
  background: #f0f9ff;
  border-left-color: #1890ff;
}

.detail-item--service {
  background: #f6ffed;
  border-left-color: #52c41a;
}

.detail-info {
  flex: 1;
}

.detail-name {
  font-size: 14px;
  font-weight: 600;
  color: #262626;
  margin-bottom: 2px;
}

.detail-description {
  font-size: 12px;
  color: #8c8c8c;
}

.detail-values {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.detail-amount {
  font-size: 14px;
  font-weight: 600;
  color: #262626;
}

.detail-percentage {
  font-size: 12px;
  color: #8c8c8c;
}

/* 客户贡献分析 */
.department-customer-contribution {
  background: #f0f9ff;
  border: 1px solid #bae7ff;
  border-radius: 8px;
  padding: 24px;
}

.customer-contribution-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.customer-contribution-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #262626;
}

.contribution-stats {
  display: flex;
  gap: 24px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  color: #1890ff;
}

.stat-label {
  font-size: 12px;
  color: #8c8c8c;
}

.customer-contribution-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
}

.contribution-chart {
  background: #fff;
  border-radius: 6px;
  padding: 16px;
}

.contribution-insights {
  background: #fff;
  border-radius: 6px;
  padding: 16px;
}

.insights-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  color: #1890ff;
}

.insights-header h5 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
}

.insights-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.insight-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 12px;
  border-radius: 6px;
}

.insight-item.insight-high-risk {
  background: #fff2f0;
}

.insight-item.insight-medium-risk {
  background: #fff7e6;
}

.insight-item.insight-low-risk {
  background: #f6ffed;
}

.insight-text {
  font-size: 13px;
  color: #595959;
  line-height: 1.5;
}

/* 部门对比基准 */
.department-benchmark-comparison {
  background: #fafafa;
  border-radius: 8px;
  padding: 24px;
}

.benchmark-header h4 {
  margin: 0 0 20px 0;
  font-size: 16px;
  font-weight: 600;
  color: #262626;
}

.benchmark-metrics {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.benchmark-metric {
  background: #fff;
  border-radius: 6px;
  padding: 20px;
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.metric-name {
  font-size: 14px;
  font-weight: 600;
  color: #262626;
}

.metric-ranking,
.metric-status,
.metric-trend {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: 500;
}

.metric-ranking {
  background: #e6f7ff;
  color: #1890ff;
}

.metric-status.status-excellent {
  background: #f6ffed;
  color: #52c41a;
}

.metric-status.status-good {
  background: #e6f7ff;
  color: #1890ff;
}

.metric-status.status-normal {
  background: #fff7e6;
  color: #fa8c16;
}

.metric-trend.trend-fast {
  background: #f6ffed;
  color: #52c41a;
}

.metric-trend.trend-stable {
  background: #e6f7ff;
  color: #1890ff;
}

.metric-trend.trend-slow {
  background: #fff7e6;
  color: #fa8c16;
}

.metric-comparison {
  position: relative;
}

.comparison-bar {
  position: relative;
  width: 100%;
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  margin-bottom: 8px;
}

.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #e6f7ff 0%, #1890ff 100%);
  border-radius: 4px;
  transition: width 0.8s ease;
}

.bar-indicator {
  position: absolute;
  top: -2px;
  width: 12px;
  height: 12px;
  background: #1890ff;
  border: 2px solid #fff;
  border-radius: 50%;
  transform: translateX(-50%);
  box-shadow: 0 2px 4px rgba(24, 144, 255, 0.4);
}

.comparison-values {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.value-current {
  font-size: 14px;
  font-weight: 600;
  color: #262626;
}

.value-average {
  font-size: 12px;
  color: #8c8c8c;
}

@media (max-width: 1200px) {
  .composition-content,
  .customer-contribution-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .department-profit-contribution-module {
    padding: 16px;
  }

  .profit-module__header {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }

  .profit-contribution-cards {
    grid-template-columns: 1fr;
  }

  .composition-header,
  .customer-contribution-header {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }

  .contribution-stats {
    justify-content: center;
  }
}
</style>
