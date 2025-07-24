<template>
  <div class="activity-trend-chart">
    <div class="chart-header">
      <h3>{{ title }}</h3>
      <div class="chart-controls">
        <select v-model="selectedMetric" class="metric-select" @change="updateChart">
          <option value="sales">销售额</option>
          <option value="roi">ROI</option>
          <option value="orders">订单数</option>
          <option value="users">用户数</option>
        </select>
      </div>
    </div>
    <div class="chart-container">
      <canvas ref="chartCanvas" :width="chartWidth" :height="chartHeight"></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
import type { ActivityData } from '@/types'

interface Props {
  title?: string
  data: ActivityData[]
  width?: number
  height?: number
}

const props = withDefaults(defineProps<Props>(), {
  title: '活动数据趋势',
  width: 800,
  height: 300
})

const chartCanvas = ref<HTMLCanvasElement>()
const selectedMetric = ref('sales')
const chartWidth = ref(props.width)
const chartHeight = ref(props.height)

// 绘制图表
const drawChart = () => {
  if (!chartCanvas.value || !props.data.length) return

  const canvas = chartCanvas.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // 清空画布
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // 设置画布样式
  const padding = 60
  const chartArea = {
    x: padding,
    y: padding,
    width: canvas.width - padding * 2,
    height: canvas.height - padding * 2
  }

  // 获取数据
  const data = props.data.map(item => {
    switch (selectedMetric.value) {
      case 'sales':
        return item.totalSales
      case 'roi':
        return item.roi
      case 'orders':
        return item.orderCount
      case 'users':
        return item.userCount
      default:
        return item.totalSales
    }
  })

  const labels = props.data.map(item => {
    const date = new Date(item.date)
    return `${date.getMonth() + 1}/${date.getDate()}`
  })

  // 计算数据范围
  const minValue = Math.min(...data)
  const maxValue = Math.max(...data)
  const valueRange = maxValue - minValue
  const padding_value = valueRange * 0.1

  // 绘制网格线
  ctx.strokeStyle = '#e0e0e0'
  ctx.lineWidth = 1

  // 垂直网格线
  for (let i = 0; i <= labels.length - 1; i++) {
    const x = chartArea.x + (i * chartArea.width) / (labels.length - 1)
    ctx.beginPath()
    ctx.moveTo(x, chartArea.y)
    ctx.lineTo(x, chartArea.y + chartArea.height)
    ctx.stroke()
  }

  // 水平网格线
  for (let i = 0; i <= 5; i++) {
    const y = chartArea.y + (i * chartArea.height) / 5
    ctx.beginPath()
    ctx.moveTo(chartArea.x, y)
    ctx.lineTo(chartArea.x + chartArea.width, y)
    ctx.stroke()
  }

  // 绘制数据线
  ctx.strokeStyle = '#1976d2'
  ctx.lineWidth = 2
  ctx.beginPath()

  data.forEach((value, index) => {
    const x = chartArea.x + (index * chartArea.width) / (data.length - 1)
    const y = chartArea.y + chartArea.height -
      ((value - minValue + padding_value) / (valueRange + padding_value * 2)) * chartArea.height

    if (index === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  })

  ctx.stroke()

  // 绘制数据点
  ctx.fillStyle = '#1976d2'
  data.forEach((value, index) => {
    const x = chartArea.x + (index * chartArea.width) / (data.length - 1)
    const y = chartArea.y + chartArea.height -
      ((value - minValue + padding_value) / (valueRange + padding_value * 2)) * chartArea.height

    ctx.beginPath()
    ctx.arc(x, y, 4, 0, 2 * Math.PI)
    ctx.fill()
  })

  // 绘制坐标轴标签
  ctx.fillStyle = '#666'
  ctx.font = '12px Arial'
  ctx.textAlign = 'center'

  // X轴标签
  labels.forEach((label, index) => {
    const x = chartArea.x + (index * chartArea.width) / (labels.length - 1)
    ctx.fillText(label, x, canvas.height - 20)
  })

  // Y轴标签
  ctx.textAlign = 'right'
  for (let i = 0; i <= 5; i++) {
    const value = minValue + (i * valueRange) / 5
    const y = chartArea.y + chartArea.height - (i * chartArea.height) / 5
    ctx.fillText(formatValue(value), chartArea.x - 10, y + 4)
  }
}

const formatValue = (value: number): string => {
  if (selectedMetric.value === 'sales') {
    return `$${(value / 1000).toFixed(0)}k`
  } else if (selectedMetric.value === 'roi') {
    return value.toFixed(1)
  } else {
    return value.toLocaleString()
  }
}

const updateChart = () => {
  nextTick(() => {
    drawChart()
  })
}

// 监听数据变化
watch(() => props.data, updateChart, { deep: true })
watch(selectedMetric, updateChart)

onMounted(() => {
  updateChart()
})
</script>

<style scoped>
.activity-trend-chart {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.chart-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.metric-select {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background: white;
}

.chart-container {
  position: relative;
  overflow: hidden;
}

canvas {
  max-width: 100%;
  height: auto;
}
</style>
