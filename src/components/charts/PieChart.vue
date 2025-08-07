<template>
  <div class="pie-chart" :id="chartId">
    <v-chart
      :option="chartOption"
      :style="{ height: height, width: '100%' }"
      :init-options="{ renderer: 'canvas' }"
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
  chartId?: string
}

const props = withDefaults(defineProps<Props>(), {
  height: '400px',
  showLegend: true,
  donut: false,
  radius: '70%',
  chartId: () => `pie-chart-${Math.random().toString(36).substr(2, 9)}`
})

// 事件定义
const emit = defineEmits<{
  click: [params: unknown]
}>()

// 生成唯一的图表ID
const chartId = computed(() => props.chartId || `pie-chart-${Math.random().toString(36).substr(2, 9)}`)

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
        const param = params as { percent: number; color: string; name: string; value: unknown }
        const percentage = param.percent || 0
        return `
          <div style="display: flex; align-items: center; margin-bottom: 4px;">
            <span style="display: inline-block; width: 10px; height: 10px; background: ${param.color}; margin-right: 8px; border-radius: 50%;"></span>
            <span style="margin-right: 16px;">${param.name}:</span>
            <span style="font-weight: 600;">${formatValue(param.value as number)} (${percentage}%)</span>
          </div>
        `
      }
    },

                        legend: props.showLegend ? {
      orient: 'horizontal',
      bottom: 15,
      left: 'center',
      itemWidth: 8,
      itemHeight: 8,
      itemGap: 20,
      width: '95%',
      formatter: (name: string) => {
        const item = props.data.find(d => d.name === name)
        if (!item) return name

        const value = formatValue(item.value)
        // 计算总值用于显示百分比
        const total = props.data.reduce((sum, item) => sum + item.value, 0)
        const percentage = ((item.value / total) * 100).toFixed(1)

        // 缩短名称以适应水平布局
        const shortName = name.length > 8 ? name.substring(0, 8) + '...' : name
        return `${shortName} $${value} (${percentage}%)`
      },
      textStyle: {
        color: colors.textPrimary,
        fontSize: 10,
        lineHeight: 16,
        fontFamily: 'Arial, sans-serif'
      }
    } : { show: false },

            series: [
      {
        type: 'pie',
        radius: props.donut ? ['30%', '55%'] : '55%',
        center: ['50%', '45%'],
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
          show: false
        },
        labelLine: {
          show: false
        },
        silent: false,
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
