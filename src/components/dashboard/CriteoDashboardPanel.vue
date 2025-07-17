<template>
  <div class="criteo-dashboard-panel">
    <!-- 账号选择模块 -->
    <div class="account-section">
      <div class="section-header">
        <h3 class="section-title">
          <i class="fas fa-cog"></i>
          账号选择
        </h3>
      </div>

      <div class="account-selector">
        <div class="account-dropdown">
          <select v-model="selectedAccount" @change="handleAccountChange">
            <option value="">选择Criteo广告账户</option>
            <option
              v-for="account in accounts"
              :key="account.id"
              :value="account.id"
            >
              {{ account.name }} ({{ account.statusText }})
            </option>
          </select>
        </div>

        <div class="account-info" v-if="selectedAccountInfo">
          <div class="account-status">
            <span :class="['status-badge', `status-badge--${selectedAccountInfo.status}`]">
              {{ selectedAccountInfo.statusText }}
            </span>
          </div>
          <div class="account-balance">
            余额: {{ selectedAccountInfo.balance }}
          </div>
        </div>
      </div>
    </div>

    <!-- 数据提醒模块 -->
    <div class="alert-section">
      <div class="section-header">
        <h3 class="section-title">
          <i class="fas fa-exclamation-triangle"></i>
          数据提醒
        </h3>
        <p class="section-description">显示需要关注的异常数据和账户状态</p>
      </div>

      <div class="alert-cards">
        <div
          v-for="alert in alerts"
          :key="alert.id"
          :class="['alert-card', `alert-card--${alert.priority}`]"
        >
          <div class="alert-icon">
            <i :class="getAlertIcon(alert.type)"></i>
          </div>
          <div class="alert-content">
            <div class="alert-title">{{ alert.title }}</div>
            <div class="alert-message">{{ alert.message }}</div>
            <div class="alert-value">{{ alert.value }}</div>
          </div>
          <button class="alert-action" @click="handleAlertAction(alert)">
            查看详情
          </button>
        </div>
      </div>
    </div>

    <!-- 1. 广告账号总览 -->
    <div class="overview-section">
      <div class="section-header">
        <h3>广告账号总览</h3>
        <div class="header-actions">
          <select v-model="selectedTimeRange" class="time-selector" @change="refreshData">
            <option value="7">近7天</option>
            <option value="14">近14天</option>
            <option value="30">近30天</option>
            <option value="90">近90天</option>
          </select>
          <button @click="refreshData" class="refresh-btn" :disabled="loading">
            <span v-if="loading">刷新中...</span>
            <span v-else>刷新</span>
          </button>
        </div>
      </div>

      <!-- 核心指标卡片 -->
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-label">Criteo花费</div>
          <div class="metric-value">{{ formatCurrency(overviewMetrics.totalCost) }}</div>
          <div class="metric-change" :class="{ positive: overviewMetrics.costChange > 0, negative: overviewMetrics.costChange < 0 }">
            {{ overviewMetrics.costChange > 0 ? '+' : '' }}{{ overviewMetrics.costChange }}%
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-label">日均花费</div>
          <div class="metric-value">{{ formatCurrency(overviewMetrics.avgDailyCost) }}</div>
          <div class="metric-change" :class="{ positive: overviewMetrics.avgDailyCostChange > 0, negative: overviewMetrics.avgDailyCostChange < 0 }">
            {{ overviewMetrics.avgDailyCostChange > 0 ? '+' : '' }}{{ overviewMetrics.avgDailyCostChange }}%
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-label">广告收入</div>
          <div class="metric-value">{{ formatCurrency(overviewMetrics.totalRevenue) }}</div>
          <div class="metric-change" :class="{ positive: overviewMetrics.revenueChange > 0, negative: overviewMetrics.revenueChange < 0 }">
            {{ overviewMetrics.revenueChange > 0 ? '+' : '' }}{{ overviewMetrics.revenueChange }}%
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-label">ROAS</div>
          <div class="metric-value">{{ overviewMetrics.roas.toFixed(2) }}</div>
          <div class="metric-change" :class="{ positive: overviewMetrics.roasChange > 0, negative: overviewMetrics.roasChange < 0 }">
            {{ overviewMetrics.roasChange > 0 ? '+' : '' }}{{ overviewMetrics.roasChange }}%
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-label">用户数</div>
          <div class="metric-value">{{ formatNumber(overviewMetrics.userCount) }}</div>
          <div class="metric-change" :class="{ positive: overviewMetrics.userCountChange > 0, negative: overviewMetrics.userCountChange < 0 }">
            {{ overviewMetrics.userCountChange > 0 ? '+' : '' }}{{ overviewMetrics.userCountChange }}%
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-label">CPC</div>
          <div class="metric-value">{{ formatCurrency(overviewMetrics.avgCpc) }}</div>
          <div class="metric-change" :class="{ positive: overviewMetrics.cpcChange < 0, negative: overviewMetrics.cpcChange > 0 }">
            {{ overviewMetrics.cpcChange > 0 ? '+' : '' }}{{ overviewMetrics.cpcChange }}%
          </div>
        </div>
      </div>
    </div>

    <!-- 2. 版位数据 -->
    <div class="placement-section">
      <div class="section-header">
        <h3>版位数据</h3>
      </div>
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>版位名称</th>
              <th>花费</th>
              <th>销售数量</th>
              <th>收入</th>
              <th>ROAS</th>
              <th>展示次数</th>
              <th>点击次数</th>
              <th>转化率</th>
              <th>CPO</th>
              <th>CPA</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="placement in placementData" :key="placement.id">
              <td>{{ placement.name }}</td>
              <td>{{ formatCurrency(placement.cost) }}</td>
              <td>{{ formatNumber(placement.sales) }}</td>
              <td>{{ formatCurrency(placement.revenue) }}</td>
              <td>{{ placement.roas.toFixed(2) }}</td>
              <td>{{ formatNumber(placement.displays) }}</td>
              <td>{{ formatNumber(placement.clicks) }}</td>
              <td>{{ (placement.cvr * 100).toFixed(2) }}%</td>
              <td>{{ formatCurrency(placement.cpo) }}</td>
              <td>{{ formatCurrency(placement.cpa) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 3. 核心指标对比 -->
    <div class="metrics-comparison-section">
      <div class="section-header">
        <h3>核心指标对比</h3>
        <div class="metrics-selector">
          <div class="selector-group">
            <label>Dimension</label>
            <select v-model="selectedDimension" @change="updateComparisonChart">
              <option value="placement">Placement</option>
              <option value="audience">Audience</option>
              <option value="creative">Creative</option>
            </select>
          </div>
          <div class="selector-group">
            <label>Metric</label>
            <select v-model="selectedMetric" @change="updateComparisonChart">
              <option value="cost">Cost</option>
              <option value="revenue">Revenue</option>
              <option value="roas">ROAS</option>
              <option value="clicks">Clicks</option>
              <option value="cvr">CVR</option>
              <option value="cpc">CPC</option>
            </select>
          </div>
        </div>
      </div>
      <div class="comparison-chart">
        <BarChart
          :data="comparisonChartData"
          :height="'400px'"
          :title="''"
          :showLegend="false"
        />
      </div>
    </div>

    <!-- 4. 受众类型数据表现 -->
    <div class="audience-section">
      <div class="section-header">
        <h3>受众类型数据表现</h3>
      </div>
      <div class="audience-content">
        <div class="audience-table">
          <table class="data-table">
            <thead>
              <tr>
                <th>受众类型</th>
                <th>花费</th>
                <th>花费占比</th>
                <th>转化价值</th>
                <th>转化次数</th>
                <th>转化率</th>
                <th>CTR</th>
                <th>CPC</th>
                <th>CPA</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="audience in audienceData" :key="audience.type">
                <td>{{ audience.name }}</td>
                <td>{{ formatCurrency(audience.cost) }}</td>
                <td>{{ audience.costShare.toFixed(1) }}%</td>
                <td>{{ formatCurrency(audience.conversionValue) }}</td>
                <td>{{ formatNumber(audience.conversions) }}</td>
                <td>{{ (audience.cvr * 100).toFixed(2) }}%</td>
                <td>{{ (audience.ctr * 100).toFixed(2) }}%</td>
                <td>{{ formatCurrency(audience.cpc) }}</td>
                <td>{{ formatCurrency(audience.cpa) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="audience-charts">
        <div class="chart-container">
          <h4>花费占比分布</h4>
          <PieChart
            :data="audienceCostChartData"
            height="320px"
            :donut="true"
            :showLegend="true"
          />
        </div>
        <div class="chart-container">
          <h4>收入占比分布</h4>
          <PieChart
            :data="audienceRevenueChartData"
            height="320px"
            :donut="true"
            :showLegend="true"
          />
        </div>
      </div>
    </div>

    <!-- 5. 素材类型数据表现 -->
    <div class="creative-section">
      <div class="section-header">
        <h3>素材类型数据表现</h3>
      </div>
      <div class="creative-content">
        <div class="creative-table">
          <table class="data-table">
            <thead>
              <tr>
                <th>素材类型</th>
                <th>创意格式</th>
                <th>花费</th>
                <th>花费占比</th>
                <th>转化价值</th>
                <th>转化次数</th>
                <th>转化率</th>
                <th>CTR</th>
                <th>CPC</th>
                <th>CPA</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="creative in creativeData" :key="creative.type">
                <td>{{ creative.name }}</td>
                <td>{{ creative.format }}</td>
                <td>{{ formatCurrency(creative.cost) }}</td>
                <td>{{ creative.costShare.toFixed(1) }}%</td>
                <td>{{ formatCurrency(creative.conversionValue) }}</td>
                <td>{{ formatNumber(creative.conversions) }}</td>
                <td>{{ (creative.cvr * 100).toFixed(2) }}%</td>
                <td>{{ (creative.ctr * 100).toFixed(2) }}%</td>
                <td>{{ formatCurrency(creative.cpc) }}</td>
                <td>{{ formatCurrency(creative.cpa) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="creative-charts">
        <div class="chart-container">
          <h4>花费占比分布</h4>
          <PieChart
            :data="creativeCostChartData"
            height="320px"
            :donut="true"
            :showLegend="true"
          />
        </div>
        <div class="chart-container">
          <h4>收入占比分布</h4>
          <PieChart
            :data="creativeRevenueChartData"
            height="320px"
            :donut="true"
            :showLegend="true"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import PieChart from '@/components/charts/PieChart.vue'
import BarChart from '@/components/charts/BarChart.vue'

// 时间范围选择
const selectedTimeRange = ref('7')
const loading = ref(false)
const selectedMetric = ref('cost')
const selectedDimension = ref('placement')

// 账号选择
const selectedAccount = ref('')
const accounts = ref([
  {
    id: '1',
    name: '主要Criteo账户',
    status: 'active',
    balance: '$15,420',
    statusText: '正常'
  },
  {
    id: '2',
    name: '测试Criteo账户',
    status: 'active',
    balance: '$8,350',
    statusText: '正常'
  },
  {
    id: '3',
    name: '备用Criteo账户',
    status: 'limited',
    balance: '$1,200',
    statusText: '受限'
  }
])

// 数据提醒
const alerts = ref([
  {
    id: '1',
    type: 'performance',
    priority: 'high',
    title: '成效下滑，转化价值或ROAS下降>30%',
    message: '【预警】建议检查素材、落地页或投放设置，必要时调整投放时间段',
    value: 'ROAS下降35%'
  },
  {
    id: '2',
    type: 'cost',
    priority: 'medium',
    title: 'CPC/CPA快速上升',
    message: '【关注成本】出价竞争加剧，建议查看关键词或素材效率',
    value: 'CPC上升42%'
  },
  {
    id: '3',
    type: 'budget',
    priority: 'low',
    title: '成效提升，花费稳定或小幅增长',
    message: '【保持现状】效果良好，可适当增加预算或测试更多素材',
    value: '花费增长8%'
  },
  {
    id: '4',
    type: 'balance',
    priority: 'medium',
    title: '花费骤降（减少超30%）或广告拒登',
    message: '【异常下滑】可能暂停或预算限制，请检查账户投放状态',
    value: '花费下降45%'
  }
])

// 1. 广告账号总览数据
const overviewMetrics = ref({
  totalCost: 25840.60,
  avgDailyCost: 3691.51,
  totalRevenue: 78432.80,
  roas: 3.04,
  userCount: 12580,
  avgCpc: 0.89,
  costChange: 15.2,
  avgDailyCostChange: 12.8,
  revenueChange: 22.4,
  roasChange: 6.1,
  userCountChange: 18.7,
  cpcChange: -4.3
})

// 2. 版位数据
const placementData = ref([
  {
    id: 1,
    name: 'Homepage Banner',
    cost: 8420.30,
    sales: 156,
    revenue: 25650.40,
    roas: 3.05,
    displays: 185000,
    clicks: 4200,
    cvr: 0.037,
    cpo: 53.98,
    cpa: 32.40
  },
  {
    id: 2,
    name: 'Product Page',
    cost: 6890.20,
    sales: 128,
    revenue: 20840.60,
    roas: 3.02,
    displays: 142000,
    clicks: 3450,
    cvr: 0.034,
    cpo: 53.83,
    cpa: 35.20
  },
  {
    id: 3,
    name: 'Category Page',
    cost: 4680.80,
    sales: 89,
    revenue: 14320.40,
    roas: 3.06,
    displays: 98000,
    clicks: 2340,
    cvr: 0.038,
    cpo: 52.59,
    cpa: 30.80
  },
  {
    id: 4,
    name: 'Search Results',
    cost: 3420.60,
    sales: 67,
    revenue: 10580.20,
    roas: 3.09,
    displays: 75000,
    clicks: 1890,
    cvr: 0.035,
    cpo: 51.05,
    cpa: 29.60
  },
  {
    id: 5,
    name: 'Mobile App',
    cost: 2428.70,
    sales: 45,
    revenue: 7041.20,
    roas: 2.90,
    displays: 52000,
    clicks: 1240,
    cvr: 0.036,
    cpo: 53.97,
    cpa: 33.80
  }
])

// 3. 受众类型数据
const audienceData = ref([
  {
    type: 'prospecting',
    name: 'Prospecting（潜在客户定向）',
    cost: 10840.50,
    costShare: 41.9,
    conversionValue: 32450.80,
    conversions: 245,
    cvr: 0.032,
    ctr: 0.025,
    cpc: 0.92,
    cpa: 44.25
  },
  {
    type: 'retargeting',
    name: 'Retargeting（再营销受众）',
    cost: 8920.30,
    costShare: 34.5,
    conversionValue: 28640.60,
    conversions: 198,
    cvr: 0.045,
    ctr: 0.038,
    cpc: 0.78,
    cpa: 45.05
  },
  {
    type: 'broad',
    name: 'Broad targeting（广泛定向）',
    cost: 3480.40,
    costShare: 13.5,
    conversionValue: 9840.20,
    conversions: 89,
    cvr: 0.028,
    ctr: 0.022,
    cpc: 0.95,
    cpa: 39.11
  },
  {
    type: 'lookalike',
    name: 'Lookalike（类似受众）',
    cost: 2180.20,
    costShare: 8.4,
    conversionValue: 6520.40,
    conversions: 56,
    cvr: 0.036,
    ctr: 0.029,
    cpc: 0.88,
    cpa: 38.93
  },
  {
    type: 'interests',
    name: 'Interests&Affinity（兴趣与亲和力）',
    cost: 419.20,
    costShare: 1.6,
    conversionValue: 980.80,
    conversions: 12,
    cvr: 0.024,
    ctr: 0.019,
    cpc: 1.02,
    cpa: 34.93
  }
])

// 4. 素材类型数据
const creativeData = ref([
  {
    type: 'dynamic',
    name: 'Dynamic（动态素材）',
    format: 'Dynamic Product Ads',
    cost: 12840.50,
    costShare: 49.7,
    conversionValue: 38650.40,
    conversions: 298,
    cvr: 0.038,
    ctr: 0.031,
    cpc: 0.82,
    cpa: 43.09
  },
  {
    type: 'showcase',
    name: 'Showcase（展示型素材）',
    format: 'Showcase Ads',
    cost: 6920.30,
    costShare: 26.8,
    conversionValue: 20840.60,
    conversions: 156,
    cvr: 0.035,
    ctr: 0.028,
    cpc: 0.89,
    cpa: 44.36
  },
  {
    type: 'image',
    name: 'Image（图片素材）',
    format: 'Static Image',
    cost: 4180.40,
    costShare: 16.2,
    conversionValue: 12320.80,
    conversions: 89,
    cvr: 0.031,
    ctr: 0.024,
    cpc: 0.95,
    cpa: 46.97
  },
  {
    type: 'video',
    name: 'Video（视频素材）',
    format: 'Video Ads',
    cost: 1899.40,
    costShare: 7.4,
    conversionValue: 5620.00,
    conversions: 42,
    cvr: 0.029,
    ctr: 0.022,
    cpc: 1.08,
    cpa: 45.22
  }
])

// 受众类型饼图数据
const audienceCostChartData = computed(() => {
  return audienceData.value.map((item, index) => ({
    name: item.name,
    value: item.cost,
    color: getChartColor(index)
  }))
})

const audienceRevenueChartData = computed(() => {
  return audienceData.value.map((item, index) => ({
    name: item.name,
    value: item.conversionValue,
    color: getChartColor(index)
  }))
})

// 素材类型饼图数据
const creativeCostChartData = computed(() => {
  return creativeData.value.map((item, index) => ({
    name: item.name,
    value: item.cost,
    color: getChartColor(index)
  }))
})

const creativeRevenueChartData = computed(() => {
  return creativeData.value.map((item, index) => ({
    name: item.name,
    value: item.conversionValue,
    color: getChartColor(index)
  }))
})

// 对比图表数据
const comparisonChartData = computed(() => {
  let sourceData: any[] = []
  let nameKey = ''

  if (selectedDimension.value === 'placement') {
    sourceData = placementData.value
    nameKey = 'name'
  } else if (selectedDimension.value === 'audience') {
    sourceData = audienceData.value
    nameKey = 'name'
  } else if (selectedDimension.value === 'creative') {
    sourceData = creativeData.value
    nameKey = 'name'
  }

  const labels = sourceData.map((item) => item[nameKey])

  // 为每个数据项创建一个单独的dataset，这样每个柱子可以有不同的颜色
  const datasets = sourceData.map((item, index) => {
    const data = new Array(sourceData.length).fill(0)
    data[index] = item[selectedMetric.value] || 0

    return {
      label: item[nameKey],
      data: data,
      color: getChartColor(index)
    }
  })

  return {
    labels,
    datasets
  }
})

// 获取图表颜色
const getChartColor = (index: number) => {
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316']
  return colors[index % colors.length]
}

// 计算属性
const selectedAccountInfo = computed(() => {
  return accounts.value.find(account => account.id === selectedAccount.value)
})

// 格式化货币
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(value)
}

// 格式化数字
const formatNumber = (value: number) => {
  return new Intl.NumberFormat('zh-CN').format(value)
}

// 方法
const handleAccountChange = () => {
  console.log('Selected account:', selectedAccount.value)
  // 这里可以根据选择的账户重新加载数据
}

const getAlertIcon = (type: string) => {
  switch (type) {
    case 'balance':
      return 'fas fa-dollar-sign'
    case 'performance':
      return 'fas fa-chart-line'
    case 'cost':
      return 'fas fa-exclamation-triangle'
    case 'budget':
      return 'fas fa-target'
    default:
      return 'fas fa-exclamation-triangle'
  }
}

const handleAlertAction = (alert: any) => {
  console.log('Alert action:', alert)
  // 这里可以处理提醒操作
}

// 获取指标标签
const getMetricLabel = (metric: string) => {
  const labels: Record<string, string> = {
    cost: '花费',
    revenue: '收入',
    roas: 'ROAS',
    clicks: '点击次数',
    cvr: '转化率',
    cpc: 'CPC'
  }
  return labels[metric] || metric
}

// 更新对比图表
const updateComparisonChart = () => {
  console.log('更新对比图表:', selectedMetric.value, selectedDimension.value)
}

// 刷新数据
const refreshData = async () => {
  loading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('刷新Criteo数据，时间范围:', selectedTimeRange.value)
  } catch (error) {
    console.error('刷新数据失败:', error)
  } finally {
    loading.value = false
  }
}

// 组件挂载时初始化数据
onMounted(() => {
  // 默认选择第一个账户
  if (accounts.value.length > 0) {
    selectedAccount.value = accounts.value[0].id
  }
  refreshData()
})
</script>

<style scoped>
.criteo-dashboard-panel {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 通用样式 */
.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.section-description {
  color: #6b7280;
  margin: 0;
  font-size: 14px;
}

/* 账号选择样式 */
.account-section {
  background: white;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.account-selector {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}

.account-dropdown select {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background: white;
  color: #1f2937;
  font-size: 14px;
  min-width: 250px;
}

.account-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge--active {
  background: #f6ffed;
  color: #52c41a;
  border: 1px solid #b7eb8f;
}

.status-badge--limited {
  background: #fff7e6;
  color: #fa8c16;
  border: 1px solid #ffd591;
}

.account-balance {
  font-weight: 600;
  color: #1f2937;
}

/* 提醒样式 */
.alert-section {
  background: white;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.alert-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.alert-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-radius: 6px;
  border-left: 4px solid;
}

.alert-card--high {
  background: #fff2f0;
  border-left-color: #ff4d4f;
}

.alert-card--medium {
  background: #fff7e6;
  border-left-color: #fa8c16;
}

.alert-card--low {
  background: #f6ffed;
  border-left-color: #52c41a;
}

.alert-icon {
  flex-shrink: 0;
  color: inherit;
}

.alert-content {
  flex: 1;
}

.alert-title {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.alert-message {
  color: #6b7280;
  font-size: 14px;
  margin-bottom: 2px;
}

.alert-value {
  font-weight: 600;
  color: #1f2937;
}

.alert-action {
  padding: 6px 12px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.2s;
}

.alert-action:hover {
  background: #2563eb;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.section-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
}

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.time-selector {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 14px;
  background: white;
}

.refresh-btn {
  padding: 8px 16px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.refresh-btn:hover:not(:disabled) {
  background-color: #2563eb;
}

.refresh-btn:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

/* 1. 广告账号总览样式 */
.overview-section {
  margin-bottom: 40px;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.metric-card {
  background: #f9fafb;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.metric-label {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 8px;
}

.metric-value {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.metric-change {
  font-size: 12px;
  font-weight: 500;
}

.metric-change.positive {
  color: #059669;
}

.metric-change.negative {
  color: #dc2626;
}

/* 2. 版位数据样式 */
.placement-section {
  margin-bottom: 40px;
}

.table-container {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.data-table th,
.data-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.data-table th {
  background-color: #f9fafb;
  font-weight: 600;
  color: #374151;
}

.data-table tr:hover {
  background-color: #f9fafb;
}

/* 3. 核心指标对比样式 */
.metrics-comparison-section {
  margin-bottom: 40px;
}

.metrics-comparison-section .section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.metrics-selector {
  display: flex;
  gap: 20px;
}

.selector-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.selector-group label {
  font-size: 14px;
  color: #374151;
  font-weight: 500;
}

.selector-group select {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 14px;
  background: white;
  min-width: 120px;
}

.comparison-chart {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
}

/* 4. 受众类型样式 */
.audience-section {
  margin-bottom: 40px;
}

.audience-content {
  margin-bottom: 24px;
}

.audience-charts {
  display: flex;
  flex-direction: row;
  gap: 32px;
  justify-content: space-between;
  align-items: stretch;
}

.chart-container {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
  flex: 1;
  min-width: 0;
  min-height: 400px;
  display: flex;
  flex-direction: column;
}

.chart-container h4 {
  margin: 0 0 20px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  text-align: center;
  flex-shrink: 0;
}

/* 5. 素材类型样式 */
.creative-section {
  margin-bottom: 40px;
}

.creative-content {
  margin-bottom: 24px;
}

.creative-charts {
  display: flex;
  flex-direction: row;
  gap: 32px;
  justify-content: space-between;
  align-items: stretch;
}

/* 图表容器内部元素样式 */
.chart-container :deep(.echarts-container) {
  flex: 1;
  min-height: 300px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .audience-charts,
  .creative-charts {
    flex-direction: column;
    gap: 24px;
  }

  .chart-container {
    min-height: 380px;
  }
}

@media (max-width: 768px) {
  .criteo-dashboard-panel {
    padding: 16px;
  }

  .section-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .header-actions {
    width: 100%;
    justify-content: space-between;
  }

  .metrics-grid {
    grid-template-columns: 1fr;
  }

  .metrics-selector {
    flex-direction: column;
    gap: 12px;
  }

  .audience-charts,
  .creative-charts {
    flex-direction: column;
  }
}
</style>
