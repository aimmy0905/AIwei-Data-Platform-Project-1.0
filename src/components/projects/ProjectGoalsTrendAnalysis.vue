<template>
  <div class="goals-trend-analysis">
    <!-- 趋势分析控制面板 -->
    <div class="trend-controls">
      <div class="control-group">
        <label class="control-label">时间维度</label>
        <select v-model="timeDimension" @change="handleTimeDimensionChange" class="control-select">
          <option value="daily">日度趋势</option>
          <option value="weekly">周度趋势</option>
          <option value="monthly">月度趋势</option>
          <option value="quarterly">季度趋势</option>
          <option value="yearly">年度趋势</option>
        </select>
      </div>

      <div class="control-group">
        <label class="control-label">指标维度</label>
        <div class="metric-checkboxes">
          <label v-for="metric in availableMetrics" :key="metric.key" class="metric-checkbox">
            <input
              type="checkbox"
              v-model="selectedMetrics"
              :value="metric.key"
              @change="handleMetricChange"
            />
            <span class="checkbox-label">{{ metric.label }}</span>
          </label>
        </div>
      </div>

      <div class="control-group">
        <label class="control-label">图表类型</label>
        <div class="chart-type-tabs">
          <button
            v-for="type in chartTypes"
            :key="type.value"
            class="chart-type-btn"
            :class="{ 'chart-type-btn--active': activeChartType === type.value }"
            @click="activeChartType = type.value"
          >
            <component :is="type.icon" :size="16" />
            {{ type.label }}
          </button>
        </div>
      </div>

      <div class="control-group">
        <label class="control-label">项目筛选</label>
        <select v-model="selectedProject" @change="handleProjectChange" class="control-select">
          <option value="">全部项目</option>
          <option v-for="project in projects" :key="project.id" :value="project.id">
            {{ project.project_name }}
          </option>
        </select>
      </div>

      <div class="control-group">
        <label class="control-label">时间范围</label>
        <div class="date-range-picker">
          <input
            type="date"
            v-model="dateRange.start"
            @change="handleDateRangeChange"
            class="date-input"
          />
          <span class="date-separator">至</span>
          <input
            type="date"
            v-model="dateRange.end"
            @change="handleDateRangeChange"
            class="date-input"
          />
        </div>
      </div>
    </div>

    <!-- 趋势图表区域 -->
    <div class="trend-charts">
      <!-- 折线图 -->
      <div v-if="activeChartType === 'line'" class="chart-section">
        <div class="chart-header">
          <h3>目标完成率趋势</h3>
          <div class="chart-actions">
            <button class="chart-action-btn" @click="exportChart('line')">
              <Download :size="14" />
              导出
            </button>
            <button class="chart-action-btn" @click="toggleFullscreen('line')">
              <Maximize :size="14" />
              全屏
            </button>
          </div>
        </div>
        <div class="chart-container">
          <LineChart
            :data="lineChartData"
            :height="'400px'"
            :show-legend="true"
            :smooth="true"
          />
        </div>
        <div class="chart-insights">
          <div class="insight-item">
            <span class="insight-label">平均完成率:</span>
            <span class="insight-value">{{ averageCompletionRate }}%</span>
          </div>
          <div class="insight-item">
            <span class="insight-label">最高完成率:</span>
            <span class="insight-value">{{ maxCompletionRate }}%</span>
          </div>
          <div class="insight-item">
            <span class="insight-label">增长趋势:</span>
            <span class="insight-value" :class="getTrendClass(trendDirection)">
              {{ trendDirection > 0 ? '上升' : trendDirection < 0 ? '下降' : '平稳' }}
              {{ Math.abs(trendDirection) }}%
            </span>
          </div>
        </div>
      </div>

      <!-- 柱状图 -->
      <div v-if="activeChartType === 'bar'" class="chart-section">
        <div class="chart-header">
          <h3>各维度目标对比</h3>
          <div class="chart-actions">
            <button class="chart-action-btn" @click="exportChart('bar')">
              <Download :size="14" />
              导出
            </button>
            <button class="chart-action-btn" @click="toggleFullscreen('bar')">
              <Maximize :size="14" />
              全屏
            </button>
          </div>
        </div>
        <div class="chart-container">
          <BarChart
            :data="barChartData"
            :height="'400px'"
            :show-legend="true"
          />
        </div>
        <div class="chart-insights">
          <div class="insight-item">
            <span class="insight-label">最佳表现:</span>
            <span class="insight-value">{{ bestPerformingMetric }}</span>
          </div>
          <div class="insight-item">
            <span class="insight-label">需要改进:</span>
            <span class="insight-value">{{ worstPerformingMetric }}</span>
          </div>
        </div>
      </div>

      <!-- 雷达图 -->
      <div v-if="activeChartType === 'radar'" class="chart-section">
        <div class="chart-header">
          <h3>多维度目标完成情况</h3>
          <div class="chart-actions">
            <button class="chart-action-btn" @click="exportChart('radar')">
              <Download :size="14" />
              导出
            </button>
            <button class="chart-action-btn" @click="toggleFullscreen('radar')">
              <Maximize :size="14" />
              全屏
            </button>
          </div>
        </div>
        <div class="chart-container">
          <div class="radar-chart" ref="radarChartRef"></div>
        </div>
        <div class="chart-insights">
          <div class="insight-item">
            <span class="insight-label">综合评分:</span>
            <span class="insight-value">{{ overallScore }}/100</span>
          </div>
          <div class="insight-item">
            <span class="insight-label">平衡度:</span>
            <span class="insight-value">{{ balanceScore }}%</span>
          </div>
        </div>
      </div>

      <!-- 进度条图 -->
      <div v-if="activeChartType === 'progress'" class="chart-section">
        <div class="chart-header">
          <h3>当前周期目标进度</h3>
          <div class="chart-actions">
            <button class="chart-action-btn" @click="exportChart('progress')">
              <Download :size="14" />
              导出
            </button>
          </div>
        </div>
        <div class="progress-charts">
          <div
            v-for="progress in progressData"
            :key="progress.id"
            class="progress-item"
          >
            <div class="progress-header">
              <div class="progress-info">
                <h4>{{ progress.projectName }}</h4>
                <span class="progress-period">{{ progress.period }}</span>
              </div>
              <div class="progress-rate" :class="getProgressClass(progress.completionRate)">
                {{ progress.completionRate }}%
              </div>
            </div>
            <div class="progress-metrics">
              <div
                v-for="metric in progress.metrics"
                :key="metric.name"
                class="metric-progress"
              >
                <div class="metric-header">
                  <span class="metric-name">{{ metric.name }}</span>
                  <span class="metric-value">{{ metric.completion }}%</span>
                </div>
                <div class="progress-bar">
                  <div
                    class="progress-fill"
                    :style="{ width: Math.min(metric.completion, 100) + '%' }"
                    :class="getProgressClass(metric.completion)"
                  ></div>
                </div>
                <div class="metric-details">
                  <span class="metric-target">目标: {{ metric.target }}</span>
                  <span class="metric-actual">实际: {{ metric.actual }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 热力图 -->
      <div v-if="activeChartType === 'heatmap'" class="chart-section">
        <div class="chart-header">
          <h3>项目目标完成热力图</h3>
          <div class="chart-actions">
            <button class="chart-action-btn" @click="exportChart('heatmap')">
              <Download :size="14" />
              导出
            </button>
            <button class="chart-action-btn" @click="toggleFullscreen('heatmap')">
              <Maximize :size="14" />
              全屏
            </button>
          </div>
        </div>
        <div class="heatmap-container">
          <div class="heatmap-grid">
            <div class="heatmap-header">
              <div class="header-cell"></div>
              <div
                v-for="metric in heatmapMetrics"
                :key="metric"
                class="header-cell"
              >
                {{ metric }}
              </div>
            </div>
            <div
              v-for="project in heatmapData"
              :key="project.id"
              class="heatmap-row"
            >
              <div class="row-label">{{ project.name }}</div>
              <div
                v-for="value in project.values"
                :key="value.metric"
                class="heatmap-cell"
                :class="getHeatmapClass(value.completion)"
                :title="`${value.metric}: ${value.completion}%`"
              >
                {{ value.completion }}%
              </div>
            </div>
          </div>
          <div class="heatmap-legend">
            <span class="legend-label">完成率:</span>
            <div class="legend-scale">
              <div class="legend-item legend-low">0-50%</div>
              <div class="legend-item legend-medium">50-80%</div>
              <div class="legend-item legend-high">80-100%</div>
              <div class="legend-item legend-excellent">100%+</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 预警功能 -->
    <div class="trend-alerts">
      <div class="alerts-header">
        <h3>趋势预警</h3>
        <div class="alert-filters">
          <select v-model="alertLevel" class="alert-filter-select">
            <option value="">全部预警</option>
            <option value="high">高风险</option>
            <option value="medium">中风险</option>
            <option value="low">低风险</option>
          </select>
        </div>
      </div>
      <div class="alerts-list">
        <div
          v-for="alert in filteredAlerts"
          :key="alert.id"
          class="alert-item"
          :class="alert.level"
        >
          <div class="alert-icon">
            <component :is="getAlertIcon(alert.type)" :size="16" />
          </div>
          <div class="alert-content">
            <div class="alert-title">{{ alert.title }}</div>
            <div class="alert-description">{{ alert.description }}</div>
            <div class="alert-suggestion">建议: {{ alert.suggestion }}</div>
          </div>
          <div class="alert-meta">
            <span class="alert-time">{{ formatTime(alert.createdAt) }}</span>
            <span class="alert-level-badge" :class="alert.level">{{ getLevelText(alert.level) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 预测分析 -->
    <div class="prediction-analysis">
      <div class="prediction-header">
        <h3>目标达成预测</h3>
        <div class="prediction-controls">
          <select v-model="predictionPeriod" class="prediction-select">
            <option value="1">未来1个月</option>
            <option value="3">未来3个月</option>
            <option value="6">未来6个月</option>
            <option value="12">未来12个月</option>
          </select>
        </div>
      </div>
      <div class="prediction-content">
        <div class="prediction-chart">
          <AreaChart
            :data="predictionChartData"
            :height="'300px'"
            :show-legend="true"
            :stack="false"
          />
        </div>
        <div class="prediction-insights">
          <div class="prediction-cards">
            <div class="prediction-card">
              <div class="card-icon success">
                <TrendingUp :size="24" />
              </div>
              <div class="card-content">
                <div class="card-title">预期达成率</div>
                <div class="card-value">{{ predictedCompletionRate }}%</div>
                <div class="card-trend">较当前提升 {{ improvementRate }}%</div>
              </div>
            </div>
            <div class="prediction-card">
              <div class="card-icon warning">
                <AlertTriangle :size="24" />
              </div>
              <div class="card-content">
                <div class="card-title">风险项目</div>
                <div class="card-value">{{ riskProjectsCount }}</div>
                <div class="card-trend">需要重点关注</div>
              </div>
            </div>
            <div class="prediction-card">
              <div class="card-icon info">
                <Target :size="24" />
              </div>
              <div class="card-content">
                <div class="card-title">建议调整</div>
                <div class="card-value">{{ adjustmentSuggestions.length }}</div>
                <div class="card-trend">优化建议</div>
              </div>
            </div>
          </div>
          <div class="adjustment-suggestions">
            <h4>优化建议</h4>
            <div class="suggestions-list">
              <div
                v-for="suggestion in adjustmentSuggestions"
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import {
  TrendingUp,
  BarChart3,
  Target,
  Activity,
  Download,
  Maximize,
  AlertTriangle,
  Lightbulb
} from 'lucide-vue-next'
import LineChart from '@/components/charts/LineChart.vue'
import BarChart from '@/components/charts/BarChart.vue'
import AreaChart from '@/components/charts/AreaChart.vue'
import { mockProjects, mockProjectGoals, type Project, type ProjectGoal } from '@/mock/projects'

// 响应式数据
const timeDimension = ref('monthly')
const selectedMetrics = ref(['sales', 'roi', 'cost'])
const activeChartType = ref('line')
const selectedProject = ref('')
const dateRange = ref({
  start: '2024-01-01',
  end: '2024-12-31'
})
const alertLevel = ref('')
const predictionPeriod = ref('3')

const projects = ref<Project[]>([])
const radarChartRef = ref<HTMLElement>()

// 配置数据
const availableMetrics = [
  { key: 'sales', label: '销量完成率' },
  { key: 'cost', label: '成本完成率' },
  { key: 'roi', label: 'ROI完成率' },
  { key: 'profit', label: '利润完成率' },
  { key: 'user_count', label: '用户数完成率' }
]

const chartTypes = [
  { value: 'line', label: '折线图', icon: TrendingUp },
  { value: 'bar', label: '柱状图', icon: BarChart3 },
  { value: 'radar', label: '雷达图', icon: Target },
  { value: 'progress', label: '进度条', icon: Activity },
  { value: 'heatmap', label: '热力图', icon: Activity }
]

// 模拟数据
const trendAlerts = ref([
  {
    id: 1,
    type: 'trend_down',
    level: 'high',
    title: '完成率持续下降',
    description: '美妆品牌海外推广项目的ROI完成率连续3个月下降',
    suggestion: '建议优化投放策略，调整目标受众定位',
    createdAt: '2024-12-20T10:30:00'
  },
  {
    id: 2,
    type: 'target_risk',
    level: 'medium',
    title: '目标达成风险',
    description: '电子产品海外电商运营项目本月完成率仅65%，存在未达标风险',
    suggestion: '建议增加推广投入或调整目标设定',
    createdAt: '2024-12-20T09:15:00'
  }
])

const adjustmentSuggestions = ref([
  {
    id: 1,
    title: '优化投放时段',
    description: '根据数据分析，建议将广告投放集中在转化率较高的时段',
    expectedImprovement: '15-20%'
  },
  {
    id: 2,
    title: '调整目标受众',
    description: '扩大目标受众范围，增加潜在客户触达',
    expectedImprovement: '10-15%'
  },
  {
    id: 3,
    title: '优化创意素材',
    description: '更新广告创意，提高点击率和转化率',
    expectedImprovement: '12-18%'
  }
])

// 初始化数据
onMounted(() => {
  projects.value = mockProjects
  initializeCharts()
})

// 计算属性
const lineChartData = computed(() => ({
  labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
  datasets: selectedMetrics.value.map((metric, index) => ({
    label: availableMetrics.find(m => m.key === metric)?.label || metric,
    data: generateTrendData(metric),
    color: getMetricColor(metric, index)
  }))
}))

const barChartData = computed(() => ({
  labels: selectedMetrics.value.map(metric =>
    availableMetrics.find(m => m.key === metric)?.label || metric
  ),
  datasets: [
    {
      label: '目标值',
      data: selectedMetrics.value.map(() => 100),
      color: '#e6f7ff'
    },
    {
      label: '完成值',
      data: selectedMetrics.value.map(metric => generateCurrentValue(metric)),
      color: '#1890ff'
    }
  ]
}))

const progressData = computed(() => {
  return mockProjectGoals.slice(0, 3).map(goal => ({
    id: goal.id,
    projectName: goal.project_name,
    period: goal.goal_period,
    completionRate: Math.round((
      (goal.completion_rate?.sales || 0) +
      (goal.completion_rate?.roi || 0) +
      (goal.completion_rate?.cost || 0)
    ) / 3),
    metrics: [
      {
        name: '销量目标',
        completion: goal.completion_rate?.sales || 0,
        target: `$${goal.sales_target.toLocaleString()}`,
        actual: `$${(goal.actual_sales || 0).toLocaleString()}`
      },
      {
        name: 'ROI目标',
        completion: goal.completion_rate?.roi || 0,
        target: `${goal.roi_target}x`,
        actual: `${goal.actual_roi || 0}x`
      },
      {
        name: '成本目标',
        completion: goal.completion_rate?.cost || 0,
        target: `$${goal.cost_target.toLocaleString()}`,
        actual: `$${(goal.actual_cost || 0).toLocaleString()}`
      }
    ]
  }))
})

const heatmapData = computed(() => {
  const metrics = ['销量', 'ROI', '成本', '利润']
  return projects.value.slice(0, 5).map(project => ({
    id: project.id,
    name: project.project_name,
    values: metrics.map(metric => ({
      metric,
      completion: Math.floor(Math.random() * 50) + 50 // 50-100%
    }))
  }))
})

const heatmapMetrics = computed(() => ['销量', 'ROI', '成本', '利润'])

const predictionChartData = computed(() => ({
  labels: ['当前', '1个月后', '2个月后', '3个月后'],
  datasets: [
    {
      label: '预测完成率',
      data: [87, 89, 92, 95],
      color: '#52c41a'
    },
    {
      label: '目标完成率',
      data: [90, 90, 90, 90],
      color: '#ff4d4f'
    }
  ]
}))

const filteredAlerts = computed(() => {
  if (!alertLevel.value) return trendAlerts.value
  return trendAlerts.value.filter(alert => alert.level === alertLevel.value)
})

const averageCompletionRate = computed(() => {
  const data = lineChartData.value.datasets[0]?.data || []
  return Math.round(data.reduce((sum, val) => sum + val, 0) / data.length)
})

const maxCompletionRate = computed(() => {
  const data = lineChartData.value.datasets[0]?.data || []
  return Math.max(...data)
})

const trendDirection = computed(() => {
  const data = lineChartData.value.datasets[0]?.data || []
  if (data.length < 2) return 0
  return Math.round(((data[data.length - 1] - data[0]) / data[0]) * 100)
})

const bestPerformingMetric = computed(() => {
  const values = selectedMetrics.value.map(metric => ({
    metric: availableMetrics.find(m => m.key === metric)?.label || metric,
    value: generateCurrentValue(metric)
  }))
  return values.reduce((best, current) =>
    current.value > best.value ? current : best
  ).metric
})

const worstPerformingMetric = computed(() => {
  const values = selectedMetrics.value.map(metric => ({
    metric: availableMetrics.find(m => m.key === metric)?.label || metric,
    value: generateCurrentValue(metric)
  }))
  return values.reduce((worst, current) =>
    current.value < worst.value ? current : worst
  ).metric
})

const overallScore = computed(() => {
  const scores = selectedMetrics.value.map(metric => generateCurrentValue(metric))
  return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
})

const balanceScore = computed(() => {
  const scores = selectedMetrics.value.map(metric => generateCurrentValue(metric))
  const avg = scores.reduce((sum, score) => sum + score, 0) / scores.length
  const variance = scores.reduce((sum, score) => sum + Math.pow(score - avg, 2), 0) / scores.length
  return Math.max(0, Math.round(100 - Math.sqrt(variance)))
})

const predictedCompletionRate = computed(() => 95)
const improvementRate = computed(() => 8)
const riskProjectsCount = computed(() => 2)

// 方法
const generateTrendData = (metric: string) => {
  const baseValues = {
    sales: [75, 82, 88, 85, 92, 87],
    roi: [68, 75, 82, 79, 85, 83],
    cost: [85, 88, 92, 89, 95, 93],
    profit: [72, 78, 85, 82, 88, 85],
    user_count: [80, 85, 90, 87, 93, 89]
  }
  return baseValues[metric as keyof typeof baseValues] || [80, 85, 90, 87, 93, 89]
}

const generateCurrentValue = (metric: string) => {
  const currentValues = {
    sales: 87,
    roi: 83,
    cost: 93,
    profit: 85,
    user_count: 89
  }
  return currentValues[metric as keyof typeof currentValues] || 85
}

const getMetricColor = (metric: string, index: number) => {
  const colors = ['#1890ff', '#52c41a', '#fa8c16', '#722ed1', '#eb2f96']
  return colors[index % colors.length]
}

const getProgressClass = (rate: number) => {
  if (rate >= 110) return 'excellent'
  if (rate >= 90) return 'good'
  if (rate >= 70) return 'warning'
  return 'danger'
}

const getHeatmapClass = (value: number) => {
  if (value >= 100) return 'heatmap-excellent'
  if (value >= 80) return 'heatmap-high'
  if (value >= 50) return 'heatmap-medium'
  return 'heatmap-low'
}

const getTrendClass = (direction: number) => {
  if (direction > 0) return 'trend-up'
  if (direction < 0) return 'trend-down'
  return 'trend-stable'
}

const getAlertIcon = (type: string) => {
  const iconMap = {
    trend_down: TrendingUp,
    target_risk: AlertTriangle,
    performance: Target
  }
  return iconMap[type as keyof typeof iconMap] || AlertTriangle
}

const getLevelText = (level: string) => {
  const levelMap = {
    high: '高风险',
    medium: '中风险',
    low: '低风险'
  }
  return levelMap[level as keyof typeof levelMap] || level
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

const handleTimeDimensionChange = () => {
  console.log('时间维度变更:', timeDimension.value)
  // 重新加载图表数据
}

const handleMetricChange = () => {
  console.log('指标维度变更:', selectedMetrics.value)
  // 重新生成图表数据
}

const handleProjectChange = () => {
  console.log('项目筛选变更:', selectedProject.value)
  // 重新加载项目数据
}

const handleDateRangeChange = () => {
  console.log('时间范围变更:', dateRange.value)
  // 重新加载数据
}

const exportChart = (chartType: string) => {
  console.log('导出图表:', chartType)
  // TODO: 实现图表导出功能
}

const toggleFullscreen = (chartType: string) => {
  console.log('全屏显示:', chartType)
  // TODO: 实现全屏功能
}

const initializeCharts = () => {
  nextTick(() => {
    // 初始化雷达图等自定义图表
    if (radarChartRef.value) {
      // TODO: 使用 ECharts 或其他图表库初始化雷达图
    }
  })
}
</script>

<style scoped>
.goals-trend-analysis {
  padding: 24px;
  background: var(--color-background);
}

/* 趋势控制面板 */
.trend-controls {
  background: var(--color-background-secondary);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 24px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.control-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
}

.control-select,
.date-input {
  padding: 8px 12px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: var(--color-background);
  color: var(--color-text-primary);
  font-size: 14px;
}

.metric-checkboxes {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.metric-checkbox {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.checkbox-label {
  font-size: 14px;
  color: var(--color-text-primary);
}

.chart-type-tabs {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.chart-type-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: 1px solid var(--color-border);
  background: var(--color-background);
  color: var(--color-text-secondary);
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s ease;
}

.chart-type-btn:hover {
  background: var(--color-background-hover);
  color: var(--color-text-primary);
}

.chart-type-btn--active {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.date-range-picker {
  display: flex;
  align-items: center;
  gap: 8px;
}

.date-separator {
  color: var(--color-text-secondary);
  font-size: 14px;
}

/* 趋势图表区域 */
.trend-charts {
  margin-bottom: 32px;
}

.chart-section {
  background: var(--color-background-secondary);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 24px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.chart-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.chart-actions {
  display: flex;
  gap: 8px;
}

.chart-action-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  border: 1px solid var(--color-border);
  background: var(--color-background);
  color: var(--color-text-secondary);
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s ease;
}

.chart-action-btn:hover {
  background: var(--color-background-hover);
  color: var(--color-text-primary);
}

.chart-container {
  margin-bottom: 16px;
}

.chart-insights {
  display: flex;
  gap: 24px;
  padding: 16px;
  background: var(--color-background);
  border-radius: 6px;
  border: 1px solid var(--color-border);
}

.insight-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.insight-label {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.insight-value {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.insight-value.trend-up {
  color: var(--color-success);
}

.insight-value.trend-down {
  color: var(--color-danger);
}

.insight-value.trend-stable {
  color: var(--color-text-secondary);
}

/* 进度图表 */
.progress-charts {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.progress-item {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  padding: 16px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.progress-info h4 {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 4px 0;
}

.progress-period {
  font-size: 14px;
  color: var(--color-text-secondary);
}

.progress-rate {
  font-size: 20px;
  font-weight: 600;
}

.progress-rate.excellent {
  color: var(--color-success);
}

.progress-rate.good {
  color: var(--color-primary);
}

.progress-rate.warning {
  color: var(--color-warning);
}

.progress-rate.danger {
  color: var(--color-danger);
}

.progress-metrics {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.metric-progress {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.metric-name {
  font-size: 14px;
  color: var(--color-text-primary);
  font-weight: 500;
}

.metric-value {
  font-size: 14px;
  font-weight: 600;
}

.metric-value.excellent {
  color: var(--color-success);
}

.metric-value.good {
  color: var(--color-primary);
}

.metric-value.warning {
  color: var(--color-warning);
}

.metric-value.danger {
  color: var(--color-danger);
}

.progress-bar {
  height: 8px;
  background: var(--color-background-tertiary);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-fill.excellent {
  background: var(--color-success);
}

.progress-fill.good {
  background: var(--color-primary);
}

.progress-fill.warning {
  background: var(--color-warning);
}

.progress-fill.danger {
  background: var(--color-danger);
}

.metric-details {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--color-text-secondary);
}

/* 热力图 */
.heatmap-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.heatmap-grid {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  overflow: hidden;
}

.heatmap-header {
  display: grid;
  grid-template-columns: 200px repeat(4, 1fr);
  background: var(--color-background-tertiary);
}

.header-cell {
  padding: 12px;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
  border-right: 1px solid var(--color-border);
  text-align: center;
}

.heatmap-row {
  display: grid;
  grid-template-columns: 200px repeat(4, 1fr);
  border-bottom: 1px solid var(--color-border);
}

.row-label {
  padding: 12px;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
  border-right: 1px solid var(--color-border);
  background: var(--color-background);
}

.heatmap-cell {
  padding: 12px;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  border-right: 1px solid var(--color-border);
  cursor: pointer;
  transition: all 0.2s ease;
}

.heatmap-cell:hover {
  transform: scale(1.05);
  z-index: 1;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.heatmap-cell.heatmap-low {
  background: #fff2f0;
  color: #ff4d4f;
}

.heatmap-cell.heatmap-medium {
  background: #fff7e6;
  color: #fa8c16;
}

.heatmap-cell.heatmap-high {
  background: #f6ffed;
  color: #52c41a;
}

.heatmap-cell.heatmap-excellent {
  background: #e6f7ff;
  color: #1890ff;
}

.heatmap-legend {
  display: flex;
  align-items: center;
  gap: 16px;
  justify-content: center;
}

.legend-label {
  font-size: 14px;
  color: var(--color-text-secondary);
}

.legend-scale {
  display: flex;
  gap: 8px;
}

.legend-item {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.legend-item.legend-low {
  background: #fff2f0;
  color: #ff4d4f;
}

.legend-item.legend-medium {
  background: #fff7e6;
  color: #fa8c16;
}

.legend-item.legend-high {
  background: #f6ffed;
  color: #52c41a;
}

.legend-item.legend-excellent {
  background: #e6f7ff;
  color: #1890ff;
}

/* 预警功能 */
.trend-alerts {
  background: var(--color-background-secondary);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 24px;
}

.alerts-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.alerts-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.alert-filter-select {
  padding: 6px 10px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: var(--color-background);
  color: var(--color-text-primary);
  font-size: 14px;
}

.alerts-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.alert-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: var(--color-background);
  border-radius: 6px;
  border-left: 4px solid;
}

.alert-item.high {
  border-left-color: var(--color-danger);
}

.alert-item.medium {
  border-left-color: var(--color-warning);
}

.alert-item.low {
  border-left-color: var(--color-info);
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

.alert-item.high .alert-icon {
  background: var(--color-danger-light);
  color: var(--color-danger);
}

.alert-item.medium .alert-icon {
  background: var(--color-warning-light);
  color: var(--color-warning);
}

.alert-item.low .alert-icon {
  background: var(--color-info-light);
  color: var(--color-info);
}

.alert-content {
  flex: 1;
}

.alert-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 4px;
}

.alert-description {
  font-size: 13px;
  color: var(--color-text-secondary);
  margin-bottom: 6px;
  line-height: 1.4;
}

.alert-suggestion {
  font-size: 13px;
  color: var(--color-text-primary);
  font-weight: 500;
}

.alert-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.alert-time {
  font-size: 12px;
  color: var(--color-text-tertiary);
}

.alert-level-badge {
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 500;
}

.alert-level-badge.high {
  background: var(--color-danger-light);
  color: var(--color-danger);
}

.alert-level-badge.medium {
  background: var(--color-warning-light);
  color: var(--color-warning);
}

.alert-level-badge.low {
  background: var(--color-info-light);
  color: var(--color-info);
}

/* 预测分析 */
.prediction-analysis {
  background: var(--color-background-secondary);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 20px;
}

.prediction-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.prediction-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.prediction-select {
  padding: 6px 10px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: var(--color-background);
  color: var(--color-text-primary);
  font-size: 14px;
}

.prediction-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.prediction-chart {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  padding: 16px;
}

.prediction-insights {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.prediction-cards {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.prediction-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 6px;
}

.card-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-icon.success {
  background: var(--color-success-light);
  color: var(--color-success);
}

.card-icon.warning {
  background: var(--color-warning-light);
  color: var(--color-warning);
}

.card-icon.info {
  background: var(--color-info-light);
  color: var(--color-info);
}

.card-content {
  flex: 1;
}

.card-title {
  font-size: 12px;
  color: var(--color-text-secondary);
  margin-bottom: 4px;
}

.card-value {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 2px;
}

.card-trend {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.adjustment-suggestions h4 {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 12px 0;
}

.suggestions-list {
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
  border: 1px solid var(--color-border);
  border-radius: 6px;
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

.radar-chart {
  width: 100%;
  height: 400px;
  background: var(--color-background);
  border-radius: 6px;
  border: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
}

@media (max-width: 1024px) {
  .trend-controls {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }

  .prediction-content {
    grid-template-columns: 1fr;
  }

  .chart-insights {
    flex-direction: column;
    gap: 12px;
  }
}

@media (max-width: 768px) {
  .trend-controls {
    grid-template-columns: 1fr;
  }

  .chart-type-tabs {
    flex-direction: column;
  }

  .heatmap-header,
  .heatmap-row {
    grid-template-columns: 120px repeat(4, 1fr);
  }

  .alerts-header {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }

  .prediction-cards {
    gap: 8px;
  }

  .prediction-card {
    padding: 12px;
  }
}
</style>
