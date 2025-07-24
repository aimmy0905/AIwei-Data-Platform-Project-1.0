<template>
  <div class="modal-overlay" @click="handleOverlayClick">
    <div class="modal-container" @click.stop>
      <div class="modal-header">
        <h3 class="modal-title">项目目标管理</h3>
        <button class="modal-close" @click="$emit('close')">
          <X :size="20" />
        </button>
      </div>

      <div class="modal-content">
        <!-- 项目信息 -->
        <div class="project-info">
          <h4>{{ projectInfo.project_name }}</h4>
          <p>客户：{{ projectInfo.customer_name }}</p>
        </div>

        <!-- 目标类型切换 -->
        <div class="goal-type-tabs">
          <button
            v-for="type in goalTypes"
            :key="type.value"
            class="tab-btn"
            :class="{ 'tab-btn--active': activeGoalType === type.value }"
            @click="activeGoalType = type.value as '月度' | '季度' | '年度'"
          >
            {{ type.label }}
          </button>
        </div>

        <!-- 目标列表 -->
        <div class="goals-section">
          <div class="section-header">
            <h5>{{ getGoalTypeLabel(activeGoalType) }}目标</h5>
            <div class="section-actions">
              <div class="view-toggle">
                <button
                  class="toggle-btn"
                  :class="{ 'toggle-btn--active': viewMode === 'current' }"
                  @click="viewMode = 'current'"
                >
                  当前目标
                </button>
                <button
                  class="toggle-btn"
                  :class="{ 'toggle-btn--active': viewMode === 'historical' }"
                  @click="viewMode = 'historical'"
                >
                  历史目标
                </button>
              </div>

              <button
                v-if="viewMode === 'current'"
                class="action-btn action-btn--primary"
                @click="showCreateGoal = true"
              >
                <Plus :size="16" />
                新建目标
              </button>
            </div>
          </div>

          <!-- 当前目标视图 -->
          <div v-if="viewMode === 'current'" class="goals-list">
            <div
              v-for="goal in filteredGoals"
              :key="goal.id"
              class="goal-card"
            >
              <div class="goal-card__header">
                <div class="goal-period">{{ goal.goal_period }}</div>
                <div class="goal-actions">
                  <button
                    class="action-btn-small action-btn-small--secondary"
                    @click="editGoal(goal)"
                    title="编辑"
                  >
                    <Edit :size="14" />
                  </button>
                  <button
                    class="action-btn-small action-btn-small--danger"
                    @click="deleteGoal(goal.id)"
                    title="删除"
                  >
                    <Trash2 :size="14" />
                  </button>
                </div>
              </div>

              <div class="goal-metrics">
                <div class="metric-item">
                  <div class="metric-label">
                    <span class="metric-icon sales-icon">💰</span>
                    销量目标
                  </div>
                  <div class="metric-value">
                    <span class="target">${{ formatNumber(goal.sales_target) }}</span>
                    <span class="actual" v-if="goal.actual_sales">
                      / ${{ formatNumber(goal.actual_sales) }}
                    </span>
                  </div>
                  <div class="completion-rate" v-if="goal.completion_rate?.sales">
                    <div class="progress-bar">
                      <div
                        class="progress-fill"
                        :style="{ width: Math.min(goal.completion_rate.sales, 100) + '%' }"
                        :class="getMetricColorClass('sales', goal.completion_rate.sales)"
                      ></div>
                    </div>
                    <span class="rate-text" :class="getMetricColorClass('sales', goal.completion_rate.sales)">
                      {{ goal.completion_rate.sales }}%
                    </span>
                  </div>
                </div>

                <div class="metric-item">
                  <div class="metric-label">
                    <span class="metric-icon cost-icon">📊</span>
                    成本目标
                  </div>
                  <div class="metric-value">
                    <span class="target">${{ formatNumber(goal.cost_target) }}</span>
                    <span class="actual" v-if="goal.actual_cost">
                      / ${{ formatNumber(goal.actual_cost) }}
                    </span>
                  </div>
                  <div class="completion-rate" v-if="goal.completion_rate?.cost">
                    <div class="progress-bar">
                      <div
                        class="progress-fill"
                        :style="{ width: Math.min(goal.completion_rate.cost, 100) + '%' }"
                        :class="getMetricColorClass('cost', goal.completion_rate.cost)"
                      ></div>
                    </div>
                    <span class="rate-text" :class="getMetricColorClass('cost', goal.completion_rate.cost)">
                      {{ goal.completion_rate.cost }}%
                    </span>
                  </div>
                </div>

                <div class="metric-item">
                  <div class="metric-label">
                    <span class="metric-icon roi-icon">📈</span>
                    ROI目标
                  </div>
                  <div class="metric-value">
                    <span class="target">{{ goal.roi_target }}</span>
                    <span class="actual" v-if="goal.actual_roi">
                      / {{ goal.actual_roi }}
                    </span>
                  </div>
                  <div class="completion-rate" v-if="goal.completion_rate?.roi">
                    <div class="progress-bar">
                      <div
                        class="progress-fill"
                        :style="{ width: Math.min(goal.completion_rate.roi, 100) + '%' }"
                        :class="getMetricColorClass('roi', goal.completion_rate.roi)"
                      ></div>
                    </div>
                    <span class="rate-text" :class="getMetricColorClass('roi', goal.completion_rate.roi)">
                      {{ goal.completion_rate.roi }}%
                    </span>
                  </div>
                </div>

                <div class="metric-item" v-if="goal.profit_target">
                  <div class="metric-label">
                    <span class="metric-icon profit-icon">💚</span>
                    利润目标
                  </div>
                  <div class="metric-value">
                    <span class="target">${{ formatNumber(goal.profit_target) }}</span>
                    <span class="actual" v-if="goal.actual_profit">
                      / ${{ formatNumber(goal.actual_profit) }}
                    </span>
                  </div>
                  <div class="completion-rate" v-if="goal.completion_rate?.profit">
                    <div class="progress-bar">
                      <div
                        class="progress-fill"
                        :style="{ width: Math.min(goal.completion_rate.profit, 100) + '%' }"
                        :class="getMetricColorClass('profit', goal.completion_rate.profit)"
                      ></div>
                    </div>
                    <span class="rate-text" :class="getMetricColorClass('profit', goal.completion_rate.profit)">
                      {{ goal.completion_rate.profit }}%
                    </span>
                  </div>
                </div>

                <div class="metric-item" v-if="goal.user_count_target">
                  <div class="metric-label">
                    <span class="metric-icon user-icon">👥</span>
                    用户数目标
                  </div>
                  <div class="metric-value">
                    <span class="target">{{ formatNumber(goal.user_count_target) }}</span>
                    <span class="actual" v-if="goal.actual_user_count">
                      / {{ formatNumber(goal.actual_user_count) }}
                    </span>
                  </div>
                  <div class="completion-rate" v-if="goal.completion_rate?.user_count">
                    <div class="progress-bar">
                      <div
                        class="progress-fill"
                        :style="{ width: Math.min(goal.completion_rate.user_count, 100) + '%' }"
                        :class="getMetricColorClass('user_count', goal.completion_rate.user_count)"
                      ></div>
                    </div>
                    <span class="rate-text" :class="getMetricColorClass('user_count', goal.completion_rate.user_count)">
                      {{ goal.completion_rate.user_count }}%
                    </span>
                  </div>
                </div>
              </div>

              <div class="goal-remarks" v-if="goal.remarks">
                <div class="remarks-label">备注：</div>
                <div class="remarks-text">{{ goal.remarks }}</div>
              </div>

              <div class="goal-meta">
                <span class="created-info">
                  创建人：{{ goal.created_by }} | 创建时间：{{ formatDate(goal.created_at) }}
                </span>
              </div>
            </div>

            <div v-if="filteredGoals.length === 0" class="empty-state">
              <div class="empty-icon">
                <Target :size="48" />
              </div>
              <div class="empty-text">暂无{{ getGoalTypeLabel(activeGoalType) }}目标</div>
              <button class="action-btn action-btn--primary" @click="showCreateGoal = true">
                创建第一个目标
              </button>
            </div>
          </div>

          <!-- 历史目标视图 -->
          <div v-if="viewMode === 'historical'" class="goals-list">
            <!-- 历史目标统计概览 -->
            <div v-if="historicalGoals.length > 0" class="historical-summary">
              <h6>历史表现概览</h6>
              <div class="summary-metrics">
                <div class="summary-item">
                  <div class="summary-label">平均销量完成率</div>
                  <div class="summary-value" :class="getCompletionClass(averageCompletionRates.sales)">
                    {{ averageCompletionRates.sales }}%
                  </div>
                </div>
                <div class="summary-item">
                  <div class="summary-label">平均成本控制率</div>
                  <div class="summary-value" :class="getCompletionClass(100 - averageCompletionRates.cost + 100)">
                    {{ (200 - averageCompletionRates.cost).toFixed(1) }}%
                  </div>
                </div>
                <div class="summary-item">
                  <div class="summary-label">平均ROI完成率</div>
                  <div class="summary-value" :class="getCompletionClass(averageCompletionRates.roi)">
                    {{ averageCompletionRates.roi }}%
                  </div>
                </div>
                <div class="summary-item">
                  <div class="summary-label">历史记录数</div>
                  <div class="summary-value">{{ historicalGoals.length }}个</div>
                </div>
              </div>
            </div>

            <div
              v-for="goal in historicalGoals"
              :key="goal.id"
              class="goal-card"
            >
              <div class="goal-card__header">
                <div class="goal-period">{{ goal.goal_period }}</div>
                <div class="goal-actions">
                  <button
                    class="action-btn-small action-btn-small--secondary"
                    @click="editGoal(goal)"
                    title="编辑"
                  >
                    <Edit :size="14" />
                  </button>
                  <button
                    class="action-btn-small action-btn-small--danger"
                    @click="deleteGoal(goal.id)"
                    title="删除"
                  >
                    <Trash2 :size="14" />
                  </button>
                </div>
              </div>

              <div class="goal-metrics">
                <div class="metric-item">
                  <div class="metric-label">
                    <span class="metric-icon sales-icon">💰</span>
                    销量目标
                  </div>
                  <div class="metric-value">
                    <span class="target">${{ formatNumber(goal.sales_target) }}</span>
                    <span class="actual" v-if="goal.actual_sales">
                      / ${{ formatNumber(goal.actual_sales) }}
                    </span>
                  </div>
                  <div class="completion-rate" v-if="goal.completion_rate?.sales">
                    <div class="progress-bar">
                      <div
                        class="progress-fill"
                        :style="{ width: Math.min(goal.completion_rate.sales, 100) + '%' }"
                        :class="getMetricColorClass('sales', goal.completion_rate.sales)"
                      ></div>
                    </div>
                    <span class="rate-text" :class="getMetricColorClass('sales', goal.completion_rate.sales)">
                      {{ goal.completion_rate.sales }}%
                    </span>
                  </div>
                </div>

                <div class="metric-item">
                  <div class="metric-label">
                    <span class="metric-icon cost-icon">📊</span>
                    成本目标
                  </div>
                  <div class="metric-value">
                    <span class="target">${{ formatNumber(goal.cost_target) }}</span>
                    <span class="actual" v-if="goal.actual_cost">
                      / ${{ formatNumber(goal.actual_cost) }}
                    </span>
                  </div>
                  <div class="completion-rate" v-if="goal.completion_rate?.cost">
                    <div class="progress-bar">
                      <div
                        class="progress-fill"
                        :style="{ width: Math.min(goal.completion_rate.cost, 100) + '%' }"
                        :class="getMetricColorClass('cost', goal.completion_rate.cost)"
                      ></div>
                    </div>
                    <span class="rate-text" :class="getMetricColorClass('cost', goal.completion_rate.cost)">
                      {{ goal.completion_rate.cost }}%
                    </span>
                  </div>
                </div>

                <div class="metric-item">
                  <div class="metric-label">
                    <span class="metric-icon roi-icon">📈</span>
                    ROI目标
                  </div>
                  <div class="metric-value">
                    <span class="target">{{ goal.roi_target }}</span>
                    <span class="actual" v-if="goal.actual_roi">
                      / {{ goal.actual_roi }}
                    </span>
                  </div>
                  <div class="completion-rate" v-if="goal.completion_rate?.roi">
                    <div class="progress-bar">
                      <div
                        class="progress-fill"
                        :style="{ width: Math.min(goal.completion_rate.roi, 100) + '%' }"
                        :class="getMetricColorClass('roi', goal.completion_rate.roi)"
                      ></div>
                    </div>
                    <span class="rate-text" :class="getMetricColorClass('roi', goal.completion_rate.roi)">
                      {{ goal.completion_rate.roi }}%
                    </span>
                  </div>
                </div>

                <div class="metric-item" v-if="goal.profit_target">
                  <div class="metric-label">
                    <span class="metric-icon profit-icon">💚</span>
                    利润目标
                  </div>
                  <div class="metric-value">
                    <span class="target">${{ formatNumber(goal.profit_target) }}</span>
                    <span class="actual" v-if="goal.actual_profit">
                      / ${{ formatNumber(goal.actual_profit) }}
                    </span>
                  </div>
                  <div class="completion-rate" v-if="goal.completion_rate?.profit">
                    <div class="progress-bar">
                      <div
                        class="progress-fill"
                        :style="{ width: Math.min(goal.completion_rate.profit, 100) + '%' }"
                        :class="getMetricColorClass('profit', goal.completion_rate.profit)"
                      ></div>
                    </div>
                    <span class="rate-text" :class="getMetricColorClass('profit', goal.completion_rate.profit)">
                      {{ goal.completion_rate.profit }}%
                    </span>
                  </div>
                </div>

                <div class="metric-item" v-if="goal.user_count_target">
                  <div class="metric-label">
                    <span class="metric-icon user-icon">👥</span>
                    用户数目标
                  </div>
                  <div class="metric-value">
                    <span class="target">{{ formatNumber(goal.user_count_target) }}</span>
                    <span class="actual" v-if="goal.actual_user_count">
                      / {{ formatNumber(goal.actual_user_count) }}
                    </span>
                  </div>
                  <div class="completion-rate" v-if="goal.completion_rate?.user_count">
                    <div class="progress-bar">
                      <div
                        class="progress-fill"
                        :style="{ width: Math.min(goal.completion_rate.user_count, 100) + '%' }"
                        :class="getMetricColorClass('user_count', goal.completion_rate.user_count)"
                      ></div>
                    </div>
                    <span class="rate-text" :class="getMetricColorClass('user_count', goal.completion_rate.user_count)">
                      {{ goal.completion_rate.user_count }}%
                    </span>
                  </div>
                </div>
              </div>

              <div class="goal-remarks" v-if="goal.remarks">
                <div class="remarks-label">备注：</div>
                <div class="remarks-text">{{ goal.remarks }}</div>
              </div>

              <div class="goal-meta">
                <span class="created-info">
                  创建人：{{ goal.created_by }} | 创建时间：{{ formatDate(goal.created_at) }}
                </span>
              </div>
            </div>

            <div v-if="historicalGoals.length === 0" class="empty-state">
              <div class="empty-icon">
                <Target :size="48" />
              </div>
              <div class="empty-text">暂无{{ getGoalTypeLabel(activeGoalType) }}历史目标</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 新建/编辑目标弹窗 -->
      <div v-if="showCreateGoal || editingGoal" class="sub-modal-overlay" @click="closeGoalForm">
        <div class="sub-modal-container" @click.stop>
          <div class="sub-modal-header">
            <h4>{{ editingGoal ? '编辑目标' : '新建目标' }}</h4>
            <button class="modal-close" @click="closeGoalForm">
              <X :size="18" />
            </button>
          </div>

          <div class="sub-modal-content">
            <form @submit.prevent="saveGoal">
              <div class="form-group">
                <label>目标类型</label>
                <select v-model="goalForm.goal_type" required>
                  <option value="">请选择目标类型</option>
                  <option value="月度">月度目标</option>
                  <option value="季度">季度目标</option>
                  <option value="年度">年度目标</option>
                </select>
              </div>

              <div class="form-group">
                <label>目标周期</label>
                <input
                  type="text"
                  v-model="goalForm.goal_period"
                  placeholder="例如：2024年12月"
                  required
                />
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>销量目标 *</label>
                  <input
                    type="number"
                    v-model.number="goalForm.sales_target"
                    placeholder="0"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div class="form-group">
                  <label>成本目标 *</label>
                  <input
                    type="number"
                    v-model.number="goalForm.cost_target"
                    placeholder="0"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>ROI目标 *</label>
                  <input
                    type="number"
                    v-model.number="goalForm.roi_target"
                    placeholder="0"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div class="form-group">
                  <label>利润目标</label>
                  <input
                    type="number"
                    v-model.number="goalForm.profit_target"
                    placeholder="0"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div class="form-group">
                <label>用户数目标</label>
                <input
                  type="number"
                  v-model.number="goalForm.user_count_target"
                  placeholder="0"
                  min="0"
                  step="1"
                />
              </div>

              <div class="form-group">
                <label>备注</label>
                <textarea
                  v-model="goalForm.remarks"
                  placeholder="请输入目标备注信息..."
                  rows="3"
                  maxlength="500"
                ></textarea>
              </div>

              <div class="form-actions">
                <button type="button" class="action-btn action-btn--secondary" @click="closeGoalForm">
                  取消
                </button>
                <button type="submit" class="action-btn action-btn--primary">
                  {{ editingGoal ? '更新' : '创建' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { X, Plus, Edit, Trash2, Target, RefreshCw } from 'lucide-vue-next'
import { mockProjectGoals, type ProjectGoal, type Project } from '@/mock/projects'
import { goalDataService, useGoalDataService, updateGoalCompletion } from '@/services/goalDataService'

interface Props {
  projectId: number
  projectInfo: Project
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

// 响应式数据
const goals = ref<ProjectGoal[]>([])
const activeGoalType = ref<'月度' | '季度' | '年度'>('月度')
const showCreateGoal = ref(false)
const editingGoal = ref<ProjectGoal | null>(null)
const viewMode = ref<'current' | 'historical'>('current')

// 数据服务状态
const dataServiceState = useGoalDataService()
let unsubscribe: (() => void) | null = null

const goalTypes = [
  { label: '月度', value: '月度' },
  { label: '季度', value: '季度' },
  { label: '年度', value: '年度' }
]

const goalForm = ref({
  goal_type: '' as '月度' | '季度' | '年度' | '',
  goal_period: '',
  sales_target: 0,
  cost_target: 0,
  roi_target: 0,
  profit_target: 0,
  user_count_target: 0,
  remarks: ''
})

// 初始化数据
onMounted(() => {
  loadGoals()

  // 启动实时数据更新
  goalDataService.startRealTimeUpdates([props.projectId])

  // 订阅数据更新
  unsubscribe = goalDataService.subscribe(`project-goals-${props.projectId}`, (update) => {
    handleDataUpdate(update)
  })
})

onUnmounted(() => {
  // 停止实时数据更新
  goalDataService.stopRealTimeUpdates([props.projectId])

  // 取消订阅
  if (unsubscribe) {
    unsubscribe()
  }
})

// 获取当前周期
const getCurrentPeriod = (goalType: '月度' | '季度' | '年度') => {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1

  console.log('当前日期:', now, '年:', year, '月:', month)

  switch (goalType) {
    case '月度':
      return `${year}年${month}月`
    case '季度':
      const quarter = Math.ceil(month / 3)
      return `${year}年Q${quarter}`
    case '年度':
      return `${year}年`
    default:
      return ''
  }
}

// 计算属性
const filteredGoals = computed(() => {
  const currentGoals = goals.value.filter(goal =>
    goal.project_id === props.projectId && goal.goal_type === activeGoalType.value
  )

  // 获取当前周期
  const currentPeriod = getCurrentPeriod(activeGoalType.value)

  // 调试输出
  console.log('当前目标类型:', activeGoalType.value)
  console.log('当前周期:', currentPeriod)
  console.log('所有目标:', currentGoals.map(g => ({ period: g.goal_period, type: g.goal_type })))

  // 只返回当前周期的目标
  return currentGoals.filter(goal => goal.goal_period === currentPeriod)
})

    const historicalGoals = computed(() => {
    const currentPeriod = getCurrentPeriod(activeGoalType.value)
    return goals.value.filter(goal =>
      goal.goal_type === activeGoalType.value &&
      goal.goal_period !== currentPeriod
    ).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  })

  // 计算历史目标的平均完成率
  const averageCompletionRates = computed(() => {
    if (historicalGoals.value.length === 0) {
      return { sales: 0, cost: 0, roi: 0, profit: 0, user_count: 0 }
    }

    const totals = historicalGoals.value.reduce((acc, goal) => {
      if (goal.completion_rate) {
        acc.sales += goal.completion_rate.sales || 0
        acc.cost += goal.completion_rate.cost || 0
        acc.roi += goal.completion_rate.roi || 0
        acc.profit += goal.completion_rate.profit || 0
        acc.user_count += goal.completion_rate.user_count || 0
        acc.count++
      }
      return acc
    }, { sales: 0, cost: 0, roi: 0, profit: 0, user_count: 0, count: 0 })

    return {
      sales: Math.round(totals.sales / totals.count),
      cost: Math.round(totals.cost / totals.count),
      roi: Math.round(totals.roi / totals.count),
      profit: Math.round(totals.profit / totals.count),
      user_count: Math.round(totals.user_count / totals.count)
    }
  })

// 方法
const loadGoals = () => {
  // 模拟从API加载数据
  goals.value = mockProjectGoals.filter(goal => goal.project_id === props.projectId)
}

const getGoalTypeLabel = (type: string) => {
  const typeMap: Record<string, string> = {
    '月度': '月度',
    '季度': '季度',
    '年度': '年度'
  }
  return typeMap[type] || type
}

const getCompletionClass = (rate: number) => {
  if (rate >= 110) return 'excellent'
  if (rate >= 90) return 'good'
  if (rate >= 70) return 'warning'
  return 'danger'
}

// 为不同指标设置不同的颜色类
const getMetricColorClass = (metricType: string, rate: number) => {
  const baseClass = getCompletionClass(rate)
  return `${metricType}-${baseClass}`
}

const formatNumber = (num: number) => {
  return num.toLocaleString('zh-CN')
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}

const handleOverlayClick = () => {
  emit('close')
}

const editGoal = (goal: ProjectGoal) => {
  editingGoal.value = goal
  goalForm.value = {
    goal_type: goal.goal_type,
    goal_period: goal.goal_period,
    sales_target: goal.sales_target,
    cost_target: goal.cost_target,
    roi_target: goal.roi_target,
    profit_target: goal.profit_target || 0,
    user_count_target: goal.user_count_target || 0,
    remarks: goal.remarks || ''
  }
}

const deleteGoal = (goalId: number) => {
  if (confirm('确定要删除这个目标吗？')) {
    goals.value = goals.value.filter(goal => goal.id !== goalId)
    console.log('删除目标:', goalId)
  }
}

const closeGoalForm = () => {
  showCreateGoal.value = false
  editingGoal.value = null
  goalForm.value = {
    goal_type: '',
    goal_period: '',
    sales_target: 0,
    cost_target: 0,
    roi_target: 0,
    profit_target: 0,
    user_count_target: 0,
    remarks: ''
  }
}

const saveGoal = () => {
  if (editingGoal.value) {
    // 更新现有目标
    const index = goals.value.findIndex(goal => goal.id === editingGoal.value!.id)
    if (index !== -1) {
      goals.value[index] = {
        ...goals.value[index],
        ...goalForm.value,
        goal_type: goalForm.value.goal_type as '月度' | '季度' | '年度'
      }
    }
    console.log('更新目标:', editingGoal.value.id)
  } else {
    // 创建新目标
    const newGoal: ProjectGoal = {
      id: Date.now(),
      project_id: props.projectId,
      customer_name: props.projectInfo.customer_name,
      project_name: props.projectInfo.project_name,
      ...goalForm.value,
      goal_type: goalForm.value.goal_type as '月度' | '季度' | '年度',
      created_at: new Date().toISOString(),
      created_by: '当前用户' // 实际应用中从用户状态获取
    }
    goals.value.push(newGoal)
    console.log('创建目标:', newGoal)
  }

  closeGoalForm()
}

// 数据更新相关方法
const handleDataUpdate = (update: { projectId: number; data: any }) => {
  if (update.projectId === props.projectId) {
    // 更新目标的实际完成情况
    goals.value = goals.value.map(goal => {
      if (goal.project_id === update.projectId) {
        return updateGoalCompletion(goal, update.data)
      }
      return goal
    })
  }
}

const refreshData = async () => {
  try {
    await goalDataService.refreshData(props.projectId)
  } catch (error) {
    console.error('刷新数据失败:', error)
  }
}

const formatLastUpdateTime = () => {
  const lastUpdate = dataServiceState.lastUpdateTime.value.get(props.projectId)
  if (!lastUpdate) return '从未更新'

  const now = Date.now()
  const diff = now - lastUpdate
  const minutes = Math.floor(diff / 60000)

  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}小时前`

  const days = Math.floor(hours / 24)
  return `${days}天前`
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-container {
  background: var(--color-background);
  border-radius: 8px;
  width: 90%;
  max-width: 1000px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-background-secondary);
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.modal-close {
  padding: 4px;
  border: none;
  background: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: var(--color-background-hover);
  color: var(--color-text-primary);
}

.modal-content {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}

.project-info {
  background: var(--color-background-secondary);
  padding: 16px;
  border-radius: 6px;
  margin-bottom: 24px;
}

.project-info h4 {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 8px 0;
}

.project-info p {
  color: var(--color-text-secondary);
  margin: 0;
  font-size: 14px;
}

.goal-type-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
}

.tab-btn {
  padding: 8px 16px;
  border: 1px solid var(--color-border);
  background: var(--color-background);
  color: var(--color-text-secondary);
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.tab-btn:hover {
  background: var(--color-background-hover);
}

.tab-btn--active {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.view-toggle {
  display: flex;
  gap: 10px;
  background: var(--color-background-tertiary);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  padding: 4px 8px;
}

.toggle-btn {
  padding: 6px 12px;
  border: none;
  background: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.toggle-btn:hover {
  background: var(--color-background-hover);
  color: var(--color-text-primary);
}

.toggle-btn--active {
  background: var(--color-primary);
  color: white;
  border-radius: 4px;
}

.historical-summary {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border: 1px solid var(--color-border-light);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.historical-summary h6 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  gap: 8px;
}

.historical-summary h6::before {
  content: '📊';
  font-size: 18px;
}

.summary-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.summary-item {
  background: white;
  border: 1px solid var(--color-border-light);
  border-radius: 6px;
  padding: 12px 16px;
  text-align: center;
  transition: all 0.2s ease;
}

.summary-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.summary-label {
  font-size: 13px;
  color: var(--color-text-secondary);
  margin-bottom: 4px;
}

.summary-value {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.summary-value.excellent {
  color: var(--color-success);
}

.summary-value.good {
  color: var(--color-primary);
}

.summary-value.warning {
  color: var(--color-warning);
}

.summary-value.poor {
  color: var(--color-danger);
}

.update-status {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.updating-indicator {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--color-primary);
}

.updating-indicator .spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.last-update {
  color: var(--color-text-tertiary);
}

.section-header h5 {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 6px;
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn--primary {
  background: var(--color-primary);
  color: white;
}

.action-btn--primary:hover {
  background: var(--color-primary-hover);
}

.action-btn--secondary {
  background: var(--color-background-secondary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}

.action-btn--secondary:hover {
  background: var(--color-background-hover);
}

.goals-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.goal-card {
  background: var(--color-background-secondary);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 20px;
}

.goal-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.goal-period {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.goal-actions {
  display: flex;
  gap: 8px;
}

.action-btn-small {
  padding: 6px 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn-small--secondary {
  background: var(--color-background-tertiary);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
}

.action-btn-small--secondary:hover {
  background: var(--color-background-hover);
  color: var(--color-text-primary);
}

.action-btn-small--danger {
  background: var(--color-danger-light);
  color: var(--color-danger);
}

.action-btn-small--danger:hover {
  background: var(--color-danger);
  color: white;
}

.goal-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}

.metric-item {
  background: var(--color-background);
  padding: 12px;
  border-radius: 6px;
  border: 1px solid var(--color-border);
}

.metric-label {
  font-size: 12px;
  color: var(--color-text-secondary);
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.metric-icon {
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.sales-icon {
  background: linear-gradient(135deg, #e6f7ff, #bae7ff);
}

.cost-icon {
  background: linear-gradient(135deg, #fff7e6, #ffd591);
}

.roi-icon {
  background: linear-gradient(135deg, #f9f0ff, #efdbff);
}

.profit-icon {
  background: linear-gradient(135deg, #f6ffed, #d9f7be);
}

.user-icon {
  background: linear-gradient(135deg, #e6fffb, #b5f5ec);
}

.metric-value {
  font-size: 14px;
  margin-bottom: 8px;
}

.metric-value .target {
  color: var(--color-text-primary);
  font-weight: 600;
}

.metric-value .actual {
  color: var(--color-text-secondary);
  font-size: 13px;
}

.completion-rate {
  display: flex;
  align-items: center;
  gap: 8px;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: var(--color-background-tertiary);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s ease;
}

/* 销量目标颜色 - 蓝色系 */
.progress-fill.sales-excellent {
  background: linear-gradient(90deg, #1890ff, #40a9ff);
}

.progress-fill.sales-good {
  background: #1890ff;
}

.progress-fill.sales-warning {
  background: #69c0ff;
}

.progress-fill.sales-danger {
  background: #91d5ff;
}

/* 成本目标颜色 - 橙色系 */
.progress-fill.cost-excellent {
  background: linear-gradient(90deg, #fa8c16, #ffa940);
}

.progress-fill.cost-good {
  background: #fa8c16;
}

.progress-fill.cost-warning {
  background: #ffc069;
}

.progress-fill.cost-danger {
  background: #ffd591;
}

/* ROI目标颜色 - 紫色系 */
.progress-fill.roi-excellent {
  background: linear-gradient(90deg, #722ed1, #9254de);
}

.progress-fill.roi-good {
  background: #722ed1;
}

.progress-fill.roi-warning {
  background: #b37feb;
}

.progress-fill.roi-danger {
  background: #d3adf7;
}

/* 利润目标颜色 - 绿色系 */
.progress-fill.profit-excellent {
  background: linear-gradient(90deg, #52c41a, #73d13d);
}

.progress-fill.profit-good {
  background: #52c41a;
}

.progress-fill.profit-warning {
  background: #95de64;
}

.progress-fill.profit-danger {
  background: #b7eb8f;
}

/* 用户数目标颜色 - 青色系 */
.progress-fill.user_count-excellent {
  background: linear-gradient(90deg, #13c2c2, #36cfc9);
}

.progress-fill.user_count-good {
  background: #13c2c2;
}

.progress-fill.user_count-warning {
  background: #5cdbd3;
}

.progress-fill.user_count-danger {
  background: #87e8de;
}

.rate-text {
  font-size: 12px;
  font-weight: 600;
  min-width: 40px;
  text-align: right;
}

/* 销量目标文字颜色 */
.rate-text.sales-excellent,
.rate-text.sales-good {
  color: #1890ff;
}

.rate-text.sales-warning {
  color: #69c0ff;
}

.rate-text.sales-danger {
  color: #91d5ff;
}

/* 成本目标文字颜色 */
.rate-text.cost-excellent,
.rate-text.cost-good {
  color: #fa8c16;
}

.rate-text.cost-warning {
  color: #ffc069;
}

.rate-text.cost-danger {
  color: #ffd591;
}

/* ROI目标文字颜色 */
.rate-text.roi-excellent,
.rate-text.roi-good {
  color: #722ed1;
}

.rate-text.roi-warning {
  color: #b37feb;
}

.rate-text.roi-danger {
  color: #d3adf7;
}

/* 利润目标文字颜色 */
.rate-text.profit-excellent,
.rate-text.profit-good {
  color: #52c41a;
}

.rate-text.profit-warning {
  color: #95de64;
}

.rate-text.profit-danger {
  color: #b7eb8f;
}

/* 用户数目标文字颜色 */
.rate-text.user_count-excellent,
.rate-text.user_count-good {
  color: #13c2c2;
}

.rate-text.user_count-warning {
  color: #5cdbd3;
}

.rate-text.user_count-danger {
  color: #87e8de;
}

.goal-remarks {
  background: var(--color-background);
  padding: 12px;
  border-radius: 6px;
  border: 1px solid var(--color-border);
  margin-bottom: 12px;
}

.remarks-label {
  font-size: 12px;
  color: var(--color-text-secondary);
  margin-bottom: 4px;
}

.remarks-text {
  font-size: 14px;
  color: var(--color-text-primary);
  line-height: 1.5;
}

.goal-meta {
  font-size: 12px;
  color: var(--color-text-secondary);
  text-align: right;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: var(--color-text-secondary);
}

.empty-icon {
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-text {
  font-size: 16px;
  margin-bottom: 20px;
}

.sub-modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.sub-modal-container {
  background: var(--color-background);
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.sub-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-background-secondary);
}

.sub-modal-header h4 {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.sub-modal-content {
  padding: 20px;
  overflow-y: auto;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
  margin-bottom: 6px;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  font-size: 14px;
  background: var(--color-background);
  color: var(--color-text-primary);
  transition: border-color 0.2s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--color-primary);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
}

@media (max-width: 768px) {
  .modal-container {
    width: 95%;
    max-height: 95vh;
  }

  .goal-metrics {
    grid-template-columns: 1fr;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .goal-card__header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}
</style>
