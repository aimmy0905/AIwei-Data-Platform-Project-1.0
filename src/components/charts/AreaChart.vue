<template>
  <div class="area-chart">
    <v-chart 
      :option="chartOption" 
      :style="{ height: height, width: '100%' }"
      autoresize
      @click="handleClick"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
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
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
])

// 属性定义
interface Props {
  data: {
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
  smooth?: boolean
  stack?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  height: '400px',
  showLegend: true,
  smooth: true,
  stack: false
})

// 事件定义
const emit = defineEmits<{
  click: [params: unknown]
}>()

// 计算图表配置
const chartOption = computed(() => {
  const colors = currentColors.value
  
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
        type: 'cross',
        crossStyle: {
          color: colors.textSecondary
        }
      },
      formatter: (params: unknown[]) => {
        let tooltip = `<div style="margin-bottom: 8px; font-weight: 600;">${params[0].axisValue}</div>`
        params.forEach((param) => {
          tooltip += `
            <div style="display: flex; align-items: center; margin-bottom: 4px;">
              <span style="display: inline-block; width: 10px; height: 10px; background: ${param.color}; margin-right: 8px; border-radius: 50%;"></span>
              <span style="margin-right: 16px;">${param.seriesName}:</span>
              <span style="font-weight: 600;">${formatValue(param.value)}</span>
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
      left: 60,
      right: 30,
      bottom: props.showLegend ? 60 : 30,
      containLabel: true
    },
    
    xAxis: {
      type: 'category',
      data: props.data.labels,
      boundaryGap: false,
      axisLine: {
        lineStyle: {
          color: colors.border
        }
      },
      axisLabel: {
        color: colors.textSecondary,
        fontSize: 12
      },
      splitLine: {
        show: false
      }
    },
    
    yAxis: {
      type: 'value',
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: colors.textSecondary,
        fontSize: 12,
        formatter: (value: number) => formatValue(value)
      },
      splitLine: {
        lineStyle: {
          color: colors.borderLight,
          type: 'dashed'
        }
      }
    },
    
    series: props.data.datasets.map((dataset, index) => ({
      name: dataset.label,
      type: 'line',
      data: dataset.data,
      smooth: props.smooth,
      stack: props.stack ? 'total' : undefined,
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: `${dataset.color || getDefaultColor(index)}40`
            },
            {
              offset: 1,
              color: `${dataset.color || getDefaultColor(index)}10`
            }
          ]
        }
      },
      lineStyle: {
        width: 2,
        color: dataset.color || getDefaultColor(index)
      },
      itemStyle: {
        color: dataset.color || getDefaultColor(index),
        borderWidth: 2,
        borderColor: colors.surface
      },
      emphasis: {
        scale: 1.1
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
.area-chart {
  width: 100%;
  background: var(--color-surface);
  border-radius: var(--border-radius-md);
}
</style>