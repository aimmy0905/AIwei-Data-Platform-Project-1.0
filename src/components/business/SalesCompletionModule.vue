<template>
  <div class="sales-completion-module">
    <div class="sales-completion-module__header">
      <h3 class="sales-completion-module__title">销售完成情况</h3>
    </div>

    <div class="sales-completion-module__content">
      <!-- 团队概览 -->
      <div class="team-overview">
        <div class="team-overview__card">
          <h4 class="team-overview__title">团队排名</h4>
          <div class="team-ranking">
            <div class="team-ranking__position">
              <span class="team-ranking__rank">{{ teamRanking }}</span>
              <span class="team-ranking__separator">/</span>
              <span class="team-ranking__total">{{ totalTeams }}</span>
            </div>
            <div class="team-ranking__rate">
              <span class="team-ranking__rate-label">团队完成率</span>
              <span class="team-ranking__rate-value" :class="getRateClass(teamCompletionRate)">
                {{ teamCompletionRate.toFixed(1) }}%
              </span>
            </div>
          </div>
        </div>

        <div class="team-overview__card">
          <h4 class="team-overview__title">成员分布</h4>
          <div class="member-distribution">
            <div class="distribution-item">
              <div class="distribution-item__label">优秀 (>120%)</div>
              <div class="distribution-item__value excellent">{{ memberDistribution.excellent }}人</div>
            </div>
            <div class="distribution-item">
              <div class="distribution-item__label">良好 (80-120%)</div>
              <div class="distribution-item__value good">{{ memberDistribution.good }}人</div>
            </div>
            <div class="distribution-item">
              <div class="distribution-item__label">待改善 (<80%)</div>
              <div class="distribution-item__value need-improvement">{{ memberDistribution.needImprovement }}人</div>
            </div>
          </div>
        </div>

        <div class="team-overview__card">
          <h4 class="team-overview__title">月度趋势</h4>
          <div class="monthly-trend">
            <div class="trend-indicator" :class="getTrendClass(monthlyTrend.trendDirection)">
              <component :is="getTrendIcon()" :size="20" />
              <span class="trend-value">{{ getFormattedTrendValue() }}</span>
            </div>
            <div class="trend-period">环比上月</div>
          </div>
        </div>
      </div>

      <!-- 成员表现排行 -->
      <div class="member-performance">
        <div class="member-performance__header">
          <h4 class="member-performance__title">团队成员表现</h4>
          <div class="sort-controls">
            <button 
              v-for="option in sortOptions"
              :key="option.value"
              class="sort-btn"
              :class="{ 'sort-btn--active': currentSort === option.value }"
              @click="currentSort = option.value"
            >
              {{ option.label }}
            </button>
          </div>
        </div>

        <div class="performance-table">
          <div class="performance-table__header">
            <div class="col-rank">排名</div>
            <div class="col-name">姓名</div>
            <div class="col-target">目标完成率</div>
            <div class="col-trend">月度趋势</div>
            <div class="col-customers">客户数</div>
            <div class="col-avg-value">客单价</div>
            <div class="col-level">表现等级</div>
          </div>

          <div class="performance-table__body">
            <div 
              v-for="(member, index) in sortedMembers"
              :key="member.employeeId"
              class="performance-row"
              :class="getRowClass(member.performanceLevel)"
            >
              <div class="col-rank">
                <div class="rank-badge" :class="getRankBadgeClass(index + 1)">
                  {{ index + 1 }}
                </div>
              </div>
              <div class="col-name">
                <span class="member-name">{{ member.employeeName }}</span>
              </div>
              <div class="col-target">
                <div class="completion-rate">
                  <span class="rate-value" :class="getRateClass(member.overallCompletionRate)">
                    {{ member.overallCompletionRate.toFixed(1) }}%
                  </span>
                  <div class="rate-bar">
                    <div 
                      class="rate-bar__fill" 
                      :class="getRateClass(member.overallCompletionRate)"
                      :style="{ width: `${Math.min(member.overallCompletionRate, 100)}%` }"
                    ></div>
                  </div>
                </div>
              </div>
              <div class="col-trend">
                <div class="member-trend" :class="getTrendClass(member.monthlyTrend.trendDirection)">
                  <component :is="getTrendIcon(member.monthlyTrend.trendDirection)" :size="14" />
                  <span class="trend-text">{{ getMemberTrendText(member.monthlyTrend) }}</span>
                </div>
              </div>
              <div class="col-customers">
                <span class="customer-count">{{ member.customerCount }}家</span>
              </div>
              <div class="col-avg-value">
                <span class="avg-value">{{ formatCurrency(member.avgCustomerValue) }}</span>
              </div>
              <div class="col-level">
                <div class="performance-badge" :class="getPerformanceBadgeClass(member.performanceLevel)">
                  {{ getPerformanceLevelText(member.performanceLevel) }}
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
import { TrendingUp, TrendingDown, Minus } from 'lucide-vue-next'
import type { TeamMemberPerformance, TeamSalesStatistics } from '@/types'

