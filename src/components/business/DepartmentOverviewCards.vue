<template>
  <div class="department-overview-cards">
    <div class="overview-cards-grid">
      <!-- 部门总毛利完成 -->
      <div class="overview-card card--profit">
        <div class="overview-card__header">
          <div class="card-icon">
            <TrendingUp :size="24" />
          </div>
          <div class="card-meta">
            <h3 class="card-title">部门总毛利</h3>
            <div class="card-growth" :class="getGrowthClass(departmentMetrics.profitGrowthRate)">
              <TrendingUp v-if="departmentMetrics.profitGrowthRate > 0" :size="14" />
              <TrendingDown v-else :size="14" />
              {{ Math.abs(departmentMetrics.profitGrowthRate).toFixed(1) }}%
            </div>
          </div>
        </div>
        <div class="overview-card__content">
          <div class="card-value">{{ formatCurrency(departmentMetrics.totalProfit) }}</div>
          <div class="card-description">
            目标完成率: {{ departmentMetrics.targetCompletionRate.toFixed(1) }}%
          </div>
          <div class="progress-bar">
            <div 
              class="progress-fill"
              :class="getProgressClass(departmentMetrics.targetCompletionRate)"
              :style="{ width: Math.min(departmentMetrics.targetCompletionRate, 100) + '%' }"
            ></div>
          </div>
        </div>
      </div>

      <!-- 部门客户数 -->
      <div class="overview-card card--customers">
        <div class="overview-card__header">
          <div class="card-icon">
            <Users :size="24" />
          </div>
          <div class="card-meta">
            <h3 class="card-title">部门客户数</h3>
            <div class="card-growth" :class="getGrowthClass(departmentMetrics.customerGrowthRate)">
              <TrendingUp v-if="departmentMetrics.customerGrowthRate > 0" :size="14" />
              <TrendingDown v-else :size="14" />
              {{ Math.abs(departmentMetrics.customerGrowthRate).toFixed(1) }}%
            </div>
          </div>
        </div>
        <div class="overview-card__content">
          <div class="card-value">{{ departmentMetrics.customerCount }}家</div>
          <div class="card-description">
            平均客户价值: {{ formatCurrency(getAverageCustomerValue()) }}
          </div>
        </div>
      </div>

      <!-- 部门项目数 -->
      <div class="overview-card card--projects">
        <div class="overview-card__header">
          <div class="card-icon">
            <Briefcase :size="24" />
          </div>
          <div class="card-meta">
            <h3 class="card-title">部门项目数</h3>
            <div class="project-status">
              <span class="status-dot status-dot--active"></span>
              进行中
            </div>
          </div>
        </div>
        <div class="overview-card__content">
          <div class="card-value">{{ departmentMetrics.projectCount }}个</div>
          <div class="card-description">
            平均项目价值: {{ formatCurrency(getAverageProjectValue()) }}
          </div>
        </div>
      </div>

      <!-- 部门排名 -->
      <div class="overview-card card--ranking">
        <div class="overview-card__header">
          <div class="card-icon ranking-icon" :class="getRankingIconClass()">
            <Trophy v-if="departmentMetrics.departmentRanking <= 3" :size="24" />
            <Award v-else :size="24" />
          </div>
          <div class="card-meta">
            <h3 class="card-title">部门排名</h3>
            <div class="ranking-trend">
              {{ getRankingTrend() }}
            </div>
          </div>
        </div>
        <div class="overview-card__content">
          <div class="card-value ranking-value">
            <span class="ranking-position">#{{ departmentMetrics.departmentRanking }}</span>
            <span class="ranking-total">/ {{ departmentMetrics.totalDepartments }}</span>
          </div>
          <div class="card-description">
            {{ getRankingDescription() }}
          </div>
          <div class="ranking-visual">
            <div class="ranking-bars">
              <div 
                v-for="i in departmentMetrics.totalDepartments" 
                :key="i"
                class="ranking-bar"
                :class="{ 'ranking-bar--current': i === departmentMetrics.departmentRanking }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 部门对比分析 -->
    <div class="department-comparison" v-if="showComparison">
      <div class="comparison-header">
        <h4>部门对比分析</h4>
        <button class="toggle-comparison" @click="$emit('toggle-comparison')">
          <ChevronUp v-if="showComparison" :size="20" />
          <ChevronDown v-else :size="20" />
        </button>
      </div>
      <div class="comparison-metrics">
        <div class="comparison-metric">
          <div class="metric-header">
            <span class="metric-name">毛利表现</span>
            <span class="metric-position">#{{ departmentMetrics.departmentRanking }}</span>
          </div>
          <div class="metric-bar">
            <div 
              class="metric-fill metric-fill--profit"
              :style="{ width: (departmentMetrics.departmentRanking / departmentMetrics.totalDepartments) * 100 + '%' }"
            ></div>
          </div>
        </div>
        <div class="comparison-metric">
          <div class="metric-header">
            <span class="metric-name">客户增长</span>
            <span class="metric-value">{{ departmentMetrics.customerGrowthRate.toFixed(1) }}%</span>
          </div>
          <div class="metric-bar">
            <div 
              class="metric-fill metric-fill--growth"
              :style="{ width: Math.abs(departmentMetrics.customerGrowthRate) + '%' }"
            ></div>
          </div>
        </div>
        <div class="comparison-metric">
          <div class="metric-header">
            <span class="metric-name">目标完成</span>
            <span class="metric-value">{{ departmentMetrics.targetCompletionRate.toFixed(1) }}%</span>
          </div>
          <div class="metric-bar">
            <div 
              class="metric-fill metric-fill--target"
              :style="{ width: Math.min(departmentMetrics.targetCompletionRate, 100) + '%' }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { TrendingUp, TrendingDown, Users, Briefcase, Trophy, Award, ChevronUp, ChevronDown } from 'lucide-vue-next'
