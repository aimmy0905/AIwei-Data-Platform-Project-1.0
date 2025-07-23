<template>
  <div class="optimizer-customer-quality-module">
    <div class="quality-module__header">
      <h3 class="quality-module__title">客户质量评估</h3>
      <div class="quality-module__controls">
        <div class="quarter-selector">
          <select v-model="selectedQuarter" @change="handleQuarterChange" class="quarter-select">
            <option value="2024Q1">2024年Q1</option>
            <option value="2024Q2">2024年Q2</option>
            <option value="2024Q3">2024年Q3</option>
            <option value="2024Q4">2024年Q4</option>
          </select>
        </div>
        <div class="quality-summary">
          <span class="summary-label">平均质量分:</span>
          <span class="summary-value" :class="getQualityScoreClass(qualityData.averageQualityScore)">
            {{ qualityData.averageQualityScore.toFixed(1) }}分
          </span>
        </div>
      </div>
    </div>

    <div class="quality-module__content">
      <!-- 质量评估概览 -->
      <div class="quality-overview">
        <div class="overview-cards">
          <div class="quality-card">
            <div class="quality-card__header">
              <div class="card-icon excellent">
                <Star :size="20" />
              </div>
              <div class="card-meta">
                <h4 class="card-title">优质客户</h4>
                <div class="card-subtitle">质量分 ≥ 80</div>
              </div>
            </div>
            <div class="quality-card__content">
              <div class="card-value excellent">{{ qualityData.qualitySegments.excellent.count }}家</div>
              <div class="card-percentage">
                {{ qualityData.qualitySegments.excellent.percentage.toFixed(1) }}%
              </div>
              <div class="card-metrics">
                <div class="metric-item">
                  <span class="metric-label">平均ROI:</span>
                  <span class="metric-value">{{ qualityData.qualitySegments.excellent.avgROI.toFixed(2) }}</span>
                </div>
                <div class="metric-item">
                  <span class="metric-label">留存率:</span>
                  <span class="metric-value">{{ qualityData.qualitySegments.excellent.retentionRate.toFixed(1) }}%</span>
                </div>
              </div>
            </div>
          </div>

          <div class="quality-card">
            <div class="quality-card__header">
              <div class="card-icon good">
                <TrendingUp :size="20" />
              </div>
              <div class="card-meta">
                <h4 class="card-title">良好客户</h4>
                <div class="card-subtitle">质量分 60-79</div>
              </div>
            </div>
            <div class="quality-card__content">
              <div class="card-value good">{{ qualityData.qualitySegments.good.count }}家</div>
              <div class="card-percentage">
                {{ qualityData.qualitySegments.good.percentage.toFixed(1) }}%
              </div>
              <div class="card-metrics">
                <div class="metric-item">
                  <span class="metric-label">平均ROI:</span>
                  <span class="metric-value">{{ qualityData.qualitySegments.good.avgROI.toFixed(2) }}</span>
                </div>
                <div class="metric-item">
                  <span class="metric-label">留存率:</span>
                  <span class="metric-value">{{ qualityData.qualitySegments.good.retentionRate.toFixed(1) }}%</span>
                </div>
              </div>
            </div>
          </div>

          <div class="quality-card">
            <div class="quality-card__header">
              <div class="card-icon average">
                <AlertCircle :size="20" />
              </div>
              <div class="card-meta">
                <h4 class="card-title">一般客户</h4>
                <div class="card-subtitle">质量分 40-59</div>
              </div>
            </div>
            <div class="quality-card__content">
              <div class="card-value average">{{ qualityData.qualitySegments.average.count }}家</div>
              <div class="card-percentage">
                {{ qualityData.qualitySegments.average.percentage.toFixed(1) }}%
              </div>
              <div class="card-metrics">
                <div class="metric-item">
                  <span class="metric-label">平均ROI:</span>
                  <span class="metric-value">{{ qualityData.qualitySegments.average.avgROI.toFixed(2) }}</span>
                </div>
                <div class="metric-item">
                  <span class="metric-label">留存率:</span>
                  <span class="metric-value">{{ qualityData.qualitySegments.average.retentionRate.toFixed(1) }}%</span>
                </div>
              </div>
            </div>
          </div>

          <div class="quality-card">
            <div class="quality-card__header">
              <div class="card-icon poor">
                <AlertTriangle :size="20" />
              </div>
              <div class="card-meta">
                <h4 class="card-title">待改进客户</h4>
                <div class="card-subtitle">质量分 &lt; 40</div>
              </div>
            </div>
            <div class="quality-card__content">
              <div class="card-value poor">{{ qualityData.qualitySegments.poor.count }}家</div>
              <div class="card-percentage">
                {{ qualityData.qualitySegments.poor.percentage.toFixed(1) }}%
              </div>
              <div class="card-metrics">
                <div class="metric-item">
                  <span class="metric-label">平均ROI:</span>
                  <span class="metric-value">{{ qualityData.qualitySegments.poor.avgROI.toFixed(2) }}</span>
                </div>
                <div class="metric-item">
                  <span class="metric-label">留存率:</span>
                  <span class="metric-value">{{ qualityData.qualitySegments.poor.retentionRate.toFixed(1) }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 质量评估雷达图 -->
      <div class="quality-radar">
        <div class="radar-header">
          <h4>综合质量分析雷达图</h4>
          <div class="radar-legend">
            <div class="legend-item">
              <div class="legend-color current"></div>
              <span>当前表现</span>
            </div>
            <div class="legend-item">
              <div class="legend-color benchmark"></div>
              <span>行业基准</span>
            </div>
          </div>
        </div>

        <div class="radar-chart">
          <div class="radar-container">
            <svg viewBox="0 0 300 300" class="radar-svg">
              <!-- 背景网格 -->
              <g class="radar-grid">
                <circle cx="150" cy="150" r="120" fill="none" stroke="#f0f0f0" stroke-width="1" />
                <circle cx="150" cy="150" r="90" fill="none" stroke="#f0f0f0" stroke-width="1" />
                <circle cx="150" cy="150" r="60" fill="none" stroke="#f0f0f0" stroke-width="1" />
                <circle cx="150" cy="150" r="30" fill="none" stroke="#f0f0f0" stroke-width="1" />

                <!-- 坐标轴 -->
                <line x1="150" y1="30" x2="150" y2="270" stroke="#f0f0f0" stroke-width="1" />
                <line x1="30" y1="150" x2="270" y2="150" stroke="#f0f0f0" stroke-width="1" />
                <line x1="67" y1="67" x2="233" y2="233" stroke="#f0f0f0" stroke-width="1" />
                <line x1="233" y1="67" x2="67" y2="233" stroke="#f0f0f0" stroke-width="1" />
              </g>

              <!-- 当前表现多边形 -->
              <polygon
                :points="getRadarPoints(convertRadarData(qualityData.radarData.current))"
                fill="rgba(24, 144, 255, 0.3)"
                stroke="#1890ff"
                stroke-width="2"
              />

              <!-- 行业基准多边形 -->
              <polygon
                :points="getRadarPoints(convertRadarData(qualityData.radarData.benchmark))"
                fill="rgba(82, 196, 26, 0.2)"
                stroke="#52c41a"
                stroke-width="2"
                stroke-dasharray="5,5"
              />

              <!-- 数据点 -->
              <g class="radar-points">
                <circle
                  v-for="(point, index) in getRadarPointsArray(convertRadarData(qualityData.radarData.current))"
                  :key="`current-${index}`"
                  :cx="point.x"
                  :cy="point.y"
                  r="4"
                  fill="#1890ff"
                />
                <circle
                  v-for="(point, index) in getRadarPointsArray(convertRadarData(qualityData.radarData.benchmark))"
                  :key="`benchmark-${index}`"
                  :cx="point.x"
                  :cy="point.y"
                  r="3"
                  fill="#52c41a"
                />
              </g>
            </svg>

            <!-- 标签 -->
            <div class="radar-labels">
              <div class="radar-label" style="top: 10px; left: 50%; transform: translateX(-50%);">ROI表现</div>
              <div class="radar-label" style="top: 25%; right: 10px;">花费稳定性</div>
              <div class="radar-label" style="bottom: 25%; right: 10px;">转化率</div>
              <div class="radar-label" style="bottom: 10px; left: 50%; transform: translateX(-50%);">生命周期</div>
              <div class="radar-label" style="bottom: 25%; left: 10px;">合作配合度</div>
              <div class="radar-label" style="top: 25%; left: 10px;">支付及时性</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 质量改进建议 -->
      <div class="quality-improvements">
        <div class="improvements-header">
          <h4>质量改进建议</h4>
          <div class="priority-filter">
            <select v-model="priorityFilter" class="priority-select">
              <option value="all">全部优先级</option>
              <option value="high">高优先级</option>
              <option value="medium">中优先级</option>
              <option value="low">低优先级</option>
            </select>
          </div>
        </div>

        <div class="improvements-list">
          <div
            v-for="improvement in filteredImprovements"
            :key="improvement.id"
            class="improvement-item"
            :class="getPriorityClass(improvement.priority)"
          >
            <div class="improvement-header">
              <div class="improvement-priority">
                <div class="priority-badge" :class="getPriorityBadgeClass(improvement.priority)">
                  {{ getPriorityText(improvement.priority) }}
                </div>
              </div>
              <div class="improvement-category">{{ improvement.impact }}</div>
              <div class="improvement-impact">
                建议内容: <span class="impact-value">{{ improvement.effort }}</span>
              </div>
            </div>
            <div class="improvement-content">
              <div class="improvement-title">{{ improvement.title }}</div>
              <div class="improvement-description">{{ improvement.description }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 客户质量详情表格 -->
      <div class="quality-details">
        <div class="details-header">
          <h4>客户质量详情</h4>
          <div class="details-controls">
            <div class="segment-filter">
              <select v-model="segmentFilter" class="segment-select">
                <option value="all">全部客户</option>
                <option value="excellent">优质客户</option>
                <option value="good">良好客户</option>
                <option value="average">一般客户</option>
                <option value="poor">待改进客户</option>
              </select>
            </div>
            <div class="sort-controls">
              <select v-model="sortBy" class="sort-select">
                <option value="qualityScore">按质量分排序</option>
                <option value="roi">按ROI排序</option>
                <option value="spend">按花费排序</option>
                <option value="customerName">按客户名称</option>
              </select>
            </div>
          </div>
        </div>

        <div class="quality-table">
          <div class="table-header">
            <div class="header-cell customer-name">客户名称</div>
            <div class="header-cell quality-score">质量分</div>
            <div class="header-cell quality-level">质量等级</div>
            <div class="header-cell roi">ROI</div>
            <div class="header-cell spend">花费</div>
            <div class="header-cell retention">留存</div>
            <div class="header-cell improvement">改进建议</div>
            <div class="header-cell actions">操作</div>
          </div>

          <div class="table-body">
            <div
              v-for="customer in filteredQualityCustomers"
              :key="customer.customerId"
              class="table-row"
              :class="getQualityRowClass(customer.qualityLevel)"
            >
              <div class="table-cell customer-name">
                <div class="customer-info">
                  <div class="customer-name-text">{{ customer.customerName }}</div>
                  <div class="customer-id">ID: {{ customer.customerId }}</div>
                </div>
              </div>
              <div class="table-cell quality-score">
                <div class="score-display" :class="getScoreClass(customer.qualityScore)">
                  {{ customer.qualityScore.toFixed(1) }}
                </div>
              </div>
              <div class="table-cell quality-level">
                <div class="level-badge" :class="getLevelBadgeClass(customer.qualityLevel)">
                  {{ getLevelText(customer.qualityLevel) }}
                </div>
              </div>
              <div class="table-cell roi">
                <span class="roi-value" :class="getROIClass(customer.roi)">
                  {{ customer.roi.toFixed(2) }}
                </span>
              </div>
              <div class="table-cell spend">
                <span class="spend-amount">{{ formatCurrency(customer.spend) }}</span>
              </div>
              <div class="table-cell retention">
                <div class="retention-info">
                  <div class="retention-rate" :class="getRetentionClass(customer.retentionRate)">
                    {{ customer.retentionRate.toFixed(1) }}%
                  </div>
                </div>
              </div>
              <div class="table-cell improvement">
                <div class="improvement-tags">
                  <span
                    v-for="tag in customer.improvementAreas.slice(0, 2)"
                    :key="tag"
                    class="improvement-tag"
                  >
                    {{ tag }}
                  </span>
                  <span v-if="customer.improvementAreas.length > 2" class="more-tags">
                    +{{ customer.improvementAreas.length - 2 }}
                  </span>
                </div>
              </div>
              <div class="table-cell actions">
                <div class="action-buttons">
                  <button
                    class="action-btn analyze-btn"
                    @click="handleViewSegmentDetails(customer.qualityLevel)"
                  >
                    <BarChart3 :size="14" />
                    分析
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 无数据状态 -->
        <div v-if="filteredQualityCustomers.length === 0" class="no-quality-data">
          <div class="no-data-icon">
            <Star :size="48" />
          </div>
          <div class="no-data-text">暂无匹配的质量数据</div>
          <div class="no-data-description">请调整筛选条件或检查数据同步状态</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Star, TrendingUp, AlertCircle, AlertTriangle, BarChart3 } from 'lucide-vue-next'
import type { OptimizerCustomerQualityData } from '@/types'

interface Props {
  qualityData: OptimizerCustomerQualityData
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<{
  'quarter-change': [quarter: string]
  'view-segment-details': [segment: string]
}>()

// 响应式数据
const selectedQuarter = ref('2024Q4')
const priorityFilter = ref<string>('all')
const segmentFilter = ref<string>('all')
const sortBy = ref<string>('qualityScore')

// 计算属性
const filteredImprovements = computed(() => {
  let filtered = props.qualityData.improvementSuggestions

  if (priorityFilter.value !== 'all') {
    filtered = filtered.filter(item => item.priority === priorityFilter.value)
  }

  return filtered
})

const filteredQualityCustomers = computed(() => {
  let filtered = props.qualityData.customerQualityDetails

  // 筛选
  if (segmentFilter.value !== 'all') {
    filtered = filtered.filter(customer => customer.qualityLevel === segmentFilter.value)
  }

  // 排序
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'qualityScore':
        return b.qualityScore - a.qualityScore
      case 'roi':
        return b.roi - a.roi
      case 'spend':
        return b.spend - a.spend
      case 'customerName':
        return a.customerName.localeCompare(b.customerName)
      default:
        return 0
    }
  })

  return filtered
})

