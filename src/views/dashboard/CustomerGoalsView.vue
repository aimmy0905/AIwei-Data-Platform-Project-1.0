<template>
  <div class="customer-goals-view">
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
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>加载目标数据中...</p>
    </div>

    <!-- 目标完成情况卡片 -->
    <div v-else class="goals-grid">
      <!-- 销量目标 -->
      <div class="goal-card">
        <div class="goal-header">
          <div class="goal-icon sales">
            <TrendingUp class="icon" />
          </div>
          <h3>销量目标</h3>
        </div>
        <div class="goal-content">
          <div class="goal-values">
            <div class="value-item">
              <span class="label">目标值</span>
              <span class="value">{{ salesGoal.target }}</span>
            </div>
            <div class="value-item">
              <span class="label">当前值</span>
              <span class="value">{{ salesGoal.current }}</span>
            </div>
          </div>
          <div class="progress-section">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: salesGoal.completion + '%' }"></div>
            </div>
            <span class="completion-rate">{{ salesGoal.completion }}%</span>
          </div>
          <div class="comparison-data">
            <div class="comparison-item">
              <span class="label">同比</span>
              <span class="value positive">+{{ salesGoal.yearOverYear }}%</span>
            </div>
            <div class="comparison-item">
              <span class="label">环比</span>
              <span class="value positive">+{{ salesGoal.monthOverMonth }}%</span>
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
              <span class="value">{{ profitGoal.target }}</span>
            </div>
            <div class="value-item">
              <span class="label">当前值</span>
              <span class="value">{{ profitGoal.current }}</span>
            </div>
          </div>
          <div class="progress-section">
            <div class="progress-bar">
              <div class="progress-fill profit" :style="{ width: profitGoal.completion + '%' }"></div>
            </div>
            <span class="completion-rate">{{ profitGoal.completion }}%</span>
          </div>
          <div class="comparison-data">
            <div class="comparison-item">
              <span class="label">同比</span>
              <span class="value positive">+{{ profitGoal.yearOverYear }}%</span>
            </div>
            <div class="comparison-item">
              <span class="label">环比</span>
              <span class="value negative">{{ profitGoal.monthOverMonth }}%</span>
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
              <span class="value">{{ costGoal.target }}</span>
            </div>
            <div class="value-item">
              <span class="label">当前值</span>
              <span class="value">{{ costGoal.current }}</span>
            </div>
          </div>
          <div class="progress-section">
            <div class="progress-bar">
              <div class="progress-fill cost" :style="{ width: costGoal.completion + '%' }"></div>
            </div>
            <span class="completion-rate">{{ costGoal.completion }}%</span>
          </div>
          <div class="comparison-data">
            <div class="comparison-item">
              <span class="label">同比</span>
              <span class="value negative">{{ costGoal.yearOverYear }}%</span>
            </div>
            <div class="comparison-item">
              <span class="label">环比</span>
              <span class="value positive">+{{ costGoal.monthOverMonth }}%</span>
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
              <span class="value">{{ roiGoal.target }}</span>
            </div>
            <div class="value-item">
              <span class="label">当前值</span>
              <span class="value">{{ roiGoal.current }}</span>
            </div>
          </div>
          <div class="progress-section">
            <div class="progress-bar">
              <div class="progress-fill roi" :style="{ width: roiGoal.completion + '%' }"></div>
            </div>
            <span class="completion-rate">{{ roiGoal.completion }}%</span>
          </div>
          <div class="comparison-data">
            <div class="comparison-item">
              <span class="label">同比</span>
              <span class="value positive">+{{ roiGoal.yearOverYear }}%</span>
            </div>
            <div class="comparison-item">
              <span class="label">环比</span>
              <span class="value negative">{{ roiGoal.monthOverMonth }}%</span>
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
              <span class="value">{{ usersGoal.target }}</span>
            </div>
            <div class="value-item">
              <span class="label">当前值</span>
              <span class="value">{{ usersGoal.current }}</span>
            </div>
          </div>
          <div class="progress-section">
            <div class="progress-bar">
              <div class="progress-fill users" :style="{ width: usersGoal.completion + '%' }"></div>
            </div>
            <span class="completion-rate">{{ usersGoal.completion }}%</span>
          </div>
          <div class="comparison-data">
            <div class="comparison-item">
              <span class="label">同比</span>
              <span class="value positive">+{{ usersGoal.yearOverYear }}%</span>
            </div>
            <div class="comparison-item">
              <span class="label">环比</span>
              <span class="value positive">+{{ usersGoal.monthOverMonth }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { TrendingUp, DollarSign, Target, BarChart3, Users } from 'lucide-vue-next'
import { mockGetCustomerGoalsByPeriod } from '@/mock/dashboard'
import type { CustomerGoal } from '@/types'

// 目标类型
const goalTypes = [
  { value: 'monthly', label: '月度目标' },
  { value: 'quarterly', label: '季度目标' },
  { value: 'yearly', label: '年度目标' }
]

const activeGoalType = ref('monthly')
const selectedPeriod = ref('2024-01')

// 响应式数据
const goals = ref<CustomerGoal[]>([])
const loading = ref(false)

// 可选时间段
const availablePeriods = computed(() => {
  if (activeGoalType.value === 'monthly') {
    return [
      { value: '2024-01', label: '2024年1月' },
      { value: '2024-02', label: '2024年2月' },
      { value: '2024-03', label: '2024年3月' },
      { value: '2024-04', label: '2024年4月' },
      { value: '2024-05', label: '2024年5月' },
      { value: '2024-06', label: '2024年6月' }
    ]
  } else if (activeGoalType.value === 'quarterly') {
    return [
      { value: '2024-Q1', label: '2024年第1季度' },
      { value: '2024-Q2', label: '2024年第2季度' },
      { value: '2024-Q3', label: '2024年第3季度' },
      { value: '2024-Q4', label: '2024年第4季度' }
    ]
  } else {
    return [
      { value: '2023', label: '2023年' },
      { value: '2024', label: '2024年' }
    ]
  }
})

// 销量目标数据
const salesGoal = ref({
  target: '10,000件',
  current: '7,500件',
  completion: 75,
  yearOverYear: 15.2,
  monthOverMonth: 8.5
})

// 利润目标数据
const profitGoal = ref({
  target: '¥500,000',
  current: '¥380,000',
  completion: 76,
  yearOverYear: 12.3,
  monthOverMonth: -2.1,
  composition: {
    sales: '1,200,000',
    cost: '820,000',
    marginRate: 31.7
  }
})

// 成本目标数据
const costGoal = ref({
  target: '¥300,000',
  current: '¥280,000',
  completion: 93,
  yearOverYear: -8.5,
  monthOverMonth: 2.3,
  composition: {
    advertising: '120,000',
    logistics: '80,000',
    product: '80,000'
  }
})

// ROI目标数据
const roiGoal = ref({
  target: '3.5',
  current: '2.8',
  completion: 80,
  yearOverYear: 18.5,
  monthOverMonth: -3.2,
  platforms: {
    google: '3.2',
    meta: '2.6',
    bing: '2.4'
  }
})

// 用户数目标数据
const usersGoal = ref({
  target: '5,000人',
  current: '3,800人',
  completion: 76,
  yearOverYear: 22.8,
  monthOverMonth: 6.3,
  composition: {
    newUsers: '2,280',
    newUsersRate: 60,
    returningUsers: '1,520',
    returningUsersRate: 40,
    acquisitionCost: '25'
  }
})

// 加载目标数据
const loadGoals = async () => {
  loading.value = true
  try {
    const response = await mockGetCustomerGoalsByPeriod(
      activeGoalType.value as 'monthly' | 'quarterly' | 'yearly',
      selectedPeriod.value
    )
    if (response.success && response.data) {
      goals.value = response.data
    }
  } catch (error) {
    console.error('加载目标数据失败:', error)
  } finally {
    loading.value = false
  }
}

// 组件挂载时加载数据
onMounted(() => {
  loadGoals()
})

// 监听目标类型和时间段变化
const handleGoalTypeChange = (type: string) => {
  activeGoalType.value = type
  // 重置时间段选择
  if (type === 'monthly') {
    selectedPeriod.value = '2024-01'
  } else if (type === 'quarterly') {
    selectedPeriod.value = '2024-Q1'
  } else {
    selectedPeriod.value = '2024'
  }
  loadGoals()
}

const handlePeriodChange = () => {
  loadGoals()
}
</script>

<style scoped>
.customer-goals-view {
  padding: 24px;
  background: #f8f9fa;
  min-height: 100vh;
}

.goals-filter {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  background: white;
  padding: 16px 24px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.filter-tabs {
  display: flex;
  gap: 8px;
}

.tab-button {
  padding: 8px 16px;
  border: 1px solid #e0e0e0;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
}

.tab-button:hover {
  background: #f5f5f5;
}

.tab-button.active {
  background: #1976d2;
  color: white;
  border-color: #1976d2;
}

.time-selector {
  display: flex;
  align-items: center;
  gap: 8px;
}

.period-select {
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background: white;
  font-size: 14px;
}

.goals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
}

.goal-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.goal-card:hover {
  transform: translateY(-2px);
}

.goal-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.goal-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.goal-icon.sales {
  background: #e3f2fd;
  color: #1976d2;
}

.goal-icon.profit {
  background: #e8f5e8;
  color: #2e7d32;
}

.goal-icon.cost {
  background: #fff3e0;
  color: #f57c00;
}

.goal-icon.roi {
  background: #f3e5f5;
  color: #7b1fa2;
}

.goal-icon.users {
  background: #fce4ec;
  color: #c2185b;
}

.goal-icon .icon {
  width: 24px;
  height: 24px;
}

.goal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.goal-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.goal-values {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.value-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.value-item .label {
  font-size: 12px;
  color: #666;
  font-weight: 500;
}

.value-item .value {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.progress-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #1976d2;
  transition: width 0.3s;
}

.progress-fill.profit {
  background: #2e7d32;
}

.progress-fill.cost {
  background: #f57c00;
}

.progress-fill.roi {
  background: #7b1fa2;
}

.progress-fill.users {
  background: #c2185b;
}

.completion-rate {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  min-width: 40px;
  text-align: right;
}

.comparison-data {
  display: flex;
  gap: 24px;
}

.comparison-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.comparison-item .label {
  font-size: 12px;
  color: #666;
}

.comparison-item .value.positive {
  color: #2e7d32;
  font-weight: 600;
}

.comparison-item .value.negative {
  color: #d32f2f;
  font-weight: 600;
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

  .goal-values {
    flex-direction: column;
    gap: 12px;
  }

  .comparison-data {
    flex-direction: column;
    gap: 12px;
  }
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #666;
}

.loading-spinner {
  width: 32px;
  height: 32px;
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
</style>
