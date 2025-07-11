<template>
  <div class="ad-platform-overview-panel">
    <div class="section-header">
      <h2 class="section-title">广告数据总览</h2>
      <p class="section-description">全平台广告数据汇总和表现分析</p>
    </div>

    <div class="panel-content">
      <!-- 全平台广告数据表格 -->
      <div class="platform-data-section">
        <div class="section-header-with-tabs">
          <h3>全平台广告数据</h3>
          <div class="platform-tabs">
            <button
              v-for="platform in platformTabs"
              :key="platform.key"
              class="platform-tab"
              :class="platform.key"
              @click="navigateToPlatform(platform.key)"
            >
              {{ platform.name }}
            </button>
          </div>
        </div>
        <div class="data-table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>平台</th>
                <th>账户名称</th>
                <th>花费</th>
                <th>花费占比</th>
                <th>ROAS</th>
                <th>购物收入</th>
                <th>购物数</th>
                <th>CPA</th>
                <th>平均购物转化价值</th>
                <th>转化率</th>
                <th>展示次数</th>
                <th>千次展示成本</th>
                <th>点击量</th>
                <th>点击率</th>
                <th>单次点击成本</th>
                <th>观看次数</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="platform in platformData" :key="platform.id">
                <td>
                  <div class="platform-info">
                    <span class="platform-badge" :class="platform.platform.toLowerCase()">
                      {{ platform.platform }}
                    </span>
                  </div>
                </td>
                <td>{{ platform.accountName }}</td>
                <td class="currency">${{ formatNumber(platform.spend) }}</td>
                <td class="percentage">{{ platform.spendRatio }}%</td>
                <td>
                  <span class="roas-value" :class="getROASClass(platform.roas)">
                    {{ platform.roas }}x
                  </span>
                </td>
                <td class="currency">${{ formatNumber(platform.revenue) }}</td>
                <td>{{ formatNumber(platform.purchases) }}</td>
                <td class="currency">${{ platform.cpa }}</td>
                <td class="currency">${{ platform.avgPurchaseValue }}</td>
                <td class="percentage">{{ platform.conversionRate }}%</td>
                <td>{{ formatNumber(platform.impressions) }}</td>
                <td class="currency">${{ platform.cpm }}</td>
                <td>{{ formatNumber(platform.clicks) }}</td>
                <td class="percentage">{{ platform.ctr }}%</td>
                <td class="currency">${{ platform.cpc }}</td>
                <td>{{ formatNumber(platform.views) }}</td>
              </tr>
              <!-- 汇总行 -->
              <tr class="summary-row">
                <td class="summary-label">
                  <strong>汇总</strong>
                </td>
                <td></td>
                <td class="currency"><strong>${{ formatNumber(summaryData.totalSpend) }}</strong></td>
                <td class="percentage"><strong>{{ summaryData.totalSpendRatio }}%</strong></td>
                <td>
                  <span class="roas-value" :class="getROASClass(summaryData.avgRoas)">
                    <strong>{{ summaryData.avgRoas }}x</strong>
                  </span>
                </td>
                <td class="currency"><strong>${{ formatNumber(summaryData.totalRevenue) }}</strong></td>
                <td><strong>{{ formatNumber(summaryData.totalPurchases) }}</strong></td>
                <td class="currency"><strong>${{ summaryData.avgCpa }}</strong></td>
                <td class="currency"><strong>${{ summaryData.avgPurchaseValue }}</strong></td>
                <td class="percentage"><strong>{{ summaryData.avgConversionRate }}%</strong></td>
                <td><strong>{{ formatNumber(summaryData.totalImpressions) }}</strong></td>
                <td class="currency"><strong>${{ summaryData.avgCpm }}</strong></td>
                <td><strong>{{ formatNumber(summaryData.totalClicks) }}</strong></td>
                <td class="percentage"><strong>{{ summaryData.avgCtr }}%</strong></td>
                <td class="currency"><strong>${{ summaryData.avgCpc }}</strong></td>
                <td><strong>{{ formatNumber(summaryData.totalViews) }}</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 数据可视化图表 -->
      <div class="charts-section">
        <div class="chart-container">
          <div class="chart-card">
            <h3>各广告平台花费占比</h3>
            <div class="chart-wrapper">
              <PieChart
                :data="spendChartData"
                height="300px"
                :show-legend="false"
                :donut="false"
              />
            </div>
            <div class="chart-legend">
              <div
                v-for="item in spendChartData"
                :key="item.name"
                class="legend-item"
              >
                <div class="legend-color" :style="{ backgroundColor: item.color }"></div>
                <span class="legend-label">{{ item.name }}</span>
                <span class="legend-value">${{ formatNumber(item.value) }}</span>
                <span class="legend-percentage">{{ item.percentage }}%</span>
              </div>
            </div>
          </div>

          <div class="chart-card">
            <h3>各广告平台点击率占比</h3>
            <div class="chart-wrapper">
              <PieChart
                :data="ctrPieChartData"
                height="300px"
                :show-legend="false"
                :donut="false"
              />
            </div>
            <div class="chart-legend">
              <div
                v-for="item in ctrPieChartData"
                :key="item.name"
                class="legend-item"
              >
                <div class="legend-color" :style="{ backgroundColor: item.color }"></div>
                <span class="legend-label">{{ item.name }}</span>
                <span class="legend-value">{{ item.value }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import PieChart from '@/components/charts/PieChart.vue'

// 定义数据类型
interface PlatformData {
  id: string
  platform: string
  accountName: string
  spend: number
  spendRatio: number
  roas: number
  revenue: number
  purchases: number
  cpa: number
  avgPurchaseValue: number
  conversionRate: number
  impressions: number
  cpm: number
  clicks: number
  ctr: number
  cpc: number
  views: number
}

interface ChartData {
  name: string
  value: number
  color: string
  percentage?: number
}

// 路由实例
const router = useRouter()

// 响应式数据
const platformTabs = ref([
  { key: 'google', name: 'Google' },
  { key: 'meta', name: 'Meta' },
  { key: 'bing', name: 'Bing' },
  { key: 'criteo', name: 'Criteo' }
])

const platformData = ref<PlatformData[]>([
  {
    id: '1',
    platform: 'Google',
    accountName: 'Google Ads Account 1',
    spend: 45000,
    spendRatio: 36,
    roas: 4.2,
    revenue: 189000,
    purchases: 1890,
    cpa: 23.8,
    avgPurchaseValue: 100,
    conversionRate: 3.2,
    impressions: 2100000,
    cpm: 21.4,
    clicks: 45000,
    ctr: 2.1,
    cpc: 1.0,
    views: 1800000
  },
  {
    id: '2',
    platform: 'Meta',
    accountName: 'Meta Ads Account 1',
    spend: 38000,
    spendRatio: 30,
    roas: 3.8,
    revenue: 144400,
    purchases: 1444,
    cpa: 26.3,
    avgPurchaseValue: 100,
    conversionRate: 2.8,
    impressions: 1900000,
    cpm: 20.0,
    clicks: 38000,
    ctr: 2.0,
    cpc: 1.0,
    views: 1520000
  },
  {
    id: '3',
    platform: 'Bing',
    accountName: 'Bing Ads Account 1',
    spend: 25000,
    spendRatio: 20,
    roas: 3.5,
    revenue: 87500,
    purchases: 875,
    cpa: 28.6,
    avgPurchaseValue: 100,
    conversionRate: 2.5,
    impressions: 1250000,
    cpm: 20.0,
    clicks: 25000,
    ctr: 2.0,
    cpc: 1.0,
    views: 1000000
  },
  {
    id: '4',
    platform: 'Criteo',
    accountName: 'Criteo Account 1',
    spend: 17000,
    spendRatio: 14,
    roas: 3.2,
    revenue: 54400,
    purchases: 544,
    cpa: 31.3,
    avgPurchaseValue: 100,
    conversionRate: 2.2,
    impressions: 850000,
    cpm: 20.0,
    clicks: 17000,
    ctr: 2.0,
    cpc: 1.0,
    views: 680000
  }
])

// 计算属性
const spendChartData = computed(() => {
  const colors = ['#4285f4', '#1877f2', '#00809d', '#ff6900']
  return platformData.value.map((platform, index) => ({
    name: platform.platform,
    value: platform.spend,
    color: colors[index],
    percentage: platform.spendRatio
  }))
})

const ctrChartData = computed(() => {
  const colors = ['#4285f4', '#1877f2', '#00809d', '#ff6900']
  return {
    labels: platformData.value.map(platform => platform.platform),
    datasets: [{
      label: '点击率',
      data: platformData.value.map(platform => platform.ctr),
      color: colors[0]
    }]
  }
})

const ctrPieChartData = computed(() => {
  const colors = ['#4285f4', '#1877f2', '#00809d', '#ff6900']
  return platformData.value.map((platform, index) => ({
    name: platform.platform,
    value: platform.ctr,
    color: colors[index]
  }))
})

// 汇总数据计算属性
const summaryData = computed(() => {
  const data = platformData.value
  const totalSpend = data.reduce((sum, platform) => sum + platform.spend, 0)
  const totalRevenue = data.reduce((sum, platform) => sum + platform.revenue, 0)
  const totalPurchases = data.reduce((sum, platform) => sum + platform.purchases, 0)
  const totalImpressions = data.reduce((sum, platform) => sum + platform.impressions, 0)
  const totalClicks = data.reduce((sum, platform) => sum + platform.clicks, 0)
  const totalViews = data.reduce((sum, platform) => sum + platform.views, 0)

  const avgRoas = totalSpend > 0 ? Number((totalRevenue / totalSpend).toFixed(1)) : 0
  const avgCpa = totalPurchases > 0 ? Number((totalSpend / totalPurchases).toFixed(1)) : 0
  const avgPurchaseValue = totalPurchases > 0 ? Number((totalRevenue / totalPurchases).toFixed(0)) : 0
  const avgConversionRate = totalClicks > 0 ? Number(((totalPurchases / totalClicks) * 100).toFixed(1)) : 0
  const avgCpm = totalImpressions > 0 ? Number(((totalSpend / totalImpressions) * 1000).toFixed(1)) : 0
  const avgCtr = totalImpressions > 0 ? Number(((totalClicks / totalImpressions) * 100).toFixed(1)) : 0
  const avgCpc = totalClicks > 0 ? Number((totalSpend / totalClicks).toFixed(1)) : 0

  return {
    totalSpend,
    totalSpendRatio: 100, // 汇总行显示100%
    avgRoas,
    totalRevenue,
    totalPurchases,
    avgCpa,
    avgPurchaseValue,
    avgConversionRate,
    totalImpressions,
    avgCpm,
    totalClicks,
    avgCtr,
    avgCpc,
    totalViews
  }
})

// 工具函数
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(0) + 'K'
  }
  return num.toString()
}