// 方法
const formatCurrency = (value: number): string => {
  if (value >= 100000000) {
    return `¥${(value / 100000000).toFixed(2)}亿`
  } else if (value >= 10000) {
    return `¥${(value / 10000).toFixed(1)}万`
  } else {
    return `¥${value.toLocaleString()}`
  }
}

const getQualityScoreClass = (score: number) => {
  if (score >= 80) return 'score-excellent'
  if (score >= 60) return 'score-good'
  if (score >= 40) return 'score-average'
  return 'score-poor'
}

// 转换雷达图数据
const convertRadarData = (data: { spend: number; roi: number; conversion: number; retention: number; engagement: number; satisfaction: number }): number[] => {
  return [data.spend, data.roi, data.conversion, data.retention, data.engagement, data.satisfaction]
}

// 雷达图相关方法
const getRadarPoints = (data: number[]): string => {
  const centerX = 150
  const centerY = 150
  const maxRadius = 120

  const points = data.map((value, index) => {
    const angle = (index * 60 - 90) * (Math.PI / 180) // 6个维度，每个60度
    const radius = (value / 100) * maxRadius
    const x = centerX + radius * Math.cos(angle)
    const y = centerY + radius * Math.sin(angle)
    return `${x},${y}`
  })

  return points.join(' ')
}

