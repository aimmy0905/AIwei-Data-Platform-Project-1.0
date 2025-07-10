<template>
  <div class="mini-trend-chart">
    <div class="chart-legend">
      <div class="legend-item">
        <div class="legend-dot target" :style="{ backgroundColor: colors.target }"></div>
        <span>目标</span>
      </div>
      <div class="legend-item">
        <div class="legend-dot actual" :style="{ backgroundColor: colors.actual }"></div>
        <span>实际</span>
      </div>
    </div>
    <canvas
      ref="chartCanvas"
      :width="width"
      :height="height"
      class="chart-canvas"
    ></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'

interface ChartData {
  labels: string[]
  targetData: number[]
  actualData: number[]
}

interface Props {
  data: ChartData
  type: 'line' | 'bar'
  width?: number
  height?: number
  colors?: {
    target: string
    actual: string
  }
}

const props = withDefaults(defineProps<Props>(), {
  width: 280,
  height: 120,
  colors: () => ({
    target: '#e0e0e0',
    actual: '#1976d2'
  })
})

const chartCanvas = ref<HTMLCanvasElement>()

const drawChart = () => {
  if (!chartCanvas.value || !props.data.labels.length) return

  const canvas = chartCanvas.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // 清除画布
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  const padding = 35 // 增加padding为坐标轴留出空间
  const chartWidth = canvas.width - padding * 2
  const chartHeight = canvas.height - padding * 2

  // 计算数据范围
  const allData = [...props.data.targetData, ...props.data.actualData]
  const maxValue = Math.max(...allData)
  const minValue = Math.min(...allData, 0)
  const valueRange = maxValue - minValue || 1

  // 绘制坐标轴
  drawAxes(ctx, padding, chartWidth, chartHeight, maxValue, minValue)

  if (props.type === 'line') {
    drawLineChart(ctx, padding, chartWidth, chartHeight, maxValue, minValue, valueRange)
  } else {
    drawBarChart(ctx, padding, chartWidth, chartHeight, maxValue, minValue, valueRange)
  }
}

// 绘制坐标轴和标签
const drawAxes = (
  ctx: CanvasRenderingContext2D,
  padding: number,
  chartWidth: number,
  chartHeight: number,
  maxValue: number,
  minValue: number
) => {
  ctx.strokeStyle = '#e0e0e0'
  ctx.lineWidth = 1
  ctx.font = '10px Arial'
  ctx.fillStyle = '#666'

  // 绘制Y轴
  ctx.beginPath()
  ctx.moveTo(padding, padding)
  ctx.lineTo(padding, padding + chartHeight)
  ctx.stroke()

  // 绘制X轴
  ctx.beginPath()
  ctx.moveTo(padding, padding + chartHeight)
  ctx.lineTo(padding + chartWidth, padding + chartHeight)
  ctx.stroke()

  // Y轴标签（数值）
  const ySteps = 4
  const valueStep = (maxValue - minValue) / ySteps
  for (let i = 0; i <= ySteps; i++) {
    const value = minValue + valueStep * i
    const y = padding + chartHeight - (i / ySteps) * chartHeight

    // 绘制刻度线
    ctx.beginPath()
    ctx.moveTo(padding - 3, y)
    ctx.lineTo(padding, y)
    ctx.stroke()

    // 绘制数值标签
    const label = formatValue(value)
    const textWidth = ctx.measureText(label).width
    ctx.fillText(label, padding - textWidth - 6, y + 3)
  }

  // X轴标签（日期）
  const labelCount = Math.min(props.data.labels.length, 5) // 最多显示5个标签
  const labelStep = Math.floor(props.data.labels.length / labelCount)

  for (let i = 0; i < labelCount; i++) {
    const index = i * labelStep
    if (index >= props.data.labels.length) break

    const x = padding + (index / (props.data.labels.length - 1)) * chartWidth
    const label = props.data.labels[index]

    // 绘制刻度线
    ctx.beginPath()
    ctx.moveTo(x, padding + chartHeight)
    ctx.lineTo(x, padding + chartHeight + 3)
    ctx.stroke()

    // 绘制日期标签
    const textWidth = ctx.measureText(label).width
    ctx.fillText(label, x - textWidth / 2, padding + chartHeight + 15)
  }
}