import type { DepartmentMetrics } from '@/types'

interface Props {
  departmentMetrics: DepartmentMetrics
  showComparison?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showComparison: false,
  loading: false
})

const emit = defineEmits<{
  'toggle-comparison': []
  'view-details': [section: string]
}>()

// 计算属性
const getAverageCustomerValue = () => {
  return props.departmentMetrics.customerCount > 0 
    ? props.departmentMetrics.totalProfit / props.departmentMetrics.customerCount 
    : 0
}

const getAverageProjectValue = () => {
  return props.departmentMetrics.projectCount > 0 
    ? props.departmentMetrics.totalProfit / props.departmentMetrics.projectCount 
    : 0
}

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

const getRankingIconClass = () => {
  const ranking = props.departmentMetrics.departmentRanking
  if (ranking === 1) return 'icon-gold'
  if (ranking === 2) return 'icon-silver'
  if (ranking === 3) return 'icon-bronze'
  return 'icon-default'
}

const getRankingTrend = () => {
  // 模拟排名变化趋势
  const ranking = props.departmentMetrics.departmentRanking
  if (ranking <= 3) return '↗️ 表现优秀'
  if (ranking <= props.departmentMetrics.totalDepartments / 2) return '→ 表现稳定'
  return '↘️ 需要提升'
}

const getRankingDescription = () => {
  const ranking = props.departmentMetrics.departmentRanking
  const total = props.departmentMetrics.totalDepartments
  const percentage = ((total - ranking + 1) / total * 100).toFixed(0)
  
  if (ranking === 1) return '恭喜！部门表现排名第一'
  if (ranking <= 3) return `表现优秀，超过${percentage}%的部门`
  if (ranking <= total / 2) return `表现中等，超过${percentage}%的部门`
  return `还有提升空间，超过${percentage}%的部门`
}
</script>

<style scoped>
.department-overview-cards {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-bottom: 24px;
}

/* 卡片网格 */
.overview-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.overview-card {
  background: #fafafa;
  border-radius: 8px;
  padding: 20px;
  border-left: 4px solid #d9d9d9;
  transition: all 0.3s ease;
  cursor: pointer;
}

.overview-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.overview-card.card--profit {
  border-left-color: #722ed1;
}

.overview-card.card--customers {
  border-left-color: #1890ff;
}

.overview-card.card--projects {
  border-left-color: #52c41a;
}

.overview-card.card--ranking {
  border-left-color: #fa8c16;
}

.overview-card__header {
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

.card--profit .card-icon {
  background: linear-gradient(135deg, #722ed1 0%, #9254de 100%);
}

.card--customers .card-icon {
  background: linear-gradient(135deg, #1890ff 0%, #40a9ff 100%);
}

.card--projects .card-icon {
  background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
}

.card--ranking .card-icon {
  background: linear-gradient(135deg, #fa8c16 0%, #ffa940 100%);
}

.ranking-icon.icon-gold {
  background: linear-gradient(135deg, #ffd700 0%, #ffed4a 100%);
  color: #8b6914;
}

.ranking-icon.icon-silver {
  background: linear-gradient(135deg, #c0c0c0 0%, #e6e6e6 100%);
  color: #595959;
}

.ranking-icon.icon-bronze {
  background: linear-gradient(135deg, #cd7f32 0%, #daa520 100%);
  color: #fff;
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

.project-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #52c41a;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-dot--active {
  background: #52c41a;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}

.ranking-trend {
  font-size: 12px;
  color: #8c8c8c;
}

.overview-card__content {
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

.ranking-value {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.ranking-position {
  font-size: 32px;
  font-weight: 700;
  color: #262626;
}

.ranking-total {
  font-size: 16px;
  color: #8c8c8c;
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

.ranking-visual {
  margin-top: 8px;
}

.ranking-bars {
  display: flex;
  gap: 2px;
  height: 20px;
  align-items: end;
}

.ranking-bar {
  flex: 1;
  background: #f0f0f0;
  border-radius: 2px 2px 0 0;
  height: 60%;
  transition: all 0.3s ease;
}

.ranking-bar--current {
  background: #fa8c16;
  height: 100%;
}

/* 部门对比区域 */
.department-comparison {
  border-top: 1px solid #f0f0f0;
  padding-top: 24px;
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

.toggle-comparison {
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

.toggle-comparison:hover {
  border-color: #40a9ff;
  color: #40a9ff;
}

.comparison-metrics {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.comparison-metric {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.metric-name {
  font-size: 14px;
  color: #595959;
}

.metric-position,
.metric-value {
  font-size: 14px;
  font-weight: 600;
  color: #262626;
}

.metric-bar {
  width: 100%;
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

.metric-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.8s ease;
}

.metric-fill--profit {
  background: linear-gradient(90deg, #722ed1 0%, #9254de 100%);
}

.metric-fill--growth {
  background: linear-gradient(90deg, #1890ff 0%, #40a9ff 100%);
}

.metric-fill--target {
  background: linear-gradient(90deg, #52c41a 0%, #73d13d 100%);
}

@media (max-width: 768px) {
  .department-overview-cards {
    padding: 16px;
  }

  .overview-cards-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .overview-card {
    padding: 16px;
  }

  .card-icon {
    width: 40px;
    height: 40px;
  }

  .card-value {
    font-size: 24px;
  }

  .ranking-position {
    font-size: 28px;
  }
}

@media (max-width: 480px) {
  .overview-cards-grid {
    grid-template-columns: 1fr;
  }
}
</style>