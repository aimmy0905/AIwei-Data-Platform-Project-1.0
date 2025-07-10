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

        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { TrendingUp, DollarSign, Target, BarChart3, Users } from 'lucide-vue-next'


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

const activeGoalType = ref('monthly')
const selectedPeriod = ref('2025-01')


// 响应式数据
const loading = ref(false)

// 网站整体目标数据
const websiteGoals = ref({
  sales: {
    target: '¥1,000,000',
    current: '¥750,000',
    completion: 75,
    yearOverYear: 15.2,
    monthOverMonth: 8.5
  },
  profit: {
    target: '¥500,000',
    current: '¥380,000',
    completion: 76,
    yearOverYear: 12.3,
    monthOverMonth: -2.1
  },
  cost: {
    target: '¥300,000',
    current: '¥280,000',
    completion: 93,
    yearOverYear: -8.5,
    monthOverMonth: 2.3
  },
  roi: {
    target: '3.5x',
    current: '2.8x',
    completion: 80,
    yearOverYear: 18.5,
    monthOverMonth: -3.2
  },
  users: {
    target: '5,000人',
    current: '3,800人',
    completion: 76,
    yearOverYear: 22.8,
    monthOverMonth: 6.3
  }
})

// 模拟不同时间段的目标数据
const getGoalsDataByPeriod = (goalType: string, period: string) => {
  const baseData = {
    monthly: {
      sales: { target: '¥1,000,000', current: '¥750,000', completion: 75, yearOverYear: 15.2, monthOverMonth: 8.5 },
      profit: { target: '¥500,000', current: '¥380,000', completion: 76, yearOverYear: 12.3, monthOverMonth: -2.1 },
      cost: { target: '¥300,000', current: '¥280,000', completion: 93, yearOverYear: -8.5, monthOverMonth: 2.3 },
      roi: { target: '3.5x', current: '2.8x', completion: 80, yearOverYear: 18.5, monthOverMonth: -3.2 },
      users: { target: '5,000人', current: '3,800人', completion: 76, yearOverYear: 22.8, monthOverMonth: 6.3 }
    },
    quarterly: {
      sales: { target: '¥3,000,000', current: '¥2,250,000', completion: 75, yearOverYear: 18.7, monthOverMonth: 12.1 },
      profit: { target: '¥1,500,000', current: '¥1,140,000', completion: 76, yearOverYear: 15.8, monthOverMonth: 5.2 },
      cost: { target: '¥900,000', current: '¥840,000', completion: 93, yearOverYear: -6.2, monthOverMonth: 1.8 },
      roi: { target: '3.8x', current: '3.1x', completion: 82, yearOverYear: 21.3, monthOverMonth: 2.7 },
      users: { target: '15,000人', current: '11,400人', completion: 76, yearOverYear: 25.4, monthOverMonth: 8.9 }
    },
    yearly: {
      sales: { target: '¥12,000,000', current: '¥9,000,000', completion: 75, yearOverYear: 22.1, monthOverMonth: 15.6 },
      profit: { target: '¥6,000,000', current: '¥4,560,000', completion: 76, yearOverYear: 19.4, monthOverMonth: 8.3 },
      cost: { target: '¥3,600,000', current: '¥3,360,000', completion: 93, yearOverYear: -4.7, monthOverMonth: 3.1 },
      roi: { target: '4.2x', current: '3.4x', completion: 81, yearOverYear: 24.8, monthOverMonth: 5.9 },
      users: { target: '60,000人', current: '45,600人', completion: 76, yearOverYear: 28.7, monthOverMonth: 11.2 }
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
}
</style>