// 格式化数值显示
const formatValue = (value: number): string => {
  if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + 'M'
  } else if (value >= 1000) {
    return (value / 1000).toFixed(1) + 'K'
  } else if (value < 10 && value > 0) {
    return value.toFixed(1)
  } else {
    return Math.round(value).toString()
  }
}

const drawLineChart = (
  ctx: CanvasRenderingContext2D,
  padding: number,
  chartWidth: number,
  chartHeight: number,
  maxValue: number,
  minValue: number,
  valueRange: number
) => {
  const pointCount = props.data.labels.length
  const stepX = chartWidth / (pointCount - 1)

  // 绘制背景网格（轻微）
  ctx.strokeStyle = '#f8f8f8'
  ctx.lineWidth = 0.5
  for (let i = 1; i < 4; i++) {
    const y = padding + (chartHeight / 4) * i
    ctx.beginPath()
    ctx.moveTo(padding, y)
    ctx.lineTo(padding + chartWidth, y)
    ctx.stroke()
  }

  // 绘制目标线（虚线）
  ctx.strokeStyle = props.colors.target
  ctx.lineWidth = 2
  ctx.setLineDash([5, 5])
  ctx.beginPath()
  props.data.targetData.forEach((value, index) => {
    const x = padding + index * stepX
    const y = padding + chartHeight - ((value - minValue) / valueRange) * chartHeight
    if (index === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  })
  ctx.stroke()
  ctx.setLineDash([])

  // 绘制实际值线
  ctx.strokeStyle = props.colors.actual
  ctx.lineWidth = 2.5
  ctx.beginPath()
  props.data.actualData.forEach((value, index) => {
    const x = padding + index * stepX
    const y = padding + chartHeight - ((value - minValue) / valueRange) * chartHeight
    if (index === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  })
  ctx.stroke()

  // 绘制实际值点
  ctx.fillStyle = props.colors.actual
  props.data.actualData.forEach((value, index) => {
    const x = padding + index * stepX
    const y = padding + chartHeight - ((value - minValue) / valueRange) * chartHeight
    ctx.beginPath()
    ctx.arc(x, y, 2.5, 0, 2 * Math.PI)
    ctx.fill()
  })
}

const drawBarChart = (
  ctx: CanvasRenderingContext2D,
  padding: number,
  chartWidth: number,
  chartHeight: number,
  maxValue: number,
  minValue: number,
  valueRange: number
) => {
  const barCount = props.data.labels.length
  const barGroupWidth = chartWidth / barCount
  const barWidth = barGroupWidth * 0.25
  const barSpacing = barGroupWidth * 0.05

  // 绘制背景网格（轻微）
  ctx.strokeStyle = '#f8f8f8'
  ctx.lineWidth = 0.5
  for (let i = 1; i < 4; i++) {
    const y = padding + (chartHeight / 4) * i
    ctx.beginPath()
    ctx.moveTo(padding, y)
    ctx.lineTo(padding + chartWidth, y)
    ctx.stroke()
  }

  props.data.targetData.forEach((targetValue, index) => {
    const actualValue = props.data.actualData[index]
    const x = padding + index * barGroupWidth + barSpacing

    // 目标值柱子（半透明）
    const targetHeight = ((targetValue - minValue) / valueRange) * chartHeight
    const targetY = padding + chartHeight - targetHeight
    ctx.fillStyle = props.colors.target + '80' // 添加透明度
    ctx.fillRect(x, targetY, barWidth, targetHeight)

    // 实际值柱子
    const actualHeight = ((actualValue - minValue) / valueRange) * chartHeight
    const actualY = padding + chartHeight - actualHeight
    ctx.fillStyle = props.colors.actual
    ctx.fillRect(x + barWidth + barSpacing, actualY, barWidth, actualHeight)
  })
}

// 监听数据变化重绘图表
watch(() => props.data, () => {
  nextTick(() => {
    drawChart()
  })
}, { deep: true })

watch(() => props.type, () => {
  nextTick(() => {
    drawChart()
  })
})

onMounted(() => {
  nextTick(() => {
    drawChart()
  })
})
</script>

<style scoped>
.mini-trend-chart {
  width: 100%;
  height: 140px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.chart-legend {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 4px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: #666;
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.legend-dot.target {
  border: 1px dashed #999;
  background: transparent !important;
}

.chart-canvas {
  max-width: 100%;
  height: auto;
  flex: 1;
}
</style>
