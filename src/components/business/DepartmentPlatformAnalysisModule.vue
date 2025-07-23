<template>
  <div class="department-platform-analysis-module">
    <div class="analysis-module__header">
      <h3 class="analysis-module__title">部门平台分析及提成分析</h3>
      <div class="analysis-module__controls">
        <div class="department-performance">
          <span class="performance-label">平台表现:</span>
          <span class="performance-value" :class="getPlatformPerformanceClass()">
            {{ getPlatformPerformanceText() }}
          </span>
          <span class="performance-metric">{{ getDominantPlatform() }}</span>
        </div>
      </div>
    </div>

    <div class="analysis-module__content">
      <!-- 部门平台表现概览 -->
      <div class="department-platform-overview">
        <div class="platform-performance-cards">
          <div class="platform-card">
            <div class="platform-card__header">
              <Monitor :size="20" />
              <span>主要平台</span>
            </div>
            <div class="platform-card__content">
              <div class="platform-display">
                <span class="platform-name">{{ getDominantPlatform() }}</span>
                <span class="platform-percentage">{{ getDominantPlatformPercentage() }}%</span>
              </div>
              <div class="platform-description">占部门总业务量</div>
            </div>
          </div>

          <div class="platform-card">
            <div class="platform-card__header">
              <TrendingUp :size="20" />
              <span>平台数量</span>
            </div>
            <div class="platform-card__content">
              <div class="platform-display">
                <span class="platform-count">{{ getActivePlatformCount() }}</span>
                <span class="platform-unit">个</span>
              </div>
              <div class="platform-description">活跃平台数量</div>
            </div>
          </div>

          <div class="platform-card">
            <div class="platform-card__header">
              <BarChart3 :size="20" />
              <span>平台均衡度</span>
            </div>
            <div class="platform-card__content">
              <div class="platform-display">
                <span class="balance-score">{{ getPlatformBalanceScore() }}</span>
                <span class="balance-level">{{ getBalanceLevel() }}</span>
              </div>
              <div class="platform-description">业务分布均衡性</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 使用通用新订单服务费分析组件 -->
      <NewOrderServiceFeeModule
        :platform-data="platformDataForModule"
        :loading="loading"
        @platform-click="handlePlatformClick"
      />

      <!-- 部门平台对比分析 -->
      <div class="department-platform-comparison">
        <div class="comparison-header">
          <h4>与其他部门平台对比</h4>
          <div class="comparison-controls">
            <select v-model="currentPlatform" class="platform-selector">
              <option value="all">全平台</option>
              <option
                v-for="platform in availablePlatforms"
                :key="platform"
                :value="platform"
              >
                {{ platform }}
              </option>
            </select>
          </div>
        </div>

        <div class="comparison-content">
          <div class="comparison-chart">
            <BarChart
              :data="platformComparisonData"
              :height="'300px'"
              :show-legend="true"
              :stack="false"
              @click="handleComparisonChartClick"
            />
          </div>

          <div class="comparison-insights">
            <div class="insight-card">
              <div class="insight-header">
                <Target :size="20" />
                <span>平台洞察</span>
              </div>
              <div class="insight-content">
                <div class="insight-item">
                  <span class="insight-label">优势平台:</span>
                  <span class="insight-value">{{ getTopPlatform() }}</span>
                </div>
                <div class="insight-item">
                  <span class="insight-label">成长空间:</span>
                  <span class="insight-value">{{ getGrowthOpportunity() }}</span>
                </div>
                <div class="insight-item">
                  <span class="insight-label">风险评估:</span>
                  <span class="insight-value" :class="getRiskClass()">{{ getRiskLevel() }}</span>
                </div>
              </div>
            </div>

            <div class="strategy-card">
              <div class="strategy-header">
                <Lightbulb :size="20" />
                <span>策略建议</span>
              </div>
              <div class="strategy-content">
                <div
                  v-for="(strategy, index) in platformStrategies"
                  :key="index"
                  class="strategy-item"
                >
                  <div class="strategy-icon">
                    <component :is="getStrategyIcon(strategy.type)" :size="16" />
                  </div>
                  <div class="strategy-text">
                    <strong>{{ strategy.title }}:</strong> {{ strategy.description }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 提成分析区域 -->
      <div class="department-commission-analysis">
        <div class="commission-header">
          <h4>部门提成分析</h4>
        </div>

        <div class="commission-content">
          <div class="commission-overview">
            <div class="commission-card">
              <div class="commission-card__header">
                <DollarSign :size="24" />
                <h5>总提成</h5>
              </div>
              <div class="commission-card__content">
                <div class="commission-value">{{ formatCurrency(getTotalCommission()) }}</div>
                <div class="commission-growth" :class="getCommissionGrowthClass()">
                  <TrendingUp v-if="getCommissionGrowthRate() > 0" :size="14" />
                  <TrendingDown v-else :size="14" />
                  {{ Math.abs(getCommissionGrowthRate()).toFixed(1) }}%
                </div>
              </div>
            </div>

            <div class="commission-card">
              <div class="commission-card__header">
                <Users :size="24" />
                <h5>人均提成</h5>
              </div>
              <div class="commission-card__content">
                <div class="commission-value">{{ formatCurrency(getAverageCommission()) }}</div>
                <div class="commission-comparison">
                  vs 公司平均 {{ formatCurrency(getCompanyAverageCommission()) }}
                </div>
              </div>
            </div>

            <div class="commission-card">
              <div class="commission-card__header">
                <Percent :size="24" />
                <h5>提成率</h5>
              </div>
              <div class="commission-card__content">
                <div class="commission-value">{{ getCommissionRate().toFixed(2) }}%</div>
                <div class="commission-benchmark">
                  行业标准 3.5%-5.0%
                </div>
              </div>
            </div>
          </div>

          <div class="commission-distribution">
            <div class="distribution-chart">
              <PieChart
                :data="commissionDistributionData"
                :height="'250px'"
                :show-legend="true"
                @click="handleCommissionChartClick"
              />
            </div>
            <div class="distribution-insights">
              <h5>提成分布洞察</h5>
              <div class="distribution-metrics">
                <div class="metric-item">
                  <span class="metric-label">最高提成平台:</span>
                  <span class="metric-value">{{ getHighestCommissionPlatform() }}</span>
                </div>
                <div class="metric-item">
                  <span class="metric-label">提成集中度:</span>
                  <span class="metric-value">{{ getCommissionConcentration() }}%</span>
                </div>
                <div class="metric-item">
                  <span class="metric-label">优化潜力:</span>
                  <span class="metric-value">{{ getOptimizationPotential() }}</span>
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
import { Monitor, TrendingUp, TrendingDown, BarChart3, Target, Lightbulb, DollarSign, Users, Percent, ShoppingCart, Shield, Zap } from 'lucide-vue-next'
import NewOrderServiceFeeModule from './NewOrderServiceFeeModule.vue'
import BarChart from '@/components/charts/BarChart.vue'
import PieChart from '@/components/charts/PieChart.vue'
import type { DepartmentPlatformAnalysis, PlatformData } from '@/types'

interface PlatformStrategy {
  type: 'expansion' | 'optimization' | 'diversification'
  title: string
  description: string
}

interface PlatformDistributionItem {
  platform: string
  serviceFee: number
  orderCount: number
}

interface Props {
  departmentPlatformAnalysis: DepartmentPlatformAnalysis
  allDepartments?: DepartmentPlatformAnalysis[]
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  allDepartments: () => [],
  loading: false
})

