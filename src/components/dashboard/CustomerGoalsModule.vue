<template>
  <div class="customer-goals-module">
    <!-- 目标类型筛选 -->
    <div class="goals-filter">
      <div class="filter-tabs">
        <button
          v-for="type in goalTypes"
          :key="type.value"
          :class="['tab-button', { active: activeGoalType === type.value }]"
          @click="handleGoalTypeChange(type.value)"
        >
          {{ type.label }}
        </button>
      </div>

      <!-- 时间选择 -->
      <div class="time-selector">
        <select v-model="selectedPeriod" @change="handlePeriodChange" class="period-select">
          <option v-for="period in availablePeriods" :key="period.value" :value="period.value">
            {{ period.label }}
          </option>
        </select>


      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>加载目标数据中...</p>
    </div>

    <!-- 目标完成情况卡片 -->
    <div v-else class="goals-grid">
      <!-- 销售额目标 -->
      <div class="goal-card">
        <div class="goal-header">
          <div class="goal-icon sales">
            <TrendingUp class="icon" />
          </div>
          <h3>销售额目标</h3>
        </div>
        <div class="goal-content">
          <div class="goal-values">
            <div class="value-item">
              <span class="label">目标值</span>
              <span class="value">{{ websiteGoals.sales.target }}</span>
            </div>
            <div class="value-item">
              <span class="label">当前值</span>
              <span class="value">{{ websiteGoals.sales.current }}</span>
            </div>
          </div>
          <div class="progress-section">
            <div class="progress-bar">
              <div class="progress-fill sales" :style="{ width: websiteGoals.sales.completion + '%' }"></div>
            </div>
            <span class="completion-rate">{{ websiteGoals.sales.completion }}%</span>
          </div>

          <!-- 时间进度指示器 -->
          <div class="time-progress-section">
            <div class="time-progress-indicator" :class="getTimeProgressClass(websiteGoals.sales.completion, websiteGoals.sales.timeProgress)">
              <component :is="getTimeProgressIcon(websiteGoals.sales.completion, websiteGoals.sales.timeProgress)" :size="14" />
              <span class="time-progress-text">{{ getTimeProgressText(websiteGoals.sales.completion, websiteGoals.sales.timeProgress) }}</span>
            </div>
            <div class="time-progress-detail">
              <span class="time-label">时间进度</span>
              <span class="time-value">{{ websiteGoals.sales.timeProgress }}%</span>
            </div>
          </div>

        </div>
      </div>

      <!-- 利润目标 -->
      <div class="goal-card">
        <div class="goal-header">
          <div class="goal-icon profit">
            <DollarSign class="icon" />
          </div>
          <h3>利润目标</h3>
        </div>
        <div class="goal-content">
          <div class="goal-values">
            <div class="value-item">
              <span class="label">目标值</span>
              <span class="value">{{ websiteGoals.profit.target }}</span>
            </div>
            <div class="value-item">
              <span class="label">当前值</span>
              <span class="value">{{ websiteGoals.profit.current }}</span>
            </div>
          </div>
          <div class="progress-section">
            <div class="progress-bar">
              <div class="progress-fill profit" :style="{ width: websiteGoals.profit.completion + '%' }"></div>
            </div>
            <span class="completion-rate">{{ websiteGoals.profit.completion }}%</span>
          </div>

          <!-- 时间进度指示器 -->
          <div class="time-progress-section">
            <div class="time-progress-indicator" :class="getTimeProgressClass(websiteGoals.profit.completion, websiteGoals.profit.timeProgress)">
              <component :is="getTimeProgressIcon(websiteGoals.profit.completion, websiteGoals.profit.timeProgress)" :size="14" />
              <span class="time-progress-text">{{ getTimeProgressText(websiteGoals.profit.completion, websiteGoals.profit.timeProgress) }}</span>
            </div>
            <div class="time-progress-detail">
              <span class="time-label">时间进度</span>
              <span class="time-value">{{ websiteGoals.profit.timeProgress }}%</span>
            </div>
          </div>

        </div>
      </div>

      <!-- 成本目标 -->
      <div class="goal-card">
        <div class="goal-header">
          <div class="goal-icon cost">
            <Target class="icon" />
          </div>
          <h3>成本目标</h3>
        </div>
        <div class="goal-content">
          <div class="goal-values">
            <div class="value-item">
              <span class="label">目标值</span>
              <span class="value">{{ websiteGoals.cost.target }}</span>
            </div>
            <div class="value-item">
              <span class="label">当前值</span>
              <span class="value">{{ websiteGoals.cost.current }}</span>
            </div>
          </div>
          <div class="progress-section">
            <div class="progress-bar">
              <div class="progress-fill cost" :style="{ width: websiteGoals.cost.completion + '%' }"></div>
            </div>
            <span class="completion-rate">{{ websiteGoals.cost.completion }}%</span>
          </div>

          <!-- 时间进度指示器 -->
          <div class="time-progress-section">
            <div class="time-progress-indicator" :class="getTimeProgressClass(websiteGoals.cost.completion, websiteGoals.cost.timeProgress)">
              <component :is="getTimeProgressIcon(websiteGoals.cost.completion, websiteGoals.cost.timeProgress)" :size="14" />
              <span class="time-progress-text">{{ getTimeProgressText(websiteGoals.cost.completion, websiteGoals.cost.timeProgress) }}</span>
            </div>
            <div class="time-progress-detail">
              <span class="time-label">时间进度</span>
              <span class="time-value">{{ websiteGoals.cost.timeProgress }}%</span>
            </div>
          </div>

        </div>
      </div>

      <!-- ROI目标 -->
      <div class="goal-card">
        <div class="goal-header">
          <div class="goal-icon roi">
            <BarChart3 class="icon" />
          </div>
          <h3>ROI目标</h3>
        </div>
        <div class="goal-content">
          <div class="goal-values">
            <div class="value-item">
              <span class="label">目标值</span>
              <span class="value">{{ websiteGoals.roi.target }}</span>
            </div>
            <div class="value-item">
              <span class="label">当前值</span>
              <span class="value">{{ websiteGoals.roi.current }}</span>
            </div>
          </div>
          <div class="progress-section">
            <div class="progress-bar">
              <div class="progress-fill roi" :style="{ width: websiteGoals.roi.completion + '%' }"></div>
            </div>
            <span class="completion-rate">{{ websiteGoals.roi.completion }}%</span>
          </div>

          <!-- 时间进度指示器 -->
          <div class="time-progress-section">
            <div class="time-progress-indicator" :class="getTimeProgressClass(websiteGoals.roi.completion, websiteGoals.roi.timeProgress)">
              <component :is="getTimeProgressIcon(websiteGoals.roi.completion, websiteGoals.roi.timeProgress)" :size="14" />
              <span class="time-progress-text">{{ getTimeProgressText(websiteGoals.roi.completion, websiteGoals.roi.timeProgress) }}</span>
            </div>
            <div class="time-progress-detail">
              <span class="time-label">时间进度</span>
              <span class="time-value">{{ websiteGoals.roi.timeProgress }}%</span>
            </div>
          </div>

        </div>
      </div>

      <!-- 用户数目标 -->
      <div class="goal-card">
        <div class="goal-header">
          <div class="goal-icon users">
            <Users class="icon" />
          </div>
          <h3>用户数目标</h3>
        </div>
        <div class="goal-content">
          <div class="goal-values">
            <div class="value-item">
              <span class="label">目标值</span>
              <span class="value">{{ websiteGoals.users.target }}</span>
            </div>
            <div class="value-item">
              <span class="label">当前值</span>
              <span class="value">{{ websiteGoals.users.current }}</span>
            </div>
          </div>
          <div class="progress-section">
            <div class="progress-bar">
              <div class="progress-fill users" :style="{ width: websiteGoals.users.completion + '%' }"></div>
            </div>
            <span class="completion-rate">{{ websiteGoals.users.completion }}%</span>
          </div>

          <!-- 时间进度指示器 -->
          <div class="time-progress-section">
            <div class="time-progress-indicator" :class="getTimeProgressClass(websiteGoals.users.completion, websiteGoals.users.timeProgress)">
              <component :is="getTimeProgressIcon(websiteGoals.users.completion, websiteGoals.users.timeProgress)" :size="14" />
              <span class="time-progress-text">{{ getTimeProgressText(websiteGoals.users.completion, websiteGoals.users.timeProgress) }}</span>
            </div>
            <div class="time-progress-detail">
              <span class="time-label">时间进度</span>
              <span class="time-value">{{ websiteGoals.users.timeProgress }}%</span>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- 模块小结 -->
    <div class="module-summary">
      <div class="summary-header">
        <h3>模块小结</h3>
        <button class="edit-summary-btn" @click="toggleEditMode">
          <component :is="isEditingMode ? 'Check' : 'Edit'" :size="16" />
          {{ isEditingMode ? '保存' : '编辑' }}
        </button>
      </div>

      <div class="summary-content">
        <div v-if="!isEditingMode" class="summary-display">
          <p>{{ summaryText }}</p>
        </div>
        <div v-else class="summary-edit">
          <textarea
            v-model="editingSummaryText"
            class="summary-textarea"
            placeholder="请输入目标完成情况小结..."
            rows="4"
          ></textarea>
        </div>
      </div>

      <!-- 目标完成概览 -->
      <div class="summary-stats">
        <div class="stat-item">
          <span class="stat-label">总体完成率</span>
          <span class="stat-value">{{ overallProgress }}%</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">达标目标数</span>
          <span class="stat-value">{{ achievedGoalsCount }}/{{ totalGoalsCount }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">进度状态</span>
          <span :class="['stat-badge', progressStatusClass]">{{ progressStatusText }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { TrendingUp, DollarSign, Target, BarChart3, Users, Clock, TrendingDown, Edit, Check } from 'lucide-vue-next'


// 目标类型选项
const goalTypes = [
  { value: 'monthly', label: '月度目标' },
  { value: 'quarterly', label: '季度目标' },
  { value: 'yearly', label: '年度目标' }
]

// 可用时间段
const availablePeriods = computed(() => {
  if (activeGoalType.value === 'monthly') {
    return [
      { value: '2025-01', label: '2025年1月' },
      { value: '2024-12', label: '2024年12月' },
      { value: '2024-11', label: '2024年11月' }
    ]
  } else if (activeGoalType.value === 'quarterly') {
    return [
      { value: '2025-Q1', label: '2025年第一季度' },
      { value: '2024-Q4', label: '2024年第四季度' },
      { value: '2024-Q3', label: '2024年第三季度' }
    ]
  } else {
    return [
      { value: '2025', label: '2025年' },
      { value: '2024', label: '2024年' },
      { value: '2023', label: '2023年' }
    ]
  }
})

// 小结相关计算属性
const overallProgress = computed(() => {
  const goals = websiteGoals.value
  const totalCompletion = goals.sales.completion + goals.profit.completion + goals.users.completion
  return Math.round(totalCompletion / 3)
})

const totalGoalsCount = computed(() => 3) // 销售额、利润、用户数

const achievedGoalsCount = computed(() => {
  const goals = websiteGoals.value
  let count = 0
  if (goals.sales.completion >= 100) count++
  if (goals.profit.completion >= 100) count++
  if (goals.users.completion >= 100) count++
  return count
})

const progressStatusClass = computed(() => {
  const progress = overallProgress.value
  if (progress >= 90) return 'status-excellent'
  if (progress >= 75) return 'status-good'
  if (progress >= 50) return 'status-warning'
  return 'status-danger'
})

const progressStatusText = computed(() => {
  const progress = overallProgress.value
  if (progress >= 90) return '优秀'
  if (progress >= 75) return '良好'
  if (progress >= 50) return '一般'
  return '需改进'
})

const activeGoalType = ref('monthly')
const selectedPeriod = ref('2025-01')


// 响应式数据
const loading = ref(false)

// 模块小结相关状态
const isEditingMode = ref(false)
const summaryText = ref('本月目标整体进展良好，销售额和利润目标均超额完成，用户增长稳定。建议继续保持当前策略，同时关注转化率优化。')
const editingSummaryText = ref('')

// 网站整体目标数据
const websiteGoals = ref({
  sales: {
    target: '$1,000,000',
    current: '$750,000',
    completion: 75,
    yearOverYear: 15.2,
    monthOverMonth: 8.5,
    timeProgress: 65, // 时间进度百分比
    timeStatus: 'ahead' // ahead: 提前, behind: 滞后, ontrack: 正常
  },
  profit: {
    target: '$500,000',
    current: '$380,000',
    completion: 76,
    yearOverYear: 12.3,
    monthOverMonth: -2.1,
    timeProgress: 70,
    timeStatus: 'ahead'
  },
  cost: {
    target: '$300,000',
    current: '$280,000',
    completion: 93,
    yearOverYear: -8.5,
    monthOverMonth: 2.3,
    timeProgress: 65,
    timeStatus: 'ahead'
  },
  roi: {
    target: '3.5x',
    current: '2.8x',
    completion: 80,
    yearOverYear: 18.5,
    monthOverMonth: -3.2,
    timeProgress: 75,
    timeStatus: 'ahead'
  },
  users: {
    target: '5,000人',
    current: '3,800人',
    completion: 76,
    yearOverYear: 22.8,
    monthOverMonth: 6.3,
    timeProgress: 80,
    timeStatus: 'behind'
  }
})

// 模拟不同时间段的目标数据
const getGoalsDataByPeriod = (goalType: string, period: string) => {
  const baseData = {
    monthly: {
      sales: { target: '$1,000,000', current: '$750,000', completion: 75, yearOverYear: 15.2, monthOverMonth: 8.5, timeProgress: 65, timeStatus: 'ahead' },
      profit: { target: '$500,000', current: '$380,000', completion: 76, yearOverYear: 12.3, monthOverMonth: -2.1, timeProgress: 70, timeStatus: 'ahead' },
      cost: { target: '$300,000', current: '$280,000', completion: 93, yearOverYear: -8.5, monthOverMonth: 2.3, timeProgress: 65, timeStatus: 'ahead' },
      roi: { target: '3.5x', current: '2.8x', completion: 80, yearOverYear: 18.5, monthOverMonth: -3.2, timeProgress: 75, timeStatus: 'ahead' },
      users: { target: '5,000人', current: '3,800人', completion: 76, yearOverYear: 22.8, monthOverMonth: 6.3, timeProgress: 80, timeStatus: 'behind' }
    },
    quarterly: {
      sales: { target: '$3,000,000', current: '$2,250,000', completion: 75, yearOverYear: 18.7, monthOverMonth: 12.1, timeProgress: 60, timeStatus: 'ahead' },
      profit: { target: '$1,500,000', current: '$1,140,000', completion: 76, yearOverYear: 15.8, monthOverMonth: 5.2, timeProgress: 55, timeStatus: 'ahead' },
      cost: { target: '$900,000', current: '$840,000', completion: 93, yearOverYear: -6.2, monthOverMonth: 1.8, timeProgress: 60, timeStatus: 'ahead' },
      roi: { target: '3.8x', current: '3.1x', completion: 82, yearOverYear: 21.3, monthOverMonth: 2.7, timeProgress: 65, timeStatus: 'ahead' },
      users: { target: '15,000人', current: '11,400人', completion: 76, yearOverYear: 25.4, monthOverMonth: 8.9, timeProgress: 85, timeStatus: 'behind' }
    },
    yearly: {
      sales: { target: '$12,000,000', current: '$9,000,000', completion: 75, yearOverYear: 22.1, monthOverMonth: 15.6, timeProgress: 25, timeStatus: 'ahead' },
      profit: { target: '$6,000,000', current: '$4,560,000', completion: 76, yearOverYear: 19.4, monthOverMonth: 8.3, timeProgress: 30, timeStatus: 'ahead' },
      cost: { target: '$3,600,000', current: '$3,360,000', completion: 93, yearOverYear: -4.7, monthOverMonth: 3.1, timeProgress: 25, timeStatus: 'ahead' },
      roi: { target: '4.2x', current: '3.4x', completion: 81, yearOverYear: 24.8, monthOverMonth: 5.9, timeProgress: 35, timeStatus: 'ahead' },
      users: { target: '60,000人', current: '45,600人', completion: 76, yearOverYear: 28.7, monthOverMonth: 11.2, timeProgress: 40, timeStatus: 'behind' }
    }
  }

  return baseData[goalType as keyof typeof baseData] || baseData.monthly
}

// 加载目标数据
const loadGoalsData = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 300))
    const newData = getGoalsDataByPeriod(activeGoalType.value, selectedPeriod.value)
    websiteGoals.value = newData
  } catch (error) {
    console.error('加载目标数据失败:', error)
  } finally {
    loading.value = false
  }
}

