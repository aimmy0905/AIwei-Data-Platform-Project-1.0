<template>
  <div class="pie-chart">
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
import { PieChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent
} from 'echarts/components'
import VChart from 'vue-echarts'
import { currentColors } from '@/assets/theme'

// 注册ECharts组件
use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent
])

// 属性定义
interface Props {
  data: {
    name: string
    value: number
    color?: string
  }[]
  height?: string
  title?: string
  showLegend?: boolean
  donut?: boolean
  radius?: string | [string, string]
}

const props = withDefaults(defineProps<Props>(), {
  height: '400px',
  showLegend: true,
  donut: false,
  radius: '70%'
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
      left: 'center',
      textStyle: {
        color: colors.textPrimary,
        fontSize: 16,
        fontWeight: 600
      }
    } : undefined,
    
    tooltip: {
      trigger: 'item',
      backgroundColor: colors.surface,
      borderColor: colors.border,
      textStyle: {
        color: colors.textPrimary
      },
      formatter: (params: unknown) => {
        const percentage = params.percent || 0
        return `
          <div style="display: flex; align-items: center; margin-bottom: 4px;">
            <span style="display: inline-block; width: 10px; height: 10px; background: ${params.color}; margin-right: 8px; border-radius: 50%;"></span>
            <span style="margin-right: 16px;">${params.name}:</span>
            <span style="font-weight: 600;">${formatValue(params.value)} (${percentage}%)</span>
          </div>
        `
      }
    },
    
    legend: props.showLegend ? {
      orient: 'vertical',
      right: 10,
      top: 'center',
      textStyle: {
        color: colors.textSecondary
      }
    } : { show: false },
    
    series: [
      {
        type: 'pie',
        radius: props.donut 
          ? (Array.isArray(props.radius) ? props.radius : ['40%', props.radius])
          : props.radius,
        center: ['40%', '50%'],
        data: props.data.map((item, index) => ({
          ...item,
          itemStyle: {
            color: item.color || getDefaultColor(index)
          }
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        label: {
          show: !props.showLegend,
          position: 'outside',
          color: colors.textPrimary,
          formatter: '{b}: {c} ({d}%)'
        },
        labelLine: {
          show: !props.showLegend
        },
        animationType: 'scale',
        animationEasing: 'elasticOut',
        animationDelay: () => Math.random() * 200
      }
    ]
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
    '#fa8c16',
    '#13c2c2',
    '#eb2f96'
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
.pie-chart {
  width: 100%;
  background: var(--color-surface);
  border-radius: var(--border-radius-md);
}
</style>