<template>
  <div class="new-order-service-fee-module">
    <div class="new-order-service-fee-module__header">
      <h3 class="new-order-service-fee-module__title">新单服务费及单量完成</h3>
      <div class="new-order-service-fee-module__controls">
        <div class="view-switch">
          <button 
            v-for="view in viewOptions" 
            :key="view.value"
            class="view-switch__btn"
            :class="{ 'view-switch__btn--active': currentView === view.value }"
            @click="currentView = view.value"
          >
            {{ view.label }}
          </button>
        </div>
      </div>
    </div>

    <div class="new-order-service-fee-module__content">
      <!-- 平台分布图表 -->
      <div class="chart-section">
        <div class="chart-section__header">
          <h4 class="chart-section__title">
            {{ currentView === 'service_fee' ? '服务费平台分布' : '单量平台分布' }}
          </h4>
          <div class="chart-section__total">
            总计: {{ formatValue(totalValue) }}{{ currentView === 'service_fee' ? '' : '单' }}
          </div>
        </div>
        
        <div class="chart-container">
          <PieChart
            :data="pieChartData"
            :height="'320px'"
            :donut="true"
            :show-legend="true"
            @click="handlePieChartClick"
          />
        </div>
      </div>

      <!-- 对比图表 -->
      <div class="chart-section">
        <div class="chart-section__header">
          <h4 class="chart-section__title">服务费 vs 单量对比</h4>
        </div>
        
        <div class="chart-container">
          <BarChart
            :data="barChartData"
            :height="'320px'"
            :show-legend="true"
            :stack="false"
            @click="handleBarChartClick"
          />
        </div>
      </div>

      <!-- 统计概览 -->
      <div class="statistics-section">
        <div class="statistics-grid">
          <div 
            v-for="stat in platformStatistics" 
            :key="stat.platform"
            class="stat-card"
          >
            <div class="stat-card__header">
              <div class="stat-card__platform">
                <div 
                  class="stat-card__color"
                  :style="{ backgroundColor: stat.color }"
                ></div>
                <span class="stat-card__platform-name">{{ stat.platform }}</span>
              </div>
              <div class="stat-card__percentage">{{ stat.percentage.toFixed(1) }}%</div>
            </div>
            <div class="stat-card__content">
              <div class="stat-card__metric">
                <span class="stat-card__metric-label">服务费</span>
                <span class="stat-card__metric-value">{{ formatValue(stat.serviceFee) }}</span>
              </div>
              <div class="stat-card__metric">
                <span class="stat-card__metric-label">单量</span>
                <span class="stat-card__metric-value">{{ stat.orderCount }}单</span>
              </div>
              <div class="stat-card__metric">
                <span class="stat-card__metric-label">单均</span>
                <span class="stat-card__metric-value">
                  {{ stat.orderCount > 0 ? formatValue(stat.serviceFee / stat.orderCount) : '0' }}
                </span>
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
import PieChart from '@/components/charts/PieChart.vue'
import BarChart from '@/components/charts/BarChart.vue'
import type { PlatformData } from '@/types'

interface Props {
  platformData: PlatformData[]
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<{
  platformClick: [platform: string]
}>()

const currentView = ref<'service_fee' | 'order_count'>('service_fee')

const viewOptions = [
  { value: 'service_fee' as const, label: '服务费分布' },
  { value: 'order_count' as const, label: '单量分布' }
]

const pieChartData = computed(() => {
  return props.platformData.map(platform => ({
    name: platform.platform,
    value: currentView.value === 'service_fee' ? platform.serviceFee : platform.orderCount,
    color: platform.color
  }))
})

const barChartData = computed(() => {
  return {
    labels: props.platformData.map(p => p.platform),
    datasets: [
      {
        label: '服务费',
        data: props.platformData.map(p => p.serviceFee),
        color: '#1890ff'
      },
      {
        label: '单量',
        data: props.platformData.map(p => p.orderCount),
        color: '#52c41a'
      }
    ]
  }
})

const platformStatistics = computed(() => {
  const totalServiceFee = props.platformData.reduce((sum, p) => sum + p.serviceFee, 0)
  
  return props.platformData.map(platform => ({
    ...platform,
    percentage: totalServiceFee > 0 ? (platform.serviceFee / totalServiceFee) * 100 : 0
  })).sort((a, b) => b.serviceFee - a.serviceFee)
})

const totalValue = computed(() => {
  return props.platformData.reduce((sum, p) => 
    sum + (currentView.value === 'service_fee' ? p.serviceFee : p.orderCount), 0
  )
})

const formatValue = (value: number): string => {
  if (value >= 100000000) {
    return `¥${(value / 100000000).toFixed(2)}亿`
  } else if (value >= 10000) {
    return `¥${(value / 10000).toFixed(2)}万`
  } else if (value >= 1000) {
    return `¥${(value / 1000).toFixed(1)}K`
  } else {
    return `¥${value.toLocaleString()}`
  }
}

const handlePieChartClick = (params: any) => {
  emit('platformClick', params.name)
}

const handleBarChartClick = (params: any) => {
  emit('platformClick', params.name)
}
</script>

<style scoped>
.new-order-service-fee-module {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-bottom: 24px;
}

.new-order-service-fee-module__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.new-order-service-fee-module__title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #262626;
}

.view-switch {
  display: flex;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  overflow: hidden;
}

.view-switch__btn {
  padding: 6px 16px;
  background: #fff;
  border: none;
  color: #595959;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.view-switch__btn:hover {
  background: #f5f5f5;
}

.view-switch__btn--active {
  background: #1890ff;
  color: #fff;
}

.new-order-service-fee-module__content {
  display: grid;
  gap: 24px;
}

.chart-section {
  background: #fafafa;
  border-radius: 8px;
  padding: 20px;
}

.chart-section__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.chart-section__title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #262626;
}

.chart-section__total {
  font-size: 14px;
  font-weight: 600;
  color: #1890ff;
}

.chart-container {
  background: #fff;
  border-radius: 6px;
  padding: 16px;
}

.statistics-section {
  background: #fafafa;
  border-radius: 8px;
  padding: 20px;
}

.statistics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.stat-card {
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  padding: 16px;
}

.stat-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.stat-card__platform {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stat-card__color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.stat-card__platform-name {
  font-size: 14px;
  font-weight: 600;
  color: #262626;
}

.stat-card__percentage {
  font-size: 14px;
  font-weight: 600;
  color: #1890ff;
}

.stat-card__content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-card__metric {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-card__metric-label {
  font-size: 12px;
  color: #8c8c8c;
}

.stat-card__metric-value {
  font-size: 13px;
  font-weight: 600;
  color: #262626;
}

@media (max-width: 1200px) {
  .new-order-service-fee-module__content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .new-order-service-fee-module {
    padding: 16px;
  }

  .new-order-service-fee-module__header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .statistics-grid {
    grid-template-columns: 1fr;
  }

  .chart-section {
    padding: 16px;
  }
}
</style>