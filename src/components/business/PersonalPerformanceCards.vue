<template>
  <div class="personal-performance-cards">
    <div class="performance-cards__header">
      <h3 class="performance-cards__title">个人绩效概览</h3>
      <div class="performance-cards__ranking">
        <div class="ranking-display">
          <Trophy :size="20" />
          <span class="ranking-text">团队排名</span>
          <span class="ranking-value" :class="getRankingClass()">
            {{ personalPerformance.teamRanking }}/{{ personalPerformance.totalTeamMembers }}
          </span>
        </div>
      </div>
    </div>

    <div class="performance-cards__grid">
      <!-- 服务费完成率 -->
      <div class="performance-card" :class="getCardClass(personalPerformance.serviceFeeCompletionRate)">
        <div class="performance-card__header">
          <div class="performance-card__icon">
            <DollarSign :size="24" />
          </div>
          <div class="performance-card__trend" :class="getTrendClass()">
            <component :is="getTrendIcon()" :size="16" />
            <span class="trend-value">{{ getTrendValue() }}%</span>
          </div>
        </div>
        
        <div class="performance-card__content">
          <div class="performance-card__title">服务费完成率</div>
          <div class="performance-card__main-value">
            {{ personalPerformance.serviceFeeCompletionRate.toFixed(1) }}%
          </div>
          
          <div class="performance-card__progress">
            <div class="progress-bar">
              <div 
                class="progress-fill"
                :class="getProgressClass(personalPerformance.serviceFeeCompletionRate)"
                :style="{ width: `${Math.min(personalPerformance.serviceFeeCompletionRate, 100)}%` }"
              ></div>
            </div>
            <div class="progress-info">
              <span class="progress-current">{{ formatCurrency(personalPerformance.serviceFeeActual) }}</span>
              <span class="progress-separator">/</span>
              <span class="progress-target">{{ formatCurrency(personalPerformance.serviceFeeTarget) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 新单完成率 -->
      <div class="performance-card" :class="getCardClass(personalPerformance.newOrdersCompletionRate)">
        <div class="performance-card__header">
          <div class="performance-card__icon">
            <Target :size="24" />
          </div>
          <div class="performance-card__level">
            <span class="level-badge" :class="getLevelClass(personalPerformance.newOrdersCompletionRate)">
              {{ getLevelText(personalPerformance.newOrdersCompletionRate) }}
            </span>
          </div>
        </div>
        
        <div class="performance-card__content">
          <div class="performance-card__title">新单完成率</div>
          <div class="performance-card__main-value">
            {{ personalPerformance.newOrdersCompletionRate.toFixed(1) }}%
          </div>
          
          <div class="performance-card__progress">
            <div class="progress-bar">
              <div 
                class="progress-fill"
                :class="getProgressClass(personalPerformance.newOrdersCompletionRate)"
                :style="{ width: `${Math.min(personalPerformance.newOrdersCompletionRate, 100)}%` }"
              ></div>
            </div>
            <div class="progress-info">
              <span class="progress-current">{{ personalPerformance.newOrdersActual }}单</span>
              <span class="progress-separator">/</span>
              <span class="progress-target">{{ personalPerformance.newOrdersTarget }}单</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 综合得分 -->
      <div class="performance-card performance-card--score">
        <div class="performance-card__header">
          <div class="performance-card__icon">
            <Award :size="24" />
          </div>
          <div class="score-ring">
            <svg class="score-ring__svg" width="60" height="60">
              <circle
                cx="30"
                cy="30"
                r="25"
                fill="none"
                stroke="#f0f0f0"
                stroke-width="4"
              />
              <circle
                cx="30"
                cy="30"
                r="25"
                fill="none"
                :stroke="getScoreColor()"
                stroke-width="4"
                stroke-linecap="round"
                :stroke-dasharray="circumference"
                :stroke-dashoffset="strokeDashoffset"
                transform="rotate(-90 30 30)"
                class="score-ring__progress"
              />
            </svg>
            <div class="score-ring__text">
              {{ personalPerformance.overallCompletionRate.toFixed(0) }}%
            </div>
          </div>
        </div>
        
        <div class="performance-card__content">
          <div class="performance-card__title">综合完成率</div>
          <div class="performance-card__subtitle">
            基于服务费和新单的综合评分
          </div>
        </div>
      </div>

      <!-- 负责客户数 -->
      <div class="performance-card performance-card--customers">
        <div class="performance-card__header">
          <div class="performance-card__icon">
            <Users :size="24" />
          </div>
        </div>
        
        <div class="performance-card__content">
          <div class="performance-card__title">负责客户数</div>
          <div class="performance-card__main-value">
            {{ personalPerformance.assignedCustomerCount }}家
          </div>
          <div class="performance-card__subtitle">
            本月活跃客户管理
          </div>
        </div>
      </div>
    </div>

    <!-- 快速操作 -->
    <div class="quick-actions">
      <h4 class="quick-actions__title">快速操作</h4>
      <div class="quick-actions__buttons">
        <button class="quick-action-btn primary" @click="$emit('view-targets')">
          <Target :size="16" />
          查看目标详情
        </button>
        <button class="quick-action-btn secondary" @click="$emit('manage-customers')">
          <Users :size="16" />
          管理客户
        </button>
        <button class="quick-action-btn secondary" @click="$emit('renewal-tasks')">
          <Clock :size="16" />
          续费任务
        </button>
        <button class="quick-action-btn outline" @click="$emit('generate-report')">
          <FileText :size="16" />
          生成报表
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { DollarSign, Target, Award, Users, Trophy, TrendingUp, TrendingDown, Minus, Clock, FileText } from 'lucide-vue-next'
import type { PersonalPerformance } from '@/types'

interface Props {
  personalPerformance: PersonalPerformance
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<{
  'view-targets': []
  'manage-customers': []
  'renewal-tasks': []
  'generate-report': []
}>()

// 计算属性
const circumference = 2 * Math.PI * 25
const strokeDashoffset = computed(() => {
  const percentage = Math.min(props.personalPerformance.overallCompletionRate, 100)
  return circumference - (percentage / 100) * circumference
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

const getRankingClass = () => {
  const rank = props.personalPerformance.teamRanking
  const total = props.personalPerformance.totalTeamMembers
  const percentage = (rank / total) * 100
  
  if (percentage <= 20) return 'ranking-excellent'
  if (percentage <= 50) return 'ranking-good'
  if (percentage <= 80) return 'ranking-average'
  return 'ranking-poor'
}

const getCardClass = (completionRate: number) => {
  if (completionRate >= 120) return 'performance-card--excellent'
  if (completionRate >= 100) return 'performance-card--good'
  if (completionRate >= 80) return 'performance-card--average'
  return 'performance-card--poor'
}

const getProgressClass = (completionRate: number) => {
  if (completionRate >= 120) return 'progress-excellent'
  if (completionRate >= 100) return 'progress-good'
  if (completionRate >= 80) return 'progress-average'
  return 'progress-poor'
}

const getLevelClass = (completionRate: number) => {
  if (completionRate >= 120) return 'level-excellent'
  if (completionRate >= 100) return 'level-good'
  if (completionRate >= 80) return 'level-average'
  return 'level-poor'
}

const getLevelText = (completionRate: number) => {
  if (completionRate >= 120) return '优秀'
  if (completionRate >= 100) return '达标'
  if (completionRate >= 80) return '良好'
  return '待改善'
}

const getTrendClass = () => {
  return `trend-${props.personalPerformance.monthlyTrend.trendDirection}`
}

const getTrendIcon = () => {
  switch (props.personalPerformance.monthlyTrend.trendDirection) {
    case 'up': return TrendingUp
    case 'down': return TrendingDown
    default: return Minus
  }
}

const getTrendValue = () => {
  const diff = Math.abs(props.personalPerformance.monthlyTrend.currentMonth - props.personalPerformance.monthlyTrend.lastMonth)
  return diff.toFixed(1)
}

const getScoreColor = () => {
  const rate = props.personalPerformance.overallCompletionRate
  if (rate >= 120) return '#52c41a'
  if (rate >= 100) return '#1890ff'
  if (rate >= 80) return '#faad14'
  return '#ff4d4f'
}
</script>

<style scoped>
.personal-performance-cards {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-bottom: 24px;
}

.performance-cards__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.performance-cards__title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #262626;
}

.ranking-display {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #fafafa;
  border-radius: 6px;
}

.ranking-text {
  font-size: 14px;
  color: #595959;
}

.ranking-value {
  font-size: 16px;
  font-weight: 700;
}

.ranking-value.ranking-excellent {
  color: #52c41a;
}

.ranking-value.ranking-good {
  color: #1890ff;
}

.ranking-value.ranking-average {
  color: #faad14;
}

.ranking-value.ranking-poor {
  color: #ff4d4f;
}

.performance-cards__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.performance-card {
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 20px;
  transition: all 0.3s ease;
  position: relative;
}

.performance-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.performance-card--excellent {
  border-left: 4px solid #52c41a;
  background: #f6ffed;
}

.performance-card--good {
  border-left: 4px solid #1890ff;
  background: #e6f7ff;
}

.performance-card--average {
  border-left: 4px solid #faad14;
  background: #fff7e6;
}

.performance-card--poor {
  border-left: 4px solid #ff4d4f;
  background: #fff2f0;
}

.performance-card--score {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.performance-card--customers {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.performance-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.performance-card__icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  color: inherit;
}

.performance-card:not(.performance-card--score):not(.performance-card--customers) .performance-card__icon {
  background: #fff;
  color: #1890ff;
}

.performance-card__trend {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.performance-card__trend.trend-up {
  background: rgba(82, 196, 26, 0.1);
  color: #52c41a;
}

.performance-card__trend.trend-down {
  background: rgba(255, 77, 79, 0.1);
  color: #ff4d4f;
}

.performance-card__trend.trend-stable {
  background: rgba(140, 140, 140, 0.1);
  color: #8c8c8c;
}

.performance-card__content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.performance-card__title {
  font-size: 14px;
  color: #8c8c8c;
  margin: 0;
}

.performance-card--score .performance-card__title,
.performance-card--customers .performance-card__title {
  color: rgba(255, 255, 255, 0.8);
}

.performance-card__main-value {
  font-size: 32px;
  font-weight: 700;
  color: #262626;
  line-height: 1.2;
}

.performance-card--score .performance-card__main-value,
.performance-card--customers .performance-card__main-value {
  color: white;
}

.performance-card__subtitle {
  font-size: 12px;
  color: #8c8c8c;
  margin: 0;
}

.performance-card--score .performance-card__subtitle,
.performance-card--customers .performance-card__subtitle {
  color: rgba(255, 255, 255, 0.7);
}

.performance-card__progress {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.progress-bar {
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  transition: width 0.6s ease;
}

.progress-fill.progress-excellent {
  background: #52c41a;
}

.progress-fill.progress-good {
  background: #1890ff;
}

.progress-fill.progress-average {
  background: #faad14;
}

.progress-fill.progress-poor {
  background: #ff4d4f;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
}

.progress-current {
  font-weight: 600;
  color: #262626;
}

.progress-separator {
  color: #d9d9d9;
}

.progress-target {
  color: #8c8c8c;
}

.level-badge {
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
}

.level-badge.level-excellent {
  background: #f6ffed;
  color: #52c41a;
}

.level-badge.level-good {
  background: #e6f7ff;
  color: #1890ff;
}

.level-badge.level-average {
  background: #fff7e6;
  color: #faad14;
}

.level-badge.level-poor {
  background: #fff2f0;
  color: #ff4d4f;
}

.score-ring {
  position: relative;
  width: 60px;
  height: 60px;
}

.score-ring__svg {
  transform: rotate(-90deg);
}

.score-ring__progress {
  transition: stroke-dashoffset 1s ease;
}

.score-ring__text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 14px;
  font-weight: 700;
  color: white;
}

.quick-actions {
  border-top: 1px solid #f0f0f0;
  padding-top: 20px;
}

.quick-actions__title {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #262626;
}

.quick-actions__buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.quick-action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.quick-action-btn.primary {
  background: #1890ff;
  color: #fff;
}

.quick-action-btn.primary:hover {
  background: #40a9ff;
}

.quick-action-btn.secondary {
  background: #f5f5f5;
  color: #595959;
}

.quick-action-btn.secondary:hover {
  background: #e6f7ff;
  color: #1890ff;
}

.quick-action-btn.outline {
  background: transparent;
  border-color: #d9d9d9;
  color: #595959;
}

.quick-action-btn.outline:hover {
  border-color: #1890ff;
  color: #1890ff;
}

@media (max-width: 768px) {
  .personal-performance-cards {
    padding: 16px;
  }

  .performance-cards__header {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }

  .performance-cards__grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .quick-actions__buttons {
    flex-direction: column;
  }

  .quick-action-btn {
    justify-content: center;
  }
}
</style>