const getRadarPointsArray = (data: number[]): { x: number; y: number }[] => {
  const centerX = 150
  const centerY = 150
  const maxRadius = 120

  return data.map((value, index) => {
    const angle = (index * 60 - 90) * (Math.PI / 180)
    const radius = (value / 100) * maxRadius
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    }
  })
}

const getPriorityClass = (priority: string) => {
  return `priority-${priority}`
}

const getPriorityBadgeClass = (priority: string) => {
  return `badge-${priority}`
}

const getPriorityText = (priority: string) => {
  const priorityMap = {
    high: '高',
    medium: '中',
    low: '低'
  }
  return priorityMap[priority as keyof typeof priorityMap] || priority
}

const getQualityRowClass = (level: string) => {
  return `row-${level}`
}

const getScoreClass = (score: number) => {
  if (score >= 80) return 'score-excellent'
  if (score >= 60) return 'score-good'
  if (score >= 40) return 'score-average'
  return 'score-poor'
}

const getLevelBadgeClass = (level: string) => {
  return `level-${level}`
}

const getLevelText = (level: string) => {
  const levelMap = {
    excellent: '优质',
    good: '良好',
    average: '一般',
    poor: '待改进'
  }
  return levelMap[level as keyof typeof levelMap] || level
}

const getROIClass = (roi: number) => {
  if (roi >= 4) return 'roi-excellent'
  if (roi >= 3) return 'roi-good'
  if (roi >= 2) return 'roi-average'
  return 'roi-poor'
}

