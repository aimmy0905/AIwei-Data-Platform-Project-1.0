<template>
  <div class="bar-chart" :style="{ height: height, minHeight: '200px' }">
    <v-chart
      :option="chartOption"
      :style="{ height: '100%', width: '100%' }"
      autoresize
      @click="handleClick"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'
import VChart from 'vue-echarts'
import { currentColors } from '@/assets/theme'

// 注册ECharts组件
use([
  CanvasRenderer,
  BarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
])

// 属性定义
interface Props {
  data: Array<{
    name: string
    serviceFee?: number
    profit?: number
    [key: string]: any
  }> | {
    labels: string[]
    datasets: {
      label: string
      data: number[]
      color?: string
    }[]
  }
  height?: string
  title?: string
  showLegend?: boolean
  horizontal?: boolean
  stack?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  height: '400px',
  showLegend: true,
  horizontal: false,
  stack: false
})

// 事件定义
const emit = defineEmits<{
  click: [params: unknown]
}>()

// 计算图表配置
const chartOption = computed(() => {
  const colors = currentColors.value

  // 处理数据格式 - 检查是否是数组格式（项目经理看板用的格式）
  const isArrayFormat = Array.isArray(props.data)

  let labels: string[] = []
  let datasets: Array<{ label: string; data: number[]; color?: string }> = []

  if (isArrayFormat) {
    // 数组格式：[{name: '华为', serviceFee: 418.5, profit: 653.13}, ...]
    const arrayData = props.data as Array<{name: string; serviceFee?: number; profit?: number; [key: string]: any}>
    labels = arrayData.map(item => item.name)

    // 创建服务费和毛利两个数据系列
    const serviceFeeData = arrayData.map(item => item.serviceFee || 0)
    const profitData = arrayData.map(item => item.profit || 0)

    datasets = [
      {
        label: '服务费',
        data: serviceFeeData,
        color: colors.primary
      },
      {
        label: '毛利',
        data: profitData,
        color: colors.success
      }
    ]
  } else {
    // 标准格式：{labels: [], datasets: []}
    const standardData = props.data as {labels: string[]; datasets: Array<{label: string; data: number[]; color?: string}>}
    labels = standardData.labels || []
    datasets = standardData.datasets || []
  }

  return {
    title: props.title ? {
      text: props.title,
      textStyle: {
        color: colors.textPrimary,
        fontSize: 16,
        fontWeight: 600
      }
    } : undefined,

    tooltip: {
      trigger: 'axis',
      backgroundColor: colors.surface,
      borderColor: colors.border,
      textStyle: {
        color: colors.textPrimary
      },
      axisPointer: {
        type: 'shadow'
      },
      formatter: (params: unknown[]) => {
        const paramArray = params as Array<{ axisValue: string; color: string; seriesName: string; value: unknown }>
        let tooltip = `<div style="margin-bottom: 8px; font-weight: 600;">${paramArray[0]?.axisValue || ''}</div>`
        paramArray.forEach((param) => {
          tooltip += `
            <div style="display: flex; align-items: center; margin-bottom: 4px;">
              <span style="display: inline-block; width: 10px; height: 10px; background: ${param.color}; margin-right: 8px; border-radius: 2px;"></span>
              <span style="margin-right: 16px;">${param.seriesName}:</span>
              <span style="font-weight: 600;">${formatValue(param.value as number)}</span>
            </div>
          `
        })
        return tooltip
      }
    },

    legend: props.showLegend ? {
      show: true,
      bottom: 0,
      textStyle: {
        color: colors.textSecondary
      }
    } : { show: false },

    grid: {
      top: props.title ? 60 : 20,
      left: props.horizontal ? 80 : 60,
      right: 30,
      bottom: props.showLegend ? 60 : 30,
      containLabel: true
    },

    xAxis: {
      type: props.horizontal ? 'value' : 'category',
      data: props.horizontal ? undefined : labels,
      axisLine: {
        lineStyle: {
          color: colors.border
        }
      },
      axisLabel: {
        color: colors.textSecondary,
        fontSize: 12,
        formatter: props.horizontal ? (value: number) => formatValue(value) : undefined
      },
      splitLine: {
        show: props.horizontal,
        lineStyle: {
          color: colors.borderLight,
          type: 'dashed'
        }
      }
    },

    yAxis: {
      type: props.horizontal ? 'category' : 'value',
      data: props.horizontal ? labels : undefined,
      axisLine: {
        show: props.horizontal
      },
      axisTick: {
        show: props.horizontal
      },
      axisLabel: {
        color: colors.textSecondary,
        fontSize: 12,
        formatter: props.horizontal ? undefined : (value: number) => formatValue(value)
      },
      splitLine: {
        show: !props.horizontal,
        lineStyle: {
          color: colors.borderLight,
          type: 'dashed'
        }
      }
    },

    series: datasets.map((dataset, index) => ({
      name: dataset.label,
      type: 'bar',
      data: dataset.data,
      stack: props.stack ? 'total' : undefined,
      itemStyle: {
        color: dataset.color || getDefaultColor(index)
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      },
      animationDelay: (idx: number) => idx * 10
    }))
  }
})

// 默认颜色方案
const getDefaultColor = (index: number): string => {
  const colors = [
    currentColors.value.primary,
    currentColors.value.success,
    currentColors.value.warning,
    currentColors.value.info,
    '#722ed1',
    '#fa8c16'
  ]
  return colors[index % colors.length]
}

// 数值格式化
const formatValue = (value: number): string => {
  if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + 'M'
  } else if (value >= 1000) {
    return (value / 1000).toFixed(1) + 'K'
  }
  return value.toLocaleString()
}

// 点击事件处理
const handleClick = (params: unknown) => {
  emit('click', params)
}
</script>

<style scoped>
.bar-chart {
  width: 100%;
  background: var(--color-surface);
  border-radius: var(--border-radius-md);
  position: relative;
  overflow: hidden;
}

.bar-chart > div {
  min-height: 200px !important;
}
</style>