interface Props {
  teamMembers: TeamMemberPerformance[]
  teamStatistics: TeamSalesStatistics
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const currentSort = ref<'overall' | 'service_fee' | 'new_orders' | 'customers'>('overall')

const sortOptions = [
  { value: 'overall' as const, label: '综合完成率' },
  { value: 'service_fee' as const, label: '服务费完成' },
  { value: 'new_orders' as const, label: '新单完成' },
  { value: 'customers' as const, label: '客户数量' }
]

const teamRanking = computed(() => props.teamStatistics.teamRanking)
const totalTeams = computed(() => props.teamStatistics.totalTeams)
const teamCompletionRate = computed(() => props.teamStatistics.teamCompletionRate)
const memberDistribution = computed(() => props.teamStatistics.memberDistribution)
const monthlyTrend = computed(() => props.teamStatistics.monthlyTrend)

const sortedMembers = computed(() => {
  const members = [...props.teamMembers]
  
  switch (currentSort.value) {
    case 'overall':
      return members.sort((a, b) => b.overallCompletionRate - a.overallCompletionRate)
    case 'service_fee':
      return members.sort((a, b) => b.serviceFeeCompletionRate - a.serviceFeeCompletionRate)
    case 'new_orders':
      return members.sort((a, b) => b.newOrdersCompletionRate - a.newOrdersCompletionRate)
    case 'customers':
      return members.sort((a, b) => b.customerCount - a.customerCount)
    default:
      return members
  }
})

const getRateClass = (rate: number) => {
  if (rate >= 120) return 'excellent'
  if (rate >= 80) return 'good'
  if (rate >= 50) return 'warning'
  return 'danger'
}

const getTrendClass = (direction: 'up' | 'down' | 'stable') => {
  return `trend-${direction}`
}

const getTrendIcon = (direction?: 'up' | 'down' | 'stable') => {
  switch (direction) {
    case 'up': return TrendingUp
    case 'down': return TrendingDown
    default: return Minus
  }
}

const getFormattedTrendValue = () => {
  const diff = Math.abs(monthlyTrend.value.currentMonth - monthlyTrend.value.lastMonth)
  return `${diff.toFixed(1)}%`
}

const getMemberTrendText = (trend: { currentMonth: number; lastMonth: number; trendDirection: 'up' | 'down' | 'stable' }) => {
  const diff = Math.abs(trend.currentMonth - trend.lastMonth)
  return `${diff.toFixed(1)}%`
}

const getRankBadgeClass = (rank: number) => {
  if (rank === 1) return 'rank-first'
  if (rank === 2) return 'rank-second'
  if (rank === 3) return 'rank-third'
  return 'rank-default'
}

const getRowClass = (level: 'excellent' | 'good' | 'needImprovement') => {
  return `row-${level.replace('I', 'i')}`
}

const getPerformanceBadgeClass = (level: 'excellent' | 'good' | 'needImprovement') => {
  return `badge-${level.replace('I', 'i')}`
}

const getPerformanceLevelText = (level: 'excellent' | 'good' | 'needImprovement') => {
  const textMap = {
    excellent: '优秀',
    good: '良好',
    needImprovement: '待改善'
  }
  return textMap[level]
}

const formatCurrency = (value: number): string => {
  if (value >= 10000) {
    return `¥${(value / 10000).toFixed(1)}万`
  }
  return `¥${value.toLocaleString()}`
}
</script>

<style scoped>
.sales-completion-module {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-bottom: 24px;
}

.sales-completion-module__header {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.sales-completion-module__title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #262626;
}

.sales-completion-module__content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* 团队概览 */
.team-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.team-overview__card {
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 20px;
}

.team-overview__title {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #262626;
}

.team-ranking {
  text-align: center;
}

.team-ranking__position {
  font-size: 32px;
  font-weight: 700;
  color: #1890ff;
  margin-bottom: 8px;
}

.team-ranking__separator {
  color: #d9d9d9;
  margin: 0 4px;
}

.team-ranking__rate {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.team-ranking__rate-label {
  font-size: 12px;
  color: #8c8c8c;
}

.team-ranking__rate-value {
  font-size: 14px;
  font-weight: 600;
}

.member-distribution {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.distribution-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.distribution-item__label {
  font-size: 13px;
  color: #595959;
}

.distribution-item__value {
  font-size: 16px;
  font-weight: 600;
}

.distribution-item__value.excellent {
  color: #52c41a;
}

.distribution-item__value.good {
  color: #1890ff;
}

.distribution-item__value.need-improvement {
  color: #ff4d4f;
}

.monthly-trend {
  text-align: center;
}

.trend-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 8px;
  padding: 8px 12px;
  border-radius: 16px;
  font-weight: 600;
}

.trend-indicator.trend-up {
  background: #f6ffed;
  color: #52c41a;
}

.trend-indicator.trend-down {
  background: #fff2f0;
  color: #ff4d4f;
}

.trend-indicator.trend-stable {
  background: #f5f5f5;
  color: #8c8c8c;
}

.trend-period {
  font-size: 12px;
  color: #8c8c8c;
}

/* 成员表现 */
.member-performance__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.member-performance__title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #262626;
}

.sort-controls {
  display: flex;
  gap: 4px;
}

.sort-btn {
  padding: 4px 12px;
  background: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  color: #595959;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.sort-btn:hover {
  border-color: #40a9ff;
  color: #40a9ff;
}

.sort-btn--active {
  background: #1890ff;
  border-color: #1890ff;
  color: #fff;
}

.performance-table {
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  overflow: hidden;
}

.performance-table__header {
  display: grid;
  grid-template-columns: 60px 120px 180px 100px 80px 100px 80px;
  background: #fafafa;
  border-bottom: 1px solid #f0f0f0;
  padding: 12px 0;
  font-size: 12px;
  font-weight: 600;
  color: #8c8c8c;
  text-align: center;
}

.performance-table__body {
  background: #fff;
}

.performance-row {
  display: grid;
  grid-template-columns: 60px 120px 180px 100px 80px 100px 80px;
  padding: 12px 0;
  border-bottom: 1px solid #f5f5f5;
  align-items: center;
  text-align: center;
  transition: background-color 0.2s;
}

.performance-row:hover {
  background: #fafafa;
}

.performance-row:last-child {
  border-bottom: none;
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
  margin: 0 auto;
}

.rank-badge.rank-first {
  background: linear-gradient(135deg, #ffd700, #ffb300);
  color: #fff;
}

.rank-badge.rank-second {
  background: linear-gradient(135deg, #c0c0c0, #a0a0a0);
  color: #fff;
}

.rank-badge.rank-third {
  background: linear-gradient(135deg, #cd7f32, #b86f28);
  color: #fff;
}

.rank-badge.rank-default {
  background: #f5f5f5;
  color: #8c8c8c;
}

.member-name {
  font-weight: 600;
  color: #262626;
}

.completion-rate {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.rate-value {
  font-size: 14px;
  font-weight: 600;
}

.rate-value.excellent {
  color: #52c41a;
}

.rate-value.good {
  color: #1890ff;
}

.rate-value.warning {
  color: #faad14;
}

.rate-value.danger {
  color: #ff4d4f;
}

.rate-bar {
  width: 60px;
  height: 4px;
  background: #f5f5f5;
  border-radius: 2px;
  overflow: hidden;
}

.rate-bar__fill {
  height: 100%;
  transition: width 0.3s ease;
}

.rate-bar__fill.excellent {
  background: #52c41a;
}

.rate-bar__fill.good {
  background: #1890ff;
}

.rate-bar__fill.warning {
  background: #faad14;
}

.rate-bar__fill.danger {
  background: #ff4d4f;
}

.member-trend {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 12px;
}

.member-trend.trend-up {
  color: #52c41a;
}

.member-trend.trend-down {
  color: #ff4d4f;
}

.member-trend.trend-stable {
  color: #8c8c8c;
}

.customer-count {
  font-size: 13px;
  color: #595959;
}

.avg-value {
  font-size: 13px;
  font-weight: 600;
  color: #262626;
}

.performance-badge {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
}

.performance-badge.badge-excellent {
  background: #f6ffed;
  color: #52c41a;
}

.performance-badge.badge-good {
  background: #e6f7ff;
  color: #1890ff;
}

.performance-badge.badge-needimprovement {
  background: #fff2f0;
  color: #ff4d4f;
}

@media (max-width: 1200px) {
  .performance-table__header,
  .performance-row {
    grid-template-columns: 50px 100px 150px 80px 70px 80px 70px;
    font-size: 11px;
  }
}

@media (max-width: 768px) {
  .sales-completion-module {
    padding: 16px;
  }

  .team-overview {
    grid-template-columns: 1fr;
  }

  .member-performance__header {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }

  .sort-controls {
    justify-content: center;
  }

  .performance-table {
    overflow-x: auto;
  }

  .performance-table__header,
  .performance-row {
    min-width: 600px;
  }
}
</style>