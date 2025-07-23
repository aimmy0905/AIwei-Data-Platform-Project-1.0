<template>
  <div class="optimizer-metrics-cards">
    <div class="metrics-cards-grid">
      <!-- 负责客户数 -->
      <div class="metrics-card card--customers">
        <div class="metrics-card__header">
          <div class="card-icon">
            <Users :size="24" />
          </div>
          <div class="card-meta">
            <h3 class="card-title">负责客户数</h3>
            <div class="card-growth" :class="getGrowthClass(metrics.monthlyGrowth.customerGrowth)">
              <TrendingUp v-if="metrics.monthlyGrowth.customerGrowth > 0" :size="14" />
              <TrendingDown v-else :size="14" />
              {{ Math.abs(metrics.monthlyGrowth.customerGrowth).toFixed(1) }}%
            </div>
          </div>
        </div>
        <div class="metrics-card__content">
          <div class="card-value">{{ metrics.customerCount }}家</div>
          <div class="card-description">
            平台: {{ getPlatformName(metrics.platform) }}
          </div>
        </div>
      </div>

      <!-- 个人毛利完成 -->
      <div class="metrics-card card--profit">
        <div class="metrics-card__header">
          <div class="card-icon">
            <DollarSign :size="24" />
          </div>
          <div class="card-meta">
            <h3 class="card-title">个人毛利完成</h3>
            <div class="card-growth" :class="getGrowthClass(metrics.monthlyGrowth.profitGrowth)">
              <TrendingUp v-if="metrics.monthlyGrowth.profitGrowth > 0" :size="14" />
              <TrendingDown v-else :size="14" />
              {{ Math.abs(metrics.monthlyGrowth.profitGrowth).toFixed(1) }}%
            </div>
          </div>
        </div>
        <div class="metrics-card__content">
          <div class="card-value">{{ formatCurrency(metrics.totalProfit) }}</div>
          <div class="card-description">
            目标完成率: {{ metrics.targetCompletion.toFixed(1) }}%
          </div>
          <div class="progress-bar">
            <div 
              class="progress-fill"
              :class="getProgressClass(metrics.targetCompletion)"
              :style="{ width: Math.min(metrics.targetCompletion, 100) + '%' }"
            ></div>
          </div>
        </div>
      </div>

      <!-- 平台ROI -->
      <div class="metrics-card card--roi">
        <div class="metrics-card__header">
          <div class="card-icon">
            <TrendingUp :size="24" />
          </div>
          <div class="card-meta">
            <h3 class="card-title">{{ getPlatformName(metrics.platform) }} ROI</h3>
            <div class="card-growth" :class="getGrowthClass(metrics.monthlyGrowth.roiGrowth)">
              <TrendingUp v-if="metrics.monthlyGrowth.roiGrowth > 0" :size="14" />
              <TrendingDown v-else :size="14" />
              {{ Math.abs(metrics.monthlyGrowth.roiGrowth).toFixed(1) }}%
            </div>
          </div>
        </div>
        <div class="metrics-card__content">
          <div class="card-value">{{ metrics.platformROI.toFixed(2) }}</div>
          <div class="card-description">
            投入产出比
          </div>
          <div class="roi-indicator">
            <div class="roi-level" :class="getROILevelClass(metrics.platformROI)">
              {{ getROILevel(metrics.platformROI) }}
            </div>
          </div>
        </div>
      </div>

      <!-- 账户余额预警数 -->
      <div class="metrics-card card--alerts">
        <div class="metrics-card__header">
          <div class="card-icon">
            <AlertTriangle :size="24" />
          </div>
          <div class="card-meta">
            <h3 class="card-title">账户余额预警</h3>
            <div class="alert-level" :class="getAlertLevelClass()">
              {{ getAlertLevel() }}
            </div>
          </div>
        </div>
        <div class="metrics-card__content">
          <div class="card-value alert-value">{{ metrics.lowBalanceAccounts }}个</div>
          <div class="card-description">
            需要关注的账户
          </div>
          <div class="alert-actions">
            <button class="alert-btn" @click="$emit('view-alerts')" v-if="metrics.lowBalanceAccounts > 0">
              查看详情
            </button>
            <span class="no-alerts" v-else>
              <CheckCircle :size="16" />
              暂无预警
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 个人表现总结 -->
    <div class="performance-summary" v-if="showSummary">
      <div class="summary-header">
        <h4>个人表现总结</h4>
        <button class="toggle-summary" @click="$emit('toggle-summary')">
          <ChevronUp v-if="showSummary" :size="20" />
          <ChevronDown v-else :size="20" />
        </button>
      </div>
      <div class="summary-content">
        <div class="summary-insights">
          <div class="insight-item" :class="getOverallPerformanceClass()">
            <span class="insight-icon">📊</span>
            <div class="insight-text">
              <strong>整体表现:</strong> {{ getOverallPerformanceText() }}
            </div>
          </div>
          <div class="insight-item">
            <span class="insight-icon">🎯</span>
            <div class="insight-text">
              <strong>改进建议:</strong> {{ getImprovementSuggestion() }}
            </div>
          </div>
          <div class="insight-item">
            <span class="insight-icon">🚀</span>
            <div class="insight-text">
              <strong>下月目标:</strong> {{ getNextMonthGoal() }}
            </div>
          </div>
        </div>
        
        <!-- 快速操作按钮 -->
        <div class="quick-actions">
          <button class="action-btn" @click="$emit('optimize-accounts')">
            <Zap :size="16" />
            优化账户
          </button>
          <button class="action-btn" @click="$emit('check-budgets')">
            <CreditCard :size="16" />
            检查预算
          </button>
          <button class="action-btn" @click="$emit('analyze-performance')">
            <BarChart3 :size="16" />
            效果分析
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Users, DollarSign, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, ChevronUp, ChevronDown, Zap, CreditCard, BarChart3 } from 'lucide-vue-next'
import type { OptimizerMetrics } from '@/types'