const emit = defineEmits<{
  'view-change': [view: string]
  'chart-click': [data: unknown]
  'platform-change': [platform: string]
}>()

const currentPlatform = ref<string>('all')

// 将部门数据转换为 NewOrderServiceFeeModule 期望的格式
const platformDataForModule = computed((): PlatformData[] => {
  const distribution = props.departmentPlatformAnalysis.newOrderData.platformDistribution as PlatformDistributionItem[]
  const total = distribution.reduce((sum: number, item) => sum + item.serviceFee, 0)

  return distribution.map((item: PlatformDistributionItem, index: number) => ({
    platform: item.platform,
    serviceFee: item.serviceFee,
    orderCount: item.orderCount,
    percentage: total > 0 ? (item.serviceFee / total) * 100 : 0,
    color: ['#1890ff', '#52c41a', '#fa8c16', '#722ed1', '#eb2f96'][index % 5]
  }))
})

// 可用平台列表
const availablePlatforms = computed(() => {
  const platforms = new Set<string>()
  const distribution = props.departmentPlatformAnalysis.newOrderData.platformDistribution as PlatformDistributionItem[]
  distribution.forEach((item: PlatformDistributionItem) => {
    platforms.add(item.platform)
  })
  return Array.from(platforms)
})

// 平台策略建议
const platformStrategies = computed<PlatformStrategy[]>(() => {
  const strategies: PlatformStrategy[] = []
  const dominantPercentage = parseFloat(getDominantPlatformPercentage().toString())

  if (dominantPercentage > 60) {
    strategies.push({
      type: 'diversification',
      title: '分散风险',
      description: '主要平台占比过高，建议发展其他平台业务'
    })
  }

  if (getActivePlatformCount() < 3) {
    strategies.push({
      type: 'expansion',
      title: '扩展平台',
      description: '平台数量较少，建议开拓新的业务平台'
    })
  }

    const balanceScore = parseFloat(getPlatformBalanceScore())

  if (balanceScore < 60) {
    strategies.push({
      type: 'optimization',
      title: '优化配置',
      description: '平台业务分布不均，建议调整资源配置'
    })
  }

  return strategies
})