// 处理目标类型变化
const handleGoalTypeChange = (type: string) => {
  activeGoalType.value = type
  // 重置时间选择
  if (type === 'monthly') {
    selectedPeriod.value = '2025-01'
  } else if (type === 'quarterly') {
    selectedPeriod.value = '2025-Q1'
  } else {
    selectedPeriod.value = '2025'
  }
  loadGoalsData()
}

// 处理时间段变化
const handlePeriodChange = () => {
  loadGoalsData()
}

// 小结编辑相关方法
const toggleEditMode = () => {
  if (isEditingMode.value) {
    // 保存编辑内容
    summaryText.value = editingSummaryText.value
    isEditingMode.value = false
  } else {
    // 进入编辑模式
    editingSummaryText.value = summaryText.value
    isEditingMode.value = true
  }
}

// 计算时间进度状态
const getTimeProgressStatus = (completion: number, timeProgress: number) => {
  const difference = completion - timeProgress
  if (difference > 0) return 'ahead'      // 任何提前
  if (difference < 0) return 'behind'     // 任何滞后
  return 'ontrack'                        // 完全相等
}

// 获取时间进度文本
const getTimeProgressText = (completion: number, timeProgress: number) => {
  const difference = completion - timeProgress
  if (difference > 0) {
    return `提前 ${Math.abs(difference).toFixed(1)}%`
  } else if (difference < 0) {
    return `滞后 ${Math.abs(difference).toFixed(1)}%`
  } else {
    return '进度正常'
  }
}