interface Props {
  metrics: OptimizerMetrics
  showSummary?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showSummary: false,
  loading: false
})

const emit = defineEmits<{
  'view-alerts': []
  'toggle-summary': []
  'optimize-accounts': []
  'check-budgets': []
  'analyze-performance': []
  'view-details': [section: string]
}>()

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

const getGrowthClass = (rate: number) => {
  return rate > 0 ? 'growth-positive' : rate < 0 ? 'growth-negative' : 'growth-neutral'
}

const getProgressClass = (rate: number) => {
  if (rate >= 100) return 'progress-excellent'
  if (rate >= 80) return 'progress-good'
  if (rate >= 60) return 'progress-warning'
  return 'progress-poor'
}

const getPlatformName = (platform: string) => {
  const platformNames = {
    google: 'Google',
    meta: 'Meta',
    criteo: 'Criteo',
    bing: 'Bing'
  }
  return platformNames[platform as keyof typeof platformNames] || platform
}

const getROILevel = (roi: number) => {
  if (roi >= 4) return '优秀'
  if (roi >= 3) return '良好'
  if (roi >= 2) return '一般'
  return '需改进'
}

const getROILevelClass = (roi: number) => {
  if (roi >= 4) return 'roi-excellent'
  if (roi >= 3) return 'roi-good'
  if (roi >= 2) return 'roi-warning'  
  return 'roi-poor'
}

const getAlertLevel = () => {
  const count = props.metrics.lowBalanceAccounts
  if (count === 0) return '正常'
  if (count <= 2) return '轻度预警'
  if (count <= 5) return '中度预警'
  return '严重预警'
}

const getAlertLevelClass = () => {
  const count = props.metrics.lowBalanceAccounts
  if (count === 0) return 'alert-normal'
  if (count <= 2) return 'alert-light'
  if (count <= 5) return 'alert-medium'
  return 'alert-severe'
}

const getOverallPerformanceClass = () => {
  const completion = props.metrics.targetCompletion
  const roi = props.metrics.platformROI
  const avgScore = (completion + roi * 25) / 2
  
  if (avgScore >= 90) return 'performance-excellent'
  if (avgScore >= 75) return 'performance-good'
  if (avgScore >= 60) return 'performance-warning'
  return 'performance-poor'
}

const getOverallPerformanceText = () => {
  const completion = props.metrics.targetCompletion
  const roi = props.metrics.platformROI
  
  if (completion >= 90 && roi >= 3.5) return '表现优异，继续保持！'
  if (completion >= 80 && roi >= 3) return '表现良好，有提升空间'
  if (completion >= 60 && roi >= 2.5) return '表现一般，需要优化'
  return '表现待改进，建议重点关注'
}

const getImprovementSuggestion = () => {
  const completion = props.metrics.targetCompletion
  const roi = props.metrics.platformROI
  const alerts = props.metrics.lowBalanceAccounts
  
  if (alerts > 3) return '优先处理账户余额预警，避免广告投放中断'
  if (completion < 80) return '加强目标达成，分析未完成原因'
  if (roi < 3) return '优化投放策略，提高投资回报率'
  return '保持当前优化策略，关注长期表现'
}

const getNextMonthGoal = () => {
  const currentCompletion = props.metrics.targetCompletion
  const growthRate = props.metrics.monthlyGrowth.profitGrowth
  
  if (currentCompletion >= 100) return '维持高水平表现，探索新增长点'
  if (growthRate > 0) return `在当前增长基础上，争取完成率达到${Math.min(currentCompletion + 10, 100).toFixed(0)}%`
  return '扭转下降趋势，重回增长轨道'
}
</script>