// 平台对比数据
const platformComparisonData = computed(() => {
  if (!props.allDepartments.length) return { labels: [], datasets: [] }

  const departments = props.allDepartments.map(d => d.departmentName)

  if (currentPlatform.value === 'all') {
    // 显示总业务量对比
    const data = props.allDepartments.map(d => {
      const distribution = d.newOrderData.platformDistribution as PlatformDistributionItem[]
      return distribution.reduce((sum: number, p: PlatformDistributionItem) => sum + p.orderCount, 0)
    })

    return {
      labels: departments,
      datasets: [{
        label: '总订单数',
        data,
        color: '#1890ff'
      }]
    }
  } else {
    // 显示特定平台对比
    const data = props.allDepartments.map(d => {
      const distribution = d.newOrderData.platformDistribution as PlatformDistributionItem[]
      const platform = distribution.find((p: PlatformDistributionItem) => p.platform === currentPlatform.value)
      return platform ? platform.orderCount : 0
    })

    return {
      labels: departments,
      datasets: [{
        label: `${currentPlatform.value}订单数`,
        data,
        color: '#1890ff'
      }]
    }
  }
})

// 提成分布数据
const commissionDistributionData = computed(() => {
  const distribution = props.departmentPlatformAnalysis.newOrderData.platformDistribution as PlatformDistributionItem[]

  return distribution.map((item: PlatformDistributionItem, index: number) => ({
    name: item.platform,
    value: item.serviceFee * 0.05, // 假设5%提成率
    color: ['#1890ff', '#52c41a', '#fa8c16', '#722ed1', '#eb2f96'][index % 5]
  }))
})

// 方法
const handlePlatformClick = (platform: string) => {
  emit('platform-change', platform)
}

const handleComparisonChartClick = (params: unknown) => {
  console.log('Platform comparison chart clicked:', params)
}