const getRetentionClass = (rate: number) => {
  if (rate >= 80) return 'retention-excellent'
  if (rate >= 60) return 'retention-good'
  if (rate >= 40) return 'retention-average'
  return 'retention-poor'
}

const handleQuarterChange = () => {
  emit('quarter-change', selectedQuarter.value)
}

const handleViewSegmentDetails = (segment: string) => {
  emit('view-segment-details', segment)
}
</script>

<style scoped>
.optimizer-customer-quality-module {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-bottom: 24px;
}

.quality-module__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.quality-module__title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #262626;
}

.quality-module__controls {
  display: flex;
  align-items: center;
  gap: 16px;
}

.quarter-select {
  padding: 6px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  background: #fff;
  color: #262626;
  font-size: 14px;
  outline: none;
}

.quality-summary {
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
  font-size: 16px;
}

.summary-value.score-excellent { color: #52c41a; }
.summary-value.score-good { color: #1890ff; }
.summary-value.score-average { color: #fa8c16; }
.summary-value.score-poor { color: #ff4d4f; }

.quality-module__content {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* 质量概览卡片 */
.overview-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.quality-card {
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 20px;
}

.quality-card__header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.card-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.card-icon.excellent { background: linear-gradient(135deg, #52c41a, #73d13d); }
.card-icon.good { background: linear-gradient(135deg, #1890ff, #40a9ff); }
.card-icon.average { background: linear-gradient(135deg, #fa8c16, #ffa940); }
.card-icon.poor { background: linear-gradient(135deg, #ff4d4f, #ff7875); }

.card-meta {
  flex: 1;
}

.card-title {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 600;
  color: #262626;
}

.card-subtitle {
  font-size: 12px;
  color: #8c8c8c;
}

.card-value {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
}

.card-value.excellent { color: #52c41a; }
.card-value.good { color: #1890ff; }
.card-value.average { color: #fa8c16; }
.card-value.poor { color: #ff4d4f; }

.card-percentage {
  font-size: 12px;
  color: #8c8c8c;
  margin-bottom: 12px;
}

.card-metrics {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.metric-item {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
}

.metric-label {
  color: #8c8c8c;
}

.metric-value {
  font-weight: 500;
  color: #262626;
}

/* 雷达图 */
.radar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.radar-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #262626;
}

.radar-legend {
  display: flex;
  gap: 16px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #8c8c8c;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.legend-color.current { background: #1890ff; }
.legend-color.benchmark { background: #52c41a; }

.radar-container {
  position: relative;
  max-width: 400px;
  margin: 0 auto;
}

.radar-svg {
  width: 100%;
  height: 300px;
}

.radar-labels {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.radar-label {
  position: absolute;
  font-size: 11px;
  color: #595959;
  font-weight: 500;
  text-align: center;
}

/* 改进建议 */
.improvements-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.improvements-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #262626;
}

.priority-select {
  padding: 6px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  background: #fff;
  color: #262626;
  font-size: 14px;
  outline: none;
}

.improvements-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.improvement-item {
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 16px;
  border-left-width: 4px;
}

.improvement-item.priority-high { border-left-color: #ff4d4f; }
.improvement-item.priority-medium { border-left-color: #fa8c16; }
.improvement-item.priority-low { border-left-color: #52c41a; }

.improvement-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
}

.priority-badge {
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 500;
}

.priority-badge.badge-high {
  background: #fff2f0;
  color: #ff4d4f;
}

.priority-badge.badge-medium {
  background: #fff7e6;
  color: #fa8c16;
}

.priority-badge.badge-low {
  background: #f6ffed;
  color: #52c41a;
}

.improvement-category {
  font-size: 12px;
  color: #8c8c8c;
}

.improvement-impact {
  font-size: 12px;
  color: #595959;
}

.impact-value {
  font-weight: 600;
  color: #1890ff;
}

.improvement-title {
  font-size: 14px;
  font-weight: 600;
  color: #262626;
  margin-bottom: 8px;
}

.improvement-description {
  font-size: 13px;
  color: #595959;
  margin-bottom: 12px;
  line-height: 1.5;
}

.improvement-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #8c8c8c;
}

/* 质量详情表格 */
.details-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.details-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #262626;
}

.details-controls {
  display: flex;
  gap: 12px;
}

.segment-select,
.sort-select {
  padding: 6px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  background: #fff;
  color: #262626;
  font-size: 14px;
  outline: none;
}

.quality-table {
  border-radius: 8px;
  border: 1px solid #f0f0f0;
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 0.8fr 1fr 0.8fr 1.5fr 0.8fr;
  background: #fafafa;
  border-bottom: 1px solid #f0f0f0;
}

.header-cell {
  padding: 12px 16px;
  font-size: 13px;
  font-weight: 600;
  color: #595959;
  border-right: 1px solid #f0f0f0;
}

.header-cell:last-child {
  border-right: none;
}

.table-body {
  max-height: 500px;
  overflow-y: auto;
}

.table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 0.8fr 1fr 0.8fr 1.5fr 0.8fr;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s;
}

.table-row:hover {
  background: #f9f9f9;
}

.table-row.row-excellent { background: rgba(82, 196, 26, 0.05); }
.table-row.row-good { background: rgba(24, 144, 255, 0.05); }
.table-row.row-average { background: rgba(250, 140, 22, 0.05); }
.table-row.row-poor { background: rgba(255, 77, 79, 0.05); }

.table-cell {
  padding: 12px 16px;
  font-size: 14px;
  color: #262626;
  border-right: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
}

.table-cell:last-child {
  border-right: none;
}

.customer-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.customer-name-text {
  font-weight: 500;
}

.customer-id {
  font-size: 12px;
  color: #8c8c8c;
}

.score-display {
  font-size: 16px;
  font-weight: 700;
}

.score-display.score-excellent { color: #52c41a; }
.score-display.score-good { color: #1890ff; }
.score-display.score-average { color: #fa8c16; }
.score-display.score-poor { color: #ff4d4f; }

.level-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
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
  color: #fa8c16;
}

.level-badge.level-poor {
  background: #fff2f0;
  color: #ff4d4f;
}

.roi-value.roi-excellent { color: #52c41a; font-weight: 600; }
.roi-value.roi-good { color: #1890ff; font-weight: 600; }
.roi-value.roi-average { color: #fa8c16; font-weight: 600; }
.roi-value.roi-poor { color: #ff4d4f; font-weight: 600; }

.spend-amount {
  font-weight: 500;
}

.retention-rate.retention-excellent { color: #52c41a; font-weight: 600; }
.retention-rate.retention-good { color: #1890ff; font-weight: 600; }
.retention-rate.retention-average { color: #fa8c16; font-weight: 600; }
.retention-rate.retention-poor { color: #ff4d4f; font-weight: 600; }

.improvement-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.improvement-tag {
  padding: 2px 6px;
  background: #f0f0f0;
  color: #595959;
  border-radius: 10px;
  font-size: 10px;
}

.more-tags {
  padding: 2px 6px;
  background: #e6f7ff;
  color: #1890ff;
  border-radius: 10px;
  font-size: 10px;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.analyze-btn {
  background: #1890ff;
  color: #fff;
}

.analyze-btn:hover {
  background: #40a9ff;
}

/* 无数据状态 */
.no-quality-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #8c8c8c;
}

.no-data-icon {
  margin-bottom: 16px;
  opacity: 0.5;
}

.no-data-text {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
}

.no-data-description {
  font-size: 14px;
}

@media (max-width: 1200px) {
  .overview-cards {
    grid-template-columns: repeat(2, 1fr);
  }

  .table-header,
  .table-row {
    grid-template-columns: 2fr 0.8fr 0.8fr 0.8fr 1fr 0.8fr 1fr 0.8fr;
  }
}

@media (max-width: 768px) {
  .optimizer-customer-quality-module {
    padding: 16px;
  }

  .quality-module__header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .overview-cards {
    grid-template-columns: 1fr;
  }

  .radar-header {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }

  .improvement-header {
    flex-direction: column;
    gap: 8px;
    align-items: stretch;
  }

  .improvement-actions {
    flex-direction: column;
    gap: 4px;
  }

  .details-header {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }

  .details-controls {
    flex-direction: column;
    gap: 8px;
  }

  .quality-table {
    overflow-x: auto;
  }

  .table-header,
  .table-row {
    min-width: 800px;
  }

  .radar-container {
    max-width: 280px;
  }

  .radar-svg {
    height: 280px;
  }
}
</style>