<style scoped>
.optimizer-metrics-cards {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-bottom: 24px;
}

/* 卡片网格 */
.metrics-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.metrics-card {
  background: #fafafa;
  border-radius: 8px;
  padding: 20px;
  border-left: 4px solid #d9d9d9;
  transition: all 0.3s ease;
  cursor: pointer;
}

.metrics-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.metrics-card.card--customers {
  border-left-color: #1890ff;
}

.metrics-card.card--profit {
  border-left-color: #52c41a;
}

.metrics-card.card--roi {
  border-left-color: #722ed1;
}

.metrics-card.card--alerts {
  border-left-color: #fa8c16;
}

.metrics-card__header {
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.card--customers .card-icon {
  background: linear-gradient(135deg, #1890ff 0%, #40a9ff 100%);
}

.card--profit .card-icon {
  background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
}

.card--roi .card-icon {
  background: linear-gradient(135deg, #722ed1 0%, #9254de 100%);
}

.card--alerts .card-icon {
  background: linear-gradient(135deg, #fa8c16 0%, #ffa940 100%);
}

.card-meta {
  flex: 1;
}

.card-title {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 600;
  color: #595959;
}

.card-growth {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 500;
}

.card-growth.growth-positive {
  color: #52c41a;
}

.card-growth.growth-negative {
  color: #ff4d4f;
}

.card-growth.growth-neutral {
  color: #8c8c8c;
}

.alert-level {
  font-size: 12px;
  font-weight: 500;
  padding: 2px 6px;
  border-radius: 10px;
}

.alert-level.alert-normal {
  background: #f6ffed;
  color: #52c41a;
}

.alert-level.alert-light {
  background: #fff7e6;
  color: #fa8c16;
}

.alert-level.alert-medium {
  background: #fff2f0;
  color: #ff4d4f;
}

.alert-level.alert-severe {
  background: #ff4d4f;
  color: #fff;
}

.metrics-card__content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.card-value {
  font-size: 28px;
  font-weight: 700;
  color: #262626;
  line-height: 1.2;
}

.card-value.alert-value {
  color: #fa8c16;
}

.card-description {
  font-size: 13px;
  color: #8c8c8c;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: #f0f0f0;
  border-radius: 3px;
  overflow: hidden;
  margin-top: 4px;
}

.progress-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.8s ease;
}

.progress-fill.progress-excellent {
  background: #52c41a;
}

.progress-fill.progress-good {
  background: #1890ff;
}

.progress-fill.progress-warning {
  background: #fa8c16;
}

.progress-fill.progress-poor {
  background: #ff4d4f;
}

.roi-indicator {
  margin-top: 4px;
}

.roi-level {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
}

.roi-level.roi-excellent {
  background: #f6ffed;
  color: #52c41a;
}

.roi-level.roi-good {
  background: #e6f7ff;
  color: #1890ff;
}

.roi-level.roi-warning {
  background: #fff7e6;
  color: #fa8c16;
}

.roi-level.roi-poor {
  background: #fff2f0;
  color: #ff4d4f;
}

.alert-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
}

.alert-btn {
  padding: 6px 12px;
  background: #fa8c16;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.2s;
}

.alert-btn:hover {
  background: #ffa940;
}

.no-alerts {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #52c41a;
}

/* 个人表现总结 */
.performance-summary {
  border-top: 1px solid #f0f0f0;
  padding-top: 24px;
}

.summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.summary-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #262626;
}

.toggle-summary {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  background: none;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  color: #595959;
  cursor: pointer;
  transition: all 0.2s;
}

.toggle-summary:hover {
  border-color: #40a9ff;
  color: #40a9ff;
}

.summary-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.summary-insights {
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
  background: #fafafa;
}

.insight-item.performance-excellent {
  background: #f6ffed;
}

.insight-item.performance-good {
  background: #e6f7ff;
}

.insight-item.performance-warning {
  background: #fff7e6;
}

.insight-item.performance-poor {
  background: #fff2f0;
}

.insight-text {
  font-size: 13px;
  color: #595959;
  line-height: 1.5;
}

.quick-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: #1890ff;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  transition: background-color 0.2s;
}

.action-btn:hover {
  background: #40a9ff;
}

@media (max-width: 768px) {
  .optimizer-metrics-cards {
    padding: 16px;
  }

  .metrics-cards-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .metrics-card {
    padding: 16px;
  }

  .card-icon {
    width: 40px;
    height: 40px;
  }

  .card-value {
    font-size: 24px;
  }

  .summary-header {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }

  .quick-actions {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .metrics-cards-grid {
    grid-template-columns: 1fr;
  }
}
</style>