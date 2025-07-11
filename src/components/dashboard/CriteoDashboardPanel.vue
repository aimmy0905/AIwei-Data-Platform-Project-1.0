<template>
  <div class="criteo-dashboard-panel">
    <div class="panel-header">
      <h3>Criteo 广告数据</h3>
      <div class="header-actions">
        <select v-model="selectedTimeRange" class="time-selector">
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
        <div class="metric-label">总花费</div>
        <div class="metric-value">{{ formatCurrency(metrics.totalCost) }}</div>
        <div class="metric-change" :class="{ positive: metrics.costChange > 0, negative: metrics.costChange < 0 }">
          {{ metrics.costChange > 0 ? '+' : '' }}{{ metrics.costChange }}%
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-label">总收入</div>
        <div class="metric-value">{{ formatCurrency(metrics.totalRevenue) }}</div>
        <div class="metric-change" :class="{ positive: metrics.revenueChange > 0, negative: metrics.revenueChange < 0 }">
          {{ metrics.revenueChange > 0 ? '+' : '' }}{{ metrics.revenueChange }}%
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-label">ROAS</div>
        <div class="metric-value">{{ metrics.roas.toFixed(2) }}</div>
        <div class="metric-change" :class="{ positive: metrics.roasChange > 0, negative: metrics.roasChange < 0 }">
          {{ metrics.roasChange > 0 ? '+' : '' }}{{ metrics.roasChange }}%
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-label">点击率</div>
        <div class="metric-value">{{ (metrics.ctr * 100).toFixed(2) }}%</div>
        <div class="metric-change" :class="{ positive: metrics.ctrChange > 0, negative: metrics.ctrChange < 0 }">
          {{ metrics.ctrChange > 0 ? '+' : '' }}{{ metrics.ctrChange }}%
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-label">转化率</div>
        <div class="metric-value">{{ (metrics.cvr * 100).toFixed(2) }}%</div>
        <div class="metric-change" :class="{ positive: metrics.cvrChange > 0, negative: metrics.cvrChange < 0 }">
          {{ metrics.cvrChange > 0 ? '+' : '' }}{{ metrics.cvrChange }}%
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-label">平均CPC</div>
        <div class="metric-value">{{ formatCurrency(metrics.avgCpc) }}</div>
        <div class="metric-change" :class="{ positive: metrics.cpcChange < 0, negative: metrics.cpcChange > 0 }">
          {{ metrics.cpcChange > 0 ? '+' : '' }}{{ metrics.cpcChange }}%
        </div>
      </div>
    </div>

    <!-- 版位表现数据 -->
    <div class="placement-section">
      <h4>广告版位表现</h4>
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>版位名称</th>
              <th>花费</th>
              <th>收入</th>
              <th>ROAS</th>
              <th>展示次数</th>
              <th>点击次数</th>
              <th>转化率</th>
              <th>CPA</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="placement in placementData" :key="placement.id">
              <td>{{ placement.name }}</td>
              <td>{{ formatCurrency(placement.cost) }}</td>
              <td>{{ formatCurrency(placement.revenue) }}</td>
              <td>{{ placement.roas.toFixed(2) }}</td>
              <td>{{ formatNumber(placement.displays) }}</td>
              <td>{{ formatNumber(placement.clicks) }}</td>
              <td>{{ (placement.cvr * 100).toFixed(2) }}%</td>
              <td>{{ formatCurrency(placement.cpa) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 受众类型表现 -->
    <div class="audience-section">
      <h4>受众类型表现</h4>
      <div class="audience-grid">
        <div
          v-for="audience in audienceData"
          :key="audience.type"
          class="audience-card"
        >
          <div class="audience-header">
            <h5>{{ audience.name }}</h5>
            <span class="audience-share">{{ audience.share }}%</span>
          </div>
          <div class="audience-metrics">
            <div class="audience-metric">
              <span class="label">花费:</span>
              <span class="value">{{ formatCurrency(audience.cost) }}</span>
            </div>
            <div class="audience-metric">
              <span class="label">ROAS:</span>
              <span class="value">{{ audience.roas.toFixed(2) }}</span>
            </div>
            <div class="audience-metric">
              <span class="label">转化率:</span>
              <span class="value">{{ (audience.cvr * 100).toFixed(2) }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 素材类型表现 -->
    <div class="creative-section">
      <h4>素材类型表现</h4>
      <div class="creative-chart">
        <div class="chart-placeholder">
          <p>素材类型表现图表区域</p>
          <p class="chart-note">显示不同素材类型的花费占比和收入占比</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 时间范围选择
const selectedTimeRange = ref('7')
const loading = ref(false)

// 核心指标数据
const metrics = ref({
  totalCost: 15420.50,
  totalRevenue: 48632.80,
  roas: 3.15,
  ctr: 0.024,
  cvr: 0.032,
  avgCpc: 0.85,
  costChange: 12.5,
  revenueChange: 18.3,
  roasChange: 5.2,
  ctrChange: -2.1,
  cvrChange: 8.7,
  cpcChange: -3.4
})

// 版位数据
const placementData = ref([
  {
    id: 1,
    name: 'Homepage Banner',
    cost: 5420.30,
    revenue: 17250.60,
    roas: 3.18,
    displays: 125000,
    clicks: 3200,
    cvr: 0.035,
    cpa: 28.50
  },
  {
    id: 2,
    name: 'Product Page',
    cost: 4680.20,
    revenue: 14820.40,
    roas: 3.17,
    displays: 98000,
    clicks: 2450,
    cvr: 0.028,
    cpa: 32.10
  },
  {
    id: 3,
    name: 'Category Page',
    cost: 3200.80,
    revenue: 9840.60,
    roas: 3.07,
    displays: 75000,
    clicks: 1890,
    cvr: 0.031,
    cpa: 29.80
  },
  {
    id: 4,
    name: 'Search Results',
    cost: 2119.20,
    revenue: 6721.20,
    roas: 3.17,
    displays: 52000,
    clicks: 1340,
    cvr: 0.034,
    cpa: 27.90
  }
])

// 受众类型数据
const audienceData = ref([
  {
    type: 'prospecting',
    name: '潜在客户',
    cost: 6840.50,
    roas: 2.95,
    cvr: 0.028,
    share: 44.3
  },
  {
    type: 'retargeting',
    name: '再营销',
    cost: 4920.30,
    roas: 3.68,
    cvr: 0.042,
    share: 31.9
  },
  {
    type: 'lookalike',
    name: '类似受众',
    cost: 2480.40,
    roas: 3.12,
    cvr: 0.035,
    share: 16.1
  },
  {
    type: 'broad',
    name: '广泛定向',
    cost: 1179.30,
    roas: 2.84,
    cvr: 0.025,
    share: 7.7
  }
])

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

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.panel-header h3 {
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

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
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

.placement-section,
.audience-section,
.creative-section {
  margin-bottom: 32px;
}

.placement-section h4,
.audience-section h4,
.creative-section h4 {
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
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

.audience-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.audience-card {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
}

.audience-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.audience-header h5 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.audience-share {
  font-size: 14px;
  font-weight: 500;
  color: #3b82f6;
}

.audience-metrics {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.audience-metric {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.audience-metric .label {
  font-size: 14px;
  color: #6b7280;
}

.audience-metric .value {
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
}

.creative-chart {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 40px;
  text-align: center;
}

.chart-placeholder p {
  margin: 0;
  color: #6b7280;
  font-size: 16px;
}

.chart-note {
  font-size: 14px !important;
  margin-top: 8px !important;
}

@media (max-width: 768px) {
  .criteo-dashboard-panel {
    padding: 16px;
  }

  .panel-header {
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

  .audience-grid {
    grid-template-columns: 1fr;
  }
}
</style>