// 获取时间进度图标
const getTimeProgressIcon = (completion: number, timeProgress: number) => {
  const difference = completion - timeProgress
  if (difference > 0) return TrendingUp
  if (difference < 0) return TrendingDown
  return Clock
}

// 获取时间进度样式类
const getTimeProgressClass = (completion: number, timeProgress: number) => {
  const difference = completion - timeProgress
  if (difference > 0) return 'time-ahead'      // 任何提前都显示绿色
  if (difference < 0) return 'time-behind'     // 任何滞后都显示红色
  return 'time-ontrack'                        // 完全相等显示绿色
}


// 组件挂载时加载数据
onMounted(() => {
  loadGoalsData()
})
</script>

<style scoped>
.customer-goals-module {
  width: 100%;
}

.goals-filter {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.filter-tabs {
  display: flex;
  gap: 8px;
}

.tab-button {
  padding: 8px 16px;
  border: 1px solid #e0e0e0;
  background: white;
  color: #666;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  font-weight: 500;
}

.tab-button:hover {
  border-color: #1976d2;
  color: #1976d2;
}

.tab-button.active {
  background: #1976d2;
  color: white;
  border-color: #1976d2;
}

.time-selector {
  display: flex;
  align-items: center;
  gap: 12px;
}



.period-select {
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background: white;
  font-size: 14px;
  cursor: pointer;
  min-width: 160px;
}

.period-select:focus {
  outline: none;
  border-color: #1976d2;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #1976d2;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.goals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 20px;
}

.goal-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.04);
}