const handleCommissionChartClick = (params: unknown) => {
  console.log('Commission chart clicked:', params)
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

const getDominantPlatform = (): string => {
  const distribution = props.departmentPlatformAnalysis.newOrderData.platformDistribution as PlatformDistributionItem[]
  if (!distribution.length) return '暂无'

  const dominant = distribution.reduce((max: PlatformDistributionItem, current: PlatformDistributionItem) =>
    current.orderCount > max.orderCount ? current : max
  )
  return dominant.platform
}

const getDominantPlatformPercentage = (): string => {
  const distribution = props.departmentPlatformAnalysis.newOrderData.platformDistribution as PlatformDistributionItem[]
  const total = distribution.reduce((sum: number, item: PlatformDistributionItem) => sum + item.orderCount, 0)
  if (total === 0) return "0"

  const dominant = distribution.reduce((max: PlatformDistributionItem, current: PlatformDistributionItem) =>
    current.orderCount > max.orderCount ? current : max
  )
  return ((dominant.orderCount / total) * 100).toFixed(1)
}

const getActivePlatformCount = (): number => {
  const distribution = props.departmentPlatformAnalysis.newOrderData.platformDistribution as PlatformDistributionItem[]
  return distribution.filter((item: PlatformDistributionItem) => item.orderCount > 0).length
}

const getPlatformBalanceScore = (): string => {
  const distribution = props.departmentPlatformAnalysis.newOrderData.platformDistribution as PlatformDistributionItem[]
  const total = distribution.reduce((sum: number, item: PlatformDistributionItem) => sum + item.orderCount, 0)
  if (total === 0 || distribution.length === 0) return "0"

  // 计算基尼系数的简化版本
  const sortedShares = distribution
    .map((item: PlatformDistributionItem) => item.orderCount / total)
    .sort((a: number, b: number) => a - b)

  let gini = 0
  const n = sortedShares.length
  for (let i = 0; i < n; i++) {
    gini += (2 * (i + 1) - n - 1) * sortedShares[i]
  }
  gini = gini / (n * n)

  // 转换为均衡度分数 (0-100)
  return Math.max(0, (1 - gini) * 100).toFixed(0)
}

const getBalanceLevel = (): string => {
  const score = parseFloat(getPlatformBalanceScore())
  if (score >= 80) return '优秀'
  if (score >= 60) return '良好'
  if (score >= 40) return '一般'
  return '需优化'
}

const getPlatformPerformanceClass = (): string => {
  const score = parseFloat(getPlatformBalanceScore())
  if (score >= 80) return 'performance-excellent'
  if (score >= 60) return 'performance-good'
  return 'performance-warning'
}

const getPlatformPerformanceText = (): string => {
  const score = parseFloat(getPlatformBalanceScore())
  if (score >= 80) return '表现优秀'
  if (score >= 60) return '表现良好'
  return '需要改进'
}

const getTopPlatform = (): string => {
  return getDominantPlatform()
}

const getGrowthOpportunity = (): string => {
  const activePlatforms = getActivePlatformCount()
  const totalPlatforms = 5 // 假设总共有5个主要平台
  if (activePlatforms < totalPlatforms) {
    return `还有${totalPlatforms - activePlatforms}个平台可开拓`
  }
  return '专注现有平台深度经营'
}

const getRiskLevel = (): string => {
  const dominantPercentage = parseFloat(getDominantPlatformPercentage())
  if (dominantPercentage > 70) return '高风险'
  if (dominantPercentage > 50) return '中等风险'
  return '低风险'
}

const getRiskClass = (): string => {
  const risk = getRiskLevel()
  if (risk === '高风险') return 'risk-high'
  if (risk === '中等风险') return 'risk-medium'
  return 'risk-low'
}

const getStrategyIcon = (type: string) => {
  const iconMap = {
    expansion: ShoppingCart,
    optimization: Shield,
    diversification: Zap
  }
  return iconMap[type as keyof typeof iconMap] || Lightbulb
}

// 提成相关方法
const getTotalCommission = (): number => {
  const distribution = props.departmentPlatformAnalysis.newOrderData.platformDistribution as PlatformDistributionItem[]
  return distribution.reduce((sum: number, item: PlatformDistributionItem) => sum + (item.serviceFee * 0.05), 0)
}

const getCommissionGrowthRate = (): number => {
  // 模拟提成增长率
  return 12.5
}

const getCommissionGrowthClass = (): string => {
  const rate = getCommissionGrowthRate()
  return rate > 0 ? 'growth-positive' : 'growth-negative'
}

const getAverageCommission = (): number => {
  const totalCommission = getTotalCommission()
  // 假设部门有10个人
  return totalCommission / 10
}

const getCompanyAverageCommission = (): number => {
  return getAverageCommission() * 0.85 // 模拟公司平均值
}

const getCommissionRate = (): number => {
  const distribution = props.departmentPlatformAnalysis.newOrderData.platformDistribution as PlatformDistributionItem[]
  const totalRevenue = distribution.reduce((sum: number, item: PlatformDistributionItem) => sum + item.serviceFee, 0)
  const totalCommission = getTotalCommission()
  return totalRevenue > 0 ? (totalCommission / totalRevenue) * 100 : 0
}

const getHighestCommissionPlatform = (): string => {
  const distribution = props.departmentPlatformAnalysis.newOrderData.platformDistribution as PlatformDistributionItem[]
  if (!distribution.length) return '暂无'

  const highest = distribution.reduce((max: PlatformDistributionItem, current: PlatformDistributionItem) =>
    (current.serviceFee * 0.05) > (max.serviceFee * 0.05) ? current : max
  )
  return highest.platform
}

const getCommissionConcentration = (): string => {
  const distribution = props.departmentPlatformAnalysis.newOrderData.platformDistribution as PlatformDistributionItem[]
  const totalCommission = getTotalCommission()
  if (totalCommission === 0) return "0"

  const topTwoCommission = distribution
    .map((item: PlatformDistributionItem) => item.serviceFee * 0.05)
    .sort((a: number, b: number) => b - a)
    .slice(0, 2)
    .reduce((sum: number, value: number) => sum + value, 0)

  return ((topTwoCommission / totalCommission) * 100).toFixed(1)
}

const getOptimizationPotential = (): string => {
  const concentration = parseFloat(getCommissionConcentration())
  if (concentration > 80) return '高潜力'
  if (concentration > 60) return '中等潜力'
  return '低潜力'
}
</script>

<style scoped>
.department-platform-analysis-module {
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

.department-performance {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.performance-label {
  color: #8c8c8c;
}

.performance-value {
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 12px;
}

.performance-value.performance-excellent {
  background: #f6ffed;
  color: #52c41a;
}

.performance-value.performance-good {
  background: #e6f7ff;
  color: #1890ff;
}

.performance-value.performance-warning {
  background: #fff7e6;
  color: #fa8c16;
}

.performance-metric {
  color: #8c8c8c;
  font-size: 12px;
}

.analysis-module__content {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* 部门平台表现概览 */
.platform-performance-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.platform-card {
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 16px;
}

.platform-card__header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  color: #1890ff;
  font-size: 14px;
  font-weight: 500;
}

.platform-display {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 4px;
}

.platform-name,
.platform-count,
.balance-score {
  font-size: 24px;
  font-weight: 700;
  color: #262626;
}

.platform-percentage,
.platform-unit,
.balance-level {
  font-size: 14px;
  color: #8c8c8c;
}

.platform-description {
  font-size: 12px;
  color: #8c8c8c;
}

/* 部门平台对比 */
.department-platform-comparison {
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

.platform-selector {
  padding: 6px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  background: #fff;
  color: #595959;
  font-size: 14px;
  outline: none;
}

.platform-selector:focus {
  border-color: #40a9ff;
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
.strategy-card {
  background: #fff;
  border-radius: 6px;
  padding: 16px;
}

.insight-header,
.strategy-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  color: #1890ff;
  font-size: 14px;
  font-weight: 600;
}

.insight-content {
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

.insight-value.risk-high {
  color: #ff4d4f;
}

.insight-value.risk-medium {
  color: #fa8c16;
}

.insight-value.risk-low {
  color: #52c41a;
}

.strategy-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.strategy-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 8px;
  background: #f9f9f9;
  border-radius: 4px;
}

.strategy-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #1890ff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.strategy-text {
  font-size: 12px;
  color: #595959;
  line-height: 1.4;
}

/* 提成分析区域 */
.department-commission-analysis {
  background: #f0f9ff;
  border: 1px solid #bae7ff;
  border-radius: 8px;
  padding: 24px;
}

.commission-header h4 {
  margin: 0 0 20px 0;
  font-size: 16px;
  font-weight: 600;
  color: #262626;
}

.commission-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.commission-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.commission-card {
  background: #fff;
  border-radius: 6px;
  padding: 16px;
}

.commission-card__header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  color: #1890ff;
}

.commission-card__header h5 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
}

.commission-value {
  font-size: 20px;
  font-weight: 700;
  color: #262626;
  margin-bottom: 4px;
}

.commission-growth {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 500;
}

.commission-growth.growth-positive {
  color: #52c41a;
}

.commission-growth.growth-negative {
  color: #ff4d4f;
}

.commission-comparison,
.commission-benchmark {
  font-size: 12px;
  color: #8c8c8c;
}

.commission-distribution {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.distribution-chart {
  background: #fff;
  border-radius: 6px;
  padding: 16px;
}

.distribution-insights {
  background: #fff;
  border-radius: 6px;
  padding: 16px;
}

.distribution-insights h5 {
  margin: 0 0 16px 0;
  font-size: 14px;
  font-weight: 600;
  color: #262626;
}

.distribution-metrics {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.metric-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.metric-item:last-child {
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

@media (max-width: 1200px) {
  .comparison-content,
  .commission-distribution {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .department-platform-analysis-module {
    padding: 16px;
  }

  .analysis-module__header {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }

  .platform-performance-cards,
  .commission-overview {
    grid-template-columns: repeat(2, 1fr);
  }

  .comparison-header {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
}
</style>
