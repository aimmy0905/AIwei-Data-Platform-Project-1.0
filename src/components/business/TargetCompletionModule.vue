<template>
  <div class="target-completion-module">
    <div class="target-completion-module__header">
      <h3 class="target-completion-module__title">目标完成情况</h3>
      <QuarterSelector 
        v-model="selectedQuarter"
        title=""
        @change="handleQuarterChange"
      />
    </div>

    <div class="target-completion-module__content">
      <div class="target-completion-module__cards">
        <TargetComparisonCard
          v-for="target in targetComparisons"
          :key="target.targetType"
          v-bind="target"
          :show-trend="true"
          :trend="{
            direction: 'up',
            value: target.targetType === 'service_fee' ? 25000 : 3,
            period: '环比上季度'
          }"
        />
      </div>

      <div class="target-completion-module__summary">
        <div class="summary-card">
          <div class="summary-card__header">
            <h4 class="summary-card__title">团队完成概览</h4>
          </div>
          <div class="summary-card__content">
            <div class="summary-metric">
              <span class="summary-metric__label">综合完成率</span>
              <span class="summary-metric__value" :class="getOverallRateClass()">
                {{ overallCompletionRate.toFixed(1) }}%
              </span>
            </div>
            <div class="summary-metric">
              <span class="summary-metric__label">团队排名</span>
              <span class="summary-metric__value ranking">
                {{ teamRanking }}/{{ totalTeams }}
              </span>
            </div>
            <div class="summary-progress">
              <div class="summary-progress__bar">
                <div 
                  class="summary-progress__fill"
                  :style="{ 
                    width: `${Math.min(overallCompletionRate, 100)}%`,
                    backgroundColor: getProgressColor()
                  }"
                ></div>
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
import QuarterSelector from './QuarterSelector.vue'
import TargetComparisonCard from './TargetComparisonCard.vue'
import type { Quarter, TargetComparison, TeamMemberPerformance } from '@/types'

interface Props {
  teamMembers: TeamMemberPerformance[]
  teamRanking?: number
  totalTeams?: number
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  teamRanking: 1,
  totalTeams: 5,
  loading: false
})

const emit = defineEmits<{
  quarterChange: [quarter: Quarter]
}>()

const selectedQuarter = ref<Quarter>({
  year: new Date().getFullYear(),
  quarter: Math.ceil((new Date().getMonth() + 1) / 3),
  label: `${new Date().getFullYear()}年Q${Math.ceil((new Date().getMonth() + 1) / 3)}`,
  isActive: true
})

const targetComparisons = computed<TargetComparison[]>(() => {
  const totalServiceFeeTarget = props.teamMembers.reduce((sum, member) => sum + member.serviceFeeTarget, 0)
  const totalServiceFeeActual = props.teamMembers.reduce((sum, member) => sum + member.serviceFeeActual, 0)
  const totalNewOrdersTarget = props.teamMembers.reduce((sum, member) => sum + member.newOrdersTarget, 0)
  const totalNewOrdersActual = props.teamMembers.reduce((sum, member) => sum + member.newOrdersActual, 0)

  return [
    {
      targetType: 'service_fee',
      targetValue: totalServiceFeeTarget,
      actualValue: totalServiceFeeActual,
      difference: totalServiceFeeActual - totalServiceFeeTarget,
      completionRate: totalServiceFeeTarget > 0 ? (totalServiceFeeActual / totalServiceFeeTarget) * 100 : 0,
      unit: '¥'
    },
    {
      targetType: 'new_orders',
      targetValue: totalNewOrdersTarget,
      actualValue: totalNewOrdersActual,
      difference: totalNewOrdersActual - totalNewOrdersTarget,
      completionRate: totalNewOrdersTarget > 0 ? (totalNewOrdersActual / totalNewOrdersTarget) * 100 : 0,
      unit: '单'
    }
  ]
})

const overallCompletionRate = computed(() => {
  if (targetComparisons.value.length === 0) return 0
  const totalRate = targetComparisons.value.reduce((sum, target) => sum + target.completionRate, 0)
  return totalRate / targetComparisons.value.length
})

const handleQuarterChange = (quarter: Quarter) => {
  selectedQuarter.value = quarter
  emit('quarterChange', quarter)
}

const getOverallRateClass = () => {
  const rate = overallCompletionRate.value
  if (rate >= 100) return 'excellent'
  if (rate >= 80) return 'good'
  if (rate >= 50) return 'warning'
  return 'danger'
}

const getProgressColor = () => {
  const rate = overallCompletionRate.value
  if (rate >= 100) return '#52c41a'
  if (rate >= 80) return '#1890ff'
  if (rate >= 50) return '#faad14'
  return '#ff4d4f'
}
</script>

<style scoped>
.target-completion-module {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-bottom: 24px;
}

.target-completion-module__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.target-completion-module__title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #262626;
}

.target-completion-module__content {
  display: grid;
  gap: 24px;
}

.target-completion-module__cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
}

.target-completion-module__summary {
  display: flex;
  justify-content: center;
}

.summary-card {
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 20px;
  width: 100%;
  max-width: 400px;
}

.summary-card__header {
  margin-bottom: 16px;
}

.summary-card__title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #262626;
  text-align: center;
}

.summary-card__content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.summary-metric {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary-metric__label {
  font-size: 14px;
  color: #8c8c8c;
}

.summary-metric__value {
  font-size: 16px;
  font-weight: 600;
}

.summary-metric__value.excellent {
  color: #52c41a;
}

.summary-metric__value.good {
  color: #1890ff;
}

.summary-metric__value.warning {
  color: #faad14;
}

.summary-metric__value.danger {
  color: #ff4d4f;
}

.summary-metric__value.ranking {
  color: #722ed1;
}

.summary-progress {
  margin-top: 8px;
}

.summary-progress__bar {
  height: 8px;
  background: #f5f5f5;
  border-radius: 4px;
  overflow: hidden;
}

.summary-progress__fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.6s ease;
}

@media (max-width: 768px) {
  .target-completion-module {
    padding: 16px;
  }

  .target-completion-module__header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .target-completion-module__cards {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}
</style>