const getROASClass = (roas: number): string => {
  if (roas >= 4) return 'excellent'
  if (roas >= 3) return 'good'
  if (roas >= 2) return 'average'
  return 'poor'
}

const navigateToPlatform = (platform: string): void => {
  // 根据平台跳转到对应的详情页
  const routeMap: { [key: string]: string } = {
    'google': 'google-dashboard',
    'meta': 'meta-dashboard',
    'bing': 'bing-dashboard',
    'criteo': 'criteo-dashboard'
  }

  const routeName = routeMap[platform]
  if (routeName) {
    console.log(`导航到 ${platform} 详情页: ${routeName}`)
    router.push({ name: routeName })
  }
}

onMounted(() => {
  console.log('广告数据总览面板已加载')
})
</script>

<style scoped>
.ad-platform-overview-panel {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
  height: auto !important;
  min-height: 200px;
}

.section-header {
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
}

.section-title {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.section-description {
  color: #6b7280;
  margin: 0;
}

.panel-content {
  padding: 24px;
}

.platform-data-section {
  margin-bottom: 32px;
}

.section-header-with-tabs {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.platform-data-section h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.platform-tabs {
  display: flex;
  gap: 8px;
}

.platform-tab {
  padding: 8px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: white;
  color: #374151;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.platform-tab:hover {
  background: #f3f4f6;
  border-color: #d1d5db;
  transform: translateY(-1px);
}

.platform-tab.google {
  border-color: #4285f4;
  color: #4285f4;
}

.platform-tab.google:hover {
  background: #eff6ff;
  border-color: #3b82f6;
}

.platform-tab.meta {
  border-color: #1877f2;
  color: #1877f2;
}

.platform-tab.meta:hover {
  background: #eff6ff;
  border-color: #1d4ed8;
}

.platform-tab.bing {
  border-color: #00809d;
  color: #00809d;
}

.platform-tab.bing:hover {
  background: #ecfdf5;
  border-color: #059669;
}

.platform-tab.criteo {
  border-color: #ff6900;
  color: #ff6900;
}

.platform-tab.criteo:hover {
  background: #fef3c7;
  border-color: #f59e0b;
}

.data-table-container {
  overflow-x: auto;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  color: #374151;
}

.data-table th {
  background-color: #f8fafc;
  color: #6b7280;
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
  font-weight: 600;
}

.data-table td {
  padding: 12px 16px;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
}

.data-table tr:hover {
  background-color: #f8fafc;
}

.data-table tr:last-child td {
  border-bottom: none;
}

.summary-row {
  background-color: #f8fafc !important;
  border-top: 2px solid #e2e8f0;
}

.summary-row:hover {
  background-color: #f1f5f9 !important;
}

.summary-row td {
  font-weight: 600;
  color: #1f2937;
  border-bottom: none;
}

.summary-label {
  color: #374151;
  font-size: 14px;
}

.platform-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.currency {
  font-weight: 500;
  color: #1f2937;
}

.percentage {
  font-weight: 500;
  color: #059669;
}

.roas-value {
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 500;
  font-size: 13px;
}

.roas-value.excellent {
  background: #dcfce7;
  color: #059669;
}

.roas-value.good {
  background: #fef3c7;
  color: #d97706;
}

.roas-value.average {
  background: #dbeafe;
  color: #2563eb;
}

.roas-value.poor {
  background: #fee2e2;
  color: #dc2626;
}

.charts-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
  margin-top: 32px;
}

.chart-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.chart-card {
  background: #f8fafc;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #f1f5f9;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.chart-card:hover {
  background: #f1f5f9;
  border-color: #e2e8f0;
  transform: translateY(-1px);
}

.chart-card h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 16px 0;
}

