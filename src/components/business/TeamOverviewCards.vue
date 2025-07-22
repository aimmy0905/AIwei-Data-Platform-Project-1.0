<template>
  <div class="team-overview-cards">
    <div class="team-overview-cards__grid">
      <MetricCard
        v-for="metric in metrics"
        :key="metric.title"
        v-bind="metric"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import MetricCard from './MetricCard.vue'
import type { MetricCardProps, TeamMetrics } from '@/types'

interface Props {
  teamData: TeamMetrics
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const metrics = computed<MetricCardProps[]>(() => {
  const { teamData } = props
  
  return [
    {
      title: '团队服务费完成',
      value: teamData.totalServiceFee,
      unit: '¥',
      trend: 'up',
      trendValue: 12.8,
      trendPeriod: '环比上月',
      color: '#1890ff',
      icon: 'DollarSign'
    },
    {
      title: '团队新单完成',
      value: teamData.totalNewOrders,
      unit: '单',
      trend: 'up',
      trendValue: 6.7,
      trendPeriod: '环比上月',
      color: '#52c41a',
      icon: 'Target'
    },
    {
      title: '团队客户数',
      value: teamData.totalCustomers,
      unit: '家',
      trend: 'up',
      trendValue: 4.2,
      trendPeriod: '环比上月',
      color: '#fa8c16',
      icon: 'Users'
    },
    {
      title: '团队平均完成率',
      value: teamData.averageCompletionRate,
      unit: '%',
      trend: 'up',
      trendValue: 3.3,
      trendPeriod: '环比上月',
      color: '#722ed1',
      icon: 'TrendingUp'
    }
  ]
})
</script>

<style scoped>
.team-overview-cards {
  margin-bottom: 24px;
}

.team-overview-cards__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

@media (max-width: 768px) {
  .team-overview-cards__grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}
</style>