.goal-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.goal-header {
  padding: 24px 24px 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.goal-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.goal-icon.sales {
  background: linear-gradient(135deg, #e8f5e8, #c8e6c9);
  color: #2e7d32;
}

.goal-icon.profit {
  background: linear-gradient(135deg, #fff3e0, #ffe0b2);
  color: #f57c00;
}

.goal-icon.cost {
  background: linear-gradient(135deg, #ffebee, #ffcdd2);
  color: #d32f2f;
}

.goal-icon.roi {
  background: linear-gradient(135deg, #f3e5f5, #e1bee7);
  color: #7b1fa2;
}

.goal-icon.users {
  background: linear-gradient(135deg, #e3f2fd, #bbdefb);
  color: #1976d2;
}

.goal-icon .icon {
  width: 24px;
  height: 24px;
}

.goal-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.goal-content {
  padding: 20px 24px 24px;
}

.goal-values {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.value-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.value-item .label {
  font-size: 12px;
  color: #666;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.value-item .value {
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
}

.progress-section {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: #f5f5f5;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.progress-fill.sales {
  background: linear-gradient(90deg, #66bb6a, #4caf50);
}
.progress-fill.profit {
  background: linear-gradient(90deg, #ffa726, #ff9800);
}
.progress-fill.cost {
  background: linear-gradient(90deg, #ef5350, #f44336);
}
.progress-fill.roi {
  background: linear-gradient(90deg, #ab47bc, #9c27b0);
}
.progress-fill.users {
  background: linear-gradient(90deg, #42a5f5, #2196f3);
}

.completion-rate {
  font-size: 16px;
  font-weight: 700;
  color: #1a1a1a;
  min-width: 45px;
  text-align: right;
}

.comparison-data {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}



.comparison-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.comparison-item .label {
  font-size: 11px;
  color: #666;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.comparison-item .value {
  font-size: 14px;
  font-weight: 600;
}

.comparison-item .value.positive {
  color: #2e7d32;
}

.comparison-item .value.negative {
  color: #d32f2f;
}

/* 时间进度样式 */
.time-progress-section {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.time-progress-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.time-progress-indicator.time-ahead {
  background: linear-gradient(135deg, #e8f5e8, #c8e6c9);
  color: #2e7d32;
}

.time-progress-indicator.time-behind {
  background: linear-gradient(135deg, #ffebee, #ffcdd2);
  color: #d32f2f;
}

.time-progress-indicator.time-ontrack {
  background: linear-gradient(135deg, #e8f5e8, #c8e6c9);
  color: #2e7d32;
}

.time-progress-text {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.3px;
}

.time-progress-detail {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.time-label {
  font-size: 10px;
  color: #999;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.time-value {
  font-size: 12px;
  font-weight: 600;
  color: #666;
}

@media (max-width: 768px) {
  .goals-grid {
    grid-template-columns: 1fr;
  }

  .goals-filter {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .filter-tabs {
    justify-content: center;
  }

  .time-selector {
    justify-content: center;
  }

  .time-progress-section {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }

  .time-progress-indicator {
    justify-content: center;
  }

  .time-progress-detail {
    align-items: center;
  }
}

/* 模块小结样式 */
.module-summary {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 20px;
  margin-top: 24px;
}

.summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.summary-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.edit-summary-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.edit-summary-btn:hover {
  background: #2563eb;
}

.summary-content {
  margin-bottom: 16px;
}

.summary-display p {
  margin: 0;
  line-height: 1.6;
  color: #374151;
}

.summary-textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  line-height: 1.6;
  resize: vertical;
  font-family: inherit;
}

.summary-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.summary-stats {
  display: flex;
  gap: 24px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-label {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
}

.stat-value {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.stat-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.stat-badge.status-excellent {
  background: #dcfce7;
  color: #166534;
}

.stat-badge.status-good {
  background: #dbeafe;
  color: #1d4ed8;
}

.stat-badge.status-warning {
  background: #fef3c7;
  color: #92400e;
}

.stat-badge.status-danger {
  background: #fee2e2;
  color: #dc2626;
}

@media (max-width: 768px) {
  .summary-stats {
    flex-direction: column;
    gap: 12px;
  }

  .summary-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}
</style>