.chart-wrapper {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}

.chart-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid #e5e7eb;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #6b7280;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.legend-label {
  font-weight: 500;
  color: #1f2937;
}

.legend-value {
  font-weight: 600;
  color: #1f2937;
}

.legend-percentage {
  font-size: 11px;
  color: #6b7280;
}

.chart-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid #e5e7eb;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #6b7280;
}

.stat-platform {
  display: flex;
  align-items: center;
  gap: 4px;
}

.platform-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  color: white;
}

.platform-badge.google { background: #4285f4; }
.platform-badge.meta { background: #1877f2; }
.platform-badge.facebook { background: #1877f2; }
.platform-badge.bing { background: #00809d; }
.platform-badge.criteo { background: #ff6900; }

.stat-value {
  font-weight: 500;
  color: #1f2937;
}

@media (max-width: 1024px) {
  .charts-section {
    grid-template-columns: 1fr;
  }

  .chart-container {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .panel-content {
    padding: 16px;
  }

  .section-header-with-tabs {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .platform-tabs {
    flex-wrap: wrap;
    gap: 6px;
  }

  .platform-tab {
    padding: 6px 12px;
    font-size: 12px;
  }

  .data-table {
    font-size: 12px;
  }

  .data-table th, .data-table td {
    padding: 8px 12px;
  }

  .chart-legend, .chart-stats {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>
