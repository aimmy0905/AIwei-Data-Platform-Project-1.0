<template>
  <div class="project-goals-dashboard">
    <!-- 目标概览区域 -->
    <div class="overview-section">
      <div class="section-header">
        <h2 class="section-title">目标概览</h2>
        <div class="time-selector">
          <select v-model="selectedPeriod" @change="handlePeriodChange" class="period-select">
            <option value="current">当前周期</option>
            <option value="last">上个周期</option>
            <option value="year">本年度</option>
          </select>
        </div>
      </div>

      <div class="overview-cards">
        <div class="overview-card">
          <div class="card-icon">
            <Target :size="24" />
          </div>
          <div class="card-content">
            <div class="card-title">总体目标完成率</div>
            <div class="card-value">{{ overviewStats.totalCompletionRate }}%</div>
            <div class="card-change" :class="getChangeClass(overviewStats.totalCompletionChange)">
              {{ overviewStats.totalCompletionChange > 0 ? '+' : '' }}{{ overviewStats.totalCompletionChange }}%
            </div>
          </div>
        </div>

        <div class="overview-card">
          <div class="card-icon">
            <Calendar :size="24" />
          </div>
          <div class="card-content">
            <div class="card-title">各类型目标统计</div>
            <div class="card-stats">
              <div class="stat-item">
                <span class="stat-label">月度</span>
                <span class="stat-value">{{ overviewStats.monthlyGoals }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">季度</span>
                <span class="stat-value">{{ overviewStats.quarterlyGoals }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">年度</span>
                <span class="stat-value">{{ overviewStats.yearlyGoals }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="overview-card">
          <div class="card-icon">
            <TrendingUp :size="24" />
          </div>
          <div class="card-content">
            <div class="card-title">完成状态分布</div>
            <div class="status-distribution">
              <div class="distribution-item excellent">
                <span class="distribution-label">超额完成</span>
                <span class="distribution-value">{{ overviewStats.excellentCount }}</span>
              </div>
              <div class="distribution-item good">
                <span class="distribution-label">达成目标</span>
                <span class="distribution-value">{{ overviewStats.goodCount }}</span>
              </div>
              <div class="distribution-item warning">
                <span class="distribution-label">接近目标</span>
                <span class="distribution-value">{{ overviewStats.warningCount }}</span>
              </div>
              <div class="distribution-item danger">
                <span class="distribution-label">未达目标</span>
                <span class="distribution-value">{{ overviewStats.dangerCount }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 趋势分析区域 -->
    <div class="trend-section">
      <div class="section-header">
        <h2 class="section-title">趋势分析</h2>
        <div class="trend-controls">
          <select v-model="trendType" @change="handleTrendTypeChange" class="trend-select">
            <option value="completion">完成率趋势</option>
            <option value="comparison">各维度对比</option>
            <option value="prediction">预测分析</option>
          </select>
        </div>
      </div>

      <div class="trend-charts">
        <div class="chart-container" v-if="trendType === 'completion'">
          <div class="chart-header">
            <h3>目标完成率趋势</h3>
          </div>
          <LineChart
            :data="completionTrendData"
            :height="'350px'"
            :show-legend="true"
          />
        </div>

        <div class="chart-container" v-if="trendType === 'comparison'">
          <div class="chart-header">
            <h3>各维度目标对比</h3>
          </div>
          <BarChart
            :data="comparisonChartData"
            :height="'350px'"
            :show-legend="true"
          />
        </div>

        <div class="chart-container" v-if="trendType === 'prediction'">
          <div class="chart-header">
            <h3>目标达成预测</h3>
          </div>
          <AreaChart
            :data="predictionChartData"
            :height="'350px'"
            :show-legend="true"
          />
        </div>
      </div>
    </div>

    <!-- 项目排名区域 -->
    <div class="ranking-section">
      <div class="section-header">
        <h2 class="section-title">项目排名</h2>
      </div>

      <div class="ranking-grid">
        <div class="ranking-card">
          <div class="ranking-header">
            <h3>完成率排行榜</h3>
            <button class="view-all-btn" @click="viewAllRankings">查看全部</button>
          </div>
          <div class="ranking-list">
            <div
              v-for="(project, index) in topPerformingProjects"
              :key="project.id"
              class="ranking-item"
            >
              <div class="ranking-position" :class="getRankClass(index + 1)">
                {{ index + 1 }}
              </div>
              <div class="ranking-info">
                <div class="ranking-name">{{ project.projectName }}</div>
                <div class="ranking-customer">{{ project.customerName }}</div>
              </div>
              <div class="ranking-score">
                <span class="score-value">{{ project.completionRate }}%</span>
                <span class="score-change" :class="getChangeClass(project.change)">
                  {{ project.change > 0 ? '+' : '' }}{{ project.change }}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="ranking-card">
          <div class="ranking-header">
            <h3>进步最快项目</h3>
          </div>
          <div class="ranking-list">
            <div
              v-for="project in fastestGrowthProjects"
              :key="project.id"
              class="ranking-item"
            >
              <div class="growth-icon">
                <TrendingUp :size="16" />
              </div>
              <div class="ranking-info">
                <div class="ranking-name">{{ project.projectName }}</div>
                <div class="ranking-customer">{{ project.customerName }}</div>
              </div>
              <div class="growth-score">
                <span class="growth-value">+{{ project.growthRate }}%</span>
              </div>
            </div>
          </div>
        </div>

        <div class="ranking-card">
          <div class="ranking-header">
            <h3>需要关注项目</h3>
          </div>
          <div class="ranking-list">
            <div
              v-for="project in riskProjects"
              :key="project.id"
              class="ranking-item risk"
            >
              <div class="risk-icon">
                <AlertTriangle :size="16" />
              </div>
              <div class="ranking-info">
                <div class="ranking-name">{{ project.projectName }}</div>
                <div class="ranking-customer">{{ project.customerName }}</div>
              </div>
              <div class="risk-score">
                <span class="risk-value">{{ project.completionRate }}%</span>
                <span class="risk-label">风险</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 预警提醒区域 -->
    <div class="alert-section">
      <div class="section-header">
        <h2 class="section-title">预警提醒</h2>
        <button class="mark-all-read-btn" @click="markAllAlertsRead">全部标记已读</button>
      </div>

      <div class="alert-grid">
        <div class="alert-card">
          <div class="alert-header">
            <h3>风险预警列表</h3>
          </div>
          <div class="alert-list">
            <div
              v-for="alert in riskAlerts"
              :key="alert.id"
              class="alert-item"
              :class="{ 'alert-unread': !alert.isRead }"
            >
              <div class="alert-icon" :class="alert.type">
                <component :is="getAlertIcon(alert.type)" :size="16" />
              </div>
              <div class="alert-content">
                <div class="alert-title">{{ alert.title }}</div>
                <div class="alert-description">{{ alert.description }}</div>
                <div class="alert-time">{{ formatTime(alert.createdAt) }}</div>
              </div>
              <button
                class="alert-action"
                @click="markAlertRead(alert.id)"
                v-if="!alert.isRead"
              >
                标记已读
              </button>
            </div>
          </div>
        </div>

        <div class="alert-card">
          <div class="alert-header">
            <h3>即将到期目标</h3>
          </div>
          <div class="alert-list">
            <div
              v-for="goal in expiringGoals"
              :key="goal.id"
              class="alert-item"
            >
              <div class="alert-icon expiring">
                <Clock :size="16" />
              </div>
              <div class="alert-content">
                <div class="alert-title">{{ goal.projectName }}</div>
                <div class="alert-description">{{ goal.goalType }}目标 {{ goal.goalPeriod }}</div>
                <div class="alert-time">剩余 {{ goal.daysRemaining }} 天</div>
              </div>
            </div>
          </div>
        </div>

        <div class="alert-card">
          <div class="alert-header">
            <h3>改进建议</h3>
          </div>
          <div class="suggestion-list">
            <div
              v-for="suggestion in improvementSuggestions"
              :key="suggestion.id"
              class="suggestion-item"
            >
              <div class="suggestion-icon">
                <Lightbulb :size="16" />
              </div>
              <div class="suggestion-content">
                <div class="suggestion-title">{{ suggestion.title }}</div>
                <div class="suggestion-description">{{ suggestion.description }}</div>
                <div class="suggestion-impact">预期提升: {{ suggestion.expectedImprovement }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  Target,
  Calendar,
  TrendingUp,
  AlertTriangle,
  Clock,
  Lightbulb,
  ChevronUp,
  ChevronDown
} from 'lucide-vue-next'
import LineChart from '@/components/charts/LineChart.vue'
import BarChart from '@/components/charts/BarChart.vue'
import AreaChart from '@/components/charts/AreaChart.vue'
import ProjectGoalsTrendAnalysis from './ProjectGoalsTrendAnalysis.vue'
import { mockProjectGoals, type ProjectGoal } from '@/mock/projects'

// 响应式数据
const selectedPeriod = ref('current')
const trendType = ref('completion')

// 模拟数据
const overviewStats = ref({
  totalCompletionRate: 87.5,
  totalCompletionChange: 5.2,
  monthlyGoals: 24,
  quarterlyGoals: 8,
  yearlyGoals: 3,
  excellentCount: 12,
  goodCount: 15,
  warningCount: 6,
  dangerCount: 2
})

const topPerformingProjects = ref([
  {
    id: 1,
    projectName: '美妆品牌海外推广项目',
    customerName: '美丽时光化妆品有限公司',
    completionRate: 104.2,
    change: 8.5
  },
  {
    id: 2,
    projectName: '健康食品品牌全球扩张',
    customerName: '绿色健康食品公司',
    completionRate: 98.7,
    change: 3.2
  },
  {
    id: 3,
    projectName: '家居用品品牌推广项目',
    customerName: '温馨家居用品',
    completionRate: 95.3,
    change: -1.2
  }
])

const fastestGrowthProjects = ref([
  {
    id: 1,
    projectName: '美妆品牌海外推广项目',
    customerName: '美丽时光化妆品有限公司',
    growthRate: 15.8
  },
  {
    id: 2,
    projectName: '时尚服装品牌数字化营销',
    customerName: '潮流前线服饰',
    growthRate: 12.3
  }
])

const riskProjects = ref([
  {
    id: 1,
    projectName: '电子产品海外电商运营',
    customerName: '智能科技有限公司',
    completionRate: 65.2
  }
])

const riskAlerts = ref([
  {
    id: 1,
    type: 'danger',
    title: '目标完成率过低',
    description: '电子产品海外电商运营项目完成率仅65.2%，需要重点关注',
    createdAt: '2024-12-20T10:30:00',
    isRead: false
  },
  {
    id: 2,
    type: 'warning',
    title: '进度预警',
    description: '时尚服装品牌数字化营销项目进度落后于时间计划',
    createdAt: '2024-12-20T09:15:00',
    isRead: false
  }
])

const expiringGoals = ref([
  {
    id: 1,
    projectName: '美妆品牌海外推广项目',
    goalType: '月度',
    goalPeriod: '2024年12月',
    daysRemaining: 11
  },
  {
    id: 2,
    projectName: '健康食品品牌全球扩张',
    goalType: '季度',
    goalPeriod: '2024年Q4',
    daysRemaining: 11
  }
])

const improvementSuggestions = ref([
  {
    id: 1,
    title: '优化投放策略',
    description: '建议调整低效渠道的投放比例，增加高ROI渠道投入',
    expectedImprovement: '15-20%'
  },
  {
    id: 2,
    title: '加强数据监控',
    description: '建立实时数据监控体系，及时发现和解决问题',
    expectedImprovement: '10-15%'
  }
])

// 计算属性
const completionTrendData = computed(() => ({
  labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
  datasets: [
    {
      label: '销量完成率',
      data: [75, 82, 88, 85, 92, 87],
      color: '#1890ff'
    },
    {
      label: 'ROI完成率',
      data: [68, 75, 82, 79, 85, 83],
      color: '#52c41a'
    },
    {
      label: '成本完成率',
      data: [85, 88, 92, 89, 95, 93],
      color: '#fa8c16'
    }
  ]
}))

const comparisonChartData = computed(() => ({
  labels: ['销量目标', 'ROI目标', '成本目标', '利润目标', '用户数目标'],
  datasets: [
    {
      label: '目标值',
      data: [1000000, 3.5, 300000, 200000, 5000],
      color: '#e6f7ff'
    },
    {
      label: '完成值',
      data: [875000, 3.1, 285000, 175000, 4350],
      color: '#1890ff'
    }
  ]
}))

const predictionChartData = computed(() => ({
  labels: ['当前', '下周', '下月', '下季度'],
  datasets: [
    {
      label: '预测完成率',
      data: [87.5, 89.2, 92.8, 95.5],
      color: '#52c41a'
    },
    {
      label: '目标完成率',
      data: [90, 90, 90, 90],
      color: '#ff4d4f'
    }
  ]
}))

// 方法
const handlePeriodChange = () => {
  console.log('时间周期变更:', selectedPeriod.value)
  // 重新加载数据
}

const handleTrendTypeChange = () => {
  console.log('趋势类型变更:', trendType.value)
}

const getChangeClass = (change: number) => {
  return change > 0 ? 'positive' : change < 0 ? 'negative' : 'neutral'
}

const getRankClass = (rank: number) => {
  if (rank === 1) return 'rank-first'
  if (rank === 2) return 'rank-second'
  if (rank === 3) return 'rank-third'
  return 'rank-default'
}

const getAlertIcon = (type: string) => {
  const iconMap = {
    danger: AlertTriangle,
    warning: AlertTriangle,
    info: Target
  }
  return iconMap[type as keyof typeof iconMap] || AlertTriangle
}

const formatTime = (time: string) => {
  const now = new Date()
  const alertTime = new Date(time)
  const diff = now.getTime() - alertTime.getTime()
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (days > 0) return `${days}天前`
  if (hours > 0) return `${hours}小时前`
  return '刚刚'
}

const viewAllRankings = () => {
  console.log('查看全部排名')
}

const markAllAlertsRead = () => {
  riskAlerts.value.forEach(alert => {
    alert.isRead = true
  })
}

const markAlertRead = (alertId: number) => {
  const alert = riskAlerts.value.find(a => a.id === alertId)
  if (alert) {
    alert.isRead = true
  }
}

onMounted(() => {
  console.log('项目目标管理看板已加载')
})
</script>

<style scoped>
.project-goals-dashboard {
  padding: 24px;
  background: var(--color-background);
  min-height: 100vh;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.period-select,
.trend-select {
  padding: 8px 12px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-background);
  color: var(--color-text-primary);
  font-size: 14px;
}

/* 目标概览区域 */
.overview-section {
  margin-bottom: 32px;
}

.overview-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.overview-card {
  background: var(--color-background-secondary);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 20px;
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.card-icon {
  width: 48px;
  height: 48px;
  background: var(--color-primary-light);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
}

.card-content {
  flex: 1;
}

.card-title {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin-bottom: 8px;
}

.card-value {
  font-size: 28px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 4px;
}

.card-change {
  font-size: 14px;
  font-weight: 500;
}

.card-change.positive {
  color: var(--color-success);
}

.card-change.negative {
  color: var(--color-danger);
}

.card-change.neutral {
  color: var(--color-text-secondary);
}

.card-stats {
  display: flex;
  gap: 16px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-label {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.stat-value {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.status-distribution {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.distribution-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  border-radius: 4px;
  font-size: 12px;
}

.distribution-item.excellent {
  background: var(--color-success-light);
  color: var(--color-success);
}

.distribution-item.good {
  background: var(--color-primary-light);
  color: var(--color-primary);
}

.distribution-item.warning {
  background: var(--color-warning-light);
  color: var(--color-warning);
}

.distribution-item.danger {
  background: var(--color-danger-light);
  color: var(--color-danger);
}

/* 趋势分析区域 */
.trend-section {
  margin-bottom: 32px;
}

.trend-charts {
  background: var(--color-background-secondary);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 20px;
}

.chart-container {
  width: 100%;
}

.chart-header {
  margin-bottom: 16px;
}

.chart-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

/* 项目排名区域 */
.ranking-section {
  margin-bottom: 32px;
}

.ranking-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
}

.ranking-card {
  background: var(--color-background-secondary);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 20px;
}

.ranking-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.ranking-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.view-all-btn {
  padding: 4px 8px;
  border: 1px solid var(--color-border);
  background: var(--color-background);
  color: var(--color-text-secondary);
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.view-all-btn:hover {
  background: var(--color-background-hover);
  color: var(--color-text-primary);
}

.ranking-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ranking-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--color-background);
  border-radius: 6px;
  border: 1px solid var(--color-border);
}

.ranking-position {
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

.ranking-position.rank-first {
  background: #ffd700;
}

.ranking-position.rank-second {
  background: #c0c0c0;
}

.ranking-position.rank-third {
  background: #cd7f32;
}

.ranking-position.rank-default {
  background: var(--color-text-secondary);
}

.ranking-info {
  flex: 1;
}

.ranking-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
  margin-bottom: 2px;
}

.ranking-customer {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.ranking-score {
  text-align: right;
}

.score-value {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  display: block;
}

.score-change {
  font-size: 12px;
}

.score-change.positive {
  color: var(--color-success);
}

.score-change.negative {
  color: var(--color-danger);
}

.growth-icon,
.risk-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.growth-icon {
  background: var(--color-success-light);
  color: var(--color-success);
}

.risk-icon {
  background: var(--color-danger-light);
  color: var(--color-danger);
}

.growth-score {
  text-align: right;
}

.growth-value {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-success);
}

.risk-score {
  text-align: right;
}

.risk-value {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-danger);
  display: block;
}

.risk-label {
  font-size: 12px;
  color: var(--color-danger);
}

/* 预警提醒区域 */
.alert-section {
  margin-bottom: 32px;
}

.mark-all-read-btn {
  padding: 6px 12px;
  border: 1px solid var(--color-border);
  background: var(--color-background);
  color: var(--color-text-secondary);
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.mark-all-read-btn:hover {
  background: var(--color-background-hover);
  color: var(--color-text-primary);
}

.alert-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
}

.alert-card {
  background: var(--color-background-secondary);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 20px;
}

.alert-header {
  margin-bottom: 16px;
}

.alert-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.alert-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.alert-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  background: var(--color-background);
  border-radius: 6px;
  border: 1px solid var(--color-border);
}

.alert-item.alert-unread {
  border-left: 3px solid var(--color-primary);
}

.alert-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.alert-icon.danger {
  background: var(--color-danger-light);
  color: var(--color-danger);
}

.alert-icon.warning {
  background: var(--color-warning-light);
  color: var(--color-warning);
}

.alert-icon.expiring {
  background: var(--color-warning-light);
  color: var(--color-warning);
}

.alert-content {
  flex: 1;
}

.alert-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
  margin-bottom: 4px;
}

.alert-description {
  font-size: 12px;
  color: var(--color-text-secondary);
  margin-bottom: 4px;
  line-height: 1.4;
}

.alert-time {
  font-size: 11px;
  color: var(--color-text-tertiary);
}

.alert-action {
  padding: 4px 8px;
  border: 1px solid var(--color-primary);
  background: var(--color-primary-light);
  color: var(--color-primary);
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.alert-action:hover {
  background: var(--color-primary);
  color: white;
}

.suggestion-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.suggestion-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  background: var(--color-background);
  border-radius: 6px;
  border: 1px solid var(--color-border);
}

.suggestion-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--color-warning-light);
  color: var(--color-warning);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.suggestion-content {
  flex: 1;
}

.suggestion-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
  margin-bottom: 4px;
}

.suggestion-description {
  font-size: 12px;
  color: var(--color-text-secondary);
  margin-bottom: 4px;
  line-height: 1.4;
}

.suggestion-impact {
  font-size: 11px;
  color: var(--color-success);
  font-weight: 500;
}

@media (max-width: 768px) {
  .overview-cards,
  .ranking-grid,
  .alert-grid {
    grid-template-columns: 1fr;
  }

  .card-stats {
    flex-direction: column;
    gap: 8px;
  }

  .stat-item {
    flex-direction: row;
    justify-content: space-between;
  }
}
</style>
